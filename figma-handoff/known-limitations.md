# Skyppy 2.0 — Known Limitations & Prototype Boundaries

This document outlines intentional prototype boundaries, simulated behaviors, and technical prerequisites for production implementation.

---

## 1. Prototype Boundaries

| Feature | Prototype Behavior | Production Implementation Requirement |
|---|---|---|
| **Driver Matching & Dispatch** | Local deterministic state simulation (Ramesh K. in Auto KA-09 AB 4217). | WebSocket / SSE dispatch engine connecting to Skyppy Driver Partner Android app. |
| **Maps & Route Polyline** | Responsive SVG vector canvas with simulated corridor road coordinates and vehicle movement jitter. | Mapbox GL JS / Google Maps SDK with turn-by-turn Directions API. |
| **Payment Gateways** | Simulated UPI AutoPay, Saved Cards, and Cash settlement with auto-wallet deduction. | Razorpay / Juspay / Cashfree UPI Intent & Mandate integration with webhooks. |
| **SMS & Phone OTP** | Generated 4-digit numeric string verified on client state. | Twilio / Exotel / Gupshup SMS gateway with rate limiting and replay prevention. |
| **Voice Search** | Instant trigger simulation fallback to text input. | Web Speech API (`webkitSpeechRecognition`) with regional Kannada/English speech-to-text models. |
| **PDF Invoices** | Simulated download toast notification and preview receipt modal. | Backend PDF rendering service (Puppeteer / PDFKit) streaming signed GST tax invoices. |

---

## 2. Supported Fleet Scope

- **Official Passenger Categories**:
  - `Auto`: 3 passengers, standard Mysuru rickshaw fleet.
  - `Hatchback (Mini)`: 4 passengers, compact air-conditioned city car.
  - `Sedan (Comfort)`: 4 passengers, premium legroom sedan.
- **Excluded Fleets**:
  - `SUV`: Not in current Mysuru passenger fleet operations.
  - `Skyppy Move`: Commercial goods and parcel logistics; maintained under a separate product vertical.

---

## 3. Data Persistence

- All mock activity, edited profile fields, saved places, and loyalty miles persist locally via browser `localStorage`.
- State survives page reloads and tab closures.
- Can be reset at any time using the "Reset Prototype Demo Data" button on the Profile screen.

