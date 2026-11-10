import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { useCourierStore } from '../store/useCourierStore';
import { useAppStore } from '../store/useAppStore';

export const CourierHome: React.FC = () => {
  const navigate = useNavigate();
  const { shipments, setActiveServiceTab, setActiveShipment } = useCourierStore();
  const { miles, showToast } = useAppStore();

  const [fromLocation, setFromLocation] = useState('VVCE Campus, Gokulam');
  const [toLocation, setToLocation] = useState('Bengaluru, Karnataka');

  const handleSwap = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
    showToast('Corridor origin and destination swapped', 'info');
  };

  const handleTrackQuick = () => {
    if (shipments.length > 0) {
      setActiveShipment(shipments[0]);
      navigate(`/courier/track/${shipments[0].id}`);
    } else {
      navigate('/courier/send');
    }
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
              <h1 className="text-[28px] font-extrabold tracking-tight text-white leading-[1.08]">
                Move.<br />
                Ride.<br />
                Ship.
              </h1>
              <p className="text-xs text-slate-300 font-medium mt-2">
                Across Mysuru and beyond.
              </p>
            </div>
          </div>
        </div>

        {/* ==================== 2. PRIMARY SERVICE SWITCHER ==================== */}
        <div className="-mt-4 px-margin relative z-20">
          <div className="bg-white rounded-2xl p-1.5 shadow-[0_8px_25px_rgba(16,28,43,0.08)] border border-slate-100 flex items-center gap-1.5">
            {/* Book a Ride Button (Inactive) */}
            <button
              type="button"
              aria-label="Book a Ride - Skyppy Rides"
              onClick={() => {
                setActiveServiceTab('rides');
                navigate('/');
              }}
              className="flex-1 py-3 px-3 rounded-xl bg-transparent text-slate-800 hover:bg-slate-50 flex items-center justify-center gap-2 font-bold text-sm active:scale-[0.98] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[19px] text-slate-700">directions_car</span>
              <span>Book a Ride</span>
            </button>

            {/* Send a Parcel Button (Active) */}
            <button
              type="button"
              aria-label="Send a Parcel - Skyppy Courier"
              className="flex-1 py-3 px-3 rounded-xl bg-primary text-white flex items-center justify-center gap-1.5 font-bold text-sm shadow-sm active:scale-[0.98] transition-transform cursor-default"
            >
              <span className="material-symbols-outlined text-[19px]">package_2</span>
              <span>Send a Parcel</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#d4f84c] text-black text-[9px] font-extrabold uppercase tracking-wide">
                New
              </span>
            </button>
          </div>
        </div>

        {/* ==================== 3. SKAPPY MOVE CARD ==================== */}
        <div className="px-margin pt-4">
          <div className="bg-gradient-to-r from-[#eef4ff] to-[#f4f7fc] border border-blue-100/80 rounded-2xl p-4 shadow-xs">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider block">
                  SKAPPY MOVE
                </span>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-0.5">
                  Send a Parcel
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ship your packages safely across cities.
                </p>
              </div>

              {/* 3D Parcel Delivery Box Asset */}
              <div className="shrink-0 -mt-1">
                <img
                  src="/parcel-box-hd.png"
                  alt="Skyppy 3D Parcel Box"
                  className="h-16 object-contain drop-shadow-sm"
                />
              </div>
            </div>

            {/* 4 Feature Badges in Row */}
            <div className="grid grid-cols-4 gap-1.5 pt-3 mt-3 border-t border-blue-100/60 text-center">
              <div className="flex flex-col items-center gap-1">
                <span className="material-symbols-outlined text-primary text-[18px]">bolt</span>
                <span className="text-[10px] font-semibold text-slate-700 leading-tight">
                  Intercity<br />Delivery
                </span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="material-symbols-outlined text-primary text-[18px]">shield</span>
                <span className="text-[10px] font-semibold text-slate-700 leading-tight">
                  Safe &amp; Secure<br />Handling
                </span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
                <span className="text-[10px] font-semibold text-slate-700 leading-tight">
                  Live<br />Tracking
                </span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                <span className="text-[10px] font-semibold text-slate-700 leading-tight">
                  Proof of<br />Delivery
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== 4. ROUTE PICKER (FROM / TO & CREATE SHIPMENT) ==================== */}
        <div className="px-margin pt-3">
          <div className="bg-white rounded-2xl p-3 border border-slate-100/90 shadow-[0_4px_20px_rgba(16,28,43,0.04)] flex flex-col gap-2">
            {/* FROM Row */}
            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    FROM
                  </span>
                  <span className="text-sm font-bold text-slate-900 truncate">
                    {fromLocation}
                  </span>
                </div>
              </div>

              <button
                type="button"
                aria-label="Locate pickup"
                onClick={() => setFromLocation('VVCE Campus, Gokulam')}
                className="w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 text-primary flex items-center justify-center shrink-0 transition-colors active:scale-95"
                title="Current Location"
              >
                <span className="material-symbols-outlined text-[18px]">my_location</span>
              </button>
            </div>

            {/* Separator Line */}
            <div className="h-[1px] bg-slate-100 mx-2" />

            {/* TO Row */}
            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">location_on</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    TO
                  </span>
                  <span className="text-sm font-bold text-slate-900 truncate">
                    {toLocation}
                  </span>
                </div>
              </div>

              <button
                type="button"
                aria-label="Swap corridor locations"
                onClick={handleSwap}
                className="w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 text-primary flex items-center justify-center shrink-0 transition-colors active:scale-95"
                title="Swap From and To"
              >
                <span className="material-symbols-outlined text-[18px]">swap_vert</span>
              </button>
            </div>

            {/* Primary Action: Create Shipment CTA */}
            <button
              type="button"
              onClick={() => navigate('/courier/send')}
              className="w-full py-3.5 px-4 mt-1 rounded-xl bg-primary text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-primary/20 active:scale-[0.98] transition-transform cursor-pointer"
            >
              <span className="material-symbols-outlined text-[19px]">package_2</span>
              <span>Create Shipment</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* ==================== 5. QUICK ACTIONS ==================== */}
        <div className="px-margin pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              QUICK ACTIONS
            </span>
            <button
              type="button"
              onClick={() => navigate('/activity')}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>View all</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {/* Action 1: New Shipment */}
            <div
              onClick={() => navigate('/courier/send')}
              className="bg-white rounded-2xl p-3 border border-slate-100 shadow-xs flex flex-col items-center text-center cursor-pointer hover:bg-slate-50 transition-colors active:scale-95"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center mb-1.5">
                <span className="material-symbols-outlined text-[20px]">add_box</span>
              </div>
              <span className="text-xs font-bold text-slate-900 leading-tight">New Shipment</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Send a parcel</span>
            </div>

            {/* Action 2: Track Shipment */}
            <div
              onClick={handleTrackQuick}
              className="bg-white rounded-2xl p-3 border border-slate-100 shadow-xs flex flex-col items-center text-center cursor-pointer hover:bg-slate-50 transition-colors active:scale-95"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center mb-1.5">
                <span className="material-symbols-outlined text-[20px]">local_shipping</span>
              </div>
              <span className="text-xs font-bold text-slate-900 leading-tight">Track Shipment</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Live status</span>
            </div>

            {/* Action 3: Scheduled Pickups */}
            <div
              onClick={handleTrackQuick}
              className="bg-white rounded-2xl p-3 border border-slate-100 shadow-xs flex flex-col items-center text-center cursor-pointer hover:bg-slate-50 transition-colors active:scale-95"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center mb-1.5">
                <span className="material-symbols-outlined text-[20px]">calendar_month</span>
              </div>
              <span className="text-xs font-bold text-slate-900 leading-tight">Scheduled</span>
              <span className="text-[10px] text-slate-400 mt-0.5 leading-tight">Pickups</span>
            </div>

            {/* Action 4: Shipment History */}
            <div
              onClick={() => navigate('/activity')}
              className="bg-white rounded-2xl p-3 border border-slate-100 shadow-xs flex flex-col items-center text-center cursor-pointer hover:bg-slate-50 transition-colors active:scale-95"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center mb-1.5">
                <span className="material-symbols-outlined text-[20px]">receipt_long</span>
              </div>
              <span className="text-xs font-bold text-slate-900 leading-tight">Shipment</span>
              <span className="text-[10px] text-slate-400 mt-0.5 leading-tight">History</span>
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
                    Skyppy Miles
                  </span>
                  <span className="text-[11px] text-slate-400">Ride • Ship • Earn</span>
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
              <span className="text-slate-300 font-medium">68 miles to Gold</span>
              <button
                type="button"
                onClick={() => navigate('/miles')}
                className="text-[#d4f84c] font-bold flex items-center gap-0.5 hover:underline cursor-pointer"
              >
                <span>View Rewards</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
