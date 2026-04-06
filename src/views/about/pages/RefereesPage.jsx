import { ClipboardList } from 'lucide-react';
import PersonCard from '../../../components/partner/PersonCard';
import { REFEREES } from '../../../data/aboutPeople';

const RefereesPage = () => (
  <div className="space-y-10">
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <ClipboardList className="text-blue-600" />
        <h2 className="text-3xl font-bold text-slate-900">
          Official Referees & Judges
        </h2>
      </div>
      <p className="text-lg text-slate-600 max-w-3xl">
        Certified referees and judges appointed by WORSO to ensure fair play,
        rule compliance, and professional evaluation across all robotics competitions.
      </p>
    </div>

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {REFEREES.map((person) => (
        <PersonCard
          key={person.id}
          id={person.id}
          name={person.name}
          designation={person.designation}
          image={person.image}
        />
      ))}
    </div>
  </div>
);

export default RefereesPage;
