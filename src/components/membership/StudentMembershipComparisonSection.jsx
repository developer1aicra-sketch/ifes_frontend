import { motion } from "framer-motion";
import {
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  Globe,
  HandHeart,
  Minus,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users
} from "lucide-react";

const STUDENT_MEMBERSHIP = {
  header: {
    title: "Student Membership",
    subtitle:
      "Everything you get with Basic vs Premium. Premium is designed for students who want priority access, global visibility, and stronger career outcomes.",
    plans: [
      { id: "basic", name: "Basic", price: "USD 10", period: "Annual Membership Fee" },
      { id: "premium", name: "Premium", price: "USD 50", period: "Annual Membership Fee", highlight: true }
    ]
  },
  sections: [
    {
      title: "Brand Visibility & Global Recognition",
      icon: Sparkles,
      highlights: [
        "Student ID + certificate and verified premium ID option",
        "Directory listings for recognition and credibility",
        "Premium badge for CV/LinkedIn visibility"
      ],
      image: { from: "#DBEAFE", to: "#EFF6FF" },
      rows: [
        {
          label: "Digital certificate + membership ID",
          basic: "WORSO Student Membership ID with Digital Certificate",
          premium: "Personalized membership ID card with QR verification"
        },
        {
          label: "Community directory listing",
          basic: "Listed in the WORSO student community directory",
          premium: "Priority listing in the Global Young Innovators Directory"
        },
        {
          label: "Professional badge",
          basic: false,
          premium: "WORSO Premium Digital Badge for CV/LinkedIn"
        }
      ]
    },
    {
      title: "Establishment of Robotics & STEM Infrastructure",
      icon: Rocket,
      highlights: [
        "Discounted DIY robotics project kits",
        "Premium access to advanced simulation tools & AI labs"
      ],
      image: { from: "#ECFEFF", to: "#F0FDFA" },
      rows: [
        { label: "DIY project kits", basic: "Access to DIY robotics project kits at discounted rates", premium: true },
        { label: "Advanced tools access", basic: false, premium: "Exclusive access to advanced simulation tools & AI labs" }
      ]
    },
    {
      title: "Workshops & Webinars",
      icon: BookOpen,
      highlights: ["Free learning touchpoints to stay active in the community"],
      image: { from: "#F5F3FF", to: "#EEF2FF" },
      rows: [
        { label: "Monthly webinars", basic: true, premium: true }
      ]
    },
    {
      title: "Career Growth, Access to Talent Pipeline & Hiring",
      icon: BriefcaseBusiness,
      highlights: [
        "Internship & project listings",
        "Premium priority interviews via partners",
        "Mentorship and placement support"
      ],
      image: { from: "#FFF7ED", to: "#FFFBEB" },
      rows: [
        { label: "Internship & project listings", basic: "Access to internship listings & project opportunities", premium: true },
        { label: "Priority interviews", basic: false, premium: "Priority internship interviews through WORSO partners" },
        { label: "Resume + career mentorship", basic: false, premium: "Resume-building mentorship for innovation & career planning" },
        { label: "Placement opportunities", basic: false, premium: "Placement opportunities with WORSO partners" }
      ]
    },
    {
      title: "Access to Major National & International Events",
      icon: Globe,
      highlights: [
        "Competition registrations (RoboClub condition)",
        "Conference and partner event access",
        "Premium eligibility for sponsored leagues"
      ],
      image: { from: "#E0F2FE", to: "#F0F9FF" },
      rows: [
        {
          label: "Competitions registration",
          basic:
            "Registration for District/State/National/International Competitions (must be part of a RoboClub)",
          premium: true
        },
        { label: "Conferences & partner events", basic: "Tech Conferences & Event Access by WORSO & Partners", premium: true },
        { label: "Sponsored leagues eligibility", basic: false, premium: "Eligibility for sponsored participation in international leagues" }
      ]
    },
    {
      title: "CSR & Social Impact Opportunities",
      icon: HandHeart,
      highlights: [
        "Volunteer for STEM outreach",
        "Premium lead mentor workshops",
        "Premium social-impact certification"
      ],
      image: { from: "#FCE7F3", to: "#FFF1F2" },
      rows: [
        { label: "Volunteer outreach", basic: "Chance to volunteer in basic STEM outreach programs", premium: true },
        { label: "Lead workshops as mentor", basic: false, premium: "Lead CSR-driven STEM workshops in institute as Student Mentor" },
        { label: "Social impact certificate", basic: false, premium: "Certificate for social impact contributions" }
      ]
    },
    {
      title: "Collaboration & Business Development",
      icon: Users,
      highlights: [
        "Team formation for competitions",
        "Premium startup matchmaking",
        "Premium club / micro-startup launch support"
      ],
      image: { from: "#E2E8F0", to: "#F8FAFC" },
      rows: [
        { label: "Team formation forums", basic: "Access to team formation forums for competitions", premium: true },
        { label: "Priority matchmaking", basic: false, premium: "Priority matchmaking with startups & student founders" },
        { label: "Networking across innovators", basic: "Networking with student innovators across", premium: true },
        { label: "Launch support", basic: false, premium: "Support in launching campus robotics clubs or micro-startups" },
        { label: "Co-develop projects", basic: false, premium: "Opportunity to co-develop student-led robotics projects" }
      ]
    },
    {
      title: "Innovation & Research Opportunities",
      icon: ShieldCheck,
      highlights: [
        "Innovation challenges and hackathons",
        "Premium paper submission rights",
        "Premium Innovation Council opportunity"
      ],
      image: { from: "#DCFCE7", to: "#F0FDF4" },
      rows: [
        { label: "Challenges & hackathons", basic: "Access to innovation challenges and hackathons", premium: true },
        { label: "Paper submission rights", basic: false, premium: "Submission rights for student research papers" },
        { label: "Innovation council", basic: false, premium: "Opportunity to join WORSO Innovation Council" }
      ]
    },
    {
      title: "Networking & Global Exposure",
      icon: Globe,
      highlights: [
        "Global student groups and meet-ups",
        "Premium international knowledge base access",
        "Premium exchange camps & leadership meet invitations"
      ],
      image: { from: "#E0E7FF", to: "#EEF2FF" },
      rows: [
        { label: "Student community groups", basic: "Access to global student community groups", premium: true },
        { label: "International community + knowledge base", basic: false, premium: "Access to WORSO international community & knowledge base" },
        { label: "Virtual meet-ups", basic: "Participation in virtual meet-ups", premium: true },
        { label: "Leadership meet invite", basic: false, premium: "Invitation to WORSO Annual Student Leadership Meet" },
        { label: "Exchange camps priority", basic: false, premium: "Priority selection for International Exchange Camps" }
      ]
    },
    {
      title: "Certification & Skill Enhancement",
      icon: BadgeCheck,
      highlights: [
        "Discounts on robotics/AI/drone courses",
        "Premium early access to masterclasses",
        "Premium additional discounts"
      ],
      image: { from: "#F0FDF4", to: "#ECFDF5" },
      rows: [
        { label: "Partner course discounts", basic: "Discounts on robotics, AI, and drone courses by WORSO Partners", premium: true },
        { label: "Early access", basic: false, premium: "Early access to new courses and advanced Masterclasses Series" },
        { label: "Additional discounts", basic: false, premium: "Additional discounts on robotics, AI, and drone courses by WORSO Partners" }
      ]
    },
    {
      title: "Participation in Standards & Policy Forums",
      icon: ShieldCheck,
      highlights: [
        "Surveys and consultations access",
        "Premium youth policy participation",
        "Premium Student Advisory Board eligibility"
      ],
      image: { from: "#FEE2E2", to: "#FFF1F2" },
      rows: [
        { label: "Surveys & consultations", basic: "Access to student surveys & public consultations", premium: true },
        { label: "Youth policy discussions", basic: false, premium: "Opportunity to participate in WORSO youth policy discussions" },
        { label: "Policy webinars viewing rights", basic: "Viewing rights for policy webinars", premium: true },
        { label: "Advisory board eligibility", basic: false, premium: "Eligibility to join Student Advisory Board" }
      ]
    },
    {
      title: "Partnership Rights & Leadership Roles",
      icon: Users,
      highlights: [
        "Form local student chapters",
        "Leadership title eligibility",
        "Premium certified workshops under WORSO banner"
      ],
      image: { from: "#FFE4E6", to: "#FFF7ED" },
      rows: [
        { label: "Form local chapters", basic: "Eligibility to form local student chapters", premium: true },
        {
          label: "Leadership titles",
          basic: "Eligibility for leadership titles: Student Coordinator, WORSO Youth Representative",
          premium: true
        },
        { label: "Volunteer at events", basic: "Opportunity to volunteer at regional WORSO events", premium: true },
        { label: "Host certified workshops", basic: false, premium: "Opportunity to host certified workshops under the WORSO banner" }
      ]
    }
  ]
};

function Cell({ value, emphasize }) {
  if (value === true) {
    return (
      <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
        <Check className={`w-4 h-4 ${emphasize ? "text-blue-600" : "text-emerald-600"}`} />
        <span>Included</span>
      </div>
    );
  }
  if (!value) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Minus className="w-4 h-4" />
        <span>—</span>
      </div>
    );
  }
  return <div className="text-sm text-gray-800 leading-relaxed">{value}</div>;
}

function SectionHeader({ title, icon: Icon, premiumCount, totalCount }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
          {Icon ? <Icon className="w-5 h-5 text-blue-700" /> : null}
        </div>
        <div>
          <h4 className="text-lg font-semibold text-black leading-tight">{title}</h4>
          <p className="text-sm text-gray-600 mt-1">
            Premium includes {premiumCount}/{totalCount} items in this section
          </p>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-2 text-xs text-gray-600">
        <span className="px-2 py-1 rounded-full bg-gray-50 border border-gray-200">Basic</span>
        <span className="px-2 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-semibold">
          Premium
        </span>
      </div>
    </div>
  );
}

function normalizeText(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Curated Unsplash photo IDs (unsplash.com/photos/:id)
 * We intentionally map benefits to specific images so the UI is consistent
 * and doesn't change randomly on every refresh.
 */
function getUnsplashPhotoId({ sectionTitle, rowLabel }) {
  const s = normalizeText(sectionTitle);
  const r = normalizeText(rowLabel);
  const t = `${s} ${r}`;

  // Identity / certificate / badge
  if (t.includes("id card") || t.includes("photo id") || t.includes("membership id")) return "htQznS-Rx7w";
  if (t.includes("certificate") || t.includes("certification")) return "Oe8Q-mzNUT4";
  if (t.includes("badge") || t.includes("linkedin") || t.includes("cv")) return "gxAVTZgsxnw";
  if (t.includes("directory") || t.includes("listing") || t.includes("community")) return "QckxruozjRg";

  // Robotics / labs / tools
  if (t.includes("diy") || t.includes("kits") || t.includes("robotics project")) return "RIaCwearMQE";
  if (t.includes("simulation") || t.includes("ai") || t.includes("labs") || t.includes("advanced tools")) return "FaP7jIwgoE0";

  // Learning / webinars
  if (t.includes("webinar") || t.includes("workshops") || t.includes("workshop") || t.includes("masterclasses")) return "smgTvepind4";

  // Career / internship
  if (t.includes("internship") || t.includes("interviews") || t.includes("placement") || t.includes("resume")) return "eF7HN40WbAQ";

  // Events / conferences
  if (t.includes("conference") || t.includes("events") || t.includes("competitions") || t.includes("leagues")) return "bwki71ap-y8";

  // CSR / volunteering / mentoring
  if (t.includes("csr") || t.includes("volunteer") || t.includes("outreach") || t.includes("mentor") || t.includes("teaching")) return "zFKOZ2Udk6I";

  // Policy / advisory
  if (t.includes("policy") || t.includes("forums") || t.includes("advisory") || t.includes("consultations")) return "7okkFhxrxNw";

  // Leadership / chapters
  if (t.includes("leadership") || t.includes("chapters") || t.includes("coordinator") || t.includes("representative")) return "g1Kr4Ozfoac";

  // Fallback: something broadly education/career friendly
  return "cckf4TsHAuw";
}

function unsplashImageUrl(photoId, { w = 1200, q = 80 } = {}) {
  // Uses unsplash.com domain as requested; it redirects to the CDN.
  // Adding query params helps ensure consistent sizing/quality after redirect.
  return `https://unsplash.com/photos/${photoId}/download?force=true&w=${w}&q=${q}`;
}

function BenefitRowCard({ sectionTitle, icon: Icon, row, className = "", variant = "half" }) {
  const photoId = getUnsplashPhotoId({ sectionTitle, rowLabel: row.label });
  const imgSrc = unsplashImageUrl(photoId, { w: 1200, q: 80 });
  const imageHeightClass = variant === "full" ? "h-52 md:h-56" : "h-44";

  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white overflow-hidden hover:shadow-sm transition-shadow ${className}`}
    >
      <div className="relative">
        <img
          src={imgSrc}
          alt={`${row.label} benefit`}
          className={`w-full ${imageHeightClass} object-cover`}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute left-4 bottom-4 right-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-white/90 border border-white/70 flex items-center justify-center shadow-sm">
              {Icon ? <Icon className="w-4 h-4 text-blue-700" /> : null}
            </div>
            <div className="text-white font-semibold leading-tight drop-shadow">
              {row.label}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl border border-gray-200 p-3 bg-gray-50">
            <div className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide mb-2">
              Basic
            </div>
            <Cell value={row.basic} />
          </div>

          <div className="rounded-xl border border-blue-200 p-3 bg-blue-50/60">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="text-[11px] font-semibold text-blue-800 uppercase tracking-wide">
                Premium
              </div>
              {row.premium ? (
                <span className="text-[11px] font-semibold text-blue-800 px-2 py-1 rounded-full bg-white border border-blue-200">
                  Upgrade
                </span>
              ) : null}
            </div>
            <Cell value={row.premium} emphasize />
          </div>
        </div>
      </div>
    </div>
  );
}

export const StudentMembershipComparisonSection = ({ onSelectPlan }) => {
  const { header, sections } = STUDENT_MEMBERSHIP;
  const [basic, premium] = header.plans;

  return (
    <motion.section
      className="bg-white rounded-3xl shadow-[0_20px_60px_-30px_rgba(2,6,23,0.35)] border border-gray-200 overflow-hidden"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="relative p-8 md:p-10 border-b border-gray-200 bg-gradient-to-br from-slate-50 via-white to-blue-50/40">
        <div className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-sky-500/10 blur-3xl" />

        <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-7">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-200 bg-white/70 backdrop-blur">
              <Sparkles className="w-4 h-4 text-blue-700" />
              <span className="text-xs font-semibold text-blue-800">Basic vs Premium</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-black mt-4">{header.title}</h3>
            <p className="text-gray-700 mt-2">{header.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-[520px]">
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-black">{basic.name}</div>
                <span className="text-xs text-gray-600 px-2 py-1 rounded-full bg-gray-50 border border-gray-200">
                  Starter
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <div className="text-3xl font-extrabold text-black">{basic.price}</div>
                <div className="text-xs text-gray-600">{basic.period}</div>
              </div>
              {/* <div className="mt-4 text-sm text-gray-700">
                Great for students who want membership ID + listings and access to community benefits.
              </div> */}
            </div>

            <div className="rounded-2xl border border-blue-200 bg-gradient-to-b from-blue-50 to-white shadow-sm p-5 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-blue-600/15 blur-2xl" />
              <div className="relative flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-black">{premium.name}</div>
                <span className="text-xs font-semibold text-blue-800 px-2 py-1 rounded-full bg-white border border-blue-200">
                  Recommended
                </span>
              </div>
              <div className="relative flex items-baseline gap-2 mt-2">
                <div className="text-3xl font-extrabold text-black">{premium.price}</div>
                <div className="text-xs text-gray-700">{premium.period}</div>
              </div>
              {/* <div className="relative mt-4 text-sm text-gray-800">
                Best for global visibility, priority access, internships, and leadership opportunities.
              </div> */}
            </div>
          </div>
        </div>

        <div className="relative mt-7 rounded-2xl border border-gray-200 bg-white/70 backdrop-blur p-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-black">Select your plan</div>
              <div className="text-sm text-gray-600 mt-1">
                Continue to the membership form with your chosen student plan.
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  onSelectPlan?.({
                    categoryName: "student",
                    planName: "basic",
                    jumpToStep: 2,
                    scrollTo: "personal-contact-info",
                  })
                }
                className="px-6 py-3 rounded-xl border border-gray-300 bg-white hover:border-gray-400 text-black font-semibold inline-flex items-center justify-center gap-2 transition-all"
              >
                Choose {basic.name}
                <ChevronRight className="w-4 h-4" />
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  onSelectPlan?.({
                    categoryName: "student",
                    planName: "premium",
                    jumpToStep: 2,
                    scrollTo: "personal-contact-info",
                  })
                }
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold inline-flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                Choose {premium.name}
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {sections.map((section) => {
          const totalCount = section.rows.length;
          const premiumCount = section.rows.reduce((acc, r) => acc + (r.premium ? 1 : 0), 0);
          const Icon = section.icon;

          return (
            <div key={section.title} className="p-6 md:p-8">
              <SectionHeader
                title={section.title}
                icon={Icon}
                premiumCount={premiumCount}
                totalCount={totalCount}
              />

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 auto-rows-fr">
                {section.rows.map((row, idx) => {
                  // Mixed layout: every 4th card becomes a "full" highlight card.
                  // On xl: span 2 columns for a premium masonry feel.
                  // On md: still span 2 columns (full width) for readability.
                  const isFull = idx % 4 === 0;
                  const spanClass = isFull ? "md:col-span-2 xl:col-span-2" : "";
                  const variant = isFull ? "full" : "half";

                  return (
                  <BenefitRowCard
                    key={row.label}
                    sectionTitle={section.title}
                    icon={Icon}
                    row={row}
                    variant={variant}
                    className={spanClass}
                  />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
};

