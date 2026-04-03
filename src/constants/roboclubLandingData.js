/**
 * Dummy content for public /roboclub landing — replace with CMS or API when ready.
 */

export const ROBOCLUB_ABOUT = {
  headline: 'Build real robots. Learn with mentors. Compete on a global stage.',
  intro:
    'RoboClub is Technoxian’s school and college robotics hub—where teams level up from first solder joints to arena-ready machines.',
  mission:
    'Democratize hands-on robotics: structured learning, safe workshops, and fair paths to national and world competitions.',
  vision:
    'A planet-wide league where every young maker can prove skill—not privilege—through build quality, teamwork, and sportsmanship.',
  purpose:
    'Connect captains, members, and industry mentors so ideas become working bots, documented projects, and measurable outcomes.',
  gains: [
    {
      id: 'skills',
      title: 'Industry-ready skills',
      blurb: 'CAD, electronics, coding, and testing workflows used in real products.',
      icon: 'cpu',
    },
    {
      id: 'network',
      title: 'Trusted network',
      blurb: 'Squads, alumni, and partner labs you can collaborate with year-round.',
      icon: 'users',
    },
    {
      id: 'events',
      title: 'Competition pipeline',
      blurb: 'Clear path from club qualifiers to flagship Technoxian arenas.',
      icon: 'trophy',
    },
    {
      id: 'credentials',
      title: 'Portfolio & recognition',
      blurb: 'Showcase builds, certificates, and wins that internship panels understand.',
      icon: 'badge',
    },
  ],
};

export const LEARNING_TRACKS = [
  {
    id: 'beginner',
    level: 'Beginner',
    tagline: 'First circuits, first code, first rolling chassis.',
    featured: false,
    accent: 'from-emerald-500/20 to-cyan-500/10',
    border: 'border-emerald-500/30',
    iconColor: 'text-emerald-400',
    topics: [
      { title: 'Robotics fundamentals', detail: 'Motors, sensors, power, and safety basics.' },
      { title: 'Hands-on bot building', detail: 'Assemble a drive base and simple mechanisms.' },
      { title: 'AI / automation basics', detail: 'Logic, remote control, and intro to autonomy.' },
    ],
    durationWeeks: '8–10 weeks',
  },
  {
    id: 'intermediate',
    level: 'Intermediate',
    tagline: 'Iterate fast—reliable drivetrains and contest rules.',
    featured: true,
    accent: 'from-cyan-500/20 to-violet-500/10',
    border: 'border-cyan-500/40',
    iconColor: 'text-cyan-400',
    topics: [
      { title: 'Robotics fundamentals', detail: 'Torque, gearing, and failure modes.' },
      { title: 'Hands-on bot building', detail: 'Modular frames, pneumatics or combat-ready shells.' },
      { title: 'AI / automation basics', detail: 'PID, line follow, and simple CV pipelines.' },
    ],
    durationWeeks: '10–14 weeks',
  },
  {
    id: 'advanced',
    level: 'Advanced',
    tagline: 'Systems engineering for arena and research bots.',
    featured: false,
    accent: 'from-violet-500/20 to-fuchsia-500/10',
    border: 'border-violet-500/40',
    iconColor: 'text-violet-400',
    topics: [
      { title: 'Robotics fundamentals', detail: 'System budgets, EMI, and reliability testing.' },
      { title: 'Hands-on bot building', detail: 'Custom PCBs, swerve, or drone stacks.' },
      { title: 'AI / automation basics', detail: 'SLAM, behavior trees, edge ML deployment.' },
    ],
    durationWeeks: '14+ weeks',
  },
];

/** status: 'upcoming' | 'past' | 'ongoing' */
export const ROBOCLUB_EVENTS = [
  {
    id: 'ev1',
    name: 'RoboClub Winter Qualifier 2026',
    dateLabel: 'Jan 18 – Jan 19, 2026',
    location: 'Hyderabad Expo Arena, India',
    participation: 'Registered squads • Junior & Open tracks',
    summary: 'A fast-paced qualifier with safety checks, bracket matches, and mentor feedback to prepare squads for the season.',
    image:
      'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?auto=format&fit=crop&q=80&w=1200',
    status: 'past',
  },
  {
    id: 'ev2',
    name: 'Make-a-Bot Sprint Weekend',
    dateLabel: 'Mar 7 – Mar 8, 2026',
    location: 'Online + Pune Makerspace',
    participation: 'Open to all RoboClub members • Kits optional',
    summary: '48 hours of rapid building: chassis, wiring, test runs, and a demo day you can ship as a portfolio story.',
    image:
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1200',
    status: 'past',
  },
  {
    id: 'ev3',
    name: 'AI Drive Lab — Spring Cohort',
    dateLabel: 'Apr 2 – Apr 30, 2026',
    location: 'Hybrid (IST)',
    participation: 'Capped at 40 teams • Mentor office hours',
    summary: 'Weekly labs on tuning, autonomy basics, and field testing—designed to make your bot predictable under pressure.',
    image:
      'https://images.unsplash.com/photo-1526378722445-3676ce39b1da?auto=format&fit=crop&q=80&w=1200',
    status: 'ongoing',
  },
  {
    id: 'ev4',
    name: 'National Robotics Challenge — Zone North',
    dateLabel: 'May 15, 2026',
    location: 'Chandigarh Tech Campus',
    participation: 'Invitation from qualifiers • Safety inspection on-site',
    summary: 'Regional showdown for qualified squads—rule checks, arena rounds, and ranking points toward flagship meets.',
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200',
    status: 'upcoming',
  },
  {
    id: 'ev5',
    name: 'Technoxian World Robotics Championship',
    dateLabel: 'Aug 21 – Aug 24, 2026',
    location: 'Delhi NCR',
    participation: 'Global squads • Multiple game formats',
    summary: 'The main stage: international brackets, live judging, and high-stakes matches across multiple categories.',
    image:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200',
    status: 'upcoming',
  },
  {
    id: 'ev6',
    name: 'RoboClub Mentor Meetup',
    dateLabel: 'Jun 4, 2026',
    location: 'Zoom + Bengaluru hub',
    participation: 'Captains & lead coaches',
    summary: 'Strategy, build reviews, and planning—meet mentors, share blockers, and align on the next competition milestone.',
    image:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=1200',
    status: 'upcoming',
  },
];

export const SHOWCASE_PROJECTS = [
  {
    id: 'p1',
    title: 'HiveMind Swarm Rover',
    description: 'Three micro-rovers share a mesh map for cooperative arena sweeping.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800',
    author: 'Team Orbit • Mumbai',
    tags: ['ROS2', 'Swarm'],
  },
  {
    id: 'p2',
    title: 'Precision Payload Arm',
    description: 'Custom SCARA-inspired arm with vision-guided pick-and-place.',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    author: 'MechDelta • Ahmedabad',
    tags: ['Vision', 'Mechanism'],
  },
  {
    id: 'p3',
    title: 'Combat Minibot “Tungsten”',
    description: '4kg shell, hardened drivetrain, modular weapon pod for quick swaps.',
    image: 'https://images.unsplash.com/photo-1535378437323-95288ac9dd5c?auto=format&fit=crop&q=80&w=800',
    author: 'IronVectors • Jaipur',
    tags: ['Combat', 'Rapid prototype'],
  },
  {
    id: 'p4',
    title: 'AgriLane Weeder Drone',
    description: 'Low-altitude vision to spot crop rows and mark weeds for ground bots.',
    image: 'https://images.unsplash.com/photo-1473968512647-3ae44763041c?auto=format&fit=crop&q=80&w=800',
    author: 'GreenCircuits • Kochi',
    tags: ['Drone', 'CV'],
  },
];

export const SHOWCASE_KITS = [
  {
    id: 'k1',
    name: 'TX-Starter Drive Kit',
    price: '$89',
    blurb: 'Motors, wheels, motor shield, and lesson path for your first bot.',
    image: 'https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&q=80&w=600',
    badge: 'Bestseller',
  },
  {
    id: 'k2',
    name: 'Sensor Fusion Pack',
    price: '$149',
    blurb: 'IMU, ToF, line array—calibrated profiles for autonomous labs.',
    image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&q=80&w=600',
    badge: 'Lab bundle',
  },
  {
    id: 'k3',
    name: 'Competition Ready Bundle',
    price: '$329',
    blurb: 'Chassis plates, certified battery pack, and arena compliance checklist.',
    image: 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&q=80&w=600',
    badge: 'Arena',
  },
];

/**
 * World Robotics Championship — published ranking (order = rank).
 * countryCode: ISO 3166-1 alpha-2 for flag assets (e.g. flagcdn).
 */
export const WRC_WINNERS_RANKING = [
  { id: 'wrc-2025-01', rank: 1, name: 'ROBO ODISHA', country: 'India', countryCode: 'in' },
  { id: 'wrc-2025-02', rank: 2, name: 'TEAM WARRIORS', country: 'India', countryCode: 'in' },
  { id: 'wrc-2025-03', rank: 3, name: 'HEAVY DRIVERS', country: 'India', countryCode: 'in' },
  { id: 'wrc-2025-04', rank: 4, name: 'Robotics and Aviation', country: 'India', countryCode: 'in' },
  { id: 'wrc-2025-05', rank: 5, name: 'Wrc Azerbaijan', country: 'Azerbaijan', countryCode: 'az' },
  { id: 'wrc-2025-06', rank: 6, name: 'KARMA YODHA BOTS', country: 'India', countryCode: 'in' },
  { id: 'wrc-2025-07', rank: 7, name: 'ATOM', country: 'Russia', countryCode: 'ru' },
  { id: 'wrc-2025-08', rank: 8, name: 'Team Xenon', country: 'India', countryCode: 'in' },
  { id: 'wrc-2025-09', rank: 9, name: 'Sama Al-Iraq School', country: 'Iraq', countryCode: 'iq' },
  { id: 'wrc-2025-10', rank: 10, name: 'Harimohan Science Club', country: 'Bangladesh', countryCode: 'bd' },
];

export const TESTIMONIALS = [
  {
    id: 't1',
    name: 'Ananya Krishnan',
    role: 'Captain, Team Ionforge',
    image: 'https://i.pravatar.cc/200?img=32',
    quote:
      'We went from a cardboard prototype to a qualifier win in one season. Mentors actually replied in the build threads.',
    achievements: ['Internship: Robotics OEM (2025)', '2× zonal finalist'],
  },
  {
    id: 't2',
    name: 'Marcus Dell',
    role: 'Lead Programmer',
    image: 'https://i.pravatar.cc/200?img=12',
    quote:
      'The learning track forced us to document everything—judges and sponsors finally saw our stack clearly.',
    achievements: ['World Robotics Championship — top 16', 'Open-source CV toolkit'],
  },
  {
    id: 't3',
    name: 'Priya Menon',
    role: 'Faculty mentor',
    image: 'https://i.pravatar.cc/200?img=45',
    quote:
      'Safety-first workshops plus a real competition calendar keeps parents and administration confident.',
    achievements: ['Club grew from 8 to 44 members', 'STEM grant secured'],
  },
  {
    id: 't4',
    name: 'Diego Alvarez',
    role: 'Member, Drone track',
    image: 'https://i.pravatar.cc/200?img=15',
    quote:
      'Hands-on bot builds plus the events pipeline meant I always knew the next milestone—not random hacks.',
    achievements: ['Drone race — regional 3rd', 'University early admit — engineering'],
  },
];
