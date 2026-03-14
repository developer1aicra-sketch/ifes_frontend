import React from "react";
import { Mic, MapPin, Calendar } from "lucide-react";

const DEFAULT_ACCENT = {
  title: "text-white",
  iconBg: "bg-sky-500/15 border-sky-400/40 text-sky-300",
};

const CONFERENCES = [
  {
    id: "conf-1",
    name: "Technoxian Tech Summit",
    location: "New Delhi • India",
    date: "Aug 2026",
    description:
      "Talks on robotics, AI, and education tech with demos from student innovators.",
    status: "COMING SOON",
  },
  {
    id: "conf-2",
    name: "Global Robotics & AI Conference",
    location: "Dubai • UAE",
    date: "Oct 2026",
    description:
      "Industry + academia conference focused on real-world robotics deployments.",
    status: "COMING SOON",
  },
];

export function TechConferences({ themeAccent }) {
  const accent = themeAccent || DEFAULT_ACCENT;
  const titleClass = accent.title || DEFAULT_ACCENT.title;
  const iconClass = accent.iconBg || DEFAULT_ACCENT.iconBg;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl border flex items-center justify-center ${iconClass}`}
        >
          <Mic size={20} />
        </div>
        <div>
          <h1 className={`text-xl md:text-2xl font-bold ${titleClass}`}>
            Tech Conferences
          </h1>
          <p className="text-sm text-slate-400">
            Conferences and talks where students, mentors, and partners share
            new ideas and demos.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CONFERENCES.map((c) => (
          <div
            key={c.id}
            className="relative overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-700/80 p-5"
          >
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_0_0,rgba(56,189,248,0.18),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(168,85,247,0.16),transparent_55%)]" />
            <div className="relative">
              <p className="text-[10px] uppercase tracking-[0.22em] text-sky-300/80">
                {c.status}
              </p>
              <h3 className="mt-1 text-sm font-semibold text-slate-50">{c.name}</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                {c.description}
              </p>

              <div className="mt-4 grid grid-cols-1 gap-2 text-xs text-slate-300/90">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>{c.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>{c.date}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TechConferences;
