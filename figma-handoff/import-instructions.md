# Skyppy 2.0 — Figma Import Instructions

This guide provides step-by-step instructions for importing the Skyppy 2.0 frontend prototype into Figma with intact layers, auto-layout, vectors, fonts, and design tokens.

---

## Method 1: Using the "HTML to Design" Figma Plugin (Recommended)

1. **Launch the local Skyppy Vite server**:
   ```bash
   npm run dev
   ```
   Note the local URL (usually `http://localhost:3000`).

2. **Open Figma**:
   - Create a new Figma file or open your mobile design system file.
   - Go to **Plugins** → Search for **"html.to.design"**.

3. **Import Screen URLs**:
   - Set viewport to **iPhone 16 Pro** (393 × 852 px or 412 × 884 px).
   - Enter the target screen route:
     - Home: `http://localhost:3000/`
     - Search: `http://localhost:3000/search`
     - Location: `http://localhost:3000/location`
     - Options: `http://localhost:3000/options`
     - Booking: `http://localhost:3000/confirm`
     - Tracking: `http://localhost:3000/tracking`
     - Miles: `http://localhost:3000/miles`
     - Activity: `http://localhost:3000/activity`
     - Profile: `http://localhost:3000/profile`
     - Theme Settings: `http://localhost:3000/theme`
   - Click **Import**.

4. **Verify Imported Layers**:
   - Auto-layout frames are preserved automatically.
   - Typography uses Google Fonts `Manrope` and `Inter`.
   - SVG vector paths (such as the Mysuru Palace Silhouette and nocturnal map vectors) import as native editable vector shapes.

---

## Method 2: Importing Design Tokens into Figma Variables

1. Install the **"Tokens Studio for Figma"** plugin (formerly Figma Tokens).
2. Open the plugin in your Figma document.
3. Click **Settings** → **Add New Set** → Load JSON file:
   - Select `/figma-handoff/design-tokens.json`.
4. Apply the tokens to create native **Figma Variables** for:
   - Color modes: `light` vs `dark`.
   - Typography font families: `Manrope` and `Inter`.
   - Spacing & Radius tokens: `gutter (16px)`, `radius-2xl (20px)`, `radius-3xl (28px)`.

---

## Method 3: Direct Component Assembly

If assembling manually:
1. Create a frame sized **412 × 884 px** (Android Large / Modern iOS Frame).
2. Place the **Header** component at the top with fixed constraint `Top & Center`.
3. Place the **BottomNav** component at the bottom with fixed constraint `Bottom & Center`.
4. Populate screen body content with auto-layout padding of `16px` (`px-margin`).
5. Ensure icons use the **Material Symbols Outlined** font family or the SVGs from `/figma-handoff/asset-inventory.md`.

