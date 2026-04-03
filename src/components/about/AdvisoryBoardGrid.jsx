import { Award } from 'lucide-react';
import PersonCard from '../partner/PersonCard';

/**
 * Shared advisory board presentation for About flows.
 * Members may be static (`data/aboutPeople`) or from GET /advisory/board/get (id, name, designation, image).
 */
const AdvisoryBoardGrid = ({
  members,
  title = 'Advisory Board',
  description = "Global leaders and experts guiding WORSO's mission, governance, and long-term strategy.",
  className = '',
}) => {
  if (!Array.isArray(members) || members.length === 0) return null;

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Award className="text-blue-600 shrink-0" size={28} />
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{title}</h2>
        </div>
        {description ? (
          <p className="text-base md:text-lg text-slate-600 max-w-3xl leading-relaxed">{description}</p>
        ) : null}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {members.map((person) => (
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
};

export default AdvisoryBoardGrid;
