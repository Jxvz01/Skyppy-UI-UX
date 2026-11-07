import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { LocationItem } from '../types';
import { MYSURU_LANDMARKS, MysuruLocation, calculateDistanceBetween } from '../utils/mysuruLocations';

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
  const { pickup, destination, savedPlaces, showToast } = useAppStore();
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
          <span>Search by Text</span>
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
          <span>Select on Map</span>
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
                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">Pickup</span>
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
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Destination</span>
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
                placeholder={mode === 'pickup' ? 'Search pickup point in Mysuru...' : 'Where to in Mysuru? (e.g. Palace, Station)'}
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
              <span>Use Current GPS Location</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('map')}
              className="py-2 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-transform shrink-0"
            >
              <span className="material-symbols-outlined text-[16px]">map</span>
              <span>Choose on Map</span>
            </button>
          </div>

          {/* Category Chips Bar */}
          <div className="px-margin flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'All Places' },
              { id: 'recent', label: 'Recent' },
              { id: 'saved', label: 'Saved' },
              { id: 'transit', label: 'Transit Hubs' },
              { id: 'hubs', label: 'Heritage' }
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
              {searchQuery ? `Matching Results (${filteredPlaces.length})` : 'Popular Locations in Mysuru'}
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
              <span>Pan map to set exact {mode === 'pickup' ? 'Pickup' : 'Drop'} location</span>
            </span>
            <span className="text-[11px] text-tertiary">Movable Pin</span>
          </div>

          {/* Interactive Map Canvas Container */}
          <div
            className="relative w-full h-[360px] overflow-hidden bg-inverse-surface select-none cursor-grab active:cursor-grabbing shadow-inner touch-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {/* SVG Vector Map of Mysuru */}
            <svg
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-75"
              style={{
                transform: `translate(${mapPan.x}px, ${mapPan.y}px) scale(1.15)`,
                transformOrigin: 'center'
              }}
              viewBox="0 0 400 480"
            >
              <defs>
                <radialGradient id="lakeGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1e3a5f" />
                  <stop offset="100%" stopColor="#0f172a" />
                </radialGradient>
              </defs>

              {/* Grid Roads */}
              <g stroke="#263445" strokeWidth="1.2" opacity="0.7">
                <line x1="-50" x2="450" y1="80" y2="95" />
                <line x1="-50" x2="450" y1="160" y2="175" />
                <line x1="-50" x2="450" y1="240" y2="255" />
                <line x1="-50" x2="450" y1="320" y2="335" />
                <line x1="-50" x2="450" y1="400" y2="415" />
                <line x1="80" x2="95" y1="-50" y2="520" />
                <line x1="170" x2="185" y1="-50" y2="520" />
                <line x1="260" x2="275" y1="-50" y2="520" />
                <line x1="350" x2="365" y1="-50" y2="520" />
              </g>

              {/* Chamundi Hill Forest */}
              <path d="M 270,300 Q 340,290 380,340 T 400,430 L 280,450 Z" fill="#13231f" opacity="0.8" />
              <text x="330" y="375" fill="#4ade80" fontSize="8" fontWeight="600" opacity="0.6">CHAMUNDI HILL</text>

              {/* Kukkarahalli Lake */}
              <path
                d="M 260,160 C 290,140 340,155 355,190 C 365,220 345,260 315,265 C 285,270 250,245 245,210 Z"
                fill="url(#lakeGradient)"
                stroke="#38bdf8"
                strokeWidth="1.5"
                opacity="0.85"
              />
              <text x="300" y="210" fill="#38bdf8" fontSize="8" fontWeight="600" textAnchor="middle" opacity="0.7">
                KUKKARAHALLI LAKE
              </text>

              {/* Major Arterial Boulevards */}
              <path d="M 20,400 C 90,360 150,310 200,290 C 250,270 310,290 390,300" fill="none" stroke="#3b82f6" strokeWidth="3" opacity="0.6" />
              <path d="M 70,30 C 120,110 170,170 220,210 C 280,255 320,330 360,400" fill="none" stroke="#2563eb" strokeWidth="3.5" opacity="0.7" />

              {/* Interactive Landmark Anchor Points */}
              {MYSURU_LANDMARKS.slice(0, 6).map((lm) => (
                <g
                  key={lm.id}
                  transform={`translate(${lm.coordinates.x}, ${lm.coordinates.y})`}
                  onClick={() => setMapSelectedLocation(lm)}
                  className="cursor-pointer"
                >
                  <circle cx="0" cy="0" r="10" fill="#1e293b" stroke="#64748b" strokeWidth="1" />
                  <circle cx="0" cy="0" r="4" fill={lm.id === mapSelectedLocation.id ? '#315ef8' : '#94a3b8'} />
                  <text x="0" y="16" fill="#cbd5e1" fontSize="7" fontWeight="600" textAnchor="middle">
                    {lm.title.split(',')[0].slice(0, 14)}
                  </text>
                </g>
              ))}
            </svg>

            {/* FIXED CENTER PINPOINT MARKER OVERLAY */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
              <div className="relative -mt-8 flex flex-col items-center">
                {/* Pin Head */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-2xl ring-4 ${
                    mode === 'pickup'
                      ? 'bg-secondary ring-secondary/30'
                      : 'bg-primary ring-primary/30'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] font-bold">
                    {mode === 'pickup' ? 'trip_origin' : 'location_on'}
                  </span>
                </div>
                {/* Pin Tip / Stalk */}
                <div
                  className={`w-1.5 h-3 ${mode === 'pickup' ? 'bg-secondary' : 'bg-primary'}`}
                />
                {/* Shadow / Pulse Beacon Ring on Ground */}
                <div className="w-5 h-2 rounded-full bg-black/50 blur-[2px] mt-0.5 animate-pulse" />
              </div>
            </div>

            {/* Quick Map Controls Floating */}
            <div className="absolute right-3 top-3 z-30 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setMapPan({ x: 0, y: 0 })}
                className="w-9 h-9 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-md text-on-surface flex items-center justify-center hover:bg-surface-container active:scale-95 transition-transform"
                title="Recenter Map"
              >
                <span className="material-symbols-outlined text-[18px]">my_location</span>
              </button>
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
                      {mode === 'pickup' ? 'Confirmed Pickup Point' : 'Confirmed Drop Destination'}
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
                <span>Confirm {mode === 'pickup' ? 'Pickup Location' : 'Destination'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

