import { Calendar, Shield, Users } from 'lucide-react';
import PersonCard from '../../../components/partner/PersonCard';
import { EXECUTIVE_MEMBERS } from '../../../data/aboutPeople';

const ExecutiveCommitteePage = () => (
  <div className="space-y-8">
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Users className="text-blue-600" />
        <h2 className="text-3xl font-bold text-slate-900">Executive Committee</h2>
      </div>
      <p className="text-lg text-slate-600 leading-relaxed">
        The Executive Committee of the World Robotics Sports Organization (IFSE) is composed of esteemed leaders in the esports industry, tasked with guiding the federation&apos;s strategic vision and policies. They oversee global initiatives, drive the growth of competitive gaming, and ensure fair, inclusive practices. By fostering collaboration with national organizations, governments, and stakeholders, the committee plays a pivotal role in shaping the future of esports worldwide and ensuring its sustainable development.
      </p>
    </div>

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {EXECUTIVE_MEMBERS.map((person) => (
        <PersonCard
          key={person.id}
          id={person.id}
          name={person.name}
          designation={person.designation}
          image={person.image}
        />
      ))}
    </div>

    <div className="mt-12 pt-8 border-t border-slate-200">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-8 border border-blue-100">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="text-blue-600" size={24} />
            <h3 className="text-xl font-bold text-slate-900">Board Meetings</h3>
          </div>
          <p className="text-slate-600 mb-4">
            The Executive Committee convenes quarterly to review progress, set strategic direction, and make key decisions for IFSE&apos;s global operations.
          </p>
          <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
            <Calendar size={16} />
            <span>Next Meeting: March 15, 2024</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="text-slate-600" size={24} />
            <h3 className="text-xl font-bold text-slate-900">Key Responsibilities</h3>
          </div>
          <ul className="space-y-2 text-slate-600">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Strategic planning and policy development</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Financial oversight and budget approval</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Global partnership and stakeholder management</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Esports development and growth initiatives</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default ExecutiveCommitteePage;
