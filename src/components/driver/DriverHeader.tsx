import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDriverStore } from '../../store/useDriverStore';
import { useAppStore } from '../../store/useAppStore';

export const DriverHeader: React.FC = () => {
  const navigate = useNavigate();
  const {
    driverStatus,
    toggleOnlineStatus,
    networkStatus,
    profile,
    notifications,
    setDemoModalOpen
  } = useDriverStore();

  const { language, setLanguage } = useAppStore();
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const unreadCount = notifications.filter((n) => n.unread).length;
  const isOnline = driverStatus !== 'OFFLINE';

  const toggleLang = () => {
    setLanguage(language === 'en' ? 'kn' : 'en');
  };

  return (
    <header className="sticky top-0 left-0 right-0 w-full z-40 bg-surface/95 backdrop-blur-xl border-b border-surface-container/60 shrink-0 select-none shadow-[0_1px_6px_rgba(0,0,0,0.03)]">
      {/* Network Alert Banner when Poor or Offline */}
      {networkStatus !== 'ONLINE' && (
        <div
          className={`w-full px-3 py-1 text-center text-xs font-semibold flex items-center justify-center gap-1.5 ${
            networkStatus === 'OFFLINE'
              ? 'bg-rose-500 text-white'
              : 'bg-amber-400 text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">
            {networkStatus === 'OFFLINE' ? 'wifi_off' : 'signal_cellular_connected_no_internet_4_bar'}
          </span>
          <span>
            {networkStatus === 'OFFLINE'
              ? 'Offline mode · Changes queued locally'
              : 'Weak GPS & Cellular signal · Retrying...'}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between px-3 sm:px-4 h-14 w-full">
        {/* Left: Skyppy Driver Logo & Switcher to Passenger App */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => navigate('/driver-view')}>
            {/* Skyppy Emblem */}
            <div className="w-7.5 h-7.5 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-base shadow-xs">
              S
            </div>
            <div className="flex flex-col leading-none">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight">
                  Skyppy
                </span>
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-slate-900 text-[#d4f84c] uppercase tracking-wider">
                  Driver
                </span>
              </div>
              <span className="text-[9px] text-slate-500 font-medium uppercase tracking-widest mt-0.5">
                Driver Partner
              </span>
            </div>
          </div>
        </div>

        {/* Right: Availability Toggle, Rating, Language, Notifications, Return to Passenger */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Online / Offline Availability Switch Pill */}
          <button
            type="button"
            onClick={toggleOnlineStatus}
            className={`h-7.5 px-2.5 rounded-full font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-xs ${
              isOnline
                ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
            }`}
            title="Toggle Driver Availability"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isOnline ? 'bg-white animate-pulse' : 'bg-slate-400'
              }`}
            />
            <span className="text-[11px] uppercase tracking-wider font-extrabold">
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
          </button>

          {/* Rating Pill */}
          <div className="hidden sm:flex items-center gap-0.5 px-2 h-7.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[11px] font-bold border border-amber-200/50">
            <span className="material-symbols-outlined text-[14px] text-amber-500">star</span>
            <span>{profile.rating.toFixed(2)}</span>
          </div>

          {/* Language Toggle */}
          <button
            type="button"
            aria-label="Switch language English or Kannada"
            onClick={toggleLang}
            className="h-7.5 px-2 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-primary dark:text-primary-fixed hover:bg-slate-200 transition-colors flex items-center gap-0.5 active:scale-95"
            title="Switch Language (English / ಕನ್ನಡ)"
          >
            <span className="material-symbols-outlined text-[13px]">translate</span>
            <span className="text-[10.5px]">{language === 'en' ? 'ಕನ್ನಡ' : 'EN'}</span>
          </button>

          {/* Notifications Bell with Dropdown */}
          <div className="relative">
            <button
              type="button"
              aria-label="Driver Notifications"
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="w-7.5 h-7.5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors relative active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {/* Notification Dropdown Drawer */}
            {notifDropdownOpen && (
              <div className="absolute right-0 top-10 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Driver Alerts
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {unreadCount} unread
                  </span>
                </div>
                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2 rounded-xl text-left transition-colors ${
                        n.unread
                          ? 'bg-blue-50/70 dark:bg-blue-950/30'
                          : 'bg-slate-50 dark:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {n.title}
                        </span>
                        <span className="text-[9px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2">
                        {n.message}
                      </p>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setNotifDropdownOpen(false)}
                  className="w-full mt-2 py-1.5 text-center text-xs font-semibold text-primary hover:underline"
                >
                  Close
                </button>
              </div>
            )}
          </div>

          {/* Discreet Return to Passenger App */}
          <button
            type="button"
            aria-label="Return to Passenger App"
            onClick={() => navigate('/')}
            className="h-7.5 px-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-[11px] flex items-center gap-1 active:scale-95 transition-all border border-slate-200 dark:border-slate-700"
            title="Return to Skyppy Passenger Booking"
          >
            <span className="material-symbols-outlined text-[14px]">arrow_back</span>
            <span>Passenger App</span>
          </button>

          {/* Discreet DEMO Trigger Button */}
          <button
            type="button"
            onClick={() => setDemoModalOpen(true)}
            className="h-7.5 px-2 rounded-full bg-[#d4f84c] text-black font-extrabold text-[10px] tracking-wide flex items-center gap-0.5 hover:bg-[#c2e838] transition-colors active:scale-95 shadow-xs"
            title="Open Demo & Testing Controls"
          >
            <span className="material-symbols-outlined text-[13px]">tune</span>
            <span>DEMO</span>
          </button>
        </div>
      </div>
    </header>
  );
};
