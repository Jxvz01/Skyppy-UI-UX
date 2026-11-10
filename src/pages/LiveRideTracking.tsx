import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { OpenStreetMap } from '../components/OpenStreetMap';
import { useAppStore } from '../store/useAppStore';
import { translations } from '../utils/i18n';

export const LiveRideTracking: React.FC = () => {
  const navigate = useNavigate();
  const { activeBooking, cancelBooking, openModal, showToast, language } = useAppStore();
  const t = translations[language] || translations.en;

  const [stepIndex, setStepIndex] = useState(0); // 0: Assigned, 1: Approaching, 2: Arrived at Pickup, 3: On Ride, 4: Arrived
  const [speed, setSpeed] = useState(24);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Driver taking too long');
  const [isTrafficOn, setIsTrafficOn] = useState(true);
  const [isAutoSimulating, setIsAutoSimulating] = useState(false);
  const [markerOffset, setMarkerOffset] = useState({ x: 0, y: 0 });

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
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFC_47gt-3lPsOkq5tq9A1wWjAanAGLT6QZO8F3aTw1LfNOksrrxtXPF71CGQ_FJ7pd2LCtqBQDSpXdXwOpey0sE6qNx6fucroCvNH0h6iro5jb2ysLyvNzFo1738hYjEHq4Swjk-8vLvooNWxWoVptliHy445jMIRy5KQxPdsJiOuxf15CvmmGzGTG3p2hxjjR4GDmV5Xy9khm4tVw1cxiuqqOxQX-FwykOSgEZM'
    },
    pickup: { title: 'VVCE Gokulam', address: 'Mysuru, Karnataka' },
    destination: { title: 'JSS Medical College', address: 'Bannimantap, Mysuru', distanceKm: 4.2 }
  };

  const [zoomLevel, setZoomLevel] = useState(1);

  // Vehicle category resolution
  const vehicleCatId = (activeBooking?.vehicleId || 'auto').toLowerCase();
  const getVehicleIcon = () => {
    if (vehicleCatId === 'auto') return 'electric_rickshaw';
    if (vehicleCatId === 'suv') return 'airport_shuttle';
    return 'directions_car';
  };

  // Step-dependent telemetry with Mysuru street coordinates and road heading
  const stepConfig = [
    { label: 'Assigned', eta: 4, speed: 22, title: 'Driver Assigned', desc: 'Ramesh K. is heading to your pickup location', x: 120, y: 290, heading: 245, street: 'Kalidasa Rd' },
    { label: 'Approaching', eta: 2, speed: 28, title: 'Driver Approaching', desc: 'Auto KA-09 AB 4217 is 500m away', x: 95, y: 300, heading: 245, street: 'Temple Rd, Gokulam' },
    { label: 'At Pickup', eta: 0, speed: 0, title: 'Driver Arrived', desc: 'Driver is outside VVCE Gate 2! Share Start OTP', x: 75, y: 310, heading: 35, street: 'VVCE Campus Gate 2' },
    { label: 'On Ride', eta: 8, speed: 34, title: 'Trip In Progress', desc: 'En route to JSS Medical College', x: 205, y: 215, heading: 45, street: 'Sayyaji Rao Rd' },
    { label: 'Completed', eta: 0, speed: 0, title: 'Trip Finished', desc: 'Arrived safely at destination', x: 308, y: 95, heading: 40, street: 'JSS Hospital Bannimantap' }
  ];

  const currentStep = stepConfig[stepIndex] || stepConfig[0];

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.15, 1.45));
    showToast('Map zoomed in');
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.15, 0.85));
    showToast('Map zoomed out');
  };

  const handleRecenter = () => {
    setZoomLevel(1);
    showToast(`Map centered on ${booking.driver.name} (${currentStep.street})`);
  };

  // Auto-simulation timer
  useEffect(() => {
    if (!isAutoSimulating) return;
    const timer = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < 4) {
          return prev + 1;
        } else {
          setIsAutoSimulating(false);
          openModal('tripCompleted');
          return prev;
        }
      });
    }, 4500);
    return () => clearInterval(timer);
  }, [isAutoSimulating, openModal]);

  // If user reaches step 4 manually, trigger trip completion
  useEffect(() => {
    if (stepIndex === 4) {
      const t = setTimeout(() => {
        openModal('tripCompleted');
      }, 600);
      return () => clearTimeout(t);
    }
  }, [stepIndex, openModal]);

  // Marker road jitter
  useEffect(() => {
    const offsets = [
      { x: 0, y: 0 },
      { x: 4, y: -3 },
      { x: -2, y: 5 },
      { x: 2, y: -2 }
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % offsets.length;
      setMarkerOffset(offsets[i]);
      if (currentStep.speed > 0) {
        setSpeed(Math.floor(currentStep.speed + (Math.random() * 6 - 3)));
      } else {
        setSpeed(0);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [currentStep.speed]);

  const handleConfirmCancel = () => {
    cancelBooking(cancelReason);
    setIsCancelModalOpen(false);
    navigate('/activity');
  };

  return (
    <div className="flex-1 flex flex-col relative w-full bg-surface min-h-full">
      <Header type="stack" title={t.trackingHeader} backTo="/" />

      <main className="flex flex-col w-full relative pb-8">
        {/* High-Fidelity Mobility Map Canvas (OpenStreetMap Tiles) */}
        <div className="relative w-full h-[390px] overflow-hidden rounded-b-3xl bg-[#f4f6fa] shadow-md border-b border-slate-200/60 select-none">
          <OpenStreetMap
            mode="live-tracking"
            stepIndex={stepIndex}
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
          />
          {/* Floating Arrival Countdown Pill */}
          <div className="absolute top-3.5 right-3.5 z-[450] pointer-events-auto">
            <div className="bg-primary text-white px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5 border border-white/20">
              <span className="material-symbols-outlined text-[17px]">timer</span>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase leading-none font-bold text-blue-100">
                  {stepIndex >= 3 ? 'Dest. ETA' : 'Arriving in'}
                </span>
                <span className="text-xs font-black leading-tight">
                  {currentStep.eta > 0 ? `${currentStep.eta} min` : 'Arrived'}
                </span>
              </div>
            </div>
          </div>

          {/* Toggle Live Traffic Button */}
          <button
            type="button"
            aria-label="Toggle Traffic"
            onClick={() => {
              setIsTrafficOn(!isTrafficOn);
              showToast(isTrafficOn ? 'Traffic layer disabled' : 'Live traffic flow layer enabled');
            }}
            className={`absolute top-14 right-3.5 z-[450] px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md shadow-md border border-slate-200/80 flex items-center gap-1 text-[10px] font-bold ${
              isTrafficOn ? 'text-primary' : 'text-slate-500'
            } hover:bg-slate-50 transition-all active:scale-95 cursor-pointer pointer-events-auto`}
            title="Toggle Live Traffic Layer"
          >
            <span className="material-symbols-outlined text-[14px]">traffic</span>
            <span>{isTrafficOn ? 'Traffic ON' : 'Traffic OFF'}</span>
          </button>
        </div>

        {/* Dynamic Status Notification Banner */}
        <div className="px-margin -mt-3 relative z-30">
          <div
            className={`p-3.5 rounded-2xl shadow-md flex items-center justify-between transition-colors ${
              stepIndex === 2
                ? 'bg-secondary-container text-on-secondary-container border border-secondary'
                : 'bg-primary-container text-on-primary'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="material-symbols-outlined text-[22px] shrink-0">
                {stepIndex === 2 ? 'waving_hand' : 'near_me'}
              </span>
              <div className="min-w-0">
                <h4 className="font-headline font-bold text-sm truncate">{currentStep.title}</h4>
                <p className="text-xs opacity-90 truncate">{currentStep.desc}</p>
              </div>
            </div>

            {/* Auto-Simulation Trigger Toggle */}
            <button
              type="button"
              onClick={() => {
                setIsAutoSimulating(!isAutoSimulating);
                showToast(isAutoSimulating ? 'Simulation paused' : 'Auto-advancing ride demo...');
              }}
              className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 transition-all ${
                isAutoSimulating
                  ? 'bg-white text-black shadow-md'
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
            >
              {isAutoSimulating ? 'Pause' : 'Auto-Play'}
            </button>
          </div>
        </div>

        {/* Live Trip Command Sheet */}
        <div className="px-margin pt-4 flex flex-col gap-space-md">
          <div className="bg-surface-container-lowest rounded-3xl p-space-md shadow-xl flex flex-col gap-space-md">
            {/* Driver Profile & Direct Contacts */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-sm min-w-0">
                <div className="relative flex-shrink-0">
                  <img
                    className="w-14 h-14 rounded-full object-cover shadow-sm bg-slate-100"
                    src={booking.driver.avatar}
                    alt={booking.driver.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='32' fill='%232563eb'/%3E%3Ctext x='32' y='38' fill='white' font-size='22' font-family='sans-serif' font-weight='bold' text-anchor='middle'%3E" + (booking.driver.name.slice(0, 2).toUpperCase()) + "%3C/text%3E%3C/svg%3E";
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
                >
                  <span className="material-symbols-outlined text-[20px]">phone</span>
                </a>
                <button
                  type="button"
                  onClick={() => openModal('chat')}
                  className="w-11 h-11 rounded-full bg-primary text-on-primary flex items-center justify-center hover:bg-primary-container transition-transform active:scale-95 shadow-md"
                >
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                </button>
              </div>
            </div>

            {/* Vehicle Details & Start-Ride PIN Card */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-container-low">
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant font-semibold">
                  Vehicle Details
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-numeric-md text-numeric-md text-on-surface tracking-wider font-bold">
                    {booking.driver.plate}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
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

            {/* 5-Stage Interactive Linear Simulation Stepper */}
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-outline">Simulated Progression</span>
                <span className="text-[11px] text-primary font-semibold">Tap stage to preview</span>
              </div>
              <div className="flex items-center justify-between text-center relative px-1">
                <div className="absolute left-6 right-6 top-3 h-1 bg-surface-container rounded-full -z-0"></div>
                <div
                  className="absolute left-6 top-3 h-1 bg-primary rounded-full -z-0 transition-all duration-500"
                  style={{ width: `${stepIndex * 25}%` }}
                ></div>

                {stepConfig.map((s, idx) => {
                  const isPastOrCurrent = idx <= stepIndex;
                  return (
                    <div
                      key={s.label}
                      onClick={() => setStepIndex(idx)}
                      className="flex flex-col items-center gap-1 z-10 cursor-pointer group"
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-all ${
                          isPastOrCurrent ? 'bg-primary text-on-primary scale-105' : 'bg-surface-container text-on-surface-variant'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          {idx === 0 ? 'near_me' : idx === 1 ? 'electric_rickshaw' : idx === 2 ? 'pin_drop' : idx === 3 ? 'navigation' : 'flag'}
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

            {/* Action Row: Share Ride & Safety Toolkit */}
            <div className="grid grid-cols-2 gap-space-sm pt-2">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(`https://skyppy.app/track/${booking.bookingId}`);
                  showToast('Live tracking link copied to clipboard!');
                }}
                className="h-12 rounded-xl bg-surface-container-low text-on-surface font-label-lg text-label-lg flex items-center justify-center gap-2 hover:bg-surface-container transition-colors shadow-sm active:scale-[0.98] font-semibold"
                type="button"
              >
                <span className="material-symbols-outlined text-[19px] text-primary">share_location</span>
                <span>Share Trip</span>
              </button>
              <button
                onClick={() => openModal('safety')}
                className="h-12 rounded-xl bg-surface-container-low text-on-surface font-label-lg text-label-lg flex items-center justify-center gap-2 hover:bg-surface-container transition-colors shadow-sm active:scale-[0.98] font-semibold"
                type="button"
              >
                <span className="material-symbols-outlined text-[19px] text-secondary">security</span>
                <span>Safety Toolkit</span>
              </button>
            </div>

            {/* Finish Simulation Trigger Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setStepIndex(4)}
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
          <div className="absolute inset-0" onClick={() => setIsCancelModalOpen(false)}></div>
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
