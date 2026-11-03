/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TransportMode = 'bike' | 'metro' | 'bus' | 'train' | 'flight' | 'multi';

export type KarnatakaRegion =
  | 'Bengaluru Metro'
  | 'Old Mysuru Heritage'
  | 'Malnad & Western Ghats'
  | 'Karavali Coastal'
  | 'Vijayanagara & North Karnataka';

export type TravellerInterest =
  | 'heritage'
  | 'nature_wildlife'
  | 'coastal_beach'
  | 'coffee_plantations'
  | 'adventure_trek'
  | 'spiritual';

export type TripDurationTier = '1_day' | '2_3_days' | '4_5_days' | '6_8_days';

export type ExperienceType =
  | 'solo_backpacker'
  | 'romantic_couple'
  | 'family_leisure'
  | 'friends_adventure';

export type BudgetTier = 'budget' | 'moderate' | 'luxury';

export interface LocationPoint {
  id: string;
  name: string;
  city: string;
  district: string;
  country: string;
  region: KarnatakaRegion;
  lat: number;
  lng: number;
  type: 'city' | 'transit_hub' | 'airport' | 'station' | 'landmark';
  description?: string;
  popularFor: string[];
  tagline: string;
}

export interface NavigationStep {
  id: string;
  instruction: string;
  mode: TransportMode | 'walk';
  distanceMeters: number;
  durationMinutes: number;
  maneuver: 'depart' | 'turn-left' | 'turn-right' | 'straight' | 'board' | 'transfer' | 'exit' | 'arrive';
  stationOrLine?: string;
  lat: number;
  lng: number;
  co2Grams: number;
}

export interface TransitLeg {
  id: string;
  mode: TransportMode | 'walk';
  title: string;
  lineCode?: string;
  fromName: string;
  toName: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  distanceKm: number;
  stopsCount?: number;
  costInr: number;
  costUsd: number;
  co2Kg: number;
}

export interface TravelOption {
  id: string;
  title: string;
  mode: TransportMode;
  category: 'cheapest' | 'fastest' | 'eco' | 'comfort' | 'balanced';
  distanceKm: number;
  durationMinutes: number;
  costInr: number;
  costUsd: number;
  comfortScore: number; // 1 to 10
  co2Kg: number;
  transfersCount: number;
  frequencyText: string;
  operator: string;
  legs: TransitLeg[];
  pathCoordinates: [number, number][];
  navigationSteps: NavigationStep[];
  highlights: string[];
  reliability: 'High' | 'Very High' | 'Medium';
  localTip?: string;
}

export type FacilityType = 'hotel' | 'hostel' | 'restaurant' | 'cafe' | 'bike_dock' | 'metro_station';

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  category: string;
  lat: number;
  lng: number;
  priceTier: '$' | '$$' | '$$$';
  priceInr: number; // Night for hotel, avg meal for dining, rental for bike
  pricePerUnit: number; // In USD for base conversion
  rating: number;
  reviewsCount: number;
  distanceKmFromDest: number;
  address: string;
  image: string;
  amenities: string[];
  cuisine?: string;
  description: string;
  budgetFriendly: boolean;
  karnatakaSpecialty?: string;
}

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rateFromInr: number;
}

export interface KarnatakaDayPlan {
  dayNumber: number;
  title: string;
  theme: string;
  morning: string;
  afternoon: string;
  evening: string;
  recommendedStay: string;
  foodHighlight: string;
  transitTip: string;
  dayBudgetInr: number;
}

export interface PersonalizedItinerary {
  id: string;
  title: string;
  subtitle: string;
  heroImage: string;
  interests: TravellerInterest[];
  duration: TripDurationTier;
  budgetTier: BudgetTier;
  experienceType: ExperienceType;
  totalEstimatedInr: number;
  routeStops: LocationPoint[];
  dailyPlans: KarnatakaDayPlan[];
  whyRecommended: string;
  carbonSummaryKg: number;
}
