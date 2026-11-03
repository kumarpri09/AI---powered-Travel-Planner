/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DailyForecast {
  date: string;
  dayName: string;
  condition: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  rainProbability: number;
  uvIndex: number;
}

export interface AttireAdvice {
  summary: string;
  recommendedClothing: string[];
  essentialGear: string[];
  activityRecommendation: string;
  bestOutdoorHours: string;
}

export interface DestinationWeather {
  cityName: string;
  currentTemp: number;
  feelsLike: number;
  condition: string;
  weatherCode: number;
  humidity: number;
  windSpeedKmH: number;
  uvIndex: number;
  rainChance: number;
  isLiveApiData: boolean;
  dailyForecast: DailyForecast[];
  attireAdvice: AttireAdvice;
}
