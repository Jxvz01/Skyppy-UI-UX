# Skyppy 2.0 | Design System & Token Extraction

> **Document**: Design Tokens, Component System & Styling Specification  
> **Audited Version**: Skyppy 2.0.0 (`skyppy-app-ui`)  
> **Token Sources**: `tailwind.config.js`, `src/index.css`, component-level inline styles

---

## 1. Color Palette & Token Mapping

The application is built on a custom adaptation of Material Design 3 (M3) color roles combined with Skyppy's proprietary high-contrast mobility accents.

### 1.1 Brand Identity Colors

```
Primary (Royal Blue)     : #0042dd   ██████████  var(--color-primary)
Primary Container        : #315ef8   ██████████  var(--color-primary-container)
Secondary (Signal Lime)  : #d4ee66   ██████████  var(--color-secondary-fixed)
Electric Lime Accent     : #d4f84c   ██████████  Direct Hex (Miles Orbit)
Secondary Container      : #d1ec64   ██████████  var(--color-secondary-container)
```

### 1.2 Surface & Elevation Tokens

| Role | Token / Variable | Hex Value | Semantic Description |
|---|---|---|---|
| Deep Space Dark | `bg-[#0a121d]` | `#0a121d` | The Miles Orbit hero centerpiece |
| Deep Space Navy | `bg-[#0c1829]` | `#0c1829` | Home screen Miles bento card |
| Surface Light | `var(--color-surface)` | `#f8f9ff` | Default passenger screen backdrop |
| Surface Low | `var(--color-surface-container-low)` | `#eff4ff` | Subtle tinted containers and chips |
| Surface Standard | `var(--color-surface-container)` | `#e6eeff` | Elevated section backgrounds |
| Surface High | `var(--color-surface-container-high)`| `#dde9fe` | Sub-card borders and hovered items |
| Surface Highest | `var(--color-surface-container-highest)`| `#d7e3f8` | High-contrast container borders |
| Surface Lowest | `var(--color-surface-container-lowest)`| `#ffffff` | Pure white cards, sheets, and popups |
| Surface Dim | `var(--color-surface-dim)` | `#cfdbf0` | Disabled / dimmed background states |

### 1.3 Text & Content Tokens

| Role | Token / Variable | Hex Value | Usage |
|---|---|---|---|
| Text Primary | `var(--color-on-surface)` | `#101c2b` | Page titles, primary numbers, strong headers |
| Text Secondary | `var(--color-on-surface-variant)` | `#434655` | Supporting body copy, card labels |
| Text Tertiary | `var(--color-tertiary)` | `#4d5568` | Secondary meta tags, inactive tab labels |
| Text Muted | `var(--color-outline)` | `#747687` | Subtle timestamps, placeholder text |
| Text Inverted | `var(--color-inverse-on-surface)` | `#eaf1ff` | Text on dark containers |
| White | N/A | `#ffffff` | Text on primary blue / dark buttons |

### 1.4 Semantic & Status Tokens

| Semantic Role | Token Name | Hex Value | Usage |
|---|---|---|---|
| Success / Active | `emerald-500` / `green-500` | `#10b981` / `#22c55e` | Online status pill, pickup pin halo, free flow traffic |
| Warning / Moderate | `amber-500` / `amber-400` | `#f59e0b` / `#fbbf24` | Moderate traffic lines, waiting warnings, speed tags |
| Error / Emergency | `error` / `red-600` | `#ba1a1a` / `#dc2626` | SOS Emergency buttons, cancellation triggers |
| Info / Transit | `sky-500` / `cyan-400` | `#0ea5e9` / `#22d3ee` | Live transit pills, photon light waves |

---

## 2. Typography System

### 2.1 Font Families

- **Display, Headings & Numerics**: `Manrope`, sans-serif (Weights: 600 SemiBold, 700 Bold, 800 ExtraBold).
- **Body Copy, Labels & Controls**: `Inter`, sans-serif (Weights: 400 Regular, 500 Medium, 600 SemiBold, 700 Bold).
- **Monospace Telemetry**: Standard system monospace / `font-mono` (Speeds, OTP codes, distances).
- **Iconography**: `Material Symbols Outlined` via Google Fonts.

### 2.2 Typographic Hierarchy & Scale

```
Token                  Size     Line Height   Weight   Tracking    Family
─────────────────────────────────────────────────────────────────────────────
headline-xl            32px     40px          700      -0.02em     Manrope
headline-xl-mobile     26px     34px          700      -0.02em     Manrope
headline-lg            22px     28px          700      -0.01em     Manrope
headline-md            18px     24px          600      Normal      Manrope
numeric-xl             24px     28px          700      Normal      Manrope
numeric-md             16px     20px          700      Normal      Inter
body-lg                16px     22px          500      Normal      Inter
body-md                14px     20px          400      Normal      Inter
body-sm                12px     16px          400      Normal      Inter
label-lg               14px     18px          600      0.01em      Inter
label-md               12px     16px          600      Normal      Inter
label-sm               10px     12px          700      0.04em      Inter
```

---

## 3. Spacing, Radii & Shadows

### 3.1 Spacing Scale

Defined in `tailwind.config.js`:
- `space-xs`: `0.25rem` (4px)
- `space-sm`: `0.5rem` (8px)
- `gutter`: `1rem` (16px)
- `margin`: `1rem` (16px)
- `space-md`: `1rem` (16px)
- `space-lg`: `1.5rem` (24px)
- `space-xl`: `2rem` (32px)

### 3.2 Border Radii

- `rounded-lg`: `0.5rem` (8px) · Small badge pills, icon containers
- `rounded-xl`: `0.75rem` (12px) · Inputs, action buttons, list item tiles
- `rounded-2xl`: `1rem` (16px) · Standard cards, bottom sheets, vehicle options
- `rounded-3xl`: `1.5rem` (24px) · Hero banners, Miles Bento, tracking map bottom corners
- `rounded-full`: `9999px` · Floating pills, floating action buttons, avatars
- `rounded-[48px]`: `48px` · Desktop simulated device shell enclosure

### 3.3 Elevation & Box Shadows

```css
/* Standard Subtle Card */
.shadow-xs { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }

/* Resting Card */
.shadow-sm { box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1); }

/* Elevated Floating Controls & Pills */
.shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1); }

/* Modals & Overlays */
.shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1); }

/* Desktop Device Shell */
.device-shadow {
  box-shadow: 0 25px 65px -15px rgba(0, 14, 60, 0.4), 0 0 0 10px #111827, 0 0 0 12px #374151;
}
```

---

## 4. Component Patterns

### 4.1 Buttons & Interactive Triggers

1. **Primary Sticky CTA**:
   - Class: `w-full py-4 px-6 rounded-2xl bg-primary text-white font-bold text-base shadow-md active:scale-[0.99] transition-transform`
   - Example: *"Confirm & Book Auto • ₹78"*, *"Create Shipment ->"*.
2. **Segmented Service Switcher**:
   - Pill container: `flex p-1 bg-surface-container rounded-full border border-surface-container-high`
   - Active segment: `bg-primary text-white font-bold shadow-xs`
   - Inactive segment: `text-tertiary hover:text-on-surface`
3. **Floating Map Controls**:
   - Class: `w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-slate-700 shadow-md border border-slate-200/80 flex items-center justify-center hover:bg-white active:scale-95 transition-all cursor-pointer`
   - Includes North compass rose, Follow Driver toggle, Zoom In, Zoom Out, Recenter.

### 4.2 Card Patterns

1. **Plan Your Journey Card**: White background, `rounded-2xl`, dual input fields with location glyphs, vertical swap button.
2. **Vehicle Selection Option Card**:
   - Resting: `bg-white p-3.5 rounded-2xl border border-slate-200/70 hover:border-slate-300`
   - Selected: `bg-blue-50/60 p-3.5 rounded-2xl border-2 border-primary shadow-sm`
3. **Dark Bento Enclosure**:
   - Class: `bg-[#0a121d] text-white rounded-3xl p-5 shadow-2xl border border-white/10 relative overflow-hidden`

### 4.3 Modal & Bottom Sheet Architecture

- **Backdrop**: `fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center`
- **Slide-up Sheet**: `w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto`
- **Drag Handle**: Centered pill `w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4`

---

## 5. Motion, Kinematics & Animation Conventions

### 5.1 The Miles Orbit Kinematics (`MilesOrbit.tsx`)

- **Rotation Mechanism**: Custom delta-time accumulator inside `requestAnimationFrame`.
  ```ts
  const delta = currentTime - lastTime;
  setRotationAngle((prev) => (prev + (delta * 0.0024)) % 360);
  ```
  Produces an ambient, continuous 0.4 RPM revolution without GPU stutter or setInterval drift.
- **Node Coordinate Projection**:
  $$x = \text{center} + r_x \cdot \cos\left(\frac{(\theta + \theta_{\text{rot}}) \cdot \pi}{180}\right)$$
  $$y = \text{center} + r_y \cdot \sin\left(\frac{(\theta + \theta_{\text{rot}}) \cdot \pi}{180}\right)$$
- **Reduced Motion Handling**: Integrates Framer Motion's `useReducedMotion()`. When active, ambient rotation is zeroed, and values snap without transition delays.

### 5.2 Micro-Interactions

- **Active Press State**: `active:scale-95` on small buttons; `active:scale-[0.99]` on large cards.
- **Pulse Indicators**: `animate-ping` on ping dots; `animate-pulse` on active dispatch radar markers.
- **Tab Bar Layout Animation**: Spring layout animation via Framer Motion `layoutId="bottomNavActivePill"`.

---

## 6. Token Implementation Analysis: Shared vs Hardcoded

| Component Category | Using Shared Design Tokens | Using Hardcoded Raw Classes | Observation |
|---|---|---|---|
| **App Shell / Header** | 75% | 25% | Uses `font-label-sm`, `font-headline-lg`, but hardcodes some hex colors |
| **Bottom Navigation** | 90% | 10% | Uses `bg-surface-container-lowest`, `text-primary`, `font-label-sm` |
| **Ride Options** | 60% | 40% | Uses `border-primary`, but hardcodes `bg-slate-50`, `text-slate-900` |
| **The Miles Orbit** | 40% | 60% | Purposefully uses custom dark tokens (`#0a121d`, `#d4ee66`, `#d4f84c`) |
| **OpenStreetMap** | 50% | 50% | Uses `#0042dd` in Leaflet canvas and Leaflet divIcons |
| **Driver View** | 40% | 60% | Independently styled using Tailwind slate / green utilities |
