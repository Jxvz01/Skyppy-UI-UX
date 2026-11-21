import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { OpenStreetMap } from '../components/OpenStreetMap';
import { useAppStore } from '../store/useAppStore';
import {
  FALLBACK_TRIP_ROUTE,
  getPositionAlongRoute,
  interpolateHeading,
  getRouteTotalDistance
} from '../utils/roadRouting';

export const SharedTripView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const tripId = searchParams.get('id') || 'SKY784392';

  const { activeBooking, liveTripShare } = useAppStore();

  const [traveledDistance, setTraveledDistance] = useState(1200);
  const [currentSpeed, setCurrentSpeed] = useState(28);
  const [lastPingSeconds, setLastPingSeconds] = useState(1);
  const [currentHeading, setCurrentHeading] = useState(45);

  const routeCoords = FALLBACK_TRIP_ROUTE;
  const totalMeters = getRouteTotalDistance(routeCoords);

  const booking = activeBooking || {
    bookingId: tripId,
    fare: 76,
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

  // Simulate gentle vehicle movement along actual road network for recipient
  useEffect(() => {
    const timer = setInterval(() => {
      setTraveledDistance((prev) => {
        if (prev >= totalMeters) return prev;
        const speedKmh = 26 + Math.sin(prev / 80) * 6;
        setCurrentSpeed(Math.round(speedKmh));
        const addedMeters = (speedKmh * 1000) / 3600; // per second
        return Math.min(prev + addedMeters, totalMeters);
      });
    }, 1000);

    const pingTimer = setInterval(() => {
      setLastPingSeconds((s) => (s >= 5 ? 1 : s + 1));
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(pingTimer);
    };
  }, [totalMeters]);

  const progress = getPositionAlongRoute(routeCoords, traveledDistance);

  // Smooth heading interpolation
  useEffect(() => {
    setCurrentHeading((prev) => interpolateHeading(prev, progress.heading, 0.25));
  }, [progress.heading]);

  const remainingMeters = progress.remainingMeters;
  const remainingKm = (remainingMeters / 1000).toFixed(1);
  const remainingMinutes = Math.max(1, Math.round(remainingMeters / ((currentSpeed * 1000) / 60)));

  return (
    <div className="flex-1 flex flex-col relative w-full bg-slate-50 min-h-screen select-none">
      {/* Top Safety Navigation Header */}
      <header className="h-14 bg-slate-900 text-white px-4 flex items-center justify-between shadow-md z-40 sticky top-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-[19px]">verified_user</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-tight text-white">SKYPEE</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold uppercase tracking-wider">
                Safety Monitor
              </span>
            </div>
            <p className="text-[10px] text-slate-300">Live trip shared by passenger</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-xs text-slate-300 hover:text-white flex items-center gap-1 font-semibold"
        >
          <span>App Home</span>
          <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col w-full max-w-lg mx-auto relative pb-8">
        {/* Live OpenStreetMap Canvas */}
        <div className="relative w-full h-[360px] sm:h-[400px] overflow-hidden bg-slate-100 shadow-inner">
          <OpenStreetMap
            mode="shared-tracking"
            speed={currentSpeed}
            driverName={booking.driver?.name || 'Ramesh K.'}
            vehicleCategory={booking.vehicleName || 'Auto'}
            className="w-full h-full"
            pickupLocation={{ title: booking.pickup?.title || 'VVCE Gokulam' }}
            destinationLocation={{ title: booking.destination?.title || 'JSS Medical College' }}
            activeVehiclePosition={progress.position}
            activeVehicleHeading={currentHeading}
            activeRouteCoordinates={routeCoords}
            isApproachingPickup={false}
            streetName="Sayyaji Rao Road"
            showTransitPill={false}
            showControls={true}
            bottomSheetPadding={180}
          />

          {/* Floating Live Telemetry Badge */}
          <div className="absolute top-3 left-3 z-[400] bg-slate-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full shadow-lg border border-slate-700/60 flex items-center gap-2 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-bold text-white tracking-tight">
              LIVE GPS • Updated {lastPingSeconds}s ago
            </span>
          </div>

          {/* Floating ETA Pill */}
          <div className="absolute top-3 right-3 z-[400] bg-primary text-on-primary px-3 py-1.5 rounded-full shadow-lg border border-white/20 flex items-center gap-1.5 pointer-events-none">
            <span className="material-symbols-outlined text-[16px]">schedule</span>
            <span className="text-xs font-black">
              {progress.isArrived ? 'Arrived' : `ETA ~${remainingMinutes} min`}
            </span>
          </div>
        </div>

        {/* Live Trip Safety Dossier Sheet */}
        <div className="px-4 -mt-4 relative z-20 flex flex-col gap-3">
          {/* Trip Status Card */}
          <div className="bg-white rounded-3xl p-4 shadow-xl border border-slate-100 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 block">
                  Trip In Progress
                </span>
                <h2 className="text-base font-bold text-slate-900">
                  {progress.isArrived ? 'Vehicle Arrived at Destination' : `En Route to ${booking.destination?.title?.split(',')[0]}`}
                </h2>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-500 block">Remaining</span>
                <span className="text-sm font-extrabold text-slate-900 font-mono">
                  {progress.isArrived ? '0 km' : `${remainingKm} km`}
                </span>
              </div>
            </div>

            {/* Driver & Vehicle Verified Card */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={booking.driver?.avatar}
                  alt={booking.driver?.name}
                  className="w-12 h-12 rounded-full object-cover bg-slate-200 border border-slate-300"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='32' fill='%230042dd'/%3E%3Ctext x='32' y='38' fill='white' font-size='22' font-family='sans-serif' font-weight='bold' text-anchor='middle'%3ERK%3C/text%3E%3C/svg%3E";
                  }}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-slate-900 truncate">{booking.driver?.name}</h3>
                    <span className="px-1.5 py-0.2 rounded bg-blue-100 text-[#0042dd] text-[10px] font-bold">
                      VERIFIED
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                    <span className="material-symbols-outlined text-[14px] text-amber-500 fill-1">star</span>
                    <span className="font-bold text-slate-700">{booking.driver?.rating}</span>
                    <span>•</span>
                    <span className="font-mono font-bold text-slate-900">{booking.driver?.plate}</span>
                  </div>
                  <span className="text-[11px] text-slate-500">{booking.vehicleName}</span>
                </div>
              </div>

              <a
                href={`tel:${booking.driver?.phone}`}
                className="w-10 h-10 rounded-full bg-blue-50 text-[#0042dd] flex items-center justify-center hover:bg-blue-100 transition-colors shadow-xs"
                title="Call Driver"
              >
                <span className="material-symbols-outlined text-[19px]">call</span>
              </a>
            </div>

            {/* Route Waypoints */}
            <div className="flex flex-col gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100">
              {/* Pickup */}
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">Pickup</span>
                  <span className="text-xs font-bold text-slate-900 block truncate">{booking.pickup?.title}</span>
                </div>
              </div>

              <div className="ml-2.5 w-0.5 h-3 bg-slate-300" />

              {/* Destination */}
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-[#0042dd] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[13px]">flag</span>
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">Destination</span>
                  <span className="text-xs font-bold text-slate-900 block truncate">{booking.destination?.title}</span>
                </div>
              </div>
            </div>

            {/* Recipient Emergency Safety Actions */}
            <div className="pt-2 flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Safety Assistance Tools
              </span>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="tel:112"
                  className="h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">e911_emergency</span>
                  <span>Call 112 Police</span>
                </a>
                <a
                  href={`https://wa.me/?text=Checking%20in%20on%20your%20Skyppy%20trip%20${tripId}%20to%20${encodeURIComponent(booking.destination?.title || 'destination')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  <span>Message Rider</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
