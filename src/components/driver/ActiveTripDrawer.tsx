import React, { useState } from 'react';
import { useDriverStore } from '../../store/useDriverStore';

export const ActiveTripDrawer: React.FC = () => {
  const {
    activeRequest,
    completeTrip,
    setSafetyModalOpen,
    setContactPassengerModalOpen
  } = useDriverStore();

  const [expanded, setExpanded] = useState(false);

  if (!activeRequest) return null;

  return (
    <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 sm:p-5 rounded-t-[28px] shadow-2xl flex flex-col gap-3.5 z-30 select-none">
      {/* Drawer drag indicator */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-center pb-1 -mt-1"
        aria-label="Expand trip details"
      >
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full" />
      </button>

      {/* Main Row: Destination, Remaining KM & ETA */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">location_on</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Dropping off
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                Trip In Progress
              </span>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {activeRequest.destination.title}
            </span>
          </div>
        </div>

        {/* ETA & Fare */}
        <div className="flex flex-col items-end shrink-0 pl-2">
          <span className="text-lg font-black text-slate-900 dark:text-white">
            ₹{activeRequest.estimatedEarnings}
          </span>
          <span className="text-xs text-emerald-600 font-bold">
            ~12 min remaining
          </span>
        </div>
      </div>

      {/* Expanded Passenger Details & Trip Telemetry */}
      {expanded && (
        <div className="flex flex-col gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 animate-in fade-in duration-150">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                {activeRequest.passengerName.charAt(0)}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  {activeRequest.passengerName}
                </span>
                <span className="text-[11px] text-slate-400">
                  Payment: {activeRequest.paymentMethod} (Prepaid)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setContactPassengerModalOpen(true)}
                className="w-8 h-8 rounded-full bg-blue-50 text-primary flex items-center justify-center hover:bg-blue-100 active:scale-95"
                title="Call Passenger"
              >
                <span className="material-symbols-outlined text-[17px]">call</span>
              </button>
              <button
                type="button"
                onClick={() => setSafetyModalOpen(true)}
                className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-100 active:scale-95"
                title="Safety Center"
              >
                <span className="material-symbols-outlined text-[17px]">shield</span>
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-500 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
            <span>Pickup: {activeRequest.pickup.title} • Trip Distance: {activeRequest.tripDistanceKm} km</span>
          </div>
        </div>
      )}

      {/* Primary Complete Trip Action */}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => setSafetyModalOpen(true)}
          className="w-12 h-12 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/70 dark:bg-rose-950/30 text-rose-600 flex items-center justify-center hover:bg-rose-100 active:scale-95 transition-colors shrink-0"
          title="Safety Toolkit"
        >
          <span className="material-symbols-outlined text-[22px]">shield</span>
        </button>

        <button
          type="button"
          onClick={completeTrip}
          className="flex-1 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 active:scale-98 transition-all"
        >
          <span className="material-symbols-outlined text-[22px]">flag</span>
          <span>Complete Trip</span>
        </button>
      </div>
    </div>
  );
};
