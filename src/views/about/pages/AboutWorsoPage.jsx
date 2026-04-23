import {
  Globe2,
  GraduationCap,
  Layers,
  Rocket,
  Shield,
  Target,
  Users,
  Trophy,
  Sparkles,
  Heart,
  Leaf,
  Award,
  Flag,
  BookOpen,
  Handshake,
} from "lucide-react";
import { ADVISORY_BOARD } from "../../../data/aboutPeople";
import AdvisoryBoardGrid from "../../../components/about/AdvisoryBoardGrid";

const AboutWorsoPage = () => (
  <div className="space-y-10">
    {/* Hero Section */}
    <div className="container mx-auto px-4 py-4">
      <div className="bg-[#0f172a] rounded-3xl text-white p-12 md:p-14 shadow-2xl relative overflow-hidden">
        <div className="text-yellow-400 font-bold tracking-widest text-xs uppercase mb-4">
          About IFES
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
          The International Federation of Esports
        </h1>
        <p className="text-slate-200 text-lg max-w-3xl">
          Championing the Future of Global Esports
        </p>
      </div>
    </div>

    {/* Introduction Paragraph - Full original content */}
    <div className="container mx-auto px-4">
      <p className="text-lg text-slate-600 leading-relaxed">
        The International Federation of Esports is a global federation dedicated
        to building a structured, inclusive, and internationally connected esports
        ecosystem. As competitive gaming continues to evolve from a niche activity
        into a global industry, IFES stands at the forefront—driving governance,
        collaboration, and innovation across borders. Established with a vision to
        unify the esports landscape, IFES brings together players, teams,
        federations, publishers, brands, and policymakers under one global
        platform, enabling growth, recognition, and sustainability in the esports
        ecosystem.
      </p>
    </div>

    {/* Mission Section - Updated with complete mission points */}
    <div className="container mx-auto px-4 space-y-4 pt-4 border-t border-slate-100">
      <div className="flex items-center gap-3">
        <Target className="text-blue-600" />
        <h2 className="text-2xl font-bold text-slate-900">
          Our Mission: Unifying the Global Esports Ecosystem
        </h2>
      </div>
      <p className="text-slate-600 leading-relaxed">
        IFES is committed to shaping the future of esports through a comprehensive and collaborative approach. Our mission is to:
      </p>
      <ul className="list-disc list-inside space-y-2 text-slate-600 pl-2">
        <li>Promote and develop esports across regions and communities</li>
        <li>Establish fair play standards and governance frameworks</li>
        <li>Organize and sanction international esports competitions</li>
        <li>Support the formation and growth of national federations</li>
        <li>Advocate for esports as a recognized and respected sport globally</li>
      </ul>
    </div>

    {/* Global Impact & Network Section - Updated */}
    <div className="container mx-auto px-4 space-y-4 pt-4 border-t border-slate-100">
      <div className="flex items-center gap-3">
        <Globe2 className="text-blue-600" />
        <h2 className="text-2xl font-bold text-slate-900">
          Global Impact &amp; Network
        </h2>
      </div>
      <p className="text-slate-600 leading-relaxed">
        Through its expanding international presence, IFES is building a federated network of esports stakeholders worldwide. This ecosystem fosters collaboration, knowledge sharing, and structured growth at both grassroots and professional levels.
      </p>
      <p className="text-slate-600 leading-relaxed">
        By connecting diverse regions and communities, IFES enables:
      </p>
      <ul className="list-disc list-inside space-y-2 text-slate-600 pl-2">
        <li>Cross-border competitions and talent exchange</li>
        <li>Standardized frameworks for tournaments and leagues</li>
        <li>Global exposure for emerging esports talent</li>
        <li>Stronger alignment between industry, education, and governance</li>
      </ul>
    </div>

    {/* Holistic Approach Section - Updated with all 4 pillars */}
    <div className="container mx-auto px-4 space-y-4 pt-4 border-t border-slate-100">
      <div className="flex items-center gap-3">
        <Layers className="text-blue-600" />
        <h2 className="text-2xl font-bold text-slate-900">
          Beyond Tournaments: IFES's Holistic Approach
        </h2>
      </div>
      <p className="text-slate-600 leading-relaxed">
        IFES's commitment extends beyond organizing tournaments. The organization actively works on several fronts:
      </p>
      <p className="text-slate-600 leading-relaxed font-semibold mt-2">
        A Holistic Approach to Esports Development
      </p>
      <p className="text-slate-600 leading-relaxed">
        Beyond competitions, IFES focuses on building a sustainable and future-ready ecosystem through multiple strategic pillars:
      </p>
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 text-blue-600 font-bold mb-2">
            <GraduationCap size={18} /> Education &amp; Training
          </div>
          <p className="text-sm text-slate-600">
            Developing structured programs for players, coaches, referees, and administrators to build professional pathways within esports.
          </p>
        </div>
        <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 text-blue-600 font-bold mb-2">
            <Shield size={18} /> Governance &amp; Integrity
          </div>
          <p className="text-sm text-slate-600">
            Implementing policies for fair play, ethical conduct, and transparent operations to maintain the credibility of esports competitions.
          </p>
        </div>
        <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 text-blue-600 font-bold mb-2">
            <Heart size={18} /> Inclusivity &amp; Diversity
          </div>
          <p className="text-sm text-slate-600">
            Promoting equal opportunities and encouraging participation across genders, regions, and communities worldwide.
          </p>
        </div>
        <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 text-blue-600 font-bold mb-2">
            <Leaf size={18} /> Sustainability &amp; Responsibility
          </div>
          <p className="text-sm text-slate-600">
            Encouraging environmentally and socially responsible practices within esports events and operations.
          </p>
        </div>
      </div>
    </div>

    {/* e-World Section - NEW and FULLY ADDED as requested */}
    <div className="container mx-auto px-4 space-y-4 pt-4 border-t border-slate-100">
      <div className="flex items-center gap-3">
        <Trophy className="text-blue-600" />
        <h2 className="text-2xl font-bold text-slate-900">
          e-World: The Digital Arena for Global Competition
        </h2>
      </div>
      <p className="text-slate-600 leading-relaxed">
        <span className="font-bold text-blue-700">e-World</span> is IFES's flagship digital ecosystem—a revolutionary platform that connects players, teams, and fans across continents. Designed as the ultimate virtual arena, e-World hosts international qualifiers, regional championships, and the prestigious IFES World Finals.
      </p>
      <div className="grid md:grid-cols-3 gap-4 mt-4">
        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <Flag className="text-blue-600 mb-2" size={24} />
          <h3 className="font-bold text-slate-800">Global Qualifiers</h3>
          <p className="text-sm text-slate-600">Open brackets for emerging talent from over 50 member nations.</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <Award className="text-blue-600 mb-2" size={24} />
          <h3 className="font-bold text-slate-800">Ranked Ladder System</h3>
          <p className="text-sm text-slate-600">Fair matchmaking and transparent ELO-based leaderboards.</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <Users className="text-blue-600 mb-2" size={24} />
          <h3 className="font-bold text-slate-800">Community Hub</h3>
          <p className="text-sm text-slate-600">Forums, coaching zones, and scout discovery for pro teams.</p>
        </div>
      </div>
      <p className="text-slate-600 leading-relaxed mt-2">
        Through <span className="font-semibold">e-World</span>, IFES delivers structured competition frameworks, real-time anti-cheat integrity, and a spectator-friendly experience that elevates esports to mainstream recognition. The platform also supports national federations in hosting their domestic leagues under unified governance.
      </p>
    </div>

    {/* Future Section - Updated with complete vision points */}
    <div className="container mx-auto px-4 space-y-4 pt-4 border-t border-slate-100">
      <div className="flex items-center gap-3">
        <Rocket className="text-blue-600" />
        <h2 className="text-2xl font-bold text-slate-900">
          The Future of Esports: IFES Leading the Way
        </h2>
      </div>
      <p className="text-slate-600 leading-relaxed">
        IFES is guided by a distinguished Advisory Board of global leaders and industry experts, bringing strategic direction, governance insights, and international perspectives to the organization. Their collective expertise ensures that IFES continues to evolve as a credible, forward-looking, and globally aligned federation.
      </p>
      <p className="text-slate-600 leading-relaxed">
        As the global esports industry continues to expand rapidly, IFES is committed to:
      </p>
      <ul className="list-disc list-inside space-y-2 text-slate-600 pl-2">
        <li>Creating structured international competition frameworks</li>
        <li>Strengthening national and regional esports ecosystems</li>
        <li>Enabling global partnerships and collaborations</li>
        <li>Empowering the next generation of esports professionals</li>
      </ul>
      <p className="text-slate-600 leading-relaxed italic mt-2">
        We envision a future where esports is not only recognized as a sport but also serves as a powerful platform for innovation, career development, and global connection.
      </p>
    </div>

    {/* Advisory Board Section */}
    <div className="container mx-auto px-4 pt-6 border-t border-slate-100">
      <AdvisoryBoardGrid members={ADVISORY_BOARD} />
    </div>

    {/* Join the Movement / CTA Section */}
    <div className="container mx-auto px-4 pt-6 pb-10">
      <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-2xl p-8 border border-blue-100">
        <div className="flex items-center gap-3 mb-4">
          <Handshake className="text-blue-600" size={28} />
          <h2 className="text-2xl font-bold text-slate-900">Join the Movement!</h2>
        </div>
        <p className="text-slate-600 leading-relaxed mb-4">
          Whether you're a passionate gamer, a dedicated esports fan, or simply curious about the future of competitive gaming, IFES invites you to join the movement. Visit the IFES website to learn more about its initiatives, upcoming events, and how you can get involved in shaping the future of esports.
        </p>
        <p className="text-slate-600 leading-relaxed mb-4">
          Together, we can make esports a force for good in the world, connecting communities, promoting fair play, and inspiring the next generation of champions.
        </p>
        <div className="flex items-center gap-2">
          <Sparkles className="text-yellow-500" size={20} />
          <p className="text-lg font-bold text-blue-600">Let the games begin!</p>
        </div>
      </div>
    </div>
  </div>
);

export default AboutWorsoPage;