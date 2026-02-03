import { Calendar, Globe, Lock, MapPin, X } from "lucide-react";
import { useState } from "react";

export  const EventsPage = ({ events }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Existing header and other content */}

      {/* Add this modal component */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-white">{selectedEvent.name}</h2>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center text-sm text-slate-300">
                <MapPin size={16} className="mr-2" />
                <span>{selectedEvent.venue}</span>
              </div>
              <div className="flex items-center text-sm text-slate-300">
                <Calendar size={16} className="mr-2" />
                <span>{selectedEvent.date}</span>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg mt-4">
                <h3 className="font-bold text-white mb-2">Event Details</h3>
                <p className="text-sm text-slate-300">
                  {/* {selectedEvent.description || 'No additional details available.'} */}
                  {"Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus repellendus quas enim, amet impedit similique voluptatum alias perferendis doloribus iusto dolore illo illum autem delectus aspernatur nostrum optio laudantium unde?" || 'No additional details available.'}

                </p>
              </div>
              <div className="pt-4 border-t border-slate-700">
                <button
                  className="w-full bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded-lg font-bold"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle registration
                    console.log('Register for:', selectedEvent.name);
                  }}
                >
                  Register Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Your existing events list */}
      <div className="space-y-8">
        {/* Championship Track */}
        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase mb-3 border-l-4 border-red-500 pl-3">
            Official Championship Series (Qualification Required)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.filter(e => e.type === 'championship_track').map(evt => (
              <div key={evt.event_id} className="bg-slate-900 border border-slate-700 p-4 rounded-xl flex justify-between items-center opacity-75">
                <div>
                  <h4 className="font-bold text-white">{evt.name}</h4>
                  <p className="text-xs text-slate-500">{evt.venue} • {evt.date}</p>
                  <p className="text-xs text-red-400 mt-1 flex items-center">
                    <Lock size={10} className="mr-1" /> Requires ZRC Win
                  </p>
                </div>
                <button
                  //  disabled
                  className="bg-slate-800 text-slate-500 text-xs px-4 py-2 rounded cursor-not-allowed">
                  {evt.is_locked ? 'LOCKED' : 'REGISTER'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Standalone Games */}
        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase mb-3 border-l-4 border-green-500 pl-3">
            Standalone Games & Open Leagues
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.filter(e => e.type === 'standalone').map(evt => (
              <div
                key={evt.event_id}
                onClick={() => setSelectedEvent(evt)}
                className="bg-slate-800 border border-slate-600 p-4 rounded-xl flex justify-between items-center hover:border-green-500 transition-colors cursor-pointer group"
              >
                <div>
                  <h4 className="font-bold text-white group-hover:text-green-400 transition-colors">
                    {evt.name}
                  </h4>
                  <p className="text-xs text-slate-400">{evt.venue} • {evt.date}</p>
                  <p className="text-xs text-green-400 mt-1 flex items-center">
                    <Globe size={10} className="mr-1" /> Open to All
                  </p>
                </div>
                <button
                  className="bg-green-600 hover:bg-green-500 text-white text-xs px-4 py-2 rounded font-bold shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle direct register button click
                    console.log('Register clicked for:', evt.name);
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
};
