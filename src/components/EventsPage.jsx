import { Calendar, Globe, Lock, MapPin, X } from "lucide-react";
import { useState } from "react";

const DEFAULT_ACCENT = { borderLeft: "border-green-500" };

const FEATURED_EVENTS = [
  {
    name: "Technoxian International Championship – Venezuela",
    venue: "Bicentennial University of Aragua, Venezuela",
    date: "July 9–11, 2026",
    host: "Technoxian in collaboration with local partners",
    description:
      "International robotics and innovation championship hosted at the Bicentennial University of Aragua, bringing together teams from across Latin America and beyond.",
  },
  {
    name: "Ivy STEM International Schools – Egypt Championship",
    venue: "Ivy STEM International Schools, Egypt",
    date: "June 2026",
    host: "Technoxian x Ivy STEM International Schools",
    description:
      "Regional Technoxian competition in Egypt focused on STEM excellence, hands‑on robotics challenges, and innovation for school students.",
  },
];

export function EventsPage({ events = [], themeAccent }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const accent = themeAccent || DEFAULT_ACCENT;
  const borderClass = accent.borderLeft || DEFAULT_ACCENT.borderLeft;

  return (
    <div className="space-y-6 animate-fadeIn">
      <section className="space-y-4">
        <h3 className={`text-sm font-bold text-slate-400 uppercase mb-3 border-l-4 ${borderClass} pl-3`}>
          Upcoming International Competitions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FEATURED_EVENTS.map((event) => (
            <article
              key={event.name}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedEvent(event)}
              onKeyDown={(e) => e.key === "Enter" && setSelectedEvent(event)}
              className="bg-slate-900 border border-slate-700 p-4 rounded-xl flex justify-between items-center opacity-75 hover:border-green-500 transition-colors cursor-pointer"
            >
              <div>
                <h3 className="font-bold text-white">{event.name}</h3>
                <p className="text-xs text-slate-500">
                  {event.venue} • {event.date}
                </p>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <Globe size={12} className="text-green-400" />
                  <span>{event.host}</span>
                </p>
              </div>
              <span className="bg-slate-800 text-slate-500 text-xs px-4 py-2 rounded cursor-not-allowed">
                COMING SOON
              </span>
            </article>
          ))}
        </div>
      </section>

      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedEvent(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="event-modal-title"
        >
          <div
            className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 id="event-modal-title" className="text-2xl font-bold text-white">
                {selectedEvent.name}
              </h2>
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="text-slate-400 hover:text-white"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center text-sm text-slate-300">
                <MapPin size={16} className="mr-2 flex-shrink-0" />
                <span>{selectedEvent.venue}</span>
              </div>
              <div className="flex items-center text-sm text-slate-300">
                <Calendar size={16} className="mr-2 flex-shrink-0" />
                <span>{selectedEvent.date}</span>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg mt-4">
                <h3 className="font-bold text-white mb-2">Event Details</h3>
                <p className="text-sm text-slate-300">
                  {selectedEvent.description || "No additional details available."}
                </p>
              </div>
              <div className="pt-4 border-t border-slate-700">
                <button
                  type="button"
                  className="w-full bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded-lg font-bold"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Register for:", selectedEvent.name);
                  }}
                >
                  Register Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Championship Track & Standalone – hidden, can be wired to events prop later */}
      <div className="space-y-8 hidden">
        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase mb-3 border-l-4 border-red-500 pl-3">
            Official Championship Series (Qualification Required)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.filter((e) => e.type === "championship_track").map((evt) => (
              <div
                key={evt.event_id}
                className="bg-slate-900 border border-slate-700 p-4 rounded-xl flex justify-between items-center opacity-75"
              >
                <div>
                  <h4 className="font-bold text-white">{evt.name}</h4>
                  <p className="text-xs text-slate-500">
                    {evt.venue} • {evt.date}
                  </p>
                  <p className="text-xs text-red-400 mt-1 flex items-center">
                    <Lock size={10} className="mr-1" /> Requires ZRC Win
                  </p>
                </div>
                <span className="bg-slate-800 text-slate-500 text-xs px-4 py-2 rounded cursor-not-allowed">
                  {evt.is_locked ? "LOCKED" : "REGISTER"}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase mb-3 border-l-4 border-green-500 pl-3">
            Standalone Games & Open Leagues
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.filter((e) => e.type === "standalone").map((evt) => (
              <div
                key={evt.event_id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedEvent(evt)}
                className="bg-slate-800 border border-slate-600 p-4 rounded-xl flex justify-between items-center hover:border-green-500 transition-colors cursor-pointer group"
              >
                <div>
                  <h4 className="font-bold text-white group-hover:text-green-400 transition-colors">
                    {evt.name}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {evt.venue} • {evt.date}
                  </p>
                  <p className="text-xs text-green-400 mt-1 flex items-center">
                    <Globe size={10} className="mr-1" /> Open to All
                  </p>
                </div>
                <button
                  type="button"
                  className="bg-green-600 hover:bg-green-500 text-white text-xs px-4 py-2 rounded font-bold shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Register clicked for:", evt.name);
                  }}
                >
                  REGISTER
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventsPage;
