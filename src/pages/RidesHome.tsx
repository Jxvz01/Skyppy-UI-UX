import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { useAppStore } from '../store/useAppStore';
import { useCourierStore } from '../store/useCourierStore';
import { translations } from '../utils/i18n';

export const RidesHome: React.FC = () => {
  const navigate = useNavigate();
  const {
    pickup,
    setPickup,
    destination,
    setDestination,
    swapLocations,
    openModal,
    miles,
    language
  } = useAppStore();

  const t = translations[language] || translations.en;
  const { setActiveServiceTab } = useCourierStore();

  const handleSwap = () => {
    swapLocations();
  };

  return (
    <div className="flex-1 flex flex-col relative w-full pb-20 bg-[#f8fafc] min-h-full">
      {/* Official Top App Header */}
      <Header type="tab" />

      <main className="flex flex-col w-full">
        {/* ==================== 1. HERO CANOPY WITH PALACE AT NIGHT ==================== */}
        <div className="px-margin pt-3">
          <div className="relative overflow-hidden rounded-[26px] bg-[#122543] min-h-[175px] flex items-center shadow-xs">
            {/* Illuminated Mysuru Palace Night Photo on the right */}
            <div
              className="absolute inset-0 bg-cover bg-right pointer-events-none"
              style={{
                backgroundImage: 'url(/hero-palace-clean-bg.png)',
                backgroundPosition: 'right center',
                backgroundRepeat: 'no-repeat'
              }}
            />

            {/* Left Typography Overlay */}
            <div className="relative z-10 p-5 max-w-[62%] select-none">
              <h1 className="text-[28px] font-extrabold tracking-tight text-white leading-[1.08] whitespace-pre-line">
                {t.moveRideShip}
              </h1>
              <p className="text-xs text-slate-300 font-medium mt-2">
                {t.acrossMysuru}
              </p>
            </div>
          </div>
        </div>

        {/* ==================== 2. PRIMARY SERVICE SWITCHER ==================== */}
        <div className="-mt-4 px-margin relative z-20">
          <div className="bg-white rounded-2xl p-1.5 shadow-[0_8px_25px_rgba(16,28,43,0.08)] border border-slate-100 flex items-center gap-1.5">
            {/* Book a Ride Button (Active) */}
            <button
              type="button"
              aria-label={`${t.bookARide} - Skyppy Rides`}
              onClick={() => navigate('/search')}
              className="flex-1 py-3 px-3 rounded-xl bg-primary text-white flex items-center justify-center gap-2 font-bold text-sm shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
            >
              <span className="material-symbols-outlined text-[19px]">directions_car</span>
              <span>{t.bookARide}</span>
            </button>

            {/* Send a Parcel Button (Courier) */}
            <button
              type="button"
              aria-label={`${t.sendAParcel} - Skyppy Courier`}
              onClick={() => {
                setActiveServiceTab('courier');
                navigate('/courier');
              }}
              className="flex-1 py-3 px-3 rounded-xl bg-transparent text-slate-800 hover:bg-slate-50 flex items-center justify-center gap-1.5 font-bold text-sm active:scale-[0.98] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[19px] text-slate-700">package_2</span>
              <span>{t.sendAParcel}</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#d4f84c] text-black text-[9px] font-extrabold uppercase tracking-wide">
                {t.newBadge}
              </span>
            </button>
          </div>
        </div>

        {/* ==================== 3. PLAN YOUR JOURNEY ==================== */}
        <div className="px-margin pt-4">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {t.planYourJourney}
            </span>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-0.5">
              {t.whereAreWeGoing}
            </h2>
          </div>

          {/* Elevated Pickup & Destination Module */}
          <div className="bg-white rounded-2xl p-2.5 mt-2.5 border border-slate-100/90 shadow-[0_4px_20px_rgba(16,28,43,0.04)] flex flex-col gap-1">
            {/* Pickup Row */}
            <div
              onClick={() => navigate('/search?mode=pickup')}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-primary flex items-center justify-center shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] text-slate-400 font-medium">{t.pickupLocation}</span>
                  <span className="text-sm font-bold text-slate-900 truncate">
                    {pickup.title || 'VVCE Campus, Gokulam'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                aria-label="Locate me"
                onClick={(e) => {
                  e.stopPropagation();
                  setPickup({
                    title: 'VVCE Campus, Gokulam',
                    address: 'Near VVCE Gate 2, Gokulam 3rd Stage, Mysuru'
                  });
                }}
                className="w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 text-primary flex items-center justify-center shrink-0 transition-colors active:scale-95"
                title="Use Current Location"
              >
                <span className="material-symbols-outlined text-[18px]">my_location</span>
              </button>
            </div>

            {/* Separator Divider */}
            <div className="h-[1px] bg-slate-100 mx-2 my-0.5" />

            {/* Destination Row */}
            <div
              onClick={() => navigate('/search?mode=destination')}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">location_on</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] text-slate-400 font-medium">{t.whereToInMysuru}</span>
                  <span className="text-sm font-bold text-slate-900 truncate">
                    {destination.title || 'Mysuru City Railway Station'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                aria-label="Swap locations"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSwap();
                }}
                className="w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 text-primary flex items-center justify-center shrink-0 transition-colors active:scale-95"
                title="Swap Pickup and Destination"
              >
                <span className="material-symbols-outlined text-[18px]">swap_vert</span>
              </button>
            </div>
          </div>
        </div>

        {/* ==================== 4. SKAPPY MOVE PARCEL BANNER ==================== */}
        <div className="px-margin pt-3">
          <div
            onClick={() => {
              setActiveServiceTab('courier');
              navigate('/courier');
            }}
            className="bg-gradient-to-r from-[#eef9e8] via-[#f3faeb] to-[#f7fcee] border border-lime-100/90 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer shadow-xs active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#d4f84c] text-black flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[22px]">package_2</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-slate-900 leading-tight">{t.skyppyMove}</span>
                <span className="text-xs text-slate-500 mt-0.5 truncate">
                  {t.sendParcelsAcrossCities}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <img
                src="/parcel-box.png"
                alt="Skyppy Parcel Box"
                className="h-11 object-contain drop-shadow-xs"
              />
              <span className="material-symbols-outlined text-[18px] text-slate-400">chevron_right</span>
            </div>
          </div>
        </div>

        {/* ==================== 5. QUICK ACTIONS ==================== */}
        <div className="px-margin pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t.quickActions}
            </span>
            <button
              type="button"
              onClick={() => navigate('/activity')}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>{t.viewAll}</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {/* Card 1: Ride Now */}
            <div
              onClick={() => navigate('/search')}
              className="bg-white rounded-2xl p-3 border border-slate-100 shadow-xs flex flex-col items-center text-center cursor-pointer hover:bg-slate-50 transition-colors active:scale-95"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center mb-1.5">
                <span className="material-symbols-outlined text-[20px]">directions_car</span>
              </div>
              <span className="text-xs font-bold text-slate-900 leading-tight">{t.rideNow}</span>
              <span className="text-[10px] text-slate-400 mt-0.5">{t.autoCar}</span>
              <span className="sr-only">Where to in Mysuru {t.whereToInMysuru}</span>
            </div>

            {/* Card 2: Send Parcel */}
            <div
              onClick={() => {
                setActiveServiceTab('courier');
                navigate('/courier/send');
              }}
              className="bg-white rounded-2xl p-3 border border-slate-100 shadow-xs flex flex-col items-center text-center cursor-pointer hover:bg-slate-50 transition-colors active:scale-95"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center mb-1.5">
                <span className="material-symbols-outlined text-[20px]">package_2</span>
              </div>
              <span className="text-xs font-bold text-slate-900 leading-tight">{t.sendParcel}</span>
              <span className="text-[10px] text-slate-400 mt-0.5">{t.intercity}</span>
            </div>

            {/* Card 3: Schedule */}
            <div
              onClick={() => openModal('schedule')}
              className="bg-white rounded-2xl p-3 border border-slate-100 shadow-xs flex flex-col items-center text-center cursor-pointer hover:bg-slate-50 transition-colors active:scale-95"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center mb-1.5">
                <span className="material-symbols-outlined text-[20px]">calendar_month</span>
              </div>
              <span className="text-xs font-bold text-slate-900 leading-tight">{t.schedule}</span>
              <span className="text-[10px] text-slate-400 mt-0.5 leading-tight">{t.rideOrPickup}</span>
            </div>

            {/* Card 4: Track */}
            <div
              onClick={() => {
                setActiveServiceTab('courier');
                navigate('/courier');
              }}
              className="bg-white rounded-2xl p-3 border border-slate-100 shadow-xs flex flex-col items-center text-center cursor-pointer hover:bg-slate-50 transition-colors active:scale-95"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center mb-1.5">
                <span className="material-symbols-outlined text-[20px]">location_on</span>
              </div>
              <span className="text-xs font-bold text-slate-900 leading-tight">{t.track}</span>
              <span className="text-[10px] text-slate-400 mt-0.5 leading-tight">{t.rideParcel}</span>
            </div>
          </div>
        </div>

        {/* ==================== 6. SKAPPY MILES BENTO CARD ==================== */}
        <div className="px-margin pt-4 pb-6">
          <div className="bg-[#0c1829] text-white rounded-2xl p-4 shadow-sm border border-slate-800/80 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#d4f84c] text-black flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">star</span>
                </div>
                <div>
                  <span className="text-sm font-bold text-[#d4f84c] block leading-tight">
                    {t.skyppyMiles}
                  </span>
                  <span className="text-[11px] text-slate-400">{t.rideShipEarn}</span>
                </div>
              </div>

              <div className="flex items-baseline">
                <span className="text-2xl font-extrabold text-white tracking-tight">
                  {miles.lifetimeKm || 232}
                </span>
                <span className="text-xs text-slate-400 font-medium ml-1">Miles</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden my-3">
              <div
                className="h-full bg-[#d4f84c] rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, ((miles.lifetimeKm || 232) / (miles.nextMilestoneKm || 300)) * 100)}%`
                }}
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">{t.milesToGold}</span>
              <button
                type="button"
                onClick={() => navigate('/miles')}
                className="text-[#d4f84c] font-bold flex items-center gap-0.5 hover:underline cursor-pointer"
              >
                <span>{t.viewRewards}</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
