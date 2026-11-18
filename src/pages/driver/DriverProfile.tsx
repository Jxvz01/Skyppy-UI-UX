import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDriverStore } from '../../store/useDriverStore';
import { useAppStore } from '../../store/useAppStore';
import { DriverVehicleType } from '../../types/driver';

export const DriverProfile: React.FC = () => {
  const navigate = useNavigate();
  const { profile, selectVehicle, setDemoModalOpen } = useDriverStore();
  const { language, setLanguage } = useAppStore();

  const documents = [
    { name: 'Commercial Driving License', status: 'Verified', validity: 'Valid till Nov 2029', icon: 'badge' },
    { name: 'Vehicle Registration Certificate (RC)', status: 'Verified', validity: 'Valid', icon: 'description' },
    { name: 'Commercial Vehicle Insurance', status: 'Active', validity: 'Valid till Sep 2027', icon: 'security' },
    { name: 'Mysuru City Police Verification', status: 'Cleared', validity: 'Passed Dec 2025', icon: 'verified_user' }
  ];

  return (
    <div className="flex-1 w-full h-full flex flex-col bg-surface overflow-y-auto px-4 py-4 space-y-4">
      {/* Title */}
      <div>
        <h2 className="text-lg font-bold text-on-surface tracking-tight">Driver Partner Profile</h2>
        <p className="text-xs text-on-surface-variant font-medium">Account, fleet vehicle & verification status</p>
      </div>

      {/* Driver Identity Card */}
      <div className="bg-surface-container-low rounded-3xl p-4 border border-outline-variant/30 flex items-center gap-4">
        <div className="relative">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary/20 shadow-md"
          />
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-surface flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-[12px] font-bold">check</span>
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-on-surface truncate">{profile.name}</h3>
            <span className="text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20 shrink-0">
              Gold Partner
            </span>
          </div>
          <p className="text-xs font-mono text-on-surface-variant mt-0.5">{profile.phone}</p>
          <div className="flex items-center gap-3 text-xs text-on-surface-variant mt-1.5">
            <span className="flex items-center gap-1 font-semibold text-on-surface">
              <span className="material-symbols-outlined text-amber-500 text-[15px] fill-1">star</span>
              {profile.rating}
            </span>
            <span>•</span>
            <span>{profile.totalTrips} Trips</span>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-surface-container-lowest p-3 rounded-2xl border border-outline-variant/20 text-center">
          <span className="text-[10px] text-on-surface-variant uppercase font-medium">Acceptance</span>
          <div className="text-sm font-bold text-emerald-600 font-mono mt-0.5">{profile.acceptanceRatePct}%</div>
        </div>
        <div className="bg-surface-container-lowest p-3 rounded-2xl border border-outline-variant/20 text-center">
          <span className="text-[10px] text-on-surface-variant uppercase font-medium">Completion</span>
          <div className="text-sm font-bold text-emerald-600 font-mono mt-0.5">{profile.completionRatePct}%</div>
        </div>
        <div className="bg-surface-container-lowest p-3 rounded-2xl border border-outline-variant/20 text-center">
          <span className="text-[10px] text-on-surface-variant uppercase font-medium">Rating</span>
          <div className="text-sm font-bold text-on-surface font-mono mt-0.5">4.9 / 5.0</div>
        </div>
      </div>

      {/* Vehicle Switcher Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            Vehicle Fleet Switcher
          </span>
          <span className="text-[11px] text-primary font-semibold">Select Active</span>
        </div>

        <div className="space-y-2">
          {profile.availableVehicles.map((veh) => {
            const isSelected = profile.activeVehicle.category === veh.category;
            return (
              <div
                key={veh.category}
                data-testid={`vehicle-card-${veh.category}`}
                onClick={() => selectVehicle(veh.category as DriverVehicleType)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-primary/10 border-primary shadow-sm'
                    : 'bg-surface-container-lowest hover:bg-surface-container-low border-outline-variant/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {veh.category === 'auto' ? 'electric_rickshaw' : 'directions_car'}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-on-surface">{veh.model}</h4>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant">
                        {veh.fuelType}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-on-surface-variant mt-0.5">{veh.registrationNumber}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isSelected ? (
                    <span className="text-[10px] font-bold bg-primary text-on-primary px-2.5 py-1 rounded-full shadow-sm">
                      Active
                    </span>
                  ) : (
                    <button
                      data-testid={`switch-btn-${veh.category}`}
                      className="text-[11px] font-bold text-primary hover:underline"
                    >
                      Switch
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Compliance & Verification Documents */}
      <div className="space-y-2.5">
        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider px-1">
          Compliance & Badges
        </span>
        <div className="space-y-2">
          {documents.map((doc, idx) => (
            <div
              key={idx}
              className="bg-surface-container-lowest p-3 rounded-2xl border border-outline-variant/20 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-primary text-[18px]">{doc.icon}</span>
                <div>
                  <h5 className="text-xs font-bold text-on-surface">{doc.name}</h5>
                  <p className="text-[10px] text-on-surface-variant">{doc.validity}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {doc.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* App Language Selector */}
      <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/30 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-primary text-[20px]">translate</span>
          <div>
            <h4 className="text-xs font-bold text-on-surface">Application Language</h4>
            <p className="text-[10px] text-on-surface-variant">Switch UI between English and Kannada</p>
          </div>
        </div>
        <div className="flex bg-surface-container p-1 rounded-xl border border-outline-variant/20">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
              language === 'en' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('kn')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
              language === 'kn' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant'
            }`}
          >
            ಕನ್ನಡ
          </button>
        </div>
      </div>

      {/* Competition Demo Controls Trigger */}
      <div className="pt-2">
        <button
          onClick={() => setDemoModalOpen(true)}
          className="w-full py-3 bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs rounded-2xl border border-primary/30 flex items-center justify-center gap-2 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">tune</span>
          Open Competition Demo State Controls
        </button>
      </div>

      {/* Return to Passenger App */}
      <div className="pt-1 pb-4">
        <button
          onClick={() => navigate('/')}
          className="w-full py-3.5 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Return to Skyppy Passenger App
        </button>
      </div>
    </div>
  );
};
