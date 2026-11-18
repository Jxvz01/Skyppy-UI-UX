import React, { useState } from 'react';
import { useDriverStore } from '../../store/useDriverStore';

export const TripCompletedModal: React.FC = () => {
  const {
    tripCompletedModalOpen,
    setTripCompletedModalOpen,
    activeRequest,
    confirmCompletedTrip
  } = useDriverStore();

  const [rating, setRating] = useState(5);
  const [rated, setRated] = useState(false);

  if (!tripCompletedModalOpen || !activeRequest) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        {/* Success Icon & Title */}
        <div className="flex flex-col items-center text-center gap-1.5 pt-2">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1 shadow-inner">
            <span className="material-symbols-outlined text-[32px]">check_circle</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Trip Completed!
          </h2>
          <p className="text-xs text-slate-400">
            {activeRequest.pickup.title} → {activeRequest.destination.title}
          </p>
        </div>

        {/* Large Net Earnings Card */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white rounded-2xl p-4 text-center shadow-lg">
          <span className="text-[11px] font-bold text-emerald-100 uppercase tracking-widest block">
            Net Earnings Credited
          </span>
          <span className="text-3xl font-black tracking-tight my-0.5 block">
            ₹{activeRequest.estimatedEarnings}
          </span>
          <span className="text-[11px] text-emerald-100 font-medium">
            Paid via {activeRequest.paymentMethod} • Settled to Skyppy Wallet
          </span>
        </div>

        {/* Financial Itemized Breakdown */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex flex-col gap-2 text-xs">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
            <span>Gross Passenger Fare</span>
            <span className="font-semibold text-slate-900 dark:text-white">₹{activeRequest.grossFare}</span>
          </div>
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
            <span>Skyppy Platform Access Fee (Demo)</span>
            <span className="font-semibold text-rose-500">-₹{activeRequest.platformFee}</span>
          </div>
          <div className="h-px bg-slate-200 dark:bg-slate-700 my-0.5" />
          <div className="flex items-center justify-between font-bold text-sm text-slate-900 dark:text-white">
            <span>Driver Take-Home Payout</span>
            <span className="text-emerald-600 font-black">₹{activeRequest.estimatedEarnings}</span>
          </div>
        </div>

        {/* Trip Telemetry Summary */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-[10px] text-slate-400 block font-medium">Distance</span>
            <span className="font-bold text-slate-900 dark:text-white">{activeRequest.tripDistanceKm} km</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-[10px] text-slate-400 block font-medium">Duration</span>
            <span className="font-bold text-slate-900 dark:text-white">{activeRequest.tripDurationMin} min</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-[10px] text-slate-400 block font-medium">Vehicle</span>
            <span className="font-bold text-slate-900 dark:text-white capitalize">{activeRequest.vehicleCategory}</span>
          </div>
        </div>

        {/* Rate Passenger Interaction */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col items-center gap-1.5">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Rate passenger ({activeRequest.passengerName})
          </span>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => {
                  setRating(star);
                  setRated(true);
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-amber-400 hover:scale-110 active:scale-95 transition-transform"
              >
                <span
                  className="material-symbols-outlined text-[24px]"
                  style={{ fontVariationSettings: star <= rating ? "'FILL' 1" : "'FILL' 0" }}
                >
                  star
                </span>
              </button>
            ))}
          </div>
          {rated && (
            <span className="text-[10px] text-emerald-600 font-semibold">Thank you for rating!</span>
          )}
        </div>

        {/* Done / Return Action */}
        <button
          type="button"
          onClick={confirmCompletedTrip}
          className="w-full py-3.5 px-4 rounded-xl bg-primary text-white font-extrabold text-sm shadow-md hover:bg-primary/90 flex items-center justify-center gap-2 active:scale-98 transition-all"
        >
          <span>Confirm &amp; Return to Online</span>
          <span className="material-symbols-outlined text-[19px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
