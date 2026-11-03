/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  BudgetTier,
  ExperienceType,
  KarnatakaDayPlan,
  LocationPoint,
  PersonalizedItinerary,
  TravellerInterest,
  TripDurationTier,
} from '../types/travel';
import { KARNATAKA_LOCATIONS } from '../data/locations';

const HAMPI_IMG = '/src/assets/images/karnataka_hampi_ruins_1793685920060.jpg';
const COORG_IMG = '/src/assets/images/karnataka_coorg_coffee_1793685920108.jpg';
const PALACE_IMG = '/src/assets/images/karnataka_mysuru_palace_1793685919882.jpg';
const DOSA_IMG = '/src/assets/images/karnataka_dosa_dining_1793685919873.jpg';

export function generatePersonalizedKarnatakaItinerary(
  interests: TravellerInterest[],
  duration: TripDurationTier,
  budgetTier: BudgetTier,
  experienceType: ExperienceType,
  origin: LocationPoint,
  destination: LocationPoint
): PersonalizedItinerary {
  const daysCount =
    duration === '1_day' ? 1 : duration === '2_3_days' ? 3 : duration === '4_5_days' ? 5 : 7;

  const dailyPlans: KarnatakaDayPlan[] = [];

  // Determine budget multiplier per day
  const dailyBudgetInr =
    budgetTier === 'budget' ? 1150 : budgetTier === 'moderate' ? 3200 : 7500;

  // Day 1: Origin & Departure Trail
  dailyPlans.push({
    dayNumber: 1,
    title: `Day 1: Departure from ${origin.city} & Cultural Inception`,
    theme: `${origin.name} to ${destination.city} Gateway`,
    morning: `Early breakfast of hot Thatte Idli or Benne Dosa with filter coffee. Board transit at ${origin.name}. Experience scenic views of the Deccan plateau and coconut groves.`,
    afternoon: `Arrive in ${destination.city}. Check into selected stay. Take a walking orientation tour around the historic town bazaar and temple perimeter.`,
    evening: `Sunset viewpoint at iconic local vantage point (e.g. Raja's Seat / Matanga Hill / Chamundi ridge). Enjoy fresh evening snacks like steaming Maddur Vade or Mirchi Bajji.`,
    recommendedStay:
      budgetTier === 'budget'
        ? `Zostel / Backpacker Bunk in ${destination.city} (₹750/night)`
        : budgetTier === 'moderate'
        ? `KSTDC Hotel Mayura Heritage (₹1,650/night)`
        : `Heritage Boutique Suite / Plantation Resort (₹4,800/night)`,
    foodHighlight: `Must-try: Authentic Mysore Benne Masala Dosa and hot Filter Kaapi served on a banana leaf.`,
    transitTip: `Use Namma Metro in Bengaluru or KSRTC Airavat/Vande Bharat Express for smooth intercity transfers.`,
    dayBudgetInr: dailyBudgetInr,
  });

  // Day 2: Deep Exploration (for >= 2 days)
  if (daysCount >= 2) {
    dailyPlans.push({
      dayNumber: 2,
      title: `Day 2: ${destination.popularFor[0] || 'Heritage Exploration'} & Monument Trail`,
      theme: `Signature Sights of ${destination.name}`,
      morning: `Sunrise exploration before midday heat. Visit ${destination.popularFor[0] || 'Ancient Temples'}. Rent a bicycle or electric scooter to glide past monuments and scenic stone corridors.`,
      afternoon: `Visit local artisan weaving centers (Mysore Silk, Channapatna wooden lacquerware, or stone carving ateliers). Traditional Karnataka lunch feast on plantain leaf.`,
      evening: `Evening cultural performance or illuminated palace/temple spectacle. Stroll through fragrant jasmine and spice markets.`,
      recommendedStay:
        budgetTier === 'budget'
          ? `Zostel / Backpacker Pod ${destination.city}`
          : `KSTDC Mayura / Comfort Homestay`,
      foodHighlight: `Lunch: Traditional Karnataka Meals with Bisi Bele Bath, Kosambari, Palya, and Mysore Pak sweet.`,
      transitTip: `Rent geared bicycles at temple gate for ₹100/day or book an autorickshaw day-hire for ₹600.`,
      dayBudgetInr: dailyBudgetInr,
    });
  }

  // Day 3: Nature, River & Plantation Trail (for >= 3 days)
  if (daysCount >= 3) {
    dailyPlans.push({
      dayNumber: 3,
      title: `Day 3: Western Ghats, Coffee Groves & Sacred Rivers`,
      theme: `Nature & Waterways of Karnataka`,
      morning: `Trek through misty coffee or cardamom estates. Freshly roasted Arabica coffee tasting session followed by visit to cascading waterfalls (Abbey Falls / Jog Falls / Shivanasamudra).`,
      afternoon: `Traditional river coracle boat ride along Tungabhadra / Kaveri river. Spot hornbills, otters, and freshwater birds along the lush banks.`,
      evening: `Bonfire under star-lit skies with traditional folklore tales and Kodava/Malnad home-cooked delicacies.`,
      recommendedStay: `Coffee Plantation Estate Homestay / Riverside Eco Lodge`,
      foodHighlight: `Dinner: Neer Dosa with vegetable stew or spicy Mangalorean Kundapura gravy.`,
      transitTip: `Shared mountain jeeps available at town bus stands for high-peak viewpoints (₹150/seat).`,
      dayBudgetInr: dailyBudgetInr,
    });
  }

  // Day 4: Coastal or Northern Forts (for >= 4 days)
  if (daysCount >= 4) {
    dailyPlans.push({
      dayNumber: 4,
      title: `Day 4: Coastal Cliffs or Chalukya Sandstone Marvels`,
      theme: `Coastal Karavali & Ancient Fortresses`,
      morning: `Scenic journey along the Konkan coastal railway or through red sandstone gorges to Badami / Gokarna cliffs. Panoramic Arabian Sea views.`,
      afternoon: `Beach trek from Kudle Beach to sacred Om Beach and Half Moon Bay. Fresh tender coconut water and tropical fruit lassis.`,
      evening: `Watch the sunset over the Arabian Sea horizon. Experience beachside acoustic music and relaxed candlelit dining on the sand.`,
      recommendedStay: `Beachside Bamboo Shack / KSTDC Mayura Gokarna`,
      foodHighlight: `Fresh Karavali coastal thali, Neer Dosa, and Mangalore Buns with spicy coconut chutney.`,
      transitTip: `Konkan Railway passenger trains are ultra-affordable (₹45 ticket) and offer world-class coastal vistas.`,
      dayBudgetInr: dailyBudgetInr,
    });
  }

  // Day 5: Wilderness Safari & Peak Trekking (for >= 5 days)
  if (daysCount >= 5) {
    dailyPlans.push({
      dayNumber: 5,
      title: `Day 5: Mountain Peaks (Mullayanagiri) & Wildlife Safari`,
      theme: `Highest Peaks & Wilderness Corridors`,
      morning: `Early morning hike to Mullayanagiri (1,930m) — the highest peak in Karnataka. Witness rolling mist clouds engulfing the peaks below.`,
      afternoon: `Safari ride in Bandipur / Nagarhole tiger reserves or birdwatching in Dandeli sanctuary. Spot wild elephants, gaurs, and peacocks.`,
      evening: `Visit Baba Budangiri shrine and the historic cave where coffee seeds were first planted in India in 1670.`,
      recommendedStay: `Forest Safari Lodge / Mountain Ridge Homestay`,
      foodHighlight: `Akki Roti (rice flour flatbread) with spicy tomato gojju and fresh ginger tea.`,
      transitTip: `KSRTC provides direct hill buses from Chikkamagaluru depot to temple base every hour.`,
      dayBudgetInr: dailyBudgetInr,
    });
  }

  // Day 6 & 7: Comprehensive Circuit (if 6-8 days)
  if (daysCount >= 6) {
    dailyPlans.push({
      dayNumber: 6,
      title: `Day 6: Hidden Hoysala Temples (Belur & Halebidu)`,
      theme: `Intricate Soapstone Sculptures & Architecture`,
      morning: `Explore the 12th-century Chennakeshava Temple at Belur with its breathtaking celestial dancers (Madanikas) carved into chloritic schist soapstone.`,
      afternoon: `Proceed to Halebidu temple complex and the monolithic 57-foot statue of Lord Bahubali at Shravanabelagola.`,
      evening: `Relaxed evening transit back towards the capital or nearest transit junction.`,
      recommendedStay: `Heritage Transit Hotel / KSTDC Mayura`,
      foodHighlight: `Traditional Davanagere Benne Dosa with spicy mashed potato and spicy red chutney.`,
      transitTip: `Book KSRTC package tour or travel on regular Hassan-Bengaluru express buses.`,
      dayBudgetInr: dailyBudgetInr,
    });
  }

  if (daysCount >= 7) {
    dailyPlans.push({
      dayNumber: 7,
      title: `Day 7: Garden City Culmination & Souvenir Trails`,
      theme: `Bengaluru Greenery & Farewell Feast`,
      morning: `Morning walk beneath century-old trees in Cubbon Park or Lalbagh Botanical Gardens glass house.`,
      afternoon: `Shopping for authentic GI-tagged Mysore Sandalwood oil, pure silk sarees at KSIC showroom, and packaged freshly roasted Chikmagalur coffee beans.`,
      evening: `Farewell grand Karnataka dinner at iconic Vidyarthi Bhavan or MTR. Head to Kempegowda Airport or KSR station for departure.`,
      recommendedStay: `Kempegowda Airport Transit Hotel or Central Bengaluru`,
      foodHighlight: `Grand Mysore Pak sweet box and hot filter coffee toast.`,
      transitTip: `Use Namma Metro Purple Line direct to Majestic, or KIA Vayu Vajra Volvo bus to airport.`,
      dayBudgetInr: dailyBudgetInr,
    });
  }

  const totalCostInr = dailyPlans.reduce((sum, d) => sum + d.dayBudgetInr, 0);

  // Generate hero image according to destination/interest
  let heroImage = HAMPI_IMG;
  if (interests.includes('coffee_plantations') || destination.id === 'coorg-madikeri') {
    heroImage = COORG_IMG;
  } else if (interests.includes('heritage') || destination.id === 'mys-palace') {
    heroImage = PALACE_IMG;
  } else if (destination.id === 'blr-majestic') {
    heroImage = DOSA_IMG;
  }

  const durationLabel =
    duration === '1_day'
      ? '1-Day Express Explorer'
      : duration === '2_3_days'
      ? '3-Day Classic Getaway'
      : duration === '4_5_days'
      ? '5-Day Heritage & Nature Circuit'
      : '7-Day Grand Karnataka Odyssey';

  const expLabel =
    experienceType === 'solo_backpacker'
      ? 'Solo Backpacker & Cultural Discovery'
      : experienceType === 'romantic_couple'
      ? 'Romantic Mist & Heritage Escape'
      : experienceType === 'family_leisure'
      ? 'Comfortable Family Heritage & Leisure'
      : 'Friends Adventure & Western Ghats Trail';

  return {
    id: `itinerary-${origin.id}-${destination.id}-${duration}-${budgetTier}`,
    title: `${origin.city} to ${destination.city}: ${durationLabel}`,
    subtitle: `Tailored for ${expLabel} · ${budgetTier.toUpperCase()} Budget · ${daysCount} Days`,
    heroImage,
    interests,
    duration,
    budgetTier,
    experienceType,
    totalEstimatedInr: totalCostInr,
    routeStops: [origin, destination],
    dailyPlans,
    whyRecommended: `Curated specifically for your passion for ${interests.join(
      ', '
    )} with budget-efficient public transit (Namma Metro, KSRTC Volvo / Sarige, and Express Trains), iconic Mysore/Malnad dining, and comfortable local stays.`,
    carbonSummaryKg: Math.round(daysCount * 4.2),
  };
}
