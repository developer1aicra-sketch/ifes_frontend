import { Award, Cpu, Globe2, Shield, Users } from 'lucide-react';

const MissionVisionPage = () => (
  <div className="space-y-8">
    <div className="container mx-auto px-4 py-10">
      <div className="bg-[#0f172a] rounded-3xl text-white p-12 md:p-14 shadow-2xl relative overflow-hidden">
        <div className="text-yellow-400 font-bold tracking-widest text-xs uppercase mb-4">Our Mission</div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">Our Mission</h1>
        <p className="text-slate-200 text-lg max-w-3xl mb-6">
          Mission, mandate, affiliation, data, and the federated partner network that powers the sport of robotics.
        </p>
        <div className="flex flex-wrap gap-3">
          <div className="bg-white/10 px-4 py-3 rounded-xl border border-white/10">
            <div className="text-xs font-bold uppercase text-slate-200">Mode</div>
            <div className="text-lg font-extrabold text-white">Federated</div>
          </div>
          <div className="bg-white/10 px-4 py-3 rounded-xl border border-white/10">
            <div className="text-xs font-bold uppercase text-slate-200">Associations</div>
            <div className="text-lg font-extrabold text-emerald-200">95+ Nations</div>
          </div>
        </div>
      </div>
    </div>
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Shield className="text-blue-600" />
        <h2 className="text-3xl font-bold text-slate-900">Our Mission</h2>
      </div>
      <p className="text-lg text-slate-600 leading-relaxed">
        IFeS is the global regulatory root for the sport of robotics—writing the laws of play, publishing safety protocols, and certifying every affiliated event. Federation over
        centralization keeps local context alive while the core stays immutable.
      </p>
    </div>

    <div className="space-y-4 pt-6 border-t border-slate-100">
      <h3 className="text-2xl font-bold text-slate-900">Our Vision</h3>
      <p className="text-lg text-slate-600 leading-relaxed">
       Our vision is to forge a global esports community where passion, innovation, and opportunity converge to redefine competitive gaming. We aspire to position India as the epicenter of esports excellence, fostering a dynamic ecosystem that empowers creators, athletes, and visionaries to transcend borders and inspire millions. By championing inclusivity and cutting-edge education, IFES seeks to build a legacy where esports is a universal language of unity and progress.
      </p>
    </div>

    <div className="space-y-6 pt-6 border-t border-slate-100">
      <h3 className="text-2xl font-bold text-slate-900">Our Core Values</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {[
          {
            icon: <Shield size={16} />,
            title: 'Integrity',
            description: 'We uphold the highest standards of ethical conduct and fair play in all aspects of eSport.',
            color: 'blue',
          },
          {
            icon: <Cpu size={16} />,
            title: 'Innovation',
            description: 'We embrace innovation and technological advancements to continuously improve the eSport experience for all stakeholders.',
            color: 'purple',
          },
          {
            icon: <Users size={16} />,
            title: 'Inclusivity',
            description: 'We are committed to fostering a diverse and inclusive eSport community where everyone feels welcome and empowered to participate.',
            color: 'pink',
          },
          {
            icon: <Award size={16} />,
            title: 'Excellence',
            description: 'We strive for excellence in all aspects of our operations, setting the highest benchmarks for professional eSport.',
            color: 'green',
          },
          {
            icon: <Globe2 size={16} />,
            title: 'Sustainability',
            description: 'We advocate for responsible and sustainable practices within the eSport industry, ensuring its long-term growth and positive impact.',
            color: 'emerald',
          },
          {
            icon: <Users size={16} />,
            title: 'Community',
            description: 'We are committed to building a strong and engaged eSport community where players, fans, and organizers can connect and thrive.',
            color: 'indigo',
          },
        ].map((value, index) => (
          <div key={index} className="p-5 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
            <div className={`flex items-center gap-2 text-xs font-bold uppercase text-${value.color}-600`}>
              {value.icon} {value.title}
            </div>
            <p className="text-sm text-slate-600 mt-3">{value.description}</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-slate-500 italic mt-4">
        Through these core values, IFeS aims to establish eSport as a mainstream sport, recognized for its athleticism, competitive spirit, and positive impact on society.
      </p>
    </div>
  </div>
);

export default MissionVisionPage;
