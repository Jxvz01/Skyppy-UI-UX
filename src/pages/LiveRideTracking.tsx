import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { OpenStreetMap } from '../components/OpenStreetMap';
import { useAppStore } from '../store/useAppStore';
import { translations } from '../utils/i18n';

export const LiveRideTracking: React.FC = () => {
  const navigate = useNavigate();
  const { activeBooking, cancelBooking, openModal, showToast, language } = useAppStore();
  const t = translations[language] || translations.en;

  const [mapMode, setMapMode] = useState<'osm' | 'vector'>('osm');
  const [stepIndex, setStepIndex] = useState(0); // 0: Assigned, 1: Approaching, 2: Arrived at Pickup, 3: On Ride, 4: Arrived
  const [speed, setSpeed] = useState(24);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Driver taking too long');
  const [isTrafficOn, setIsTrafficOn] = useState(true);
  const [isAutoSimulating, setIsAutoSimulating] = useState(false);
  const [markerOffset, setMarkerOffset] = useState({ x: 0, y: 0 });

  const booking = activeBooking || {
    bookingId: 'SKY784392',
    fare: 76,
    otp: '4891',
    startOtp: '5482',
    vehicleName: 'Auto Rickshaw',
    driver: {
      name: 'Ramesh K.',
      phone: '+91 98765 43210',
      rating: '4.8',
      plate: 'KA-09 AB 4217',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFC_47gt-3lPsOkq5tq9A1wWjAanAGLT6QZO8F3aTw1LfNOksrrxtXPF71CGQ_FJ7pd2LCtqBQDSpXdXwOpey0sE6qNx6fucroCvNH0h6iro5jb2ysLyvNzFo1738hYjEHq4Swjk-8vLvooNWxWoVptliHy445jMIRy5KQxPdsJiOuxf15CvmmGzGTG3p2hxjjR4GDmV5Xy9khm4tVw1cxiuqqOxQX-FwykOSgEZM'
    },
    pickup: { title: 'VVCE Gokulam', address: 'Mysuru, Karnataka' },
    destination: { title: 'JSS Medical College', address: 'Bannimantap, Mysuru', distanceKm: 4.2 }
  };

  const [zoomLevel, setZoomLevel] = useState(1);

  // Vehicle category resolution
  const vehicleCatId = (activeBooking?.vehicleId || 'auto').toLowerCase();
  const getVehicleIcon = () => {
    if (vehicleCatId === 'auto') return 'electric_rickshaw';
    if (vehicleCatId === 'suv') return 'airport_shuttle';
    return 'directions_car';
  };

  // Step-dependent telemetry with Mysuru street coordinates and road heading
  const stepConfig = [
    { label: 'Assigned', eta: 4, speed: 22, title: 'Driver Assigned', desc: 'Ramesh K. is heading to your pickup location', x: 120, y: 290, heading: 245, street: 'Kalidasa Rd' },
    { label: 'Approaching', eta: 2, speed: 28, title: 'Driver Approaching', desc: 'Auto KA-09 AB 4217 is 500m away', x: 95, y: 300, heading: 245, street: 'Temple Rd, Gokulam' },
    { label: 'At Pickup', eta: 0, speed: 0, title: 'Driver Arrived', desc: 'Driver is outside VVCE Gate 2! Share Start OTP', x: 75, y: 310, heading: 35, street: 'VVCE Campus Gate 2' },
    { label: 'On Ride', eta: 8, speed: 34, title: 'Trip In Progress', desc: 'En route to JSS Medical College', x: 205, y: 215, heading: 45, street: 'Sayyaji Rao Rd' },
    { label: 'Completed', eta: 0, speed: 0, title: 'Trip Finished', desc: 'Arrived safely at destination', x: 308, y: 95, heading: 40, street: 'JSS Hospital Bannimantap' }
  ];

  const currentStep = stepConfig[stepIndex] || stepConfig[0];

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.15, 1.45));
    showToast('Map zoomed in');
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.15, 0.85));
    showToast('Map zoomed out');
  };

  const handleRecenter = () => {
    setZoomLevel(1);
    showToast(`Map centered on ${booking.driver.name} (${currentStep.street})`);
  };

  // Auto-simulation timer
  useEffect(() => {
    if (!isAutoSimulating) return;
    const timer = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < 4) {
          return prev + 1;
        } else {
          setIsAutoSimulating(false);
          openModal('tripCompleted');
          return prev;
        }
      });
    }, 4500);
    return () => clearInterval(timer);
  }, [isAutoSimulating, openModal]);

  // If user reaches step 4 manually, trigger trip completion
  useEffect(() => {
    if (stepIndex === 4) {
      const t = setTimeout(() => {
        openModal('tripCompleted');
      }, 600);
      return () => clearTimeout(t);
    }
  }, [stepIndex, openModal]);

  // Marker road jitter
  useEffect(() => {
    const offsets = [
      { x: 0, y: 0 },
      { x: 4, y: -3 },
      { x: -2, y: 5 },
      { x: 2, y: -2 }
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % offsets.length;
      setMarkerOffset(offsets[i]);
      if (currentStep.speed > 0) {
        setSpeed(Math.floor(currentStep.speed + (Math.random() * 6 - 3)));
      } else {
        setSpeed(0);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [currentStep.speed]);

  const handleConfirmCancel = () => {
    cancelBooking(cancelReason);
    setIsCancelModalOpen(false);
    navigate('/activity');
  };

  return (
    <div className="flex-1 flex flex-col relative w-full bg-surface min-h-full">
      <Header type="stack" title={t.trackingHeader} backTo="/" />

      <main className="flex flex-col w-full relative pb-8">
        {/* High-Fidelity Mobility Map Canvas (OpenStreetMap Tiles + Vector Mode) */}
        <div className="relative w-full h-[390px] overflow-hidden rounded-b-3xl bg-[#f4f6fa] shadow-md border-b border-slate-200/60 select-none">
          {mapMode === 'osm' ? (
            <OpenStreetMap
              stepIndex={stepIndex}
              speed={speed}
              driverName={booking.driver.name}
              vehicleCategory={booking.vehicleName}
              isTrafficOn={isTrafficOn}
              onToast={showToast}
              className="w-full h-full"
            />
          ) : (
            /* Zoomable & Pannable Vector Map Layer */
            <div
              className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: '50% 50%'
              }}
            >
              {/* SVG Vector Map of Mysuru */}
              <svg
                className="w-full h-full pointer-events-none"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 393 380"
              >
              <defs>
                {/* Active Route Glow */}
                <linearGradient id="routeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="70%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#60a5fa" />
                </linearGradient>

                {/* Kukkarahalli Lake Gradient */}
                <linearGradient id="lakeWater" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e0f2fe" />
                  <stop offset="100%" stopColor="#bae6fd" />
                </linearGradient>

                {/* Shadow Filters */}
                <filter id="mapShadow" x="-10%" y="-10%" width="130%" height="130%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.08" />
                </filter>
              </defs>

              {/* Background Base Terrain */}
              <rect width="393" height="380" fill="#f8fafc" />

              {/* Subtle Urban Blocks / Residential Neighbourhoods */}
              <g fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="0.8">
                {/* Gokulam Blocks */}
                <rect x="25" y="240" width="45" height="25" rx="4" />
                <rect x="25" y="275" width="45" height="30" rx="4" />
                <rect x="80" y="240" width="45" height="30" rx="4" />
                <rect x="80" y="320" width="50" height="35" rx="4" />

                {/* Yadavagiri Blocks */}
                <rect x="135" y="180" width="40" height="45" rx="4" />
                <rect x="185" y="145" width="50" height="35" rx="4" />

                {/* Mandi Mohalla / Tilak Nagar Blocks */}
                <rect x="235" y="165" width="55" height="40" rx="4" />
                <rect x="245" y="215" width="45" height="20" rx="4" />

                {/* Bannimantap Industrial & Medical Hub */}
                <rect x="270" y="55" width="60" height="30" rx="4" />
                <rect x="335" y="65" width="45" height="45" rx="4" />
              </g>

              {/* Green Spaces & Heritage Preserves */}
              {/* Cheluvamba Park */}
              <g>
                <path
                  d="M 125,235 C 135,225 170,230 175,260 C 175,275 155,280 135,275 C 120,270 120,245 125,235 Z"
                  fill="#dcfce7"
                  stroke="#86efac"
                  strokeWidth="1.2"
                />
                <circle cx="140" cy="248" r="3" fill="#22c55e" opacity="0.6" />
                <circle cx="152" cy="255" r="4" fill="#22c55e" opacity="0.6" />
                <text x="133" y="267" fill="#15803d" fontSize="7" fontWeight="700">Cheluvamba Park</text>
              </g>

              {/* Mysuru Palace Heritage Precinct */}
              <g>
                <path
                  d="M 245,235 C 265,230 305,235 315,255 C 315,275 290,285 260,282 C 245,280 240,245 245,235 Z"
                  fill="#fef3c7"
                  stroke="#fde68a"
                  strokeWidth="1.2"
                />
                <text x="254" y="255" fill="#b45309" fontSize="7.5" fontWeight="700">Mysuru Palace</text>
                <text x="254" y="265" fill="#d97706" fontSize="6.5" fontWeight="600">Heritage Ward</text>
              </g>

              {/* Kukkarahalli Lake */}
              <g>
                <path
                  d="M 230,305 C 260,285 315,295 345,325 C 365,345 355,375 320,380 C 275,385 235,355 230,305 Z"
                  fill="url(#lakeWater)"
                  stroke="#93c5fd"
                  strokeWidth="1.5"
                />
                <path d="M 270,325 Q 285,320 300,325" fill="none" stroke="#60a5fa" strokeWidth="1" opacity="0.5" />
                <path d="M 265,345 Q 280,340 295,345" fill="none" stroke="#60a5fa" strokeWidth="1" opacity="0.5" />
                <text x="262" y="338" fill="#0284c7" fontSize="7.5" fontWeight="800" letterSpacing="0.04em">KUKKARAHALLI LAKE</text>
              </g>

              {/* Mysuru Junction Railway Tracks */}
              <g opacity="0.7">
                <line x1="165" y1="180" x2="235" y2="280" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="4 3" />
                <text x="168" y="222" fill="#64748b" fontSize="6.5" fontWeight="700">Mysuru Jn</text>
              </g>

              {/* Secondary Street Road Grid (White with subtle border) */}
              <g fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round">
                {/* Secondary Street Outlines */}
                <g stroke="#e2e8f0" strokeWidth="5.5">
                  <path d="M 25,270 L 125,270" />
                  <path d="M 125,190 L 180,210" />
                  <path d="M 180,240 L 260,230" />
                  <path d="M 220,195 L 300,185" />
                  <path d="M 265,145 L 340,150" />
                  <path d="M 60,350 L 60,250" />
                  <path d="M 110,320 L 110,240" />
                  <path d="M 300,60 L 300,140" />
                </g>
                {/* Secondary Street Fill */}
                <g strokeWidth="4">
                  <path d="M 25,270 L 125,270" />
                  <path d="M 125,190 L 180,210" />
                  <path d="M 180,240 L 260,230" />
                  <path d="M 220,195 L 300,185" />
                  <path d="M 265,145 L 340,150" />
                  <path d="M 60,350 L 60,250" />
                  <path d="M 110,320 L 110,240" />
                  <path d="M 300,60 L 300,140" />
                </g>
              </g>

              {/* Primary Arterial Road Corridors */}
              <g fill="none" strokeLinecap="round" strokeLinejoin="round">
                {/* Arterial Road Outer Borders */}
                <g stroke="#cbd5e1" strokeWidth="10">
                  {/* Outer Ring Road Bypass */}
                  <path d="M -15,45 Q 185,15 415,35" />
                  {/* KRS Road */}
                  <path d="M 15,225 L 75,310 L 135,285 L 180,240" />
                  {/* Kalidasa Road */}
                  <path d="M 15,345 L 75,310 L 135,285 L 195,270" />
                  {/* Sayyaji Rao Road Corridor */}
                  <path d="M 135,285 L 180,240 L 220,195 L 265,145 L 308,95 L 365,70" />
                </g>

                {/* Arterial Road White Centers */}
                <g stroke="#ffffff" strokeWidth="7">
                  <path d="M -15,45 Q 185,15 415,35" />
                  <path d="M 15,225 L 75,310 L 135,285 L 180,240" />
                  <path d="M 15,345 L 75,310 L 135,285 L 195,270" />
                  <path d="M 135,285 L 180,240 L 220,195 L 265,145 L 308,95 L 365,70" />
                </g>
              </g>

              {/* Street Names and Directional Signage */}
              <g fontFamily="system-ui, -apple-system, sans-serif" fontSize="7" fontWeight="600" fill="#64748b">
                <text x="155" y="25" letterSpacing="0.08em">OUTER RING ROAD</text>
                <text x="35" y="330">Kalidasa Rd</text>
                <text x="42" y="260">KRS Road</text>
                <text x="215" y="215" transform="rotate(-48 215 215)" fill="#475569" fontWeight="700">Sayyaji Rao Road</text>
                <text x="285" y="112">Bannimantap</text>
                <text x="45" y="295" fontSize="6.5" fill="#94a3b8">Gokulam 3rd Stg</text>
              </g>

              {/* Dynamic Live Traffic Flow Layer (Toggleable) */}
              {isTrafficOn && (
                <g fill="none" strokeLinecap="round" opacity="0.85">
                  {/* Free-flow green on KRS Rd */}
                  <path d="M 20,230 L 75,310" stroke="#22c55e" strokeWidth="3" />
                  {/* Free-flow green on Bannimantap approaching JSS */}
                  <path d="M 268,142 L 308,95 L 350,75" stroke="#22c55e" strokeWidth="3" />
                  {/* Moderate amber flow along Sayyaji Rao Rd & Station intersection */}
                  <path d="M 138,282 L 180,240 L 218,197" stroke="#f59e0b" strokeWidth="3.2" />
                </g>
              )}

              {/* Active Journey Route: VVCE Gokulam -> JSS Medical College */}
              <g fill="none" strokeLinecap="round" strokeLinejoin="round">
                {/* Ambient Soft Glow Underlay */}
                <path
                  d="M 75,310 L 135,285 L 180,240 L 220,195 L 265,145 L 308,95"
                  stroke="#2563eb"
                  strokeWidth="13"
                  opacity="0.22"
                />
                {/* Core Vibrant Skyppy Blue Path */}
                <path
                  d="M 75,310 L 135,285 L 180,240 L 220,195 L 265,145 L 308,95"
                  stroke="url(#routeGradient)"
                  strokeWidth="5.5"
                />
                {/* Directional Pulsing Chevron Dashes */}
                <path
                  d="M 75,310 L 135,285 L 180,240 L 220,195 L 265,145 L 308,95"
                  stroke="#ffffff"
                  strokeWidth="2.2"
                  strokeDasharray="4 8"
                  opacity="0.85"
                />
              </g>

              {/* Landmark Pins (Origin & Destination) */}
              {/* Pickup Origin: VVCE Gokulam Campus */}
              <g transform="translate(75, 310)">
                <circle cx="0" cy="0" r="14" fill="#10b981" fillOpacity="0.25" className="animate-ping" />
                <circle cx="0" cy="0" r="8" fill="#10b981" stroke="#ffffff" strokeWidth="2" filter="url(#mapShadow)" />
                <circle cx="0" cy="0" r="3" fill="#ffffff" />
                {/* Origin Label Tag */}
                <g transform="translate(-40, -22)">
                  <rect x="0" y="0" width="80" height="17" rx="8.5" fill="#10b981" filter="url(#mapShadow)" />
                  <text x="40" y="11" fill="#ffffff" fontSize="7.5" fontWeight="700" textAnchor="middle">
                    VVCE Gate 2
                  </text>
                </g>
              </g>

              {/* Destination: JSS Medical College & Hospital */}
              <g transform="translate(308, 95)">
                <circle cx="0" cy="0" r="14" fill="#ba1a1a" fillOpacity="0.22" className="animate-ping" />
                <circle cx="0" cy="0" r="8" fill="#ba1a1a" stroke="#ffffff" strokeWidth="2" filter="url(#mapShadow)" />
                <circle cx="0" cy="0" r="3" fill="#ffffff" />
                {/* Destination Label Tag */}
                <g transform="translate(-48, -24)">
                  <rect x="0" y="0" width="96" height="18" rx="9" fill="#1e293b" filter="url(#mapShadow)" />
                  <text x="48" y="12" fill="#ffffff" fontSize="7.5" fontWeight="700" textAnchor="middle">
                    JSS Hospital
                  </text>
                </g>
              </g>
            </svg>

            {/* Dynamic Interactive Driver Vehicle Marker */}
            <div
              className="absolute z-30 transition-all duration-700 ease-out flex flex-col items-center pointer-events-none"
              style={{
                top: `${(currentStep.y / 380) * 100}%`,
                left: `${(currentStep.x / 393) * 100}%`,
                transform: `translate(calc(-50% + ${markerOffset.x}px), calc(-50% + ${markerOffset.y}px))`
              }}
            >
              {/* Radar Wave Ping */}
              <div className="absolute w-12 h-12 rounded-full bg-primary/25 animate-ping -z-10" />

              {/* Vehicle Compass Avatar (Rotates with road orientation) */}
              <div
                className="w-11 h-11 rounded-full bg-white shadow-xl border-2 border-primary flex items-center justify-center transition-transform duration-500 ring-2 ring-primary/20"
                style={{ transform: `rotate(${currentStep.heading}deg)` }}
              >
                <span className="material-symbols-outlined text-[23px] text-primary select-none">
                  {getVehicleIcon()}
                </span>
              </div>

              {/* Floating Speed & Telemetry Tooltip */}
              <div className="mt-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 backdrop-blur-md shadow-lg whitespace-nowrap border border-slate-700/60 pointer-events-auto">
                <span className="text-[10px] font-bold text-white tracking-tight flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{booking.driver.name.split(' ')[0]}</span>
                  <span className="text-slate-400">•</span>
                  <span className="font-mono text-amber-300 font-bold">{speed} km/h</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-200 font-medium">{currentStep.street}</span>
                </span>
              </div>
            </div>
            </div>
          )}

          {/* Floating Arrival Countdown Pill (Global on both OSM & Vector) */}
          <div className="absolute top-3.5 right-3.5 z-[450] pointer-events-auto">
            <div className="bg-primary text-white px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5 border border-white/20">
              <span className="material-symbols-outlined text-[17px]">timer</span>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase leading-none font-bold text-blue-100">
                  {stepIndex >= 3 ? 'Dest. ETA' : 'Arriving in'}
                </span>
                <span className="text-xs font-black leading-tight">
                  {currentStep.eta > 0 ? `${currentStep.eta} min` : 'Arrived'}
                </span>
              </div>
            </div>
          </div>

          {/* Map Layer Switch Pill (Toggle OpenStreetMap / Vector Map) */}
          <button
            type="button"
            onClick={() => {
              const next = mapMode === 'osm' ? 'vector' : 'osm';
              setMapMode(next);
              showToast(next === 'osm' ? 'Switched to OpenStreetMap live tiles' : 'Switched to daylight vector map');
            }}
            className="absolute top-14 right-3.5 z-[450] px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md shadow-md border border-slate-200/80 flex items-center gap-1 text-[10px] font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-95 cursor-pointer pointer-events-auto"
          >
            <span className="material-symbols-outlined text-[14px] text-primary">
              {mapMode === 'osm' ? 'layers' : 'public'}
            </span>
            <span>{mapMode === 'osm' ? 'OpenStreetMap' : 'Vector Map'}</span>
          </button>

          {/* Vector Map Controls (Only when in vector mode; OSM has native controls) */}
          {mapMode === 'vector' && (
            <div className="absolute right-3.5 bottom-5 z-20 flex flex-col gap-2">
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

              {/* Toggle Live Traffic */}
              <button
                type="button"
                aria-label="Toggle Traffic"
                onClick={() => {
                  setIsTrafficOn(!isTrafficOn);
                  showToast(isTrafficOn ? 'Traffic layer disabled' : 'Live traffic flow layer enabled');
                }}
                className={`w-9 h-9 rounded-full shadow-md border flex items-center justify-center transition-all active:scale-95 cursor-pointer ${
                  isTrafficOn
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-300'
                    : 'bg-white text-slate-400 border-slate-200/80'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">traffic</span>
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Status Notification Banner */}
        <div className="px-margin -mt-3 relative z-30">
          <div
            className={`p-3.5 rounded-2xl shadow-md flex items-center justify-between transition-colors ${
              stepIndex === 2
                ? 'bg-secondary-container text-on-secondary-container border border-secondary'
                : 'bg-primary-container text-on-primary'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="material-symbols-outlined text-[22px] shrink-0">
                {stepIndex === 2 ? 'waving_hand' : 'near_me'}
              </span>
              <div className="min-w-0">
                <h4 className="font-headline font-bold text-sm truncate">{currentStep.title}</h4>
                <p className="text-xs opacity-90 truncate">{currentStep.desc}</p>
              </div>
            </div>

            {/* Auto-Simulation Trigger Toggle */}
            <button
              type="button"
              onClick={() => {
                setIsAutoSimulating(!isAutoSimulating);
                showToast(isAutoSimulating ? 'Simulation paused' : 'Auto-advancing ride demo...');
              }}
              className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 transition-all ${
                isAutoSimulating
                  ? 'bg-white text-black shadow-md'
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
            >
              {isAutoSimulating ? 'Pause' : 'Auto-Play'}
            </button>
          </div>
        </div>

        {/* Live Trip Command Sheet */}
        <div className="px-margin pt-4 flex flex-col gap-space-md">
          <div className="bg-surface-container-lowest rounded-3xl p-space-md shadow-xl flex flex-col gap-space-md">
            {/* Driver Profile & Direct Contacts */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-sm min-w-0">
                <div className="relative flex-shrink-0">
                  <img
                    className="w-14 h-14 rounded-full object-cover shadow-sm bg-slate-100"
                    src={booking.driver.avatar}
                    alt={booking.driver.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='32' fill='%232563eb'/%3E%3Ctext x='32' y='38' fill='white' font-size='22' font-family='sans-serif' font-weight='bold' text-anchor='middle'%3E" + (booking.driver.name.slice(0, 2).toUpperCase()) + "%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <div className="absolute -bottom-1 -right-1 bg-primary text-on-primary rounded-full w-5 h-5 flex items-center justify-center shadow">
                    <span className="material-symbols-outlined text-[13px]">verified</span>
                  </div>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h2 className="font-headline-md text-headline-md text-on-surface truncate font-bold">
                      {booking.driver.name}
                    </h2>
                    <span className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-[10px] font-bold">
                      PRO
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary fill-1">star</span>
                    <span className="font-numeric-md text-label-md text-on-surface font-bold">{booking.driver.rating}</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">(1,240 rides)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-space-xs flex-shrink-0">
                <a
                  href={`tel:${booking.driver.phone}`}
                  onClick={() => showToast(`Calling driver ${booking.driver.name}...`)}
                  className="w-11 h-11 rounded-full bg-surface-container-low text-primary flex items-center justify-center hover:bg-surface-container-high transition-transform active:scale-95 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[20px]">phone</span>
                </a>
                <button
                  type="button"
                  onClick={() => openModal('chat')}
                  className="w-11 h-11 rounded-full bg-primary text-on-primary flex items-center justify-center hover:bg-primary-container transition-transform active:scale-95 shadow-md"
                >
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                </button>
              </div>
            </div>

            {/* Vehicle Details & Start-Ride PIN Card */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-container-low">
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant font-semibold">
                  Vehicle Details
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-numeric-md text-numeric-md text-on-surface tracking-wider font-bold">
                    {booking.driver.plate}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">{booking.vehicleName || 'Auto'}</span>
                </div>
                <span className="font-body-sm text-[11px] text-tertiary">Verified Mysuru Commercial Transit</span>
              </div>

              {/* Start Ride OTP */}
              <div className="flex flex-col items-end pl-2">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">
                  Start OTP
                </span>
                <div className="px-3 py-1 rounded-xl bg-primary text-on-primary shadow-sm flex items-center justify-center mt-0.5">
                  <span className="font-numeric-xl text-numeric-xl tracking-widest text-on-primary font-bold">
                    {booking.startOtp || '5482'}
                  </span>
                </div>
              </div>
            </div>

            {/* 5-Stage Interactive Linear Simulation Stepper */}
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-outline">Simulated Progression</span>
                <span className="text-[11px] text-primary font-semibold">Tap stage to preview</span>
              </div>
              <div className="flex items-center justify-between text-center relative px-1">
                <div className="absolute left-6 right-6 top-3 h-1 bg-surface-container rounded-full -z-0"></div>
                <div
                  className="absolute left-6 top-3 h-1 bg-primary rounded-full -z-0 transition-all duration-500"
                  style={{ width: `${stepIndex * 25}%` }}
                ></div>

                {stepConfig.map((s, idx) => {
                  const isPastOrCurrent = idx <= stepIndex;
                  return (
                    <div
                      key={s.label}
                      onClick={() => setStepIndex(idx)}
                      className="flex flex-col items-center gap-1 z-10 cursor-pointer group"
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-all ${
                          isPastOrCurrent ? 'bg-primary text-on-primary scale-105' : 'bg-surface-container text-on-surface-variant'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          {idx === 0 ? 'near_me' : idx === 1 ? 'electric_rickshaw' : idx === 2 ? 'pin_drop' : idx === 3 ? 'navigation' : 'flag'}
                        </span>
                      </div>
                      <span
                        className={`font-label-sm text-[10px] whitespace-nowrap ${
                          isPastOrCurrent ? 'font-bold text-primary' : 'text-on-surface-variant'
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Row: Share Ride & Safety Toolkit */}
            <div className="grid grid-cols-2 gap-space-sm pt-2">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(`https://skyppy.app/track/${booking.bookingId}`);
                  showToast('Live tracking link copied to clipboard!');
                }}
                className="h-12 rounded-xl bg-surface-container-low text-on-surface font-label-lg text-label-lg flex items-center justify-center gap-2 hover:bg-surface-container transition-colors shadow-sm active:scale-[0.98] font-semibold"
                type="button"
              >
                <span className="material-symbols-outlined text-[19px] text-primary">share_location</span>
                <span>Share Trip</span>
              </button>
              <button
                onClick={() => openModal('safety')}
                className="h-12 rounded-xl bg-surface-container-low text-on-surface font-label-lg text-label-lg flex items-center justify-center gap-2 hover:bg-surface-container transition-colors shadow-sm active:scale-[0.98] font-semibold"
                type="button"
              >
                <span className="material-symbols-outlined text-[19px] text-secondary">security</span>
                <span>Safety Toolkit</span>
              </button>
            </div>

            {/* Finish Simulation Trigger Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setStepIndex(4)}
                className="w-full py-2.5 px-3 rounded-xl bg-secondary-container text-on-secondary-container font-label-md text-label-md font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Complete Trip (+{booking.destination.distanceKm || 4.2} km Miles)</span>
              </button>
            </div>

            {/* Cancel Booking Action */}
            <div className="text-center pt-1 border-t border-surface-container-low">
              <button
                onClick={() => setIsCancelModalOpen(true)}
                className="text-error font-label-md text-label-md hover:underline font-semibold"
                type="button"
              >
                Cancel this ride
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* CANCEL BOOKING REASON MODAL */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end">
          <div className="absolute inset-0" onClick={() => setIsCancelModalOpen(false)}></div>
          <div className="relative w-full bg-surface-container-lowest rounded-t-3xl shadow-2xl p-5 z-10 flex flex-col gap-4 max-w-lg mx-auto">
            <div className="flex items-center justify-between border-b pb-3 border-surface-container-low">
              <div>
                <h3 className="font-headline font-bold text-lg text-on-surface">Cancel Ride?</h3>
                <p className="text-xs text-on-surface-variant">Cancellation fee: ₹0.00 (within free grace period)</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-outline">Select Reason</span>
              {[
                { id: 'taking_too_long', label: 'Driver taking longer than estimated' },
                { id: 'driver_asked', label: 'Driver asked me to cancel' },
                { id: 'changed_mind', label: 'Changed my travel plans' },
                { id: 'wrong_pickup', label: 'Wrong pickup location specified' }
              ].map((r) => (
                <label
                  key={r.id}
                  onClick={() => setCancelReason(r.label)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                    cancelReason === r.label
                      ? 'bg-surface-container-low ring-1 ring-error text-on-surface font-semibold'
                      : 'bg-surface hover:bg-surface-container-low text-on-surface-variant'
                  }`}
                >
                  <span className="text-xs">{r.label}</span>
                  <input
                    type="radio"
                    name="cancel_reason"
                    checked={cancelReason === r.label}
                    onChange={() => setCancelReason(r.label)}
                    className="accent-error"
                  />
                </label>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                className="flex-1 h-12 rounded-xl bg-surface-container text-on-surface font-label-lg font-semibold active:scale-95 transition-transform"
              >
                Keep Ride
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="flex-1 h-12 rounded-xl bg-error text-on-error font-label-lg font-bold shadow-md hover:brightness-105 active:scale-95 transition-transform"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
