import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { LocationPicker } from '../components/LocationPicker';
import { useAppStore } from '../store/useAppStore';
import { LocationItem } from '../types';

export const DestinationSearch: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMode = (searchParams.get('mode') as 'pickup' | 'destination') || 'destination';
  const initialTab = (searchParams.get('tab') as 'search' | 'map') || 'search';

  const { pickup, setPickup, destination, setDestination, swapLocations, showToast } = useAppStore();
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
      // If destination is default or unset, focus on destination
      setActiveField('destination');
    } else {
      setDestination(location);
      showToast(`Destination set to ${location.title}`, 'success');
      navigate('/location');
    }
  };

  return (
    <div className="flex-1 flex flex-col relative w-full bg-surface min-h-full">
      <Header type="stack" title="02 Select Locations" backTo="/" />

      <main className="flex flex-col w-full pt-2">
        {/* Dual Location Overview & Swap Header Card */}
        <div className="px-margin mb-3">
          <div className="bg-surface-container-lowest p-3 rounded-2xl shadow-xs border border-surface-container/60 flex items-center justify-between gap-2.5">
            <div className="flex flex-col gap-2 flex-1 min-w-0">
              {/* Pickup Selection Row */}
              <button
                type="button"
                onClick={() => setActiveField('pickup')}
                className={`p-2 rounded-xl text-left transition-all flex items-center gap-2.5 ${
                  activeField === 'pickup'
                    ? 'bg-secondary-container/20 ring-2 ring-secondary'
                    : 'bg-surface-container-low hover:bg-surface-container'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[15px]">trip_origin</span>
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-secondary block">
                    Pickup Point
                  </span>
                  <span className="text-xs font-semibold text-on-surface truncate block">
                    {pickup.title}
                  </span>
                </div>
                {activeField === 'pickup' && (
                  <span className="material-symbols-outlined text-secondary text-[16px] shrink-0">edit</span>
                )}
              </button>

              {/* Destination Selection Row */}
              <button
                type="button"
                onClick={() => setActiveField('destination')}
                className={`p-2 rounded-xl text-left transition-all flex items-center gap-2.5 ${
                  activeField === 'destination'
                    ? 'bg-primary/10 ring-2 ring-primary'
                    : 'bg-surface-container-low hover:bg-surface-container'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[15px]">location_on</span>
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">
                    Destination
                  </span>
                  <span className="text-xs font-semibold text-on-surface truncate block">
                    {destination.title}
                  </span>
                </div>
                {activeField === 'destination' && (
                  <span className="material-symbols-outlined text-primary text-[16px] shrink-0">edit</span>
                )}
              </button>
            </div>

            {/* Swap Button */}
            <button
              type="button"
              onClick={handleSwap}
              aria-label="Swap pickup and destination"
              className="w-10 h-10 rounded-xl bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-primary shadow-xs active:scale-90 transition-transform shrink-0"
              title="Swap Locations"
            >
              <span
                className="material-symbols-outlined text-[20px] transition-transform duration-300"
                style={{ transform: `rotate(${swapDegrees}deg)` }}
              >
                swap_vert
              </span>
            </button>
          </div>
        </div>

        {/* Embedded Universal LocationPicker */}
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
