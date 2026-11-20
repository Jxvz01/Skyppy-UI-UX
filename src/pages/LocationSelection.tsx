import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { OpenStreetMap } from '../components/OpenStreetMap';
import { useAppStore } from '../store/useAppStore';
import { translations } from '../utils/i18n';
import { Button, Badge } from '../components/common';

export const LocationSelection: React.FC = () => {
  const navigate = useNavigate();
  const { pickup, destination, swapLocations, showToast, language } = useAppStore();
  const t = translations[language] || translations.en;
  const [selectedRoutePref, setSelectedRoutePref] = useState('fastest');

  return (
    <div className="flex-1 flex flex-col relative w-full bg-[#f8fafc] min-h-full">
      <Header type="stack" title={t.confirmRoute} subtitle="Route & ETA Preview" backTo="/search" />

      <main className="flex flex-col w-full relative">
        {/* Interactive Mobility Map Canvas (High-Fidelity OpenStreetMap) */}
        <div className="relative w-full h-[320px] sm:h-[360px] overflow-hidden select-none bg-slate-100 border-b border-slate-200">
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
          <div className="absolute left-1/2 top-3 -translate-x-1/2 z-[400] flex items-center gap-2 bg-slate-900/90 text-white shadow-xl rounded-full px-3.5 py-1.5 backdrop-blur-md border border-slate-700/60 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-numeric-md text-sm text-white font-bold">
              {destination.durationMin || 12} min
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-200 font-medium">
              {destination.distanceKm || 4.2} km
            </span>
          </div>

          {/* Floating Traffic Condition Pill */}
          <div className="absolute top-3 right-3 z-[400] flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md px-2.5 py-1 rounded-full shadow-lg border border-slate-700/50 pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] text-emerald-300 font-bold tracking-wider uppercase">
              {t.normalTraffic}
            </span>
          </div>
        </div>

        {/* Confirmation Card / Sheet */}
        <div className="relative w-full bg-white rounded-t-3xl shadow-card px-margin pt-4 pb-8 z-20 flex flex-col border-t border-slate-100">
          {/* Tactile Drag Handle */}
          <div className="w-full flex justify-center pb-2">
            <div className="w-10 h-1 rounded-full bg-slate-200" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-3 px-1">
            <div>
              <span className="text-[10px] uppercase font-bold text-brand-primary tracking-wider block leading-tight">
                {t.routeVerification}
              </span>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                {t.confirmRideRoute}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                swapLocations();
                showToast('Pickup & destination swapped', 'info');
              }}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
              title="Swap"
            >
              <span className="material-symbols-outlined text-[18px]">swap_vert</span>
            </button>
          </div>

          {/* Waypoints Card */}
          <div className="bg-slate-50 rounded-2xl p-3.5 mb-3.5 flex flex-col gap-2 relative border border-slate-100">
            {/* Pickup */}
            <div className="flex items-center justify-between gap-2">
              <div
                className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                onClick={() => navigate('/search?mode=pickup')}
              >
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-emerald-600" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-emerald-600 block leading-tight">
                    {t.pickupPoint}
                  </span>
                  <p className="font-semibold text-slate-900 text-xs truncate leading-snug">{pickup.title}</p>
                </div>
              </div>
              <button
                aria-label="Edit pickup"
                onClick={() => navigate('/search?mode=pickup')}
                className="w-7 h-7 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-brand-primary transition-colors shrink-0 shadow-xs"
                type="button"
              >
                <span className="material-symbols-outlined text-[15px]">edit</span>
              </button>
            </div>

            {/* Connecting line & Swap Action */}
            <div className="flex items-center justify-between pl-2.5 pr-1">
              <div className="w-0.5 h-3 border-l-2 border-dashed border-slate-300 ml-0.5" />
              <button
                type="button"
                onClick={() => {
                  swapLocations();
                  showToast('Pickup & destination swapped', 'info');
                }}
                className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white hover:bg-slate-100 text-brand-primary text-[11px] font-bold shadow-xs active:scale-95 transition-transform border border-slate-200/60"
              >
                <span className="material-symbols-outlined text-[13px]">swap_vert</span>
                <span>Swap</span>
              </button>
            </div>

            {/* Destination */}
            <div className="flex items-center justify-between gap-2">
              <div
                className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                onClick={() => navigate('/search?mode=destination')}
              >
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-brand-primary text-[15px]">location_on</span>
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold text-brand-primary block leading-tight">
                    {t.dropDestination}
                  </span>
                  <p className="font-semibold text-slate-900 text-xs truncate leading-snug">{destination.title}</p>
                </div>
              </div>
              <button
                aria-label="Edit destination"
                onClick={() => navigate('/search?mode=destination')}
                className="w-7 h-7 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-brand-primary transition-colors shrink-0 shadow-xs"
                type="button"
              >
                <span className="material-symbols-outlined text-[15px]">edit</span>
              </button>
            </div>
          </div>

          {/* Quick Route Preference Filter Chips */}
          <div className="flex items-center gap-1.5 mb-3.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'fastest', label: t.fastestRoute, icon: 'bolt' },
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
                    showToast(`Preference: ${chip.label}`, 'info');
                  }}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full shrink-0 text-xs font-semibold transition-all ${active
                      ? 'bg-blue-50 text-brand-primary ring-1 ring-brand-primary/40'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  <span className="material-symbols-outlined text-[14px]">{chip.icon}</span>
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>

          {/* Route Summary Pill */}
          <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-500 text-[18px]">straighten</span>
              <span className="text-xs text-slate-600 font-medium">Estimated Distance:</span>
              <span className="text-xs font-bold text-slate-900">{destination.distanceKm || 4.2} Kilometers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-[18px]">schedule</span>
              <span className="text-xs font-bold text-slate-900">{destination.durationMin || 12} mins</span>
            </div>
          </div>

          {/* Primary Action Button */}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            rightIcon={<span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
            onClick={() => {
              if (pickup.title.trim().toLowerCase() === destination.title.trim().toLowerCase()) {
                showToast('Pickup and Destination cannot be the same. Please edit your route.', 'error');
                return;
              }
              navigate('/options');
            }}
          >
            {t.proceedToChooseVehicle}
          </Button>
        </div>
      </main>
    </div>
  );
};
