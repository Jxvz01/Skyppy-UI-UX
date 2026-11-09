import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { VehicleCategoryId } from '../types';

interface VehicleFleetProfile {
  id: VehicleCategoryId;
  name: string;
  model: string;
  tag: string;
  descriptor: string;
  categoryNoun: string;
  plate: string;
  eta: string;
  distance: string;
  fare: number;
  icon: string;
  image: string;
  driver: {
    name: string;
    phone: string;
    rating: string;
    avatar: string;
  };
}

const FLEET_CONFIG: Record<VehicleCategoryId, VehicleFleetProfile> = {
  auto: {
    id: 'auto',
    name: 'Auto',
    model: 'Bajaj RE Electric',
    tag: 'Most Affordable',
    descriptor: 'Everyday rides',
    categoryNoun: 'auto',
    plate: 'KA-09 AB 4217',
    eta: '3 mins',
    distance: '~ 1.2 km',
    fare: 61,
    icon: 'electric_rickshaw',
    image: '/vehicles/auto.png',
    driver: {
      name: 'Ramesh K.',
      phone: '+91 98765 43210',
      rating: '4.8',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB3740jxSGU_BvWXX_0bKvu2sxELLX3AAndNutnCW1XB__FwZwimVdQj4fOaPyFKYMsAmEUOU5b79mzMqvzX5ZGIkNXUzI4OJZrn2REKieiB-DgdiisKPKyBxEF61HkHHW9b1Rf_sTB4cKo6Q24dXC2eWjIJcG5MsBenwwv-U3LLkhaiFKpskZqBkUWS7J1dwK6Ti9Wt5E706pyHnAzMQpT4793gyOibANPEYB0dnw'
    }
  },
  mini: {
    id: 'mini',
    name: 'Mini',
    model: 'Tata Tiago',
    tag: 'Compact & Quick',
    descriptor: 'Compact & efficient',
    categoryNoun: 'mini',
    plate: 'KA-09 CD 3284',
    eta: '4 mins',
    distance: '~ 1.8 km',
    fare: 74,
    icon: 'directions_car',
    image: '/vehicles/mini.png',
    driver: {
      name: 'Anitha S.',
      phone: '+91 98451 11200',
      rating: '4.9',
      avatar:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80'
    }
  },
  hatchback: {
    id: 'hatchback',
    name: 'Hatchback',
    model: 'Hyundai i20',
    tag: 'Popular Choice',
    descriptor: 'Popular & versatile',
    categoryNoun: 'hatchback',
    plate: 'KA-09 EF 5531',
    eta: '4 mins',
    distance: '~ 2.1 km',
    fare: 89,
    icon: 'directions_car',
    image: '/vehicles/hatchback.png',
    driver: {
      name: 'Vikram N.',
      phone: '+91 98451 22910',
      rating: '4.8',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBFC_47gt-3lPsOkq5tq9A1wWjAanAGLT6QZO8F3aTw1LfNOksrrxtXPF71CGQ_FJ7pd2LCtqBQDSpXdXwOpey0sE6qNx6fucroCvNH0h6iro5jb2ysLyvNzFo1738hYjEHq4Swjk-8vLvooNWxWoVptliHy445jMIRy5KQxPdsJiOuxf15CvmmGzGTG3p2hxjjR4GDmV5Xy9khm4tVw1cxiuqqOxQX-FwykOSgEZM'
    }
  },
  sedan: {
    id: 'sedan',
    name: 'Sedan',
    model: 'Honda City',
    tag: 'Extra Comfort',
    descriptor: 'Comfort & space',
    categoryNoun: 'sedan',
    plate: 'KA-09 GH 7763',
    eta: '5 mins',
    distance: '~ 2.4 km',
    fare: 112,
    icon: 'directions_car',
    image: '/vehicles/sedan.png',
    driver: {
      name: 'Suresh P.',
      phone: '+91 97312 88401',
      rating: '4.9',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80'
    }
  },
  suv: {
    id: 'suv',
    name: 'SUV',
    model: 'Hyundai Creta',
    tag: 'Spacious & Premium',
    descriptor: 'Premium & spacious',
    categoryNoun: 'SUV',
    plate: 'KA-09 JK 9901',
    eta: '6 mins',
    distance: '~ 3.1 km',
    fare: 149,
    icon: 'directions_car',
    image: '/vehicles/suv.png',
    driver: {
      name: 'Manoj R.',
      phone: '+91 99001 54321',
      rating: '4.9',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80'
    }
  }
};

export const BookingConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const { activeBooking, cancelBooking, openModal, showToast, selectVehicle } = useAppStore();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [copiedOtp, setCopiedOtp] = useState(false);

  // Check prefers-reduced-motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 2-Screen State Target from Reference: 'searching' (Screen 1) -> 'confirmed' (Screen 2)
  const [screenState, setScreenState] = useState<'searching' | 'confirmed'>(
    prefersReducedMotion ? 'confirmed' : 'searching'
  );

  // Progress sub-step in searching screen: 1 (Ride requested), 2 (Finding a nearby vehicle), 3 (Finalising)
  const [progressStep, setProgressStep] = useState<number>(2);

  // Automated 3-second redirect to /tracking once ride is confirmed
  const [redirectCountdown, setRedirectCountdown] = useState<number>(3);
  const [isRedirectPaused, setIsRedirectPaused] = useState<boolean>(false);

  const initialKey = (activeBooking?.vehicleId || 'auto') as VehicleCategoryId;
  const [activeCategoryId, setActiveCategoryId] = useState<VehicleCategoryId>(
    FLEET_CONFIG[initialKey] ? initialKey : 'auto'
  );

  const activeVehicle = FLEET_CONFIG[activeCategoryId] || FLEET_CONFIG.auto;

  const booking = activeBooking || {
    bookingId: 'SKY784392',
    otp: '4891',
    startOtp: '5482',
    fare: activeVehicle.fare,
    vehicleId: activeCategoryId,
    vehicleName: activeVehicle.model,
    driver: activeVehicle.driver,
    pickup: { title: 'VVCE Campus, Gokulam', address: 'Mysuru, Karnataka' },
    destination: {
      title: 'JSS Medical College & Hospital',
      address: 'Bannimantap, Mysuru',
      distanceKm: 4.2,
      durationMin: 12
    }
  };

  // Automated State Progression Choreography
  useEffect(() => {
    if (prefersReducedMotion || screenState === 'confirmed') return;

    const t1 = setTimeout(() => {
      setProgressStep(3); // Finalising your booking
    }, 1400);

    const t2 = setTimeout(() => {
      setScreenState('confirmed');
    }, 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [prefersReducedMotion, screenState]);

  // Once ride is confirmed, auto-redirect to live tracking after 3 seconds
  useEffect(() => {
    if (screenState !== 'confirmed' || showCancelModal || isRedirectPaused) {
      return;
    }

    const interval = setInterval(() => {
      setRedirectCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate('/tracking');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [screenState, showCancelModal, isRedirectPaused, navigate]);

  const handleSkipToConfirmed = () => {
    setScreenState('confirmed');
    setRedirectCountdown(3);
    setIsRedirectPaused(false);
  };

  const handleSelectCategory = (catId: VehicleCategoryId) => {
    setActiveCategoryId(catId);
    selectVehicle(catId);
    // User is manually inspecting categories; pause auto-redirect to allow full inspection
    setIsRedirectPaused(true);
  };

  const handleCopyOtp = () => {
    navigator.clipboard?.writeText(booking.startOtp || '5482');
    setCopiedOtp(true);
    showToast('Start OTP copied to clipboard');
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const confirmCancelRide = () => {
    cancelBooking('Cancelled by passenger');
    setShowCancelModal(false);
    navigate('/');
  };

  return (
    <div className="flex-1 flex flex-col relative w-full bg-[#f8f9fc] text-[#101c2b] min-h-full font-body overflow-x-hidden select-none">
      {/* ------------------------------------------------------------- */}
      {/* GLOBAL PERSISTENT HEADER (Official Skyppy Logo & Title)       */}
      {/* ------------------------------------------------------------- */}
      <header className="sticky top-0 w-full z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-5 h-16 shrink-0 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
        {screenState === 'confirmed' ? (
          <button
            type="button"
            onClick={() => navigate('/options')}
            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors active:scale-95 cursor-pointer"
            aria-label="Back to options"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSkipToConfirmed}
            className="text-xs font-semibold text-slate-400 hover:text-primary transition-colors cursor-pointer"
          >
            Skip
          </button>
        )}

        {/* Centered Official Skyppy Branding */}
        <div className="flex items-center gap-2">
          <svg className="w-6 h-6 text-primary shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
          <div className="flex flex-col text-left">
            <span className="font-extrabold text-[17px] tracking-tight text-slate-900 leading-none">
              Skyppy
            </span>
            <span className="text-[8px] font-bold text-slate-500 tracking-[0.16em] uppercase">
              URBAN MOBILITY
            </span>
          </div>
        </div>

        {/* Right Action: SOS / Safety */}
        <button
          type="button"
          onClick={() => openModal('safety')}
          className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          aria-label="Safety support"
        >
          <span className="material-symbols-outlined text-[19px]">shield</span>
        </button>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* SCREEN CONTAINER (Smooth Cross-Fade Between Screen 1 & 2)     */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col relative w-full">
        <AnimatePresence mode="wait">
          {/* ========================================================= */}
          {/* SCREEN ONE: FINDING YOUR RIDE                             */}
          {/* ========================================================= */}
          {screenState === 'searching' && (
            <motion.div
              key="screen-searching"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="flex-1 flex flex-col justify-between px-5 pt-3 pb-6"
            >
              {/* Heading Section */}
              <div className="flex flex-col items-center text-center mt-2">
                <h1 className="font-extrabold text-2xl text-slate-900 tracking-tight">
                  Confirming your ride
                </h1>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Finding the best available vehicle near you...
                </p>
              </div>

              {/* Minimal Clean Map Visualisation */}
              <div className="relative w-full h-[260px] my-3 rounded-2xl bg-gradient-to-b from-slate-50 to-blue-50/40 border border-slate-200/70 overflow-hidden shadow-inner flex items-center justify-center">
                {/* Mysuru Palace Silhouette Outline */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                  <svg className="w-56 h-32 text-slate-400" viewBox="0 0 200 100" fill="currentColor">
                    <path d="M10 80h180v8H10zM30 60h20v20H30zm40-20h20v40H70zm40 0h20v40h-20zm40 20h20v20h-20zM90 20h20v20H90z" />
                  </svg>
                </div>

                {/* Mysuru Lettermark */}
                <div className="absolute bottom-5 left-8 text-xs font-semibold tracking-[0.3em] text-slate-300 uppercase pointer-events-none">
                  M y s u r u
                </div>

                {/* Left Floating Callout (Pickup) */}
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-8 left-4 max-w-[140px] bg-white/95 backdrop-blur-md rounded-xl p-2.5 shadow-md border border-slate-100 flex items-center gap-2 z-20"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 ring-4 ring-primary/20" />
                  <span className="text-[11px] font-bold text-slate-800 leading-tight truncate">
                    {booking.pickup.title.split(',')[0]}
                  </span>
                </motion.div>

                {/* Right Floating Callout (Destination) */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="absolute top-16 right-4 max-w-[140px] bg-white/95 backdrop-blur-md rounded-xl p-2.5 shadow-md border border-slate-100 flex items-center gap-2 z-20"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0 ring-4 ring-blue-600/20" />
                  <span className="text-[11px] font-bold text-slate-800 leading-tight truncate">
                    {booking.destination.title.split(',')[0]}
                  </span>
                </motion.div>

                {/* Route Connecting SVG with Animated Car */}
                <svg className="w-full h-full absolute inset-0 z-10" viewBox="0 0 350 260">
                  <path
                    d="M 65 140 C 120 180, 200 130, 285 120"
                    fill="none"
                    stroke="#0042dd"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <circle cx="65" cy="140" r="5" fill="#0042dd" />
                  <circle cx="285" cy="120" r="5" fill="#0042dd" />

                  {/* Concentric Radar Rings around Vehicle */}
                  <g transform="translate(175, 142)">
                    <circle cx="0" cy="0" r="16" fill="rgba(0, 66, 221, 0.08)" />
                    <circle cx="0" cy="0" r="28" fill="rgba(0, 66, 221, 0.04)" />
                  </g>

                  {/* Traveling Car Marker */}
                  <motion.g
                    initial={{ x: 65, y: 140 }}
                    animate={{ x: [65, 175, 240], y: [140, 142, 126] }}
                    transition={{ duration: 2.2, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.4 }}
                  >
                    <g transform="translate(-10, -6)">
                      <rect width="20" height="12" rx="4" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
                      <rect x="4" y="2" width="12" height="8" rx="2" fill="#0042dd" opacity="0.8" />
                    </g>
                  </motion.g>
                </svg>
              </div>

              {/* Progress Steps Card */}
              <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-3.5">
                {/* Step 1: Ride requested */}
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white shrink-0 shadow-xs">
                    <span className="material-symbols-outlined text-[13px] font-bold">check</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Ride requested</span>
                </div>

                {/* Step 2: Finding a nearby vehicle */}
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  </div>
                  <span className="text-sm font-bold text-slate-900">Finding a nearby vehicle</span>
                </div>

                {/* Step 3: Finalising your booking */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      progressStep === 3
                        ? 'border-primary bg-primary/10'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {progressStep === 3 && (
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </div>
                  <span
                    className={`text-sm ${
                      progressStep === 3 ? 'font-bold text-slate-900' : 'text-slate-400'
                    }`}
                  >
                    Finalising your booking
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* SCREEN TWO: YOUR RIDE IS CONFIRMED!                       */}
          {/* ========================================================= */}
          {screenState === 'confirmed' && (
            <motion.div
              key="screen-confirmed"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col justify-between px-5 pt-2 pb-5"
            >
              {/* Confirmed Header with Mint Green Checkmark Badge */}
              <div className="flex flex-col items-center text-center mt-0.5">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-xs mb-1.5">
                  <span className="material-symbols-outlined text-[19px] font-black">check</span>
                </div>
                <h1 className="font-extrabold text-[22px] text-slate-900 tracking-tight leading-snug">
                  Your ride is confirmed!
                </h1>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Your {activeVehicle.categoryNoun} is on the way to pickup location.
                </p>
              </div>

              {/* VEHICLE HERO PRESENTATION (Prominent 3/4 Showroom Centerpiece) */}
              <div className="relative w-full h-[180px] flex items-center justify-center my-1 px-3">
                {/* Subtle Showroom Soft Contact Shadow */}
                <div className="absolute bottom-2 w-[80%] max-w-[280px] h-3 bg-slate-900/10 rounded-[100%] blur-[2.5px] pointer-events-none" />

                {/* Substantially Enlarged Centerpiece Vehicle Image with seamless blend */}
                <motion.img
                  key={activeVehicle.id}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  src={activeVehicle.image}
                  alt={`${activeVehicle.name} - ${activeVehicle.model}`}
                  className="relative z-10 w-full h-full max-h-[160px] object-contain select-none mix-blend-multiply"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `/vehicles/${activeVehicle.id}.png`;
                  }}
                />
              </div>

              {/* VEHICLE CATEGORY BADGE PILL (Exact reference match below vehicle) */}
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-slate-800 font-bold text-xs shadow-xs border border-slate-200/80">
                  <span className="material-symbols-outlined text-[15px] text-primary">
                    {activeVehicle.icon}
                  </span>
                  <span>{activeVehicle.name}</span>
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-primary font-semibold text-[10px] border border-blue-100/60">
                  {activeVehicle.tag}
                </span>
              </div>

              {/* DRIVER & VEHICLE INFORMATION CARD (Exact Match to Reference) */}
              <div className="w-full bg-white rounded-2xl p-3.5 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col gap-2.5">
                {/* Row 1: Driver Profile */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={activeVehicle.driver.avatar}
                      alt={activeVehicle.driver.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-slate-900">
                          {activeVehicle.driver.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-amber-500 font-bold text-xs flex items-center">
                          ★ {activeVehicle.driver.rating}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-primary text-[10px] font-bold">
                          Demo Driver
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Buttons */}
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${activeVehicle.driver.phone}`}
                      className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-primary hover:bg-slate-200 transition-colors"
                      aria-label="Call driver"
                    >
                      <span className="material-symbols-outlined text-[17px]">call</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => openModal('chat')}
                      className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-primary hover:bg-slate-200 transition-colors cursor-pointer"
                      aria-label="Message driver"
                    >
                      <span className="material-symbols-outlined text-[17px]">chat</span>
                    </button>
                  </div>
                </div>

                <div className="border-t border-slate-100" />

                {/* Row 2: Vehicle & Registration No */}
                <div className="grid grid-cols-2 gap-2 text-left">
                  {/* Left: Vehicle Model */}
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                      <span className="material-symbols-outlined text-[15px]">
                        {activeVehicle.icon}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block leading-none mb-0.5">
                        Vehicle
                      </span>
                      <span className="text-xs font-bold text-slate-800 truncate block">
                        {activeVehicle.model}
                      </span>
                    </div>
                  </div>

                  {/* Right: Reg. No. */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block leading-none mb-0.5">
                        Reg. No.
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-800">
                        {activeVehicle.plate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100" />

                {/* Row 3: Arriving in, Distance & Start OTP */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                      <span className="material-symbols-outlined text-[15px]">schedule</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block leading-none mb-0.5">
                        Arriving in
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900">
                          {activeVehicle.eta}
                        </span>
                        <span className="text-[10px] text-primary font-bold bg-blue-50 px-1.5 py-0.2 rounded-full">
                          {activeVehicle.distance}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Start OTP (Passenger Verification & Test Suites) */}
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase leading-none mb-0.5">
                      Start OTP
                    </span>
                    <div className="flex items-center gap-1 justify-end">
                      <span className="font-mono text-xs font-black text-primary bg-primary/10 px-2 py-0.5 rounded">
                        {booking.startOtp || '5482'}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyOtp}
                        className="text-slate-400 hover:text-primary transition-colors"
                        title="Copy OTP"
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          {copiedOtp ? 'check' : 'content_copy'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100" />

                {/* Row 4: Route Locations Waypoints */}
                <div className="flex flex-col gap-1 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="truncate font-medium">{booking.pickup.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0" />
                    <span className="truncate font-medium">{booking.destination.title}</span>
                  </div>
                </div>
              </div>

              {/* 5-CATEGORY DEMO SELECTOR (Allows previewing all categories from reference) */}
              <div className="mt-2.5 flex items-center justify-between gap-1 overflow-x-auto py-1 scrollbar-none">
                {(['auto', 'mini', 'hatchback', 'sedan', 'suv'] as const).map((key) => {
                  const item = FLEET_CONFIG[key];
                  const isCurrent = activeCategoryId === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleSelectCategory(key)}
                      className={`flex-1 min-w-[58px] py-1.5 px-1 rounded-xl text-center flex flex-col items-center gap-0.5 transition-all ${
                        isCurrent
                          ? 'bg-primary text-white shadow-xs font-bold'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {item.icon}
                      </span>
                      <span className="text-[10px] leading-none capitalize">{item.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* BOTTOM FIXED / STICKY ACTION BAR (Exact Match to Reference) */}
              <div className="mt-2 pt-1 flex items-center justify-between">
                {/* Left: Estimated Fare with Demo Price Pill */}
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400 font-medium">Estimated fare</span>
                    <button
                      type="button"
                      onClick={() => openModal('fareBreakdown', { vehicleId: activeCategoryId })}
                      className="text-slate-400 hover:text-primary transition-colors cursor-pointer"
                      title="Fare Breakdown"
                    >
                      <span className="material-symbols-outlined text-[13px]">info</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-2xl font-black text-slate-900 tracking-tight font-numeric">
                      ₹{activeVehicle.fare}
                    </span>
                    <span className="text-[10px] font-semibold text-primary bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                      Demo Price
                    </span>
                  </div>
                </div>

                {/* Right: Track Live Ride Button with 3s Countdown Indicator */}
                <button
                  type="button"
                  onClick={() => navigate('/tracking')}
                  className="relative overflow-hidden h-12 px-5 rounded-xl bg-primary text-white font-bold text-sm shadow-md hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2 cursor-pointer group"
                >
                  {/* Subtle auto-progress fill indicator */}
                  {!isRedirectPaused && (
                    <div
                      className="absolute inset-y-0 left-0 bg-white/20 transition-all duration-1000 ease-linear pointer-events-none"
                      style={{ width: `${((3 - redirectCountdown) / 3) * 100}%` }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <span>Track Live Ride</span>
                    {!isRedirectPaused && (
                      <span className="inline-flex items-center justify-center text-[10px] font-mono font-bold bg-white/25 text-white px-1.5 py-0.5 rounded-full min-w-[22px]">
                        {redirectCountdown}s
                      </span>
                    )}
                    <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">
                      arrow_forward
                    </span>
                  </span>
                </button>
              </div>

              {/* Secondary Cancel Booking Action */}
              <div className="text-center mt-1">
                <button
                  type="button"
                  onClick={handleCancelClick}
                  className="text-[11px] font-semibold text-slate-400 hover:text-red-500 transition-colors py-1 cursor-pointer"
                >
                  Cancel Booking
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* CANCELLATION MODAL                                            */}
      {/* ------------------------------------------------------------- */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl flex flex-col gap-3">
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">warning</span>
            </div>
            <div>
              <h2 className="font-bold text-lg text-slate-900">Cancel Booking?</h2>
              <p className="text-xs text-slate-500 mt-1">
                Cancellation within 3 minutes is free. Are you sure you want to cancel your{' '}
                {activeVehicle.name} ride?
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Keep Ride
              </button>
              <button
                type="button"
                onClick={confirmCancelRide}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 cursor-pointer"
              >
                Yes, Cancel Ride
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
