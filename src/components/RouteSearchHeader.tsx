/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  MapPin,
  ArrowRightLeft,
  Calendar,
  Users,
  Moon,
  Coins,
  Search,
  Bike,
  TrainFront,
  Bus,
  Train,
  Plane,
  Layers,
  Sparkles,
} from 'lucide-react';
import { CurrencyCode, LocationPoint, TransportMode } from '../types/travel';
import { KARNATAKA_CIRCUIT_PRESETS, KARNATAKA_LOCATIONS } from '../data/locations';
import { CURRENCIES } from '../data/currencies';

interface RouteSearchHeaderProps {
  origin: LocationPoint;
  destination: LocationPoint;
  onSelectOrigin: (loc: LocationPoint) => void;
  onSelectDestination: (loc: LocationPoint) => void;
  onSwapLocations: () => void;
  travelDate: string;
  onChangeDate: (date: string) => void;
  travelersCount: number;
  onChangeTravelers: (count: number) => void;
  stayNights: number;
  onChangeStayNights: (nights: number) => void;
  currency: CurrencyCode;
  onChangeCurrency: (curr: CurrencyCode) => void;
  selectedModeFilter: TransportMode | 'all';
  onChangeModeFilter: (mode: TransportMode | 'all') => void;
  onSelectPresetJourney: (journeyId: string) => void;
  distanceKm: number;
}

export const RouteSearchHeader: React.FC<RouteSearchHeaderProps> = ({
  origin,
  destination,
  onSelectOrigin,
  onSelectDestination,
  onSwapLocations,
  travelDate,
  onChangeDate,
  travelersCount,
  onChangeTravelers,
  stayNights,
  onChangeStayNights,
  currency,
  onChangeCurrency,
  selectedModeFilter,
  onChangeModeFilter,
  onSelectPresetJourney,
  distanceKm,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
      {/* Preset Circuits Showcase Row */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-slate-500 font-semibold shrink-0 uppercase tracking-wider text-[11px] flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          Featured Karnataka Circuits:
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          {KARNATAKA_CIRCUIT_PRESETS.map((pj) => {
            const isActive = pj.originId === origin.id && pj.destinationId === destination.id;
            return (
              <button
                key={pj.id}
                onClick={() => onSelectPresetJourney(pj.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
                title={pj.tagline}
              >
                {pj.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Search Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Origin Dropdown */}
        <div className="md:col-span-4 relative">
          <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">
            Origin / Departure in Karnataka
          </label>
          <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <select
              value={origin.id}
              onChange={(e) => {
                const found = KARNATAKA_LOCATIONS.find((l) => l.id === e.target.value);
                if (found) onSelectOrigin(found);
              }}
              className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-hidden cursor-pointer"
            >
              {KARNATAKA_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id} disabled={loc.id === destination.id}>
                  {loc.name} ({loc.district})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="md:col-span-1 flex justify-center pt-5">
          <button
            onClick={onSwapLocations}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-colors shadow-xs"
            title="Swap Origin and Destination"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Destination Dropdown */}
        <div className="md:col-span-4 relative">
          <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">
            Destination in Karnataka
          </label>
          <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
            <select
              value={destination.id}
              onChange={(e) => {
                const found = KARNATAKA_LOCATIONS.find((l) => l.id === e.target.value);
                if (found) onSelectDestination(found);
              }}
              className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-hidden cursor-pointer"
            >
              {KARNATAKA_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id} disabled={loc.id === origin.id}>
                  {loc.name} ({loc.district})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Calculated Distance Callout */}
        <div className="md:col-span-3 bg-slate-100/80 p-3 rounded-xl border border-slate-200/80 text-center">
          <div className="text-[11px] text-slate-500 font-medium">Karnataka Route Distance</div>
          <div className="text-lg font-bold font-mono text-slate-900 tabular-nums">
            {distanceKm} km
          </div>
          <div className="text-[10px] text-slate-500">
            {distanceKm <= 25
              ? 'Urban Transit Zone'
              : distanceKm <= 220
              ? 'Expressway / Regional Corridor'
              : 'Intercity State Highway / Rail'}
          </div>
        </div>
      </div>

      {/* Secondary Controls: Date, Travelers, Nights, Currency, Mode Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 pt-2 border-t border-slate-100">
        {/* Date */}
        <div>
          <label className="block text-[11px] text-slate-500 mb-1 flex items-center gap-1 font-medium">
            <Calendar className="w-3 h-3 text-slate-400" /> Travel Date
          </label>
          <input
            type="date"
            value={travelDate}
            onChange={(e) => onChangeDate(e.target.value)}
            className="w-full p-2 text-xs font-medium border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-indigo-500"
          />
        </div>

        {/* Travelers */}
        <div>
          <label className="block text-[11px] text-slate-500 mb-1 flex items-center gap-1 font-medium">
            <Users className="w-3 h-3 text-slate-400" /> Travellers
          </label>
          <select
            value={travelersCount}
            onChange={(e) => onChangeTravelers(Number(e.target.value))}
            className="w-full p-2 text-xs font-medium border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-indigo-500"
          >
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'Traveller' : 'Travellers'}
              </option>
            ))}
          </select>
        </div>

        {/* Stay Nights */}
        <div>
          <label className="block text-[11px] text-slate-500 mb-1 flex items-center gap-1 font-medium">
            <Moon className="w-3 h-3 text-slate-400" /> Nights Stay
          </label>
          <select
            value={stayNights}
            onChange={(e) => onChangeStayNights(Number(e.target.value))}
            className="w-full p-2 text-xs font-medium border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-indigo-500"
          >
            {[1, 2, 3, 4, 5, 7, 10].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'Night' : 'Nights'}
              </option>
            ))}
          </select>
        </div>

        {/* Currency Switcher */}
        <div>
          <label className="block text-[11px] text-slate-500 mb-1 flex items-center gap-1 font-medium">
            <Coins className="w-3 h-3 text-slate-400" /> Currency
          </label>
          <select
            value={currency}
            onChange={(e) => onChangeCurrency(e.target.value as CurrencyCode)}
            className="w-full p-2 text-xs font-medium border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-indigo-500"
          >
            {Object.keys(CURRENCIES).map((c) => (
              <option key={c} value={c}>
                {c} ({CURRENCIES[c as CurrencyCode].symbol})
              </option>
            ))}
          </select>
        </div>

        {/* Mode Filter Pills */}
        <div className="col-span-2 sm:col-span-4 lg:col-span-1">
          <label className="block text-[11px] text-slate-500 mb-1 flex items-center gap-1 font-medium">
            <Layers className="w-3 h-3 text-slate-400" /> Mode Filter
          </label>
          <select
            value={selectedModeFilter}
            onChange={(e) => onChangeModeFilter(e.target.value as TransportMode | 'all')}
            className="w-full p-2 text-xs font-medium border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-indigo-500 capitalize"
          >
            <option value="all">All Modes Available</option>
            <option value="metro">Namma Metro</option>
            <option value="train">Vande Bharat / Rail</option>
            <option value="bus">KSRTC Bus / BMTC</option>
            <option value="bike">Yulu E-Bike / Rental</option>
            <option value="flight">Regional Flight</option>
          </select>
        </div>
      </div>
    </div>
  );
};
