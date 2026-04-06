/**
 * Canonical URL segments under `/about/:segment` (and `/:locationCode/about/:segment`).
 * Legacy hash IDs (pre–split routes) map for redirects.
 */
export const ABOUT_NAV = [
  { segment: 'about-worso', label: 'About WORSO' },
  { segment: 'mission-vision', label: 'Mission & Vision' },
  { segment: 'strategy', label: 'Strategy' },
  { segment: 'presidents-message', label: "President's Message" },
  { segment: 'advisory-board', label: 'Advisory Board' },
  { segment: 'executive-committee', label: 'Executive Committee' },
  { segment: 'federation-services', label: 'Federation Services' },
  { segment: 'tech-for-good', label: 'Tech for Good' },
  { segment: 'working-at-worso', label: 'Working at WORSO' },
  { segment: 'referees', label: 'Referees' },
];

export const ABOUT_SEGMENTS = ABOUT_NAV.map((item) => item.segment);

/** Legacy `#hash` → current path segment */
export const LEGACY_HASH_TO_SEGMENT = {
  'about-worso': 'about-worso',
  governance: 'mission-vision',
  strategy: 'strategy',
  president: 'presidents-message',
  advisory: 'advisory-board',
  board: 'executive-committee',
  'federation-services': 'federation-services',
  associates: 'mission-vision',
  'tech-for-good': 'tech-for-good',
  referees: 'referees',
  'working-at-worso': 'working-at-worso',
};
