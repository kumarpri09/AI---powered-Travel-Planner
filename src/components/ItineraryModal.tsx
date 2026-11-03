/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Printer,
  Copy,
  Check,
  Calendar,
  Clock,
  MapPin,
  Hotel,
  Utensils,
  TrainFront,
  Bike,
  Bus,
  Train,
  Plane,
  Download,
  Share2,
} from 'lucide-react';
import { CurrencyCode, Facility, LocationPoint, TravelOption } from '../types/travel';
import { formatInrPrice } from '../data/currencies';

interface ItineraryModalProps {
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
  onOpenPrintableReport?: () => void;
}

export const ItineraryModal: React.FC<ItineraryModalProps> = ({
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
  onOpenPrintableReport,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const stays = selectedFacilities.filter((f) => f.type === 'hotel' || f.type === 'hostel');
  const dinings = selectedFacilities.filter((f) => f.type === 'restaurant' || f.type === 'cafe');

  const transitCostInr = selectedOption ? selectedOption.costInr * travelersCount : 0;
  const stayCostInr = stays.reduce((sum, f) => sum + f.priceInr * stayNights, 0);
  const diningCostInr = dinings.reduce((sum, f) => sum + f.priceInr * 2 * travelersCount, 0);
  const totalCostInr = transitCostInr + stayCostInr + diningCostInr;

  const handleCopySummary = () => {
    const summary = `
OmniVoyage Karnataka Itinerary: ${origin.name} to ${destination.name}
Date: ${travelDate} | Travellers: ${travelersCount} | Nights: ${stayNights}
Public Transit: ${selectedOption?.title || 'None'} (${formatInrPrice(transitCostInr, currency)})
Stays: ${stays.map((s) => s.name).join(', ') || 'None selected'} (${formatInrPrice(stayCostInr, currency)})
Dining: ${dinings.map((d) => d.name).join(', ') || 'None selected'} (${formatInrPrice(diningCostInr, currency)})
Total Estimated Trip Cost: ${formatInrPrice(totalCostInr, currency)}
    `.trim();

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Your Complete Karnataka Itinerary</h2>
            <p className="text-xs text-slate-500 mt-1">
              {origin.name} to {destination.name} · {travelDate} · {travelersCount} Traveller{travelersCount > 1 ? 's' : ''}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Summary Banner */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-xs font-semibold text-indigo-900 uppercase tracking-wide">
                Total Estimated Karnataka Trip Cost
              </div>
              <div className="text-2xl font-bold font-mono text-indigo-950 tabular-nums">
                {formatInrPrice(totalCostInr, currency)}
              </div>
            </div>
            <div className="text-right text-xs text-indigo-800 space-y-0.5 font-medium">
              <div>Transit: {formatInrPrice(transitCostInr, currency)}</div>
              <div>Stay ({stayNights}n): {formatInrPrice(stayCostInr, currency)}</div>
              <div>Dining: {formatInrPrice(diningCostInr, currency)}</div>
            </div>
          </div>

          {/* Sequential Timeline */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Timeline & Journey Schedule
            </h3>

            <div className="relative pl-6 border-l-2 border-indigo-200 space-y-6 ml-3">
              {/* Departure */}
              <div className="relative">
                <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-white" />
                <div className="text-xs font-mono text-emerald-600 font-semibold">
                  07:30 AM · Departure Concourse
                </div>
                <div className="font-bold text-slate-900 text-sm">{origin.name}</div>
                <div className="text-xs text-slate-500">{origin.district}, Karnataka</div>
              </div>

              {/* Transit Option */}
              {selectedOption && (
                <div className="relative">
                  <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-indigo-600 ring-4 ring-white" />
                  <div className="text-xs font-mono text-indigo-600 font-semibold">
                    08:00 AM · Transit Route ({formatInrPrice(transitCostInr, currency)})
                  </div>
                  <div className="font-bold text-slate-900 text-sm">{selectedOption.title}</div>
                  <div className="text-xs text-slate-600 mt-1 space-y-1">
                    <div>Operator: {selectedOption.operator}</div>
                    <div>
                      Duration: {selectedOption.durationMinutes} mins · {selectedOption.distanceKm} km
                    </div>
                    <div>Carbon Footprint: {selectedOption.co2Kg} kg CO₂</div>
                    {selectedOption.localTip && (
                      <div className="text-amber-800 font-medium">💡 {selectedOption.localTip}</div>
                    )}
                  </div>
                </div>
              )}

              {/* Arrival at Destination */}
              <div className="relative">
                <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-red-500 ring-4 ring-white" />
                <div className="text-xs font-mono text-red-600 font-semibold">
                  Arrival at Destination Hub
                </div>
                <div className="font-bold text-slate-900 text-sm">{destination.name}</div>
                <div className="text-xs text-slate-500">{destination.district}, Karnataka</div>
              </div>

              {/* Hotel / Stay Check-in */}
              {stays.map((stay) => (
                <div key={stay.id} className="relative">
                  <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-purple-600 ring-4 ring-white" />
                  <div className="text-xs font-mono text-purple-600 font-semibold">
                    01:00 PM · Check-in Stay
                  </div>
                  <div className="font-bold text-slate-900 text-sm">{stay.name}</div>
                  <div className="text-xs text-slate-500">{stay.address}</div>
                  <div className="text-xs text-slate-600 mt-1 font-mono">
                    {formatInrPrice(stay.priceInr * stayNights, currency)} total ({stayNights} night
                    {stayNights > 1 ? 's' : ''})
                  </div>
                </div>
              ))}

              {/* Dining */}
              {dinings.map((dine) => (
                <div key={dine.id} className="relative">
                  <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-orange-500 ring-4 ring-white" />
                  <div className="text-xs font-mono text-orange-600 font-semibold">
                    07:30 PM · Authentic Karnataka Dining
                  </div>
                  <div className="font-bold text-slate-900 text-sm">{dine.name}</div>
                  <div className="text-xs text-slate-500">{dine.address}</div>
                  <div className="text-xs text-slate-600 mt-1">
                    {dine.cuisine || 'Local Fare'} · Rating ★{dine.rating.toFixed(1)}
                  </div>
                  {dine.karnatakaSpecialty && (
                    <div className="text-xs text-amber-800 font-medium mt-0.5">
                      Specialty: {dine.karnatakaSpecialty}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={handleCopySummary}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" /> Copied to Clipboard
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy Itinerary
              </>
            )}
          </button>

          <button
            onClick={() => {
              if (onOpenPrintableReport) {
                onOpenPrintableReport();
              } else {
                window.print();
              }
            }}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" /> Export Printable PDF
          </button>
        </div>
      </div>
    </div>
  );
};
