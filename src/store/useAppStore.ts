import { create } from 'zustand';
import {
  ThemeMode,
  Language,
  LocationItem,
  VehicleOption,
  VehicleCategoryId,
  ActiveBooking,
  RideHistoryItem,
  NotificationItem,
  MilesReward,
  MilesMilestone,
  UserProfile,
  RidePreferences,
  ModalType
} from '../types';
import { calculateDistanceBetween } from '../utils/mysuruLocations';

export interface DetailedFare {
  baseFare: number;
  distanceFare: number;
  platformFee: number;
  discount: number;
  totalFare: number;
  originalFare: number;
  distanceKm: number;
  ratePerKm: number;
}

interface AppState {
  // Theme & Language
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setTheme: (mode: ThemeMode) => void;
  language: Language;
  setLanguage: (lang: Language) => void;

  // Simulator layout mode
  viewMode: 'frame' | 'full';
  setViewMode: (mode: 'frame' | 'full') => void;

  // User Profile
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;

  // Ride Preferences
  preferences: RidePreferences;
  updatePreferences: (prefs: Partial<RidePreferences>) => void;

  // Locations
  pickup: LocationItem;
  destination: LocationItem;
  setPickup: (loc: LocationItem) => void;
  setDestination: (loc: LocationItem) => void;
  swapLocations: () => void;

  // Vehicles (Auto, Hatchback, Sedan - Official Skyppy Rides Fleet)
  vehicles: Record<VehicleCategoryId, VehicleOption>;
  selectedVehicleId: VehicleCategoryId;
  selectVehicle: (id: VehicleCategoryId) => void;
  getFareBreakdown: (vehicleId: VehicleCategoryId, distanceKm?: number) => DetailedFare;

  // Booking & Live Ride
  activeBooking: ActiveBooking | null;
  createBooking: () => ActiveBooking;
  updateBookingStatus: (status: ActiveBooking['status'], progress?: number, eta?: number) => void;
  cancelBooking: (reason: string) => void;
  completeCurrentRide: (rating?: number, comment?: string, tip?: number) => void;
  scheduleRide: (date: string, time: string) => void;
  cancelScheduledRide: (id: string) => void;

  // Coupons
  appliedCoupon: { code: string; discount: number } | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;

  // Miles Data (Distance-backed prototype enhancement)
  miles: {
    lifetimeKm: number;
    monthlyKm: number;
    monthlyTrips: number;
    currentTier: string;
    nextMilestoneKm: number;
    rewards: MilesReward[];
    milestones: MilesMilestone[];
    ledger: Array<{ id: string; route: string; mode: string; date: string; km: number }>;
  };
  redeemVoucher: (id: string) => void;

  // Activity & History
  rideHistory: RideHistoryItem[];
  rebookRide: (item: RideHistoryItem) => void;

  // Saved Places
  savedPlaces: LocationItem[];
  addSavedPlace: (place: LocationItem) => void;
  deleteSavedPlace: (id: string) => void;
  updateSavedPlace: (id: string, place: LocationItem) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationsAsRead: () => void;

  // Global Modals State
  activeModal: ModalType;
  modalData?: any;
  openModal: (modal: ModalType, data?: any) => void;
  closeModal: () => void;

  // Toast
  toastMessage: string | null;
  toastType: 'info' | 'success' | 'error';
  showToast: (msg: string, type?: 'info' | 'success' | 'error') => void;
  hideToast: () => void;

  // Reset Demo Action
  resetDemoState: () => void;
}

// Official Skyppy Rides Fleet: Auto, Mini, Hatchback, Sedan, SUV (Dedicated Local Studio Asset Library)
const OFFICIAL_VEHICLES: Record<VehicleCategoryId, VehicleOption> = {
  auto: {
    id: 'auto',
    name: 'Auto',
    model: 'Bajaj RE Electric',
    category: 'Everyday rides',
    tag: 'Most Affordable',
    descriptor: 'Everyday rides',
    distanceStr: '~ 1.2 km',
    fare: 61,
    originalFare: 75,
    capacity: '3 seats',
    etaMinutes: 3,
    badge: 'Most Affordable',
    description: 'Iconic Mysore 3-wheeler electric auto rickshaw. Quickest for market & city traffic.',
    image: '/vehicles/auto.png',
    driver: {
      name: 'Ramesh K.',
      phone: '+91 98765 43210',
      rating: '4.8',
      trips: '1,240',
      plate: 'KA-09 AB 4217',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3740jxSGU_BvWXX_0bKvu2sxELLX3AAndNutnCW1XB__FwZwimVdQj4fOaPyFKYMsAmEUOU5b79mzMqvzX5ZGIkNXUzI4OJZrn2REKieiB-DgdiisKPKyBxEF61HkHHW9b1Rf_sTB4cKo6Q24dXC2eWjIJcG5MsBenwwv-U3LLkhaiFKpskZqBkUWS7J1dwK6Ti9Wt5E706pyHnAzMQpT4793gyOibANPEYB0dnw'
    }
  },
  mini: {
    id: 'mini',
    name: 'Mini',
    model: 'Tata Tiago',
    category: 'Compact & efficient',
    tag: 'Compact & Quick',
    descriptor: 'Compact & efficient',
    distanceStr: '~ 1.8 km',
    fare: 74,
    originalFare: 90,
    capacity: '4 seats',
    etaMinutes: 4,
    badge: 'Compact & Quick',
    description: 'Compact air-conditioned hatchback cab. Perfect for swift and efficient daily commutes.',
    image: '/vehicles/mini.png',
    driver: {
      name: 'Anitha S.',
      phone: '+91 98451 11200',
      rating: '4.9',
      trips: '1,890',
      plate: 'KA-09 CD 3284',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80'
    }
  },
  hatchback: {
    id: 'hatchback',
    name: 'Hatchback',
    model: 'Hyundai i20',
    category: 'Popular & versatile',
    tag: 'Popular Choice',
    descriptor: 'Popular & versatile',
    distanceStr: '~ 2.1 km',
    fare: 89,
    originalFare: 110,
    capacity: '4 seats',
    etaMinutes: 4,
    badge: 'Popular Choice',
    description: 'Versatile, spacious premium hatchback with top comfort and great legroom.',
    image: '/vehicles/hatchback.png',
    driver: {
      name: 'Vikram N.',
      phone: '+91 98451 22910',
      rating: '4.8',
      trips: '2,110',
      plate: 'KA-09 EF 5531',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFC_47gt-3lPsOkq5tq9A1wWjAanAGLT6QZO8F3aTw1LfNOksrrxtXPF71CGQ_FJ7pd2LCtqBQDSpXdXwOpey0sE6qNx6fucroCvNH0h6iro5jb2ysLyvNzFo1738hYjEHq4Swjk-8vLvooNWxWoVptliHy445jMIRy5KQxPdsJiOuxf15CvmmGzGTG3p2hxjjR4GDmV5Xy9khm4tVw1cxiuqqOxQX-FwykOSgEZM'
    }
  },
  sedan: {
    id: 'sedan',
    name: 'Sedan',
    model: 'Honda City',
    category: 'Comfort & space',
    tag: 'Extra Comfort',
    descriptor: 'Comfort & space',
    distanceStr: '~ 2.4 km',
    fare: 112,
    originalFare: 135,
    capacity: '4 seats',
    etaMinutes: 5,
    badge: 'Extra Comfort',
    description: 'Spacious sedan with executive comfort, extra legroom & boot space. Handpicked top-tier drivers.',
    image: '/vehicles/sedan.png',
    driver: {
      name: 'Suresh P.',
      phone: '+91 97312 88401',
      rating: '4.9',
      trips: '3,450',
      plate: 'KA-09 GH 7763',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80'
    }
  },
  suv: {
    id: 'suv',
    name: 'SUV',
    model: 'Hyundai Creta',
    category: 'Premium & spacious',
    tag: 'Spacious & Premium',
    descriptor: 'Premium & spacious',
    distanceStr: '~ 3.1 km',
    fare: 149,
    originalFare: 180,
    capacity: '6 seats',
    etaMinutes: 6,
    badge: 'Spacious & Premium',
    description: 'Spacious modern SUV with high ride height, plush seating, and room for the whole group.',
    image: '/vehicles/suv.png',
    driver: {
      name: 'Manoj R.',
      phone: '+91 99001 54321',
      rating: '4.9',
      trips: '4,120',
      plate: 'KA-09 JK 9901',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80'
    }
  }
};

const DEFAULT_PROFILE: UserProfile = {
  name: 'Jeevan H.',
  email: 'jeevanh259@gmail.com',
  phone: '+91 98450 33812',
  emergencyContactName: 'Ananya H. (Sister)',
  emergencyContactPhone: '+91 98451 90812',
  tier: 'Tier 2 Explorer',
  totalSpent: 2480
};

const DEFAULT_PREFERENCES: RidePreferences = {
  acDefault: true,
  quietRide: true,
  autoTipPercent: 5,
  autoDeductCash: true
};

const DEFAULT_SAVED_PLACES: LocationItem[] = [
  { id: 'sp-1', title: 'Home', address: 'Shivarathreeshwara Nagar, Mysuru', icon: 'home', distanceKm: 3.8 },
  { id: 'sp-2', title: 'Work', address: 'VVCE Campus, Gokulam 3rd Stage', icon: 'work', distanceKm: 0.5, isOrigin: true },
  { id: 'sp-3', title: 'Railway Station', address: 'Medar Block, Yadavagiri, Mysuru', icon: 'train', distanceKm: 6.1 },
  { id: 'sp-4', title: 'Mysuru Palace', address: 'Sayyaji Rao Rd, Agrahara', icon: 'castle', distanceKm: 5.8 }
];

const DEFAULT_HISTORY: RideHistoryItem[] = [
  {
    id: 'hist-1',
    bookingId: 'SKY784392',
    date: 'Yesterday, 04:15 PM',
    origin: 'VVCE, Gokulam',
    destination: 'JSS Medical College & Hospital',
    vehicle: 'Auto',
    vehicleIcon: 'electric_rickshaw',
    fare: 76,
    paymentMethod: 'UPI AutoPay',
    distanceKm: 4.2,
    durationMin: 12,
    status: 'completed',
    rating: 5.0,
    driver: 'Ramesh K.',
    plate: 'KA-09 AB 4217',
    milesEarned: 4.2
  },
  {
    id: 'hist-2',
    bookingId: 'SKY692104',
    date: '07 Nov 2026, 11:20 AM',
    origin: 'Mysuru Railway Station',
    destination: 'Bogadi 2nd Stage',
    vehicle: 'Hatchback',
    vehicleIcon: 'directions_car',
    fare: 142,
    paymentMethod: 'HDFC Card',
    distanceKm: 8.6,
    durationMin: 21,
    status: 'completed',
    rating: 4.9,
    driver: 'Santhosh M.',
    plate: 'KA-09 C 8120',
    milesEarned: 8.6
  },
  {
    id: 'hist-3',
    bookingId: 'SKY542890',
    date: '05 Nov 2026, 06:40 PM',
    origin: 'VVCE, Gokulam',
    destination: 'Mysuru Palace (Amba Vilas)',
    vehicle: 'Auto',
    vehicleIcon: 'electric_rickshaw',
    fare: 98,
    paymentMethod: 'Cash Paid',
    distanceKm: 5.8,
    durationMin: 16,
    status: 'completed',
    rating: 5.0,
    driver: 'Kumar Swamy',
    plate: 'KA-09 E 3319',
    milesEarned: 5.8
  },
  {
    id: 'hist-4',
    bookingId: 'SKY991042',
    date: 'Tomorrow, 08:30 AM',
    origin: 'VVCE Campus, Gokulam',
    destination: 'Infosys Mysore (Hebbal)',
    vehicle: 'Hatchback',
    vehicleIcon: 'directions_car',
    fare: 185,
    paymentMethod: 'UPI Pay',
    distanceKm: 11.2,
    durationMin: 24,
    status: 'scheduled',
    driver: 'Assigned 15 min prior',
    plate: 'Verified Pro',
    milesEarned: 11.2
  },
  {
    id: 'hist-5',
    bookingId: 'SKY301944',
    date: '01 Nov 2026, 01:10 PM',
    origin: 'VVCE Gokulam',
    destination: 'Nexus Centre City Mall',
    vehicle: 'Auto',
    vehicleIcon: 'cancel',
    fare: 0,
    paymentMethod: 'Free Cancellation',
    distanceKm: 2.4,
    durationMin: 0,
    status: 'cancelled',
    driver: 'Ramesh K.',
    plate: 'KA-09 AB 4217',
    milesEarned: 0
  }
];

function resolveSystemTheme(): 'light' | 'dark' {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

function applyThemeToDOM(theme: ThemeMode) {
  const resolved = theme === 'system' ? resolveSystemTheme() : theme;
  const root = document.documentElement;
  if (resolved === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.remove('dark');
    root.classList.add('light');
  }
}

const loadJSON = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const saveJSON = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

export const useAppStore = create<AppState>((set, get) => {
  const savedTheme = (localStorage.getItem('skyppy_theme_pref') as ThemeMode) || 'light';
  applyThemeToDOM(savedTheme);

  const savedLang = (localStorage.getItem('skyppy_lang_pref') as Language) || 'en';
  const savedProfile = loadJSON<UserProfile>('skyppy_user_profile', DEFAULT_PROFILE);
  const savedPreferences = loadJSON<RidePreferences>('skyppy_preferences', DEFAULT_PREFERENCES);
  const savedPlaces = loadJSON<LocationItem[]>('skyppy_saved_places', DEFAULT_SAVED_PLACES);
  const savedHistory = loadJSON<RideHistoryItem[]>('skyppy_ride_history', DEFAULT_HISTORY);
  const savedBooking = loadJSON<ActiveBooking | null>('skyppy_active_booking', null);

  const defaultMiles = {
    lifetimeKm: 248.6,
    monthlyKm: 64.2,
    monthlyTrips: 14,
    currentTier: 'Tier 2 Explorer',
    nextMilestoneKm: 300.0,
    rewards: [
      {
        id: 'rew-1',
        title: '₹50 Flat Off',
        desc: 'Applicable directly on your next Mysore city commute',
        code: 'MYSURU50',
        validDays: 'Valid 14d',
        icon: 'local_activity',
        redeemed: false,
        minKmRequired: 100
      },
      {
        id: 'rew-2',
        title: 'Peak Surge Shield',
        desc: 'Zero multiplier surge rates during evening commute',
        code: 'NOSURGE',
        validDays: '2 Passes Left',
        icon: 'shield',
        redeemed: false,
        minKmRequired: 250
      },
      {
        id: 'rew-3',
        title: '₹15 Commuter Pass',
        desc: 'Auto-credited discount across Auto & Cab fleet',
        code: 'MILES15',
        validDays: 'Active',
        icon: 'stars',
        redeemed: false,
        minKmRequired: 50
      }
    ],
    milestones: [
      { id: 'm-1', km: 50, title: '50 km · First Explorer', desc: 'Mysuru Heritage Pioneer badge + welcome credits', status: 'unlocked' as const, completedDate: 'Completed 12 Jan 2025' },
      { id: 'm-2', km: 100, title: '100 km · 15% Off 5 Rides', desc: 'Redeemed across city and express transit bookings', status: 'unlocked' as const, completedDate: 'Completed 04 Feb 2025' },
      { id: 'm-3', km: 250, title: '250 km · Zero Peak Surge', desc: 'Permanent surge immunity across Mysuru corridors', status: 'almost' as const },
      { id: 'm-4', km: 500, title: '500 km · Priority Dispatch', desc: 'Top dispatch queue assignment during rush hours & rain', status: 'locked' as const },
      { id: 'm-5', km: 1000, title: '1,000 km · Skyppy VIP Club', desc: 'Lifetime platform benefits & Mysore Palace Gala invitation', status: 'locked' as const }
    ],
    ledger: [
      { id: 'led-1', route: 'VVCE to JSS Medical College', mode: 'Yesterday · Auto Ride', date: 'Yesterday', km: 4.2 },
      { id: 'led-2', route: 'Mysuru Station to Bogadi', mode: '3 days ago · Hatchback', date: '3 days ago', km: 8.6 },
      { id: 'led-3', route: 'Gokulam to Mysuru Palace', mode: '5 days ago · Auto', date: '5 days ago', km: 5.8 }
    ]
  };

  const savedMiles = loadJSON('skyppy_miles_data', defaultMiles);

  return {
    theme: savedTheme,
    resolvedTheme: savedTheme === 'system' ? resolveSystemTheme() : savedTheme,
    setTheme: (newTheme: ThemeMode) => {
      localStorage.setItem('skyppy_theme_pref', newTheme);
      applyThemeToDOM(newTheme);
      set({
        theme: newTheme,
        resolvedTheme: newTheme === 'system' ? resolveSystemTheme() : newTheme
      });
      get().showToast(`Theme updated to ${newTheme.toUpperCase()}`);
    },

    language: savedLang,
    setLanguage: (lang: Language) => {
      localStorage.setItem('skyppy_lang_pref', lang);
      set({ language: lang });
      get().showToast(lang === 'kn' ? 'ಭಾಷೆಯನ್ನು ಕನ್ನಡಕ್ಕೆ ಹೊಂದಿಸಲಾಗಿದೆ' : 'Language set to English', 'success');
    },

    viewMode: (localStorage.getItem('skyppy_view_mode') as 'frame' | 'full') || 'frame',
    setViewMode: (mode) => {
      localStorage.setItem('skyppy_view_mode', mode);
      set({ viewMode: mode });
    },

    userProfile: savedProfile,
    updateUserProfile: (partial) => {
      set((state) => {
        const updated = { ...state.userProfile, ...partial };
        saveJSON('skyppy_user_profile', updated);
        return { userProfile: updated };
      });
      get().showToast('Profile information saved', 'success');
    },

    preferences: savedPreferences,
    updatePreferences: (partial) => {
      set((state) => {
        const updated = { ...state.preferences, ...partial };
        saveJSON('skyppy_preferences', updated);
        return { preferences: updated };
      });
      get().showToast('Preferences updated', 'success');
    },

    pickup: {
      title: 'VVCE Campus, Gokulam',
      address: 'Gokulam 3rd Stage, Mysuru',
      landmark: 'Gate 2 Entrance'
    },
    destination: {
      title: 'JSS Medical College & Hospital',
      address: 'Bannimantap A-Layout, Mysuru',
      distanceKm: 4.2,
      durationMin: 12
    },
    setPickup: (loc) => {
      const { destination } = get();
      const calc = calculateDistanceBetween(loc, destination);
      const isSame = loc.title.trim().toLowerCase() === destination.title.trim().toLowerCase();
      const newDistance = isSame ? 0 : (calc.distanceKm !== undefined ? calc.distanceKm : 4.2);
      const newDuration = isSame ? 0 : (calc.durationMin !== undefined ? calc.durationMin : 12);
      const updatedDestination = {
        ...destination,
        distanceKm: newDistance,
        durationMin: newDuration
      };
      set({ pickup: loc, destination: updatedDestination });
      get().showToast(`Pickup: ${loc.title}`);
    },
    setDestination: (loc) => {
      const { pickup } = get();
      const calc = calculateDistanceBetween(pickup, loc);
      const isSame = pickup.title.trim().toLowerCase() === loc.title.trim().toLowerCase();
      const newDistance = isSame ? 0 : (calc.distanceKm !== undefined ? calc.distanceKm : 4.2);
      const newDuration = isSame ? 0 : (calc.durationMin !== undefined ? calc.durationMin : 12);
      const updatedLoc = {
        ...loc,
        distanceKm: newDistance,
        durationMin: newDuration
      };
      set({ destination: updatedLoc });
      get().showToast(`Destination: ${loc.title}`);
    },
    swapLocations: () => {
      const { pickup, destination } = get();
      const calc = calculateDistanceBetween(destination, pickup);
      const isSame = pickup.title.trim().toLowerCase() === destination.title.trim().toLowerCase();
      const newDistance = isSame ? 0 : (calc.distanceKm !== undefined ? calc.distanceKm : 4.2);
      const newDuration = isSame ? 0 : (calc.durationMin !== undefined ? calc.durationMin : 12);
      set({
        pickup: { ...destination, distanceKm: undefined, durationMin: undefined },
        destination: { ...pickup, distanceKm: newDistance, durationMin: newDuration }
      });
      get().showToast('Pickup and Destination swapped');
    },

    vehicles: OFFICIAL_VEHICLES,
    selectedVehicleId: 'auto',
    selectVehicle: (id) => {
      set({ selectedVehicleId: id });
    },

    getFareBreakdown: (vehicleId, distanceKm) => {
      const isParamProvided = distanceKm !== undefined;
      const storeDist = get().destination.distanceKm;
      const dist = isParamProvided ? distanceKm : (storeDist !== undefined ? storeDist : 4.2);
      const { appliedCoupon } = get();
      const discount = appliedCoupon ? appliedCoupon.discount : 0;

      const rateCards: Record<VehicleCategoryId, { base: number; perKm: number; origBase: number; origPerKm: number }> = {
        auto: { base: 25, perKm: 8.5, origBase: 30, origPerKm: 11 },
        mini: { base: 32, perKm: 10, origBase: 38, origPerKm: 13 },
        hatchback: { base: 38, perKm: 12, origBase: 45, origPerKm: 15 },
        sedan: { base: 48, perKm: 15, origBase: 58, origPerKm: 18 },
        suv: { base: 65, perKm: 20, origBase: 78, origPerKm: 24 }
      };

      const card = rateCards[vehicleId] || rateCards.auto;
      if (dist === 0) {
        return {
          baseFare: 0,
          distanceFare: 0,
          platformFee: 0,
          discount: 0,
          totalFare: 0,
          originalFare: 0,
          distanceKm: 0,
          ratePerKm: card.perKm
        };
      }
      const baseFare = card.base;
      const distanceFare = Math.round(dist * card.perKm);
      const platformFee = 0; // Waived for promo
      const rawTotal = baseFare + distanceFare + platformFee;
      const totalFare = Math.max(25, rawTotal - discount);
      const originalFare = card.origBase + Math.round(dist * card.origPerKm);

      return {
        baseFare,
        distanceFare,
        platformFee,
        discount,
        totalFare,
        originalFare,
        distanceKm: dist,
        ratePerKm: card.perKm
      };
    },

    activeBooking: savedBooking,

    createBooking: () => {
      const { selectedVehicleId, vehicles, pickup, destination, getFareBreakdown } = get();
      const v = vehicles[selectedVehicleId] || vehicles.auto;
      const fareObj = getFareBreakdown(selectedVehicleId, destination.distanceKm);

      const newBooking: ActiveBooking = {
        bookingId: 'SKY' + Math.floor(100000 + Math.random() * 900000),
        status: 'searching',
        vehicleId: selectedVehicleId,
        vehicleName: v.name,
        fare: fareObj.totalFare,
        baseFare: fareObj.baseFare,
        distanceFare: fareObj.distanceFare,
        platformFee: fareObj.platformFee,
        discount: fareObj.discount,
        otp: String(Math.floor(1000 + Math.random() * 9000)),
        startOtp: String(Math.floor(1000 + Math.random() * 9000)),
        driver: v.driver,
        pickup,
        destination,
        bookedAt: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        etaMinutes: v.etaMinutes,
        progressPercent: 10,
        paymentMethod: 'UPI AutoPay (•••• 2590)'
      };

      saveJSON('skyppy_active_booking', newBooking);
      set({ activeBooking: newBooking });
      return newBooking;
    },

    updateBookingStatus: (status, progress, eta) => {
      const cur = get().activeBooking;
      if (!cur) return;
      const updated = {
        ...cur,
        status,
        progressPercent: progress !== undefined ? progress : cur.progressPercent,
        etaMinutes: eta !== undefined ? eta : cur.etaMinutes
      };
      saveJSON('skyppy_active_booking', updated);
      set({ activeBooking: updated });
    },

    cancelBooking: (reason: string) => {
      const cur = get().activeBooking;
      if (cur) {
        const cancelledItem: RideHistoryItem = {
          id: 'hist-' + Date.now(),
          bookingId: cur.bookingId,
          date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          origin: cur.pickup.title,
          destination: cur.destination.title,
          vehicle: cur.vehicleName,
          vehicleIcon: cur.vehicleId === 'auto' ? 'electric_rickshaw' : 'directions_car',
          fare: 0,
          paymentMethod: 'Free Cancellation',
          distanceKm: cur.destination.distanceKm || 4.2,
          durationMin: 0,
          status: 'cancelled',
          driver: cur.driver.name,
          plate: cur.driver.plate,
          milesEarned: 0
        };

        const updatedHistory = [cancelledItem, ...get().rideHistory];
        saveJSON('skyppy_ride_history', updatedHistory);
        localStorage.removeItem('skyppy_active_booking');

        set({
          activeBooking: null,
          rideHistory: updatedHistory
        });
      } else {
        localStorage.removeItem('skyppy_active_booking');
        set({ activeBooking: null });
      }
      get().showToast(`Booking cancelled (${reason || '₹0 fee'})`, 'info');
    },

    completeCurrentRide: (rating = 5.0, comment = '', tip = 0) => {
      const cur = get().activeBooking;
      if (!cur) return;
      const earnedKm = cur.destination.distanceKm || 4.2;
      const finalFareWithTip = cur.fare + (tip || 0);

      const completedItem: RideHistoryItem = {
        id: 'hist-' + Date.now(),
        bookingId: cur.bookingId,
        date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        origin: cur.pickup.title,
        destination: cur.destination.title,
        vehicle: cur.vehicleName,
        vehicleIcon: cur.vehicleId === 'auto' ? 'electric_rickshaw' : 'directions_car',
        fare: finalFareWithTip,
        paymentMethod: cur.paymentMethod,
        distanceKm: earnedKm,
        durationMin: 14,
        status: 'completed',
        rating,
        feedbackComment: comment,
        driver: cur.driver.name,
        plate: cur.driver.plate,
        milesEarned: earnedKm
      };

      const updatedHistory = [completedItem, ...get().rideHistory];
      saveJSON('skyppy_ride_history', updatedHistory);
      localStorage.removeItem('skyppy_active_booking');

      // Update miles & milestones
      const curMiles = get().miles;
      const newLifetime = Number((curMiles.lifetimeKm + earnedKm).toFixed(1));
      const newMonthly = Number((curMiles.monthlyKm + earnedKm).toFixed(1));

      const updatedMilestones = curMiles.milestones.map((m) => {
        if (newLifetime >= m.km) {
          return { ...m, status: 'unlocked' as const, completedDate: m.completedDate || 'Completed Today' };
        } else if (m.km - newLifetime <= 5) {
          return { ...m, status: 'almost' as const };
        }
        return m;
      });

      const updatedMiles = {
        ...curMiles,
        lifetimeKm: newLifetime,
        monthlyKm: newMonthly,
        monthlyTrips: curMiles.monthlyTrips + 1,
        milestones: updatedMilestones,
        ledger: [
          {
            id: 'led-' + Date.now(),
            route: `${cur.pickup.title} to ${cur.destination.title}`,
            mode: `Today · ${cur.vehicleName}`,
            date: 'Today',
            km: earnedKm
          },
          ...curMiles.ledger
        ]
      };
      saveJSON('skyppy_miles_data', updatedMiles);

      const curProfile = get().userProfile;
      const updatedProfile = {
        ...curProfile,
        totalSpent: curProfile.totalSpent + finalFareWithTip
      };
      saveJSON('skyppy_user_profile', updatedProfile);

      set({
        activeBooking: null,
        rideHistory: updatedHistory,
        miles: updatedMiles,
        userProfile: updatedProfile
      });

      get().showToast(`Ride Completed! +${earnedKm} km credited to Skyppy Miles!`, 'success');
    },

    scheduleRide: (date: string, time: string) => {
      const { pickup, destination, selectedVehicleId, vehicles, getFareBreakdown } = get();
      const v = vehicles[selectedVehicleId] || vehicles.auto;
      const fareObj = getFareBreakdown(selectedVehicleId, destination.distanceKm);
      const dist = destination.distanceKm || 4.2;

      const scheduledItem: RideHistoryItem = {
        id: 'hist-' + Date.now(),
        bookingId: 'SKY' + Math.floor(100000 + Math.random() * 900000),
        date: `${date}, ${time}`,
        origin: pickup.title,
        destination: destination.title,
        vehicle: v.name,
        vehicleIcon: v.id === 'auto' ? 'electric_rickshaw' : 'directions_car',
        fare: fareObj.totalFare,
        paymentMethod: 'UPI AutoPay (Advance)',
        distanceKm: dist,
        durationMin: Math.round(dist * 2.5),
        status: 'scheduled',
        driver: 'Assigned 15 min prior',
        plate: 'Verified Pro',
        milesEarned: dist
      };

      const updated = [scheduledItem, ...get().rideHistory];
      saveJSON('skyppy_ride_history', updated);
      set({ rideHistory: updated });
      get().showToast(`Trip scheduled for ${date} at ${time}!`, 'success');
    },

    cancelScheduledRide: (id: string) => {
      set((state) => {
        const updated = state.rideHistory.map((item) =>
          item.id === id ? { ...item, status: 'cancelled' as const, paymentMethod: 'Free Cancellation' } : item
        );
        saveJSON('skyppy_ride_history', updated);
        return { rideHistory: updated };
      });
      get().showToast('Scheduled ride cancelled without penalty', 'info');
    },

    appliedCoupon: { code: 'MILES15', discount: 15 },
    applyCoupon: (code) => {
      const clean = code.toUpperCase().trim();
      if (clean === 'MILES15') {
        set({ appliedCoupon: { code: 'MILES15', discount: 15 } });
        get().showToast('Coupon MILES15 applied! ₹15 off');
        return true;
      } else if (clean === 'MYSURU50') {
        set({ appliedCoupon: { code: 'MYSURU50', discount: 50 } });
        get().showToast('Coupon MYSURU50 applied! ₹50 off');
        return true;
      } else if (clean === 'NOSURGE') {
        set({ appliedCoupon: { code: 'NOSURGE', discount: 25 } });
        get().showToast('Peak Surge Shield applied! ₹25 off');
        return true;
      }
      get().showToast('Invalid coupon code', 'error');
      return false;
    },
    removeCoupon: () => {
      set({ appliedCoupon: null });
      get().showToast('Coupon removed');
    },

    miles: savedMiles,

    redeemVoucher: (id) => {
      set((state) => {
        const target = state.miles.rewards.find((r) => r.id === id);
        if (target) {
          state.applyCoupon(target.code);
        }
        const updatedMiles = {
          ...state.miles,
          rewards: state.miles.rewards.map((r) => (r.id === id ? { ...r, redeemed: true } : r))
        };
        saveJSON('skyppy_miles_data', updatedMiles);
        return { miles: updatedMiles };
      });
    },

    rideHistory: savedHistory,
    rebookRide: (item) => {
      set({
        pickup: { title: item.origin, address: 'Mysuru, Karnataka' },
        destination: { title: item.destination, address: 'Mysuru, Karnataka', distanceKm: item.distanceKm, durationMin: item.durationMin }
      });
      get().showToast(`Rebooking route: ${item.destination}`);
    },

    savedPlaces: savedPlaces,
    addSavedPlace: (place) => {
      set((state) => {
        const updated = [...state.savedPlaces, place];
        saveJSON('skyppy_saved_places', updated);
        return { savedPlaces: updated };
      });
      get().showToast(`Saved spot: ${place.title}`, 'success');
    },
    deleteSavedPlace: (id) => {
      set((state) => {
        const updated = state.savedPlaces.filter((p) => p.id !== id);
        saveJSON('skyppy_saved_places', updated);
        return { savedPlaces: updated };
      });
      get().showToast('Saved spot removed');
    },
    updateSavedPlace: (id, place) => {
      set((state) => {
        const updated = state.savedPlaces.map((p) => (p.id === id ? place : p));
        saveJSON('skyppy_saved_places', updated);
        return { savedPlaces: updated };
      });
      get().showToast('Saved spot updated', 'success');
    },

    notifications: [
      {
        id: 'notif-1',
        title: 'Driver Ramesh K. is on the way',
        desc: 'Auto KA-09 AB 4217 approaching VVCE Gate 2 pickup bay',
        time: 'Just now',
        icon: 'electric_rickshaw',
        color: 'text-primary',
        unread: true,
        linkRoute: '/tracking'
      },
      {
        id: 'notif-2',
        title: 'Skyppy Miles Milestone Alert!',
        desc: 'Distance tracked! Check milestone ladder for next rewards.',
        time: '10 min ago',
        icon: 'military_tech',
        color: 'text-secondary',
        unread: true,
        linkRoute: '/miles'
      },
      {
        id: 'notif-3',
        title: 'Clear transit corridor on Vinoba Rd',
        desc: 'Normal traffic flow across Gokulam & Bannimantap.',
        time: '1 hr ago',
        icon: 'traffic',
        color: 'text-tertiary',
        unread: false,
        linkRoute: '/'
      }
    ],
    markNotificationsAsRead: () => {
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, unread: false }))
      }));
      get().showToast('Notifications marked as read');
    },

    activeModal: 'none',
    modalData: null,
    openModal: (modal, data) => set({ activeModal: modal, modalData: data }),
    closeModal: () => set({ activeModal: 'none', modalData: null }),

    toastMessage: null,
    toastType: 'info',
    showToast: (msg, type = 'info') => {
      set({ toastMessage: msg, toastType: type });
      setTimeout(() => {
        if (get().toastMessage === msg) {
          set({ toastMessage: null });
        }
      }, 3000);
    },
    hideToast: () => set({ toastMessage: null }),

    resetDemoState: () => {
      localStorage.clear();
      set({
        theme: 'light',
        language: 'en',
        userProfile: DEFAULT_PROFILE,
        preferences: DEFAULT_PREFERENCES,
        savedPlaces: DEFAULT_SAVED_PLACES,
        rideHistory: DEFAULT_HISTORY,
        activeBooking: null,
        miles: defaultMiles,
        appliedCoupon: { code: 'MILES15', discount: 15 }
      });
      applyThemeToDOM('light');
      get().showToast('Prototype state reset to clean defaults', 'info');
    }
  };
});
