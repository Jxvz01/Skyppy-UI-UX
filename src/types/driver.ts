export type DriverStatus =
  | 'OFFLINE'
  | 'ONLINE'
  | 'REQUEST_RECEIVED'
  | 'REQUEST_ACCEPTED'
  | 'NAVIGATING_TO_PICKUP'
  | 'ARRIVED_AT_PICKUP'
  | 'WAITING_FOR_PASSENGER'
  | 'OTP_VERIFICATION'
  | 'TRIP_STARTED'
  | 'NAVIGATING_TO_DESTINATION'
  | 'TRIP_COMPLETED'
  | 'CANCELLED';

export type NetworkStatus = 'ONLINE' | 'POOR_NETWORK' | 'OFFLINE';

export type DriverVehicleType = 'auto' | 'mini' | 'hatchback' | 'sedan' | 'suv';

export interface DriverVehicleInfo {
  category: DriverVehicleType;
  name: string;
  model: string;
  registrationNumber: string;
  fuelType: 'Electric' | 'CNG' | 'Petrol' | 'Hybrid';
  color: string;
}

export interface DriverProfile {
  name: string;
  phone: string;
  avatarUrl: string;
  rating: number;
  totalTrips: number;
  todayTrips: number;
  todayEarnings: number;
  todayOnlineMinutes: number;
  acceptanceRatePct: number;
  completionRatePct: number;
  tier: 'Gold Driver Partner' | 'Platinum Driver Partner' | 'Silver Driver Partner';
  activeVehicle: DriverVehicleInfo;
  availableVehicles: DriverVehicleInfo[];
}

export interface DriverRideRequest {
  id: string;
  rideType: string;
  vehicleCategory: DriverVehicleType;
  passengerName: string;
  passengerRating: number;
  passengerPhone: string;
  passengerNotes?: string;
  pickup: {
    title: string;
    address: string;
    lat: number;
    lng: number;
  };
  destination: {
    title: string;
    address: string;
    lat: number;
    lng: number;
  };
  pickupDistanceKm: number;
  pickupEtaMin: number;
  tripDistanceKm: number;
  tripDurationMin: number;
  estimatedEarnings: number;
  grossFare: number;
  platformFee: number;
  paymentMethod: 'UPI' | 'Cash' | 'Skyppy Pay';
  otp: string;
  createdAt: string;
  expiresInSec: number;
}

export interface DriverTripHistoryItem {
  id: string;
  date: string;
  timestamp: string;
  passengerName: string;
  pickup: string;
  destination: string;
  distanceKm: number;
  durationMin: number;
  earnings: number;
  grossFare: number;
  platformFee: number;
  paymentMethod: 'UPI' | 'Cash' | 'Skyppy Pay';
  status: 'completed' | 'cancelled' | 'declined';
  rating: number;
}

export interface DailyEarningsItem {
  day: string;
  dateStr: string;
  amount: number;
  trips: number;
  hoursOnline: number;
  isToday?: boolean;
}

export interface DriverNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: 'request' | 'earnings' | 'safety' | 'system';
  actionRoute?: string;
}
