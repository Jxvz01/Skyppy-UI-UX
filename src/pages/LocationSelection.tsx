import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { OpenStreetMap } from '../components/OpenStreetMap';
import { useAppStore } from '../store/useAppStore';

export const LocationSelection: React.FC = () => {
  const navigate = useNavigate();
  const { pickup, destination, swapLocations, showToast } = useAppStore();
  const [selectedRoutePref, setSelectedRoutePref] = useState('fastest');
  const [mapLayer, setMapLayer] = useState<'osm' | 'vector'>('osm');

  return (
    <div className="flex-1 flex flex-col relative w-full bg-surface min-h-full">
      <Header type="stack" title="03 Location Selection" backTo="/search" />

      <main className="flex flex-col w-full relative">
        {/* Interactive Mobility Map Canvas (OpenStreetMap Tiles or Daylight Vector) */}
        <div className="relative w-full h-[459px] overflow-hidden select-none bg-[#f8fafc] border-b border-slate-200/60 shadow-sm">
          {mapLayer === 'osm' ? (
            <OpenStreetMap
              stepIndex={2}
              speed={0}
              driverName="Pickup Preview"
              vehicleCategory="auto"
              isTrafficOn={true}
              onToast={showToast}
              className="w-full h-full"
            />
          ) : (
            <>
              {/* Map Vector Ground & Water Bodies */}
              <svg className="absolute inset-0 w-full h-full object-cover" preserveAspectRatio="none" viewBox="0 0 400 480">
            <defs>
              <linearGradient id="routeGradient" x1="0%" x2="100%" y1="100%" y2="0%">
                <stop offset="0%" stopColor="#2563eb"></stop>
                <stop offset="70%" stopColor="#3b82f6"></stop>
                <stop offset="100%" stopColor="#60a5fa"></stop>
              </linearGradient>
              <linearGradient id="lakeWaterLoc" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e0f2fe"></stop>
                <stop offset="100%" stopColor="#bae6fd"></stop>
              </linearGradient>
            </defs>

            {/* Base Terrain Fill */}
            <rect width="400" height="480" fill="#f8fafc" />

            {/* Clean Daylight Vector Grid */}
            <g opacity="0.4" stroke="#e2e8f0" strokeWidth="1">
              <line x1="-20" x2="420" y1="90" y2="110"></line>
              <line x1="-20" x2="420" y1="170" y2="185"></line>
              <line x1="-20" x2="420" y1="260" y2="280"></line>
              <line x1="-20" x2="420" y1="360" y2="375"></line>
              <line x1="70" x2="90" y1="-20" y2="500"></line>
              <line x1="180" x2="195" y1="-20" y2="500"></line>
              <line x1="280" x2="310" y1="-20" y2="500"></line>
              <line x1="360" x2="375" y1="-20" y2="500"></line>
            </g>

            {/* Urban Forest / Chamundi Foothills Organic Blocks */}
            <path d="M 280,310 Q 340,300 370,340 T 390,420 L 290,440 Z" fill="#dcfce7" stroke="#bbf7d0" strokeWidth="1" opacity="0.75"></path>

            {/* Kukkarahalli Lake Simulation Area */}
            <path
              d="M 270,170 C 295,150 350,165 365,200 C 375,230 355,275 325,280 C 295,285 260,260 255,225 C 250,195 255,180 270,170 Z"
              fill="url(#lakeWaterLoc)"
              stroke="#93c5fd"
              strokeWidth="1.5"
            ></path>
            <text fill="#0284c7" fontFamily="Inter, sans-serif" fontSize="8.5" fontWeight="700" letterSpacing="0.05em" textAnchor="middle" x="312" y="224">
              KUKKARAHALLI
            </text>
            <text fill="#0369a1" fontFamily="Inter, sans-serif" fontSize="7.5" fontWeight="600" textAnchor="middle" x="312" y="235">
              LAKE
            </text>

            {/* Secondary Arterial Roads (Outlines & Centers) */}
            <g fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 30,420 C 100,380 150,330 200,310 C 250,290 310,310 390,320" stroke="#cbd5e1" strokeWidth="7"></path>
              <path d="M 30,420 C 100,380 150,330 200,310 C 250,290 310,310 390,320" stroke="#ffffff" strokeWidth="5"></path>

              <path d="M 80,40 C 130,120 180,180 230,220 C 290,265 330,340 370,410" stroke="#cbd5e1" strokeWidth="8"></path>
              <path d="M 80,40 C 130,120 180,180 230,220 C 290,265 330,340 370,410" stroke="#ffffff" strokeWidth="6"></path>

              <path d="M 120,440 L 160,280 L 270,140 L 310,60" stroke="#e2e8f0" strokeWidth="5"></path>
              <path d="M 120,440 L 160,280 L 270,140 L 310,60" stroke="#ffffff" strokeWidth="3.5"></path>
            </g>

            {/* Active Journey Route */}
            <path
              d="M 95,355 Q 120,330 145,315 T 195,270 L 225,240 Q 250,215 270,180 T 290,135 L 305,95"
              fill="none"
              opacity="0.22"
              stroke="#2563eb"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="12"
            ></path>
            <path
              d="M 95,355 Q 120,330 145,315 T 195,270 L 225,240 Q 250,215 270,180 T 290,135 L 305,95"
              fill="none"
              stroke="url(#routeGradient)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="5"
            ></path>
            <path
              d="M 195,270 L 225,240 Q 250,215 270,180"
              fill="none"
              opacity="0.9"
              stroke="#ffffff"
              strokeDasharray="6 8"
              strokeLinecap="round"
              strokeWidth="2"
            ></path>

            {/* Landmark Identifier: Mysuru Palace Ward */}
            <g opacity="0.95" transform="translate(180, 150)">
              <circle cx="0" cy="0" fill="#fef3c7" stroke="#fde68a" strokeWidth="1" r="14"></circle>
              <circle cx="0" cy="0" fill="#d97706" r="4.5"></circle>
              <text fill="#b45309" fontFamily="Inter, sans-serif" fontSize="7.5" fontWeight="700" textAnchor="middle" x="0" y="16">
                Palace Ward
              </text>
            </g>
          </svg>

          {/* Floating Live ETA & Distance Bubble */}
          <div className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-space-xs bg-slate-900/90 text-white shadow-xl rounded-full px-3.5 py-1.5 backdrop-blur-md border border-slate-700/60">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-numeric-md text-label-md text-white font-bold">
              {destination.durationMin || 12} min
            </span>
            <span className="text-slate-400 font-body-sm text-[11px]">•</span>
            <span className="font-body-sm text-[11px] text-slate-200 font-medium">
              {destination.distanceKm || 4.2} km
            </span>
          </div>

          {/* Origin Landmark Pin */}
          <div className="absolute left-[82px] top-[342px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-8 h-8 rounded-full bg-primary/30 animate-pulse"></div>
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-lg">
                <div className="w-2 h-2 rounded-full bg-surface-container-lowest"></div>
              </div>
            </div>
            <div className="mt-1 bg-inverse-surface/90 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-md">
              <span className="font-label-sm text-[10px] text-surface-bright font-bold tracking-tight">VVCE Pickup</span>
            </div>
          </div>

          {/* Destination Landmark Pin */}
          <div className="absolute left-[305px] top-[85px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-8 h-8 rounded-full bg-error/30 animate-pulse"></div>
              <div className="w-6 h-6 rounded-full bg-error flex items-center justify-center shadow-xl">
                <span className="material-symbols-outlined text-on-error text-[14px] fill-1">location_on</span>
              </div>
            </div>
            <div className="mt-1 bg-inverse-surface/90 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-md">
              <span className="font-label-sm text-[10px] text-surface-bright font-bold tracking-tight truncate max-w-[100px]">
                {destination.title.split(' ')[0]}
              </span>
            </div>
          </div>

          {/* Floating Traffic Condition Pill */}
          <div className="absolute top-4 right-margin flex items-center gap-1.5 bg-inverse-surface/85 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg">
            <span className="w-2 h-2 rounded-full bg-secondary-fixed"></span>
            <span className="font-label-sm text-[10px] text-secondary-fixed font-bold tracking-wider uppercase">
              Normal Traffic
            </span>
          </div>

            </>
          )}

          {/* Floating Controls (Global on both OSM & Vector) */}
          <div className="absolute bottom-6 right-margin flex flex-col gap-2.5 z-[450] pointer-events-auto">
            <button
              aria-label="Re-center route"
              onClick={() => showToast('Route re-centered on live corridor')}
              className="w-11 h-11 rounded-full bg-white shadow-lg border border-slate-200/80 flex items-center justify-center text-primary hover:bg-slate-50 transition-transform active:scale-95 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">my_location</span>
            </button>
            <button
              aria-label="Toggle map layer"
              onClick={() => {
                const next = mapLayer === 'osm' ? 'vector' : 'osm';
                setMapLayer(next);
                showToast(`Map layer: ${next === 'osm' ? 'OpenStreetMap' : 'Daylight Vector'}`);
              }}
              className="w-11 h-11 rounded-full bg-white shadow-lg border border-slate-200/80 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-transform active:scale-95 cursor-pointer"
              type="button"
              title="Toggle OpenStreetMap / Vector Map"
            >
              <span className="material-symbols-outlined text-[20px]">
                {mapLayer === 'osm' ? 'layers' : 'public'}
              </span>
            </button>
          </div>
        </div>

        {/* Confirmation Bottom Sheet Card */}
        <div className="relative w-full -mt-5 bg-surface-container-lowest rounded-t-[28px] shadow-[0_-8px_30px_rgba(16,28,43,0.08)] px-margin pt-3 pb-8 z-20 flex flex-col">
          {/* Tactile Drag Handle */}
          <div className="w-full flex justify-center py-1.5 mb-2">
            <div className="w-12 h-1.5 rounded-full bg-surface-variant"></div>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="font-label-sm text-primary uppercase font-bold tracking-wider">Route Verification</span>
              <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Confirm Ride Route</h2>
            </div>
            <button
              aria-label="Swap locations"
              onClick={swapLocations}
              className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">swap_vert</span>
            </button>
          </div>

          {/* Connected Waypoints */}
          <div className="bg-surface-container-low rounded-2xl p-space-md mb-4 flex flex-col gap-space-sm relative">
            {/* Pickup */}
            <div className="flex items-center justify-between gap-space-sm">
              <div
                className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                onClick={() => navigate('/search?mode=pickup')}
              >
                <div className="w-7 h-7 rounded-full bg-secondary/15 flex items-center justify-center shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-secondary"></div>
                </div>
                <div className="min-w-0">
                  <span className="font-label-sm text-secondary uppercase font-semibold text-[10px]">
                    Pickup Point
                  </span>
                  <p className="font-body-lg text-on-surface font-semibold text-[15px] truncate">{pickup.title}</p>
                  <p className="font-body-sm text-on-surface-variant text-[12px] truncate">{pickup.address}</p>
                </div>
              </div>
              <button
                aria-label="Edit pickup"
                onClick={() => navigate('/search?mode=pickup')}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors shrink-0"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">edit</span>
              </button>
            </div>

            {/* Connector & Swap Row */}
            <div className="flex items-center justify-between pl-3 pr-1 py-0.5">
              <div className="flex flex-col gap-1">
                <span className="w-0.5 h-1.5 rounded-full bg-outline-variant"></span>
                <span className="w-0.5 h-1.5 rounded-full bg-outline-variant"></span>
              </div>
              <button
                type="button"
                onClick={() => {
                  swapLocations();
                  showToast('Pickup & destination swapped');
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-primary text-[11px] font-bold active:scale-95 transition-transform"
                title="Swap Pickup and Destination"
              >
                <span className="material-symbols-outlined text-[14px]">swap_vert</span>
                <span>Swap</span>
              </button>
            </div>

            {/* Destination */}
            <div className="flex items-center justify-between gap-space-sm">
              <div
                className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                onClick={() => navigate('/search?mode=destination')}
              >
                <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-[16px] fill-1">location_on</span>
                </div>
                <div className="min-w-0">
                  <span className="font-label-sm text-primary uppercase font-semibold text-[10px]">
                    Drop Destination
                  </span>
                  <p className="font-body-lg text-on-surface font-semibold text-[15px] truncate">{destination.title}</p>
                  <p className="font-body-sm text-on-surface-variant text-[12px] truncate">{destination.address}</p>
                </div>
              </div>
              <button
                aria-label="Edit destination"
                onClick={() => navigate('/search?mode=destination')}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors shrink-0"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">edit</span>
              </button>
            </div>
          </div>

          {/* Quick Route Preference Filter Chips */}
          <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'fastest', label: 'Fastest Route', icon: 'bolt' },
              { id: 'verified', label: 'Verified Drivers', icon: 'verified_user' },
              { id: 'zero_tolls', label: 'Zero Tolls', icon: 'money_off' }
            ].map((chip) => {
              const active = selectedRoutePref === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => {
                    setSelectedRoutePref(chip.id);
                    showToast(`Preference set: ${chip.label}`);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full shrink-0 transition-all ${
                    active
                      ? 'bg-primary-container/15 text-primary font-semibold ring-1 ring-primary/30'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">{chip.icon}</span>
                  <span className="font-label-md text-label-md">{chip.label}</span>
                </button>
              );
            })}
          </div>

          {/* Route Metric Summary Bento Pill */}
          <div className="flex items-center justify-between bg-surface-container-high rounded-xl px-4 py-3 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[18px]">directions_car</span>
              </div>
              <div>
                <span className="font-body-sm text-on-surface-variant text-[11px] block leading-tight">
                  Estimated Distance
                </span>
                <span className="font-numeric-md text-on-surface font-bold text-[14px]">
                  {destination.distanceKm || 4.2} Kilometers
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-body-sm text-on-surface-variant text-[11px] block leading-tight">Travel Time</span>
              <span className="font-numeric-md text-secondary font-bold text-[14px]">
                {destination.durationMin || 12} - {(destination.durationMin || 12) + 2} Mins
              </span>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => {
              if (pickup.title.trim().toLowerCase() === destination.title.trim().toLowerCase()) {
                showToast('Pickup and Destination cannot be the same. Please edit your route.', 'error');
                return;
              }
              navigate('/options');
            }}
            className="w-full h-[52px] bg-primary text-on-primary rounded-full flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:bg-primary-container transition-all active:scale-[0.99] font-headline-md text-headline-md tracking-wide cursor-pointer"
            type="button"
          >
            <span>Continue to Ride Options</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </div>
      </main>
    </div>
  );
};

