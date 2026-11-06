import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { translations } from '../utils/i18n';
import { SkyppyLogo } from './SkyppyLogo';

interface HeaderProps {
  type?: 'tab' | 'stack';
  title?: string;
  backTo?: string;
  onBack?: () => void;
  rightAction?: 'default' | 'none' | React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  type = 'tab',
  title = '',
  backTo,
  onBack,
  rightAction = 'default'
}) => {
  const navigate = useNavigate();
  const { openModal, notifications, language, setLanguage, userProfile } = useAppStore();
  const unreadCount = notifications.filter((n) => n.unread).length;
  const t = translations[language] || translations.en;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'kn' : 'en');
  };

  return (
    <header className="sticky top-0 left-0 right-0 w-full z-40 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container/50">
      <div className="flex items-center justify-between px-margin h-16">
        {type === 'tab' ? (
          <div className="flex items-center cursor-pointer active:scale-95 transition-transform" onClick={() => navigate('/')}>
            <SkyppyLogo size="sm" subtitle={t.appSubtitle} />
          </div>
        ) : (
          <div className="flex items-center gap-space-sm min-w-0">
            <button
              aria-label="Go back"
              onClick={handleBack}
              className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors active:scale-95 shrink-0"
              type="button"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
            <h1 className="font-headline-md text-headline-md text-on-surface font-semibold truncate">
              {title}
            </h1>
          </div>
        )}

        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Language Toggle Pill */}
          <button
            type="button"
            aria-label="Switch language English or Kannada"
            onClick={toggleLanguage}
            className="h-8 px-2.5 rounded-full bg-surface-container text-xs font-bold text-primary hover:bg-surface-container-high transition-colors flex items-center gap-1 active:scale-95"
            title="Switch Language (English / ಕನ್ನಡ)"
          >
            <span className="material-symbols-outlined text-[15px]">translate</span>
            <span>{language === 'en' ? 'ಕನ್ನಡ' : 'EN'}</span>
          </button>

          {rightAction === 'default' ? (
            <>
              {type === 'tab' ? (
                <button
                  aria-label="Notifications"
                  onClick={() => openModal('notifications')}
                  className="w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors relative"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[19px]">notifications</span>
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary ring-2 ring-surface"></span>
                  )}
                </button>
              ) : (
                <button
                  aria-label="Help & Safety"
                  onClick={() => openModal('safety')}
                  className="w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[19px] text-secondary">shield</span>
                </button>
              )}

              <button
                type="button"
                aria-label="Profile Account"
                onClick={() => navigate('/profile')}
                className="rounded-full ring-2 ring-transparent hover:ring-primary/40 transition-all cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-tr from-primary to-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs border border-white/60">
                  {userProfile?.name
                    ? userProfile.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                    : 'SK'}
                </div>
              </button>
            </>
          ) : (
            rightAction
          )}
        </div>
      </div>
    </header>
  );
};

