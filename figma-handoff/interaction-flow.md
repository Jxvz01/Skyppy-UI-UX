# Skyppy 2.0 — Interaction Flow & State Architecture

This document describes the interaction choreography, user journeys, state transitions, and simulation models for the Skyppy Rides passenger mobility application.

---

## 1. Primary Booking Flow (End-to-End)

```
[01 Rides Home]
       │
       ▼ (Tap "Where to in Mysuru?" or "Instant Ride")
[02 Destination Search]
       │  ├─ Toggle Pickup vs Destination mode
       │  ├─ Interactive LocationPicker (Type Mysuru landmark, voice sim, category pills)
       │  ├─ "Choose on Live Map" mode (draggable map with centered stationary pinpoint)
       │  └─ Swap Pickup & Destination (with 180° animated rotation)
       │
       ▼ (Select search result / recent place / saved pin / confirmed map pin)
[03 Location Selection]
       │  ├─ Editable Pickup & Destination chips (tap to re-open LocationPicker)
       │  ├─ Dynamic distance & duration recalculation for any Mysuru pair
       │  ├─ Origin & Destination identical-point validation
       │  └─ Verify route polyline, distance & estimated duration; tap "Choose Ride"
       │
       ▼
[04 Ride Options]
       │  ├─ Choose category: Auto (₹76), Hatchback (₹112), Sedan (₹156)
       │  ├─ Tap "Fare Details" -> [Transparent Fare Breakdown Modal with km & rates]
       │  ├─ Tap "Apply Coupon" -> [Coupon Voucher Modal]
       │  └─ Tap "Change" -> [Payment Method Sheet]
       │
       ▼ (Select vehicle; tap "Book [Vehicle]")
[05 Booking Confirmation] (Three-Stage Progressive Experience)
       │  ├─ STAGE A: Animated Dispatch Sequence (Official emblem ripple + polyline tracer + moving vehicle beacon)
       │  ├─ STAGE B: Vehicle Match Transformation (Radial confetti burst + vehicle 3D badge + "Driver Matched!")
       │  ├─ STAGE C: Full Ride Pass (Driver pod, OTP, Locked fare, Route summary)
       │  └─ Controls: "Skip to Details" action & reduced-motion accessibility bypass
       │
       ▼ (Tap "Track Live Ride")
[06 Live Ride Tracking]
       │  ├─ Simulated Driver Lifecycle:
       │  │    1. Assigned (Ramesh K. heading to pickup)
       │  │    2. Approaching (500m away, ETA 2 min)
       │  │    3. Arrived at Pickup (Start OTP verification)
       │  │    4. In Progress (telemetry route tracking, speed jitter)
       │  │    5. Completed (arrived safely at destination)
       │  │
       │  ├─ Share Trip URL (clipboard) & 24/7 Safety Toolkit
       │  └─ In-app Driver Chat & Direct Phone Dial
       │
       ▼ (Trip completion triggered manually or via auto-simulation timer)
[Trip Completed Modal]
       │  ├─ 5-star driver rating
       │  ├─ Written feedback comment field
       │  ├─ Driver compliment chips (Polite, Clean Auto, Safe Driving)
       │  ├─ Optional driver tip (+₹10, +₹20, +₹30)
       │  └─ Skyppy Miles automatically credited to user balance
       │
       ▼ (Tap "Submit & View Activity")
[08 Activity / Ride History]
```

---

## 2. Skyppy Miles Loyalty Loop

1. **Earning Miles**:
   - Every completed ride earns Miles equal to the trip's actual distance (e.g., +4.2 km).
   - Lifetime mileage increases immediately upon trip completion.
   - Milestone progress bar advances dynamically toward the next VIP goal.

2. **Milestone Unlocking**:
   - When `lifetimeKm` reaches a milestone threshold (50 km, 150 km, 300 km, 500 km), that milestone unlocks.
   - Unlocked milestone vouchers become available in the voucher wallet.

3. **Voucher Redemption**:
   - Rider taps "Redeem Voucher" from the Miles dashboard or "Apply Offer" from the Ride Options screen.
   - Discount is deducted from the vehicle's rate card in real time.
   - Minimum payable fare is clamped at ₹25 (base flag-down protection).

---

## 3. Bilingual Localization (English & Kannada)

- **Instant Language Toggle**:
  - Available on every screen via the `Header` pill (`EN | ಕನ್ನಡ`).
  - Available inside `Profile` -> `Preferences & Safety` -> `Language`.
- **Scope**:
  - Full UI dictionary: tab bars, screen headings, status pills, category names, fare breakdown labels, action buttons, and toast notifications.
  - Zero layout shift: font sizes, line heights, and container padding accommodate Kannada script gracefully.

---

## 4. Theme Engine (Light / Dark / System)

- Supported modes: Light, Dark, System Default.
- Applied globally via `document.documentElement.classList.add('dark')`.
- Persisted locally under `skyppy_theme_preference`.
- Custom tokens maintain 4.5:1 WCAG contrast ratios across both modes.

---

## 5. Demo State Reset Architecture

- Accessible directly from the Profile page under **"Prototype QA — Reset Prototype Demo Data"**.
- Clears `localStorage` keys:
  - `skyppy_active_booking`
  - `skyppy_ride_history`
  - `skyppy_miles_data`
  - `skyppy_saved_places`
  - `skyppy_user_profile`
  - `skyppy_user_preferences`
- Re-initializes all state to pristine factory defaults for client demonstrations and testing.

