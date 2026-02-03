// Centralized mock data and site defaults.
export const MOCK_TEAMS = [
  {
    id: 't1',
    name: 'RoboTitans India',
    country: 'India',
    flag: '🇮🇳',
    rank: 1,
    points: 2450,
    logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=RoboTitans',
    wins: 42,
    losses: 5,
    earnings: '$120,000',
    worldTitles: 2,
    history: 'Founded in 2018, RoboTitans have dominated the Asian circuit.',
    participations: [
      { year: 2022, placement: 'Champions' },
      { year: 2023, placement: 'Runner-up' },
      { year: 2024, placement: 'Semi-final' },
    ],
    players: [
      {
        id: 1,
        name: 'Aarav Patel',
        role: 'Captain / Pilot',
        matches: 45,
        winRate: '88%',
        earnings: '$55k',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      },
      {
        id: 2,
        name: 'Priya Sharma',
        role: 'Lead Programmer',
        matches: 42,
        winRate: '85%',
        earnings: '$40k',
        image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop',
      },
      {
        id: 3,
        name: 'Kabir Mehta',
        role: 'Systems Architect',
        matches: 30,
        winRate: '81%',
        earnings: '$25k',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      },
    ],
  },
  {
    id: 't2',
    name: 'Cyber United UK',
    country: 'UK',
    flag: '🇬🇧',
    rank: 2,
    points: 2380,
    logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=CyberUK',
    wins: 38,
    losses: 8,
    earnings: '$95,000',
    worldTitles: 1,
    history: 'European Champions 2024.',
    participations: [
      { year: 2022, placement: 'Quarter-final' },
      { year: 2023, placement: 'Champions' },
      { year: 2024, placement: 'Group Stage' },
    ],
    players: [
      {
        id: 4,
        name: 'Sarah Jenkins',
        role: 'Captain',
        matches: 30,
        winRate: '70%',
        earnings: '$35k',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      },
      {
        id: 5,
        name: 'Liam Carter',
        role: 'Mechanical Lead',
        matches: 28,
        winRate: '68%',
        earnings: '$22k',
        image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400&h=400&fit=crop',
      },
    ],
  },
  {
    id: 't3',
    name: 'Desert Falcons UAE',
    country: 'UAE',
    flag: '🇦🇪',
    rank: 7,
    points: 1890,
    logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=DesertFalcons',
    wins: 25,
    losses: 11,
    earnings: '$62,000',
    worldTitles: 0,
    history: 'Fan favorites known for precision drone maneuvers.',
    participations: [
      { year: 2023, placement: 'Top 16' },
      { year: 2024, placement: 'Top 8' },
    ],
    players: [
      {
        id: 6,
        name: 'Amira Al Mansoori',
        role: 'Lead Pilot',
        matches: 26,
        winRate: '74%',
        earnings: '$18k',
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop',
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
  {
    id: 'roborace',
    name: 'Robo Race',
    desc: 'High speed autonomous racing on variable terrain.',
    players: '12k+',
    prize: '$50,000',
    icon: '🏎️',
    rulebook: 'https://example.com/rules/roborace.pdf',
    model: 'Arena 3D: Canyon Sprint',
    scoring: 'Lap time + obstacle penalties',
  },
  {
    id: 'robosoccer',
    name: 'Robo Soccer',
    desc: 'Tactical team sport. 3v3 autonomous bots.',
    players: '8k+',
    prize: '$35,000',
    icon: '⚽',
    rulebook: 'https://example.com/rules/robosoccer.pdf',
    model: 'Arena 3D: Hex Turf',
    scoring: 'Goals + possession dominance',
  },
  {
    id: 'droneracing',
    name: 'Drone Racing',
    desc: 'FPV obstacle course racing at 100mph.',
    players: '15k+',
    prize: '$60,000',
    icon: '🚁',
    rulebook: 'https://example.com/rules/droneracing.pdf',
    model: 'Arena 3D: Neon Gates',
    scoring: 'Fastest lap; crash penalties',
  },
  {
    id: 'sumobot',
    name: 'Sumo Bot',
    desc: 'Strength and strategy combat in the ring.',
    players: '25k+',
    prize: '$25,000',
    icon: '🥋',
    rulebook: 'https://example.com/rules/sumobot.pdf',
    model: 'Arena 3D: Dual Circle',
    scoring: 'Ring outs + control points',
  },
  {
    id: 'water',
    name: 'Water Rocket',
    desc: 'Precision and distance challenges.',
    players: '10k+',
    prize: '$15,000',
    icon: '🚀',
    rulebook: 'https://example.com/rules/water-rocket.pdf',
    model: 'Arena 3D: Splashway',
    scoring: 'Distance + accuracy',
  },
  {
    id: 'innov',
    name: 'Innovation Challenge',
    desc: 'Solving real world problems with tech.',
    players: '5k+',
    prize: '$75,000',
    icon: '💡',
    rulebook: 'https://example.com/rules/innovation.pdf',
    model: 'Arena 3D: Prototype Lab',
    scoring: 'Impact + feasibility',
  },
  {
    id: 'battlebots',
    name: 'Battle Bots',
    desc: 'Combat arena for tactical destruction.',
    players: '18k+',
    prize: '$45,000',
    icon: '🛡️',
    rulebook: 'https://example.com/rules/battlebots.pdf',
    model: 'Arena 3D: Steel Yard',
    scoring: 'Damage + control',
  },
  {
    id: 'agrodrone',
    name: 'Agro Drone',
    desc: 'Precision spraying and seeding challenges.',
    players: '6k+',
    prize: '$28,000',
    icon: '🌾',
    rulebook: 'https://example.com/rules/agrodrone.pdf',
    model: 'Arena 3D: Farmlands',
    scoring: 'Coverage + conservation',
  },
  {
    id: 'rescue',
    name: 'Rescue Relay',
    desc: 'Autonomous bots for disaster response.',
    players: '7k+',
    prize: '$32,000',
    icon: '🚒',
    rulebook: 'https://example.com/rules/rescue.pdf',
    model: 'Arena 3D: Quake Zone',
    scoring: 'Victim retrieval + time',
  },
];

export const NEWS_ITEMS = [
  {
    id: 1,
    category: 'Regulation',
    tag: 'REGULATION',
    date: 'Nov 27, 2025',
    title: 'New Autonomous Drone Regulations (ADR-25) Released',
    desc: 'The board has officially ratified the new guidelines for autonomous flight.',
    body: 'The World Robotics Society has officially ratified the new Autonomous Drone Regulations (ADR-25), establishing comprehensive safety protocols and operational standards for drone racing competitions worldwide. These regulations will be synchronized across all partner subdomains via middleware, ensuring consistent enforcement from local qualifiers to the World Cup finals.',
    featuredImage: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=500&fit=crop',
    sampleImages: [
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
    ],
    fullContent: [
      'The World Robotics Society has officially ratified the new Autonomous Drone Regulations (ADR-25), establishing comprehensive safety protocols and operational standards for drone racing competitions worldwide. These regulations will be synchronized across all partner subdomains via middleware, ensuring consistent enforcement from local qualifiers to the World Cup finals.',
      'The ADR-25 framework introduces mandatory telemetry logging, real-time altitude restrictions, and automated collision avoidance systems. All participating teams must submit their drone specifications for pre-competition certification, with compliance checks performed by AI Referee systems at every event.',
      'Partner nations will receive automatic rulebook updates through the federated middleware, eliminating version conflicts and ensuring all regional qualifiers operate under identical standards. This marks a significant milestone in WORSO\'s mission to create a unified, safe, and fair competitive environment for autonomous sports.',
    ],
  },
  {
    id: 2,
    category: 'Event',
    tag: 'EVENT',
    date: 'Nov 26, 2025',
    title: 'Technoxian World Cup Venue Finalized: Dubai Exhibition Centre',
    desc: 'The largest robotics arena in history will be constructed at DEC.',
    body: 'WORSO has announced that the Technoxian World Cup 2026 will be held at the Dubai Exhibition Centre, marking the largest robotics competition venue in history. The facility will feature nine dedicated competition zones, innovation expo halls, and spectator concourses capable of hosting over 2.5 million visitors across the four-day championship.',
    featuredImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=500&fit=crop',
    sampleImages: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    ],
    fullContent: [
      'WORSO has announced that the Technoxian World Cup 2026 will be held at the Dubai Exhibition Centre, marking the largest robotics competition venue in history. The facility will feature nine dedicated competition zones, innovation expo halls, and spectator concourses capable of hosting over 2.5 million visitors across the four-day championship.',
      'The Dubai Exhibition Centre will undergo a $50 million transformation to accommodate the World Cup, including custom-built arenas for each competition category, state-of-the-art broadcasting facilities, and integrated AI Referee monitoring systems. The venue will serve as a model for future partner-hosted events.',
      'Registration for teams, visitors, and exhibitors opened simultaneously across all partner subdomains, with unified payment processing and real-time availability tracking. The federated architecture ensures that capacity limits and ticket sales are synchronized globally, preventing overselling and ensuring fair access.',
    ],
  },
  {
    id: 3,
    category: 'Partnership',
    tag: 'PARTNERSHIP',
    date: 'Nov 25, 2025',
    title: 'Worso Welcomes South Korea as Strategic Partner',
    desc: 'The KRA officially joins the federation.',
    body: 'The Korean Robotics Association (KRA) has officially joined WORSO as a strategic partner, receiving approval for the korea.worso.org subdomain. The partnership will enable local qualifiers, Korean-language content, and regional sponsors while maintaining global rulebook compliance through federated middleware architecture.',
    featuredImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&h=500&fit=crop',
    sampleImages: [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
    ],
    fullContent: [
      'The Korean Robotics Association (KRA) has officially joined WORSO as a strategic partner, receiving approval for the korea.worso.org subdomain. The partnership will enable local qualifiers, Korean-language content, and regional sponsors while maintaining global rulebook compliance through federated middleware architecture.',
      'KRA will host regional qualifiers for the Technoxian World Cup, with top teams advancing to the global finals. The Korean micro-site will feature localized content, regional event calendars, and Korean-language rulebook translations, all while maintaining the core WORSO brand identity.',
      'This partnership brings WORSO\'s total partner network to 96 nations, with South Korea representing a key market in the Asia-Pacific region. The federated model allows KRA to operate autonomously while contributing to the global rankings and data layer.',
    ],
  },
  {
    id: 4,
    category: 'Technology',
    tag: 'TECH',
    date: 'Nov 24, 2025',
    title: 'AI Referee System Launches Across All Partner Portals',
    desc: 'Real-time officiating powered by machine learning now available globally.',
    body: 'WORSO has deployed its AI Referee system across all partner subdomains, enabling real-time rule enforcement, scoring validation, and dispute resolution. The system uses federated learning to improve accuracy while maintaining data privacy across regional boundaries.',
    featuredImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=500&fit=crop',
    sampleImages: [
      'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
    ],
    fullContent: [
      'WORSO has deployed its AI Referee system across all partner subdomains, enabling real-time rule enforcement, scoring validation, and dispute resolution. The system uses federated learning to improve accuracy while maintaining data privacy across regional boundaries.',
      'The AI Referee analyzes telemetry data, video feeds, and sensor inputs to make instant decisions on rule violations, scoring disputes, and safety interventions. Human referees can override AI decisions, but the system\'s accuracy rate of 98.7% has significantly reduced appeals and improved event flow.',
      'Federated learning allows the AI to improve from events across all partner nations without sharing sensitive competition data. Each partner\'s local events contribute to the global model while maintaining complete data sovereignty.',
    ],
  },
  {
    id: 5,
    category: 'Markets',
    tag: 'MARKETS',
    date: 'Nov 23, 2025',
    title: 'Prize Pool Reaches Record $250,000 for World Cup 2026',
    desc: 'Corporate sponsorships drive unprecedented prize distribution.',
    body: 'The Technoxian World Cup 2026 prize pool has reached a record-breaking $250,000, driven by strategic partnerships with leading technology corporations. Prize distribution will be transparent and auditable, with real-time tracking available on all partner micro-sites through unified payment gateway integration.',
    featuredImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop',
    sampleImages: [
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop',
    ],
    fullContent: [
      'The Technoxian World Cup 2026 prize pool has reached a record-breaking $250,000, driven by strategic partnerships with leading technology corporations. Prize distribution will be transparent and auditable, with real-time tracking available on all partner micro-sites through unified payment gateway integration.',
      'Prize money will be distributed across all nine competition categories, with the Innovation Challenge category receiving the largest share at $75,000. Teams can track their earnings in real-time through the unified dashboard, with automatic tax documentation generated for international participants.',
      'Corporate sponsors including major tech firms have committed to multi-year partnerships, ensuring prize pool growth and long-term financial stability for the sport. The federated architecture allows sponsors to target specific regions while contributing to the global prize pool.',
    ],
  },
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

// CMS Data for Technoxian World Robotics Championship

export const CMS_DATA = {
  season: "Technoxian 10.0",
  heroHeadline: "CLASH OF CHAMPIONS",
  heroSubhead: "Ignite Innovation. Master Robotics. Compete Globally. Join over 3,000 teams in the ultimate battle of engineering, code, and strategy.",

  eventDetails: {
    date: "23RD - 26TH OCTOBER 2026",
    venue: "DUBAI, UNITED ARAB EMIRATES",
    regDeadline: "15th AUGUST 2026",
    organizers: ["AICRA", "WORSO"]
  },

  scheduleDetails: {
    zonal: {
      title: "Zonal Qualifiers (India)",
      dates: "April - May 2026",
      locations: ["Chandigarh", "Chennai", "Kolkata", "Indore", "Ahmedabad"],
      desc: "The first step to glory. Compete in your region to qualify for the Nationals. Top 25% teams advance.",
      image: "https://www.transparenttextures.com/patterns/carbon-fibre.png"
    },
    national: {
      title: "National Championship",
      dates: "July 24-26, 2026",
      locations: ["Indira Gandhi Stadium, New Delhi"],
      desc: "The battle for the flag. The best teams from across India compete to represent the nation in Dubai.",
      image: "https://www.transparenttextures.com/patterns/carbon-fibre.png"
    },
    world: {
      title: "World Cup Final 10.0",
      dates: "October 23-26, 2026",
      locations: ["Dubai Exhibition Centre, UAE"],
      desc: "The ultimate stage. 52 Nations. One Champion. The 10th Anniversary edition of Technoxian.",
      image: "https://www.transparenttextures.com/patterns/carbon-fibre.png"
    }
  },

  roboclub: {
    title: "Technoxian RoboClub",
    tagline: "Building the Future, One Bot at a Time.",
    benefits: ["Free Training Sessions", "Access to 15+ Competitions", "Global Alumni Network", "Hardware Discounts"],
    stats: { clubs: "1,200+", students: "50,000+", schools: "800+" }
  },

  leaderboard: [
    { rank: 1, team: "Robo Odisha", country: "India", points: 2450, category: "Bots Combat", badge: "Gold" },
    { rank: 2, team: "Team Warrior", country: "UAE", points: 2300, category: "Bots Combat", badge: "Silver" },
    { rank: 3, team: "Heavy Drivers", country: "Iran", points: 2150, category: "Robo Race", badge: "Bronze" },
    { rank: 4, team: "Cyber Knights", country: "Germany", points: 1980, category: "Drone Racing", badge: "Elite" },
    { rank: 5, team: "Karmayodha Bots", country: "India", points: 1850, category: "Innovation", badge: "Elite" },
    { rank: 6, team: "Atom Systems", country: "USA", points: 1700, category: "Robo Soccer", badge: "Elite" },
  ],

  categories: [
    {
      id: 1,
      name: "Innovation Contest",
      icon: "⚔️",
      type: "Action",
      players: "500+",
      desc: "INNOVATIONS aims at cultivating the skills amongst the youth and all the technical aspirants by offering a robust platform to showcase your ideas and get recognized. Participants are supposed to compete with their projects, concepts, and innovative ideas. All the Futuristic, creative, innovative, sustainable projects/concepts are welcome. Projects which synchronise with the current needs of the industries and have the potential to disrupt the current course of technology will be Awarded. So, brace yourself and join in the League of INNOVATIONS.",
      desPoints : ["In the Junior category, only 100 Teams are eligible to participate, encompassing both national and international countries.", "The competition is open for all 100 Teams are eligible to participate, encompassing both national and international countries.","All participants will get certification of Participation from “All India Council For Robotics & Automation (AICRA)”.", "INR 2,50,000 to be awarded to winning teams."],
      rules: ["Max Weight: 15kg / 30kg / 60kg", "Arena: 40x40 Steel Floor", "Weapon Safety Locks Mandatory"],
      prize: "$15,000",
      eligibility:["Jr. Category : RoboClubs/ Schools or individuals may nominate. Participants’ age should be between 8 to 16 years.","Open for all : Colleges/Universities every age group can participate."
      ],
      Innovation:["Innovations targeting any field of science & technology or leveraging technology to solve problems in Real-Time. However, the innovation must be a physical working implementation of the idea being presented along with all the necessary documentation. Innovations in the field of AgriTech, EduTech, HealthTech, FinTech, etc. or any other field with technology can be accepted for nomination.","Innovation and project ideas that are software-based and aim to solve a problem for the current industries and society can also be nominated. Technologies may include Cloud based projects, Machine learning projects, Artificial Intelligence Projects, Web applications, android applications, Cyber security, Blockchain, Bigdata, Cryptography, etc.","Startups/Participants with ideas of a startup can also participate to showcase their innovative ideas/concepts and get it recognized globally on the largest innovation platform."],
      notes:[
        "The projects should be working and be able to demonstrate their functionality along with all the necessary data and supporting documents.", "The project will be judged on the scope of innovation, creativity & uniqueness, and future scope."
      ],
      Steps :[
        "Register your RoboClub or Institute as TechnoXian RoboClub online at the official TechnoXian website. If you do not have a Club or institute, you may form a new TX RoboClub.",
        "Once your RoboClub is active, you may select the Innovation Challenge category from the competition list in your login panel, and apply. You will also be needed to select members from your club who will participate in the challenge. A maximum of 10 members in 1 team can participate. A club can apply multiple teams for the same challenge.",
        "Get ready with your innovative project, and share a synopsis of your project with 250 to 500 words.",
        "Prepare a video of 1 minute to 5 minutes (maximum 100 MB), showcasing team readiness, creativity, preparing for challenges, or anything to show passion to participate in TechnoXian. Share the video either by email at videosubmission@technoxian.in (as Google Drive or We transfer) or WhatsApp at +91 9289095404 mentioning Your WRC ID (Competition ID). All videos will be uploaded on the TechnoXian YouTube channel. (Note: Video is for promotion for our Participants who are coming to participate in Technoxian)"
      ],
      accordian:[
         {
    "question": "Project Evaluation",
    "answer": ["Hardware-Based Projects: This category of competition may include Innovation/Projects related to an embedded system, the Internet of Things, Robotics, Mechanical Design, Control system, etc. The project should be based on any field of science and technology or benefit from technology to solve real-world problems.", "Software-Based Projects: This category of competition may include Cloud-based projects, Machine learning projects, Artificial Intelligence Projects, Web applications, android applications, Cyber security, Blockchain, big data, Cryptography, etc. Any software-related project that proves to be an optimum solution for solving real-world problems can take part in this category.","All the participating projects in both categories will be judged thoroughly in terms of innovation, creativity & uniqueness, and future scope.","Participants should make sure their project is submitted along with the necessary documents and be able to demonstrate its functionality.", "Participants will present their projects along with the working model and supporting documents to the Jury and the Jury will Evaluate the projects on the Parameters discussed above. Most innovative projects will receive awards and recognition. Following will be the stages of the competition.", "Each team/individual participant will be provided a dedicated place to showcase their project in front of delegates/investors/govt officials etc.", "The team would be invited in front of the Jury to explain and present the project in the evaluation room. Participant may use a ppt/video presentation or they may choose their own way to explain.", "The jury would visit their allocated place to see a demonstration of the project and evaluate"]
  },
      ]
    },
    {
      id: 2,
      name: "Robo Soccer",
      icon: "⚽",
      type: "Sport",
      players: "1200+",
      desc: "Autonomous and manual bots competing in a high-speed football match.",
      rules: ["Team Size: 3 Bots", "Ball: Infrared Emitting", "Duration: 10 Mins"],
      prize: "$10,000"
    },
    {
      id: 3,
      name: "Drone Racing",
      icon: "🚁",
      type: "Aero",
      players: "300+",
      desc: "FPV Drone racing through complex obstacle courses at breakneck speeds.",
      rules: ["Frame: 250mm", "Battery: 4S LiPo", "Video: Analog 5.8GHz"],
      prize: "$8,000"
    },
    { id: 4, name: "Innovation", icon: "💡", type: "Science", players: "800+", desc: "Solve real-world problems with robotics.", rules: ["Theme: Sustainability", "Prototype Required"], prize: "$12,000" },
    { id: 5, name: "Robo Race", icon: "🏎️", type: "Speed", players: "900+", desc: "Navigate hurdles and tracks in the fastest time.", rules: ["Track Width: 30cm", "Autonomous Only"], prize: "$5,000" },
    { id: 6, name: "Water Rocket", icon: "🚀", type: "Physics", players: "400+", desc: "Aerodynamics and pressure capability test.", rules: ["Pressure: Max 60 PSI", "Parachute Recovery"], prize: "$3,000" },
  ],

  roadmap: [
    { id: 'zonal', title: "Zonal Rounds", date: "Apr - May 2026", desc: "Regional qualifiers across 8 Indian cities.", active: true },
    { id: 'national', title: "National Championship", date: "July 2026", desc: "The best of India clash in New Delhi.", active: false },
    { id: 'world', title: "World Cup Final", date: "Oct 2026", desc: "Global domination. Dubai, UAE.", active: false },
  ],

  gallery: [
    { id: 1, type: "video", src: "/api/placeholder/400/320", title: "Grand Finale 2025 Highlights" },
    { id: 2, type: "image", src: "/api/placeholder/400/320", title: "Team India Winning Moment" },
    { id: 3, type: "image", src: "/api/placeholder/400/320", title: "Bots Combat Arena" },
    { id: 4, type: "image", src: "/api/placeholder/400/320", title: "Drone Racing Night Track" },
  ],

  news: [
    { id: 1, title: "Team 'CyberKnights' Breaks World Record in Drone Racing", date: "Nov 20, 2025", tag: "Highlights", content: "Full article content here..." },
    { id: 2, title: "Official Rulebook V2.0 Released for Bots Combat", date: "Nov 18, 2025", tag: "Update", content: "Full article content here..." },
    { id: 3, title: "Technoxian Partners with UAE Govt for 2026 Finals", date: "Nov 15, 2025", tag: "Press", content: "Full article content here..." },
  ],

  stats: [
    { label: "Prize Pool", val: "$50,000+" },
    { label: "Nations", val: "52" },
    { label: "Teams", val: "3,000+" },
    { label: "Categories", val: "15+" }
  ],

  partners: ["AICRA", "WORSO", "Ministry of Electronics", "Make in India", "Digital India"]
};
// shopping item
export const CMS_DATA_PRODUCT= {
  season: "Technoxian 10.0",
  heroHeadline: "CLASH OF CHAMPIONS",
  heroSubhead: "Ignite Innovation. Master Robotics. Compete Globally. Join over 3,000 teams in the ultimate battle of engineering, code, and strategy.",
 
  eventDetails: {
    date: "23RD - 26TH OCTOBER 2026",
    venue: "DUBAI, UNITED ARAB EMIRATES",
  },


  categories: [
    { id: 1, name: "Bots Combat", icon: "⚔️", type: "Action", players: "500+", desc: "The ultimate test of durability and destruction. Build a bot to destroy the opponent.", prize: "$15,000" },
    { id: 2, name: "Robo Soccer", icon: "⚽", type: "Sport", players: "1200+", desc: "Autonomous and manual bots competing in a high-speed football match.", prize: "$10,000" },
    { id: 3, name: "Drone Racing", icon: "🚁", type: "Aero", players: "300+", desc: "FPV Drone racing through complex obstacle courses at breakneck speeds.", prize: "$8,000" },
    { id: 4, name: "Innovation", icon: "💡", type: "Science", players: "800+", desc: "Solve real-world problems with robotics.", prize: "$12,000" },
    { id: 5, name: "Robo Race", icon: "🏎️", type: "Speed", players: "900+", desc: "Navigate hurdles and tracks in the fastest time.", prize: "$5,000" },
    { id: 6, name: "Water Rocket", icon: "🚀", type: "Physics", players: "400+", desc: "Aerodynamics and pressure capability test.", prize: "$3,000" },
  ],


  products: [
    { id: 101, name: "Combat Bot Chassis (30kg)", price: 299.00, category: "Kits", rating: 4.8, image: "https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&q=80&w=400", tag: "Best Seller" },
    { id: 102, name: "High-Torque DC Motor", price: 45.50, category: "Parts", rating: 4.9, image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&q=80&w=400" },
    { id: 103, name: "Technoxian Official Jersey", price: 35.00, category: "Merch", rating: 4.6, image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80&w=400" },
    { id: 104, name: "FPV Drone Racing Kit", price: 180.00, category: "Kits", rating: 4.7, image: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&q=80&w=400" },
    { id: 105, name: "LiPo Battery 4S 1500mAh", price: 25.00, category: "Parts", rating: 4.5, image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=400" },
    { id: 106, name: "RoboSoccer Striker Bot", price: 450.00, category: "Kits", rating: 5.0, image: "https://images.unsplash.com/photo-1561144257-e32e8efc6c4f?auto=format&fit=crop&q=80&w=400", tag: "Pro Gear" },
  ],


  news: [
    { id: 1, title: "Team 'CyberKnights' Breaks World Record in Drone Racing", date: "Nov 20, 2025", tag: "Highlights" },
    { id: 2, title: "Official Rulebook V2.0 Released for Bots Combat", date: "Nov 18, 2025", tag: "Update" },
    { id: 3, title: "Technoxian Partners with UAE Govt for 2026 Finals", date: "Nov 15, 2025", tag: "Press" },
  ],


  roadmap: [
    { id: 'zonal', title: "Zonal Rounds", date: "Apr - May 2026", desc: "Regional qualifiers across 8 Indian cities.", active: true },
    { id: 'national', title: "National Championship", date: "July 2026", desc: "The best of India clash in New Delhi.", active: false },
    { id: 'world', title: "World Cup Final", date: "Oct 2026", desc: "Global domination. Dubai, UAE.", active: false },
  ],
};