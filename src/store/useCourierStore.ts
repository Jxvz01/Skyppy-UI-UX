import { create } from 'zustand';
import {
  Shipment,
  ShipmentStatus,
  PackageDetails,
  AddressEntity,
  PickupSchedule,
  ServiceSpeed,
  PricingBreakdown,
  TrackingCheckpoint,
  ProofOfDelivery,
  BusinessMetrics
} from '../types/courier';

// Distance matrix between key South Indian commercial cities (km)
const CITY_DISTANCES: Record<string, Record<string, number>> = {
  mysuru: {
    mysuru: 15,
    bengaluru: 145,
    mangaluru: 255,
    hassan: 115,
    mandya: 45,
    hubballi: 410,
    chennai: 490,
    hyderabad: 710,
    mumbai: 990
  },
  bengaluru: {
    mysuru: 145,
    bengaluru: 25,
    mangaluru: 350,
    hassan: 180,
    mandya: 100,
    hubballi: 410,
    chennai: 345,
    hyderabad: 570,
    mumbai: 980
  },
  mangaluru: {
    mysuru: 255,
    bengaluru: 350,
    mangaluru: 15,
    hassan: 170,
    mandya: 280,
    hubballi: 360,
    chennai: 700,
    hyderabad: 810,
    mumbai: 890
  }
};

export const getCityDistance = (fromCity: string, toCity: string): number => {
  const from = fromCity.toLowerCase().trim();
  const to = toCity.toLowerCase().trim();
  if (CITY_DISTANCES[from] && CITY_DISTANCES[from][to]) {
    return CITY_DISTANCES[from][to];
  }
  if (CITY_DISTANCES[to] && CITY_DISTANCES[to][from]) {
    return CITY_DISTANCES[to][from];
  }
  return 180; // Reasonable default intercity estimate
};

export const calculateCourierPricing = (
  pkg: PackageDetails,
  originCity: string,
  destCity: string,
  speed: ServiceSpeed,
  promoDiscount = 0
): PricingBreakdown => {
  const distanceKm = getCityDistance(originCity, destCity);
  
  // Volumetric Weight Formula: (L * W * H in cm) / 5000 = kg
  const volumetricWeightKg = Number(((pkg.lengthCm * pkg.widthCm * pkg.heightCm) / 5000).toFixed(2));
  const actualWeightKg = pkg.weightKg;
  const chargeableWeightKg = Math.max(actualWeightKg, volumetricWeightKg, 0.5);

  // Rate tiers based on service speed
  let baseRatePerKg = 45;
  let speedMultiplier = 1.0;
  if (speed === 'express_cargo') {
    baseRatePerKg = 75;
    speedMultiplier = 1.4;
  } else if (speed === 'same_day_prime') {
    baseRatePerKg = 120;
    speedMultiplier = 1.9;
  }

  // Distance coefficient
  const distanceFactor = Math.max(distanceKm / 100, 1.0);
  const baseFreightFare = Math.round(baseRatePerKg * chargeableWeightKg * distanceFactor);

  // Special handling
  const fragileHandlingFee = pkg.isFragile ? 85 : 0;
  const highValueInsuranceFee = pkg.isHighValue && pkg.declaredValueInr
    ? Math.round(pkg.declaredValueInr * 0.015)
    : 0;

  const fuelSurcharge = Math.round(baseFreightFare * 0.08); // 8% fuel surcharge
  const subtotal = baseFreightFare + fragileHandlingFee + highValueInsuranceFee + fuelSurcharge;
  const gstInr = Math.round(subtotal * 0.18); // 18% GST for logistics
  const totalEstimatedFare = Math.max(subtotal + gstInr - promoDiscount, 120);

  return {
    baseFreightFare,
    distanceKm,
    chargeableWeightKg,
    volumetricWeightKg,
    actualWeightKg,
    fragileHandlingFee,
    highValueInsuranceFee,
    serviceSpeedMultiplier: speedMultiplier,
    fuelSurcharge,
    gstInr,
    promoDiscount,
    totalEstimatedFare,
    isPrototypePricing: true
  };
};

const DEFAULT_SENDERS: AddressEntity[] = [
  {
    name: 'Jeevan H. (Shubha)',
    phone: '+91 98450 12345',
    addressLine: 'Plot 42, Gokulam 3rd Stage, Near VVCE',
    city: 'Mysuru',
    pincode: '570002',
    instructions: 'Ring bell at Gate 2, ground floor entrance'
  },
  {
    name: 'Skyppy Labs Mysore',
    phone: '+91 821 2419000',
    addressLine: 'Software Technology Parks of India, Hebbal Industrial Area',
    city: 'Mysuru',
    pincode: '570016',
    instructions: 'Handover at security reception counter'
  }
];

const DEFAULT_RECEIVERS: AddressEntity[] = [
  {
    name: 'Ananya Sharma',
    phone: '+91 99001 88421',
    addressLine: 'Flat 402, Brigade Gateway, Malleshwaram West',
    city: 'Bengaluru',
    pincode: '560055',
    instructions: 'Call before arriving, drop with tower concierge if unavailable'
  },
  {
    name: 'Kavitha Hegde',
    phone: '+91 98860 33120',
    addressLine: 'Hegde Arcade, Hampankatta',
    city: 'Mangaluru',
    pincode: '575001',
    instructions: 'Deliver during shop hours 10 AM - 7 PM'
  }
];

const DEMO_INITIAL_SHIPMENTS: Shipment[] = [
  {
    id: 'shp_849204',
    trackingNumber: 'SKP-EXP-849204',
    createdAt: '2026-11-10T11:30:00+05:30',
    status: 'in_transit',
    serviceSpeed: 'express_cargo',
    serviceName: 'Express Intercity Cargo',
    packageDetails: {
      category: 'electronics',
      description: 'MacBook Air M3 & Prototype Hardware Sample',
      weightKg: 2.4,
      lengthCm: 35,
      widthCm: 25,
      heightCm: 6,
      isFragile: true,
      isHighValue: true,
      declaredValueInr: 95000,
      packagingType: 'bubble_wrap_box'
    },
    sender: DEFAULT_SENDERS[0],
    receiver: DEFAULT_RECEIVERS[0],
    pickupSchedule: {
      date: 'Today, Nov 10',
      timeSlot: 'morning',
      slotLabel: 'Morning (09:00 AM – 12:00 PM)'
    },
    pricing: {
      baseFreightFare: 290,
      distanceKm: 145,
      chargeableWeightKg: 2.4,
      volumetricWeightKg: 1.05,
      actualWeightKg: 2.4,
      fragileHandlingFee: 85,
      highValueInsuranceFee: 1425,
      serviceSpeedMultiplier: 1.4,
      fuelSurcharge: 23,
      gstInr: 328,
      promoDiscount: 50,
      totalEstimatedFare: 2101,
      isPrototypePricing: true
    },
    checkpoints: [
      {
        status: 'booking_confirmed',
        title: 'Booking Confirmed',
        description: 'Shipment registered on Skyppy Intercity Logistics Grid',
        location: 'Mysuru Main Hub',
        timestamp: 'Nov 10, 11:30 AM',
        isCompleted: true
      },
      {
        status: 'parcel_picked_up',
        title: 'Parcel Picked Up',
        description: 'Collected from VVCE Gokulam by Agent Kiran M.',
        location: 'Gokulam 3rd Stage, Mysuru',
        timestamp: 'Nov 10, 01:15 PM',
        isCompleted: true
      },
      {
        status: 'processing',
        title: 'Sorted & Securely Packaged',
        description: 'Passed automated optical weight & X-Ray screening',
        location: 'Bannimantap Central Transshipment Hub',
        timestamp: 'Nov 10, 03:00 PM',
        isCompleted: true
      },
      {
        status: 'in_transit',
        title: 'In Transit on Bengaluru-Mysuru Expressway',
        description: 'Linehaul vehicle KA-09 CL 8820 en route to Bengaluru Peenya Hub',
        location: 'Mandya Highway Toll Plaza',
        timestamp: 'Nov 10, 04:45 PM',
        isCompleted: true
      },
      {
        status: 'arrived_destination_hub',
        title: 'Arrived at Destination Hub',
        description: 'Expected arrival at Peenya Logistics Center',
        location: 'Peenya Hub, Bengaluru',
        timestamp: 'Estimated Nov 10, 08:30 PM',
        isCompleted: false
      },
      {
        status: 'out_for_delivery',
        title: 'Out for Delivery',
        description: 'Will be assigned to local Malleshwaram courier unit',
        location: 'Malleshwaram Delivery Unit, Bengaluru',
        timestamp: 'Tomorrow, Nov 11, 09:30 AM',
        isCompleted: false
      },
      {
        status: 'delivered',
        title: 'Delivered',
        description: 'Direct delivery with OTP verification',
        location: 'Brigade Gateway, Bengaluru',
        timestamp: 'Tomorrow, Nov 11 by 12:00 PM',
        isCompleted: false
      }
    ],
    currentLocation: {
      lat: 12.5245,
      lng: 76.8967,
      label: 'Mandya Intercity Bypass (Expressway)'
    },
    deliveryOtp: '7842',
    estimatedDeliveryDate: 'Tomorrow, Nov 11',
    estimatedDeliveryWindow: 'by 12:00 PM'
  },
  {
    id: 'shp_512903',
    trackingNumber: 'SKP-STD-512903',
    createdAt: '2026-11-08T09:15:00+05:30',
    status: 'delivered',
    serviceSpeed: 'standard_surface',
    serviceName: 'Standard Surface Cargo',
    packageDetails: {
      category: 'documents',
      description: 'University Degree Certificates & Transcripts',
      weightKg: 0.6,
      lengthCm: 30,
      widthCm: 22,
      heightCm: 2,
      isFragile: false,
      isHighValue: false,
      packagingType: 'padded_envelope'
    },
    sender: DEFAULT_SENDERS[0],
    receiver: DEFAULT_RECEIVERS[1],
    pickupSchedule: {
      date: 'Nov 08, 2026',
      timeSlot: 'afternoon',
      slotLabel: 'Afternoon (12:00 PM – 04:00 PM)'
    },
    pricing: {
      baseFreightFare: 140,
      distanceKm: 255,
      chargeableWeightKg: 0.6,
      volumetricWeightKg: 0.26,
      actualWeightKg: 0.6,
      fragileHandlingFee: 0,
      highValueInsuranceFee: 0,
      serviceSpeedMultiplier: 1.0,
      fuelSurcharge: 11,
      gstInr: 27,
      promoDiscount: 0,
      totalEstimatedFare: 178,
      isPrototypePricing: true
    },
    checkpoints: [
      {
        status: 'booking_confirmed',
        title: 'Booking Confirmed',
        description: 'Shipment created',
        location: 'Mysuru Hub',
        timestamp: 'Nov 08, 09:15 AM',
        isCompleted: true
      },
      {
        status: 'parcel_picked_up',
        title: 'Picked Up',
        description: 'Picked up from sender',
        location: 'Gokulam, Mysuru',
        timestamp: 'Nov 08, 02:30 PM',
        isCompleted: true
      },
      {
        status: 'in_transit',
        title: 'Intercity Transit',
        description: 'Western Ghats Corridor (via Hassan)',
        location: 'Shiradi Ghat Highway',
        timestamp: 'Nov 09, 04:00 AM',
        isCompleted: true
      },
      {
        status: 'arrived_destination_hub',
        title: 'Arrived at Mangaluru Hub',
        description: 'Sorted at Hampankatta hub',
        location: 'Mangaluru Hub',
        timestamp: 'Nov 09, 11:30 AM',
        isCompleted: true
      },
      {
        status: 'out_for_delivery',
        title: 'Out for Delivery',
        description: 'Courier agent on route',
        location: 'Hampankatta, Mangaluru',
        timestamp: 'Nov 09, 02:15 PM',
        isCompleted: true
      },
      {
        status: 'delivered',
        title: 'Delivered Successfully',
        description: 'Handed over to Kavitha Hegde with OTP verification',
        location: 'Hegde Arcade, Mangaluru',
        timestamp: 'Nov 09, 03:45 PM',
        isCompleted: true
      }
    ],
    currentLocation: {
      lat: 12.8703,
      lng: 74.8436,
      label: 'Delivered at Hampankatta, Mangaluru'
    },
    deliveryOtp: '4190',
    estimatedDeliveryDate: 'Nov 09, 2026',
    estimatedDeliveryWindow: 'Delivered',
    proofOfDelivery: {
      recipientName: 'Kavitha Hegde',
      deliveredAt: 'Nov 09, 2026 at 03:45 PM',
      otpVerified: true,
      deliveryAgentName: 'Prashanth Rao (ID #8821)',
      deliveryAgentPhone: '+91 97412 55001'
    }
  }
];

interface CourierStore {
  shipments: Shipment[];
  activeShipment: Shipment | null;
  savedSenders: AddressEntity[];
  savedReceivers: AddressEntity[];
  isBusinessMode: boolean;
  activeServiceTab: 'rides' | 'courier';

  // Navigation & Service Switch
  setActiveServiceTab: (tab: 'rides' | 'courier') => void;
  toggleBusinessMode: (val?: boolean) => void;

  // Shipment Operations
  createShipment: (payload: {
    packageDetails: PackageDetails;
    sender: AddressEntity;
    receiver: AddressEntity;
    pickupSchedule: PickupSchedule;
    serviceSpeed: ServiceSpeed;
  }) => Shipment;

  updateShipmentStatus: (shipmentId: string, newStatus: ShipmentStatus, reason?: string) => void;
  getShipmentById: (id: string) => Shipment | undefined;
  getShipmentByTrackingNumber: (trackingNumber: string) => Shipment | undefined;
  setActiveShipment: (shipment: Shipment | null) => void;
  verifyDeliveryOtp: (shipmentId: string, otp: string) => boolean;

  // Address book
  addSavedSender: (address: AddressEntity) => void;
  addSavedReceiver: (address: AddressEntity) => void;

  // Metrics
  getBusinessMetrics: () => BusinessMetrics;
}

const loadStorage = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const saveStorage = <T>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Failed saving ${key} to storage`, e);
  }
};

export const useCourierStore = create<CourierStore>((set, get) => {
  const initialShipments = loadStorage<Shipment[]>('skyppy_courier_shipments', DEMO_INITIAL_SHIPMENTS);
  const initialSenders = loadStorage<AddressEntity[]>('skyppy_saved_senders', DEFAULT_SENDERS);
  const initialReceivers = loadStorage<AddressEntity[]>('skyppy_saved_receivers', DEFAULT_RECEIVERS);
  const initialService = loadStorage<'rides' | 'courier'>('skyppy_active_service', 'rides');
  const initialBizMode = loadStorage<boolean>('skyppy_biz_mode', false);

  return {
    shipments: initialShipments,
    activeShipment: initialShipments[0] || null,
    savedSenders: initialSenders,
    savedReceivers: initialReceivers,
    isBusinessMode: initialBizMode,
    activeServiceTab: initialService,

    setActiveServiceTab: (tab) => {
      saveStorage('skyppy_active_service', tab);
      set({ activeServiceTab: tab });
    },

    toggleBusinessMode: (val) => {
      const next = val !== undefined ? val : !get().isBusinessMode;
      saveStorage('skyppy_biz_mode', next);
      set({ isBusinessMode: next });
    },

    createShipment: ({ packageDetails, sender, receiver, pickupSchedule, serviceSpeed }) => {
      const timestamp = new Date().toISOString();
      const randSuffix = Math.floor(100000 + Math.random() * 900000);
      const prefix = serviceSpeed === 'same_day_prime' ? 'PRM' : serviceSpeed === 'express_cargo' ? 'EXP' : 'STD';
      const trackingNumber = `SKP-${prefix}-${randSuffix}`;
      const id = `shp_${randSuffix}`;
      const deliveryOtp = String(Math.floor(1000 + Math.random() * 9000));

      const pricing = calculateCourierPricing(packageDetails, sender.city, receiver.city, serviceSpeed);

      let serviceName = 'Standard Surface Cargo';
      let estDelivery = '2-3 Days';
      let estWindow = 'by 06:00 PM';
      if (serviceSpeed === 'express_cargo') {
        serviceName = 'Express Intercity Logistics';
        estDelivery = 'Tomorrow';
        estWindow = 'by 12:00 PM';
      } else if (serviceSpeed === 'same_day_prime') {
        serviceName = 'Skyppy Prime Same-Day';
        estDelivery = 'Today';
        estWindow = 'by 09:30 PM';
      }

      const checkpoints: TrackingCheckpoint[] = [
        {
          status: 'booking_confirmed',
          title: 'Booking Confirmed',
          description: 'Shipment created and scheduled for dispatch',
          location: `${sender.city} Hub`,
          timestamp: 'Just now',
          isCompleted: true
        },
        {
          status: 'pickup_scheduled',
          title: 'Pickup Scheduled',
          description: `Driver assigned for ${pickupSchedule.date} (${pickupSchedule.slotLabel})`,
          location: sender.addressLine,
          timestamp: 'Scheduled',
          isCompleted: false
        },
        {
          status: 'parcel_picked_up',
          title: 'Parcel Picked Up',
          description: 'Awaiting sender physical hand-off',
          location: sender.city,
          timestamp: 'Pending',
          isCompleted: false
        },
        {
          status: 'processing',
          title: 'Origin Hub Sorting',
          description: 'Weight verification and security manifest scan',
          location: `${sender.city} Transshipment Center`,
          timestamp: 'Pending',
          isCompleted: false
        },
        {
          status: 'in_transit',
          title: 'Intercity Linehaul Transit',
          description: `Corridor transit: ${sender.city} -> ${receiver.city}`,
          location: 'Interstate Expressway',
          timestamp: 'Pending',
          isCompleted: false
        },
        {
          status: 'arrived_destination_hub',
          title: 'Arrived at Destination Hub',
          description: `Dispatched to ${receiver.city} local branch`,
          location: `${receiver.city} Hub`,
          timestamp: 'Pending',
          isCompleted: false
        },
        {
          status: 'out_for_delivery',
          title: 'Out for Delivery',
          description: 'Assigned to delivery courier unit',
          location: receiver.addressLine,
          timestamp: 'Pending',
          isCompleted: false
        },
        {
          status: 'delivered',
          title: 'Delivered',
          description: 'Final delivery confirmation with OTP verification',
          location: receiver.addressLine,
          timestamp: 'Pending',
          isCompleted: false
        }
      ];

      const newShipment: Shipment = {
        id,
        trackingNumber,
        createdAt: timestamp,
        status: 'booking_confirmed',
        serviceSpeed,
        serviceName,
        packageDetails,
        sender,
        receiver,
        pickupSchedule,
        pricing,
        checkpoints,
        currentLocation: {
          lat: 12.3364,
          lng: 76.6213,
          label: `${sender.city} Pickup Station`
        },
        deliveryOtp,
        estimatedDeliveryDate: estDelivery,
        estimatedDeliveryWindow: estWindow
      };

      const updated = [newShipment, ...get().shipments];
      saveStorage('skyppy_courier_shipments', updated);
      set({ shipments: updated, activeShipment: newShipment });
      return newShipment;
    },

    updateShipmentStatus: (shipmentId, newStatus, reason) => {
      const updated = get().shipments.map((shp) => {
        if (shp.id !== shipmentId && shp.trackingNumber !== shipmentId) return shp;

        const updatedCheckpoints = shp.checkpoints.map((cp) => {
          if (cp.status === newStatus) {
            return {
              ...cp,
              isCompleted: true,
              timestamp: 'Just updated',
              isException: ['pickup_failed', 'delivery_attempted', 'receiver_unavailable', 'delayed', 'exception', 'cancelled'].includes(newStatus)
            };
          }
          return cp;
        });

        let pod = shp.proofOfDelivery;
        if (newStatus === 'delivered' && !pod) {
          pod = {
            recipientName: shp.receiver.name,
            deliveredAt: new Date().toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }),
            otpVerified: true,
            deliveryAgentName: 'Venkatesh Murthy (ID #9204)',
            deliveryAgentPhone: '+91 98450 77211'
          };
        }

        return {
          ...shp,
          status: newStatus,
          exceptionReason: reason,
          proofOfDelivery: pod,
          checkpoints: updatedCheckpoints
        };
      });

      saveStorage('skyppy_courier_shipments', updated);
      const active = get().activeShipment;
      set({
        shipments: updated,
        activeShipment: active && (active.id === shipmentId || active.trackingNumber === shipmentId)
          ? updated.find((s) => s.id === shipmentId || s.trackingNumber === shipmentId) || null
          : active
      });
    },

    getShipmentById: (id) => {
      return get().shipments.find((s) => s.id === id || s.trackingNumber === id);
    },

    getShipmentByTrackingNumber: (trackingNumber) => {
      const clean = trackingNumber.trim().toUpperCase();
      return get().shipments.find((s) => s.trackingNumber.toUpperCase() === clean || s.id === trackingNumber);
    },

    setActiveShipment: (shipment) => {
      set({ activeShipment: shipment });
    },

    verifyDeliveryOtp: (shipmentId, otp) => {
      const shp = get().getShipmentById(shipmentId);
      if (!shp) return false;
      if (shp.deliveryOtp === otp.trim()) {
        get().updateShipmentStatus(shp.id, 'delivered');
        return true;
      }
      return false;
    },

    addSavedSender: (address) => {
      const updated = [address, ...get().savedSenders.filter((s) => s.name !== address.name)];
      saveStorage('skyppy_saved_senders', updated);
      set({ savedSenders: updated });
    },

    addSavedReceiver: (address) => {
      const updated = [address, ...get().savedReceivers.filter((r) => r.name !== address.name)];
      saveStorage('skyppy_saved_receivers', updated);
      set({ savedReceivers: updated });
    },

    getBusinessMetrics: () => {
      const shipments = get().shipments;
      const totalShipments = shipments.length;
      const activeInTransit = shipments.filter((s) => ['booking_confirmed', 'pickup_scheduled', 'parcel_picked_up', 'processing', 'in_transit', 'arrived_destination_hub', 'out_for_delivery'].includes(s.status)).length;
      const deliveredThisMonth = shipments.filter((s) => s.status === 'delivered').length;
      const totalSpentInr = shipments.reduce((sum, s) => sum + (s.pricing?.totalEstimatedFare || 0), 0);

      return {
        totalShipments,
        activeInTransit,
        deliveredThisMonth,
        totalSpentInr
      };
    }
  };
});
