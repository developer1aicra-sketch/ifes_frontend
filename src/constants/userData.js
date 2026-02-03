export const INITIAL_DB = {
  // Current User
  currentUser: {
    uid: "u_101",
    tx_id: "WRC2211937232",
    full_name: "Pandhiyarajan R",
    role: "captain",
    club_id: "c_001",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pandhiyarajan",
    membership_tier: "professional",
    membership_expiry: "2026-12-31",
    career_stats: { golds: 2, silvers: 1, matches: 15 },
    certificates: [
      { id: "cert_992", title: "Winner - RoboRace ZRC", date: "2025-05-12" },
      { id: "cert_112", title: "Participant - WRC Soccer", date: "2024-10-10" }
    ]
  },

  // Club Information 
  club: {
    club_id: "c_001",
    name: "ROBO RAGE ACT",
    institute_name: "Chennai Institute of Tech",
    global_rank: 1,
    wallet_balance: 15000,
    verification_status: "verified",
    members: [
      { uid: "u_101", name: "Pandhiyarajan R", role: "Captain", tier: "Professional" },
      { uid: "u_102", name: "Manohar K S", role: "Pilot", tier: "Student Premium" },
      { uid: "u_103", name: "Aarsh Singhal", role: "Programmer", tier: "Student Basic" },
      { uid: "u_104", name: "byub Singhal", role: "Programmer", tier: "Student Basic" },
      { uid: "u_105", name: "cashif Singhal", role: "Programmer", tier: "Student Basic" },
      { uid: "u_106", name: "dmreen Singhal", role: "Programmer", tier: "Student Basic" },
      { uid: "u_107", name: "ebhishek Singhal", role: "Programmer", tier: "Student Basic" },
      { uid: "u_108", name: "Ram Singhal", role: "Programmer", tier: "Student Basic" },
      { uid: "u_109", name: "Rajeev Singhal", role: "Programmer", tier: "Student Basic" },
      { uid: "u_110", name: "Raghav Singhal", role: "Programmer", tier: "Student Basic" }

    ]
  },

  // Garage/Bots
  garage: [
    { bot_id: "b_01", name: "Destroyer X", category: "Combat 15kg", image: "", specs: { motor: "1000RPM", battery: "LiPo 4S" }, status: "Ready" },
    { bot_id: "b_02", name: "Speedster", category: "RoboRace", image: "", specs: { motor: "2000RPM", battery: "LiPo 3S" }, status: "Ready" },
    { bot_id: "b_03", name: "The Wall", category: "Soccer", image: "", specs: { motor: "High Torque", battery: "LiPo 4S" }, status: "Maintenance" }
  ],

  // Events
  events: [
    {
      event_id: "evt_zrc_pune",
      name: "ZRC Pune - RoboRace",
      type: "championship_track",
      status: "open",
      date: "14 Days Left",
      venue: "Pune Arena",
      is_locked: false
    },
    {
      event_id: "evt_nrc_delhi",
      name: "National Championship",
      type: "championship_track",
      status: "upcoming",
      date: "July 2026",
      venue: "Delhi Stadium",
      is_locked: true,
      lock_reason: "Win at Zonal to unlock"
    },
    {
      event_id: "evt_std_01",
      name: "Open Drone League",
      type: "standalone",
      status: "open",
      venue: "Hybrid / Online",
      date: "Aug 2026",
      is_locked: false
    }
  ],

  // Membership Tiers
  membership_tiers: {
    student_basic: {
      id: "m_sb",
      name: "Student Basic",
      target: "Learners",
      fee: "$10",
      color: "border-slate-600",
      benefits: [
        "WORSO Student Membership ID with Digital Certificate",
        "Listed in the WORSO student community directory",
        "Access to DIY robotics project kits at discounted rates"
      ]
    },
    student_premium: {
      id: "m_sp",
      name: "Student Premium",
      target: "Learners (Advanced)",
      fee: "$50",
      color: "border-yellow-500",
      isRecommended: true,
      benefits: [
        "Personalized membership ID card with QR verification",
        "WORSO Premium Digital Badge for CV/LinkedIn",
        "Priority listing in Global Young Innovators Directory"
      ]
    },
    professional: {
      id: "m_prof",
      name: "Professional",
      target: "Coaches/Trainers/Innovators",
      fee: "$100",
      color: "border-purple-500",
      benefits: [
        "WORSO Certified Professional Member badge",
        "Global listing in the WORSO Certified Experts Directory",
        "Authorized Trainer status for WORSO certifications"
      ]
    }
  },

  // Admin Queue
  admin_verification_queue: [
    {
      id: "claim_001",
      club_name: "Ctrl + Corp",
      event: "ZRC Jaipur",
      category: "Innovation Open",
      claimed_rank: "2nd",
      proof_doc: "cert_scan.pdf",
      status: "pending"
    }
  ],

  // Ticker News
  ticker_news: [
    " LIVE: ROBO ODISHA takes Rank #1 Global",
    " Membership Drive: Get 50% off on Student Premium this week",
    " New 'Standalone' Drone League announced - Register Now!"
  ]
};