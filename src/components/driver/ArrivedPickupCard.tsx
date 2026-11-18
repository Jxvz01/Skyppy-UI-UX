import React, { useEffect } from 'react';
import { useDriverStore } from '../../store/useDriverStore';

export const ArrivedPickupCard: React.FC = () => {
  const {
    activeRequest,
    waitingTimerSec,
    incrementWaitingTimer,
    setOtpModalOpen,
    setContactPassengerModalOpen,
    setSafetyModalOpen,
    cancelTrip
  } = useDriverStore();

  useEffect(() => {
    const interval = setInterval(() => {
      incrementWaitingTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, [incrementWaitingTimer]);

  if (!activeRequest) return null;

  const minutes = Math.floor(waitingTimerSec / 60);
  const seconds = waitingTimerSec % 60;
  const timeFormatted = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

  return (
    <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 sm:p-5 rounded-t-[28px] shadow-2xl flex flex-col gap-3.5 z-30 select-none">
      {/* Top Header: Waiting Timer & Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Waiting for Passenger
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/60 font-mono font-bold text-xs">
          <span className="material-symbols-outlined text-[15px]">hourglass_top</span>
          <span>{timeFormatted}</span>
        </div>
      </div>

      {/* Passenger Card */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-base shrink-0">
            {activeRequest.passengerName.charAt(0)}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {activeRequest.passengerName}
            </span>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <span className="material-symbols-outlined text-[14px] text-amber-500">star</span>
              <span className="font-semibold">{activeRequest.passengerRating}</span>
              <span>• Destination: {activeRequest.destination.title}</span>
            </div>
          </div>
        </div>

        {/* Quick Contact Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setContactPassengerModalOpen(true)}
            className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-950/40 text-primary flex items-center justify-center hover:bg-blue-100 active:scale-95 transition-colors"
            title="Call or Message Passenger"
          >
            <span className="material-symbols-outlined text-[19px]">call</span>
          </button>
          <button
            type="button"
            onClick={() => setSafetyModalOpen(true)}
            className="w-9 h-9 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center hover:bg-rose-100 active:scale-95 transition-colors"
            title="Safety Center"
          >
            <span className="material-symbols-outlined text-[19px]">shield</span>
          </button>
        </div>
      </div>

      {/* Pickup Location Info */}
      <div className="text-xs p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 flex items-center gap-2">
        <span className="material-symbols-outlined text-[18px] text-emerald-600 shrink-0">pin_drop</span>
        <span className="truncate">Pickup: {activeRequest.pickup.title}</span>
      </div>

      {/* Main Action: Verify OTP & Start Trip */}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => {
            if (confirm('Cancel this ride request?')) {
              cancelTrip('Driver cancelled at pickup');
            }
          }}
          className="py-3 px-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 font-semibold text-xs hover:bg-slate-100 active:scale-95 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => setOtpModalOpen(true)}
          className="flex-1 py-3 px-4 rounded-xl bg-primary text-white font-extrabold text-sm shadow-md hover:bg-primary/90 flex items-center justify-center gap-2 active:scale-98 transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">pin</span>
          <span>Verify OTP &amp; Start Trip</span>
        </button>
      </div>
    </div>
  );
};
