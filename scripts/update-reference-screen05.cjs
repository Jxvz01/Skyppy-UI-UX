const fs = require('fs');
const path = require('path');

// Read local vehicle images as Base64 for 100% self-contained standalone HTML
function getBase64Image(filename) {
  const p = path.resolve(`public/vehicles/${filename}`);
  if (fs.existsSync(p)) {
    const ext = path.extname(filename).replace('.', '');
    const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
    return `data:${mime};base64,${fs.readFileSync(p).toString('base64')}`;
  }
  return `/vehicles/${filename}`;
}

const autoDataUrl = getBase64Image('auto.png');
const miniDataUrl = getBase64Image('mini.png');
const hatchDataUrl = getBase64Image('hatchback.png');
const sedanDataUrl = getBase64Image('sedan.png');
const suvDataUrl = getBase64Image('suv.png');

// Build the reference-faithful Screen 05 HTML for standalone skyppy.html and app.html
const screen05Html = `
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
  <div id="ref-screen-searching" class="flex-1 flex flex-col justify-between px-5 pt-3 pb-4">
    <div class="text-center mt-1">
      <h1 class="font-extrabold text-[22px] text-slate-900 tracking-tight leading-snug">Confirming your ride</h1>
      <p class="text-xs text-slate-500 font-medium mt-1">Finding the best available vehicle near you...</p>
    </div>

    <!-- Map Canvas Visualisation -->
    <div class="relative w-full h-[280px] rounded-3xl bg-[#f0f4f9]/90 border border-slate-200/60 overflow-hidden my-3 flex items-center justify-center shadow-inner">
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
      <div class="absolute left-6 top-[110px] flex flex-col items-center">
        <div class="bg-white rounded-xl shadow-md border border-slate-100 px-3 py-1.5 mb-1.5 max-w-[130px] text-center">
          <span class="text-[11px] font-bold text-slate-800 leading-snug block truncate">VVCE Campus</span>
          <span class="text-[9px] text-slate-400 block truncate">Gokulam</span>
        </div>
        <div class="w-4 h-4 rounded-full bg-primary ring-4 ring-blue-100 shadow-sm"></div>
      </div>

      <!-- Right Destination Callout -->
      <div class="absolute right-6 top-[90px] flex flex-col items-center">
        <div class="bg-white rounded-xl shadow-md border border-slate-100 px-3 py-1.5 mb-1.5 max-w-[140px] text-center">
          <span class="text-[11px] font-bold text-slate-800 leading-snug block truncate">JSS Medical</span>
          <span class="text-[9px] text-slate-400 block truncate">College</span>
        </div>
        <div class="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white shadow-md">
          <span class="material-symbols-outlined text-[15px]">location_on</span>
        </div>
      </div>

      <!-- Animated Car Marker with Radar Rings -->
      <div id="ref-moving-car" class="absolute z-20 flex items-center justify-center" style="left: 175px; top: 160px; transition: all 1.8s ease-in-out;">
        <div class="absolute w-12 h-12 rounded-full bg-primary/10 animate-ping"></div>
        <div class="absolute w-16 h-16 rounded-full bg-primary/5"></div>
        <div class="w-7 h-7 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-primary z-10">
          <span class="material-symbols-outlined text-[16px]">directions_car</span>
        </div>
      </div>
    </div>

    <!-- 3-Step Progress Card -->
    <div class="w-full bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-3">
      <div class="flex items-center gap-3">
        <div class="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
          <span class="material-symbols-outlined text-[13px] font-bold">check</span>
        </div>
        <span class="text-xs font-semibold text-slate-700">Ride requested</span>
      </div>
      <div class="flex items-center gap-3">
        <div class="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center shrink-0">
          <div class="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
        </div>
        <span class="text-xs font-bold text-slate-900">Finding a nearby vehicle</span>
      </div>
      <div class="flex items-center gap-3">
        <div id="step3-circle" class="w-5 h-5 rounded-full border border-slate-300 bg-white flex items-center justify-center shrink-0"></div>
        <span id="step3-label" class="text-xs text-slate-400">Finalising your booking</span>
      </div>
    </div>

    <div class="text-center mt-3">
      <button onclick="revealConfirmedScreen()" class="text-xs text-primary font-semibold hover:underline" type="button">Skip Animation →</button>
    </div>
  </div>

  <!-- SCREEN TWO: YOUR RIDE IS CONFIRMED (ACROSS 5 VEHICLE CATEGORIES) -->
  <div id="ref-screen-confirmed" class="hidden flex-1 flex flex-col justify-between px-5 pt-2 pb-4">
    <!-- Confirmed Check Header -->
    <div class="text-center mt-0.5">
      <div class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto mb-1 shadow-xs">
        <span class="material-symbols-outlined text-[19px] font-black">check</span>
      </div>
      <h1 class="font-extrabold text-[22px] text-slate-900 tracking-tight leading-snug">Your ride is confirmed!</h1>
      <p id="s5-confirmed-subtitle" class="text-xs text-slate-500 font-medium mt-0.5">Your auto is on the way to pickup location.</p>
    </div>

    <!-- Substantially Enlarged Vehicle Presentation (Centerpiece) -->
    <div class="relative w-full h-[180px] flex items-center justify-center my-1 px-3">
      <div class="absolute bottom-2 w-[80%] max-w-[280px] h-3 bg-slate-900/10 rounded-[100%] blur-[2.5px] pointer-events-none"></div>
      <img id="s5-vehicle-img" src="${autoDataUrl}" alt="Vehicle" class="relative z-10 w-full h-full max-h-[160px] object-contain drop-shadow-sm select-none transition-all duration-200">
    </div>

    <!-- Vehicle Category Pill Bar -->
    <div class="flex items-center justify-center gap-2 mb-2">
      <span id="s5-cat-pill" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-slate-800 font-bold text-xs shadow-xs border border-slate-200/80">
        <span id="s5-cat-icon" class="material-symbols-outlined text-[15px] text-primary">electric_rickshaw</span>
        <span id="s5-cat-name">Auto</span>
      </span>
      <span id="s5-cat-tag" class="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-primary font-semibold text-[10px] border border-blue-100/60">
        Most Affordable
      </span>
    </div>

    <!-- Driver & Vehicle Information Card -->
    <div class="w-full bg-white rounded-2xl p-3.5 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col gap-2.5">
      <!-- Driver Row -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <img id="s5-driver-avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3740jxSGU_BvWXX_0bKvu2sxELLX3AAndNutnCW1XB__FwZwimVdQj4fOaPyFKYMsAmEUOU5b79mzMqvzX5ZGIkNXUzI4OJZrn2REKieiB-DgdiisKPKyBxEF61HkHHW9b1Rf_sTB4cKo6Q24dXC2eWjIJcG5MsBenwwv-U3LLkhaiFKpskZqBkUWS7J1dwK6Ti9Wt5E706pyHnAzMQpT4793gyOibANPEYB0dnw" alt="Driver" class="w-10 h-10 rounded-full object-cover border border-slate-200">
          <div>
            <span id="s5-driver-name" class="font-bold text-sm text-slate-900 block leading-tight">Ramesh K.</span>
            <div class="flex items-center gap-1 mt-0.5">
              <span id="s5-driver-rating" class="text-amber-500 font-bold text-xs">★ 4.8</span>
              <span class="px-2 py-0.5 rounded-full bg-blue-50 text-primary text-[10px] font-bold">Demo Driver</span>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <a id="s5-driver-call" href="tel:+919876543210" class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-primary hover:bg-slate-200 transition-colors">
            <span class="material-symbols-outlined text-[17px]">call</span>
          </a>
          <button type="button" onclick="openModal('chat')" class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-primary hover:bg-slate-200 transition-colors">
            <span class="material-symbols-outlined text-[17px]">chat</span>
          </button>
        </div>
      </div>

      <div class="border-t border-slate-100"></div>

      <!-- Vehicle Model & Reg No -->
      <div class="grid grid-cols-2 gap-2 text-left">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
            <span id="s5-vehicle-icon-sm" class="material-symbols-outlined text-[15px]">electric_rickshaw</span>
          </div>
          <div>
            <span class="text-[10px] text-slate-400 font-semibold uppercase block leading-none mb-0.5">Vehicle</span>
            <span id="s5-vehicle-model" class="text-xs font-bold text-slate-800 block">Bajaj RE Electric</span>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div>
            <span class="text-[10px] text-slate-400 font-semibold uppercase block leading-none mb-0.5">Reg. No.</span>
            <span id="s5-vehicle-plate" class="font-mono text-xs font-bold text-slate-800">KA-09 AB 4217</span>
          </div>
        </div>
      </div>

      <div class="border-t border-slate-100"></div>

      <!-- Arriving in & Start OTP -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
            <span class="material-symbols-outlined text-[15px]">schedule</span>
          </div>
          <div>
            <span class="text-[10px] text-slate-400 font-semibold block leading-none mb-0.5">Arriving in</span>
            <div class="flex items-center gap-1.5">
              <span id="s5-eta" class="text-xs font-bold text-slate-900">3 mins</span>
              <span id="s5-dist" class="text-[10px] text-primary font-bold bg-blue-50 px-1.5 py-0.2 rounded-full">~ 1.2 km</span>
            </div>
          </div>
        </div>
        <div class="text-right">
          <span class="text-[10px] text-slate-400 font-semibold uppercase block leading-none mb-0.5">Start OTP</span>
          <span class="font-mono text-xs font-black text-primary bg-primary/10 px-2 py-0.5 rounded">5482</span>
        </div>
      </div>

      <div class="border-t border-slate-100"></div>

      <!-- Route Points -->
      <div class="flex flex-col gap-1 text-xs text-slate-700">
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

    <!-- 5-Category Demo Selector Strip -->
    <div class="mt-2.5 flex items-center justify-between gap-1 overflow-x-auto py-1 scrollbar-none">
      <button onclick="setConfirmedVehicle('auto')" class="s5-fleet-btn flex-1 min-w-[58px] py-1.5 px-1 rounded-xl text-center flex flex-col items-center gap-0.5 bg-primary text-white font-bold" data-cat="auto">
        <span class="material-symbols-outlined text-[15px]">electric_rickshaw</span>
        <span class="text-[10px] leading-none">Auto</span>
      </button>
      <button onclick="setConfirmedVehicle('mini')" class="s5-fleet-btn flex-1 min-w-[58px] py-1.5 px-1 rounded-xl text-center flex flex-col items-center gap-0.5 bg-white text-slate-600 border border-slate-200/60" data-cat="mini">
        <span class="material-symbols-outlined text-[15px]">directions_car</span>
        <span class="text-[10px] leading-none">Mini</span>
      </button>
      <button onclick="setConfirmedVehicle('hatchback')" class="s5-fleet-btn flex-1 min-w-[58px] py-1.5 px-1 rounded-xl text-center flex flex-col items-center gap-0.5 bg-white text-slate-600 border border-slate-200/60" data-cat="hatchback">
        <span class="material-symbols-outlined text-[15px]">directions_car</span>
        <span class="text-[10px] leading-none">Hatchback</span>
      </button>
      <button onclick="setConfirmedVehicle('sedan')" class="s5-fleet-btn flex-1 min-w-[58px] py-1.5 px-1 rounded-xl text-center flex flex-col items-center gap-0.5 bg-white text-slate-600 border border-slate-200/60" data-cat="sedan">
        <span class="material-symbols-outlined text-[15px]">directions_car</span>
        <span class="text-[10px] leading-none">Sedan</span>
      </button>
      <button onclick="setConfirmedVehicle('suv')" class="s5-fleet-btn flex-1 min-w-[58px] py-1.5 px-1 rounded-xl text-center flex flex-col items-center gap-0.5 bg-white text-slate-600 border border-slate-200/60" data-cat="suv">
        <span class="material-symbols-outlined text-[15px]">directions_car</span>
        <span class="text-[10px] leading-none">SUV</span>
      </button>
    </div>

    <!-- Sticky Bottom Bar -->
    <div class="mt-2 pt-1 flex items-center justify-between">
      <div>
        <div class="flex items-center gap-1">
          <span class="text-[10px] text-slate-400 font-medium">Estimated fare</span>
          <span class="material-symbols-outlined text-[13px] text-slate-400 cursor-pointer" onclick="openModal('fareBreakdown')">info</span>
        </div>
        <div class="flex items-center gap-1.5 mt-0.5">
          <span id="s5-fare" class="text-2xl font-black text-slate-900 tracking-tight font-numeric">₹61</span>
          <span class="text-[10px] font-semibold text-primary bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">Demo Price</span>
        </div>
      </div>
      <button onclick="navigateTo('screen-06')" class="h-12 px-6 rounded-xl bg-primary text-white font-bold text-sm shadow-md hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2 cursor-pointer" type="button">
        <span>Track Live Ride</span>
        <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
      </button>
    </div>

    <div class="text-center mt-1">
      <button onclick="SkyppyApp.cancelBooking()" class="text-[11px] font-semibold text-slate-400 hover:text-red-500 transition-colors py-1" type="button">
        Cancel Booking
      </button>
    </div>
  </div>
</main>
`;

const jsScript = `
<script>
  const S5_FLEET = {
    auto: {
      name: 'Auto',
      model: 'Bajaj RE Electric',
      tag: 'Most Affordable',
      categoryNoun: 'auto',
      plate: 'KA-09 AB 4217',
      eta: '3 mins',
      dist: '~ 1.2 km',
      fare: '₹61',
      icon: 'electric_rickshaw',
      image: '${autoDataUrl}',
      driver: { name: 'Ramesh K.', rating: '★ 4.8', phone: '+919876543210', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3740jxSGU_BvWXX_0bKvu2sxELLX3AAndNutnCW1XB__FwZwimVdQj4fOaPyFKYMsAmEUOU5b79mzMqvzX5ZGIkNXUzI4OJZrn2REKieiB-DgdiisKPKyBxEF61HkHHW9b1Rf_sTB4cKo6Q24dXC2eWjIJcG5MsBenwwv-U3LLkhaiFKpskZqBkUWS7J1dwK6Ti9Wt5E706pyHnAzMQpT4793gyOibANPEYB0dnw' }
    },
    mini: {
      name: 'Mini',
      model: 'Tata Tiago',
      tag: 'Compact & Quick',
      categoryNoun: 'mini',
      plate: 'KA-09 CD 3284',
      eta: '4 mins',
      dist: '~ 1.8 km',
      fare: '₹74',
      icon: 'directions_car',
      image: '${miniDataUrl}',
      driver: { name: 'Anitha S.', rating: '★ 4.9', phone: '+919845111200', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80' }
    },
    hatchback: {
      name: 'Hatchback',
      model: 'Hyundai i20',
      tag: 'Popular Choice',
      categoryNoun: 'hatchback',
      plate: 'KA-09 EF 5531',
      eta: '4 mins',
      dist: '~ 2.1 km',
      fare: '₹89',
      icon: 'directions_car',
      image: '${hatchDataUrl}',
      driver: { name: 'Vikram N.', rating: '★ 4.8', phone: '+919845122910', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFC_47gt-3lPsOkq5tq9A1wWjAanAGLT6QZO8F3aTw1LfNOksrrxtXPF71CGQ_FJ7pd2LCtqBQDSpXdXwOpey0sE6qNx6fucroCvNH0h6iro5jb2ysLyvNzFo1738hYjEHq4Swjk-8vLvooNWxWoVptliHy445jMIRy5KQxPdsJiOuxf15CvmmGzGTG3p2hxjjR4GDmV5Xy9khm4tVw1cxiuqqOxQX-FwykOSgEZM' }
    },
    sedan: {
      name: 'Sedan',
      model: 'Honda City',
      tag: 'Extra Comfort',
      categoryNoun: 'sedan',
      plate: 'KA-09 GH 7763',
      eta: '5 mins',
      dist: '~ 2.4 km',
      fare: '₹112',
      icon: 'directions_car',
      image: '${sedanDataUrl}',
      driver: { name: 'Suresh P.', rating: '★ 4.9', phone: '+919731288401', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80' }
    },
    suv: {
      name: 'SUV',
      model: 'Hyundai Creta',
      tag: 'Spacious & Premium',
      categoryNoun: 'SUV',
      plate: 'KA-09 JK 9901',
      eta: '6 mins',
      dist: '~ 3.1 km',
      fare: '₹149',
      icon: 'directions_car',
      image: '${suvDataUrl}',
      driver: { name: 'Manoj R.', rating: '★ 4.9', phone: '+919900154321', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80' }
    }
  };

  function setConfirmedVehicle(catKey) {
    const v = S5_FLEET[catKey] || S5_FLEET.auto;
    document.getElementById('s5-vehicle-img').src = v.image;
    document.getElementById('s5-confirmed-subtitle').textContent = 'Your ' + v.categoryNoun + ' is on the way to pickup location.';
    document.getElementById('s5-cat-name').textContent = v.name;
    document.getElementById('s5-cat-icon').textContent = v.icon;
    document.getElementById('s5-cat-tag').textContent = v.tag;
    document.getElementById('s5-driver-avatar').src = v.driver.avatar;
    document.getElementById('s5-driver-name').textContent = v.driver.name;
    document.getElementById('s5-driver-rating').textContent = v.driver.rating;
    document.getElementById('s5-driver-call').href = 'tel:' + v.driver.phone;
    document.getElementById('s5-vehicle-icon-sm').textContent = v.icon;
    document.getElementById('s5-vehicle-model').textContent = v.model;
    document.getElementById('s5-vehicle-plate').textContent = v.plate;
    document.getElementById('s5-eta').textContent = v.eta;
    document.getElementById('s5-dist').textContent = v.dist;
    document.getElementById('s5-fare').textContent = v.fare;

    document.querySelectorAll('.s5-fleet-btn').forEach(btn => {
      if (btn.dataset.cat === catKey) {
        btn.className = 's5-fleet-btn flex-1 min-w-[58px] py-1.5 px-1 rounded-xl text-center flex flex-col items-center gap-0.5 bg-primary text-white font-bold';
      } else {
        btn.className = 's5-fleet-btn flex-1 min-w-[58px] py-1.5 px-1 rounded-xl text-center flex flex-col items-center gap-0.5 bg-white text-slate-600 border border-slate-200/60';
      }
    });
  }

  function revealConfirmedScreen() {
    const s1 = document.getElementById('ref-screen-searching');
    const s2 = document.getElementById('ref-screen-confirmed');
    if (s1 && s2) {
      s1.classList.add('hidden');
      s2.classList.remove('hidden');
    }
  }

  window.initScreen05Transition = function() {
    const s1 = document.getElementById('ref-screen-searching');
    const s2 = document.getElementById('ref-screen-confirmed');
    if (!s1 || !s2) return;
    s1.classList.remove('hidden');
    s2.classList.add('hidden');

    setTimeout(() => {
      const step3Circle = document.getElementById('step3-circle');
      const step3Label = document.getElementById('step3-label');
      if (step3Circle) {
        step3Circle.className = 'w-5 h-5 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center shrink-0';
        step3Circle.innerHTML = '<div class="w-2 h-2 rounded-full bg-primary animate-pulse"></div>';
      }
      if (step3Label) {
        step3Label.className = 'text-xs font-bold text-slate-900';
      }
    }, 1300);

    setTimeout(() => {
      revealConfirmedScreen();
    }, 2300);
  };
</script>
`;

// Update skyppy.html and app.html
['skyppy.html', 'app.html'].forEach(filename => {
  if (!fs.existsSync(filename)) return;
  let content = fs.readFileSync(filename, 'utf8');

  // Replace screen-05 section
  const s5Regex = /<section id="screen-05" class="screen-section">[\s\S]*?<\/section>/;
  if (s5Regex.test(content)) {
    content = content.replace(s5Regex, `<section id="screen-05" class="screen-section">\n${screen05Html}\n</section>`);
  }

  // Ensure script is present
  if (!content.includes('initScreen05Transition')) {
    content = content.replace('</body>', `${jsScript}\n</body>`);
  } else {
    // Replace script
    const scriptRegex = /<script>[\s\S]*?initScreen05Transition[\s\S]*?<\/script>/;
    if (scriptRegex.test(content)) {
      content = content.replace(scriptRegex, jsScript);
    }
  }

  fs.writeFileSync(filename, content, 'utf8');
  console.log(`Updated ${filename} successfully with local base64 vehicle assets.`);
});
