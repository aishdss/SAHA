import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Filter,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  Search,
  MessageSquare,
  Users,
  Eye,
  Send,
  Zap,
  Flame,
  Bot,
  UserCheck,
  ChevronDown,
  Layers,
  Sparkles,
  BarChart3,
  ExternalLink,
  RefreshCw,
  BadgeCheck
} from 'lucide-react';
import {
  Complaint,
  TransportMode,
  UrgencyLevel,
  ComplaintStatus,
  RecurringPattern,
  PredictiveAlert,
  SLAMetric
} from '../types';
import { SahaLogo } from './SahaLogo';

interface AuthorityDashboardProps {
  language: 'en' | 'kn';
  isOffline: boolean;
  onViewComplaintDetail?: (complaint: Complaint) => void;
}

export const AuthorityDashboard: React.FC<AuthorityDashboardProps> = ({
  language,
  isOffline,
  onViewComplaintDetail
}) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [activeTab, setActiveTab] = useState<'queue' | 'recurring' | 'predictive' | 'sla' | 'handoff'>('queue');
  const [modeFilter, setModeFilter] = useState<string>('ALL');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [hideMerged, setHideMerged] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isTriageModalOpen, setIsTriageModalOpen] = useState(false);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [responseStatus, setResponseStatus] = useState<ComplaintStatus>('ACTION_IN_PROGRESS');

  // Analytics states
  const [analytics, setAnalytics] = useState<{
    metrics: {
      activeComplaints: number;
      criticalSafetyCount: number;
      highOperationalCount: number;
      humanHandoffQueueCount: number;
      noiseFilteredCount: number;
      resolvedTotal: number;
    };
    recurringPatterns: RecurringPattern[];
    predictiveAlerts: PredictiveAlert[];
    slaMetrics: SLAMetric[];
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const fetchComplaints = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        mode: modeFilter,
        urgency: urgencyFilter,
        status: statusFilter,
        search: searchQuery,
        hideMerged: hideMerged ? 'true' : 'false'
      });

      const res = await fetch(`/api/complaints?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setComplaints(data.complaints || []);
      }
    } catch (e) {
      console.error('Failed to load complaints:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/authority/analytics');
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (e) {
      console.error('Failed to load analytics:', e);
    }
  };

  useEffect(() => {
    fetchComplaints();
    fetchAnalytics();
  }, [modeFilter, urgencyFilter, statusFilter, hideMerged]);

  const handleUpdateStatusAndRespond = async () => {
    if (!selectedComplaint) return;

    try {
      const res = await fetch(`/api/complaints/${selectedComplaint.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: responseStatus,
          note: responseText || `Status updated to ${responseStatus}`,
          authorityName: 'Officer K. Murthy (Duty Command)',
          department: selectedComplaint.assignedDepartment,
          badge: 'VERIFIED_BMTC',
          actionTaken: responseText
        })
      });

      if (res.ok) {
        setIsResponseModalOpen(false);
        setResponseText('');
        fetchComplaints();
        fetchAnalytics();
      }
    } catch (e) {
      console.error('Failed to submit response:', e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Verified Authority Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white p-5 sm:p-6 rounded-2xl shadow-sm border border-emerald-900/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="shrink-0 p-0.5 bg-white rounded-xl shadow-md border border-emerald-500/40">
              <SahaLogo size="md" variant="transparent" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
                  SAHA Authority Command & Resolution Desk
                </h2>
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  <span>Verified Agency Access</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-300/90 mt-1 font-medium">
                Tell Us. We’ll Take It Forward. — You don't need to know whom to contact. SAHA does.
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Unified operations across BMTC, BMRCL, Traffic Police/RTO, BIAL Airport, and Railways.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                fetchComplaints();
                fetchAnalytics();
              }}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Telemetry</span>
            </button>
          </div>
        </div>

        {/* Real-time KPI Stats Bar */}
        {analytics && (
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-4 border-t border-slate-800 text-xs">
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/70">
              <span className="text-slate-400 block text-[11px]">Active Incidents</span>
              <span className="text-lg font-extrabold text-white mt-0.5 block">
                {analytics.metrics.activeComplaints}
              </span>
            </div>

            <div className="bg-red-950/40 p-3 rounded-xl border border-red-800/40">
              <span className="text-red-300 block text-[11px] font-semibold">Critical Safety</span>
              <span className="text-lg font-extrabold text-red-400 mt-0.5 block flex items-center space-x-1">
                <span>{analytics.metrics.criticalSafetyCount}</span>
                <span className="text-[10px] bg-red-500/30 text-red-200 px-1.5 py-0.2 rounded font-mono">Priority 1</span>
              </span>
            </div>

            <div className="bg-amber-950/40 p-3 rounded-xl border border-amber-800/40">
              <span className="text-amber-300 block text-[11px] font-semibold">High Disruptions</span>
              <span className="text-lg font-extrabold text-amber-400 mt-0.5 block">
                {analytics.metrics.highOperationalCount}
              </span>
            </div>

            <div className="bg-indigo-950/40 p-3 rounded-xl border border-indigo-800/40">
              <span className="text-indigo-300 block text-[11px] font-semibold">Human Handoff Queue</span>
              <span className="text-lg font-extrabold text-indigo-400 mt-0.5 block">
                {analytics.metrics.humanHandoffQueueCount}
              </span>
            </div>

            <div className="bg-blue-950/40 p-3 rounded-xl border border-blue-800/40 col-span-2 sm:col-span-1">
              <span className="text-blue-300 block text-[11px] font-semibold">Noise Filtered Out</span>
              <span className="text-lg font-extrabold text-blue-400 mt-0.5 block flex items-center space-x-1">
                <span>{analytics.metrics.noiseFilteredCount}</span>
                <span className="text-[10px] text-slate-400 font-normal">queries</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Internal Navigation Subtabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('queue')}
          className={`px-3.5 py-2 rounded-xl transition ${
            activeTab === 'queue'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Incident Queue ({complaints.length})
        </button>

        <button
          onClick={() => setActiveTab('handoff')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 ${
            activeTab === 'handoff'
              ? 'bg-indigo-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Human Handoff Queue ({complaints.filter(c => c.status === 'HANDED_OFF_TO_HUMAN').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('recurring')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 ${
            activeTab === 'recurring'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          <span>Recurring Hotspots ({analytics?.recurringPatterns.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('predictive')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 ${
            activeTab === 'predictive'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>Predictive Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('sla')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 ${
            activeTab === 'sla'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Resolution SLA Tracker</span>
        </button>
      </div>

      {/* ================= SUBTAB 1: INCIDENT QUEUE ================= */}
      {activeTab === 'queue' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
          {/* Filters Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center space-x-1 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
                <span className="text-slate-500">Mode:</span>
                <select
                  value={modeFilter}
                  onChange={(e) => setModeFilter(e.target.value)}
                  className="bg-transparent font-semibold text-slate-800 focus:outline-none"
                >
                  <option value="ALL">All Modes</option>
                  <option value="BMTC">BMTC Buses</option>
                  <option value="BMRCL">BMRCL Metro</option>
                  <option value="AUTOS">Autos</option>
                  <option value="TAXIS">Taxis</option>
                  <option value="FASTAG">FASTag</option>
                  <option value="AIRPORT">Airport</option>
                  <option value="RAILWAYS">Railways</option>
                  <option value="MAJESTIC">Majestic</option>
                </select>
              </div>

              <div className="flex items-center space-x-1 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
                <span className="text-slate-500">Urgency:</span>
                <select
                  value={urgencyFilter}
                  onChange={(e) => setUrgencyFilter(e.target.value)}
                  className="bg-transparent font-semibold text-slate-800 focus:outline-none"
                >
                  <option value="ALL">All Urgencies</option>
                  <option value="CRITICAL_SAFETY">Critical Safety</option>
                  <option value="OPERATIONAL_HIGH">Operational High</option>
                  <option value="OPERATIONAL_MEDIUM">Operational Medium</option>
                  <option value="GENERAL_LOW">General Low</option>
                </select>
              </div>

              <div className="flex items-center space-x-1 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
                <span className="text-slate-500">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent font-semibold text-slate-800 focus:outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="ROUTED">Routed</option>
                  <option value="VIEWED_BY_AUTHORITY">Viewed by Authority</option>
                  <option value="ACTION_IN_PROGRESS">Action In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="HANDED_OFF_TO_HUMAN">Handed Off</option>
                </select>
              </div>

              <label className="flex items-center space-x-1.5 cursor-pointer select-none text-slate-700">
                <input
                  type="checkbox"
                  checked={hideMerged}
                  onChange={(e) => setHideMerged(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Group Duplicates Under Master</span>
              </label>
            </div>

            {/* Quick Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ticket, route, commuter..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Genuine Complaints Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Ticket / Priority</th>
                  <th className="p-3">Mode & Department</th>
                  <th className="p-3">Location & Incident Summary</th>
                  <th className="p-3">Duplicate Merge</th>
                  <th className="p-3">Current Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {complaints.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      No matching genuine complaints found.
                    </td>
                  </tr>
                ) : (
                  complaints.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition">
                      {/* Ticket & Priority */}
                      <td className="p-3 align-top">
                        <div className="font-mono font-bold text-slate-900">{item.ticketNumber}</div>
                        <div className="mt-1">
                          <span
                            className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${
                              item.urgency === 'CRITICAL_SAFETY'
                                ? 'bg-red-100 text-red-800 animate-pulse'
                                : item.urgency === 'OPERATIONAL_HIGH'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {item.urgency.replace('_', ' ')}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-1">
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      {/* Mode & Department */}
                      <td className="p-3 align-top">
                        <span className="font-bold text-slate-900 block">{item.mode}</span>
                        <span className="text-[11px] text-slate-500 line-clamp-1">{item.assignedDepartment}</span>
                        <span className="text-[10px] text-slate-400 mt-1 block">Commuter: {item.userName}</span>
                      </td>

                      {/* Location & Summary */}
                      <td className="p-3 align-top max-w-xs">
                        <div className="font-semibold text-slate-900 text-xs">
                          {item.structured.routeOrLocation}
                        </div>
                        <p className="text-slate-600 text-[11px] line-clamp-2 mt-0.5">
                          {item.structured.description}
                        </p>
                        {item.structured.vehicleRegistration && (
                          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded mt-1 inline-block">
                            Reg: {item.structured.vehicleRegistration}
                          </span>
                        )}
                      </td>

                      {/* Duplicate Merge Column */}
                      <td className="p-3 align-top">
                        {item.mergedComplaintIds && item.mergedComplaintIds.length > 0 ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold text-[11px] border border-indigo-200">
                            <Users className="w-3 h-3" />
                            <span>Master ({item.mergedComplaintIds.length} merged)</span>
                          </span>
                        ) : item.masterIncidentId ? (
                          <span className="text-[10px] text-slate-500">
                            Linked to master #{item.masterIncidentId}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Single</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-3 align-top">
                        <span
                          className={`inline-block px-2 py-0.5 rounded font-bold text-[10px] ${
                            item.status === 'RESOLVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'ACTION_IN_PROGRESS'
                              ? 'bg-blue-100 text-blue-800'
                              : item.status === 'HANDED_OFF_TO_HUMAN'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {item.status.replace(/_/g, ' ')}
                        </span>
                        {item.verifiedResponse && (
                          <span className="text-[10px] text-emerald-700 font-semibold block mt-1 flex items-center space-x-0.5">
                            <BadgeCheck className="w-3 h-3" />
                            <span>Verified Resp</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-3 align-top text-right space-y-1">
                        <button
                          onClick={() => {
                            setSelectedComplaint(item);
                            setIsTriageModalOpen(true);
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded text-[11px] transition inline-flex items-center space-x-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View Reasoning</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedComplaint(item);
                            setResponseStatus(item.status);
                            setResponseText(item.verifiedResponse?.responseText || '');
                            setIsResponseModalOpen(true);
                          }}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded text-[11px] transition block ml-auto"
                        >
                          Respond
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= SUBTAB 2: HUMAN HANDOFF QUEUE ================= */}
      {activeTab === 'handoff' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900">
            <span className="font-bold">Layer 3 Zero-Repeat Human Support Console</span>
            <p className="mt-0.5">
              These commuters were escalated due to critical safety urgency or user dissatisfaction.
              The FULL context (raw message, AI extraction, audit history) is displayed below so commuters NEVER have to repeat themselves.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {complaints
              .filter(c => c.status === 'HANDED_OFF_TO_HUMAN' || c.humanHandoff?.triggered)
              .map((handoffItem) => (
                <div key={handoffItem.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-sm bg-white px-2 py-0.5 rounded border border-slate-200">
                        #{handoffItem.ticketNumber}
                      </span>
                      <span className="font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                        {handoffItem.urgency}
                      </span>
                      <span className="font-semibold text-slate-700">Mode: {handoffItem.mode}</span>
                    </div>

                    <span className="text-slate-500">
                      Escalated At: {handoffItem.humanHandoff?.handoffTime ? new Date(handoffItem.humanHandoff.handoffTime).toLocaleTimeString() : 'Recently'}
                    </span>
                  </div>

                  {/* Context Audit Box */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white p-3 rounded-lg border border-slate-200">
                    <div>
                      <span className="text-slate-400 font-semibold block text-[11px]">Original Commuter Transcript:</span>
                      <p className="text-slate-900 font-medium mt-1">"{handoffItem.rawMessage}"</p>
                      <span className="text-slate-500 block text-[11px] mt-2">
                        Commuter: <strong>{handoffItem.userName}</strong> ({handoffItem.userPhone})
                      </span>
                    </div>

                    <div className="space-y-1 text-slate-700">
                      <span className="text-slate-400 font-semibold block text-[11px]">AI Structured Telemetry:</span>
                      <p><strong>Location:</strong> {handoffItem.structured.routeOrLocation}</p>
                      <p><strong>Incident Time:</strong> {handoffItem.structured.timeOfIncident}</p>
                      <p><strong>Diagnosis:</strong> {handoffItem.aiReport.summary}</p>
                      <p><strong>Recommended Action:</strong> {handoffItem.aiReport.suggestedAction}</p>
                    </div>
                  </div>

                  {/* Response Action */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-emerald-700 font-semibold">
                      Assigned Agent: {handoffItem.humanHandoff?.agentAssigned || 'Duty Human Officer'}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedComplaint(handoffItem);
                        setResponseStatus('ACTION_IN_PROGRESS');
                        setIsResponseModalOpen(true);
                      }}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition shadow-sm"
                    >
                      Take Official Action & Call Commuter
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ================= SUBTAB 3: RECURRING PROBLEMS ================= */}
      {activeTab === 'recurring' && analytics && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Flame className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-slate-700">
              Surfaced Recurring Transit Patterns (Calculated from cross-user complaint cluster analysis):
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analytics.recurringPatterns.map((pattern) => (
              <div key={pattern.id} className="border border-amber-200 bg-amber-50/40 p-4 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900">{pattern.keyIdentifier}</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-extrabold text-[11px]">
                    {pattern.occurrenceCount} Reports
                  </span>
                </div>

                <div className="text-slate-600">
                  Timeframe: <strong>{pattern.timeframe}</strong> • Category: <strong>{pattern.commonCategory}</strong>
                </div>

                <p className="text-slate-800 font-medium bg-white p-2.5 rounded-lg border border-amber-200">
                  {pattern.patternDescription}
                </p>

                <div className="pt-1 text-slate-700">
                  <span className="font-bold text-amber-950 block">Suggested Systemic Intervention:</span>
                  <p className="text-[11px] text-slate-600 mt-0.5">{pattern.suggestedIntervention}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= SUBTAB 4: PREDICTIVE ANALYTICS ================= */}
      {activeTab === 'predictive' && analytics && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="font-bold text-slate-700">
              Proactive Predictive Pre-Deployment Alerts (Weather, Historical Breakdown & Crowd Models):
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analytics.predictiveAlerts.map((alert) => (
              <div key={alert.id} className="border border-blue-200 bg-blue-50/40 p-4 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{alert.mode} • {alert.zone}</span>
                  <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] ${
                    alert.riskLevel === 'HIGH' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {alert.riskLevel} RISK ({alert.confidence}%)
                  </span>
                </div>

                <div className="font-bold text-blue-950">{alert.hazardOrIssue}</div>

                <div className="text-slate-600 bg-white p-2.5 rounded-lg border border-blue-100 space-y-1">
                  <span className="text-[10px] text-slate-400 block font-semibold">Trigger Factor:</span>
                  <p className="text-slate-700">{alert.triggerFactor}</p>
                </div>

                <div className="pt-1">
                  <span className="font-bold text-blue-900 block text-[11px]">Recommended Pre-Deployment Action:</span>
                  <p className="text-[11px] text-slate-700 mt-0.5">{alert.recommendedAction}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= SUBTAB 5: RESOLUTION SLA TRACKER ================= */}
      {activeTab === 'sla' && analytics && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <BarChart3 className="w-4 h-4 text-emerald-500" />
            <span className="font-bold text-slate-700">
              Departmental Resolution SLA Compliance Matrix:
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {analytics.slaMetrics.map((sla, idx) => (
              <div key={idx} className="border border-slate-200 p-4 rounded-xl bg-slate-50 space-y-2 text-xs">
                <div className="font-bold text-slate-900 text-sm line-clamp-1">{sla.category}</div>
                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Target Resolution</span>
                    <span className="font-bold text-slate-700">{sla.targetMinutes} mins</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px]">Avg Actual</span>
                    <span className="font-bold text-emerald-600">{sla.currentAvgMinutes} mins</span>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-500">Compliance Rate</span>
                    <span className="font-extrabold text-slate-900">{sla.withinSLAPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-2 rounded-full"
                      style={{ width: `${sla.withinSLAPercent}%` }}
                    />
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 block pt-1 text-center">
                  {sla.totalHandled} complaints audited this week
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reasoning-Visible Triage Modal */}
      {isTriageModalOpen && selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-xs space-y-4">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-blue-400" />
                <span className="font-bold text-sm">
                  Reasoning-Visible Triage: #{selectedComplaint.ticketNumber}
                </span>
              </div>
              <button
                onClick={() => setIsTriageModalOpen(false)}
                className="text-slate-400 hover:text-white text-base font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
                <span className="font-bold text-blue-900 block">Why Priority Was Assigned:</span>
                <p className="text-slate-800 leading-relaxed font-medium">
                  {selectedComplaint.aiReport.priorityReasoning}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 font-semibold block">Root Cause Hypothesis:</span>
                  <span className="text-slate-800">{selectedComplaint.aiReport.rootCauseHypothesis}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Suggested Department Action:</span>
                  <span className="text-slate-800">{selectedComplaint.aiReport.suggestedAction}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">Raw User Submission:</span>
                <p className="p-2.5 bg-slate-100 rounded-lg text-slate-800 font-mono text-[11px]">
                  {selectedComplaint.rawMessage}
                </p>
              </div>

              {selectedComplaint.mergedComplaintIds && selectedComplaint.mergedComplaintIds.length > 0 && (
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl space-y-1">
                  <span className="font-bold text-indigo-900">
                    Merged Incident Group ({selectedComplaint.mergedComplaintIds.length} Linked Reports):
                  </span>
                  <p className="text-indigo-800">
                    Multiple commuters filed reports on this exact route within the past 2 hours.
                    Resolving this master ticket will proactively notify all {selectedComplaint.mergedComplaintIds.length + 1} affected commuters.
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end space-x-2">
              <button
                onClick={() => setIsTriageModalOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Response & Status Update Modal */}
      {isResponseModalOpen && selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-xs space-y-4">
            <div className="bg-emerald-950 text-white p-4 flex items-center justify-between border-b border-emerald-900">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-sm">
                  Broadcast Verified Response: #{selectedComplaint.ticketNumber}
                </span>
              </div>
              <button
                onClick={() => setIsResponseModalOpen(false)}
                className="text-slate-400 hover:text-white text-base font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Update Status:</label>
                <select
                  value={responseStatus}
                  onChange={(e) => setResponseStatus(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="VIEWED_BY_AUTHORITY">Viewed by Authority</option>
                  <option value="ACTION_IN_PROGRESS">Action In Progress (Relief/Patrol Dispatched)</option>
                  <option value="RESOLVED">Resolved (Issue Cleared)</option>
                  <option value="HANDED_OFF_TO_HUMAN">Escalate to Senior Officer</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Official Response Note (Sent to Commuter with Verified Authority Badge):
                </label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="e.g. Relief bus KA-01-FA-4100 dispatched; passengers transferred safely..."
                  rows={4}
                  className="w-full p-3 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center space-x-2 text-emerald-900">
                <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  This response will be stamped with the <strong>Official BMTC/BMRCL Verified Seal</strong> and pushed to the user's notification tray.
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end space-x-2">
              <button
                onClick={() => setIsResponseModalOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatusAndRespond}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-sm"
              >
                Submit Verified Response
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
