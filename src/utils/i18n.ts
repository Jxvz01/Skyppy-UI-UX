export type Language = 'en' | 'kn';

export interface TranslationDictionary {
  // Navigation Tabs
  navHome: string;
  navActivity: string;
  navMiles: string;
  navProfile: string;

  // Global App & Header
  appTitle: string;
  appSubtitle: string;
  cityMysuru: string;
  switchLanguage: string;

  // Home Screen (Rides & Courier)
  moveRideShip: string;
  acrossMysuru: string;
  bookARide: string;
  sendAParcel: string;
  newBadge: string;
  planYourJourney: string;
  whereAreWeGoing: string;
  pickupLocation: string;
  whereTo: string;
  whereToInMysuru: string;
  skyppyMove: string;
  sendParcelsAcrossCities: string;
  quickActions: string;
  viewAll: string;
  rideNow: string;
  autoCar: string;
  sendParcel: string;
  intercity: string;
  schedule: string;
  rideOrPickup: string;
  track: string;
  rideParcel: string;
  skyppyMiles: string;
  rideShipEarn: string;
  milesToGold: string;
  viewRewards: string;
  repeatRecent: string;
  quickShortcuts: string;
  recentDestinations: string;
  seeAll: string;
  bookNow: string;
  manageShortcuts: string;

  // Courier Home & Actions
  shipPackagesSafely: string;
  intercityDelivery: string;
  safeSecureHandling: string;
  liveTracking: string;
  proofOfDelivery: string;
  fromLocation: string;
  toLocation: string;
  createShipment: string;
  newShipment: string;
  trackShipment: string;
  scheduledPickups: string;
  shipmentHistory: string;
  liveStatus: string;

  // Destination Search & Location Picker
  selectLocations: string;
  searchHeader: string;
  pickupPoint: string;
  dropDestination: string;
  searchByText: string;
  selectOnMap: string;
  searchPlaceholder: string;
  useCurrentLocation: string;
  allPlaces: string;
  recent: string;
  savedSpots: string;
  transitHubs: string;
  cityHeritage: string;
  popularLocations: string;
  suggestedDestinations: string;
  noPlacesFound: string;
  panMapInstruction: string;
  confirmedPickup: string;
  confirmedDrop: string;
  confirmPickupLocation: string;
  confirmDestination: string;

  // Route Verification (Location Selection)
  confirmRoute: string;
  routeVerification: string;
  confirmRideRoute: string;
  normalTraffic: string;
  fastestRoute: string;
  shortestRoute: string;
  proceedToChooseVehicle: string;

  // Ride Options & Fares
  rideOptionsHeader: string;
  availableRides: string;
  bestPrice: string;
  fareBreakdown: string;
  baseFare: string;
  distanceFare: string;
  platformFee: string;
  totalFare: string;
  applyCoupon: string;
  confirmBooking: string;
  earnSkyppyMiles: string;
  selectPaymentMethod: string;

  // Booking Confirmation
  confirmingYourRide: string;
  findingBestVehicle: string;
  rideRequested: string;
  findingNearbyVehicle: string;
  finalisingBooking: string;
  yourRideIsConfirmed: string;
  vehicleOnTheWay: string;
  vehicleLabel: string;
  regNoLabel: string;
  arrivingIn: string;
  mins: string;
  estimatedFare: string;
  trackLiveRide: string;

  // Live Ride Tracking
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
  trafficOn: string;
  trafficOff: string;
  chatWithDriver: string;
  callDriver: string;

  // Activity History
  activityTitle: string;
  ridesTab: string;
  consignmentsTab: string;
  completedStatus: string;
  cancelledStatus: string;
  viewReceipt: string;
  rebookRide: string;
  noTripsFound: string;

  // Skyppy Miles
  lifetimeMiles: string;
  availableBalance: string;
  tierStatus: string;
  redeemRewards: string;
  rewardsCatalog: string;

  // Profile & Settings
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

export type TranslationStrings = TranslationDictionary;

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    navHome: 'Home',
    navActivity: 'Activity',
    navMiles: 'Miles',
    navProfile: 'Profile',

    appTitle: 'Skyppy',
    appSubtitle: 'URBAN MOBILITY',
    cityMysuru: 'Mysuru',
    switchLanguage: 'Switch to Kannada',

    moveRideShip: 'Move.\nRide.\nShip.',
    acrossMysuru: 'Across Mysuru and beyond.',
    bookARide: 'Book a Ride',
    sendAParcel: 'Send a Parcel',
    newBadge: 'New',
    planYourJourney: 'PLAN YOUR JOURNEY',
    whereAreWeGoing: 'Where are we going today?',
    pickupLocation: 'Pickup location',
    whereTo: 'Where to in Mysuru?',
    whereToInMysuru: 'Where to in Mysuru?',
    skyppyMove: 'SKAPPY MOVE',
    sendParcelsAcrossCities: 'Send parcels across cities',
    quickActions: 'QUICK ACTIONS',
    viewAll: 'View all',
    rideNow: 'Ride Now',
    autoCar: 'Auto • Car',
    sendParcel: 'Send Parcel',
    intercity: 'Intercity',
    schedule: 'Schedule',
    rideOrPickup: 'Ride or Pickup',
    track: 'Track',
    rideParcel: 'Ride / Parcel',
    skyppyMiles: 'Skyppy Miles',
    rideShipEarn: 'Ride • Ship • Earn',
    milesToGold: '68 miles to Gold',
    viewRewards: 'View Rewards →',
    repeatRecent: 'Repeat Recent',
    quickShortcuts: 'Quick Shortcuts',
    recentDestinations: 'Recent Destinations',
    seeAll: 'See all',
    bookNow: 'Book Now',
    manageShortcuts: 'Manage',

    shipPackagesSafely: 'Ship your packages safely across cities.',
    intercityDelivery: 'Intercity Delivery',
    safeSecureHandling: 'Safe & Secure Handling',
    liveTracking: 'Live Tracking',
    proofOfDelivery: 'Proof of Delivery',
    fromLocation: 'FROM',
    toLocation: 'TO',
    createShipment: 'Create Shipment',
    newShipment: 'New Shipment',
    trackShipment: 'Track Shipment',
    scheduledPickups: 'Scheduled Pickups',
    shipmentHistory: 'Shipment History',
    liveStatus: 'Live status',

    selectLocations: 'Select Locations',
    searchHeader: 'Destination Search',
    pickupPoint: 'Pickup Point',
    dropDestination: 'Drop Destination',
    searchByText: 'Search by Text',
    selectOnMap: 'Select on Map',
    searchPlaceholder: 'Where to in Mysuru? (e.g. Palace, Station)',
    useCurrentLocation: 'Use Current GPS Location',
    allPlaces: 'All Places',
    recent: 'Recent',
    savedSpots: 'Saved',
    transitHubs: 'Transit Hubs',
    cityHeritage: 'Heritage',
    popularLocations: 'POPULAR LOCATIONS IN MYSURU',
    suggestedDestinations: 'Suggested Destinations',
    noPlacesFound: 'No locations matched',
    panMapInstruction: 'Pan map to set exact location',
    confirmedPickup: 'Confirmed Pickup Point',
    confirmedDrop: 'Confirmed Drop Destination',
    confirmPickupLocation: 'Confirm Pickup Location',
    confirmDestination: 'Confirm Destination',

    confirmRoute: 'Confirm Route',
    routeVerification: 'Route Verification',
    confirmRideRoute: 'Confirm Ride Route',
    normalTraffic: 'Normal Traffic',
    fastestRoute: 'Fastest Route',
    shortestRoute: 'Shortest Route',
    proceedToChooseVehicle: 'Proceed to Choose Vehicle',

    rideOptionsHeader: 'Available Rides',
    availableRides: 'Available Rides',
    bestPrice: 'Best Price',
    fareBreakdown: 'Fare Breakdown',
    baseFare: 'Base Fare',
    distanceFare: 'Distance Charge',
    platformFee: 'Platform & Access Fee',
    totalFare: 'Total Fare',
    applyCoupon: 'Apply Coupon',
    confirmBooking: 'Confirm & Book',
    earnSkyppyMiles: 'Earn Skyppy Miles on this ride',
    selectPaymentMethod: 'Select Payment Method',

    confirmingYourRide: 'Confirming your ride',
    findingBestVehicle: 'Finding the best available vehicle near you...',
    rideRequested: 'Ride requested',
    findingNearbyVehicle: 'Finding a nearby vehicle',
    finalisingBooking: 'Finalising your booking',
    yourRideIsConfirmed: 'Your ride is confirmed!',
    vehicleOnTheWay: 'Your vehicle is on the way to pickup location.',
    vehicleLabel: 'Vehicle',
    regNoLabel: 'Reg. No.',
    arrivingIn: 'Arriving in',
    mins: 'mins',
    estimatedFare: 'Estimated fare',
    trackLiveRide: 'Track Live Ride',

    trackingHeader: 'Live Ride Tracking',
    driverAssigned: 'Driver Assigned',
    driverApproaching: 'Driver Approaching',
    driverArrived: 'Driver Arrived at Pickup',
    tripInProgress: 'Trip In Progress',
    tripCompleted: 'Trip Completed',
    startOtp: 'Start OTP',
    shareTrip: 'Share Trip',
    safetyToolkit: 'Safety Toolkit',
    cancelRide: 'Cancel Booking',
    autoPlay: 'Auto-Play',
    pause: 'Pause',
    trafficOn: 'Traffic ON',
    trafficOff: 'Traffic OFF',
    chatWithDriver: 'Chat with Driver',
    callDriver: 'Call Driver',

    activityTitle: 'Your Activity',
    ridesTab: 'Passenger Rides',
    consignmentsTab: 'Courier Shipments',
    completedStatus: 'Completed',
    cancelledStatus: 'Cancelled',
    viewReceipt: 'View Receipt',
    rebookRide: 'Rebook Ride',
    noTripsFound: 'No past trips found in this category',

    lifetimeMiles: 'Lifetime Miles',
    availableBalance: 'Available Balance',
    tierStatus: 'Tier Status',
    redeemRewards: 'Redeem Rewards',
    rewardsCatalog: 'Rewards Catalog',

    accountProfile: 'Account & Profile',
    mysuruRider: 'Mysuru Smart Rider',
    editProfile: 'Edit Profile',
    savedPlaces: 'Saved Places',
    ridePreferences: 'Ride Preferences',
    paymentMethods: 'Payment Methods',
    helpSupport: 'Help & Support',
    appearance: 'Appearance',
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
    cityMysuru: 'ಮೈಸೂರು',
    switchLanguage: 'Switch to English',

    moveRideShip: 'ಚಲಿಸಿ.\nಸವಾರಿ ಮಾಡಿ.\nರವಾನಿಸಿ.',
    acrossMysuru: 'ಮೈಸೂರು ಮತ್ತು ಸುತ್ತಮುತ್ತಲಿನ ನಗರಗಳಿಗೆ.',
    bookARide: 'ಸವಾರಿ ಬುಕ್ ಮಾಡಿ',
    sendAParcel: 'ಪಾರ್ಸೆಲ್ ಕಳುಹಿಸಿ',
    newBadge: 'ಹೊಸತು',
    planYourJourney: 'ಪ್ರಯಾಣದ ಯೋಜನೆ',
    whereAreWeGoing: 'ಇಂದು ಎಲ್ಲಿಗೆ ಹೋಗಬೇಕು?',
    pickupLocation: 'ಆರಂಭಿಕ ಸ್ಥಳ',
    whereTo: 'ಮೈಸೂರಿನಲ್ಲಿ ಎಲ್ಲಿಗೆ?',
    whereToInMysuru: 'ಮೈಸೂರಿನಲ್ಲಿ ಎಲ್ಲಿಗೆ?',
    skyppyMove: 'ಸ್ಕಿಪ್ಪಿ ಮೂವ್',
    sendParcelsAcrossCities: 'ನಗರಗಳ ನಡುವೆ ಪಾರ್ಸೆಲ್ ಕಳುಹಿಸಿ',
    quickActions: 'ತ್ವರಿತ ಕ್ರಮಗಳು',
    viewAll: 'ಎಲ್ಲ ನೋಡಿ',
    rideNow: 'ಈಗಲೇ ಸವಾರಿ',
    autoCar: 'ಆಟೋ • ಕಾರು',
    sendParcel: 'ಪಾರ್ಸೆಲ್',
    intercity: 'ಅಂತರನಗರ',
    schedule: 'ನಿಗದಿಪಡಿಸಿ',
    rideOrPickup: 'ಸವಾರಿ / ಪಿಕಪ್',
    track: 'ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',
    rideParcel: 'ಸವಾರಿ / ಪಾರ್ಸೆಲ್',
    skyppyMiles: 'ಸ್ಕಿಪ್ಪಿ ಮೈಲ್ಸ್',
    rideShipEarn: 'ಸವಾರಿ • ಪಾರ್ಸೆಲ್ • ಗಳಿಕೆ',
    milesToGold: 'ಗೋಲ್ಡ್ ಹಂತಕ್ಕೆ 68 ಮೈಲುಗಳು',
    viewRewards: 'ಬಹುಮಾನಗಳು →',
    repeatRecent: 'ಹಿಂದಿನ ಸವಾರಿ',
    quickShortcuts: 'ತ್ವರಿತ ತಾಣಗಳು',
    recentDestinations: 'ಇತ್ತೀಚಿನ ತಾಣಗಳು',
    seeAll: 'ಎಲ್ಲ ನೋಡಿ',
    bookNow: 'ಈಗಲೇ ಬುಕ್ ಮಾಡಿ',
    manageShortcuts: 'ನಿರ್ವಹಿಸಿ',

    shipPackagesSafely: 'ನಿಮ್ಮ ಪಾರ್ಸೆಲ್‌ಗಳನ್ನು ನಗರಗಳ ನಡುವೆ ಸುರಕ್ಷಿತವಾಗಿ ರವಾನಿಸಿ.',
    intercityDelivery: 'ಅಂತರನಗರ ವಿತರಣೆ',
    safeSecureHandling: 'ಸುರಕ್ಷಿತ ನಿರ್ವಹಣೆ',
    liveTracking: 'ಲೈವ್ ಟ್ರ್ಯಾಕಿಂಗ್',
    proofOfDelivery: 'ವಿತರಣೆಯ ಪುರಾವೆ',
    fromLocation: 'ಇಲ್ಲಿಂದ',
    toLocation: 'ಇಲ್ಲಿಗೆ',
    createShipment: 'ರವಾನೆ ರಚಿಸಿ',
    newShipment: 'ಹೊಸ ರವಾನೆ',
    trackShipment: 'ರವಾನೆ ಟ್ರ್ಯಾಕ್',
    scheduledPickups: 'ನಿಗದಿತ ಪಿಕಪ್‌ಗಳು',
    shipmentHistory: 'ರವಾನೆ ಇತಿಹಾಸ',
    liveStatus: 'ಲೈವ್ ಸ್ಥಿತಿ',

    selectLocations: 'ಸ್ಥಳಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    searchHeader: 'ತಾಣ ಹುಡುಕಾಟ',
    pickupPoint: 'ಆರಂಭಿಕ ಸ್ಥಳ',
    dropDestination: 'ತಲುಪುವ ಸ್ಥಳ',
    searchByText: 'ಹೆಸರಿನಿಂದ ಹುಡುಕಿ',
    selectOnMap: 'ನಕ್ಷೆಯಲ್ಲಿ ಆಯ್ಕೆಮಾಡಿ',
    searchPlaceholder: 'ಮೈಸೂರಿನ ಸ್ಥಳ ಹುಡುಕಿ (ಉದಾ: ಅರಮನೆ, ನಿಲ್ದಾಣ)',
    useCurrentLocation: 'ಪ್ರಸ್ತುತ ಜಿಪಿಎಸ್ ಸ್ಥಳ ಬಳಸಿ',
    allPlaces: 'ಎಲ್ಲಾ ಸ್ಥಳಗಳು',
    recent: 'ಇತ್ತೀಚಿನವು',
    savedSpots: 'ಉಳಿಸಿದ ಸ್ಥಳಗಳು',
    transitHubs: 'ಸಾರಿಗೆ ಕೇಂದ್ರಗಳು',
    cityHeritage: 'ಪಾರಂಪರಿಕ ತಾಣಗಳು',
    popularLocations: 'ಮೈಸೂರಿನ ಜನಪ್ರಿಯ ಸ್ಥಳಗಳು',
    suggestedDestinations: 'ಸೂಚಿಸಲಾದ ತಾಣಗಳು',
    noPlacesFound: 'ಯಾವುದೇ ಸ್ಥಳ ಸಿಗಲಿಲ್ಲ',
    panMapInstruction: 'ನಿಖರವಾದ ಸ್ಥಳವನ್ನು ಹೊಂದಿಸಲು ನಕ್ಷೆಯನ್ನು ಸರಿಸಿ',
    confirmedPickup: 'ಖಚಿತ ಪಿಕಪ್ ಸ್ಥಳ',
    confirmedDrop: 'ಖಚಿತ ತಲುಪುವ ಸ್ಥಳ',
    confirmPickupLocation: 'ಪಿಕಪ್ ಸ್ಥಳ ದೃಢೀಕರಿಸಿ',
    confirmDestination: 'ತಲುಪುವ ಸ್ಥಳ ದೃಢೀಕರಿಸಿ',

    confirmRoute: 'ಮಾರ್ಗ ದೃಢೀಕರಣ',
    routeVerification: 'ಮಾರ್ಗ ಪರಿಶೀಲನೆ',
    confirmRideRoute: 'ಸವಾರಿ ಮಾರ್ಗ ದೃಢೀಕರಿಸಿ',
    normalTraffic: 'ಸಾಮಾನ್ಯ ಸಂಚಾರ',
    fastestRoute: 'ವೇಗದ ಮಾರ್ಗ',
    shortestRoute: 'ಕಡಿಮೆ ದೂರದ ಮಾರ್ಗ',
    proceedToChooseVehicle: 'ವಾಹನ ಆಯ್ಕೆಗೆ ಮುಂದುವರಿಯಿರಿ',

    rideOptionsHeader: 'ಲಭ್ಯವಿರುವ ಸವಾರಿಗಳು',
    availableRides: 'ಲಭ್ಯವಿರುವ ಸವಾರಿಗಳು',
    bestPrice: 'ಉತ್ತಮ ಬೆಲೆ',
    fareBreakdown: 'ದರ ವಿವರಣೆ',
    baseFare: 'ಮೂಲ ದರ',
    distanceFare: 'ದೂರದ ಶುಲ್ಕ',
    platformFee: 'ವೇದಿಕೆ ಶುಲ್ಕ',
    totalFare: 'ಒಟ್ಟು ದರ',
    applyCoupon: 'ಕೂಪನ್ ಬಳಸಿ',
    confirmBooking: 'ದೃಢೀಕರಿಸಿ ಮತ್ತು ಬುಕ್ ಮಾಡಿ',
    earnSkyppyMiles: 'ಈ ಸವಾರಿಯಲ್ಲಿ ಸ್ಕಿಪ್ಪಿ ಮೈಲ್ಸ್ ಗಳಿಸಿ',
    selectPaymentMethod: 'ಪಾವತಿ ವಿಧಾನ',

    confirmingYourRide: 'ಸವಾರಿ ದೃಢೀಕರಣ',
    findingBestVehicle: 'ನಿಮ್ಮ ಹತ್ತಿರದ ಅತ್ಯುತ್ತಮ ವಾಹನ ಹುಡುಕಲಾಗುತ್ತಿದೆ...',
    rideRequested: 'ಸವಾರಿ ವಿನಂತಿಸಲಾಗಿದೆ',
    findingNearbyVehicle: 'ಹತ್ತಿರದ ವಾಹನ ಹುಡುಕಲಾಗುತ್ತಿದೆ',
    finalisingBooking: 'ಬುಕಿಂಗ್ ಅಂತಿಮಗೊಳಿಸಲಾಗುತ್ತಿದೆ',
    yourRideIsConfirmed: 'ನಿಮ್ಮ ಸವಾರಿ ದೃಢಪಟ್ಟಿದೆ!',
    vehicleOnTheWay: 'ನಿಮ್ಮ ವಾಹನವು ಪಿಕಪ್ ಸ್ಥಳಕ್ಕೆ ಬರುತ್ತಿದೆ.',
    vehicleLabel: 'ವಾಹನ',
    regNoLabel: 'ನೋಂದಣಿ ಸಂ.',
    arrivingIn: 'ತಲುಪಲು',
    mins: 'ನಿಮಿಷ',
    estimatedFare: 'ಅಂದಾಜು ದರ',
    trackLiveRide: 'ಲೈವ್ ಸವಾರಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',

    trackingHeader: 'ಲೈವ್ ಸವಾರಿ ಟ್ರ್ಯಾಕಿಂಗ್',
    driverAssigned: 'ಚಾಲಕರು ನಿಯೋಜಿತರಾಗಿದ್ದಾರೆ',
    driverApproaching: 'ಚಾಲಕರು ಬರುತ್ತಿದ್ದಾರೆ',
    driverArrived: 'ಚಾಲಕರು ಪಿಕಪ್ ಸ್ಥಳಕ್ಕೆ ಬಂದಿದ್ದಾರೆ',
    tripInProgress: 'ಸವಾರಿ ಚಾಲನೆಯಲ್ಲಿದೆ',
    tripCompleted: 'ಸವಾರಿ ಪೂರ್ಣಗೊಂಡಿದೆ',
    startOtp: 'ಆರಂಭದ OTP',
    shareTrip: 'ಸವಾರಿ ಹಂಚಿಕೊಳ್ಳಿ',
    safetyToolkit: 'ಸುರಕ್ಷತಾ ಕಿಟ್',
    cancelRide: 'ಸವಾರಿ ರದ್ದುಮಾಡಿ',
    autoPlay: 'ಸ್ವಯಂಚಾಲಿತ',
    pause: 'ವಿರಾಮ',
    trafficOn: 'ಸಂಚಾರ ON',
    trafficOff: 'ಸಂಚಾರ OFF',
    chatWithDriver: 'ಚಾಲಕರೊಂದಿಗೆ ಚಾಟ್',
    callDriver: 'ಚಾಲಕರಿಗೆ ಕರೆ',

    activityTitle: 'ಚಟುವಟಿಕೆ ಮತ್ತು ಇತಿಹಾಸ',
    ridesTab: 'ಪ್ರಯಾಣಿಕರ ಸವಾರಿಗಳು',
    consignmentsTab: 'ಪಾರ್ಸೆಲ್ ರವಾನೆಗಳು',
    completedStatus: 'ಪೂರ್ಣಗೊಂಡಿದೆ',
    cancelledStatus: 'ರದ್ದುಗೊಂಡಿದೆ',
    viewReceipt: 'ರಶೀದಿ ವೀಕ್ಷಿಸಿ',
    rebookRide: 'ಮರು ಬುಕ್ ಮಾಡಿ',
    noTripsFound: 'ಈ ವಿಭಾಗದಲ್ಲಿ ಯಾವುದೇ ಹಿಂದಿನ ಸವಾರಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ',

    lifetimeMiles: 'ಒಟ್ಟು ಗಳಿಸಿದ ಮೈಲ್ಸ್',
    availableBalance: 'ಲಭ್ಯವಿರುವ ಬ್ಯಾಲೆನ್ಸ್',
    tierStatus: 'ಶ್ರೇಣಿ ಸ್ಥಿತಿ',
    redeemRewards: 'ಬಹುಮಾನ ಪಡೆದುಕೊಳ್ಳಿ',
    rewardsCatalog: 'ಬಹುಮಾನಗಳ ಪಟ್ಟಿ',

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
