import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Plus,
  ThumbsUp,
  AlertTriangle,
  Bus,
  Car,
  Train,
  ShieldAlert,
  Flame,
  CheckCircle2,
  Filter,
  Navigation
} from 'lucide-react';
import { CrowdsourcedReport, TransportMode } from '../types';

interface CrowdsourcedMicroReportingProps {
  language: 'en' | 'kn';
  isOffline: boolean;
}

export const CrowdsourcedMicroReporting: React.FC<CrowdsourcedMicroReportingProps> = ({
  language,
  isOffline
}) => {
  const [reports, setReports] = useState<CrowdsourcedReport[]>([]);
  const [selectedType, setSelectedType] = useState<CrowdsourcedReport['type'] | 'ALL'>('ALL');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedReportOnMap, setSelectedReportOnMap] = useState<CrowdsourcedReport | null>(null);

  // Form states
  const [newType, setNewType] = useState<CrowdsourcedReport['type']>('crowded_bus');
  const [newMode, setNewMode] = useState<TransportMode>('BMTC');
  const [newLocation, setNewLocation] = useState('Central Silk Board Junction');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const quickTypes = [
    { type: 'crowded_bus' as const, label: '🚌 Bus Too Crowded', mode: 'BMTC' as const, defaultTitle: 'Bus Overcrowded & Skipping Stops' },
    { type: 'auto_refusal' as const, label: '🛺 Auto Meter Refusal', mode: 'AUTOS' as const, defaultTitle: 'Auto Driver Refused Meter / Demanding Extra' },
    { type: 'elevator_down' as const, label: '🚇 Metro Elevator Broken', mode: 'BMRCL' as const, defaultTitle: 'Station Concourse Elevator Out of Order' },
    { type: 'pothole_waterlogging' as const, label: '🌧️ Waterlogging / Road Hazard', mode: 'TAXIS' as const, defaultTitle: 'Waterlogging Slowing Ring Road Traffic' },
    { type: 'harassment_alert' as const, label: '🚨 Safety Alert', mode: 'BMRCL' as const, defaultTitle: 'Unsafe Condition / Immediate Guard Needed' }
  ];

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/crowdsourced');
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports || []);
      }
    } catch (e) {
      console.error('Failed to load crowdsourced reports:', e);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleUpvote = async (id: string) => {
    try {
      const res = await fetch(`/api/crowdsourced/${id}/upvote`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setReports(prev =>
          prev.map(r => r.id === id ? { ...r, upvotes: data.upvotes, userUpvoted: data.userUpvoted } : r)
        );
      }
    } catch (e) {
      console.error('Upvote failed:', e);
    }
  };

  const handleSubmitNewReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    // Pseudo coordinates based on location
    const coords = {
      x: Math.floor(30 + Math.random() * 45),
      y: Math.floor(30 + Math.random() * 45)
    };

    try {
      const res = await fetch('/api/crowdsourced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: newType,
          mode: newMode,
          location: newLocation,
          title: newTitle,
          description: newDescription,
          coordinates: coords
        })
      });

      if (res.ok) {
        setIsSubmitModalOpen(false);
        setNewTitle('');
        setNewDescription('');
        fetchReports();
      }
    } catch (e) {
      console.error('Submit report failed:', e);
    }
  };

  const filteredReports = selectedType === 'ALL'
    ? reports
    : reports.filter(r => r.type === selectedType);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden space-y-6 p-5 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-amber-500/20 text-amber-600 rounded-lg">
              <MapPin className="w-5 h-5" />
            </span>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
              {language === 'kn' ? 'ನೈಜ-ಸಮಯದ ಸಾರ್ವಜನಿಕ ವರದಿಗಳು' : 'Crowdsourced Real-Time Micro-Reporting'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === 'kn'
              ? 'ಪ್ರಯಾಣಿಕರು ನೀಡಿದ ಲೈವ್ ವರದಿಗಳು: ಬಸ್ ದಟ್ಟಣೆ, ಆಟೋ ಮೀಟರ್ ತಿರಸ್ಕಾರ, ಮೆಟ್ರೋ ಲಿಫ್ಟ್ ದುರಸ್ತಿ ಇತ್ಯಾದಿ.'
              : 'Drop 1-tap pins for crowded buses, auto meter refusals, and elevator outages. Feeds directly into predictive authority dispatch.'}
          </p>
        </div>

        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'kn' ? 'ವರದಿ ಸೇರಿಸಿ' : 'Drop 1-Tap Map Pin'}</span>
        </button>
      </div>

      {/* 1-Tap Quick Action Bar */}
      <div>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
          Instant 1-Tap Commuter Presets:
        </span>
        <div className="flex flex-wrap gap-2">
          {quickTypes.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setNewType(q.type);
                setNewMode(q.mode);
                setNewTitle(q.defaultTitle);
                setIsSubmitModalOpen(true);
              }}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-50 hover:border-amber-300 border border-slate-200 text-slate-800 font-semibold transition flex items-center space-x-1.5"
            >
              <span>{q.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Visual City Map Representation */}
      <div className="relative w-full h-80 sm:h-96 rounded-2xl bg-slate-900 overflow-hidden border border-slate-800 shadow-inner">
        {/* Bangalore City stylized vector grid canvas */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Road arterial outlines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
          <path d="M 50 150 Q 200 180 350 200 T 700 240" fill="none" stroke="#60a5fa" strokeWidth="3" strokeDasharray="6 4" />
          <path d="M 250 50 Q 300 200 400 350" fill="none" stroke="#34d399" strokeWidth="3" strokeDasharray="6 4" />
          <circle cx="50%" cy="50%" r="90" fill="none" stroke="#818cf8" strokeWidth="2" strokeDasharray="4 4" />
        </svg>

        {/* City Major Landmark Labels */}
        <div className="absolute top-4 left-6 text-[11px] font-bold text-slate-400 select-none">
          North BLR (Hebbal / Airport NH44)
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-black text-slate-500/80 uppercase tracking-widest pointer-events-none">
          Majestic / CBD Center
        </div>
        <div className="absolute bottom-4 right-6 text-[11px] font-bold text-slate-400 select-none">
          East BLR (Outer Ring Road / Whitefield)
        </div>
        <div className="absolute bottom-4 left-6 text-[11px] font-bold text-slate-400 select-none">
          South BLR (Silk Board / Electronic City)
        </div>

        {/* Rendered Live Pins on City Canvas */}
        {filteredReports.map((report) => (
          <div
            key={report.id}
            onClick={() => setSelectedReportOnMap(report)}
            style={{ left: `${report.coordinates.x}%`, top: `${report.coordinates.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-125 border-2 border-white ${
                report.type === 'harassment_alert'
                  ? 'bg-red-600 animate-ping'
                  : report.type === 'crowded_bus'
                  ? 'bg-blue-600'
                  : report.type === 'auto_refusal'
                  ? 'bg-amber-500'
                  : report.type === 'elevator_down'
                  ? 'bg-purple-600'
                  : 'bg-emerald-600'
              }`}
            >
              <MapPin className="w-4 h-4" />
            </div>

            {/* Quick Hover Tooltip */}
            <div className="hidden group-hover:block absolute left-8 top-0 bg-slate-900/95 text-white text-[11px] p-2.5 rounded-xl shadow-xl w-48 border border-slate-700 pointer-events-none z-30">
              <span className="font-bold block text-blue-300">{report.title}</span>
              <span className="text-slate-400 block text-[10px]">{report.location}</span>
              <span className="text-emerald-400 font-semibold mt-1 block">👍 {report.upvotes} commuters confirmed</span>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Report Inspection Card */}
      {selectedReportOnMap && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-slate-900">{selectedReportOnMap.title}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
                {selectedReportOnMap.mode}
              </span>
              {selectedReportOnMap.verifiedByAuthority && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                  ✓ Authority Notified
                </span>
              )}
            </div>
            <p className="text-slate-600">{selectedReportOnMap.description}</p>
            <span className="text-slate-400 text-[10px] block">
              Location: <strong>{selectedReportOnMap.location}</strong> • Posted {selectedReportOnMap.timestamp}
            </span>
          </div>

          <button
            onClick={() => handleUpvote(selectedReportOnMap.id)}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition shrink-0 ${
              selectedReportOnMap.userUpvoted
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>Confirm ({selectedReportOnMap.upvotes})</span>
          </button>
        </div>
      )}

      {/* Live Feed List */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          Recent Community Pin Submissions ({filteredReports.length})
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {filteredReports.map((item) => (
            <div key={item.id} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-bold text-slate-900 block">{item.title}</span>
                  <span className="text-[11px] text-slate-500">{item.location}</span>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">{item.timestamp}</span>
              </div>

              {item.description && (
                <p className="text-slate-600 text-[11px] bg-slate-50 p-2 rounded-lg">
                  {item.description}
                </p>
              )}

              <div className="flex items-center justify-between pt-1 border-t border-slate-150">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">
                  Mode: {item.mode}
                </span>

                <button
                  onClick={() => handleUpvote(item.id)}
                  className={`inline-flex items-center space-x-1 text-[11px] font-bold px-2 py-0.5 rounded transition ${
                    item.userUpvoted
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:text-blue-600 bg-slate-100'
                  }`}
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>{item.upvotes} Confirmed</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Report Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmitNewReport}
            className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-xs space-y-4"
          >
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <span className="font-bold text-sm">Drop 1-Tap Commuter Map Pin</span>
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Issue Category:</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="crowded_bus">Bus Too Crowded / Skipping Stops</option>
                  <option value="auto_refusal">Auto Driver Refusing Meter / Overcharging</option>
                  <option value="elevator_down">Metro Elevator / Escalator Out of Order</option>
                  <option value="pothole_waterlogging">Road Waterlogging / Pothole</option>
                  <option value="harassment_alert">Safety Alert / Immediate Security Presence</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Transport Sector:</label>
                <select
                  value={newMode}
                  onChange={(e) => setNewMode(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="BMTC">BMTC Bus</option>
                  <option value="BMRCL">BMRCL Metro</option>
                  <option value="AUTOS">Auto Rickshaw</option>
                  <option value="TAXIS">Taxi / App Cab</option>
                  <option value="MAJESTIC">Majestic Station</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Location / Stop / Junction:</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. Silk Board Flyover, Indiranagar 100ft Road..."
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Short Headline:</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. 500D buses full and not stopping at shelter..."
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Details (Optional):</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Add any helpful details for fellow commuters..."
                  rows={2}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-lg text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs"
              >
                Broadcast to Commuters & Authority
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
