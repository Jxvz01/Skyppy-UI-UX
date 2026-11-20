import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { LocationPicker } from '../components/LocationPicker';
import { useAppStore } from '../store/useAppStore';
import { LocationItem } from '../types';
import { translations } from '../utils/i18n';

export const DestinationSearch: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMode = (searchParams.get('mode') as 'pickup' | 'destination') || 'destination';
  const initialTab = (searchParams.get('tab') as 'search' | 'map') || 'search';

  const { pickup, setPickup, destination, setDestination, swapLocations, showToast, language } = useAppStore();
  const t = translations[language] || translations.en;
  const [activeField, setActiveField] = useState<'destination' | 'pickup'>(initialMode);
  const [swapDegrees, setSwapDegrees] = useState(0);

  const handleSwap = () => {
    swapLocations();
    setSwapDegrees((prev) => prev + 180);
  };

  const handleLocationSelected = (location: LocationItem) => {
    if (activeField === 'pickup') {
      setPickup(location);
      showToast(`Pickup set to ${location.title}`, 'success');
      setActiveField('destination');
    } else {
      setDestination(location);
      showToast(`Destination set to ${location.title}`, 'success');
      navigate('/location');
    }
  };

  return (
    <div className="flex-1 flex flex-col relative w-full bg-[#f8fafc] min-h-full">
      <Header
        type="stack"
        title={
          activeField === 'pickup'
            ? language === 'kn'
              ? 'ಆರಂಭಿಕ ಸ್ಥಳವನ್ನು ಆಯ್ಕೆಮಾಡಿ'
              : 'Choose Pickup Point'
            : t.selectLocations
        }
        subtitle={language === 'kn' ? 'ಮೈಸೂರು ಸಾರಿಗೆ ಕಾರಿಡಾರ್' : 'Mysuru Transit Corridor'}
        backTo="/"
      />

      <main className="flex flex-col w-full pt-3">
        {/* Unified Pickup & Destination Trail Card */}
        <div className="px-margin mb-3">
          <div className="bg-white p-3.5 rounded-2xl shadow-card border border-slate-100 flex items-center justify-between gap-3">
            {/* Visual Route Connector Line */}
            <div className="flex flex-col items-center justify-between self-stretch py-2 shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
              <div className="w-0.5 flex-1 my-1 border-l-2 border-dashed border-slate-300" />
              <div className="w-2.5 h-2.5 rounded-[2px] bg-brand-navy ring-4 ring-slate-100" />
            </div>

            {/* Inputs Column */}
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              {/* Pickup Row */}
              <button
                type="button"
                onClick={() => setActiveField('pickup')}
                className={`py-1.5 px-2.5 rounded-xl text-left transition-all ${
                  activeField === 'pickup'
                    ? 'bg-emerald-50/70 ring-1 ring-emerald-400'
                    : 'hover:bg-slate-50'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block leading-none">
                  {t.pickupPoint}
                </span>
                <span className="text-xs font-semibold text-slate-900 truncate block mt-0.5">
                  {pickup.title}
                </span>
              </button>

              <div className="h-[1px] bg-slate-100 w-full" />

              {/* Destination Row */}
              <button
                type="button"
                onClick={() => setActiveField('destination')}
                className={`py-1.5 px-2.5 rounded-xl text-left transition-all ${
                  activeField === 'destination'
                    ? 'bg-blue-50/70 ring-1 ring-brand-primary/50'
                    : 'hover:bg-slate-50'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary block leading-none">
                  {t.dropDestination}
                </span>
                <span className="text-xs font-semibold text-slate-900 truncate block mt-0.5">
                  {destination.title}
                </span>
              </button>
            </div>

            {/* Swap Button */}
            <button
              type="button"
              onClick={handleSwap}
              aria-label="Swap pickup and destination"
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 shadow-xs active:scale-90 transition-transform shrink-0"
              title="Swap Locations"
            >
              <span
                className="material-symbols-outlined text-[19px] transition-transform duration-300"
                style={{ transform: `rotate(${swapDegrees}deg)` }}
              >
                swap_vert
              </span>
            </button>
          </div>
        </div>

        {/* Universal LocationPicker */}
        <LocationPicker
          mode={activeField}
          onLocationSelected={handleLocationSelected}
          onModeSwitch={setActiveField}
          currentOtherLocation={activeField === 'pickup' ? destination : pickup}
          initialTab={initialTab}
          showContextSwitch={false}
        />
      </main>
    </div>
  );
};
