/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Compass,
  Navigation,
  Sparkles,
  MapPin,
  Calendar,
  Users,
  Moon,
  Wallet,
  ShieldCheck,
  Zap,
  Leaf,
  Clock,
  Bike,
  TrainFront,
  Bus,
  Train,
  Plane,
  FileText,
  SlidersHorizontal,
  Printer,
} from 'lucide-react';
import {
  BudgetTier,
  CurrencyCode,
  ExperienceType,
  Facility,
  LocationPoint,
  PersonalizedItinerary,
  TransportMode,
  TravelOption,
  TravellerInterest,
  TripDurationTier,
} from './types/travel';
import { KARNATAKA_CIRCUIT_PRESETS, KARNATAKA_LOCATIONS } from './data/locations';
import { calculateDistanceKm, generateTravelOptions } from './services/travelEngine';
import { getFacilitiesNearLocation } from './services/facilitiesData';
import { generatePersonalizedKarnatakaItinerary } from './services/karnatakaItineraryGenerator';
import { PersonalizationPanel } from './components/PersonalizationPanel';
import { PersonalizedItineraryView } from './components/PersonalizedItineraryView';
import { RouteSearchHeader } from './components/RouteSearchHeader';
import { InteractiveMap } from './components/InteractiveMap';
import { TravelOptionCard } from './components/TravelOptionCard';
import { NavigationController } from './components/NavigationController';
import { FacilitiesSection } from './components/FacilitiesSection';
import { BudgetOptimizer } from './components/BudgetOptimizer';
import { ItineraryModal } from './components/ItineraryModal';
import { PrintableReportModal } from './components/PrintableReportModal';
import { WeatherForecastCard } from './components/WeatherForecastCard';
import { fetchDestinationWeather } from './services/weatherService';
import { DestinationWeather } from './types/weather';

export default function App() {
  // Karnataka Journey Origin & Destination
  const [origin, setOrigin] = useState<LocationPoint>(KARNATAKA_LOCATIONS[0]); // Bengaluru Majestic
  const [destination, setDestination] = useState<LocationPoint>(KARNATAKA_LOCATIONS[1]); // Mysuru Palace

  // Destination Weather State
  const [weather, setWeather] = useState<DestinationWeather | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState<boolean>(false);

  // Traveller Personalization State
  const [selectedInterests, setSelectedInterests] = useState<TravellerInterest[]>([
    'heritage',
    'coffee_plantations',
  ]);
  const [selectedDuration, setSelectedDuration] = useState<TripDurationTier>('2_3_days');
  const [selectedBudget, setSelectedBudget] = useState<BudgetTier>('moderate');
  const [selectedExperience, setSelectedExperience] = useState<ExperienceType>('solo_backpacker');

  // Trip Configurations
  const [travelDate, setTravelDate] = useState<string>('2026-11-18');
  const [travelersCount, setTravelersCount] = useState<number>(1);
  const [stayNights, setStayNights] = useState<number>(2);
  const [currency, setCurrency] = useState<CurrencyCode>('INR');
  const [maxBudgetInr, setMaxBudgetInr] = useState<number>(6500);
  const [selectedModeFilter, setSelectedModeFilter] = useState<TransportMode | 'all'>('all');

  // Selected Option & Facilities
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');
  const [selectedHotelIds, setSelectedHotelIds] = useState<string[]>([]);
  const [selectedDiningIds, setSelectedDiningIds] = useState<string[]>([]);

  // Navigation Simulation State
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [isPlayingNav, setIsPlayingNav] = useState<boolean>(false);
  const [navStepIndex, setNavStepIndex] = useState<number>(0);
  const [simulatedProgress, setSimulatedProgress] = useState<number>(0);
  const [simSpeed, setSimSpeed] = useState<number>(2);
  const [navPosition, setNavPosition] = useState<[number, number] | null>(null);

  // Modal State
  const [isItineraryOpen, setIsItineraryOpen] = useState<boolean>(false);
  const [isPrintReportOpen, setIsPrintReportOpen] = useState<boolean>(false);

  // Distance Calculation
  const distanceKm = useMemo(() => {
    return calculateDistanceKm(origin.lat, origin.lng, destination.lat, destination.lng);
  }, [origin, destination]);

  // Generate Personalized Karnataka Itinerary
  const personalizedItinerary: PersonalizedItinerary = useMemo(() => {
    return generatePersonalizedKarnatakaItinerary(
      selectedInterests,
      selectedDuration,
      selectedBudget,
      selectedExperience,
      origin,
      destination
    );
  }, [selectedInterests, selectedDuration, selectedBudget, selectedExperience, origin, destination]);

  // Synchronize target budget with selected budget tier
  useEffect(() => {
    if (selectedBudget === 'budget') {
      setMaxBudgetInr(3500);
    } else if (selectedBudget === 'moderate') {
      setMaxBudgetInr(7500);
    } else {
      setMaxBudgetInr(18000);
    }
  }, [selectedBudget]);

  // Fetch Destination Weather & Attire Advisory
  useEffect(() => {
    let isMounted = true;
    setIsWeatherLoading(true);
    fetchDestinationWeather(destination)
      .then((data) => {
        if (isMounted) {
          setWeather(data);
          setIsWeatherLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsWeatherLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [destination]);

  const handleRefreshWeather = () => {
    setIsWeatherLoading(true);
    fetchDestinationWeather(destination).then((data) => {
      setWeather(data);
      setIsWeatherLoading(false);
    });
  };

  // Generate dynamic travel options based on distance
  const allTravelOptions = useMemo(() => {
    return generateTravelOptions(origin, destination);
  }, [origin, destination]);

  // Filter options by transport mode
  const filteredTravelOptions = useMemo(() => {
    if (selectedModeFilter === 'all') return allTravelOptions;
    return allTravelOptions.filter((opt) => opt.mode === selectedModeFilter || opt.mode === 'multi');
  }, [allTravelOptions, selectedModeFilter]);

  // Ensure active selected option
  useEffect(() => {
    if (filteredTravelOptions.length > 0) {
      const exists = filteredTravelOptions.some((o) => o.id === selectedOptionId);
      if (!exists) {
        setSelectedOptionId(filteredTravelOptions[0].id);
      }
    }
  }, [filteredTravelOptions, selectedOptionId]);

  const selectedOption: TravelOption | null = useMemo(() => {
    return (
      allTravelOptions.find((o) => o.id === selectedOptionId) ||
      filteredTravelOptions[0] ||
      allTravelOptions[0] ||
      null
    );
  }, [allTravelOptions, filteredTravelOptions, selectedOptionId]);

  // Facilities near destination
  const facilities = useMemo(() => {
    return getFacilitiesNearLocation(destination);
  }, [destination]);

  // Default facility selections
  useEffect(() => {
    const defaultHotel = facilities.find((f) => f.type === 'hostel' || f.type === 'hotel');
    const defaultDine = facilities.find((f) => f.type === 'restaurant' || f.type === 'cafe');
    if (defaultHotel && selectedHotelIds.length === 0) {
      setSelectedHotelIds([defaultHotel.id]);
    }
    if (defaultDine && selectedDiningIds.length === 0) {
      setSelectedDiningIds([defaultDine.id]);
    }
  }, [facilities]);

  // Synchronize navigation coordinates along path
  useEffect(() => {
    if (!selectedOption || selectedOption.pathCoordinates.length === 0) {
      setNavPosition([origin.lat, origin.lng]);
      return;
    }

    const path = selectedOption.pathCoordinates;
    const totalPoints = path.length;
    const targetIdx = Math.min(
      totalPoints - 1,
      Math.floor(simulatedProgress * (totalPoints - 1))
    );
    setNavPosition(path[targetIdx]);

    const stepsCount = selectedOption.navigationSteps.length;
    if (stepsCount > 0) {
      const currentStep = Math.min(
        stepsCount - 1,
        Math.floor(simulatedProgress * stepsCount)
      );
      setNavStepIndex(currentStep);
    }
  }, [simulatedProgress, selectedOption, origin]);

  // Simulation timer loop
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isNavigating || !isPlayingNav) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      lastTimeRef.current = null;
      return;
    }

    const loop = (timestamp: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }
      const delta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      const increment = (delta / 45) * simSpeed;

      setSimulatedProgress((prev) => {
        const next = prev + increment;
        if (next >= 1) {
          setIsPlayingNav(false);
          return 1;
        }
        return next;
      });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isNavigating, isPlayingNav, simSpeed]);

  // Navigation handlers
  const handleStartNavigation = (optionId?: string) => {
    if (optionId) setSelectedOptionId(optionId);
    setIsNavigating(true);
    setIsPlayingNav(true);
    setSimulatedProgress(0);
    setNavStepIndex(0);
    const navElem = document.getElementById('navigation-section');
    if (navElem) {
      navElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTogglePlay = () => {
    setIsPlayingNav((prev) => !prev);
  };

  const handleNextStep = () => {
    if (!selectedOption) return;
    const stepsCount = selectedOption.navigationSteps.length;
    const nextIdx = Math.min(stepsCount - 1, navStepIndex + 1);
    setNavStepIndex(nextIdx);
    setSimulatedProgress(nextIdx / (stepsCount - 1 || 1));
  };

  const handleResetNav = () => {
    setSimulatedProgress(0);
    setNavStepIndex(0);
    setIsPlayingNav(true);
  };

  const handleStopNav = () => {
    setIsNavigating(false);
    setIsPlayingNav(false);
    setSimulatedProgress(0);
  };

  // Interest toggle
  const handleToggleInterest = (interest: TravellerInterest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.length > 1
          ? prev.filter((i) => i !== interest)
          : prev
        : [...prev, interest]
    );
  };

  // Facility selection toggles
  const handleToggleFacility = (facility: Facility) => {
    if (facility.type === 'hotel' || facility.type === 'hostel') {
      setSelectedHotelIds((prev) =>
        prev.includes(facility.id) ? prev.filter((id) => id !== facility.id) : [...prev, facility.id]
      );
    } else {
      setSelectedDiningIds((prev) =>
        prev.includes(facility.id) ? prev.filter((id) => id !== facility.id) : [...prev, facility.id]
      );
    }
  };

  // Preset circuit selector
  const handleSelectPresetCircuit = (circuitId: string) => {
    const circuit = KARNATAKA_CIRCUIT_PRESETS.find((c) => c.id === circuitId);
    if (!circuit) return;

    const org = KARNATAKA_LOCATIONS.find((l) => l.id === circuit.originId);
    const dest = KARNATAKA_LOCATIONS.find((l) => l.id === circuit.destinationId);

    if (org && dest) {
      setOrigin(org);
      setDestination(dest);
      handleStopNav();
    }
  };

  const handleSwapLocations = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
    handleStopNav();
  };

  // Smart Karnataka Budget Optimizer
  const handleOptimizeForBudget = () => {
    const cheapest = [...allTravelOptions].sort((a, b) => a.costInr - b.costInr)[0];
    if (cheapest) setSelectedOptionId(cheapest.id);

    const cheapStay = facilities
      .filter((f) => f.type === 'hotel' || f.type === 'hostel')
      .sort((a, b) => a.priceInr - b.priceInr)[0];
    if (cheapStay) setSelectedHotelIds([cheapStay.id]);

    const cheapDine = facilities
      .filter((f) => f.type === 'restaurant' || f.type === 'cafe')
      .sort((a, b) => a.priceInr - b.priceInr)[0];
    if (cheapDine) setSelectedDiningIds([cheapDine.id]);
  };

  // Comfort Optimizer
  const handleOptimizeForComfort = () => {
    const comfiest = [...allTravelOptions].sort((a, b) => b.comfortScore - a.comfortScore)[0];
    if (comfiest) setSelectedOptionId(comfiest.id);

    const comfiestStay = facilities
      .filter((f) => f.type === 'hotel' || f.type === 'hostel')
      .sort((a, b) => b.rating - a.rating)[0];
    if (comfiestStay) setSelectedHotelIds([comfiestStay.id]);

    const bestDine = facilities
      .filter((f) => f.type === 'restaurant' || f.type === 'cafe')
      .sort((a, b) => b.rating - a.rating)[0];
    if (bestDine) setSelectedDiningIds([bestDine.id]);
  };

  const selectedFacilities = useMemo(() => {
    return facilities.filter(
      (f) => selectedHotelIds.includes(f.id) || selectedDiningIds.includes(f.id)
    );
  }, [facilities, selectedHotelIds, selectedDiningIds]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Bar Contract: 3 zones, 1 line, brand wordmark - nav links - 1 primary CTA */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="/"
            className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shadow-amber-600/30">
              KA
            </div>
            <span>OmniVoyage Karnataka</span>
          </a>

          {/* Zone 2: 4-5 concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#weather-forecast" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              Weather & Attire
            </a>
            <a href="#personalizer" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              Personalizer
            </a>
            <a href="#itinerary-view" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              Day-by-Day Plan
            </a>
            <a href="#transit-options" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              Karnataka Transit
            </a>
            <a href="#facilities-section" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              Stays & Dining
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsPrintReportOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-xs"
              title="Export itinerary and transit plan as printable PDF report"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Export PDF Report</span>
            </button>

            <button
              onClick={() => setIsItineraryOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 shadow-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Complete Itinerary</span>
              {(selectedHotelIds.length > 0 || selectedDiningIds.length > 0) && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-mono">
                  {selectedHotelIds.length + selectedDiningIds.length + (selectedOption ? 1 : 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header Introduction */}
        <section>
          <div className="mb-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1">
              <span>One State, Many Worlds</span>
              <span aria-hidden="true">·</span>
              <span>Karnataka Tourism Planner</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight text-balance">
              Personalized Karnataka Itineraries & Multi-Modal Transit
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Customized travel across Bengaluru, Mysuru, Hampi, Coorg, Chikkamagaluru, and Gokarna.
              Intelligently comparing Namma Metro, Yulu bikes, KSRTC Airavat buses, Vande Bharat trains,
              and regional flights with authentic local stays and dining.
            </p>
          </div>

          {/* Search Header */}
          <RouteSearchHeader
            origin={origin}
            destination={destination}
            onSelectOrigin={(loc) => {
              setOrigin(loc);
              handleStopNav();
            }}
            onSelectDestination={(loc) => {
              setDestination(loc);
              handleStopNav();
            }}
            onSwapLocations={handleSwapLocations}
            travelDate={travelDate}
            onChangeDate={setTravelDate}
            travelersCount={travelersCount}
            onChangeTravelers={setTravelersCount}
            stayNights={stayNights}
            onChangeStayNights={setStayNights}
            currency={currency}
            onChangeCurrency={setCurrency}
            selectedModeFilter={selectedModeFilter}
            onChangeModeFilter={setSelectedModeFilter}
            onSelectPresetJourney={handleSelectPresetCircuit}
            distanceKm={distanceKm}
          />
        </section>

        {/* Destination Weather Forecast & Attire Advisory */}
        <section id="weather-forecast" className="scroll-mt-20">
          <WeatherForecastCard
            weather={weather}
            location={destination}
            isLoading={isWeatherLoading}
            onRefresh={handleRefreshWeather}
          />
        </section>

        {/* Personalization Preferences Panel */}
        <section id="personalizer" className="scroll-mt-20">
          <PersonalizationPanel
            selectedInterests={selectedInterests}
            onToggleInterest={handleToggleInterest}
            selectedDuration={selectedDuration}
            onChangeDuration={setSelectedDuration}
            selectedBudget={selectedBudget}
            onChangeBudget={setSelectedBudget}
            selectedExperience={selectedExperience}
            onChangeExperience={setSelectedExperience}
            onApplyPreferences={() => {
              const viewElem = document.getElementById('itinerary-view');
              if (viewElem) viewElem.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </section>

        {/* Personalized Itinerary Day-by-Day Card */}
        <section id="itinerary-view" className="scroll-mt-20">
          <PersonalizedItineraryView
            itinerary={personalizedItinerary}
            currency={currency}
            onStartRouteNavigation={() => handleStartNavigation()}
            onExportPdfReport={() => setIsPrintReportOpen(true)}
          />
        </section>

        {/* Real-Time Live Navigation Controller Banner (When Active) */}
        {isNavigating && selectedOption && (
          <section id="navigation-section" className="scroll-mt-20">
            <NavigationController
              selectedOption={selectedOption}
              isNavigating={isNavigating}
              navStepIndex={navStepIndex}
              simulatedProgress={simulatedProgress}
              onTogglePlay={handleTogglePlay}
              isPlaying={isPlayingNav}
              simSpeed={simSpeed}
              onSetSpeed={setSimSpeed}
              onNextStep={handleNextStep}
              onResetNav={handleResetNav}
              onStopNav={handleStopNav}
            />
          </section>
        )}

        {/* 2-Column Split: Interactive Map & Travel Options */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Interactive Map Viewport (7 cols) */}
          <div id="interactive-map" className="lg:col-span-7 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Karnataka Route & Transit Map
                </h2>
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <span>{origin.name}</span>
                  <span aria-hidden="true">→</span>
                  <span>{destination.name}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">{distanceKm} km</span>
                </div>
              </div>

              {!isNavigating && selectedOption && (
                <button
                  onClick={() => handleStartNavigation()}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Navigation className="w-3.5 h-3.5 fill-current" />
                  <span>Start Turn-by-Turn</span>
                </button>
              )}
            </div>

            {/* Map Container */}
            <div className="flex-1 min-h-[460px] relative">
              <InteractiveMap
                origin={origin}
                destination={destination}
                selectedOption={selectedOption}
                facilities={facilities}
                isNavigating={isNavigating}
                navPosition={navPosition}
                navStepIndex={navStepIndex}
                onSelectFacility={handleToggleFacility}
                selectedHotelIds={selectedHotelIds}
                selectedDiningIds={selectedDiningIds}
              />
            </div>
          </div>

          {/* Right Column: Distance-Adaptive Travel Options (5 cols) */}
          <div id="transit-options" className="lg:col-span-5 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Karnataka Travel Options
                </h2>
                <p className="text-xs text-slate-500">
                  Calculated for {distanceKm} km route ({filteredTravelOptions.length} available)
                </p>
              </div>

              <span className="text-[11px] font-mono font-medium text-slate-500">
                Sorted by Value & Speed
              </span>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[580px] pr-1">
              {filteredTravelOptions.map((option) => (
                <TravelOptionCard
                  key={option.id}
                  option={option}
                  isSelected={selectedOption?.id === option.id}
                  currency={currency}
                  onSelect={() => setSelectedOptionId(option.id)}
                  onStartNavigation={() => handleStartNavigation(option.id)}
                />
              ))}

              {filteredTravelOptions.length === 0 && (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
                  <Compass className="w-8 h-8 text-slate-400 mx-auto" />
                  <div className="font-semibold text-slate-800 text-sm">
                    No options found for mode "{selectedModeFilter}"
                  </div>
                  <p className="text-xs text-slate-500">
                    Switch to "All Modes" to view Metro, Train, KSRTC Bus, Bike, and Flight options.
                  </p>
                  <button
                    onClick={() => setSelectedModeFilter('all')}
                    className="mt-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg"
                  >
                    Reset Filter
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Budget Optimizer & Cost Breakdown */}
        <section id="budget-optimizer">
          <BudgetOptimizer
            selectedOption={selectedOption}
            selectedFacilities={selectedFacilities}
            currency={currency}
            travelersCount={travelersCount}
            stayNights={stayNights}
            maxBudgetInr={maxBudgetInr}
            onOptimizeForBudget={handleOptimizeForBudget}
            onOptimizeForComfort={handleOptimizeForComfort}
          />
        </section>

        {/* Facilities Section: Stays & Dining */}
        <section id="facilities-section">
          <FacilitiesSection
            facilities={facilities}
            currency={currency}
            selectedHotelIds={selectedHotelIds}
            selectedDiningIds={selectedDiningIds}
            onToggleFacility={handleToggleFacility}
            destinationCity={destination.city}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">OmniVoyage Karnataka</span>
            <span>·</span>
            <span>Personalized itineraries across Old Mysuru, Malnad, Karavali & Vijayanagara</span>
          </div>

          <div className="flex items-center gap-4">
            <span>Live Karnataka GPS Simulation</span>
            <span>·</span>
            <span>KSRTC & Namma Metro Routing</span>
            <span>·</span>
            <span>Eco-mobility Priority</span>
          </div>
        </div>
      </footer>

      {/* Complete Itinerary Modal */}
      <ItineraryModal
        isOpen={isItineraryOpen}
        onClose={() => setIsItineraryOpen(false)}
        origin={origin}
        destination={destination}
        travelDate={travelDate}
        travelersCount={travelersCount}
        stayNights={stayNights}
        currency={currency}
        selectedOption={selectedOption}
        selectedFacilities={selectedFacilities}
        onOpenPrintableReport={() => {
          setIsItineraryOpen(false);
          setIsPrintReportOpen(true);
        }}
      />

      {/* Printable PDF Report Modal & Document Preview */}
      <PrintableReportModal
        isOpen={isPrintReportOpen}
        onClose={() => setIsPrintReportOpen(false)}
        origin={origin}
        destination={destination}
        travelDate={travelDate}
        travelersCount={travelersCount}
        stayNights={stayNights}
        currency={currency}
        selectedOption={selectedOption}
        selectedFacilities={selectedFacilities}
        personalizedItinerary={personalizedItinerary}
        weather={weather}
      />
    </div>
  );
}
