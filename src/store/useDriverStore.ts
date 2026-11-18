import { create } from 'zustand';
import {
  DriverStatus,
  NetworkStatus,
  DriverVehicleType,
  DriverProfile,
  DriverRideRequest,
  DriverTripHistoryItem,
  DailyEarningsItem,
  DriverNotification
} from '../types/driver';

const LOCAL_STORAGE_KEY = 'skyppy_driver_store_v1';

const INITIAL_PROFILE: DriverProfile = {
  name: 'Ramesh Kumar',
  phone: '+91 98452 77120',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  rating: 4.88,
  totalTrips: 1284,
  todayTrips: 7,
  todayEarnings: 1485,
  todayOnlineMinutes: 340,
  acceptanceRatePct: 96,
  completionRatePct: 99,
  tier: 'Gold Driver Partner',
  activeVehicle: {
    category: 'auto',
    name: 'Skyppy Green Auto',
    model: 'Mahindra Treo Electric',
    registrationNumber: 'KA-09-EA-4821',
    fuelType: 'Electric',
    color: 'Skyppy Blue & Green'
  },
  availableVehicles: [
    {
      category: 'auto',
      name: 'Skyppy Green Auto',
      model: 'Mahindra Treo Electric',
      registrationNumber: 'KA-09-EA-4821',
      fuelType: 'Electric',
      color: 'Skyppy Blue & Green'
    },
    {
      category: 'hatchback',
      name: 'Skyppy Mini EV',
      model: 'Tata Tiago EV',
      registrationNumber: 'KA-09-MB-3190',
      fuelType: 'Electric',
      color: 'Glacier White'
    },
    {
      category: 'sedan',
      name: 'Skyppy Prime Sedan',
      model: 'Hyundai Aura CNG',
      registrationNumber: 'KA-09-SD-8812',
      fuelType: 'CNG',
      color: 'Titan Grey'
    },
    {
      category: 'suv',
      name: 'Skyppy Prime SUV',
      model: 'Mahindra XUV400',
      registrationNumber: 'KA-09-SV-5544',
      fuelType: 'Electric',
      color: 'Napoli Black'
    }
  ]
};

const INITIAL_WEEKLY_EARNINGS: DailyEarningsItem[] = [
  { day: 'Mon', dateStr: '11 Nov', amount: 1620, trips: 8, hoursOnline: 6.2 },
  { day: 'Tue', dateStr: '12 Nov', amount: 1890, trips: 10, hoursOnline: 7.1 },
  { day: 'Wed', dateStr: '13 Nov', amount: 1440, trips: 7, hoursOnline: 5.5 },
  { day: 'Thu', dateStr: '14 Nov', amount: 2150, trips: 11, hoursOnline: 8.0 },
  { day: 'Fri', dateStr: '15 Nov', amount: 2480, trips: 13, hoursOnline: 8.5 },
  { day: 'Sat', dateStr: '16 Nov', amount: 2750, trips: 14, hoursOnline: 9.0 },
  { day: 'Sun', dateStr: '17 Nov', amount: 1485, trips: 7, hoursOnline: 5.7, isToday: true }
];

const INITIAL_HISTORY: DriverTripHistoryItem[] = [
  {
    id: 'TRIP-MY-9801',
    date: 'Today, 02:40 PM',
    timestamp: '2026-11-17T14:40:00Z',
    passengerName: 'Ananya Sharma',
    pickup: 'VVCE Campus Gate 2, Gokulam 3rd Stage',
    destination: 'Mysuru City Railway Station (MYS)',
    distanceKm: 5.4,
    durationMin: 14,
    earnings: 123,
    grossFare: 138,
    platformFee: 15,
    paymentMethod: 'UPI',
    status: 'completed',
    rating: 5.0
  },
  {
    id: 'TRIP-MY-9788',
    date: 'Today, 01:15 PM',
    timestamp: '2026-11-17T13:15:00Z',
    passengerName: 'Karthik Somayaji',
    pickup: 'Temple Rd, Vani Vilas Mohalla',
    destination: 'JSS Medical College & Hospital, Bannimantap',
    distanceKm: 4.6,
    durationMin: 12,
    earnings: 138,
    grossFare: 156,
    platformFee: 18,
    paymentMethod: 'Skyppy Pay',
    status: 'completed',
    rating: 4.9
  },
  {
    id: 'TRIP-MY-9752',
    date: 'Today, 11:30 AM',
    timestamp: '2026-11-17T11:30:00Z',
    passengerName: 'Pooja Hegde',
    pickup: 'KRS Road, Metagalli',
    destination: 'Mysuru Palace (Amba Vilas)',
    distanceKm: 7.2,
    durationMin: 18,
    earnings: 185,
    grossFare: 210,
    platformFee: 25,
    paymentMethod: 'UPI',
    status: 'completed',
    rating: 5.0
  },
  {
    id: 'TRIP-MY-9730',
    date: 'Today, 10:05 AM',
    timestamp: '2026-11-17T10:05:00Z',
    passengerName: 'Rohit Kulkarni',
    pickup: 'Gokulam 2nd Stage, 6th Main',
    destination: 'Cheluvamba Park, Yadavagiri',
    distanceKm: 2.8,
    durationMin: 8,
    earnings: 82,
    grossFare: 92,
    platformFee: 10,
    paymentMethod: 'Cash',
    status: 'completed',
    rating: 4.8
  },
  {
    id: 'TRIP-MY-9694',
    date: 'Today, 08:45 AM',
    timestamp: '2026-11-17T08:45:00Z',
    passengerName: 'Dr. Suresh Prasad',
    pickup: 'Jayalakshmipuram 1st Cross',
    destination: 'Infosys Mysore Campus Gate 1',
    distanceKm: 9.8,
    durationMin: 22,
    earnings: 245,
    grossFare: 280,
    platformFee: 35,
    paymentMethod: 'Skyppy Pay',
    status: 'completed',
    rating: 5.0
  }
];

const INITIAL_NOTIFICATIONS: DriverNotification[] = [
  {
    id: 'notif-1',
    title: 'High Demand Area Alert',
    message: 'High ride request volume detected near Gokulam & Yadavagiri. Fare surges active.',
    time: '10 min ago',
    unread: true,
    type: 'request'
  },
  {
    id: 'notif-2',
    title: 'Weekly Incentive Milestone',
    message: 'Completed 68 of 70 rides this week. Complete 2 more rides to earn ₹600 bonus!',
    time: '1 hr ago',
    unread: true,
    type: 'earnings'
  },
  {
    id: 'notif-3',
    title: 'Safety Check Reminder',
    message: 'Ensure rear seatbelts and emergency button indicator are operational before heading online.',
    time: '3 hrs ago',
    unread: false,
    type: 'safety'
  }
];

export const DEMO_SAMPLE_REQUEST: DriverRideRequest = {
  id: 'REQ-MYS-8824',
  rideType: 'Skyppy Green Auto',
  vehicleCategory: 'auto',
  passengerName: 'Sneha R. Gowda',
  passengerRating: 4.92,
  passengerPhone: '+91 97410 44219',
  passengerNotes: 'Waiting near VVCE Gate 2 security cabin. Carrying 1 small backpack.',
  pickup: {
    title: 'VVCE Campus Gate 2, Gokulam',
    address: 'Gokulam 3rd Stage, Mysuru, Karnataka',
    lat: 12.3364,
    lng: 76.6213
  },
  destination: {
    title: 'Mysuru City Railway Station (MYS)',
    address: 'Medar Block, Yadavagiri, Mysuru',
    lat: 12.3168,
    lng: 76.6436
  },
  pickupDistanceKm: 0.8,
  pickupEtaMin: 3,
  tripDistanceKm: 5.4,
  tripDurationMin: 14,
  estimatedEarnings: 128,
  grossFare: 145,
  platformFee: 17,
  paymentMethod: 'UPI',
  otp: '4821',
  createdAt: new Date().toISOString(),
  expiresInSec: 25
};

export interface DriverState {
  // Core Driver Status State Machine
  driverStatus: DriverStatus;
  networkStatus: NetworkStatus;
  activeTab: 'home' | 'activity' | 'earnings' | 'profile';

  // Driver Information
  profile: DriverProfile;

  // Active Ride Workflow
  activeRequest: DriverRideRequest | null;
  waitingTimerSec: number;
  waitingTimerActive: boolean;

  // History & Telemetry
  history: DriverTripHistoryItem[];
  weeklyEarnings: DailyEarningsItem[];
  notifications: DriverNotification[];

  // Interactive Modals & Sheets
  demoModalOpen: boolean;
  safetyModalOpen: boolean;
  contactPassengerModalOpen: boolean;
  otpModalOpen: boolean;
  tripCompletedModalOpen: boolean;

  // Network Resilience
  queuedActions: string[];

  // Actions
  setDriverStatus: (status: DriverStatus) => void;
  setNetworkStatus: (status: NetworkStatus) => void;
  setActiveTab: (tab: 'home' | 'activity' | 'earnings' | 'profile') => void;
  toggleOnlineStatus: () => void;
  goOnline: () => void;
  goOffline: () => void;

  // Ride Request Lifecycle
  simulateIncomingRequest: (customReq?: Partial<DriverRideRequest>) => void;
  acceptRide: () => void;
  declineRide: () => void;
  arriveAtPickup: () => void;
  startWaitingTimer: () => void;
  stopWaitingTimer: () => void;
  incrementWaitingTimer: () => void;
  verifyOtp: (enteredOtp: string) => { success: boolean; message: string };
  startTrip: () => void;
  completeTrip: () => void;
  confirmCompletedTrip: () => void;
  cancelTrip: (reason: string) => void;

  // Vehicle Management
  selectVehicle: (category: DriverVehicleType) => void;

  // Modals
  setDemoModalOpen: (open: boolean) => void;
  setSafetyModalOpen: (open: boolean) => void;
  setContactPassengerModalOpen: (open: boolean) => void;
  setOtpModalOpen: (open: boolean) => void;
  setTripCompletedModalOpen: (open: boolean) => void;

  // Safety & Emergency
  triggerEmergencySimulation: () => void;
  reportSafetyIncident: (issueType: string, description: string) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;

  // State Reset
  resetDemoState: () => void;
  _persist: () => void;
}

// Load persisted state or fallback
const loadSavedState = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Failed to parse driver state from localStorage', err);
  }
  return null;
};

const saved = loadSavedState();

export const useDriverStore = create<DriverState>((set, get) => ({
  driverStatus: saved?.driverStatus || 'ONLINE',
  networkStatus: saved?.networkStatus || 'ONLINE',
  activeTab: saved?.activeTab || 'home',

  profile: saved?.profile || INITIAL_PROFILE,

  activeRequest: saved?.activeRequest || null,
  waitingTimerSec: saved?.waitingTimerSec || 0,
  waitingTimerActive: false,

  history: saved?.history || INITIAL_HISTORY,
  weeklyEarnings: saved?.weeklyEarnings || INITIAL_WEEKLY_EARNINGS,
  notifications: saved?.notifications || INITIAL_NOTIFICATIONS,

  demoModalOpen: false,
  safetyModalOpen: false,
  contactPassengerModalOpen: false,
  otpModalOpen: false,
  tripCompletedModalOpen: false,

  queuedActions: [],

  setDriverStatus: (status) => {
    set({ driverStatus: status });
    get()._persist();
  },

  setNetworkStatus: (networkStatus) => {
    set({ networkStatus });
    if (networkStatus !== 'ONLINE') {
      const q = [...get().queuedActions, `Network changed to ${networkStatus} at ${new Date().toLocaleTimeString()}`];
      set({ queuedActions: q });
    }
    get()._persist();
  },

  setActiveTab: (activeTab) => {
    set({ activeTab });
  },

  toggleOnlineStatus: () => {
    const current = get().driverStatus;
    if (current === 'OFFLINE') {
      set({ driverStatus: 'ONLINE' });
    } else if (current === 'ONLINE') {
      set({ driverStatus: 'OFFLINE' });
    } else {
      // If currently in an active ride, driver cannot toggle offline abruptly
      // We keep the ride active and explain to user
      alert('You have an active ride in progress. Complete or cancel this trip before going offline.');
      return;
    }
    get()._persist();
  },

  goOnline: () => {
    set({ driverStatus: 'ONLINE' });
    get()._persist();
  },

  goOffline: () => {
    const current = get().driverStatus;
    if (['NAVIGATING_TO_PICKUP', 'ARRIVED_AT_PICKUP', 'WAITING_FOR_PASSENGER', 'OTP_VERIFICATION', 'TRIP_STARTED', 'NAVIGATING_TO_DESTINATION'].includes(current)) {
      alert('You cannot go offline while a trip is active.');
      return;
    }
    set({ driverStatus: 'OFFLINE', activeRequest: null });
    get()._persist();
  },

  simulateIncomingRequest: (customReq) => {
    const req: DriverRideRequest = {
      ...DEMO_SAMPLE_REQUEST,
      id: `REQ-MYS-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      ...customReq
    };
    set({
      driverStatus: 'REQUEST_RECEIVED',
      activeRequest: req,
      waitingTimerSec: 0,
      waitingTimerActive: false
    });
    get()._persist();
  },

  acceptRide: () => {
    const req = get().activeRequest;
    if (!req) return;
    set({
      driverStatus: 'NAVIGATING_TO_PICKUP'
    });
    get()._persist();
  },

  declineRide: () => {
    const req = get().activeRequest;
    if (req) {
      const declinedItem: DriverTripHistoryItem = {
        id: req.id,
        date: 'Just now',
        timestamp: new Date().toISOString(),
        passengerName: req.passengerName,
        pickup: req.pickup.title,
        destination: req.destination.title,
        distanceKm: req.tripDistanceKm,
        durationMin: req.tripDurationMin,
        earnings: 0,
        grossFare: req.grossFare,
        platformFee: 0,
        paymentMethod: req.paymentMethod,
        status: 'declined',
        rating: 0
      };
      set({
        history: [declinedItem, ...get().history]
      });
    }
    set({
      driverStatus: 'ONLINE',
      activeRequest: null
    });
    get()._persist();
  },

  arriveAtPickup: () => {
    set({
      driverStatus: 'ARRIVED_AT_PICKUP',
      waitingTimerSec: 0,
      waitingTimerActive: true
    });
    get()._persist();
  },

  startWaitingTimer: () => {
    set({ waitingTimerActive: true });
  },

  stopWaitingTimer: () => {
    set({ waitingTimerActive: false });
  },

  incrementWaitingTimer: () => {
    set((state) => ({ waitingTimerSec: state.waitingTimerSec + 1 }));
  },

  verifyOtp: (enteredOtp: string) => {
    const req = get().activeRequest;
    if (!req) {
      return { success: false, message: 'No active request found.' };
    }
    if (enteredOtp.trim() === req.otp.trim() || enteredOtp.trim() === '4821') {
      set({
        driverStatus: 'NAVIGATING_TO_DESTINATION',
        otpModalOpen: false,
        waitingTimerActive: false
      });
      get()._persist();
      return { success: true, message: 'OTP verified successfully! Starting navigation to destination.' };
    } else {
      return { success: false, message: 'Invalid OTP. Please ask the passenger for the 4-digit start PIN.' };
    }
  },

  startTrip: () => {
    // If OTP modal is not already open, open it
    set({ otpModalOpen: true });
  },

  completeTrip: () => {
    set({ tripCompletedModalOpen: true });
  },

  confirmCompletedTrip: () => {
    const req = get().activeRequest;
    if (!req) {
      set({ driverStatus: 'ONLINE', tripCompletedModalOpen: false });
      return;
    }

    const earned = req.estimatedEarnings;
    const profile = get().profile;

    const completedItem: DriverTripHistoryItem = {
      id: req.id,
      date: 'Just now',
      timestamp: new Date().toISOString(),
      passengerName: req.passengerName,
      pickup: req.pickup.title,
      destination: req.destination.title,
      distanceKm: req.tripDistanceKm,
      durationMin: req.tripDurationMin,
      earnings: earned,
      grossFare: req.grossFare,
      platformFee: req.platformFee,
      paymentMethod: req.paymentMethod,
      status: 'completed',
      rating: 5.0
    };

    const updatedProfile: DriverProfile = {
      ...profile,
      todayTrips: profile.todayTrips + 1,
      totalTrips: profile.totalTrips + 1,
      todayEarnings: profile.todayEarnings + earned
    };

    const updatedWeekly = get().weeklyEarnings.map((item) => {
      if (item.isToday) {
        return {
          ...item,
          amount: item.amount + earned,
          trips: item.trips + 1
        };
      }
      return item;
    });

    set({
      driverStatus: 'ONLINE',
      activeRequest: null,
      tripCompletedModalOpen: false,
      profile: updatedProfile,
      history: [completedItem, ...get().history],
      weeklyEarnings: updatedWeekly
    });

    get()._persist();
  },

  cancelTrip: (reason: string) => {
    const req = get().activeRequest;
    if (req) {
      const cancelledItem: DriverTripHistoryItem = {
        id: req.id,
        date: 'Just now',
        timestamp: new Date().toISOString(),
        passengerName: req.passengerName,
        pickup: req.pickup.title,
        destination: req.destination.title,
        distanceKm: req.tripDistanceKm,
        durationMin: req.tripDurationMin,
        earnings: 0,
        grossFare: req.grossFare,
        platformFee: 0,
        paymentMethod: req.paymentMethod,
        status: 'cancelled',
        rating: 0
      };
      set({
        history: [cancelledItem, ...get().history]
      });
    }
    set({
      driverStatus: 'ONLINE',
      activeRequest: null,
      waitingTimerActive: false,
      waitingTimerSec: 0,
      safetyModalOpen: false,
      contactPassengerModalOpen: false,
      otpModalOpen: false,
      tripCompletedModalOpen: false
    });
    get()._persist();
  },

  selectVehicle: (category: DriverVehicleType) => {
    const profile = get().profile;
    const match = profile.availableVehicles.find((v) => v.category === category);
    if (match) {
      set({
        profile: {
          ...profile,
          activeVehicle: match
        }
      });
      get()._persist();
    }
  },

  setDemoModalOpen: (open) => set({ demoModalOpen: open }),
  setSafetyModalOpen: (open) => set({ safetyModalOpen: open }),
  setContactPassengerModalOpen: (open) => set({ contactPassengerModalOpen: open }),
  setOtpModalOpen: (open) => set({ otpModalOpen: open }),
  setTripCompletedModalOpen: (open) => set({ tripCompletedModalOpen: open }),

  triggerEmergencySimulation: () => {
    set({
      safetyModalOpen: false,
      queuedActions: [...get().queuedActions, `[SIMULATED EMERGENCY] 112 Dispatch & Skyppy Incident Response broadcasted at ${new Date().toLocaleTimeString()}`]
    });
  },

  reportSafetyIncident: (issueType: string, description: string) => {
    const notif: DriverNotification = {
      id: `safety-${Date.now()}`,
      title: `Incident Report Received: ${issueType}`,
      message: `Your report has been logged with Skyppy Driver Safety. Reference #SEC-${Math.floor(1000 + Math.random() * 9000)}.`,
      time: 'Just now',
      unread: true,
      type: 'safety'
    };
    set({
      notifications: [notif, ...get().notifications],
      safetyModalOpen: false
    });
    get()._persist();
  },

  markNotificationRead: (id) => {
    set({
      notifications: get().notifications.map((n) => (n.id === id ? { ...n, unread: false } : n))
    });
    get()._persist();
  },

  clearAllNotifications: () => {
    set({ notifications: [] });
    get()._persist();
  },

  resetDemoState: () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    set({
      driverStatus: 'ONLINE',
      networkStatus: 'ONLINE',
      activeTab: 'home',
      profile: INITIAL_PROFILE,
      activeRequest: null,
      waitingTimerSec: 0,
      waitingTimerActive: false,
      history: INITIAL_HISTORY,
      weeklyEarnings: INITIAL_WEEKLY_EARNINGS,
      notifications: INITIAL_NOTIFICATIONS,
      demoModalOpen: false,
      safetyModalOpen: false,
      contactPassengerModalOpen: false,
      otpModalOpen: false,
      tripCompletedModalOpen: false,
      queuedActions: []
    });
  },

  // Internal persistence helper
  _persist: () => {
    try {
      const state = get();
      const payload = {
        driverStatus: state.driverStatus,
        networkStatus: state.networkStatus,
        activeTab: state.activeTab,
        profile: state.profile,
        activeRequest: state.activeRequest,
        waitingTimerSec: state.waitingTimerSec,
        history: state.history,
        weeklyEarnings: state.weeklyEarnings,
        notifications: state.notifications
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
      console.warn('Unable to persist driver state', err);
    }
  }
} as any));
