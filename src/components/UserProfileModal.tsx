import React, { useState, useEffect } from 'react';
import {
  User,
  MapPin,
  Clock,
  CheckCircle2,
  FileText,
  BadgeCheck,
  Phone,
  Shield,
  Languages
} from 'lucide-react';
import { Complaint } from '../types';
import { SahaLogo } from './SahaLogo';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'kn';
  onLanguageChange: (lang: 'en' | 'kn') => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  language,
  onLanguageChange
}) => {
  const [userName, setUserName] = useState('Rahul Sharma');
  const [userPhone, setUserPhone] = useState('+91 98450 12345');
  const [homeHub, setHomeHub] = useState('Indiranagar Metro Station');
  const [workHub, setWorkHub] = useState('ITPL Whitefield');
  const [myComplaints, setMyComplaints] = useState<Complaint[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    // Fetch all complaints and show user's complaints
    fetch('/api/complaints')
      .then(res => res.json())
      .then(data => {
        if (data.complaints) {
          setMyComplaints(data.complaints.slice(0, 5));
        }
      })
      .catch(console.error);
  }, [isOpen]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-xs space-y-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <SahaLogo size="sm" variant="light" />
            <div>
              <h3 className="font-bold text-sm">SAHA Commuter Profile & Grievance Tracking</h3>
              <p className="text-[10px] text-blue-300">Tell Us. We’ll Take It Forward. • Search. Ask. Report. Track. Resolve.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold text-base">
            ✕
          </button>
        </div>

        <div className="p-5 space-y-5 overflow-y-auto flex-1">
          {/* Commuter Info Form */}
          <form onSubmit={handleSaveProfile} className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-800 text-sm block">Personal Preferences</span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-600 block text-[11px] mb-1 font-semibold">Full Name:</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="text-slate-600 block text-[11px] mb-1 font-semibold">Phone (for SMS/Updates):</label>
                <input
                  type="text"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="text-slate-600 block text-[11px] mb-1 font-semibold">Home Transit Stop:</label>
                <input
                  type="text"
                  value={homeHub}
                  onChange={(e) => setHomeHub(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="text-slate-600 block text-[11px] mb-1 font-semibold">Workplace Transit Stop:</label>
                <input
                  type="text"
                  value={workHub}
                  onChange={(e) => setWorkHub(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2">
                <Languages className="w-4 h-4 text-slate-500" />
                <span className="text-slate-600 font-semibold">Default Language:</span>
                <button
                  type="button"
                  onClick={() => onLanguageChange(language === 'en' ? 'kn' : 'en')}
                  className="px-2.5 py-1 bg-white border border-slate-300 rounded-md font-bold text-slate-800"
                >
                  {language === 'en' ? 'English (Switch to ಕನ್ನಡ)' : 'ಕನ್ನಡ (Switch to English)'}
                </button>
              </div>

              <button
                type="submit"
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs"
              >
                {isSaved ? 'Saved ✓' : 'Save Details'}
              </button>
            </div>
          </form>

          {/* Grievance Tracking Section */}
          <div className="space-y-3">
            <span className="font-bold text-slate-800 text-sm block">
              My Active Support Requests & Grievances ({myComplaints.length})
            </span>

            <div className="space-y-2">
              {myComplaints.map((c) => (
                <div key={c.id} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900 text-xs">
                      #{c.ticketNumber} • {c.mode}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        c.status === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : c.status === 'ACTION_IN_PROGRESS'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {c.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <p className="text-slate-700 text-xs">{c.structured.description}</p>

                  {c.verifiedResponse && (
                    <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg space-y-1">
                      <div className="flex items-center space-x-1 text-emerald-800 font-bold text-[11px]">
                        <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Verified Response from {c.verifiedResponse.authorityName} ({c.verifiedResponse.department})</span>
                      </div>
                      <p className="text-emerald-950 text-[11px]">
                        "{c.verifiedResponse.responseText}"
                      </p>
                    </div>
                  )}

                  <div className="text-[10px] text-slate-400">
                    Filed at {new Date(c.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
