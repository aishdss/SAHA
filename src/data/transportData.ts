import { TransportRouteInfo, MajesticPlatformBay, RecurringPattern, PredictiveAlert, SLAMetric, CrowdsourcedReport } from '../types';

export const BMTC_ROUTES: TransportRouteInfo[] = [
  {
    id: 'bmtc-500d',
    mode: 'BMTC',
    code: '500-D',
    name: 'Silk Board to Hebbal (Outer Ring Road)',
    kannadaName: 'ಸಿಲ್ಕ್ ಬೋರ್ಡ್ ನಿಂದ ಹೆಬ್ಬಾಳ (ಹೊರ ವರ್ತುಲ ರಸ್ತೆ)',
    from: 'Central Silk Board',
    to: 'Hebbal Flyover',
    fareRange: '₹15 - ₹35',
    travelTime: '65 mins',
    frequency: 'Every 5-8 mins (High Frequency)',
    typeBadge: 'Vajra AC & Ordinary',
    stops: [
      { name: 'Central Silk Board', kannadaName: 'ಸೆಂಟ್ರಲ್ ಸಿಲ್ಕ್ ಬೋರ್ಡ್', timeEstimateMinutes: 0, hasInterchange: true, interchangeMode: 'BMRCL' },
      { name: 'HSR Layout BDA Complex', kannadaName: 'ಎಚ್ ಎಸ್ ಆರ್ ಲೇಔಟ್', timeEstimateMinutes: 8 },
      { name: 'Bellandur EcoSpace', kannadaName: 'ಬೆಳ್ಳಂದೂರು ಇಕೋಸ್ಪೇಸ್', timeEstimateMinutes: 18 },
      { name: 'Devarabisanahalli RMZ', kannadaName: 'ದೇವರಬೀಸನಹಳ್ಳಿ', timeEstimateMinutes: 26 },
      { name: 'Marathahalli Bridge', kannadaName: 'ಮಾರತ್‌ಹಳ್ಳಿ ಬ್ರಿಡ್ಜ್', timeEstimateMinutes: 38, hasInterchange: true },
      { name: 'KR Puram Railway Station', kannadaName: 'ಕೆ ಆರ್ ಪುರಂ ರೈಲ್ವೆ ನಿಲ್ದಾಣ', timeEstimateMinutes: 48, hasInterchange: true, interchangeMode: 'RAILWAYS' },
      { name: 'Kalyan Nagar Ring Road', kannadaName: 'ಕಲ್ಯಾಣ ನಗರ', timeEstimateMinutes: 56 },
      { name: 'Hebbal Kempapura', kannadaName: 'ಹೆಬ್ಬಾಳ', timeEstimateMinutes: 65, isTerminal: true }
    ],
    liveStatus: {
      status: 'ACTIVE',
      currentLocation: 'Bellandur flyover (Vehicle KA-01-FA-4482)',
      nextArrivalMinutes: 4,
      alerts: ['Heavy peak hour volume near Kadubeesanahalli underpass']
    }
  },
  {
    id: 'bmtc-335e',
    mode: 'BMTC',
    code: '335-E',
    name: 'Kempegowda Bus Station (Majestic) to ITPL Whitefield',
    kannadaName: 'ಮೆಜೆಸ್ಟಿಕ್ ನಿಂದ ಐಟಿಪಿಎಲ್ ವೈಟ್‌ಫೀಲ್ಡ್',
    from: 'Majestic Platform 17',
    to: 'ITPL Kadugodi',
    fareRange: '₹20 - ₹45',
    travelTime: '75 mins',
    frequency: 'Every 10-12 mins',
    typeBadge: 'Vajra AC Volvo',
    stops: [
      { name: 'Kempegowda Bus Station (Majestic)', kannadaName: 'ಮೆಜೆಸ್ಟಿಕ್ ಬಸ್ ನಿಲ್ದಾಣ', timeEstimateMinutes: 0, hasInterchange: true, interchangeMode: 'MAJESTIC' },
      { name: 'Corporation / Hudson Circle', kannadaName: 'ಕಾರ್ಪೊರೇಷನ್', timeEstimateMinutes: 12 },
      { name: 'Richmond Circle', kannadaName: 'ರಿಚ್ಮಂಡ್ ಸರ್ಕಲ್', timeEstimateMinutes: 20 },
      { name: 'Domlur TTMC', kannadaName: 'ದೊಮ್ಮಲೂರು ಟಿಟಿಎಂಸಿ', timeEstimateMinutes: 34 },
      { name: 'HAL Old Airport Road', kannadaName: 'ಎಚ್ ಎ ಎಲ್', timeEstimateMinutes: 44 },
      { name: 'Marathahalli', kannadaName: 'ಮಾರತ್‌ಹಳ್ಳಿ', timeEstimateMinutes: 56 },
      { name: 'Kundalahalli Gate', kannadaName: 'ಕುಂದಲಹಳ್ಳಿ ಗೇಟ್', timeEstimateMinutes: 65 },
      { name: 'ITPL Pattandur Agrahara', kannadaName: 'ಐಟಿಪಿಎಲ್', timeEstimateMinutes: 75, isTerminal: true }
    ],
    liveStatus: {
      status: 'NORMAL',
      currentLocation: 'Domlur Flyover heading to HAL',
      nextArrivalMinutes: 7
    }
  },
  {
    id: 'bmtc-kia9',
    mode: 'BMTC',
    code: 'KIA-9',
    name: 'Kempegowda Bus Station (Majestic) to Kempegowda Intl Airport (KIA)',
    kannadaName: 'ಮೆಜೆಸ್ಟಿಕ್ ನಿಂದ ಕೆಂಪೇಗೌಡ ಅಂತರರಾಷ್ಟ್ರೀಯ ವಿಮಾನ ನಿಲ್ದಾಣ',
    from: 'Majestic Platform 30',
    to: 'KIA Terminal 1 & 2',
    fareRange: '₹250 Flat',
    travelTime: '65-80 mins',
    frequency: 'Every 15 mins (24x7 Round the clock)',
    typeBadge: 'Vayu Vajra Premium AC',
    stops: [
      { name: 'Majestic Plat 30', kannadaName: 'ಮೆಜೆಸ್ಟಿಕ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ 30', timeEstimateMinutes: 0, hasInterchange: true, interchangeMode: 'MAJESTIC' },
      { name: 'Malleshwaram Circle', kannadaName: 'ಮಲ್ಲೇಶ್ವರಂ', timeEstimateMinutes: 10 },
      { name: 'Mekhri Circle', kannadaName: 'ಮೇಖ್ರಿ ಸರ್ಕಲ್', timeEstimateMinutes: 22 },
      { name: 'Hebbal Police Station', kannadaName: 'ಹೆಬ್ಬಾಳ', timeEstimateMinutes: 32 },
      { name: 'Kogilu Cross Yelahanka', kannadaName: 'ಯಲಹಂಕ', timeEstimateMinutes: 45 },
      { name: 'KIA Trumpet Flyover', kannadaName: 'ವಿಮಾನ ನಿಲ್ದಾಣ ಟ್ರಂಪೆಟ್', timeEstimateMinutes: 60, hasInterchange: true, interchangeMode: 'FASTAG' },
      { name: 'KIA Terminal 1 & 2 Curb', kannadaName: 'ವಿಮಾನ ನಿಲ್ದಾಣ ಟರ್ಮಿನಲ್', timeEstimateMinutes: 70, isTerminal: true, interchangeMode: 'AIRPORT' }
    ],
    liveStatus: {
      status: 'ACTIVE',
      currentLocation: 'Near Kogilu Cross (Luggage space 60% full)',
      nextArrivalMinutes: 3
    }
  },
  {
    id: 'bmtc-201r',
    mode: 'BMTC',
    code: '201-R',
    name: 'Banashankari TTMC to CV Raman Nagar',
    kannadaName: 'ಬನಶಂಕರಿಯಿಂದ ಸಿ ವಿ ರಾಮನ್ ನಗರ',
    from: 'Banashankari TTMC',
    to: 'CV Raman Nagar DRDO',
    fareRange: '₹12 - ₹30',
    travelTime: '50 mins',
    frequency: 'Every 15 mins',
    typeBadge: 'Ordinary & Suvarna',
    stops: [
      { name: 'Banashankari TTMC', kannadaName: 'ಬನಶಂಕರಿ ಟಿಟಿಎಂಸಿ', timeEstimateMinutes: 0, hasInterchange: true, interchangeMode: 'BMRCL' },
      { name: 'Jayanagar 4th Block', kannadaName: 'ಜಯನಗರ 4ನೇ ಬ್ಲಾಕ್', timeEstimateMinutes: 12 },
      { name: 'Dairy Circle', kannadaName: 'ಡೈರಿ ಸರ್ಕಲ್', timeEstimateMinutes: 22 },
      { name: 'Koramangala Water Tank', kannadaName: 'ಕೋರಮಂಗಲ ವಾಟರ್ ಟ್ಯಾಂಕ್', timeEstimateMinutes: 32 },
      { name: 'Domlur TTMC', kannadaName: 'ದೊಮ್ಮಲೂರು', timeEstimateMinutes: 42 },
      { name: 'CV Raman Nagar DRDO', kannadaName: 'ಸಿ ವಿ ರಾಮನ್ ನಗರ', timeEstimateMinutes: 50, isTerminal: true }
    ],
    liveStatus: {
      status: 'NORMAL',
      currentLocation: 'Dairy Circle Flyover',
      nextArrivalMinutes: 9
    }
  },
  {
    id: 'bmtc-g2',
    mode: 'BMTC',
    code: 'G-2',
    name: 'Brigade Road (Mayo Hall) to Sarjapur Bus Stand',
    kannadaName: 'ಮೇಯೋ ಹಾಲ್ ನಿಂದ ಸರ್ಜಾಪುರ',
    from: 'Mayo Hall / MG Road',
    to: 'Sarjapur Town',
    fareRange: '₹18 - ₹42',
    travelTime: '60 mins',
    frequency: 'Every 12 mins',
    typeBadge: 'Big10 Non-Stop Corridor',
    stops: [
      { name: 'Mayo Hall (MG Road Metro)', kannadaName: 'ಮೇಯೋ ಹಾಲ್', timeEstimateMinutes: 0, hasInterchange: true, interchangeMode: 'BMRCL' },
      { name: 'Vellara Junction', kannadaName: 'ವೆಲ್ಲಾರ ಜಂಕ್ಷನ್', timeEstimateMinutes: 8 },
      { name: 'Agara Junction', kannadaName: 'ಅಗರ ಜಂಕ್ಷನ್', timeEstimateMinutes: 28 },
      { name: 'Ibbalur Lake / Bellandur Gate', kannadaName: 'ಇಬ್ಬಲೂರು', timeEstimateMinutes: 38 },
      { name: 'Wipro Corporate Sarjapur Rd', kannadaName: 'ವಿಪ್ರೋ ಗೇಟ್', timeEstimateMinutes: 48 },
      { name: 'Sarjapur Bus Stand', kannadaName: 'ಸರ್ಜಾಪುರ ಬಸ್ ನಿಲ್ದಾಣ', timeEstimateMinutes: 60, isTerminal: true }
    ],
    liveStatus: {
      status: 'DELAYED',
      currentLocation: 'Delayed at Agara signal due to waterlogging pipeline work',
      nextArrivalMinutes: 14
    }
  }
];

export const BMRCL_METRO_LINES = [
  {
    id: 'purple-line',
    name: 'Purple Line (East-West Corridor)',
    kannadaName: 'ನೇರಳೆ ಮಾರ್ಗ (ಪೂರ್ವ-ಪಶ್ಚಿಮ ಕಾರಿಡಾರ್)',
    terminals: 'Whitefield (Kadugodi) ↔ Challaghatta',
    length: '43.49 km (37 Stations)',
    firstTrain: '05:00 AM (Mon-Sat) / 07:00 AM (Sun)',
    lastTrain: '11:00 PM (Departs terminals)',
    frequency: 'Every 3.5 mins (Peak Hours 8:30-10:30 AM & 5:30-7:30 PM) / 6-8 mins (Non-peak)',
    fare: '₹10 - ₹60 (5% discount on Smart Card & Namma Metro WhatsApp QR)',
    stations: [
      'Challaghatta', 'Kengeri', 'Jnanabharathi', 'Rajarajeshwari Nagar', 'Nayandahalli',
      'Deepanjali Nagar', 'Attiguppe', 'Vijayanagar', 'Hosahalli', 'Magadi Road',
      'Nadaprabhu Kempegowda Majestic (Interchange with Green Line)', 'Sir M. Visvesvaraya Central College',
      'Dr. B.R. Ambedkar Vidhana Soudha', 'Cubbon Park', 'MG Road', 'Trinity', 'Halasuru', 'Indiranagar',
      'Swami Vivekananda Road', 'Baiyappanahalli (Interchange with SMVT Train)', 'Benniganahalli',
      'KR Puram', 'Singayyanapalya', 'Garudacharpalya', 'Hoodi', 'Seetharampalya', 'Kundalahalli',
      'Nallurhalli', 'Sri Sathya Sai Hospital', 'Pattandur Agrahara', 'Kadugodi Tree Park', 'Whitefield (Kadugodi)'
    ],
    keyAmenities: ['WhatsApp QR Ticketing (+91 81055 56677)', 'Automated Smart Card Gates', 'Elevators for PwD at all concourses', 'Security X-Ray Baggage scanners']
  },
  {
    id: 'green-line',
    name: 'Green Line (North-South Corridor)',
    kannadaName: 'ಹಸಿರು ಮಾರ್ಗ (ಉತ್ತರ-ದಕ್ಷಿಣ ಕಾರಿಡಾರ್)',
    terminals: 'Madavara (BIEC) ↔ Silk Institute',
    length: '33.46 km (32 Stations)',
    firstTrain: '05:00 AM (Mon-Sat) / 07:00 AM (Sun)',
    lastTrain: '11:00 PM',
    frequency: 'Every 5 mins (Peak) / 8 mins (Non-peak)',
    fare: '₹10 - ₹60',
    stations: [
      'Madavara (BIEC)', 'Chikkabidarakallu', 'Manjunathnagar', 'Nagasandra', 'Dasarahalli', 'Jalahalli',
      'Peenya Industry', 'Peenya', 'Goraguntepalya', 'Yeshwanthpur (Interchange with Railway)', 'Sandal Soap Factory',
      'Mahalakshmi', 'Rajajinagar', 'Kuvempu Road', 'Srirampura', 'Mantri Square Sampige Road',
      'Nadaprabhu Kempegowda Majestic (Interchange with Purple Line)', 'Chickpet', 'Krishna Rajendra Market (KR Market)',
      'National College', 'Lalbagh', 'South End Circle', 'Jayanagar', 'Rashtreeya Vidyalaya Road (RV Road)',
      'Banashankari (Interchange with TTMC Bus)', 'Jaya Prakash Nagar (JP Nagar)', 'Yelachenahalli', 'Konanakunte Cross',
      'Doddakallasandra', 'Vajarahalli', 'Thalaghattapura', 'Silk Institute'
    ],
    keyAmenities: ['Direct skywalk to Yeshwanthpur Railway Station', 'Prepaid auto stand at Banashankari & Mantri Square', 'Bicycle parking stands']
  }
];

export const MAJESTIC_PLATFORMS: MajesticPlatformBay[] = [
  {
    bayNumber: 1,
    title: 'Platform 1-4 (South-East Corridor)',
    routes: ['340', '341', '342', '343'],
    primaryDestinations: ['Hosur Road', 'Electronic City Phase 1 & 2', 'Bommasandra', 'Attibele Border'],
    kannadaDestinations: ['ಹೊಸೂರು ರಸ್ತೆ', 'ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಿಟಿ', 'ಬೊಮ್ಮಸಂದ್ರ', 'ಅತ್ತಿಬೆಲೆ'],
    busType: 'Ordinary',
    connectingSubway: 'Subway gate A (Direct access to City Railway Station footbridge)'
  },
  {
    bayNumber: 5,
    title: 'Platform 5-8 (South Corridor)',
    routes: ['210', '215', '216', '225'],
    primaryDestinations: ['Jayanagar 4th/9th Block', 'Banashankari TTMC', 'Kanakapura Road', 'ISRO Layout'],
    kannadaDestinations: ['ಜಯನಗರ', 'ಬನಶಂಕರಿ', 'ಕನಕಪುರ ರಸ್ತೆ'],
    busType: 'Ordinary',
    connectingSubway: 'Subway gate B (Central bus concourse stairs)'
  },
  {
    bayNumber: 9,
    title: 'Platform 9-12 (South-West Corridor)',
    routes: ['220', '222', '226', '230'],
    primaryDestinations: ['Mysore Road Satellite Bus Station', 'Kengeri TTMC', 'Rajarajeshwari Nagar', 'Bidadi'],
    kannadaDestinations: ['ಮೈಸೂರು ರಸ್ತೆ', 'ಕೆಂಗೇರಿ', 'ರಾಜರಾಜೇಶ್ವರಿ ನಗರ'],
    busType: 'Ordinary',
    connectingSubway: 'Subway gate C'
  },
  {
    bayNumber: 13,
    title: 'Platform 13-15 (West Corridor)',
    routes: ['240', '241', '248', '80'],
    primaryDestinations: ['Vijayanagar', 'Nagarbhavi BDA Complex', 'Magadi Road', 'Sunkadakatte'],
    kannadaDestinations: ['ವಿಜಯನಗರ', 'ನಾಗರಭಾವಿ', 'ಮಾಗಡಿ ರಸ್ತೆ'],
    busType: 'Ordinary',
    connectingSubway: 'Subway gate D'
  },
  {
    bayNumber: 16,
    title: 'Platform 16-19 (East Corridor & ITPL)',
    routes: ['335E', '333P', '331', '330'],
    primaryDestinations: ['Old Airport Road', 'HAL', 'Marathahalli', 'Whitefield ITPL', 'Kadugodi'],
    kannadaDestinations: ['ಹಳೆ ವಿಮಾನ ನಿಲ್ದಾಣ ರಸ್ತೆ', 'ಮಾರತ್‌ಹಳ್ಳಿ', 'ವೈಟ್‌ಫೀಲ್ಡ್ ಐಟಿಪಿಎಲ್'],
    busType: 'Vajra',
    connectingSubway: 'Subway gate E (Direct ramp to Kempegowda Metro Station entry 2)'
  },
  {
    bayNumber: 20,
    title: 'Platform 20-24 (North-East Corridor)',
    routes: ['290', '292', '293', '294'],
    primaryDestinations: ['Shivajinagar TTMC', 'Frazer Town', 'Kammanahalli', 'Hennur Cross', 'Bagalur'],
    kannadaDestinations: ['ಶಿವಾಜಿನಗರ', 'ಫ್ರೇಜರ್ ಟೌನ್', 'ಕಮ್ಮನಹಳ್ಳಿ', 'ಹೆಣ್ಣೂರು'],
    busType: 'Ordinary',
    connectingSubway: 'Subway gate F'
  },
  {
    bayNumber: 25,
    title: 'Platform 25-28 (North Corridor)',
    routes: ['250', '252', '258', '401'],
    primaryDestinations: ['Malleshwaram', 'Yeshwanthpur TTMC', 'Peenya Industrial Area', 'Nelamangala'],
    kannadaDestinations: ['ಮಲ್ಲೇಶ್ವರಂ', 'ಯಶವಂತಪುರ', 'ಪೀಣ್ಯ', 'ನೆಲಮಂಗಲ'],
    busType: 'Ordinary',
    connectingSubway: 'Subway gate G'
  },
  {
    bayNumber: 29,
    title: 'Platform 29-30 (Airport Vayu Vajra & City Sightseeing Bangalore Rounds)',
    routes: ['KIA-9', 'KIA-9A', 'Bangalore Rounds Hop-on Hop-off'],
    primaryDestinations: ['Kempegowda International Airport Terminal 1 & 2', 'Hebbal', 'Vidhana Soudha (Tour)'],
    kannadaDestinations: ['ಕೆಂಪೇಗೌಡ ವಿಮಾನ ನಿಲ್ದಾಣ', 'ಹೆಬ್ಬಾಳ'],
    busType: 'Vayu Vajra',
    connectingSubway: 'VIP Airport Lounge Escalator & Metro Skywalk Entrance A'
  }
];

export const AUTO_TARIFF_RULES = {
  city: 'Bengaluru (Traffic Police & RTO Authorized)',
  minimumFare: 30, // for first 2 km
  minimumDistanceKm: 2.0,
  ratePerKmAfterMinimum: 15.0,
  waitingCharges: 'Free for first 5 mins, ₹5 for every subsequent 15 mins',
  nightSurcharge: '50% additional (1.5x of meter reading) between 10:00 PM and 05:00 AM',
  luggageCharges: 'First 20 kg free; ₹5 per bag beyond 20 kg',
  prepaidBooths: [
    { location: 'KSR Bengaluru Railway Station (Majestic)', timing: '24 Hours', slipFee: '₹2' },
    { location: 'Yeshwanthpur Railway Station Platform 1 & 6', timing: '24 Hours', slipFee: '₹2' },
    { location: 'Cantonment Railway Station Main Exit', timing: '06:00 AM - 11:00 PM', slipFee: '₹2' },
    { location: 'MG Road Metro Station Anil Kumble Circle', timing: '08:00 AM - 10:00 PM', slipFee: '₹2' },
    { location: 'Shivajinagar Bus Station Entry', timing: '07:00 AM - 10:00 PM', slipFee: '₹2' }
  ],
  refusalComplaintHelpline: 'Traffic Police WhatsApp: +91 94808 01000 / Toll Free: 1095'
};

export const TAXI_CAB_INFO = {
  airportFixedZoneRates: [
    { zone: 'Zone A (Hebbal / Yelahanka / Sahakar Nagar)', sedanFare: '₹750 - ₹900', tollIncluded: false },
    { zone: 'Zone B (CBD / MG Road / Majestic / Indiranagar)', sedanFare: '₹1,000 - ₹1,250', tollIncluded: false },
    { zone: 'Zone C (Whitefield / Marathahalli / Bellandur)', sedanFare: '₹1,200 - ₹1,450', tollIncluded: false },
    { zone: 'Zone D (Electronic City / Bannerghatta / Banashankari)', sedanFare: '₹1,400 - ₹1,700', tollIncluded: false }
  ],
  appPickupZones: [
    { hub: 'KIA Airport T1', area: 'P3 Commercial Parking Multi-Level (App Cabs Uber/Ola/BluSmart/KSTDC)' },
    { hub: 'KIA Airport T2', area: 'Ground Level Transportation Hub (Zones 1-4 with dedicated EV charging)' },
    { hub: 'KSR Majestic Railway Station', area: 'Front Porch Cab Lane and Back Gate Okalipuram Drop' },
    { hub: 'SMVT Baiyappanahalli Railway Station', area: 'Main Porch Pick-up Zone A & Skywalk Link' }
  ],
  kstdcAirportTaxiContact: '080-4466 4466 (Government Verified KSTDC Cabs)'
};

export const FASTAG_INFO = {
  keyPlazas: [
    { name: 'Devanahalli Airport Toll (NH-44)', singleTrip: '₹115', returnTrip: '₹170', monthlyPass: '₹3,780', laneStatus: 'All Lanes ETC Enabled' },
    { name: 'Attibele Toll Plaza (NH-44 Hosur Rd)', singleTrip: '₹40', returnTrip: '₹60', monthlyPass: '₹1,250', laneStatus: 'Heavy Truck queue lane 1-3' },
    { name: 'Electronic City Elevated Expressway', singleTrip: '₹60', returnTrip: '₹90', monthlyPass: '₹1,800', laneStatus: 'Strictly FASTag only; cash penalty 2x' },
    { name: 'Nelamangala Tollway (NH-48 Tumkur Rd)', singleTrip: '₹35', returnTrip: '₹55', monthlyPass: '₹1,150', laneStatus: 'High throughput lanes' }
  ],
  quickRechargePortals: [
    { provider: 'NPCI NETC Central Portal', url: 'https://www.netc.org.in/' },
    { provider: 'My FASTag App (IHMCL)', url: 'https://ihmcl.co.in/' },
    { provider: 'NHAI FASTag Helpline', phone: '1033' }
  ],
  missedCallBalanceNumbers: [
    { bank: 'NHAI / NPCI Wallet', number: '+91 88843 33331' },
    { bank: 'State Bank of India FASTag', number: '+91 72088 20019' },
    { bank: 'ICICI Bank FASTag', number: '+91 80109 83436' }
  ]
};

export const AIRPORT_INFO = {
  name: 'Kempegowda International Airport (BLR)',
  kannadaName: 'ಕೆಂಪೇಗೌಡ ಅಂತರರಾಷ್ಟ್ರೀಯ ವಿಮಾನ ನಿಲ್ದಾಣ',
  terminals: [
    {
      terminal: 'Terminal 1 (T1)',
      carriers: ['Akasa Air', 'SpiceJet', 'Air India Express', 'Alliance Air', 'Select International Flights'],
      features: 'Subway food court, BMTC Vayu Vajra bays right at arrival exit door 2'
    },
    {
      terminal: 'Terminal 2 (T2) - The Garden Terminal',
      carriers: ['Air India (Domestic & Int)', 'IndiGo (International flights & select domestic)', 'Singapore Airlines', 'Emirates', 'Lufthansa', 'British Airways'],
      features: 'Bamboo garden decor, Multi-modal transport hub, 10 min free electric shuttle connection to T1'
    }
  ],
  shuttleService: 'Free 24x7 Electric Shuttle every 10 minutes connecting T1 ↔ T2 curb (Pickup at Bay 3)',
  securityWaitTimeLive: {
    t1Domestic: '8-12 mins (DigiYatra: 2 mins)',
    t2Domestic: '5-9 mins (DigiYatra: 2 mins)',
    internationalImmigration: '15-20 mins'
  },
  officialHelpline: '080-2201 2001'
};

export const RAILWAY_STATIONS = [
  {
    code: 'SBC',
    name: 'KSR Bengaluru City Junction (Majestic)',
    kannadaName: 'ಕ್ರಾಂತಿವೀರ ಸಂಗೊಳ್ಳಿ ರಾಯಣ್ಣ ರೈಲು ನಿಲ್ದಾಣ',
    platforms: 10,
    features: ['Direct footbridge to Nadaprabhu Kempegowda Metro Station', 'Prepaid Auto Stand 24 Hours', 'IRCTC Executive Lounge Platform 1', 'Cloak Room & Dormitories'],
    metroConnectivity: 'Purple & Green Line interchange through underground subway'
  },
  {
    code: 'YPR',
    name: 'Yesvantpur Junction Railway Station',
    kannadaName: 'ಯಶವಂತಪುರ ರೈಲು ನಿಲ್ದಾಣ',
    platforms: 6,
    features: ['Direct footbridge connected to Yeshwanthpur Metro Station (Green Line)', 'Two wheeler & four wheeler parking on Platform 6 side', 'Battery-operated buggy service for seniors'],
    metroConnectivity: 'Green Line via dedicated station skywalk'
  },
  {
    code: 'SMVB',
    name: 'Sir M. Visvesvaraya Terminal (Baiyappanahalli)',
    kannadaName: 'ಸರ್ ಎಂ ವಿಶ್ವೇಶ್ವರಯ್ಯ ಟರ್ಮಿನಲ್',
    platforms: 7,
    features: ['Fully Air-Conditioned Airport-like concourse', 'VIP Waiting Lounge', 'BMTC Feeder buses direct to SV Road & Baiyappanahalli Metro', 'Prepaid Taxi Counter'],
    metroConnectivity: 'Feeder bus / 1.5 km to Baiyappanahalli Purple Line'
  },
  {
    code: 'BNC',
    name: 'Bengaluru Cantonment Railway Station',
    kannadaName: 'ಬೆಂಗಳೂರು ಕಂಟೋನ್ಮೆಂಟ್ ರೈಲು ನಿಲ್ದಾಣ',
    platforms: 3,
    features: ['Heritage facade', 'Easy access to Shivajinagar & MG Road', 'Future Pink Line Underground Metro Connection'],
    metroConnectivity: 'Upcoming Pink Line; 1.8 km to MG Road'
  }
];

export const INITIAL_RECURRING_PATTERNS: RecurringPattern[] = [
  {
    id: 'rec-1',
    keyIdentifier: 'BMTC Route 500D - Silk Board to Bellandur',
    mode: 'BMTC',
    occurrenceCount: 14,
    timeframe: 'Past 7 days',
    commonCategory: 'Operational Delay & Overcrowding',
    patternDescription: 'Severe morning peak bus skipping stops between Silk Board and Iblur due to 100%+ passenger capacity overload.',
    suggestedIntervention: 'Deploy 4 additional Vajra AC feeder buses from Banashankari depot between 8:30 AM and 10:00 AM.'
  },
  {
    id: 'rec-2',
    keyIdentifier: 'Majestic Bus Stand - Platform 19 Display Glitch',
    mode: 'MAJESTIC',
    occurrenceCount: 6,
    timeframe: 'Past 4 days',
    commonCategory: 'Informational / Signage Malfunction',
    patternDescription: 'Electronic LED route arrival board blinking off intermittently at Platform 19 (Whitefield routes).',
    suggestedIntervention: 'Dispatch BMTC ITS technical contractor to reboot and replace LED power supply unit.'
  },
  {
    id: 'rec-3',
    keyIdentifier: 'Indiranagar 100ft Road - Auto Meter Refusal Hotspot',
    mode: 'AUTOS',
    occurrenceCount: 9,
    timeframe: 'Past 5 days (Night hours)',
    commonCategory: 'Fare Extortion / Meter Refusal',
    patternDescription: 'Drivers demanding flat ₹200-₹300 for short 2km trips to Domlur after 9:30 PM.',
    suggestedIntervention: 'Set up temporary Bengaluru Traffic Police checkpoint with official prepaid receipt books.'
  },
  {
    id: 'rec-4',
    keyIdentifier: 'MG Road Metro Station - Elevator 2 Out of Service',
    mode: 'BMRCL',
    occurrenceCount: 5,
    timeframe: 'Past 3 days',
    commonCategory: 'Accessibility / PwD Infrastructure',
    patternDescription: 'Concourse to platform level elevator tripping sensor safety switch during rain.',
    suggestedIntervention: 'Otis Elevator maintenance scheduled; deploy escalator marshals in interim.'
  }
];

export const INITIAL_PREDICTIVE_ALERTS: PredictiveAlert[] = [
  {
    id: 'pred-1',
    mode: 'BMTC',
    zone: 'Outer Ring Road (Silk Board to Marathahalli)',
    hazardOrIssue: 'Predicted 40-50 min bus bunching & delay',
    riskLevel: 'HIGH',
    confidence: 91,
    triggerFactor: 'Heavy evening thunderstorm forecast + Chinnaswamy cricket match crowd transit',
    recommendedAction: 'Pre-position standby breakdown towing cranes at Bellandur flyover and reroute 500D express buses via Sarjapur road.',
    timestamp: 'Calculated 15 mins ago'
  },
  {
    id: 'pred-2',
    mode: 'BMRCL',
    zone: 'Purple Line (Majestic Interchange)',
    hazardOrIssue: 'Platform 1 overcrowding threshold breach (over 2,800 pax/min)',
    riskLevel: 'HIGH',
    confidence: 88,
    triggerFactor: 'Simultaneous train arrival from Challaghatta and Whitefield at 6:15 PM peak',
    recommendedAction: 'Inject 2 empty loop train sets starting from MG Road to mop up passenger surge.',
    timestamp: 'Calculated 30 mins ago'
  },
  {
    id: 'pred-3',
    mode: 'AUTOS',
    zone: 'Yesvantpur Railway Station Exit',
    hazardOrIssue: 'Auto driver shortage vs arriving trains',
    riskLevel: 'MEDIUM',
    confidence: 79,
    triggerFactor: 'Arrival of 3 long-distance trains (Karnataka Express, Rani Chennamma) within 25 mins',
    recommendedAction: 'Alert Prepaid Auto Booth staff and notify Namma Yatri / driver cooperatives to route available autos.',
    timestamp: 'Calculated 45 mins ago'
  }
];

export const INITIAL_SLA_METRICS: SLAMetric[] = [
  { category: 'Safety & Emergency (Women, Harassment, Signal)', targetMinutes: 15, currentAvgMinutes: 11, totalHandled: 42, withinSLAPercent: 97 },
  { category: 'Operational Disruptions (Bus breakdown, metro delay)', targetMinutes: 45, currentAvgMinutes: 38, totalHandled: 128, withinSLAPercent: 91 },
  { category: 'Fare Extortion & Auto Complaints', targetMinutes: 120, currentAvgMinutes: 89, totalHandled: 74, withinSLAPercent: 88 },
  { category: 'Signage & Infrastructure (Elevators, Display boards)', targetMinutes: 180, currentAvgMinutes: 142, totalHandled: 53, withinSLAPercent: 85 }
];

export const INITIAL_CROWDSOURCED_REPORTS: CrowdsourcedReport[] = [
  {
    id: 'crowd-1',
    type: 'crowded_bus',
    mode: 'BMTC',
    location: 'Marathahalli Bridge towards Silk Board',
    coordinates: { x: 74, y: 55 },
    title: 'Bus 500D packed to footboard, 3 buses skipped stop',
    description: 'Waited 25 mins at Marathahalli bridge. Consecutive 500D buses full and not halting at shelter.',
    timestamp: '12 mins ago',
    upvotes: 18,
    userUpvoted: false,
    verifiedByAuthority: true,
    status: 'INVESTIGATING'
  },
  {
    id: 'crowd-2',
    type: 'auto_refusal',
    mode: 'AUTOS',
    location: 'Indiranagar 100ft Road Metro Exit',
    coordinates: { x: 62, y: 42 },
    title: 'Auto drivers refusing meter to Domlur / asking ₹180',
    description: '3 consecutive autos refused to turn on meter for a 2.5 km trip to Domlur flyover.',
    timestamp: '25 mins ago',
    upvotes: 12,
    userUpvoted: false,
    verifiedByAuthority: false,
    status: 'ACTIVE'
  },
  {
    id: 'crowd-3',
    type: 'elevator_down',
    mode: 'BMRCL',
    location: 'Nadaprabhu Kempegowda Majestic Metro Entry 2',
    coordinates: { x: 42, y: 48 },
    title: 'Concourse elevator out of order',
    description: 'Elderly passengers and wheelchair users cannot access platform 2 elevator. Maintenance board placed.',
    timestamp: '40 mins ago',
    upvotes: 27,
    userUpvoted: false,
    verifiedByAuthority: true,
    status: 'INVESTIGATING'
  },
  {
    id: 'crowd-4',
    type: 'pothole_waterlogging',
    mode: 'TAXIS',
    location: 'Bellandur Central Mall road underpass',
    coordinates: { x: 70, y: 64 },
    title: 'Waterlogging 1.5 ft deep after rain; slow moving cabs',
    description: 'Taxis and autos struggling to pass waterlogged stretch; traffic backed up till EcoSpace.',
    timestamp: '55 mins ago',
    upvotes: 34,
    userUpvoted: false,
    verifiedByAuthority: true,
    status: 'ACTIVE'
  }
];
