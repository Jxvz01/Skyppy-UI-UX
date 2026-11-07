export type Language = 'en' | 'kn';

export interface TranslationStrings {
  // Navigation
  navHome: string;
  navActivity: string;
  navMiles: string;
  navProfile: string;

  // Header
  appTitle: string;
  appSubtitle: string;

  // Home
  transitLive: string;
  weatherClear: string;
  greetingMorning: string;
  heroHeadline: string;
  instantRide: string;
  scheduleTrip: string;
  pickupLocation: string;
  whereTo: string;
  repeatRecent: string;
  quickShortcuts: string;
  recentDestinations: string;
  seeAll: string;
  bookNow: string;
  manageShortcuts: string;

  // Search
  searchHeader: string;
  pickupPoint: string;
  dropDestination: string;
  searchPlaceholder: string;
  allPlaces: string;
  recent: string;
  savedSpots: string;
  transitHubs: string;
  cityHeritage: string;
  suggestedDestinations: string;
  noPlacesFound: string;

  // Options
  rideOptionsHeader: string;
  availableRides: string;
  fareBreakdown: string;
  baseFare: string;
  distanceFare: string;
  platformFee: string;
  totalFare: string;
  applyCoupon: string;
  confirmBooking: string;

  // Tracking
  trackingHeader: string;
  driverAssigned: string;
  driverApproaching: string;
  driverArrived: string;
  tripInProgress: string;
  tripCompleted: string;
  startOtp: string;
  shareTrip: string;
  safetyToolkit: string;
  cancelRide: string;
  autoPlay: string;
  pause: string;

  // Profile
  accountProfile: string;
  mysuruRider: string;
  editProfile: string;
  savedPlaces: string;
  ridePreferences: string;
  paymentMethods: string;
  helpSupport: string;
  appearance: string;
  language: string;
  resetDemo: string;
  logout: string;
}

export const translations: Record<Language, TranslationStrings> = {
  en: {
    navHome: 'Home',
    navActivity: 'Activity',
    navMiles: 'Miles',
    navProfile: 'Profile',

    appTitle: 'Skyppy',
    appSubtitle: 'Urban Mobility',

    transitLive: 'MYSURU TRANSIT LIVE',
    weatherClear: '27°C • Clear Roads',
    greetingMorning: 'Good morning',
    heroHeadline: 'Where are we going today?',
    instantRide: 'Instant Ride',
    scheduleTrip: 'Schedule Trip',
    pickupLocation: 'Pickup Location',
    whereTo: 'Where to in Mysuru?',
    repeatRecent: 'Repeat Recent',
    quickShortcuts: 'Quick Shortcuts',
    recentDestinations: 'Recent Destinations',
    seeAll: 'See all',
    bookNow: 'Book',
    manageShortcuts: 'Manage',

    searchHeader: 'Destination Search',
    pickupPoint: 'Pickup Point',
    dropDestination: 'Drop Destination',
    searchPlaceholder: 'Search destination in Mysuru...',
    allPlaces: 'All Places',
    recent: 'Recent',
    savedSpots: 'Saved Spots',
    transitHubs: 'Transit Hubs',
    cityHeritage: 'City Heritage',
    suggestedDestinations: 'Suggested Destinations',
    noPlacesFound: 'No locations matched',

    rideOptionsHeader: 'Ride Options',
    availableRides: 'Available Rides',
    fareBreakdown: 'Fare Breakdown',
    baseFare: 'Base Fare',
    distanceFare: 'Distance Charge',
    platformFee: 'Platform & Access Fee',
    totalFare: 'Total Fare',
    applyCoupon: 'Apply Coupon',
    confirmBooking: 'Confirm',

    trackingHeader: 'Live Ride Tracking',
    driverAssigned: 'Driver Assigned',
    driverApproaching: 'Driver Approaching',
    driverArrived: 'Driver Arrived at Pickup',
    tripInProgress: 'Trip In Progress',
    tripCompleted: 'Trip Completed',
    startOtp: 'Start OTP',
    shareTrip: 'Share Trip',
    safetyToolkit: 'Safety Toolkit',
    cancelRide: 'Cancel Ride',
    autoPlay: 'Auto-Play',
    pause: 'Pause',

    accountProfile: 'Account & Profile',
    mysuruRider: 'Mysuru Smart Rider',
    editProfile: 'Edit Profile',
    savedPlaces: 'Saved Places',
    ridePreferences: 'Ride Preferences',
    paymentMethods: 'Payment Methods',
    helpSupport: 'Help & Support',
    appearance: 'Appearance & Theme',
    language: 'Language',
    resetDemo: 'Reset Demo State',
    logout: 'Log Out'
  },
  kn: {
    navHome: 'ಮುಖಪುಟ',
    navActivity: 'ಚಟುವಟಿಕೆ',
    navMiles: 'ಮೈಲ್ಸ್',
    navProfile: 'ಪ್ರೊಫೈಲ್',

    appTitle: 'ಸ್ಕಿಪ್ಪಿ',
    appSubtitle: 'ನಗರ ಸಾರಿಗೆ',

    transitLive: 'ಮೈಸೂರು ಸಾರಿಗೆ ಲೈವ್',
    weatherClear: '27°C • ಸುಗಮ ರಸ್ತೆಗಳು',
    greetingMorning: 'ಶುಭ ಮುಂಜಾನೆ',
    heroHeadline: 'ಇಂದು ಎಲ್ಲಿಗೆ ಹೋಗಬೇಕು?',
    instantRide: 'ತಕ್ಷಣದ ಸವಾರಿ',
    scheduleTrip: 'ಸವಾರಿ ನಿಗದಿಪಡಿಸಿ',
    pickupLocation: 'ಆರಂಭಿಕ ಸ್ಥಳ',
    whereTo: 'ಮೈಸೂರಿನಲ್ಲಿ ಎಲ್ಲಿಗೆ?',
    repeatRecent: 'ಹಿಂದಿನ ಸವಾರಿ',
    quickShortcuts: 'ತ್ವರಿತ ತಾಣಗಳು',
    recentDestinations: 'ಇತ್ತೀಚಿನ ತಾಣಗಳು',
    seeAll: 'ಎಲ್ಲ ನೋಡಿ',
    bookNow: 'ಬುಕ್ ಮಾಡಿ',
    manageShortcuts: 'ನಿರ್ವಹಿಸಿ',

    searchHeader: 'ತಾಣ ಹುಡುಕಾಟ',
    pickupPoint: 'ಆರಂಭಿಕ ಸ್ಥಳ',
    dropDestination: 'ತಲುಪುವ ಸ್ಥಳ',
    searchPlaceholder: 'ಮೈಸೂರಿನಲ್ಲಿ ತಾಣ ಹುಡುಕಿ...',
    allPlaces: 'ಎಲ್ಲಾ ಸ್ಥಳಗಳು',
    recent: 'ಇತ್ತೀಚಿನವು',
    savedSpots: 'ಉಳಿಸಿದ ಸ್ಥಳಗಳು',
    transitHubs: 'ಸಾರಿಗೆ ಕೇಂದ್ರಗಳು',
    cityHeritage: 'ಪಾರಂಪರಿಕ ತಾಣಗಳು',
    suggestedDestinations: 'ಸೂಚಿಸಲಾದ ತಾಣಗಳು',
    noPlacesFound: 'ಯಾವುದೇ ಸ್ಥಳ ಸಿಗಲಿಲ್ಲ',

    rideOptionsHeader: 'ಸವಾರಿ ಆಯ್ಕೆಗಳು',
    availableRides: 'ಲಭ್ಯವಿರುವ ಸವಾರಿಗಳು',
    fareBreakdown: 'ದರ ವಿವರಣೆ',
    baseFare: 'ಮೂಲ ದರ',
    distanceFare: 'ದೂರದ ಶುಲ್ಕ',
    platformFee: 'ವೇದಿಕೆ ಶುಲ್ಕ',
    totalFare: 'ಒಟ್ಟು ದರ',
    applyCoupon: 'ಕೂಪನ್ ಬಳಸಿ',
    confirmBooking: 'ದೃಢೀಕರಿಸಿ',

    trackingHeader: 'ಲೈವ್ ಸವಾರಿ ಟ್ರ್ಯಾಕಿಂಗ್',
    driverAssigned: 'ಚಾಲಕರು ನಿಯೋಜಿತರಾಗಿದ್ದಾರೆ',
    driverApproaching: 'ಚಾಲಕರು ಬರುತ್ತಿದ್ದಾರೆ',
    driverArrived: 'ಚಾಲಕರು ಬಂದಿದ್ದಾರೆ',
    tripInProgress: 'ಸವಾರಿ ಚಾಲನೆಯಲ್ಲಿದೆ',
    tripCompleted: 'ಸವಾರಿ ಪೂರ್ಣಗೊಂಡಿದೆ',
    startOtp: 'ಆರಂಭದ OTP',
    shareTrip: 'ಸವಾರಿ ಹಂಚಿಕೊಳ್ಳಿ',
    safetyToolkit: 'ಸುರಕ್ಷತಾ ಕಿಟ್',
    cancelRide: 'ಸವಾರಿ ರದ್ದುಮಾಡಿ',
    autoPlay: 'ಸ್ವಯಂಚಾಲಿತ',
    pause: 'ವಿರಾಮ',

    accountProfile: 'ಖಾತೆ ಮತ್ತು ವಿವರ',
    mysuruRider: 'ಮೈಸೂರು ಸ್ಮಾರ್ಟ್ ಪ್ರಯಾಣಿಕ',
    editProfile: 'ಪ್ರೊಫೈಲ್ ತಿದ್ದಿ',
    savedPlaces: 'ಉಳಿಸಿದ ಸ್ಥಳಗಳು',
    ridePreferences: 'ಸವಾರಿ ಆದ್ಯತೆಗಳು',
    paymentMethods: 'ಪಾವತಿ ವಿಧಾನಗಳು',
    helpSupport: 'ಸಹಾಯ ಮತ್ತು ಬೆಂಬಲ',
    appearance: 'ರೂಪ ಮತ್ತು ಥೀಮ್',
    language: 'ಭಾಷೆ (Language)',
    resetDemo: 'ಡೆಮೊ ಮರುಹೊಂದಿಸಿ',
    logout: 'ಲಾಗ್‌ಔಟ್'
  }
};

