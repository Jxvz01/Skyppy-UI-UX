import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { OpenStreetMap } from '../components/OpenStreetMap';
import { useAppStore } from '../store/useAppStore';
import { translations } from '../utils/i18n';
import {
  FALLBACK_DRIVER_APPROACH,
  FALLBACK_TRIP_ROUTE,
  getPositionAlongRoute,
  interpolateHeading,
  getRouteTotalDistance,
  fetchRoadRoute
} from '../utils/roadRouting';

export const LiveRideTracking: React.FC = () => {
  const navigate = useNavigate();
  const {
    activeBooking,
    cancelBooking,
    openModal,
    showToast,
    language,
    liveTripShare
  } = useAppStore();

  const t = translations[language] || translations.en;

  // 0: Assigned, 1: Approaching, 2: At Pickup, 3: On Ride, 4: Completed
  const [stepIndex, setStepIndex] = useState(1);
  const [isAutoSimulating, setIsAutoSimulating] = useState(false);
  const [simMultiplier, setSimMultiplier] = useState<number>(2); // 1x, 2x, 4x speed

  // Road geometry state
  const [approachRoute, setApproachRoute] = useState<[number, number][]>(FALLBACK_DRIVER_APPROACH);
  const [tripRoute, setTripRoute] = useState<[number, number][]>(FALLBACK_TRIP_ROUTE);

  // Dynamic road traveled meters for active stage
  const [traveledMeters, setTraveledMeters] = useState(350);
  const [speed, setSpeed] = useState(26);
  const [currentHeading, setCurrentHeading] = useState(245);
  const [streetName, setStreetName] = useState('Kalidasa Road');

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Driver taking too long');
  const [isTrafficOn, setIsTrafficOn] = useState(true);

  const booking = activeBooking || {
    bookingId: 'SKY784392',
    fare: 76,
    otp: '4891',
    startOtp: '5482',
    vehicleName: 'Auto Rickshaw',
    driver: {
      name: 'Ramesh K.',
      phone: '+91 98765 43210',
      rating: '4.8',
      plate: 'KA-09 AB 4217',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBFC_47gt-3lPsOkq5tq9A1wWjAanAGLT6QZO8F3aTw1LfNOksrrxtXPF71CGQ_FJ7pd2LCtqBQDSpXdXwOpey0sE6qNx6fucroCvNH0h6iro5jb2ysLyvNzFo1738hYjEHq4Swjk-8vLvooNWxWoVptliHy445jMIRy5KQxPdsJiOuxf15CvmmGzGTG3p2hxjjR4GDmV5Xy9khm4tVw1cxiuqqOxQX-FwykOSgEZM'
    },
    pickup: { title: 'VVCE Gokulam', address: 'Mysuru, Karnataka' },
    destination: { title: 'JSS Medical College', address: 'Bannimantap, Mysuru', distanceKm: 4.2 }
  };

  const isApproaching = stepIndex < 2;
  const isAtPickup = stepIndex === 2;
  const isOnTrip = stepIndex === 3;
  const isCompleted = stepIndex >= 4;

  const activeRoute = isApproaching ? approachRoute : tripRoute;
  const totalMeters = getRouteTotalDistance(activeRoute);

  // Attempt to load fresh OSRM road geometry in background
  useEffect(() => {
    let isMounted = true;
    const loadRoutes = async () => {
      try {
        const approach = await fetchRoadRoute([12.3325, 76.6278], [12.3364, 76.6213]);
        if (isMounted && approach.coordinates.length > 2) {
          setApproachRoute(approach.coordinates);
        }
        const trip = await fetchRoadRoute([12.3364, 76.6213], [12.3392, 76.6575]);
        if (isMounted && trip.coordinates.length > 2) {
          setTripRoute(trip.coordinates);
        }
      } catch {
        // Fallbacks remain in place
      }
    };
    loadRoutes();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute live position along route
  const currentProgress = getPositionAlongRoute(activeRoute, traveledMeters);

  // Smooth heading interpolation as vehicle travels road segments
  useEffect(() => {
    setCurrentHeading((prev) => interpolateHeading(prev, currentProgress.heading, 0.25));
  }, [currentProgress.heading]);

  // Update street name according to route position
  useEffect(() => {
    if (isApproaching) {
      if (traveledMeters < 500) setStreetName('Kalidasa Road');
      else if (traveledMeters < 1200) setStreetName('Temple Road, Gokulam');
      else setStreetName('VVCE Gate 2, Gokulam');
    } else if (isAtPickup) {
      setStreetName('VVCE Gate 2, Gokulam');
    } else if (isOnTrip) {
      const pct = traveledMeters / totalMeters;
      if (pct < 0.25) setStreetName('Kalidasa Road West');
      else if (pct < 0.55) setStreetName('KRS Road Corridor');
      else if (pct < 0.8) setStreetName('Sayyaji Rao Road');
      else setStreetName('Bannimantap Main Road');
    } else {
      setStreetName('JSS Hospital Bannimantap');
    }
  }, [traveledMeters, isApproaching, isAtPickup, isOnTrip, totalMeters]);

  // Stage configuration & descriptions
  const stepConfig = [
    {
      label: 'Assigned',
      title: 'Driver Assigned',
      desc: `${booking.driver.name} is on Kalidasa Road heading to your pickup location`,
      badgeEta: '~4 min'
    },
    {
      label: 'Approaching',
      title: 'Driver Approaching',
      desc: `${booking.vehicleName} (${booking.driver.plate}) is ~${Math.max(100, Math.round(currentProgress.remainingMeters))}m away`,
      badgeEta: '~2 min'
    },
    {
      label: 'At Pickup',
      title: 'Driver Arrived at Pickup',
      desc: 'Driver is outside VVCE Gate 2! Share your Start OTP to board',
      badgeEta: 'Arrived'
    },
    {
      label: 'On Ride',
      title: 'Trip in Progress',
      desc: `Cruising along ${streetName} towards ${booking.destination.title.split(',')[0]}`,
      badgeEta: `~${Math.max(1, Math.round((currentProgress.remainingMeters / 1000) * 2.4))} min`
    },
    {
      label: 'Completed',
      title: 'Trip Finished Safely',
      desc: 'You have arrived safely at your destination',
      badgeEta: 'Arrived'
    }
  ];

  const currentStepInfo = stepConfig[stepIndex] || stepConfig[1];

  // Auto-simulation tick: smooth continuous movement along actual road geometry
  useEffect(() => {
    if (!isAutoSimulating) return;

    const intervalMs = 100;
    const timer = setInterval(() => {
      setTraveledMeters((prev) => {
        // Compute speed in km/h with natural acceleration & cornering
        let curSpeed = 28;
        if (isApproaching) {
          curSpeed = 24 + Math.sin(prev / 60) * 4;
        } else if (isOnTrip) {
          curSpeed = 32 + Math.sin(prev / 120) * 7;
        } else {
          curSpeed = 0;
        }

        const effectiveSpeed = curSpeed * simMultiplier;
        setSpeed(Math.round(curSpeed));

        // Distance in meters added per tick
        const addedMeters = (effectiveSpeed * 1000) / (3600 * (1000 / intervalMs));
        const nextMeters = prev + addedMeters;

        // Stage transitions
        if (isApproaching && nextMeters >= totalMeters - 15) {
          setStepIndex(2); // Arrived at pickup
          setTraveledMeters(0);
          setSpeed(0);
          showToast('Driver Ramesh K. has arrived at VVCE Gate 2!', 'success');
          return 0;
        }

        if (isOnTrip && nextMeters >= totalMeters - 20) {
          setStepIndex(4); // Trip completed
          setSpeed(0);
          setIsAutoSimulating(false);
          openModal('tripCompleted');
          return totalMeters;
        }

        return nextMeters;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isAutoSimulating, isApproaching, isOnTrip, totalMeters, simMultiplier, openModal, showToast]);

  // Handle manual stage jumps
  const handleStageSelect = (idx: number) => {
    setStepIndex(idx);
    if (idx === 0) {
      setTraveledMeters(0);
      setSpeed(0);
    } else if (idx === 1) {
      setTraveledMeters(Math.min(300, totalMeters * 0.4));
      setSpeed(26);
    } else if (idx === 2) {
      setTraveledMeters(totalMeters);
      setSpeed(0);
    } else if (idx === 3) {
      setTraveledMeters(Math.min(600, totalMeters * 0.3));
      setSpeed(32);
    } else if (idx === 4) {
      setTraveledMeters(totalMeters);
      setSpeed(0);
      setTimeout(() => openModal('tripCompleted'), 500);
    }
  };

  const handleConfirmCancel = () => {
    cancelBooking(cancelReason);
    setIsCancelModalOpen(false);
    navigate('/activity');
  };

  return (
    <div className="flex-1 flex flex-col relative w-full bg-surface min-h-full select-none">
      <Header type="stack" title={t.trackingHeader} backTo="/" />

      <main className="flex flex-col w-full relative pb-10">
        {/* Clean, High-Fidelity Road Network Map */}
        <div className="relative w-full h-[390px] overflow-hidden rounded-b-3xl bg-[#f4f6fa] shadow-md border-b border-slate-200/60">
          <OpenStreetMap
            mode="live-tracking"
            speed={speed}
            driverName={booking.driver.name}
            vehicleCategory={booking.vehicleName}
            isTrafficOn={isTrafficOn}
            onToast={showToast}
            pickupLocation={{ title: booking.pickup.title }}
            destinationLocation={{ title: booking.destination.title }}
            className="w-full h-full"
            showTransitPill={true}
            showControls={true}
            activeVehiclePosition={currentProgress.position}
            activeVehicleHeading={currentHeading}
            activeRouteCoordinates={activeRoute}
            isApproachingPickup={isApproaching}
            streetName={streetName}
            bottomSheetPadding={230}
          />

          {/* Floating ETA & Distance Pill */}
          <div className="absolute top-3.5 right-3.5 z-[450] pointer-events-auto">
            <div className="bg-primary text-white px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5 border border-white/20">
              <span className="material-symbols-outlined text-[17px]">timer</span>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase leading-none font-bold text-blue-100">
                  {isApproaching ? 'Pickup In' : 'Dest. ETA'}
                </span>
                <span className="text-xs font-black leading-tight">
                  {isAtPickup ? 'At Pickup' : isCompleted ? 'Arrived' : currentStepInfo.badgeEta}
                </span>
              </div>
            </div>
          </div>

          {/* Active Live Location Sharing Pill */}
          {liveTripShare.isSharing && (
            <div className="absolute top-14 left-3.5 z-[450] pointer-events-auto">
              <button
                type="button"
                onClick={() => openModal('shareTrip')}
                className="bg-emerald-950/90 text-emerald-300 px-3 py-1 rounded-full shadow-lg border border-emerald-500/40 flex items-center gap-1.5 backdrop-blur-md active:scale-95 transition-transform"
                title="Manage Live Sharing"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10px] font-bold tracking-tight">
                  Sharing live with {liveTripShare.contacts.filter((c) => c.selected).length} contacts
                </span>
                <span className="material-symbols-outlined text-[13px] text-emerald-400">edit</span>
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Status Notification Banner */}
        <div className="px-margin -mt-3 relative z-30">
          <div
            className={`p-3.5 rounded-2xl shadow-md flex items-center justify-between transition-colors ${
              isAtPickup
                ? 'bg-secondary-container text-on-secondary-container border border-secondary'
                : 'bg-primary-container text-on-primary'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="material-symbols-outlined text-[22px] shrink-0">
                {isAtPickup ? 'pin_drop' : isApproaching ? 'near_me' : isOnTrip ? 'navigation' : 'flag'}
              </span>
              <div className="min-w-0">
                <h4 className="font-headline font-bold text-sm truncate">{currentStepInfo.title}</h4>
                <p className="text-xs opacity-90 truncate">{currentStepInfo.desc}</p>
              </div>
            </div>

            {/* Simulation Controls: Play/Pause & Speed Multiplier */}
            <div className="flex items-center gap-1.5 shrink-0 pl-2">
              <button
                type="button"
                onClick={() => {
                  setSimMultiplier((m) => (m === 1 ? 2 : m === 2 ? 4 : 1));
                  showToast(`Simulation speed: ${simMultiplier === 1 ? '2x' : simMultiplier === 2 ? '4x' : '1x'}`);
                }}
                className="px-2 py-0.5 rounded-md bg-white/20 hover:bg-white/30 text-white text-[10px] font-bold"
                title="Change simulation speed"
              >
                {simMultiplier}x
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsAutoSimulating(!isAutoSimulating);
                  showToast(isAutoSimulating ? 'Simulation paused' : 'Simulating real road travel...');
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                  isAutoSimulating
                    ? 'bg-white text-slate-900 shadow-md'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
              >
                {isAutoSimulating ? 'Pause' : 'Auto-Play'}
              </button>
            </div>
          </div>
        </div>

        {/* Live Trip Command Sheet */}
        <div className="px-margin pt-4 flex flex-col gap-space-md">
          <div className="bg-surface-container-lowest rounded-3xl p-space-md shadow-xl flex flex-col gap-space-md border border-slate-100">
            {/* Driver Profile & Direct Contacts */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-sm min-w-0">
                <div className="relative flex-shrink-0">
                  <img
                    className="w-14 h-14 rounded-full object-cover shadow-sm bg-slate-100 border border-slate-200"
                    src={booking.driver.avatar}
                    alt={booking.driver.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='32' fill='%230042dd'/%3E%3Ctext x='32' y='38' fill='white' font-size='22' font-family='sans-serif' font-weight='bold' text-anchor='middle'%3ERK%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <div className="absolute -bottom-1 -right-1 bg-primary text-on-primary rounded-full w-5 h-5 flex items-center justify-center shadow">
                    <span className="material-symbols-outlined text-[13px]">verified</span>
                  </div>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h2 className="font-headline-md text-headline-md text-on-surface truncate font-bold">
                      {booking.driver.name}
                    </h2>
                    <span className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-[10px] font-bold">
                      PRO
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary fill-1">star</span>
                    <span className="font-numeric-md text-label-md text-on-surface font-bold">{booking.driver.rating}</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">(1,240 rides)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-space-xs flex-shrink-0">
                <a
                  href={`tel:${booking.driver.phone}`}
                  onClick={() => showToast(`Calling driver ${booking.driver.name}...`)}
                  className="w-11 h-11 rounded-full bg-surface-container-low text-primary flex items-center justify-center hover:bg-surface-container-high transition-transform active:scale-95 shadow-sm"
                  title="Call Driver"
                >
                  <span className="material-symbols-outlined text-[20px]">phone</span>
                </a>
                <button
                  type="button"
                  onClick={() => openModal('chat')}
                  className="w-11 h-11 rounded-full bg-primary text-on-primary flex items-center justify-center hover:bg-primary-container transition-transform active:scale-95 shadow-md"
                  title="Message Driver"
                >
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                </button>
              </div>
            </div>

            {/* Vehicle Details & Start-Ride PIN Card */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-container-low border border-slate-100">
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant font-semibold">
                  Vehicle Details
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-numeric-md text-numeric-md text-on-surface tracking-wider font-bold">
                    {booking.driver.plate}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-outline-variant" />
                  <span className="font-body-sm text-body-sm text-on-surface-variant">{booking.vehicleName || 'Auto'}</span>
                </div>
                <span className="font-body-sm text-[11px] text-tertiary">Verified Mysuru Commercial Transit</span>
              </div>

              {/* Start Ride OTP */}
              <div className="flex flex-col items-end pl-2">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">
                  Start OTP
                </span>
                <div className="px-3 py-1 rounded-xl bg-primary text-on-primary shadow-sm flex items-center justify-center mt-0.5">
                  <span className="font-numeric-xl text-numeric-xl tracking-widest text-on-primary font-bold">
                    {booking.startOtp || '5482'}
                  </span>
                </div>
              </div>
            </div>

            {/* 5-Stage Interactive Road Stepper */}
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-outline">Trip Progression</span>
                <span className="text-[11px] text-primary font-semibold">Tap stage to inspect</span>
              </div>
              <div className="flex items-center justify-between text-center relative px-1">
                <div className="absolute left-6 right-6 top-3 h-1 bg-surface-container rounded-full -z-0" />
                <div
                  className="absolute left-6 top-3 h-1 bg-primary rounded-full -z-0 transition-all duration-300"
                  style={{ width: `${stepIndex * 25}%` }}
                />

                {stepConfig.map((s, idx) => {
                  const isPastOrCurrent = idx <= stepIndex;
                  return (
                    <div
                      key={s.label}
                      onClick={() => handleStageSelect(idx)}
                      className="flex flex-col items-center gap-1 z-10 cursor-pointer group"
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-all ${
                          isPastOrCurrent
                            ? 'bg-primary text-on-primary scale-105'
                            : 'bg-surface-container text-on-surface-variant'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          {idx === 0
                            ? 'near_me'
                            : idx === 1
                            ? 'electric_rickshaw'
                            : idx === 2
                            ? 'pin_drop'
                            : idx === 3
                            ? 'navigation'
                            : 'flag'}
                        </span>
                      </div>
                      <span
                        className={`font-label-sm text-[10px] whitespace-nowrap ${
                          isPastOrCurrent ? 'font-bold text-primary' : 'text-on-surface-variant'
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Primary Safety Row: Share Live Trip & Safety Toolkit */}
            <div className="grid grid-cols-2 gap-space-sm pt-2">
              <button
                onClick={() => openModal('shareTrip')}
                className={`h-12 rounded-xl font-label-lg text-label-lg flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98] font-bold ${
                  liveTripShare.isSharing
                    ? 'bg-emerald-500/15 text-emerald-700 border border-emerald-400'
                    : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                }`}
                type="button"
                aria-label="Share Live Trip"
              >
                <span className={`material-symbols-outlined text-[19px] ${
                  liveTripShare.isSharing ? 'text-emerald-600 animate-pulse' : 'text-primary'
                }`}>
                  share_location
                </span>
                <span>{liveTripShare.isSharing ? 'Live Sharing ON' : 'Share Trip'}</span>
              </button>

              <button
                onClick={() => openModal('safety')}
                className="h-12 rounded-xl bg-surface-container-low text-on-surface font-label-lg text-label-lg flex items-center justify-center gap-2 hover:bg-surface-container transition-colors shadow-sm active:scale-[0.98] font-semibold"
                type="button"
                aria-label="Safety Toolkit"
              >
                <span className="material-symbols-outlined text-[19px] text-secondary">security</span>
                <span>Safety Toolkit</span>
              </button>
            </div>

            {/* Complete Trip Action Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => handleStageSelect(4)}
                className="w-full py-2.5 px-3 rounded-xl bg-secondary-container text-on-secondary-container font-label-md text-label-md font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Complete Trip (+{booking.destination.distanceKm || 4.2} km Miles)</span>
              </button>
            </div>

            {/* Cancel Booking Action */}
            <div className="text-center pt-1 border-t border-surface-container-low">
              <button
                onClick={() => setIsCancelModalOpen(true)}
                className="text-error font-label-md text-label-md hover:underline font-semibold"
                type="button"
              >
                Cancel this ride
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* CANCEL BOOKING REASON MODAL */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end">
          <div className="absolute inset-0" onClick={() => setIsCancelModalOpen(false)} />
          <div className="relative w-full bg-surface-container-lowest rounded-t-3xl shadow-2xl p-5 z-10 flex flex-col gap-4 max-w-lg mx-auto">
            <div className="flex items-center justify-between border-b pb-3 border-surface-container-low">
              <div>
                <h3 className="font-headline font-bold text-lg text-on-surface">Cancel Ride?</h3>
                <p className="text-xs text-on-surface-variant">Cancellation fee: ₹0.00 (within free grace period)</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-outline">Select Reason</span>
              {[
                { id: 'taking_too_long', label: 'Driver taking longer than estimated' },
                { id: 'driver_asked', label: 'Driver asked me to cancel' },
                { id: 'changed_mind', label: 'Changed my travel plans' },
                { id: 'wrong_pickup', label: 'Wrong pickup location specified' }
              ].map((r) => (
                <label
                  key={r.id}
                  onClick={() => setCancelReason(r.label)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                    cancelReason === r.label
                      ? 'bg-surface-container-low ring-1 ring-error text-on-surface font-semibold'
                      : 'bg-surface hover:bg-surface-container-low text-on-surface-variant'
                  }`}
                >
                  <span className="text-xs">{r.label}</span>
                  <input
                    type="radio"
                    name="cancel_reason"
                    checked={cancelReason === r.label}
                    onChange={() => setCancelReason(r.label)}
                    className="accent-error"
                  />
                </label>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                className="flex-1 h-12 rounded-xl bg-surface-container text-on-surface font-label-lg font-semibold active:scale-95 transition-transform"
              >
                Keep Ride
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="flex-1 h-12 rounded-xl bg-error text-on-error font-label-lg font-bold shadow-md hover:brightness-105 active:scale-95 transition-transform"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
