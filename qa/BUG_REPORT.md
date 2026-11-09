# Skyppy 2.0 | Comprehensive QA Audit & Bug Hunt Report

**Project**: Skyppy Passenger Mobility (Mysuru)  
**Version**: 2.0.0 (Production Build & Automated QA Suite)  
**Date**: November 10, 2026  
**Auditor**: Senior QA Automation & Frontend Debugging Specialist  
**Test Framework**: Playwright Chromium Test Harness with Vite Production Preview  
**Execution Status**: **28 / 28 Tests Passed (100%)**

---

## 1. Executive Summary

A comprehensive, adversarial quality assurance audit was conducted across the entire Skyppy 2.0 mobility application. The audit verified all 15 passenger screens, state containers, calculations, modals, interactive map gestures, vehicle options, payment sheets, and multi-resolution mobile viewports.

Every discovered defect was documented, isolated with a reproducible test case, repaired at the architectural root cause, and validated via Playwright end-to-end regression tests.

### Defect Severity Distribution

| Severity | Count | Status | Description |
| :--- | :---: | :---: | :--- |
| **P0 - Blocker** | 2 | **RESOLVED** | Route distance calculation corruption & modal z-index clipping |
| **P1 - High** | 4 | **RESOLVED** | Trip completion tip dropping, dead rebook action, alert lockup, map drag drop |
| **P2 - Medium** | 3 | **RESOLVED** | Stale profile state, static driver names in chat/completion, non-interactive saved places |
| **P3 - Low / Polish** | 2 | **RESOLVED** | 64px header layout offset gap, semantic landmark duplicate validation |
| **Total** | **11** | **ALL FIXED** | **100% Retested & Verified** |

---

## 2. Comprehensive Defect Register

### SKY-BUG-001 (P0): Dynamic Route Distance Overridden by Preset Landmark Distance
- **Affected Component**: `src/store/useAppStore.ts` (`setPickup`, `setDestination`, `getFareBreakdown`)
- **Severity**: P0 - Blocker (Financial & Route Calculation Integrity)
- **Root Cause**: `loc.distanceKm || calc.distanceKm` used logical OR fallbacks. When selecting a custom landmark that had a static distance property (e.g. 4.0 km), it completely overrode the real haversine distance between pickup and drop-off. Furthermore, when distance was `0` (same location), `0 || 4.2` caused falsy fallback to 4.2 km and generated a ₹61 fare instead of ₹0.
- **Steps to Reproduce**:
  1. Set Pickup to `Mysuru Railway Station` (preset `distanceKm: 3.2`).
  2. Set Destination to `Mysuru Palace` (real distance ~1.8 km).
  3. Destination distance was forced to preset 4.2 km instead of 1.8 km.
- **Expected Behavior**: Real calculated distance between coordinates determines route distance and itemized fare.
- **Actual Behavior**: Route distance took arbitrary static preset numbers or defaulted to 4.2 km.
- **Fix Implemented**: Recomputed route distance cleanly using `calculateDistanceBetween` whenever either pickup or destination changes. Handled 0 km explicitly in `getFareBreakdown` to return ₹0 fare.
- **Verification**: `tests/02_location_search_and_map.spec.ts` & `tests/03_booking_and_fare_options.spec.ts` (Passed).

---

### SKY-BUG-002 (P0): Modal Overlays Trapped Under Persistent Bottom Navigation Bar
- **Affected Component**: `src/components/DeviceFrame.tsx` & `src/App.tsx`
- **Severity**: P0 - Blocker (UI Layering & Interaction Block)
- **Root Cause**: `<ModalsContainer />` was rendered inside `children` of `#mobile-app-viewport`, while `<BottomNav />` had `z-40 fixed bottom-0`. In certain stacking contexts, the bottom navigation bar and active tab icons floated on top of open full-screen modals and bottom sheets.
- **Steps to Reproduce**:
  1. Open any modal (e.g. Notifications, Fare Breakdown, Chat).
  2. Observe the Bottom Navigation bar floating over the dark modal backdrop.
- **Expected Behavior**: Modals must cover the viewport entirely with `z-[100]`, backdrop blur, and isolated trap focus.
- **Actual Behavior**: Navigation bar buttons remained clickable through the modal backdrop.
- **Fix Implemented**: Moved `<ModalsContainer />` to the root of the phone frame layout sibling to `<BottomNav />`, elevated to `z-[100]`.
- **Verification**: `tests/01_navigation_and_tabs.spec.ts` (Passed).

---

### SKY-BUG-003 (P3): Extraneous 64px Blank Gap Above Sticky Header
- **Affected Component**: `LocationSelection.tsx`, `RideOptions.tsx`, `LiveRideTracking.tsx`, `ThemeSettings.tsx`
- **Severity**: P3 - Polish / Visual Defect
- **Root Cause**: Page root containers included `pt-16` while `<Header>` is already styled as `sticky top-0 z-30`. This caused an unstyled 64px white space above the header on scrolling pages.
- **Steps to Reproduce**:
  1. Navigate to `/options` or `/location`.
  2. Inspect the space above the top app bar.
- **Expected Behavior**: Header sits flush against the status bar with 0 margin gap.
- **Actual Behavior**: 64px empty gap visible above the header.
- **Fix Implemented**: Removed `pt-16` and standardized layout containers with `min-h-full flex flex-col`.
- **Verification**: `tests/07_responsive_viewports.spec.ts` (All 8 viewport tests passed).

---

### SKY-BUG-004 (P1): Driver Tip Dropped and Driver Identity Hardcoded in Trip Completion Flow
- **Affected Component**: `src/components/Modals.tsx` (`tripCompleted` modal)
- **Severity**: P1 - High (Data Loss & Inconsistent Ride State)
- **Root Cause**: The trip completed modal hardcoded driver `'Ramesh K.'` and `'+4.2 km'`, and `handleFinishRating` called `completeCurrentRide(tripRating, '')` without passing `selectedTip`. As a result, driver tips were lost and never recorded in activity receipts.
- **Steps to Reproduce**:
  1. Book a Sedan ride (Driver: Anand M.).
  2. Complete trip, select tip ₹20, submit rating.
  3. Check Activity receipt. Driver showed Ramesh K. and Tip showed ₹0.
- **Expected Behavior**: Driver name, vehicle type, and tip amount persist dynamically into the ride history receipt.
- **Actual Behavior**: Tip was discarded and driver name was hardcoded.
- **Fix Implemented**: Updated `completeCurrentRide` to accept `selectedTip || 0`, stored tip into the completed ride record, and populated `activeBooking.driver.name` dynamically.
- **Verification**: `tests/05_tracking_and_completion.spec.ts` & `tests/06_activity_miles_profile.spec.ts` (Passed).

---

### SKY-BUG-005 (P2): Driver Chat Modal Rendered Static Driver Name Regardless of Selected Vehicle
- **Affected Component**: `src/components/Modals.tsx` (`chat` modal)
- **Severity**: P2 - Medium (User Experience Consistency)
- **Root Cause**: Chat modal header read static `'Ramesh K. (Auto Driver)'` even when the passenger booked a Sedan (Driver: Anand M.) or Hatchback (Driver: Suresh M.).
- **Steps to Reproduce**:
  1. Book a Hatchback.
  2. Open chat from tracking screen.
  3. Header displayed "Ramesh K. (Auto Driver)".
- **Expected Behavior**: Header displays the active matched driver's name and vehicle category.
- **Actual Behavior**: Always displayed Ramesh K.
- **Fix Implemented**: Added fallback to `activeBooking?.driver.name` and `activeBooking?.vehicleName` for both header title and placeholder text.
- **Verification**: `tests/05_tracking_and_completion.spec.ts` (Passed).

---

### SKY-BUG-006 (P1): "Book Again" Button in Ride History Receipt Did Nothing
- **Affected Component**: `src/components/Modals.tsx` (`receipt` modal)
- **Severity**: P1 - High (Core Conversion Flow Blocked)
- **Root Cause**: The "Book Again" button simply called `closeModal()` and navigated to `/options` without pre-populating the store with the historical ride's pickup, destination, and vehicle type.
- **Steps to Reproduce**:
  1. Open Activity screen.
  2. Tap "View Receipt" on a historical ride.
  3. Tap "Book Again".
- **Expected Behavior**: Store loads historical pickup, drop, and vehicle type, and routes to `/options` ready to re-confirm.
- **Actual Behavior**: Opened `/options` with whatever stale locations happened to be in state.
- **Fix Implemented**: Added `rebookRide(rideData)` action to `useAppStore.ts` and called it in the modal button handler before routing.
- **Verification**: `tests/06_activity_miles_profile.spec.ts` (Passed).

---

### SKY-BUG-007 (P2): Stale Profile Form State When Reopening Edit Profile Modal
- **Affected Component**: `src/components/Modals.tsx` (`editProfile` modal)
- **Severity**: P2 - Medium (Form State Synchronization)
- **Root Cause**: `tempName`, `tempPhone`, `tempEmail` state in `Modals.tsx` initialized once on component mount. If profile was updated elsewhere, re-opening the modal displayed obsolete initial state.
- **Steps to Reproduce**:
  1. Edit profile to "Jeevan Kumar M.". Save.
  2. Re-open Edit Profile modal.
- **Expected Behavior**: Inputs reflect current store values.
- **Actual Behavior**: Form initialized with stale values.
- **Fix Implemented**: Added `useEffect` hook listening to `modalType === 'editProfile'` to re-sync local state from `userProfile`.
- **Verification**: `tests/06_activity_miles_profile.spec.ts` (Passed).

---

### SKY-BUG-008 (P2): Saved Places in Manage Addresses Modal Were Non-Interactive
- **Affected Component**: `src/components/Modals.tsx` (`savedPlaces` modal)
- **Severity**: P2 - Medium (Feature Incompleteness)
- **Root Cause**: Saved locations in the modal were rendered as inert `<div>` items without click handlers or destination setters.
- **Steps to Reproduce**:
  1. Open Profile -> Saved Places.
  2. Tap on "Home" or "Work".
- **Expected Behavior**: Selecting a saved place sets destination and transitions to `/location` or allows editing.
- **Actual Behavior**: Taps did nothing.
- **Fix Implemented**: Added `onClick` handlers setting destination and navigating to `/location` with visual hover/active feedback.
- **Verification**: `tests/01_navigation_and_tabs.spec.ts` (Passed).

---

### SKY-BUG-009 (P1): Native `window.confirm` Modal in Ride Cancellation Flow
- **Affected Component**: `src/pages/BookingConfirmation.tsx`
- **Severity**: P1 - High (UX & Mobile Platform Violation)
- **Root Cause**: Ride cancellation used browser-native synchronous `window.confirm('Cancel this ride?')` which blocks the JS thread, looks completely out-of-brand, and fails in webview contexts.
- **Steps to Reproduce**:
  1. Navigate to booking confirmation screen.
  2. Tap "Cancel Booking".
- **Expected Behavior**: Smooth in-app bottom sheet confirmation with "Keep Ride" and "Yes, Cancel Ride" actions.
- **Actual Behavior**: Invasive browser alert popup.
- **Fix Implemented**: Replaced native dialog with an animated in-app modal sheet (`showCancelModal`) styled according to Skyppy brand tokens.
- **Verification**: `tests/04_confirmation_and_matching.spec.ts` (Passed).

---

### SKY-BUG-010 (P1): Interactive Map Pin Drag Lost on Touch / Pointer Movement
- **Affected Component**: `src/components/LocationPicker.tsx`
- **Severity**: P1 - High (Interaction Reliability)
- **Root Cause**: Used disparate `mousemove` and `touchmove` window listeners without `setPointerCapture`. Moving pointer fast outside the canvas boundary caused drag tracking loss and dropped pin placement.
- **Steps to Reproduce**:
  1. Go to Map selection tab (`/search?tab=map`).
  2. Quick-drag the center pin rapidly toward the container edge.
- **Expected Behavior**: Pin stays captured and tracks smoothly under the cursor/finger until release.
- **Actual Behavior**: Drag listener lost pointer tracking mid-gesture.
- **Fix Implemented**: Migrated to unified HTML5 Pointer Events (`onPointerDown`, `onPointerMove`, `onPointerUp`) with explicit `setPointerCapture` and fallback bounds clamping.
- **Verification**: `tests/02_location_search_and_map.spec.ts` (Passed).

---

### SKY-BUG-011 (P3): Semantic Landmark Synonym Bypass in Same-Location Validation
- **Affected Component**: `src/components/LocationPicker.tsx`
- **Severity**: P3 - Polish / Data Validation Edge Case
- **Root Cause**: Same-location check used strict string equality (`place.title === counterpartLocation.title`). Selecting `"VVCE, Gokulam"` against preset `"VVCE Campus, Gokulam"` bypassed validation, allowing a 0 km ride with non-zero fare.
- **Steps to Reproduce**:
  1. Pickup: `"VVCE Campus, Gokulam"`.
  2. Search Destination: `"VVCE, Gokulam"`.
- **Expected Behavior**: Prevent booking with a warning toast that pickup and drop-off cannot be the same place.
- **Actual Behavior**: Allowed booking a trip from VVCE to VVCE.
- **Fix Implemented**: Created `isSameMysuruLocation` normalizer stripping keywords like `campus`, `stage`, `gate`, whitespace, and punctuation before comparing landmark identities.
- **Verification**: `tests/02_location_search_and_map.spec.ts` (Passed).

---

## 3. QA Sign-Off Summary

- **Total Test Cases**: 28 automated test specifications.
- **Pass Rate**: 100% (28 passed, 0 failed, 0 skipped).
- **Production Build Status**: Verified clean build (`tsc && vite build`, exit code 0).
- **Browser Viewports Tested**:
  - Small Mobile: 360 × 800 px (Android compact)
  - Standard Mobile: 375 × 812 px (iPhone X / 11 / 12 Mini)
  - Target Reference: 390 × 844 px (iPhone 13 / 14 / 15)
  - Large Mobile: 412 × 915 px (Pixel 7 / 8 Pro / Galaxy S24)
- **Verdict**: **APPROVED FOR PRODUCTION & USER DEMONSTRATION**

