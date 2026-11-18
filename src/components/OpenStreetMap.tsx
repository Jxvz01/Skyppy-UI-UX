import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MYSURU_LANDMARKS, MysuruLocation } from '../utils/mysuruLocations';

export type MapMode = 'live-tracking' | 'route-preview' | 'picker' | 'confirmation-searching';

export interface OpenStreetMapProps {
  mode?: MapMode;
  stepIndex?: number;
  speed?: number;
  driverName?: string;
  vehicleCategory?: string;
  isTrafficOn?: boolean;
  onToast?: (msg: string) => void;
  className?: string;
  pickupLocation?: { title: string; lat?: number; lng?: number };
  destinationLocation?: { title: string; lat?: number; lng?: number };
  selectedLocation?: MysuruLocation | null;
  onLocationSelect?: (loc: MysuruLocation) => void;
  interactive?: boolean;
  showControls?: boolean;
  showTransitPill?: boolean;
  bottomSheetPadding?: number; // Dynamic offset in px so markers are never hidden by bottom sheet
}

// Real GPS Coordinates across Mysuru, Karnataka
const DEFAULT_VVCE_PICKUP: [number, number] = [12.3364, 76.6213]; // Gokulam 3rd Stage
const DEFAULT_JSS_DESTINATION: [number, number] = [12.3392, 76.6575]; // Bannimantap

const ROUTE_WAYPOINTS: [number, number][] = [
  [12.3364, 76.6213], // VVCE Gate 2
  [12.3348, 76.6242], // Kalidasa Rd west
  [12.3325, 76.6288], // Kalidasa / Temple Rd Jn
  [12.3282, 76.6355], // KRS Road Jn
  [12.3228, 76.6425], // Cheluvamba Park / Station approach
  [12.3260, 76.6488], // Sayyaji Rao Rd
  [12.3325, 76.6532], // Bannimantap Rd
  [12.3392, 76.6575]  // JSS Hospital entrance
];

const STEP_POSITIONS: { pos: [number, number]; heading: number; street: string }[] = [
  { pos: [12.3348, 76.6242], heading: 245, street: 'Kalidasa Rd' },
  { pos: [12.3358, 76.6222], heading: 245, street: 'Temple Rd, Gokulam' },
  { pos: [12.3364, 76.6213], heading: 35, street: 'VVCE Campus Gate 2' },
  { pos: [12.3260, 76.6488], heading: 45, street: 'Sayyaji Rao Rd' },
  { pos: [12.3392, 76.6575], heading: 40, street: 'JSS Hospital Bannimantap' }
];

export const OpenStreetMap: React.FC<OpenStreetMapProps> = ({
  mode = 'live-tracking',
  stepIndex = 0,
  speed = 24,
  driverName = 'Ramesh K.',
  vehicleCategory = 'auto',
  isTrafficOn = true,
  onToast,
  className = 'w-full h-full',
  pickupLocation,
  destinationLocation,
  selectedLocation,
  onLocationSelect,
  interactive = true,
  showControls = true,
  showTransitPill = true,
  bottomSheetPadding
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const vehicleMarkerRef = useRef<L.Marker | null>(null);
  const trafficLinesRef = useRef<L.Polyline[]>([]);
  const pickerMarkersRef = useRef<L.Marker[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [isFollowingVehicle, setIsFollowingVehicle] = useState(true);

  // Dynamic bottom sheet padding to guarantee pins & vehicle stay visible above bottom cards
  const resolvedBottomPadding =
    bottomSheetPadding ??
    (mode === 'live-tracking' ? 240 : mode === 'confirmation-searching' ? 220 : 70);

  const pickupCoords: [number, number] = [
    pickupLocation?.lat ?? DEFAULT_VVCE_PICKUP[0],
    pickupLocation?.lng ?? DEFAULT_VVCE_PICKUP[1]
  ];

  const destCoords: [number, number] = [
    destinationLocation?.lat ?? DEFAULT_JSS_DESTINATION[0],
    destinationLocation?.lng ?? DEFAULT_JSS_DESTINATION[1]
  ];

  const getVehicleIconName = () => {
    const cat = vehicleCategory.toLowerCase();
    if (cat === 'auto') return 'electric_rickshaw';
    if (cat === 'suv') return 'airport_shuttle';
    return 'directions_car';
  };

  const currentStep = STEP_POSITIONS[stepIndex] || STEP_POSITIONS[0];

  // Helper to build bespoke vehicle marker HTML with forward headlight beam
  const buildVehicleHtml = (heading: number, street: string, curSpeed: number) => {
    return `
      <div class="relative flex flex-col items-center">
        <!-- Forward Directional Headlight Beam Cone -->
        <div class="absolute -top-7 w-12 h-14 pointer-events-none" style="transform: rotate(${heading}deg); transform-origin: center 42px;">
          <svg viewBox="0 0 60 70" class="w-full h-full opacity-60">
            <defs>
              <linearGradient id="beamGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stop-color="#0042dd" stop-opacity="0.45"/>
                <stop offset="100%" stop-color="#38bdf8" stop-opacity="0"/>
              </linearGradient>
            </defs>
            <polygon points="30,55 8,4 52,4" fill="url(#beamGrad)" />
          </svg>
        </div>

        <!-- Vehicle High-Contrast Center Capsule -->
        <div class="w-10 h-10 rounded-full bg-white shadow-xl border-2 border-[#0042dd] flex items-center justify-center ring-4 ring-[#0042dd]/20 relative z-10 transition-transform duration-300" style="transform: rotate(${heading}deg)">
          <span class="material-symbols-outlined text-[20px] text-[#0042dd]">${getVehicleIconName()}</span>
        </div>

        <!-- Live Driver Telemetry Badge -->
        <div class="mt-1 px-2.5 py-0.5 rounded-full bg-slate-950/90 backdrop-blur-md text-white text-[9px] font-bold shadow-xl whitespace-nowrap flex items-center gap-1.5 border border-slate-700/60 z-20">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>${driverName.split(' ')[0]}</span>
          <span class="text-slate-500">•</span>
          <span class="text-[#d4f84c] font-mono">${curSpeed} km/h</span>
          <span class="text-slate-500">•</span>
          <span class="text-slate-300 max-w-[80px] truncate">${street}</span>
        </div>
      </div>
    `;
  };

  // Initialize Leaflet Map with High-Resolution OpenStreetMap Tiles
  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up any stale instances
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    try {
      const centerCoord: [number, number] =
        mode === 'picker' && selectedLocation?.gps
          ? [selectedLocation.gps.lat, selectedLocation.gps.lng]
          : [12.3340, 76.6394];

      const initialZoom = mode === 'picker' ? 14 : mode === 'confirmation-searching' ? 13 : 14;

      const map = L.map(containerRef.current, {
        center: centerCoord,
        zoom: initialZoom,
        zoomControl: false,
        attributionControl: false,
        dragging: interactive,
        touchZoom: interactive,
        scrollWheelZoom: interactive,
        doubleClickZoom: interactive,
        boxZoom: interactive
      });

      // Official High-Quality OpenStreetMap Tiles (Clean, Restrained, Desaturated Mobility Aesthetic)
      const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      L.tileLayer(tileUrl, {
        subdomains: ['a', 'b', 'c'],
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Route polyline (Signature Skyppy Royal Blue layered transit track)
      if (mode !== 'picker') {
        // Glowing base polyline
        L.polyline(ROUTE_WAYPOINTS, {
          color: '#0042dd',
          weight: 12,
          opacity: 0.22,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(map);

        // Core solid polyline
        L.polyline(ROUTE_WAYPOINTS, {
          color: '#0042dd',
          weight: 5,
          opacity: 0.95,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(map);

        // Center dash highlight
        L.polyline(ROUTE_WAYPOINTS, {
          color: '#d4ee66',
          weight: 2,
          opacity: 0.8,
          dashArray: '4, 8',
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(map);
      }

      // Bespoke Pickup Origin Marker
      if (mode !== 'picker') {
        const pickupLabel = pickupLocation?.title?.split(',')[0] || 'VVCE Gate 2';
        const pickupIcon = L.divIcon({
          className: 'custom-osm-pickup',
          html: `
            <div class="relative flex flex-col items-center">
              <div class="w-8 h-8 rounded-full bg-emerald-500/25 animate-ping absolute -top-1"></div>
              <div class="w-6 h-6 rounded-full bg-emerald-600 border-2 border-white shadow-lg flex items-center justify-center text-white ring-2 ring-emerald-500/30">
                <span class="w-2 h-2 rounded-full bg-white"></span>
              </div>
              <div class="mt-1 px-2.5 py-0.5 rounded-full bg-slate-900/90 backdrop-blur-md text-white text-[9px] font-bold shadow-md whitespace-nowrap flex items-center gap-1 border border-white/20">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>PICKUP</span>
                <span class="text-slate-400">•</span>
                <span class="text-slate-200">${pickupLabel}</span>
              </div>
            </div>
          `,
          iconSize: [120, 52],
          iconAnchor: [60, 26]
        });

        L.marker(pickupCoords, { icon: pickupIcon }).addTo(map);

        // Bespoke Destination Marker (Skyppy Royal Blue Pin)
        const destLabel = destinationLocation?.title?.split(',')[0] || 'JSS Hospital';
        const destIcon = L.divIcon({
          className: 'custom-osm-dest',
          html: `
            <div class="relative flex flex-col items-center">
              <div class="w-8 h-8 rounded-full bg-blue-600/25 animate-ping absolute -top-1"></div>
              <div class="w-6 h-6 rounded-full bg-[#0042dd] border-2 border-white shadow-lg flex items-center justify-center text-white ring-2 ring-blue-500/30">
                <span class="w-2 h-2 rounded-full bg-white"></span>
              </div>
              <div class="mt-1 px-2.5 py-0.5 rounded-full bg-[#0042dd] text-white text-[9px] font-bold shadow-md whitespace-nowrap flex items-center gap-1 border border-white/30">
                <span class="w-1.5 h-1.5 rounded-full bg-white"></span>
                <span>DESTINATION</span>
                <span class="text-blue-200">•</span>
                <span class="text-white">${destLabel}</span>
              </div>
            </div>
          `,
          iconSize: [130, 52],
          iconAnchor: [65, 26]
        });

        L.marker(destCoords, { icon: destIcon }).addTo(map);
      }

      // MODE: LIVE TRACKING - Bespoke Vehicle Marker with Spotlight
      if (mode === 'live-tracking') {
        const initialStep = STEP_POSITIONS[0];
        const vehicleDivIcon = L.divIcon({
          className: 'custom-osm-vehicle',
          html: buildVehicleHtml(initialStep.heading, initialStep.street, speed),
          iconSize: [140, 62],
          iconAnchor: [70, 31]
        });

        vehicleMarkerRef.current = L.marker(initialStep.pos, {
          icon: vehicleDivIcon,
          zIndexOffset: 1000
        }).addTo(map);
      }

      // MODE: CONFIRMATION SEARCHING - Animated Radar Pulse Scan
      if (mode === 'confirmation-searching') {
        const searchIcon = L.divIcon({
          className: 'custom-osm-searching-car',
          html: `
            <div class="relative flex flex-col items-center">
              <div class="w-12 h-12 rounded-full bg-[#0042dd]/20 animate-ping absolute -top-2"></div>
              <div class="w-9 h-9 rounded-full bg-white shadow-xl border-2 border-[#0042dd] flex items-center justify-center ring-2 ring-[#0042dd]/20">
                <span class="material-symbols-outlined text-[19px] text-[#0042dd]">local_taxi</span>
              </div>
              <div class="mt-1.5 px-3 py-0.5 rounded-full bg-[#0042dd] text-white text-[9px] font-bold shadow-md whitespace-nowrap flex items-center gap-1 border border-white/30">
                <span class="w-1.5 h-1.5 rounded-full bg-[#d4f84c] animate-pulse"></span>
                <span>Dispatching Driver...</span>
              </div>
            </div>
          `,
          iconSize: [130, 52],
          iconAnchor: [65, 26]
        });

        const midPoint: [number, number] = [
          (pickupCoords[0] + destCoords[0]) / 2,
          (pickupCoords[1] + destCoords[1]) / 2
        ];
        L.marker(midPoint, { icon: searchIcon, zIndexOffset: 900 }).addTo(map);
      }

      // MODE: PICKER - Landmark Pins across Mysuru
      if (mode === 'picker') {
        pickerMarkersRef.current = [];
        MYSURU_LANDMARKS.forEach((lm) => {
          if (!lm.gps) return;
          const isSelected = selectedLocation?.id === lm.id;
          const markerIcon = L.divIcon({
            className: `picker-pin-${lm.id}`,
            html: `
              <div class="relative flex flex-col items-center cursor-pointer group">
                <div class="w-7 h-7 rounded-full ${
                  isSelected ? 'bg-[#0042dd] ring-4 ring-[#0042dd]/30' : 'bg-slate-800 hover:bg-[#0042dd]'
                } text-white shadow-lg flex items-center justify-center transition-all">
                  <span class="material-symbols-outlined text-[15px]">location_on</span>
                </div>
                <div class="mt-1 px-2 py-0.5 rounded-full ${
                  isSelected ? 'bg-[#0042dd] text-white' : 'bg-white/90 text-slate-800'
                } text-[9px] font-bold shadow-md whitespace-nowrap border border-slate-200">
                  ${lm.title.split(',')[0]}
                </div>
              </div>
            `,
            iconSize: [90, 44],
            iconAnchor: [45, 22]
          });

          const marker = L.marker([lm.gps.lat, lm.gps.lng], { icon: markerIcon }).addTo(map);
          marker.on('click', () => {
            onLocationSelect?.(lm);
            map.panTo([lm.gps!.lat, lm.gps!.lng], { animate: true, duration: 0.5 });
            onToast?.(`Selected: ${lm.title}`);
          });
          pickerMarkersRef.current.push(marker);
        });

        // Click anywhere to pick location
        map.on('click', (e: L.LeafletMouseEvent) => {
          let nearest = MYSURU_LANDMARKS[0];
          let minDist = Infinity;
          MYSURU_LANDMARKS.forEach((lm) => {
            if (!lm.gps) return;
            const d = Math.hypot(lm.gps.lat - e.latlng.lat, lm.gps.lng - e.latlng.lng);
            if (d < minDist) {
              minDist = d;
              nearest = lm;
            }
          });
          onLocationSelect?.(nearest);
          onToast?.(`Pinned near ${nearest.title}`);
        });
      }

      // Intelligent Camera Framing with Dynamic Bottom Sheet Padding
      if (mode !== 'picker') {
        const bounds = L.latLngBounds([pickupCoords, destCoords]);
        map.fitBounds(bounds, {
          paddingTopLeft: [30, 40],
          paddingBottomRight: [30, resolvedBottomPadding]
        });
      }

      mapInstanceRef.current = map;
      setMapReady(true);

      // Force layout invalidation once DOM is mounted
      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    } catch (e) {
      console.warn('Leaflet OpenStreetMap initialization warning:', e);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mode, pickupLocation?.title, destinationLocation?.title, resolvedBottomPadding]);

  // Update vehicle position, heading, and telemetry during Live Tracking
  useEffect(() => {
    if (mode !== 'live-tracking' || !mapInstanceRef.current || !vehicleMarkerRef.current) return;

    vehicleMarkerRef.current.setLatLng(currentStep.pos);

    const vehicleDivIcon = L.divIcon({
      className: 'custom-osm-vehicle',
      html: buildVehicleHtml(currentStep.heading, currentStep.street, speed),
      iconSize: [140, 62],
      iconAnchor: [70, 31]
    });

    vehicleMarkerRef.current.setIcon(vehicleDivIcon);

    if (isFollowingVehicle) {
      mapInstanceRef.current.panTo(currentStep.pos, { animate: true, duration: 0.6 });
    }
  }, [mode, stepIndex, speed, driverName, vehicleCategory, currentStep, isFollowingVehicle]);

  // Traffic Layer Toggle
  useEffect(() => {
    if (!mapInstanceRef.current || mode === 'picker') return;

    trafficLinesRef.current.forEach((line) => line.remove());
    trafficLinesRef.current = [];

    if (isTrafficOn) {
      const freeFlowSegment = L.polyline(
        [
          [12.3364, 76.6213],
          [12.3348, 76.6242],
          [12.3325, 76.6288]
        ],
        { color: '#22c55e', weight: 4, opacity: 0.9, lineCap: 'round' }
      ).addTo(mapInstanceRef.current);

      const moderateSegment = L.polyline(
        [
          [12.3282, 76.6355],
          [12.3228, 76.6425],
          [12.3260, 76.6488]
        ],
        { color: '#f59e0b', weight: 4, opacity: 0.9, lineCap: 'round' }
      ).addTo(mapInstanceRef.current);

      const freeFlowEnd = L.polyline(
        [
          [12.3325, 76.6532],
          [12.3392, 76.6575]
        ],
        { color: '#22c55e', weight: 4, opacity: 0.9, lineCap: 'round' }
      ).addTo(mapInstanceRef.current);

      trafficLinesRef.current = [freeFlowSegment, moderateSegment, freeFlowEnd];
    }
  }, [isTrafficOn, mapReady, mode]);

  // Map Controls
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
    onToast?.('Map zoomed in');
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
    onToast?.('Map zoomed out');
  };

  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    if (mode === 'live-tracking') {
      setIsFollowingVehicle(true);
      mapInstanceRef.current.panTo(currentStep.pos, { animate: true, duration: 0.5 });
      onToast?.(`Follow lock: Centered on ${driverName}`);
    } else if (mode === 'picker' && selectedLocation?.gps) {
      mapInstanceRef.current.panTo([selectedLocation.gps.lat, selectedLocation.gps.lng], {
        animate: true,
        duration: 0.5
      });
      onToast?.(`Centered on ${selectedLocation.title}`);
    } else {
      const bounds = L.latLngBounds([pickupCoords, destCoords]);
      mapInstanceRef.current.fitBounds(bounds, {
        paddingTopLeft: [30, 40],
        paddingBottomRight: [30, resolvedBottomPadding]
      });
      onToast?.('Route re-centered on live corridor');
    }
  };

  return (
    <div className={`relative ${className} select-none overflow-hidden skyppy-osm-container`}>
      {/* Leaflet Map DOM Node */}
      <div ref={containerRef} className="w-full h-full bg-[#f4f6fa] skyppy-osm-tiles" />

      {/* Top Demo Simulation Status Pill */}
      {showTransitPill && (
        <div className="absolute top-3.5 left-3.5 z-[400] flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-slate-200/80 pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-[11px] font-bold text-slate-800 tracking-tight">
            Live Transit • Mysuru Central
          </span>
        </div>
      )}

      {/* Floating Glassmorphic Map Controls Column */}
      {showControls && (
        <div className="absolute right-3.5 bottom-5 z-[400] flex flex-col gap-2 pointer-events-auto">
          {/* North Compass Rose */}
          <div
            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-slate-700 shadow-md border border-slate-200/80 flex items-center justify-center font-black text-[11px] select-none"
            title="Orientation: North"
          >
            <span className="text-red-500 font-bold">N</span>
          </div>

          {/* Follow Driver Lock Toggle (in live tracking mode) */}
          {mode === 'live-tracking' && (
            <button
              type="button"
              aria-label={isFollowingVehicle ? 'Unlock free pan' : 'Lock follow driver'}
              onClick={() => {
                setIsFollowingVehicle(!isFollowingVehicle);
                onToast?.(isFollowingVehicle ? 'Camera unlocked: Free pan' : 'Camera locked: Following driver');
              }}
              className={`w-9 h-9 rounded-full shadow-md border backdrop-blur-md flex items-center justify-center transition-all active:scale-95 cursor-pointer ${
                isFollowingVehicle
                  ? 'bg-[#0042dd] text-white border-blue-400'
                  : 'bg-white/90 text-slate-700 border-slate-200 hover:bg-white'
              }`}
              title={isFollowingVehicle ? 'Camera locked to driver' : 'Free camera'}
            >
              <span className="material-symbols-outlined text-[17px]">
                {isFollowingVehicle ? 'gps_fixed' : 'gps_not_fixed'}
              </span>
            </button>
          )}

          {/* Zoom In */}
          <button
            type="button"
            aria-label="Zoom in map"
            onClick={handleZoomIn}
            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-slate-700 shadow-md border border-slate-200/80 flex items-center justify-center hover:bg-white transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
          </button>

          {/* Zoom Out */}
          <button
            type="button"
            aria-label="Zoom out map"
            onClick={handleZoomOut}
            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-slate-700 shadow-md border border-slate-200/80 flex items-center justify-center hover:bg-white transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">remove</span>
          </button>

          {/* Recenter Map */}
          <button
            type="button"
            aria-label="Recenter map"
            onClick={handleRecenter}
            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-[#0042dd] shadow-md border border-slate-200/80 flex items-center justify-center hover:bg-white transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">my_location</span>
          </button>
        </div>
      )}
    </div>
  );
};
