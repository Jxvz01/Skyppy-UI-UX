import React, { useEffect, useState } from 'react';
import { useDriverStore } from '../../store/useDriverStore';

export const IncomingRequestModal: React.FC = () => {
  const { activeRequest, acceptRide, declineRide, driverStatus } = useDriverStore();
  const [timeLeft, setTimeLeft] = useState(25);

  useEffect(() => {
    if (driverStatus !== 'REQUEST_RECEIVED') return;

    setTimeLeft(25);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          declineRide(); // Auto-expire if unanswered
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [driverStatus, declineRide]);

  if (driverStatus !== 'REQUEST_RECEIVED' || !activeRequest) {
    return null;
  }

  const progressPct = (timeLeft / 25) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-[32px] sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Animated Timeout Progress Bar */}
        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800">
          <div
            className={`h-full transition-all duration-1000 ${
              timeLeft <= 8 ? 'bg-rose-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="p-5 flex flex-col gap-4 overflow-y-auto">
          {/* Top Title Banner */}
          <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                New Ride Request
              </span>
            </div>
            <span className="text-[10px] font-bold text-primary font-mono">{activeRequest.id}</span>
          </div>

          {/* Header Row: Vehicle Category & Expiry Countdown */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-blue-50 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">directions_car</span>
              </span>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  {activeRequest.rideType}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  Payment: {activeRequest.paymentMethod} (Prepaid)
                </span>
              </div>
            </div>

            {/* Countdown Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs">
              <span className="material-symbols-outlined text-[15px] animate-spin">timer</span>
              <span>{timeLeft}s</span>
            </div>
          </div>

          {/* Large Estimated Earnings Banner */}
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/30 dark:to-blue-950/30 p-3.5 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/40 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                Estimated Net Earnings
              </span>
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                ₹{activeRequest.estimatedEarnings}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                Gross Fare: ₹{activeRequest.grossFare}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                Platform Fee: -₹{activeRequest.platformFee}
              </span>
            </div>
          </div>

          {/* Passenger Info & Notes */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 shrink-0">
                {activeRequest.passengerName.charAt(0)}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {activeRequest.passengerName}
                </span>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <span className="material-symbols-outlined text-[14px] text-amber-500">star</span>
                  <span className="font-semibold">{activeRequest.passengerRating}</span>
                  <span>• Regular Rider</span>
                </div>
              </div>
            </div>
          </div>

          {activeRequest.passengerNotes && (
            <div className="text-xs p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 border border-amber-200/50 flex items-start gap-2">
              <span className="material-symbols-outlined text-[16px] text-amber-600 shrink-0 mt-0.5">info</span>
              <span>Passenger note: "{activeRequest.passengerNotes}"</span>
            </div>
          )}

          {/* Route Overview: Pickup & Drop */}
          <div className="flex flex-col gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            {/* Pickup */}
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-emerald-600" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Pickup • {activeRequest.pickupDistanceKm} km ({activeRequest.pickupEtaMin} min away)
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {activeRequest.pickup.title}
                </span>
                <span className="text-[11px] text-slate-500 truncate">
                  {activeRequest.pickup.address}
                </span>
              </div>
            </div>

            {/* Connecting Line */}
            <div className="ml-3 w-0.5 h-3 bg-slate-200 dark:bg-slate-700" />

            {/* Destination */}
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[14px]">location_on</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Dropoff • {activeRequest.tripDistanceKm} km (~{activeRequest.tripDurationMin} min)
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {activeRequest.destination.title}
                </span>
                <span className="text-[11px] text-slate-500 truncate">
                  {activeRequest.destination.address}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Decline & Accept */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={declineRide}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors active:scale-98"
            >
              Decline
            </button>
            <button
              type="button"
              onClick={acceptRide}
              className="flex-[2] py-3 px-4 rounded-xl bg-primary text-white font-extrabold text-sm shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <span>Accept Ride</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
