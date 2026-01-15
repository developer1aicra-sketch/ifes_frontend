export const CATEGORIES = [
  {
    id: "student",
    title: "Student",
    description: "For Learners & Enthusiasts",
    icon: "GraduationCap",
    color: "#2563EB"
  },
  {
    id: "professional",
    title: "Professional",
    description: "Coaches, Trainers & Innovators",
    icon: "Briefcase",
    color: "#059669"
  },
  {
    id: "institute",
    title: "Institute",
    description: "Schools, Colleges & Universities",
    icon: "School",
    color: "#7C3AED"
  },
  {
    id: "corporate",
    title: "Corporate",
    description: "Companies, NGOs & Startups",
    icon: "Building2",
    color: "#D97706"
  }
];

export const STUDENT_PLANS = [
  {
    id: "basic",
    name: "Student Basic",
    tagline: "Best for Starters",
    price: "10",
    period: "/ Year (USD)",
    popular: false,
    features: [
      {
        text: "WORSO Digital Certificate & ID",
        icon: "Award"
      },
      {
        text: "Listing in Student Directory",
        icon: "Users"
      },
      {
        text: "Discounted DIY Kits",
        icon: "Rocket"
      },
    ],
    benefits: [
      "WORSO Student Membership ID with Digital Certificate",
      "Listed in the WORSO student community directory"
    ]
  },
  {
    id: "premium",
    name: "Student Premium",
    tagline: "Most Popular",
    price: "50",
    period: "/ Year (USD)",
    popular: true,
    features: [
      {
        text: "Personalized ID Card",
        icon: "Award"
      },
      {
        text: "Premium Digital Badge",
        icon: "Star"
      },
      {
        text: "Priority Internship Interviews",
        icon: "TrendingUp"
      },
    ],
    benefits: [
      "Personalized membership ID card with QR verification",
      "WORSO Premium Digital Badge for CV/LinkedIn"
    ]
  }
];

export const PROFESSIONAL_PLANS = [
  {
    id: "professional",
    name: "Professional Membership",
    tagline: "For Coaches & Experts",
    price: "100",
    period: "/ Year (USD)",
    popular: true,
    features: [
      {
        text: "WORSO Certified Professional Badge",
        icon: "Award"
      },
      {
        text: "Global Expert Directory Listing",
        icon: "Globe"
      },
    ],
    benefits: [
      "WORSO Certified Professional Member badge",
      "Global listing in the WORSO Certified Experts Directory",
    ]
  }
];

export const INSTITUTE_PLANS = [
  {
    id: "institute",
    name: "Institute Membership",
    tagline: "For Schools & Colleges",
    price: "200",
    period: "/ Year (USD)",
    popular: true,
    features: [
      {
        text: "Accredited WORSO Institution Badge",
        icon: "Award"
      },
      {
        text: "Support to set up Robotics/STEM Labs",
        icon: "BookOpen"
      },
    ],
    benefits: [
      "Accredited as a WORSO Robotics Sports Institution",
      "Official WORSO Institutional Member Badge",
    ]
  }
];

export const CORPORATE_PLANS = [
  {
    id: "corporate",
    name: "Corporate Membership",
    tagline: "For Companies & Startups",
    price: "500",
    period: "/ Year (USD)",
    popular: true,
    features: [
      {
        text: "Official WORSO Corporate Badge",
        icon: "Award"
      },
      {
        text: "Brand Exposure",
        icon: "Globe"
      },
    ],
    benefits: [
      "Official WORSO Corporate Member Badge",
      "Brand recognition as a supporter of robotics education",
    ]
  }
];

export const STEPS = ["CATEGORY", "PLAN", "DETAILS", "PAYMENT"];

// Add to existing constants
export const PAYMENT_GATEWAYS = [
  {
    id: 'razorpay',
    name: 'Razorpay',
    description: 'Pay in USD via Cards, UPI, Net Banking, Wallet',
    icon: 'Rs',
    badge: 'Recommended for India',
    features: ['Cards (Visa/Mastercard/Rupay)', 'UPI', 'Net Banking', 'Wallet']
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'International Payments in USD',
    icon: 'P',
    badge: 'Global Payments',
    features: ['PayPal Balance', 'Credit/Debit Cards', 'Bank Transfer']
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Secure global card payments',
    icon: 'S',
    badge: 'International Cards',
    features: ['All Major Cards', 'Apple Pay', 'Google Pay', 'SEPA']
  }
];
// 

// 