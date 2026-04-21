import { motion } from "framer-motion";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Check,
  Globe,
  GraduationCap,
  HandHeart,
  Lightbulb,
  Network,
  Scale,
  ShieldCheck,
  Users,
} from "lucide-react";

const ORG_MEMBERSHIPS = {
  header: {
    title: "IFeS Membership",
    subtitle:
      "Compare Institute, Professional, and Corporate memberships across visibility, infrastructure, events, talent access, and global collaboration.",
    tiers: [
      {
        id: "institute",
        name: "Institute Membership",
        fee: "USD 200",
        period: "Annual Membership Fee",
        whoFor: "Schools/Colleges/Universities/Vocational Institutes",
        icon: GraduationCap,
        theme: {
          badge: "bg-emerald-50 text-emerald-800 border-emerald-100",
          card: "border-emerald-200 bg-gradient-to-b from-emerald-50 to-white",
          button: "bg-emerald-600 hover:bg-emerald-700 text-white",
        },
      },
      {
        id: "professional",
        name: "Professional Membership",
        fee: "USD 100",
        period: "Annual Membership Fee",
        whoFor: "Coaches/Trainers/Innovators/High Value Partners",
        icon: BriefcaseBusiness,
        theme: {
          badge: "bg-blue-50 text-blue-800 border-blue-100",
          card: "border-blue-200 bg-gradient-to-b from-blue-50 to-white",
          button: "bg-blue-600 hover:bg-blue-700 text-white",
        },
      },
      {
        id: "corporate",
        name: "Corporate Membership",
        fee: "USD 500",
        period: "Annual Membership Fee",
        whoFor: "Companies/NGO/Startups",
        icon: Building2,
        theme: {
          badge: "bg-violet-50 text-violet-800 border-violet-100",
          card: "border-violet-200 bg-gradient-to-b from-violet-50 to-white",
          button: "bg-violet-600 hover:bg-violet-700 text-white",
        },
      },
    ],
  },
  sections: [
    {
      title: "Brand Visibility & Global Recognition",
      icon: Globe,
      rows: [
        {
          label: "Official badge for credibility",
          institute: "Official IFeS Institutional Member Badge for branding & promotions",
          professional: "IFeS Certified Professional Member badge",
          corporate: "Official IFeS Corporate Member Badge for brand credibility",
        },
        {
          label: "Global directory listing",
          institute: "Global listing in the IFeS Certified Experts Directory",
          professional: "Listing on IFeS Global Directory as an officially recognized partner",
          corporate: "Recognition on the global IFeS website & partner directories",
        },
        {
          label: "Brand exposure via media",
          institute: false,
          professional: "Use of IFeS branding for personal workshops & training programs",
          corporate: "Brand exposure across IFeS social media, newsletters & press releases*",
        },
      ],
    },
    {
      title: "Establishment of Robotics & STEM Infrastructure",
      icon: ShieldCheck,
      rows: [
        {
          label: "Labs, clubs, and centers set-up",
          institute: "Support to set up Robotics Labs, STEM Labs & AI Labs and RoboClubs",
          professional:
            "Authorized Trainer status for operating IFeS-certified training centers",
          corporate: "Priority selection to set up Robotics Clubs, Training Labs & STEM Centers",
        },
        {
          label: "Training & competition center eligibility",
          institute:
            "Eligibility to become a IFeS Authorized Training & Competition Center",
          professional:
            "Priority access to implement Robotics Labs, STEM Labs & AI Innovation Centers",
          corporate:
            "Ability to co-establish IFeS-branded Maker Spaces in institutions",
        },
      ],
    },
    {
      title: "Career Growth, Access to Talent Pipeline & Hiring",
      icon: Users,
      rows: [
        {
          label: "Mentors, trainers & leaders network",
          institute: "Access to a global network of mentors, trainers & industry leaders",
          professional:
            "Visibility among schools/colleges seeking robotics coaches & mentors",
          corporate:
            "Priority access to top student innovators from Technoxian & IFeS leagues",
        },
        {
          label: "Talent drives & campus outreach",
          institute: false,
          professional: "Opportunity to build high-performing robotics teams and portfolios",
          corporate:
            "Participation in IFeS talent drives & internship fairs; campus outreach programs coordinated by IFeS",
        },
        {
          label: "Mentoring & placement support",
          institute:
            "Opportunities for scholarships, international contests & innovation grants",
          professional:
            "Opportunity to mentor student teams in national/international competitions",
          corporate:
            "Internship and placement support through robotics & AI institutions",
        },
      ],
    },
    {
      title: "Access to Major National & International Events",
      icon: Network,
      rows: [
        {
          label: "Championship access",
          institute:
            "Access to IFeS Championships including Technoxian (entries via RoboClub)",
          professional: "Priority access to IFeS and Partner events",
          corporate:
            "Priority invitations to: Technoxian World Cup, other national/international tournaments",
        },
        {
          label: "Hosting, speaking, and booths",
          institute: "Hosting opportunities (District Championships/Bootcamps/Events)",
          professional:
            "Invitations for speaker slots, panel discussions & jury roles",
          corporate:
            "Discounted exhibition booths and sponsorship packages; discounts on event registrations, booths & travel packages",
        },
        {
          label: "Passes, demos, showcases",
          institute: false,
          professional:
            "Discounted or free passes to events, conferences & masterclasses",
          corporate:
            "Opportunity to conduct live product demos and technology showcases",
        },
      ],
    },
    {
      title: "CSR & Social Impact Opportunities",
      icon: HandHeart,
      rows: [
        {
          label: "CSR programs and labs",
          institute:
            "Collaboration opportunities with CSR partners for student outreach",
          professional:
            "Paid or volunteer opportunities to lead CSR STEM programs in schools",
          corporate:
            "Ready-to-deploy STEM Labs, robotics clubs & training programs for CSR",
        },
        {
          label: "CSR expert-led sessions",
          institute: false,
          professional:
            "Opportunity to run CSR-funded STEM sessions led by IFeS experts",
          corporate:
            "Priority involvement in government & NGO-backed training initiatives for underprivileged students & innovation teams",
        },
      ],
    },
    {
      title: "Collaboration & Business Development",
      icon: BriefcaseBusiness,
      rows: [
        {
          label: "Industry partnerships and adoption",
          institute:
            "Industry partnerships for innovation, research & technology adoption",
          professional:
            "Access to high-quality network of institutions & startups",
          corporate:
            "Opportunity to co-create robotics competitions or STEM programs",
        },
        {
          label: "Training, procurement, and R&D linkage",
          institute:
            "Business linkage support for robotics procurement, training & facility set-up",
          professional:
            "Opportunity to become IFeS Certified Trainer",
          corporate:
            "Opportunity to partner on innovation labs, training centers, and R&D projects",
        },
        {
          label: "Learning platform and B2B matchmaking",
          institute: false,
          professional:
            "Ability to create and publish modules in the IFeS Learning Platform",
          corporate:
            "B2B matchmaking with robotics manufacturers, trainers & solution providers",
        },
      ],
    },
    {
      title: "Innovation & Research Opportunities",
      icon: Lightbulb,
      rows: [
        {
          label: "Research collaborations",
          institute:
            "Collaboration opportunities with industry, research labs, and universities",
          professional:
            "Eligibility to register projects under IFeS Innovation Network",
          corporate:
            "Joint R&D programs with universities and labs",
        },
        {
          label: "Showcasing and whitepapers",
          institute:
            "Opportunities for funding/discount on showcasing institutional innovations",
          professional:
            "Access to industry connections & technology hubs",
          corporate:
            "Opportunity to submit whitepapers or research with IFeS Innovation Council",
        },
      ],
    },
    {
      title: "Networking & Global Exposure",
      icon: Globe,
      rows: [
        {
          label: "Global forums and leadership access",
          institute:
            "Invitations to global panel discussions, seminars & B2B meets",
          professional:
            "Connect with global community of robotics coaches and innovators",
          corporate:
            "Exclusive access to global forums with leaders in AI, robotics & education",
        },
        {
          label: "International collaborations",
          institute:
            "Participation in international collaboration programs & exchange visits",
          professional:
            "Opportunity to connect with global robotics sports federations & teams",
          corporate:
            "International meetings, delegations & trade missions; collaborations with startups, institutions & corporates",
        },
        {
          label: "Policymaker + industry networking",
          institute: false,
          professional: false,
          corporate:
            "Networking with policymakers, industry heads & academic experts",
        },
      ],
    },
    {
      title: "Certification & Skill Enhancement",
      icon: ShieldCheck,
      rows: [
        {
          label: "Certification discounts",
          institute:
            "Student & faculty discounts on IFeS and Partner certifications",
          professional:
            "Discounted certification programs by IFeS and its Partners",
          corporate:
            "Corporate discounts on IFeS and Partner training & certification programs",
        },
        {
          label: "Year-round training and modules",
          institute:
            "Access to structured modules for curricular or extracurricular integration",
          professional:
            "Year-round training in robotics, drones, AI, IoT & rapid prototyping",
          corporate:
            "Priority access to advanced masterclasses & executive-level workshops",
        },
        {
          label: "Exclusive resources",
          institute: false,
          professional:
            "Free access to selected webinars and career sessions",
          corporate:
            "Access to exclusive resources (knowledge hubs, research papers & global case studies)",
        },
      ],
    },
    {
      title: "Participation in Standards & Policy Forums",
      icon: Scale,
      rows: [
        {
          label: "STEM policy roundtables",
          institute:
            "Participation in STEM education policy roundtables & discussions",
          professional:
            "Chance to contribute to framework development for Robotics Sports globally",
          corporate:
            "Access to IFeS policy discussions related to robotics sports/industry standards",
        },
        {
          label: "Boards and governance participation",
          institute:
            "Opportunity to join IFeS’s Academic Advisory Board",
          professional:
            "Chance to contribute to framework development for Robotics Sports globally",
          corporate: false,
        },
      ],
    },
    {
      title: "Partnership Rights & Leadership Roles",
      icon: ArrowRight,
      rows: [
        {
          label: "Regional partnership eligibility",
          institute:
            "Eligibility to become a District/State IFeS Partner Institution",
          professional:
            "Eligibility to become District/State IFeS Partner",
          corporate:
            "Eligibility to become: IFeS Technology Partner / Event Partner / Regional Partner",
        },
        {
          label: "Hosting rights",
          institute:
            "Rights to host district/state-level robotics competitions",
          professional:
            "Recognition as IFeS Ambassador for your region",
          corporate:
            "Opportunity to host state/district robotics leagues",
        },
      ],
    },
  ],
};

function ValueCell({ value }) {
  if (value === true) {
    return (
      <div className="inline-flex items-center gap-2 text-sm font-medium text-gray-800">
        <Check className="w-4 h-4 text-emerald-600" />
        <span>Included</span>
      </div>
    );
  }
  if (!value) {
    return <span className="text-sm text-gray-400">—</span>;
  }
  return <div className="text-sm text-gray-800 leading-relaxed">{value}</div>;
}

function asBullets(value) {
  if (value === true) return ["Included"];
  if (!value) return [];
  return [String(value)];
}

const TIER_KEY_TO_TITLE = {
  institute: "Institute Membership",
  professional: "Professional Membership",
  corporate: "Corporate Membership",
};

export const WorsoOrgMembershipTierSection = ({ tierId = "professional", onJoin }) => {
  const { header, sections } = ORG_MEMBERSHIPS;
  const tier = header.tiers.find((t) => t.id === tierId) || header.tiers[1];
  const Icon = tier.icon;

  const filteredSections = sections
    .map((s) => {
      const rows = s.rows
        .map((r) => ({ label: r.label, value: r?.[tier.id] }))
        .filter((r) => Boolean(r.value));
      return { ...s, rows };
    })
    .filter((s) => s.rows.length > 0);

  return (
    <motion.section
      className="bg-white rounded-3xl shadow-[0_20px_60px_-30px_rgba(2,6,23,0.35)] border border-gray-200 overflow-hidden"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className={`relative p-8 md:p-10 border-b border-gray-200 ${tier.theme.card}`}>
        <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-7">
          <div className="max-w-2xl">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${tier.theme.badge}`}
            >
              {Icon ? <Icon className="w-4 h-4" /> : null}
              <span>{TIER_KEY_TO_TITLE[tier.id] || tier.name}</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-black mt-4">{tier.name}</h3>
            <p className="text-gray-700 mt-2">{tier.whoFor}</p>
          </div>

          <div className="w-full lg:w-[420px]">
            <div className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur shadow-sm p-5">
              <div className="text-xs text-gray-600 font-semibold uppercase tracking-wide">
                Annual Membership Fee
              </div>
              <div className="mt-2 text-4xl font-extrabold text-black">{tier.fee}</div>
              <div className="mt-4 text-sm text-gray-700">
                <span className="font-semibold text-black">Who it’s for:</span> {tier.whoFor}
              </div>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onJoin?.(tier.id)}
                className={`mt-5 w-full py-3 rounded-xl font-semibold inline-flex items-center justify-center gap-2 transition-all ${tier.theme.button}`}
              >
                Join now
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        {filteredSections.map((section) => {
          const SectionIcon = section.icon;
          return (
            <div key={section.title} className="rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 bg-gray-50 border-b border-gray-200 flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center">
                  {SectionIcon ? <SectionIcon className="w-4 h-4 text-gray-800" /> : null}
                </span>
                <div className="text-sm font-bold text-black">{section.title}</div>
              </div>

              <div className="p-5">
                <ul className="space-y-3">
                  {section.rows.flatMap((row) =>
                    asBullets(row.value).map((b, idx) => (
                      <li key={`${row.label}-${idx}`} className="flex gap-3">
                        <span className="mt-0.5">
                          <Check className="w-4 h-4 text-emerald-600" />
                        </span>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{row.label}</div>
                          <div className="text-sm text-gray-700 mt-1">{b}</div>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          );
        })}

        <div className="text-xs text-gray-500 flex items-start gap-2">
          <span className="mt-0.5">
            <Users className="w-4 h-4" />
          </span>
          <span>
            Note: Items marked with * in the source spec may depend on IFeS’s publishing schedule and partner programs.
          </span>
        </div>
      </div>
    </motion.section>
  );
};

function TierCard({ tier, onSelect }) {
  const Icon = tier.icon;
  return (
    <div className={`rounded-2xl border shadow-sm p-5 relative overflow-hidden ${tier.theme.card}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${tier.theme.badge}`}>
            {Icon ? <Icon className="w-4 h-4" /> : null}
            <span className="truncate">{tier.name}</span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-black">{tier.fee}</div>
            <div className="text-xs text-gray-600 mt-1">{tier.period}</div>
          </div>
          <div className="mt-4 text-sm text-gray-700">
            <span className="font-semibold text-black">Who it’s for:</span> {tier.whoFor}
          </div>
        </div>
      </div>

      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelect?.(tier.id)}
        className={`mt-5 w-full py-3 rounded-xl font-semibold inline-flex items-center justify-center gap-2 transition-all ${tier.theme.button}`}
      >
        Join as {tier.name.replace(" Membership", "")}
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </div>
  );
}

export const WorsoOrgMembershipComparisonSection = ({ onSelectTier }) => {
  const { header, sections } = ORG_MEMBERSHIPS;
  const [institute, professional, corporate] = header.tiers;

  const tierCols = [
    { key: "institute", tier: institute },
    { key: "professional", tier: professional },
    { key: "corporate", tier: corporate },
  ];

  return (
    <motion.section
      className="bg-white rounded-3xl shadow-[0_20px_60px_-30px_rgba(2,6,23,0.35)] border border-gray-200 overflow-hidden"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="relative p-8 md:p-10 border-b border-gray-200 bg-gradient-to-br from-slate-50 via-white to-indigo-50/40">
        <div className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-sky-500/10 blur-3xl" />

        <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-7">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-white/70 backdrop-blur">
              <ShieldCheck className="w-4 h-4 text-indigo-700" />
              <span className="text-xs font-semibold text-gray-800">Institute • Professional • Corporate</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-black mt-4">{header.title}</h3>
            <p className="text-gray-700 mt-2">{header.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-[820px]">
            {header.tiers.map((tier) => (
              <TierCard key={tier.id} tier={tier} onSelect={onSelectTier} />
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="text-left text-xs font-semibold uppercase tracking-wide text-gray-600 py-3 px-4 border-b border-gray-200 bg-white sticky left-0 z-10">
                  Benefit
                </th>
                {tierCols.map(({ tier }) => {
                  const Icon = tier.icon;
                  return (
                    <th
                      key={tier.id}
                      className="text-left text-xs font-semibold uppercase tracking-wide text-gray-600 py-3 px-4 border-b border-gray-200 bg-white"
                    >
                      <div className="flex items-center gap-2">
                        {Icon ? <Icon className="w-4 h-4 text-gray-700" /> : null}
                        <span>{tier.name.replace(" Membership", "")}</span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <motion.fragment
                    key={section.title}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-80px" }}
                  >
                    <tr>
                      <td
                        colSpan={4}
                        className="pt-6 pb-3 px-4 text-sm font-bold text-black"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                            {Icon ? <Icon className="w-4 h-4 text-indigo-700" /> : null}
                          </span>
                          <span>{section.title}</span>
                        </div>
                      </td>
                    </tr>

                    {section.rows.map((row) => (
                      <tr key={`${section.title}-${row.label}`} className="align-top">
                        <td className="py-4 px-4 border-b border-gray-200 bg-white sticky left-0 z-10">
                          <div className="text-sm font-semibold text-gray-900">{row.label}</div>
                        </td>
                        <td className="py-4 px-4 border-b border-gray-200">
                          <ValueCell value={row.institute} />
                        </td>
                        <td className="py-4 px-4 border-b border-gray-200">
                          <ValueCell value={row.professional} />
                        </td>
                        <td className="py-4 px-4 border-b border-gray-200">
                          <ValueCell value={row.corporate} />
                        </td>
                      </tr>
                    ))}
                  </motion.fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-xs text-gray-500 flex items-start gap-2">
          <span className="mt-0.5">
            <Users className="w-4 h-4" />
          </span>
          <span>
            Note: Items marked with * in the source spec may depend on IFeS’s publishing schedule and partner programs.
          </span>
        </div>
      </div>
    </motion.section>
  );
};

