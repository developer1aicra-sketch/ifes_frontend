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
  AE: [],
  GB: [],
  PK: [],
  BD: [],
  AU: [],
  SG: [],
  SA: [],
  OTHER: [],
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
  FL: [],
  AL: [],
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
