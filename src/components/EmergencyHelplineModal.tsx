import React from 'react';
import {
  PhoneCall,
  ShieldAlert,
  Bus,
  Train,
  Car,
  Plane,
  CreditCard,
  HeartHandshake,
  ExternalLink
} from 'lucide-react';

interface EmergencyHelplineModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'kn';
}

export const EmergencyHelplineModal: React.FC<EmergencyHelplineModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  if (!isOpen) return null;

  const helplines = [
    {
      agency: 'Namma 112 Unified Police & Emergency',
      number: '112',
      timing: '24x7 Round-the-Clock',
      desc: 'Immediate PCR patrol dispatch for safety emergencies, accidents, or harassment.',
      icon: <ShieldAlert className="w-5 h-5 text-red-600" />,
      color: 'bg-red-50 border-red-200 text-red-900'
    },
    {
      agency: 'Bengaluru Traffic Police (Auto Grievance WhatsApp)',
      number: '+91 94808 01000',
      timing: '24x7 WhatsApp Service',
      desc: 'Send vehicle registration number and photo for meter refusal or overcharging challan.',
      icon: <Car className="w-5 h-5 text-amber-600" />,
      color: 'bg-amber-50 border-amber-200 text-amber-900'
    },
    {
      agency: 'BMTC Sarathi Control Room',
      number: '080-22483777',
      timing: '06:00 AM - 10:00 PM',
      desc: 'Bus crew conduct, missing item retrieval, bus breakdown, and route tracking.',
      icon: <Bus className="w-5 h-5 text-blue-600" />,
      color: 'bg-blue-50 border-blue-200 text-blue-900'
    },
    {
      agency: 'BMRCL Namma Metro Customer Care',
      number: '1800-425-12345',
      timing: '05:00 AM - 11:30 PM',
      desc: 'Toll-free helpline for AFC gate errors, smart card recharge, and station assistance.',
      icon: <Train className="w-5 h-5 text-purple-600" />,
      color: 'bg-purple-50 border-purple-200 text-purple-900'
    },
    {
      agency: 'Karnataka Women Helpline (Parihar)',
      number: '1091',
      timing: '24x7 Dedicated Women Safety',
      desc: 'Women safety assistance in public transit, night travel, or deserted bus stops.',
      icon: <HeartHandshake className="w-5 h-5 text-pink-600" />,
      color: 'bg-pink-50 border-pink-200 text-pink-900'
    },
    {
      agency: 'BIAL Kempegowda Airport Helpdesk',
      number: '080-22012401',
      timing: '24x7 Operations',
      desc: 'Terminal queries, inter-terminal electric shuttle status, and lost baggage.',
      icon: <Plane className="w-5 h-5 text-sky-600" />,
      color: 'bg-sky-50 border-sky-200 text-sky-900'
    },
    {
      agency: 'Indian Railways RailMadad',
      number: '139',
      timing: '24x7 Multi-lingual',
      desc: 'SBC/YPR/SMVB platform issues, train delays, and coach security.',
      icon: <Train className="w-5 h-5 text-slate-700" />,
      color: 'bg-slate-50 border-slate-200 text-slate-900'
    },
    {
      agency: 'NHAI FASTag National Highway Emergency',
      number: '1033',
      timing: '24x7 Toll Support',
      desc: 'Toll plaza disputes, incorrect deduction, and expressway breakdown towing.',
      icon: <CreditCard className="w-5 h-5 text-indigo-600" />,
      color: 'bg-indigo-50 border-indigo-200 text-indigo-900'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-xs space-y-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-red-950 text-white p-4 flex items-center justify-between shrink-0 border-b border-red-900">
          <div className="flex items-center space-x-2">
            <PhoneCall className="w-5 h-5 text-red-400" />
            <h3 className="font-bold text-sm">Official Government Transport & Emergency Helplines</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold text-base">
            ✕
          </button>
        </div>

        <div className="p-5 space-y-3 overflow-y-auto flex-1">
          <p className="text-slate-500 text-xs">
            Direct verified hotlines to Bangalore City Police, BMTC, BMRCL, and RTO authorities. Tap to dial directly.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {helplines.map((item, idx) => (
              <div key={idx} className={`p-4 rounded-xl border ${item.color} space-y-2 flex flex-col justify-between`}>
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {item.icon}
                      <span className="font-bold text-xs">{item.agency}</span>
                    </div>
                  </div>
                  <p className="text-[11px] opacity-80 mt-1">{item.desc}</p>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-black/10">
                  <span className="text-[10px] opacity-70">{item.timing}</span>
                  <a
                    href={`tel:${item.number.replace(/[^0-9+]/g, '')}`}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-white text-slate-900 font-extrabold rounded-lg shadow-sm border border-black/10 hover:bg-slate-50 text-xs"
                  >
                    <span>{item.number}</span>
                  </a>
                </div>
              </div>
            ))}
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
