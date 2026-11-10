// Skyppy Intercity Courier & Logistics Data Models

export type ShipmentStatus =
  | 'booking_confirmed'
  | 'pickup_scheduled'
  | 'parcel_picked_up'
  | 'processing'
  | 'in_transit'
  | 'arrived_destination_hub'
  | 'out_for_delivery'
  | 'delivered'
  | 'pickup_failed'
  | 'delivery_attempted'
  | 'receiver_unavailable'
  | 'delayed'
  | 'exception'
  | 'cancelled';

export type PackageCategory =
  | 'documents'
  | 'electronics'
  | 'apparel'
  | 'books'
  | 'household'
  | 'healthcare'
  | 'food_perishables'
  | 'fragile_crafts'
  | 'industrial_spares';

export type PackagingType =
  | 'standard_box'
  | 'padded_envelope'
  | 'bubble_wrap_box'
  | 'wooden_crate'
  | 'customer_packaged';

export type ServiceSpeed =
  | 'standard_surface'   // 2-3 Days Intercity
  | 'express_cargo'       // Next-Day Delivery
  | 'same_day_prime';     // Same-Day Highway Corridor (Mysuru <-> Bengaluru)

export interface PackageDetails {
  category: PackageCategory;
  description: string;
  weightKg: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  isFragile: boolean;
  isHighValue: boolean;
  declaredValueInr?: number;
  packagingType: PackagingType;
}

export interface AddressEntity {
  name: string;
  phone: string;
  addressLine: string;
  city: string;
  pincode: string;
  instructions?: string;
  landmark?: string;
}

export interface PickupSchedule {
  date: string;
  timeSlot: 'morning' | 'afternoon' | 'evening';
  slotLabel: string;
}

export interface PricingBreakdown {
  baseFreightFare: number;
  distanceKm: number;
  chargeableWeightKg: number;
  volumetricWeightKg: number;
  actualWeightKg: number;
  fragileHandlingFee: number;
  highValueInsuranceFee: number;
  serviceSpeedMultiplier: number;
  fuelSurcharge: number;
  gstInr: number;
  promoDiscount: number;
  totalEstimatedFare: number;
  isPrototypePricing: boolean;
}

export interface TrackingCheckpoint {
  status: ShipmentStatus;
  title: string;
  description: string;
  location: string;
  timestamp: string;
  isCompleted: boolean;
  isException?: boolean;
}

export interface ProofOfDelivery {
  recipientName: string;
  deliveredAt: string;
  otpVerified: boolean;
  signaturePlaceholderUrl?: string;
  photoPlaceholderUrl?: string;
  deliveryAgentName: string;
  deliveryAgentPhone: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  createdAt: string;
  status: ShipmentStatus;
  serviceSpeed: ServiceSpeed;
  serviceName: string;
  packageDetails: PackageDetails;
  sender: AddressEntity;
  receiver: AddressEntity;
  pickupSchedule: PickupSchedule;
  pricing: PricingBreakdown;
  checkpoints: TrackingCheckpoint[];
  currentLocation: {
    lat: number;
    lng: number;
    label: string;
  };
  deliveryOtp: string;
  proofOfDelivery?: ProofOfDelivery;
  estimatedDeliveryDate: string;
  estimatedDeliveryWindow: string;
  exceptionReason?: string;
}

export interface BusinessMetrics {
  totalShipments: number;
  activeInTransit: number;
  deliveredThisMonth: number;
  totalSpentInr: number;
}
