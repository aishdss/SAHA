import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  ArrowRight,
  Clock,
  IndianRupee,
  Leaf,
  Footprints,
  Bus,
  Train,
  Car,
  ChevronRight,
  Search,
  Sparkles
} from 'lucide-react';
import { JourneyPlanOption, JourneyStep } from '../types';

interface MultiModalJourneyPlannerProps {
  language: 'en' | 'kn';
  isOffline: boolean;
}

export const MultiModalJourneyPlanner: React.FC<MultiModalJourneyPlannerProps> = ({
  language,
  isOffline
}) => {
  const [source, setSource] = useState('Central Silk Board');
  const [destination, setDestination] = useState('ITPL Whitefield');
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('opt-1');
  const [journeyOptions, setJourneyOptions] = useState<JourneyPlanOption[] | null>(null);

  const popularHubs = [
    'Central Silk Board',
    'Kempegowda Majestic (KBS)',
    'ITPL Whitefield',
    'KIA Airport Terminal',
    'Indiranagar Metro',
    'Electronic City Phase 1',
    'Yesvantpur Railway Station',
    'Banashankari TTMC'
  ];

  const handlePlanJourney = async () => {
    setIsCalculating(true);
    try {
      const response = await fetch('/api/journey/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: source, to: destination })
      });
      if (response.ok) {
        const data = await response.json();
        setJourneyOptions(data.options);
        if (data.options?.length > 0) {
          setSelectedPlanId(data.options[0].id);
        }
      }
    } catch (e) {
      console.error('Journey calculation failed:', e);
    } finally {
      setIsCalculating(false);
    }
  };

  // Initial calculation on mount if not calculated
  React.useEffect(() => {
    handlePlanJourney();
  }, []);

  const getStepIcon = (mode: JourneyStep['mode']) => {
    switch (mode) {
      case 'WALK':
        return <Footprints className="w-4 h-4 text-emerald-600" />;
      case 'BUS':
        return <Bus className="w-4 h-4 text-blue-600" />;
      case 'METRO':
        return <Train className="w-4 h-4 text-purple-600" />;
      case 'AUTO':
        return <Car className="w-4 h-4 text-amber-600" />;
      case 'CAB':
        return <Car className="w-4 h-4 text-indigo-600" />;
    }
  };

  const selectedPlan = journeyOptions?.find((o) => o.id === selectedPlanId) || journeyOptions?.[0];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-5 sm:p-6">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 bg-blue-500/30 rounded-lg">
            <Compass className="w-5 h-5 text-sky-300" />
          </span>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight">
            {language === 'kn' ? 'ಬಹು-ಮಾದರಿ ಪ್ರಯಾಣ ಯೋಜನೆ' : 'Unified Multi-Modal Journey Planner'}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-blue-200 mt-1">
          {language === 'kn'
            ? 'ಮೆಟ್ರೋ + ಬಿಎಂಟಿಸಿ ಬಸ್ + ಆಟೋ/ನಡಿಗೆ ಸಂಯೋಜನೆಯಲ್ಲಿ ಅತ್ಯುತ್ತಮ ಮಾರ್ಗ ಮತ್ತು ದರ ಲೆಕ್ಕಾಚಾರ'
            : 'Combined best route across Metro + BMTC Bus + Auto/Walk with verified timings & fares'}
        </p>

        {/* Source & Destination Search Inputs */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <span className="text-[11px] font-semibold text-blue-200 block mb-1">
              {language === 'kn' ? 'ಪ್ರಾರಂಭದ ಸ್ಥಳ (Source)' : 'Origin / Source'}
            </span>
            <div className="flex items-center bg-white text-slate-900 rounded-xl px-3 py-2 border border-blue-300 shadow-sm">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0 mr-2" />
              <input
                id="journey-source-input"
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Enter starting hub or stop..."
                className="w-full text-xs sm:text-sm bg-transparent focus:outline-none"
              />
            </div>
          </div>

          <div className="relative">
            <span className="text-[11px] font-semibold text-blue-200 block mb-1">
              {language === 'kn' ? 'ಗಮ್ಯಸ್ಥಾನ (Destination)' : 'Destination'}
            </span>
            <div className="flex items-center bg-white text-slate-900 rounded-xl px-3 py-2 border border-blue-300 shadow-sm">
              <MapPin className="w-4 h-4 text-red-500 shrink-0 mr-2" />
              <input
                id="journey-destination-input"
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Enter destination hub or stop..."
                className="w-full text-xs sm:text-sm bg-transparent focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Popular Shortcut Chips */}
        <div className="mt-3 flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-blue-300 text-[11px] font-medium shrink-0">Popular:</span>
          {popularHubs.slice(0, 5).map((hub, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (source === hub) {
                  setDestination('Kempegowda Majestic (KBS)');
                } else {
                  setDestination(hub);
                }
              }}
              className="shrink-0 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-blue-100 rounded-full text-[11px] border border-white/15 transition"
            >
              {hub}
            </button>
          ))}
          <button
            onClick={handlePlanJourney}
            disabled={isCalculating}
            className="shrink-0 ml-auto px-4 py-1.5 bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-xs rounded-lg transition flex items-center space-x-1 shadow-sm"
          >
            {isCalculating ? (
              <span>Planning...</span>
            ) : (
              <>
                <span>Calculate Routes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Route Options Comparison Bar */}
      {journeyOptions && journeyOptions.length > 0 && (
        <div className="p-5 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {journeyOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSelectedPlanId(opt.id)}
                className={`p-3.5 rounded-xl border text-left transition-all relative ${
                  selectedPlanId === opt.id
                    ? 'border-blue-600 bg-blue-50/70 shadow-sm ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      opt.tag === 'FASTEST'
                        ? 'bg-blue-600 text-white'
                        : opt.tag === 'CHEAPEST'
                        ? 'bg-emerald-600 text-white'
                        : opt.tag === 'MIN_TRANSFERS'
                        ? 'bg-amber-600 text-white'
                        : 'bg-indigo-600 text-white'
                    }`}
                  >
                    {opt.tag.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-extrabold text-slate-900">
                    ₹{opt.totalCost}
                  </span>
                </div>

                <div className="text-sm font-bold text-slate-800 line-clamp-1">{opt.title}</div>

                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center space-x-1 font-semibold text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{opt.totalDurationMinutes} mins</span>
                  </span>
                  <span className="flex items-center space-x-1 text-emerald-600 font-medium">
                    <Leaf className="w-3.5 h-3.5" />
                    <span>-{opt.carbonSavingsKg}kg CO₂</span>
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Selected Route Step-by-Step Breakdown */}
          {selectedPlan && (
            <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {selectedPlan.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Total Estimated Duration: <strong>{selectedPlan.totalDurationMinutes} minutes</strong> • Total Fare: <strong>₹{selectedPlan.totalCost}</strong>
                  </p>
                </div>

                <div className="flex items-center space-x-2 text-xs bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-200">
                  <Leaf className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Saves <strong>{selectedPlan.carbonSavingsKg} kg</strong> carbon emission vs solo private car</span>
                </div>
              </div>

              {/* Journey Steps Visual Timeline */}
              <div className="space-y-4 relative before:absolute before:left-[19px] before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                {selectedPlan.steps.map((step, sIdx) => (
                  <div key={sIdx} className="flex items-start space-x-4 relative">
                    <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center shadow-sm shrink-0 z-10">
                      {getStepIcon(step.mode)}
                    </div>

                    <div className="flex-1 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm text-xs space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <span className="font-bold text-slate-900 text-sm">
                          {language === 'kn' && step.kannadaInstruction ? step.kannadaInstruction : step.instruction}
                        </span>
                        <div className="flex items-center space-x-2 text-slate-500">
                          {step.fare > 0 && (
                            <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              ₹{step.fare}
                            </span>
                          )}
                          <span className="font-medium text-slate-600">{step.durationMinutes} mins ({step.distanceKm} km)</span>
                        </div>
                      </div>

                      <p className="text-slate-600 text-xs">{step.detail}</p>

                      {step.routeCode && (
                        <div className="inline-flex items-center space-x-2 mt-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[11px] font-semibold">
                          <span>Route: {step.routeCode}</span>
                          {step.stopsCount && <span>• {step.stopsCount} intermediate stops</span>}
                        </div>
                      )}

                      {step.platform && (
                        <div className="inline-flex items-center space-x-2 mt-1 px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-[11px] font-semibold">
                          <span>{step.platform}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
