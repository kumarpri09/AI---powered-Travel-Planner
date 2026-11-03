/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Compass,
  Utensils,
  Hotel,
  Bus,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MapPin,
  Leaf,
  Navigation,
  Share2,
  Printer,
} from 'lucide-react';
import { CurrencyCode, PersonalizedItinerary } from '../types/travel';
import { formatInrPrice } from '../data/currencies';

interface PersonalizedItineraryViewProps {
  itinerary: PersonalizedItinerary;
  currency: CurrencyCode;
  onStartRouteNavigation: () => void;
  onExportPdfReport?: () => void;
}

export const PersonalizedItineraryView: React.FC<PersonalizedItineraryViewProps> = ({
  itinerary,
  currency,
  onStartRouteNavigation,
  onExportPdfReport,
}) => {
  const [expandedDay, setExpandedDay] = useState<number>(1);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs space-y-0">
      {/* Hero Banner with Scrim & Summary */}
      <div className="relative h-60 w-full overflow-hidden bg-slate-900">
        <img
          src={itinerary.heroImage}
          alt={itinerary.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white">
          <span className="px-3 py-1 rounded-full bg-indigo-600/90 backdrop-blur-md text-xs font-semibold tracking-wide flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Personalized Karnataka Itinerary
          </span>

          <div className="text-xs bg-black/60 backdrop-blur-md px-3 py-1 rounded-full font-mono">
            Est. Total: {formatInrPrice(itinerary.totalEstimatedInr, currency)}
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
            {itinerary.title}
          </h2>
          <p className="text-xs text-slate-200 max-w-2xl line-clamp-2">
            {itinerary.whyRecommended}
          </p>
        </div>
      </div>

      {/* Action Strip: Duration, Budget, Route Hop, Navigation Launch */}
      <div className="p-4 bg-slate-50 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 flex-wrap text-slate-600">
          <span className="flex items-center gap-1.5 font-medium">
            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
            {itinerary.dailyPlans.length} Days Experience
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            Eco Profile: ~{itinerary.carbonSummaryKg} kg CO₂
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <Bus className="w-3.5 h-3.5 text-amber-600" />
            Public Transit & Walking Prioritized
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onExportPdfReport && (
            <button
              onClick={onExportPdfReport}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Export PDF Report</span>
            </button>
          )}

          <button
            onClick={onStartRouteNavigation}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Navigation className="w-3.5 h-3.5 fill-current" />
            <span>Launch Real-Time Route Navigation</span>
          </button>
        </div>
      </div>

      {/* Day-by-Day Accordion Plan */}
      <div className="p-5 space-y-3">
        <div className="text-xs font-bold text-slate-800 uppercase tracking-wide">
          Step-by-Step Daily Schedule & Curated Experiences
        </div>

        <div className="space-y-3">
          {itinerary.dailyPlans.map((day) => {
            const isExpanded = expandedDay === day.dayNumber;

            return (
              <div
                key={day.dayNumber}
                className={`rounded-2xl border transition-all duration-200 ${
                  isExpanded
                    ? 'border-indigo-600/70 bg-white ring-1 ring-indigo-500/10 shadow-xs'
                    : 'border-slate-200/90 bg-slate-50/70 hover:bg-white'
                }`}
              >
                {/* Accordion Header */}
                <button
                  onClick={() => setExpandedDay(isExpanded ? 0 : day.dayNumber)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center font-bold text-indigo-600 font-mono text-sm shrink-0">
                      {day.dayNumber}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-indigo-600">{day.theme}</div>
                      <div className="text-sm font-bold text-slate-900 leading-snug">
                        {day.title}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-mono font-medium text-slate-600">
                      {formatInrPrice(day.dayBudgetInr, currency)}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Expanded Body */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-100 space-y-4 text-xs">
                    {/* Time of Day Timeline */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                        <div className="font-semibold text-amber-700 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> Morning
                        </div>
                        <p className="text-slate-600 leading-relaxed">{day.morning}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                        <div className="font-semibold text-sky-700 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> Afternoon
                        </div>
                        <p className="text-slate-600 leading-relaxed">{day.afternoon}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                        <div className="font-semibold text-purple-700 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> Evening & Sunset
                        </div>
                        <p className="text-slate-600 leading-relaxed">{day.evening}</p>
                      </div>
                    </div>

                    {/* Stay & Food & Transit Recommendation Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-1">
                        <div className="font-semibold text-indigo-900 flex items-center gap-1">
                          <Hotel className="w-3.5 h-3.5 text-indigo-600" /> Recommended Stay
                        </div>
                        <div className="font-medium text-slate-800">{day.recommendedStay}</div>
                      </div>

                      <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-100 space-y-1">
                        <div className="font-semibold text-amber-900 flex items-center gap-1">
                          <Utensils className="w-3.5 h-3.5 text-amber-600" /> Authentic Karnataka Dining
                        </div>
                        <div className="font-medium text-slate-800">{day.foodHighlight}</div>
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1">
                        <div className="font-semibold text-emerald-900 flex items-center gap-1">
                          <Bus className="w-3.5 h-3.5 text-emerald-600" /> Transit & Local Tip
                        </div>
                        <div className="font-medium text-slate-800">{day.transitTip}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
