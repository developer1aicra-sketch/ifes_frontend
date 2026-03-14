import React from 'react';

const DEFAULT_ACCENT = {
  title: 'text-white',
};

export function StudentCommunityDirectory({ themeAccent }) {
  const accent = themeAccent || DEFAULT_ACCENT;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className={`text-xl md:text-2xl font-bold ${accent.title}`}>
            Student Community Directory
          </h1>
          <p className="text-sm text-slate-400">
            Explore the wider Technoxian student community directory across schools, clubs, and regions.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-sm text-slate-300">
        <p>
          This section will host your student community directory. You can attach your backend APIs here
          to list and filter student members, show contact details, and provide deep links into member profiles.
        </p>
      </div>
    </div>
  );
}

export default StudentCommunityDirectory;
