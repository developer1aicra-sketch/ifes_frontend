import { Briefcase, Globe2, Layers, Rocket, Target, Users } from 'lucide-react';

const WorkingAtWorsoPage = () => (
  <div className="space-y-8">
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Briefcase className="text-blue-600" />
        <h2 className="text-3xl font-bold text-slate-900">Working at IFeS</h2>
      </div>
      <p className="text-lg text-slate-600 leading-relaxed">
        Do you dream of shaping the future of competitive gaming? Do you crave a career that combines passion, purpose, and cutting-edge technology? Look no further than the World Robotics Sports Organization (IFeS), the leading force driving the global growth and recognition of eSports.
      </p>
    </div>

    <div className="space-y-4 pt-6 border-t border-slate-100">
      <h3 className="text-2xl font-bold text-slate-900">Here&apos;s why working for IFeS is more than just a job:</h3>
      <ul className="space-y-6">
        {[
          { title: 'Be a Changemaker', desc: "You'll be part of a dynamic team dedicated to promoting eSports as a legitimate sport, fostering a sustainable ecosystem, and advocating for ethical practices within the industry.", icon: Target },
          { title: 'Global Impact', desc: 'Your work will transcend borders, impacting millions of players and fans across the globe. Witness firsthand the power of eSports to connect communities, bridge divides, and champion social good.', icon: Globe2 },
          { title: 'Innovation Playground', desc: 'Immerse yourself in the ever-evolving world of eSports, where cutting-edge technology meets athleticism and strategic brilliance. Be at the forefront of shaping the future of competitive gaming.', icon: Rocket },
          { title: 'Diverse Opportunities', desc: 'From event management and athlete relations to anti-doping and game development initiatives, IFeS offers a diverse range of career paths to suit your skills and passion.', icon: Layers },
          { title: 'Work with the Best', desc: 'Collaborate with industry leaders, renowned players, and passionate esports enthusiasts. Learn from the best and contribute to a supportive and collaborative work environment.', icon: Users },
        ].map((item, index) => (
          <li key={index} className="flex gap-4">
            <div className="flex-shrink-0 mt-1 p-2 rounded-lg bg-blue-50">
              <item.icon className="text-blue-600" size={20} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
              <p className="text-slate-600">{item.desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>

    <div className="space-y-4 pt-6 border-t border-slate-100 bg-gradient-to-r from-blue-50 to-slate-50 rounded-2xl p-8 border border-blue-100">
      <p className="text-lg text-slate-600 leading-relaxed">
        IFeS is more than just an organization; it&apos;s a movement. A movement that celebrates the power of gaming, champions fair play, and empowers the next generation of athletes and leaders. By joining IFeS, you become an integral part of this movement, shaping the future of eSports and contributing to a more inclusive and impactful world.
      </p>
    </div>
  </div>
);

export default WorkingAtWorsoPage;
