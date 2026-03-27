import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import endpoints from '../api/endpoints';

const DAY_ORDER = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const DAY_LABEL = {
  sunday: 'Sunday',
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
};

const formatClassDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(undefined, { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
};

const getStatusLabel = (cls) => {
  if (cls?.isJoined) return 'Joined';
  return (cls?.status || 'scheduled')
    .toString()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

function StatusPill({ cls }) {
  const label = getStatusLabel(cls);
  const base = 'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold border';
  const isJoined = !!cls?.isJoined;
  const status = (cls?.status || '').toLowerCase();
  const tone =
    isJoined
      ? 'bg-emerald-500/15 text-emerald-100 border-emerald-400/40'
      : status === 'cancelled'
        ? 'bg-red-500/15 text-red-100 border-red-400/40'
        : status === 'completed'
          ? 'bg-slate-500/15 text-slate-100 border-slate-300/30'
          : 'bg-white/10 text-white/90 border-white/25';
  return <span className={`${base} ${tone}`}>{label}</span>;
}

/**
 * Shared “Make Your Bot” surface: week-wise class schedule from GET /classes/schedule
 * with register + join actions (same API contract as Member Dashboard).
 */
export function MakeYourBotSchedule({
  surfaceClassName = 'bg-[#0f172a]',
  scheduleHeading = 'Class Schedule',
}) {
  const [classSchedule, setClassSchedule] = useState(null);
  const [classLoading, setClassLoading] = useState(false);
  const [classError, setClassError] = useState('');
  const [registeringClassId, setRegisteringClassId] = useState(null);
  const [registerSuccessId, setRegisterSuccessId] = useState(null);
  const [registerError, setRegisterError] = useState('');
  const [expandedScheduleDay, setExpandedScheduleDay] = useState(null);

  const fetchClassSchedule = async () => {
    if (classLoading) return;
    setClassError('');
    setRegisterSuccessId(null);
    setRegisterError('');
    setClassLoading(true);
    try {
      const res = await axiosInstance.get(endpoints.classes.schedule);
      const data = res?.data;
      setClassSchedule(data || null);
    } catch (err) {
      setClassError(
        err?.response?.data?.message ||
          err?.message ||
          'Unable to load class schedule'
      );
      setClassSchedule(null);
    } finally {
      setClassLoading(false);
    }
  };

  useEffect(() => {
    fetchClassSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRegisterClass = async (classId) => {
    if (!classId || registeringClassId) return;
    setRegisterSuccessId(null);
    setRegisterError('');
    setRegisteringClassId(classId);
    try {
      await axiosInstance.post(endpoints.classes.register, {
        class_id: classId,
      });
      setRegisterSuccessId(classId);
    } catch (err) {
      setRegisterError(
        err?.response?.data?.message ||
          err?.message ||
          'Unable to register for this class'
      );
    } finally {
      setRegisteringClassId(null);
    }
  };

  const ClassCard = ({ cls, showDate = true }) => {
    if (!cls) return null;
    const canJoin = (cls?.isJoined || registerSuccessId === cls?._id) && !!cls?.zoomLink;
    const canRegister = !cls?.isJoined && registerSuccessId !== cls?._id;

    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5 shadow-sm hover:bg-white/10 transition-colors">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm sm:text-base font-semibold text-white/95 truncate">
                {cls.topic || 'Class'}
              </h4>
              <StatusPill cls={cls} />
            </div>
            <div className="mt-1 text-xs sm:text-sm text-white/80 space-y-0.5">
              <div className="truncate">
                <span className="text-white/60">Batch:</span> {cls.batchName || '—'}
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                {showDate && (
                  <span>
                    <span className="text-white/60">Date:</span> {formatClassDate(cls.date) || '—'}
                  </span>
                )}
                <span className="whitespace-nowrap">
                  <span className="text-white/60">Time:</span> {cls.startTime || '—'} – {cls.endTime || '—'}
                </span>
                {typeof cls.studentCount === 'number' && (
                  <span className="whitespace-nowrap">
                    <span className="text-white/60">Students:</span> {cls.studentCount}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 flex flex-col items-end gap-2">
            {canJoin && (
              <a
                href={cls.zoomLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-white/10 text-slate-50 px-3 py-1.5 text-[11px] sm:text-xs font-semibold border border-white/40 hover:bg-white/20 transition-colors"
              >
                Join via Zoom
              </a>
            )}
            {canRegister && (
              <button
                type="button"
                onClick={() => handleRegisterClass(cls._id)}
                disabled={registeringClassId === cls._id}
                className="inline-flex items-center justify-center rounded-full bg-white text-slate-900 px-3 py-1.5 text-[11px] sm:text-xs font-semibold shadow-md hover:bg-slate-100 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {registeringClassId === cls._id ? 'Registering...' : 'Register'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`rounded-xl sm:rounded-2xl overflow-hidden ${surfaceClassName} border border-white/10 shadow-xl min-h-[260px] sm:min-h-[340px] flex flex-col items-stretch justify-start p-6 sm:p-8 md:p-10`}
    >
      {classLoading && (
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed text-center">
          Loading...
        </p>
      )}

      {!classLoading && classError && (
        <p className="text-red-300 text-sm sm:text-base leading-relaxed text-center">
          {classError}
        </p>
      )}

      {!classLoading && !classError && classSchedule && (
        <div className="mt-6 w-full space-y-8">
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm sm:text-base font-semibold text-slate-100 text-left">
                {scheduleHeading}
              </h3>
            </div>

            {(() => {
              const dw = classSchedule?.dayWise || {};
              const daysWithData = DAY_ORDER.filter((dayKey) => Array.isArray(dw?.[dayKey]) && dw[dayKey].length > 0);

              if (daysWithData.length === 0) {
                return (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                    No classes scheduled for this week.
                  </div>
                );
              }

              return (
                <div className="space-y-2">
                  {daysWithData.map((dayKey) => {
                    const list = dw[dayKey];
                    const isOpen = expandedScheduleDay === dayKey;
                    return (
                      <div key={dayKey} className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setExpandedScheduleDay((prev) => (prev === dayKey ? null : dayKey))}
                          className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-left"
                        >
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-white/95">
                              {DAY_LABEL[dayKey] || dayKey}
                            </div>
                            <div className="text-xs text-white/60">
                              {list.length} {list.length === 1 ? 'class' : 'classes'}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0 text-white/80">
                            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </div>
                        </button>

                        {isOpen && (
                          <div className="px-4 pb-4">
                            <div className="mt-3 space-y-3">
                              {list
                                .slice()
                                .sort((a, b) => String(a?.startTime || '').localeCompare(String(b?.startTime || '')))
                                .map((cls) => (
                                  <ClassCard key={cls._id} cls={cls} showDate />
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </section>
        </div>
      )}

      {!classLoading && !classError && registerError && (
        <div className="mt-4 text-center text-red-300 text-xs sm:text-sm">
          {registerError}
        </div>
      )}
    </div>
  );
}
