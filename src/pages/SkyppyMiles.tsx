import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { MilesOrbit } from '../components/miles/MilesOrbit';
import { useAppStore } from '../store/useAppStore';
import { translations } from '../utils/i18n';

export const SkyppyMiles: React.FC = () => {
  const navigate = useNavigate();
  const { miles, redeemVoucher, earnCustomMiles, redeemMilesPoints, showToast, language } = useAppStore();
  const t = translations[language] || translations.en;
  const [isExplainerOpen, setIsExplainerOpen] = useState(false);

  const handleApplyVoucher = (voucher: { id: string; code: string; title: string; redeemed: boolean }) => {
    redeemVoucher(voucher.id);
    showToast(`Voucher ${voucher.code} redeemed! Applied to your booking session.`, 'success');
    navigate('/options');
  };

  const nextGoalKm = miles.nextMilestoneKm;
  const kmRemaining = Math.max(0, Number((nextGoalKm - miles.lifetimeKm).toFixed(1)));
  const progressPercent = Math.min(100, Math.round((miles.lifetimeKm / nextGoalKm) * 100));

  return (
    <div className="flex-1 flex flex-col relative w-full pb-8 bg-surface min-h-full">
      <Header type="tab" />

      <main className="flex flex-col w-full px-margin pb-6 gap-space-lg">
        {/* Top Context & Tier Header */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-space-sm">
            <span className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
              {t.skyppyMiles}
            </span>
            <button
              aria-label="Miles rules information"
              onClick={() => setIsExplainerOpen(true)}
              className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-tertiary hover:text-primary transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">info</span>
            </button>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container shadow-xs">
            <span className="material-symbols-outlined text-[16px] fill-1">workspace_premium</span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider font-extrabold">
              {miles.currentTier}
            </span>
          </div>
        </div>

        {/* ================= SIGNATURE MILES ORBIT HERO CARD ================= */}
        <div className="relative overflow-hidden rounded-3xl bg-[#0a121d] text-white p-5 shadow-2xl border border-white/10 flex flex-col items-center">
          {/* Subtle background ambient blur spots */}
          <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
          <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-[#d4ee66]/15 blur-3xl pointer-events-none" />

          {/* Top telemetry bar */}
          <div className="w-full flex items-center justify-between text-xs mb-2 z-10">
            <span className="font-label-sm text-[11px] uppercase tracking-widest text-slate-400 font-bold">
              {language === 'kn' ? t.lifetimeMiles : 'The Miles Orbit'}
            </span>
            <div className="flex items-center gap-1 text-[#d4ee66] font-label-md text-xs bg-white/10 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4ee66] animate-ping" />
              <span>100% Distance-Backed</span>
            </div>
          </div>

          {/* Proprietary Miles Orbit Interactive Motion Centerpiece */}
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
          <div className="w-full bg-white/5 rounded-2xl p-4 mt-4 backdrop-blur-md border border-white/10 z-10 space-y-2.5">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-300">
                Next Tier Target: <strong className="text-white font-mono">{nextGoalKm} KM</strong>
              </span>
              <span className="text-[#d4ee66] font-bold">
                {kmRemaining > 0 ? `${kmRemaining} km remaining` : 'Milestone Achieved!'}
              </span>
            </div>

            {/* Progress track */}
            <div className="relative w-full h-3 bg-white/15 rounded-full overflow-hidden flex items-center">
              <div
                className="h-full bg-gradient-to-r from-primary via-primary-container to-[#d4ee66] rounded-full transition-all duration-700 shadow-sm"
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

        {/* Active & Ready Rewards (Carousel) */}
        <div className="flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">redeem</span>
              <span className="font-headline-md text-headline-md text-on-surface font-bold">
                {t.rewardsCatalog}
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-secondary font-bold uppercase bg-secondary-container/40 px-2 py-0.5 rounded-full">
              {miles.rewards.filter((r) => !r.redeemed).length} Ready
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 -mx-margin px-margin scrollbar-none snap-x snap-mandatory">
            {miles.rewards.map((rew) => (
              <div
                key={rew.id}
                className="snap-start shrink-0 w-[270px] bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant/20 flex flex-col justify-between gap-3 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary-container/10 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary shadow-xs">
                    <span className="material-symbols-outlined text-[24px]">{rew.icon}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-[11px] font-bold">
                    {rew.redeemed ? 'Redeemed' : rew.validDays}
                  </span>
                </div>
                <div>
                  <span className="font-headline-md text-headline-md text-on-surface block leading-tight font-bold">
                    {rew.title}
                  </span>
                  <span className="font-body-sm text-body-sm text-tertiary mt-0.5 block">{rew.desc}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleApplyVoucher(rew)}
                  className={`w-full py-2.5 px-3 rounded-xl font-label-md text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform cursor-pointer font-bold ${
                    rew.redeemed
                      ? 'bg-secondary-container text-on-secondary-container'
                      : 'bg-primary text-on-primary hover:bg-primary/95'
                  }`}
                >
                  <span>{rew.redeemed ? 'Applied to Next Ride' : 'Redeem & Apply'}</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Vertical Milestone Ladder */}
        <div className="flex flex-col gap-space-sm bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant/20">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant/15">
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Milestone Ladder</h3>
              <p className="font-body-sm text-body-sm text-tertiary">Unlock perpetual privileges as your distance adds up</p>
            </div>
            <span className="material-symbols-outlined text-primary text-[24px]">flag</span>
          </div>

          <div className="relative flex flex-col gap-5 mt-2 ml-2">
            <div className="absolute left-[15px] top-3 bottom-5 w-0.5 bg-surface-container-highest" />

            {miles.milestones.map((m) => {
              const isUnlocked = miles.lifetimeKm >= m.km;
              const isAlmost = !isUnlocked && m.km - miles.lifetimeKm <= 6;
              const diff = (m.km - miles.lifetimeKm).toFixed(1);

              return (
                <div key={m.id} className="relative flex items-start gap-3.5 z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                      isUnlocked
                        ? 'bg-secondary-container text-on-secondary-container'
                        : isAlmost
                        ? 'bg-primary text-on-primary animate-pulse'
                        : 'bg-surface-container text-tertiary opacity-70'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px] font-bold">
                      {isUnlocked ? 'check' : isAlmost ? 'lock_open' : 'lock'}
                    </span>
                  </div>

                  <div
                    className={`flex-1 rounded-xl p-3 border transition-colors ${
                      isAlmost
                        ? 'bg-primary/10 border-primary/40 shadow-xs'
                        : isUnlocked
                        ? 'bg-surface-container-low/70 border-outline-variant/10'
                        : 'bg-surface-container-low border-transparent opacity-70'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-label-lg text-label-lg font-bold text-on-surface">{m.title}</span>
                      <span
                        className={`font-label-sm text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          isUnlocked
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : isAlmost
                            ? 'bg-secondary-container text-on-secondary-container'
                            : 'text-tertiary bg-surface-container'
                        }`}
                      >
                        {isUnlocked ? 'UNLOCKED' : isAlmost ? `${diff} KM LEFT!` : 'LOCKED'}
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-tertiary mt-0.5">{m.desc}</p>
                    {m.completedDate && (
                      <span className="font-label-sm text-label-sm text-outline mt-1 block">{m.completedDate}</span>
                    )}
                    {isAlmost && (
                      <div className="w-full bg-surface-container rounded-full h-2 mt-2.5 overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(99, Math.round((miles.lifetimeKm / m.km) * 100))}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-time Distance Ledger */}
        <div className="flex flex-col gap-space-sm bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant/20">
          <div className="flex items-center justify-between border-b border-outline-variant/15 pb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">history_edu</span>
              <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Distance Ledger</h3>
            </div>
            <span className="font-label-sm text-[10px] text-secondary font-bold uppercase tracking-wider bg-secondary-container/40 px-2 py-0.5 rounded-full">
              Real-time sync
            </span>
          </div>

          <div className="flex flex-col gap-2.5 mt-1">
            {miles.ledger.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-primary shadow-xs">
                    <span className="material-symbols-outlined text-[20px]">
                      {item.km < 0 ? 'redeem' : 'directions_car'}
                    </span>
                  </div>
                  <div>
                    <span className="font-label-lg text-xs text-on-surface font-bold block">{item.route}</span>
                    <span className="font-body-sm text-[11px] text-tertiary">{item.mode} • {item.date}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`font-numeric-md text-xs font-mono font-bold block ${
                      item.km < 0 ? 'text-rose-600' : 'text-primary'
                    }`}
                  >
                    {item.km < 0 ? `${item.km} km` : `+${item.km} km`}
                  </span>
                  <span className="text-[10px] font-bold text-secondary uppercase">
                    {item.km < 0 ? 'Redeemed' : 'Credited'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Explainer Modal */}
      {isExplainerOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-surface-container-lowest rounded-3xl p-5 shadow-2xl flex flex-col gap-4 border border-outline-variant/30">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/15">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">military_tech</span>
                <h4 className="font-headline-md text-headline-md text-on-surface font-bold">What is Skyppy Miles?</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsExplainerOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-tertiary hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-3 font-body-md text-xs text-on-surface-variant leading-relaxed">
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-secondary mt-0.5 text-[18px]">verified</span>
                <p>
                  <strong className="text-on-surface">Pure distance, zero points math:</strong> Every single GPS kilometre you complete adds 1.0 km straight to your profile orbit.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-secondary mt-0.5 text-[18px]">hourglass_disabled</span>
                <p>
                  <strong className="text-on-surface">Never expires:</strong> Your accrued distance stays locked in. Tier privileges never downgrade from inactivity.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-secondary mt-0.5 text-[18px]">swap_driving_apps_wheel</span>
                <p>
                  <strong className="text-on-surface">Multi-modal mobility:</strong> Auto rides, cabs, and intercity parcel shipments across Mysuru all contribute equally.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsExplainerOpen(false)}
              className="w-full py-3 rounded-xl bg-primary text-on-primary font-label-lg text-xs font-bold shadow-md active:scale-95 transition-transform mt-1"
            >
              Got It, Let's Ride
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
