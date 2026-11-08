import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { useAppStore } from '../store/useAppStore';
import { translations } from '../utils/i18n';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile, miles, rideHistory, openModal, showToast, language, setLanguage, resetDemoState } = useAppStore();
  const t = translations[language] || translations.en;

  const handleLogout = () => {
    if (confirm(`Log out from ${userProfile.name}'s account?`)) {
      showToast('Logged out of session. Welcome back anytime!');
      navigate('/');
    }
  };

  const handleResetDemo = () => {
    if (confirm('Reset prototype demo state? All stored rides, balances, and custom data will restore to original demo defaults.')) {
      resetDemoState();
      showToast('Demo state successfully reset to initial defaults!', 'success');
    }
  };

  const completedCount = rideHistory.filter((r) => r.status === 'completed').length;

  return (
    <div className="flex-1 flex flex-col relative w-full pb-6 bg-surface min-h-full">
      <Header
        type="tab"
        rightAction={
          <button
            aria-label="Settings & Appearance"
            onClick={() => navigate('/theme')}
            className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface shadow-sm active:scale-95 transition-transform"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>
        }
      />

      <main className="flex flex-col w-full">
        <div className="flex items-center justify-between px-margin pt-space-xs pb-space-sm">
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
              {t.mysuruRider}
            </span>
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">{t.accountProfile}</h1>
          </div>
          <button
            aria-label="Appearance & Theme"
            onClick={() => navigate('/theme')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low text-primary text-xs font-semibold hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">palette</span>
            <span>{t.appearance}</span>
          </button>
        </div>

        <div className="px-margin flex flex-col gap-space-md pb-space-lg">
          {/* User Card */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-surface-container-low/70 pointer-events-none"></div>
            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center gap-space-md">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary font-headline-md text-headline-md flex items-center justify-center shadow-md font-bold">
                    {userProfile.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-[15px] fill-1">verified</span>
                  </div>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-space-xs">
                    <span className="font-headline-md text-headline-md text-on-surface truncate font-bold">
                      {userProfile.name}
                    </span>
                    <span className="bg-secondary-container text-on-secondary-container font-label-sm text-label-sm px-2 py-0.5 rounded-full whitespace-nowrap font-semibold">
                      {userProfile.tier}
                    </span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    {userProfile.email}
                  </span>
                  <span className="font-label-md text-label-md text-tertiary mt-0.5 font-medium">
                    {userProfile.phone}
                  </span>
                </div>
              </div>
              <button
                aria-label="Edit Profile"
                onClick={() => openModal('editProfile')}
                className="w-9 h-9 rounded-full bg-surface-container-low text-tertiary flex items-center justify-center hover:text-on-surface active:scale-95 transition-transform"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-space-xs mt-space-md pt-space-sm bg-surface-container-low rounded-lg p-space-sm">
              <div
                onClick={() => navigate('/activity')}
                className="flex flex-col items-center justify-center text-center p-1.5 cursor-pointer active:scale-95 transition-transform"
              >
                <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary mb-1">
                  <span className="material-symbols-outlined text-[18px] fill-1">directions_car</span>
                </div>
                <span className="font-numeric-md text-numeric-md text-on-surface font-bold">
                  {completedCount}
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                  Rides
                </span>
              </div>

              <div
                onClick={() => navigate('/miles')}
                className="flex flex-col items-center justify-center text-center p-1.5 cursor-pointer active:scale-95 transition-transform"
              >
                <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-secondary mb-1">
                  <span className="material-symbols-outlined text-[18px]">route</span>
                </div>
                <span className="font-numeric-md text-numeric-md text-on-surface font-bold">
                  {miles.lifetimeKm}
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                  KM Traveled
                </span>
              </div>

              <div
                onClick={() => navigate('/activity')}
                className="flex flex-col items-center justify-center text-center p-1.5 cursor-pointer active:scale-95 transition-transform"
              >
                <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary-container mb-1">
                  <span className="material-symbols-outlined text-[18px]">payments</span>
                </div>
                <span className="font-numeric-md text-numeric-md text-on-surface font-bold">
                  ₹{userProfile.totalSpent}
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                  Spent
                </span>
              </div>
            </div>
          </div>

          {/* Skyppy Miles Explorer Card */}
          <div className="bg-primary-container text-on-primary rounded-xl p-space-md shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-on-primary">
                  <span className="material-symbols-outlined text-[18px] fill-1">military_tech</span>
                </div>
                <span className="font-label-lg text-label-lg tracking-wide text-on-primary font-bold">
                  Skyppy Miles Explorer
                </span>
              </div>
              <span className="bg-secondary-container text-on-secondary-container font-label-sm text-label-sm px-2.5 py-0.5 rounded-full font-bold">
                {miles.lifetimeKm} km
              </span>
            </div>

            <div className="mt-space-md">
              <div className="flex items-center justify-between text-on-primary-container font-body-sm text-body-sm mb-1.5">
                <span>
                  {Math.max(0, Number((miles.nextMilestoneKm - miles.lifetimeKm).toFixed(1)))} km to{' '}
                  {miles.nextMilestoneKm} km VIP Milestone
                </span>
                <span className="font-numeric-md text-numeric-md font-bold text-on-primary">
                  {Math.min(100, Math.round((miles.lifetimeKm / miles.nextMilestoneKm) * 100))}%
                </span>
              </div>
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-secondary-container h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (miles.lifetimeKm / miles.nextMilestoneKm) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="mt-space-md pt-space-xs flex items-center justify-between">
              <span className="font-body-sm text-body-sm text-on-primary-container">
                {miles.rewards.filter((r) => !r.redeemed).length} vouchers ready to redeem
              </span>
              <button
                type="button"
                onClick={() => navigate('/miles')}
                className="inline-flex items-center gap-1 font-label-md text-label-md text-secondary-container hover:underline cursor-pointer active:scale-95 transition-all font-bold"
              >
                <span>Miles Dashboard</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Mobility & Rides */}
          <div className="flex flex-col gap-space-xs">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary px-1 font-semibold">
              Mobility &amp; Rides
            </span>
            <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
              <button
                type="button"
                onClick={() => navigate('/activity')}
                className="flex items-center justify-between p-space-md hover:bg-surface-container-low transition-colors text-left"
              >
                <div className="flex items-center gap-space-md min-w-0">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-body-lg text-body-lg text-on-surface font-semibold">Ride History</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      {completedCount} passenger trips completed
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-tertiary text-[20px]">chevron_right</span>
              </button>

              <div className="h-px bg-surface-container-low mx-space-md"></div>

              <button
                type="button"
                onClick={() => navigate('/activity')}
                className="flex items-center justify-between p-space-md hover:bg-surface-container-low transition-colors text-left"
              >
                <div className="flex items-center gap-space-md min-w-0">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">schedule</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-body-lg text-body-lg text-on-surface font-semibold">Scheduled Rides</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      {rideHistory.filter((r) => r.status === 'scheduled').length} upcoming reservation
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-tertiary text-[20px]">chevron_right</span>
              </button>

              <div className="h-px bg-surface-container-low mx-space-md"></div>

              <button
                type="button"
                onClick={() => openModal('savedPlaces')}
                className="flex items-center justify-between p-space-md hover:bg-surface-container-low transition-colors text-left"
              >
                <div className="flex items-center gap-space-md min-w-0">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">bookmark</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-body-lg text-body-lg text-on-surface font-semibold">Saved Places</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Home, Work &amp; pinned destinations
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-tertiary text-[20px]">chevron_right</span>
              </button>
            </div>
          </div>

          {/* Payments & Rewards */}
          <div className="flex flex-col gap-space-xs">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary px-1 font-semibold">
              Payments &amp; Rewards
            </span>
            <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
              <button
                type="button"
                onClick={() => openModal('paymentMethods')}
                className="flex items-center justify-between p-space-md hover:bg-surface-container-low transition-colors text-left"
              >
                <div className="flex items-center gap-space-md min-w-0">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">credit_card</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-body-lg text-body-lg text-on-surface font-semibold">Payment Methods</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      UPI AutoPay, Card &amp; Wallet
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-tertiary text-[20px]">chevron_right</span>
              </button>

              <div className="h-px bg-surface-container-low mx-space-md"></div>

              <button
                type="button"
                onClick={() => navigate('/miles')}
                className="flex items-center justify-between p-space-md hover:bg-surface-container-low transition-colors text-left"
              >
                <div className="flex items-center gap-space-md min-w-0">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[20px]">confirmation_number</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-body-lg text-body-lg text-on-surface font-semibold">My Vouchers &amp; Coupons</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      {miles.rewards.filter((r) => !r.redeemed).length} active offers ready to apply
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-space-xs">
                  <span className="bg-secondary-container text-on-secondary-container font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold">
                    {miles.rewards.filter((r) => !r.redeemed).length} Valid
                  </span>
                  <span className="material-symbols-outlined text-tertiary text-[20px]">chevron_right</span>
                </div>
              </button>

              <div className="h-px bg-surface-container-low mx-space-md"></div>

              <button
                type="button"
                onClick={() => openModal('paymentMethods')}
                className="flex items-center justify-between p-space-md hover:bg-surface-container-low transition-colors text-left"
              >
                <div className="flex items-center gap-space-md min-w-0">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-body-lg text-body-lg text-on-surface font-semibold">Skyppy Cash Balance</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Instant auto-deduct wallet</span>
                  </div>
                </div>
                <div className="flex items-center gap-space-xs">
                  <span className="font-numeric-md text-numeric-md text-primary font-bold">₹150.00</span>
                  <span className="material-symbols-outlined text-tertiary text-[20px]">chevron_right</span>
                </div>
              </button>
            </div>
          </div>

          {/* Preferences & Safety */}
          <div className="flex flex-col gap-space-xs">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary px-1 font-semibold">
              Preferences &amp; Safety
            </span>
            <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
              {/* Language Selection Toggle */}
              <div className="flex items-center justify-between p-space-md">
                <div className="flex items-center gap-space-md min-w-0">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">translate</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-body-lg text-body-lg text-on-surface font-semibold">{t.language}</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      {language === 'en' ? 'English (UK / India)' : 'ಕನ್ನಡ (Kannada)'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setLanguage('en');
                      showToast('Language switched to English');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      language === 'en' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLanguage('kn');
                      showToast('ಭಾಷೆಯನ್ನು ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಲಾಗಿದೆ');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      language === 'kn' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    ಕನ್ನಡ
                  </button>
                </div>
              </div>

              <div className="h-px bg-surface-container-low mx-space-md"></div>

              {/* Appearance / Theme Settings */}
              <button
                type="button"
                onClick={() => navigate('/theme')}
                className="flex items-center justify-between p-space-md hover:bg-surface-container-low transition-colors text-left"
              >
                <div className="flex items-center gap-space-md min-w-0">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">palette</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-space-xs">
                      <span className="font-body-lg text-body-lg text-on-surface font-semibold">Appearance &amp; Theme</span>
                      <span className="bg-primary/10 text-primary font-label-sm text-label-sm px-1.5 py-0.2 rounded-full font-bold">
                        NEW
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Light, Dark &amp; System Default</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-tertiary text-[20px]">chevron_right</span>
              </button>

              <div className="h-px bg-surface-container-low mx-space-md"></div>

              {/* 24/7 Safety Toolkit */}
              <button
                type="button"
                onClick={() => openModal('safety')}
                className="flex items-center justify-between p-space-md hover:bg-surface-container-low transition-colors text-left"
              >
                <div className="flex items-center gap-space-md min-w-0">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-error">
                    <span className="material-symbols-outlined text-[20px]">security</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-space-xs">
                      <span className="font-body-lg text-body-lg text-on-surface font-semibold">24/7 Safety Toolkit</span>
                      <span className="bg-error-container text-on-error-container font-label-sm text-label-sm px-1.5 py-0.2 rounded-full font-bold">
                        SOS
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Live trip sharing &amp; {userProfile.emergencyContactName}
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-tertiary text-[20px]">chevron_right</span>
              </button>

              <div className="h-px bg-surface-container-low mx-space-md"></div>

              {/* Ride Preferences */}
              <button
                type="button"
                onClick={() => openModal('preferences')}
                className="flex items-center justify-between p-space-md hover:bg-surface-container-low transition-colors text-left"
              >
                <div className="flex items-center gap-space-md min-w-0">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">tune</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-body-lg text-body-lg text-on-surface font-semibold">Ride Preferences</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      AC default, Quiet ride, Tip &amp; Wallet
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-tertiary text-[20px]">chevron_right</span>
              </button>

              <div className="h-px bg-surface-container-low mx-space-md"></div>

              {/* Help & Support */}
              <button
                type="button"
                onClick={() => openModal('helpSupport')}
                className="flex items-center justify-between p-space-md hover:bg-surface-container-low transition-colors text-left"
              >
                <div className="flex items-center gap-space-md min-w-0">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-tertiary">
                    <span className="material-symbols-outlined text-[20px]">support_agent</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-body-lg text-body-lg text-on-surface font-semibold">Help &amp; Support</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Mysuru 24/7 transit rider helpline</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-tertiary text-[20px]">chevron_right</span>
              </button>
            </div>
          </div>

          {/* Developer & Demo Reset Card */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">restart_alt</span>
                <span className="font-label-lg font-bold text-on-surface">{t.resetDemo}</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-surface-container text-tertiary">
                Prototype QA
              </span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Restore ride ledger, vehicle fleet, vouchers, and simulated corridors back to clean presentation defaults.
            </p>
            <button
              type="button"
              onClick={handleResetDemo}
              className="mt-1 h-11 w-full rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[16px]">refresh</span>
              <span>Reset Prototype Demo Data</span>
            </button>
          </div>

          {/* Log Out & Footer */}
          <div className="pt-space-xs flex flex-col gap-space-sm items-center">
            <button
              onClick={handleLogout}
              className="w-full h-[52px] rounded-full bg-surface-container-low hover:bg-error-container text-error font-headline-md text-headline-md flex items-center justify-center gap-space-xs transition-colors shadow-sm active:scale-[0.99] font-bold"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              <span>{t.logout} from {userProfile.name}'s Account</span>
            </button>
            <div className="flex flex-col items-center justify-center py-space-xs text-center">
              <span className="font-label-sm text-label-sm text-secondary font-semibold uppercase tracking-wider">
                Skyppy 2.0 — Urban Passenger Mobility
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Build 2024.11.4 • Mysuru Smart Transit</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
