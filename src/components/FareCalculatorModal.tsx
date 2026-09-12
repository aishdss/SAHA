import React, { useState } from 'react';
import {
  Calculator,
  Bus,
  Train,
  Car,
  Plane,
  Moon,
  Info,
  CreditCard,
  Check
} from 'lucide-react';
import { TransportMode } from '../types';

interface FareCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'kn';
}

export const FareCalculatorModal: React.FC<FareCalculatorModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  const [calculatorMode, setCalculatorMode] = useState<TransportMode>('AUTOS');

  // Auto inputs
  const [autoDistanceKm, setAutoDistanceKm] = useState<number>(5.5);
  const [isNightSurcharge, setIsNightSurcharge] = useState<boolean>(false);

  // BMTC inputs
  const [busType, setBusType] = useState<'ORDINARY' | 'VAJRA_AC' | 'VAYU_VAJRA'>('ORDINARY');
  const [busStages, setBusStages] = useState<number>(4);

  // Metro inputs
  const [metroStationsCount, setMetroStationsCount] = useState<number>(8);
  const [hasSmartCardOrQr, setHasSmartCardOrQr] = useState<boolean>(true);

  // Calculate Auto Fare
  const calculateAutoFare = () => {
    const minFare = 30; // first 2 km
    const perKm = 15;
    let total = minFare;
    if (autoDistanceKm > 2.0) {
      total += (autoDistanceKm - 2.0) * perKm;
    }
    if (isNightSurcharge) {
      total = total * 1.5;
    }
    return Math.round(total);
  };

  // Calculate BMTC Fare
  const calculateBmtcFare = () => {
    if (busType === 'VAYU_VAJRA') return 250;
    if (busType === 'VAJRA_AC') {
      return Math.min(50, 15 + (busStages - 1) * 3);
    }
    // Ordinary
    return Math.min(30, 5 + (busStages - 1) * 2);
  };

  // Calculate Metro Fare
  const calculateMetroFare = () => {
    let base = 10;
    if (metroStationsCount > 2) base = 15;
    if (metroStationsCount > 5) base = 25;
    if (metroStationsCount > 10) base = 40;
    if (metroStationsCount > 15) base = 50;
    if (metroStationsCount > 20) base = 60;

    if (hasSmartCardOrQr) {
      return Math.round(base * 0.95);
    }
    return base;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-xs space-y-4">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm">Official Bangalore Transit Fare Calculator</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold text-base">
            ✕
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Mode Switcher */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setCalculatorMode('AUTOS')}
              className={`p-2.5 rounded-xl border text-center font-bold transition flex flex-col items-center space-y-1 ${
                calculatorMode === 'AUTOS'
                  ? 'border-amber-500 bg-amber-50 text-amber-900'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Car className="w-4 h-4 text-amber-600" />
              <span>Auto Meter</span>
            </button>

            <button
              onClick={() => setCalculatorMode('BMTC')}
              className={`p-2.5 rounded-xl border text-center font-bold transition flex flex-col items-center space-y-1 ${
                calculatorMode === 'BMTC'
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Bus className="w-4 h-4 text-blue-600" />
              <span>BMTC Bus</span>
            </button>

            <button
              onClick={() => setCalculatorMode('BMRCL')}
              className={`p-2.5 rounded-xl border text-center font-bold transition flex flex-col items-center space-y-1 ${
                calculatorMode === 'BMRCL'
                  ? 'border-purple-500 bg-purple-50 text-purple-900'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Train className="w-4 h-4 text-purple-600" />
              <span>Namma Metro</span>
            </button>
          </div>

          {/* AUTO CALCULATOR */}
          {calculatorMode === 'AUTOS' && (
            <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Trip Distance (Kilometers):</span>
                  <span className="text-amber-700 text-sm">{autoDistanceKm} km</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="35"
                  step="0.5"
                  value={autoDistanceKm}
                  onChange={(e) => setAutoDistanceKm(parseFloat(e.target.value))}
                  className="w-full accent-amber-600"
                />
                <span className="text-[11px] text-slate-400">First 2 km minimum ₹30; ₹15/km thereafter</span>
              </div>

              <label className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200 cursor-pointer">
                <div className="flex items-center space-x-2">
                  <Moon className="w-4 h-4 text-indigo-500" />
                  <div>
                    <span className="font-bold text-slate-800 block">Night Surcharge (10 PM - 5 AM)</span>
                    <span className="text-[10px] text-slate-500">Adds 50% (1.5x of meter charge)</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isNightSurcharge}
                  onChange={(e) => setIsNightSurcharge(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
              </label>

              {/* Calculated Result Display */}
              <div className="bg-white p-4 rounded-xl border border-amber-200 text-center shadow-sm">
                <span className="text-xs text-slate-500 uppercase font-bold">Estimated Government Meter Fare</span>
                <div className="text-3xl font-black text-slate-900 mt-1">₹{calculateAutoFare()}</div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Legally enforceable under Karnataka Motor Vehicles Rules.
                </p>
              </div>
            </div>
          )}

          {/* BMTC CALCULATOR */}
          {calculatorMode === 'BMTC' && (
            <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Bus Service Category:</label>
                <select
                  value={busType}
                  onChange={(e) => setBusType(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="ORDINARY">Ordinary / Suvarna Bus (Non-AC)</option>
                  <option value="VAJRA_AC">Vajra Volvo AC (Ring Road / IT Corridor)</option>
                  <option value="VAYU_VAJRA">Vayu Vajra KIA Airport Shuttle</option>
                </select>
              </div>

              {busType !== 'VAYU_VAJRA' && (
                <div>
                  <div className="flex justify-between font-bold text-slate-700 mb-1">
                    <span>Number of Fare Stages (Approx 2 km per stage):</span>
                    <span className="text-blue-700 text-sm">{busStages} stages</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    value={busStages}
                    onChange={(e) => setBusStages(parseInt(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>
              )}

              <div className="bg-white p-4 rounded-xl border border-blue-200 text-center shadow-sm">
                <span className="text-xs text-slate-500 uppercase font-bold">Estimated BMTC Ticket Fare</span>
                <div className="text-3xl font-black text-slate-900 mt-1">₹{calculateBmtcFare()}</div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Daily passes available: Ordinary ₹70, Vajra AC ₹140.
                </p>
              </div>
            </div>
          )}

          {/* BMRCL METRO CALCULATOR */}
          {calculatorMode === 'BMRCL' && (
            <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Number of Stations Travelled:</span>
                  <span className="text-purple-700 text-sm">{metroStationsCount} stations</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={metroStationsCount}
                  onChange={(e) => setMetroStationsCount(parseInt(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>

              <label className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200 cursor-pointer">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-emerald-500" />
                  <div>
                    <span className="font-bold text-slate-800 block">Smart Card / WhatsApp QR Ticket</span>
                    <span className="text-[10px] text-slate-500">Includes 5% flat digital discount</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={hasSmartCardOrQr}
                  onChange={(e) => setHasSmartCardOrQr(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
              </label>

              <div className="bg-white p-4 rounded-xl border border-purple-200 text-center shadow-sm">
                <span className="text-xs text-slate-500 uppercase font-bold">Calculated Metro Token / QR Fare</span>
                <div className="text-3xl font-black text-slate-900 mt-1">₹{calculateMetroFare()}</div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Valid for 120 minutes from time of entry at origin turnstile.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
