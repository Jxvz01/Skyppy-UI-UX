import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { useAppStore } from '../store/useAppStore';
import { translations } from '../utils/i18n';

export const RidesHome: React.FC = () => {
  const navigate = useNavigate();
  const { pickup, setPickup, setDestination, openModal, userProfile, miles, rideHistory, savedPlaces, language } = useAppStore();
  const t = translations[language] || translations.en;

  const handleSelectRecent = (title: string, distanceKm: number, address = 'Mysuru, Karnataka') => {
    setDestination({
      title,
      address,
      distanceKm,
      durationMin: Math.round(distanceKm * 2.8)
    });
    navigate('/location');
  };

  // Find most recent completed ride for Repeat Recent card
  const lastCompletedRide = rideHistory.find((r) => r.status === 'completed') || {
    origin: 'VVCE, Gokulam',
    destination: 'JSS Medical College & Hospital',
    distanceKm: 4.2,
    durationMin: 12,
    vehicle: 'Auto Rickshaw',
    vehicleIcon: 'electric_rickshaw'
  };

  const homePlace = savedPlaces.find((p) => p.title.toLowerCase().includes('home')) || {
    title: 'Home, Shivarathreeshwara Nagar',
    distanceKm: 3.8,
    address: 'Shivarathreeshwara Nagar, Mysuru'
  };

  const workPlace = savedPlaces.find((p) => p.title.toLowerCase().includes('work')) || {
    title: 'Work, VVCE Gokulam',
    distanceKm: 0.5,
    address: 'VVCE Campus, Gokulam 3rd Stage'
  };

  return (
    <div className="flex-1 flex flex-col relative w-full pb-6 bg-surface min-h-full">
      <Header type="tab" />

      <main className="flex flex-col w-full">
        {/* Midnight Navy Hero & Royal Mysuru Skyline Canopy */}
        <div className="relative overflow-hidden bg-inverse-surface text-inverse-on-surface px-margin pt-4 pb-6 shadow-md rounded-b-[28px]">
          {/* Ambient Heritage Glow & Radial Luster */}
          <div className="absolute -top-12 -right-10 w-56 h-56 rounded-full bg-primary-container/20 blur-3xl pointer-events-none"></div>
          <div className="absolute top-1/2 -left-12 w-44 h-44 rounded-full bg-secondary-container/15 blur-2xl pointer-events-none"></div>

          {/* Mysuru Palace Skyline Vector Illustration (Silhouette) */}
          <svg
            className="absolute bottom-0 right-0 w-64 h-28 opacity-15 pointer-events-none text-inverse-on-surface"
            fill="none"
            viewBox="0 0 320 140"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M160 30L170 55H150L160 30Z" fill="currentColor"></path>
            <path d="M160 10C155 10 152 20 152 25C152 28 156 30 160 30C164 30 168 28 168 25C168 20 165 10 160 10Z" fill="currentColor"></path>
            <rect fill="currentColor" height="85" width="36" x="142" y="55"></rect>
            <rect fill="#101c2b" height="18" rx="4" width="8" x="148" y="70"></rect>
            <rect fill="#101c2b" height="18" rx="4" width="8" x="164" y="70"></rect>
            <path d="M90 45C85 45 80 52 80 60H100C100 52 95 45 90 45Z" fill="currentColor"></path>
            <rect fill="currentColor" height="80" width="28" x="76" y="60"></rect>
            <rect fill="#101c2b" height="25" rx="7" width="14" x="83" y="75"></rect>
            <path d="M35 60C30 60 26 66 26 72H44C44 66 40 60 35 60Z" fill="currentColor"></path>
            <rect fill="currentColor" height="68" width="22" x="24" y="72"></rect>
            <path d="M230 45C225 45 220 52 220 60H240C240 52 235 45 230 45Z" fill="currentColor"></path>
            <rect fill="currentColor" height="80" width="28" x="216" y="60"></rect>
            <rect fill="#101c2b" height="25" rx="7" width="14" x="223" y="75"></rect>
            <path d="M285 60C280 60 276 66 276 72H294C294 66 290 60 285 60Z" fill="currentColor"></path>
            <rect fill="currentColor" height="68" width="22" x="274" y="72"></rect>
            <rect fill="currentColor" height="25" width="320" x="0" y="115"></rect>
            <circle cx="160" cy="8" fill="#d1ec64" r="3"></circle>
          </svg>

          {/* Top Greeting with Live Transit Micro-Pill */}
          <div className="relative z-10 flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="font-label-md text-label-md text-secondary-fixed font-semibold tracking-wide">
                {t.transitLive}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed animate-pulse"></span>
            </div>
            <div className="flex items-center gap-1.5 bg-surface-container-highest/20 backdrop-blur-md px-2.5 py-1 rounded-full text-inverse-on-surface">
              <span className="material-symbols-outlined text-[15px] text-secondary-fixed">partly_cloudy_day</span>
              <span className="font-label-sm text-label-sm font-medium">{t.weatherClear}</span>
            </div>
          </div>

          {/* Editorial Header Headline */}
          <div className="relative z-10 mb-4">
            <span className="font-body-sm text-body-sm text-outline-variant block mb-0.5">
              {t.greetingMorning}, {userProfile.name.split(' ')[0]}
            </span>
            <h1 className="font-headline-xl-mobile text-headline-xl-mobile text-inverse-on-surface tracking-tight font-extrabold">
              {t.heroHeadline}
            </h1>
          </div>

          {/* Dual Mobility Booking Modes */}
          <div className="relative z-10 flex items-center gap-2">
            <button
              onClick={() => navigate('/search')}
              className="flex-1 h-11 px-4 rounded-xl bg-primary-container text-on-primary flex items-center justify-center gap-2 font-label-lg text-label-lg shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">local_taxi</span>
              <span>{t.instantRide}</span>
            </button>
            <button
              onClick={() => openModal('schedule')}
              className="flex-1 h-11 px-4 rounded-xl bg-surface-container-highest/25 hover:bg-surface-container-highest/35 backdrop-blur-md text-inverse-on-surface flex items-center justify-center gap-2 font-label-lg text-label-lg active:scale-[0.98] transition-transform cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-secondary-fixed">calendar_clock</span>
              <span>{t.scheduleTrip}</span>
            </button>
          </div>
        </div>

        {/* Interactive Search & Booking Elevated Module */}
        <div className="px-margin -mt-3 relative z-20">
          <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-[0_8px_24px_rgba(16,28,43,0.08)] flex flex-col gap-3">
            {/* Origin Input Bar */}
            <div
              onClick={() => navigate('/search?mode=pickup')}
              className="flex items-center justify-between bg-surface-container-low px-3.5 py-2.5 rounded-xl cursor-pointer hover:bg-surface-container transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-2.5 h-2.5 rounded-full bg-secondary shrink-0 shadow-[0_0_0_3px_rgba(84,101,0,0.2)]"></div>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-sm text-label-sm text-secondary font-semibold">{t.pickupLocation}</span>
                  <span className="font-label-lg text-label-lg text-on-surface font-semibold truncate">
                    {pickup.title}
                  </span>
                </div>
              </div>
              <button
                aria-label="Locate me"
                onClick={(e) => {
                  e.stopPropagation();
                  setPickup({
                    title: 'Current Location (VVCE Gokulam)',
                    address: 'Near VVCE Gate 2, Mysuru'
                  });
                }}
                className="w-8 h-8 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary shadow-xs hover:bg-surface-container transition-colors shrink-0 active:scale-95"
                type="button"
                title="Use Current Location"
              >
                <span className="material-symbols-outlined text-[18px]">my_location</span>
              </button>
            </div>

            {/* Destination Search Interactive Trigger Field */}
            <div
              onClick={() => navigate('/search?mode=destination')}
              className="flex items-center gap-2 bg-surface-container-low px-3.5 py-3 rounded-xl focus-within:bg-surface-container-lowest focus-within:shadow-[0_0_0_2px_#315ef8] transition-all cursor-pointer active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[20px] text-error shrink-0">location_on</span>
              <span className="w-full bg-transparent font-body-lg text-body-lg text-outline select-none">
                {t.whereTo}
              </span>
              <button
                aria-label="Search"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/search?mode=destination');
                }}
                className="w-8 h-8 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container hover:bg-primary-container/20 transition-colors shrink-0"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        {/* Smart Repeat-Trip One-Tap Shortcut */}
        <div className="px-margin pt-4">
          <div className="bg-surface-container-low rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">{lastCompletedRide.vehicleIcon || 'electric_rickshaw'}</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                    Repeat Recent
                  </span>
                  <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                  <span className="font-label-sm text-label-sm text-tertiary">
                    {lastCompletedRide.vehicle.split(' ')[0]}
                  </span>
                </div>
                <p className="font-label-lg text-label-lg text-on-surface font-semibold truncate">
                  {lastCompletedRide.origin} → {lastCompletedRide.destination}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setPickup({ title: lastCompletedRide.origin, address: 'Mysuru, Karnataka' });
                setDestination({
                  title: lastCompletedRide.destination,
                  address: 'Mysuru, Karnataka',
                  distanceKm: lastCompletedRide.distanceKm || 4.2,
                  durationMin: lastCompletedRide.durationMin || 12
                });
                navigate('/options');
              }}
              className="shrink-0 h-9 px-3 bg-on-surface text-surface-container-lowest rounded-xl font-label-md text-label-md font-bold flex items-center gap-1 hover:bg-inverse-surface transition-colors shadow-xs active:scale-95"
              type="button"
            >
              <span>Book</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Quick Access Destinations 4-Column Grid */}
        <div className="px-margin pt-4">
          <div className="flex items-center justify-between mb-2.5">
            <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-tertiary">
              Quick Shortcuts
            </span>
            <button
              onClick={() => openModal('savedPlaces')}
              className="font-label-sm text-label-sm text-primary font-semibold hover:underline"
              type="button"
            >
              Manage
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => handleSelectRecent(homePlace.title, homePlace.distanceKm || 3.8, homePlace.address)}
              className="flex flex-col items-center justify-center bg-surface-container-lowest p-2.5 rounded-2xl shadow-xs hover:bg-surface-container-low transition-colors group active:scale-95"
              type="button"
            >
              <div className="w-11 h-11 rounded-full bg-surface-container-high text-primary flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[20px]">home</span>
              </div>
              <span className="font-label-md text-label-md font-bold text-on-surface leading-tight">Home</span>
              <span className="font-label-sm text-label-sm text-outline">{homePlace.distanceKm || 3.8} km</span>
            </button>

            <button
              onClick={() => handleSelectRecent(workPlace.title, workPlace.distanceKm || 0.5, workPlace.address)}
              className="flex flex-col items-center justify-center bg-surface-container-lowest p-2.5 rounded-2xl shadow-xs hover:bg-surface-container-low transition-colors group active:scale-95"
              type="button"
            >
              <div className="w-11 h-11 rounded-full bg-surface-container-high text-primary flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[20px]">apartment</span>
              </div>
              <span className="font-label-md text-label-md font-bold text-on-surface leading-tight">Work</span>
              <span className="font-label-sm text-label-sm text-outline">Gokulam</span>
            </button>

            <button
              onClick={() => openModal('savedPlaces')}
              className="flex flex-col items-center justify-center bg-surface-container-lowest p-2.5 rounded-2xl shadow-xs hover:bg-surface-container-low transition-colors group active:scale-95"
              type="button"
            >
              <div className="w-11 h-11 rounded-full bg-surface-container-high text-primary flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[20px]">bookmark</span>
              </div>
              <span className="font-label-md text-label-md font-bold text-on-surface leading-tight">Saved</span>
              <span className="font-label-sm text-label-sm text-outline">{savedPlaces.length} spots</span>
            </button>

            <button
              onClick={() => handleSelectRecent('Mysuru Railway Station', 6.1, 'Medar Block, Yadavagiri')}
              className="flex flex-col items-center justify-center bg-surface-container-lowest p-2.5 rounded-2xl shadow-xs hover:bg-surface-container-low transition-colors group active:scale-95"
              type="button"
            >
              <div className="w-11 h-11 rounded-full bg-surface-container-high text-primary flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[20px]">train</span>
              </div>
              <span className="font-label-md text-label-md font-bold text-on-surface leading-tight">Station</span>
              <span className="font-label-sm text-label-sm text-outline">6.1 km</span>
            </button>
          </div>
        </div>

        {/* Skyppy Miles Loyalty Card */}
        <div className="px-margin pt-4">
          <div
            onClick={() => navigate('/miles')}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-inverse-surface via-[#1b2537] to-on-primary-fixed p-4 text-inverse-on-surface shadow-md cursor-pointer active:scale-[0.99] transition-transform"
          >
            <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-primary/20 blur-2xl pointer-events-none"></div>
            <div className="relative z-10 flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px]">military_tech</span>
                </div>
                <div>
                  <span className="font-label-md text-label-md font-bold text-secondary-fixed block leading-tight">
                    Skyppy Miles
                  </span>
                  <span className="font-label-sm text-label-sm text-outline-variant">{miles.currentTier}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-numeric-xl text-numeric-xl font-bold tracking-tight text-inverse-on-surface">
                  {miles.lifetimeKm}
                </span>
                <span className="font-label-sm text-label-sm text-outline-variant ml-0.5">km</span>
              </div>
            </div>

            {/* Linear Milestone Progress Visual */}
            <div className="relative z-10 space-y-1.5">
              <div className="w-full bg-surface-container-highest/20 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-container to-secondary-container rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (miles.lifetimeKm / miles.nextMilestoneKm) * 100)}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-outline-variant font-label-sm text-label-sm">
                <span className="text-inverse-on-surface font-medium">
                  {Math.max(0, Number((miles.nextMilestoneKm - miles.lifetimeKm).toFixed(1)))} km to{' '}
                  {miles.nextMilestoneKm} km Goal
                </span>
                <span className="text-secondary-fixed flex items-center gap-0.5 font-bold">
                  <span>View Rewards</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Destinations Ride Log */}
        <div className="px-margin pt-5 pb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Recent Destinations</h2>
            <button
              onClick={() => navigate('/activity')}
              className="font-label-md text-label-md text-primary font-semibold hover:underline"
              type="button"
            >
              See all
            </button>
          </div>

          <div className="space-y-2">
            {/* Destination 1: JSS Hospital */}
            <div
              onClick={() => handleSelectRecent('JSS Medical College & Hospital', 4.2, 'Bannimantap, Mysuru')}
              className="bg-surface-container-lowest p-3 rounded-2xl shadow-xs flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer group active:scale-[0.99]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-surface-container-high text-tertiary flex items-center justify-center shrink-0 group-hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">local_hospital</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-lg text-label-lg font-bold text-on-surface truncate">
                    JSS Medical College &amp; Hospital
                  </span>
                  <span className="font-body-sm text-body-sm text-outline truncate">
                    Bannimantap, Mysuru • 4.2 km • ~12 min
                  </span>
                </div>
              </div>
              <button
                aria-label="Book ride to JSS Medical"
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-on-primary transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>

            {/* Destination 2: Railway Station */}
            <div
              onClick={() => handleSelectRecent('Mysuru Railway Station', 6.1, 'Medar Block, Yadavagiri')}
              className="bg-surface-container-lowest p-3 rounded-2xl shadow-xs flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer group active:scale-[0.99]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-surface-container-high text-tertiary flex items-center justify-center shrink-0 group-hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">directions_subway</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-lg text-label-lg font-bold text-on-surface truncate">
                    Mysuru Railway Station
                  </span>
                  <span className="font-body-sm text-body-sm text-outline truncate">
                    Medar Block, Yadavagiri • 6.1 km • ~18 min
                  </span>
                </div>
              </div>
              <button
                aria-label="Book ride to Railway Station"
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-on-primary transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>

            {/* Destination 3: Mysuru Palace */}
            <div
              onClick={() => handleSelectRecent('Mysuru Palace (Amba Vilas)', 5.8, 'Sayyaji Rao Rd, Agrahara')}
              className="bg-surface-container-lowest p-3 rounded-2xl shadow-xs flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer group active:scale-[0.99]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-surface-container-high text-tertiary flex items-center justify-center shrink-0 group-hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">castle</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-lg text-label-lg font-bold text-on-surface truncate">
                    Mysuru Palace (Amba Vilas)
                  </span>
                  <span className="font-body-sm text-body-sm text-outline truncate">
                    Sayyaji Rao Rd, Agrahara • 5.8 km • ~16 min
                  </span>
                </div>
              </div>
              <button
                aria-label="Book ride to Mysuru Palace"
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-on-primary transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
