const fs = require('fs');
const path = require('path');

const files = {
  '01': '01-rides-home.html',
  '02': '02-destination-search.html',
  '03': '03-location-selection.html',
  '04': '04-ride-options.html',
  '05': '05-booking-confirmation.html',
  '06': '06-live-ride-tracking.html',
  '07': '07-skyppy-miles.html',
  '08': '08-activity.html',
  '09': '09-profile.html'
};

const screens = {};
for (const [key, file] of Object.entries(files)) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Clean up broken images
  const badUrl = 'https://lh3.googleusercontent.com/aida/ALJJyrCwNqtA-Abwimqm_X7XNW7LUW3h0MLfVdZw-mKEMlabxoIfk3uXD0E8QV5CFcE0jJaxK0szJ8gbPyaEX-yWILSjAXCtkU86CUpzMlDO__og5Lu5bAQUtH58BrJkcjKU7n8T6_d8r7LSY0MFqmIZwU6hLfcC5dLFIid5ajnF2ay0RvnrirkDSkASdnhslamlp1b4FSv0N8q3BlzwOk0Q2eHVa1jz_Ou_DshTmfJZLA8o';
  const goodUrl = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=128&q=80';
  content = content.replace(new RegExp(badUrl, 'g'), goodUrl);
  
  const headerMatch = content.match(/<header[\s\S]*?<\/header>/i);
  const mainMatch = content.match(/<main[\s\S]*?<\/main>/i);
  
  screens[key] = {
    header: headerMatch ? headerMatch[0] : '',
    main: mainMatch ? mainMatch[0] : ''
  };
}

// Build Screen 10 (Appearance & Theme Settings)
const screen10Header = `
<header class="fixed top-0 w-full z-50 pt-safe bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
  <div class="flex items-center justify-between px-margin h-16">
    <div class="flex items-center gap-space-sm">
      <button aria-label="Go back" class="w-11 h-11 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors active:scale-95" onclick="navigateTo('screen-09')" type="button">
        <span class="material-symbols-outlined text-[22px]">arrow_back</span>
      </button>
      <h1 class="font-headline-md text-headline-md text-on-surface">10 Appearance & Theme</h1>
    </div>
    <div class="flex items-center gap-space-sm">
      <button aria-label="Help & Safety" class="w-11 h-11 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors" type="button" onclick="openModal('notifications')">
        <span class="material-symbols-outlined text-[20px]">shield</span>
      </button>
      <img alt="Profile" class="w-8 h-8 rounded-full object-cover" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=128&q=80" onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 64 64\\'%3E%3Ccircle cx=\\'32\\' cy=\\'32\\' r=\\'32\\' fill=\\'%23101c2b\\'/%3E%3Ccircle cx=\\'32\\' cy=\\'24\\' r=\\'10\\' fill=\\'%23d1ec64\\'/%3E%3Cpath d=\\'M16 52c0-8.8 7.2-15 16-15s16 6.2 16 15\\' fill=\\'%23d1ec64\\'/%3E%3C/svg%3E';">
    </div>
  </div>
</header>
`;

const screen10Main = `
<main class="flex-1 flex flex-col relative w-full pt-16 pb-24 bg-surface min-h-screen">
  <div class="flex flex-col w-full px-margin py-4 gap-4">
    <div class="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/10">
      <h2 class="font-headline-md font-bold text-on-surface text-lg mb-1">Display & Theme Preference</h2>
      <p class="font-body-sm text-sm text-on-surface-variant mb-4">Choose your preferred appearance mode for daytime commuting or nocturnal night rides in Mysuru.</p>
      
      <div class="flex flex-col gap-3">
        <!-- Light Mode Card -->
        <div onclick="setTheme('light')" id="theme-card-light" class="p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between border-primary bg-primary/5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary">
              <span class="material-symbols-outlined text-[24px]">light_mode</span>
            </div>
            <div>
              <h3 class="font-bold text-sm text-on-surface">Light Mode (Daylight)</h3>
              <p class="text-xs text-on-surface-variant">Bright crisp contrast, optimal for sunny Mysuru afternoons</p>
            </div>
          </div>
          <span class="material-symbols-outlined text-primary text-[22px]" id="theme-check-light">check_circle</span>
        </div>

        <!-- Dark Mode Card -->
        <div onclick="setTheme('dark')" id="theme-card-dark" class="p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between border-outline-variant/30 hover:border-primary/50">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-secondary">
              <span class="material-symbols-outlined text-[24px]">dark_mode</span>
            </div>
            <div>
              <h3 class="font-bold text-sm text-on-surface">Dark Mode (Nocturnal)</h3>
              <p class="text-xs text-on-surface-variant">Deep obsidian tones, reduced glare for evening journeys</p>
            </div>
          </div>
          <span class="material-symbols-outlined text-outline text-[22px] hidden" id="theme-check-dark">check_circle</span>
        </div>
      </div>
    </div>

    <!-- Live Preview Card -->
    <div class="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant/10 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
          <span class="material-symbols-outlined text-[18px]">palette</span>
        </div>
        <div>
          <span class="font-bold text-xs text-on-surface block">Theme Persistence</span>
          <span class="text-[11px] text-on-surface-variant">Automatically saved to browser local storage</span>
        </div>
      </div>
      <button onclick="toggleTheme()" class="px-3 py-1.5 rounded-full bg-primary text-on-primary text-xs font-bold active:scale-95 transition-transform" type="button">
        Quick Toggle
      </button>
    </div>
  </div>
</main>
`;

screens['10'] = { header: screen10Header, main: screen10Main };

// Read base template and Tailwind setup from 01-rides-home.html
const raw01 = screens['01'] ? fs.readFileSync('01-rides-home.html', 'utf8') : '';
const headMatch = raw01.match(/<head[\s\S]*?<\/head>/i);
const headContent = headMatch ? headMatch[0] : '';

// Generate unified skyppy.html
const fullHtml = `<!DOCTYPE html>
<html class="light" lang="en">
${headContent}
<style>
  /* Custom scrollbar and standalone frame styling */
  ::-webkit-scrollbar { display: none; }
  * { -ms-overflow-style: none; scrollbar-width: none; }
  
  body {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #0b1320;
    font-family: 'Inter', sans-serif;
  }

  #smartphone-preview-frame {
    position: relative;
    width: 390px;
    height: 844px;
    max-height: 100vh;
    border-radius: 46px;
    background-color: #f8f9ff;
    box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 0 12px #1f2937, 0 0 0 14px #374151;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 480px) {
    body { background-color: #f8f9ff; }
    #smartphone-preview-frame {
      width: 100vw;
      height: 100vh;
      border-radius: 0;
      box-shadow: none;
    }
    #phone-dynamic-island { display: none; }
  }

  #phone-viewport {
    flex: 1;
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
    overscroll-behavior-y: none;
  }

  .screen-section {
    display: none;
    width: 100%;
    min-height: 100%;
  }

  .screen-section.active {
    display: flex;
    flex-direction: column;
  }
</style>
<body class="antialiased">

  <!-- SMARTPHONE SHELL PREVIEW CONTAINER -->
  <div id="smartphone-preview-frame">
    <!-- Realistic Status Bar -->
    <div class="h-11 w-full bg-surface/90 backdrop-blur-md sticky top-0 z-[60] flex items-center justify-between px-7 text-xs font-semibold text-on-surface select-none border-b border-surface-container-low/40">
      <span id="status-clock" class="tracking-tight">09:41</span>
      <!-- Dynamic Island Pill -->
      <div id="phone-dynamic-island" class="w-24 h-4 bg-black rounded-full shadow-inner flex items-center justify-end px-2 gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-slate-800"></span>
        <span class="w-2 h-2 rounded-full bg-blue-950/80"></span>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="material-symbols-outlined text-[14px]">signal_cellular_4_bar</span>
        <span class="material-symbols-outlined text-[14px]">wifi</span>
        <span class="material-symbols-outlined text-[16px] text-secondary">battery_full</span>
      </div>
    </div>

    <!-- PHONE VIEWPORT (CONTAINS ALL 10 SCREENS) -->
    <div id="phone-viewport">
      <!-- Screen 01: Rides Home -->
      <section id="screen-01" class="screen-section active">
        ${screens['01'].header}
        ${screens['01'].main}
      </section>

      <!-- Screen 02: Destination Search -->
      <section id="screen-02" class="screen-section">
        ${screens['02'].header}
        ${screens['02'].main}
      </section>

      <!-- Screen 03: Location Selection -->
      <section id="screen-03" class="screen-section">
        ${screens['03'].header}
        ${screens['03'].main}
      </section>

      <!-- Screen 04: Ride Options -->
      <section id="screen-04" class="screen-section">
        ${screens['04'].header}
        ${screens['04'].main}
      </section>

      <!-- Screen 05: Booking Confirmation -->
      <section id="screen-05" class="screen-section">
        
<header class="sticky top-0 w-full z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-5 h-16 shrink-0 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
  <button id="s5-back-btn" onclick="navigateTo('screen-04')" class="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors" type="button" aria-label="Back">
    <span class="material-symbols-outlined text-[20px]">arrow_back</span>
  </button>
  <div class="flex items-center gap-2">
    <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shadow-sm shrink-0">
      <svg class="w-4 h-4 text-white -translate-y-px translate-x-px" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
      </svg>
    </div>
    <div class="flex flex-col text-left leading-none">
      <span class="font-extrabold text-lg text-slate-900 tracking-tight font-headline">Skyppy</span>
      <span class="text-[8px] font-bold uppercase tracking-[0.22em] text-slate-400 mt-0.5">Urban Mobility</span>
    </div>
  </div>
  <button onclick="openModal('notifications')" class="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors" type="button" aria-label="Help">
    <span class="material-symbols-outlined text-[19px]">shield</span>
  </button>
</header>

<main class="flex-1 flex flex-col w-full relative bg-[#f8f9fc] text-[#101c2b] pb-6">
  <!-- SCREEN ONE: FINDING AN AVAILABLE VEHICLE -->
  <div id="ref-screen-searching" class="flex-1 flex flex-col justify-between px-5 pt-4 pb-4">
    <div class="text-center mt-1">
      <h1 class="font-extrabold text-[22px] text-slate-900 tracking-tight leading-snug">Confirming your ride</h1>
      <p class="text-xs text-slate-500 font-medium mt-1">Finding the best available vehicle near you...</p>
    </div>

    <!-- Map Canvas Visualisation -->
    <div class="relative w-full h-[320px] rounded-3xl bg-[#f0f4f9]/90 border border-slate-200/60 overflow-hidden my-4 flex items-center justify-center shadow-inner">
      <svg class="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="80" x2="100%" y2="80" stroke="#cbd5e1" stroke-width="1" />
        <line x1="0" y1="160" x2="100%" y2="160" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="4 4" />
        <line x1="0" y1="240" x2="100%" y2="240" stroke="#cbd5e1" stroke-width="1" />
        <line x1="80" y1="0" x2="80" y2="100%" stroke="#cbd5e1" stroke-width="1" />
        <line x1="190" y1="0" x2="190" y2="100%" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="4 4" />
        <line x1="290" y1="0" x2="290" y2="100%" stroke="#cbd5e1" stroke-width="1" />
        <path d="M-20 220 L180 80 L380 40" stroke="#cbd5e1" stroke-width="2.5" fill="none" />
      </svg>
      <span class="absolute bottom-4 left-6 text-[11px] font-bold text-slate-400/60 uppercase tracking-[0.35em]">M y s u r u</span>

      <!-- Blue Route Path -->
      <svg class="absolute inset-0 w-full h-full pointer-events-none">
        <path d="M 64 195 Q 160 215, 205 180 T 295 160" stroke="#93c5fd" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.45" />
        <path d="M 64 195 Q 160 215, 205 180 T 295 160" stroke="#0042dd" stroke-width="4" fill="none" stroke-linecap="round" />
      </svg>

      <!-- Left Pickup Callout -->
      <div class="absolute left-6 top-[130px] flex flex-col items-center">
        <div class="bg-white rounded-xl shadow-md border border-slate-100 px-3 py-1.5 mb-1.5 max-w-[130px] text-center">
          <span class="text-[11px] font-bold text-slate-800 leading-snug block truncate">VVCE Campus</span>
          <span class="text-[9px] text-slate-400 block truncate">Gokulam</span>
        </div>
        <div class="w-4 h-4 rounded-full bg-primary ring-4 ring-blue-100 shadow-sm"></div>
      </div>

      <!-- Right Drop Callout -->
      <div class="absolute right-6 top-[95px] flex flex-col items-center">
        <div class="bg-white rounded-xl shadow-md border border-slate-100 px-3 py-1.5 mb-1.5 max-w-[130px] text-center">
          <span class="text-[11px] font-bold text-slate-800 leading-snug block truncate">JSS Medical</span>
          <span class="text-[9px] text-slate-400 block truncate">College</span>
        </div>
        <div class="w-5 h-5 text-primary flex items-center justify-center">
          <span class="material-symbols-outlined text-[24px]">location_on</span>
        </div>
      </div>

      <!-- Animated Car -->
      <div class="absolute flex items-center justify-center" style="top: 160px; left: 165px;">
        <div class="absolute w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 animate-ping"></div>
        <div class="relative w-8 h-4 bg-white rounded-md shadow-md border border-slate-300 flex items-center justify-between px-1 z-10 rotate-[12deg]">
          <div class="w-1.5 h-2.5 bg-slate-900 rounded-xs"></div>
          <div class="w-2.5 h-2 bg-slate-700 rounded-xs"></div>
          <div class="w-1.5 h-2.5 bg-slate-900 rounded-xs"></div>
        </div>
      </div>
    </div>

    <!-- Progress List Card -->
    <div class="w-full bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 flex flex-col gap-4">
      <div class="flex items-center gap-3 relative">
        <div class="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-[13px] font-bold">check</span>
        </div>
        <span class="text-sm font-medium text-slate-700">Ride requested</span>
        <div class="absolute left-[9px] top-6 w-[2px] h-4 bg-primary/40"></div>
      </div>
      <div class="flex items-center gap-3 relative">
        <div class="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center shrink-0 bg-white">
          <div class="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
        </div>
        <span class="text-sm font-bold text-slate-900">Finding a nearby vehicle</span>
        <div class="absolute left-[9px] top-6 w-[2px] h-4 bg-slate-200"></div>
      </div>
      <div class="flex items-center gap-3">
        <div class="w-5 h-5 rounded-full border border-slate-300 bg-white flex items-center justify-center shrink-0"></div>
        <span class="text-sm text-slate-400">Finalising your booking</span>
      </div>
    </div>

    <div class="text-center mt-2">
      <button onclick="showConfirmedScreenRef()" class="text-xs text-primary font-bold hover:underline py-1" type="button">
        Skip to Confirmed Pass →
      </button>
    </div>
  </div>

  <!-- SCREEN TWO: YOUR RIDE IS CONFIRMED! -->
  <div id="ref-screen-confirmed" class="hidden flex-1 flex flex-col justify-between px-5 pt-3 pb-3">
    <!-- Confirmed Checkmark Header -->
    <div class="flex flex-col items-center text-center mt-1">
      <div class="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-xs mb-2">
        <span class="material-symbols-outlined text-[20px] font-black">check</span>
      </div>
      <h1 class="font-extrabold text-[22px] text-slate-900 tracking-tight leading-snug">Your ride is confirmed!</h1>
      <p class="text-xs text-slate-500 font-medium mt-0.5">Your auto is on the way to pickup location.</p>
    </div>

    <!-- Vehicle Presentation -->
    <div class="relative w-full h-[180px] flex items-center justify-center my-1">
      <div class="absolute w-64 h-24 rounded-full bg-blue-100/50 blur-xl pointer-events-none"></div>
      <div class="absolute bottom-2 w-48 h-3.5 bg-slate-900/10 rounded-full blur-xs pointer-events-none"></div>
      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGpm9AeQiLQG5LlVHb7EORaevjaqZ1oTwZRFLe2w-g9ln09iPFCctXR70CNGfrMtujRzt3ugtB_4MhMdkGq698IXwUIhmJE-VXTGbMG2u4SCfHerWXhruYnnZEsseZj4T16u1lx2xBYsIM6aSztUN8Qx7TPc_pHhk_zWD0g4fVHdgk4CHpWPui_y9GE4TtRK4ZEp2wlSOuHfnIacHeiUiifs0yp2LWv4OqayF-9iY" alt="Auto" class="relative z-10 max-h-[145px] object-contain drop-shadow-sm select-none" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80';">
    </div>

    <!-- Driver & Vehicle Information Card -->
    <div class="w-full bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col gap-3">
      <!-- Driver Row -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=128&q=80" alt="Ramesh K." class="w-11 h-11 rounded-full object-cover border border-slate-200">
          <div>
            <span class="font-bold text-sm text-slate-900 block leading-tight">Ramesh K.</span>
            <div class="flex items-center gap-1 mt-0.5">
              <span class="text-amber-500 font-bold text-xs">★ 4.8</span>
              <span class="px-2 py-0.5 rounded-full bg-blue-50 text-primary text-[10px] font-bold">Demo Driver</span>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <a href="tel:+919876543210" class="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-primary hover:bg-slate-200 transition-colors">
            <span class="material-symbols-outlined text-[18px]">call</span>
          </a>
          <button type="button" onclick="openModal('chat')" class="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-primary hover:bg-slate-200 transition-colors">
            <span class="material-symbols-outlined text-[18px]">chat</span>
          </button>
        </div>
      </div>

      <div class="border-t border-slate-100"></div>

      <!-- Vehicle Model & Reg No -->
      <div class="grid grid-cols-2 gap-2 text-left">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
            <span class="material-symbols-outlined text-[16px]">directions_car</span>
          </div>
          <div>
            <span class="text-[10px] text-slate-400 font-semibold uppercase block">Vehicle</span>
            <span class="text-xs font-bold text-slate-800 block">Bajaj RE (Auto)</span>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div>
            <span class="text-[10px] text-slate-400 font-semibold uppercase block">Reg. No.</span>
            <span class="font-mono text-xs font-bold text-slate-800">KA-09 AB 4217</span>
          </div>
          <span class="text-[9px] bg-slate-100 text-slate-500 font-semibold px-1.5 py-0.5 rounded">Fictional</span>
        </div>
      </div>

      <div class="border-t border-slate-100"></div>

      <!-- Arriving in & Start OTP -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
            <span class="material-symbols-outlined text-[16px]">schedule</span>
          </div>
          <div>
            <span class="text-[10px] text-slate-400 font-semibold block">Arriving in</span>
            <div class="flex items-center gap-1.5">
              <span class="text-xs font-bold text-slate-900">3 mins</span>
              <span class="text-[10px] text-primary font-bold bg-blue-50 px-1.5 py-0.2 rounded-full">~ 1.2 km</span>
            </div>
          </div>
        </div>
        <div class="text-right">
          <span class="text-[10px] text-slate-400 font-semibold uppercase block">Start OTP</span>
          <span class="font-mono text-xs font-black text-primary bg-primary/10 px-2 py-0.5 rounded">5482</span>
        </div>
      </div>

      <div class="border-t border-slate-100"></div>

      <!-- Route Points -->
      <div class="flex flex-col gap-1.5 text-xs text-slate-700">
        <div class="flex items-center gap-2">
          <div class="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></div>
          <span class="truncate font-medium">VVCE Campus, Gokulam</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-2.5 h-2.5 rounded-full bg-primary shrink-0"></div>
          <span class="truncate font-medium">JSS Medical College &amp; Hospital</span>
        </div>
      </div>
    </div>

    <!-- Sticky Bottom Bar -->
    <div class="mt-3 pt-2 flex items-center justify-between">
      <div>
        <div class="flex items-center gap-1">
          <span class="text-[10px] text-slate-400 font-medium">Estimated fare</span>
          <span class="material-symbols-outlined text-[13px] text-slate-400 cursor-pointer" onclick="openModal('fareBreakdown')">info</span>
        </div>
        <div class="flex items-baseline gap-1">
          <span class="text-2xl font-black text-slate-900 tracking-tight font-numeric">₹61</span>
          <span class="text-[9px] text-slate-400 font-medium">Demo Price</span>
        </div>
      </div>
      <button onclick="navigateTo('screen-06')" class="h-12 px-6 rounded-xl bg-primary text-white font-bold text-sm shadow-md hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2 cursor-pointer" type="button">
        <span>Track Live Ride</span>
        <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
      </button>
    </div>

    <div class="text-center mt-1">
      <button onclick="openModal('cancel-sheet')" class="text-[11px] font-semibold text-slate-400 hover:text-red-500 transition-colors py-1 cursor-pointer" type="button">
        Cancel Booking
      </button>
    </div>
  </div>
</main>

      </section>

      <!-- Screen 06: Live Ride Tracking -->
      <section id="screen-06" class="screen-section">
        ${screens['06'].header}
        ${screens['06'].main}
      </section>

      <!-- Screen 07: Skyppy Miles -->
      <section id="screen-07" class="screen-section">
        ${screens['07'].header}
        ${screens['07'].main}
      </section>

      <!-- Screen 08: Activity -->
      <section id="screen-08" class="screen-section">
        ${screens['08'].header}
        ${screens['08'].main}
      </section>

      <!-- Screen 09: Profile -->
      <section id="screen-09" class="screen-section">
        ${screens['09'].header}
        ${screens['09'].main}
      </section>

      <!-- Screen 10: Appearance & Theme -->
      <section id="screen-10" class="screen-section">
        ${screens['10'].header}
        ${screens['10'].main}
      </section>
    </div>

    <!-- PERSISTENT BOTTOM NAVIGATION BAR -->
    <nav id="app-bottom-nav" class="fixed bottom-0 w-full z-40 bg-surface-container-lowest/95 backdrop-blur-xl border-t border-surface-container-low/60 shadow-[0_-4px_20px_rgba(16,28,43,0.06)]">
      <div class="flex justify-around items-center h-16 px-space-xs max-w-md mx-auto">
        <button onclick="navigateTo('screen-01')" class="nav-tab-btn flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all gap-0.5 text-primary font-bold active:scale-95" data-tab="screen-01" type="button">
          <span class="material-symbols-outlined text-[22px]">directions_car</span>
          <span class="font-label-sm text-[10px]">Home</span>
        </button>
        <button onclick="navigateTo('screen-08')" class="nav-tab-btn flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all gap-0.5 text-tertiary hover:text-on-surface active:scale-95" data-tab="screen-08" type="button">
          <span class="material-symbols-outlined text-[22px]">receipt_long</span>
          <span class="font-label-sm text-[10px]">Activity</span>
        </button>
        <button onclick="navigateTo('screen-07')" class="nav-tab-btn flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all gap-0.5 text-tertiary hover:text-on-surface active:scale-95" data-tab="screen-07" type="button">
          <span class="material-symbols-outlined text-[22px]">military_tech</span>
          <span class="font-label-sm text-[10px]">Miles</span>
        </button>
        <button onclick="navigateTo('screen-09')" class="nav-tab-btn flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all gap-0.5 text-tertiary hover:text-on-surface active:scale-95" data-tab="screen-09" type="button">
          <span class="material-symbols-outlined text-[22px]">person</span>
          <span class="font-label-sm text-[10px]">Profile</span>
        </button>
      </div>
    </nav>

    <!-- TOAST NOTIFICATION CONTAINER -->
    <div id="toast-banner" class="fixed bottom-20 left-4 right-4 z-[110] pointer-events-none flex justify-center transition-all opacity-0 translate-y-3 duration-200">
      <div class="bg-inverse-surface text-inverse-on-surface px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 max-w-xs text-xs font-semibold">
        <span class="material-symbols-outlined text-[18px] text-secondary-container" id="toast-icon">check_circle</span>
        <span id="toast-text">Message</span>
      </div>
    </div>

    <!-- MODAL OVERLAYS CONTAINER -->
    <div id="modal-backdrop" class="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm hidden flex items-end justify-center">
      <div class="absolute inset-0" onclick="closeModal()"></div>
      
      <!-- Notifications Modal -->
      <div id="modal-notifications" class="modal-box hidden relative w-full max-w-md bg-surface-container-lowest rounded-t-3xl p-5 z-10 max-h-[85vh] overflow-y-auto">
        <div class="flex items-center justify-between border-b border-surface-container-low pb-3 mb-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-[20px]">notifications_active</span>
            <h3 class="font-bold text-base text-on-surface">Mysuru Live Alerts</h3>
          </div>
          <button onclick="closeModal()" class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface" type="button">
            <span class="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
        <div class="flex flex-col gap-2.5">
          <div class="p-3 rounded-2xl bg-surface-container-low flex items-start gap-3">
            <span class="material-symbols-outlined text-secondary text-[20px] mt-0.5">electric_rickshaw</span>
            <div>
              <p class="font-bold text-xs text-on-surface">Driver Ramesh K. is on the way</p>
              <p class="text-[11px] text-on-surface-variant">Approaching VVCE Gate 2 in Auto Rickshaw (KA-09 AB 4217)</p>
              <span class="text-[10px] text-outline font-semibold mt-1 block">Just now</span>
            </div>
          </div>
          <div class="p-3 rounded-2xl bg-surface-container-low flex items-start gap-3">
            <span class="material-symbols-outlined text-primary text-[20px] mt-0.5">traffic</span>
            <div>
              <p class="font-bold text-xs text-on-surface">Bannimantap Corridor Flowing Smooth</p>
              <p class="text-[11px] text-on-surface-variant">Zero congestion recorded on highway stretch to JSS Hospital</p>
              <span class="text-[10px] text-outline font-semibold mt-1 block">10 mins ago</span>
            </div>
          </div>
        </div>
        <button onclick="closeModal(); showToast('All notifications marked as read');" class="w-full mt-4 py-2.5 rounded-xl bg-surface-container text-on-surface font-bold text-xs hover:bg-surface-container-high transition-colors" type="button">
          Mark All as Read
        </button>
      </div>

      <!-- Chat Modal -->
      <div id="modal-chat" class="modal-box hidden relative w-full max-w-md bg-surface-container-lowest rounded-t-3xl p-5 z-10 flex flex-col gap-3">
        <div class="flex items-center justify-between border-b border-surface-container-low pb-2">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">RK</div>
            <div>
              <h4 class="font-bold text-xs text-on-surface">Ramesh K. (Auto Driver)</h4>
              <span class="text-[10px] text-secondary font-semibold">Online • Approaching Gate</span>
            </div>
          </div>
          <button onclick="closeModal()" class="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-on-surface" type="button">
            <span class="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
        <!-- Quick replies -->
        <div class="flex gap-1.5 overflow-x-auto pb-1">
          <button onclick="sendChatMessage('I am at the gate')" class="px-2.5 py-1 rounded-full bg-surface-container text-xs text-on-surface shrink-0 font-medium active:scale-95" type="button">I am at the gate</button>
          <button onclick="sendChatMessage('Turning on hazards')" class="px-2.5 py-1 rounded-full bg-surface-container text-xs text-on-surface shrink-0 font-medium active:scale-95" type="button">Turning on hazards</button>
          <button onclick="sendChatMessage('Please wait 2 mins')" class="px-2.5 py-1 rounded-full bg-surface-container text-xs text-on-surface shrink-0 font-medium active:scale-95" type="button">Please wait 2 mins</button>
        </div>
        <!-- Messages body -->
        <div id="chat-messages-list" class="h-48 overflow-y-auto flex flex-col gap-2 p-1 text-xs">
          <div class="bg-surface-container text-on-surface self-start rounded-2xl rounded-bl-xs px-3 py-1.5 max-w-[80%]">
            Namaskara! I am approaching your pickup at VVCE.
          </div>
        </div>
        <!-- Input -->
        <div class="flex items-center gap-2 pt-1 border-t border-surface-container-low">
          <input id="chat-input" type="text" placeholder="Message Ramesh..." class="flex-1 h-9 px-3 rounded-full bg-surface-container text-xs text-on-surface focus:outline-none" onkeydown="if(event.key==='Enter') sendChatMessage()">
          <button onclick="sendChatMessage()" class="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center shadow-md active:scale-95" type="button">
            <span class="material-symbols-outlined text-[16px]">send</span>
          </button>
        </div>
      </div>

      <!-- Trip Completed Modal -->
      <div id="modal-trip-completed" class="modal-box hidden relative w-full max-w-md bg-surface-container-lowest rounded-t-3xl p-6 z-10 flex flex-col items-center text-center gap-3">
        <div class="w-14 h-14 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary">
          <span class="material-symbols-outlined text-[32px]">check_circle</span>
        </div>
        <div>
          <h3 class="font-bold text-lg text-on-surface">You Have Arrived!</h3>
          <p class="text-xs text-on-surface-variant">Trip to JSS Medical College successfully completed</p>
        </div>
        <div class="bg-surface-container-low rounded-2xl p-3 w-full flex items-center justify-between text-xs">
          <span class="text-on-surface font-semibold">Skyppy Miles Credited</span>
          <span class="font-bold text-primary">+4.2 KM</span>
        </div>
        <!-- Rating stars -->
        <div class="flex gap-2 my-1 text-amber-400">
          <span class="material-symbols-outlined text-[28px] cursor-pointer" onclick="setTripRating(1)">star</span>
          <span class="material-symbols-outlined text-[28px] cursor-pointer" onclick="setTripRating(2)">star</span>
          <span class="material-symbols-outlined text-[28px] cursor-pointer" onclick="setTripRating(3)">star</span>
          <span class="material-symbols-outlined text-[28px] cursor-pointer" onclick="setTripRating(4)">star</span>
          <span class="material-symbols-outlined text-[28px] cursor-pointer text-amber-500" onclick="setTripRating(5)">star</span>
        </div>
        <!-- Tip Buttons -->
        <div class="w-full">
          <span class="text-[11px] font-bold text-outline uppercase block mb-1.5">Add Driver Tip</span>
          <div class="grid grid-cols-4 gap-2">
            <button onclick="selectTip(0)" class="tip-btn py-1.5 rounded-xl border text-xs font-bold bg-surface-container text-on-surface border-surface-container-high" type="button">None</button>
            <button onclick="selectTip(10)" class="tip-btn py-1.5 rounded-xl border text-xs font-bold bg-surface-container text-on-surface border-surface-container-high" type="button">₹10</button>
            <button onclick="selectTip(20)" class="tip-btn py-1.5 rounded-xl border text-xs font-bold bg-primary text-on-primary border-primary shadow-sm" type="button">₹20</button>
            <button onclick="selectTip(50)" class="tip-btn py-1.5 rounded-xl border text-xs font-bold bg-surface-container text-on-surface border-surface-container-high" type="button">₹50</button>
          </div>
        </div>
        <button onclick="finishTripAndGoToActivity()" class="w-full py-3 rounded-xl bg-primary text-on-primary font-bold text-sm shadow-md mt-2 active:scale-95 transition-transform" type="button">
          Done & View Activity
        </button>
      </div>
    </div>
  </div>

  <!-- CLIENT-SIDE ROUTER, EVENT LISTENERS & STATE ENGINE -->
  <script>
    // Live Clock in Status Bar
    function updateClock() {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const el = document.getElementById('status-clock');
      if (el) el.textContent = \`\${h}:\${m}\`;
    }
    setInterval(updateClock, 1000);
    updateClock();

    // Universal Navigation System
    let currentScreen = 'screen-01';
    const screenHistory = ['screen-01'];

    function navigateTo(screenId) {
      const targetEl = document.getElementById(screenId);
      if (!targetEl) return;

      // Hide all screens
      document.querySelectorAll('.screen-section').forEach(s => s.classList.remove('active'));
      targetEl.classList.add('active');
      currentScreen = screenId;
      screenHistory.push(screenId);
      window.location.hash = '#' + screenId;

      // Reset scroll position of phone viewport
      const viewport = document.getElementById('phone-viewport');
      if (viewport) viewport.scrollTop = 0;

      // Update Bottom Navigation Tab Highlight
      document.querySelectorAll('.nav-tab-btn').forEach(btn => {
        if (btn.getAttribute('data-tab') === screenId) {
          btn.classList.add('text-primary', 'font-bold');
          btn.classList.remove('text-tertiary');
        } else {
          btn.classList.remove('text-primary', 'font-bold');
          btn.classList.add('text-tertiary');
        }
      });
    }

    function goBack() {
      if (screenHistory.length > 1) {
        screenHistory.pop(); // Remove current
        const prev = screenHistory.pop(); // Get previous
        navigateTo(prev);
      } else {
        navigateTo('screen-01');
      }
    }

    // Intercept clicks on Stitch navigation attributes
    document.addEventListener('click', (e) => {
      // Check for elements with data-navigate
      const navTarget = e.target.closest('[data-navigate]');
      if (navTarget) {
        e.preventDefault();
        const dest = navTarget.getAttribute('data-navigate');
        const screenMap = {
          '01-rides-home': 'screen-01',
          '02-destination-search': 'screen-02',
          '03-location-selection': 'screen-03',
          '04-ride-options': 'screen-04',
          '05-booking-confirmation': 'screen-05',
          '06-live-ride-tracking': 'screen-06',
          '07-skyppy-miles': 'screen-07',
          '08-activity': 'screen-08',
          '09-profile': 'screen-09',
          '10-theme-settings': 'screen-10'
        };
        if (screenMap[dest]) {
          navigateTo(screenMap[dest]);
          return;
        }
      }

      // Check for back buttons
      const backBtn = e.target.closest('button[aria-label="Go back"]');
      if (backBtn && !backBtn.getAttribute('onclick')) {
        e.preventDefault();
        goBack();
      }

      // Check for profile buttons
      const profileBtn = e.target.closest('img[alt="Profile"]')?.parentElement;
      if (profileBtn) {
        e.preventDefault();
        navigateTo('screen-09');
      }
    });

    // Hashchange listener for direct URL / back-forward navigation
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && document.getElementById(hash)) {
        navigateTo(hash);
      }
    });

    // Check initial hash on load
    if (window.location.hash) {
      const initHash = window.location.hash.replace('#', '');
      if (document.getElementById(initHash)) {
        navigateTo(initHash);
      }
    }

    // Modal Helpers
    function openModal(modalId) {
      const backdrop = document.getElementById('modal-backdrop');
      const box = document.getElementById('modal-' + modalId);
      if (backdrop && box) {
        backdrop.classList.remove('hidden');
        document.querySelectorAll('.modal-box').forEach(b => b.classList.add('hidden'));
        box.classList.remove('hidden');
      }
    }

    function closeModal() {
      const backdrop = document.getElementById('modal-backdrop');
      if (backdrop) backdrop.classList.add('hidden');
      document.querySelectorAll('.modal-box').forEach(b => b.classList.add('hidden'));
    }

    // Toast Notification Helper
    function showToast(msg, icon = 'check_circle') {
      const toast = document.getElementById('toast-banner');
      const text = document.getElementById('toast-text');
      const iconEl = document.getElementById('toast-icon');
      if (toast && text) {
        text.textContent = msg;
        if (iconEl) iconEl.textContent = icon;
        toast.classList.remove('opacity-0', 'translate-y-3');
        toast.classList.add('opacity-100', 'translate-y-0');
        setTimeout(() => {
          toast.classList.remove('opacity-100', 'translate-y-0');
          toast.classList.add('opacity-0', 'translate-y-3');
        }, 3000);
      }
    }

    // Theme switching
    function setTheme(mode) {
      const html = document.documentElement;
      const lightCard = document.getElementById('theme-card-light');
      const darkCard = document.getElementById('theme-card-dark');
      const checkLight = document.getElementById('theme-check-light');
      const checkDark = document.getElementById('theme-check-dark');

      if (mode === 'dark') {
        html.classList.add('dark');
        html.classList.remove('light');
        if (darkCard) {
          darkCard.classList.add('border-primary', 'bg-primary/5');
          darkCard.classList.remove('border-outline-variant/30');
        }
        if (lightCard) {
          lightCard.classList.remove('border-primary', 'bg-primary/5');
          lightCard.classList.add('border-outline-variant/30');
        }
        if (checkDark) checkDark.classList.remove('hidden');
        if (checkLight) checkLight.classList.add('hidden');
      } else {
        html.classList.add('light');
        html.classList.remove('dark');
        if (lightCard) {
          lightCard.classList.add('border-primary', 'bg-primary/5');
          lightCard.classList.remove('border-outline-variant/30');
        }
        if (darkCard) {
          darkCard.classList.remove('border-primary', 'bg-primary/5');
          darkCard.classList.add('border-outline-variant/30');
        }
        if (checkLight) checkLight.classList.remove('hidden');
        if (checkDark) checkDark.classList.add('hidden');
      }
      showToast(\`Theme updated to \${mode === 'dark' ? 'Dark Mode' : 'Light Mode'}\`);
    }

    function toggleTheme() {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'light' : 'dark');
    }

    // Driver Chat System
    function sendChatMessage(text) {
      const input = document.getElementById('chat-input');
      const msg = text || (input ? input.value.trim() : '');
      if (!msg) return;

      const list = document.getElementById('chat-messages-list');
      if (list) {
        const userBubble = document.createElement('div');
        userBubble.className = 'bg-primary text-on-primary self-end rounded-2xl rounded-br-xs px-3 py-1.5 max-w-[80%]';
        userBubble.textContent = msg;
        list.appendChild(userBubble);
        if (input) input.value = '';
        list.scrollTop = list.scrollHeight;

        // Auto driver response
        setTimeout(() => {
          const driverBubble = document.createElement('div');
          driverBubble.className = 'bg-surface-container text-on-surface self-start rounded-2xl rounded-bl-xs px-3 py-1.5 max-w-[80%]';
          driverBubble.textContent = 'Got it! I am right outside your location.';
          list.appendChild(driverBubble);
          list.scrollTop = list.scrollHeight;
        }, 1000);
      }
    }

    // Trip Completion Helper
    function setTripRating(stars) {
      showToast(\`Rated \${stars} Stars! Thank you.\`);
    }

    function selectTip(amount) {
      document.querySelectorAll('.tip-btn').forEach(btn => {
        if (btn.textContent.includes(String(amount)) || (amount === 0 && btn.textContent === 'None')) {
          btn.className = 'tip-btn py-1.5 rounded-xl border text-xs font-bold bg-primary text-on-primary border-primary shadow-sm';
        } else {
          btn.className = 'tip-btn py-1.5 rounded-xl border text-xs font-bold bg-surface-container text-on-surface border-surface-container-high';
        }
      });
      if (amount > 0) showToast(\`₹\${amount} Tip added for driver\`);
    }

    function finishTripAndGoToActivity() {
      closeModal();
      showToast('Trip Completed! +4.2 KM added to Skyppy Miles');
      navigateTo('screen-08');
    }

    // Copy Booking Code
    function copyBookingCode() {
      navigator.clipboard?.writeText('SKY784392');
      showToast('Booking ID SKY784392 copied to clipboard');
    }
  </script>
</body>
</html>
`;

fs.writeFileSync('skyppy.html', fullHtml, 'utf8');
console.log('Successfully written skyppy.html. Size:', fullHtml.length);
