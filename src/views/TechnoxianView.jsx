import { useState, useEffect } from "react";
import {
  Users,
  Ticket,
  Building,
  CreditCard,
  MapPin,
  Clock3,
  FileText,
  BadgeCheck,
  X,
  Camera,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Brain,
  Rocket,
  Shield,
  Flag,
  Package,
  Car,
  Target,
  GraduationCap,
  Star,
  Award,
  Globe2,
  Users as UsersIcon,
  Trophy,
  Dumbbell,
  Puzzle,
  Drone,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GAME_CATEGORIES } from "../constants/data";

const TechnoxianView = () => {
  void motion;
  const [activeTab, setActiveTab] = useState("overview");
  const [regType, setRegType] = useState("team");
  const [activeGallery, setActiveGallery] = useState(null);
  const [showAllGallery, setShowAllGallery] = useState(false);
  const [trophyIndex, setTrophyIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState({});
  const [selectedTechnoxianMembership, setSelectedTechnoxianMembership] =
    useState(null);
  const [openTechRows, setOpenTechRows] = useState({});


  // Schedule navigation states
  const [selectedChampionship, setSelectedChampionship] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [sidebarLevel, setSidebarLevel] = useState("championship");

  // Discipline sidebar states
  const [selectedDisciplineGame, setSelectedDisciplineGame] =
    useState("Innovation Jr.");

  useEffect(() => {
    if (activeGallery) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [activeGallery]);

  // Define the 11 games for registration
  const GAMES_LIST = [
    { id: "innovation-jr", name: "Innovation Jr." },
    { id: "innovation-open", name: "Innovation Open" },
    { id: "robo-soccer", name: "Robo Soccer" },
    { id: "robo-race", name: "Robo Race" },
    { id: "sumo-bot", name: "Sumo Bot" },
    { id: "flf-jr", name: "FLF Jr." },
    { id: "flf-sr", name: "FLF Sr." },
    { id: "water-rocket", name: "Water Rocket" },
    { id: "maze-solver", name: "Maze Solver" },
    { id: "rc-craft", name: "Rc Craft" },
    { id: "drone-rescue", name: "Drone Rescue" },
    { id: "rc-electric", name: "Rc Electric" },
    { id: "robo-hockey", name: "Robo Hockey" },
  ];

  // Add this near your other constants (after ZONAL_CATEGORIES)
  const ZONE_CITIES = {
    "zonal-west": "Gujarat",
    "zonal-east": "Kolkata",
    "zonal-south": "Chennai",
    "zonal-north": "Chandigarh",
    "zonal-center": "Indore",
  };

  // Define the games for discipline section
  const DISCIPLINE_GAMES = [
    {
      id: "innovation-jr",
      name: "Innovation Jr.",
      icon: <Brain size={20} />,
      category: "Innovation",
      description:
        "Junior innovation challenge for young minds (ages 10-15) to showcase creative problem-solving skills using basic robotics and electronics.",
      rules:
        "Participants design innovative solutions for real-world problems using robotics. Robots must be autonomous and complete tasks within time limits. No hazardous materials allowed.",
      teamSize: "1-3 members",
      duration: "2 days",
      prize: "$5,000",
      image:
        "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=900&auto=format&fit=crop",
    },
    {
      id: "innovation-open",
      name: "Innovation Open",
      icon: <Rocket size={20} />,
      category: "Innovation",
      description:
        "Open innovation competition for advanced robotics solutions targeting industrial and societal challenges.",
      rules:
        "Advanced robotics innovation with practical implementation requirements. Projects must include working prototypes and detailed documentation. Commercial potential is evaluated.",
      teamSize: "2-5 members",
      duration: "3 days",
      prize: "$15,000",
      image:
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=900&auto=format&fit=crop",
    },
    {
      id: "robo-soccer",
      name: "Robo Soccer",
      icon: <Dumbbell size={20} />,
      category: "Sports",
      description:
        "Autonomous robot soccer competition played on specialized artificial turf fields with electronic goal systems.",
      rules:
        "Autonomous robots compete in soccer matches on specialized fields. No remote control allowed. Robot must identify ball, opponents, and goals using onboard sensors.",
      teamSize: "3-5 members",
      duration: "2 days",
      prize: "$10,000",
      image:
        "https://images.unsplash.com/photo-1521417531039-75e91486ccae?w=900&auto=format&fit=crop",
    },
    {
      id: "robo-race",
      name: "Robo Race",
      icon: <Car size={20} />,
      category: "Racing",
      description:
        "High-speed autonomous robot racing competition on complex tracks with obstacles and elevation changes.",
      rules:
        "Robots navigate complex tracks autonomously at high speeds. Must complete laps within time limits. No external guidance systems permitted.",
      teamSize: "2-4 members",
      duration: "1 day",
      prize: "$8,000",
      image:
        "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=900&auto=format&fit=crop",
    },
    {
      id: "sumo-bot",
      name: "Sumo Bot",
      icon: <Shield size={20} />,
      category: "Combat",
      description:
        "Robot sumo wrestling in a circular ring. Robots must push opponents out while staying within boundaries.",
      rules:
        "Robots push opponents out of the ring using various strategies. No projectiles or hazardous mechanisms. Maximum weight: 3kg. Ring diameter: 154cm.",
      teamSize: "1-2 members",
      duration: "1 day",
      prize: "$6,000",
      image:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&auto=format&fit=crop",
    },
    {
      id: "flf",
      name: "FLF",
      icon: <Flag size={20} />,
      category: "Aerospace",
      description:
        "Future Launch Facility - Advanced rocket launch competition focusing on payload delivery and precision landing.",
      rules:
        "Design and launch model rockets with payload delivery systems. Rockets must reach minimum altitude of 100m and deploy payload. Recovery systems required.",
      teamSize: "3-6 members",
      duration: "3 days",
      prize: "$12,000",
      image:
        "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=900&auto=format&fit=crop",
    },
    {
      id: "water-rocket",
      name: "Water Rocket",
      icon: <Rocket size={20} />,
      category: "Aerospace",
      description:
        "Water-powered rocket launch competition focusing on maximum altitude and payload accuracy.",
      rules:
        "Design and launch water rockets for maximum altitude and accuracy. Pressure limited to 8 bar. Rockets must be constructed from approved materials.",
      teamSize: "2-4 members",
      duration: "1 day",
      prize: "$4,000",
      image:
        "https://images.unsplash.com/photo-1468276311594-df7cb65d8df6?w=900&auto=format&fit=crop",
    },
    {
      id: "maze-solver",
      name: "Maze Solver",
      icon: <Puzzle size={20} />,
      category: "Navigation",
      description:
        "Autonomous maze navigation challenge with changing layouts and dead-end detection requirements.",
      rules:
        "Robots must solve and navigate through complex mazes autonomously. No external sensors. Time-based scoring with bonus for optimal paths.",
      teamSize: "1-3 members",
      duration: "1 day",
      prize: "$5,000",
      image:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&auto=format&fit=crop",
    },
    {
      id: "rc-craft",
      name: "Rc Craft",
      icon: <Package size={20} />,
      category: "RC Vehicles",
      description:
        "Remote-controlled aircraft competition focusing on aerobatics, payload delivery, and obstacle courses.",
      rules:
        "Design and operate remote-controlled aircraft for various missions. Weight restrictions apply. Must complete timed missions with precision tasks.",
      teamSize: "2-4 members",
      duration: "2 days",
      prize: "$7,000",
      image:
        "https://images.unsplash.com/photo-1507582020474-9a35b7d455b9?w=900&auto=format&fit=crop",
    },
    {
      id: "drone-rescue",
      name: "Drone Rescue",
      icon: <Drone size={20} />,
      category: "Drones",
      description:
        "Drone-based search and rescue missions in simulated disaster environments with time constraints.",
      rules:
        "Drones perform search and rescue operations in simulated environments. Must locate and identify victims, deliver supplies. Autonomous flight bonus points.",
      teamSize: "3-5 members",
      duration: "2 days",
      prize: "$9,000",
      image:
        "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=900&auto=format&fit=crop",
    },
    {
      id: "rc-electric-car-racing",
      name: "Rc Electric car racing",
      icon: <Car size={20} />,
      category: "Racing",
      description:
        "Electric RC car racing competition on custom tracks with jumps, banked turns, and obstacle sections.",
      rules:
        "High-speed RC car racing on custom tracks with obstacles. Battery voltage limited to 11.1V. Must complete qualifying laps for main event.",
      teamSize: "2-3 members",
      duration: "1 day",
      prize: "$5,000",
      image:
        "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=900&auto=format&fit=crop",
    },
    {
      id: "robo-hockey",
      name: "Robo Hockey",
      icon: <Dumbbell size={20} />,
      category: "Sports",
      description:
        "Robot hockey competition on low-friction surfaces with electronic puck tracking and scoring systems.",
      rules:
        "Autonomous robots play hockey with specialized equipment. Must detect puck and goal positions. No pushing opponents beyond allowed force.",
      teamSize: "3-5 members",
      duration: "2 days",
      prize: "$8,000",
      image:
        "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=900&auto=format&fit=crop",
    },
    {
      id: "bots-combat",
      name: "Bots Combat",
      icon: <Shield size={20} />,
      category: "Combat",
      description:
        "Robot combat tournament with various weight classes and elimination-style brackets.",
      rules:
        "Combat robots compete in elimination-style tournaments. Weight classes: 1kg, 3kg, 15kg. No flames, explosives, or entanglement weapons.",
      teamSize: "2-4 members",
      duration: "2 days",
      prize: "$10,000",
      image:
        "https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?w=900&auto=format&fit=crop",
    },
    {
      id: "drone-racing-circuit",
      name: "Drone Racing Circuit (DRC)",
      icon: <Drone size={20} />,
      category: "Racing",
      description:
        "High-speed FPV drone racing through obstacle courses with LED gates and timing systems.",
      rules:
        "FPV drones race through complex obstacle courses at high speeds. Pilot must use FPV goggles. Drone specs: 250mm max, 4S battery limit.",
      teamSize: "1-2 members",
      duration: "2 days",
      prize: "$12,000",
      image:
        "https://images.unsplash.com/photo-1508612761958-e931d843bddb?w=900&auto=format&fit=crop",
    },
    {
      id: "theme-bot-challenge",
      name: "Theme Bot Challenge",
      icon: <Target size={20} />,
      category: "Innovation",
      description:
        "Theme-based robot design and performance challenge focusing on artistic and technical execution.",
      rules:
        "Robots designed around specific themes perform themed tasks. Judged on creativity, technical execution, and theme adherence. Annual theme announced 6 months prior.",
      teamSize: "2-4 members",
      duration: "2 days",
      prize: "$6,000",
      image:
        "https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?w=900&auto=format&fit=crop",
    },
  ];

  // Define zonal categories
  const ZONAL_CATEGORIES = [
    { id: "zonal-west", name: "Zonal West" },
    { id: "zonal-east", name: "Zonal East" },
    { id: "zonal-south", name: "Zonal South" },
    { id: "zonal-north", name: "Zonal North" },
    { id: "zonal-center", name: "Zonal Center" },
  ];

  // Generate games with schedules
  const generateGameSchedule = (gameId, gameName, zone) => {
    const startDate = new Date(2025, 5, 10);
    const endDate = new Date(2025, 5, 11);
    const venueIndex = ((gameId.length + gameId.charCodeAt(0)) % 5) + 1;
    return {
      id: gameId,
      name: gameName,
      zone: zone,
      venue: `Arena ${venueIndex}`,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      schedule: [
        {
          date: startDate.toISOString().split("T")[0],
          time: "09:00",
          title: "Setup & Safety Check",
        },
        {
          date: startDate.toISOString().split("T")[0],
          time: "11:00",
          title: "Qualifying Rounds",
        },
        {
          date: endDate.toISOString().split("T")[0],
          time: "14:00",
          title: "Finals & Awards",
        },
      ],
      description: `${gameName} competition in the ${zone} zone. Showcase your skills and compete for the championship title.`,
      registrationLink: `/register/${gameId}`,
    };
  };

  // Generate zonal events with all games
  const generateZonalEvents = () => {
    return ZONAL_CATEGORIES.map((zone) => ({
      id: zone.id,
      name: zone.name,
      games: GAMES_LIST.map((game) =>
        generateGameSchedule(`${zone.id}-${game.id}`, game.name, zone.name),
      ),
    }));
  };

  // Generate national events
  const generateNationalEvents = (startYear = 2025, endYear = 2015) => {
    return Array.from({ length: startYear - endYear + 1 }, (_, idx) => {
      const year = startYear - idx;
      return {
        id: `national-${year}`,
        name: `National Championship ${year}`,
        games: GAMES_LIST.slice(0, 5).map((game) =>
          generateGameSchedule(
            `nat-${year}-${game.id}`,
            game.name,
            `National ${year}`,
          ),
        ),
      };
    });
  };

  // Generate world cup events
  const generateWorldCupEvents = (startYear = 2025, endYear = 2015) => {
    return Array.from({ length: startYear - endYear + 1 }, (_, idx) => {
      const year = startYear - idx;
      return {
        id: `worldcup-${year}`,
        name: `Technoxian World Cup ${year}`,
        games: GAMES_LIST.map((game) =>
          generateGameSchedule(
            `wc-${year}-${game.id}`,
            game.name,
            `World Cup ${year}`,
          ),
        ),
      };
    });
  };

  // Updated schedule data structure
  const SCHEDULE_DATA = [
    {
      id: "zonals",
      name: "Zonals",
      events: generateZonalEvents(),
    },
    {
      id: "national",
      name: "National",
      events: generateNationalEvents(),
    },
    {
      id: "worldcup",
      name: "World Cup",
      events: generateWorldCupEvents(),
    },
  ];

  // Trophy data for years 2025-2015 (decreasing order)
  const trophies = Array.from({ length: 11 }, (_, i) => {
    const year = 2025 - i;
    return {
      year,
      name: `Technoxian World Cup ${year}`,
      image: `/trophies/trophy-${year}.png`,
    };
  });

  // Create a data URI placeholder image (SVG)
  const createPlaceholderImage = (year) => {
    const svg = `<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="150" fill="#f1f5f9"/><text x="50%" y="40%" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#64748b" text-anchor="middle" dominant-baseline="middle">🏆</text><text x="50%" y="65%" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#475569" text-anchor="middle" dominant-baseline="middle">${year}</text></svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  };

  const handleImageError = (year) => {
    setImageErrors((prev) => ({ ...prev, [year]: true }));
  };

  const nextTrophy = () => {
    setTrophyIndex((prev) => {
      const maxIndex = Math.max(0, Math.ceil(trophies.length / 4) - 1) * 4;
      return prev >= maxIndex ? 0 : prev + 4;
    });
  };

  const prevTrophy = () => {
    setTrophyIndex((prev) => {
      const maxIndex = Math.max(0, Math.ceil(trophies.length / 4) - 1) * 4;
      return prev <= 0 ? maxIndex : prev - 4;
    });
  };

  const gallery = [
    {
      id: "fpv",
      title: "Drone Racing",
      tag: "FPV • Neon Gates",
      cover:
        "https://images.unsplash.com/photo-1508612761958-e931d843bddb?w=900&auto=format&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1508612761958-e931d843bddb?w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1471710371017-654b1b43eaa2?w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1?w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1500534314211-ccc3d1d23e7a?w=900&auto=format&fit=crop",
      ],
    },
    {
      id: "race",
      title: "Robo Race",
      tag: "Canyon Sprint",
      cover:
        "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=900&auto=format&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1451188502541-13943edb6acb?w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1508614999368-9260051291ea?w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1500534314211-ccc3d1d23e7a?w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop",
      ],
    },
    {
      id: "soccer",
      title: "Robo Soccer",
      tag: "Hex Turf Finals",
      cover:
        "https://images.unsplash.com/photo-1521417531039-75e91486ccae?w=900&auto=format&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1521417531039-75e91486ccae?w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1451188502541-13943edb6acb?w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1508612761958-e931d843bddb?w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1511918984145-48de785d4c4d?w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1500534314211-ccc3d1d23e7a?w=900&auto=format&fit=crop",
      ],
    },
    {
      id: "sumo",
      title: "Sumo Bot",
      tag: "Steel Ring",
      cover:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&auto=format&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1508614999368-9260051291ea?w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1500534314211-ccc3d1d23e7a?w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1508612761958-e931d843bddb?w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1451188502541-13943edb6acb?w=900&auto=format&fit=crop",
      ],
    },
    {
      id: "expo",
      title: "Innovation Expo",
      tag: "Prototype Lab",
      cover:
        "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1?w=900&auto=format&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1?w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1451188502541-13943edb6acb?w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1508612761958-e931d843bddb?w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&auto=format&fit=crop",
      ],
    },
  ];

  // Get currently selected game
  const currentGame =
    DISCIPLINE_GAMES.find((game) => game.name === selectedDisciplineGame) ||
    DISCIPLINE_GAMES[0];

  function TechComparisonRow({ row, index }) {
    const isOpen = !!openTechRows[index];

    return (
      <tr className="hover:bg-slate-50">
        <td className="p-5 align-top">
          <button
            onClick={() =>
              setOpenTechRows(prev => ({
                ...prev,
                [index]: !prev[index],
              }))
            }
            className="flex items-start gap-2 text-left w-full"
          >
            <ChevronDown
              size={16}
              className={`mt-1 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
            <span className="font-medium text-slate-800">
              {row.title}
            </span>
          </button>

          {isOpen && (
            <p className="mt-3 text-sm text-slate-600 max-w-xl">
              {row.desc}
            </p>
          )}
        </td>

        {row.values.map((v, i) => (
          <td key={i} className="p-5 text-center text-lg">
            {v === true && '✔️'}
            {v === false && '✖️'}
            {v === null && '—'}
          </td>
        ))}
      </tr>
    );
  }


  return (
    <div className="animate-fadeIn bg-slate-50 min-h-screen">
      <div className="bg-white border-b border-slate-200 sticky top-[56px] z-30 shadow-sm">
        <div className="container mx-auto px-4 flex gap-8 overflow-x-auto">
          {["overview", "disciplines", "schedule", "gallery", "register"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
                  }`}
              >
                {tab}
              </button>
            ),
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="container mx-auto px-4 py-12"
          >
            <div className="bg-[#0f172a] rounded-3xl text-white p-12 mb-12 relative overflow-hidden">
              <div className="relative z-10 max-w-2xl">
                <div className="text-yellow-400 font-bold tracking-widest text-xs uppercase mb-4">
                  Official Championship
                </div>
                <h1 className="text-5xl font-extrabold mb-6">
                  Technoxian World Cup '26
                </h1>
                <button
                  onClick={() => setActiveTab("register")}
                  className="bg-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                >
                  Register Now
                </button>
              </div>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { l: "Prize Pool", v: "$250k" },
                { l: "Teams", v: "120k+" },
                { l: "Countries", v: "95+" },
                { l: "Spectators", v: "2.5M" },
              ].map((s, i) => (
                <div
                  key={i}
                  className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center"
                >
                  <div className="text-4xl font-extrabold text-blue-600 mb-2">
                    {s.v}
                  </div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <div className="text-xs font-bold uppercase text-slate-500 mb-1">
                  Countdown
                </div>
                <div className="text-3xl font-extrabold text-slate-900">
                  280d : 12h : 35m
                </div>
                <p className="text-sm text-slate-500 mt-2">
                  Opening ceremony — Dubai Exhibition Centre
                </p>
              </div>
              <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500 mb-2">
                  <MapPin size={14} /> Venue Map
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Arena zones: Competition halls, Innovation Expo, Visitor
                  concourse, Exhibitor docks.
                </p>
              </div>
              <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500 mb-2">
                  <Clock3 size={14} /> Live Status
                </div>
                <p className="text-sm text-green-600 font-bold">
                  Registrations open • Rulebook v2.0 active
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Realtime updates federated to partner subdomains.
                </p>
              </div>
            </div>
            <br></br>

            {/* membership plan */}

            <section className="min-h-screen flex items-center bg-slate-50 border-t border-slate-200">
              <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-14">
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                    Technoxian Membership
                  </span>
                  <h2 className="text-4xl font-extrabold text-slate-900 mt-3">
                    Choose Your Student Membership
                  </h2>
                  <p className="text-slate-600 max-w-3xl mx-auto mt-4">
                    Designed for learners, innovators, and future tech leaders.
                    Compare plans in detail below before making your choice.
                  </p>
                  <p className="text-sm text-slate-500 mt-2">
                    * Membership charges are billed <strong>per year</strong>
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                  {[
                    {
                      id: "basic",
                      title: "Basic Student Membership",
                      price: "USD 10 / year",
                      audience: "Learners",
                      icon: Users,
                      highlights: [
                        "Digital student membership ID & certificate",
                        "Access to competitions (via RoboClub)",
                        "Internship & project listings",
                        "DIY robotics kits at discounted rates",
                        "Hackathons & innovation challenges",
                        "Monthly webinars & workshops",
                      ],
                    },
                    {
                      id: "premium",
                      title: "Premium Student Membership",
                      price: "USD 50 / year",
                      audience: "High-Potential Student Innovators",
                      icon: Star,
                      highlights: [
                        "Premium digital badge for CV & LinkedIn",
                        "Priority internship interviews",
                        "Advanced AI labs & simulation tools",
                        "Mentorship & career planning",
                        "International leagues & exchange camps",
                        "Leadership & startup opportunities",
                      ],
                    },
                  ].map((plan) => {
                    const Icon = plan.icon;
                    const isSelected = selectedTechnoxianMembership === plan.id;

                    return (
                      <div
                        key={plan.id}
                        onClick={() => setSelectedTechnoxianMembership(plan.id)}
                        className={`cursor-pointer rounded-3xl border p-8 bg-white transition-all
              ${isSelected
                            ? "border-blue-600 shadow-xl scale-[1.03]"
                            : "border-slate-200 hover:shadow-lg hover:-translate-y-1"
                          }`}
                      >
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                            <Icon size={24} />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-slate-900">
                              {plan.title}
                            </h3>
                            <p className="text-xs text-slate-500">
                              {plan.audience}
                            </p>
                          </div>
                        </div>

                        <div className="text-3xl font-extrabold text-slate-900 mb-6">
                          {plan.price}
                        </div>

                        <ul className="space-y-3 mb-8">
                          {plan.highlights.map((item, i) => (
                            <li
                              key={i}
                              className="text-sm text-slate-600 flex gap-2"
                            >
                              <span className="mt-1 w-1.5 h-1.5 bg-blue-600 rounded-full" />
                              {item}
                            </li>
                          ))}
                        </ul>

                        <button
                          className={`w-full py-3 rounded-xl font-bold transition-all
                ${isSelected
                              ? "bg-blue-600 text-white"
                              : "bg-slate-100 text-slate-700 hover:bg-blue-600 hover:text-white"
                            }`}
                        >
                          {isSelected ? "Selected" : "Select Plan"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="bg-white border-t border-slate-200">
              <div className="container mx-auto px-6 max-w-7xl py-24">

                {/* Header */}
                <div className="text-center mb-16">
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                    Technoxian Membership
                  </span>
                  <h2 className="text-4xl font-extrabold text-slate-900 mt-4">
                    Compare all student membership features
                  </h2>
                  <p className="text-slate-600 mt-4 max-w-3xl mx-auto">
                    Explore benefits across Student, Basic, and Premium memberships.
                    Click on each feature to understand what’s included.
                  </p>
                </div>

                {/* Comparison Table */}
                <div className="overflow-x-auto rounded-3xl border bg-white">
                  <table className="w-full border-collapse">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="p-5 text-left text-sm font-bold text-slate-700">
                          Feature
                        </th>
                        <th className="p-5 text-center text-sm font-bold">Student</th>
                        <th className="p-5 text-center text-sm font-bold">Basic</th>
                        <th className="p-5 text-center text-sm font-bold">Premium</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y">
                      {[
                        {
                          title: 'Official Technoxian Student Membership',
                          desc:
                            'Official student membership ID with digital certificate and QR verification under WORSO & Technoxian.',
                          values: [true, true, true],
                        },
                        {
                          title: 'Global Student Directory & Digital Badges',
                          desc:
                            'Listing in the WORSO student community directory and global young innovators directory with verifiable digital badges.',
                          values: [true, true, true],
                        },
                        {
                          title: 'Workshops, Webinars & Learning Access',
                          desc:
                            'Access to workshops, monthly webinars, resume-building sessions, and selected masterclasses.',
                          values: [true, true, true],
                        },
                        {
                          title: 'Internships, Mentorship & Placement Support',
                          desc:
                            'Access to internships, priority interviews, mentorship for innovation, career planning, and placement opportunities.',
                          values: [false, true, true],
                        },
                        {
                          title: 'Competitions & Events Access',
                          desc:
                            'Eligibility to register for district, state, national & international competitions via RoboClubs.',
                          values: [true, true, true],
                        },
                        {
                          title: 'Innovation, Hackathons & Research',
                          desc:
                            'Participation in hackathons, innovation challenges, student research submissions, and innovation council access.',
                          values: [false, true, true],
                        },
                        {
                          title: 'Leadership, Chapters & Policy Roles',
                          desc:
                            'Eligibility to form student chapters, leadership titles, advisory roles, and youth policy discussions.',
                          values: [false, false, true],
                        },
                        {
                          title: 'International Exposure & Exchange Programs',
                          desc:
                            'Priority selection for international exchange camps, leadership meets, global forums, and sponsored participation.',
                          values: [false, false, true],
                        },
                        {
                          title: 'Discounts & Premium Learning Benefits',
                          desc:
                            'Discounts on robotics, AI & drone courses, early access to advanced courses, and premium masterclasses.',
                          values: [true, true, true],
                        },
                        {
                          title: 'CSR, Volunteering & Outreach',
                          desc:
                            'Opportunities to volunteer in STEM outreach, lead CSR workshops, and earn certificates for social impact.',
                          values: [true, true, true],
                        },
                      ].map((row, i) => (
                        <TechComparisonRow
                          key={i}
                          row={row}
                          index={i}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>


            {/* Trophies Section */}
            <div className="mt-10">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500 mb-4">
                <BadgeCheck size={14} className="text-blue-600" /> Trophies
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
                <div className="relative">
                  {/* Carousel Container */}
                  <div className="overflow-hidden rounded-xl">
                    <motion.div
                      className="flex"
                      animate={{ x: `-${trophyIndex * (100 / 4)}%` }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      {trophies.map((trophy) => (
                        <div
                          key={trophy.year}
                          className="min-w-[25%] flex flex-col items-center justify-center px-3"
                        >
                          <div className="w-full max-w-[200px] mb-4">
                            <img
                              src={
                                imageErrors[trophy.year]
                                  ? createPlaceholderImage(trophy.year)
                                  : trophy.image
                              }
                              alt={trophy.name}
                              className="w-full h-full object-contain rounded-lg bg-slate-50 border border-slate-200"
                              onError={() => handleImageError(trophy.year)}
                              loading="lazy"
                            />
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 text-center leading-tight">
                            {trophy.name}
                          </h3>
                        </div>
                      ))}
                    </motion.div>
                  </div>

                  {/* Navigation Buttons */}
                  <button
                    onClick={prevTrophy}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 bg-white border border-slate-200 rounded-full p-2 shadow-sm hover:bg-slate-50 hover:border-blue-400 transition-colors z-10"
                    aria-label="Previous trophy"
                  >
                    <ChevronLeft size={20} className="text-slate-600" />
                  </button>
                  <button
                    onClick={nextTrophy}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 bg-white border border-slate-200 rounded-full p-2 shadow-sm hover:bg-slate-50 hover:border-blue-400 transition-colors z-10"
                    aria-label="Next trophy"
                  >
                    <ChevronRight size={20} className="text-slate-600" />
                  </button>

                  {/* Carousel Indicators */}
                  <div className="flex justify-center gap-2 mt-4">
                    {Array.from({ length: Math.ceil(trophies.length / 4) }).map(
                      (_, index) => {
                        const startIndex = index * 4;
                        const isActive =
                          trophyIndex >= startIndex &&
                          trophyIndex < startIndex + 4;
                        return (
                          <button
                            key={index}
                            onClick={() => setTrophyIndex(startIndex)}
                            className={`h-1.5 rounded-full transition-all ${isActive
                              ? "w-6 bg-blue-600"
                              : "w-1.5 bg-slate-300 hover:bg-slate-400"
                              }`}
                            aria-label={`Go to trophy group ${index + 1}`}
                          />
                        );
                      },
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "disciplines" && (
          <motion.div
            key="disciplines"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="container mx-auto px-4 py-12"
          >
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col lg:flex-row h-[calc(100vh-200px)] min-h-[640px]">
              {/* Discipline Sidebar - Game List - UPDATED */}
              <div className="w-72 bg-gradient-to-b from-[#0f172a] via-[#0b1220] to-[#020617] text-white relative overflow-hidden">
                <div className="relative h-full">

                  {/* Soft ambient glow */}
                  <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                  {/* Fixed Header */}
                  <div className="absolute top-0 left-0 right-0 z-10 p-6 backdrop-blur-md bg-[#0f172a]/80">
                    <div className="text-[11px] font-bold uppercase tracking-widest text-blue-300">
                      Games & Disciplines
                    </div>
                    <div className="text-xl font-extrabold text-white mt-1">
                      All Games
                    </div>
                  </div>

                  {/* Scrollable List */}
                  <div className="absolute top-24 bottom-0 left-0 right-0 overflow-y-auto scroll-smooth scrollbar-hide">
                    <div className="p-5 space-y-1.5">
                      {DISCIPLINE_GAMES.map((game) => {
                        const active = selectedDisciplineGame === game.name;

                        return (
                          <button
                            key={game.id}
                            onClick={() => setSelectedDisciplineGame(game.name)}
                            className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-200
                ${active
                                ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/10 text-white shadow-lg'
                                : 'text-blue-100/80 hover:bg-white/5'
                              }`}
                          >
                            {/* Icon */}
                            <div
                              className={`p-2 rounded-lg transition-colors
                  ${active ? 'bg-blue-400/20' : 'bg-white/5'}
                `}
                            >
                              {game.icon}
                            </div>

                            {/* Text */}
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm truncate">
                                {game.name}
                              </div>
                              <div className="text-xs text-blue-200/60 truncate mt-0.5">
                                {game.category}
                              </div>
                            </div>

                            {/* Active Indicator */}
                            {active && (
                              <ChevronRight
                                size={14}
                                className="text-blue-300 flex-shrink-0"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>


              {/* Main Content Area - Game Details */}
              <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-4xl">
                  {/* Game Header with Image */}
                  <div className="mb-8">
                    <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
                      <img
                        src={currentGame.image}
                        alt={currentGame.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute bottom-6 left-6 text-white">
                        <div className="text-xs font-bold uppercase tracking-wider text-blue-200 mb-1">
                          {currentGame.category} • {currentGame.duration}
                        </div>
                        <h1 className="text-3xl font-bold">
                          {currentGame.name}
                        </h1>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                          {currentGame.name} Details
                        </h2>
                        <p className="text-slate-600 mt-2">
                          {currentGame.description}
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl text-center">
                        <div className="text-xs font-bold uppercase">
                          Prize Pool
                        </div>
                        <div className="text-2xl font-extrabold">
                          {currentGame.prize}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Game Information Grid */}
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <UsersIcon size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900">
                            Team Requirements
                          </h3>
                          <div className="text-2xl font-extrabold text-blue-600 mt-1">
                            {currentGame.teamSize}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600">
                        Team members including mentors and participants
                      </p>
                    </div>

                    <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-emerald-100 p-2 rounded-lg">
                          <Calendar size={20} className="text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900">Duration</h3>
                          <div className="text-2xl font-extrabold text-emerald-600 mt-1">
                            {currentGame.duration}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600">
                        Competition timeline including setup and matches
                      </p>
                    </div>

                    <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-amber-100 p-2 rounded-lg">
                          <Trophy size={20} className="text-amber-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900">Category</h3>
                          <div className="text-2xl font-extrabold text-amber-600 mt-1">
                            {currentGame.category}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600">
                        Primary competition category and focus area
                      </p>
                    </div>
                  </div>

                  {/* Rules and Regulations */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-slate-100 p-3 rounded-lg">
                        <FileText size={24} className="text-slate-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">
                          Rules & Regulations
                        </h3>
                        <p className="text-slate-600 mt-1">
                          Official competition guidelines
                        </p>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                      <p className="text-slate-700 leading-relaxed">
                        {currentGame.rules}
                      </p>
                    </div>
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-slate-50 rounded-lg">
                        <div className="text-xs font-bold text-slate-500 uppercase">
                          Robot Weight
                        </div>
                        <div className="text-lg font-bold text-slate-900">
                          Max 5kg
                        </div>
                      </div>
                      <div className="text-center p-4 bg-slate-50 rounded-lg">
                        <div className="text-xs font-bold text-slate-500 uppercase">
                          Battery
                        </div>
                        <div className="text-lg font-bold text-slate-900">
                          LiPo 3S Max
                        </div>
                      </div>
                      <div className="text-center p-4 bg-slate-50 rounded-lg">
                        <div className="text-xs font-bold text-slate-500 uppercase">
                          Arena Size
                        </div>
                        <div className="text-lg font-bold text-slate-900">
                          8x8m
                        </div>
                      </div>
                      <div className="text-center p-4 bg-slate-50 rounded-lg">
                        <div className="text-xs font-bold text-slate-500 uppercase">
                          Judges
                        </div>
                        <div className="text-lg font-bold text-slate-900">
                          3+ Panel
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Registration CTA */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">
                          Ready to Compete?
                        </h3>
                        <p className="text-blue-100">
                          Register your team for {currentGame.name} and showcase
                          your skills on the global stage.
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setActiveTab("register")}
                          className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors"
                        >
                          Register Now
                        </button>
                        <button className="bg-transparent border border-white/30 text-white px-6 py-3 rounded-lg font-bold hover:bg-white/10 transition-colors">
                          Download Rulebook
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Additional Resources */}
                  <div className="mt-8 grid md:grid-cols-3 gap-6">
                    <div className="p-6 bg-white border border-slate-200 rounded-xl">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <GraduationCap size={20} className="text-blue-600" />
                        </div>
                        <h4 className="font-bold text-slate-900">
                          Training Resources
                        </h4>
                      </div>
                      <p className="text-sm text-slate-600 mb-4">
                        Access tutorials, guides, and practice materials
                      </p>
                      <button className="text-sm text-blue-600 font-medium hover:text-blue-700">
                        View Resources →
                      </button>
                    </div>

                    <div className="p-6 bg-white border border-slate-200 rounded-xl">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-emerald-100 p-2 rounded-lg">
                          <Award size={20} className="text-emerald-600" />
                        </div>
                        <h4 className="font-bold text-slate-900">
                          Past Winners
                        </h4>
                      </div>
                      <p className="text-sm text-slate-600 mb-4">
                        See previous champions and their innovative solutions
                      </p>
                      <button className="text-sm text-blue-600 font-medium hover:text-blue-700">
                        View Gallery →
                      </button>
                    </div>

                    <div className="p-6 bg-white border border-slate-200 rounded-xl">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-purple-100 p-2 rounded-lg">
                          <Globe2 size={20} className="text-purple-600" />
                        </div>
                        <h4 className="font-bold text-slate-900">
                          Global Rankings
                        </h4>
                      </div>
                      <p className="text-sm text-slate-600 mb-4">
                        Check international rankings and team standings
                      </p>
                      <button className="text-sm text-blue-600 font-medium hover:text-blue-700">
                        View Rankings →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "schedule" && (
          <motion.div
            key="schedule"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="container mx-auto px-4 py-12"
          >
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col lg:flex-row h-[calc(100vh-200px)] min-h-[640px]">
              {/* Schedule sidebar - UPDATED to match discipline */}
              <div className="w-72 bg-gradient-to-b from-[#0f172a] via-[#0b1220] to-[#020617] text-white relative overflow-hidden">
                {/* Ambient glow */}
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative h-full">
                  <AnimatePresence initial={false} mode="wait">

                    {/* ================= CHAMPIONSHIP ================= */}
                    {sidebarLevel === "championship" && (
                      <motion.div
                        key="championship"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="relative h-full"
                      >
                        {/* Header */}
                        <div className="absolute top-0 left-0 right-0 z-10 p-6 backdrop-blur-md bg-[#0f172a]/80">
                          <div className="text-[11px] font-bold uppercase tracking-widest text-blue-300">
                            Schedule
                          </div>
                          <div className="text-xl font-extrabold text-white mt-1">
                            Championship Levels
                          </div>
                        </div>

                        {/* Content */}
                        <div className="absolute top-24 bottom-0 left-0 right-0 overflow-y-auto scroll-smooth scrollbar-hide">
                          <div className="p-5 space-y-1.5">
                            {SCHEDULE_DATA.map((champ) => {
                              const active = selectedChampionship === champ.id;
                              return (
                                <button
                                  key={champ.id}
                                  onClick={() => {
                                    setSelectedChampionship(champ.id);
                                    setSidebarLevel("event");
                                  }}
                                  className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all
                      ${active
                                      ? "bg-gradient-to-r from-blue-500/20 to-indigo-500/10 shadow-lg"
                                      : "hover:bg-white/5 text-blue-100/80"
                                    }`}
                                >
                                  <span className="font-semibold text-sm text-white">
                                    {champ.name}
                                  </span>
                                  <ChevronRight size={14} className="text-blue-300" />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* ================= EVENT ================= */}
                    {sidebarLevel === "event" && selectedChampionship && (
                      <motion.div
                        key="event"
                        initial={{ x: 30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -30, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="absolute inset-0 h-full"
                      >
                        {/* Header */}
                        <div className="absolute top-0 left-0 right-0 z-10 p-6 backdrop-blur-md bg-[#0f172a]/80">
                          <button
                            onClick={() => {
                              setSidebarLevel("championship");
                              setSelectedEvent(null);
                              setSelectedGame(null);
                            }}
                            className="flex items-center gap-2 text-sm text-blue-200 hover:text-white transition"
                          >
                            <ChevronLeft size={16} />
                            Back
                          </button>

                          <div className="mt-4">
                            <div className="text-[11px] font-bold uppercase tracking-widest text-blue-300">
                              Events
                            </div>
                            <div className="text-lg font-extrabold text-white mt-1">
                              {
                                SCHEDULE_DATA.find(c => c.id === selectedChampionship)?.name
                              }
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="absolute top-36 bottom-0 left-0 right-0 overflow-y-auto scroll-smooth scrollbar-hide">
                          <div className="p-5 space-y-1.5">
                            {SCHEDULE_DATA.find(c => c.id === selectedChampionship)?.events.map(event => {
                              const active = selectedEvent === event.id;
                              return (
                                <button
                                  key={event.id}
                                  onClick={() => {
                                    setSelectedEvent(event.id);
                                    setSelectedGame(null);
                                    setSidebarLevel("game");
                                  }}
                                  className={`w-full px-4 py-3 rounded-xl flex items-center justify-between transition-all
                      ${active
                                      ? "bg-gradient-to-r from-blue-500/20 to-indigo-500/10 shadow-lg"
                                      : "hover:bg-white/5 text-blue-100/80"
                                    }`}
                                >
                                  <span className="font-semibold text-sm text-white">
                                    {event.name}
                                  </span>
                                  <div className="flex items-center gap-2 text-blue-300 text-[11px] uppercase">
                                    <MapPin size={10} />
                                    {ZONE_CITIES[event.id] || ""}
                                    <ChevronRight size={14} />
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* ================= GAME ================= */}
                    {sidebarLevel === "game" && selectedChampionship && selectedEvent && (
                      <motion.div
                        key="game"
                        initial={{ x: 40, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -40, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="absolute inset-0 h-full"
                      >
                        {/* Header */}
                        <div className="absolute top-0 left-0 right-0 z-10 p-6 backdrop-blur-md bg-[#0f172a]/80">
                          <button
                            onClick={() => {
                              setSidebarLevel("event");
                              setSelectedGame(null);
                            }}
                            className="flex items-center gap-2 text-sm text-blue-200 hover:text-white transition"
                          >
                            <ChevronLeft size={16} />
                            Back
                          </button>

                          <div className="mt-4">
                            <div className="text-[11px] font-bold uppercase tracking-widest text-blue-300">
                              Games
                            </div>
                            <div className="text-lg font-extrabold text-white mt-1">
                              {
                                SCHEDULE_DATA
                                  .find(c => c.id === selectedChampionship)
                                  ?.events.find(e => e.id === selectedEvent)?.name
                              }
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="absolute top-36 bottom-0 left-0 right-0 overflow-y-auto scroll-smooth scrollbar-hide">
                          <div className="p-5 space-y-2">
                            {SCHEDULE_DATA
                              .find(c => c.id === selectedChampionship)
                              ?.events.find(e => e.id === selectedEvent)
                              ?.games.map(game => {
                                const active = selectedGame === game.id;
                                return (
                                  <button
                                    key={game.id}
                                    onClick={() => setSelectedGame(game.id)}
                                    className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-200
    ${active
                                        ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/10 text-white shadow-lg'
                                        : 'text-blue-100/80 hover:bg-white/5'
                                      }`}
                                  >
                                    {/* Icon - using a generic one, or you can map per game later */}
                                    <div
                                      className={`p-2 rounded-lg transition-colors
      ${active ? 'bg-blue-400/20' : 'bg-white/5'}
    `}
                                    >
                                      <Target size={18} className="text-blue-300" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                      <div className="font-semibold text-sm truncate">
                                        {game.name}
                                      </div>
                                      <div className="text-xs text-blue-200/60 truncate mt-0.5">
                                        {game.venue}
                                      </div>
                                    </div>

                                    {active && (
                                      <ChevronRight size={14} className="text-blue-300 flex-shrink-0" />
                                    )}

                                    {!active && (
                                      <ChevronRight size={14} className="text-blue-200/40 flex-shrink-0" />
                                    )}
                                  </button>
                                );
                              })}
                          </div>
                        </div>
                      </motion.div>
                    )}

                  </AnimatePresence>
                </div>
              </div>


              {/* Main Content Area - Game Details */}
              <div className="flex-1 overflow-y-auto p-8">
                {selectedChampionship && selectedEvent && selectedGame ? (
                  (() => {
                    const championship = SCHEDULE_DATA.find(
                      (c) => c.id === selectedChampionship,
                    );
                    const event = championship?.events.find(
                      (e) => e.id === selectedEvent,
                    );
                    const game = event?.games.find(
                      (g) => g.id === selectedGame,
                    );

                    if (!game) return null;

                    const formatDate = (dateStr) => {
                      const date = new Date(dateStr);
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    };

                    return (
                      <div>
                        <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-200">
                          <div>
                            <div className="text-xs font-bold uppercase text-blue-600 mb-1">
                              Game Schedule
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900">
                              {game.name}
                            </h2>
                            <div className="mt-2 flex items-center gap-4 text-sm text-slate-600">
                              <div className="flex items-center gap-2">
                                <Calendar size={14} className="text-blue-600" />
                                {formatDate(game.startDate)} –{" "}
                                {formatDate(game.endDate)}
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin size={14} className="text-blue-600" />
                                {game.venue}
                              </div>
                              {game.zone && (
                                <div className="flex items-center gap-2">
                                  <MapPin
                                    size={14}
                                    className="text-green-600"
                                  />
                                  <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium">
                                    {game.zone}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() =>
                                window.open(game.registrationLink, "_blank")
                              }
                              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors text-sm"
                            >
                              Register to Game
                            </button>
                            <button
                              onClick={() => setActiveTab("register")}
                              className="bg-slate-100 text-slate-700 px-4 py-2.5 rounded-lg font-bold hover:bg-slate-200 transition-colors text-sm"
                            >
                              View Registration
                            </button>
                          </div>
                        </div>

                        {game.description && (
                          <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
                            <p className="text-slate-700 leading-relaxed">
                              {game.description}
                            </p>
                          </div>
                        )}

                        <h3 className="text-xl font-bold text-slate-900 mb-4">
                          Schedule Details
                        </h3>
                        <div className="space-y-4 mb-8">
                          {game.schedule.map((item, idx) => (
                            <div
                              key={idx}
                              className="rounded-xl border border-slate-200 overflow-hidden"
                            >
                              <div className="bg-slate-50 px-5 py-3 flex items-center gap-3">
                                <Calendar size={14} className="text-blue-600" />
                                <div className="text-sm font-bold text-slate-700">
                                  {formatDate(item.date)}
                                </div>
                                <div className="ml-auto flex items-center gap-2">
                                  <Clock3 size={14} className="text-blue-600" />
                                  <div className="text-sm font-bold text-slate-700">
                                    {item.time}
                                  </div>
                                </div>
                              </div>
                              <div className="bg-white p-5">
                                <div className="font-bold text-slate-900">
                                  {item.title}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                            <div className="text-sm font-bold text-slate-900 mb-4">
                              Event Information
                            </div>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-sm text-slate-600">
                                  Championship:
                                </span>
                                <span className="text-sm font-medium text-slate-900">
                                  {championship?.name}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-slate-600">
                                  Event:
                                </span>
                                <span className="text-sm font-medium text-slate-900">
                                  {event?.name}
                                </span>
                              </div>
                              {game.zone && (
                                <div className="flex justify-between">
                                  <span className="text-sm text-slate-600">
                                    Zone:
                                  </span>
                                  <span className="text-sm font-medium text-slate-900">
                                    {game.zone}
                                  </span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span className="text-sm text-slate-600">
                                  Venue:
                                </span>
                                <span className="text-sm font-medium text-slate-900">
                                  {game.venue}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-slate-600">
                                  Duration:
                                </span>
                                <span className="text-sm font-medium text-slate-900">
                                  {formatDate(game.startDate)} to{" "}
                                  {formatDate(game.endDate)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
                            <div className="text-sm font-bold text-slate-900 mb-4">
                              Registration
                            </div>
                            <p className="text-sm text-slate-600 mb-4">
                              Ready to compete in {game.name}? Register now to
                              secure your spot in the competition.
                            </p>
                            <button
                              onClick={() =>
                                window.open(game.registrationLink, "_blank")
                              }
                              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                            >
                              Register Now
                            </button>
                            <p className="text-xs text-slate-500 mt-3 text-center">
                              Early registration discounts available until March
                              31, 2025
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">
                    <div className="text-center">
                      <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                      <div className="text-lg font-bold mb-2">
                        Select a Game
                      </div>
                      <div className="text-sm">
                        Choose a championship level, event, and game to view the
                        schedule
                      </div>
                      <div className="mt-4 text-xs text-slate-500">
                        <div>
                          • Zonals: West, East, South, North, Center zones
                        </div>
                        <div>• National: Yearly national championships</div>
                        <div>• World Cup: International championships</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "gallery" && (
          <motion.div
            key="gallery"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="container mx-auto px-4 py-12"
          >
            <div className="grid md:grid-cols-3 gap-6">
              {gallery.map((cat, idx) => (
                <motion.button
                  type="button"
                  key={cat.id}
                  onClick={() => setActiveGallery(cat)}
                  className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-slate-900 text-left"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.25 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div
                    className="h-48 bg-cover bg-center"
                    style={{
                      backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.55)), url(${cat.cover})`,
                    }}
                  />
                  <div className="p-4 flex items-center justify-between text-white">
                    <div>
                      <div className="text-xs uppercase font-bold text-emerald-200 flex items-center gap-1">
                        <Camera size={14} /> {cat.tag}
                      </div>
                      <div className="text-lg font-extrabold">{cat.title}</div>
                    </div>
                    <div className="text-[10px] px-2 py-1 rounded-full bg-white/10 border border-white/10">
                      View
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "register" && (
          <motion.div
            key="register"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="container mx-auto px-4 py-12"
          >
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
              <div className="md:w-64 bg-[#0f172a] p-6 text-white">
                <h3 className="font-bold text-white mb-6">Registration Type</h3>
                <div className="space-y-2">
                  {["Team Registration", "Visitor Pass", "Exhibitor Space"].map(
                    (type) => {
                      const id = type.split(" ")[0].toLowerCase();
                      return (
                        <button
                          key={id}
                          onClick={() => setRegType(id)}
                          className={`w-full text-left px-4 py-3 rounded-xl  transition-all shadow-sm flex items-center justify-between ${regType === id
                            ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/10 text-white shadow-lg'
                            : 'text-blue-100/80 hover:bg-white/5'
                            }`}
                        >
                          <span className="font-semibold text-sm">{type}</span>
                          {regType === id && (
                            <ChevronRight size={14} className="text-blue-200" />
                          )}
                        </button>
                      );
                    },
                  )}
                </div>
              </div>

              <div className="flex-1 p-8 md:p-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                  {regType === "team" && <Users className="text-blue-600" />}
                  {regType === "visitor" && (
                    <Ticket className="text-blue-600" />
                  )}
                  {regType === "exhibitor" && (
                    <Building className="text-blue-600" />
                  )}
                  {regType.charAt(0).toUpperCase() + regType.slice(1)} Path
                </h2>
                <div className="space-y-6 max-w-3xl">
                  {regType === "team" && (
                    <>
                      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                        <BadgeCheck className="text-blue-600" size={18} />
                        <div>
                          <div className="font-bold text-slate-900">
                            Path A: Team
                          </div>
                          <p className="text-sm text-slate-600">
                            Create team profile → add players → choose 9
                            competition categories → pay unified entry.
                          </p>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">
                            Team Name
                          </label>
                          <input
                            type="text"
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. RoboTitans"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">
                            Country
                          </label>
                          <select className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                            <option>Select Country</option>
                            <option>India</option>
                            <option>UAE</option>
                            <option>USA</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          Select Zonal Category
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                          {ZONAL_CATEGORIES.map((zone) => (
                            <label
                              key={zone.id}
                              className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:border-blue-400 transition-colors"
                            >
                              <input
                                type="radio"
                                name="zone"
                                className="w-5 h-5 text-blue-600 rounded-full border-slate-300 focus:ring-blue-500"
                              />
                              <span className="text-sm font-medium text-slate-700">
                                {zone.name}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          Select Games ($100/game)
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {GAMES_LIST.map((game) => (
                            <label
                              key={game.id}
                              className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:border-blue-400 transition-colors"
                            >
                              <input
                                type="checkbox"
                                className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 custom-checkbox"
                              />
                              <span className="text-sm font-medium text-slate-700">
                                {game.name}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {regType === "visitor" && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                        <BadgeCheck className="text-blue-600" size={18} />
                        <div>
                          <div className="font-bold text-slate-900">
                            Path B: Visitor
                          </div>
                          <p className="text-sm text-slate-600">
                            Choose day pass → pay → instant QR ticket.
                          </p>
                        </div>
                      </div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Select Day
                      </label>
                      <select className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                        <option>Day 1 - Oct 12</option>
                        <option>Day 2 - Oct 13</option>
                        <option>Day 3 - Oct 14</option>
                      </select>
                    </div>
                  )}

                  {regType === "exhibitor" && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                        <BadgeCheck className="text-blue-600" size={18} />
                        <div>
                          <div className="font-bold text-slate-900">
                            Path C: Exhibitor
                          </div>
                          <p className="text-sm text-slate-600">
                            Upload booth design → select floor space → pay
                            deposit.
                          </p>
                        </div>
                      </div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Upload Booth Design
                      </label>
                      <input type="file" className="w-full" />
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Select Floor Space
                      </label>
                      <select className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                        <option>6m x 6m</option>
                        <option>9m x 9m</option>
                        <option>Custom (request)</option>
                      </select>
                    </div>
                  )}

                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
                    <div>
                      <div className="text-sm text-slate-500">
                        Unified Payment Gateway
                      </div>
                      <div className="text-2xl font-bold text-slate-900">
                        $200.00 USD
                      </div>
                      <div className="text-xs text-slate-500">
                        Applies to all paths; receipts shared to partner
                        portals.
                      </div>
                    </div>
                    <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2">
                      <CreditCard size={18} /> Proceed to Pay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {activeGallery && (
          <motion.div
            className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onWheel={(e) => e.stopPropagation()}
          >
            <motion.div
              className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl overflow-hidden"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onWheel={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                <div>
                  <div className="text-xs uppercase font-bold text-blue-600">
                    {activeGallery.tag}
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900">
                    {activeGallery.title} Gallery
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowAllGallery((p) => !p)}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                  >
                    {showAllGallery ? "Show Less" : "Show More"}
                  </button>
                  <button
                    onClick={() => {
                      setActiveGallery(null);
                      setShowAllGallery(false);
                    }}
                    className="bg-slate-100 p-2 rounded-full hover:bg-slate-200"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
              <div className="p-6 max-h-[70vh] overflow-y-auto overscroll-contain">
                <div className="grid md:grid-cols-3 gap-4">
                  {(showAllGallery
                    ? activeGallery.images
                    : activeGallery.images.slice(0, 6)
                  ).map((img) => (
                    <div
                      key={img}
                      className="relative overflow-hidden rounded-2xl border border-slate-100 h-48"
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${img})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"></div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TechnoxianView;
