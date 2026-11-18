import React, { useState } from 'react';
import { useDriverStore } from '../../store/useDriverStore';

export const DriverEarnings: React.FC = () => {
  const { profile, weeklyEarnings } = useDriverStore();
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(6); // Default to Sunday (Today)
  const [withdrawn, setWithdrawn] = useState(false);

  const totalWeekly = weeklyEarnings.reduce((acc, curr) => acc + curr.amount, 0);
  const selectedDay = weeklyEarnings[selectedDayIdx] || weeklyEarnings[6];
  const maxAmount = Math.max(...weeklyEarnings.map((d) => d.amount));

  const handleInstantPayout = () => {
    setWithdrawn(true);
    setTimeout(() => {
      setWithdrawn(false);
    }, 4000);
  };

  return (
    <div className="flex-1 w-full h-full flex flex-col bg-surface overflow-y-auto px-4 py-4 space-y-4">
      {/* Title */}
      <div>
        <h2 className="text-lg font-bold text-on-surface tracking-tight">Earnings & Payouts</h2>
        <p className="text-xs text-on-surface-variant font-medium">Real-time driver financial ledger</p>
      </div>

      {/* Main Balance Hero Card */}
      <div className="bg-gradient-to-br from-primary/15 via-primary/5 to-transparent rounded-3xl p-5 border border-primary/20 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Available Balance</span>
          <span className="text-[10px] bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
            Instant Withdrawal
          </span>
        </div>

        <div>
          <div className="text-3xl font-extrabold text-on-surface font-mono tracking-tight">
            ₹{profile.todayEarnings}
          </div>
          <p className="text-[11px] text-on-surface-variant mt-0.5">
            Earned from {profile.todayTrips} trips today • {Math.floor(profile.todayOnlineMinutes / 60)}h{' '}
            {profile.todayOnlineMinutes % 60}m active
          </p>
        </div>

        {withdrawn ? (
          <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-2xl p-3 flex items-center gap-2.5 text-emerald-700 dark:text-emerald-300">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            <div className="text-xs font-semibold">
              Payout of ₹{profile.todayEarnings} initiated to HDFC Bank A/C **8821!
            </div>
          </div>
        ) : (
          <button
            onClick={handleInstantPayout}
            className="w-full py-3 bg-primary hover:bg-primary/95 text-on-primary font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
            Instant Cash Out to Bank
          </button>
        )}
      </div>

      {/* Weekly Earnings Chart */}
      <div className="bg-surface-container-low rounded-3xl p-4 border border-outline-variant/30 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">
              This Week (Mon - Sun)
            </span>
            <h4 className="text-base font-bold text-on-surface font-mono mt-0.5">₹{totalWeekly}</h4>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-mono text-emerald-600 font-bold">
              {weeklyEarnings.reduce((acc, curr) => acc + curr.trips, 0)} Total Rides
            </span>
          </div>
        </div>

        {/* Bar Chart Visualization */}
        <div className="pt-4 pb-2 flex items-end justify-between gap-2 h-40">
          {weeklyEarnings.map((item, idx) => {
            const heightPct = Math.round((item.amount / maxAmount) * 100);
            const isSelected = selectedDayIdx === idx;
            return (
              <div
                key={item.day}
                onClick={() => setSelectedDayIdx(idx)}
                className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer group"
              >
                <span className="text-[9px] font-mono text-on-surface-variant/70 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  ₹{item.amount}
                </span>
                <div
                  style={{ height: `${Math.max(12, heightPct)}%` }}
                  className={`w-full max-w-[28px] rounded-t-lg transition-all duration-200 ${
                    isSelected
                      ? 'bg-primary shadow-md'
                      : item.isToday
                      ? 'bg-emerald-500/70 group-hover:bg-emerald-500'
                      : 'bg-surface-container-highest hover:bg-primary/50'
                  }`}
                />
                <span
                  className={`text-[10px] font-bold mt-2 ${
                    isSelected ? 'text-primary' : 'text-on-surface-variant'
                  }`}
                >
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>

        {/* Selected Day Detail Box */}
        {selectedDay && (
          <div className="bg-surface-container p-3 rounded-2xl flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-on-surface">
                {selectedDay.day}, {selectedDay.dateStr}
              </span>
              <span className="text-[11px] text-on-surface-variant block">
                {selectedDay.trips} trips • {selectedDay.hoursOnline} hours online
              </span>
            </div>
            <div className="text-right font-mono font-bold text-primary text-sm">
              ₹{selectedDay.amount}
            </div>
          </div>
        )}
      </div>

      {/* Daily Incentive Bonus Tracker */}
      <div className="bg-surface-container-low rounded-3xl p-4 border border-outline-variant/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-500 text-[20px]">military_tech</span>
            <span className="text-xs font-bold text-on-surface">Daily Milestone Target</span>
          </div>
          <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
            +₹250 Bonus
          </span>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-on-surface-variant">Complete 10 rides today</span>
            <span className="font-mono font-bold text-on-surface">7 / 10 completed</span>
          </div>
          <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full transition-all duration-300" style={{ width: '70%' }} />
          </div>
          <p className="text-[10px] text-on-surface-variant mt-1.5">
            Complete 3 more rides before 11:59 PM to unlock your ₹250 daily partner bonus.
          </p>
        </div>
      </div>

      {/* Linked Bank Account Card */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined text-[20px]">account_balance</span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-on-surface">HDFC Bank •• 8821</h4>
            <p className="text-[10px] text-on-surface-variant font-mono">IFSC: HDFC0001234 • Ramesh Kumar</p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
          Primary
        </span>
      </div>
    </div>
  );
};
