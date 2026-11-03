/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Printer,
  Download,
  X,
  FileText,
  Calendar,
  Users,
  Moon,
  Clock,
  MapPin,
  Hotel,
  Utensils,
  TrainFront,
  Bike,
  Bus,
  Train,
  Plane,
  ShieldCheck,
  Leaf,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  Info,
  Check,
  Sun,
  Shirt,
  Thermometer,
} from 'lucide-react';
import {
  CurrencyCode,
  Facility,
  LocationPoint,
  PersonalizedItinerary,
  TravelOption,
} from '../types/travel';
import { formatInrPrice } from '../data/currencies';
import { DestinationWeather } from '../types/weather';

interface PrintableReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  origin: LocationPoint;
  destination: LocationPoint;
  travelDate: string;
  travelersCount: number;
  stayNights: number;
  currency: CurrencyCode;
  selectedOption: TravelOption | null;
  selectedFacilities: Facility[];
  personalizedItinerary: PersonalizedItinerary;
  weather?: DestinationWeather | null;
}

export const PrintableReportModal: React.FC<PrintableReportModalProps> = ({
  isOpen,
  onClose,
  origin,
  destination,
  travelDate,
  travelersCount,
  stayNights,
  currency,
  selectedOption,
  selectedFacilities,
  personalizedItinerary,
  weather,
}) => {
  const [includeTransit, setIncludeTransit] = useState(true);
  const [includeWeather, setIncludeWeather] = useState(true);
  const [includeHotels, setIncludeHotels] = useState(true);
  const [includeDining, setIncludeDining] = useState(true);
  const [includeDayByDay, setIncludeDayByDay] = useState(true);
  const [includeHelpline, setIncludeHelpline] = useState(true);
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const stays = selectedFacilities.filter((f) => f.type === 'hotel' || f.type === 'hostel');
  const dinings = selectedFacilities.filter((f) => f.type === 'restaurant' || f.type === 'cafe');

  const transitCostInr = selectedOption ? selectedOption.costInr * travelersCount : 0;
  const stayCostInr = stays.reduce((sum, f) => sum + f.priceInr * stayNights, 0);
  const diningCostInr = dinings.reduce((sum, f) => sum + f.priceInr * 2 * travelersCount, 0);
  const totalCostInr = transitCostInr + stayCostInr + diningCostInr;

  const reportId = `KA-TRIP-${travelDate.replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadOfflineHtml = () => {
    const reportHtml = document.getElementById('printable-report-content')?.innerHTML;
    if (!reportHtml) return;

    const fullDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>OmniVoyage Karnataka - Trip Report (${reportId})</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 40px; line-height: 1.5; }
    .report-card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
    .grid { display: flex; gap: 20px; }
    .col { flex: 1; }
    h1, h2, h3 { color: #0f172a; }
    .badge { background: #f1f5f9; padding: 3px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; font-size: 13px; }
    th { background: #f8fafc; }
    @media print {
      body { margin: 0; }
    }
  </style>
</head>
<body>
  ${reportHtml}
</body>
</html>`;

    const blob = new Blob([fullDoc], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Karnataka_Itinerary_${reportId}.html`;
    link.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs no-print-backdrop">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200">
        {/* Modal Controls Bar (Hidden in Print) */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 no-print">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <h2 className="text-base font-bold tracking-tight">Printable PDF Report & Itinerary Export</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Review formatting, toggle report sections, and export as vector-quality PDF or printable paper document.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleDownloadOfflineHtml}
              className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Download offline HTML document"
            >
              {downloaded ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" /> Downloaded
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" /> Save HTML Doc
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Section Inclusion Filter Pills (Hidden in Print) */}
        <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center gap-2 flex-wrap text-xs font-medium text-slate-700 no-print">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
            Include in PDF:
          </span>

          <label className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
            <input
              type="checkbox"
              checked={includeTransit}
              onChange={(e) => setIncludeTransit(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-0"
            />
            <span>Transit & Legs</span>
          </label>

          {weather && (
            <label className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={includeWeather}
                onChange={(e) => setIncludeWeather(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-0"
              />
              <span>Weather & Attire</span>
            </label>
          )}

          <label className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
            <input
              type="checkbox"
              checked={includeHotels}
              onChange={(e) => setIncludeHotels(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-0"
            />
            <span>Accommodations ({stays.length})</span>
          </label>

          <label className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
            <input
              type="checkbox"
              checked={includeDining}
              onChange={(e) => setIncludeDining(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-0"
            />
            <span>Karnataka Dining ({dinings.length})</span>
          </label>

          <label className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
            <input
              type="checkbox"
              checked={includeDayByDay}
              onChange={(e) => setIncludeDayByDay(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-0"
            />
            <span>Day-by-Day Schedule</span>
          </label>

          <label className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
            <input
              type="checkbox"
              checked={includeHelpline}
              onChange={(e) => setIncludeHelpline(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-0"
            />
            <span>Emergency Helplines</span>
          </label>
        </div>

        {/* Scrollable Report Preview Body (Target of Print) */}
        <div
          id="printable-report-container"
          className="p-6 sm:p-10 overflow-y-auto space-y-6 bg-white text-slate-900"
        >
          <div id="printable-report-content" className="space-y-6">
            {/* Report Header: Brand wordmark, reference ID, and date */}
            <div className="border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-600 text-white font-bold flex items-center justify-center text-sm">
                    KA
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
                      OmniVoyage Karnataka Travel Dossier
                    </h1>
                    <div className="text-xs text-slate-600 font-medium">
                      Official Multi-Modal Itinerary & Transit Report · One State, Many Worlds
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-left sm:text-right text-xs space-y-0.5">
                <div className="font-mono font-bold text-slate-900">REF: {reportId}</div>
                <div className="text-slate-500">Issued On: {currentDate}</div>
                <div className="text-emerald-700 font-semibold">Status: Confirmed Planner Plan</div>
              </div>
            </div>

            {/* Trip Executive Summary Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-[11px] text-slate-500 font-semibold uppercase">Journey Corridor</span>
                <div className="font-bold text-slate-900 text-sm mt-0.5">
                  {origin.city} → {destination.city}
                </div>
                <div className="text-slate-500 text-[11px]">
                  {origin.district} to {destination.district}
                </div>
              </div>

              <div>
                <span className="text-[11px] text-slate-500 font-semibold uppercase">Schedule & Party</span>
                <div className="font-bold text-slate-900 text-sm mt-0.5">
                  {travelDate}
                </div>
                <div className="text-slate-500 text-[11px]">
                  {travelersCount} Traveller{travelersCount > 1 ? 's' : ''} · {stayNights} Nights Stay
                </div>
              </div>

              <div>
                <span className="text-[11px] text-slate-500 font-semibold uppercase">Total Estimated Budget</span>
                <div className="font-bold font-mono text-slate-900 text-sm mt-0.5 tabular-nums">
                  {formatInrPrice(totalCostInr, currency)}
                </div>
                <div className="text-slate-500 text-[11px]">
                  Transit + Stays + Dining
                </div>
              </div>

              <div>
                <span className="text-[11px] text-slate-500 font-semibold uppercase">Eco Carbon Profile</span>
                <div className="font-bold font-mono text-emerald-700 text-sm mt-0.5 tabular-nums flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5" />
                  {selectedOption ? selectedOption.co2Kg : 0} kg CO₂
                </div>
                <div className="text-slate-500 text-[11px]">
                  Public transit optimized
                </div>
              </div>
            </div>

            {/* SECTION: DESTINATION WEATHER & ATTIRE ADVISORY */}
            {includeWeather && weather && (
              <div className="space-y-3 print-avoid-break">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <Sun className="w-4 h-4 text-amber-500" />
                    Destination Weather & Attire Advisory ({destination.city})
                  </h3>
                  <span className="text-xs font-mono font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {weather.currentTemp}°C · {weather.condition}
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <div className="text-[10px] uppercase font-bold text-slate-500">Current Temp</div>
                      <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">{weather.currentTemp}°C</div>
                      <div className="text-[10px] text-slate-500">Feels like {weather.feelsLike}°C</div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <div className="text-[10px] uppercase font-bold text-slate-500">Humidity / Rain</div>
                      <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">{weather.humidity}% / {weather.rainChance}%</div>
                      <div className="text-[10px] text-slate-500">Wind: {weather.windSpeedKmH} km/h</div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <div className="text-[10px] uppercase font-bold text-slate-500">UV Index</div>
                      <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">UV {weather.uvIndex}</div>
                      <div className="text-[10px] text-slate-500">{weather.uvIndex > 7 ? 'High Protection' : 'Moderate'}</div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <div className="text-[10px] uppercase font-bold text-slate-500">Best Outdoor Hours</div>
                      <div className="font-semibold text-slate-900 text-xs mt-0.5">{weather.attireAdvice.bestOutdoorHours}</div>
                    </div>
                  </div>

                  {/* Attire & Gear Packing Guide */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded-lg bg-white border border-slate-200">
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-1.5">
                        <Shirt className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Recommended Attire:</span>
                      </div>
                      <ul className="space-y-1 text-xs text-slate-600">
                        {weather.attireAdvice.recommendedClothing.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-slate-400 mt-0.5">·</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-lg bg-white border border-slate-200">
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Essential Gear & Accessories:</span>
                      </div>
                      <ul className="space-y-1 text-xs text-slate-600">
                        {weather.attireAdvice.essentialGear.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-slate-400 mt-0.5">·</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* 5-Day Outlook Strip */}
                  {weather.dailyForecast.length > 0 && (
                    <div className="pt-2 border-t border-slate-200">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                        5-Day Forecast Projection:
                      </div>
                      <div className="grid grid-cols-5 gap-2 text-center">
                        {weather.dailyForecast.map((day, idx) => (
                          <div key={idx} className="p-2 bg-white rounded border border-slate-200 text-xs">
                            <div className="font-bold text-slate-700">{day.dayName}</div>
                            <div className="text-[10px] text-slate-500">{day.date}</div>
                            <div className="font-mono font-bold text-slate-900 mt-1">
                              {day.tempMax}° / <span className="text-slate-500">{day.tempMin}°</span>
                            </div>
                            <div className="text-[10px] text-slate-600 truncate mt-0.5">{day.condition}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SECTION 1: PUBLIC TRANSIT & TRAVEL PLAN */}
            {includeTransit && (
              <div className="space-y-3 print-avoid-break">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <TrainFront className="w-4 h-4 text-indigo-600" />
                    1. Selected Public Transit & Route Plan
                  </h3>
                  {selectedOption && (
                    <span className="text-xs font-mono font-bold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      {formatInrPrice(transitCostInr, currency)} Total Fare
                    </span>
                  )}
                </div>

                {selectedOption ? (
                  <div className="p-4 rounded-xl border border-slate-200 space-y-3 bg-white">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="text-base font-bold text-slate-900">
                          {selectedOption.title}
                        </div>
                        <div className="text-xs text-slate-600 mt-0.5 flex items-center gap-2 flex-wrap">
                          <span>Operator: {selectedOption.operator}</span>
                          <span>·</span>
                          <span>Duration: {selectedOption.durationMinutes} mins</span>
                          <span>·</span>
                          <span>Distance: {selectedOption.distanceKm} km</span>
                          <span>·</span>
                          <span>Comfort Score: {selectedOption.comfortScore}/10</span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-600 sm:text-right font-medium">
                        {selectedOption.frequencyText}
                      </div>
                    </div>

                    {/* Transit Legs Detailed Table */}
                    <div className="space-y-1.5 pt-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Transit Leg Itinerary:
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                          <thead className="bg-slate-100 text-slate-700 font-semibold">
                            <tr>
                              <th className="py-2 px-3 border-b border-slate-200">Leg</th>
                              <th className="py-2 px-3 border-b border-slate-200">Service / Line</th>
                              <th className="py-2 px-3 border-b border-slate-200">Boarding</th>
                              <th className="py-2 px-3 border-b border-slate-200">Disembarking</th>
                              <th className="py-2 px-3 border-b border-slate-200">Time</th>
                              <th className="py-2 px-3 border-b border-slate-200">Fare</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {selectedOption.legs.map((leg, idx) => (
                              <tr key={leg.id} className="hover:bg-slate-50">
                                <td className="py-2 px-3 font-mono font-bold text-slate-800">{idx + 1}</td>
                                <td className="py-2 px-3 font-semibold text-slate-900">{leg.title}</td>
                                <td className="py-2 px-3 text-slate-600">{leg.fromName}</td>
                                <td className="py-2 px-3 text-slate-600">{leg.toName}</td>
                                <td className="py-2 px-3 font-mono text-slate-600 tabular-nums">
                                  {leg.durationMinutes} min ({leg.distanceKm.toFixed(1)} km)
                                </td>
                                <td className="py-2 px-3 font-mono font-semibold text-slate-900">
                                  {leg.costInr > 0 ? formatInrPrice(leg.costInr, currency) : 'Included'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Local tip callout */}
                    {selectedOption.localTip && (
                      <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-1.5">
                        <span className="font-bold shrink-0">💡 Karnataka Local Transit Tip:</span>
                        <span>{selectedOption.localTip}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No public transit route selected.</p>
                )}
              </div>
            )}

            {/* SECTION 2: ACCOMMODATIONS (HOTELS & HOSTELS) */}
            {includeHotels && (
              <div className="space-y-3 print-avoid-break">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <Hotel className="w-4 h-4 text-purple-600" />
                    2. Selected Accommodations & Stays ({stays.length})
                  </h3>
                  <span className="text-xs font-mono font-bold text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    {formatInrPrice(stayCostInr, currency)} Total
                  </span>
                </div>

                {stays.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {stays.map((hotel) => (
                      <div
                        key={hotel.id}
                        className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2 text-xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                              {hotel.category}
                            </span>
                            <div className="font-bold text-slate-900 text-sm mt-1">{hotel.name}</div>
                          </div>
                          <div className="font-mono font-bold text-slate-900 text-right">
                            {formatInrPrice(hotel.priceInr * stayNights, currency)}
                            <div className="text-[10px] text-slate-500 font-normal">
                              {stayNights} Night{stayNights > 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>

                        <div className="text-slate-600 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{hotel.address}</span>
                          <span>·</span>
                          <span className="shrink-0 font-medium">{hotel.distanceKmFromDest} km from hub</span>
                        </div>

                        <p className="text-slate-500 text-[11px] line-clamp-2">{hotel.description}</p>

                        <div className="flex flex-wrap gap-1 pt-1">
                          {hotel.amenities.slice(0, 3).map((a, i) => (
                            <span
                              key={i}
                              className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded"
                            >
                              {a}
                            </span>
                          ))}
                        </div>

                        {hotel.karnatakaSpecialty && (
                          <div className="text-[11px] text-amber-900 bg-amber-50/70 p-1.5 rounded border border-amber-200/60 font-medium">
                            ★ {hotel.karnatakaSpecialty}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No accommodations currently added to trip.</p>
                )}
              </div>
            )}

            {/* SECTION 3: KARNATAKA DINING & CULINARY STOPS */}
            {includeDining && (
              <div className="space-y-3 print-avoid-break">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-amber-600" />
                    3. Selected Karnataka Dining & Culinary Stops ({dinings.length})
                  </h3>
                  <span className="text-xs font-mono font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {formatInrPrice(diningCostInr, currency)} Est.
                  </span>
                </div>

                {dinings.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {dinings.map((dine) => (
                      <div
                        key={dine.id}
                        className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2 text-xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                              {dine.category}
                            </span>
                            <div className="font-bold text-slate-900 text-sm mt-1">{dine.name}</div>
                          </div>
                          <div className="font-mono font-bold text-slate-900 text-right">
                            ~{formatInrPrice(dine.priceInr, currency)}
                            <div className="text-[10px] text-slate-500 font-normal">per meal</div>
                          </div>
                        </div>

                        <div className="text-slate-600 text-[11px]">
                          <span className="font-medium text-slate-800">Cuisine:</span> {dine.cuisine}
                        </div>

                        <div className="text-slate-500 text-[11px] flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{dine.address}</span>
                        </div>

                        {dine.karnatakaSpecialty && (
                          <div className="text-[11px] text-amber-900 bg-amber-50/80 p-1.5 rounded border border-amber-200/70 font-medium">
                            Recommended: {dine.karnatakaSpecialty}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No dining locations currently added to trip.</p>
                )}
              </div>
            )}

            {/* SECTION 4: DAY-BY-DAY PERSONALIZED ITINERARY */}
            {includeDayByDay && personalizedItinerary.dailyPlans.length > 0 && (
              <div className="space-y-3 print-avoid-break">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    4. Day-by-Day Journey Itinerary ({personalizedItinerary.dailyPlans.length} Days)
                  </h3>
                  <span className="text-xs font-mono font-bold text-slate-700">
                    Est. Daily Budget: {formatInrPrice(personalizedItinerary.dailyPlans[0].dayBudgetInr, currency)}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {personalizedItinerary.dailyPlans.map((day) => (
                    <div
                      key={day.dayNumber}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white text-xs space-y-1.5 print-avoid-break"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-slate-900 text-sm">
                          {day.title}
                        </div>
                        <span className="font-mono text-slate-500 font-medium">
                          Day Budget: {formatInrPrice(day.dayBudgetInr, currency)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] pt-1">
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                          <span className="font-bold text-amber-700 block">Morning:</span>
                          <span className="text-slate-600">{day.morning}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                          <span className="font-bold text-sky-700 block">Afternoon:</span>
                          <span className="text-slate-600">{day.afternoon}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                          <span className="font-bold text-purple-700 block">Evening & Sunset:</span>
                          <span className="text-slate-600">{day.evening}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 pt-1 text-[11px] text-slate-600">
                        <span><strong>Stay:</strong> {day.recommendedStay}</span>
                        <span>·</span>
                        <span><strong>Food:</strong> {day.foodHighlight}</span>
                        <span>·</span>
                        <span><strong>Transit:</strong> {day.transitTip}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 5: KARNATAKA TRAVEL ADVISORIES & EMERGENCY HELPLINES */}
            {includeHelpline && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs print-avoid-break">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <PhoneCall className="w-4 h-4 text-rose-600" />
                  <span>5. Official Karnataka Travel Advisories & Emergency Assistance</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div>
                    <div className="text-slate-500">Karnataka Tourism 24/7</div>
                    <div className="font-bold font-mono text-slate-900">1800-425-2424</div>
                  </div>
                  <div>
                    <div className="text-slate-500">KSRTC Support & Enquiry</div>
                    <div className="font-bold font-mono text-slate-900">080-49596666</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Namma Metro Helpline</div>
                    <div className="font-bold font-mono text-slate-900">1800-425-12345</div>
                  </div>
                  <div>
                    <div className="text-slate-500">National Emergency / Police</div>
                    <div className="font-bold font-mono text-rose-700">112 / 108</div>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-200">
                  Document generated via OmniVoyage Karnataka Planner. Timings, platform numbers, and fares are subject to official KSRTC, South Western Railway, and BMRCL scheduling.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer (Hidden in Print) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between no-print">
          <div className="text-xs text-slate-500">
            Tip: In the print dialog, select <strong>"Save as PDF"</strong> as destination.
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
