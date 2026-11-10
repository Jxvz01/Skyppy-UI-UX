import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { OpenStreetMap } from '../components/OpenStreetMap';
import { useAppStore } from '../store/useAppStore';

export const LocationSelection: React.FC = () => {
  const navigate = useNavigate();
  const { pickup, destination, swapLocations, showToast } = useAppStore();
  const [selectedRoutePref, setSelectedRoutePref] = useState('fastest');

  return (
    <div className="flex-1 flex flex-col relative w-full bg-surface min-h-full">
      <Header type="stack" title="Confirm Route" backTo="/search" />

      <main className="flex flex-col w-full relative">
        {/* Interactive Mobility Map Canvas (High-Fidelity OpenStreetMap) */}
        <div className="relative w-full h-[459px] overflow-hidden select-none bg-[#f8fafc] border-b border-slate-200/60 shadow-sm">
          <OpenStreetMap
            mode="route-preview"
            stepIndex={2}
            speed={0}
            driverName="Pickup Preview"
            vehicleCategory="auto"
            isTrafficOn={true}
            pickupLocation={{ title: pickup.title }}
            destinationLocation={{ title: destination.title }}
            onToast={showToast}
            className="w-full h-full"
            showTransitPill={false}
            showControls={true}
          />

          {/* Floating Live ETA & Distance Bubble */}
          <div className="absolute left-1/2 top-4 -translate-x-1/2 z-[400] flex items-center gap-space-xs bg-slate-900/90 text-white shadow-xl rounded-full px-3.5 py-1.5 backdrop-blur-md border border-slate-700/60 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-numeric-md text-label-md text-white font-bold">
              {destination.durationMin || 12} min
            </span>
            <span className="text-slate-400 font-body-sm text-[11px]">•</span>
            <span className="font-body-sm text-[11px] text-slate-200 font-medium">
              {destination.distanceKm || 4.2} km
            </span>
          </div>

          {/* Floating Traffic Condition Pill */}
          <div className="absolute top-4 right-3 z-[400] flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-slate-700/50 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-label-sm text-[10px] text-emerald-300 font-bold tracking-wider uppercase">
              Normal Traffic
            </span>
          </div>
        </div>

        {/* Confirmation Bottom Sheet Card */}
        <div className="relative w-full -mt-5 bg-surface-container-lowest rounded-t-[28px] shadow-[0_-8px_30px_rgba(16,28,43,0.08)] px-margin pt-3 pb-8 z-20 flex flex-col">
          {/* Tactile Drag Handle */}
          <div className="w-full flex justify-center py-1.5 mb-2">
            <div className="w-12 h-1.5 rounded-full bg-surface-variant"></div>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="font-label-sm text-primary uppercase font-bold tracking-wider">Route Verification</span>
              <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Confirm Ride Route</h2>
            </div>
            <button
              aria-label="Swap locations"
              onClick={swapLocations}
              className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">swap_vert</span>
            </button>
          </div>

          {/* Connected Waypoints */}
          <div className="bg-surface-container-low rounded-2xl p-space-md mb-4 flex flex-col gap-space-sm relative">
            {/* Pickup */}
            <div className="flex items-center justify-between gap-space-sm">
              <div
                className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                onClick={() => navigate('/search?mode=pickup')}
              >
                <div className="w-7 h-7 rounded-full bg-secondary/15 flex items-center justify-center shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-secondary"></div>
                </div>
                <div className="min-w-0">
                  <span className="font-label-sm text-secondary uppercase font-semibold text-[10px]">
                    Pickup Point
                  </span>
                  <p className="font-body-lg text-on-surface font-semibold text-[15px] truncate">{pickup.title}</p>
                  <p className="font-body-sm text-on-surface-variant text-[12px] truncate">{pickup.address}</p>
                </div>
              </div>
              <button
                aria-label="Edit pickup"
                onClick={() => navigate('/search?mode=pickup')}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors shrink-0"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">edit</span>
              </button>
            </div>

            {/* Connector & Swap Row */}
            <div className="flex items-center justify-between pl-3 pr-1 py-0.5">
              <div className="flex flex-col gap-1">
                <span className="w-0.5 h-1.5 rounded-full bg-outline-variant"></span>
                <span className="w-0.5 h-1.5 rounded-full bg-outline-variant"></span>
              </div>
              <button
                type="button"
                onClick={() => {
                  swapLocations();
                  showToast('Pickup & destination swapped');
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-primary text-[11px] font-bold active:scale-95 transition-transform"
                title="Swap Pickup and Destination"
              >
                <span className="material-symbols-outlined text-[14px]">swap_vert</span>
                <span>Swap</span>
              </button>
            </div>

            {/* Destination */}
            <div className="flex items-center justify-between gap-space-sm">
              <div
                className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                onClick={() => navigate('/search?mode=destination')}
              >
                <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-[16px] fill-1">location_on</span>
                </div>
                <div className="min-w-0">
                  <span className="font-label-sm text-primary uppercase font-semibold text-[10px]">
                    Drop Destination
                  </span>
                  <p className="font-body-lg text-on-surface font-semibold text-[15px] truncate">{destination.title}</p>
                  <p className="font-body-sm text-on-surface-variant text-[12px] truncate">{destination.address}</p>
                </div>
              </div>
              <button
                aria-label="Edit destination"
                onClick={() => navigate('/search?mode=destination')}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors shrink-0"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">edit</span>
              </button>
            </div>
          </div>

          {/* Quick Route Preference Filter Chips */}
          <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'fastest', label: 'Fastest Route', icon: 'bolt' },
              { id: 'verified', label: 'Verified Drivers', icon: 'verified_user' },
              { id: 'zero_tolls', label: 'Zero Tolls', icon: 'money_off' }
            ].map((chip) => {
              const active = selectedRoutePref === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => {
                    setSelectedRoutePref(chip.id);
                    showToast(`Preference set: ${chip.label}`);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full shrink-0 transition-all ${
                    active
                      ? 'bg-primary-container/15 text-primary font-semibold ring-1 ring-primary/30'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">{chip.icon}</span>
                  <span className="font-label-md text-label-md">{chip.label}</span>
                </button>
              );
            })}
          </div>

          {/* Route Metric Summary Bento Pill */}
          <div className="flex items-center justify-between bg-surface-container-high rounded-xl px-4 py-3 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[18px]">directions_car</span>
              </div>
              <div>
                <span className="font-body-sm text-on-surface-variant text-[11px] block leading-tight">
                  Estimated Distance
                </span>
                <span className="font-numeric-md text-on-surface font-bold text-[14px]">
                  {destination.distanceKm || 4.2} Kilometers
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-body-sm text-on-surface-variant text-[11px] block leading-tight">Travel Time</span>
              <span className="font-numeric-md text-secondary font-bold text-[14px]">
                {destination.durationMin || 12} - {(destination.durationMin || 12) + 2} Mins
              </span>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => {
              if (pickup.title.trim().toLowerCase() === destination.title.trim().toLowerCase()) {
                showToast('Pickup and Destination cannot be the same. Please edit your route.', 'error');
                return;
              }
              navigate('/options');
            }}
            className="w-full h-[52px] bg-primary text-on-primary rounded-full flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:bg-primary-container transition-all active:scale-[0.99] font-headline-md text-headline-md tracking-wide cursor-pointer"
            type="button"
          >
            <span>Continue to Ride Options</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </div>
      </main>
    </div>
  );
};

