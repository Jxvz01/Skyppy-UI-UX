# Skyppy 2.0 | Categorized UI/UX Issues & Inconsistencies

> **Document**: Comprehensive Heuristic & Architectural Defect Catalog  
> **Audited Version**: Skyppy 2.0.0 (`skyppy-app-ui`)  
> **Evaluation Framework**: Nielsen-Norman Heuristics, Apple Human Interface Guidelines, Material Design 3  
> **Rule Compliance**: Strictly documentation only — zero code modifications or fixes applied.

---

## Issue Severity Summary

| Severity Level | Count | Definition |
|---|---|---|
| **High** | 4 | Severe visual disconnection, layout breaking on edge devices, or user confusion |
| **Medium** | 6 | Inconsistent design patterns, token bypasses, or spatial disharmony |
| **Low** | 5 | Minor naming discrepancies, subtle copy errors, or polish refinements |

---

## 1. Branding & Copy Inconsistencies

### ISSUE-01: Brand Name Spelling Inconsistency (`SKAPPY` vs `Skyppy`)
- **Severity**: High
- **Category**: Brand Cohesion & Identity
- **Affected Files**:
  - `src/pages/RidesHome.tsx` (Lines 282, 291)
  - `src/pages/CourierHome.tsx` (Line 42)
  - `src/utils/i18n.ts` (Kannada translation keys)
- **Observed Behavior**:
  - In `RidesHome.tsx`, the code comment and bento header reads `SKAPPY MILES`.
  - In `CourierHome.tsx`, the primary hero title reads `SKAPPY MOVE`.
  - Throughout the rest of the application, the official brand is spelled `Skyppy` (`Skyppy URBAN MOBILITY`).
- **User Impact**: Inadvertently gives users and external evaluators the impression of an uncurated typo or competing branding.

---

### ISSUE-02: Metric vs Imperial Unit Confusion in Loyalty System
- **Severity**: Medium
- **Category**: Information Architecture & Nomenclature
- **Affected Files**:
  - `src/pages/SkyppyMiles.tsx` (Lines 60-105)
  - `src/pages/RidesHome.tsx` (Lines 285-325)
  - `src/components/miles/MilesOrbit.tsx` (Lines 365-375)
- **Observed Behavior**:
  - The feature is named `Skyppy Miles` (using the imperial unit "Miles").
  - The central core displays `248.6 KM` (using the metric system "Kilometers").
  - The subtext in the bento card displays `68 miles to Gold`.
  - The ladder displays `50 km First Explorer` and `100 km · 15% Off`.
- **User Impact**: Ambiguity regarding whether 1 Skyppy point equals 1 kilometer or 1 statute mile ($1.609\text{ km}$). A clear 1:1 equivalency statement or unified unit label is missing.

---

## 2. Design Token & Visual Styling Fragmentation

### ISSUE-03: Dual Design Token Paradigm (Tailwind Slate vs Material 3)
- **Severity**: Medium
- **Category**: Design System Maintenance
- **Affected Files**:
  - `tailwind.config.js`
  - `src/pages/RideOptions.tsx`
  - `src/pages/BookingConfirmation.tsx`
  - `src/pages/driver/DriverHome.tsx`
- **Observed Behavior**:
  - The application configuration defines a complete Material Design 3 token suite (`surface-container-low`, `surface-container-high`, `on-surface-variant`, `primary-container`).
  - However, across several major screens, components bypass these tokens and hardcode raw Tailwind classes (`bg-slate-900`, `text-slate-400`, `border-slate-800/80`, `bg-[#0c1829]`).
- **User Impact**: Subtle variations in color temperatures between pages that use slate (`#0f172a`, `#1e293b`) versus those that use M3 blue-gray surfaces (`#101c2b`, `#e6eeff`).

---

### ISSUE-04: Button Corner Radius Inconsistency
- **Severity**: Medium
- **Category**: Visual Uniformity
- **Affected Files**:
  - `src/pages/CourierHome.tsx` (`rounded-2xl`)
  - `src/pages/RideOptions.tsx` (`rounded-2xl` on vehicle cards, `rounded-xl` on bottom action)
  - `src/pages/CreateShipment.tsx` (`rounded-xl` vs `rounded-full`)
  - `src/components/OpenStreetMap.tsx` (`rounded-full`)
- **Observed Behavior**:
  - Primary call-to-action buttons alternate between `rounded-full` (capsule pill), `rounded-2xl` (16px), and `rounded-xl` (12px) across adjacent steps in a single user flow.
- **User Impact**: Reduces the feeling of a cohesive, systematically engineered product.

---

## 3. Spatial & Curvature Inconsistencies

### ISSUE-05: Card Border Radii Multiplicity within Single Viewport
- **Severity**: Low
- **Category**: Spatial Hierarchy
- **Affected Files**:
  - `src/pages/RidesHome.tsx`
  - `src/pages/SkyppyMiles.tsx`
- **Observed Behavior**:
  - On the Home screen, the photographic hero uses `rounded-3xl` (24px), the Plan Your Journey card uses `rounded-2xl` (16px), quick action tiles use `rounded-2xl` (16px), and the Skyppy Miles bento card uses `rounded-3xl` (24px).
  - While major heroes benefit from larger radii, the juxtaposition of 16px and 24px cards stacked vertically produces an uneven visual rhythm.

---

## 4. Hierarchy, Clutter & Layout Density Issues

### ISSUE-06: Header Horizontal Cramping on Narrow Viewports (≤ 360px)
- **Severity**: High
- **Category**: Responsive Layout & Internationalization
- **Affected Files**:
  - `src/components/Header.tsx` (Lines 15-70)
- **Observed Behavior**:
  - On viewports with widths of 360px or less (e.g., Samsung Galaxy S-series or iPhone SE), the `Header type="home"` contains 5 interactive elements simultaneously:
    1. Logo Lockup (`Skyppy URBAN MOBILITY`)
    2. City Selector Pill (`location_on Mysuru keyboard_arrow_down`)
    3. Language Toggle Button (`translate ಕನ್ನಡ`)
    4. Notifications Bell with orange dot
    5. User Profile Circular Avatar
  - Because each element has fixed paddings and labels, they consume over 355px of horizontal space, causing touch targets to crowd within 4px of each other and risking text clipping in languages with longer strings.
- **User Impact**: Increased mis-taps between the language toggle and notification bell on compact devices.

---

### ISSUE-07: Excessive Competing Actions on Home Screen
- **Severity**: Medium
- **Category**: Cognitive Load & Focus
- **Affected Files**:
  - `src/pages/RidesHome.tsx`
- **Observed Behavior**:
  - The Home screen presents four different ways to initiate an action within the first two scrolls:
    1. The Service Switcher ("Book a Ride" vs "Send a Parcel").
    2. The "Plan Your Journey" pickup/destination fields.
    3. The "Skyppy Move" promotional banner.
    4. The 4-column Quick Actions grid ("Ride Now", "Send Parcel", "Schedule", "Track").
- **User Impact**: Users are offered three different pathways to reach parcel delivery on a single screen ("Send a Parcel" tab, "Skyppy Move" banner, and "Send Parcel" quick action tile), creating decision redundancy.

---

## 5. Navigation & Structural UX Disconnects

### ISSUE-08: Desktop DeviceFrame Bypass in Driver View
- **Severity**: High
- **Category**: Desktop Responsive Consistency
- **Affected Files**:
  - `src/App.tsx` (Lines 37-46)
  - `src/components/driver/DriverAppShell.tsx`
- **Observed Behavior**:
  - On desktop viewports (width ≥ 768px), passenger routes (`/`, `/courier`, `/miles`, `/activity`, `/profile`) are centered inside an Apple iPhone 15 Pro phone enclosure (`DeviceFrame`).
  - However, `/driver-view` is conditionally excluded from `DeviceFrame` in `App.tsx`:
    ```tsx
    if (isDriverRoute) {
      return (
        <Routes>
          <Route path="/driver-view" element={<DriverView />} />
        </Routes>
      );
    }
    ```
  - As a result, when an external evaluator navigates to `/driver-view` on a desktop monitor, the driver app unexpectedly stretches across 100% of the widescreen display instead of rendering inside a mobile frame.
- **User Impact**: Disorienting transition when clicking "Driver Portal" or typing the URL on desktop.

---

### ISSUE-09: Redundant Service Switcher on Secondary Pages
- **Severity**: Low
- **Category**: Navigation Consistency
- **Affected Files**:
  - `src/pages/CourierHome.tsx`
- **Observed Behavior**:
  - The segmented service toggle ("Book a Ride" vs "Send a Parcel") is embedded both inside the main passenger home page and inside `CourierHome.tsx`. Once inside the Courier flow, having the switcher at the very top can cause accidental switching back to Rides when users attempt to tap the city selector.

---

## 6. Map Experience Limitations & Viewport Occlusion

### ISSUE-10: Bottom Sheet Occlusion of Live Corridor Pins
- **Severity**: Medium
- **Category**: Map Usability
- **Affected Files**:
  - `src/pages/BookingConfirmation.tsx`
  - `src/pages/LocationSelection.tsx`
- **Observed Behavior**:
  - In `BookingConfirmation.tsx` and `LocationSelection.tsx`, the bottom sheet covers up to 55-65% of the mobile viewport height.
  - While `OpenStreetMap.tsx` now supports `bottomSheetPadding`, if a user expands the bottom list in `LocationSelection`, the map canvas is compressed into a 180px slit at the top of the device, restricting panning context.

---

### ISSUE-11: Static Route Waypoint Hardcoding
- **Severity**: Low
- **Category**: Simulation Fidelity
- **Affected Files**:
  - `src/components/OpenStreetMap.tsx` (Lines 29-38)
- **Observed Behavior**:
  - The route coordinates `ROUTE_WAYPOINTS` follow the real-world corridor between VVCE Gokulam and JSS Hospital / Mysuru Railway Station. If a user selects a completely different landmark (e.g. Chamundi Hill or Mysore Palace), the polyline continues to display the Gokulam-Yadavagiri corridor rather than recalculating the road network coordinates dynamically.

---

## 7. Interaction, State Feedback & Edge Cases

### ISSUE-12: Rotation Actionability Check in Playwright
- **Severity**: Low
- **Category**: Automated Testability & Kinematics
- **Affected Files**:
  - `src/components/miles/MilesOrbit.tsx` (Lines 300-345)
- **Observed Behavior**:
  - Because `MilesOrbit` revolvles journey nodes continuously via `requestAnimationFrame`, standard browser automation tools (like Playwright's `click()`) will pause waiting for element stability unless `{ force: true }` is specified.
- **User Impact**: None for end-users, but impacts headless CI/CD test suites if not configured with force clicks.

---

### ISSUE-13: Incomplete Kannada Localization on Dynamic Error Modals
- **Severity**: Medium
- **Category**: Accessibility & Multilingual Support
- **Affected Files**:
  - `src/components/Modals.tsx`
  - `src/components/driver/DriverSafetyModal.tsx`
- **Observed Behavior**:
  - While core pages (`RidesHome`, `CourierHome`, `SkyppyMiles`) switch dynamically between English and Kannada using `src/utils/i18n.ts`, certain deep modal sheets (such as the Driver Incident Reporting Form and Volumetric Weight error tooltips) remain in English regardless of active language state.

---

## 8. Summary Matrix

| ID | Issue Title | Severity | Area | Recommendation |
|---|---|---|---|---|
| **ISSUE-01** | Brand spelling: `SKAPPY` vs `Skyppy` | High | Copywriting | Normalize all headers and comments to `Skyppy` |
| **ISSUE-02** | Unit ambiguity: "Miles" vs "KM" | Medium | Information Arch | Add subtitle explaining 1 Skyppy Mile = 1 km |
| **ISSUE-03** | Dual Design Token Paradigm | Medium | Design Tokens | Replace raw slate classes with M3 token variables |
| **ISSUE-04** | Button corner radius discrepancy | Medium | Visual System | Standardize primary CTAs to `rounded-2xl` |
| **ISSUE-05** | Card border radii multiplicity | Low | Layout Rhythm | Unify internal card hierarchy |
| **ISSUE-06** | Header cramping on ≤360px widths | High | Responsive Design| Collapse secondary icons into overflow menu on small widths |
| **ISSUE-07** | Competing actions on Home screen | Medium | UX Workflow | Consolidate parcel entry points into one primary path |
| **ISSUE-08** | Desktop DeviceFrame bypass in Driver View | High | Layout Shell | Wrap `/driver-view` in `DeviceFrame` when on desktop |
| **ISSUE-09** | Redundant service switcher | Low | Navigation | Remove switcher on sub-screens |
| **ISSUE-10** | Map occlusion by bottom sheets | Medium | Map UX | Implement peek / expanded sheet heights |
| **ISSUE-11** | Static corridor polyline waypoints | Low | Map Routing | Generate multi-point waypoints for all 6 landmarks |
| **ISSUE-12** | Orbit node clickability in automation | Low | Testing | Maintain `{ force: true }` or add data-testids |
| **ISSUE-13** | Deep modal translation omissions | Medium | Localization | Extend `i18n.ts` dictionary to cover safety modals |
