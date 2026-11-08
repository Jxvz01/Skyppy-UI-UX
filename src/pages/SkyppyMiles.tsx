import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { useAppStore } from '../store/useAppStore';

export const SkyppyMiles: React.FC = () => {
  const navigate = useNavigate();
  const { miles, redeemVoucher, showToast } = useAppStore();
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
    <div className="flex-1 flex flex-col relative w-full pb-6 bg-surface min-h-full">
      <Header type="tab" />

      <main className="flex flex-col w-full px-margin pb-6 gap-space-lg">
        {/* Top Context & Tier Header */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-space-sm">
            <span className="font-headline-lg text-headline-lg text-on-surface font-bold">Skyppy Miles</span>
            <button
              aria-label="Miles rules information"
              onClick={() => setIsExplainerOpen(true)}
              className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-tertiary hover:text-primary transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">info</span>
            </button>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container shadow-sm">
            <span className="material-symbols-outlined text-[16px] fill-1">workspace_premium</span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">
              {miles.currentTier}
            </span>
          </div>
        </div>

        {/* Hero Distance Card (Midnight Tech Canopy) */}
        <div className="relative overflow-hidden rounded-xl bg-inverse-surface text-inverse-on-surface p-5 shadow-xl">
          <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-primary-container/20 blur-3xl pointer-events-none"></div>
          <div className="absolute -left-10 -bottom-10 w-36 h-36 rounded-full bg-secondary-fixed/15 blur-2xl pointer-events-none"></div>

          <div className="relative flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline-variant font-bold">
                Total Distance Travelled
              </span>
              <div className="flex items-center gap-1 text-secondary-fixed font-label-md text-label-md bg-white/10 px-2 py-0.5 rounded-full">
                <span className="material-symbols-outlined text-[14px]">speed</span>
                <span>100% Distance-Backed</span>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="font-numeric-xl text-[44px] leading-none tracking-tight font-extrabold text-surface-container-lowest">
                  {miles.lifetimeKm}
                </span>
                <span className="font-headline-md text-headline-md font-bold text-secondary-fixed">KM</span>
              </div>
              <p className="font-body-sm text-body-sm text-surface-dim mt-1.5 flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-secondary-fixed"></span>
                This month: <span className="text-surface-container-lowest font-medium">{miles.monthlyKm} km</span> across {miles.monthlyTrips} trips
              </p>
            </div>

            {/* Milestone Gauge Container */}
            <div className="bg-white/5 rounded-xl p-3.5 mt-1 backdrop-blur-sm shadow-inner">
              <div className="flex justify-between items-center text-xs font-medium mb-2">
                <span className="font-label-sm text-label-sm uppercase text-surface-dim">
                  Next Goal: <strong className="text-surface-container-lowest">{nextGoalKm} KM</strong>
                </span>
                <span className="font-label-sm text-label-sm text-secondary-fixed font-bold">
                  {kmRemaining > 0 ? `${kmRemaining} km remaining` : 'Milestone Achieved!'}
                </span>
              </div>
              <div className="relative w-full h-3 bg-white/15 rounded-full overflow-visible flex items-center">
                <div
                  className="h-full bg-gradient-to-r from-primary-container via-primary-fixed-dim to-secondary-fixed rounded-full relative transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="absolute -right-2 -top-1 w-5 h-5 rounded-full bg-secondary-container text-on-secondary-container shadow-md flex items-center justify-center transform scale-110">
                    <span className="material-symbols-outlined text-[12px] font-bold">arrow_forward</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-2.5 font-label-sm text-label-sm text-outline-variant">
                <span>Tier Base: 200 km</span>
                <span className="text-secondary-fixed font-semibold">Tier 3 Master at 300 km</span>
              </div>
            </div>
          </div>
        </div>

        {/* Active & Ready Rewards (Carousel) */}
        <div className="flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">redeem</span>
              <span className="font-headline-md text-headline-md text-on-surface font-bold">Available Vouchers</span>
            </div>
            <span className="font-label-sm text-label-sm text-secondary font-bold uppercase">
              {miles.rewards.filter((r) => !r.redeemed).length} Ready
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 -mx-margin px-margin scrollbar-none snap-x snap-mandatory">
            {miles.rewards.map((rew) => (
              <div
                key={rew.id}
                className="snap-start shrink-0 w-[270px] bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col justify-between gap-3 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary-container/10 rounded-full blur-xl pointer-events-none"></div>
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[24px]">{rew.icon}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm font-bold">
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
                  className={`w-full py-2 px-3 rounded-lg font-label-md text-label-md flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform cursor-pointer font-bold ${
                    rew.redeemed
                      ? 'bg-secondary-container text-on-secondary-container'
                      : 'bg-primary-container text-on-primary'
                  }`}
                >
                  <span>{rew.redeemed ? 'Applied to Next Ride' : 'Redeem & Apply'}</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Vertical Milestone Timeline */}
        <div className="flex flex-col gap-space-sm bg-surface-container-lowest rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between pb-2">
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Milestone Ladder</h3>
              <p className="font-body-sm text-body-sm text-tertiary">Unlock perpetual privileges as your distance adds up</p>
            </div>
            <span className="material-symbols-outlined text-primary-container text-[24px]">flag</span>
          </div>

          <div className="relative flex flex-col gap-5 mt-2 ml-2">
            <div className="absolute left-[15px] top-3 bottom-5 w-0.5 bg-surface-container-highest"></div>

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
                        ? 'bg-primary-container text-on-primary animate-pulse'
                        : 'bg-surface-container text-tertiary opacity-70'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px] font-bold">
                      {isUnlocked ? 'check' : isAlmost ? 'lock_open' : 'lock'}
                    </span>
                  </div>

                  <div
                    className={`flex-1 rounded-lg p-3 ${
                      isAlmost
                        ? 'bg-primary-fixed/30 shadow-sm ring-1 ring-primary/40'
                        : isUnlocked
                        ? 'bg-surface-container-low/70'
                        : 'bg-surface-container-low opacity-70'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-label-lg text-label-lg font-bold text-on-surface">{m.title}</span>
                      <span
                        className={`font-label-sm text-label-sm font-bold uppercase ${
                          isUnlocked
                            ? 'text-secondary'
                            : isAlmost
                            ? 'px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container'
                            : 'text-tertiary'
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
                          className="bg-primary-container h-full rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(99, Math.round((miles.lifetimeKm / m.km) * 100))}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Distance Ledger */}
        <div className="flex flex-col gap-space-sm bg-surface-container-lowest rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">history_edu</span>
              <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Distance Ledger</h3>
            </div>
            <span className="font-label-sm text-label-sm text-secondary font-bold">Real-time sync</span>
          </div>

          <div className="flex flex-col gap-2.5 mt-1">
            {miles.ledger.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">directions_car</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">{item.route}</span>
                    <span className="font-body-sm text-body-sm text-tertiary">{item.mode}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-numeric-md text-numeric-md font-bold text-primary-container">+{item.km} km</span>
                  <span className="block font-label-sm text-label-sm text-secondary font-medium">Credited</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Explainer Modal */}
      {isExplainerOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-surface-container-lowest rounded-2xl p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">military_tech</span>
                <h4 className="font-headline-md text-headline-md text-on-surface font-bold">What are Skyppy Miles?</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsExplainerOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-tertiary hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-3 font-body-md text-body-md text-on-surface-variant">
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-secondary mt-0.5">verified</span>
                <p>
                  <strong className="text-on-surface">Pure distance, zero points math:</strong> Every single GPS kilometre you complete adds 1.0 km straight to your profile ledger.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-secondary mt-0.5">hourglass_disabled</span>
                <p>
                  <strong className="text-on-surface">Never expires:</strong> Your accrued distance stays locked in. Tiers never downgrade from inactivity.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-secondary mt-0.5">swap_driving_apps_wheel</span>
                <p>
                  <strong className="text-on-surface">Multi-modal mobility:</strong> Auto rides, cabs, and parcel drops across Mysuru all contribute equally.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsExplainerOpen(false)}
              className="w-full py-3 rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg font-bold shadow-md active:scale-95 transition-transform mt-1"
            >
              Got It, Let's Ride
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
