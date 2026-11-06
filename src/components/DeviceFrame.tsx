import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { ModalsContainer } from './Modals';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const location = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [timeStr, setTimeStr] = useState('09:41');

  const isTabRoute = ['/', '/activity', '/miles', '/profile'].includes(location.pathname);

  // Real-time status bar clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let h = now.getHours();
      let m = now.getMinutes();
      setTimeStr(`${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Ensure view resets to top on screen transitions
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen w-full bg-[#0a0d14] flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden select-none">
      {/* REALISTIC SMARTPHONE SHELL (approx. 390 x 844 CSS viewport) */}
      <div className="relative w-full sm:w-[390px] h-[100dvh] sm:h-[844px] sm:max-h-[calc(100vh-2rem)] sm:rounded-[52px] sm:p-[10px] bg-[#161a23] sm:ring-1 sm:ring-white/10 sm:shadow-[0_25px_70px_rgba(0,0,0,0.65),0_10px_30px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.06)] flex flex-col transition-all duration-200">
        
        {/* Subtle Smartphone Hardware Buttons (Desktop Frame Only) */}
        {/* Left Edge: Action/Mute Switch & Volume Rockers */}
        <div className="hidden sm:block absolute -left-[13px] top-[115px] w-[3px] h-[28px] bg-slate-700/80 rounded-l-sm" />
        <div className="hidden sm:block absolute -left-[13px] top-[160px] w-[3px] h-[52px] bg-slate-700/80 rounded-l-sm" />
        <div className="hidden sm:block absolute -left-[13px] top-[225px] w-[3px] h-[52px] bg-slate-700/80 rounded-l-sm" />
        {/* Right Edge: Side / Power Button */}
        <div className="hidden sm:block absolute -right-[13px] top-[175px] w-[3px] h-[78px] bg-slate-700/80 rounded-r-sm" />

        {/* PHONE SCREEN CONTAINER */}
        <div className="relative flex-1 w-full bg-surface sm:rounded-[42px] overflow-hidden flex flex-col [transform:translateZ(0)] isolate select-auto shadow-inner">
          
          {/* REALISTIC STATUS BAR */}
          <div className="h-11 w-full bg-surface/95 backdrop-blur-md px-7 pt-1 flex items-center justify-between z-50 shrink-0 select-none border-b border-black/[0.03]">
            {/* Live Clock */}
            <span className="text-[13px] font-semibold text-on-surface tracking-tight w-12 text-left">
              {timeStr}
            </span>

            {/* Dynamic Island Pill */}
            <div className="w-[112px] h-[26px] bg-black rounded-full flex items-center justify-between px-3 shadow-inner">
              {/* Front Camera Lens */}
              <div className="w-2.5 h-2.5 rounded-full bg-[#121622] ring-1 ring-slate-800 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-blue-900/60" />
              </div>
              {/* Sensor Indicator */}
              <div className="w-1.5 h-1.5 rounded-full bg-[#0d1017]" />
            </div>

            {/* Status Icons: Signal, Wi-Fi, Battery */}
            <div className="flex items-center gap-1.5 text-on-surface text-[13px] w-12 justify-end">
              <span className="material-symbols-outlined text-[15px] font-bold">signal_cellular_4_bar</span>
              <span className="material-symbols-outlined text-[15px]">wifi</span>
              {/* Battery indicator with realistic fill */}
              <div className="w-5 h-2.5 border border-on-surface/80 rounded-[3px] p-[1px] flex items-center relative">
                <div className="h-full w-full bg-on-surface rounded-[1px]" />
                <div className="absolute -right-[3px] top-0.5 w-[2px] h-[4px] bg-on-surface/80 rounded-r-[1px]" />
              </div>
            </div>
          </div>

          {/* INNER APP ACTIVE VIEWPORT (Scrollable Content Area) */}
          <div
            ref={scrollRef}
            id="mobile-app-viewport"
            className="flex-1 w-full bg-surface relative overflow-y-auto overflow-x-hidden flex flex-col"
          >
            {children}
          </div>

          {/* PERSISTENT FIXED APP-SHELL BOTTOM NAVIGATION */}
          {isTabRoute && <BottomNav />}

          {/* BOTTOM HOME INDICATOR BAR */}
          <div className="h-5 w-full bg-surface-container-lowest/95 backdrop-blur-md flex items-center justify-center shrink-0 z-50 select-none pb-1 border-t border-black/[0.02]">
            <div className="w-32 h-1 bg-on-surface/30 rounded-full" />
          </div>

          {/* GLOBAL APP MODALS OVERLAY (Covers entire phone screen, outside scroll view) */}
          <ModalsContainer />
        </div>
      </div>
    </div>
  );
};
