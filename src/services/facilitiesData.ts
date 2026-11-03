/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Facility, LocationPoint } from '../types/travel';

const HAMPI_IMG = '/src/assets/images/karnataka_hampi_ruins_1793685920060.jpg';
const COORG_IMG = '/src/assets/images/karnataka_coorg_coffee_1793685920108.jpg';
const PALACE_IMG = '/src/assets/images/karnataka_mysuru_palace_1793685919882.jpg';
const DOSA_IMG = '/src/assets/images/karnataka_dosa_dining_1793685919873.jpg';

export function getFacilitiesNearLocation(location: LocationPoint): Facility[] {
  const baseLat = location.lat;
  const baseLng = location.lng;
  const city = location.city;

  return [
    // 1. BUDGET BACKPACKER HOSTEL / POD BUNK
    {
      id: `fac-stay-hostel-${location.id}`,
      name: `Zostel & Heritage Bunks ${city}`,
      type: 'hostel',
      category: 'Backpacker Hostel / Pod',
      lat: baseLat + 0.0035,
      lng: baseLng - 0.0032,
      priceTier: '$',
      priceInr: 750,
      pricePerUnit: Number((750 / 86.5).toFixed(2)),
      rating: 4.8,
      reviewsCount: 2450,
      distanceKmFromDest: 0.5,
      address: `Near Temple Ghats & Station Road, ${city}`,
      image: HAMPI_IMG,
      amenities: [
        'Air-Conditioned Pod Bunk',
        'High-Speed Wi-Fi',
        'Bicycle Rentals on Spot (₹100/day)',
        'Rooftop Cafe & Jam Sessions',
        'Lockers & Luggage Cloakroom',
      ],
      description: 'Vibrant backpacker hub featuring clean air-conditioned pod beds, rooftop social zone, travel desk for boulder/cliff tours, and fast fiber Wi-Fi.',
      budgetFriendly: true,
      karnatakaSpecialty: 'Free guided morning heritage walk and cycle convoy tours.',
    },

    // 2. KSTDC GOVERNMENT HOTEL MAYURA (AUTHENTIC & HERITAGE PRICING)
    {
      id: `fac-stay-kstdc-${location.id}`,
      name: `KSTDC Hotel Mayura Heritage ${city}`,
      type: 'hotel',
      category: 'Govt Heritage Hotel (KSTDC)',
      lat: baseLat - 0.0042,
      lng: baseLng + 0.0038,
      priceTier: '$$',
      priceInr: 1650,
      pricePerUnit: Number((1650 / 86.5).toFixed(2)),
      rating: 4.7,
      reviewsCount: 1890,
      distanceKmFromDest: 0.8,
      address: `KSTDC Tourism Complex, Station Avenue, ${city}`,
      image: PALACE_IMG,
      amenities: [
        'Complimentary Karnataka Breakfast',
        'Direct KSRTC Sightseeing Bus Stop',
        'Spacious Heritage Garden Rooms',
        'Licensed Ayurvedic Spa',
        'Official Government Tourist Counter',
      ],
      description: 'Official Karnataka State Tourism Development Corporation hotel offering reliable comfort, lush gardens, authentic dining, and prime proximity to monuments.',
      budgetFriendly: true,
      karnatakaSpecialty: 'Book government guided city tour tickets directly from reception.',
    },

    // 3. COORG / CHIKMAGALUR COFFEE PLANTATION HOMESTAY
    {
      id: `fac-stay-homestay-${location.id}`,
      name: `Malnad Mist Coffee Estate Homestay`,
      type: 'hotel',
      category: 'Plantation Estate Homestay',
      lat: baseLat + 0.0068,
      lng: baseLng + 0.0055,
      priceTier: '$$',
      priceInr: 2800,
      pricePerUnit: Number((2800 / 86.5).toFixed(2)),
      rating: 4.9,
      reviewsCount: 1120,
      distanceKmFromDest: 2.1,
      address: `Silver Oak Estate, Western Ghats Ridge, ${city}`,
      image: COORG_IMG,
      amenities: [
        'Private Estate Wooden Cottage',
        'Fresh Plantation Coffee Tasting',
        'Homemade Kodava / Malnad Dinners',
        'Stream Trek & Birdwatching Trail',
        'Campfire under Stars',
      ],
      description: 'Tranquil cottage surrounded by Arabica coffee shrubs, pepper vines, and orange trees. Includes freshly brewed filter coffee and home-cooked regional feasts.',
      budgetFriendly: false,
      karnatakaSpecialty: 'Complimentary morning walk through working 40-acre coffee plantation.',
    },

    // 4. ICONIC KARNATAKA TIFFIN & DOSA HAVEN
    {
      id: `fac-dine-dosa-${location.id}`,
      name: `Original Hotel Mylari & CTR Tiffin Room`,
      type: 'restaurant',
      category: 'Authentic Karnataka Tiffin',
      lat: baseLat - 0.0019,
      lng: baseLng - 0.0016,
      priceTier: '$',
      priceInr: 95,
      pricePerUnit: Number((95 / 86.5).toFixed(2)),
      rating: 4.9,
      reviewsCount: 6800,
      distanceKmFromDest: 0.3,
      address: `Nazarbad Main Road, near Palace Circle, ${city}`,
      image: DOSA_IMG,
      cuisine: 'Mysore Benne Masala Dosa & Filter Coffee',
      amenities: [
        'Served on Fresh Green Banana Leaf',
        'Pure Desi Butter (Benne) Preparation',
        'Steaming Sambar & Coconut Chutney',
        'Quick Seating (<5 mins turnaround)',
        'Traditional Brass Tumbler Coffee',
      ],
      description: 'Legendary eatery famous across South India for its crisp golden butter dosas with spiced potato stuffing, aromatic coconut chutney, and piping-hot frothy degree coffee.',
      budgetFriendly: true,
      karnatakaSpecialty: 'Must try: Mysore Special Benne Masala Dosa and Filter Kaapi.',
    },

    // 5. MAVALLI TIFFIN ROOM (MTR) / TRADITIONAL KARNATAKA THALI
    {
      id: `fac-dine-thali-${location.id}`,
      name: `Mavalli Tiffin Room (MTR) Heritage Hall`,
      type: 'restaurant',
      category: 'Traditional Heritage Meals',
      lat: baseLat + 0.0028,
      lng: baseLng + 0.0034,
      priceTier: '$',
      priceInr: 220,
      pricePerUnit: Number((220 / 86.5).toFixed(2)),
      rating: 4.8,
      reviewsCount: 4200,
      distanceKmFromDest: 0.6,
      address: `Heritage Circle, Lalbagh Roadway, ${city}`,
      image: DOSA_IMG,
      cuisine: 'Traditional Karnataka Meals & Sweets',
      amenities: [
        'Unlimited 14-Item Karnataka Meals',
        'Pure Ghee Bisi Bele Bath',
        'Rava Idli with Ghee Bowl',
        'Fresh Mysore Pak & Badam Halwa',
        'Air-Conditioned Family Hall',
      ],
      description: 'Founded in 1924, MTR serves the quintessential Karnataka grand meal with kosambari, palya, saaru, huli, curd rice, and warm Mysore Pak.',
      budgetFriendly: true,
      karnatakaSpecialty: 'Inventor of the famous Rava Idli during WWII grain shortages.',
    },

    // 6. KARAVALI SEAFOOD & LOCAL SPECIALTY DINER
    {
      id: `fac-dine-coastal-${location.id}`,
      name: `Machali Coastal Karavali & Mangaluru Diner`,
      type: 'restaurant',
      category: 'Coastal Karavali & Mangalorean',
      lat: baseLat + 0.0015,
      lng: baseLng - 0.0041,
      priceTier: '$$',
      priceInr: 320,
      pricePerUnit: Number((320 / 86.5).toFixed(2)),
      rating: 4.8,
      reviewsCount: 3890,
      distanceKmFromDest: 0.4,
      address: `Coastal Highway Junction, ${city}`,
      image: DOSA_IMG,
      cuisine: 'Neer Dosa, Ghee Roast & Fish Curry',
      amenities: [
        'Melt-in-Mouth Neer Dosa with Chutney',
        'Famous Kundapura Ghee Roast',
        'Fresh Arabian Sea Catch of the Day',
        'Vegetarian Banana Leaf Thalis Available',
      ],
      description: 'Authentic coastal kitchen serving paper-thin Neer Dosas, Mangalore chicken/paneer ghee roast, and traditional red-chili Karavali curries.',
      budgetFriendly: true,
      karnatakaSpecialty: 'Neer Dosa with spicy red ghee roast gravy.',
    },

    // 7. YULU & PUBLIC SMART BIKESHARE DOCK
    {
      id: `fac-bike-yulu-${location.id}`,
      name: `${location.name} Yulu Zone & Cycle Dock`,
      type: 'bike_dock',
      category: 'Yulu Smart Bikeshare Hub',
      lat: baseLat - 0.0009,
      lng: baseLng + 0.0014,
      priceTier: '$',
      priceInr: 35,
      pricePerUnit: Number((35 / 86.5).toFixed(2)),
      rating: 4.9,
      reviewsCount: 5200,
      distanceKmFromDest: 0.1,
      address: `Directly at Metro / Transit Terminal Exit, ${city}`,
      image: HAMPI_IMG,
      amenities: [
        '30+ Miracle E-Bikes Available',
        'Instant App QR Unlock',
        'Battery Swap Station',
        'Helmets on Request',
      ],
      description: 'Official Karnataka eco-mobility hub for last-mile transit and scenic heritage cycling along monument paths.',
      budgetFriendly: true,
      karnatakaSpecialty: 'Affordable hourly passes from ₹35 per ride.',
    },
  ];
}
