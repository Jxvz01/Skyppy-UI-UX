# Skyppy 2.0 | Complete Screen-by-Screen Inventory

> **Document**: Route-by-Route Implementation Inventory  
> **Audited Version**: Skyppy 2.0.0 (`skyppy-app-ui`)  
> **Total Routes Cataloged**: 18 Unique View Routes + 12 Overlays & Modals  
> **Observation Methodology**: Automated Playwright DOM & Visual Inspection + Static Code Analysis

---

## Master Route & Component Index

| # | Route / Path | Screen Title | Primary Component File | Layout Type | Active Bottom Tab |
|---|---|---|---|---|---|
| 01 | `/` | Passenger Rides Home | `src/pages/RidesHome.tsx` | Full Viewport / Scrollable | `Home` |
| 02 | `/search` | Destination Search | `src/pages/DestinationSearch.tsx` | Full Viewport / Form | `None` (Stack) |
| 03 | `/location` | Location Selection & Map Picker | `src/pages/LocationSelection.tsx` | Split (Map + Sheet) | `None` (Stack) |
| 04 | `/options` | Ride Options & Vehicle Selection | `src/pages/RideOptions.tsx` | Scrollable List + Bottom CTA | `None` (Stack) |
| 05 | `/confirm` | Booking Dispatching & Radar | `src/pages/BookingConfirmation.tsx` | Split (Map + Modal) | `None` (Stack) |
| 06 | `/tracking` | Live Ride Tracking | `src/pages/LiveRideTracking.tsx` | Split (Map 390px + Sheet) | `None` (Stack) |
| 07 | `/courier` | Courier & Logistics Home | `src/pages/CourierHome.tsx` | Full Viewport / Scrollable | `Home` |
| 08 | `/courier/send` | Create Shipment Wizard (3 Steps) | `src/pages/CreateShipment.tsx` | Step Wizard Form | `None` (Stack) |
| 09 | `/courier/confirm` | Consignment Waybill Pass | `src/pages/ShipmentConfirmation.tsx`| Ticket / Pass Layout | `None` (Stack) |
| 10 | `/courier/track` | Intercity Shipment Tracking | `src/pages/ShipmentTracking.tsx` | Split (Map + Stepper) | `None` (Stack) |
| 11 | `/courier/receiver/:id` | External Receiver Portal | `src/pages/ReceiverPortal.tsx` | Lightweight Public View | `None` |
| 12 | `/courier/business` | Business Logistics Console | `src/pages/BusinessDashboard.tsx`| Enterprise Metric Grid | `None` (Stack) |
| 13 | `/miles` | Skyppy Miles Loyalty Hub | `src/pages/SkyppyMiles.tsx` | Scrollable Bento Grid | `Miles` |
| 14 | `/activity` | Activity & Trip History | `src/pages/ActivityHistory.tsx` | Tabbed List + Filters | `Activity` |
| 15 | `/profile` | User Profile & Settings | `src/pages/Profile.tsx` | Settings Group List | `Profile` |
| 16 | `/theme` | Theme & Appearance Customizer | `src/pages/ThemeSettings.tsx` | Options Selector | `Profile` |
| 17 | `/driver-view` | Driver Partner Dashboard | `src/pages/driver/DriverView.tsx` | Standalone Driver Shell | Driver Bottom Nav |
| 18 | `*` | Catch-all Fallback | `src/pages/RidesHome.tsx` | Redirect to Home | `Home` |

---

## Detailed Screen Specifications

### 01. Passenger Rides Home (`/`)

- **Route**: `/`
- **Component**: `src/pages/RidesHome.tsx`
- **Shell**: Wrapped in `DeviceFrame` (desktop) or native viewport (mobile).
- **Header**: `Header type="home"`. Contains Logo, City button (`Mysuru`), Language button (`ಕನ್ನಡ`), Notifications bell, and Profile avatar.
- **Visual Hierarchy & Sections**:
  1. *Hero Photographic Banner*: High-resolution photo of Mysore Palace illuminated in gold against deep blue twilight sky (`h-[190px] rounded-3xl object-cover`). Gradient overlay text: *"Move. Ride. Ship. Across Mysuru and beyond."*
  2. *Service Switcher Segmented Control*: White capsule container with two segments:
     - `Book a Ride`: Active with Royal Blue `#0042dd` fill and white text.
     - `Send a Parcel (New)`: Inactive with green "New" badge; clicking switches route to `/courier`.
  3. *Plan Your Journey Card*: White card (`rounded-2xl p-4 shadow-xs border border-slate-100`).
     - Eyebrow: `PLAN YOUR JOURNEY` (`text-[10px] font-bold text-slate-400 uppercase tracking-wider`).
     - Heading: `Where are we going today?` (`text-lg font-extrabold text-slate-900`).
     - Pickup input row: Cyan dot indicator, text `VVCE Campus, Gokulam`, and right GPS locate button (`my_location`).
     - Divider line with vertical swap button (`swap_vert`).
     - Destination input row: Red location pin, text `Mysuru City Railway Station`, and chevron.
  4. *Express Service Banner*: Light green gradient card (`bg-gradient-to-r from-emerald-50 to-lime-50 rounded-2xl p-3 border border-emerald-100/60`). 3D rendered package graphic with caption: *"Skyppy Move - Send parcels across cities"*.
  5. *Quick Actions 4-Column Grid*:
     - Column 1: `Ride Now` (`electric_rickshaw`, subtitle: "Auto • Car").
     - Column 2: `Send Parcel` (`package_2`, subtitle: "Intercity").
     - Column 3: `Schedule` (`calendar_month`, subtitle: "Ride or Pickup").
     - Column 4: `Track` (`location_on`, subtitle: "Ride / Parcel").
  6. *Skyppy Miles Bento Card*:
     - Container: Deep space dark container (`bg-[#0c1829] rounded-3xl p-4 text-white border border-slate-800/80 shadow-sm`).
     - Top row: Star icon in electric lime `#d4f84c`, title `Skyppy Miles`, subtext `Ride • Ship • Earn`, and live odometer `232 Miles`.
     - Center preview: Embedded compact **The Miles Orbit** interactive motion widget (`size={180}`), rendering rotating photon, traveling orbital nodes, and glowing core.
     - Bottom row: Progress bar (`h-1.5 bg-slate-800 rounded-full`, `#d4f84c` fill), text `68 miles to Gold`, and clickable `View Rewards ->` link navigating to `/miles`.
  7. *Recent Destinations*:
     - Card 1: `JSS Medical College & Hospital` (Bannimantap, Mysuru • 4.2 km • ~12 min).
     - Card 2: `Mysuru Railway Station (MYS)` (Medar Block, Yadavagiri • 6.1 km • ~16 min).
- **Bottom Navigation**: Persistent `BottomNav` with `Home` tab highlighted with spring indicator pill.
- **Screenshot Reference**: [screenshots/passenger-home.png](file:///c:/Users/Shubha/Desktop/Projects/skyppy-app-ui/docs/uiux-audit/screenshots/passenger-home.png)

---

### 02. Destination Search (`/search`)

- **Route**: `/search`
- **Component**: `src/pages/DestinationSearch.tsx`
- **Shell**: Stack navigation layout with top back button.
- **Header**: Custom search header with `arrow_back`, clear input button, and voice search microphone icon (`mic`).
- **Input Field**: Autofocused text input with placeholder *"Where to in Mysuru? (e.g. Palace, Station)"*.
- **Filter Tabs**: Horizontal scrolling category chips: `All Places`, `Recent`, `Saved`, `Transit Hubs`, `Heritage`.
- **Suggestions List**: Real-time filtered landmarks from `MYSURU_LANDMARKS` with thumbnail, location name, area name, category tag (e.g. `Academic`, `Fastest`, `Direct`, `Popular`), distance in km, and driving time in minutes.
- **Screenshot Reference**: [screenshots/passenger-location-search.png](file:///c:/Users/Shubha/Desktop/Projects/skyppy-app-ui/docs/uiux-audit/screenshots/passenger-location-search.png)

---

### 03. Location Selection on Interactive Map (`/location`)

- **Route**: `/location`
- **Component**: `src/pages/LocationSelection.tsx`
- **Shell**: Split view combining full-width OpenStreetMap canvas with an interactive bottom sheet.
- **Map Implementation (`OpenStreetMap.tsx`)**:
  - OpenStreetMap tiles rendered via Leaflet 1.9 with custom contrast/saturation CSS filter.
  - Interactive landmark pins positioned across Mysuru (VVCE Gate 2, JSS Bannimantap, Amba Vilas Palace, Mysuru Station, Chamundi Hill, Infosys Hebbal).
  - Tapping any pin recenters the map, updates pickup/destination coordinates, and presents a toast notification.
- **Floating Controls**:
  - `Search by Text` vs `Select on Map` toggle tabs.
  - `Use Current GPS Location` button with blue target icon.
- **Bottom Sheet**:
  - Category filter pills.
  - Landmark cards list with distance metrics.
  - Sticky bottom CTA: *"Confirm Pickup & Destination"*, navigating to `/options`.
- **Screenshot Reference**: [screenshots/passenger-location-picker.png](file:///c:/Users/Shubha/Desktop/Projects/skyppy-app-ui/docs/uiux-audit/screenshots/passenger-location-picker.png)

---

### 04. Ride Options & Vehicle Selection (`/options`)

- **Route**: `/options`
- **Component**: `src/pages/RideOptions.tsx`
- **Header**: `Header type="stack" title="Choose a Ride" backTo="/location"`.
- **Corridor Summary Strip**: Compact badge showing `VVCE Gokulam → Mysuru Railway Station • 4.2 km • ~12 min`.
- **Vehicle Category Selection Cards**:
  1. **Skyppy Auto**:
     - Visual: Custom SVG silhouette of Mahindra Treo electric rickshaw.
     - Telemetry: 3 seats, 2 min ETA, fastest in narrow street congestion.
     - Price: ₹78 guaranteed fare.
  2. **Skyppy Mini / Hatchback**:
     - Visual: Tata Tiago EV graphic.
     - Telemetry: 4 seats, 4 min ETA, compact AC ride.
     - Price: ₹124 guaranteed fare.
  3. **Skyppy Prime Sedan**:
     - Visual: Hyundai Aura / Dzire graphic.
     - Telemetry: 4 seats, 5 min ETA, spacious legroom, top-rated drivers.
     - Price: ₹168 guaranteed fare.
  4. **Skyppy Prime SUV**:
     - Visual: Maruti Ertiga / Innova graphic.
     - Telemetry: 6 seats, 8 min ETA, family & luggage capacity.
     - Price: ₹245 guaranteed fare.
- **Secondary Interaction Triggers**:
  - *Transparent Fare Details Link*: Opens `Fare Breakdown Modal` itemizing base fare, distance rate, waiting time, and taxes.
  - *Coupon & Promo Code Pill*: Opens `Coupon Modal` allowing users to apply `MYSURU50` (-₹50 discount), `GOLDVOYAGER`, or `SURGESHIELD`.
  - *Payment Method Row*: Displays chosen method (Cash, Google Pay UPI, Skyppy Wallet) and opens `Payment Sheet`.
  - *Ride Preferences*: Toggles for "Silent Ride", "AC On", and "Luggage Help".
- **Sticky Bottom Action**:
  - Large button: `Confirm & Book [Vehicle Name] • ₹[Net Fare]`. Navigates to `/confirm`.
- **Screenshot Reference**: [screenshots/passenger-ride-options.png](file:///c:/Users/Shubha/Desktop/Projects/skyppy-app-ui/docs/uiux-audit/screenshots/passenger-ride-options.png)

---

### 05. Booking Confirmation & Dispatch Matching (`/confirm`)

- **Route**: `/confirm`
- **Component**: `src/pages/BookingConfirmation.tsx`
- **Visual Design**:
  - Top header: `Confirming Your Ride` with subtext `Finding the nearest verified driver in Gokulam`.
  - Embedded map view showing the corridor route from VVCE to Mysuru Railway Station.
  - Animated pulsing radar vehicle marker scanning along the corridor.
  - Floating callout tags indicating Pickup and Destination coordinates.
  - Dispatch status stepper:
    - Step 1: `Scanning nearby drivers (12 online in Gokulam)` · Complete
    - Step 2: `Contacting top-rated drivers` · Active
    - Step 3: `Driver assigned` · Pending
  - Guaranteed Fare Lock guarantee pill: `Fare locked at ₹[Amount] - Zero Surge Guarantee`.
  - Auto-advances or direct button to Live Tracking (`/tracking`).
- **Screenshot Reference**: [screenshots/passenger-booking-confirming.png](file:///c:/Users/Shubha/Desktop/Projects/skyppy-app-ui/docs/uiux-audit/screenshots/passenger-booking-confirming.png)

---

### 06. Live Ride Tracking (`/tracking`)

- **Route**: `/tracking`
- **Component**: `src/pages/LiveRideTracking.tsx`
- **Header**: `Header type="stack" title="Live Tracking" backTo="/"`.
- **Interactive OpenStreetMap Canvas**:
  - Dimensions: `h-[390px] w-full rounded-b-3xl`.
  - Pickup marker with animated emerald concentric ring halo.
  - Destination marker with Skyppy Royal Blue `#0042dd` pin.
  - Vehicle marker with directional rotation, forward-projecting spotlight headlight beam cone, and real-time driver telemetry badge: `Ramesh • 24 km/h • Kalidasa Rd`.
  - Live Transit pill: `Live Transit • Mysuru Central`.
  - Floating ETA pill: `Arriving in 3 min`.
  - Floating Controls column: North compass rose, Follow Driver camera lock toggle (`Tracking Driver` vs `Free Pan`), Zoom In, Zoom Out, Recenter map.
- **Bottom Navigation Sheet**:
  - Driver Information Card:
    - Driver Photo, Name: *Ramesh Kumar*, Rating: 4.9 ★ (1,280 trips).
    - Vehicle: Mahindra Treo Electric, Plate: `KA-09-EA-4821`.
    - Verification PIN badge: `Start OTP: 4821`.
  - Direct Action Buttons:
    - Call Driver (`call`).
    - Chat / Message (`chat`).
    - Share Trip Link (`share`).
    - Safety Center (`shield`).
  - Trip Progress Stepper: `Driver Assigned` → `Driver Arriving` → `Trip in Progress` → `Arrived at Destination`.
  - Red outlined button: `Cancel Ride` (triggers cancellation reason modal).
- **Screenshot Reference**: [screenshots/passenger-live-tracking.png](file:///c:/Users/Shubha/Desktop/Projects/skyppy-app-ui/docs/uiux-audit/screenshots/passenger-live-tracking.png)

---

### 07. Courier & Logistics Home (`/courier`)

- **Route**: `/courier`
- **Component**: `src/pages/CourierHome.tsx`
- **Header**: Standard `home` header with service switcher toggle active on "Send a Parcel".
- **Visual Design**:
  - Hero container: 3D rendered Skyppy Move cardboard box with blue tape and flight emblem.
  - Headline: `SKAPPY MOVE - Send a Parcel. Ship your packages safely across cities.`
  - 4 Key Feature Badges:
    - `Intercity Delivery` (Mysuru ⇄ Bengaluru)
    - `Safe & Secure Handling` (Door-to-door insurance)
    - `Live Tracking` (GPS vehicle & hub monitoring)
    - `Proof of Delivery` (Photo & OTP on arrival)
  - Active Corridor Card:
    - Origin: `VVCE Campus, Gokulam` (with green radio dot).
    - Destination: `Bengaluru, Karnataka` (with red pin dot).
    - Primary CTA button: `Create Shipment ->` (`bg-primary text-white rounded-2xl py-3.5`).
  - Quick Actions Grid:
    - `New Shipment` (`package_2`)
    - `Track Shipment` (`local_shipping`)
    - `Scheduled Pickups` (`event_available`)
    - `Shipment History` (`history`)
  - Skyppy Miles Bento Card integration.
- **Bottom Navigation**: Persistent `BottomNav` with `Home` active.
- **Screenshot Reference**: [screenshots/courier-home.png](file:///c:/Users/Shubha/Desktop/Projects/skyppy-app-ui/docs/uiux-audit/screenshots/courier-home.png)

---

### 08. Create Shipment 3-Step Wizard (`/courier/send`)

- **Route**: `/courier/send`
- **Component**: `src/pages/CreateShipment.tsx`
- **Header**: `Header type="stack" title="Create Shipment" backTo="/courier"`.
- **Progress Stepper Header**: Visual step bar showing Step 1 (Package), Step 2 (Addresses), and Step 3 (Review & Speed).
- **Step 1: Package Details**:
  - Category selector chips: `Documents`, `Electronics`, `Food & Perishables`, `Clothing & Apparel`, `Other`.
  - Dead weight slider & numeric input: 0.1 kg to 50 kg.
  - Dimension inputs: Length (cm), Width (cm), Height (cm).
  - Dynamic Volumetric Weight computation: `(L * W * H) / 5000`.
  - Chargeable weight callout highlighting whether dead weight or volumetric weight applies.
  - Fragile & High-Value Cargo toggle (+₹40 insurance rider).
- **Step 2: Addresses & Contacts**:
  - Sender Details (Mysuru): Full name, phone number, complete street address, apartment/floor, landmark.
  - Receiver Details (Bengaluru): Recipient full name, mobile number, delivery address, pincode.
  - Secure Delivery OTP toggle: Requires recipient to provide OTP before delivery completion.
- **Step 3: Speed, Add-ons & Review**:
  - Service Tiers:
    - `Same Day Express` (6-hour transit via Expressway • ₹340)
    - `Next Day Priority` (24-hour guaranteed delivery • ₹180)
    - `Standard Cargo` (48-hour road freight • ₹110)
  - Itemized calculation: Base Freight, Handling Fee, Fragile Insurance, GST, Total.
  - Pickup Slot picker: `Morning (08:00 - 11:00)`, `Afternoon (12:00 - 15:00)`, `Evening (16:00 - 19:00)`.
  - Primary CTA: *"Confirm & Generate Waybill"*. Navigates to `/courier/confirm`.
- **Screenshot References**:
  - [screenshots/courier-create-step1.png](file:///c:/Users/Shubha/Desktop/Projects/skyppy-app-ui/docs/uiux-audit/screenshots/courier-create-step1.png)
  - [screenshots/courier-create-step2.png](file:///c:/Users/Shubha/Desktop/Projects/skyppy-app-ui/docs/uiux-audit/screenshots/courier-create-step2.png)
  - [screenshots/courier-create-step3.png](file:///c:/Users/Shubha/Desktop/Projects/skyppy-app-ui/docs/uiux-audit/screenshots/courier-create-step3.png)

---

### 09. Shipment Confirmation & Consignment Pass (`/courier/confirm`)

- **Route**: `/courier/confirm`
- **Component**: `src/pages/ShipmentConfirmation.tsx`
- **Visual Design**: Digital Consignment Waybill pass with perforated edge design and notched ticket corners.
- **Waybill Attributes**:
  - Tracking ID: `SKP-MYBLR-8841`.
  - High-resolution scannable QR Code and barcode.
  - Route: `Mysuru Hub (Gokulam) ➔ Bengaluru Central (Indiranagar)`.
  - Estimated Delivery: `Today by 04:30 PM (Same Day Express)`.
  - Sender & Recipient summaries.
  - Chargeable weight: `2.4 kg (Electronics • Insured)`.
- **Action Buttons**:
  - `Track Shipment Live`: Navigates to `/courier/track`.
  - `Download Consignment PDF`: Generates printable receipt.
  - `Back to Courier Home`: Returns to `/courier`.
- **Screenshot Reference**: [screenshots/courier-confirmation.png](file:///c:/Users/Shubha/Desktop/Projects/skyppy-app-ui/docs/uiux-audit/screenshots/courier-confirmation.png)

---

### 10. Intercity Shipment Tracking (`/courier/track`)

- **Route**: `/courier/track` (and `/courier/track/:id`)
- **Component**: `src/pages/ShipmentTracking.tsx`
- **Visual Design**:
  - Interactive Map showing the 148 km Mysuru-Bengaluru 10-lane Expressway corridor.
  - Live courier van marker positioned along the highway near Mandya.
  - Stepper Tracking Timeline:
    1. `Shipment Created & Pickup Scheduled` (08:30 AM) · Complete
    2. `Picked Up from Gokulam Campus` (09:15 AM) · Complete
    3. `Departed Mysuru Central Hub` (10:15 AM) · Complete
    4. `In Transit on Expressway (Near Mandya)` (11:45 AM) · Active
    5. `Arriving at Bengaluru Sorting Facility` (01:15 PM) · In Progress
    6. `Out for Delivery` · Pending
    7. `Delivered to Recipient` · Pending
  - Delivery verification code badge: `Delivery OTP: 7729`.
  - Driver / Courier Executive details with Call & Chat buttons.
- **Screenshot Reference**: [screenshots/courier-tracking.png](file:///c:/Users/Shubha/Desktop/Projects/skyppy-app-ui/docs/uiux-audit/screenshots/courier-tracking.png)

---

### 11. External Receiver Portal (`/courier/receiver/:id`)

- **Route**: `/courier/receiver/SKP-MYBLR-8841`
- **Component**: `src/pages/ReceiverPortal.tsx`
- **Visual Design**: Lightweight public portal allowing package recipients to inspect delivery progress without logging in.
- **Content**: Sender name, package description, delivery window countdown, courier courier contact, and security PIN verification helper.
- **Screenshot Reference**: [screenshots/courier-receiver-portal.png](file:///c:/Users/Shubha/Desktop/Projects/skyppy-app-ui/docs/uiux-audit/screenshots/courier-receiver-portal.png)

---

### 12. Business Logistics Management Dashboard (`/courier/business`)

- **Route**: `/courier/business`
- **Component**: `src/pages/BusinessDashboard.tsx`
- **Visual Design**: Enterprise logistics console for high-volume merchants.
- **Metric Cards**:
  - Total Consignments Dispatched: `142 shipments`.
  - On-Time Delivery Rate: `99.2%`.
  - Total Freight Expenditure: `₹18,450`.
  - Active Live Parcels: `8 in transit`.
- **Functional Modules**:
  - Bulk CSV Manifest Uploader.
  - Real-time parcel ledger with tracking search and status filters.
  - Developer API credentials drawer with API Key and Webhook URL fields.
- **Screenshot Reference**: [screenshots/courier-business-dashboard.png](file:///c:/Users/Shubha/Desktop/Projects/skyppy-app-ui/docs/uiux-audit/screenshots/courier-business-dashboard.png)

---

### 13. Skyppy Miles Loyalty Hub (`/miles`)

- **Route**: `/miles`
- **Component**: `src/pages/SkyppyMiles.tsx`
- **Header**: Title `Skyppy Miles`, Info button (opens Explainer Sheet), and Tier badge `Tier 2 Explorer`.
- **Centerpiece Engine (`MilesOrbit.tsx`)**:
  - Container: Deep space dark container (`bg-[#0a121d] rounded-3xl p-5 border border-white/10 shadow-2xl`).
  - Outer ambient blur radial glows in Royal Blue and Electric Lime.
  - **The Miles Orbit SVG Engine**:
    - Dual elliptical orbits (secondary guide at 85% scale, primary trajectory at 100% scale).
    - Trajectory gradient: Electric lime `#d4ee66` transitioning into Royal Blue `#0042dd`.
    - Traveling photon light pulse revolving smoothly along the trajectory.
    - 5 revolving journey nodes (colored `#d4ee66`, `#0042dd`, `#315ef8`, `#c0de43`).
    - Rotating kinematics: Continuous 0.4 RPM ambient revolution via `requestAnimationFrame` with delta-time smoothing.
    - Reduced motion compliance: Halts ambient rotation and instantly sets final static values when `prefers-reduced-motion` is enabled.
    - Center core disc: Glowing radial gradient (`#101c2b` → `#0a121d`), live rolling odometer counter (`248.6 KM`), monthly distance subtext (`64.2 km this month`), and tier indicator.
  - **Interactive Features**:
    - Tapping any node displays an overlay card with trip details (e.g. *VVCE → Railway Station*, *+5.4 km*, *Dismiss*).
    - `Simulate Ride Earn (+24 km)` button: Generates a shockwave ripple across the trajectory, inserts a new node, animates the counter upward, and pops in: `+24.0 KM JOURNEY JOINED ORBIT`.
    - `Redeem Test Voucher` button: Decouples the oldest node, decrements 15 km, and notifies: `-15.0 KM REDEEMED FOR ₹50 VOUCHER`.
- **Milestone Target Gauge**: Progress track towards `300 KM Tier 3 Master` milestone (`83% Achieved`, `51.4 km remaining`).
- **Rewards Catalog Carousel**: Horizontal snap-scrolling cards with "Redeem & Apply" buttons:
  - *₹50 Flat Off*: Valid 14 days, applies to next city ride.
  - *Peak Surge Shield*: 2 passes left, eliminates surge multipliers during evening rush hours.
  - *₹15 Commuter Pass*: Auto-credited discount across auto and cab fleets.
- **Milestone Ladder**: Vertical step progression showing unlocked and locked tiers (50 km First Explorer, 100 km 15% Off, 250 km Zero Peak Surge, 500 km Priority Dispatch, 1,000 km VIP Club).
- **Distance Ledger**: Real-time sync log listing recently completed trips with distance credits.
- **Bottom Navigation**: Persistent `BottomNav` with `Miles` tab active.
- **Screenshot References**:
  - [screenshots/miles-main.png](file:///c:/Users/Shubha/Desktop/Projects/skyppy-app-ui/docs/uiux-audit/screenshots/miles-main.png)
  - [screenshots/miles-explainer-modal.png](file:///c:/Users/Shubha/Desktop/Projects/skyppy-app-ui/docs/uiux-audit/screenshots/miles-explainer-modal.png)
  - [screenshots/miles-node-detail.png](file:///c:/Users/Shubha/Desktop/Projects/skyppy-app-ui/docs/uiux-audit/screenshots/miles-node-detail.png)
  - [screenshots/miles-earned-state.png](file:///c:/Users/Shubha/Desktop/Projects/skyppy-app-ui/docs/uiux-audit/screenshots/miles-earned-state.png)
  - [screenshots/miles-redemption.png](file:///c:/Users/Shubha/Desktop/Projects/skyppy-app-ui/docs/uiux-audit/screenshots/miles-redemption.png)

---

### 14. Activity & Trip History (`/activity`)

- **Route**: `/activity`
- **Component**: `src/pages/ActivityHistory.tsx`
- **Header**: `Header type="tab" title="Activity"`.
- **Visual Design**:
  - Segmented tab control: "Rides" vs "Courier / Parcels".
  - Status filter pills: "All", "Completed", "Cancelled".
  - Trip list items: Date, origin/destination, vehicle category icon, fare paid, payment method, and "View Receipt" trigger.
  - **Itemized Ride Receipt Modal**: Transparent breakdown showing Base Fare, Distance Fare, Taxes, Driver Rating, and Download Receipt CTA.
- **Bottom Navigation**: Persistent `BottomNav` with `Activity` tab active.
- **Screenshot References**:
  - [screenshots/activity.png](file:///c:/Users/Shubha/Desktop/Projects/skyppy-app-ui/docs/uiux-audit/screenshots/activity.png)
  - [screenshots/activity-courier-tab.png](file:///c:/Users/Shubha/Desktop/Projects/skyppy-app-ui/docs/uiux-audit/screenshots/activity-courier-tab.png)
  - [screenshots/activity-receipt-modal.png](file:///c:/Users/Shubha/Desktop/Projects/skyppy-app-ui/docs/uiux-audit/screenshots/activity-receipt-modal.png)

---

### 15. User Profile & Settings (`/profile`)

- **Route**: `/profile`
- **Component**: `src/pages/Profile.tsx`
- **Header**: `Header type="tab" title="Profile"`.
- **Visual Design**:
  - User Header: User avatar, name (*Shubha K.*), phone number, rating (4.92 ★), and tier badge.
  - Skyppy Wallet Card: Balance (₹420), Add Money button, Transaction history.
  - Account Options List:
    - `Saved Places` (Home: Gokulam 3rd Stage; Work: Infosys Electronic City).
    - `Safety Center & Trusted Contacts` (Configure 24/7 emergency sharing).
    - `Payment Methods` (Credit Cards, UPI, Net Banking, Wallet).
    - `Theme & Appearance` (Navigates to `/theme`).
    - `App Language` (Instant switch between English and Kannada).
    - `Help & Support` (FAQ, Ticket center, Chat support).
    - `Legal & Privacy Policy`.
    - `Log Out`.
- **Bottom Navigation**: Persistent `BottomNav` with `Profile` tab active.
- **Screenshot Reference**: [screenshots/profile.png](file:///c:/Users/Shubha/Desktop/Projects/skyppy-app-ui/docs/uiux-audit/screenshots/profile.png)

---

### 16. Theme Settings (`/theme`)

- **Route**: `/theme`
- **Component**: `src/pages/ThemeSettings.tsx`
- **Header**: `Header type="stack" title="Appearance" backTo="/profile"`.
- **Options**: Radio selector for *Light Mode*, *Dark Mode*, and *System Default*.
- **Preview**: Real-time CSS theme variable preview showing color tokens and button states.
- **Screenshot Reference**: [screenshots/theme-settings.png](file:///c:/Users/Shubha/Desktop/Projects/skyppy-app-ui/docs/uiux-audit/screenshots/theme-settings.png)

---

### 17. Skyppy Pro Driver Experience (`/driver-view`)

- **Route**: `/driver-view`
- **Component**: `src/pages/driver/DriverView.tsx`
- **Shell**: Standalone `DriverAppShell` layout (bypasses passenger `DeviceFrame` on desktop).
- **DriverHeader**:
  - Skyppy emblem with "Driver Partner" badge.
  - Interactive Online/Offline toggle switch (Green `ONLINE` vs Slate `OFFLINE`).
  - Network status indicator ("4G Strong").
  - "Passenger App" button to seamlessly return to passenger mode.
  - Demo controls menu button (trigger ride request, simulate offline, simulate emergency).
- **Driver Home - Offline State**:
  - Banner: "You are Offline - Go online to start receiving ride requests".
  - "Go Online Now" primary CTA button.
  - Mysuru Demand Hotspots: Live surge indicators for *VVCE Campus & Gokulam (1.4x)*, *Mysuru Railway Station (1.8x)*, *Mysore Palace (1.2x)*, and *Infosys Hebbal (1.5x)*.
- **Driver Home - Online State**:
  - Live OpenStreetMap with moving driver auto icon.
  - Status: "Searching trips near Gokulam...".
  - KPI Metrics Ticker: Today's Trips (7), Today's Net Earnings (₹1,485), Online Time (5h 40m), Acceptance Rate (96%).
- **Incoming Ride Request Modal**:
  - Overlay card with radial countdown timer (15 seconds).
  - Rider details: Sneha R. Gowda (4.9 ★, 42 rides).
  - Route details: Pickup at *VVCE Campus Gate 2, Gokulam*; Destination at *Mysuru Railway Station (MYS)*.
  - Distance & Duration: 4.2 km • ~12 min.
  - Net Driver Earnings: `₹128` (Guaranteed gross fare ₹148 minus ₹20 platform fee).
  - Action buttons: "Decline" vs primary "Accept Ride".
- **Navigation to Pickup**:
  - Turn-by-turn direction bar: *"Turn left towards VVCE Gate 2, Gokulam (0.8 km • 3 min)"*.
  - Passenger contact drawer with "Call Sneha" and "Message" triggers.
  - Large button: *"I Have Arrived at Pickup"*.
- **Arrived at Pickup (Waiting State)**:
  - Live waiting timer counting upward.
  - Grace period notice: Free waiting for first 3 minutes; automatic paid waiting surcharge (₹2/min) applied thereafter.
  - Primary button: *"Verify OTP & Start Trip"*.
- **OTP Verification Modal**:
  - 4-digit PIN verification modal preventing unauthorized departures.
  - Numeric keypad with quick "Auto-fill (4821)" demo helper button.
- **Active Trip**:
  - Turn-by-turn destination navigation: *"Head south on Sayyaji Rao Rd towards Railway Station (3.4 km • 9 min)"*.
  - Speedometer display: Live speed in km/h (`28 km/h`).
  - Live fare meter incrementing with trip progress.
  - Floating Safety Shield icon opening the **Driver Safety Center**:
    - 108 Karnataka Police Emergency SOS trigger.
    - Skyppy 24/7 Driver Incident Desk.
    - Vehicle breakdown assistance.
  - Primary slider/button: *"Complete Trip"*.
- **Trip Completed Modal**:
  - Settlement breakdown: Gross Passenger Fare `₹148`, Platform Commission `-₹20`, Net Driver Earnings Credited `₹128`.
  - Star rating selector for rider feedback.
  - Primary CTA: *"Confirm & Return to Online"*.
- **Driver Activity Tab**: Chronological ledger of all completed trips with timestamps, routes, passenger names, and net payouts.
- **Driver Earnings Tab**: Weekly bar chart breakdown (Monday–Sunday), accumulated wallet balance (`₹3,420`), instant bank transfer cashout button, and incentive milestone targets (`₹12,000 / ₹15,000`).
- **Driver Profile Tab**: Profile of Ramesh Kumar, active vehicle switcher (Electric Auto, Mini EV Hatchback, Prime Sedan, Prime SUV), document verification checkmarks, and driver tier badge.
- **Screenshot References**:
  - [screenshots/driver-home-online.png](file:///c:/Users/Shubha/Desktop/Projects/skyppy-app-ui/docs/uiux-audit/screenshots/driver-home-online.png)
  - [screenshots/driver-home-offline.png](file:///c:/Users/Shubha/Desktop/Projects/skyppy-app-ui/docs/uiux-audit/screenshots/driver-home-offline.png)
  - [screenshots/driver-incoming-request.png](file:///c:/Users/Shubha/Desktop/Projects/skyppy-app-ui/docs/uiux-audit/screenshots/driver-incoming-request.png)
  - [screenshots/driver-heading-to-pickup.png](file:///c:/Users/Shubha/Desktop/Projects/skyppy-app-ui/docs/uiux-audit/screenshots/driver-heading-to-pickup.png)
  - [screenshots/driver-contact-passenger.png](file:///c:/Users/Shubha/Desktop/Projects/skyppy-app-ui/docs/uiux-audit/screenshots/driver-contact-passenger.png)
  - [screenshots/driver-arrived-waiting.png](file:///c:/Users/Shubha/Desktop/Projects/skyppy-app-ui/docs/uiux-audit/screenshots/driver-arrived-waiting.png)
  - [screenshots/driver-otp-verification.png](file:///c:/Users/Shubha/Desktop/Projects/skyppy-app-ui/docs/uiux-audit/screenshots/driver-otp-verification.png)
  - [screenshots/driver-active-trip.png](file:///c:/Users/Shubha/Desktop/Projects/skyppy-app-ui/docs/uiux-audit/screenshots/driver-active-trip.png)
  - [screenshots/driver-safety-modal.png](file:///c:/Users/Shubha/Desktop/Projects/skyppy-app-ui/docs/uiux-audit/screenshots/driver-safety-modal.png)
  - [screenshots/driver-trip-completed.png](file:///c:/Users/Shubha/Desktop/Projects/skyppy-app-ui/docs/uiux-audit/screenshots/driver-trip-completed.png)
  - [screenshots/driver-activity.png](file:///c:/Users/Shubha/Desktop/Projects/skyppy-app-ui/docs/uiux-audit/screenshots/driver-activity.png)
  - [screenshots/driver-earnings.png](file:///c:/Users/Shubha/Desktop/Projects/skyppy-app-ui/docs/uiux-audit/screenshots/driver-earnings.png)
  - [screenshots/driver-profile.png](file:///c:/Users/Shubha/Desktop/Projects/skyppy-app-ui/docs/uiux-audit/screenshots/driver-profile.png)
  - [screenshots/driver-home-desktop.png](file:///c:/Users/Shubha/Desktop/Projects/skyppy-app-ui/docs/uiux-audit/screenshots/driver-home-desktop.png)
