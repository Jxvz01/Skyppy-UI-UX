import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { LocationItem } from '../types';
import { MYSURU_LANDMARKS, MysuruLocation, calculateDistanceBetween } from '../utils/mysuruLocations';
import { OpenStreetMap } from './OpenStreetMap';
import { translations } from '../utils/i18n';

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
  showContextSwitch = true
}) => {
  const { pickup, destination, savedPlaces, showToast, language } = useAppStore();
  const t = translations[language] || translations.en;
  const [activeTab, setActiveTab] = useState<'search' | 'map'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'recent' | 'saved' | 'transit' | 'hubs'>('all');
  const [isListening, setIsListening] = useState(false);

  // Map pin drag/pan state
  const [mapPan, setMapPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
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
    // Validation check: cannot be identical to counterpart
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

  // Unified pointer interactions (mouse & touch drag with pointer capture)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    setIsDragging(true);
    setDragStart({ x: e.clientX - mapPan.x, y: e.clientY - mapPan.y });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    // Bound the pan
    const clampedX = Math.max(-120, Math.min(120, newX));
    const clampedY = Math.max(-120, Math.min(120, newY));
    setMapPan({ x: clampedX, y: clampedY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    setIsDragging(false);

    // Pick closest landmark based on pan offset
    const index = Math.abs(Math.round((mapPan.x + mapPan.y) / 40)) % MYSURU_LANDMARKS.length;
    setMapSelectedLocation(MYSURU_LANDMARKS[index]);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Search / Map Mode Segmented Toggle */}
      <div className="flex items-center p-1 bg-surface-container-low rounded-xl mx-margin mb-3">
        <button
          type="button"
          onClick={() => setActiveTab('search')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'search'
              ? 'bg-surface-container-lowest text-primary shadow-xs'
              : 'text-tertiary hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">search</span>
          <span>{t.searchByText}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('map')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'map'
              ? 'bg-surface-container-lowest text-primary shadow-xs'
              : 'text-tertiary hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">pin_drop</span>
          <span>{t.selectOnMap}</span>
        </button>
      </div>

      {/* Counterpart Context Switch Bar (optional) */}
      {showContextSwitch && onModeSwitch && (
        <div className="px-margin mb-3">
          <div className="flex items-center gap-2 p-2.5 bg-surface-container-low rounded-2xl">
            <button
              type="button"
              onClick={() => onModeSwitch('pickup')}
              className={`flex-1 px-3 py-1.5 rounded-xl text-left transition-all ${
                mode === 'pickup'
                  ? 'bg-surface-container-lowest ring-2 ring-secondary shadow-xs'
                  : 'bg-transparent text-tertiary hover:bg-surface-container'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-secondary inline-block"></span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">{t.pickupPoint}</span>
              </div>
              <p className="text-xs font-bold text-on-surface truncate mt-0.5">{pickup.title}</p>
            </button>

            <span className="material-symbols-outlined text-outline-variant text-[18px]">arrow_forward</span>

            <button
              type="button"
              onClick={() => onModeSwitch('destination')}
              className={`flex-1 px-3 py-1.5 rounded-xl text-left transition-all ${
                mode === 'destination'
                  ? 'bg-surface-container-lowest ring-2 ring-primary shadow-xs'
                  : 'bg-transparent text-tertiary hover:bg-surface-container'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{t.dropDestination}</span>
              </div>
              <p className="text-xs font-bold text-on-surface truncate mt-0.5">{destination.title}</p>
            </button>
          </div>
        </div>
      )}

      {/* VIEW A: TEXT SEARCH */}
      {activeTab === 'search' && (
        <div className="flex flex-col gap-3">
          {/* Main Search Input Box */}
          <div className="px-margin">
            <div className="relative flex items-center bg-surface-container-low rounded-2xl px-3.5 py-3 ring-1 ring-surface-container focus-within:ring-2 focus-within:ring-primary focus-within:bg-surface-container-lowest transition-all shadow-xs">
              <span className={`material-symbols-outlined text-[22px] mr-2.5 ${mode === 'pickup' ? 'text-secondary' : 'text-primary'}`}>
                {mode === 'pickup' ? 'my_location' : 'search'}
              </span>
              <input
                type="text"
                autoFocus
                placeholder={mode === 'pickup' ? t.pickupLocation : t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm font-body-lg text-on-surface placeholder:text-outline focus:outline-none"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleVoiceSearch}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    isListening ? 'bg-error text-white animate-pulse' : 'bg-surface-container text-primary hover:bg-surface-container-high'
                  }`}
                  title="Voice Search"
                >
                  <span className="material-symbols-outlined text-[18px]">mic</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Location Action Buttons */}
          <div className="px-margin flex gap-2">
            <button
              type="button"
              onClick={handleCurrentLocation}
              className="flex-1 py-2 px-3 rounded-xl bg-primary/10 hover:bg-primary/15 text-primary text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[16px]">near_me</span>
              <span>{t.useCurrentLocation}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('map')}
              className="py-2 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-transform shrink-0"
            >
              <span className="material-symbols-outlined text-[16px]">map</span>
              <span>{t.selectOnMap}</span>
            </button>
          </div>

          {/* Category Chips Bar */}
          <div className="px-margin flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: t.allPlaces },
              { id: 'recent', label: t.recent },
              { id: 'saved', label: t.savedSpots },
              { id: 'transit', label: t.transitHubs },
              { id: 'hubs', label: t.cityHeritage }
            ].map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => setSelectedFilter(chip.id as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedFilter === chip.id
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Location Suggestions List */}
          <div className="px-margin flex flex-col gap-2 pb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-outline px-1">
              {searchQuery ? `Matching Results (${filteredPlaces.length})` : t.popularLocations}
            </span>

            {filteredPlaces.length === 0 ? (
              <div className="p-8 text-center bg-surface-container-low rounded-2xl flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-outline text-[32px]">location_off</span>
                <p className="text-xs font-semibold text-on-surface">No locations found for "{searchQuery}"</p>
                <p className="text-[11px] text-tertiary">Try searching "Gokulam", "Bannimantap", or "Palace"</p>
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
                    className={`p-3 rounded-2xl flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] ${
                      isSelected
                        ? 'bg-surface-container-low ring-2 ring-primary shadow-sm'
                        : 'bg-surface-container-lowest hover:bg-surface-container-low shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-surface-container flex items-center justify-center overflow-hidden shrink-0">
                        {place.image ? (
                          <img src={place.image} alt={place.title} className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-primary text-[20px]">place</span>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-sm text-on-surface truncate">{place.title}</h4>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-surface-container text-primary shrink-0">
                            {place.tag}
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant truncate">{place.address}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 pl-2">
                      <span className="text-xs font-bold text-on-surface block">{place.distanceKm} km</span>
                      <span className="text-[11px] text-tertiary">{place.durationMin} min</span>
                    </div>
                  </div>
                );
              })
            )}

            {/* Saved Places Section */}
            {savedPlaces.length > 0 && selectedFilter === 'all' && !searchQuery && (
              <div className="mt-2 flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-outline px-1">Your Pinned Spots</span>
                <div className="grid grid-cols-2 gap-2">
                  {savedPlaces.map((sp) => (
                    <button
                      key={sp.id}
                      type="button"
                      onClick={() => handleSelectPlace(sp)}
                      className="p-3 rounded-2xl bg-surface-container-lowest hover:bg-surface-container-low text-left shadow-xs flex items-center gap-2.5 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px]">{sp.icon}</span>
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-bold text-xs text-on-surface truncate">{sp.title}</h5>
                        <p className="text-[10px] text-on-surface-variant truncate">{sp.address}</p>
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
            <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${mode === 'pickup' ? 'bg-secondary' : 'bg-primary'}`}></span>
              <span>{language === 'kn' ? t.panMapInstruction : `Pan map to set exact ${mode === 'pickup' ? 'Pickup' : 'Drop'} location`}</span>
            </span>
            <span className="text-[11px] text-tertiary">Movable Pin</span>
          </div>

          {/* Interactive Map Canvas Container (High-Fidelity OpenStreetMap) */}
          <div className="relative w-full h-[360px] overflow-hidden bg-slate-100 select-none shadow-inner">
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
                      : 'bg-primary ring-primary/30'
                  }`}
                >
                  <span className="material-symbols-outlined text-[19px] font-bold">
                    {mode === 'pickup' ? 'trip_origin' : 'location_on'}
                  </span>
                </div>
                <div className={`w-1 h-2.5 ${mode === 'pickup' ? 'bg-emerald-600' : 'bg-primary'}`} />
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
                className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap active:scale-95 transition-all ${
                  mapSelectedLocation.id === lm.id
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {lm.title.split(',')[0]}
              </button>
            ))}
          </div>

          {/* Bottom Live Selected Address Preview & Confirmation Card */}
          <div className="px-margin pt-3">
            <div className="p-4 rounded-2xl bg-surface-container-low shadow-md border border-surface-container flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 ${
                      mode === 'pickup' ? 'bg-secondary' : 'bg-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {mode === 'pickup' ? 'my_location' : 'pin_drop'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                      {mode === 'pickup' ? t.confirmedPickup : t.confirmedDrop}
                    </span>
                    <h3 className="font-bold text-sm text-on-surface leading-tight mt-0.5">
                      {mapSelectedLocation.title}
                    </h3>
                    <p className="text-xs text-on-surface-variant truncate max-w-[240px]">
                      {mapSelectedLocation.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Confirm Selection CTA */}
              <button
                type="button"
                onClick={() => handleSelectPlace(mapSelectedLocation)}
                className={`w-full h-12 rounded-xl text-white font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform ${
                  mode === 'pickup' ? 'bg-secondary' : 'bg-primary'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>{mode === 'pickup' ? t.confirmPickupLocation : t.confirmDestination}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

