const fs = require('fs');

// Read current build-single-html.cjs
let script = fs.readFileSync('scripts/build-single-html.cjs', 'utf8');

// The custom SVGs as raw HTML strings
const autoSvg = `
<svg width="220" height="143" viewBox="0 0 240 156" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="auto-roof" x1="40" y1="20" x2="200" y2="50" gradientUnits="userSpaceOnUse">
      <stop stop-color="#FACC15" />
      <stop offset="0.5" stop-color="#EAB308" />
      <stop offset="1" stop-color="#CA8A04" />
    </linearGradient>
    <linearGradient id="auto-body" x1="30" y1="60" x2="210" y2="120" gradientUnits="userSpaceOnUse">
      <stop stop-color="#15803D" />
      <stop offset="0.6" stop-color="#166534" />
      <stop offset="1" stop-color="#14532D" />
    </linearGradient>
    <linearGradient id="auto-glass" x1="140" y1="36" x2="190" y2="70" gradientUnits="userSpaceOnUse">
      <stop stop-color="#BAE6FD" stop-opacity="0.85" />
      <stop offset="1" stop-color="#38BDF8" stop-opacity="0.45" />
    </linearGradient>
    <radialGradient id="auto-wheel" cx="0.5" cy="0.5" r="0.5">
      <stop stop-color="#4B5563" />
      <stop offset="0.6" stop-color="#1F2937" />
      <stop offset="1" stop-color="#111827" />
    </radialGradient>
    <radialGradient id="auto-shadow" cx="50%" cy="50%" r="50%">
      <stop stop-color="#000000" stop-opacity="0.45" />
      <stop offset="1" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
  </defs>
  <ellipse cx="120" cy="144" rx="95" ry="9" fill="url(#auto-shadow)" />
  <path d="M42 108 L195 108 L204 116 L35 116 Z" fill="#0F172A" />
  <path d="M36 84 C36 78 40 74 46 74 L130 74 L142 88 L196 88 C202 88 206 92 206 98 L206 112 C206 115 204 117 201 117 L39 117 C37 117 36 115 36 112 Z" fill="url(#auto-body)" />
  <path d="M38 90 L204 90 L204 94 L38 94 Z" fill="#D1EC64" />
  <path d="M52 48 L124 48 L124 100 L52 100 Z" fill="#1E293B" />
  <path d="M58 84 C58 80 62 76 68 76 L92 76 C96 76 98 80 98 84 L98 98 L58 98 Z" fill="#334155" />
  <path d="M122 52 L122 96" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" />
  <path d="M136 34 L180 34 C184 34 187 36 189 40 L202 74 L138 74 Z" fill="url(#auto-glass)" />
  <line x1="168" y1="72" x2="182" y2="48" stroke="#0F172A" stroke-width="2" stroke-linecap="round" />
  <path d="M40 38 C40 28 48 20 60 20 L166 20 C182 20 196 26 200 36 L206 48 L36 48 Z" fill="url(#auto-roof)" />
  <line x1="42" y1="46" x2="42" y2="76" stroke="#0F172A" stroke-width="4" stroke-linecap="round" />
  <line x1="134" y1="46" x2="134" y2="76" stroke="#0F172A" stroke-width="3" stroke-linecap="round" />
  <path d="M194 74 L210 74 C216 74 220 78 221 84 L221 98 C221 104 216 108 210 108 L194 108 Z" fill="url(#auto-body)" />
  <ellipse cx="218" cy="88" rx="4" ry="6" fill="#FEF08A" />
  <circle cx="72" cy="122" r="22" fill="url(#auto-wheel)" />
  <circle cx="72" cy="122" r="14" fill="#374151" stroke="#4B5563" stroke-width="2" />
  <circle cx="72" cy="122" r="6" fill="#D1D5DB" />
  <line x1="184" y1="106" x2="192" y2="124" stroke="#475569" stroke-width="4" stroke-linecap="round" />
  <circle cx="194" cy="124" r="20" fill="url(#auto-wheel)" />
  <circle cx="194" cy="124" r="12" fill="#374151" stroke="#4B5563" stroke-width="2" />
  <circle cx="194" cy="124" r="5" fill="#D1D5DB" />
  <rect x="156" y="98" width="22" height="9" rx="2" fill="#0042DD" />
  <text x="160" y="105" fill="#FFFFFF" font-size="6" font-weight="bold" font-family="sans-serif">EV</text>
</svg>
`;

// Screen 05 Cinematic Content for Single HTML
const screen05Cinematic = `
<header class="fixed top-0 w-full z-50 pt-safe bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
  <div class="flex items-center justify-between px-margin h-16">
    <div class="flex items-center gap-space-sm">
      <button aria-label="Go back" class="w-11 h-11 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors active:scale-95" onclick="navigateTo('screen-04')" type="button">
        <span class="material-symbols-outlined text-[22px]">arrow_back</span>
      </button>
      <h1 class="font-headline-md text-headline-md text-on-surface" id="s5-header-title">Confirming Ride</h1>
    </div>
    <div class="flex items-center gap-space-sm">
      <button id="s5-skip-btn" onclick="skipCinematicToDetails()" class="text-xs font-bold px-3 py-1.5 rounded-full bg-surface-container text-primary hover:bg-surface-container-high transition-colors" type="button">
        Skip
      </button>
      <img alt="Profile" class="w-8 h-8 rounded-full object-cover" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=128&q=80" onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 64 64\\'%3E%3Ccircle cx=\\'32\\' cy=\\'32\\' r=\\'32\\' fill=\\'%23101c2b\\'/%3E%3Ccircle cx=\\'32\\' cy=\\'24\\' r=\\'10\\' fill=\\'%23d1ec64\\'/%3E%3Cpath d=\\'M16 52c0-8.8 7.2-15 16-15s16 6.2 16 15\\' fill=\\'%23d1ec64\\'/%3E%3C/svg%3E';">
    </div>
  </div>
</header>

<main class="flex-1 flex flex-col relative w-full pt-16 bg-surface min-h-screen pb-10">
  <!-- ACT ONE: SEARCHING STAGE -->
  <div id="s5-act-searching" class="relative w-full px-margin pt-4 flex flex-col items-center justify-between min-h-[560px] text-center">
    <div class="relative mt-2">
      <div class="absolute -inset-4 rounded-3xl bg-primary/20 animate-ping pointer-events-none"></div>
      <div class="relative p-2.5 rounded-2xl bg-surface-container-lowest shadow-xl ring-2 ring-primary/20">
        <div class="w-16 h-16 rounded-xl bg-primary flex items-center justify-center text-white font-extrabold text-2xl shadow-md">
          <span class="material-symbols-outlined text-[36px]">near_me</span>
        </div>
      </div>
    </div>

    <!-- Route Formation Card -->
    <div class="w-full max-w-[330px] bg-surface-container-low rounded-2xl p-4 shadow-sm border border-surface-container my-4">
      <div class="flex items-center justify-between text-xs font-bold text-on-surface mb-3 px-1">
        <span class="text-secondary font-semibold">VVCE Campus, Gokulam</span>
        <span class="text-[10px] text-outline font-medium uppercase tracking-wider">4.2 KM</span>
        <span class="text-primary font-semibold">JSS Medical College</span>
      </div>
      <div class="relative w-full h-8 flex items-center justify-center">
        <div class="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-secondary to-primary rounded-full animate-pulse w-full"></div>
        </div>
      </div>
      <div class="flex items-center justify-between text-[11px] text-on-surface-variant font-medium pt-1">
        <span>Corridor: Gokulam → Bannimantap</span>
        <span class="font-bold text-primary">₹61 Locked</span>
      </div>
    </div>

    <!-- Status Messages -->
    <div class="flex flex-col items-center gap-1.5 min-h-[58px] mb-3">
      <h2 id="s5-searching-text" class="font-headline text-lg font-bold text-on-surface">Confirming your ride in Mysuru...</h2>
      <p class="text-xs text-on-surface-variant font-medium">Verified Mysuru commercial mobility network</p>
    </div>

    <button onclick="skipCinematicToDetails()" class="text-xs text-primary font-bold hover:underline py-2 mb-2" type="button">
      Skip to Booking Details →
    </button>
  </div>

  <!-- ACT TWO: VEHICLE REVEAL STAGE -->
  <div id="s5-act-revealing" class="hidden relative w-full px-margin pt-4 flex flex-col items-center justify-between min-h-[560px] text-center">
    <div class="w-14 h-14 rounded-full bg-secondary-container flex items-center justify-center shadow-lg ring-4 ring-secondary/20 my-2">
      <span class="material-symbols-outlined text-[30px] text-on-secondary-container font-extrabold">check</span>
    </div>

    <div>
      <h2 class="font-headline text-2xl font-black text-on-surface tracking-tight">Your Ride is Confirmed!</h2>
      <p class="text-xs text-on-surface-variant font-medium mt-0.5">Matched with verified Mysuru fleet partner</p>
    </div>

    <div class="w-full max-w-[340px] bg-gradient-to-b from-surface-container-lowest to-surface-container-low rounded-3xl p-5 shadow-xl border border-surface-container relative overflow-hidden">
      <div class="flex justify-between items-center mb-1">
        <span class="px-3 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-[10px] font-extrabold uppercase tracking-wider">Fastest Corridor Match</span>
        <span class="text-[11px] font-bold text-primary">Arrives in 3 mins</span>
      </div>

      <div class="py-2 flex items-center justify-center">
        ${autoSvg}
      </div>

      <div class="text-center mt-1">
        <h3 class="font-headline font-extrabold text-lg text-on-surface">Skyppy Auto</h3>
        <p class="text-xs text-on-surface-variant font-medium">Bajaj RE EV 2024 • Auto Rickshaw</p>
      </div>

      <div class="mt-3 pt-3 border-t border-surface-container/70 flex items-center justify-between text-left">
        <div class="flex items-center gap-2">
          <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=128&q=80" alt="Ramesh K." class="w-8 h-8 rounded-full object-cover ring-2 ring-primary/30">
          <div>
            <span class="font-bold text-xs text-on-surface block leading-tight">Ramesh K.</span>
            <span class="text-[10px] text-secondary font-bold">★ 4.8</span>
          </div>
        </div>
        <span class="text-[11px] font-mono font-bold text-on-surface bg-surface-container px-2 py-1 rounded">KA-09 AB 4217</span>
      </div>
    </div>

    <button onclick="skipCinematicToDetails()" class="text-xs text-primary font-bold hover:underline py-2 mb-2" type="button">
      Continue to Driver Pass →
    </button>
  </div>

  <!-- ACT THREE: CONFIRMED DETAILS PASS -->
  <div id="s5-act-confirmed" class="hidden px-margin flex flex-col gap-space-md pt-2">
    <!-- Confirmed Hero Banner -->
    <div class="relative overflow-hidden rounded-2xl bg-inverse-surface text-inverse-on-surface p-space-md shadow-xl text-center">
      <div class="w-10 h-10 rounded-full bg-secondary-container mx-auto flex items-center justify-center shadow-md mb-2">
        <span class="material-symbols-outlined text-on-secondary-container text-[22px] font-black">check</span>
      </div>
      <h2 class="font-headline text-xl text-inverse-on-surface font-extrabold">Ride Booked &amp; Confirmed!</h2>
      <p class="text-xs text-surface-dim mt-0.5">Your verified driver is en route in Bannimantap corridor</p>
    </div>

    <!-- Start OTP Card -->
    <div class="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-surface-container/60 flex flex-col gap-2">
      <div class="flex items-center justify-between">
        <div>
          <span class="text-[10px] font-extrabold uppercase text-secondary tracking-wider block">Start OTP</span>
          <p class="text-[11px] text-on-surface-variant">Share with driver upon boarding</p>
        </div>
        <span class="font-mono text-xl font-black text-primary tracking-widest bg-primary/10 px-3 py-1 rounded-xl border border-primary/20">5482</span>
      </div>
      <div class="flex items-center justify-between pt-2 border-t border-surface-container-low text-xs">
        <span class="text-on-surface-variant font-medium">Booking ID</span>
        <span class="font-mono font-bold text-on-surface">SKY784392</span>
      </div>
    </div>

    <!-- Driver Card -->
    <div class="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-surface-container/60 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=128&q=80" alt="Ramesh K." class="w-12 h-12 rounded-full object-cover ring-2 ring-primary/30">
        <div>
          <h3 class="font-headline font-bold text-sm text-on-surface">Ramesh K.</h3>
          <span class="text-xs text-secondary font-bold">★ 4.8 <span class="text-outline font-normal text-[10px]">(Demo Data)</span></span>
          <span class="text-xs font-mono font-semibold block text-on-surface">KA-09 AB 4217 <span class="text-outline font-normal text-[9px]">(Fictional)</span></span>
        </div>
      </div>
      <button onclick="openModal('chat')" class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface" type="button">
        <span class="material-symbols-outlined text-[18px]">chat</span>
      </button>
    </div>

    <!-- Primary Action Controls -->
    <div class="flex flex-col gap-2 mt-1">
      <button onclick="navigateTo('screen-06')" class="w-full h-14 rounded-full bg-primary text-on-primary font-headline-md text-headline-md font-bold flex items-center justify-center gap-2 shadow-lg active:scale-[0.99] transition-all cursor-pointer" type="button">
        <span>Track Live Ride</span>
        <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
      </button>
      <button onclick="openModal('cancel-sheet')" class="w-full py-2.5 text-center font-label-md text-xs font-semibold text-error hover:opacity-80" type="button">
        Cancel Booking
      </button>
    </div>
  </div>
</main>
`;
`;

console.log('Script prepared');

