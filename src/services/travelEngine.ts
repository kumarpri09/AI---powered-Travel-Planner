/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LocationPoint, NavigationStep, TransitLeg, TransportMode, TravelOption } from '../types/travel';

// Haversine formula to compute great-circle distance between two points in km
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Generate intermediate coordinates along a path with realistic curvature
function generatePathCoordinates(
  from: [number, number],
  to: [number, number],
  stepsCount: number = 8,
  deviationFactor: number = 0.07
): [number, number][] {
  const coords: [number, number][] = [];
  coords.push(from);

  const [lat1, lng1] = from;
  const [lat2, lng2] = to;

  const dLat = lat2 - lat1;
  const dLng = lng2 - lng1;
  const perpLat = -dLng * deviationFactor;
  const perpLng = dLat * deviationFactor;

  for (let i = 1; i < stepsCount; i++) {
    const t = i / stepsCount;
    const curveT = Math.sin(t * Math.PI);
    const lat = lat1 + t * dLat + curveT * perpLat + Math.sin(i * 1.5) * 0.003;
    const lng = lng1 + t * dLng + curveT * perpLng + Math.cos(i * 1.5) * 0.003;
    coords.push([Number(lat.toFixed(6)), Number(lng.toFixed(6))]);
  }

  coords.push(to);
  return coords;
}

export function generateTravelOptions(origin: LocationPoint, destination: LocationPoint): TravelOption[] {
  const distance = Math.max(1.2, calculateDistanceKm(origin.lat, origin.lng, destination.lat, destination.lng));
  const options: TravelOption[] = [];

  const originCoords: [number, number] = [origin.lat, origin.lng];
  const destCoords: [number, number] = [destination.lat, destination.lng];

  // 1. SHORT / URBAN DISTANCE (under 25 km, e.g. within Bengaluru / Mysuru / Hampi local)
  if (distance <= 25) {
    const metroMinutes = Math.round(10 + distance * 1.9);
    const metroPath = generatePathCoordinates(originCoords, destCoords, 10, 0.03);

    // 1A. Namma Metro / Rapid Urban Transit
    options.push({
      id: 'opt-karnataka-metro',
      title: 'Namma Metro Rapid Line',
      mode: 'metro',
      category: 'fastest',
      distanceKm: distance,
      durationMinutes: metroMinutes,
      costInr: Math.round(20 + distance * 1.2),
      costUsd: Number(((20 + distance * 1.2) / 86.5).toFixed(2)),
      comfortScore: 9.1,
      co2Kg: Number((distance * 0.015).toFixed(2)),
      transfersCount: 0,
      frequencyText: 'Every 4-6 mins (05:00 - 23:00)',
      operator: 'Bangalore Metro Rail Corporation (BMRCL)',
      highlights: [
        'Completely avoids Bangalore city traffic jams',
        'Air-conditioned smartcard or WhatsApp QR ticket',
        'Direct connection to Majestic & MG Road',
        'Safe, fast, and 99.8% punctual',
      ],
      reliability: 'Very High',
      localTip: 'Use Namma Metro WhatsApp QR ticketing (+91 81055 56677) to skip station counter queues.',
      pathCoordinates: metroPath,
      navigationSteps: [
        {
          id: 'step-km-1',
          instruction: `Enter ${origin.name} via Gate 2 Underground Concourse`,
          mode: 'walk',
          distanceMeters: 200,
          durationMinutes: 3,
          maneuver: 'depart',
          lat: metroPath[0][0],
          lng: metroPath[0][1],
          co2Grams: 0,
        },
        {
          id: 'step-km-2',
          instruction: `Tap QR token at automated AFC gate and board Purple Line toward ${destination.name.split(' ')[0]}`,
          mode: 'metro',
          stationOrLine: 'Namma Metro Line (Platform 1)',
          distanceMeters: Math.round(distance * 850),
          durationMinutes: metroMinutes - 6,
          maneuver: 'board',
          lat: metroPath[2][0],
          lng: metroPath[2][1],
          co2Grams: Math.round(distance * 15),
        },
        {
          id: 'step-km-3',
          instruction: `Alight at ${destination.name} Station, follow signage for Exit A`,
          mode: 'metro',
          distanceMeters: 50,
          durationMinutes: 2,
          maneuver: 'exit',
          lat: metroPath[metroPath.length - 2][0],
          lng: metroPath[metroPath.length - 2][1],
          co2Grams: 0,
        },
        {
          id: 'step-km-4',
          instruction: `Walk 150m to destination entrance`,
          mode: 'walk',
          distanceMeters: 150,
          durationMinutes: 2,
          maneuver: 'arrive',
          lat: destCoords[0],
          lng: destCoords[1],
          co2Grams: 0,
        },
      ],
      legs: [
        {
          id: 'leg-km-1',
          mode: 'walk',
          title: 'Walk to Metro Concourse',
          fromName: origin.name,
          toName: `${origin.city} Metro Station`,
          departureTime: '08:30',
          arrivalTime: '08:33',
          durationMinutes: 3,
          distanceKm: 0.2,
          costInr: 0,
          costUsd: 0,
          co2Kg: 0,
        },
        {
          id: 'leg-km-2',
          mode: 'metro',
          title: 'Namma Metro Direct Segment',
          lineCode: 'Purple Line',
          fromName: `${origin.city} Station`,
          toName: destination.name,
          departureTime: '08:35',
          arrivalTime: `08:${String(35 + metroMinutes - 6).padStart(2, '0')}`,
          durationMinutes: metroMinutes - 6,
          distanceKm: distance * 0.9,
          stopsCount: Math.max(3, Math.round(distance * 0.7)),
          costInr: Math.round(20 + distance * 1.2),
          costUsd: Number(((20 + distance * 1.2) / 86.5).toFixed(2)),
          co2Kg: Number((distance * 0.015).toFixed(2)),
        },
      ],
    });

    // 1B. Yulu Miracle E-Bike / Hampi Bicycle Rental
    const bikeMinutes = Math.round(distance * 4.4);
    const bikePath = generatePathCoordinates(originCoords, destCoords, 14, 0.08);
    options.push({
      id: 'opt-karnataka-bike',
      title: 'Yulu Electric Bike / Local Cycle Trail',
      mode: 'bike',
      category: 'eco',
      distanceKm: Number((distance * 1.08).toFixed(1)),
      durationMinutes: bikeMinutes,
      costInr: Math.round(35 + distance * 4.5),
      costUsd: Number(((35 + distance * 4.5) / 86.5).toFixed(2)),
      comfortScore: 8.2,
      co2Kg: 0.0,
      transfersCount: 0,
      frequencyText: 'Instant on-demand unlock at Yulu zones',
      operator: 'Yulu Smart Mobility / Local Cycle Rental',
      highlights: [
        '100% Zero carbon emission',
        'Pedal-assist motor up to 25 km/h',
        'Perfect for exploring Hampi ruins or Cubbon Park',
        'No driver license required',
      ],
      reliability: 'High',
      localTip: 'In Hampi, rent geared bicycles at Virupaksha bazaar for ₹100/day to tour temples at leisure.',
      pathCoordinates: bikePath,
      navigationSteps: [
        {
          id: 'step-kb-1',
          instruction: `Scan QR code to unlock E-Bike at ${origin.name} Yulu Zone`,
          mode: 'bike',
          distanceMeters: 20,
          durationMinutes: 1,
          maneuver: 'depart',
          lat: bikePath[0][0],
          lng: bikePath[0][1],
          co2Grams: 0,
        },
        {
          id: 'step-kb-2',
          instruction: `Glide along dedicated boulevard cycle track / heritage lane`,
          mode: 'bike',
          distanceMeters: Math.round(distance * 900),
          durationMinutes: bikeMinutes - 3,
          maneuver: 'straight',
          lat: bikePath[6][0],
          lng: bikePath[6][1],
          co2Grams: 0,
        },
        {
          id: 'step-kb-3',
          instruction: `End trip and lock bike inside ${destination.name} designated dock`,
          mode: 'bike',
          distanceMeters: 50,
          durationMinutes: 2,
          maneuver: 'arrive',
          lat: destCoords[0],
          lng: destCoords[1],
          co2Grams: 0,
        },
      ],
      legs: [
        {
          id: 'leg-kb-1',
          mode: 'bike',
          title: 'Electric Cycle Commute',
          fromName: `${origin.name} Yulu Zone`,
          toName: `${destination.name} Hub`,
          departureTime: '09:00',
          arrivalTime: `09:${String(bikeMinutes).padStart(2, '0')}`,
          durationMinutes: bikeMinutes,
          distanceKm: distance * 1.08,
          costInr: Math.round(35 + distance * 4.5),
          costUsd: Number(((35 + distance * 4.5) / 86.5).toFixed(2)),
          co2Kg: 0,
        },
      ],
    });

    // 1C. BMTC City Bus / Vajra Volvo AC
    const busMinutes = Math.round(15 + distance * 2.8);
    const busPath = generatePathCoordinates(originCoords, destCoords, 12, 0.05);
    options.push({
      id: 'opt-karnataka-bus-city',
      title: 'BMTC Vajra AC Bus / Ordinary City Bus',
      mode: 'bus',
      category: 'cheapest',
      distanceKm: distance,
      durationMinutes: busMinutes,
      costInr: Math.round(18 + distance * 1.1),
      costUsd: Number(((18 + distance * 1.1) / 86.5).toFixed(2)),
      comfortScore: 7.8,
      co2Kg: Number((distance * 0.022).toFixed(2)),
      transfersCount: 0,
      frequencyText: 'Every 7-10 mins',
      operator: 'Bangalore Metropolitan Transport Corp (BMTC)',
      highlights: [
        'Extremely economical flat ticket pricing',
        'Vajra Volvo AC option with wide panoramic windows',
        'Bus priority corridors across major avenues',
        'UPI / Tummoc digital bus pass accepted',
      ],
      reliability: 'High',
      localTip: 'Buy a BMTC Daily Gold Pass (₹70 ordinary / ₹120 AC) for unlimited rides all day across the city.',
      pathCoordinates: busPath,
      navigationSteps: [
        {
          id: 'step-kbc-1',
          instruction: `Board BMTC Bus at ${origin.name} Bus Stand`,
          mode: 'bus',
          stationOrLine: 'Route #335-E / #201',
          distanceMeters: 50,
          durationMinutes: 2,
          maneuver: 'board',
          lat: busPath[0][0],
          lng: busPath[0][1],
          co2Grams: 0,
        },
        {
          id: 'step-kbc-2',
          instruction: `Ride through city corridor with audio bus stop announcements`,
          mode: 'bus',
          distanceMeters: Math.round(distance * 950),
          durationMinutes: busMinutes - 4,
          maneuver: 'straight',
          lat: busPath[5][0],
          lng: busPath[5][1],
          co2Grams: Math.round(distance * 22),
        },
        {
          id: 'step-kbc-3',
          instruction: `Alight at ${destination.name} Main Gate stop`,
          mode: 'bus',
          distanceMeters: 50,
          durationMinutes: 2,
          maneuver: 'arrive',
          lat: destCoords[0],
          lng: destCoords[1],
          co2Grams: 0,
        },
      ],
      legs: [
        {
          id: 'leg-kbc-1',
          mode: 'bus',
          title: 'BMTC City Transit Route',
          lineCode: 'BMTC Bus #335-E',
          fromName: origin.name,
          toName: destination.name,
          departureTime: '08:45',
          arrivalTime: `09:${String(45 + busMinutes - 60).padStart(2, '0')}`,
          durationMinutes: busMinutes,
          distanceKm: distance,
          costInr: Math.round(18 + distance * 1.1),
          costUsd: Number(((18 + distance * 1.1) / 86.5).toFixed(2)),
          co2Kg: Number((distance * 0.022).toFixed(2)),
        },
      ],
    });
  }

  // 2. MEDIUM DISTANCE (25 km - 220 km, e.g. Bengaluru to Mysuru, Mysuru to Coorg)
  else if (distance <= 220) {
    // 2A. Vande Bharat Express & Superfast Rail
    const railMinutes = Math.round(30 + distance * 0.52);
    const railPath = generatePathCoordinates(originCoords, destCoords, 18, 0.04);
    const trainCostInr = Math.round(180 + distance * 2.2);

    options.push({
      id: 'opt-karnataka-train-vb',
      title: 'Vande Bharat / Chamundi Superfast Express',
      mode: 'train',
      category: 'fastest',
      distanceKm: distance,
      durationMinutes: railMinutes,
      costInr: trainCostInr,
      costUsd: Number((trainCostInr / 86.5).toFixed(2)),
      comfortScore: 9.6,
      co2Kg: Number((distance * 0.018).toFixed(2)),
      transfersCount: 0,
      frequencyText: '8 daily departures (including Vande Bharat at 05:45 & 14:20)',
      operator: 'South Western Railway (SWR)',
      highlights: [
        'Fastest connection: Bengaluru to Mysuru in just 1h 45m',
        'Aerodynamic semi-high speed train with 180° revolving seats',
        'Complimentary South Indian breakfast (idli-vada-coffee on VB)',
        'City-center to city-center with zero expressway toll delays',
      ],
      reliability: 'Very High',
      localTip: 'For spontaneous travel, regular MEMU / Chamundi Express unreserved tickets cost only ₹65 at UTS counters.',
      pathCoordinates: railPath,
      navigationSteps: [
        {
          id: 'step-ktr-1',
          instruction: `Arrive at KSR Bengaluru Station Platform 1 (Main Concourse)`,
          mode: 'walk',
          distanceMeters: 250,
          durationMinutes: 5,
          maneuver: 'depart',
          lat: railPath[0][0],
          lng: railPath[0][1],
          co2Grams: 0,
        },
        {
          id: 'step-ktr-2',
          instruction: `Board Vande Bharat / Superfast Express toward ${destination.city}`,
          mode: 'train',
          stationOrLine: 'Train #20607 Vande Bharat Express',
          distanceMeters: Math.round(distance * 980),
          durationMinutes: railMinutes - 10,
          maneuver: 'board',
          lat: railPath[4][0],
          lng: railPath[4][1],
          co2Grams: Math.round(distance * 18),
        },
        {
          id: 'step-ktr-3',
          instruction: `Arrive at ${destination.name} Platform 1; exit to Palace Gate`,
          mode: 'walk',
          distanceMeters: 100,
          durationMinutes: 5,
          maneuver: 'arrive',
          lat: destCoords[0],
          lng: destCoords[1],
          co2Grams: 0,
        },
      ],
      legs: [
        {
          id: 'leg-ktr-1',
          mode: 'train',
          title: 'Semi-High Speed Express Corridor',
          lineCode: 'VB-20607',
          fromName: `${origin.city} Central Station`,
          toName: `${destination.city} Junction`,
          departureTime: '06:00',
          arrivalTime: `07:${String(45).padStart(2, '0')}`,
          durationMinutes: railMinutes,
          distanceKm: distance,
          costInr: trainCostInr,
          costUsd: Number((trainCostInr / 86.5).toFixed(2)),
          co2Kg: Number((distance * 0.018).toFixed(2)),
        },
      ],
    });

    // 2B. KSRTC Airavat Club Class / EV Electric Bus (via 10-Lane Expressway)
    const busMinutes = Math.round(35 + distance * 0.72);
    const busPath = generatePathCoordinates(originCoords, destCoords, 16, 0.06);
    const ksrtcBusCostInr = Math.round(140 + distance * 1.6);

    options.push({
      id: 'opt-karnataka-ksrtc-airavat',
      title: 'KSRTC Airavat Club Class / EV-Electric Bus',
      mode: 'bus',
      category: 'comfort',
      distanceKm: distance,
      durationMinutes: busMinutes,
      costInr: ksrtcBusCostInr,
      costUsd: Number((ksrtcBusCostInr / 86.5).toFixed(2)),
      comfortScore: 9.0,
      co2Kg: Number((distance * 0.024).toFixed(2)),
      transfersCount: 0,
      frequencyText: 'Every 15 mins from Satellite Bus Stand (Mysore Road)',
      operator: 'Karnataka State Road Transport Corporation (KSRTC)',
      highlights: [
        'Cruises along the new 10-lane Bangalore-Mysore Expressway',
        'Quiet electric motor with ergonomic reclining seats',
        'Air-conditioned cabin, mobile charging points & mineral water',
        'Direct non-stop service with zero mid-way local stops',
      ],
      reliability: 'Very High',
      localTip: 'Book on KSRTC Official App or ksrtc.in to get a 10% round-trip discount.',
      pathCoordinates: busPath,
      navigationSteps: [
        {
          id: 'step-kair-1',
          instruction: `Board KSRTC Bus at Satellite Bus Stand Platform 14`,
          mode: 'bus',
          stationOrLine: 'KSRTC Airavat Non-Stop',
          distanceMeters: 50,
          durationMinutes: 3,
          maneuver: 'board',
          lat: busPath[0][0],
          lng: busPath[0][1],
          co2Grams: 0,
        },
        {
          id: 'step-kair-2',
          instruction: `Cruising at 90 km/h along Bangalore-Mysore Expressway (NH 275)`,
          mode: 'bus',
          distanceMeters: Math.round(distance * 980),
          durationMinutes: busMinutes - 8,
          maneuver: 'straight',
          lat: busPath[6][0],
          lng: busPath[6][1],
          co2Grams: Math.round(distance * 24),
        },
        {
          id: 'step-kair-3',
          instruction: `Arrive at ${destination.name} Sub-Urban Bus Terminal`,
          mode: 'bus',
          distanceMeters: 50,
          durationMinutes: 5,
          maneuver: 'arrive',
          lat: destCoords[0],
          lng: destCoords[1],
          co2Grams: 0,
        },
      ],
      legs: [
        {
          id: 'leg-kair-1',
          mode: 'bus',
          title: 'Expressway Direct Airavat Transit',
          lineCode: 'Airavat-EV',
          fromName: origin.name,
          toName: destination.name,
          departureTime: '07:30',
          arrivalTime: `09:${String(30 + busMinutes - 120).padStart(2, '0')}`,
          durationMinutes: busMinutes,
          distanceKm: distance,
          costInr: ksrtcBusCostInr,
          costUsd: Number((ksrtcBusCostInr / 86.5).toFixed(2)),
          co2Kg: Number((distance * 0.024).toFixed(2)),
        },
      ],
    });

    // 2C. KSRTC Karnataka Sarige (Budget Champion Bus)
    const sarigeCostInr = Math.round(90 + distance * 0.95);
    options.push({
      id: 'opt-karnataka-ksrtc-sarige',
      title: 'KSRTC Karnataka Sarige (State Budget Bus)',
      mode: 'bus',
      category: 'cheapest',
      distanceKm: distance,
      durationMinutes: Math.round(busMinutes * 1.2),
      costInr: sarigeCostInr,
      costUsd: Number((sarigeCostInr / 86.5).toFixed(2)),
      comfortScore: 7.2,
      co2Kg: Number((distance * 0.030).toFixed(2)),
      transfersCount: 0,
      frequencyText: 'Every 10 mins from Kempegowda Bus Station (Majestic)',
      operator: 'KSRTC Karnataka Sarige',
      highlights: [
        'Most affordable travel in Karnataka (under ₹200 for 140 km)',
        'Shakti Scheme free travel eligible for women with Karnataka domicile',
        'Stops at famous wayside food spots like Ramanagara & Maddur (Maddur Vada)',
        'Frequent point-to-point departures without advance booking needed',
      ],
      reliability: 'High',
      localTip: 'Hop on at Majestic; grab fresh hot Maddur Vade during the 5-minute depot tea stop.',
      pathCoordinates: busPath,
      navigationSteps: [
        {
          id: 'step-ksar-1',
          instruction: `Board Karnataka Sarige (Red Bus) at Majestic Terminal 2`,
          mode: 'bus',
          stationOrLine: 'KSRTC Sarige Express',
          distanceMeters: 50,
          durationMinutes: 3,
          maneuver: 'board',
          lat: busPath[0][0],
          lng: busPath[0][1],
          co2Grams: 0,
        },
        {
          id: 'step-ksar-2',
          instruction: `Travel through heritage towns of Bidadi, Ramanagara and Mandya`,
          mode: 'bus',
          distanceMeters: Math.round(distance * 980),
          durationMinutes: Math.round(busMinutes * 1.2) - 8,
          maneuver: 'straight',
          lat: busPath[7][0],
          lng: busPath[7][1],
          co2Grams: Math.round(distance * 30),
        },
        {
          id: 'step-ksar-3',
          instruction: `Arrive at ${destination.name} Central Stand`,
          mode: 'bus',
          distanceMeters: 50,
          durationMinutes: 5,
          maneuver: 'arrive',
          lat: destCoords[0],
          lng: destCoords[1],
          co2Grams: 0,
        },
      ],
      legs: [
        {
          id: 'leg-ksar-1',
          mode: 'bus',
          title: 'Karnataka Sarige Route',
          lineCode: 'Sarige-Red',
          fromName: origin.name,
          toName: destination.name,
          departureTime: '08:00',
          arrivalTime: `10:${String(45).padStart(2, '0')}`,
          durationMinutes: Math.round(busMinutes * 1.2),
          distanceKm: distance,
          costInr: sarigeCostInr,
          costUsd: Number((sarigeCostInr / 86.5).toFixed(2)),
          co2Kg: Number((distance * 0.030).toFixed(2)),
        },
      ],
    });
  }

  // 3. LONG INTERCITY DISTANCE (220 km - 600 km, e.g. Bengaluru to Hampi, Gokarna, Badami, Mangaluru)
  else {
    // 3A. Overnight Hampi Express / Karwar SF Sleeper Train
    const trainMinutes = Math.round(60 + distance * 1.15);
    const trainPath = generatePathCoordinates(originCoords, destCoords, 22, 0.05);
    const trainCostInr = Math.round(280 + distance * 1.2);

    options.push({
      id: 'opt-karnataka-overnight-train',
      title: 'Indian Railways Overnight Sleeper / Superfast Train',
      mode: 'train',
      category: 'cheapest',
      distanceKm: distance,
      durationMinutes: trainMinutes,
      costInr: trainCostInr,
      costUsd: Number((trainCostInr / 86.5).toFixed(2)),
      comfortScore: 8.8,
      co2Kg: Number((distance * 0.016).toFixed(2)),
      transfersCount: 0,
      frequencyText: 'Daily overnight service (departs ~21:45, arrives ~06:30)',
      operator: 'South Western Railway / Konkan Railway',
      highlights: [
        'OVERNIGHT TRAVEL SAVES A FULL HOTEL NIGHT STAY!',
        'Comfortable sleeping berth with fresh linens in AC coach',
        'Wake up fresh in the heart of Hampi (Hosapete) or Gokarna Road',
        'Authentic chai, hot samosas, and railway cutlets onboard',
      ],
      reliability: 'Very High',
      localTip: 'Book on IRCTC in advance for 3AC / Sleeper, or get Hosapete passenger ticket at Majestic counter.',
      pathCoordinates: trainPath,
      navigationSteps: [
        {
          id: 'step-lot-1',
          instruction: `Arrive at KSR Bengaluru Station Platform 4`,
          mode: 'walk',
          distanceMeters: 300,
          durationMinutes: 10,
          maneuver: 'depart',
          lat: trainPath[0][0],
          lng: trainPath[0][1],
          co2Grams: 0,
        },
        {
          id: 'step-lot-2',
          instruction: `Board Overnight Express (Train #16592 Hampi Express / #16595 Panchaganga)`,
          mode: 'train',
          stationOrLine: 'Train #16592 Overnight Express',
          distanceMeters: Math.round(distance * 990),
          durationMinutes: trainMinutes - 15,
          maneuver: 'board',
          lat: trainPath[6][0],
          lng: trainPath[6][1],
          co2Grams: Math.round(distance * 16),
        },
        {
          id: 'step-lot-3',
          instruction: `Arrive at destination railway concourse at sunrise`,
          mode: 'walk',
          distanceMeters: 100,
          durationMinutes: 5,
          maneuver: 'arrive',
          lat: destCoords[0],
          lng: destCoords[1],
          co2Grams: 0,
        },
      ],
      legs: [
        {
          id: 'leg-lot-1',
          mode: 'train',
          title: 'Overnight Sleeper Rail Route',
          lineCode: 'Hampi-Exp-16592',
          fromName: `${origin.city} KSR Station`,
          toName: `${destination.city} Junction`,
          departureTime: '21:50',
          arrivalTime: '06:40 (+1)',
          durationMinutes: trainMinutes,
          distanceKm: distance,
          costInr: trainCostInr,
          costUsd: Number((trainCostInr / 86.5).toFixed(2)),
          co2Kg: Number((distance * 0.016).toFixed(2)),
        },
      ],
    });

    // 3B. KSRTC Ambari Dream Class Luxury Sleeper Bus
    const ambariMinutes = Math.round(50 + distance * 1.25);
    const ambariPath = generatePathCoordinates(originCoords, destCoords, 20, 0.07);
    const ambariCostInr = Math.round(750 + distance * 1.4);

    options.push({
      id: 'opt-karnataka-ambari-sleeper',
      title: 'KSRTC Ambari Dream Class Luxury AC Sleeper',
      mode: 'bus',
      category: 'comfort',
      distanceKm: distance,
      durationMinutes: ambariMinutes,
      costInr: ambariCostInr,
      costUsd: Number((ambariCostInr / 86.5).toFixed(2)),
      comfortScore: 9.3,
      co2Kg: Number((distance * 0.026).toFixed(2)),
      transfersCount: 0,
      frequencyText: 'Daily departures between 20:30 and 22:30',
      operator: 'KSRTC Ambari Dream Class',
      highlights: [
        'Individual private sleeper pods with reading lights & USB chargers',
        'Scandinavian Volvo multi-axle air suspension for glass-smooth ride',
        'Drops right at Gokarna town, Hampi bus stand, or Madikeri center',
        'Clean sanitized blankets, water bottle, and shoe bags provided',
      ],
      reliability: 'Very High',
      localTip: 'Select Upper Deck Single Berth if traveling solo for complete privacy.',
      pathCoordinates: ambariPath,
      navigationSteps: [
        {
          id: 'step-amb-1',
          instruction: `Board Ambari Dream Class at Kempegowda Bus Station Platform 11`,
          mode: 'bus',
          stationOrLine: 'KSRTC Ambari Dream Class',
          distanceMeters: 50,
          durationMinutes: 5,
          maneuver: 'board',
          lat: ambariPath[0][0],
          lng: ambariPath[0][1],
          co2Grams: 0,
        },
        {
          id: 'step-amb-2',
          instruction: `Overnight highway cruise along National Highway corridor`,
          mode: 'bus',
          distanceMeters: Math.round(distance * 990),
          durationMinutes: ambariMinutes - 10,
          maneuver: 'straight',
          lat: ambariPath[9][0],
          lng: ambariPath[9][1],
          co2Grams: Math.round(distance * 26),
        },
        {
          id: 'step-amb-3',
          instruction: `Arrive directly in ${destination.city} center terminal`,
          mode: 'bus',
          distanceMeters: 50,
          durationMinutes: 5,
          maneuver: 'arrive',
          lat: destCoords[0],
          lng: destCoords[1],
          co2Grams: 0,
        },
      ],
      legs: [
        {
          id: 'leg-amb-1',
          mode: 'bus',
          title: 'Ambari Dream Class Sleeper',
          lineCode: 'Ambari-Express',
          fromName: origin.name,
          toName: destination.name,
          departureTime: '21:00',
          arrivalTime: '06:30 (+1)',
          durationMinutes: ambariMinutes,
          distanceKm: distance,
          costInr: ambariCostInr,
          costUsd: Number((ambariCostInr / 86.5).toFixed(2)),
          co2Kg: Number((distance * 0.026).toFixed(2)),
        },
      ],
    });

    // 3C. Budget Regional Flight (Star Air / IndiGo from Kempegowda Airport)
    if (distance >= 280) {
      const flightPath = generatePathCoordinates(originCoords, destCoords, 18, 0.12);
      const airMinutes = Math.round(45 + distance * 0.08);
      const totalFlightMinutes = airMinutes + 120; // 90 min airport check-in + 30 min arrival
      const flightCostInr = Math.round(2200 + distance * 2.8);

      options.push({
        id: 'opt-karnataka-regional-flight',
        title: 'Regional Budget Flight (IndiGo / Star Air)',
        mode: 'flight',
        category: 'fastest',
        distanceKm: distance,
        durationMinutes: totalFlightMinutes,
        costInr: flightCostInr,
        costUsd: Number((flightCostInr / 86.5).toFixed(2)),
        comfortScore: 8.9,
        co2Kg: Number((distance * 0.098).toFixed(2)),
        transfersCount: 0,
        frequencyText: '2 daily direct regional flights (BLR to IXE/HBX/IXG/VDY)',
        operator: 'IndiGo / Star Air (UDAN Regional Connectivity)',
        highlights: [
          'Fastest actual flight time: ~55 minutes airborne',
          'Operates from BLR Kempegowda Terminal 1 / Terminal 2',
          'Connecting to Mangaluru (IXE), Hubballi (HBX) & Vidyanagar/Hampi (VDY)',
          '7 kg cabin baggage + 15 kg check-in included',
        ],
        reliability: 'High',
        localTip: 'For Hampi, fly into Jindal Vidyanagar Airport (VDY) which is just 35 km from the ruins.',
        pathCoordinates: flightPath,
        navigationSteps: [
          {
            id: 'step-kfl-1',
            instruction: `Arrive at BLR Kempegowda Airport Terminal 1 Departures`,
            mode: 'walk',
            distanceMeters: 400,
            durationMinutes: 75,
            maneuver: 'depart',
            lat: flightPath[0][0],
            lng: flightPath[0][1],
            co2Grams: 0,
          },
          {
            id: 'step-kfl-2',
            instruction: `Board Regional Flight 6E / S5, cruising altitude 24,000 ft`,
            mode: 'flight',
            stationOrLine: 'Flight 6E-7119 Regional',
            distanceMeters: Math.round(distance * 1000),
            durationMinutes: airMinutes,
            maneuver: 'board',
            lat: flightPath[7][0],
            lng: flightPath[7][1],
            co2Grams: Math.round(distance * 98),
          },
          {
            id: 'step-kfl-3',
            instruction: `Touch down at destination regional airport, exit to taxi stand`,
            mode: 'walk',
            distanceMeters: 250,
            durationMinutes: 30,
            maneuver: 'arrive',
            lat: destCoords[0],
            lng: destCoords[1],
            co2Grams: 0,
          },
        ],
        legs: [
          {
            id: 'leg-kfl-1',
            mode: 'flight',
            title: `Direct Flight to ${destination.city}`,
            lineCode: '6E-7119',
            fromName: 'Bengaluru Airport (BLR)',
            toName: `${destination.city} Airport`,
            departureTime: '11:20',
            arrivalTime: `12:${String(20 + airMinutes - 60).padStart(2, '0')}`,
            durationMinutes: airMinutes,
            distanceKm: distance,
            costInr: flightCostInr,
            costUsd: Number((flightCostInr / 86.5).toFixed(2)),
            co2Kg: Number((distance * 0.098).toFixed(2)),
          },
        ],
      });
    }
  }

  return options;
}
