/**
 * Dummy content for public /roboclub landing — replace with CMS or API when ready.
 */

/** Hero CTA: who RoboClub is for (chips above primary action). */
export const HERO_AUDIENCE_TAGS = [
  'University',
  'School',
  'College',
  'Vocational institute',
  'Group',
];

export const ROBOCLUB_ABOUT = {
  headline: 'Build real robots. Learn with mentors. Compete on a global stage.',
  intro:
    'ExClub by TechnoXian is a dynamic platform designed to nurture innovation, creativity, and hands-on learning in robotics, AI, and emerging technologies, It empowers students and institutions to build, experiment, and compete at national and global levels.',
  mission:
    'To provide practical learning, competitive exposure, and industry connect through robotics programs, events, and real-world challenges.',
  vision:
    'To create a global community of future innovators and leaders in robotics and advanced technologies.',
  purpose:
    'School & College Students Engineering & Tech Enthusiasts Educational Institutions Robotics & STEM Trainers',
gains: [
  {
    id: 'skills',
    title: '🤖 Hands-on Robotics & Coding',
    blurb: 'Build real robots, learn AI, IoT, and coding through practical experience.',
    icon: 'cpu',
  },
  {
    id: 'network',
    title: '🏆 Compete at TechnoXian',
    blurb: 'Participate in world-class robotics competitions and showcase your skills.',
    icon: 'users',
  },
  {
    id: 'events',
    title: '🌍 Global Exposure & Recognition',
    blurb: 'Get international visibility, certifications, and industry recognition.',
    icon: 'trophy',
  },
  {
    id: 'credentials',
    title: '💼 Career & Startup Opportunities',
    blurb: 'Unlock internships, career pathways, and opportunities to build your own tech startup.',
    icon: 'badge',
  },
],
};

export const LEARNING_TRACKS = [
  {
    id: 'beginner',
    level: 'Beginner',
    levelSubtitle: 'Foundation',
    tagline: 'Core robotics, microcontroller basics, and safe hands-on electronics.',
    featured: false,
    accent: 'from-emerald-500/20 to-cyan-500/10',
    border: 'border-emerald-500/30',
    iconColor: 'text-emerald-400',
    topics: [
      {
        emoji: '🤖',
        title: 'Robotics Fundamentals',
        detail: 'Basics of robots, sensors & components.',
      },
      {
        emoji: '🔌',
        title: 'Arduino Programming',
        detail: 'Hands-on microcontroller coding & circuits.',
      },
      {
        emoji: '⚙️',
        title: 'Electronics & Circuit Design',
        detail: 'Understanding wiring, motors & basic hardware.',
      },
    ],
    durationWeeks: '8–10 weeks',
  },
  {
    id: 'intermediate',
    level: 'Intermediate',
    levelSubtitle: 'Skill Building',
    tagline: 'Apply AI, IoT, and control theory to real connected systems.',
    featured: true,
    accent: 'from-cyan-500/20 to-violet-500/10',
    border: 'border-cyan-500/40',
    iconColor: 'text-cyan-400',
    topics: [
      {
        emoji: '🧠',
        title: 'Artificial Intelligence Basics',
        detail: 'Intro to AI, ML concepts & applications.',
      },
      {
        emoji: '🌐',
        title: 'Internet of Things (IoT)',
        detail: 'Smart devices, connectivity & real-world projects.',
      },
      {
        emoji: '⚡',
        title: 'Automation & Control Systems',
        detail: 'Build automated systems & logic-based controls.',
      },
    ],
    durationWeeks: '10–14 weeks',
  },
  {
    id: 'advanced',
    level: 'Advanced',
    levelSubtitle: 'Innovation & Industry',
    tagline: 'Autonomy, aerial systems, and industrial robotics at scale.',
    featured: false,
    accent: 'from-violet-500/20 to-fuchsia-500/10',
    border: 'border-violet-500/40',
    iconColor: 'text-violet-400',
    topics: [
      {
        emoji: '🚗',
        title: 'Autonomous Robotics',
        detail: 'Self-driving bots, navigation & computer vision.',
      },
      {
        emoji: '🚁',
        title: 'Drone Technology & Programming',
        detail: 'UAV design, control & applications.',
      },
      {
        emoji: '🏭',
        title: 'Industry 4.0 & Smart Manufacturing',
        detail: 'Robotics in industrial automation & smart factories.',
      },
    ],
    durationWeeks: '14+ weeks',
  },
];

/**
 * Arena calendar — zonal → national → international (2026), plus partner events abroad.
 * Zonal hero images: Kapaleeshwarar (Chennai), Shaniwar Wada (Pune), Rock Garden (Chandigarh), Howrah Bridge (Kolkata). National: India Gate; international: global finals.
 * partnerEvent: true shows a “Partner event” chip on the card (see RoboClubEventsSection).
 * status: 'upcoming' | 'past' | 'ongoing'
 * famousPlace (optional): { name, region?, image?, imageAlt?, theme?, gallery?, galleryHeading?, galleries? } —
 *   overlay + FamousPlaceDetail; `theme` replaces “Famous place” kicker;
 *   `galleries` is { heading, items: { src, alt }[] }[] for stacked FamousPlaceGallery blocks (preferred for multiple themes);
 *   legacy: single `gallery` + `galleryHeading` still works; omit `image` to reuse card hero.
 * Egypt/Venezuela card images use Wikimedia Commons (stable URLs); some Unsplash `photo-*` ids have been returning 404.
 * Thailand 2026: Sumo / Bots Combat etc. — use `famousPlace.theme` + `galleries` (e.g. Beaches & Islands).
 * heroBanner (optional): { kicker?, title, subtitle? } — legacy caption when famousPlace is omitted.
 */
export const ROBOCLUB_EVENTS = [
  {
    id: 'ev-past-1',
    name: 'ExClub Winter Qualifier 2026',
    dateLabel: 'Jan 18 – Jan 19, 2026',
    location: 'Hyderabad Expo Arena, India',
    participation: 'Registered squads • Junior & Open tracks',
    summary: 'A fast-paced qualifier with safety checks, bracket matches, and mentor feedback to prepare squads for the season.',
    image:
      'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?auto=format&fit=crop&q=80&w=1200',
    imageAlt: 'Hyderabad skyline and cityscape',
    status: 'past',
  },
  {
    id: 'ev-past-2',
    name: 'Make-a-Bot Sprint Weekend',
    dateLabel: 'Mar 7 – Mar 8, 2026',
    location: 'Online + Pune Makerspace',
    participation: 'Open to all ExClub members • Kits optional',
    summary: '48 hours of rapid building: chassis, wiring, test runs, and a demo day you can ship as a portfolio story.',
    image:
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1200',
    imageAlt: 'Robotics workshop and hands-on assembly',
    status: 'past',
  },
  {
    id: 'ev-thailand-2026-01',
    name: 'Technoxian Thailand — Sumo Bots & Fastest Line Follower',
    dateLabel: '24th – 25th January 2026',
    location: 'Thailand • Venue TBD',
    participation: 'School & college teams • Thailand-only programme',
    summary:
      'Two-day arena in Thailand: sumo robotics and fastest line-follower ',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Templo_Wat_Arun%2C_Bangkok%2C_Tailandia%2C_2013-08-22%2C_DD_30.jpg/1280px-Templo_Wat_Arun%2C_Bangkok%2C_Tailandia%2C_2013-08-22%2C_DD_30.jpg',
    imageAlt: 'Wat Arun (Temple of Dawn) — Bangkok, Thailand',
    partnerEvent: true,

    status: 'past',
  },
  {
    id: 'ev-thailand-2026-02',
    name: 'Technoxian Thailand — Robo Soccer & Robo Race',
    dateLabel: '7th – 8th March 2026',
    location: 'Thailand • Venue TBD',
    participation: 'School & college teams • Thailand-only programme',
    summary:
      'Weekend of robo soccer and robo race categories: brackets, pit lanes, and rankings for teams competing exclusively in Thailand.',
    image:
      'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=1200',
    imageAlt: 'Ornate temple architecture — Thailand',
    partnerEvent: true,
    status: 'past',
  },
  {
    id: 'ev-ongoing-1',
    name: 'AI Drive Lab — Spring Cohort',
    dateLabel: 'Apr 2 – Apr 30, 2026',
    location: 'Hybrid (IST)',
    participation: 'Capped at 40 teams • Mentor office hours',
    summary: 'Weekly labs on tuning, autonomy basics, and field testing—designed to make your bot predictable under pressure.',
    image:
      'https://images.unsplash.com/photo-1526378722445-3676ce39b1da?auto=format&fit=crop&q=80&w=1200',
    imageAlt: 'Technology lab and circuit hardware',
    status: 'ongoing',
  },
  {
    id: 'ev-thailand-2026-03',
    name: 'Technoxian Thailand — Drone, Maze Solver & Innovation',
    dateLabel: '9th – 10th May 2026',
    location: 'Thailand • Venue TBD',
    participation: 'School & college teams • Thailand-only programme',
    summary:
      'Drone challenges, maze-solving robots, and an innovation showcase—three tracks over one weekend, open only to teams in Thailand.',
    image:
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80&w=1200',
    imageAlt: 'Tropical beach and longtail boats — Southern Thailand',
    partnerEvent: true,
 
    status: 'upcoming',
  },
  {
    id: 'ev-zonal-chennai',
    name: 'Zonal round — Chennai',
    dateLabel: '19th – 20th June 2026',
    location: 'Chennai, Tamil Nadu • Venue TBD',
    participation: 'Regional school & college teams',
    summary: 'South zone arena: qualifiers, safety checks, and ranking points toward the national championship.',
    image:
      'https://images.unsplash.com/photo-1678676136671-07fd6b7cc823?auto=format&fit=crop&q=80&w=1200',
    imageAlt: 'Sri Kapaleeshwarar Temple gopuram, Mylapore, Chennai, Tamil Nadu',
    /** Optional hero landmark banner (see RoboClubEventsSection). */
    heroBanner: {
      // kicker: 'Chennai',
      // title: 'Sri Kapaleeshwarar Temple',
      // subtitle: 'Mylapore • Tamil Nadu',
    },
    status: 'upcoming',
  },
  {
    id: 'ev-thailand-2026-04',
    name: 'Technoxian Thailand — Bots Combat',
    dateLabel: '20th – 21st June 2026',
    location: 'Thailand • Venue TBD',
    participation: 'School & college teams • Thailand-only programme',
    summary:
      'Combat robotics weekend in Thailand: weight-class checks, arena safety, and elimination brackets for bots combat—Thailand venue only.',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Isla_Phi_Phi_Lay%2C_Tailandia%2C_2013-08-19%2C_DD_04.JPG/1280px-Isla_Phi_Phi_Lay%2C_Tailandia%2C_2013-08-19%2C_DD_04.JPG',
    imageAlt: 'Phi Phi Leh limestone cliffs and Andaman Sea — Krabi, Thailand',
    partnerEvent: true,
 
    status: 'upcoming',
  },
  {
    id: 'ev-zonal-pune',
    name: 'Zonal round — Pune',
    dateLabel: '27th – 28th June 2026',
    location: 'Pune, Maharashtra • Venue TBD',
    participation: 'Regional school & college teams',
    summary: 'West zone showdown with arena matches and mentor feedback ahead of nationals.',
    image:
      'https://images.unsplash.com/photo-1589629041152-fb71b9c5dbcd?auto=format&fit=crop&q=80&w=1200',
    imageAlt: 'Shaniwar Wada fort palace, Pune, Maharashtra',
    status: 'upcoming',
  },
  {
    id: 'ev-zonal-chandigarh',
    name: 'Zonal round — Chandigarh',
    dateLabel: '5th – 6th July 2026',
    location: 'Chandigarh • Venue TBD',
    participation: 'Regional school & college teams',
    summary: 'North zone meet: brackets, inspections, and rankings on the road to the national stage.',
    image:
      'https://images.unsplash.com/photo-1716131985076-07350de31afd?auto=format&fit=crop&q=80&w=1200',
    imageAlt: 'Rock Garden stone sculptures, Chandigarh — famous public monument',
    status: 'upcoming',
  },
  {
    id: 'ev-zonal-kolkata',
    name: 'Zonal round — Kolkata',
    dateLabel: '11th – 12th July 2026',
    location: 'Kolkata, West Bengal • Venue TBD',
    participation: 'Regional school & college teams',
    summary: 'East zone battles for the last seats at the National Robotics Championship.',
    image:
      'https://images.unsplash.com/photo-1742325646212-f917ba1feeaa?auto=format&fit=crop&q=80&w=1200',
    imageAlt: 'Howrah Bridge over the Hooghly River, Kolkata, West Bengal',
    status: 'upcoming',
  },
  {
    id: 'ev-national-2026',
    name: 'National Robotics Championship',
    dateLabel: '23th – 25th October 2026',
    location: 'India • Venue TBD',
    participation: 'Top teams from all zonal rounds',
    summary: 'The national finale: elite squads from every zone compete for the international finals.',
    image:
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=1200',
    imageAlt: 'India Gate, New Delhi — national landmark',
    status: 'upcoming',
  },
  {
    id: 'ev-international-2026',
    name: 'International finals 2027',
    dateLabel: 'October 2026',
    location: 'Venue TBD',
    participation: '4 days of world-class competition',
    summary: 'The world stage: multi-day international brackets, live judging, and top-tier matches across categories.',
    image:
      'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=1200',
    imageAlt: 'International city skyline — global finals stage',
    status: 'upcoming',
  },
  {
    id: 'ev-partner-azerbaijan-2026',
    name: 'Partner event — Azerbaijan',
    dateLabel: '27th – 28th June 2026',
    location: 'Azerbaijan • Venue TBD',
    participation: 'Invited squads • Hosted with international partner organisations',
    summary:
      'A two-day partner programme in Azerbaijan: showcases, collaboration, and arena-format robotics alongside global peers.',
    image:
      'https://images.unsplash.com/photo-1689188930114-6a6824a21390?auto=format&fit=crop&q=80&w=1200',
    imageAlt: 'Flame Towers skyline, Baku, Azerbaijan',
    partnerEvent: true,
    heroBanner: {
      // kicker: 'Baku',
      // title: 'Flame Towers',
      // subtitle: 'Azerbaijan',
    },
    status: 'upcoming',
  },
  {
    id: 'ev-partner-egypt-2026',
    name: 'Technoxian Egypt',
    dateLabel: 'June 2026',
    location: 'Egypt',
    participation: 'School teams • STEM & robotics tracks',
    summary:
      'Regional Technoxian competition in Egypt focused on STEM excellence, hands-on robotics challenges, and innovation for school students.',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/All_Gizah_Pyramids.jpg/1280px-All_Gizah_Pyramids.jpg',
    imageAlt: 'Great Pyramid of Giza and ancient monuments — Egypt',
    partnerEvent: true,
    famousPlace: {
      // name: 'Ancient Wonders',
      // region: 'Egypt',
      // imageAlt: 'Great Pyramid of Giza — Ancient Wonders, Egypt',
    },
    status: 'upcoming',
  },
  {
    id: 'ev-partner-venezuela-2026',
    name: 'Technoxian International Championship – Venezuela',
    dateLabel: 'July 9 – July 11, 2026',
    location: 'Bicentennial University of Aragua, Venezuela',
    participation: 'Latin America & international squads',
    summary:
      'International robotics and innovation championship at the Bicentennial University of Aragua, uniting teams from across Latin America and beyond.',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/3/33/Angel_falls_in_Venezuela_001.JPG',
    imageAlt: 'Angel Falls — tepuis and waterfalls, Venezuela',
    partnerEvent: true,
    famousPlace: {
      // name: 'Angel Falls',
      // region: 'Venezuela',
      // imageAlt: "Angel Falls — world's highest uninterrupted waterfall, Venezuela",
    },
    status: 'upcoming',
  },
  {
    id: 'ev-partner-ghana-2027',
    name: 'Partner event — Ghana',
    dateLabel: 'January 2027',
    location: 'Accra, Ghana • Kwame Nkrumah Memorial Park',
    participation: 'Invited teams • Partner pathway & cultural showcase',
    summary:
      'Opening partner meet in Ghana at the Kwame Nkrumah Memorial Park — ceremonies, STEM exchange, and robotics showcase.',
    image:
      'https://images.unsplash.com/photo-1733141175074-d373ff3baae9?auto=format&fit=crop&q=80&w=1200',
    imageAlt: 'Walkway and monument at Kwame Nkrumah Memorial Park, Accra, Ghana',
    partnerEvent: true,
    heroBanner: {
      // kicker: 'Accra',
      // title: 'Kwame Nkrumah Memorial Park',
      // subtitle: 'Ghana',
    },
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
