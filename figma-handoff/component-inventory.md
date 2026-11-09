# Skyppy 2.0 — Component Inventory

This document details all reusable UI components built for the Skyppy 2.0 passenger mobility application for Figma component mapping.

---

## 1. Structural Components

### `SkyppyLogo`
- **Variants**:
  - `full`: Official SVG emblem squircle (`rx="115"` Cerulean Blue `#366eb6` with white Qurova 'S') + official `QurovaDEMO-Medium` wordmark ("Skyppy") + optional "Rides" pill.
  - `mark`: Emblem squircle icon only.
  - `compact`: Inline header logo with title and subtitle.
- **Color Themes**: `light`, `dark`, or inherited auto-contrast.
- **Sizes**: `sm`, `md`, `lg`.

### `LocationPicker`
- **Variants**:
  - `pickup`: Green theme indicator (`bg-emerald-500`), searches and sets trip origin.
  - `destination`: Blue theme indicator (`bg-primary`), searches and sets trip destination.
- **Capabilities**:
  - Live query text search with instant Mysuru landmarks filter.
  - Simulated voice input waveform feedback.
  - Category filter pills (All, Transit, Hubs, Saved).
  - Saved places quick-pick list (Home, Work, Gym, Central Station).
  - "Choose on Live Map" interactive map pin mode: Centered stationary pinpoint marker with animated pulse ring, drag-to-reposition map grid, live reverse-geocoded coordinates, and "Confirm Pin Location" action.
  - Quick Swap button: Seamless 180° animated rotation that exchanges pickup and destination.

### `Header`
- **Variants**:
  - `tab`: App logo + "Skyppy" brand title + "Urban Mobility" subhead + Language toggle pill (`EN` / `ಕನ್ನಡ`) + Notifications icon button + Profile avatar.
  - `stack`: Back arrow button + Screen Title + Language toggle pill (`EN` / `ಕ`) + Safety Shield / Right action button + Profile avatar.
- **Auto-layout**: Horizontal, space-between, fixed height `64px`, padding `16px`.
- **States**: Default, Scrolled (backdrop blur + border), Unread notifications dot.

### `BottomNav`
- **Tabs**:
  1. Home (`directions_car`)
  2. Activity (`receipt_long`)
  3. Miles (`military_tech`)
  4. Profile (`person`)
- **Hosting Architecture**:
  - Mounted directly in the `DeviceFrame` app shell outside the scrolling viewport container (`#mobile-app-viewport`).
  - Remains permanently fixed at the base of the smartphone viewport across all 4 primary tabs.
  - Safe-area bottom inset padding (`pb-1`) prevents overlap with the OS home indicator.
- **Auto-layout**: Horizontal, space-around, fixed height `72px` (`h-[72px]`), background `bg-surface-container-lowest/95 backdrop-blur-xl border-t border-outline-variant/30`.
- **States**: Active (filled icon + `text-primary` + bold text), Inactive (`text-tertiary`). Localization applied instantly in English or Kannada (`kn`).

### `DeviceFrame`
- **Properties**:
  - Realistic mobile preview viewport (approx. 390 × 844 CSS pixels) centered on neutral canvas.
  - Dynamic island, real-time digital clock, battery/wifi hardware indicators, tactile frame edge styling.
  - Complete edge-to-edge interactive app execution inside phone viewport.

---

## 2. Card Components

### `VehicleOptionCard`
- **Variants**: Auto Rickshaw (`auto`), Hatchback Mini (`hatchback`), Sedan Comfort (`sedan`). Aligned strictly with official Mysuru platform operations.
- **Elements**: Vehicle icon/image, Name, Badge (Fastest, Popular, Top Rated), Seat capacity, Live ETA away, Strikethrough base fare, Guaranteed fare, "Fare Details" breakdown button, Custom selection checkmark ring.
- **States**: Selected (`ring-2 ring-primary bg-surface-container-low`), Default (`bg-surface-container-lowest shadow-xs`).

### `ThreeStageConfirmationExperience`
- **Stage A (Dispatch Sequence)**:
  - Official Skyppy emblem with continuous sonic radar ripple rings.
  - Live animated SVG route polyline tracing from origin to destination.
  - Moving vehicle beacon dot with directional arrow traveling along the corridor.
  - Progressive status timeline ticks: "Contacting nearby verified drivers", "Securing lowest guaranteed fare", "Locking in vehicle match".
- **Stage B (Vehicle Match Transformation)**:
  - Radial celebratory burst and expanding green halo in Signal Lime (`#d1ec64`).
  - Vehicle category 3D illustration badge (Auto Rickshaw, Hatchback Mini, or Sedan Comfort).
  - "Driver Matched!" headline with driver ETA countdown badge.
- **Stage C (Confirmed Ride Pass)**:
  - Verified driver pod with rating, vehicle plate chip, call and chat shortcuts.
  - Start Ride OTP badge (`4891`).
  - Editable route summary chip (Distance, Duration, Locked Fare).
  - Direct "Track Live Ride" CTA button.
  - Accessibility & controls: "Skip animation" quick action button and automatic skip on `prefers-reduced-motion: reduce`.

### `HeroSuccessCard`
- **Elements**: Radial ambient glow orbs, Verified checkmark animated ring in Signal Lime (`bg-secondary-container`), Headline ("Ride Booked!"), Corridor dispatch status badge.

### `DriverPodCard`
- **Elements**: Driver avatar, Star rating badge (`4.8★`), Name with verified tick, Vehicle plate chip (`KA-09 AB 4217`), Direct In-app Chat action button, Direct Phone Call button.

### `SkyppyMilesCard`
- **Elements**: Mileage counter (`248.6 KM`), Tier badge (`Tier 2 Explorer`), Linear progress milestone bar to next goal, CTA to view rewards.

### `VoucherCard`
- **Elements**: Coupon icon, Expiry tag, Discount headline ("₹50 Flat Off"), Terms/Scope description, "Apply to Next Ride" button.

### `MilestoneNode`
- **Variants**: `unlocked` (Checkmark, green container), `almost` (Open lock, pulsating electric blue container, progress bar), `locked` (Padlock, muted surface).

---

## 3. Interactive Modals & Drawers

### `FareBreakdownModal`
- Transparent pricing breakdown bottom sheet: Base fare (flag down), distance charge (km × rate per km), platform access fee (waived during promo), active coupon discount, guaranteed total, and Skyppy Fare Lock guarantee.

### `TripCompletedFeedbackModal`
- Interactive post-ride rating sheet: 5-star rating selector, driver praise compliment tags (Polite, Clean Auto, Safe Driving, Quick Route), written rider comment text area, optional driver tip selector (+₹10, +₹20, +₹30), and miles credit celebration banner.

### `NotificationsModal`
- Slide-up bottom sheet with unread badges, timestamped alerts, and "Mark all as read" action.

### `SafetyToolkitModal`
- 24/7 Police 112 direct emergency button, Share live GPS trip button, SafeRide Telemetry monitor status, Rider helpline trigger.

### `DriverChatModal`
- In-app messenger with message history, speech bubbles, quick canned reply pills, text input field, and driver reply simulation.

### `ScheduleTripModal`
- Day selector chips (Tomorrow, Thursday, Friday), Time selector chips, fare estimate pill, and schedule confirmation button.

### `ReceiptModal`
- Itemized ride fare breakdown, driver and vehicle details, pickup and destination addresses, PDF download trigger, and "Book Again" action.

---

## 4. Map & Visuals

### `NocturnalVectorMap`
- Mysuru street grid, Kukkarahalli Lake water simulation polygon, Chamundi foothills foliage vector, Palace Ward identifier, and animated electric blue route polyline with transit pulse segments.

### `DriverMarker`
- Yellow & green auto rickshaw icon inside circular Signal Lime badge with glowing ring, driver name tag, and live speed badge (`24 km/h`).

