import React, { useState } from 'react';
import { useDriverStore } from '../../store/useDriverStore';
import { DriverTripHistoryItem } from '../../types/driver';

export const DriverActivity: React.FC = () => {
  const { history, profile } = useDriverStore();
  const [filter, setFilter] = useState<'all' | 'completed' | 'cancelled'>('all');
  const [selectedTrip, setSelectedTrip] = useState<DriverTripHistoryItem | null>(null);

  const filteredHistory = history.filter((item) => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  return (
    <div className="flex-1 w-full h-full flex flex-col bg-surface overflow-y-auto px-4 py-4 space-y-4">
      {/* Title & Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-on-surface tracking-tight">Trip Activity</h2>
          <p className="text-xs text-on-surface-variant font-medium">
            {profile.totalTrips} Lifetime Trips • {profile.completionRatePct}% Completion
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high border border-outline-variant/30 text-xs font-semibold text-on-surface">
          <span className="material-symbols-outlined text-amber-500 text-[16px] fill-1">star</span>
          <span>{profile.rating}</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-surface-container p-1 rounded-2xl border border-outline-variant/20">
        {(['all', 'completed', 'cancelled'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl capitalize transition-all ${
              filter === tab
                ? 'bg-surface text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Trip List */}
      <div className="space-y-3">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-12 text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl opacity-40 mb-2">history</span>
            <p className="text-xs font-medium">No trips found in this category.</p>
          </div>
        ) : (
          filteredHistory.map((trip) => {
            const isCompleted = trip.status === 'completed';
            return (
              <div
                key={trip.id}
                onClick={() => setSelectedTrip(trip)}
                className="bg-surface-container-lowest hover:bg-surface-container-low transition-all rounded-2xl p-4 border border-outline-variant/20 shadow-sm cursor-pointer space-y-3"
              >
                {/* Header of Trip Item */}
                <div className="flex items-center justify-between border-b border-outline-variant/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isCompleted ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                    />
                    <span className="text-xs font-mono font-bold text-on-surface">{trip.id}</span>
                    <span className="text-[11px] text-on-surface-variant">• {trip.date}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-emerald-600 font-mono">
                      {isCompleted ? `+₹${trip.earnings}` : '₹0'}
                    </span>
                  </div>
                </div>

                {/* Route Points */}
                <div className="space-y-2">
                  <div className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                    <p className="text-xs text-on-surface truncate">{trip.pickup}</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 mt-1 shrink-0" />
                    <p className="text-xs text-on-surface truncate">{trip.destination}</p>
                  </div>
                </div>

                {/* Footer Details */}
                <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-1 border-t border-outline-variant/10">
                  <div className="flex items-center gap-3">
                    <span>{trip.distanceKm} km</span>
                    <span>•</span>
                    <span>{trip.durationMin} mins</span>
                    <span>•</span>
                    <span className="font-medium text-on-surface">{trip.passengerName}</span>
                  </div>
                  <span className="text-[10px] font-bold text-primary flex items-center gap-0.5">
                    Receipt <span className="material-symbols-outlined text-[13px]">chevron_right</span>
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Selected Trip Receipt Modal */}
      {selectedTrip && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div
            className="w-full max-w-md bg-surface sm:rounded-3xl rounded-t-3xl shadow-2xl border border-outline-variant/30 flex flex-col max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-low">
              <div>
                <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-wider">
                  Trip Receipt
                </span>
                <h3 className="text-base font-bold text-on-surface">{selectedTrip.id}</h3>
              </div>
              <button
                onClick={() => setSelectedTrip(null)}
                className="w-8 h-8 rounded-full bg-surface-container-high hover:bg-surface-container-highest flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 overflow-y-auto">
              {/* Earnings Highlight */}
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-center">
                <span className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">Net Driver Payout</span>
                <div className="text-3xl font-extrabold text-emerald-600 font-mono mt-1">
                  ₹{selectedTrip.earnings}
                </div>
                <span className="text-[11px] text-on-surface-variant mt-1 block">
                  Settled instantly via {selectedTrip.paymentMethod}
                </span>
              </div>

              {/* Fare Breakdown */}
              <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/20 space-y-2.5">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                  Financial Breakdown
                </span>
                <div className="flex justify-between text-xs text-on-surface">
                  <span>Gross Passenger Fare</span>
                  <span className="font-mono font-medium">₹{selectedTrip.grossFare}</span>
                </div>
                <div className="flex justify-between text-xs text-rose-600">
                  <span>Skyppy Platform Fee (10-12%)</span>
                  <span className="font-mono font-medium">-₹{selectedTrip.platformFee}</span>
                </div>
                <div className="border-t border-outline-variant/20 pt-2 flex justify-between text-xs font-bold text-on-surface">
                  <span>Driver Take-Home</span>
                  <span className="font-mono text-emerald-600">₹{selectedTrip.earnings}</span>
                </div>
              </div>

              {/* Route Summary */}
              <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/20 space-y-3">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                  Route & Timing
                </span>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                    <div>
                      <span className="text-[10px] text-on-surface-variant block">Pickup</span>
                      <p className="font-medium text-on-surface">{selectedTrip.pickup}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 mt-1 shrink-0" />
                    <div>
                      <span className="text-[10px] text-on-surface-variant block">Dropoff</span>
                      <p className="font-medium text-on-surface">{selectedTrip.destination}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-outline-variant/20 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-on-surface-variant block">Distance</span>
                    <span className="font-mono font-bold text-on-surface">{selectedTrip.distanceKm} km</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-on-surface-variant block">Duration</span>
                    <span className="font-mono font-bold text-on-surface">{selectedTrip.durationMin} min</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-on-surface-variant block">Rating</span>
                    <span className="font-mono font-bold text-amber-500 flex items-center justify-center gap-0.5">
                      <span className="material-symbols-outlined text-[13px] fill-1">star</span>
                      {selectedTrip.rating}
                    </span>
                  </div>
                </div>
              </div>

              {/* Passenger Info */}
              <div className="bg-surface-container-lowest rounded-2xl p-3.5 border border-outline-variant/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider block">Passenger</span>
                  <span className="text-xs font-bold text-on-surface">{selectedTrip.passengerName}</span>
                </div>
                <span className="text-[11px] text-emerald-600 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full">
                  Verified Rider
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
