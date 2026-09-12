import React from 'react';
import {
  Bus,
  ShieldCheck,
  User,
  Wifi,
  WifiOff,
  Bell,
  Languages,
  HelpCircle,
  Calculator,
  Compass,
  AlertTriangle
} from 'lucide-react';
import { UserRole } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { SahaLogo } from './SahaLogo';

interface NavbarProps {
  role?: UserRole;
  currentRole?: UserRole;
  onRoleChange?: (role: UserRole) => void;
  onToggleRole?: (role: UserRole) => void;
  language: 'en' | 'kn';
  onLanguageChange?: (lang: 'en' | 'kn') => void;
  onToggleLanguage?: (lang: 'en' | 'kn') => void;
  isOffline: boolean;
  onToggleOffline: () => void;
  unreadCount?: number;
  onOpenNotifications?: () => void;
  onOpenProfile: () => void;
  onOpenFareCalculator: () => void;
  onOpenEmergencyHelpline?: () => void;
  onOpenFaq?: () => void;
  onStartTour?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  role,
  currentRole,
  onRoleChange,
  onToggleRole,
  language,
  onLanguageChange,
  onToggleLanguage,
  isOffline,
  onToggleOffline,
  unreadCount = 0,
  onOpenNotifications,
  onOpenProfile,
  onOpenFareCalculator,
  onOpenEmergencyHelpline,
  onOpenFaq,
  onStartTour
}) => {
  const activeRole: UserRole = role || currentRole || 'user';
  const handleRoleToggle = (targetRole: UserRole) => {
    if (onRoleChange) onRoleChange(targetRole);
    if (onToggleRole) onToggleRole(targetRole);
  };

  const handleLangToggle = (targetLang: 'en' | 'kn') => {
    if (onLanguageChange) onLanguageChange(targetLang);
    if (onToggleLanguage) onToggleLanguage(targetLang);
  };

  const t = TRANSLATIONS[language];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3">
            <SahaLogo size="md" variant="light" />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-white flex items-center">
                  SAHA
                </span>
                <span className="hidden sm:inline-flex text-[11px] font-medium text-slate-300 border-l border-slate-700 pl-2">
                  {t.tagline}
                </span>
                <span className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  BLR Transit
                </span>
              </div>
              <p className="text-[11px] text-blue-300/80 hidden md:block tracking-wide">
                {t.subTagline}
              </p>
            </div>
          </div>

          {/* Quick Actions & Switchers */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Fare Calculator button */}
            <button
              id="nav-fare-calc-btn"
              onClick={onOpenFareCalculator}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
              title="Fare Calculator per Mode"
            >
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>{t.fareCalculator}</span>
            </button>

            {/* Emergency Helpline button */}
            <button
              id="nav-emergency-btn"
              onClick={onOpenEmergencyHelpline || onOpenFaq}
              className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-300 bg-red-950/40 border border-red-800/60 hover:bg-red-900/40 transition"
              title="Emergency Helplines & Contacts"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span>112 Help</span>
            </button>

            {/* Offline Simulation Toggle */}
            <button
              id="nav-offline-toggle"
              onClick={onToggleOffline}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition border ${
                isOffline
                  ? 'bg-amber-950/60 border-amber-600 text-amber-300'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
              }`}
              title={isOffline ? 'Currently Offline (Serving cache)' : 'Online. Click to test offline fallback'}
            >
              {isOffline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span className="hidden md:inline">Offline</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden md:inline">Live</span>
                </>
              )}
            </button>

            {/* Language Toggle (EN / KN) */}
            <button
              id="nav-lang-toggle"
              onClick={() => handleLangToggle(language === 'en' ? 'kn' : 'en')}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 transition"
              title="Switch Language: English / Kannada"
            >
              <Languages className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-semibold">{language === 'en' ? 'ಕನ್ನಡ' : 'English'}</span>
            </button>

            {/* Notifications Bell */}
            <button
              id="nav-notifications-btn"
              onClick={onOpenNotifications || onOpenProfile}
              className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Role Switcher Pill */}
            <div className="flex items-center p-0.5 bg-slate-800 rounded-xl border border-slate-700">
              <button
                id="role-commuter-btn"
                onClick={() => handleRoleToggle('user')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeRole === 'user' || activeRole === ('USER' as any)
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Commuter</span>
              </button>

              <button
                id="role-authority-btn"
                onClick={() => handleRoleToggle('authority')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeRole === 'authority' || activeRole === ('AUTHORITY' as any)
                    ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Authority</span>
              </button>
            </div>

            {/* Profile Button */}
            <button
              id="nav-profile-btn"
              onClick={onOpenProfile}
              className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-200 hover:border-blue-400 transition"
              title="My Profile & Saved Locations"
            >
              <span className="text-xs font-bold">R</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
