/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  Play,
  Pause,
  FastForward,
  SkipForward,
  RotateCcw,
  Volume2,
  VolumeX,
  Navigation,
  Compass,
  CornerUpRight,
  CornerUpLeft,
  ArrowUp,
  LogIn,
  LogOut,
  Repeat,
  CheckCircle2,
  Clock,
  Gauge,
} from 'lucide-react';
import { NavigationStep, TravelOption } from '../types/travel';

interface NavigationControllerProps {
  selectedOption: TravelOption;
  isNavigating: boolean;
  navStepIndex: number;
  simulatedProgress: number; // 0 to 1
  onTogglePlay: () => void;
  isPlaying: boolean;
  simSpeed: number;
  onSetSpeed: (speed: number) => void;
  onNextStep: () => void;
  onResetNav: () => void;
  onStopNav: () => void;
}

export const NavigationController: React.FC<NavigationControllerProps> = ({
  selectedOption,
  isNavigating,
  navStepIndex,
  simulatedProgress,
  onTogglePlay,
  isPlaying,
  simSpeed,
  onSetSpeed,
  onNextStep,
  onResetNav,
  onStopNav,
}) => {
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [lastSpokenStep, setLastSpokenStep] = useState<number>(-1);

  const steps = selectedOption.navigationSteps;
  const currentStep: NavigationStep | undefined = steps[navStepIndex] || steps[0];
  const nextStep: NavigationStep | undefined = steps[navStepIndex + 1];

  // Simulated speed based on transport mode
  const getSimulatedSpeed = () => {
    switch (selectedOption.mode) {
      case 'bike':
        return 18;
      case 'bus':
        return 32;
      case 'metro':
        return 48;
      case 'train':
        return 145;
      case 'flight':
        return 740;
      default:
        return 28;
    }
  };

  // Voice announcement simulation using Web Speech API
  useEffect(() => {
    if (!isNavigating || !voiceEnabled || !currentStep) return;

    if (navStepIndex !== lastSpokenStep && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentStep.instruction);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
      setLastSpokenStep(navStepIndex);
    }
  }, [navStepIndex, isNavigating, voiceEnabled, currentStep, lastSpokenStep]);

  if (!isNavigating) return null;

  const renderManeuverIcon = (maneuver: NavigationStep['maneuver']) => {
    switch (maneuver) {
      case 'turn-left':
        return <CornerUpLeft className="w-6 h-6 text-white" />;
      case 'turn-right':
        return <CornerUpRight className="w-6 h-6 text-white" />;
      case 'board':
        return <LogIn className="w-6 h-6 text-white" />;
      case 'transfer':
        return <Repeat className="w-6 h-6 text-white" />;
      case 'exit':
      case 'arrive':
        return <CheckCircle2 className="w-6 h-6 text-white" />;
      default:
        return <ArrowUp className="w-6 h-6 text-white" />;
    }
  };

  const totalSteps = steps.length;
  const remainingMinutes = Math.max(
    1,
    Math.round(selectedOption.durationMinutes * (1 - simulatedProgress))
  );
  const remainingDistanceKm = Math.max(
    0.1,
    Number((selectedOption.distanceKm * (1 - simulatedProgress)).toFixed(1))
  );

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-2xl border border-slate-800 space-y-4">
      {/* Top Bar with Live Tag, Mode & Voice */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">
            Real-Time Navigation Live
          </span>
          <span className="text-xs text-slate-400">·</span>
          <span className="text-xs text-slate-300 font-medium">{selectedOption.title}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              voiceEnabled
                ? 'bg-slate-800 border-slate-700 text-slate-200'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
            title={voiceEnabled ? 'Mute Voice Guidance' : 'Enable Voice Guidance'}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={onStopNav}
            className="px-3 py-1 bg-red-950/70 hover:bg-red-900 border border-red-800/80 text-red-200 rounded-lg text-xs font-medium transition-colors"
          >
            End Navigation
          </button>
        </div>
      </div>

      {/* Main Guidance Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Left: Maneuver Icon */}
        <div className="md:col-span-2 flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            {renderManeuverIcon(currentStep.maneuver)}
          </div>
        </div>

        {/* Center: Current Instruction & Station */}
        <div className="md:col-span-7 space-y-1">
          <div className="text-xs font-mono text-indigo-300 uppercase tracking-wide">
            Step {navStepIndex + 1} of {totalSteps}
            {currentStep.stationOrLine && ` · ${currentStep.stationOrLine}`}
          </div>
          <div className="text-lg md:text-xl font-bold text-white tracking-tight leading-snug">
            {currentStep.instruction}
          </div>
          {nextStep && (
            <div className="text-xs text-slate-400 flex items-center gap-1.5 pt-1">
              <span className="text-slate-500">Then:</span>
              <span>{nextStep.instruction}</span>
            </div>
          )}
        </div>

        {/* Right: Real-time Telemetry (Speed & Remaining) */}
        <div className="md:col-span-3 grid grid-cols-2 gap-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center">
          <div>
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
              <Gauge className="w-3.5 h-3.5 text-indigo-400" />
              <span>Speed</span>
            </div>
            <div className="text-base font-mono font-bold text-white tabular-nums">
              {isPlaying ? getSimulatedSpeed() : 0}{' '}
              <span className="text-[10px] font-sans font-normal text-slate-400">km/h</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Remaining</span>
            </div>
            <div className="text-base font-mono font-bold text-emerald-400 tabular-nums">
              {remainingMinutes}{' '}
              <span className="text-[10px] font-sans font-normal text-slate-400">min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-slate-400">
          <span>Route Progress ({Math.round(simulatedProgress * 100)}%)</span>
          <span className="font-mono tabular-nums">{remainingDistanceKm} km left</span>
        </div>
        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 via-emerald-400 to-emerald-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(4, simulatedProgress * 100))}%` }}
          />
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePlay}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold transition-all ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" /> Pause Guidance
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" /> Resume Guidance
              </>
            )}
          </button>

          <button
            onClick={onNextStep}
            className="flex items-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
            title="Advance to Next Waypoint"
          >
            <SkipForward className="w-4 h-4" /> Next Turn
          </button>

          <button
            onClick={onResetNav}
            className="flex items-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            title="Restart Route from Origin"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Restart
          </button>
        </div>

        {/* Speed Multiplier Segment */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <span className="px-2 text-slate-400 text-[11px]">Simulation Speed:</span>
          {[1, 2, 5, 10].map((s) => (
            <button
              key={s}
              onClick={() => onSetSpeed(s)}
              className={`px-2 py-1 rounded text-xs font-mono font-medium transition-colors ${
                simSpeed === s ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
