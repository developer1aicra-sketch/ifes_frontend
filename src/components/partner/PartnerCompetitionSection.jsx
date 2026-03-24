import React, { useMemo } from 'react';
import { Calendar, Users, Trophy, ExternalLink, Bot } from 'lucide-react';
import { useThemeClasses } from '../../hooks/useThemeClasses';

const formatDuration = (duration) => {
  const value = duration?.value;
  const unit = duration?.unit;
  if (!value || !unit) return null;
  const normalizedUnit = value === 1 ? String(unit).replace(/s$/, '') : unit;
  return `${value} ${normalizedUnit}`;
};

const formatTeamSize = (teamRequirements) => {
  const min = teamRequirements?.minMembers;
  const max = teamRequirements?.maxMembers;
  if (min == null || max == null) return null;
  return `${min}-${max} members`;
};

const PartnerCompetitionSection = ({ competitions = [], title = 'Competitions', className = '' }) => {
  const theme = useThemeClasses();

  const activeCompetitions = useMemo(
    () => (competitions || []).filter((c) => c && c.isActive !== false),
    [competitions]
  );

  if (activeCompetitions.length === 0) return null;

  return (
    <section className={`py-16 bg-white border-t border-slate-100 ${className}`} aria-labelledby="partner-competitions-title">
      <div className="container mx-auto px-4">
        <h2 id="partner-competitions-title" className="text-3xl font-bold text-slate-900 mb-8">
          {title}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeCompetitions.map((item) => {
            const duration = formatDuration(item.duration);
            const teamSize = formatTeamSize(item.teamRequirements);

            return (
              <article
                key={item._id}
                className="bg-slate-50 rounded-xl shadow-sm overflow-hidden border border-slate-200 hover:shadow-md transition-all hover:-translate-y-1 flex flex-col"
              >
                {item.bannerImage && (
                  <div className="relative pt-[56.25%] bg-slate-100 overflow-hidden">
                    <img
                      src={item.bannerImage}
                      alt={item.name || 'Competition banner'}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}

                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold text-slate-700 bg-slate-200">
                      {item.category || 'Competition'}
                    </span>
                   
                  </div>

                  <h3 className="font-semibold text-lg text-slate-900 mb-2 line-clamp-2 leading-tight">{item.name}</h3>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PartnerCompetitionSection;
