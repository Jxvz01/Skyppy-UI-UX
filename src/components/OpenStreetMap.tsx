import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

export interface OpenStreetMapProps {
  stepIndex: number;
  speed: number;
  driverName: string;
  vehicleCategory?: string;
  isTrafficOn?: boolean;
  onToast?: (msg: string) => void;
  className?: string;
}

// Real GPS Coordinates across Mysuru, Karnataka
const VVCE_PICKUP: [number, number] = [12.3364, 76.6213]; // Gokulam 3rd Stage
const JSS_DESTINATION: [number, number] = [12.3392, 76.6575]; // Bannimantap

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
  stepIndex,
  speed,
  driverName,
  vehicleCategory = 'auto',
  isTrafficOn = true,
  onToast,
  className = 'w-full h-full'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const vehicleMarkerRef = useRef<L.Marker | null>(null);
  const trafficLinesRef = useRef<L.Polyline[]>([]);
  const [mapReady, setMapReady] = useState(false);

  const getVehicleIconName = () => {
    const cat = vehicleCategory.toLowerCase();
    if (cat === 'auto') return 'electric_rickshaw';
    if (cat === 'suv') return 'airport_shuttle';
    return 'directions_car';
  };

  const currentStep = STEP_POSITIONS[stepIndex] || STEP_POSITIONS[0];

  // Initialize Leaflet Map with OpenStreetMap / Carto Tiles
  useEffect(() => {
    if (!containerRef.current || mapInstanceRef.current) return;

    try {
      const map = L.map(containerRef.current, {
        center: [12.3340, 76.6394],
        zoom: 14,
        zoomControl: false,
        attributionControl: false
      });

      // Official OpenStreetMap TileLayer (100% Free, No API Key Required)
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Route polyline (Glowing underlay + Core blue track)
      L.polyline(ROUTE_WAYPOINTS, {
        color: '#2563eb',
        weight: 12,
        opacity: 0.25,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      L.polyline(ROUTE_WAYPOINTS, {
        color: '#2563eb',
        weight: 5,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      // Pickup Origin Marker (VVCE Gokulam)
      const pickupIcon = L.divIcon({
        className: 'custom-osm-pickup',
        html: `
          <div class="relative flex flex-col items-center">
            <div class="w-7 h-7 rounded-full bg-emerald-500/25 animate-ping absolute -top-1"></div>
            <div class="w-6 h-6 rounded-full bg-emerald-500 border-2 border-white shadow-lg flex items-center justify-center text-white">
              <span class="w-2 h-2 rounded-full bg-white"></span>
            </div>
            <div class="mt-1 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-bold shadow-md whitespace-nowrap">
              VVCE Gate 2
            </div>
          </div>
        `,
        iconSize: [80, 48],
        iconAnchor: [40, 24]
      });

      L.marker(VVCE_PICKUP, { icon: pickupIcon }).addTo(map);

      // Destination Marker (JSS Medical College)
      const destIcon = L.divIcon({
        className: 'custom-osm-dest',
        html: `
          <div class="relative flex flex-col items-center">
            <div class="w-7 h-7 rounded-full bg-red-500/25 animate-ping absolute -top-1"></div>
            <div class="w-6 h-6 rounded-full bg-red-600 border-2 border-white shadow-lg flex items-center justify-center text-white">
              <span class="w-2 h-2 rounded-full bg-white"></span>
            </div>
            <div class="mt-1 px-2 py-0.5 rounded-full bg-slate-900 text-white text-[9px] font-bold shadow-md whitespace-nowrap">
              JSS Hospital
            </div>
          </div>
        `,
        iconSize: [80, 48],
        iconAnchor: [40, 24]
      });

      L.marker(JSS_DESTINATION, { icon: destIcon }).addTo(map);

      // Initial Vehicle Marker
      const initialStep = STEP_POSITIONS[0];
      const vehicleDivIcon = L.divIcon({
        className: 'custom-osm-vehicle',
        html: `
          <div class="relative flex flex-col items-center">
            <div class="w-10 h-10 rounded-full bg-primary/25 animate-ping absolute -top-1"></div>
            <div class="w-10 h-10 rounded-full bg-white shadow-xl border-2 border-primary flex items-center justify-center ring-2 ring-primary/20" style="transform: rotate(${initialStep.heading}deg)">
              <span class="material-symbols-outlined text-[20px] text-primary">${getVehicleIconName()}</span>
            </div>
            <div class="mt-1 px-2.5 py-0.5 rounded-full bg-slate-900/90 text-white text-[9.5px] font-bold shadow-lg whitespace-nowrap flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>${driverName.split(' ')[0]}</span>
              <span class="text-slate-400">•</span>
              <span class="text-amber-300 font-mono">${speed} km/h</span>
            </div>
          </div>
        `,
        iconSize: [110, 56],
        iconAnchor: [55, 28]
      });

      vehicleMarkerRef.current = L.marker(initialStep.pos, {
        icon: vehicleDivIcon,
        zIndexOffset: 1000
      }).addTo(map);

      // Fit bounds to show entire Mysuru transit corridor
      const bounds = L.latLngBounds([VVCE_PICKUP, JSS_DESTINATION]);
      map.fitBounds(bounds, { padding: [50, 50] });

      mapInstanceRef.current = map;
      setMapReady(true);

      // Ensure proper sizing after DOM render
      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    } catch (e) {
      console.warn('Leaflet OpenStreetMap initialization warning:', e);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update vehicle position, heading, and telemetry when stepIndex or speed updates
  useEffect(() => {
    if (!mapInstanceRef.current || !vehicleMarkerRef.current) return;

    vehicleMarkerRef.current.setLatLng(currentStep.pos);

    const vehicleDivIcon = L.divIcon({
      className: 'custom-osm-vehicle',
      html: `
        <div class="relative flex flex-col items-center">
          <div class="w-10 h-10 rounded-full bg-primary/25 animate-ping absolute -top-1"></div>
          <div class="w-10 h-10 rounded-full bg-white shadow-xl border-2 border-primary flex items-center justify-center ring-2 ring-primary/20" style="transform: rotate(${currentStep.heading}deg)">
            <span class="material-symbols-outlined text-[20px] text-primary">${getVehicleIconName()}</span>
          </div>
          <div class="mt-1 px-2.5 py-0.5 rounded-full bg-slate-900/90 text-white text-[9.5px] font-bold shadow-lg whitespace-nowrap flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>${driverName.split(' ')[0]}</span>
            <span class="text-slate-400">•</span>
            <span class="text-amber-300 font-mono">${speed} km/h</span>
            <span class="text-slate-400">•</span>
            <span class="text-slate-200">${currentStep.street}</span>
          </div>
        </div>
      `,
      iconSize: [130, 56],
      iconAnchor: [65, 28]
    });

    vehicleMarkerRef.current.setIcon(vehicleDivIcon);

    // Pan smoothly to vehicle if on ride
    if (stepIndex >= 2 && stepIndex < 4) {
      mapInstanceRef.current.panTo(currentStep.pos, { animate: true, duration: 0.6 });
    }
  }, [stepIndex, speed, driverName, vehicleCategory, currentStep]);

  // Traffic Layer Toggle
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear old traffic polylines
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
  }, [isTrafficOn, mapReady]);

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
    mapInstanceRef.current.panTo(currentStep.pos, { animate: true, duration: 0.5 });
    onToast?.(`Centered on ${driverName} (${currentStep.street})`);
  };

  return (
    <div className={`relative ${className} select-none overflow-hidden`}>
      {/* Leaflet Map DOM Node */}
      <div ref={containerRef} className="w-full h-full bg-[#f4f6fa]" />

      {/* Top Demo Simulation Status Pill */}
      <div className="absolute top-3.5 left-3.5 z-[400] flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-slate-200/80 pointer-events-auto">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span className="text-[11px] font-bold text-slate-800 tracking-tight">
          Live Transit • Mysuru Central
        </span>
      </div>

      {/* OpenStreetMap Attribution Watermark */}
      <div className="absolute bottom-1 left-2 z-[400] bg-white/80 backdrop-blur-xs px-2 py-0.5 rounded text-[8.5px] text-slate-500 font-medium">
        © <span className="font-semibold text-slate-700">OpenStreetMap</span>
      </div>

      {/* Floating Map Controls Column */}
      <div className="absolute right-3.5 bottom-5 z-[400] flex flex-col gap-2 pointer-events-auto">
        {/* North Compass Rose */}
        <div
          className="w-9 h-9 rounded-full bg-white text-slate-700 shadow-md border border-slate-200/80 flex items-center justify-center font-black text-[11px] select-none"
          title="Orientation: North"
        >
          <span className="text-red-500 font-bold">N</span>
        </div>

        {/* Zoom In */}
        <button
          type="button"
          aria-label="Zoom in map"
          onClick={handleZoomIn}
          className="w-9 h-9 rounded-full bg-white text-slate-700 shadow-md border border-slate-200/80 flex items-center justify-center hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
        </button>

        {/* Zoom Out */}
        <button
          type="button"
          aria-label="Zoom out map"
          onClick={handleZoomOut}
          className="w-9 h-9 rounded-full bg-white text-slate-700 shadow-md border border-slate-200/80 flex items-center justify-center hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">remove</span>
        </button>

        {/* Recenter Map */}
        <button
          type="button"
          aria-label="Recenter map"
          onClick={handleRecenter}
          className="w-9 h-9 rounded-full bg-white text-primary shadow-md border border-slate-200/80 flex items-center justify-center hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">my_location</span>
        </button>
      </div>
    </div>
  );
};
