/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Hotel,
  Utensils,
  Coffee,
  Bike,
  Star,
  MapPin,
  Check,
  Plus,
  ShieldAlert,
  Sparkles,
  DollarSign,
  Compass,
} from 'lucide-react';
import { CurrencyCode, Facility, FacilityType } from '../types/travel';
import { formatInrPrice } from '../data/currencies';

interface FacilitiesSectionProps {
  facilities: Facility[];
  currency: CurrencyCode;
  selectedHotelIds: string[];
  selectedDiningIds: string[];
  onToggleFacility: (facility: Facility) => void;
  destinationCity: string;
}

export const FacilitiesSection: React.FC<FacilitiesSectionProps> = ({
  facilities,
  currency,
  selectedHotelIds,
  selectedDiningIds,
  onToggleFacility,
  destinationCity,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'stay' | 'dining' | 'mobility'>('all');
  const [onlyBudget, setOnlyBudget] = useState(false);

  const filteredFacilities = facilities.filter((fac) => {
    if (onlyBudget && !fac.budgetFriendly) return false;

    if (activeTab === 'stay') {
      return fac.type === 'hotel' || fac.type === 'hostel';
    }
    if (activeTab === 'dining') {
      return fac.type === 'restaurant' || fac.type === 'cafe';
    }
    if (activeTab === 'mobility') {
      return fac.type === 'bike_dock' || fac.type === 'metro_station';
    }
    return true;
  });

  const isFacilitySelected = (fac: Facility) => {
    return selectedHotelIds.includes(fac.id) || selectedDiningIds.includes(fac.id);
  };

  const getFacilityIcon = (type: FacilityType) => {
    switch (type) {
      case 'hotel':
      case 'hostel':
        return <Hotel className="w-4 h-4 text-purple-600" />;
      case 'restaurant':
        return <Utensils className="w-4 h-4 text-orange-600" />;
      case 'cafe':
        return <Coffee className="w-4 h-4 text-amber-600" />;
      case 'bike_dock':
        return <Bike className="w-4 h-4 text-emerald-600" />;
      default:
        return <Compass className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Title and Budget Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Accommodations, Dining & Local Facilities in {destinationCity}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Hand-picked affordable stays, wholesome dining, and bike hubs mapped to your destination.
          </p>
        </div>

        {/* Filter Controls (Segmented Tabs + Budget Only) */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/70">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('stay')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'stay'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Stays & Hostels
            </button>
            <button
              onClick={() => setActiveTab('dining')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'dining'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dining & Cafes
            </button>
            <button
              onClick={() => setActiveTab('mobility')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'mobility'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mobility
            </button>
          </div>

          <button
            onClick={() => setOnlyBudget(!onlyBudget)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors flex items-center gap-1 ${
              onlyBudget
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Budget Friendly Only
          </button>
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFacilities.map((fac) => {
          const selected = isFacilitySelected(fac);

          return (
            <div
              key={fac.id}
              className={`rounded-2xl border transition-all duration-200 bg-white overflow-hidden flex flex-col justify-between ${
                selected
                  ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                  : 'border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div>
                {/* Image Banner with Scrim and Price */}
                <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                  <img
                    src={fac.image}
                    alt={fac.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  {/* Top Badge: Type & Tier */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-xs text-[11px] font-semibold text-slate-900 shadow-xs flex items-center gap-1">
                      {getFacilityIcon(fac.type)}
                      <span>{fac.category}</span>
                    </span>
                    {fac.budgetFriendly && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-[10px] font-bold text-white shadow-xs">
                        BUDGET SAVER
                      </span>
                    )}
                  </div>

                  {/* Bottom Image Info: Price & Rating */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between text-white">
                    <div>
                      <div className="text-lg font-bold font-mono tabular-nums leading-tight">
                        {formatInrPrice(fac.priceInr, currency)}
                        <span className="text-xs font-normal text-slate-200">
                          {fac.type === 'hotel' || fac.type === 'hostel' ? ' / night' : ' avg'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-md text-xs font-semibold backdrop-blur-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{fac.rating.toFixed(1)}</span>
                      <span className="text-slate-300 font-normal">({fac.reviewsCount})</span>
                    </div>
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-4 space-y-2.5">
                  <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1">
                    {fac.name}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {fac.description}
                  </p>

                  {/* Karnataka specialty tip */}
                  {fac.karnatakaSpecialty && (
                    <div className="text-[11px] text-amber-900 bg-amber-50/80 p-2 rounded-lg border border-amber-200/70">
                      <span className="font-semibold">Specialty: </span>
                      {fac.karnatakaSpecialty}
                    </div>
                  )}

                  <div className="text-[11px] text-slate-500 flex items-center gap-1 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{fac.address}</span>
                    <span aria-hidden="true">·</span>
                    <span className="shrink-0 font-medium text-slate-700">
                      {fac.distanceKmFromDest} km away
                    </span>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {fac.amenities.slice(0, 3).map((amenity, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-4 pt-0">
                <button
                  onClick={() => onToggleFacility(fac)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                    selected
                      ? 'bg-slate-900 text-white'
                      : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
                  }`}
                >
                  {selected ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" /> Added to Itinerary
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" /> Add to Trip Plan
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
