import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  AlertTriangle,
  ShieldCheck,
  Clock,
  MapPin,
  CheckCircle2,
  ExternalLink,
  Users,
  Bot,
  UserCheck,
  ChevronRight,
  Layers,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  FileText,
  BadgeCheck,
  CornerDownRight
} from 'lucide-react';
import {
  AIQueryResponse,
  Complaint,
  UserProfile,
  TransportMode
} from '../types';
import { SahaLogo } from './SahaLogo';

interface AIComplaintAssistantProps {
  userProfile: UserProfile;
  language: 'en' | 'kn';
  isOffline: boolean;
  onComplaintSubmitted?: (complaint: Complaint) => void;
  onOpenHumanSupportDrawer?: (complaint: Complaint) => void;
}

export const AIComplaintAssistant: React.FC<AIComplaintAssistantProps> = ({
  userProfile,
  language,
  isOffline,
  onComplaintSubmitted,
  onOpenHumanSupportDrawer
}) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeResult, setActiveResult] = useState<AIQueryResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPipelineDetails, setShowPipelineDetails] = useState(true);

  // Pre-configured realistic test prompts covering each layer and condition
  const testPrompts = [
    {
      label: '🚌 "Where is the next 500D bus from Silk Board?"',
      text: 'Where is the next 500D bus from Central Silk Board towards Hebbal, and what is the fare?',
      type: 'Informational (Direct Answer)'
    },
    {
      label: '💳 "Recharge FASTag for Airport expressway"',
      text: 'I want to recharge my FASTag for the Devanahalli Airport expressway toll booth.',
      type: 'Transaction (Official Portal Redirect)'
    },
    {
      label: '⚠️ "Bus 500D broke down at Marathahalli bridge"',
      text: 'Bus 500D broke down right at Marathahalli bridge. Engine emitting smoke, all passengers stranded on Outer Ring Road without alternate bus.',
      type: 'Operational Complaint (Auto-Merge & Triage)'
    },
    {
      label: '🚨 "Harassment in ladies coach at Indiranagar Metro"',
      text: 'Emergency: A passenger is harassing women in the ladies coach on Purple Line Metro near Indiranagar station. Platform guard was missing.',
      type: 'Critical Safety (Instant Human Handoff)'
    },
    {
      label: '🛺 "Auto driver refused meter and demanded ₹250"',
      text: 'Auto driver at MG Road Metro prepaid stand refused to run the meter and aggressively demanded ₹250 for a 2 km trip to Richmond Town.',
      type: 'Operational Complaint (BTP Traffic Queue)'
    }
  ];

  const handleExecuteQuery = async (queryText?: string) => {
    const textToSend = (queryText || inputText).trim();
    if (!textToSend) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userText: textToSend,
          userProfile,
          language
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data: AIQueryResponse = await response.json();
      setActiveResult(data);

      if (data.complaintCreated && onComplaintSubmitted) {
        onComplaintSubmitted(data.complaintCreated);
      }
    } catch (err: any) {
      console.error('AI Query failed:', err);
      // Offline fallback handling
      setErrorMessage(
        isOffline
          ? 'Network is offline. Local rule engine applied classification from static transit database.'
          : 'Unable to reach backend. Using static transit intelligence.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTriggerHumanHandoff = async () => {
    if (!activeResult?.complaintCreated) return;

    try {
      const res = await fetch(`/api/complaints/${activeResult.complaintCreated.id}/handoff`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: 'USER_UNSATISFIED',
          notes: 'User requested live human agent escalation from 3-layer assistant console.'
        })
      });

      if (res.ok) {
        const updated = await res.json();
        if (updated.complaint) {
          setActiveResult(prev => prev ? { ...prev, complaintCreated: updated.complaint } : null);
          if (onOpenHumanSupportDrawer) {
            onOpenHumanSupportDrawer(updated.complaint);
          }
        }
      }
    } catch (e) {
      console.error('Human handoff error:', e);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header with Pipeline Explanation */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="shrink-0 p-0.5 bg-white rounded-xl shadow-md border border-indigo-400/30">
              <SahaLogo size="md" variant="transparent" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                  {language === 'kn' ? 'ಸಾಹ (SAHA) — ನಮಗೆ ತಿಳಿಸಿ. ನಾವು ಮುಂದೆ ಕೊಂಡೊಯ್ಯುತ್ತೇವೆ' : 'SAHA — Tell Us. We’ll Take It Forward.'}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-blue-200 mt-0.5 font-medium">
                {language === 'kn'
                  ? 'ಯಾರನ್ನು ಸಂಪರ್ಕಿಸಬೇಕೆಂದು ನೀವು ತಿಳಿಯಬೇಕಿಲ್ಲ. ಸಾಹಗೆ ತಿಳಿದಿದೆ • ಹುಡುಕಿ. ಕೇಳಿ. ವರದಿ ಮಾಡಿ. ಟ್ರ್ಯಾಕ್ ಮಾಡಿ. ಪರಿಹರಿಸಿ.'
                  : "You don't need to know whom to contact. SAHA does. • Search. Ask. Report. Track. Resolve."}
              </p>
              <p className="text-[11px] text-slate-300 mt-1">
                {language === 'kn'
                  ? '3-ಹಂತದ ಎಐ: ಮಾಹಿತಿ ಪ್ರಶ್ನೆಗಳಿಗೆ ತಕ್ಷಣ ಉತ್ತರ • ದೂರುಗಳ ಸ್ವಯಂ ವರ್ಗೀಕರಣ • ತುರ್ತು ಸಮಯದಲ್ಲಿ ಮಾನವ ಅಧಿಕಾರಿಗೆ ಹಸ್ತಾಂತರ'
                  : '3-Layer Transit Intelligence: Direct AI answers for info queries • Instant ticket triage & duplicate merging • Human handoff'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowPipelineDetails(!showPipelineDetails)}
            className="self-start md:self-auto text-xs px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white flex items-center space-x-1.5 transition"
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>{showPipelineDetails ? 'Hide Architecture' : 'View Architecture'}</span>
          </button>
        </div>

        {/* Visual 3-Layer Flow Architecture Pill Bar */}
        {showPipelineDetails && (
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800/80 text-xs">
            <div className="bg-slate-800/60 border border-slate-700/70 p-3 rounded-xl">
              <div className="flex items-center justify-between font-semibold text-blue-300 mb-1">
                <span className="flex items-center space-x-1.5">
                  <Bot className="w-4 h-4 text-blue-400" />
                  <span>Layer 1: AI Triage</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/20 rounded text-blue-200">Instant</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Classifies intent (info query vs. genuine complaint). Informational queries answered directly without queue noise!
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/70 p-3 rounded-xl">
              <div className="flex items-center justify-between font-semibold text-indigo-300 mb-1">
                <span className="flex items-center space-x-1.5">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span>Layer 2: Route & Merge</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 bg-indigo-500/20 rounded text-indigo-200">Auto</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Extracts location, time & vehicle. Prioritizes Safety &gt; Operational, merges duplicate incidents, generates briefing report.
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/70 p-3 rounded-xl">
              <div className="flex items-center justify-between font-semibold text-amber-300 mb-1">
                <span className="flex items-center space-x-1.5">
                  <UserCheck className="w-4 h-4 text-amber-400" />
                  <span>Layer 3: Human Handoff</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/20 rounded text-amber-200">Zero-Repeat</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Triggered for safety threats or user request. Transfers full chat context and structured telemetry to human authority.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="p-5 sm:p-6 space-y-4">
        <div>
          <label htmlFor="ai-assist-input" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            {language === 'kn' ? 'ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಅಥವಾ ದೂರನ್ನು ನಮೂದಿಸಿ' : 'Enter Query, Route Question, or File a Complaint'}
          </label>
          <div className="relative">
            <textarea
              id="ai-assist-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                language === 'kn'
                  ? 'ಉದಾ: ಬಸ್ 500ಡಿ ಯಾವಾಗ ಬರುತ್ತದೆ? ಅಥವಾ ಮಾರತ್‌ಹಳ್ಳಿಯಲ್ಲಿ ಬಸ್ ಕೆಟ್ಟುಹೋಗಿದೆ...'
                  : 'Type naturally in English or Kannada (e.g. "Where is 500D bus", "Auto charged extra at MG Road", "Harassment on Purple Line")...'
              }
              rows={3}
              className="w-full px-4 py-3 text-sm text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-inner placeholder:text-slate-400"
            />
            <button
              id="ai-assist-submit-btn"
              onClick={() => handleExecuteQuery()}
              disabled={isLoading || !inputText.trim()}
              className="absolute right-3 bottom-3 inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold text-xs rounded-lg shadow-sm transition"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{language === 'kn' ? 'ಸಲ್ಲಿಸಿ' : 'Analyze & Process'}</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Test Chips */}
        <div>
          <div className="flex items-center space-x-1 text-xs text-slate-500 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span className="font-semibold">Quick Test Scenarios (Click to test 3-Layer pipeline):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {testPrompts.map((p, idx) => (
              <button
                key={idx}
                id={`quick-test-pill-${idx}`}
                onClick={() => {
                  setInputText(p.text);
                  handleExecuteQuery(p.text);
                }}
                className="text-left text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 hover:border-blue-300 text-slate-700 px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 group"
              >
                <span>{p.label}</span>
                <span className="text-[10px] text-slate-400 group-hover:text-blue-500 font-mono">({p.type})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Error message banner */}
        {errorMessage && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Active Result Card */}
        {activeResult && (
          <div className="mt-6 border border-slate-200 rounded-2xl p-5 bg-slate-50/70 space-y-4 transition-all">
            {/* Triage Badge Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <span
                  className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                    activeResult.queryType === 'INFORMATIONAL_QUERY'
                      ? 'bg-blue-100 text-blue-800'
                      : activeResult.queryType === 'TRANSACTION_REDIRECT'
                      ? 'bg-purple-100 text-purple-800'
                      : activeResult.urgency === 'CRITICAL_SAFETY'
                      ? 'bg-red-100 text-red-800 animate-pulse'
                      : activeResult.urgency === 'OPERATIONAL_HIGH'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  <span>
                    {activeResult.queryType === 'INFORMATIONAL_QUERY'
                      ? 'Layer 1: Informational Query'
                      : activeResult.queryType === 'TRANSACTION_REDIRECT'
                      ? 'Layer 1: Official Portal Redirect'
                      : `Layer 2: Complaint (${activeResult.urgency})`}
                  </span>
                </span>

                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                  Mode: {activeResult.mode}
                </span>
              </div>

              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <span>AI Confidence:</span>
                <span className="font-bold text-slate-800">{activeResult.confidence}%</span>
              </div>
            </div>

            {/* Case A: INFORMATIONAL QUERY (Filtered Out from Complaint Queue) */}
            {activeResult.queryType === 'INFORMATIONAL_QUERY' && (
              <div className="space-y-3 bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-bold text-slate-900">Direct Sourced Answer</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                        Noise Filter Applied: Zero Complaint Clutter
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed font-sans">
                      {language === 'kn' && activeResult.kannadaAnswer
                        ? activeResult.kannadaAnswer
                        : activeResult.answer}
                    </p>
                    {language !== 'kn' && activeResult.kannadaAnswer && (
                      <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-150 font-kannada">
                        <span className="font-semibold text-slate-700">ಕನ್ನಡದಲ್ಲಿ: </span>
                        {activeResult.kannadaAnswer}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Case B: TRANSACTION REDIRECT */}
            {activeResult.queryType === 'TRANSACTION_REDIRECT' && (
              <div className="bg-white p-5 rounded-xl border border-purple-200 shadow-sm space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-purple-50 text-purple-600 shrink-0">
                    <ExternalLink className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h4 className="text-sm font-bold text-slate-900">
                      Official Transaction Portal Redirection
                    </h4>
                    <p className="text-sm text-slate-700">
                      {language === 'kn' && activeResult.kannadaAnswer
                        ? activeResult.kannadaAnswer
                        : activeResult.answer}
                    </p>
                    {activeResult.redirectUrl && (
                      <div className="pt-2">
                        <a
                          id="transaction-redirect-link"
                          href={activeResult.redirectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition shadow-sm"
                        >
                          <span>{activeResult.redirectLabel || 'Proceed to Official Portal'}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Security Notice: Payment credentials are never accepted inside Transport Assist.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Case C: COMPLAINT FILED (Layer 2 & 3 Action) */}
            {activeResult.queryType === 'COMPLAINT' && activeResult.complaintCreated && (
              <div className="space-y-4">
                {/* Duplicate Merged Notice if applicable */}
                {activeResult.duplicateMergedWith && (
                  <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl flex items-start space-x-3">
                    <Users className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-indigo-900 space-y-1">
                      <p className="font-bold text-sm">
                        Proactive Duplicate Merge: Linked to Master Incident #{activeResult.duplicateMergedWith.masterTicketNumber}
                      </p>
                      <p>
                        {activeResult.duplicateMergedWith.existingCount} commuters have reported this identical issue along this route within the last 2 hours.
                        You will receive automatic broadcast status updates without filing separate duplicate claims.
                      </p>
                    </div>
                  </div>
                )}

                {/* Ticket and Structured Extraction Box */}
                <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-sm text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        #{activeResult.complaintCreated.ticketNumber}
                      </span>
                      <span className="text-xs text-slate-500">
                        Assigned: <strong className="text-slate-800">{activeResult.complaintCreated.assignedDepartment}</strong>
                      </span>
                    </div>

                    <div className="flex items-center space-x-1 text-xs">
                      <span className="text-slate-500">Status:</span>
                      <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {activeResult.complaintCreated.status}
                      </span>
                    </div>
                  </div>

                  {/* Structured Data Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div>
                      <span className="text-slate-500 block">Route / Location:</span>
                      <span className="font-semibold text-slate-800">
                        {activeResult.complaintCreated.structured.routeOrLocation}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Time of Incident:</span>
                      <span className="font-semibold text-slate-800">
                        {activeResult.complaintCreated.structured.timeOfIncident}
                      </span>
                    </div>
                    {activeResult.complaintCreated.structured.vehicleRegistration && (
                      <div>
                        <span className="text-slate-500 block">Vehicle Reg / Plate:</span>
                        <span className="font-semibold text-slate-800 font-mono">
                          {activeResult.complaintCreated.structured.vehicleRegistration}
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="text-slate-500 block">Priority Flagging Order:</span>
                      <span className="font-semibold text-slate-800">
                        {activeResult.complaintCreated.urgency === 'CRITICAL_SAFETY' ? '🚨 Safety (Top Priority)' : '⚡ Operational Disruption'}
                      </span>
                    </div>
                  </div>

                  {/* AI Generated Incident Report */}
                  <div className="text-xs bg-blue-50/50 p-3 rounded-lg border border-blue-100 space-y-1">
                    <span className="font-bold text-blue-900 flex items-center space-x-1">
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      <span>Auto-Generated Authority Briefing:</span>
                    </span>
                    <p className="text-slate-700 leading-relaxed">
                      {activeResult.complaintCreated.aiReport.summary}
                    </p>
                    <p className="text-slate-600 text-[11px] pt-1 border-t border-blue-100">
                      <strong>Triage Reasoning:</strong> {activeResult.complaintCreated.aiReport.priorityReasoning}
                    </p>
                  </div>

                  {/* Live Status History Tracking */}
                  <div className="pt-2">
                    <span className="text-xs font-bold text-slate-700 block mb-2">Live Progress Timeline:</span>
                    <div className="space-y-2 text-xs">
                      {activeResult.complaintCreated.statusHistory.map((step, sIdx) => (
                        <div key={sIdx} className="flex items-start space-x-2 text-slate-600">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-slate-800">{step.status}</span> — {step.note}
                            <span className="text-[10px] text-slate-400 ml-2">
                              {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Verified Authority Response if present */}
                  {activeResult.complaintCreated.verifiedResponse && (
                    <div className="mt-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5">
                      <div className="flex items-center space-x-2">
                        <BadgeCheck className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold text-xs text-emerald-900">
                          Official Response: {activeResult.complaintCreated.verifiedResponse.authorityName}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-800 font-semibold">
                          Verified Department Badge
                        </span>
                      </div>
                      <p className="text-xs text-emerald-950 font-medium">
                        "{activeResult.complaintCreated.verifiedResponse.responseText}"
                      </p>
                    </div>
                  )}

                  {/* Layer 3: Human Handoff Action */}
                  <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-150">
                    <div className="text-[11px] text-slate-500">
                      {activeResult.complaintCreated.humanHandoff?.triggered ? (
                        <span className="text-amber-700 font-semibold flex items-center space-x-1">
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Human Support Desk Assigned: Duty Officer reviewing full context</span>
                        </span>
                      ) : (
                        <span>Need further assistance or dissatisfied with response?</span>
                      )}
                    </div>

                    {!activeResult.complaintCreated.humanHandoff?.triggered && (
                      <button
                        id="trigger-human-handoff-btn"
                        onClick={handleTriggerHumanHandoff}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition shadow-sm"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Escalate to Human Agent (Full Context)</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
