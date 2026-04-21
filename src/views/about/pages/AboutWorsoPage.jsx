import { Globe2, GraduationCap, Layers, Rocket, Shield, Target, Users } from 'lucide-react';
import { ADVISORY_BOARD } from '../../../data/aboutPeople';
import AdvisoryBoardGrid from '../../../components/about/AdvisoryBoardGrid';

const AboutWorsoPage = () => (
  <div className="space-y-10">
    <div className="container mx-auto px-4 py-4">
      <div className="bg-[#0f172a] rounded-3xl text-white p-12 md:p-14 shadow-2xl relative overflow-hidden">
        <div className="text-yellow-400 font-bold tracking-widest text-xs uppercase mb-4">About IFeS</div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">The World Robotics Sports Organization</h1>
        <p className="text-slate-200 text-lg max-w-3xl">
          Championing the Future of Competitive Gaming
        </p>
      </div>
    </div>

    <p className="text-lg text-slate-600 leading-relaxed">
      The world of eSports has exploded in popularity in recent years, evolving from a niche hobby to a global phenomenon. At the forefront of this exciting evolution stands the World Robotics Sports Organization (IFeS), the governing body for competitive tech-sports, dedicated to promoting and developing eSports on a global scale.
    </p>

    <div className="space-y-4 pt-4 border-t border-slate-100">
      <div className="flex items-center gap-3">
        <Target className="text-blue-600" />
        <h2 className="text-2xl font-bold text-slate-900">IFeS&apos;s Mission: Unifying the eSports Community</h2>
      </div>
      <p className="text-slate-600 leading-relaxed">
        Founded in 2023, IFes serves as the unifying force for eSports organizations and stakeholders worldwide. Its mission is to:
      </p>
      <ul className="list-disc list-inside space-y-2 text-slate-600 pl-2">
        <li>Promote and develop eSports globally</li>
        <li>Ensure fair and competitive play</li>
        <li>Organize and sanction international eSports tournaments</li>
        <li>Support the growth and development of national eSports federations</li>
        <li>Advocate for the recognition of eSports as a legitimate sport</li>
      </ul>
    </div>

    <div className="space-y-4 pt-4 border-t border-slate-100">
      <div className="flex items-center gap-3">
        <Globe2 className="text-blue-600" />
        <h2 className="text-2xl font-bold text-slate-900">IFeS&apos;s Impact: Connecting the World Through eSports</h2>
      </div>
      <p className="text-slate-600 leading-relaxed">
        IFeS&apos;s impact on the eSports landscape is undeniable. The organization boasts over 43 member countries, each with its own national eSports association or federation. This global network fosters collaboration and knowledge sharing, promoting the development of eSports at the grassroots level.
      </p>
      <p className="text-slate-600 leading-relaxed">
        One of IFeS&apos;s crown jewels is the World Championship, a prestigious annual event that brings together the best eSports players from around the world to compete in various game titles. The World Championship is a testament to the skill, dedication, and athleticism of professional gamers, showcasing eSports to a wider audience and further solidifying its position as a legitimate sport.
      </p>
    </div>

    <div className="space-y-4 pt-4 border-t border-slate-100">
      <div className="flex items-center gap-3">
        <Layers className="text-blue-600" />
        <h2 className="text-2xl font-bold text-slate-900">Beyond Tournaments: IFeS&apos;s Holistic Approach</h2>
      </div>
      <p className="text-slate-600 leading-relaxed">
        IFeS&apos;s commitment extends beyond organizing tournaments. The organization actively works on several fronts:
      </p>
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 text-blue-600 font-bold mb-2">
            <GraduationCap size={18} /> Education and Training
          </div>
          <p className="text-sm text-slate-600">IFeS provides educational resources and training programs for aspiring eSports athletes, coaches, and administrators.</p>
        </div>
        <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 text-blue-600 font-bold mb-2">
            <Shield size={18} /> Anti-Doping
          </div>
          <p className="text-sm text-slate-600">IFeS implements a strict anti-doping policy to ensure fair play and protect the integrity of eSports.</p>
        </div>
        <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 text-blue-600 font-bold mb-2">
            <Users size={18} /> Gender Equality
          </div>
          <p className="text-sm text-slate-600">IFeS champions gender equality in eSports and encourages the participation of women in all aspects of the industry.</p>
        </div>
        <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 text-blue-600 font-bold mb-2">
            <Globe2 size={18} /> Sustainability
          </div>
          <p className="text-sm text-slate-600">IFeS promotes sustainable practices within the eSports industry, focusing on environmental and social responsibility.</p>
        </div>
      </div>
    </div>

    <div className="space-y-4 pt-4 border-t border-slate-100">
      <div className="flex items-center gap-3">
        <Rocket className="text-blue-600" />
        <h2 className="text-2xl font-bold text-slate-900">The Future of eSports: IFeS Leading the Way</h2>
      </div>
      <p className="text-slate-600 leading-relaxed">
        With the eSports industry projected to cross a global market size of over $1.5 billion in 2023, the future of competitive gaming looks bright. IFes is well-positioned to lead the way, continuing to promote the growth and development of eSports on a global scale. By fostering collaboration, advocating for recognition, and addressing key challenges, IFes is ensuring that eSports reaches its full potential as a sport, entertainment medium, and cultural phenomenon.
      </p>
    </div>

    <div className="pt-6 border-t border-slate-100">
      <AdvisoryBoardGrid members={ADVISORY_BOARD} />
    </div>

    <div className="pt-6 border-t border-slate-100">
      <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-2xl p-8 border border-blue-100">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Join the Movement!</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          Whether you&apos;re a passionate gamer, a dedicated eSports fan, or simply curious about the future of competitive gaming, IFeS invites you to join the movement. Visit the IFeS website to learn more about its initiatives, upcoming events, and how you can get involved in shaping the future of eSports.
        </p>
        <p className="text-slate-600 leading-relaxed mb-6">
          Together, we can make eSports a force for good in the world, connecting communities, promoting fair play, and inspiring the next generation of champions.
        </p>
        <p className="text-lg font-bold text-blue-600">Let the games begin!</p>
      </div>
    </div>
  </div>
);

export default AboutWorsoPage;
