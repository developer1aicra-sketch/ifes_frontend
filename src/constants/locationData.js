/**
 * Cascading location data: Country → State → City.
 * Used for shipping/address form in order: select Country first, then State, then City.
 */

export const COUNTRIES = [
  { id: 'IN', name: 'India' },
  { id: 'CN', name: 'China' },
  { id: 'US', name: 'United States' },
  { id: 'AE', name: 'United Arab Emirates' },
  { id: 'GB', name: 'United Kingdom' },
  { id: 'PK', name: 'Pakistan' },
  { id: 'BD', name: 'Bangladesh' },
  { id: 'AU', name: 'Australia' },
  { id: 'SG', name: 'Singapore' },
  { id: 'SA', name: 'Saudi Arabia' },
  { id: 'OTHER', name: 'Other' },
];

/** States/provinces by country code. Key = country id from COUNTRIES. */
export const STATES_BY_COUNTRY = {
  IN: [
    { id: 'AN', name: 'Andaman and Nicobar Islands' },
    { id: 'AP', name: 'Andhra Pradesh' },
    { id: 'AR', name: 'Arunachal Pradesh' },
    { id: 'AS', name: 'Assam' },
    { id: 'BR', name: 'Bihar' },
    { id: 'CH', name: 'Chandigarh' },
    { id: 'CT', name: 'Chhattisgarh' },
    { id: 'DN', name: 'Dadra and Nagar Haveli and Daman and Diu' },
    { id: 'DL', name: 'Delhi' },
    { id: 'GA', name: 'Goa' },
    { id: 'GJ', name: 'Gujarat' },
    { id: 'HR', name: 'Haryana' },
    { id: 'HP', name: 'Himachal Pradesh' },
    { id: 'JK', name: 'Jammu and Kashmir' },
    { id: 'JH', name: 'Jharkhand' },
    { id: 'KA', name: 'Karnataka' },
    { id: 'KL', name: 'Kerala' },
    { id: 'LA', name: 'Ladakh' },
    { id: 'LD', name: 'Lakshadweep' },
    { id: 'MP', name: 'Madhya Pradesh' },
    { id: 'MH', name: 'Maharashtra' },
    { id: 'MN', name: 'Manipur' },
    { id: 'ML', name: 'Meghalaya' },
    { id: 'MZ', name: 'Mizoram' },
    { id: 'NL', name: 'Nagaland' },
    { id: 'OR', name: 'Odisha' },
    { id: 'PY', name: 'Puducherry' },
    { id: 'PB', name: 'Punjab' },
    { id: 'RJ', name: 'Rajasthan' },
    { id: 'SK', name: 'Sikkim' },
    { id: 'TN', name: 'Tamil Nadu' },
    { id: 'TG', name: 'Telangana' },
    { id: 'TR', name: 'Tripura' },
    { id: 'UP', name: 'Uttar Pradesh' },
    { id: 'UT', name: 'Uttarakhand' },
    { id: 'WB', name: 'West Bengal' },
  ],
  CN: [
    { id: 'BJ', name: 'Beijing' },
    { id: 'SH', name: 'Shanghai' },
    { id: 'GD', name: 'Guangdong' },
    { id: 'ZJ', name: 'Zhejiang' },
    { id: 'JS', name: 'Jiangsu' },
    { id: 'SD', name: 'Shandong' },
    { id: 'OTHER', name: 'Other' },
  ],
  US: [
    { id: 'AL', name: 'Alabama' },
    { id: 'CA', name: 'California' },
    { id: 'FL', name: 'Florida' },
    { id: 'TX', name: 'Texas' },
    { id: 'NY', name: 'New York' },
    { id: 'OTHER', name: 'Other' },
  ],
  AE: [
    { id: 'ABU_DHABI', name: 'Abu Dhabi' },
    { id: 'DUBAI', name: 'Dubai' },
    { id: 'SHARJAH', name: 'Sharjah' },
    { id: 'AJMAN', name: 'Ajman' },
    { id: 'UMM_AL_QAIWAIN', name: 'Umm Al Quwain' },
    { id: 'RAS_AL_KHAIMAH', name: 'Ras Al Khaimah' },
    { id: 'FUJAIRAH', name: 'Fujairah' },
    { id: 'OTHER_AE', name: 'Other' },
  ],
  GB: [
    { id: 'ENGLAND', name: 'England' },
    { id: 'SCOTLAND', name: 'Scotland' },
    { id: 'WALES', name: 'Wales' },
    { id: 'NI', name: 'Northern Ireland' },
    { id: 'OTHER_GB', name: 'Other' },
  ],
  PK: [
    { id: 'PUNJAB', name: 'Punjab' },
    { id: 'SINDH', name: 'Sindh' },
    { id: 'KPK', name: 'Khyber Pakhtunkhwa' },
    { id: 'BALOCHISTAN', name: 'Balochistan' },
    { id: 'GB_PK', name: 'Gilgit-Baltistan' },
    { id: 'AJK', name: 'Azad Jammu and Kashmir' },
    { id: 'ICT', name: 'Islamabad Capital Territory' },
    { id: 'OTHER_PK', name: 'Other' },
  ],
  BD: [
    { id: 'BD_DHA', name: 'Dhaka' },
    { id: 'BD_CHA', name: 'Chittagong' },
    { id: 'BD_RAJ', name: 'Rajshahi' },
    { id: 'BD_KHU', name: 'Khulna' },
    { id: 'BD_BAR', name: 'Barisal' },
    { id: 'BD_SYL', name: 'Sylhet' },
    { id: 'BD_RAN', name: 'Rangpur' },
    { id: 'BD_MYM', name: 'Mymensingh' },
    { id: 'OTHER_BD', name: 'Other' },
  ],
  AU: [
    { id: 'NSW', name: 'New South Wales' },
    { id: 'VIC', name: 'Victoria' },
    { id: 'QLD', name: 'Queensland' },
    { id: 'WA', name: 'Western Australia' },
    { id: 'SA', name: 'South Australia' },
    { id: 'TAS', name: 'Tasmania' },
    { id: 'ACT', name: 'Australian Capital Territory' },
    { id: 'NT', name: 'Northern Territory' },
    { id: 'OTHER_AU', name: 'Other' },
  ],
  SG: [
    { id: 'SG_CENTRAL', name: 'Central Region' },
    { id: 'SG_EAST', name: 'East Region' },
    { id: 'SG_NORTH', name: 'North Region' },
    { id: 'SG_NORTH_EAST', name: 'North-East Region' },
    { id: 'SG_WEST', name: 'West Region' },
    { id: 'OTHER_SG', name: 'Other' },
  ],
  SA: [
    { id: 'SA_RIYADH', name: 'Riyadh' },
    { id: 'SA_MAKKAH', name: 'Makkah' },
    { id: 'SA_MADINAH', name: 'Madinah' },
    { id: 'SA_EASTERN', name: 'Eastern Province' },
    { id: 'SA_OTHER', name: 'Other' },
  ],
  OTHER: [{ id: 'OTHER_STATE', name: 'Other' }],
};

/** Cities by state id. Key = state id from STATES_BY_COUNTRY. Empty array = use "Other" or free text. */
export const CITIES_BY_STATE = {
  // India - Uttar Pradesh
  UP: [
    { id: 'AGRA', name: 'Agra' },
    { id: 'ALIGARH', name: 'Aligarh' },
    { id: 'AYODHYA', name: 'Ayodhya' },
    { id: 'GHAZIABAD', name: 'Ghaziabad' },
    { id: 'GORAKHPUR', name: 'Gorakhpur' },
    { id: 'KANPUR', name: 'Kanpur' },
    { id: 'LUCKNOW', name: 'Lucknow' },
    { id: 'MEERUT', name: 'Meerut' },
    { id: 'NOIDA', name: 'Noida' },
    { id: 'VARANASI', name: 'Varanasi' },
    { id: 'OTHER', name: 'Other' },
  ],
  // India - Maharashtra
  MH: [
    { id: 'MUMBAI', name: 'Mumbai' },
    { id: 'PUNE', name: 'Pune' },
    { id: 'NAGPUR', name: 'Nagpur' },
    { id: 'THANE', name: 'Thane' },
    { id: 'NASHIK', name: 'Nashik' },
    { id: 'AURANGABAD', name: 'Aurangabad' },
    { id: 'OTHER', name: 'Other' },
  ],
  // India - Karnataka
  KA: [
    { id: 'BANGALORE', name: 'Bengaluru' },
    { id: 'MYSORE', name: 'Mysuru' },
    { id: 'HUBLI', name: 'Hubballi' },
    { id: 'MANGALORE', name: 'Mangaluru' },
    { id: 'OTHER', name: 'Other' },
  ],
  // India - Delhi
  DL: [
    { id: 'NEW_DELHI', name: 'New Delhi' },
    { id: 'NORTH', name: 'North Delhi' },
    { id: 'SOUTH', name: 'South Delhi' },
    { id: 'EAST', name: 'East Delhi' },
    { id: 'WEST', name: 'West Delhi' },
    { id: 'OTHER', name: 'Other' },
  ],
  // India - Tamil Nadu
  TN: [
    { id: 'CHENNAI', name: 'Chennai' },
    { id: 'COIMBATORE', name: 'Coimbatore' },
    { id: 'MADURAI', name: 'Madurai' },
    { id: 'TRICHY', name: 'Tiruchirappalli' },
    { id: 'OTHER', name: 'Other' },
  ],
  // India - West Bengal
  WB: [
    { id: 'KOLKATA', name: 'Kolkata' },
    { id: 'HOWRAH', name: 'Howrah' },
    { id: 'DARJEELING', name: 'Darjeeling' },
    { id: 'OTHER', name: 'Other' },
  ],
  // India - Odisha
  OR: [
    { id: 'BHUBANESWAR', name: 'Bhubaneswar' },
    { id: 'CUTTACK', name: 'Cuttack' },
    { id: 'PURI', name: 'Puri' },
    { id: 'ROURKELA', name: 'Rourkela' },
    { id: 'OTHER', name: 'Other' },
  ],
  // India - Gujarat
  GJ: [
    { id: 'AHMEDABAD', name: 'Ahmedabad' },
    { id: 'SURAT', name: 'Surat' },
    { id: 'VADODARA', name: 'Vadodara' },
    { id: 'RAJKOT', name: 'Rajkot' },
    { id: 'OTHER', name: 'Other' },
  ],
  // India - Rajasthan
  RJ: [
    { id: 'JAIPUR', name: 'Jaipur' },
    { id: 'JODHPUR', name: 'Jodhpur' },
    { id: 'UDAIPUR', name: 'Udaipur' },
    { id: 'KOTA', name: 'Kota' },
    { id: 'OTHER', name: 'Other' },
  ],
  // India - Andhra Pradesh
  AP: [
    { id: 'VISAKHAPATNAM', name: 'Visakhapatnam' },
    { id: 'VIJAYAWADA', name: 'Vijayawada' },
    { id: 'GUNTUR', name: 'Guntur' },
    { id: 'OTHER', name: 'Other' },
  ],
  // India - Telangana
  TG: [
    { id: 'HYDERABAD', name: 'Hyderabad' },
    { id: 'WARANGAL', name: 'Warangal' },
    { id: 'OTHER', name: 'Other' },
  ],
  // India - Kerala
  KL: [
    { id: 'THIRUVANANTHAPURAM', name: 'Thiruvananthapuram' },
    { id: 'KOCHI', name: 'Kochi' },
    { id: 'KOZHIKODE', name: 'Kozhikode' },
    { id: 'OTHER', name: 'Other' },
  ],
  // China
  BJ: [{ id: 'BJ_C', name: 'Beijing' }],
  SH: [{ id: 'SH_C', name: 'Shanghai' }],
  GD: [{ id: 'GZ', name: 'Guangzhou' }, { id: 'SZ', name: 'Shenzhen' }, { id: 'OTHER', name: 'Other' }],
  ZJ: [],
  JS: [],
  SD: [],
  // US
  CA: [{ id: 'LA', name: 'Los Angeles' }, { id: 'SF', name: 'San Francisco' }, { id: 'SD', name: 'San Diego' }, { id: 'OTHER', name: 'Other' }],
  TX: [{ id: 'HOUSTON', name: 'Houston' }, { id: 'DALLAS', name: 'Dallas' }, { id: 'AUSTIN', name: 'Austin' }, { id: 'OTHER', name: 'Other' }],
  NY: [{ id: 'NYC', name: 'New York City' }, { id: 'BUFFALO', name: 'Buffalo' }, { id: 'OTHER', name: 'Other' }],
  FL: [{ id: 'MIAMI', name: 'Miami' }, { id: 'ORLANDO', name: 'Orlando' }, { id: 'JACKSONVILLE', name: 'Jacksonville' }, { id: 'OTHER', name: 'Other' }],
  AL: [{ id: 'BIRMINGHAM', name: 'Birmingham' }, { id: 'MONTGOMERY', name: 'Montgomery' }, { id: 'OTHER', name: 'Other' }],
  // Bangladesh divisions → cities
  BD_DHA: [{ id: 'DHAKA', name: 'Dhaka' }, { id: 'GAZIPUR', name: 'Gazipur' }, { id: 'NARAYANGANJ', name: 'Narayanganj' }, { id: 'TANGAIL', name: 'Tangail' }, { id: 'OTHER', name: 'Other' }],
  BD_CHA: [{ id: 'CHITTAGONG', name: 'Chittagong' }, { id: 'COX_BAZAR', name: "Cox's Bazar" }, { id: 'COMILLA', name: 'Comilla' }, { id: 'OTHER', name: 'Other' }],
  BD_RAJ: [{ id: 'RAJSHAHI', name: 'Rajshahi' }, { id: 'BOGRA', name: 'Bogra' }, { id: 'PABNA', name: 'Pabna' }, { id: 'OTHER', name: 'Other' }],
  BD_KHU: [{ id: 'KHULNA', name: 'Khulna' }, { id: 'JESSORE', name: 'Jessore' }, { id: 'OTHER', name: 'Other' }],
  BD_BAR: [{ id: 'BARISAL', name: 'Barisal' }, { id: 'PATUAKHALI', name: 'Patuakhali' }, { id: 'OTHER', name: 'Other' }],
  BD_SYL: [{ id: 'SYLHET', name: 'Sylhet' }, { id: 'HABIGANJ', name: 'Habiganj' }, { id: 'OTHER', name: 'Other' }],
  BD_RAN: [{ id: 'RANGPUR', name: 'Rangpur' }, { id: 'DINAJPUR', name: 'Dinajpur' }, { id: 'OTHER', name: 'Other' }],
  BD_MYM: [{ id: 'MYMENSINGH', name: 'Mymensingh' }, { id: 'JAMALPUR', name: 'Jamalpur' }, { id: 'OTHER', name: 'Other' }],
  OTHER_BD: [{ id: 'OTHER', name: 'Other' }],
  // UAE
  ABU_DHABI: [{ id: 'ABU_DHABI_C', name: 'Abu Dhabi City' }, { id: 'AL_AIN', name: 'Al Ain' }, { id: 'OTHER', name: 'Other' }],
  DUBAI: [{ id: 'DUBAI_C', name: 'Dubai City' }, { id: 'JBR', name: 'JBR' }, { id: 'OTHER', name: 'Other' }],
  SHARJAH: [{ id: 'SHARJAH_C', name: 'Sharjah City' }, { id: 'OTHER', name: 'Other' }],
  AJMAN: [{ id: 'AJMAN_C', name: 'Ajman City' }, { id: 'OTHER', name: 'Other' }],
  UMM_AL_QAIWAIN: [{ id: 'OTHER', name: 'Other' }],
  RAS_AL_KHAIMAH: [{ id: 'RAK_C', name: 'Ras Al Khaimah City' }, { id: 'OTHER', name: 'Other' }],
  FUJAIRAH: [{ id: 'FUJAIRAH_C', name: 'Fujairah City' }, { id: 'OTHER', name: 'Other' }],
  OTHER_AE: [{ id: 'OTHER', name: 'Other' }],
  // UK, Pakistan, Australia, Singapore, Saudi - one generic "Other" per state so select always has options
  ENGLAND: [{ id: 'LONDON', name: 'London' }, { id: 'BIRMINGHAM_UK', name: 'Birmingham' }, { id: 'MANCHESTER', name: 'Manchester' }, { id: 'OTHER', name: 'Other' }],
  SCOTLAND: [{ id: 'EDINBURGH', name: 'Edinburgh' }, { id: 'GLASGOW', name: 'Glasgow' }, { id: 'OTHER', name: 'Other' }],
  WALES: [{ id: 'CARDIFF', name: 'Cardiff' }, { id: 'OTHER', name: 'Other' }],
  NI: [{ id: 'BELFAST', name: 'Belfast' }, { id: 'OTHER', name: 'Other' }],
  OTHER_GB: [{ id: 'OTHER', name: 'Other' }],
  PUNJAB: [{ id: 'LAHORE', name: 'Lahore' }, { id: 'FAISALABAD', name: 'Faisalabad' }, { id: 'RAWALPINDI', name: 'Rawalpindi' }, { id: 'OTHER', name: 'Other' }],
  SINDH: [{ id: 'KARACHI', name: 'Karachi' }, { id: 'HYDERABAD_PK', name: 'Hyderabad' }, { id: 'OTHER', name: 'Other' }],
  KPK: [{ id: 'PESHAWAR', name: 'Peshawar' }, { id: 'OTHER', name: 'Other' }],
  BALOCHISTAN: [{ id: 'QUETTA', name: 'Quetta' }, { id: 'OTHER', name: 'Other' }],
  GB_PK: [{ id: 'GILGIT', name: 'Gilgit' }, { id: 'OTHER', name: 'Other' }],
  AJK: [{ id: 'MUZAFFARABAD', name: 'Muzaffarabad' }, { id: 'OTHER', name: 'Other' }],
  ICT: [{ id: 'ISLAMABAD', name: 'Islamabad' }, { id: 'OTHER', name: 'Other' }],
  OTHER_PK: [{ id: 'OTHER', name: 'Other' }],
  NSW: [{ id: 'SYDNEY', name: 'Sydney' }, { id: 'NEWCASTLE', name: 'Newcastle' }, { id: 'OTHER', name: 'Other' }],
  VIC: [{ id: 'MELBOURNE', name: 'Melbourne' }, { id: 'GEELONG', name: 'Geelong' }, { id: 'OTHER', name: 'Other' }],
  QLD: [{ id: 'BRISBANE', name: 'Brisbane' }, { id: 'GOLD_COAST', name: 'Gold Coast' }, { id: 'OTHER', name: 'Other' }],
  WA: [{ id: 'PERTH', name: 'Perth' }, { id: 'OTHER', name: 'Other' }],
  SA: [{ id: 'ADELAIDE', name: 'Adelaide' }, { id: 'OTHER', name: 'Other' }],
  TAS: [{ id: 'HOBART', name: 'Hobart' }, { id: 'OTHER', name: 'Other' }],
  ACT: [{ id: 'CANBERRA', name: 'Canberra' }, { id: 'OTHER', name: 'Other' }],
  NT: [{ id: 'DARWIN', name: 'Darwin' }, { id: 'OTHER', name: 'Other' }],
  OTHER_AU: [{ id: 'OTHER', name: 'Other' }],
  SG_CENTRAL: [{ id: 'SINGAPORE', name: 'Singapore' }, { id: 'OTHER', name: 'Other' }],
  SG_EAST: [{ id: 'SINGAPORE', name: 'Singapore' }, { id: 'OTHER', name: 'Other' }],
  SG_NORTH: [{ id: 'SINGAPORE', name: 'Singapore' }, { id: 'OTHER', name: 'Other' }],
  SG_NORTH_EAST: [{ id: 'SINGAPORE', name: 'Singapore' }, { id: 'OTHER', name: 'Other' }],
  SG_WEST: [{ id: 'SINGAPORE', name: 'Singapore' }, { id: 'OTHER', name: 'Other' }],
  OTHER_SG: [{ id: 'OTHER', name: 'Other' }],
  SA_RIYADH: [{ id: 'RIYADH', name: 'Riyadh' }, { id: 'OTHER', name: 'Other' }],
  SA_MAKKAH: [{ id: 'JEDDAH', name: 'Jeddah' }, { id: 'MAKKAH', name: 'Makkah' }, { id: 'OTHER', name: 'Other' }],
  SA_MADINAH: [{ id: 'MADINAH', name: 'Madinah' }, { id: 'OTHER', name: 'Other' }],
  SA_EASTERN: [{ id: 'DAMMAM', name: 'Dammam' }, { id: 'KHOBAR', name: 'Khobar' }, { id: 'OTHER', name: 'Other' }],
  SA_OTHER: [{ id: 'OTHER', name: 'Other' }],
  OTHER_STATE: [{ id: 'OTHER', name: 'Other' }],
  OTHER: [],
};

/** Get states for a country. Returns array of { id, name }. */
export function getStatesByCountry(countryId) {
  if (!countryId) return [];
  return STATES_BY_COUNTRY[countryId] || [];
}

/** Get cities for a state. Returns array of { id, name }. If no list, returns empty (UI can show "Other" or text input). */
export function getCitiesByState(stateId) {
  if (!stateId) return [];
  return CITIES_BY_STATE[stateId] || [];
}
