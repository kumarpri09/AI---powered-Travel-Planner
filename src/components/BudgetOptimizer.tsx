/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Wallet,
  Sparkles,
  Zap,
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  Hotel,
  Utensils,
  Plane,
  TrainFront,
  Bike,
  Bus,
  Train,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { CurrencyCode, Facility, TravelOption } from '../types/travel';
import { formatInrPrice } from '../data/currencies';

interface BudgetOptimizerProps {
  selectedOption: TravelOption | null;
  selectedFacilities: Facility[];
  currency: CurrencyCode;
  travelersCount: number;
  stayNights: number;
  maxBudgetInr: number;
  onOptimizeForBudget: () => void;
  onOptimizeForComfort: () => void;
}

export const BudgetOptimizer: React.FC<BudgetOptimizerProps> = ({
  selectedOption,
  selectedFacilities,
  currency,
  travelersCount,
  stayNights,
  maxBudgetInr,
  onOptimizeForBudget,
  onOptimizeForComfort,
}) => {
  const transitCostInr = selectedOption ? selectedOption.costInr * travelersCount : 0;

  const stays = selectedFacilities.filter((f) => f.type === 'hotel' || f.type === 'hostel');
  const stayCostInr = stays.reduce((sum, f) => sum + f.priceInr * stayNights, 0);

  const dinings = selectedFacilities.filter((f) => f.type === 'restaurant' || f.type === 'cafe');
  const diningCostInr = dinings.reduce((sum, f) => sum + f.priceInr * 2 * travelersCount, 0); // 2 meals per day

  const totalCostInr = transitCostInr + stayCostInr + diningCostInr;
  const budgetRatio = maxBudgetInr > 0 ? (totalCostInr / maxBudgetInr) * 100 : 0;
  const isOverBudget = totalCostInr > maxBudgetInr;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Trip Budget & Cost Breakdown</h3>
            <p className="text-[11px] text-slate-500">
              {travelersCount} Traveller{travelersCount > 1 ? 's' : ''} · {stayNights} Night{stayNights > 1 ? 's' : ''} Stay
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
            {formatInrPrice(totalCostInr, currency)}
          </div>
          <div className="text-[11px] text-slate-500">
            Budget Target: {formatInrPrice(maxBudgetInr, currency)}
          </div>
        </div>
      </div>

      {/* Progress towards max budget */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600 flex items-center gap-1 font-medium">
            {isOverBudget ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                <span className="text-red-600 font-semibold">
                  Exceeds Target by {formatInrPrice(totalCostInr - maxBudgetInr, currency)}
                </span>
              </>
            ) : (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-700 font-semibold">
                  {Math.max(0, Math.round(100 - budgetRatio))}% Budget Remaining
                </span>
              </>
            )}
          </span>
          <span className="font-mono text-slate-600 tabular-nums">
            {Math.round(budgetRatio)}% used
          </span>
        </div>

        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isOverBudget ? 'bg-red-500' : budgetRatio > 80 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(100, Math.max(5, budgetRatio))}%` }}
          />
        </div>
      </div>

      {/* Sub-itemized cost rows */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
          <div className="text-slate-500 text-[11px] flex items-center gap-1">
            <TrainFront className="w-3 h-3 text-indigo-500" /> Public Transit Fare
          </div>
          <div className="font-bold font-mono text-slate-900 tabular-nums">
            {formatInrPrice(transitCostInr, currency)}
          </div>
          <div className="text-[10px] text-slate-400">
            {selectedOption ? selectedOption.title.slice(0, 24) : 'None selected'}
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
          <div className="text-slate-500 text-[11px] flex items-center gap-1">
            <Hotel className="w-3 h-3 text-purple-500" /> Stays ({stays.length})
          </div>
          <div className="font-bold font-mono text-slate-900 tabular-nums">
            {formatInrPrice(stayCostInr, currency)}
          </div>
          <div className="text-[10px] text-slate-400">
            {stays.length > 0 ? `${stays.length} stay added` : 'No stay selected'}
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
          <div className="text-slate-500 text-[11px] flex items-center gap-1">
            <Utensils className="w-3 h-3 text-orange-500" /> Karnataka Dining ({dinings.length})
          </div>
          <div className="font-bold font-mono text-slate-900 tabular-nums">
            {formatInrPrice(diningCostInr, currency)}
          </div>
          <div className="text-[10px] text-slate-400">
            {dinings.length > 0 ? `${dinings.length} spots added` : 'No spots selected'}
          </div>
        </div>
      </div>

      {/* Smart Karnataka Optimizer Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-slate-100">
        <button
          onClick={onOptimizeForBudget}
          className="w-full sm:w-1/2 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
        >
          <TrendingDown className="w-4 h-4 text-emerald-600" />
          <span>Apply Backpacker Budget Saver (KSRTC + Zostel + Mylari)</span>
        </button>

        <button
          onClick={onOptimizeForComfort}
          className="w-full sm:w-1/2 py-2 px-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
        >
          <ShieldCheck className="w-4 h-4 text-purple-600" />
          <span>Optimize for Comfort (Vande Bharat / Airavat + Estate Stay)</span>
        </button>
      </div>
    </div>
  );
};
