import React, { useState } from 'react';
import {
  Bus,
  Train,
  Car,
  CreditCard,
  Plane,
  Building2,
  Navigation,
  Search,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Phone,
  ExternalLink,
  ChevronRight,
  Shield,
  HelpCircle,
  Flame,
  Zap,
  Info
} from 'lucide-react';
import { TransportMode, TransportRouteInfo } from '../types';
import {
  BMTC_ROUTES,
  BMRCL_METRO_LINES,
  MAJESTIC_PLATFORMS,
  AUTO_TARIFF_RULES,
  TAXI_CAB_INFO,
  FASTAG_INFO,
  AIRPORT_INFO,
  RAILWAY_STATIONS
} from '../data/transportData';
import { TRANSLATIONS } from '../utils/translations';

interface TransportTabsProps {
  language: 'en' | 'kn';
  isOffline: boolean;
  onSelectReportRoute?: (routeCode: string, mode: TransportMode) => void;
}

export const TransportTabs: React.FC<TransportTabsProps> = ({
  language,
  isOffline,
  onSelectReportRoute
}) => {
  const [activeTab, setActiveTab] = useState<TransportMode>('BMTC');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedBmtcRoute, setSelectedBmtcRoute] = useState<TransportRouteInfo>(BMTC_ROUTES[0]);
  const [selectedMetroLineId, setSelectedMetroLineId] = useState<'purple-line' | 'green-line'>('purple-line');
  const [majesticPlatformSearch, setMajesticPlatformSearch] = useState('');

  const t = TRANSLATIONS[language];

  const modeTabs: { id: TransportMode; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'BMTC', label: t.bmtcBus, icon: <Bus className="w-4 h-4" /> },
    { id: 'BMRCL', label: t.bmrclMetro, icon: <Train className="w-4 h-4" /> },
    { id: 'AUTOS', label: t.autos, icon: <Car className="w-4 h-4" /> },
    { id: 'TAXIS', label: t.taxis, icon: <Car className="w-4 h-4" /> },
    { id: 'FASTAG', label: t.fastag, icon: <CreditCard className="w-4 h-4" /> },
    { id: 'AIRPORT', label: t.airport, icon: <Plane className="w-4 h-4" /> },
    { id: 'RAILWAYS', label: t.railways, icon: <Train className="w-4 h-4" /> },
    { id: 'MAJESTIC', label: t.majesticGuide, icon: <Navigation className="w-4 h-4" />, badge: '30 Platforms' }
  ];

  // BMTC Route filtering
  const filteredBmtcRoutes = BMTC_ROUTES.filter(r =>
    r.code.toLowerCase().includes(searchFilter.toLowerCase()) ||
    r.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    r.stops.some(s => s.name.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  // Majestic platform filtering
  const filteredMajesticPlatforms = MAJESTIC_PLATFORMS.filter(p =>
    p.title.toLowerCase().includes(majesticPlatformSearch.toLowerCase()) ||
    p.primaryDestinations.some(d => d.toLowerCase().includes(majesticPlatformSearch.toLowerCase())) ||
    p.routes.some(r => r.toLowerCase().includes(majesticPlatformSearch.toLowerCase()))
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Tab Navigation Pill Header */}
      <div className="border-b border-slate-200 bg-slate-50/80 px-4 sm:px-6 pt-3">
        <div className="flex items-center space-x-2 overflow-x-auto pb-3 scrollbar-thin">
          {modeTabs.map((tab) => (
            <button
              key={tab.id}
              id={`mode-tab-${tab.id.toLowerCase()}`}
              onClick={() => {
                setActiveTab(tab.id);
                setSearchFilter('');
              }}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                  activeTab === tab.id ? 'bg-blue-800 text-blue-100' : 'bg-slate-100 text-slate-500'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Tab Content Display */}
      <div className="p-5 sm:p-6">
        {/* ======================= TAB 1: BMTC BUSES ======================= */}
        {activeTab === 'BMTC' && (
          <div className="space-y-6">
            {/* Live Ticker & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Search BMTC route number, bus stop, or destination (e.g. 500D, Marathahalli)..."
                  className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-2 text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 rounded-xl">
                <Zap className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">Live GPS Telemetry Active • Over 6,200 Buses Tracked</span>
              </div>
            </div>

            {/* Split View: Route Selector & Live Tracking Map/Stops */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Route List Column */}
              <div className="lg:col-span-5 space-y-3 max-h-[520px] overflow-y-auto pr-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Popular Key Trunk Routes ({filteredBmtcRoutes.length})
                </span>
                {filteredBmtcRoutes.map((route) => (
                  <button
                    key={route.id}
                    onClick={() => setSelectedBmtcRoute(route)}
                    className={`w-full text-left p-3.5 rounded-xl border transition text-xs space-y-1.5 ${
                      selectedBmtcRoute.id === route.id
                        ? 'border-blue-500 bg-blue-50/60 shadow-sm ring-1 ring-blue-400/30'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-blue-700 bg-blue-100/70 px-2.5 py-0.5 rounded-md">
                        {route.code}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">{route.fareRange}</span>
                    </div>

                    <div className="font-bold text-slate-900 text-sm">{route.name}</div>
                    <div className="text-slate-500 text-[11px] font-kannada">{route.kannadaName}</div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-150 text-[11px] text-slate-500">
                      <span>Freq: {route.frequency}</span>
                      <span className="font-semibold text-slate-700">{route.stops.length} Stops</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Selected Route Live Details Column */}
              <div className="lg:col-span-7 bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-base sm:text-lg font-extrabold text-slate-900">
                        Route {selectedBmtcRoute.code}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
                        {selectedBmtcRoute.typeBadge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {selectedBmtcRoute.from} ➔ {selectedBmtcRoute.to}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">Typical Duration</span>
                    <span className="text-sm font-bold text-slate-800">{selectedBmtcRoute.travelTime}</span>
                  </div>
                </div>

                {/* Live Tracking GPS Pill */}
                <div className="p-3 bg-white rounded-xl border border-blue-200 shadow-sm flex items-start space-x-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping mt-1 shrink-0" />
                  <div className="text-xs space-y-1">
                    <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                      <span>Live GPS Position:</span>
                      <span className="text-blue-600">{selectedBmtcRoute.liveStatus.currentLocation}</span>
                    </div>
                    <p className="text-slate-600">
                      Next estimated arrival at next major stop in <strong>{selectedBmtcRoute.liveStatus.nextArrivalMinutes} mins</strong>.
                    </p>
                    {selectedBmtcRoute.liveStatus.alerts && selectedBmtcRoute.liveStatus.alerts.length > 0 && (
                      <p className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-medium inline-block">
                        ⚠️ Alert: {selectedBmtcRoute.liveStatus.alerts[0]}
                      </p>
                    )}
                  </div>
                </div>

                {/* Stops Timeline */}
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-2">Sequential Stops & Timings:</span>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-2 text-xs">
                    {selectedBmtcRoute.stops.map((stop, sIdx) => (
                      <div key={sIdx} className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200">
                        <div className="flex items-center space-x-2">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center">
                            {sIdx + 1}
                          </span>
                          <div>
                            <span className="font-semibold text-slate-800">{stop.name}</span>
                            <span className="text-[10px] text-slate-400 ml-2 font-kannada">({stop.kannadaName})</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {stop.hasInterchange && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 font-semibold">
                              Metro Interchange
                            </span>
                          )}
                          <span className="text-slate-500 text-[11px] font-mono">+{stop.timeEstimateMinutes}m</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 2: BMRCL METRO ======================= */}
        {activeTab === 'BMRCL' && (
          <div className="space-y-6">
            {/* Metro Line Switcher */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BMRCL_METRO_LINES.map((line) => (
                <button
                  key={line.id}
                  onClick={() => setSelectedMetroLineId(line.id as any)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    selectedMetroLineId === line.id
                      ? line.id === 'purple-line'
                        ? 'border-purple-600 bg-purple-50/70 shadow-sm ring-2 ring-purple-500/20'
                        : 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${
                        line.id === 'purple-line' ? 'bg-purple-700 text-white' : 'bg-emerald-700 text-white'
                      }`}
                    >
                      {line.name.split('(')[0]}
                    </span>
                    <span className="text-xs font-bold text-slate-700">{line.length}</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-1">{line.terminals}</div>
                  <div className="text-xs text-slate-500 font-kannada mt-0.5">{line.kannadaName}</div>
                  <div className="mt-2 text-xs text-slate-600 font-medium">
                    ⚡ Frequency: {line.frequency}
                  </div>
                </button>
              ))}
            </div>

            {/* Selected Metro Line Station Strip & Guidance */}
            {(() => {
              const activeMetro = BMRCL_METRO_LINES.find(l => l.id === selectedMetroLineId) || BMRCL_METRO_LINES[0];
              return (
                <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{activeMetro.name}</h3>
                      <p className="text-xs text-slate-500">First Train: {activeMetro.firstTrain} • Last Train: {activeMetro.lastTrain}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <a
                        href="https://api.whatsapp.com/send?phone=918105556677&text=Hi"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition"
                      >
                        <span>WhatsApp QR Ticket (+91 81055 56677)</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Amenities Bar */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    {activeMetro.keyAmenities.map((amenity, aIdx) => (
                      <span key={aIdx} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium">
                        ✓ {amenity}
                      </span>
                    ))}
                  </div>

                  {/* Stations List */}
                  <div>
                    <span className="text-xs font-bold text-slate-700 block mb-2">
                      All Stations ({activeMetro.stations.length}):
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs max-h-72 overflow-y-auto pr-1">
                      {activeMetro.stations.map((st, sIdx) => {
                        const isInterchange = st.includes('Interchange') || st.includes('Majestic');
                        return (
                          <div
                            key={sIdx}
                            className={`p-2 rounded-lg border text-xs ${
                              isInterchange
                                ? 'bg-amber-50 border-amber-300 font-bold text-amber-950'
                                : 'bg-white border-slate-200 text-slate-800'
                            }`}
                          >
                            <span className="text-[10px] text-slate-400 block">{sIdx + 1}</span>
                            <span className="truncate block">{st}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ======================= TAB 3: AUTOS ======================= */}
        {activeTab === 'AUTOS' && (
          <div className="space-y-6">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start space-x-3">
              <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 space-y-1">
                <span className="font-bold text-sm">Official Bengaluru Auto Rickshaw Regulations</span>
                <p>
                  Drivers are legally required to operate strictly by digital meter within BBMP limits.
                  Refusal to turn on meter or demanding flat arbitrary fares is subject to immediate Traffic Police e-challan fines.
                </p>
                <p className="font-semibold text-amber-950 pt-1">
                  Helpline: {AUTO_TARIFF_RULES.refusalComplaintHelpline}
                </p>
              </div>
            </div>

            {/* Official Tariff Table */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                <span className="text-xs text-slate-500 uppercase font-bold">Minimum Base Fare</span>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">₹{AUTO_TARIFF_RULES.minimumFare}</div>
                <span className="text-xs text-slate-500">Covers first 2.0 km</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                <span className="text-xs text-slate-500 uppercase font-bold">Per Km Rate</span>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">₹{AUTO_TARIFF_RULES.ratePerKmAfterMinimum}</div>
                <span className="text-xs text-slate-500">For every subsequent km</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                <span className="text-xs text-slate-500 uppercase font-bold">Night Tariff (10 PM - 5 AM)</span>
                <div className="text-2xl font-extrabold text-amber-600 mt-1">1.5x</div>
                <span className="text-xs text-slate-500">1.5 times the meter reading</span>
              </div>
            </div>

            {/* Official 24x7 Prepaid Auto Booths */}
            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-3">
                Authorized Traffic Police Prepaid Auto Booths (Zero Refusal / Slip Counter)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                {AUTO_TARIFF_RULES.prepaidBooths.map((booth, bIdx) => (
                  <div key={bIdx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900 text-sm">{booth.location}</div>
                    <div className="text-slate-600">Hours: <strong>{booth.timing}</strong></div>
                    <div className="text-slate-500 text-[11px]">Official Service Slip Charge: {booth.slipFee}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 4: TAXIS & CABS ======================= */}
        {activeTab === 'TAXIS' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
                KIA Bengaluru Airport Fixed Tariff Matrix (Sedan / Hatchback)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {TAXI_CAB_INFO.airportFixedZoneRates.map((zone, zIdx) => (
                  <div key={zIdx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">{zone.zone}</span>
                      <span className="font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {zone.sedanFare}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Toll charge: NH44 Airport Expressway Toll (₹115) payable additionally at booth or included in app invoice.
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Official App Pickup Zones */}
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
                Designated App Cab Pickup Hubs (Uber / Ola / BluSmart / KSTDC)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {TAXI_CAB_INFO.appPickupZones.map((hub, hIdx) => (
                  <div key={hIdx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 text-sm">{hub.hub}</span>
                    <p className="text-slate-600">{hub.area}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 5: FASTAG TOLLS ======================= */}
        {activeTab === 'FASTAG' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-purple-50 border border-purple-200 rounded-2xl">
              <div className="text-xs space-y-1 text-purple-950">
                <span className="font-bold text-sm">Official NPCI NETC FASTag Gateway</span>
                <p>FASTag balance enquiry and top-ups must be made via NPCI authorized banking gateways.</p>
              </div>
              <a
                href="https://www.netc.org.in/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition shadow-sm shrink-0"
              >
                <span>Visit NETC FASTag Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Key Bangalore Plaza Rates */}
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Key Highway Toll Plazas (Tariff & ETC Status)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {FASTAG_INFO.keyPlazas.map((plaza, pIdx) => (
                  <div key={pIdx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                    <div className="font-bold text-slate-900 text-sm">{plaza.name}</div>
                    <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2 rounded-lg text-center text-[11px]">
                      <div>
                        <span className="text-slate-400 block">Single</span>
                        <span className="font-bold text-slate-800">{plaza.singleTrip}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Return</span>
                        <span className="font-bold text-slate-800">{plaza.returnTrip}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Monthly</span>
                        <span className="font-bold text-slate-800">{plaza.monthlyPass}</span>
                      </div>
                    </div>
                    <div className="text-[11px] text-emerald-700 font-semibold flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{plaza.laneStatus}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Missed Call Balance Numbers */}
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Quick Missed-Call Balance Check Numbers
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {FASTAG_INFO.missedCallBalanceNumbers.map((call, cIdx) => (
                  <div key={cIdx} className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-700 font-medium">{call.bank}</span>
                    <span className="font-mono font-bold text-blue-700">{call.number}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB 6: AIRPORT ======================= */}
        {activeTab === 'AIRPORT' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-sky-900 to-blue-900 text-white p-5 rounded-2xl space-y-3">
              <div className="flex items-center space-x-2">
                <Plane className="w-5 h-5 text-sky-300" />
                <h3 className="text-base font-bold">{AIRPORT_INFO.name}</h3>
              </div>
              <p className="text-xs text-sky-200">
                {AIRPORT_INFO.shuttleService}
              </p>
              <div className="flex flex-wrap gap-3 pt-2 text-xs">
                <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/20">
                  T1 Domestic Wait: <strong>{AIRPORT_INFO.securityWaitTimeLive.t1Domestic}</strong>
                </span>
                <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/20">
                  T2 Domestic Wait: <strong>{AIRPORT_INFO.securityWaitTimeLive.t2Domestic}</strong>
                </span>
              </div>
            </div>

            {/* Terminals Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {AIRPORT_INFO.terminals.map((term, tIdx) => (
                <div key={tIdx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2 text-xs">
                  <span className="font-bold text-slate-900 text-sm block">{term.terminal}</span>
                  <div>
                    <span className="text-slate-500 font-semibold block">Airlines Operating Here:</span>
                    <p className="text-slate-700 mt-0.5">{term.carriers.join(', ')}</p>
                  </div>
                  <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-150">
                    {term.features}
                  </p>
                </div>
              ))}
            </div>

            {/* Vayu Vajra Direct Bus Link */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs space-y-2">
              <div className="flex items-center space-x-2">
                <Bus className="w-4 h-4 text-blue-700" />
                <span className="font-bold text-blue-950 text-sm">BMTC Vayu Vajra Airport Buses</span>
              </div>
              <p className="text-blue-900">
                24x7 Round-the-clock air-conditioned luxury Volvo service connecting KIA with all key city corners (KIA-9 Majestic, KIA-8 Electronic City, KIA-4 HAL/Whitefield, KIA-14 Banashankari).
                Pick-up curb right outside arrival gate.
              </p>
            </div>
          </div>
        )}

        {/* ======================= TAB 7: RAILWAY STATIONS ======================= */}
        {activeTab === 'RAILWAYS' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {RAILWAY_STATIONS.map((station, sIdx) => (
                <div key={sIdx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-150">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{station.name}</span>
                      <span className="text-[10px] text-slate-400 block font-kannada">{station.kannadaName}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded font-mono font-bold bg-slate-100 text-slate-700">
                      Code: {station.code}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-500 font-semibold block">Key Amenities:</span>
                    <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                      {station.features.map((f, fIdx) => (
                        <li key={fIdx}>{f}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 text-blue-700 font-semibold flex items-center space-x-1 text-[11px]">
                    <Train className="w-3.5 h-3.5" />
                    <span>Metro: {station.metroConnectivity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================= TAB 8: MAJESTIC BUS PLATFORM GUIDE ======================= */}
        {activeTab === 'MAJESTIC' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-5 rounded-2xl space-y-3">
              <div className="flex items-center space-x-2">
                <Navigation className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold">Kempegowda Bus Station (Majestic Terminal) Platform Directory</h3>
              </div>
              <p className="text-xs text-slate-300">
                Asia's busiest bus terminal with 30 distinct bus bays directly connected via pedestrian subways to Nadaprabhu Kempegowda Metro and KSR Bengaluru Railway Station.
              </p>

              {/* Search within Majestic */}
              <div className="relative pt-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-4" />
                <input
                  type="text"
                  value={majesticPlatformSearch}
                  onChange={(e) => setMajesticPlatformSearch(e.target.value)}
                  placeholder="Filter platforms by destination (e.g. Whitefield, Hosur, Airport, Banashankari)..."
                  className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-800/90 text-white placeholder:text-slate-400 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Interactive Platform Bays Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMajesticPlatforms.map((bay, bIdx) => (
                <div
                  key={bIdx}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 transition space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-indigo-900 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                      {bay.title.split('(')[0]}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-slate-100 text-slate-600">
                      {bay.busType}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-semibold block text-[11px]">Key Destinations:</span>
                    <p className="text-slate-800 font-medium">{bay.primaryDestinations.join(' • ')}</p>
                    <p className="text-slate-400 text-[10px] font-kannada mt-0.5">{bay.kannadaDestinations.join(' • ')}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-150">
                    <span className="text-slate-500 font-semibold block text-[11px]">Connecting Bus Routes:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {bay.routes.map((r, rIdx) => (
                        <span key={rIdx} className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-mono text-[10px] font-bold">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-[11px] text-blue-700 font-medium bg-blue-50/50 p-2 rounded-lg">
                    🚇 {bay.connectingSubway}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
