import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { translations } from '../utils/i18n';

export const SkyppyMiles: React.FC = () => {
  const navigate = useNavigate();
  const { miles, redeemVoucher, earnCustomMiles, redeemMilesPoints, showToast, language } = useAppStore();
  const t = translations[language] || translations.en;

  // Interactive Modals
  const [isExplainerOpen, setIsExplainerOpen] = useState(false);
  const [isReferralOpen, setIsReferralOpen] = useState(false);
  const [isChallengesOpen, setIsChallengesOpen] = useState(false);
  const [isBenefitsOpen, setIsBenefitsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleApplyVoucher = (reward: { id: string; title: string }) => {
    redeemVoucher(reward.id);
    showToast(`Voucher ${reward.title} redeemed! Applied to your booking session.`, 'success');
    navigate('/options');
  };

  // Milestones definition matching reference image
  const progressMilestones = [
    { name: 'Rider', threshold: '0+', achieved: true },
    { name: 'Explorer', threshold: '5,000+', achieved: true },
    { name: 'Silver', threshold: '15,000+', achieved: true },
    { name: 'Gold', threshold: '40,000+', achieved: true, current: true },
    { name: 'Platinum', threshold: '75,000+', achieved: false }
  ];

  return (
    <div className="w-full min-h-full flex flex-col bg-[#fbf9f5] font-sans text-slate-900 pb-36 select-none">
      {/* ================= 1. TOP NAVY HERO CONTAINER ================= */}
      <div className="w-full shrink-0 bg-gradient-to-b from-[#051122] via-[#08182f] to-[#0c2242] rounded-b-[36px] px-5 pt-3 pb-6 relative overflow-hidden shadow-2xl border-b border-blue-900/30">
        {/* Abstract Smooth Flowing Blue Ribbon / Wave Graphic */}
        <div className="absolute right-0 top-0 bottom-6 w-[62%] pointer-events-none select-none overflow-hidden flex items-center justify-end z-0">
          <img
            src="/miles/flowing-blue-wave.png"
            alt="Flowing Blue Wave"
            className="w-full h-full object-cover object-left opacity-95 drop-shadow-[0_4px_24px_rgba(59,130,246,0.45)]"
          />
        </div>

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

          {/* S Skyppy Miles Branding */}
          <div className="flex items-center gap-2">
            <span className="font-extrabold italic font-serif text-xl tracking-tighter text-white">S</span>
            <h1 className="text-white text-lg font-bold tracking-tight">
              {language === 'kn' ? t.skyppyMiles : 'Skyppy Miles'}
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setIsExplainerOpen(true)}
            aria-label="Miles rules information"
            className="w-9 h-9 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">info</span>
          </button>
        </div>

        {/* Hero Mileage Stats */}
        <div className="relative mt-6 mb-4 flex items-center justify-between min-h-[92px] z-10">
          <div className="flex flex-col justify-center pr-2">
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#8e9eb5] uppercase block mb-1">
              {language === 'kn' ? t.lifetimeMiles : 'YOUR MILES'}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-[46px] font-extrabold text-white tracking-tight leading-none">
                8,420
              </span>
              <span className="text-base font-semibold text-slate-300">Miles</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 font-medium">Ride. Send. Earn. Redeem.</p>
          </div>
        </div>

        {/* Floating Tier Card (Gold Explorer) */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsBenefitsOpen(true)}
          className="bg-[#0e1d35]/90 border border-blue-400/30 backdrop-blur-md rounded-[22px] p-3.5 shadow-xl flex items-center justify-between gap-3 text-white cursor-pointer hover:bg-[#122442] transition-all active:scale-[0.99] relative z-10"
        >
          {/* Circular Metallic Radiant Star Emblem */}
          <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 shadow-md flex items-center justify-center bg-blue-950 border border-blue-400/40">
            <img src="/miles/gold-emblem.png" alt="Gold Explorer Star" className="w-full h-full object-cover" />
          </div>

          {/* Tier Info & Progress Bar */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-bold text-white leading-none">Gold Explorer</span>
              <span className="text-xs font-semibold text-slate-300 font-mono">24,580 / 40,000 Miles</span>
            </div>
            {/* Chartreuse Lime Progress Indicator */}
            <div className="w-full bg-white/15 rounded-full h-2 overflow-hidden mb-1.5">
              <div
                className="bg-[#c8f328] h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(200,243,40,0.5)]"
                style={{ width: '61.4%' }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-300">
              <span>15,420 Miles to Platinum</span>
            </div>
          </div>

          {/* Right Chevron */}
          <span className="material-symbols-outlined text-slate-400 text-[20px] shrink-0">chevron_right</span>
        </div>
      </div>

      {/* ================= 2. FOUR QUICK ACTION BUTTONS ================= */}
      <div className="w-full shrink-0 px-4 mt-5 grid grid-cols-4 gap-2.5">
        {/* Action 1: Earn */}
        <button
          type="button"
          aria-label="Earn"
          onClick={() => {
            earnCustomMiles(24.0, 'Mysuru Express Corridor');
            showToast('+24.0 KM Earned & Credited to your Miles balance!', 'success');
          }}
          className="bg-[#f2eee7] hover:bg-[#eae4dc] active:scale-95 transition-all rounded-[20px] py-3.5 px-1.5 flex flex-col items-center justify-center gap-1.5 shadow-2xs border border-[#e8e2d6]"
        >
          <span className="material-symbols-outlined text-slate-900 text-[22px]" aria-hidden="true">bolt</span>
          <span className="text-xs font-bold text-slate-900">Earn</span>
        </button>

        {/* Action 2: Redeem */}
        <button
          type="button"
          aria-label="Redeem"
          onClick={() => {
            const success = redeemMilesPoints(15.0, 'Catalog Voucher');
            if (success !== false) {
              showToast('15.0 Miles Redeemed for ₹50 Voucher!', 'success');
            }
          }}
          className="bg-[#f2eee7] hover:bg-[#eae4dc] active:scale-95 transition-all rounded-[20px] py-3.5 px-1.5 flex flex-col items-center justify-center gap-1.5 shadow-2xs border border-[#e8e2d6]"
        >
          <span className="material-symbols-outlined text-slate-900 text-[22px]" aria-hidden="true">redeem</span>
          <span className="text-xs font-bold text-slate-900">Redeem</span>
        </button>

        {/* Action 3: Benefits */}
        <button
          type="button"
          aria-label="Benefits"
          onClick={() => setIsBenefitsOpen(true)}
          className="bg-[#f2eee7] hover:bg-[#eae4dc] active:scale-95 transition-all rounded-[20px] py-3.5 px-1.5 flex flex-col items-center justify-center gap-1.5 shadow-2xs border border-[#e8e2d6]"
        >
          <span className="material-symbols-outlined text-slate-900 text-[22px]" aria-hidden="true">workspace_premium</span>
          <span className="text-xs font-bold text-slate-900">Benefits</span>
        </button>

        {/* Action 4: History */}
        <button
          type="button"
          aria-label="History"
          onClick={() => setIsHistoryOpen(true)}
          className="bg-[#f2eee7] hover:bg-[#eae4dc] active:scale-95 transition-all rounded-[20px] py-3.5 px-1.5 flex flex-col items-center justify-center gap-1.5 shadow-2xs border border-[#e8e2d6]"
        >
          <span className="material-symbols-outlined text-slate-900 text-[22px]" aria-hidden="true">schedule</span>
          <span className="text-xs font-bold text-slate-900">History</span>
        </button>
      </div>

      {/* ================= 3. FEATURED REWARDS SECTION ================= */}
      <div className="w-full shrink-0 px-4 mt-6 flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-slate-900">
          {language === 'kn' ? t.rewardsCatalog : 'Featured rewards'}
        </h2>
        <button
          type="button"
          onClick={() => navigate('/options')}
          className="text-xs font-bold text-[#0042dd] flex items-center gap-0.5 hover:underline active:scale-95 transition-all"
        >
          <span>View all</span>
          <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
        </button>
      </div>

      {/* Primary Featured Reward: Landscape Card */}
      <div className="shrink-0 mx-4 rounded-[24px] overflow-hidden bg-[#091322] border border-slate-800/80 shadow-md flex items-stretch justify-between relative min-h-[160px] mb-3">
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

        {/* Right Side: Car Interior overlooking Mysore Palace */}
        <div className="w-[45%] relative shrink-0">
          <img
            src="/miles/featured-reward-interior.png"
            alt="Palace Ride Interior"
            className="w-full h-full object-cover object-left"
          />
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#091322] to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Secondary Rewards: Three Horizontally Aligned Smaller Cards */}
      <div className="w-full shrink-0 px-4 grid grid-cols-3 gap-2.5">
        {/* Secondary 1: Courier */}
        <div className="bg-[#f4f0ec] rounded-[20px] p-3 flex flex-col justify-between border border-[#e8e2d8] shadow-2xs hover:bg-white transition-colors">
          <div className="w-full flex justify-end mb-1">
            <img src="/miles/reward-box.png" alt="Courier delivery box" className="h-9 object-contain mix-blend-multiply" />
          </div>
          <div>
            <span className="text-xs font-extrabold text-slate-900 block leading-tight">₹100 off</span>
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5 leading-tight">on courier delivery</span>
          </div>
          <button
            type="button"
            onClick={() => {
              showToast('₹100 Courier reward claimed!', 'success');
              navigate('/courier');
            }}
            className="mt-2.5 bg-[#d4f84c] hover:bg-[#c6f135] active:scale-95 text-slate-950 text-[10px] font-extrabold py-1 px-2 rounded-full flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
          >
            <span>✦</span>
            <span>1,000 Miles</span>
          </button>
        </div>

        {/* Secondary 2: Partner Brands (Headphones) */}
        <div className="bg-[#f4f0ec] rounded-[20px] p-3 flex flex-col justify-between border border-[#e8e2d8] shadow-2xs hover:bg-white transition-colors">
          <div className="w-full flex justify-end mb-1">
            <img src="/miles/reward-headphones.png" alt="Headphones" className="h-9 object-contain mix-blend-multiply" />
          </div>
          <div>
            <span className="text-xs font-extrabold text-slate-900 block leading-tight">20% off</span>
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5 leading-tight">on partner brands</span>
          </div>
          <button
            type="button"
            onClick={() => showToast('20% Brand partner discount code unlocked: SKYSOUND20', 'success')}
            className="mt-2.5 bg-[#d4f84c] hover:bg-[#c6f135] active:scale-95 text-slate-950 text-[10px] font-extrabold py-1 px-2 rounded-full flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
          >
            <span>✦</span>
            <span>3,000 Miles</span>
          </button>
        </div>

        {/* Secondary 3: Free Beverage (Coffee) */}
        <div className="bg-[#f4f0ec] rounded-[20px] p-3 flex flex-col justify-between border border-[#e8e2d8] shadow-2xs hover:bg-white transition-colors">
          <div className="w-full flex justify-end mb-1">
            <img src="/miles/reward-coffee.png" alt="Coffee cup" className="h-9 object-contain mix-blend-multiply" />
          </div>
          <div>
            <span className="text-xs font-extrabold text-slate-900 block leading-tight">Free beverage</span>
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5 leading-tight">at select cafés</span>
          </div>
          <button
            type="button"
            onClick={() => showToast('Café beverage coupon unlocked: BREWPASS', 'success')}
            className="mt-2.5 bg-[#d4f84c] hover:bg-[#c6f135] active:scale-95 text-slate-950 text-[10px] font-extrabold py-1 px-2 rounded-full flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
          >
            <span>✦</span>
            <span>1,200 Miles</span>
          </button>
        </div>
      </div>

      {/* ================= 4. WAYS TO EARN MILES SECTION ================= */}
      <div className="w-full shrink-0 px-4 mt-7 mb-3">
        <h2 className="text-base font-bold text-slate-900">Ways to earn Miles</h2>
      </div>

      <div className="shrink-0 mx-4 bg-[#fbf9f5] rounded-[24px] border border-[#eee8df] shadow-2xs divide-y divide-[#eee8df]/70 overflow-hidden">
        {/* Row 1: Take a Ride */}
        <button
          type="button"
          onClick={() => navigate('/search')}
          className="w-full p-3.5 flex items-center justify-between gap-3 text-left hover:bg-white active:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-[#ede8de] flex items-center justify-center text-slate-800 shrink-0">
            <span className="material-symbols-outlined text-[20px]">directions_car</span>
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-bold text-slate-900 block leading-tight">Take a ride</span>
            <span className="text-[11px] font-medium text-slate-500 block mt-0.5">Earn 10 Miles per ₹100</span>
          </div>
          <span className="material-symbols-outlined text-slate-400 text-[18px] shrink-0">chevron_right</span>
        </button>

        {/* Row 2: Send a Parcel */}
        <button
          type="button"
          onClick={() => navigate('/courier')}
          className="w-full p-3.5 flex items-center justify-between gap-3 text-left hover:bg-white active:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-[#ede8de] flex items-center justify-center text-slate-800 shrink-0">
            <span className="material-symbols-outlined text-[20px]">inventory_2</span>
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-bold text-slate-900 block leading-tight">Send a parcel</span>
            <span className="text-[11px] font-medium text-slate-500 block mt-0.5">Earn 15 Miles per ₹100</span>
          </div>
          <span className="material-symbols-outlined text-slate-400 text-[18px] shrink-0">chevron_right</span>
        </button>

        {/* Row 3: Refer a Friend */}
        <button
          type="button"
          onClick={() => setIsReferralOpen(true)}
          className="w-full p-3.5 flex items-center justify-between gap-3 text-left hover:bg-white active:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-[#ede8de] flex items-center justify-center text-slate-800 shrink-0">
            <span className="material-symbols-outlined text-[20px]">group</span>
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-bold text-slate-900 block leading-tight">Refer a friend</span>
            <span className="text-[11px] font-medium text-slate-500 block mt-0.5">Earn 1,000 Miles each</span>
          </div>
          <span className="material-symbols-outlined text-slate-400 text-[18px] shrink-0">chevron_right</span>
        </button>

        {/* Row 4: Complete Challenges */}
        <button
          type="button"
          onClick={() => setIsChallengesOpen(true)}
          className="w-full p-3.5 flex items-center justify-between gap-3 text-left hover:bg-white active:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-[#ede8de] flex items-center justify-center text-slate-800 shrink-0">
            <span className="material-symbols-outlined text-[20px]">event_note</span>
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-bold text-slate-900 block leading-tight">Complete challenges</span>
            <span className="text-[11px] font-medium text-slate-500 block mt-0.5">Earn bonus Miles and unlock rewards</span>
          </div>
          <span className="material-symbols-outlined text-slate-400 text-[18px] shrink-0">chevron_right</span>
        </button>
      </div>

      {/* ================= 5. YOUR PROGRESS (HORIZONTAL MILESTONES) ================= */}
      <div className="w-full shrink-0 px-4 mt-7 mb-3">
        <h2 className="text-base font-bold text-slate-900">Your progress</h2>
      </div>

      <div className="w-full shrink-0 px-4">
        <div className="bg-[#fbf9f5] rounded-[24px] p-4 border border-[#eee8df] shadow-2xs">
          {/* Milestone Nodes Connected by Horizontal Line */}
          <div className="relative flex items-center justify-between px-2 pt-2 pb-1">
            {/* Horizontal Line: Lime for Completed, Gray for Locked */}
            <div className="absolute left-6 right-6 top-[22px] h-0.5 bg-[#d4d1c9] -z-0">
              <div className="h-full bg-[#a3e635] w-[75%]" />
            </div>

            {progressMilestones.map((m) => (
              <div key={m.name} className="flex flex-col items-center z-10">
                {m.current ? (
                  // Active Glowing Current Node (Gold)
                  <div className="w-8 h-8 rounded-full bg-[#a3e635] ring-4 ring-[#d9f99d] flex items-center justify-center shadow-sm">
                    <span className="text-white text-xs font-bold">✦</span>
                  </div>
                ) : m.achieved ? (
                  // Achieved Green Node with Check
                  <div className="w-7 h-7 rounded-full bg-[#a3e635] text-slate-950 flex items-center justify-center shadow-xs">
                    <span className="material-symbols-outlined text-[15px] font-bold">check</span>
                  </div>
                ) : (
                  // Locked Grey Node with Lock
                  <div className="w-7 h-7 rounded-full bg-[#e2ded6] text-slate-400 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[14px]">lock</span>
                  </div>
                )}

                <span className={`text-[11px] mt-2 block font-bold leading-none ${m.current ? 'text-slate-950 font-extrabold' : 'text-slate-700'}`}>
                  {m.name}
                </span>
                <span className="text-[9px] text-slate-400 font-semibold mt-1">
                  {m.threshold}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= 6. TIER BENEFITS — GOLD EXPLORER ================= */}
      <div className="w-full shrink-0 px-4 mt-7 flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-slate-900">
          Tier benefits — <span className="text-[#65a30d]">Gold Explorer</span>
        </h2>
        <button
          type="button"
          onClick={() => setIsBenefitsOpen(true)}
          className="text-xs font-bold text-[#0042dd] flex items-center gap-0.5 hover:underline active:scale-95 transition-all cursor-pointer"
        >
          <span>View all</span>
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </button>
      </div>

      <div className="w-full shrink-0 px-4 grid grid-cols-4 gap-2 mb-6">
        {/* Benefit 1: Higher rewards */}
        <div className="bg-[#f2eee7] rounded-[18px] p-2.5 flex flex-col items-center justify-center gap-1.5 border border-[#e5dfd3] shadow-2xs text-center">
          <span className="material-symbols-outlined text-slate-800 text-[18px]">sell</span>
          <span className="text-[10px] font-bold text-slate-800 leading-tight">Higher rewards</span>
        </div>

        {/* Benefit 2: Milestone bonuses */}
        <div className="bg-[#f2eee7] rounded-[18px] p-2.5 flex flex-col items-center justify-center gap-1.5 border border-[#e5dfd3] shadow-2xs text-center">
          <span className="material-symbols-outlined text-slate-800 text-[18px]">bolt</span>
          <span className="text-[10px] font-bold text-slate-800 leading-tight">Milestone bonuses</span>
        </div>

        {/* Benefit 3: Priority support */}
        <div className="bg-[#f2eee7] rounded-[18px] p-2.5 flex flex-col items-center justify-center gap-1.5 border border-[#e5dfd3] shadow-2xs text-center">
          <span className="material-symbols-outlined text-slate-800 text-[18px]">headset_mic</span>
          <span className="text-[10px] font-bold text-slate-800 leading-tight">Priority support</span>
        </div>

        {/* Benefit 4: Exclusive offers */}
        <div className="bg-[#f2eee7] rounded-[18px] p-2.5 flex flex-col items-center justify-center gap-1.5 border border-[#e5dfd3] shadow-2xs text-center">
          <span className="material-symbols-outlined text-slate-800 text-[18px]">auto_awesome</span>
          <span className="text-[10px] font-bold text-slate-800 leading-tight">Exclusive offers</span>
        </div>
      </div>

      {/* ================= MODAL: REFERRAL ================= */}
      {isReferralOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl flex flex-col gap-4 border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0042dd] text-[22px]">group_add</span>
                <h4 className="text-base font-bold text-slate-900">Refer a Friend</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsReferralOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Share your invite link with friends in Mysuru. When they take their first ride or send a parcel, you both receive <strong>1,000 Skyppy Miles</strong> directly credited.
            </p>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#0042dd]">SKYPE-JEEVAN-2026</span>
              <button
                type="button"
                onClick={() => showToast('Referral code copied to clipboard!', 'success')}
                className="bg-[#0042dd] text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-xs active:scale-95 cursor-pointer"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: CHALLENGES ================= */}
      {isChallengesOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl flex flex-col gap-4 border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0042dd] text-[22px]">emoji_events</span>
                <h4 className="text-base font-bold text-slate-900">Active Challenges</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsChallengesOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-2.5">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Weekend Corridor Master</span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+500 Miles</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Complete 3 rides between Friday evening and Sunday night.</p>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                  <div className="bg-[#0042dd] h-full rounded-full w-2/3" />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Green Commuter</span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+300 Miles</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Take 2 Electric Auto rides across Mysuru.</p>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                  <div className="bg-[#0042dd] h-full rounded-full w-1/2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: TIER BENEFITS ================= */}
      {isBenefitsOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl flex flex-col gap-4 border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#65a30d] text-[22px]">workspace_premium</span>
                <h4 className="text-base font-bold text-slate-900">Gold Explorer Privileges</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsBenefitsOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-3 text-xs text-slate-600 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#65a30d] text-[18px] mt-0.5">verified</span>
                <div>
                  <strong className="text-slate-900 block font-bold">1.5x Multiplier on All Trips:</strong>
                  <span>Every kilometer earns 1.5x base distance miles on rides and courier dispatches.</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#65a30d] text-[18px] mt-0.5">bolt</span>
                <div>
                  <strong className="text-slate-900 block font-bold">Zero Surge Protection:</strong>
                  <span>Peak surge pricing is permanently waived for Gold Explorer tier members across Mysuru.</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#65a30d] text-[18px] mt-0.5">headset_mic</span>
                <div>
                  <strong className="text-slate-900 block font-bold">Priority Hotline Dispatch:</strong>
                  <span>Direct phone line access to senior Mysuru operations supervisors 24/7.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: DISTANCE HISTORY ================= */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl flex flex-col gap-4 border border-slate-200 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0042dd] text-[22px]">history</span>
                <h4 className="text-base font-bold text-slate-900">Miles History</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsHistoryOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer"
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

      {/* ================= MODAL: EXPLAINER ================= */}
      {isExplainerOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl flex flex-col gap-4 border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0042dd] text-[24px]">military_tech</span>
                <h4 className="text-base font-bold text-slate-900">What is Skyppy Miles?</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsExplainerOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer"
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
              className="w-full py-3 rounded-xl bg-[#0042dd] text-white text-xs font-bold shadow-md active:scale-95 transition-transform mt-1 cursor-pointer"
            >
              Got It, Let's Ride
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
