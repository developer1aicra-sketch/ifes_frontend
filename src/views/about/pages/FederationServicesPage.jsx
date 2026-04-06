import { BarChart, Code, Globe2, GraduationCap, Megaphone, Trophy } from 'lucide-react';

const FederationServicesPage = () => (
  <div className="space-y-8">
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Globe2 className="text-blue-600" />
        <h2 className="text-3xl font-bold text-slate-900">Federation Services</h2>
      </div>
      <p className="text-lg text-slate-600 leading-relaxed">
        The World Robotics Sports Organization (WORSO) plays a multifaceted role in fostering the growth and development of esports on a global scale. Here&apos;s a breakdown of potential services the IFES could offer to its members.
      </p>
    </div>

    <div className="space-y-12">
      <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border border-blue-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Code className="text-blue-600" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Development and Standardization</h3>
            <p className="text-slate-600 mt-2">Establishing global standards and ethical frameworks</p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-3">Competitive Guidelines</h4>
            <p className="text-sm text-slate-600">Establish standardized rules and regulations for different esports genres, ensuring fair play and consistency across tournaments.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-3">Discipline Development</h4>
            <p className="text-sm text-slate-600">Define and recognize new esports disciplines, potentially in collaboration with game developers and publishers.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-3">Ethical Conduct</h4>
            <p className="text-sm text-slate-600">Implement and enforce anti-doping rules, anti-cheating measures, and ethical guidelines for players, teams, and organizers.</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-8 border border-emerald-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-emerald-100 p-3 rounded-lg">
            <GraduationCap className="text-emerald-600" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Education and Support</h3>
            <p className="text-slate-600 mt-2">Empowering the esports community through education</p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-3">Educational Programs</h4>
            <p className="text-sm text-slate-600">Create educational programs and resources for players, coaches, administrators, and the general public to raise awareness and understanding of esports.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-3">Professional Training</h4>
            <p className="text-sm text-slate-600">Offer training and certification programs for esports professionals, such as referees, coaches, and event organizers.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-3">Grassroots Support</h4>
            <p className="text-sm text-slate-600">Support and empower local and regional esports organizations through funding, knowledge sharing, and networking opportunities.</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-8 border border-purple-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-100 p-3 rounded-lg">
            <Megaphone className="text-purple-600" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Advocacy and Representation</h3>
            <p className="text-slate-600 mt-2">Championing esports on the global stage</p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-3">Government Recognition</h4>
            <p className="text-sm text-slate-600">Advocate for the recognition of esports as a legitimate sport by governments and international sports organizations.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-3">Stakeholder Collaboration</h4>
            <p className="text-sm text-slate-600">Partner with game developers, publishers, technology companies, and other stakeholders to improve the esports ecosystem.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-3">Social Impact</h4>
            <p className="text-sm text-slate-600">Highlight the positive benefits of esports, such as its potential to promote inclusivity, diversity, and development.</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl p-8 border border-amber-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-amber-100 p-3 rounded-lg">
            <Trophy className="text-amber-600" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Competition and Events</h3>
            <p className="text-slate-600 mt-2">Organizing and supporting world-class esports competitions</p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-3">International Championships</h4>
            <p className="text-sm text-slate-600">Host major international esports tournaments and events, potentially including regional qualifiers and culminating in a global championship.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-3">Tournament Support</h4>
            <p className="text-sm text-slate-600">Partner and support existing major esports tournaments and leagues to ensure alignment with international standards and regulations.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-3">Sustainable Development</h4>
            <p className="text-sm text-slate-600">Encourage game developers and publishers to implement practices that promote the long-term health and sustainability of esports ecosystems.</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-cyan-50 to-white rounded-2xl p-8 border border-cyan-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-cyan-100 p-3 rounded-lg">
            <BarChart className="text-cyan-600" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Research and Development</h3>
            <p className="text-slate-600 mt-2">Advancing the esports industry through innovation</p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-3">Industry Research</h4>
            <p className="text-sm text-slate-600">Invest in research on the economic, social, and cultural impact of esports to inform future development strategies.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-3">Technology Innovation</h4>
            <p className="text-sm text-slate-600">Explore and develop new technologies and tools that can benefit the esports industry, such as anti-doping measures, spectator engagement platforms, and training tools.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-3">Knowledge Sharing</h4>
            <p className="text-sm text-slate-600">Facilitate knowledge sharing and the exchange of best practices within the esports community through conferences, workshops, and online resources.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default FederationServicesPage;
