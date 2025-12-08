// Centralized mock data and site defaults.
export const MOCK_TEAMS = [
  {
    id: 't1',
    name: 'RoboTitans India',
    country: 'India',
    rank: 1,
    points: 2450,
    logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=RoboTitans',
    wins: 42,
    losses: 5,
    earnings: '$120,000',
    history: 'Founded in 2018, RoboTitans have dominated the Asian circuit.',
    players: [
      {
        id: 1,
        name: 'Aarav Patel',
        role: 'Captain / Pilot',
        matches: 45,
        winRate: '88%',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      },
      {
        id: 2,
        name: 'Priya Sharma',
        role: 'Lead Programmer',
        matches: 42,
        winRate: '85%',
        image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop',
      },
    ],
  },
  {
    id: 't2',
    name: 'Cyber United UK',
    country: 'UK',
    rank: 2,
    points: 2380,
    logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=CyberUK',
    wins: 38,
    losses: 8,
    earnings: '$95,000',
    history: 'European Champions 2024.',
    players: [
      {
        id: 4,
        name: 'Sarah Jenkins',
        role: 'Captain',
        matches: 30,
        winRate: '70%',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      },
    ],
  },
];

export const THINK_TANK_LOGOS = [
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/2560px-IBM_logo.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Nvidia_logo.svg/2560px-Nvidia_logo.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Cisco_logo_blue_2016.svg/2560px-Cisco_logo_blue_2016.svg.png',
];

export const CAREERS = [
  { id: 1, title: 'Global Events Manager', location: 'Dubai / Hybrid', type: 'Full-time' },
  { id: 2, title: 'Technical Rulebook Author', location: 'Remote', type: 'Contract' },
  { id: 3, title: 'Regional Partner Coordinator', location: 'Singapore', type: 'Full-time' },
];

export const GAME_CATEGORIES = [
  { id: 'roborace', name: 'Robo Race', desc: 'High speed autonomous racing on variable terrain.', players: '12k+', prize: '$50,000', icon: '🏎️' },
  { id: 'robosoccer', name: 'Robo Soccer', desc: 'Tactical team sport. 3v3 autonomous bots.', players: '8k+', prize: '$35,000', icon: '⚽' },
  { id: 'droneracing', name: 'Drone Racing', desc: 'FPV obstacle course racing at 100mph.', players: '15k+', prize: '$60,000', icon: '🚁' },
  { id: 'sumobot', name: 'Sumo Bot', desc: 'Strength and strategy combat in the ring.', players: '25k+', prize: '$25,000', icon: '🥋' },
  { id: 'water', name: 'Water Rocket', desc: 'Precision and distance challenges.', players: '10k+', prize: '$15,000', icon: '🚀' },
  { id: 'innov', name: 'Innovation Challenge', desc: 'Solving real world problems with tech.', players: '5k+', prize: '$75,000', icon: '💡' },
];

export const NEWS_ITEMS = [
  { id: 1, tag: 'REGULATION', date: 'NOV 27, 2025', title: 'New Autonomous Drone Regulations (ADR-25) Released', desc: 'The board has officially ratified the new guidelines for autonomous flight.' },
  { id: 2, tag: 'EVENT', date: 'NOV 26, 2025', title: 'Technoxian World Cup Venue Finalized: Dubai Exhibition Centre', desc: 'The largest robotics arena in history will be constructed at DEC.' },
  { id: 3, tag: 'PARTNERSHIP', date: 'NOV 25, 2025', title: 'Worso Welcomes South Korea as Strategic Partner', desc: 'The KRA officially joins the federation.' },
];

export const DEFAULT_SITES = {
  global: {
    id: 'global',
    name: 'WORSO Global',
    logo_text: 'WORSO',
    sub_text: 'WORLD ROBOTICS SOCIETY',
    theme: 'blue',
    colors: {
      primary: 'bg-blue-600',
      hover: 'hover:bg-blue-700',
      text: 'text-blue-600',
      gradient: 'bg-[#0f172a]',
    },
    is_partner: false,
    local_events: [],
  },
  uae: {
    id: 'uae',
    name: 'TECHNOXIAN UAE',
    logo_text: 'TECHNOXIAN UAE',
    sub_text: 'OFFICIAL REGIONAL CHAPTER',
    theme: 'emerald',
    colors: {
      primary: 'bg-emerald-600',
      hover: 'hover:bg-emerald-700',
      text: 'text-emerald-500',
      gradient: 'bg-[#022c22]',
    },
    is_partner: true,
    local_events: [
      { id: 1, title: 'Dubai Schools Challenge', date: 'Jan 15, 2026', location: 'GEMS Academy', status: 'Open' },
      { id: 2, title: 'Abu Dhabi Zonal Qualifier', date: 'Feb 20, 2026', location: 'ADNEC', status: 'Upcoming' },
    ],
  },
};

