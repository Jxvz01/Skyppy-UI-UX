import React from 'react';
import { useDriverStore } from '../../store/useDriverStore';
import { DriverMap } from '../../components/driver/DriverMap';
import { ArrivedPickupCard } from '../../components/driver/ArrivedPickupCard';
import { ActiveTripDrawer } from '../../components/driver/ActiveTripDrawer';

export const DriverHome: React.FC = () => {
  const {
    driverStatus,
    goOnline,
    goOffline,
    profile,
    activeRequest,
    arriveAtPickup,
    setOtpModalOpen,
    setContactPassengerModalOpen,
    setSafetyModalOpen,
    simulateIncomingRequest,
    setDemoModalOpen
  } = useDriverStore();

  const isOffline = driverStatus === 'OFFLINE';
  const isIdleOnline = driverStatus === 'ONLINE';
  const isNavigatingToPickup = driverStatus === 'NAVIGATING_TO_PICKUP' || driverStatus === 'REQUEST_ACCEPTED';
  const isArrived = driverStatus === 'ARRIVED_AT_PICKUP' || driverStatus === 'WAITING_FOR_PASSENGER';
  const isTripInProgress = driverStatus === 'TRIP_STARTED' || driverStatus === 'NAVIGATING_TO_DESTINATION';

  const demandHotspots = [
    { name: 'VVCE Campus & Gokulam', demand: 'High', surge: '1.2x', distance: '0.4 km', time: 'Peak Morning' },
    { name: 'Mysuru City Railway Station', demand: 'Very High', surge: '1.3x', distance: '5.4 km', time: 'Train Arrival' },
    { name: 'Mysuru Palace (Amba Vilas)', demand: 'High', surge: '1.1x', distance: '6.2 km', time: 'Tourist Rush' },
    { name: 'Hebbal Electronic City', demand: 'Normal', surge: '1.0x', distance: '8.1 km', time: 'Office Shifts' }
  ];

  return (
    <div className="relative flex-1 w-full h-full flex flex-col bg-surface overflow-hidden">
      {/* 1. OFFLINE VIEW */}
      {isOffline && (
        <div className="flex-1 w-full overflow-y-auto px-4 py-5 space-y-4">
          {/* Offline Hero Card */}
          <div className="bg-surface-container-low rounded-3xl p-5 border border-outline-variant/30 text-center relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-surface-container-highest flex items-center justify-center mx-auto mb-3 text-on-surface-variant">
              <span className="material-symbols-outlined text-3xl">bedtime</span>
            </div>
            <h2 className="text-xl font-bold text-on-surface tracking-tight">You are Offline</h2>
            <p className="text-xs text-on-surface-variant mt-1 max-w-xs mx-auto">
              Go online to start receiving ride requests in Mysuru. Current demand is high in Gokulam.
            </p>

            {/* Big Go Online CTA */}
            <button
              onClick={goOnline}
              className="mt-5 w-full py-4 bg-primary hover:bg-primary/95 text-on-primary font-bold text-sm rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              Go Online Now
            </button>
          </div>

          {/* Today's Shift Telemetry */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-surface-container-lowest p-3.5 rounded-2xl border border-outline-variant/20">
              <span className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider block">Today</span>
              <span className="text-base font-bold text-on-surface font-mono mt-0.5 block">
                ₹{profile.todayEarnings}
              </span>
            </div>
            <div className="bg-surface-container-lowest p-3.5 rounded-2xl border border-outline-variant/20">
              <span className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider block">Trips</span>
              <span className="text-base font-bold text-on-surface font-mono mt-0.5 block">
                {profile.todayTrips}
              </span>
            </div>
            <div className="bg-surface-container-lowest p-3.5 rounded-2xl border border-outline-variant/20">
              <span className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider block">Online Time</span>
              <span className="text-base font-bold text-on-surface font-mono mt-0.5 block">
                {Math.floor(profile.todayOnlineMinutes / 60)}h {profile.todayOnlineMinutes % 60}m
              </span>
            </div>
          </div>

          {/* Active Assigned Vehicle */}
          <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[22px]">local_taxi</span>
              </div>
              <div>
                <span className="text-[10px] text-primary font-bold uppercase tracking-wider">Active Cab</span>
                <h4 className="text-xs font-bold text-on-surface">{profile.activeVehicle.model}</h4>
                <p className="text-[11px] font-mono text-on-surface-variant">{profile.activeVehicle.registrationNumber}</p>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-600 px-2.5 py-1 rounded-full border border-emerald-500/20">
              Verified
            </span>
          </div>

          {/* Mysuru Live Demand Zones */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Mysuru Demand Hotspots
              </span>
              <span className="text-[11px] text-primary font-semibold">Live radar</span>
            </div>

            <div className="space-y-2">
              {demandHotspots.map((zone, idx) => (
                <div
                  key={idx}
                  className="bg-surface-container-lowest p-3 rounded-2xl border border-outline-variant/20 flex items-center justify-between"
                >
                  <div>
                    <h5 className="text-xs font-bold text-on-surface">{zone.name}</h5>
                    <p className="text-[10px] text-on-surface-variant mt-0.5">
                      {zone.distance} away • {zone.time}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        zone.demand === 'Very High'
                          ? 'bg-rose-500/15 text-rose-600 border border-rose-500/30'
                          : zone.demand === 'High'
                          ? 'bg-amber-500/15 text-amber-600 border border-amber-500/30'
                          : 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30'
                      }`}
                    >
                      {zone.surge} Surge
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. ONLINE IDLE VIEW */}
      {isIdleOnline && (
        <div className="relative flex-1 w-full h-full flex flex-col">
          {/* Leaflet Map with Radar Pulse */}
          <div className="relative flex-1 w-full">
            <DriverMap />

            {/* Top Radar Search Pill */}
            <div className="absolute top-3 left-3 right-3 z-20 flex flex-col items-center pointer-events-none">
              <div className="bg-surface/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-outline-variant/30 flex items-center gap-2.5 pointer-events-auto">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-xs font-semibold text-on-surface tracking-tight">
                  Searching trips near Gokulam...
                </span>
              </div>
            </div>

            {/* Floating Simulator Button for Competition Judges */}
            <div className="absolute bottom-28 left-4 right-4 z-20 flex justify-center">
              <button
                onClick={() => simulateIncomingRequest()}
                className="px-4 py-2.5 bg-primary/95 backdrop-blur-md text-on-primary hover:bg-primary font-bold text-xs rounded-2xl shadow-xl border border-white/20 flex items-center gap-2 transition-transform active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">electric_bolt</span>
                Trigger Demo Ride Request
              </button>
            </div>
          </div>

          {/* Bottom Telemetry Drawer */}
          <div className="bg-surface/95 backdrop-blur-md border-t border-outline-variant/30 p-4 shrink-0 shadow-lg z-20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-on-surface">Online & Ready</span>
              </div>
              <button
                onClick={goOffline}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1 rounded-full transition-colors"
              >
                Go Offline
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-surface-container p-2.5 rounded-xl text-center">
                <span className="text-[10px] text-on-surface-variant font-medium uppercase">Today</span>
                <div className="text-xs font-bold text-on-surface font-mono mt-0.5">₹{profile.todayEarnings}</div>
              </div>
              <div className="bg-surface-container p-2.5 rounded-xl text-center">
                <span className="text-[10px] text-on-surface-variant font-medium uppercase">Completed</span>
                <div className="text-xs font-bold text-on-surface font-mono mt-0.5">{profile.todayTrips} trips</div>
              </div>
              <div className="bg-surface-container p-2.5 rounded-xl text-center">
                <span className="text-[10px] text-on-surface-variant font-medium uppercase">Acceptance</span>
                <div className="text-xs font-bold text-emerald-600 font-mono mt-0.5">{profile.acceptanceRatePct}%</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. NAVIGATING TO PICKUP */}
      {isNavigatingToPickup && activeRequest && (
        <div className="relative flex-1 w-full h-full flex flex-col">
          <div className="relative flex-1 w-full">
            <DriverMap />

            {/* Top Navigation Step Banner */}
            <div className="absolute top-3 left-3 right-3 z-20">
              <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl flex items-center gap-3 border border-white/10">
                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-white text-[20px]">turn_left</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-slate-300 font-medium uppercase tracking-wider block">In 200m</span>
                  <p className="text-xs font-bold truncate">Turn left towards VVCE Gate 2, Gokulam</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-emerald-400">{activeRequest.pickupEtaMin} min</span>
                  <span className="text-[10px] text-slate-400 block">{activeRequest.pickupDistanceKm} km</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pickup Action Sheet */}
          <div className="bg-surface border-t border-outline-variant/30 p-4 shrink-0 shadow-2xl z-20 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Picking Up</span>
                <h4 className="text-sm font-bold text-on-surface">{activeRequest.passengerName}</h4>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setContactPassengerModalOpen(true)}
                  className="w-9 h-9 rounded-xl bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-primary border border-outline-variant/30"
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                </button>
                <button
                  onClick={() => setContactPassengerModalOpen(true)}
                  className="w-9 h-9 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 flex items-center justify-center text-emerald-600 border border-emerald-500/20"
                >
                  <span className="material-symbols-outlined text-[18px]">call</span>
                </button>
              </div>
            </div>

            <div className="bg-surface-container-low p-2.5 rounded-xl border border-outline-variant/20 flex items-start gap-2">
              <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">location_on</span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-on-surface truncate">{activeRequest.pickup.title}</p>
                <p className="text-[11px] text-on-surface-variant truncate">{activeRequest.pickup.address}</p>
              </div>
            </div>

            <button
              onClick={arriveAtPickup}
              className="w-full py-3.5 bg-primary hover:bg-primary/95 text-on-primary font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[18px]">where_to_vote</span>
              I Have Arrived at Pickup
            </button>
          </div>
        </div>
      )}

      {/* 4. ARRIVED AT PICKUP (Waiting & OTP verification) */}
      {isArrived && (
        <div className="relative flex-1 w-full h-full flex flex-col">
          <div className="relative flex-1 w-full">
            <DriverMap />
          </div>
          <div className="p-3 bg-surface border-t border-outline-variant/30 z-20 shrink-0">
            <ArrivedPickupCard />
          </div>
        </div>
      )}

      {/* 5. TRIP IN PROGRESS / NAVIGATING TO DESTINATION */}
      {isTripInProgress && (
        <div className="relative flex-1 w-full h-full flex flex-col">
          <div className="relative flex-1 w-full">
            <DriverMap />

            {/* Top Navigation Banner to Dropoff */}
            <div className="absolute top-3 left-3 right-3 z-20">
              <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl flex items-center gap-3 border border-white/10">
                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-white text-[20px]">straight</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-slate-300 font-medium uppercase tracking-wider block">In 600m</span>
                  <p className="text-xs font-bold truncate">Continue onto Sayyaji Rao Rd toward Station</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {activeRequest?.tripDurationMin || 14} min
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {activeRequest?.tripDistanceKm || 5.4} km
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Trip Drawer */}
          <div className="p-3 bg-surface border-t border-outline-variant/30 z-20 shrink-0">
            <ActiveTripDrawer />
          </div>
        </div>
      )}
    </div>
  );
};
