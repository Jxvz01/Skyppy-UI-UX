export type ThemeMode = 'light' | 'dark' | 'system';
export type Language = 'en' | 'kn';

export interface LocationItem {
  id?: string;
  title: string;
  address: string;
  landmark?: string;
  distanceKm?: number;
  durationMin?: number;
  icon?: string;
  isOrigin?: boolean;
}

export type VehicleCategoryId = 'auto' | 'mini' | 'hatchback' | 'sedan' | 'suv';

export interface VehicleOption {
  id: VehicleCategoryId;
  name: string;
  category: string;
  model?: string;
  tag?: string;
  descriptor?: string;
  distanceStr?: string;
  fare: number;
  originalFare: number;
  capacity: string;
  etaMinutes: number;
  badge?: string;
  image: string;
  description: string;
  driver: {
    name: string;
    phone: string;
    rating: string;
    trips: string;
    plate: string;
    avatar: string;
  };
}

export type RideStatus =
  | 'idle'
  | 'searching'
  | 'assigned'
  | 'arriving'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface ActiveBooking {
  bookingId: string;
  status: RideStatus;
  vehicleId: VehicleCategoryId;
  vehicleName: string;
  fare: number;
  baseFare: number;
  distanceFare: number;
  platformFee: number;
  discount: number;
  otp: string;
  startOtp: string;
  driver: {
    name: string;
    phone: string;
    rating: string;
    trips: string;
    plate: string;
    avatar: string;
  };
  pickup: LocationItem;
  destination: LocationItem;
  bookedAt: string;
  etaMinutes: number;
  progressPercent: number; // 0 to 100
  paymentMethod: string;
}

export interface RideHistoryItem {
  id: string;
  bookingId: string;
  date: string;
  origin: string;
  destination: string;
  vehicle: string;
  vehicleIcon: string;
  fare: number;
  paymentMethod: string;
  distanceKm: number;
  durationMin: number;
  status: 'completed' | 'scheduled' | 'cancelled';
  rating?: number;
  feedbackComment?: string;
  driver: string;
  plate: string;
  milesEarned: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  icon: string;
  color: string;
  unread: boolean;
  linkRoute?: string;
}

export interface MilesReward {
  id: string;
  title: string;
  desc: string;
  code: string;
  validDays: string;
  icon: string;
  redeemed: boolean;
  minKmRequired?: number;
}

export interface MilesMilestone {
  id: string;
  km: number;
  title: string;
  desc: string;
  status: 'unlocked' | 'almost' | 'locked';
  completedDate?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  tier: string;
  totalSpent: number;
}

export interface RidePreferences {
  acDefault: boolean;
  quietRide: boolean;
  autoTipPercent: number;
  autoDeductCash: boolean;
}

export type ModalType =
  | 'none'
  | 'safety'
  | 'notifications'
  | 'schedule'
  | 'chat'
  | 'receipt'
  | 'editProfile'
  | 'savedPlaces'
  | 'preferences'
  | 'paymentMethods'
  | 'helpSupport'
  | 'tripCompleted'
  | 'fareBreakdown';
