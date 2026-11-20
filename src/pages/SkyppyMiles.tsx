import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MilesOrbit } from '../components/miles/MilesOrbit';
import { useAppStore } from '../store/useAppStore';
import { translations } from '../utils/i18n';

export const SkyppyMiles: React.FC = () => {
  const navigate = useNavigate();
  const { miles, redeemVoucher, earnCustomMiles, redeemMilesPoints, showToast, language } = useAppStore();
  const t = translations[language] || translations.en;

  const [isExplainerOpen, setIsExplainerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'orbit'>('overview');
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const handleApplyVoucher = (voucher: { id: string; code: string; title: string; redeemed: boolean }) => {
    redeemVoucher(voucher.id);
    showToast(`Voucher ${voucher.code} redeemed! Applied to your booking session.`, 'success');
    navigate('/options');
  };

  const nextGoalKm = miles.nextMilestoneKm || 300;
  const kmRemaining = Math.max(0, Number((nextGoalKm - miles.lifetimeKm).toFixed(1)));
  const progressPercent = Math.min(100, Math.round((miles.lifetimeKm / nextGoalKm) * 100));

  return (
    <div className="flex-1 flex flex-col relative w-full pb-20 bg-[#f8f6f0] min-h-full font-sans text-slate-900 select-none">
      {/* ================= 1. TOP NAVY HERO CONTAINER ================= */}
      <div className="bg-[#091322] rounded-b-[36px] px-5 pt-3 pb-6 relative overflow-hidden shadow-xl border-b border-slate-800/40">
        {/* Subtle radial ambient glows */}
        <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-44 h-44 rounded-full bg-[#d4f84c]/10 blur-3xl pointer-events-none" />

        {/* Top Header Bar */}
        <div className="flex items-center justify-between relative z-10">
          <button
            type="button"
            onClick={() => navigate('/')}
            aria-label="Back to home"
            className="w-9 h-9 rounded-full flex items-center justify-center text-white/90 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </button>

          <h1 className="text-white text-lg font-bold tracking-tight">
            {language === 'kn' ? t.skyppyMiles : 'Miles'}
          </h1>

          <button
            type="button"
            onClick={() => setIsExplainerOpen(true)}
            aria-label="Miles rules information"
            className="w-9 h-9 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">info</span>
          </button>
        </div>

        {/* Hero Mileage Stats & Road Ribbon Graphic */}
        <div className="relative mt-5 mb-5 flex items-center justify-between min-h-[96px] z-10">
          {/* Left: Mileage Counter */}
          <div className="flex flex-col justify-center pr-2">
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#8e9eb5] uppercase block mb-1">
              SKYPPY MILES
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-[44px] font-extrabold text-white tracking-tight leading-none">
                {miles.lifetimeKm || '248.6'}
              </span>
              <span className="text-lg font-medium text-slate-300">Miles</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 font-medium">Ride. Send. Earn. Redeem.</p>
          </div>

          {/* Right: 3D Curved Road Ribbon Graphic */}
          <div className="relative w-[150px] sm:w-[170px] h-[95px] shrink-0 flex items-center justify-end pointer-events-none select-none">
            <img
              src="/miles/road-ribbon.png"
              alt="Skyppy Highway Ribbon"
              className="w-full h-full object-contain drop-shadow-[0_4px_16px_rgba(30,64,175,0.45)]"
            />
          </div>
        </div>

        {/* Floating Tier Progress Card (Silver Explorer) */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setActiveTab(activeTab === 'overview' ? 'orbit' : 'overview')}
          className="bg-[#f8f6f0] rounded-[22px] p-4 shadow-lg flex items-center justify-between gap-3 text-slate-900 border border-black/5 cursor-pointer hover:bg-white transition-all active:scale-[0.99] relative z-10"
        >
          {/* Silver Star Emblem */}
          <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 shadow-xs flex items-center justify-center bg-slate-200">
            <img src="/miles/silver-star.png" alt="Silver Explorer Star" className="w-full h-full object-cover" />
          </div>

          {/* Tier Info & Progress Bar */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-bold text-slate-900 leading-none">Silver Explorer</span>
              <span className="text-xs font-semibold text-slate-500 font-mono">251.4 / 500 Miles</span>
            </div>
            {/* Chartreuse Progress Bar */}
            <div className="w-full bg-[#e6e2d8] rounded-full h-2 overflow-hidden mb-1.5">
              <div
                className="bg-[#c8f328] h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.max(5, Math.min(100, (miles.lifetimeKm / 500) * 100))}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
              <span>{kmRemaining > 0 ? `${kmRemaining} Miles to Gold` : 'Gold Unlocked'}</span>
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                {miles.currentTier || 'Tier 2 Explorer'}
              </span>
            </div>
          </div>

          {/* Right Chevron */}
          <span className="material-symbols-outlined text-slate-400 text-[20px] shrink-0">chevron_right</span>
        </div>
      </div>

      {/* ================= 2. THREE QUICK ACTION CARDS ================= */}
      <div className="px-margin mt-4 grid grid-cols-3 gap-2.5">
        {/* Action 1: Earn */}
        <button
          type="button"
          onClick={() => {
            earnCustomMiles(24.0, 'Mysuru Express Corridor');
            showToast('+24.0 KM Earned & Credited to your Miles balance!', 'success');
          }}
          className="bg-[#f0ebe1] hover:bg-[#eae4d8] active:scale-[0.98] transition-all rounded-[20px] py-3.5 px-2 flex flex-col items-center justify-center gap-1.5 shadow-2xs border border-[#e6e0d4]"
        >
          <span className="material-symbols-outlined text-slate-900 text-[24px]">bolt</span>
          <span className="text-xs font-bold text-slate-900">Earn</span>
        </button>

        {/* Action 2: Redeem */}
        <button
          type="button"
          onClick={() => {
            const success = redeemMilesPoints(15.0, 'Catalog Voucher');
            if (success !== false) {
              showToast('15.0 Miles Redeemed for ₹50 Voucher!', 'success');
            }
          }}
          className="bg-[#f0ebe1] hover:bg-[#eae4d8] active:scale-[0.98] transition-all rounded-[20px] py-3.5 px-2 flex flex-col items-center justify-center gap-1.5 shadow-2xs border border-[#e6e0d4]"
        >
          <span className="material-symbols-outlined text-slate-900 text-[24px]">redeem</span>
          <span className="text-xs font-bold text-slate-900">Redeem</span>
        </button>

        {/* Action 3: History */}
        <button
          type="button"
          onClick={() => setShowHistoryModal(true)}
          className="bg-[#f0ebe1] hover:bg-[#eae4d8] active:scale-[0.98] transition-all rounded-[20px] py-3.5 px-2 flex flex-col items-center justify-center gap-1.5 shadow-2xs border border-[#e6e0d4]"
        >
          <span className="material-symbols-outlined text-slate-900 text-[24px]">schedule</span>
          <span className="text-xs font-bold text-slate-900">History</span>
        </button>
      </div>

      {/* ================= 3. FEATURED REWARD SECTION ================= */}
      <div className="px-margin mt-6 flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-slate-900">
          {language === 'kn' ? t.rewardsCatalog : 'Featured reward'}
        </h2>
        <button
          type="button"
          onClick={() => navigate('/options')}
          className="text-xs font-bold text-brand-primary flex items-center gap-0.5 hover:underline active:scale-95 transition-all"
        >
          <span>View all</span>
          <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
        </button>
      </div>

      <div className="mx-margin rounded-[24px] overflow-hidden bg-[#091322] border border-slate-800/60 shadow-md flex items-stretch justify-between relative min-h-[160px]">
        {/* Left Side: Ride Discount Info & Neon Button */}
        <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 z-10">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              RIDE REWARD
            </span>
            <h3 className="text-2xl font-extrabold text-white tracking-tight">₹150 off</h3>
            <p className="text-xs text-slate-300 font-medium mt-0.5">on your next ride</p>
          </div>

          <div className="mt-3">
            <button
              type="button"
              onClick={() => {
                if (miles.rewards[0]) {
                  handleApplyVoucher(miles.rewards[0]);
                } else {
                  showToast('₹150 voucher applied to your next trip!', 'success');
                  navigate('/options');
                }
              }}
              className="bg-[#d4f84c] hover:bg-[#c6f135] active:scale-95 text-slate-950 text-xs font-extrabold px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-xs transition-transform cursor-pointer"
            >
              <span className="text-[11px]">✦</span>
              <span>1,500 Miles</span>
            </button>
          </div>
        </div>

        {/* Right Side: Car Interior with Mysore Palace View */}
        <div className="w-[45%] relative shrink-0">
          <img
            src="/miles/featured-reward-interior.png"
            alt="Palace Ride Interior"
            className="w-full h-full object-cover object-left"
          />
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#091322] to-transparent pointer-events-none" />
        </div>
      </div>

      {/* ================= 4. EARN MILES SECTION ================= */}
      <div className="px-margin mt-6 mb-3">
        <h2 className="text-base font-bold text-slate-900">Earn Miles</h2>
      </div>

      <div className="px-margin flex flex-col gap-2.5">
        {/* Option 1: Take a Ride */}
        <button
          type="button"
          onClick={() => navigate('/search')}
          className="w-full bg-[#fbf9f5] hover:bg-white active:scale-[0.99] transition-all p-3.5 rounded-[22px] flex items-center justify-between gap-3.5 shadow-2xs border border-[#eee9df] text-left cursor-pointer"
        >
          <div className="w-11 h-11 rounded-2xl bg-[#ede8de] flex items-center justify-center text-slate-800 shrink-0">
            <span className="material-symbols-outlined text-[22px]">directions_car</span>
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-bold text-slate-900 block leading-tight">Take a ride</span>
            <span className="text-xs font-medium text-slate-500 block mt-0.5">Earn 10 Miles per ₹100</span>
          </div>
          <span className="material-symbols-outlined text-slate-400 text-[20px] shrink-0">chevron_right</span>
        </button>

        {/* Option 2: Send a Parcel */}
        <button
          type="button"
          onClick={() => navigate('/courier')}
          className="w-full bg-[#fbf9f5] hover:bg-white active:scale-[0.99] transition-all p-3.5 rounded-[22px] flex items-center justify-between gap-3.5 shadow-2xs border border-[#eee9df] text-left cursor-pointer"
        >
          <div className="w-11 h-11 rounded-2xl bg-[#ede8de] flex items-center justify-center text-slate-800 shrink-0">
            <span className="material-symbols-outlined text-[22px]">inventory_2</span>
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-bold text-slate-900 block leading-tight">Send a parcel</span>
            <span className="text-xs font-medium text-slate-500 block mt-0.5">Earn 15 Miles per ₹100</span>
          </div>
          <span className="material-symbols-outlined text-slate-400 text-[20px] shrink-0">chevron_right</span>
        </button>
      </div>

      {/* ================= 5. INTERACTIVE ORBIT ENGINE & MILESTONE LADDER ================= */}
      {/* Seamlessly integrated below the main view with full test compatibility & controls */}
      <div className="px-margin mt-8 pt-4 border-t border-[#e8e3d8]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-primary text-[20px]">radar</span>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Miles Orbit & Milestone Engine
            </h3>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">
            Live Radar
          </span>
        </div>

        {/* Orbit Hero Card */}
        <div className="relative overflow-hidden rounded-[26px] bg-[#0a121d] text-white p-5 shadow-xl border border-white/10 flex flex-col items-center">
          <div className="w-full flex items-center justify-between text-xs mb-2 z-10">
            <span className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">
              {language === 'kn' ? t.lifetimeMiles : 'Total Distance Travelled'}
            </span>
            <div className="flex items-center gap-1 text-[#d4ee66] text-xs bg-white/10 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4ee66] animate-ping" />
              <span>100% Distance-Backed</span>
            </div>
          </div>

          {/* Interactive Miles Orbit Visualization */}
          <MilesOrbit
            balanceKm={miles.lifetimeKm}
            monthlyKm={miles.monthlyKm}
            currentTier={miles.currentTier}
            nextMilestoneKm={miles.nextMilestoneKm}
            variant="hero"
            onEarnSimulate={(amt) => earnCustomMiles(amt, 'Mysuru Express Corridor')}
            onRedeemSimulate={(amt) => redeemMilesPoints(amt, 'Catalog Voucher')}
            className="my-1 z-10"
          />

          {/* Milestone Target Gauge Container */}
          <div className="w-full bg-white/5 rounded-2xl p-4 mt-3 backdrop-blur-md border border-white/10 z-10 space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-300">
                Next Tier Target: <strong className="text-white font-mono">{nextGoalKm} KM</strong>
              </span>
              <span className="text-[#d4ee66] font-bold">
                {kmRemaining > 0 ? `${kmRemaining} km remaining` : 'Milestone Achieved!'}
              </span>
            </div>

            <div className="relative w-full h-2.5 bg-white/15 rounded-full overflow-hidden flex items-center">
              <div
                className="h-full bg-gradient-to-r from-brand-primary to-[#d4ee66] rounded-full transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-400 pt-0.5">
              <span>Tier 2: 200 km</span>
              <span className="text-slate-300 font-semibold">{progressPercent}% Achieved</span>
              <span className="text-[#d4ee66] font-bold">Tier 3 Master at 300 km</span>
            </div>
          </div>
        </div>

        {/* Milestone Ladder */}
        <div className="mt-4 bg-[#fbf9f5] rounded-[22px] p-4 border border-[#eee9df] shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 mb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Milestone Ladder</h4>
              <p className="text-[11px] text-slate-500">Unlock perpetual privileges as your distance adds up</p>
            </div>
            <span className="material-symbols-outlined text-brand-primary text-[22px]">flag</span>
          </div>

          <div className="relative flex flex-col gap-3.5 pl-2">
            <div className="absolute left-[15px] top-3 bottom-5 w-0.5 bg-slate-200" />
            {miles.milestones.map((m) => {
              const isUnlocked = miles.lifetimeKm >= m.km;
              const isAlmost = !isUnlocked && m.km - miles.lifetimeKm <= 6;
              const diff = (m.km - miles.lifetimeKm).toFixed(1);

              return (
                <div key={m.id} className="relative flex items-start gap-3 z-10">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-xs ${
                      isUnlocked
                        ? 'bg-emerald-600 text-white'
                        : isAlmost
                        ? 'bg-brand-primary text-white animate-pulse'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px] font-bold">
                      {isUnlocked ? 'check' : isAlmost ? 'lock_open' : 'lock'}
                    </span>
                  </div>
                  <div className="flex-1 bg-white p-3 rounded-xl border border-slate-200/60 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{m.title}</span>
                      <span
                        className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          isUnlocked
                            ? 'bg-emerald-100 text-emerald-700'
                            : isAlmost
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {isUnlocked ? 'UNLOCKED' : isAlmost ? `${diff} KM LEFT!` : 'LOCKED'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{m.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= 6. DISTANCE HISTORY MODAL ================= */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl flex flex-col gap-4 border border-slate-200 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-brand-primary text-[22px]">history</span>
                <h4 className="text-base font-bold text-slate-900">Miles History</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {miles.ledger.slice(0, 8).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{item.route}</span>
                    <span className="text-[11px] text-slate-500">{item.mode} • {item.date}</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-mono font-bold block ${item.km < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {item.km < 0 ? `${item.km} km` : `+${item.km} km`}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">
                      {item.km < 0 ? 'Redeemed' : 'Credited'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= 7. EXPLAINER MODAL ================= */}
      {isExplainerOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl flex flex-col gap-4 border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-brand-primary text-[24px]">military_tech</span>
                <h4 className="text-base font-bold text-slate-900">What is Skyppy Miles?</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsExplainerOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-3 text-xs text-slate-600 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-emerald-600 mt-0.5 text-[18px]">verified</span>
                <p>
                  <strong className="text-slate-900">Pure distance, zero points math:</strong> Every single GPS kilometre you complete adds 1.0 km straight to your profile orbit.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-emerald-600 mt-0.5 text-[18px]">hourglass_disabled</span>
                <p>
                  <strong className="text-slate-900">Never expires:</strong> Your accrued distance stays locked in. Tier privileges never downgrade from inactivity.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-emerald-600 mt-0.5 text-[18px]">swap_driving_apps_wheel</span>
                <p>
                  <strong className="text-slate-900">Multi-modal mobility:</strong> Auto rides, cabs, and intercity parcel shipments across Mysuru all contribute equally.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsExplainerOpen(false)}
              className="w-full py-3 rounded-xl bg-brand-primary text-white text-xs font-bold shadow-md active:scale-95 transition-transform mt-1"
            >
              Got It, Let's Ride
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
