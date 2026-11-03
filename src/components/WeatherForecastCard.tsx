/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sun,
  CloudSun,
  CloudRain,
  CloudFog,
  CloudLightning,
  Wind,
  Droplets,
  Thermometer,
  ShieldAlert,
  Shirt,
  Sparkles,
  Clock,
  Compass,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Umbrella,
} from 'lucide-react';
import { LocationPoint } from '../types/travel';
import { DestinationWeather } from '../types/weather';

interface WeatherForecastCardProps {
  weather: DestinationWeather | null;
  location: LocationPoint;
  isLoading: boolean;
  onRefresh: () => void;
}

export const WeatherForecastCard: React.FC<WeatherForecastCardProps> = ({
  weather,
  location,
  isLoading,
  onRefresh,
}) => {
  const [showAttireDetails, setShowAttireDetails] = useState<boolean>(true);
  const [unit, setUnit] = useState<'C' | 'F'>('C');

  const formatTemp = (tempC: number) => {
    if (unit === 'F') {
      return `${Math.round((tempC * 9) / 5 + 32)}°F`;
    }
    return `${Math.round(tempC)}°C`;
  };

  const getWeatherIcon = (code: number, sizeClass: string = 'w-6 h-6') => {
    if (code === 0) return <Sun className={`${sizeClass} text-amber-500`} />;
    if (code === 1 || code === 2) return <CloudSun className={`${sizeClass} text-amber-500`} />;
    if (code === 3) return <CloudSun className={`${sizeClass} text-slate-500`} />;
    if (code === 45 || code === 48) return <CloudFog className={`${sizeClass} text-slate-400`} />;
    if (code >= 51 && code <= 65) return <CloudRain className={`${sizeClass} text-blue-500`} />;
    if (code >= 80 && code <= 82) return <CloudRain className={`${sizeClass} text-sky-500`} />;
    if (code >= 95) return <CloudLightning className={`${sizeClass} text-purple-600`} />;
    return <Sun className={`${sizeClass} text-amber-500`} />;
  };

  if (!weather && isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs animate-pulse space-y-3">
        <div className="h-4 bg-slate-200 rounded w-1/3" />
        <div className="h-16 bg-slate-100 rounded-xl" />
        <div className="h-24 bg-slate-100 rounded-xl" />
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
      {/* Top Header: City, Weather Tag, Refresh & Unit Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            {getWeatherIcon(weather.weatherCode, 'w-4 h-4')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-sm">
                Destination Weather: {location.city}
              </h3>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                {location.district}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <span>{weather.isLiveApiData ? 'Live Meteorological Feed' : 'Karnataka Regional Model'}</span>
              <span aria-hidden="true">·</span>
              <span>{location.region}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Unit Toggle */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200/80 text-xs">
            <button
              onClick={() => setUnit('C')}
              className={`px-2 py-0.5 rounded font-mono font-semibold transition-colors ${
                unit === 'C' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              °C
            </button>
            <button
              onClick={() => setUnit('F')}
              className={`px-2 py-0.5 rounded font-mono font-semibold transition-colors ${
                unit === 'F' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              °F
            </button>
          </div>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Refresh forecast"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Primary Current Weather Banner */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-gradient-to-br from-slate-50 to-amber-50/30 p-4 rounded-xl border border-slate-200/80">
        {/* Left: Temperature & Main Condition (5 cols) */}
        <div className="md:col-span-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white shadow-xs border border-slate-200/80 flex items-center justify-center shrink-0">
            {getWeatherIcon(weather.weatherCode, 'w-9 h-9')}
          </div>
          <div>
            <div className="text-3xl font-extrabold font-mono text-slate-950 tabular-nums tracking-tight">
              {formatTemp(weather.currentTemp)}
            </div>
            <div className="text-xs font-bold text-slate-800 mt-0.5">{weather.condition}</div>
            <div className="text-[11px] text-slate-500 font-mono">
              Feels like {formatTemp(weather.feelsLike)}
            </div>
          </div>
        </div>

        {/* Right: Meteorological Metrics Strip (7 cols) */}
        <div className="md:col-span-7 grid grid-cols-4 gap-2 text-center text-xs">
          <div className="p-2 bg-white rounded-lg border border-slate-200/70 space-y-0.5">
            <div className="text-[10px] text-slate-500 flex items-center justify-center gap-0.5">
              <Droplets className="w-3 h-3 text-sky-500" /> Humidity
            </div>
            <div className="font-bold font-mono text-slate-900 tabular-nums">
              {weather.humidity}%
            </div>
          </div>

          <div className="p-2 bg-white rounded-lg border border-slate-200/70 space-y-0.5">
            <div className="text-[10px] text-slate-500 flex items-center justify-center gap-0.5">
              <Wind className="w-3 h-3 text-teal-500" /> Wind
            </div>
            <div className="font-bold font-mono text-slate-900 tabular-nums">
              {weather.windSpeedKmH} <span className="text-[9px] font-sans font-normal text-slate-400">km/h</span>
            </div>
          </div>

          <div className="p-2 bg-white rounded-lg border border-slate-200/70 space-y-0.5">
            <div className="text-[10px] text-slate-500 flex items-center justify-center gap-0.5">
              <Sun className="w-3 h-3 text-amber-500" /> UV Index
            </div>
            <div className="font-bold font-mono text-slate-900 tabular-nums">
              {weather.uvIndex} <span className="text-[9px] font-sans font-normal text-slate-400">/ 11</span>
            </div>
          </div>

          <div className="p-2 bg-white rounded-lg border border-slate-200/70 space-y-0.5">
            <div className="text-[10px] text-slate-500 flex items-center justify-center gap-0.5">
              <Umbrella className="w-3 h-3 text-blue-500" /> Rain
            </div>
            <div className="font-bold font-mono text-slate-900 tabular-nums">
              {weather.rainChance}%
            </div>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast Grid Strip */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          5-Day Forecast Projection
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {weather.dailyForecast.map((day, i) => (
            <div
              key={i}
              className={`p-2.5 rounded-xl border text-center space-y-1 transition-colors ${
                i === 0
                  ? 'bg-amber-50/50 border-amber-200/90'
                  : 'bg-slate-50 border-slate-200/70'
              }`}
            >
              <div className="text-xs font-bold text-slate-800">{day.dayName}</div>
              <div className="text-[10px] text-slate-400 font-mono">{day.date}</div>
              <div className="flex justify-center py-0.5">
                {getWeatherIcon(day.weatherCode, 'w-5 h-5')}
              </div>
              <div className="text-xs font-mono font-bold text-slate-900 tabular-nums">
                {formatTemp(day.tempMax)}{' '}
                <span className="text-[11px] text-slate-400 font-normal">
                  {formatTemp(day.tempMin)}
                </span>
              </div>
              <div className="text-[10px] text-blue-600 font-medium">
                💧 {day.rainProbability}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attire & Activity Planning Advisory */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-slate-900">
            <Shirt className="w-4 h-4 text-indigo-600" />
            <span>Recommended Attire & Activity Planning</span>
          </div>

          <button
            onClick={() => setShowAttireDetails(!showAttireDetails)}
            className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 flex items-center gap-1"
          >
            {showAttireDetails ? (
              <>
                Collapse <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                View Packing Tips <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        <p className="text-xs font-semibold text-slate-800">
          {weather.attireAdvice.summary}
        </p>

        {showAttireDetails && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs border-t border-slate-200/70">
            {/* Clothing */}
            <div className="space-y-1.5">
              <span className="font-bold text-slate-700 flex items-center gap-1 text-[11px]">
                👕 Clothing Recommendations:
              </span>
              <ul className="space-y-1 text-slate-600 pl-3">
                {weather.attireAdvice.recommendedClothing.map((item, idx) => (
                  <li key={idx} className="list-disc list-outside text-[11px]">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Gear & Timings */}
            <div className="space-y-2">
              <div className="space-y-1">
                <span className="font-bold text-slate-700 flex items-center gap-1 text-[11px]">
                  🎒 Essential Gear & Items:
                </span>
                <ul className="space-y-1 text-slate-600 pl-3">
                  {weather.attireAdvice.essentialGear.map((item, idx) => (
                    <li key={idx} className="list-disc list-outside text-[11px]">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-2 rounded-lg bg-indigo-50/70 border border-indigo-100 text-[11px] text-indigo-950 space-y-0.5">
                <div>
                  <span className="font-semibold">Optimal Outdoor Hours:</span>{' '}
                  <span className="font-mono">{weather.attireAdvice.bestOutdoorHours}</span>
                </div>
                <div className="text-slate-600">{weather.attireAdvice.activityRecommendation}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
