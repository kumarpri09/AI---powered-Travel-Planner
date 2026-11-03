/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Sparkles,
  Compass,
  Clock,
  Wallet,
  Heart,
  Landmark,
  TreePine,
  Coffee,
  SunMedium,
  Mountain,
  Flame,
  Check,
} from 'lucide-react';
import {
  BudgetTier,
  ExperienceType,
  TravellerInterest,
  TripDurationTier,
} from '../types/travel';

interface PersonalizationPanelProps {
  selectedInterests: TravellerInterest[];
  onToggleInterest: (interest: TravellerInterest) => void;
  selectedDuration: TripDurationTier;
  onChangeDuration: (duration: TripDurationTier) => void;
  selectedBudget: BudgetTier;
  onChangeBudget: (budget: BudgetTier) => void;
  selectedExperience: ExperienceType;
  onChangeExperience: (exp: ExperienceType) => void;
  onApplyPreferences: () => void;
}

const INTERESTS: { id: TravellerInterest; label: string; icon: React.ReactNode; desc: string }[] = [
  {
    id: 'heritage',
    label: 'Heritage & Palaces',
    icon: <Landmark className="w-4 h-4 text-amber-600" />,
    desc: 'Hampi ruins, Mysore Palace, Badami caves',
  },
  {
    id: 'nature_wildlife',
    label: 'Nature & Wildlife',
    icon: <TreePine className="w-4 h-4 text-emerald-600" />,
    desc: 'Western Ghats, waterfalls & river coracles',
  },
  {
    id: 'coffee_plantations',
    label: 'Coffee Estates & Hills',
    icon: <Coffee className="w-4 h-4 text-amber-800" />,
    desc: 'Misty Coorg & Chikkamagaluru estate walks',
  },
  {
    id: 'coastal_beach',
    label: 'Coastal Beaches & Shacks',
    icon: <SunMedium className="w-4 h-4 text-sky-600" />,
    desc: 'Gokarna Om Beach cliffs & Karavali shacks',
  },
  {
    id: 'adventure_trek',
    label: 'Peak Trekking & Rafting',
    icon: <Mountain className="w-4 h-4 text-indigo-600" />,
    desc: 'Mullayanagiri peak & Dandeli river rafting',
  },
  {
    id: 'spiritual',
    label: 'Spiritual & Architecture',
    icon: <Flame className="w-4 h-4 text-rose-600" />,
    desc: 'Hoysala Belur, Udupi & Murudeshwar',
  },
];

export const PersonalizationPanel: React.FC<PersonalizationPanelProps> = ({
  selectedInterests,
  onToggleInterest,
  selectedDuration,
  onChangeDuration,
  selectedBudget,
  onChangeBudget,
  selectedExperience,
  onChangeExperience,
  onApplyPreferences,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Personalize Your Karnataka Journey
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Tailor transit, stays, and dining by your specific interests, available time, and budget.
          </p>
        </div>

        <button
          onClick={onApplyPreferences}
          className="self-start sm:self-auto px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Update Itinerary</span>
        </button>
      </div>

      {/* Grid of Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* 1. Interests (6 cols) */}
        <div className="md:col-span-6 space-y-2">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
            1. What Inspires You Most in Karnataka?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {INTERESTS.map((item) => {
              const active = selectedInterests.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => onToggleInterest(item.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    active
                      ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-500/30'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {item.icon}
                      <span className="text-xs font-semibold text-slate-900 leading-tight">
                        {item.label}
                      </span>
                    </div>
                    {active && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{item.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Available Time & Budget & Experience (6 cols) */}
        <div className="md:col-span-6 space-y-4">
          {/* Available Time */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                2. Available Time
              </label>
              <span className="text-[11px] font-mono text-slate-500">
                {selectedDuration === '1_day'
                  ? '1 Day Express'
                  : selectedDuration === '2_3_days'
                  ? '2-3 Days Weekend'
                  : selectedDuration === '4_5_days'
                  ? '4-5 Days Circuit'
                  : '6-8 Days Odyssey'}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/80">
              {(
                [
                  { id: '1_day', label: '1 Day' },
                  { id: '2_3_days', label: '2-3 Days' },
                  { id: '4_5_days', label: '4-5 Days' },
                  { id: '6_8_days', label: '6-8 Days' },
                ] as const
              ).map((d) => (
                <button
                  key={d.id}
                  onClick={() => onChangeDuration(d.id)}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-colors text-center ${
                    selectedDuration === d.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Tier */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-emerald-500" />
                3. Budget Level
              </label>
              <span className="text-[11px] font-mono text-slate-500">
                {selectedBudget === 'budget'
                  ? '₹800 - ₹1,500/day'
                  : selectedBudget === 'moderate'
                  ? '₹2,000 - ₹4,500/day'
                  : '₹6,000 - ₹12,000+/day'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/80">
              {(
                [
                  { id: 'budget', label: 'Backpacker / Saver' },
                  { id: 'moderate', label: 'Comfort / Balanced' },
                  { id: 'luxury', label: 'Premium Leisure' },
                ] as const
              ).map((b) => (
                <button
                  key={b.id}
                  onClick={() => onChangeBudget(b.id)}
                  className={`py-1.5 px-2 text-xs font-semibold rounded-lg transition-colors text-center truncate ${
                    selectedBudget === b.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Type of Experience */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              4. Travel Companion / Style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/80">
              {(
                [
                  { id: 'solo_backpacker', label: 'Solo Backpacker' },
                  { id: 'romantic_couple', label: 'Couple / Romance' },
                  { id: 'family_leisure', label: 'Family Leisure' },
                  { id: 'friends_adventure', label: 'Friends Adventure' },
                ] as const
              ).map((e) => (
                <button
                  key={e.id}
                  onClick={() => onChangeExperience(e.id)}
                  className={`py-1.5 px-1.5 text-xs font-semibold rounded-lg transition-colors text-center truncate ${
                    selectedExperience === e.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {e.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
