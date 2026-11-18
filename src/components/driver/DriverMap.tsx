import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useDriverStore } from '../../store/useDriverStore';

interface DriverMapProps {
  className?: string;
  showTurnBanner?: boolean;
}

export const DriverMap: React.FC<DriverMapProps> = ({
  className = 'w-full h-full',
  showTurnBanner = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const driverMarkerRef = useRef<L.Marker | null>(null);
  const targetMarkerRef = useRef<L.Marker | null>(null);

  const { driverStatus, activeRequest } = useDriverStore();
  const [currentSpeed] = useState(28);

  const isNavigatingToPickup = driverStatus === 'NAVIGATING_TO_PICKUP';
  const isNavigatingToDest = driverStatus === 'NAVIGATING_TO_DESTINATION' || driverStatus === 'TRIP_STARTED';
  const isTripActive = isNavigatingToPickup || isNavigatingToDest;

  // Real Mysuru Coordinates
  // Driver current location near Gokulam / Temple Road
  const driverPos: [number, number] = [12.3335, 76.6265];
  // Pickup: VVCE Campus Gate 2
  const pickupPos: [number, number] = [
    activeRequest?.pickup?.lat || 12.3364,
    activeRequest?.pickup?.lng || 76.6213
  ];
  // Destination: Mysuru Railway Station
  const destPos: [number, number] = [
    activeRequest?.destination?.lat || 12.3168,
    activeRequest?.destination?.lng || 76.6436
  ];

  // Route Waypoints for Navigating
  const routeToPickup: [number, number][] = [
    driverPos,
    [12.3348, 76.6242], // Temple Rd
    [12.3358, 76.6225], // Gokulam 3rd stage
    pickupPos           // VVCE
  ];

  const routeToDest: [number, number][] = [
    pickupPos,
    [12.3348, 76.6242], // Kalidasa Rd
    [12.3325, 76.6288], // Temple Rd Jn
    [12.3282, 76.6355], // KRS Road Jn
    [12.3228, 76.6425], // Cheluvamba Park
    destPos             // Railway Station
  ];

  // Initialize Leaflet Map
  useEffect(() => {
    if (!containerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const centerPos: [number, number] = isNavigatingToDest
      ? pickupPos
      : isNavigatingToPickup
      ? driverPos
      : [12.3325, 76.6355];

    const map = L.map(containerRef.current, {
      center: centerPos,
      zoom: isTripActive ? 15 : 14,
      zoomControl: false,
      attributionControl: false
    });

    // High quality OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c']
    }).addTo(map);

    mapInstanceRef.current = map;

    // Driver Vehicle Custom Marker
    const vehicleIcon = L.divIcon({
      className: 'driver-vehicle-marker',
      html: `
        <div style="width: 42px; height: 42px; background: #0042dd; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 4px 14px rgba(0,66,221,0.5); display: flex; align-items: center; justify-content: center; color: #ffffff;">
          <span class="material-symbols-outlined" style="font-size: 24px; font-variation-settings: 'FILL' 1;">directions_car</span>
        </div>
      `,
      iconSize: [42, 42],
      iconAnchor: [21, 21]
    });

    const driverMarker = L.marker(driverPos, { icon: vehicleIcon, zIndexOffset: 1000 }).addTo(map);
    driverMarkerRef.current = driverMarker;

    // Add Route Polyline if trip is active
    const activeRoute = isNavigatingToDest ? routeToDest : isNavigatingToPickup ? routeToPickup : null;

    if (activeRoute) {
      // Background glow line
      L.polyline(activeRoute, {
        color: '#0042dd',
        weight: 8,
        opacity: 0.25,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      // Primary navigation route line
      const polyline = L.polyline(activeRoute, {
        color: '#0042dd',
        weight: 5,
        opacity: 0.95,
        dashArray: '1, 10',
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);
      routePolylineRef.current = polyline;

      // Target pin (Pickup or Destination)
      const targetPos = isNavigatingToDest ? destPos : pickupPos;
      const targetLabel = isNavigatingToDest ? 'Destination' : 'Pickup';
      const targetColor = isNavigatingToDest ? '#ba1a1a' : '#546500';

      const targetIcon = L.divIcon({
        className: 'target-pin-marker',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="background: ${targetColor}; color: white; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: bold; box-shadow: 0 2px 8px rgba(0,0,0,0.25); white-space: nowrap; margin-bottom: 2px;">
              ${targetLabel}
            </div>
            <div style="width: 14px; height: 14px; background: ${targetColor}; border: 2px solid white; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>
          </div>
        `,
        iconSize: [70, 38],
        iconAnchor: [35, 38]
      });

      const targetMarker = L.marker(targetPos, { icon: targetIcon }).addTo(map);
      targetMarkerRef.current = targetMarker;

      map.fitBounds(L.latLngBounds(activeRoute), { padding: [60, 60] });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [driverStatus, isNavigatingToDest, isNavigatingToPickup]);

  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView(isNavigatingToDest ? destPos : driverPos, 16, { animate: true });
  };

  return (
    <div className={`relative ${className} overflow-hidden select-none`}>
      {/* Map DOM Container */}
      <div ref={containerRef} className="w-full h-full z-0 bg-[#e8ecf2]" />

      {/* Turn-by-Turn Driving Banner (Active Trips) */}
      {showTurnBanner && isTripActive && (
        <div className="absolute top-3 left-3 right-3 z-20 pointer-events-auto">
          <div className="bg-[#101c2b] text-white p-3.5 rounded-2xl shadow-xl border border-slate-700/80 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              {/* Turn direction arrow */}
              <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-white shrink-0 shadow-md">
                <span className="material-symbols-outlined text-[28px] font-bold">
                  {isNavigatingToDest ? 'turn_right' : 'turn_left'}
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base font-extrabold text-[#d4f84c] tracking-tight">
                    {isNavigatingToDest ? 'In 350m' : 'In 200m'}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {isNavigatingToDest ? 'Turn right' : 'Turn left'}
                  </span>
                </div>
                <span className="text-xs font-bold text-white truncate">
                  {isNavigatingToDest ? 'Kalidasa Rd / Temple Rd Junction' : 'Onto Temple Rd towards VVCE'}
                </span>
              </div>
            </div>

            {/* Speed & ETA Pill */}
            <div className="flex flex-col items-end shrink-0 pl-2 border-l border-slate-700/80">
              <span className="text-xs font-bold text-white">
                {isNavigatingToDest ? '12 min' : '3 min'}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {isNavigatingToDest ? '4.8 km' : '0.8 km'}
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 font-bold mt-0.5">
                {currentSpeed} km/h
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Recenter & Map Controls Button */}
      <div className="absolute bottom-4 right-3 z-20 flex flex-col gap-2">
        <button
          type="button"
          onClick={handleRecenter}
          aria-label="Recenter map"
          className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-slate-50 transition-colors active:scale-95"
          title="Recenter Vehicle"
        >
          <span className="material-symbols-outlined text-[20px] text-primary">my_location</span>
        </button>
      </div>
    </div>
  );
};
