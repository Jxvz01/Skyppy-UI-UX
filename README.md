# Skyppy 2.0 — Urban Passenger Mobility (Mysuru)

A fully functional, interactive frontend prototype of **Skyppy 2.0**, built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, **React Router**, and **Zustand**. The visual design faithfully mirrors the Stitch design source of truth with complete cross-screen flows, state management, simulated live telemetry, and theme customization.

---

## 📱 Connected Screens (10 Screens)

| # | Screen Name | Route | Shell Type | Key Functional Interactions |
|---|---|---|---|---|
| **01** | **Rides Home** | `/` | `mobile_tab` | Mysuru Palace silhouette canopy, Live transit pill, Instant Ride & Schedule modes, Quick Shortcuts (*Home, Work, Saved, Station*), Skyppy Miles card, Recent destinations list. |
| **02** | **Destination Search** | `/search` | `mobile_stack` | Real-time text search filtering, pickup/drop location swap, category filter chips (*All, Recent, Saved, Nearby Transit, Popular Hubs*), voice search mic simulation, "Set pin on live map" CTA. |
| **03** | **Location Selection** | `/location` | `mobile_stack` | Nocturnal vector map of Mysuru (Kukkarahalli Lake, Chamundi foothills, Palace Ward), animated glowing route polyline (`VVCE Gokulam → JSS Bannimantap`), route verification bottom sheet with preference chips. |
| **04** | **Ride Options** | `/options` | `mobile_stack` | Interactive vehicle tier selector: **Auto** (₹76), **Mini** (₹112), **Sedan** (₹156), **SUV** (₹228); live dynamic fare calculation, payment method selector sheet, promo coupon application (`MILES15`). |
| **05** | **Booking Confirmation** | `/confirm` | `mobile_stack` | Success confirmation card with lime checkmark ring, dynamic driver pod (**Ramesh K.** • 4.8★ • `KA-09 AB 4217`), Booking ID copy tool (`SKY784392`), in-app driver chat, pickup OTP display (`4891`). |
| **06** | **Live Ride Tracking** | `/tracking` | `mobile_stack` | Live night map with simulated auto rickshaw GPS movement, dynamic speed indicator (24 km/h), 4 min arrival countdown, Start OTP (`5482`), 4-stage ride stepper, cancellation sheet with grace timer, simulate trip completion. |
| **07** | **Skyppy Miles** | `/miles` | `mobile_tab` | 100% distance-backed loyalty dashboard (248.6 KM), Tier-2 Explorer status, Milestone progress gauge to 300 KM, voucher carousel with "Apply to Next Ride" redirecting to Ride Options, explainer modal. |
| **08** | **Activity / History** | `/activity` | `mobile_tab` | Trip ledger & history, Active ongoing ride banner, tab filters (`All`, `Completed`, `Scheduled`, `Cancelled`), monthly stats summary, ride receipt modal with PDF download toast, one-tap rebooking. |
| **09** | **Profile & Account** | `/profile` | `mobile_tab` | User account header (**Jeevan H.**, Tier 2 Explorer), lifetime mobility metrics (28 Rides, 248.6 KM, ₹2,480 spent), quick links to Activity & Miles, payment options, and safety toolkit. |
| **10** | **Appearance / Theme** | `/theme` | `mobile_stack` | Full theme selector: **Light Mode**, **Dark Mode**, and **System Default**; live mini preview pod, design tokens swatch palette, global instant DOM toggling and `localStorage` persistence. |

---

## 🛠️ Tech Stack
- **Framework**: React 18 + TypeScript
- **Bundler & Dev Server**: Vite 5
- **Routing**: React Router DOM v6
- **State Management**: Zustand v5 with `localStorage` persistence
- **Styling**: Tailwind CSS v3 with semantic color variables
- **Icons & Typography**: Google Material Symbols Outlined, Google Fonts `Manrope` (headlines & numbers) and `Inter` (body & labels)

---

## 🚀 How to Run Locally

1. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

2. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

3. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🎨 Global Features & Prototype Controls

1. **Integrated Device Frame Simulator**:
   - Realistic iPhone 16 Pro mockup frame with titanium bezel, dynamic island, and live status bar clock.
   - **View Mode Switcher**: Toggle between **Mobile Mockup Frame** and **Full Responsive Canvas** from the top studio toolbar.
   - **Direct Screen Switcher**: One-click pills along the top bar to jump directly into any of the 10 screens.
   - **Start Booking Tour**: Resets state and starts the booking journey from Screen 01.
2. **Global Modals (Accessible Everywhere)**:
   - **Notifications Bell** in header: Opens slide-up **Mysuru Live Alerts** drawer.
   - **Safety Shield** in header: Opens **24/7 Safety Toolkit** (Police 112, live trip sharing, emergency helpline).
   - **In-App Driver Chat**: Send messages to driver Ramesh K. with quick canned replies and simulated driver responses.
   - **Trip Scheduler**: Book advance rides with custom date & time chips.
   - **Ride Receipts**: View detailed receipt modal with breakdown and PDF export.
3. **Theme Customization**:
   - Supports **Light Mode**, **Dark Mode**, and **System Default**.
   - Theme changes apply globally to every element, map, card, and modal with zero flicker.
   - Selection persists across page refreshes via `localStorage`.

---

## 📦 Figma Handoff Documentation

The `/figma-handoff` directory contains complete handoff assets:
- [`screen-inventory.md`](file:///c:/Users/Shubha/Desktop/Projects/skyppy-app-ui/figma-handoff/screen-inventory.md): Screen breakdown, visual elements, and states.
- [`design-tokens.json`](file:///c:/Users/Shubha/Desktop/Projects/skyppy-app-ui/figma-handoff/design-tokens.json): Full W3C/Figma-compatible design tokens for colors, typography, spacing, and radii.
- [`component-inventory.md`](file:///c:/Users/Shubha/Desktop/Projects/skyppy-app-ui/figma-handoff/component-inventory.md): Component library architecture, variants, and props.
- [`asset-inventory.md`](file:///c:/Users/Shubha/Desktop/Projects/skyppy-app-ui/figma-handoff/asset-inventory.md): All SVGs, icon mappings, font CDN links, and photo URLs.
- [`screen-to-route-mapping.md`](file:///c:/Users/Shubha/Desktop/Projects/skyppy-app-ui/figma-handoff/screen-to-route-mapping.md): Complete route tree and transition triggers.
- [`import-instructions.md`](file:///c:/Users/Shubha/Desktop/Projects/skyppy-app-ui/figma-handoff/import-instructions.md): Guide for importing into Figma via HTML to Design or Figma Tokens.
