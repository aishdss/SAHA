import React, { useState, useEffect } from 'react';
import {
  Compass,
  Layers,
  Sparkles,
  MapPin,
  ShieldCheck,
  Calculator,
  PhoneCall,
  User,
  Bell,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertTriangle,
  BadgeCheck
} from 'lucide-react';
import { UserRole, TransportMode, Complaint } from './types';
import { Navbar } from './components/Navbar';
import { OfflineBanner } from './components/OfflineBanner';
import { AIComplaintAssistant } from './components/AIComplaintAssistant';
import { MultiModalJourneyPlanner } from './components/MultiModalJourneyPlanner';
import { TransportTabs } from './components/TransportTabs';
import { AuthorityDashboard } from './components/AuthorityDashboard';
import { CrowdsourcedMicroReporting } from './components/CrowdsourcedMicroReporting';
import { FareCalculatorModal } from './components/FareCalculatorModal';
import { EmergencyHelplineModal } from './components/EmergencyHelplineModal';
import { UserProfileModal } from './components/UserProfileModal';
import { TRANSLATIONS } from './utils/translations';
import { SahaLogo } from './components/SahaLogo';

type UserViewMode = 'JOURNEY_PLANNER' | 'TRANSPORT_MODES' | 'SMART_ASSISTANT' | 'COMMUNITY_REPORTS';

export default function App() {
  const [role, setRole] = useState<UserRole>('USER');
  const [language, setLanguage] = useState<'en' | 'kn'>('en');
  const [isOffline, setIsOffline] = useState(false);
  const [userView, setUserView] = useState<UserViewMode>('SMART_ASSISTANT');

  // Modals
  const [isFareModalOpen, setIsFareModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Active notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const t = TRANSLATIONS[language];

  // Browser online/offline listener
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Top Navigation Bar */}
      <Navbar
        role={role}
        onRoleChange={setRole}
        language={language}
        onLanguageChange={setLanguage}
        isOffline={isOffline}
        onToggleOffline={() => setIsOffline(!isOffline)}
        onOpenFareCalculator={() => setIsFareModalOpen(true)}
        onOpenEmergencyHelpline={() => setIsEmergencyModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Offline Status Warning Banner */}
      <OfflineBanner isOffline={isOffline} language={language} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 space-y-6">
        {/* Toast Notification Banner */}
        {toastMessage && (
          <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-700 flex items-center justify-between text-xs animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center space-x-2">
              <BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-3 font-bold">
              ✕
            </button>
          </div>
        )}

        {/* ROLE 1: COMMUTER / GENERAL USER VIEW */}
        {role === 'USER' ? (
          <div className="space-y-6">
            {/* SAHA Brand Banner & 5-Step Action Workflow */}
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-5 sm:p-7 shadow-md border border-indigo-900/40 relative overflow-hidden">
              {/* Subtle decorative background glow */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 max-w-2xl">
                  {/* Square SAHA Logo */}
                  <div className="shrink-0 p-1 bg-white rounded-2xl shadow-xl border border-indigo-400/30">
                    <SahaLogo size="lg" variant="transparent" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                      <span>Bengaluru Unified Transit System</span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white flex flex-wrap items-center gap-2">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-sky-300">
                        SAHA
                      </span>
                      <span className="text-indigo-400 font-light">—</span>
                      <span className="text-blue-200 font-bold text-xl sm:text-2xl lg:text-3xl">
                        {t.tagline}
                      </span>
                    </h1>

                    <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed">
                      {t.subTagline}
                    </p>

                    <p className="text-xs text-slate-400">
                      Consolidated support across BMTC, BMRCL Metro, Autos, Taxis, FASTag, KIA Airport, Railways & Majestic Terminal.
                    </p>
                  </div>
                </div>

                {/* The 5-Step Core Promise: Search • Ask • Report • Track • Resolve */}
                <div className="bg-slate-900/80 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-slate-800 shrink-0 w-full lg:w-auto">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      {t.actionTagline}
                    </span>
                    <span className="text-[11px] font-semibold text-blue-400">
                      5-Step Transit Flow
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-1.5 sm:gap-3 text-center">
                    {/* 1. Search */}
                    <button
                      id="workflow-step-search"
                      onClick={() => setUserView('TRANSPORT_MODES')}
                      className="group flex flex-col items-center p-2 rounded-xl hover:bg-slate-800/80 transition text-slate-300 hover:text-white"
                      title="Search routes, timings, and fares"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 mb-1 group-hover:scale-105 transition">
                        <span className="font-mono text-xs font-bold">1</span>
                      </div>
                      <span className="text-xs font-bold">{t.stepSearch}</span>
                      <span className="text-[10px] text-slate-400 hidden sm:block">Routes</span>
                    </button>

                    {/* 2. Ask */}
                    <button
                      id="workflow-step-ask"
                      onClick={() => setUserView('SMART_ASSISTANT')}
                      className="group flex flex-col items-center p-2 rounded-xl hover:bg-slate-800/80 transition text-slate-300 hover:text-white"
                      title="Ask AI transit queries"
                    >
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 mb-1 group-hover:scale-105 transition">
                        <span className="font-mono text-xs font-bold">2</span>
                      </div>
                      <span className="text-xs font-bold">{t.stepAsk}</span>
                      <span className="text-[10px] text-slate-400 hidden sm:block">Instant Q&A</span>
                    </button>

                    {/* 3. Report */}
                    <button
                      id="workflow-step-report"
                      onClick={() => setUserView('SMART_ASSISTANT')}
                      className="group flex flex-col items-center p-2 rounded-xl hover:bg-slate-800/80 transition text-slate-300 hover:text-white"
                      title="Report breakdowns, refusals, delays"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-1 group-hover:scale-105 transition">
                        <span className="font-mono text-xs font-bold">3</span>
                      </div>
                      <span className="text-xs font-bold">{t.stepReport}</span>
                      <span className="text-[10px] text-slate-400 hidden sm:block">File Issue</span>
                    </button>

                    {/* 4. Track */}
                    <button
                      id="workflow-step-track"
                      onClick={() => setIsProfileModalOpen(true)}
                      className="group flex flex-col items-center p-2 rounded-xl hover:bg-slate-800/80 transition text-slate-300 hover:text-white"
                      title="Track tickets and SLA timeline"
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-400 mb-1 group-hover:scale-105 transition">
                        <span className="font-mono text-xs font-bold">4</span>
                      </div>
                      <span className="text-xs font-bold">{t.stepTrack}</span>
                      <span className="text-[10px] text-slate-400 hidden sm:block">Live Status</span>
                    </button>

                    {/* 5. Resolve */}
                    <button
                      id="workflow-step-resolve"
                      onClick={() => {
                        showNotification("SAHA routes directly to verified department officers for action and citizen relief.");
                      }}
                      className="group flex flex-col items-center p-2 rounded-xl hover:bg-slate-800/80 transition text-slate-300 hover:text-white"
                      title="Resolution by official department"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mb-1 group-hover:scale-105 transition">
                        <span className="font-mono text-xs font-bold">5</span>
                      </div>
                      <span className="text-xs font-bold">{t.stepResolve}</span>
                      <span className="text-[10px] text-slate-400 hidden sm:block">Action Note</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* User Main Sub-Nav Bar */}
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
                <button
                  id="user-nav-assistant"
                  onClick={() => setUserView('SMART_ASSISTANT')}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                    userView === 'SMART_ASSISTANT'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{t.smartAiAssistant}</span>
                  <span className="text-[10px] bg-blue-500 text-white px-1.5 py-0.2 rounded font-mono">
                    3-Layer AI
                  </span>
                </button>

                <button
                  id="user-nav-journey"
                  onClick={() => setUserView('JOURNEY_PLANNER')}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                    userView === 'JOURNEY_PLANNER'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Compass className="w-4 h-4" />
                  <span>{t.journeyPlanner}</span>
                </button>

                <button
                  id="user-nav-modes"
                  onClick={() => setUserView('TRANSPORT_MODES')}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                    userView === 'TRANSPORT_MODES'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>{t.exploreModes}</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-semibold">
                    8 Modes
                  </span>
                </button>

                <button
                  id="user-nav-crowdsourced"
                  onClick={() => setUserView('COMMUNITY_REPORTS')}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                    userView === 'COMMUNITY_REPORTS'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>{t.communityReports}</span>
                </button>
              </div>

              {/* Quick Utility Shortcut Badges */}
              <div className="flex items-center space-x-2 ml-auto">
                <button
                  onClick={() => setIsFareModalOpen(true)}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1 transition"
                >
                  <Calculator className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t.fareCalculator}</span>
                </button>

                <button
                  onClick={() => setIsEmergencyModalOpen(true)}
                  className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-semibold flex items-center space-x-1 border border-red-200 transition"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-red-600" />
                  <span>{t.emergencyHelpline}</span>
                </button>
              </div>
            </div>

            {/* Active View Display */}
            {userView === 'SMART_ASSISTANT' && (
              <AIComplaintAssistant
                language={language}
                isOffline={isOffline}
                onComplaintFiled={(complaint) => {
                  showNotification(`Complaint filed successfully! Ticket #${complaint.ticketNumber}`);
                }}
              />
            )}

            {userView === 'JOURNEY_PLANNER' && (
              <MultiModalJourneyPlanner
                language={language}
                isOffline={isOffline}
              />
            )}

            {userView === 'TRANSPORT_MODES' && (
              <TransportTabs
                language={language}
                isOffline={isOffline}
              />
            )}

            {userView === 'COMMUNITY_REPORTS' && (
              <CrowdsourcedMicroReporting
                language={language}
                isOffline={isOffline}
              />
            )}
          </div>
        ) : (
          /* ROLE 2: VERIFIED TRANSPORT AUTHORITY COMMAND DESK */
          <AuthorityDashboard
            language={language}
            isOffline={isOffline}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-center sm:text-left">
            <SahaLogo size="sm" variant="light" />
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2 justify-center sm:justify-start">
                <span className="font-extrabold text-slate-900 text-sm">SAHA</span>
                <span>•</span>
                <span className="font-semibold text-slate-700">{t.tagline}</span>
              </div>
              <p className="text-slate-500 text-[11px]">
                {t.subTagline} <span className="hidden md:inline">({t.actionTagline})</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsEmergencyModalOpen(true)}
              className="text-slate-600 hover:text-red-600 font-semibold transition"
            >
              Emergency 112
            </button>
            <button
              onClick={() => setIsFareModalOpen(true)}
              className="text-slate-600 hover:text-blue-600 font-semibold transition"
            >
              Fare Rules
            </button>
            <button
              onClick={() => setRole(role === 'USER' ? 'AUTHORITY' : 'USER')}
              className="text-slate-600 hover:text-emerald-700 font-semibold transition"
            >
              Switch to {role === 'USER' ? 'Authority Desk' : 'Commuter View'}
            </button>
          </div>
        </div>
      </footer>

      {/* Reusable Modals */}
      {isFareModalOpen && (
        <FareCalculatorModal
          isOpen={isFareModalOpen}
          onClose={() => setIsFareModalOpen(false)}
          language={language}
        />
      )}

      {isEmergencyModalOpen && (
        <EmergencyHelplineModal
          isOpen={isEmergencyModalOpen}
          onClose={() => setIsEmergencyModalOpen(false)}
          language={language}
        />
      )}

      {isProfileModalOpen && (
        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          language={language}
          onLanguageChange={setLanguage}
        />
      )}
    </div>
  );
}
