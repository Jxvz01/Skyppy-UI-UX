# Skyppy 2.0 — Screen to Route Mapping

This document specifies the routing architecture, state handoffs, and transitions connecting all 10 application screens.

```
┌───────────────────┐
│   01 Rides Home   │◀──────────────────────────────┐
│        (/)        │                               │
└─────────┬─────────┘                               │
          │                                         │
          │ (Instant Ride / Search Trigger)         │
          ▼                                         │
┌───────────────────┐                               │
│ 02 Dest Search    │                               │
│     (/search)     │                               │
└─────────┬─────────┘                               │
          │                                         │
          │ (Set Pin / Pick Destination)            │
          ▼                                         │
┌───────────────────┐                               │
│ 03 Loc Selection  │                               │
│    (/location)    │                               │
└─────────┬─────────┘                               │
          │                                         │
          │ (Confirm Route)                         │
          ▼                                         │
┌───────────────────┐                               │
│  04 Ride Options  │                               │
│    (/options)     │                               │
└─────────┬─────────┘                               │
          │                                         │
          │ (Book Vehicle)                          │
          ▼                                         │
┌───────────────────┐                               │
│ 05 Confirmation   │                               │
│    (/confirm)     │                               │
└─────────┬─────────┘                               │
          │                                         │
          │ (Track Live Ride)                       │
          ▼                                         │
┌───────────────────┐      (Simulate Finish)        │
│ 06 Live Tracking  │───────────────────────────────┼────────┐
│   (/tracking)     │                               │        │
└─────────┬─────────┘                               │        │
          │ (Cancel Ride)                           │        │
          └─────────────────────────────────────────┘        │
                                                             │
┌───────────────────┐                                        │
│  07 Skyppy Miles  │◀───────────────────────────────────────┤
│     (/miles)      │ (View Rewards / Miles Dashboard)       │
└───────────────────┘                                        │
                                                             │
┌───────────────────┐                                        ▼
│    08 Activity    │◀───────────────────────────────────────┘
│    (/activity)    │ (Completed Ledger & History)
└───────────────────┘

┌───────────────────┐
│    09 Profile     │
│    (/profile)     │
└─────────┬─────────┘
          │ (Settings / Theme)
          ▼
┌───────────────────┐
│ 10 Theme Settings │
│     (/theme)      │
└───────────────────┘
```

---

## Screen Transition Directory

| Source Screen | Trigger Element | Destination | Shared State Passed |
|---|---|---|---|
| **01 Rides Home** | "Instant Ride" button or Search Bar | `/search` | `pickup` (VVCE Campus) |
| **01 Rides Home** | Quick Shortcut (*Home, Work, Station*) | `/location` | `destination: { title, distanceKm, durationMin }` |
| **01 Rides Home** | "Schedule Trip" button | Schedule Modal | Date & Time pickers, Route |
| **01 Rides Home** | Repeat Recent (*VVCE → JSS Medical*) | `/options` | `destination: "JSS Medical College"` |
| **01 Rides Home** | Skyppy Miles Loyalty card | `/miles` | `miles: 248.6 km` |
| **02 Dest Search** | Back Arrow | `/` | Preserved state |
| **02 Dest Search** | "Set pin on live map" | `/location` | `pickup` + `destination` coordinates |
| **02 Dest Search** | Click search item or press Enter | `/location` | Selected destination object |
| **02 Dest Search** | Swap button | `/search` | Swapped `pickup` and `destination` |
| **03 Loc Selection** | Back Arrow | `/search` | Preserved search state |
| **03 Loc Selection** | "Continue to Ride Options" | `/options` | Verified route & preferences |
| **04 Ride Options** | Back Arrow | `/location` | Preserved vehicle choices |
| **04 Ride Options** | Vehicle Card (*Auto, Hatchback, Sedan*) | `/options` | `selectedVehicleId`, updated fare calculation |
| **04 Ride Options** | Voucher Bar | `/options` | Applied coupon discount (`-₹15`) |
| **04 Ride Options** | "Book [Vehicle]" Sticky CTA | `/confirm` | Generated `activeBooking` object with OTP |
| **05 Confirmation** | Back Arrow | `/options` | Active booking preserved |
| **05 Confirmation** | "Message Driver" button | Chat Modal | Open chat drawer with Ramesh K. |
| **05 Confirmation** | "Track Live Ride" CTA | `/tracking` | `activeBooking` in approach stage |
| **05 Confirmation** | "Cancel Booking" | `/` | Cancel booking reason, reset active state |
| **06 Live Tracking** | Back Arrow | `/` | Minimized tracking banner on Home |
| **06 Live Tracking** | "Simulate Trip Completion" | `/activity` | Credits +4.2 km Miles, adds to history |
| **06 Live Tracking** | "Cancel Booking" | `/` | Free cancellation confirmation |
| **07 Skyppy Miles** | "Apply to Next Ride" button | `/options` | Applies voucher discount to ride selector |
| **08 Activity** | "Track" on Active banner | `/tracking` | Active ride tracking view |
| **08 Activity** | "Receipt" button | Receipt Modal | Itemized invoice & PDF export |
| **08 Activity** | "Rebook" button | `/options` | Pre-populates origin & destination |
| **09 Profile** | Lifetime Stat Cards | `/activity`, `/miles` | Filtered tabs |
| **09 Profile** | Appearance / Theme Settings | `/theme` | `theme`: `'light' \| 'dark' \| 'system'` |
| **10 Theme** | Back Arrow | `/profile` | Persisted theme preference in `localStorage` |

