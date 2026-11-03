/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Bike,
  TrainFront,
  Bus,
  Train,
  Plane,
  Sparkles,
  Leaf,
  Clock,
  Compass,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Zap,
  Navigation,
  Check,
} from 'lucide-react';
import { CurrencyCode, TransportMode, TravelOption } from '../types/travel';
import { formatInrPrice } from '../data/currencies';

interface TravelOptionCardProps {
  option: TravelOption;
  isSelected: boolean;
  currency: CurrencyCode;
  onSelect: () => void;
  onStartNavigation: () => void;
}

export const TravelOptionCard: React.FC<TravelOptionCardProps> = ({
  option,
  isSelected,
  currency,
  onSelect,
  onStartNavigation,
}) => {
  const [expanded, setExpanded] = useState(false);

  const getModeIcon = (mode: TransportMode) => {
    switch (mode) {
      case 'bike':
        return <Bike className="w-5 h-5 text-emerald-600" />;
      case 'metro':
        return <TrainFront className="w-5 h-5 text-indigo-600" />;
      case 'bus':
        return <Bus className="w-5 h-5 text-amber-600" />;
      case 'train':
        return <Train className="w-5 h-5 text-purple-600" />;
      case 'flight':
        return <Plane className="w-5 h-5 text-sky-600" />;
      default:
        return <Zap className="w-5 h-5 text-blue-600" />;
    }
  };

  const formatDuration = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const m = mins % 60;
    if (hours === 0) return `${m}m`;
    if (m === 0) return `${hours}h`;
    return `${hours}h ${m}m`;
  };

  const getCategoryBadge = () => {
    switch (option.category) {
      case 'cheapest':
        return (
          <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Budget Champion
          </span>
        );
      case 'fastest':
        return (
          <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded-md flex items-center gap-1">
            <Zap className="w-3 h-3" /> Fastest Option
          </span>
        );
      case 'eco':
        return (
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md flex items-center gap-1">
            <Leaf className="w-3 h-3" /> Zero / Low CO₂
          </span>
        );
      case 'comfort':
        return (
          <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 border border-purple-200/80 px-2 py-0.5 rounded-md flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Comfort Choice
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 bg-white ${
        isSelected
          ? 'border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
          : 'border-slate-200 hover:border-slate-300 shadow-xs'
      }`}
    >
      <div className="p-5 space-y-4">
        {/* Header: Mode Icon, Title, and Category Tag */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
              {getModeIcon(option.mode)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900 text-base">{option.title}</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                <span>{option.operator}</span>
                <span aria-hidden="true">·</span>
                <span>{option.frequencyText}</span>
              </p>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-end gap-1">
            <div className="text-xl font-bold font-mono text-slate-950 tabular-nums">
              {formatInrPrice(option.costInr, currency)}
            </div>
            {getCategoryBadge()}
          </div>
        </div>

        {/* Primary Metrics Strip (Time, Distance, Comfort, CO2) */}
        <div className="grid grid-cols-4 gap-2 pt-1 border-t border-slate-100 text-xs">
          <div className="space-y-0.5">
            <div className="text-slate-500 text-[11px]">Duration</div>
            <div className="font-semibold font-mono text-slate-900 tabular-nums flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {formatDuration(option.durationMinutes)}
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="text-slate-500 text-[11px]">Distance</div>
            <div className="font-semibold font-mono text-slate-900 tabular-nums">
              {option.distanceKm} km
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="text-slate-500 text-[11px]">Comfort</div>
            <div className="font-semibold font-mono text-slate-900 tabular-nums flex items-center gap-1">
              <span>{option.comfortScore}</span>
              <span className="text-slate-400 font-normal">/10</span>
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="text-slate-500 text-[11px]">Carbon</div>
            <div className="font-semibold font-mono text-slate-900 tabular-nums flex items-center gap-1">
              <Leaf className="w-3 h-3 text-emerald-600" />
              {option.co2Kg} kg
            </div>
          </div>
        </div>

        {/* Highlights Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {option.highlights.map((h, i) => (
            <span
              key={i}
              className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-medium"
            >
              {h}
            </span>
          ))}
        </div>

        {/* Expanded Itinerary Legs */}
        {expanded && (
          <div className="pt-3 border-t border-slate-100 space-y-3">
            <div className="text-xs font-semibold text-slate-800 uppercase tracking-wide">
              Step-by-Step Transit Legs
            </div>
            <div className="space-y-2">
              {option.legs.map((leg, idx) => (
                <div
                  key={leg.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between font-semibold text-slate-800">
                    <span className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-md bg-white border border-slate-200 flex items-center justify-center text-[10px] font-mono">
                        {idx + 1}
                      </span>
                      {leg.title}
                    </span>
                    <span className="font-mono text-slate-600 tabular-nums">
                      {leg.durationMinutes} min ({leg.distanceKm.toFixed(1)} km)
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 text-[11px] pl-6">
                    <span>
                      {leg.fromName} <ArrowRight className="w-3 h-3 inline mx-1 text-slate-400" />{' '}
                      {leg.toName}
                    </span>
                    <span className="font-mono font-medium text-slate-700">
                      {leg.costInr > 0 ? formatInrPrice(leg.costInr, currency) : 'Included'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Local Transit Tip */}
        {option.localTip && (
          <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-1.5">
            <span className="font-bold shrink-0">💡 Karnataka Local Tip:</span>
            <span>{option.localTip}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 py-1"
          >
            {expanded ? (
              <>
                Hide Details <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                View {option.legs.length} Legs <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onSelect}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
            >
              {isSelected ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Selected Route
                </>
              ) : (
                'Select Route'
              )}
            </button>

            <button
              onClick={onStartNavigation}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm shadow-indigo-600/20"
            >
              <Navigation className="w-3.5 h-3.5 fill-current" /> Live Navigation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
