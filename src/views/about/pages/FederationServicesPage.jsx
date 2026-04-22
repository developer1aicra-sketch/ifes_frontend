// import { BarChart, Code, Globe2, GraduationCap, Megaphone, Trophy } from 'lucide-react';

// const FederationServicesPage = () => (
//   <div className="space-y-8">
//     <div className="space-y-4">
//       <div className="flex items-center gap-3">
//         <Globe2 className="text-blue-600" />
//         <h2 className="text-3xl font-bold text-slate-900">Federation Services</h2>
//       </div>
//       <p className="text-lg text-slate-600 leading-relaxed">
//         The World Robotics Sports Organization (IFeS) plays a multifaceted role in fostering the growth and development of esports on a global scale. Here&apos;s a breakdown of potential services the IFES could offer to its members.
//       </p>
//     </div>

//     <div className="space-y-12">
//       <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border border-blue-100">
//         <div className="flex items-center gap-3 mb-6">
//           <div className="bg-blue-100 p-3 rounded-lg">
//             <Code className="text-blue-600" size={24} />
//           </div>
//           <div>
//             <h3 className="text-2xl font-bold text-slate-900">Development and Standardization</h3>
//             <p className="text-slate-600 mt-2">Establishing global standards and ethical frameworks</p>
//           </div>
//         </div>
//         <div className="grid md:grid-cols-3 gap-6">
//           <div className="bg-white p-6 rounded-xl border border-slate-200">
//             <h4 className="font-bold text-slate-900 mb-3">Competitive Guidelines</h4>
//             <p className="text-sm text-slate-600">Establish standardized rules and regulations for different esports genres, ensuring fair play and consistency across tournaments.</p>
//           </div>
//           <div className="bg-white p-6 rounded-xl border border-slate-200">
//             <h4 className="font-bold text-slate-900 mb-3">Discipline Development</h4>
//             <p className="text-sm text-slate-600">Define and recognize new esports disciplines, potentially in collaboration with game developers and publishers.</p>
//           </div>
//           <div className="bg-white p-6 rounded-xl border border-slate-200">
//             <h4 className="font-bold text-slate-900 mb-3">Ethical Conduct</h4>
//             <p className="text-sm text-slate-600">Implement and enforce anti-doping rules, anti-cheating measures, and ethical guidelines for players, teams, and organizers.</p>
//           </div>
//         </div>
//       </div>

//       <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-8 border border-emerald-100">
//         <div className="flex items-center gap-3 mb-6">
//           <div className="bg-emerald-100 p-3 rounded-lg">
//             <GraduationCap className="text-emerald-600" size={24} />
//           </div>
//           <div>
//             <h3 className="text-2xl font-bold text-slate-900">Education and Support</h3>
//             <p className="text-slate-600 mt-2">Empowering the esports community through education</p>
//           </div>
//         </div>
//         <div className="grid md:grid-cols-3 gap-6">
//           <div className="bg-white p-6 rounded-xl border border-slate-200">
//             <h4 className="font-bold text-slate-900 mb-3">Educational Programs</h4>
//             <p className="text-sm text-slate-600">Create educational programs and resources for players, coaches, administrators, and the general public to raise awareness and understanding of esports.</p>
//           </div>
//           <div className="bg-white p-6 rounded-xl border border-slate-200">
//             <h4 className="font-bold text-slate-900 mb-3">Professional Training</h4>
//             <p className="text-sm text-slate-600">Offer training and certification programs for esports professionals, such as referees, coaches, and event organizers.</p>
//           </div>
//           <div className="bg-white p-6 rounded-xl border border-slate-200">
//             <h4 className="font-bold text-slate-900 mb-3">Grassroots Support</h4>
//             <p className="text-sm text-slate-600">Support and empower local and regional esports organizations through funding, knowledge sharing, and networking opportunities.</p>
//           </div>
//         </div>
//       </div>

//       <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-8 border border-purple-100">
//         <div className="flex items-center gap-3 mb-6">
//           <div className="bg-purple-100 p-3 rounded-lg">
//             <Megaphone className="text-purple-600" size={24} />
//           </div>
//           <div>
//             <h3 className="text-2xl font-bold text-slate-900">Advocacy and Representation</h3>
//             <p className="text-slate-600 mt-2">Championing esports on the global stage</p>
//           </div>
//         </div>
//         <div className="grid md:grid-cols-3 gap-6">
//           <div className="bg-white p-6 rounded-xl border border-slate-200">
//             <h4 className="font-bold text-slate-900 mb-3">Government Recognition</h4>
//             <p className="text-sm text-slate-600">Advocate for the recognition of esports as a legitimate sport by governments and international sports organizations.</p>
//           </div>
//           <div className="bg-white p-6 rounded-xl border border-slate-200">
//             <h4 className="font-bold text-slate-900 mb-3">Stakeholder Collaboration</h4>
//             <p className="text-sm text-slate-600">Partner with game developers, publishers, technology companies, and other stakeholders to improve the esports ecosystem.</p>
//           </div>
//           <div className="bg-white p-6 rounded-xl border border-slate-200">
//             <h4 className="font-bold text-slate-900 mb-3">Social Impact</h4>
//             <p className="text-sm text-slate-600">Highlight the positive benefits of esports, such as its potential to promote inclusivity, diversity, and development.</p>
//           </div>
//         </div>
//       </div>

//       <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl p-8 border border-amber-100">
//         <div className="flex items-center gap-3 mb-6">
//           <div className="bg-amber-100 p-3 rounded-lg">
//             <Trophy className="text-amber-600" size={24} />
//           </div>
//           <div>
//             <h3 className="text-2xl font-bold text-slate-900">Competition and Events</h3>
//             <p className="text-slate-600 mt-2">Organizing and supporting world-class esports competitions</p>
//           </div>
//         </div>
//         <div className="grid md:grid-cols-3 gap-6">
//           <div className="bg-white p-6 rounded-xl border border-slate-200">
//             <h4 className="font-bold text-slate-900 mb-3">International Championships</h4>
//             <p className="text-sm text-slate-600">Host major international esports tournaments and events, potentially including regional qualifiers and culminating in a global championship.</p>
//           </div>
//           <div className="bg-white p-6 rounded-xl border border-slate-200">
//             <h4 className="font-bold text-slate-900 mb-3">Tournament Support</h4>
//             <p className="text-sm text-slate-600">Partner and support existing major esports tournaments and leagues to ensure alignment with international standards and regulations.</p>
//           </div>
//           <div className="bg-white p-6 rounded-xl border border-slate-200">
//             <h4 className="font-bold text-slate-900 mb-3">Sustainable Development</h4>
//             <p className="text-sm text-slate-600">Encourage game developers and publishers to implement practices that promote the long-term health and sustainability of esports ecosystems.</p>
//           </div>
//         </div>
//       </div>

//       <div className="bg-gradient-to-br from-cyan-50 to-white rounded-2xl p-8 border border-cyan-100">
//         <div className="flex items-center gap-3 mb-6">
//           <div className="bg-cyan-100 p-3 rounded-lg">
//             <BarChart className="text-cyan-600" size={24} />
//           </div>
//           <div>
//             <h3 className="text-2xl font-bold text-slate-900">Research and Development</h3>
//             <p className="text-slate-600 mt-2">Advancing the esports industry through innovation</p>
//           </div>
//         </div>
//         <div className="grid md:grid-cols-3 gap-6">
//           <div className="bg-white p-6 rounded-xl border border-slate-200">
//             <h4 className="font-bold text-slate-900 mb-3">Industry Research</h4>
//             <p className="text-sm text-slate-600">Invest in research on the economic, social, and cultural impact of esports to inform future development strategies.</p>
//           </div>
//           <div className="bg-white p-6 rounded-xl border border-slate-200">
//             <h4 className="font-bold text-slate-900 mb-3">Technology Innovation</h4>
//             <p className="text-sm text-slate-600">Explore and develop new technologies and tools that can benefit the esports industry, such as anti-doping measures, spectator engagement platforms, and training tools.</p>
//           </div>
//           <div className="bg-white p-6 rounded-xl border border-slate-200">
//             <h4 className="font-bold text-slate-900 mb-3">Knowledge Sharing</h4>
//             <p className="text-sm text-slate-600">Facilitate knowledge sharing and the exchange of best practices within the esports community through conferences, workshops, and online resources.</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// export default FederationServicesPage;



// updated code
import { BarChart, Code, Globe2, GraduationCap, Megaphone, Trophy } from 'lucide-react';

const FederationServicesPage = () => (
  <div className="space-y-8">
    {/* Hero Section */}
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Globe2 className="text-blue-600" />
        <h2 className="text-3xl font-bold text-slate-900">Federation Services</h2>
      </div>
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-white">
        <p className="text-xl md:text-2xl font-bold mb-3">Empowering the Global Esports Ecosystem</p>
        <p className="text-slate-200 leading-relaxed">
          The International Federation of Esports delivers a wide range of strategic services designed to support federations, players, 
          organizations, and stakeholders in building a structured, sustainable, and globally aligned esports ecosystem.
          Our services are focused on governance, development, innovation, and collaboration—ensuring that esports continues to grow 
          with integrity, professionalism, and global impact.
        </p>
      </div>
    </div>

    <div className="space-y-12">
      {/* 1. Development & Standardization */}
      <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border border-blue-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Code className="text-blue-600" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">1. Development & Standardization</h3>
            <p className="text-slate-600 mt-2">Establishing Global Frameworks for Esports</p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-3">🎮 Competitive Guidelines</h4>
            <p className="text-sm text-slate-600">IFES develops and implements standardized rules, formats, and competition structures across multiple esports titles, ensuring consistency, transparency, and fair play in global tournaments.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-3">🧩 Discipline Development</h4>
            <p className="text-sm text-slate-600">We identify, define, and recognize emerging esports disciplines in collaboration with game publishers and industry stakeholders, enabling structured expansion of competitive gaming categories.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-3">⚖️ Ethical Conduct & Integrity</h4>
            <p className="text-sm text-slate-600 mb-2">IFES enforces strict policies on:</p>
            <ul className="text-sm text-slate-600 space-y-1 list-disc pl-5">
              <li>Anti-doping</li>
              <li>Anti-cheating mechanisms</li>
              <li>Code of conduct for players, teams, and organizers</li>
            </ul>
            <p className="text-sm text-slate-600 mt-2">Ensuring trust, credibility, and integrity across the ecosystem.</p>
          </div>
        </div>
      </div>

      {/* 2. Education & Capacity Building */}
      <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-8 border border-emerald-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-emerald-100 p-3 rounded-lg">
            <GraduationCap className="text-emerald-600" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">2. Education & Capacity Building</h3>
            <p className="text-slate-600 mt-2">Developing Talent and Professional Excellence</p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-3">📚 Educational Programs</h4>
            <p className="text-sm text-slate-600">We design comprehensive learning resources and awareness programs to educate players, institutions, and communities about esports opportunities, careers, and ecosystem dynamics.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-3">🏅 Professional Training & Certification</h4>
            <p className="text-sm text-slate-600 mb-2">IFES offers structured training and certification programs for:</p>
            <ul className="text-sm text-slate-600 space-y-1 list-disc pl-5">
              <li>Coaches</li>
              <li>Referees & officials</li>
              <li>Event organizers</li>
              <li>Esports administrators</li>
            </ul>
            <p className="text-sm text-slate-600 mt-2">Building a globally recognized professional workforce.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-3">🌱 Grassroots Development</h4>
            <p className="text-sm text-slate-600 mb-2">We support regional and local organizations through:</p>
            <ul className="text-sm text-slate-600 space-y-1 list-disc pl-5">
              <li>Knowledge sharing</li>
              <li>Mentorship programs</li>
              <li>Networking platforms</li>
            </ul>
            <p className="text-sm text-slate-600 mt-2">Strengthening the foundation of esports from the ground up.</p>
          </div>
        </div>
      </div>

      {/* 3. Advocacy & Global Representation */}
      <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-8 border border-purple-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-100 p-3 rounded-lg">
            <Megaphone className="text-purple-600" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">3. Advocacy & Global Representation</h3>
            <p className="text-slate-600 mt-2">Championing Esports Worldwide</p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-3">🌐 Government & Institutional Engagement</h4>
            <p className="text-sm text-slate-600">IFES actively works with governments and international bodies to advocate recognition of esports as a legitimate sport, aligning policies and frameworks globally.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-3">🔗 Stakeholder Collaboration</h4>
            <p className="text-sm text-slate-600 mb-2">We collaborate with:</p>
            <ul className="text-sm text-slate-600 space-y-1 list-disc pl-5">
              <li>Game developers & publishers</li>
              <li>Technology companies</li>
              <li>Media & broadcasting partners</li>
              <li>Educational institutions</li>
            </ul>
            <p className="text-sm text-slate-600 mt-2">To drive innovation and ecosystem growth.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-3">🌍 Social Impact Initiatives</h4>
            <p className="text-sm text-slate-600">IFES promotes esports as a platform for positive social change, inclusivity, and community development worldwide.</p>
          </div>
        </div>
      </div>

      {/* 4. Competitions & Event Ecosystem */}
      <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl p-8 border border-amber-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-amber-100 p-3 rounded-lg">
            <Trophy className="text-amber-600" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">4. Competitions & Event Ecosystem</h3>
            <p className="text-slate-600 mt-2">Enabling World-Class Esports Experiences</p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-3">🌎 International Championships</h4>
            <p className="text-sm text-slate-600">IFES organizes flagship global events such as the IFES Esports World Cup, featuring international participation, structured formats, and world-class competition standards.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-3">🎯 Tournament Support & Sanctioning</h4>
            <p className="text-sm text-slate-600 mb-2">We partner with and support independent tournaments and leagues by:</p>
            <ul className="text-sm text-slate-600 space-y-1 list-disc pl-5">
              <li>Providing regulatory frameworks</li>
              <li>Ensuring compliance with global standards</li>
              <li>Enhancing credibility and reach</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-3">♻️ Sustainable Event Development</h4>
            <p className="text-sm text-slate-600">IFES promotes long-term sustainability in esports events by encouraging responsible practices and ecosystem balance.</p>
          </div>
        </div>
      </div>

      {/* 5. Research, Innovation & Knowledge Sharing */}
      <div className="bg-gradient-to-br from-cyan-50 to-white rounded-2xl p-8 border border-cyan-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-cyan-100 p-3 rounded-lg">
            <BarChart className="text-cyan-600" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">5. Research, Innovation & Knowledge Sharing</h3>
            <p className="text-slate-600 mt-2">Driving the Future of Esports</p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-3">📊 Industry Research</h4>
            <p className="text-sm text-slate-600 mb-2">We conduct and support research on:</p>
            <ul className="text-sm text-slate-600 space-y-1 list-disc pl-5">
              <li>Economic impact of esports</li>
              <li>Social and cultural influence</li>
              <li>Market trends and growth opportunities</li>
            </ul>
            <p className="text-sm text-slate-600 mt-2">Helping stakeholders make informed decisions.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-3">💡 Technology Innovation</h4>
            <p className="text-sm text-slate-600 mb-2">IFES explores emerging technologies such as:</p>
            <ul className="text-sm text-slate-600 space-y-1 list-disc pl-5">
              <li>Artificial Intelligence (AI)</li>
              <li>Anti-cheating and integrity systems</li>
              <li>Fan engagement platforms</li>
            </ul>
            <p className="text-sm text-slate-600 mt-2">Enhancing competitive and spectator experiences.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-3">🧠 Knowledge Exchange Platforms</h4>
            <p className="text-sm text-slate-600 mb-2">We facilitate global knowledge sharing through:</p>
            <ul className="text-sm text-slate-600 space-y-1 list-disc pl-5">
              <li>Conferences & summits</li>
              <li>Workshops & training sessions</li>
              <li>Digital resource platforms</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default FederationServicesPage;