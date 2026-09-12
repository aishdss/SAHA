import React from 'react';
import { WifiOff, Database, RefreshCw } from 'lucide-react';

interface OfflineBannerProps {
  isOffline: boolean;
  onReconnect: () => void;
  language: 'en' | 'kn';
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ isOffline, onReconnect, language }) => {
  if (!isOffline) return null;

  return (
    <div className="bg-amber-500 text-amber-950 px-4 py-2.5 shadow-md border-b border-amber-600 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm">
        <div className="flex items-center space-x-2">
          <WifiOff className="w-4 h-4 text-amber-900 shrink-0 animate-bounce" />
          <span className="font-semibold">
            {language === 'kn'
              ? 'ಆಫ್‌ಲೈನ್ ಮೋಡ್ ಸಕ್ರಿಯವಾಗಿದೆ: ಸಂಗ್ರಹಿತ ವೇಳಾಪಟ್ಟಿಗಳು, ಮಾರ್ಗಗಳು ಮತ್ತು ದರ ಕೋಷ್ಟಕಗಳನ್ನು ತೋರಿಸಲಾಗುತ್ತಿದೆ.'
              : 'Offline Mode Active: Serving pre-cached BMTC timetables, Metro stations, Auto tariffs, and Majestic platform maps.'}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center text-xs font-medium text-amber-900/90 bg-amber-400/60 px-2 py-0.5 rounded">
            <Database className="w-3.5 h-3.5 mr-1" />
            Local Cache Ready
          </span>
          <button
            onClick={onReconnect}
            className="inline-flex items-center space-x-1 px-2.5 py-1 bg-amber-900 text-white rounded font-medium text-xs hover:bg-amber-800 transition"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Switch to Live</span>
          </button>
        </div>
      </div>
    </div>
  );
};
