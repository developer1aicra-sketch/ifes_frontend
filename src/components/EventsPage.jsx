import { Calendar, Globe, Lock, MapPin, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import endpoints from "../api/endpoints";

const DEFAULT_ACCENT = { borderLeft: "border-green-500" };

const FEATURED_EVENTS = [
  {
    name: "Technoxian International Championship – Venezuela",
    venue: "Bicentennial University of Aragua, Venezuela",
    date: "July 9–11, 2026",
    host: "Technoxian in collaboration with local partners",
    description:
      "International robotics and innovation championship hosted at the Bicentennial University of Aragua, bringing together teams from across Latin America and beyond.",
    landmark: { title: "Angel Falls", subtitle: "Venezuela" },
  },
  {
    name: "Ivy STEM International Schools – Egypt Championship",
    venue: "Ivy STEM International Schools, Egypt",
    date: "June 2026",
    host: "Technoxian x Ivy STEM International Schools",
    description:
      "Regional Technoxian competition in Egypt focused on STEM excellence, hands‑on robotics challenges, and innovation for school students.",
    landmark: { title: "Ancient Wonders", subtitle: "Egypt" },
  },
];

export function EventsPage({ events = [], themeAccent }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [competitions, setCompetitions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [seasonEvents, setSeasonEvents] = useState([]);
  const [isSeasonLoading, setIsSeasonLoading] = useState(false);
  const [seasonError, setSeasonError] = useState("");
  const accent = themeAccent || DEFAULT_ACCENT;
  const borderClass = accent.borderLeft || DEFAULT_ACCENT.borderLeft;
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation contract with RoboClub: open SquadManager -> Apply Championship tab with preselected type/competition.
  const goToApplyChampionshipByCompetition = (competitionId, eventType) => {
    if (!competitionId) return;
    const type = String(eventType || "").toUpperCase();
    navigate(location.pathname, {
      state: {
        ...(location.state || {}),
        registerCompetitionId: competitionId,
        ...(type ? { registerEventType: type } : {}),
      },
    });
  };

  const goToApplyChampionshipByEventType = (eventType) => {
    const type = String(eventType || "").toUpperCase();
    if (!type) return;
    navigate(location.pathname, {
      state: { ...(location.state || {}), registerEventType: type },
    });
  };

  useEffect(() => {
    let isMounted = true;

    const loadCompetitions = async () => {
      setIsLoading(true);
      setLoadError("");
      try {
        const response = await axiosInstance.get(endpoints.competition.list);
        const raw = response?.data?.data ?? response?.data ?? [];
        const list = Array.isArray(raw) ? raw : [];
        if (isMounted) setCompetitions(list);
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load competitions.";
        if (isMounted) setLoadError(String(message));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadCompetitions();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadSeasonDetails = async () => {
      setIsSeasonLoading(true);
      setSeasonError("");
      try {
        const response = await axiosInstance.get(endpoints.event.list);
        const raw = response?.data?.data ?? response?.data ?? [];
        const list = Array.isArray(raw) ? raw : [];
        if (isMounted) setSeasonEvents(list);
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load events.";
        if (isMounted) setSeasonError(String(message));
      } finally {
        if (isMounted) setIsSeasonLoading(false);
      }
    };

    loadSeasonDetails();
    return () => {
      isMounted = false;
    };
  }, []);

  const nrcEvents = useMemo(() => {
    return (Array.isArray(seasonEvents) ? seasonEvents : []).filter((evt) => {
      const type = String(evt?.type ?? "").toUpperCase();
      return type === "NRC";
    });
  }, [seasonEvents]);

  const wrcEvents = useMemo(() => {
    return (Array.isArray(seasonEvents) ? seasonEvents : []).filter((evt) => {
      const type = String(evt?.type ?? "").toUpperCase();
      return type === "WRC";
    });
  }, [seasonEvents]);

  const zrcEvents = useMemo(() => {
    return (Array.isArray(seasonEvents) ? seasonEvents : []).filter((evt) => {
      const type = String(evt?.type ?? "").toUpperCase();
      return type === "ZRC";
    });
  }, [seasonEvents]);

  const formatDateRange = (start, end) => {
    if (!start && !end) return "—";
    const fmt = new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const s = start ? fmt.format(new Date(start)) : "";
    const e = end ? fmt.format(new Date(end)) : "";
    if (s && e) return `${s} – ${e}`;
    return s || e;
  };

  const formatMonthDateYear = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";

    // Build a stable "Month Day Year" string (no locale comma issues).
    const parts = new Intl.DateTimeFormat(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).formatToParts(date);

    const month = parts.find((p) => p.type === "month")?.value;
    const day = parts.find((p) => p.type === "day")?.value;
    const year = parts.find((p) => p.type === "year")?.value;

    if (month && day && year) return `${month} ${day} ${year}`;
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const findZrcCompetitionForEvent = (zrcEvt) => {
    // Best-effort mapping from `/api/event/list` event objects to `/competition/list`
    // items so ZRC "Register" navigation can pass the correct `competitionId`.
    if (!zrcEvt) return null;

    const targetType = "ZRC";
    const targetName = String(zrcEvt?.name ?? "").trim().toUpperCase();
    const targetStart = String(zrcEvt?.start_date ?? "").trim();
    const targetEnd = String(zrcEvt?.end_date ?? "").trim();

    const targetStartMs = Number.isFinite(Date.parse(targetStart))
      ? Date.parse(targetStart)
      : null;
    const targetEndMs = Number.isFinite(Date.parse(targetEnd)) ? Date.parse(targetEnd) : null;

    // Venue is sometimes `TBD`, so it is only used as a weak hint.
    const targetVenue = String(zrcEvt?.venue ?? "").trim().toUpperCase();

    const match = (Array.isArray(competitions) ? competitions : []).find((c) => {
      const compType = String(c?.event?.type ?? c?.type ?? "").toUpperCase();
      if (compType !== targetType) return false;

      const compName = String(c?.name ?? "").trim().toUpperCase();
      const compStart = String(c?.event?.start_date ?? "").trim();
      const compEnd = String(c?.event?.end_date ?? "").trim();
      const compVenue = String(c?.event?.venue ?? "").trim().toUpperCase();

      const sameName = targetName && compName && targetName === compName;

      const compStartMs = Number.isFinite(Date.parse(compStart)) ? Date.parse(compStart) : null;
      const compEndMs = Number.isFinite(Date.parse(compEnd)) ? Date.parse(compEnd) : null;

      const sameDates =
        targetStartMs !== null &&
        targetEndMs !== null &&
        compStartMs !== null &&
        compEndMs !== null &&
        compStartMs === targetStartMs &&
        compEndMs === targetEndMs;

      const sameVenue = targetVenue && compVenue && targetVenue === compVenue;

      return Boolean(sameName || sameDates || sameVenue);
    });

    return match || null;
  };

  const handleZrcCardClick = (zrcEvt) => {
    const match = findZrcCompetitionForEvent(zrcEvt);
    if (match?._id) return goToApplyChampionshipByCompetition(match._id, "ZRC");
    if (match?.id) return goToApplyChampionshipByCompetition(match.id, "ZRC");

    // If we can't map it yet, still open the ZRC flow by type.
    return goToApplyChampionshipByEventType("ZRC");
  };

  const toDisplaySeasonEvent = (evt) => {
    const venue =
      evt?.venue ||
      [evt?.city, evt?.state, evt?.country].filter(Boolean).join(", ") ||
      "—";

    return {
      _id: evt?._id,
      name: evt?.name || "Event",
      venue,
      date: formatDateRange(evt?.start_date, evt?.end_date),
      host: evt?.website || "—",
      description: evt?.publicEventId || evt?.status || "",
      type: evt?.type,
      raw: evt,
      state: evt?.state,
      city: evt?.city,
      // Explicitly formatted start/end for consistent frontend display.
      startDate: formatMonthDateYear(evt?.start_date),
      endDate: formatMonthDateYear(evt?.end_date),
    };
  };

  const renderSeasonEventSection = ({ title, list, emptyText }) => {
    return (
      <section className="space-y-4">
        <h3
          className={`text-sm font-bold text-slate-400 uppercase mb-3 border-l-4 ${borderClass} pl-3`}
        >
          {title}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isSeasonLoading && (
            <div className="col-span-full bg-slate-900 border border-slate-700 p-4 rounded-xl text-slate-400 text-sm">
              Loading season events…
            </div>
          )}

          {!isSeasonLoading && seasonError && (
            <div className="col-span-full bg-slate-900 border border-red-600/40 p-4 rounded-xl text-red-300 text-sm">
              {seasonError}
            </div>
          )}

          {!isSeasonLoading && !seasonError && list.length === 0 && (
            <div className="col-span-full bg-slate-900 border border-slate-700 p-4 rounded-xl text-slate-400 text-sm">
              {emptyText}
            </div>
          )}

          {!isSeasonLoading &&
            !seasonError &&
            list.map((evt) => {
              const display = toDisplaySeasonEvent(evt);
              const typeLabel = String(display.type ?? "").toUpperCase();
              return (
                <article
                  key={display._id || display.name}
                  role="button"
                  tabIndex={0}
                  onClick={() => goToApplyChampionshipByEventType(typeLabel)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && goToApplyChampionshipByEventType(typeLabel)
                  }
                  className="bg-slate-900 border border-slate-700 p-4 rounded-xl flex justify-between items-center hover:border-green-500 transition-colors cursor-pointer"
                >
                  <div className="min-w-0">
                    <h3 className="font-bold text-white truncate">{display.name}</h3>
                    <p className="text-xs text-slate-500 truncate">
                      {display.venue} • {display.startDate} – {display.endDate}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1 truncate">
                      <Globe size={12} className="text-green-400 flex-shrink-0" />
                      <span className="truncate">{display.host}</span>
                    </p>
                  </div>
                  <span className="bg-slate-800 text-slate-200 text-xs px-4 py-2 rounded">
                    {typeLabel || "EVENT"}
                  </span>
                </article>
              );
            })}
        </div>
      </section>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <section className="space-y-4">
        <h3 className={`text-sm font-bold text-slate-400 uppercase mb-3 border-l-4 ${borderClass} pl-3`}>
          Upcoming  Events
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
                {event.landmark ? (
                  <p className="text-xs text-amber-300/90 mt-1.5">
                    <span className="text-slate-500">Iconic destination: </span>
                    {event.landmark.title}
                    {event.landmark.subtitle ? ` • ${event.landmark.subtitle}` : ""}
                  </p>
                ) : null}
              </div>
              <span className="bg-slate-800 text-slate-500 text-xs px-4 py-2 rounded cursor-not-allowed">
                COMING SOON
              </span>
            </article>
          ))}

          {isSeasonLoading && (
            <div className="col-span-full bg-slate-900 border border-slate-700 p-4 rounded-xl text-slate-400 text-sm">
              Loading events…
            </div>
          )}

          {!isSeasonLoading && seasonError && (
            <div className="col-span-full bg-slate-900 border border-red-600/40 p-4 rounded-xl text-red-300 text-sm">
              {seasonError}
            </div>
          )}

          {!isSeasonLoading && !seasonError && zrcEvents.length === 0 && (
            <div className="col-span-full bg-slate-900 border border-slate-700 p-4 rounded-xl text-slate-400 text-sm">
              No ZRC events found.
            </div>
          )}

          {!isSeasonLoading &&
            !seasonError &&
            zrcEvents.map((evt) => {
              const event = toDisplaySeasonEvent(evt);
              return (
                <article
                  key={event._id || event.name}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleZrcCardClick(evt)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleZrcCardClick(evt)
                  }
                  className="bg-slate-900 border border-slate-700 p-4 rounded-xl flex justify-between items-center hover:border-green-500 transition-colors cursor-pointer"
                >
                  <div className="min-w-0">
                    <h3 className="font-bold text-white truncate">Location: {event.state} ({event.city})</h3>
                    <p className="text-xs text-slate-500 truncate ">
                      <span className="font-bold">Venue: </span> {event.venue} {event?.startDate}-{event?.endDate}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1 truncate">
                      <Globe size={12} className="text-green-400 flex-shrink-0" />
                      <span className="truncate">{event.host}</span>
                    </p>
                  </div>
                  <span className="bg-green-600/20 text-green-300 text-xs px-4 py-2 rounded">
                    ZRC
                  </span>
                </article>
              );
            })}
        </div>
      </section>

      {renderSeasonEventSection({
        title: "Events (NRC)",
        list: nrcEvents,
        emptyText: "No NRC events found.",
      })}

      {renderSeasonEventSection({
        title: "Events (WRC)",
        list: wrcEvents,
        emptyText: "No WRC events found.",
      })}

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
              {selectedEvent.landmark ? (
                <div className="flex items-start text-sm text-slate-300">
                  <MapPin size={16} className="mr-2 flex-shrink-0 text-amber-400 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-xs uppercase tracking-wide mb-0.5">
                      Iconic destination
                    </span>
                    <span>
                      {selectedEvent.landmark.title}
                      {selectedEvent.landmark.subtitle
                        ? ` • ${selectedEvent.landmark.subtitle}`
                        : ""}
                    </span>
                  </div>
                </div>
              ) : null}
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
                    const competitionId =
                      selectedEvent?.raw?.event ? selectedEvent?.raw?._id : null;
                    if (competitionId) {
                      const type = String(selectedEvent?.raw?.event?.type ?? "").toUpperCase();
                      goToApplyChampionshipByCompetition(competitionId, type);
                      return;
                    }
                    const type = String(selectedEvent?.type ?? "").toUpperCase();
                    if (type) {
                      goToApplyChampionshipByEventType(type);
                    }
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
