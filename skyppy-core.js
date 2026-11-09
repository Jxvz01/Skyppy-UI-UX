/**
 * Skyppy 2.0 — Core Shared Application Engine & UX Bus
 * Provides shared state, universal routing, notifications, safety toolkit,
 * driver communication, and cross-screen synchronization.
 */

(function (window, document) {
  'use strict';

  // --- 1. DEFAULT APP STATE & PERSISTENCE ---
  const DEFAULT_STATE = {
    user: {
      name: 'Jeevan H.',
      initials: 'JH',
      phone: '+91 98450 33812',
      email: 'jeevanh259@gmail.com',
      tier: 'Tier 2 Explorer',
      rating: '4.9',
      miles: 248.6,
      cashBalance: 150.00
    },
    pickup: {
      title: 'VVCE Campus, Gokulam',
      address: 'Gokulam 3rd Stage, Mysuru',
      landmark: 'Gate 2 Pickup Zone'
    },
    destination: {
      title: 'JSS Medical College & Hospital',
      address: 'Bannimantap A-Layout, Mysuru',
      distanceKm: 4.2,
      durationMin: 12
    },
    vehicles: {
      auto: { id: 'auto', name: 'Auto Rickshaw', category: 'Fastest', fare: 76, originalFare: 91, capacity: '2-3 seats', eta: '4 min away', plate: 'KA-09 AB 4217', driver: 'Ramesh K.', rating: '4.8', trips: '1,240' },
      mini: { id: 'mini', name: 'Mini AC', category: 'Hatchback', fare: 112, originalFare: 125, capacity: '4 seats', eta: '5 min away', plate: 'KA-09 C 8120', driver: 'Santhosh M.', rating: '4.9', trips: '2,110' },
      sedan: { id: 'sedan', name: 'Sedan Comfort', category: 'Top Rated', fare: 156, originalFare: 175, capacity: '4 seats', eta: '6 min away', plate: 'KA-09 E 3319', driver: 'Kumar Swamy', rating: '4.9', trips: '3,450' },
      suv: { id: 'suv', name: 'SUV Extra', category: '6 Seater', fare: 228, originalFare: 250, capacity: '6 seats', eta: '7 min away', plate: 'KA-09 M 7701', driver: 'Praveen Gowda', rating: '4.8', trips: '980' }
    },
    selectedVehicleId: 'auto',
    activeBooking: {
      bookingId: 'SKY784392',
      status: 'on_the_way', // 'on_the_way', 'in_ride', 'completed', 'cancelled'
      otp: '4891',
      startOtp: '5482',
      vehicleId: 'auto',
      paymentMethod: 'UPI AutoPay (•••• 2590)',
      bookedAt: 'Today, 09:41 AM'
    },
    appliedCoupon: 'MILES15',
    couponDiscount: 15,
    notifications: [
      { id: 1, title: 'Driver Ramesh K. is 4 min away', desc: 'Auto KA-09 AB 4217 approaching VVCE Gate 2', time: 'Just now', unread: true, icon: 'electric_rickshaw', color: 'text-primary' },
      { id: 2, title: 'Skyppy Miles Milestone Alert!', desc: 'Only 1.4 km left to unlock permanent Zero Peak Surge.', time: '10 min ago', unread: true, icon: 'military_tech', color: 'text-secondary' },
      { id: 3, title: 'Clear transit corridor on Vinoba Rd', desc: 'Optimal travel conditions across Gokulam & Bannimantap', time: '1 hr ago', unread: false, icon: 'traffic', color: 'text-tertiary' }
    ]
  };

  function getState() {
    try {
      const stored = localStorage.getItem('skyppy_app_state');
      if (stored) {
        return { ...DEFAULT_STATE, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Could not read state from localStorage', e);
    }
    return DEFAULT_STATE;
  }

  function saveState(newState) {
    try {
      localStorage.setItem('skyppy_app_state', JSON.stringify(newState));
    } catch (e) {
      console.warn('Could not save state to localStorage', e);
    }
  }

  const appState = getState();

  // --- 2. UNIVERSAL NAVIGATION ENGINE ---
  const SCREEN_FILES = {
    '01-rides-home': '01-rides-home.html',
    '02-destination-search': '02-destination-search.html',
    '03-location-selection': '03-location-selection.html',
    '04-ride-options': '04-ride-options.html',
    '05-booking-confirmation': '05-booking-confirmation.html',
    '06-live-ride-tracking': '06-live-ride-tracking.html',
    '07-skyppy-miles': '07-skyppy-miles.html',
    '08-activity': '08-activity.html',
    '09-profile': '09-profile.html'
  };

  function normalizeScreen(rawName) {
    if (!rawName) return '01-rides-home';
    const clean = rawName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    for (const key in SCREEN_FILES) {
      if (clean === key || clean.includes(key) || key.includes(clean)) return key;
    }
    if (clean.includes('home')) return '01-rides-home';
    if (clean.includes('search')) return '02-destination-search';
    if (clean.includes('location') || clean.includes('selection')) return '03-location-selection';
    if (clean.includes('option') || clean.includes('ride')) return '04-ride-options';
    if (clean.includes('confirm') || clean.includes('booked')) return '05-booking-confirmation';
    if (clean.includes('track') || clean.includes('live')) return '06-live-ride-tracking';
    if (clean.includes('mile')) return '07-skyppy-miles';
    if (clean.includes('activity')) return '08-activity';
    if (clean.includes('profile')) return '09-profile';
    return '01-rides-home';
  }

  function navigateTo(target, params) {
    const key = normalizeScreen(target);
    const targetFile = SCREEN_FILES[key] || '01-rides-home.html';

    if (params) {
      if (params.destination) {
        appState.destination.title = params.destination;
        if (params.distance) appState.destination.distanceKm = params.distance;
        saveState(appState);
      }
      if (params.vehicle) {
        appState.selectedVehicleId = params.vehicle;
        appState.activeBooking.vehicleId = params.vehicle;
        saveState(appState);
      }
      if (params.activityTab) {
        sessionStorage.setItem('skyppy_activity_tab', params.activityTab);
      }
    }

    // If running inside the Prototype Studio iframe:
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'navigate', screen: key, file: targetFile, params: params }, '*');
    } else {
      // Standalone mode direct navigation
      window.location.href = targetFile;
    }
  }

  // --- 3. TOAST SYSTEM ---
  function showToast(message, type = 'info') {
    let toast = document.getElementById('skyppy-global-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'skyppy-global-toast';
      toast.className = 'fixed bottom-24 left-4 right-4 z-[9999] pointer-events-none transition-all duration-300 transform translate-y-8 opacity-0 flex justify-center';
      toast.innerHTML = `
        <div class="bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 max-w-sm border border-slate-700/50 backdrop-blur-md">
          <span class="material-symbols-outlined text-[20px] text-secondary-fixed shrink-0" id="skyppy-toast-icon">check_circle</span>
          <span class="font-body-md text-sm font-medium leading-snug" id="skyppy-toast-msg">Notification</span>
        </div>
      `;
      document.body.appendChild(toast);
    }
    const msgEl = document.getElementById('skyppy-toast-msg');
    const iconEl = document.getElementById('skyppy-toast-icon');
    if (msgEl) msgEl.textContent = message;
    if (iconEl) {
      if (type === 'error') {
        iconEl.textContent = 'error';
        iconEl.className = 'material-symbols-outlined text-[20px] text-error shrink-0';
      } else {
        iconEl.textContent = 'check_circle';
        iconEl.className = 'material-symbols-outlined text-[20px] text-secondary-fixed shrink-0';
      }
    }
    toast.classList.remove('translate-y-8', 'opacity-0');
    setTimeout(() => {
      toast.classList.add('translate-y-8', 'opacity-0');
    }, 2800);
  }

  // --- 4. COMMON UI MODALS (Notifications, Safety Toolkit, Schedule Ride, Chat) ---
  function injectCommonModals() {
    if (document.getElementById('skyppy-common-modals-root')) return;

    const root = document.createElement('div');
    root.id = 'skyppy-common-modals-root';
    root.innerHTML = `
      <!-- NOTIFICATIONS MODAL -->
      <div id="skyppy-notifications-backdrop" class="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-300 flex flex-col justify-end">
        <div class="absolute inset-0" onclick="SkyppyApp.closeModal('skyppy-notifications')"></div>
        <div id="skyppy-notifications-sheet" class="relative w-full bg-surface-container-lowest rounded-t-3xl shadow-2xl p-5 z-10 transform translate-y-full transition-transform duration-300 ease-out flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
          <div class="flex items-center justify-between border-b pb-3 border-surface-container-low">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span class="material-symbols-outlined text-[22px]">notifications_active</span>
              </div>
              <div>
                <h3 class="font-headline font-bold text-lg text-on-surface">Mysuru Live Alerts</h3>
                <p class="text-xs text-on-surface-variant">Real-time transit updates & rewards</p>
              </div>
            </div>
            <button type="button" onclick="SkyppyApp.closeModal('skyppy-notifications')" class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high">
              <span class="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
          <div class="flex flex-col gap-2.5" id="skyppy-notifications-list">
            ${appState.notifications.map(n => `
              <div class="flex items-start gap-3 p-3 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer" onclick="SkyppyApp.handleNotificationClick('${n.id}')">
                <div class="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center ${n.color} shrink-0 mt-0.5">
                  <span class="material-symbols-outlined text-[20px]">${n.icon}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <h4 class="font-semibold text-sm text-on-surface truncate">${n.title}</h4>
                    <span class="text-[10px] text-outline shrink-0 ml-2">${n.time}</span>
                  </div>
                  <p class="text-xs text-on-surface-variant mt-0.5">${n.desc}</p>
                </div>
              </div>
            `).join('')}
          </div>
          <button type="button" onclick="SkyppyApp.clearAllNotifications()" class="w-full py-2.5 text-center font-semibold text-xs text-primary hover:underline">
            Mark all as read
          </button>
        </div>
      </div>

      <!-- SAFETY TOOLKIT MODAL -->
      <div id="skyppy-safety-backdrop" class="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-300 flex flex-col justify-end">
        <div class="absolute inset-0" onclick="SkyppyApp.closeModal('skyppy-safety')"></div>
        <div id="skyppy-safety-sheet" class="relative w-full bg-surface-container-lowest rounded-t-3xl shadow-2xl p-5 z-10 transform translate-y-full transition-transform duration-300 ease-out flex flex-col gap-4 max-h-[88vh] overflow-y-auto">
          <div class="flex items-center justify-between border-b pb-3 border-surface-container-low">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-full bg-error-container text-error flex items-center justify-center">
                <span class="material-symbols-outlined text-[22px]">shield</span>
              </div>
              <div>
                <h3 class="font-headline font-bold text-lg text-on-surface">24/7 Safety Toolkit</h3>
                <p class="text-xs text-on-surface-variant">Live ride telemetry & emergency tools</p>
              </div>
            </div>
            <button type="button" onclick="SkyppyApp.closeModal('skyppy-safety')" class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface">
              <span class="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
          
          <div class="grid grid-cols-2 gap-2.5">
            <a href="tel:112" class="p-3.5 rounded-2xl bg-error-container/40 border border-error/20 flex flex-col gap-1 active:scale-95 transition-transform">
              <div class="w-8 h-8 rounded-full bg-error text-white flex items-center justify-center">
                <span class="material-symbols-outlined text-[18px]">emergency</span>
              </div>
              <span class="font-bold text-sm text-error mt-1">Police 112</span>
              <span class="text-[11px] text-on-surface-variant">Direct emergency dispatch</span>
            </a>
            <button type="button" onclick="SkyppyApp.shareTripLive()" class="p-3.5 rounded-2xl bg-surface-container-low hover:bg-surface-container flex flex-col gap-1 text-left active:scale-95 transition-transform">
              <div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <span class="material-symbols-outlined text-[18px]">share_location</span>
              </div>
              <span class="font-bold text-sm text-on-surface mt-1">Share Trip</span>
              <span class="text-[11px] text-on-surface-variant">Live GPS link to family</span>
            </button>
          </div>

          <div class="bg-surface-container-low rounded-2xl p-3.5 flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-secondary text-[20px]">verified_user</span>
                <span class="font-semibold text-xs text-on-surface">Mysuru Transit SafeRide Telemetry</span>
              </div>
              <span class="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold">ACTIVE</span>
            </div>
            <p class="text-xs text-on-surface-variant leading-relaxed">
              Your ride is continuously monitored via GPS corridors. Any unscheduled 5+ min detour automatically notifies the Mysuru transit safety cell.
            </p>
          </div>

          <div class="flex flex-col gap-2">
            <button type="button" onclick="SkyppyApp.callSupport()" class="w-full h-12 rounded-xl bg-surface-container font-semibold text-sm text-on-surface flex items-center justify-center gap-2 active:scale-95 transition-transform">
              <span class="material-symbols-outlined text-[18px] text-primary">support_agent</span>
              <span>Call 24/7 Skyppy Rider Helpline</span>
            </button>
          </div>
        </div>
      </div>

      <!-- IN-APP DRIVER CHAT MODAL -->
      <div id="skyppy-chat-backdrop" class="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-300 flex flex-col justify-end">
        <div class="absolute inset-0" onclick="SkyppyApp.closeModal('skyppy-chat')"></div>
        <div id="skyppy-chat-sheet" class="relative w-full bg-surface-container-lowest rounded-t-3xl shadow-2xl p-4 z-10 transform translate-y-full transition-transform duration-300 ease-out flex flex-col gap-3 max-h-[90vh]">
          <div class="flex items-center justify-between border-b pb-3 border-surface-container-low">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-fixed flex items-center justify-center font-bold">
                <span class="material-symbols-outlined text-[20px]">electric_rickshaw</span>
              </div>
              <div>
                <h3 class="font-headline font-bold text-sm text-on-surface">Chat with Ramesh K.</h3>
                <span class="text-[11px] text-secondary font-medium">Auto KA-09 AB 4217 • En route</span>
              </div>
            </div>
            <button type="button" onclick="SkyppyApp.closeModal('skyppy-chat')" class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface">
              <span class="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <!-- Chat History -->
          <div class="flex-1 overflow-y-auto flex flex-col gap-2 p-1 min-h-[220px] max-h-[300px]" id="skyppy-chat-messages">
            <div class="self-start max-w-[80%] bg-surface-container-low rounded-2xl rounded-tl-sm p-3 text-xs text-on-surface">
              Namaskara Jeevan sir, I have accepted your ride. I am near Gokulam 3rd Stage main arch, reaching in 4 minutes.
              <span class="block text-[9px] text-outline text-right mt-1">09:42 AM</span>
            </div>
          </div>

          <!-- Quick Canned Replies -->
          <div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button type="button" onclick="SkyppyApp.sendChatMessage('I am waiting at VVCE Gate 2.')" class="px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container text-xs text-on-surface whitespace-nowrap active:scale-95 transition-transform">
              Waiting at Gate 2
            </button>
            <button type="button" onclick="SkyppyApp.sendChatMessage('Please hurry if possible!')" class="px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container text-xs text-on-surface whitespace-nowrap active:scale-95 transition-transform">
              Please hurry 🙏
            </button>
            <button type="button" onclick="SkyppyApp.sendChatMessage('Coming down now.')" class="px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container text-xs text-on-surface whitespace-nowrap active:scale-95 transition-transform">
              Coming down now
            </button>
          </div>

          <!-- Input Row -->
          <div class="flex items-center gap-2 pt-1 border-t border-surface-container-low">
            <input type="text" id="skyppy-chat-input" placeholder="Type a message to Ramesh..." class="flex-1 bg-surface-container-low px-4 py-2.5 rounded-full text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary" onkeydown="if(event.key==='Enter') SkyppyApp.sendCustomChatMessage()">
            <button type="button" onclick="SkyppyApp.sendCustomChatMessage()" class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-md active:scale-95 transition-transform">
              <span class="material-symbols-outlined text-[18px]">send</span>
            </button>
          </div>
        </div>
      </div>

      <!-- SCHEDULE TRIP MODAL -->
      <div id="skyppy-schedule-backdrop" class="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-300 flex flex-col justify-end">
        <div class="absolute inset-0" onclick="SkyppyApp.closeModal('skyppy-schedule')"></div>
        <div id="skyppy-schedule-sheet" class="relative w-full bg-surface-container-lowest rounded-t-3xl shadow-2xl p-5 z-10 transform translate-y-full transition-transform duration-300 ease-out flex flex-col gap-4 max-h-[88vh] overflow-y-auto">
          <div class="flex items-center justify-between border-b pb-3 border-surface-container-low">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
                <span class="material-symbols-outlined text-[22px]">calendar_clock</span>
              </div>
              <div>
                <h3 class="font-headline font-bold text-lg text-on-surface">Schedule a Mysuru Trip</h3>
                <p class="text-xs text-on-surface-variant">Lock guaranteed driver & price in advance</p>
              </div>
            </div>
            <button type="button" onclick="SkyppyApp.closeModal('skyppy-schedule')" class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface">
              <span class="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
          
          <div class="flex flex-col gap-3">
            <div>
              <label class="block text-xs font-semibold text-on-surface-variant mb-1">Pick Date</label>
              <div class="grid grid-cols-3 gap-2">
                <button type="button" class="schedule-date-btn p-2.5 rounded-xl border border-primary bg-primary/10 text-primary font-bold text-xs text-center" onclick="SkyppyApp.selectScheduleDate(this, 'Tomorrow')">
                  Tomorrow<br><span class="font-normal text-[10px]">11 Nov</span>
                </button>
                <button type="button" class="schedule-date-btn p-2.5 rounded-xl border border-surface-container bg-surface-container-low text-on-surface font-medium text-xs text-center" onclick="SkyppyApp.selectScheduleDate(this, 'Thursday')">
                  Thursday<br><span class="font-normal text-[10px]">12 Nov</span>
                </button>
                <button type="button" class="schedule-date-btn p-2.5 rounded-xl border border-surface-container bg-surface-container-low text-on-surface font-medium text-xs text-center" onclick="SkyppyApp.selectScheduleDate(this, 'Friday')">
                  Friday<br><span class="font-normal text-[10px]">13 Nov</span>
                </button>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-on-surface-variant mb-1">Pickup Time</label>
              <div class="grid grid-cols-4 gap-2">
                <button type="button" class="schedule-time-btn p-2 rounded-lg border border-primary bg-primary text-white font-bold text-xs text-center" onclick="SkyppyApp.selectScheduleTime(this, '08:30 AM')">08:30 AM</button>
                <button type="button" class="schedule-time-btn p-2 rounded-lg border border-surface-container bg-surface-container-low text-on-surface font-medium text-xs text-center" onclick="SkyppyApp.selectScheduleTime(this, '09:00 AM')">09:00 AM</button>
                <button type="button" class="schedule-time-btn p-2 rounded-lg border border-surface-container bg-surface-container-low text-on-surface font-medium text-xs text-center" onclick="SkyppyApp.selectScheduleTime(this, '02:30 PM')">02:30 PM</button>
                <button type="button" class="schedule-time-btn p-2 rounded-lg border border-surface-container bg-surface-container-low text-on-surface font-medium text-xs text-center" onclick="SkyppyApp.selectScheduleTime(this, '06:00 PM')">06:00 PM</button>
              </div>
            </div>

            <div class="p-3 rounded-2xl bg-surface-container-low flex items-center justify-between">
              <div class="flex flex-col">
                <span class="text-[10px] uppercase font-bold text-outline">Selected Route</span>
                <span class="font-bold text-xs text-on-surface">VVCE Campus → Infosys Hebbal</span>
              </div>
              <span class="font-bold text-sm text-primary">₹185</span>
            </div>
          </div>

          <button type="button" onclick="SkyppyApp.confirmScheduledRide()" class="w-full h-12 rounded-xl bg-primary text-white font-bold text-sm shadow-md active:scale-95 transition-transform flex items-center justify-center gap-1.5">
            <span>Confirm Schedule (Zero Advance Fee)</span>
            <span class="material-symbols-outlined text-[18px]">check</span>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(root);
  }

  function openModal(id) {
    const backdrop = document.getElementById(`${id}-backdrop`);
    const sheet = document.getElementById(`${id}-sheet`);
    if (backdrop && sheet) {
      backdrop.classList.remove('opacity-0', 'pointer-events-none');
      backdrop.classList.add('opacity-100');
      sheet.classList.remove('translate-y-full');
      sheet.classList.add('translate-y-0');
    }
  }

  function closeModal(id) {
    const backdrop = document.getElementById(`${id}-backdrop`);
    const sheet = document.getElementById(`${id}-sheet`);
    if (backdrop && sheet) {
      backdrop.classList.add('opacity-0', 'pointer-events-none');
      backdrop.classList.remove('opacity-100');
      sheet.classList.add('translate-y-full');
      sheet.classList.remove('translate-y-0');
    }
  }

  // --- 5. INITIALIZE GLOBAL CLICK DELEGATION & CONNECT ALL CONTROLS ---
  function initEventBindings() {
    document.addEventListener('click', function (e) {
      // 1. Navigation Elements with data-navigate
      const navTarget = e.target.closest('[data-navigate]');
      if (navTarget) {
        const dest = navTarget.getAttribute('data-navigate');
        if (dest) {
          e.preventDefault();
          navigateTo(dest);
          return;
        }
      }

      // 2. Notification Bell in Header
      const notifBtn = e.target.closest('button[aria-label="Notifications"]');
      if (notifBtn) {
        e.preventDefault();
        openModal('skyppy-notifications');
        return;
      }

      // 3. Safety Shield in Header
      const shieldBtn = e.target.closest('button[aria-label*="Safety"], button[aria-label*="Help"]');
      if (shieldBtn) {
        e.preventDefault();
        openModal('skyppy-safety');
        return;
      }

      // 4. Schedule Trip button
      const scheduleBtn = e.target.closest('button:has(span:contains("Schedule Trip")), button:has(span.material-symbols-outlined:contains("calendar_clock"))');
      if (scheduleBtn && scheduleBtn.innerText.includes('Schedule Trip')) {
        e.preventDefault();
        openModal('skyppy-schedule');
        return;
      }

      // 5. In-app Chat with driver
      const chatBtn = e.target.closest('button[aria-label*="Chat with Driver"], a[aria-label*="Message driver"]');
      if (chatBtn) {
        e.preventDefault();
        openModal('skyppy-chat');
        return;
      }

      // 6. Header Profile Avatar -> 09-profile
      const profileImg = e.target.closest('header img[alt="Profile"]');
      if (profileImg) {
        e.preventDefault();
        navigateTo('09-profile');
        return;
      }
    }, true);
  }

  // --- 6. EXPOSE PUBLIC API ---
  window.SkyppyApp = {
    state: appState,
    navigateTo: navigateTo,
    showToast: showToast,
    openModal: openModal,
    closeModal: closeModal,
    handleNotificationClick: function (id) {
      closeModal('skyppy-notifications');
      if (id === '1') navigateTo('06-live-ride-tracking');
      else if (id === '2') navigateTo('07-skyppy-miles');
      else navigateTo('01-rides-home');
    },
    clearAllNotifications: function () {
      closeModal('skyppy-notifications');
      showToast('All notifications marked as read');
    },
    shareTripLive: function () {
      closeModal('skyppy-safety');
      navigator.clipboard?.writeText('https://skyppy.app/track/SKY784392');
      showToast('Live tracking link copied to clipboard!');
    },
    callSupport: function () {
      closeModal('skyppy-safety');
      showToast('Connecting to Mysuru 24/7 Helpline: 1800-425-SKYP');
    },
    sendChatMessage: function (text) {
      const container = document.getElementById('skyppy-chat-messages');
      if (container) {
        const userMsg = document.createElement('div');
        userMsg.className = 'self-end max-w-[80%] bg-primary text-white rounded-2xl rounded-tr-sm p-3 text-xs';
        userMsg.innerHTML = `${text}<span class="block text-[9px] text-white/70 text-right mt-1">Just now</span>`;
        container.appendChild(userMsg);
        container.scrollTop = container.scrollHeight;

        // Simulated Driver Reply after 1.5s
        setTimeout(() => {
          const replies = [
            "Sure sir! Reaching VVCE in 2 mins.",
            "Understood sir, parking near the gate.",
            "Yes sir, I see you."
          ];
          const rep = replies[Math.floor(Math.random() * replies.length)];
          const driverMsg = document.createElement('div');
          driverMsg.className = 'self-start max-w-[80%] bg-surface-container-low rounded-2xl rounded-tl-sm p-3 text-xs text-on-surface';
          driverMsg.innerHTML = `${rep}<span class="block text-[9px] text-outline text-right mt-1">Just now</span>`;
          container.appendChild(driverMsg);
          container.scrollTop = container.scrollHeight;
        }, 1500);
      }
    },
    sendCustomChatMessage: function () {
      const input = document.getElementById('skyppy-chat-input');
      if (input && input.value.trim()) {
        this.sendChatMessage(input.value.trim());
        input.value = '';
      }
    },
    selectScheduleDate: function (btn, date) {
      document.querySelectorAll('.schedule-date-btn').forEach(b => {
        b.className = 'schedule-date-btn p-2.5 rounded-xl border border-surface-container bg-surface-container-low text-on-surface font-medium text-xs text-center';
      });
      btn.className = 'schedule-date-btn p-2.5 rounded-xl border border-primary bg-primary/10 text-primary font-bold text-xs text-center';
    },
    selectScheduleTime: function (btn, time) {
      document.querySelectorAll('.schedule-time-btn').forEach(b => {
        b.className = 'schedule-time-btn p-2 rounded-lg border border-surface-container bg-surface-container-low text-on-surface font-medium text-xs text-center';
      });
      btn.className = 'schedule-time-btn p-2 rounded-lg border border-primary bg-primary text-white font-bold text-xs text-center';
    },
    confirmScheduledRide: function () {
      closeModal('skyppy-schedule');
      showToast('Ride scheduled for tomorrow 08:30 AM!');
      setTimeout(() => {
        navigateTo('08-activity', { activityTab: 'scheduled' });
      }, 700);
    }
  };

  // Run on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      injectCommonModals();
      initEventBindings();
    });
  } else {
    injectCommonModals();
    initEventBindings();
  }

})(window, document);

