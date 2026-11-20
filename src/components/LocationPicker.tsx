import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { LocationItem } from '../types';
import { MYSURU_LANDMARKS, MysuruLocation, calculateDistanceBetween } from '../utils/mysuruLocations';
import { OpenStreetMap } from './OpenStreetMap';
import { translations } from '../utils/i18n';
import { Button, Badge, SegmentedControl } from './common';

interface LocationPickerProps {
  mode: 'pickup' | 'destination';
  onLocationSelected: (location: LocationItem) => void;
  onModeSwitch?: (newMode: 'pickup' | 'destination') => void;
  currentOtherLocation?: LocationItem;
  initialTab?: 'search' | 'map';
  showContextSwitch?: boolean;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  mode,
  onLocationSelected,
  onModeSwitch,
  currentOtherLocation,
  initialTab = 'search',
  showContextSwitch = false
}) => {
  const { pickup, destination, savedPlaces, showToast, language } = useAppStore();
  const t = translations[language] || translations.en;
  const [activeTab, setActiveTab] = useState<'search' | 'map'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'recent' | 'saved' | 'transit' | 'hubs'>('all');
  const [isListening, setIsListening] = useState(false);

  const [mapSelectedLocation, setMapSelectedLocation] = useState<MysuruLocation>(
    mode === 'pickup' ? MYSURU_LANDMARKS[0] : MYSURU_LANDMARKS[1]
  );

  const counterpartLocation = currentOtherLocation || (mode === 'pickup' ? destination : pickup);

  // Filtered list
  const filteredPlaces = useMemo(() => {
    let list = MYSURU_LANDMARKS;

    if (selectedFilter !== 'all') {
      list = list.filter((p) => p.type === selectedFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q) || p.address.toLowerCase().includes(q));
    }

    return list;
  }, [searchQuery, selectedFilter]);

  const isSameMysuruLocation = (titleA: string, titleB: string): boolean => {
    if (!titleA || !titleB) return false;
    const a = titleA.toLowerCase().replace(/campus|stage|gate|\s|,|\./g, '');
    const b = titleB.toLowerCase().replace(/campus|stage|gate|\s|,|\./g, '');
    return a === b || a.includes(b) || b.includes(a);
  };

  const handleSelectPlace = (place: { title: string; address: string; distanceKm?: number; durationMin?: number }) => {
    if (counterpartLocation && isSameMysuruLocation(place.title, counterpartLocation.title)) {
      showToast('Pickup and Destination cannot be the same location. Please choose a different point.', 'error');
      return;
    }

    const { distanceKm, durationMin } = calculateDistanceBetween(
      mode === 'pickup' ? place : counterpartLocation,
      mode === 'pickup' ? counterpartLocation : place
    );

    const locationItem: LocationItem = {
      title: place.title,
      address: place.address,
      distanceKm,
      durationMin
    };

    onLocationSelected(locationItem);
  };

  const handleCurrentLocation = () => {
    handleSelectPlace({
      title: 'Current Location (VVCE Gokulam)',
      address: 'Gokulam 3rd Stage, Near Gate 2, Mysuru'
    });
  };

  const handleVoiceSearch = () => {
    setIsListening(true);
    showToast('Listening... Speak destination in Mysuru');
    setTimeout(() => {
      setIsListening(false);
      setSearchQuery('Mysuru Palace');
      showToast('Voice detected: Mysuru Palace');
    }, 1500);
  };

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'transit':
        return 'directions_subway';
      case 'hubs':
        return 'account_balance';
      case 'saved':
        return 'school';
      default:
        return 'location_on';
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Search / Map Mode Segmented Toggle */}
      <div className="px-margin mb-3">
        <SegmentedControl
          size="sm"
          value={activeTab}
          onChange={(val) => setActiveTab(val as 'search' | 'map')}
          options={[
            {
              id: 'search',
              label: t.searchByText,
              icon: <span className="material-symbols-outlined text-[16px]">search</span>
            },
            {
              id: 'map',
              label: t.selectOnMap,
              icon: <span className="material-symbols-outlined text-[16px]">map</span>
            }
          ]}
        />
      </div>

      {/* Counterpart Context Switch Bar (when requested) */}
      {showContextSwitch && onModeSwitch && (
        <div className="px-margin mb-3">
          <div className="flex items-center gap-2 p-2 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => onModeSwitch('pickup')}
              className={`flex-1 px-3 py-1.5 rounded-lg text-left transition-all ${
                mode === 'pickup'
                  ? 'bg-white shadow-xs font-semibold text-brand-navy'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span className="text-[10px] uppercase tracking-wider text-emerald-600 block">{t.pickupPoint}</span>
              <p className="text-xs truncate">{pickup.title}</p>
            </button>
            <span className="material-symbols-outlined text-slate-400 text-[16px]">arrow_forward</span>
            <button
              type="button"
              onClick={() => onModeSwitch('destination')}
              className={`flex-1 px-3 py-1.5 rounded-lg text-left transition-all ${
                mode === 'destination'
                  ? 'bg-white shadow-xs font-semibold text-brand-navy'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span className="text-[10px] uppercase tracking-wider text-brand-primary block">{t.dropDestination}</span>
              <p className="text-xs truncate">{destination.title}</p>
            </button>
          </div>
        </div>
      )}

      {/* VIEW A: TEXT SEARCH */}
      {activeTab === 'search' && (
        <div className="flex flex-col gap-3">
          {/* Main Search Input Box */}
          <div className="px-margin">
            <div className="relative flex items-center bg-slate-100 rounded-xl px-3.5 py-2.5 ring-1 ring-slate-200/80 focus-within:ring-2 focus-within:ring-brand-primary focus-within:bg-white transition-all shadow-xs">
              <span
                className={`material-symbols-outlined text-[20px] mr-2.5 ${
                  mode === 'pickup' ? 'text-emerald-600' : 'text-brand-primary'
                }`}
              >
                {mode === 'pickup' ? 'my_location' : 'search'}
              </span>
              <input
                type="text"
                autoFocus
                placeholder={mode === 'pickup' ? t.pickupLocation : t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="w-6 h-6 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleVoiceSearch}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                    isListening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-500 hover:text-brand-primary'
                  }`}
                  title="Voice Search"
                >
                  <span className="material-symbols-outlined text-[18px]">mic</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Location Shortcuts */}
          <div className="px-margin flex gap-2">
            <button
              type="button"
              onClick={handleCurrentLocation}
              className="flex-1 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100/80 text-brand-primary text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[16px]">near_me</span>
              <span>{t.useCurrentLocation}</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter(selectedFilter === 'saved' ? 'all' : 'saved')}
              className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors active:scale-[0.98] ${
                selectedFilter === 'saved'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] text-amber-600">star</span>
              <span>{t.savedSpots}</span>
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto px-margin scrollbar-none pb-1">
            {[
              { id: 'all', label: t.allPlaces },
              { id: 'recent', label: t.recent },
              { id: 'transit', label: t.transitHubs },
              { id: 'hubs', label: t.cityHeritage }
            ].map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => setSelectedFilter(chip.id as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedFilter === chip.id
                    ? 'bg-brand-navy text-white shadow-xs font-semibold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Location Suggestions List */}
          <div className="px-margin flex flex-col gap-2 pb-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
              {searchQuery ? `Matching Results (${filteredPlaces.length})` : t.popularLocations}
            </span>

            {filteredPlaces.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl flex flex-col items-center gap-2 border border-slate-100">
                <span className="material-symbols-outlined text-slate-400 text-[32px]">location_off</span>
                <p className="text-xs font-semibold text-slate-700">No locations found for "{searchQuery}"</p>
                <p className="text-[11px] text-slate-500">Try searching "Gokulam", "Bannimantap", or "Palace"</p>
              </div>
            ) : (
              filteredPlaces.map((place) => {
                const isSelected =
                  (mode === 'pickup' && pickup.title.includes(place.title)) ||
                  (mode === 'destination' && destination.title.includes(place.title));

                return (
                  <div
                    key={place.id}
                    onClick={() => handleSelectPlace(place)}
                    className={`p-3 rounded-2xl flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] border ${
                      isSelected
                        ? 'bg-blue-50/70 border-brand-primary/40 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-100 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-brand-primary">
                        <span className="material-symbols-outlined text-[20px]">
                          {getCategoryIcon(place.type)}
                        </span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-sm text-slate-900 truncate">{place.title}</h4>
                          {place.tag && (
                            <Badge variant="neutral" size="sm">
                              {place.tag}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 truncate">{place.address}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 pl-2">
                      <span className="text-xs font-bold text-slate-900 block">{place.distanceKm} km</span>
                      <span className="text-[11px] text-slate-500">{place.durationMin} min</span>
                    </div>
                  </div>
                );
              })
            )}

            {/* Saved Places Section */}
            {savedPlaces.length > 0 && selectedFilter === 'all' && !searchQuery && (
              <div className="mt-2 flex flex-col gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
                  Saved Shortcuts
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {savedPlaces.map((sp) => (
                    <button
                      key={sp.id}
                      type="button"
                      onClick={() => handleSelectPlace(sp)}
                      className="p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-100 text-left shadow-xs flex items-center gap-2.5 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px]">{sp.icon}</span>
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-bold text-xs text-slate-900 truncate">{sp.title}</h5>
                        <p className="text-[10px] text-slate-500 truncate">{sp.address}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW B: SELECT ON MAP */}
      {activeTab === 'map' && (
        <div className="flex flex-col relative w-full pb-6">
          {/* Top Instruction Pill */}
          <div className="px-margin mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${mode === 'pickup' ? 'bg-emerald-500' : 'bg-brand-primary'}`} />
              <span>
                {language === 'kn'
                  ? t.panMapInstruction
                  : `Pan map to set exact ${mode === 'pickup' ? 'Pickup' : 'Drop'} location`}
              </span>
            </span>
            <span className="text-[11px] text-slate-400">Drag to adjust</span>
          </div>

          {/* Interactive Map Canvas Container (High-Fidelity OpenStreetMap) */}
          <div className="relative w-full h-[360px] overflow-hidden bg-slate-100 select-none shadow-inner border-y border-slate-200">
            <OpenStreetMap
              mode="picker"
              selectedLocation={mapSelectedLocation}
              onLocationSelect={(loc) => setMapSelectedLocation(loc)}
              onToast={showToast}
              className="w-full h-full"
              showTransitPill={false}
              showControls={true}
            />

            {/* Center Crosshair Target Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[400]">
              <div className="relative -mt-6 flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-white shadow-xl ring-4 ${
                    mode === 'pickup'
                      ? 'bg-emerald-600 ring-emerald-500/30'
                      : 'bg-brand-primary ring-brand-primary/30'
                  }`}
                >
                  <span className="material-symbols-outlined text-[19px] font-bold">
                    {mode === 'pickup' ? 'trip_origin' : 'location_on'}
                  </span>
                </div>
                <div className={`w-1 h-2.5 ${mode === 'pickup' ? 'bg-emerald-600' : 'bg-brand-primary'}`} />
                <div className="w-4 h-1.5 rounded-full bg-black/40 blur-[1px]" />
              </div>
            </div>
          </div>

          {/* Quick Landmark Jump Pills */}
          <div className="px-margin pt-2.5 flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {MYSURU_LANDMARKS.slice(0, 5).map((lm) => (
              <button
                key={lm.id}
                type="button"
                onClick={() => setMapSelectedLocation(lm)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap active:scale-95 transition-all ${
                  mapSelectedLocation.id === lm.id
                    ? 'bg-brand-navy text-white shadow-xs font-semibold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {lm.title.split(',')[0]}
              </button>
            ))}
          </div>

          {/* Bottom Live Selected Address Preview & Confirmation Card */}
          <div className="px-margin pt-3">
            <div className="p-4 rounded-2xl bg-white shadow-card border border-slate-100 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 ${
                      mode === 'pickup' ? 'bg-emerald-600' : 'bg-brand-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {mode === 'pickup' ? 'my_location' : 'pin_drop'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      {mode === 'pickup' ? t.confirmedPickup : t.confirmedDrop}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 leading-tight mt-0.5 truncate">
                      {mapSelectedLocation.title}
                    </h3>
                    <p className="text-xs text-slate-500 truncate">
                      {mapSelectedLocation.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Confirm Selection CTA */}
              <Button
                variant={mode === 'pickup' ? 'primary' : 'primary'}
                size="lg"
                fullWidth
                leftIcon={<span className="material-symbols-outlined text-[18px]">check_circle</span>}
                onClick={() => handleSelectPlace(mapSelectedLocation)}
              >
                {mode === 'pickup' ? t.confirmPickupLocation : t.confirmDestination}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
