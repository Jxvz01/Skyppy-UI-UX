import React from 'react';
import { Header } from '../components/Header';
import { useAppStore } from '../store/useAppStore';
import { ThemeMode } from '../types';

export const ThemeSettings: React.FC = () => {
  const { theme, setTheme, resolvedTheme } = useAppStore();

  const themes: Array<{
    id: ThemeMode;
    title: string;
    description: string;
    icon: string;
    previewBg: string;
    previewBorder: string;
    accentColor: string;
  }> = [
    {
      id: 'light',
      title: 'Light Mode',
      description: 'Crisp daylight clarity with Royal Mysore Navy & Signal Lime accents.',
      icon: 'light_mode',
      previewBg: 'bg-[#f8f9ff]',
      previewBorder: 'border-[#dde9fe]',
      accentColor: '#315ef8'
    },
    {
      id: 'dark',
      title: 'Dark Mode',
      description: 'Nocturnal obsidian canvas with high-contrast electric navigation glows.',
      icon: 'dark_mode',
      previewBg: 'bg-[#090e17]',
      previewBorder: 'border-[#1f3354]',
      accentColor: '#4e82ff'
    },
    {
      id: 'system',
      title: 'System Default',
      description: "Automatically synchronizes with your device's operating system preferences.",
      icon: 'devices',
      previewBg: 'bg-gradient-to-r from-[#f8f9ff] to-[#090e17]',
      previewBorder: 'border-slate-500',
      accentColor: '#d4ee66'
    }
  ];

  return (
    <div className="flex-1 flex flex-col relative w-full bg-surface min-h-full">
      <Header type="stack" title="10 Appearance" backTo="/profile" />

      <main className="flex flex-col w-full px-margin pb-10 gap-space-md">
        <div className="pt-2">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
            Personalization
          </span>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">Theme &amp; Display</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
            Select your preferred interface contrast. All changes apply globally and persist across sessions.
          </p>
        </div>

        {/* Theme Options Cards */}
        <div className="flex flex-col gap-3">
          {themes.map((t) => {
            const isSelected = theme === t.id;
            return (
              <div
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-surface-container-low border-primary shadow-[0_0_0_2px_rgba(49,94,248,0.5)]'
                    : 'bg-surface-container-lowest border-surface-container hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${t.previewBg} ${t.previewBorder}`}
                  >
                    <span className="material-symbols-outlined text-[24px]" style={{ color: t.accentColor }}>
                      {t.icon}
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-headline-md text-headline-md text-on-surface font-bold">{t.title}</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-0.5">
                      {t.description}
                    </span>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ml-3 transition-all ${
                    isSelected ? 'bg-primary text-on-primary' : 'bg-surface-container text-transparent'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Interface Preview Pod */}
        <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container flex flex-col gap-3 mt-1">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-bold">
              Live Preview ({resolvedTheme.toUpperCase()})
            </span>
            <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-[11px] font-bold">
              Active Render
            </span>
          </div>

          {/* Sample Mini Screen Mockup */}
          <div className="p-3.5 rounded-xl bg-surface-container-low flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary-container text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px]">near_me</span>
                </div>
                <span className="font-bold text-xs text-on-surface">Skyppy 2.0 Mysuru</span>
              </div>
              <span className="text-[10px] text-secondary font-bold">LIVE PREVIEW</span>
            </div>

            <div className="p-2.5 rounded-lg bg-surface-container-lowest flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">electric_rickshaw</span>
                <div>
                  <p className="font-bold text-xs text-on-surface">Auto Rickshaw</p>
                  <p className="text-[10px] text-on-surface-variant">4 min away • Eco Fleet</p>
                </div>
              </div>
              <span className="font-bold text-sm text-primary font-numeric-md">₹76</span>
            </div>
          </div>

          {/* Color Swatch Tokens Palette */}
          <div>
            <span className="text-[11px] font-semibold text-on-surface-variant block mb-1.5">Design System Tokens</span>
            <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
              <div className="p-2 rounded-lg bg-primary text-white font-bold">Primary</div>
              <div className="p-2 rounded-lg bg-primary-container text-white font-bold">Primary Cont</div>
              <div className="p-2 rounded-lg bg-secondary-container text-on-secondary-container font-bold">Secondary</div>
              <div className="p-2 rounded-lg bg-inverse-surface text-inverse-on-surface font-bold">Inverse</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

