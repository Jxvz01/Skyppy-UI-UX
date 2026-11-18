import React from 'react';
import { useDriverStore } from '../../store/useDriverStore';

export const NetworkBanner: React.FC = () => {
  const { networkStatus, queuedActions, setNetworkStatus } = useDriverStore();

  if (networkStatus === 'ONLINE') return null;

  const isPoor = networkStatus === 'POOR_NETWORK';

  return (
    <div
      className={`px-4 py-2 flex items-center justify-between text-xs font-semibold select-none z-30 transition-all ${
        isPoor
          ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-b border-amber-500/30'
          : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-b border-rose-500/30'
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-[16px] animate-pulse">
          {isPoor ? 'network_check' : 'signal_wifi_off'}
        </span>
        <span>
          {isPoor
            ? 'Intermittent connection detected. Trip data queued locally.'
            : 'You are currently offline. Actions will sync automatically upon reconnection.'}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {queuedActions.length > 0 && (
          <span className="text-[10px] bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded-full font-mono">
            {queuedActions.length} queued
          </span>
        )}
        <button
          onClick={() => setNetworkStatus('ONLINE')}
          className="text-[11px] underline hover:no-underline font-bold"
        >
          Reconnect
        </button>
      </div>
    </div>
  );
};
