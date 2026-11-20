# Skyppy 2.0 | Navigation & Interaction Map

> **Document**: State Machines, User Flows & Interaction Specifications  
> **Audited Version**: Skyppy 2.0.0 (`skyppy-app-ui`)  
> **Diagram Language**: Mermaid Markdown

---

## 1. Master Application Flow & Routing Architecture

```mermaid
graph TD
    App([Application Root /]) --> Shell[DeviceFrame / App Shell]
    
    %% Passenger Flow
    Shell --> RidesHome["Passenger Home (/)"]
    RidesHome --> Search["Destination Search (/search)"]
    RidesHome --> LocationPicker["Location Selection (/location)"]
    Search --> LocationPicker
    LocationPicker --> RideOptions["Ride Options (/options)"]
    RideOptions --> FareModal["Transparent Fare Modal"]
    RideOptions --> CouponModal["Coupon Selector Modal"]
    RideOptions --> PaymentSheet["Payment Method Sheet"]
    RideOptions --> BookingConfirm["Booking Dispatch (/confirm)"]
    BookingConfirm --> LiveTracking["Live Tracking (/tracking)"]
    LiveTracking --> CancelModal["Cancel Ride Modal"]
    LiveTracking --> ActivityHistory["Activity (/activity)"]

    %% Courier Flow
    RidesHome -. "Service Switcher" .-> CourierHome["Courier Home (/courier)"]
    CourierHome --> CreateShipment1["Create Shipment: Package (/courier/send)"]
    CreateShipment1 --> CreateShipment2["Create Shipment: Addresses"]
    CreateShipment2 --> CreateShipment3["Create Shipment: Speed & Addons"]
    CreateShipment3 --> ShipmentConfirm["Consignment Pass (/courier/confirm)"]
    ShipmentConfirm --> ShipmentTracking["Courier Tracking (/courier/track)"]
    CourierHome --> BusinessDashboard["Business Dashboard (/courier/business)"]
    ShipmentConfirm --> ReceiverPortal["Receiver Portal (/courier/receiver/:id)"]

    %% Miles Flow
    RidesHome -. "Bento Click" .-> MilesHub["Miles Hub (/miles)"]
    MilesHub --> ExplainerModal["Miles Explainer Modal"]
    MilesHub --> NodeDetails["Journey Node Tooltip"]
    MilesHub --> EarnSimulation["Kinematic Shockwave (+24 km)"]
    MilesHub --> RedeemSimulation["Node Departure (-15 km)"]

    %% Activity & Profile
    Shell --> ActivityHistory
    ActivityHistory --> ReceiptModal["Itemized Receipt Modal"]
    Shell --> Profile["User Profile (/profile)"]
    Profile --> ThemeSettings["Theme Settings (/theme)"]

    %% Driver Side
    Shell -. "Direct URL or Header Link" .-> DriverShell["Driver App Shell (/driver-view)"]
    DriverShell --> DriverHome["Driver Home (Online / Offline)"]
    DriverHome --> IncomingRequest["Incoming Request Modal (15s)"]
    IncomingRequest --> NavPickup["Navigation to Pickup"]
    NavPickup --> ArrivedWaiting["Arrived & Waiting Timer"]
    ArrivedWaiting --> OtpVerify["OTP Verification Modal"]
    OtpVerify --> ActiveTrip["Active Trip Navigation"]
    ActiveTrip --> DriverSafety["Safety Center SOS Modal"]
    ActiveTrip --> TripComplete["Trip Completed & Settlement Modal"]
    DriverShell --> DriverActivity["Driver Activity Ledger"]
    DriverShell --> DriverEarnings["Driver Earnings & Cashout"]
    DriverShell --> DriverProfile["Driver Profile & Vehicle Switcher"]
```

---

## 2. Passenger Ride Lifecycle State Machine

```mermaid
stateDiagram-v2
    [*] --> Idle: Opens Home (/)
    Idle --> SpecifyingLocation: Taps Pickup or Destination
    SpecifyingLocation --> ChoosingVehicle: Selects Landmark (/options)
    
    state ChoosingVehicle {
        [*] --> CategorySelection
        CategorySelection --> InspectingFare: Taps Fare Details
        InspectingFare --> CategorySelection: Closes Modal
        CategorySelection --> ApplyingPromo: Taps Apply Coupon
        ApplyingPromo --> CategorySelection: Applies Discount
        CategorySelection --> SettingPayment: Taps Payment Method
        SettingPayment --> CategorySelection: Selects Cash / UPI
    }

    ChoosingVehicle --> SearchingDriver: Clicks 'Confirm & Book' (/confirm)

    state SearchingDriver {
        [*] --> RadarScanning: Dispatches to nearby drivers
        RadarScanning --> DriverMatched: Ramesh K. accepts
        DriverMatched --> LockFare: Guarantees fare lock
    }

    SearchingDriver --> LiveRide: Auto-transition (/tracking)

    state LiveRide {
        [*] --> DriverAssigned: Ramesh heading to pickup (0.8 km)
        DriverAssigned --> DriverArrived: Driver arrives at VVCE
        DriverArrived --> TripStarted: Enters OTP 4821
        TripStarted --> InTransit: Driving on Sayyaji Rao Rd
        InTransit --> ReachedDestination: Arrives at Station
        TripStarted --> SafetyEmergency: Taps SOS Shield
        SafetyEmergency --> TripStarted: Dispatches assistance
        DriverAssigned --> CancellingRide: Taps Cancel Ride
        CancellingRide --> [*]: Ride Cancelled
    }

    LiveRide --> Completed: Reaches Destination
    Completed --> FeedbackRating: Rates Driver
    FeedbackRating --> [*]: Activity History
```

---

## 3. Courier Shipment State Machine

```mermaid
stateDiagram-v2
    [*] --> CourierLanding: Navigates to /courier
    CourierLanding --> PackageDetails: Clicks 'Create Shipment' (/courier/send)

    state PackageDetails {
        [*] --> CategorySelect: Documents / Electronics / Food
        CategorySelect --> WeightDimensions: Enters Dead Weight + L x W x H
        WeightDimensions --> VolumetricCalculation: Auto-computes Chargeable Weight
        VolumetricCalculation --> FragileOption: Toggles Insurance Rider
    }

    PackageDetails --> AddressContacts: Clicks Next (Step 2)

    state AddressContacts {
        [*] --> SenderInput: Mysuru Pickup Address
        SenderInput --> ReceiverInput: Bengaluru Drop Address
        ReceiverInput --> SecureOtpToggle: Toggles Recipient Delivery PIN
    }

    AddressContacts --> SpeedReview: Clicks Next (Step 3)

    state SpeedReview {
        [*] --> TierSelection: Same Day (6h) / Next Day / Standard
        TierSelection --> SlotSelection: Morning / Afternoon / Evening
        SlotSelection --> ReviewSummary: Inspects itemized pricing
    }

    SpeedReview --> WaybillGenerated: Clicks 'Confirm & Generate Waybill' (/courier/confirm)

    state WaybillGenerated {
        [*] --> ScannablePass: QR & Barcode display (SKP-MYBLR-8841)
        ScannablePass --> LiveTracking: Taps 'Track Package' (/courier/track)
        ScannablePass --> DownloadPDF: Taps 'Download Consignment Pass'
    }

    LiveTracking --> InTransitState: Intercity Expressway
    InTransitState --> DeliveredState: Recipient provides OTP
    DeliveredState --> [*]
```

---

## 4. The Miles Orbit Kinematic & State Machine

```mermaid
stateDiagram-v2
    [*] --> AmbientOrbit: Initial Mount (/miles)
    
    state AmbientOrbit {
        [*] --> Revolving: 0.4 RPM delta-time kinematic loop
        Revolving --> TravelingPhoton: Light pulse on trajectory
    }

    AmbientOrbit --> InspectingNode: Clicks Orbital Journey Node
    InspectingNode --> AmbientOrbit: Clicks 'Dismiss'

    AmbientOrbit --> EarningMiles: Clicks 'Simulate Ride Earn (+24 km)'
    state EarningMiles {
        [*] --> ShockwaveTriggered: Expanding ripple across SVG
        ShockwaveTriggered --> NodeInsertion: New node joins trajectory
        NodeInsertion --> CounterInterpolation: Balance increments (248.6 -> 272.6)
        CounterInterpolation --> PopInNotification: '+24.0 KM JOURNEY JOINED ORBIT'
    }
    EarningMiles --> AmbientOrbit: Returns after 2.2s

    AmbientOrbit --> RedeemingMiles: Clicks 'Redeem Test Voucher'
    state RedeemingMiles {
        [*] --> NodeDecoupling: Oldest node leaves trajectory
        NodeDecoupling --> CounterDecrement: Balance decrements 15 km
        CounterDecrement --> PopInRedeemNotice: '-15.0 KM REDEEMED FOR ₹50 VOUCHER'
    }
    RedeemingMiles --> AmbientOrbit: Returns after 2.0s
```

---

## 5. Skyppy Pro Driver Lifecycle State Machine

```mermaid
stateDiagram-v2
    [*] --> OfflineMode: Opens /driver-view
    OfflineMode --> DemandHeatmaps: Inspects Gokulam & Station surge
    OfflineMode --> OnlineMode: Taps 'Go Online Now'

    state OnlineMode {
        [*] --> SearchingTrips: Leaflet map active
        SearchingTrips --> RequestIncoming: Dispatch match triggered
    }

    state RequestIncoming {
        [*] --> Timer15s: Radial timer countdown
        Timer15s --> Decline: Taps Decline or timeout
        Timer15s --> Accept: Taps Accept Ride (₹128)
    }

    Decline --> SearchingTrips
    Accept --> NavigatingToPickup: Status: Picking Up

    state NavigatingToPickup {
        [*] --> TurnByTurnPickup: 'Turn left towards VVCE Gate 2'
        TurnByTurnPickup --> ContactRider: Opens Contact Drawer
        TurnByTurnPickup --> ArrivedPickup: Taps 'I Have Arrived at Pickup'
    }

    state ArrivedPickup {
        [*] --> WaitingTimer: Starts waiting count-up
        WaitingTimer --> FreeGrace: First 3 minutes free
        WaitingTimer --> PaidWaiting: Paid surcharge applied
        WaitingTimer --> TriggerOtp: Taps 'Verify OTP & Start Trip'
    }

    state TriggerOtp {
        [*] --> OtpModal: Prompts 4-digit PIN
        OtpModal --> OtpValidated: Submits 4821
    }

    OtpValidated --> ActiveTrip: Status: Trip In Progress

    state ActiveTrip {
        [*] --> NavigatingDestination: Sayyaji Rao Rd towards Station
        NavigatingDestination --> Speedometer: Live telemetry (28 km/h)
        NavigatingDestination --> SafetyDesk: Opens Driver Safety Center
        NavigatingDestination --> FinishTrip: Taps 'Complete Trip'
    }

    FinishTrip --> SettlementModal: Trip Completed Summary
    state SettlementModal {
        [*] --> FareBreakdown: Gross ₹148 - Fee ₹20 = Net ₹128
        FareBreakdown --> RatePassenger: 5-star rating
        RatePassenger --> ConfirmOnline: Taps 'Confirm & Return to Online'
    }

    ConfirmOnline --> SearchingTrips
```

---

## 6. Interaction Matrix & Micro-Interactions

| Component | Target Screen | Event | Trigger Mechanism | Visual & State Feedback | Consistency Assessment |
|---|---|---|---|---|---|
| **Service Switcher** | `/` & `/courier` | Click | Segment toggle | Animated sliding tab background, instant route navigation | **Consistent** across passenger and courier |
| **Location Input** | `/` | Click | Input row | Navigates to `/location` with pre-filled strings | **Consistent** |
| **Swap Button** | `/` & `/location` | Click | `swap_vert` | Inverts pickup and destination text and coordinates | **Consistent** |
| **Landmark Pin** | `/location` | Click | Leaflet DivIcon | Map smoothly pans to pin, updates store state, shows toast | **Consistent** |
| **Vehicle Category** | `/options` | Click | Vehicle Card | Card acquires blue border, updates selected category and fare | **Consistent** |
| **Fare Breakdown** | `/options` | Click | Link text | Slides up itemized modal with breakdown | **Consistent** |
| **Coupon Code** | `/options` | Click | Promo chip | Applies coupon discount, subtracts amount from total | **Consistent** |
| **Follow Lock** | `/tracking` | Click | Floating control | Toggles between tracking vehicle camera and free pan | **Consistent** |
| **Volumetric Calc** | `/courier/send` | Input | Form fields | Real-time volumetric calculation: $(L \times W \times H) / 5000$ | **Consistent** |
| **The Miles Orbit Node** | `/miles` | Click | SVG `<g>` | Opens animated trip information tooltip | **Consistent** |
| **Simulate Earn** | `/miles` | Click | Action button | Triggers shockwave SVG ripple, adds node, increments balance | **Consistent** |
| **Redeem Voucher** | `/miles` | Click | Action button | Decouples node, decrements balance, shows banner | **Consistent** |
| **Driver Online Toggle** | `/driver-view` | Click | Header button | Transitions between active radar map and demand hotspots | **Consistent** |
| **Driver OTP Autofill** | `/driver-view` | Click | Demo button | Injects "4821" into OTP inputs and enables verification | **Consistent** |
| **Bottom Nav Tabs** | All passenger | Click | Nav item | Spring pill indicator slides to active tab via Framer Motion | **Consistent** |
