import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MYSURU_LANDMARKS, MysuruLocation } from '../utils/mysuruLocations';
import { FALLBACK_DRIVER_APPROACH, FALLBACK_TRIP_ROUTE } from '../utils/roadRouting';

export type MapMode = 'live-tracking' | 'route-preview' | 'picker' | 'confirmation-searching' | 'shared-tracking';

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
  bottomSheetPadding?: number;
  // Dynamic Real Road Navigation Props
  activeVehiclePosition?: [number, number];
  activeVehicleHeading?: number;
  activeRouteCoordinates?: [number, number][];
  isApproachingPickup?: boolean;
  streetName?: string;
}

// Default Mysuru Coordinates
const DEFAULT_PICKUP: [number, number] = [12.3364, 76.6213]; // VVCE Gate 2, Gokulam
const DEFAULT_DESTINATION: [number, number] = [12.3392, 76.6575]; // JSS Hospital, Bannimantap

export const OpenStreetMap: React.FC<OpenStreetMapProps> = ({
  mode = 'live-tracking',
  speed = 24,
  driverName = 'Ramesh K.',
  vehicleCategory = 'auto',
  onToast,
  className = 'w-full h-full',
  pickupLocation,
  destinationLocation,
  selectedLocation,
  onLocationSelect,
  interactive = true,
  showControls = true,
  showTransitPill = true,
  bottomSheetPadding,
  activeVehiclePosition,
  activeVehicleHeading,
  activeRouteCoordinates,
  isApproachingPickup = false,
  streetName = 'Gokulam Road'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const vehicleMarkerRef = useRef<L.Marker | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const routeCasingRef = useRef<L.Polyline | null>(null);
  const pickupMarkerRef = useRef<L.Marker | null>(null);
  const destMarkerRef = useRef<L.Marker | null>(null);
  const pickerMarkersRef = useRef<L.Marker[]>([]);

  const [isFollowingVehicle, setIsFollowingVehicle] = useState(true);

  // Dynamic bottom sheet padding to keep road elements visible
  const resolvedBottomPadding =
    bottomSheetPadding ??
    (mode === 'live-tracking' || mode === 'shared-tracking'
      ? 240
      : mode === 'confirmation-searching'
      ? 220
      : 70);

  const pickupCoords: [number, number] = [
    pickupLocation?.lat ?? DEFAULT_PICKUP[0],
    pickupLocation?.lng ?? DEFAULT_PICKUP[1]
  ];

  const destCoords: [number, number] = [
    destinationLocation?.lat ?? DEFAULT_DESTINATION[0],
    destinationLocation?.lng ?? DEFAULT_DESTINATION[1]
  ];

  // Resolve road coordinates
  const resolvedRoute: [number, number][] =
    activeRouteCoordinates && activeRouteCoordinates.length > 1
      ? activeRouteCoordinates
      : isApproachingPickup
      ? FALLBACK_DRIVER_APPROACH
      : FALLBACK_TRIP_ROUTE;

  const currentVehiclePos: [number, number] =
    activeVehiclePosition ||
    (isApproachingPickup
      ? FALLBACK_DRIVER_APPROACH[0]
      : resolvedRoute[0] || pickupCoords);

  const currentVehicleHeading: number =
    activeVehicleHeading !== undefined
      ? activeVehicleHeading
      : 45;

  const getVehicleIconName = () => {
    const cat = vehicleCategory.toLowerCase();
    if (cat === 'auto') return 'electric_rickshaw';
    if (cat === 'suv') return 'airport_shuttle';
    return 'directions_car';
  };

  // Build clean, high-precision vehicle marker HTML with smooth rotation
  const buildVehicleHtml = useCallback((heading: number, street: string, curSpeed: number) => {
    return `
      <div class="relative flex flex-col items-center select-none" style="filter: drop-shadow(0 4px 10px rgba(0,0,0,0.22));">
        <!-- Forward Direction Indicator Chevron -->
        <div class="absolute -top-3 w-4 h-4 flex items-center justify-center transition-transform duration-200 pointer-events-none" style="transform: rotate(${heading}deg); transform-origin: center 20px;">
          <div class="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[8px] border-b-[#0042dd]"></div>
        </div>

        <!-- High-Contrast Vehicle Capsule -->
        <div class="w-10 h-10 rounded-full bg-white border-2 border-[#0042dd] flex items-center justify-center shadow-lg relative z-10 transition-transform duration-200" style="transform: rotate(${heading}deg);">
          <span class="material-symbols-outlined text-[20px] text-[#0042dd]">${getVehicleIconName()}</span>
        </div>

        <!-- Real-Time Telemetry Badge -->
        <div class="mt-1 px-2.5 py-0.5 rounded-full bg-slate-900/95 backdrop-blur-md text-white text-[9px] font-bold shadow-md whitespace-nowrap flex items-center gap-1.5 border border-white/20 z-20 pointer-events-none">
          <span class="w-1.5 h-1.5 rounded-full ${curSpeed > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}"></span>
          <span>${driverName.split(' ')[0]}</span>
          <span class="text-slate-400">•</span>
          <span class="text-[#d4f84c] font-mono">${curSpeed} km/h</span>
          <span class="text-slate-400">•</span>
          <span class="text-slate-200 max-w-[85px] truncate">${street}</span>
        </div>
      </div>
    `;
  }, [driverName, vehicleCategory]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!containerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    try {
      const centerCoord: [number, number] =
        mode === 'picker' && selectedLocation?.gps
          ? [selectedLocation.gps.lat, selectedLocation.gps.lng]
          : currentVehiclePos;

      const initialZoom = mode === 'picker' ? 14 : mode === 'confirmation-searching' ? 14 : 15;

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

      // OpenStreetMap Standard Tiles
      const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      L.tileLayer(tileUrl, {
        subdomains: ['a', 'b', 'c'],
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      // Clean, Believable Road Route (No tacky neon overlays or fake lines)
      if (mode !== 'picker' && resolvedRoute.length > 1) {
        // Subtle road casing/shadow for contrast against map roads
        routeCasingRef.current = L.polyline(resolvedRoute, {
          color: '#0a2368',
          weight: 7,
          opacity: 0.35,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(map);

        // Primary road polyline: Clean Skyppy Royal Blue
        routePolylineRef.current = L.polyline(resolvedRoute, {
          color: '#0042dd',
          weight: 5,
          opacity: 0.95,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(map);
      }

      // Pickup Origin Marker
      if (mode !== 'picker') {
        const pickupLabel = pickupLocation?.title?.split(',')[0] || 'VVCE Gate 2';
        const pickupIcon = L.divIcon({
          className: 'custom-osm-pickup',
          html: `
            <div class="relative flex flex-col items-center select-none">
              <div class="w-7 h-7 rounded-full bg-emerald-500/25 animate-ping absolute -top-0.5"></div>
              <div class="w-6 h-6 rounded-full bg-emerald-600 border-2 border-white shadow-md flex items-center justify-center text-white ring-2 ring-emerald-500/30">
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
          iconSize: [120, 50],
          iconAnchor: [60, 25]
        });

        pickupMarkerRef.current = L.marker(pickupCoords, {
          icon: pickupIcon,
          zIndexOffset: 800
        }).addTo(map);

        // Destination Marker (Displayed during trip or route-preview)
        if (!isApproachingPickup || mode === 'route-preview') {
          const destLabel = destinationLocation?.title?.split(',')[0] || 'JSS Hospital';
          const destIcon = L.divIcon({
            className: 'custom-osm-dest',
            html: `
              <div class="relative flex flex-col items-center select-none">
                <div class="w-6 h-6 rounded-full bg-[#0042dd] border-2 border-white shadow-md flex items-center justify-center text-white ring-2 ring-blue-500/30">
                  <span class="material-symbols-outlined text-[13px]">flag</span>
                </div>
                <div class="mt-1 px-2.5 py-0.5 rounded-full bg-[#0042dd] text-white text-[9px] font-bold shadow-md whitespace-nowrap flex items-center gap-1 border border-white/30">
                  <span class="w-1.5 h-1.5 rounded-full bg-white"></span>
                  <span>DESTINATION</span>
                  <span class="text-blue-200">•</span>
                  <span class="text-white">${destLabel}</span>
                </div>
              </div>
            `,
            iconSize: [130, 50],
            iconAnchor: [65, 25]
          });

          destMarkerRef.current = L.marker(destCoords, {
            icon: destIcon,
            zIndexOffset: 750
          }).addTo(map);
        }
      }

      // Live Tracking Vehicle Marker
      if (mode === 'live-tracking' || mode === 'shared-tracking') {
        const vehicleDivIcon = L.divIcon({
          className: 'custom-osm-vehicle',
          html: buildVehicleHtml(currentVehicleHeading, streetName, speed),
          iconSize: [140, 62],
          iconAnchor: [70, 31]
        });

        vehicleMarkerRef.current = L.marker(currentVehiclePos, {
          icon: vehicleDivIcon,
          zIndexOffset: 1000
        }).addTo(map);
      }

      // Mode: Confirmation Searching
      if (mode === 'confirmation-searching') {
        const searchIcon = L.divIcon({
          className: 'custom-osm-searching-car',
          html: `
            <div class="relative flex flex-col items-center select-none">
              <div class="w-11 h-11 rounded-full bg-[#0042dd]/20 animate-ping absolute -top-1.5"></div>
              <div class="w-9 h-9 rounded-full bg-white shadow-xl border-2 border-[#0042dd] flex items-center justify-center ring-2 ring-[#0042dd]/20">
                <span class="material-symbols-outlined text-[19px] text-[#0042dd]">local_taxi</span>
              </div>
              <div class="mt-1.5 px-3 py-0.5 rounded-full bg-[#0042dd] text-white text-[9px] font-bold shadow-md whitespace-nowrap flex items-center gap-1 border border-white/30">
                <span class="w-1.5 h-1.5 rounded-full bg-[#d4f84c] animate-pulse"></span>
                <span>Connecting Nearby Driver...</span>
              </div>
            </div>
          `,
          iconSize: [140, 52],
          iconAnchor: [70, 26]
        });

        const midPoint: [number, number] = [
          (pickupCoords[0] + destCoords[0]) / 2,
          (pickupCoords[1] + destCoords[1]) / 2
        ];
        L.marker(midPoint, { icon: searchIcon, zIndexOffset: 900 }).addTo(map);
      }

      // Mode: Picker (City Landmarks)
      if (mode === 'picker') {
        pickerMarkersRef.current = [];
        MYSURU_LANDMARKS.forEach((lm) => {
          if (!lm.gps) return;
          const isSelected = selectedLocation?.id === lm.id;
          const markerIcon = L.divIcon({
            className: `picker-pin-${lm.id}`,
            html: `
              <div class="relative flex flex-col items-center cursor-pointer select-none">
                <div class="w-7 h-7 rounded-full ${
                  isSelected ? 'bg-[#0042dd] ring-4 ring-[#0042dd]/30' : 'bg-slate-800 hover:bg-[#0042dd]'
                } text-white shadow-lg flex items-center justify-center transition-all">
                  <span class="material-symbols-outlined text-[15px]">location_on</span>
                </div>
                <div class="mt-1 px-2 py-0.5 rounded-full ${
                  isSelected ? 'bg-[#0042dd] text-white' : 'bg-white/95 text-slate-800'
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

      // Initial Camera Framing
      if (mode !== 'picker') {
        if (isApproachingPickup) {
          // Frame Driver and Pickup point
          const bounds = L.latLngBounds([currentVehiclePos, pickupCoords]);
          map.fitBounds(bounds, {
            paddingTopLeft: [40, 40],
            paddingBottomRight: [40, resolvedBottomPadding],
            maxZoom: 16
          });
        } else {
          // Frame Vehicle/Pickup and Destination
          const bounds = L.latLngBounds([currentVehiclePos, destCoords]);
          map.fitBounds(bounds, {
            paddingTopLeft: [30, 40],
            paddingBottomRight: [30, resolvedBottomPadding],
            maxZoom: 16
          });
        }
      }

      mapInstanceRef.current = map;

      setTimeout(() => {
        map.invalidateSize();
      }, 150);
    } catch (e) {
      console.warn('Leaflet OpenStreetMap initialization warning:', e);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [
    mode,
    pickupLocation?.title,
    destinationLocation?.title,
    isApproachingPickup,
    resolvedBottomPadding
  ]);

  // Update dynamic route line if activeRouteCoordinates change
  useEffect(() => {
    if (!mapInstanceRef.current || mode === 'picker') return;

    if (routePolylineRef.current) {
      routePolylineRef.current.setLatLngs(resolvedRoute);
    }
    if (routeCasingRef.current) {
      routeCasingRef.current.setLatLngs(resolvedRoute);
    }
  }, [resolvedRoute, mode]);

  // Update vehicle position, heading, and telemetry smoothly along roads
  useEffect(() => {
    if ((mode !== 'live-tracking' && mode !== 'shared-tracking') || !mapInstanceRef.current) return;

    if (vehicleMarkerRef.current) {
      vehicleMarkerRef.current.setLatLng(currentVehiclePos);

      const vehicleDivIcon = L.divIcon({
        className: 'custom-osm-vehicle',
        html: buildVehicleHtml(currentVehicleHeading, streetName, speed),
        iconSize: [140, 62],
        iconAnchor: [70, 31]
      });
      vehicleMarkerRef.current.setIcon(vehicleDivIcon);
    }

    if (isFollowingVehicle) {
      mapInstanceRef.current.panTo(currentVehiclePos, { animate: true, duration: 0.3 });
    }
  }, [
    mode,
    currentVehiclePos,
    currentVehicleHeading,
    speed,
    streetName,
    isFollowingVehicle,
    buildVehicleHtml
  ]);

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
    if (mode === 'live-tracking' || mode === 'shared-tracking') {
      setIsFollowingVehicle(true);
      mapInstanceRef.current.panTo(currentVehiclePos, { animate: true, duration: 0.4 });
      onToast?.(`Centered on ${driverName}`);
    } else if (mode === 'picker' && selectedLocation?.gps) {
      mapInstanceRef.current.panTo([selectedLocation.gps.lat, selectedLocation.gps.lng], {
        animate: true,
        duration: 0.4
      });
      onToast?.(`Centered on ${selectedLocation.title}`);
    } else {
      const bounds = L.latLngBounds([pickupCoords, destCoords]);
      mapInstanceRef.current.fitBounds(bounds, {
        paddingTopLeft: [30, 40],
        paddingBottomRight: [30, resolvedBottomPadding]
      });
      onToast?.('Route re-centered');
    }
  };

  return (
    <div className={`relative ${className} select-none overflow-hidden skyppy-osm-container`}>
      {/* Leaflet Map DOM Node */}
      <div ref={containerRef} className="w-full h-full bg-[#f4f6fa] skyppy-osm-tiles" />

      {/* Real-Time Mobility Corridor Pill */}
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

          {/* Follow Driver Lock Toggle */}
          {(mode === 'live-tracking' || mode === 'shared-tracking') && (
            <button
              type="button"
              aria-label={isFollowingVehicle ? 'Unlock free pan' : 'Lock follow driver'}
              onClick={() => {
                setIsFollowingVehicle(!isFollowingVehicle);
                onToast?.(isFollowingVehicle ? 'Camera unlocked: Free pan' : 'Camera locked: Following vehicle');
              }}
              className={`w-9 h-9 rounded-full shadow-md border backdrop-blur-md flex items-center justify-center transition-all active:scale-95 cursor-pointer ${
                isFollowingVehicle
                  ? 'bg-[#0042dd] text-white border-blue-400'
                  : 'bg-white/90 text-slate-700 border-slate-200 hover:bg-white'
              }`}
              title={isFollowingVehicle ? 'Camera locked to vehicle' : 'Free camera'}
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
