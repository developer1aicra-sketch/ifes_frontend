import { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { INITIAL_DB } from "../constants/userData";
import { Cpu, Users, Copy, Check, UserPlus, Key, Share2, Link as LinkIcon, Building2, Plus, X, Trophy, ChevronRight, Edit2, Trash2, Send, Mail, Gamepad2, ToggleLeft, ToggleRight, Loader2, Shield, Crown, Search, LayoutGrid } from "lucide-react";
import {
  fetchClubsRequest,
  createClubRequest,
  fetchTeamsRequest,
  createTeamRequest,
  addSquadRequest,
  updateTeamRequest,
  updateSquadRequest,
  addMemberRequest,
  updateCaptainRequest,
  setActiveClub,
  selectClubs,
  selectTeams,
  selectIsSquadLoading,
  selectActiveClubId,
  selectSquadError,
  selectSquadSuccess,
  clearMessages,
} from "../app/squad/squadSlice";
import { fetchTeamDetails } from "../app/squad/squadApi";
import TeamFormModal from "./squad/TeamFormModal";
import MySquadView from "./squad/MySquadView";
import { selectReceivedOtp as selectUser } from "../app/auth/authSlice";
import { getActiveClubIdFromStorage, setActiveClubIdToStorage } from "../utils/squadStorage";
import { selectCompetitions, fetchCompetitionsRequest, selectIsCompetitionsLoading } from "../app/competition/competitionSlice";
import axiosInstance from "../api/axiosInstance";
import { getClubMembers, getClubMembersPaymentSuccess } from "../api/clubApi";
import { getBotsList } from "../api/botApi";
import { getTeamList } from "../api/teamApi";
import { deleteSquad } from "../api/squadApi";

export const SquadManager = ({
  setPage,
  user: propUser,
  initialEditSquad,
  onInitialEditSquadConsumed,
  initialCompetitionId,
  onInitialCompetitionConsumed,
  initialEventType,
  onInitialEventTypeConsumed,
}) => {
  const dispatch = useDispatch();
  const reduxUser = useSelector(selectUser);
  const clubs = useSelector(selectClubs);
  const teams = useSelector(selectTeams);
  const loading = useSelector(selectIsSquadLoading);
  const activeClubId = useSelector(selectActiveClubId);
  const reduxError = useSelector(selectSquadError);
  const reduxSuccess = useSelector(selectSquadSuccess);
  const competitions = useSelector(selectCompetitions) || [];
  const competitionsLoading = useSelector(selectIsCompetitionsLoading);
  const initialCompetitionAppliedRef = useRef(false);
  const initialEventTypeAppliedRef = useRef(false);
  const [seasonEventTypes, setSeasonEventTypes] = useState([]);
  const normalizeEventType = (t) => String(t || "").toUpperCase().trim();
  const normalizeZrcStateText = (v) => String(v ?? '').trim().toLowerCase();
  // Convert API date strings to a stable YYYY-MM-DD value for dropdown comparisons.
  const normalizeDateInputValue = (value) => {
    const s = String(value ?? '').trim();
    if (!s) return '';
    const dateOnlyMatch = s.match(/^(\d{4}-\d{2}-\d{2})/);
    if (dateOnlyMatch?.[1]) return dateOnlyMatch[1];
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return s;
    return d.toISOString().slice(0, 10);
  };

  // Use prop user or Redux user
  const user = propUser || reduxUser;
  const userId = user?.uid || user?.id || user?.userId;

  // Club management
  const [selectedClub, setSelectedClub] = useState(null);
  const [showClubModal, setShowClubModal] = useState(false);
  const [newClubName, setNewClubName] = useState('');
  const [newClubDescription, setNewClubDescription] = useState('');

  // Team management
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedBot, setSelectedBot] = useState(null);
  const [selectedPilot, setSelectedPilot] = useState(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [selectedCrew, setSelectedCrew] = useState([]);
  const [captain, setCaptain] = useState(null);
  const [selectedTeamForCaptain, setSelectedTeamForCaptain] = useState(null);
  const [competitionType, setCompetitionType] = useState('');
  const [selectedEventType, setSelectedEventType] = useState(null); // Track selected event type
  // ZRC event selection (used to resolve event_id for squad creation/management)
  const [zrcEventState, setZrcEventState] = useState('');
  const [zrcEventStartDate, setZrcEventStartDate] = useState(''); // YYYY-MM-DD (date input compatible)
  const [zrcEventEndDate, setZrcEventEndDate] = useState(''); // YYYY-MM-DD (date input compatible)
  // NRC/WRC event selection (event instance -> event_id from /event/list)
  const [selectedEventInstanceId, setSelectedEventInstanceId] = useState('');
  const [teamName, setTeamName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberData, setNewMemberData] = useState({ name: '', email: '', role: 'Member' });
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [clubMembers, setClubMembers] = useState([]);
  const [clubMembersCount, setClubMembersCount] = useState(0);
  const [clubMembersLoading, setClubMembersLoading] = useState(false);
  const [paymentSuccessMembers, setPaymentSuccessMembers] = useState([]);
  const [paymentSuccessCount, setPaymentSuccessCount] = useState(0);
  const [paymentSuccessLoading, setPaymentSuccessLoading] = useState(false);
  const [paymentSuccessError, setPaymentSuccessError] = useState('');
  /** Search query for filtering team members */
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  /** Captain for new team: club member from /clubmember/{_id} (use member.user_id._id as captain_id) */
  const [selectedCaptainForNewTeam, setSelectedCaptainForNewTeam] = useState(null);
  /** Team being edited in Team List (opens TeamFormModal in edit mode) */
  const [editingTeam, setEditingTeam] = useState(null);
  /** Bots fetched from API */
  const [bots, setBots] = useState([]);
  const [botsLoading, setBotsLoading] = useState(false);
  const [botsError, setBotsError] = useState('');
  /** Teams fetched from team/list API for captain selection */
  const [teamsList, setTeamsList] = useState([]);
  const [teamsListLoading, setTeamsListLoading] = useState(false);
  /** True after dispatching addSquadRequest; redirect to payment only on addSquadSuccess */
  const [pendingSquadSubmit, setPendingSquadSubmit] = useState(false);
  /** Tab: 'my_squad' | 'manage' */
  const [squadTab, setSquadTab] = useState('my_squad');
  /** Squad being edited in Manage tab: { clubId, teamId, squadData? }. When set, form is in edit mode and submit calls updateSquad. */
  const [editingSquad, setEditingSquad] = useState(null);
  /** Squad selected for delete confirmation modal (squad object or null). */
  const [squadToDelete, setSquadToDelete] = useState(null);
  const [deleteSquadLoading, setDeleteSquadLoading] = useState(false);
  /** Increment to trigger MySquadView to refetch squads list (e.g. after delete). */
  const [squadsRefreshTrigger, setSquadsRefreshTrigger] = useState(0);
  /** ID of squad just deleted; pass to MySquadView so it can clear detail view if that squad was selected. */
  const [deletedSquadId, setDeletedSquadId] = useState(null);

  // Competition configurations with specific bot requirements
  const COMPETITION_CONFIG = {
    'Innovation Contest': {
      min: 1,
      max: 10,
      requiresPilot: false,
      allowedBots: ['arduino', 'raspberry_pi', 'esp32'],
      requiredFeatures: ['programming', 'design'],
      allowedCategories: ['Innovation', 'Prototype']
    },
    'Robosoccer Challenge': {
      min: 3,
      max: 10,
      requiresPilot: true,
      allowedBots: ['soccer_bot', 'omni_wheel', 'rc_bot'],
      requiredFeatures: ['remote_control', 'kicking_mechanism'],
      allowedCategories: ['Sports', 'RC']
    },
    'BotCombat Challenge': {
      min: 1,
      max: 10,
      requiresPilot: true,
      allowedBots: ['combat_bot', 'sumo_bot', 'battle_bot'],
      requiredFeatures: ['armor', 'weapon_system'],
      allowedCategories: ['Combat', 'Battle']
    },
    'Robo Race Challenge': {
      min: 1,
      max: 10,
      requiresPilot: true,
      allowedBots: ['race_bot', 'rc_car', 'line_follower'],
      requiredFeatures: ['speed_control', 'navigation'],
      allowedCategories: ['Racing', 'RC']
    },
  };

  // Generate team join link (team-specific)
  const generateJoinLink = (teamId, inviteCode) => {
    // Use the current origin and add team join parameter with team ID
    const baseUrl = window.location.origin;
    const code = inviteCode || teamId;
    return `${baseUrl}?team_join=${code}&team_id=${teamId}`;
  };

  // Generate unique invitation code
  const generateInviteCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  // Fetch clubs on mount
  useEffect(() => {
    if (userId) {
      dispatch(fetchClubsRequest({ userId }));
    }
  }, [dispatch, userId]);

  // Fetch competitions on mount
  useEffect(() => {
    dispatch(fetchCompetitionsRequest());
  }, [dispatch]);

  // Fetch season event types (NRC/WRC etc.) so "Teams by Event" can show them even if competitions API omits them.
  useEffect(() => {
    let cancelled = false;

    const fetchSeason = async () => {
      try {
        const seasonId = "69ba3843c5a9ae9038c7630b";
        const res = await axiosInstance.get(`/season/get/${seasonId}`);
        const season = res?.data?.data ?? res?.data ?? {};
        const events = Array.isArray(season?.events) ? season.events : [];
        const types = events
          .map((e) => String(e?.type ?? "").toUpperCase())
          .filter(Boolean);
        if (!cancelled) setSeasonEventTypes([...new Set(types)].sort());
      } catch {
        if (!cancelled) setSeasonEventTypes([]);
      }
    };

    fetchSeason();
    return () => {
      cancelled = true;
    };
  }, []);

  const [zrcEvents, setZrcEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);

  // Fetch ZRC events to power the "Zonal Location" dropdown.
  // We use /event/list (source of truth): type + state + start_date + end_date + _id(event_id).
  useEffect(() => {
    let cancelled = false;

    const fetchEvents = async () => {
      try {
        const res = await axiosInstance.get(`/event/list`);
        const list = res?.data?.data ?? res?.data ?? [];
        const events = Array.isArray(list) ? list : [];
        const zrcOnly = events.filter((e) => normalizeEventType(e?.type) === 'ZRC');
        if (!cancelled) {
          setAllEvents(events);
          setZrcEvents(zrcOnly);
        }
      } catch {
        if (!cancelled) {
          setAllEvents([]);
          setZrcEvents([]);
        }
      }
    };

    fetchEvents();
    return () => {
      cancelled = true;
    };
  }, []);

  // Unique event types from competition API (group competitions by event.type)
  const uniqueEventTypes = useMemo(() => {
    if (!competitions?.length) return [];
    const eventTypes = competitions
      .map((c) => normalizeEventType(c.event?.type))
      .filter(Boolean);
    return [...new Set(eventTypes)].sort();
  }, [competitions]);

  const mergedEventTypes = useMemo(() => {
    const PRIORITY = ["PRC", "ZRC", "NRC", "WRC"];
    const set = new Set([...(uniqueEventTypes || []), ...(seasonEventTypes || [])]);
    const all = Array.from(set).map((t) => String(t || "").toUpperCase()).filter(Boolean);
    const priorityIndex = (t) => {
      const idx = PRIORITY.indexOf(t);
      return idx === -1 ? Number.POSITIVE_INFINITY : idx;
    };
    return all.sort((a, b) => {
      const ai = priorityIndex(a);
      const bi = priorityIndex(b);
      if (ai !== bi) return ai - bi;
      return a.localeCompare(b);
    });
  }, [seasonEventTypes, uniqueEventTypes]);

  // Group competitions by event.type
  const competitionsByEventType = useMemo(() => {
    if (!competitions?.length) return {};
    const grouped = {};
    competitions.forEach((comp) => {
      const eventType = normalizeEventType(comp.event?.type);
      if (eventType) {
        if (!grouped[eventType]) {
          grouped[eventType] = [];
        }
        grouped[eventType].push(comp);
      }
    });
    return grouped;
  }, [competitions]);

  // ZRC event instances derived from /event/list (State + Start/End -> event_id)
  const zrcEventInstances = useMemo(() => {
    if (!Array.isArray(zrcEvents) || zrcEvents.length === 0) return [];

    const instances = zrcEvents
      .map((ev) => {
        const stateRaw = ev?.state ?? ev?.zrc_state ?? ev?.region ?? ev?.zrc_region ?? '';
        const state = String(stateRaw).trim();

        const start_date = normalizeDateInputValue(ev?.start_date ?? ev?.startDate ?? '');
        const end_date = normalizeDateInputValue(ev?.end_date ?? ev?.endDate ?? '');
        const eventId = String(ev?._id ?? ev?.event_id ?? ev?.eventId ?? '').trim();

        return { state, start_date, end_date, eventId };
      })
      .filter((i) => i.state && i.start_date && i.end_date && i.eventId);

    // Deduplicate by normalized State + Start + End + event_id
    const seen = new Set();
    return instances.filter((i) => {
      const key = `${normalizeZrcStateText(i.state)}|${i.start_date}|${i.end_date}|${i.eventId}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [zrcEvents]);

  const resolvedZrcEvent = useMemo(() => {
    if (!selectedEventType || normalizeEventType(selectedEventType) !== 'ZRC') return null;
    if (!zrcEventState || !zrcEventStartDate || !zrcEventEndDate) return null;

    const stateN = normalizeZrcStateText(zrcEventState);
    const startN = normalizeDateInputValue(zrcEventStartDate);
    const endN = normalizeDateInputValue(zrcEventEndDate);

    return (
      zrcEventInstances.find(
        (i) =>
          normalizeZrcStateText(i.state) === stateN &&
          i.start_date === startN &&
          i.end_date === endN
      ) || null
    );
  }, [selectedEventType, zrcEventState, zrcEventStartDate, zrcEventEndDate, zrcEventInstances]);

  const resolvedZrcEventId = resolvedZrcEvent?.eventId || '';

  const formatZrcDateRangeLabel = (start, end) => {
    if (!start && !end) return '—';
    const s = start ? new Date(start) : null;
    const e = end ? new Date(end) : null;
    if (!s || !e || Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return `${start || ''} - ${end || ''}`.trim();

    const sameMonth = s.getMonth() === e.getMonth();
    const sameYear = s.getFullYear() === e.getFullYear();
    const year = s.getFullYear();
    const month = s.toLocaleString('en-IN', { month: 'long' });

    if (sameMonth && sameYear) {
      return `${s.getDate()}-${e.getDate()} ${month}, ${year}`;
    }

    const month1 = s.toLocaleString('en-IN', { month: 'long' });
    const month2 = e.toLocaleString('en-IN', { month: 'long' });
    return `${s.getDate()} ${month1} - ${e.getDate()} ${month2}, ${e.getFullYear()}`;
  };

  const zrcZonalLocationOptions = useMemo(() => {
    return (zrcEventInstances || [])
      .slice()
      .sort((a, b) => {
        // Sort by start date, then state name (stable & deterministic)
        const da = a.start_date ? new Date(a.start_date).getTime() : 0;
        const db = b.start_date ? new Date(b.start_date).getTime() : 0;
        if (da !== db) return da - db;
        return String(a.state || '').localeCompare(String(b.state || ''));
      })
      .map((i) => ({
        value: String(i.eventId),
        label: `${i.state} (${formatZrcDateRangeLabel(i.start_date, i.end_date)})`,
        instance: i,
      }));
  }, [zrcEventInstances]);

  const nrcWrcEventOptions = useMemo(() => {
    const t = normalizeEventType(selectedEventType);
    if (!(t === 'NRC' || t === 'WRC')) return [];

    return (allEvents || [])
      .filter((e) => normalizeEventType(e?.type) === t)
      .map((e) => {
        const id = String(e?._id ?? e?.event_id ?? e?.eventId ?? '').trim();
        const name = String(e?.name ?? e?.title ?? '').trim();
        const state = String(e?.state ?? e?.region ?? e?.city ?? '').trim();
        const start = normalizeDateInputValue(e?.start_date ?? e?.startDate ?? '');
        const end = normalizeDateInputValue(e?.end_date ?? e?.endDate ?? '');
        const when = start || end ? formatZrcDateRangeLabel(start, end) : '';
        const labelBase = name || state || `${t} Event`;
        return {
          value: id,
          label: when ? `${labelBase} (${when})` : labelBase,
        };
      })
      .filter((o) => o.value)
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [allEvents, selectedEventType]);

  // Set initial event type and competition when competitions are loaded
  useEffect(() => {
    if (competitions && competitions.length > 0) {
      // If no event type selected, select the first available (prefer competitions, else season)
      if (!selectedEventType && (uniqueEventTypes.length > 0 || seasonEventTypes.length > 0)) {
        const firstEventType = uniqueEventTypes[0] || seasonEventTypes[0];
        setSelectedEventType(firstEventType);

        // Set competition to first competition of the selected event type
        const firstCompetition = competitionsByEventType[firstEventType]?.[0];
        if (firstCompetition) {
          setCompetitionType(firstCompetition.name);
        }
      }
    }
  }, [competitions, uniqueEventTypes, seasonEventTypes, competitionsByEventType, selectedEventType]);
  // console.log("zrcZonalLocationOptions", zrcZonalLocationOptions)
  // Apply initialCompetitionId (from EventsPage click) once.
  useEffect(() => {
    if (!initialCompetitionId) return;
    if (initialCompetitionAppliedRef.current) return;
    if (!competitions?.length) return;

    const match = competitions.find(
      (c) => String(c?._id || c?.id || "") === String(initialCompetitionId)
    );
    if (!match) return;

    initialCompetitionAppliedRef.current = true;
    setSquadTab("manage");
    if (match?.event?.type) setSelectedEventType(normalizeEventType(match.event.type));
    if (match?.name) setCompetitionType(match.name);
    onInitialCompetitionConsumed?.();
  }, [competitions, initialCompetitionId, onInitialCompetitionConsumed]);

  // Apply initialEventType (NRC/WRC) once.
  useEffect(() => {
    const type = String(initialEventType || "").toUpperCase();
    if (!type) return;
    // If we also have a competitionId to apply, let that win.
    if (initialCompetitionId) return;
    if (initialEventTypeAppliedRef.current) return;
    if (!mergedEventTypes.includes(type)) return;

    initialEventTypeAppliedRef.current = true;
    setSquadTab("manage");
    setSelectedEventType(type);
    const firstCompetition = competitionsByEventType?.[type]?.[0];
    if (firstCompetition?.name) setCompetitionType(firstCompetition.name);
    onInitialEventTypeConsumed?.();
  }, [
    competitionsByEventType,
    initialEventType,
    mergedEventTypes,
    onInitialEventTypeConsumed,
  ]);

  // Update competition when event type changes
  useEffect(() => {
    if (selectedEventType && competitionsByEventType[selectedEventType]?.length > 0) {
      const firstCompetition = competitionsByEventType[selectedEventType][0];
      // Only update if current competition is not from this event type
      const currentComp = competitions.find(c => c.name === competitionType);
      if (!currentComp || normalizeEventType(currentComp.event?.type) !== normalizeEventType(selectedEventType)) {
        setCompetitionType(firstCompetition.name);
      }
    }
  }, [selectedEventType, competitionsByEventType, competitionType, competitions]);

  // Fetch bots from API
  useEffect(() => {
    const fetchBots = async () => {
      setBotsLoading(true);
      setBotsError('');
      try {
        const response = await getBotsList();
        if (response.data?.success && response.data?.data) {
          // Map API response to component bot structure
          const mappedBots = response.data.data
            .filter(bot => bot.isActive) // Only show active bots
            .map(bot => ({
              // bot_id: bot._id,
              name: bot.name,
              category: bot.competition_id?.name || 'Unknown',
              image: '🤖', // Default bot emoji, can be customized based on competition type
              specs: bot.specs || {},
              competition_id: bot.competition_id?._id,
              competition_name: bot.competition_id?.name,
              isActive: bot.isActive,
              createdAt: bot.createdAt,
              updatedAt: bot.updatedAt
            }));
          setBots(mappedBots);
        } else {
          setBotsError('Failed to fetch bots');
          setBots([]);
        }
      } catch (err) {
        console.error('Error fetching bots:', err);
        setBotsError(err.response?.data?.message || 'Failed to load bots');
        setBots([]);
      } finally {
        setBotsLoading(false);
      }
    };

    fetchBots();
  }, []);

  // Helper function to get competition ID from competitionType name
  const getCompetitionId = (competitionTypeName) => {
    if (!competitions || competitions.length === 0) return null;

    // Try to find competition by name (case-insensitive)
    const competition = competitions.find(
      (comp) => comp.name?.toLowerCase() === competitionTypeName?.toLowerCase() ||
        comp.title?.toLowerCase() === competitionTypeName?.toLowerCase()
    );

    return competition?.id || competition?._id || null;
  };

  // Unique categories from competition API (each competition has a `category` field, e.g. "Aerospace")
  const uniqueCategories = useMemo(() => {
    if (!competitions?.length) return [];
    const categories = competitions
      .map((c) => c.category)
      .filter(Boolean);
    return [...new Set(categories)].sort();
  }, [competitions]);

  // Current category for the Category dropdown (derived from selected competition)
  const selectedCategoryValue = useMemo(() => {
    if (!competitionType || !competitions?.length) return "";
    const comp = competitions.find(
      (c) =>
        (c.name || c.title || "").toString().toLowerCase() ===
        (competitionType || "").toString().toLowerCase()
    );
    return comp?.category ?? "";
  }, [competitions, competitionType]);

  // Restore active club from localStorage once (owner can play for only one club)
  useEffect(() => {
    if (!userId || !clubs?.length || activeClubId !== null) return;
    const stored = getActiveClubIdFromStorage(userId);
    if (stored && clubs.some(c => c.id === stored)) {
      dispatch(setActiveClub(stored));
    }
  }, [userId, clubs, dispatch, activeClubId]);

  // Auto-select first club if available
  useEffect(() => {
    if (clubs.length > 0 && !selectedClub) {
      setSelectedClub(clubs[0]);
    }
  }, [clubs, selectedClub]);

  // Fetch teams when club is selected
  useEffect(() => {
    if (selectedClub?.id) {
      dispatch(fetchTeamsRequest({ clubId: selectedClub.id }));
    }
  }, [dispatch, selectedClub?.id]);

  // Fetch club members when club is selected: GET /clubmember/{_id}
  const clubIdForMembers = selectedClub?.id ?? selectedClub?._id;
  useEffect(() => {
    if (!clubIdForMembers) {
      setClubMembers([]);
      setClubMembersCount(0);
      setMemberSearchQuery(''); // Reset search when club changes
      return;
    }
    let cancelled = false;
    setClubMembersLoading(true);
    getClubMembers(clubIdForMembers)
      .then((res) => {
        if (cancelled) return;
        const payload = res?.data;
        const raw = payload?.data ?? payload ?? [];
        const list = Array.isArray(raw) ? raw : [];
        setClubMembers(list);
        setClubMembersCount(typeof payload?.count === "number" ? payload.count : list.length);
      })
      .catch(() => {
        if (!cancelled) {
          setClubMembers([]);
          setClubMembersCount(0);
        }
      })
      .finally(() => {
        if (!cancelled) setClubMembersLoading(false);
      });
    return () => { cancelled = true; };
  }, [clubIdForMembers]);

  // Fetch payment-success members for the selected club: GET /clubmember/payment/success/{_id}
  useEffect(() => {
    if (!clubIdForMembers) {
      setPaymentSuccessMembers([]);
      setPaymentSuccessCount(0);
      setPaymentSuccessError('');
      return;
    }
    let cancelled = false;
    setPaymentSuccessLoading(true);
    setPaymentSuccessError('');
    getClubMembersPaymentSuccess(clubIdForMembers)
      .then((res) => {
        if (cancelled) return;
        const payload = res?.data;
        const raw = payload?.data ?? payload ?? [];
        const list = Array.isArray(raw) ? raw : [];
        setPaymentSuccessMembers(list);
        setPaymentSuccessCount(typeof payload?.count === "number" ? payload.count : list.length);
      })
      .catch((e) => {
        if (cancelled) return;
        setPaymentSuccessMembers([]);
        setPaymentSuccessCount(0);
        setPaymentSuccessError(e?.response?.data?.message || 'Failed to load payment success members');
      })
      .finally(() => {
        if (!cancelled) setPaymentSuccessLoading(false);
      });
    return () => { cancelled = true; };
  }, [clubIdForMembers]);

  const paymentSuccessByUserId = useMemo(() => {
    const map = new Map();
    for (const m of paymentSuccessMembers || []) {
      const uid = m?.user?._id ?? m?.user_id?._id ?? m?.user_id;
      if (uid) map.set(String(uid), m);
    }
    return map;
  }, [paymentSuccessMembers]);

  // Reset captain-for-new-team when club changes; default to current user if in club members
  useEffect(() => {
    if (!clubMembers.length) {
      setSelectedCaptainForNewTeam(null);
      return;
    }
    const uid = user?.uid || user?.id || user?.userId;
    const email = user?.email;
    const currentUserMember = clubMembers.find(
      (m) => {
        const mid = m.user_id?._id ?? m.user?._id ?? m.user_id;
        return mid === uid || mid === user?.id || (typeof m.user_id === 'string' && m.user_id === uid) ||
          (email && (m.user?.email === email || m.user_id?.email === email || m.emailId === email || m.email === email));
      }
    );
    setSelectedCaptainForNewTeam(currentUserMember ?? clubMembers[0] ?? null);
  }, [clubIdForMembers, clubMembers, user?.uid, user?.id, user?.userId, user?.email]);

  // When parent passes initialEditSquad (e.g. from navigation state), switch to Manage tab and set editing
  useEffect(() => {
    if (initialEditSquad?.clubId && initialEditSquad?.teamId) {
      setEditingSquad({ clubId: initialEditSquad.clubId, teamId: initialEditSquad.teamId });
      setSquadTab('manage');
      onInitialEditSquadConsumed?.();
    }
  }, [initialEditSquad?.clubId, initialEditSquad?.teamId, onInitialEditSquadConsumed]);

  // Prefill form when editing a squad: set club, then from squadData or fetched details set competition, team name, bot, captain, pilot, crew
  useEffect(() => {
    if (!editingSquad?.clubId || !editingSquad?.teamId) return;
    const club = clubs.find((c) => (c.id || c._id) === editingSquad.clubId);
    if (club) setSelectedClub(club);

    const applySquadData = (squad) => {
      if (!squad) return;

      // ----- Basic squad meta -----
      setTeamName(squad.teamName ?? squad.name ?? '');

      // selectedCategoryValue is derived from competitionType (useMemo), so set competition first
      const compId = squad.competition_id?._id ?? squad.competition_id ?? squad.competitionId;
      const compName =
        squad.competition ?? (competitions?.find((c) => (c._id || c.id) === compId)?.name);
      if (compName) setCompetitionType(compName);

      const eventType =
        squad.event?.type ??
        (compName && competitions?.find((c) => c.name === compName)?.event?.type);
      if (eventType) {
        setSelectedEventType(eventType);

        // Prefill ZRC event selection when available on squad payload
        if (eventType.toUpperCase() === 'ZRC') {
          const squadEvent = squad.event || {};
          const stateCandidate =
            squad.state ??
            squadEvent.state ??
            squadEvent.zrc_state ??
            squad.region ??
            squadEvent.region ??
            squadEvent.zrc_region ??
            squadEvent.zrcRegion ??
            '';
          const startCandidate =
            squad.start_date ??
            squadEvent.start_date ??
            squadEvent.startDate ??
            '';
          const endCandidate =
            squad.end_date ??
            squadEvent.end_date ??
            squadEvent.endDate ??
            '';

          const normalizedState = String(stateCandidate).trim();
          const normalizedStart = normalizeDateInputValue(startCandidate);
          const normalizedEnd = normalizeDateInputValue(endCandidate);

          if (normalizedState && normalizedStart && normalizedEnd) {
            const matchInstance = zrcEventInstances.find(
              (i) =>
                normalizeZrcStateText(i.state) === normalizeZrcStateText(normalizedState) &&
                i.start_date === normalizedStart &&
                i.end_date === normalizedEnd
            );
            setZrcEventState(matchInstance?.state ?? normalizedState);
            setZrcEventStartDate(normalizedStart);
            setZrcEventEndDate(normalizedEnd);
          } else {
            // Fallback: resolve state/start/end from squad event_id using the /event/list data.
            const squadEventId = squad.event_id ?? squad.eventId ?? squadEvent?._id ?? squadEvent?.id ?? '';
            if (squadEventId) {
              const matchInstance = zrcEventInstances.find(
                (i) => String(i.eventId) === String(squadEventId)
              );
              if (matchInstance) {
                setZrcEventState(matchInstance.state);
                setZrcEventStartDate(matchInstance.start_date);
                setZrcEventEndDate(matchInstance.end_date);
              }
            }
          }
        }
      }

      const config =
        compName && COMPETITION_CONFIG[compName]
          ? COMPETITION_CONFIG[compName]
          : COMPETITION_CONFIG['Robo Race Challenge'];

      // ----- Lineup: captain, pilot, crew, bot -----
      const lineup = squad.lineup || {};

      // Normalize lineup.members into an array of string ids (support both raw ids and populated objects)
      const rawMembers = Array.isArray(lineup.members) ? lineup.members : [];
      const memberIds = rawMembers
        .map((m) => {
          if (m == null) return null;
          if (typeof m === 'object') {
            return (
              m.user_id?._id ??
              m.user?._id ??
              m._id ??
              m.id ??
              m.user_id ??
              m.user
            );
          }
          return m;
        })
        .filter((id) => id != null)
        .map((id) => String(id));

      const pilotId = config?.requiresPilot ? memberIds[0] : null;
      const crewIds = config?.requiresPilot ? memberIds.slice(1) : memberIds;

      // Normalize captain id (can be an id or object)
      let capId = lineup.captain_id ?? squad.captain_id ?? squad.captainId;
      if (capId && typeof capId === 'object') {
        capId =
          capId._id ??
          capId.id ??
          capId.user_id?._id ??
          capId.user_id ??
          capId.user?._id ??
          capId.user;
      }

      const toLineupMember = (m) => {
        const id = m.user_id?._id ?? m.user?._id ?? m.user_id ?? m._id ?? m.id;
        const name =
          m.user?.fullName ??
          m.fullname ??
          m.user_id?.fullname ??
          m.user_id?.name ??
          m.name ??
          'Unknown';
        return { ...m, id, _id: m._id, name, user_id: m.user_id || m.user || { _id: id } };
      };

      // Resolve member by user id OR club member _id (API may return either)
      const findClubMemberById = (members, id) => {
        if (!id || !Array.isArray(members)) return null;
        const sid = String(id);
        return (
          members.find((m) => String(m.user_id?._id ?? m.user?._id ?? m.user_id ?? m._id ?? m.id ?? '') === sid) ??
          members.find((m) => String(m._id ?? m.id ?? '') === sid)
        );
      };

      // Build display member from populated squad response when club member not in list yet
      const toLineupMemberFromSquad = (raw) => {
        if (!raw || typeof raw !== 'object') return null;
        const id = raw.user_id?._id ?? raw.user?._id ?? raw._id ?? raw.id ?? raw.user_id ?? raw.user;
        if (!id) return null;
        const name =
          raw.user?.fullName ??
          raw.fullname ??
          raw.user_id?.fullname ??
          raw.user_id?.name ??
          raw.name ??
          'Unknown';
        return { ...raw, id, _id: raw._id, name, user_id: raw.user_id || raw.user || { _id: id } };
      };

      // Captain: resolve from club members or from populated squad response
      const capMember = capId != null ? findClubMemberById(clubMembers, capId) : null;
      if (capMember) {
        setCaptain(toLineupMember(capMember));
      } else if (capId != null) {
        const capRaw = rawMembers.find(
          (m) => typeof m === 'object' && String(m.user_id?._id ?? m._id ?? m.user_id ?? m.id ?? '') === String(capId)
        );
        if (capRaw) setCaptain(toLineupMemberFromSquad(capRaw));
        else setCaptain(null);
      } else {
        setCaptain(null);
      }

      // Pilot
      if (pilotId) {
        const pm = findClubMemberById(clubMembers, pilotId);
        if (pm) setSelectedPilot(toLineupMember(pm));
        else {
          const pilotRaw = rawMembers.find((m) => (typeof m === 'object' ? String(m.user_id?._id ?? m._id ?? m.user_id ?? m.id) : String(m)) === String(pilotId));
          if (pilotRaw && typeof pilotRaw === 'object') setSelectedPilot(toLineupMemberFromSquad(pilotRaw));
          else setSelectedPilot(null);
        }
      } else {
        setSelectedPilot(null);
      }

      // Crew: resolve each from club members or from populated response
      const resolvedCrew = crewIds.map((id) => {
        const cm = findClubMemberById(clubMembers, id);
        if (cm) return toLineupMember(cm);
        const raw = rawMembers.find((m) => (typeof m === 'object' ? String(m.user_id?._id ?? m._id ?? m.user_id ?? m.id) : String(m)) === String(id));
        return raw && typeof raw === 'object' ? toLineupMemberFromSquad(raw) : null;
      }).filter(Boolean);
      setSelectedCrew(resolvedCrew);

      // Normalize bot id (can be an id or object). Support both old shape (lineup.bot_id)
      // and new shape (top-level bot_id).
      // const rawBotId = squad.bot_id ?? lineup.bot_id ?? squad.lineup?.bot_id;
      const botId =
        rawBotId && typeof rawBotId === 'object'
          ? rawBotId.bot_id ?? rawBotId._id ?? rawBotId.id
          : rawBotId;

      if (botId && bots.length) {
        const bot = bots.find((b) => String(b.bot_id ?? b._id ?? b.id) === String(botId));
        if (bot) setSelectedBot(bot);
      }

      const syntheticTeam = {
        id: squad._id ?? squad.id,
        name: squad.teamName ?? squad.name,
        competition: compName,
        members: squad.members ?? [],
        captainId: capId,
      };
      setSelectedTeam(syntheticTeam);
    };

    if (editingSquad.squadData) {
      applySquadData(editingSquad.squadData);
      return;
    }
    let cancelled = false;
    fetchTeamDetails(editingSquad.clubId, editingSquad.teamId)
      .then((res) => {
        if (cancelled) return;
        const data = res?.data ?? res;
        const squad = data && typeof data === 'object' ? data : null;
        if (squad) {
          applySquadData(squad);
          setEditingSquad((prev) => (prev ? { ...prev, squadData: squad } : null));
        }
      })
      .catch(() => { });
    return () => { cancelled = true; };
  }, [editingSquad?.clubId, editingSquad?.teamId, editingSquad?.squadData, clubs, competitions, clubMembers, bots, zrcEventInstances]);

  // Fetch teams from team/list API for captain selection
  useEffect(() => {
    if (!clubIdForMembers) {
      setTeamsList([]);
      return;
    }
    let cancelled = false;
    setTeamsListLoading(true);
    getTeamList({ club_id: clubIdForMembers })
      .then((res) => {
        if (cancelled) return;
        const payload = res?.data;
        const raw = payload?.data ?? payload ?? [];
        const list = Array.isArray(raw) ? raw : [];
        setTeamsList(list);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('Failed to fetch teams list:', err);
          setTeamsList([]);
        }
      })
      .finally(() => {
        if (!cancelled) setTeamsListLoading(false);
      });
    return () => { cancelled = true; };
  }, [clubIdForMembers]);

  // Auto-select first team when competition changes (if no team selected or selected team doesn't match competition)
  // Skip when editing a squad so we don't overwrite prefilled form data
  useEffect(() => {
    if (editingSquad?.clubId && editingSquad?.teamId) return;

    if (selectedClub?.id && teams.length > 0) {
      const teamsForComp = teams.filter(t => t.competition === competitionType && t.clubId === selectedClub.id);

      // If we have teams for this competition
      if (teamsForComp.length > 0) {
        // If no team selected or selected team is not for this competition, select first team
        if (!selectedTeam || selectedTeam.competition !== competitionType || selectedTeam.clubId !== selectedClub.id) {
          const firstTeam = teamsForComp[0];
          setSelectedTeam(firstTeam);
          setTeamName(firstTeam.name);
          // Set captain if team has one
          if (firstTeam.captainId) {
            const captainMember = firstTeam.members?.find(m => m.id === firstTeam.captainId);
            if (captainMember) {
              setCaptain(captainMember);
            }
          }
          // Reset bot/pilot/crew selections when switching teams
          setSelectedBot(null);
          setSelectedPilot(null);
          setSelectedCrew([]);
        }
      } else {
        // No teams for this competition
        setSelectedTeam(null);
        setTeamName('');
        setCaptain(null);
        setSelectedTeamForCaptain(null);
        setSelectedBot(null);
        setSelectedPilot(null);
        setSelectedCrew([]);
      }
    } else if (selectedClub?.id && teams.length === 0) {
      setSelectedTeam(null);
      setTeamName('');
      setCaptain(null);
      setSelectedTeamForCaptain(null);
    }
  }, [editingSquad?.clubId, editingSquad?.teamId, teams, competitionType, selectedClub?.id]);

  // When managing ZRC teams, keep ZRC State/Start/End in sync with selected team's event_id (best-effort).
  // This prevents "event_id mismatch" when editing an existing squad.
  useEffect(() => {
    if (normalizeEventType(selectedEventType) !== 'ZRC') return;
    if (!selectedTeam) return;

    const teamEventId =
      selectedTeam.event_id ?? selectedTeam.eventId ?? selectedTeam.event?._id ?? selectedTeam.event?.id ?? '';
    if (!teamEventId) return;

    // If dropdown already resolves to the same event, don't clobber user selection.
    if (resolvedZrcEventId && String(teamEventId) === String(resolvedZrcEventId)) return;

    const matchComp = (competitions || []).find((c) => {
      const ev = c?.event || {};
      const eventId = ev?._id ?? ev?.event_id ?? ev?.eventId ?? ev?.id ?? c?.event_id ?? c?.eventId ?? '';
      return String(eventId) === String(teamEventId);
    });

    if (!matchComp?.event) return;

    const ev = matchComp.event;
    const stateCandidate = ev.state ?? ev.zrc_state ?? ev.region ?? ev.zrc_region ?? '';
    const start = normalizeDateInputValue(ev.start_date ?? ev.startDate ?? '');
    const end = normalizeDateInputValue(ev.end_date ?? ev.endDate ?? '');

    if (String(stateCandidate).trim() && start && end) {
      const matchInstance = zrcEventInstances.find(
        (i) =>
          normalizeZrcStateText(i.state) === normalizeZrcStateText(stateCandidate) &&
          i.start_date === start &&
          i.end_date === end
      );
      setZrcEventState(matchInstance?.state ?? String(stateCandidate).trim());
      setZrcEventStartDate(start);
      setZrcEventEndDate(end);
    }
  }, [selectedTeam, selectedEventType, competitions, resolvedZrcEventId, zrcEventInstances]);

  // Get teams grouped by event type for the selected club (returns arrays)
  const getTeamsByEventType = () => {
    if (!selectedClub) return {};
    const clubTeams = teams.filter(t => t.clubId === selectedClub.id);
    const grouped = {};

    // Group teams by event.type through competition_id
    clubTeams.forEach(team => {
      // Find the competition for this team
      const competition = competitions.find(
        comp => comp._id === team.competition_id ||
          comp._id === team.competition ||
          comp.name === team.competition
      );

      if (competition?.event?.type) {
        const eventType = normalizeEventType(competition.event.type);
        if (!grouped[eventType]) {
          grouped[eventType] = [];
        }
        grouped[eventType].push(team);
      }
    });

    return grouped;
  };

  // Get teams grouped by competition for the selected club (returns arrays) - kept for backward compatibility
  const getTeamsByCompetition = () => {
    if (!selectedClub) return {};
    const clubTeams = teams.filter(t => t.clubId === selectedClub.id);
    const grouped = {};
    Object.keys(COMPETITION_CONFIG).forEach(comp => {
      grouped[comp] = clubTeams.filter(t => t.competition === comp);
    });
    return grouped;
  };

  const teamsByCompetition = getTeamsByCompetition();
  const teamsByEventType = getTeamsByEventType();
  const clubTeamsCount = teams.filter(t => t.clubId === selectedClub?.id).length;

  // Filter *payment-success* members based on search query (Team Members panel should show only SUCCESS payments)
  const filteredClubMembers = useMemo(() => {
    if (!memberSearchQuery.trim()) {
      return paymentSuccessMembers;
    }

    const query = memberSearchQuery.toLowerCase().trim();
    return paymentSuccessMembers.filter((member) => {
      // Extract fullname and email for search (support API shape: user.fullName, user.email)
      const fullname =
        member.user?.fullName ||
        member.fullname ||
        member.user_id?.fullname ||
        member.user_id?.name ||
        member.name ||
        '';

      const emailId =
        member.user?.email ||
        member.emailId ||
        member.user_id?.emailId ||
        member.user_id?.email ||
        member.email ||
        '';

      const role = member.role || '';

      // Search in fullname, emailId, and role
      return (
        fullname.toLowerCase().includes(query) ||
        emailId.toLowerCase().includes(query) ||
        role.toLowerCase().includes(query)
      );
    });
  }, [paymentSuccessMembers, memberSearchQuery]);

  // Get teams for current competition
  const teamsForCurrentCompetition = teamsByCompetition[competitionType] || [];

  // Get teams for current event type
  const getTeamsForEventType = (eventType) => {
    return teamsByEventType[eventType] || [];
  };

  // Handle Redux error and success messages for team creation
  useEffect(() => {
    if (reduxError) {
      setError(reduxError);
      if (pendingSquadSubmit) setPendingSquadSubmit(false);
      // Clear Redux error after showing it
      setTimeout(() => {
        dispatch(clearMessages());
      }, 5000);
    }
  }, [reduxError, dispatch, pendingSquadSubmit]);

  useEffect(() => {
    if (reduxSuccess) {
      setSuccess(reduxSuccess);
      if (pendingSquadSubmit) {
        setPage('payment');
        setPendingSquadSubmit(false);
      }
      // Clear Redux success after showing it
      setTimeout(() => {
        dispatch(clearMessages());
      }, 5000);
    }
  }, [reduxSuccess, dispatch, pendingSquadSubmit]);

  // Handle team join from URL (team-specific invite links)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const teamCode = urlParams.get('team_join');
    const teamIdFromUrl = urlParams.get('team_id');

    if (teamCode && user && user.uid) {
      setInviteCode(teamCode.toUpperCase());

      // If team_id is provided, try to find and select the team
      if (teamIdFromUrl && selectedClub) {
        const teamFromUrl = teams.find(t => t.id === teamIdFromUrl && t.clubId === selectedClub.id);
        if (teamFromUrl) {
          setSelectedTeam(teamFromUrl);
          setCompetitionType(teamFromUrl.competition);
          setSuccess(`Found invitation for team "${teamFromUrl.name}"! Click "Join Team" to accept.`);
        } else {
          setSuccess(`Found team invitation! Click "Join Team" to accept.`);
        }
      } else {
        setSuccess(`Found team invitation! Click "Join Team" to accept.`);
      }

      // Clean URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [user, teams, selectedClub]);

  // Get available bots - show all bots from API, optionally filter by competition
  const getAvailableBots = () => {
    // If no bots loaded from API yet, return empty array
    if (bots.length === 0 && !botsLoading) {
      return [];
    }

    // If bots are still loading, return empty array
    if (botsLoading) {
      return [];
    }

    // Show all bots from API - frontend architecture: display all available bots
    // Users can see all bots regardless of competition filter
    return bots;
  };

  const currentConfig = COMPETITION_CONFIG[competitionType] || COMPETITION_CONFIG['Robo Race Challenge'];
  const totalTeamMembers = 1 + (selectedPilot ? 1 : 0) + selectedCrew.length;

  /**
   * Get member's user _id for lineup.members[] payload.
   * Prefers user_id._id so backend receives consistent user refs; falls back to _id/id.
   */
  const getMemberIdForPayload = (person) => {
    if (!person) return null;
    const raw =
      person.user_id?._id ?? person.user_id ?? person.user?._id ?? person.user ?? person._id ?? person.id;
    return raw != null ? String(raw) : null;
  };

  /**
   * Builds payload for POST /squad/add — result shape:
   * { club_id, category, teamName, event_id, competition_id, bot_id, lineup: { captain_id, members }, entry_fee }
   * lineup.members = array of member _id only (strings).
   */
  const buildSquadAddPayload = () => {
    const club_id = String(selectedClub?.id ?? selectedClub?._id ?? '');
    const selectedCompByName = competitions?.find(
      (c) =>
        (c.name || c.title || '').toString().toLowerCase() ===
        (competitionType || '').toString().toLowerCase()
    );
    const activeComp =
      normalizeEventType(selectedEventType) === 'ZRC' && resolvedZrcEvent?.competition
        ? resolvedZrcEvent.competition
        : selectedCompByName;

    const competition_id = String(
      activeComp?._id ?? activeComp?.id ?? getCompetitionId(competitionType) ?? ''
    );

    const normalizedEventType = normalizeEventType(selectedEventType);
    const event_id =
      normalizedEventType === 'ZRC'
        ? (resolvedZrcEvent?.eventId ? String(resolvedZrcEvent.eventId) : '')
        : (normalizedEventType === 'NRC' || normalizedEventType === 'WRC')
          ? String(selectedEventInstanceId || '')
          : (String(activeComp?.event?._id ?? activeComp?.event_id ?? getCompetitionId(competitionType) ?? '') ||
            competition_id);

    const category = String(selectedCategoryValue || activeComp?.category || 'Senior');
    // Prefer form state (user-edited name) over selectedTeam so squad name updates on edit
    const teamNamePayload = String(
      (teamName ?? selectedTeam?.name ?? selectedTeam?.teamName ?? '').trim() || 'Team'
    );
    const bot_id = String(selectedBot?.bot_id ?? selectedBot?._id ?? selectedBot?.id ?? '');
    const captain_id = String(
      captain?.user_id?._id ?? captain?.user_id ?? captain?._id ?? captain?.id ?? ''
    );
    const pilotId = getMemberIdForPayload(selectedPilot);
    const crewIds = (selectedCrew || [])
      .map(getMemberIdForPayload)
      .filter((id) => id != null);
    const members = pilotId ? [pilotId, ...crewIds] : crewIds;
    const entry_fee =
      Number(activeComp?.entry_fee ?? activeComp?.entryFee ?? 500) || 500;

    return {
      club_id,
      category,
      teamName: teamNamePayload,
      event_id,
      competition_id,
      bot_id,
      lineup: {
        captain_id,
        members,
      },
      entry_fee,
    };
  };

  // Create a new club
  const handleCreateClub = () => {
    if (!newClubName.trim()) {
      setError('Please enter a club name');
      return;
    }

    const userId = user?.uid || user?.id || user?.userId;
    const userName = user?.name || user?.full_name || user?.fullName || 'Unknown';

    if (!userId) {
      setError('User information is missing. Please log in again.');
      return;
    }

    dispatch(createClubRequest({
      name: newClubName,
      description: newClubDescription,
      ownerId: userId,
      ownerName: userName,
    }));

    const createdClubName = newClubName;
    setNewClubName('');
    setNewClubDescription('');
    setShowClubModal(false);
    setSuccess(`Club "${createdClubName}" created successfully!`);

    // Refresh clubs list after creation
    setTimeout(() => {
      const userId = user?.uid || user?.id || user?.userId;
      if (userId) {
        dispatch(fetchClubsRequest({ userId }));
      }
    }, 500);

    // Clear success message after 5 seconds
    setTimeout(() => setSuccess(''), 5000);
  };

  // Create a new team for selected competition
  const createTeam = () => {
    if (!teamName.trim()) {
      setError('Please enter a team name');
      return;
    }

    if (!selectedClub) {
      setError('Please select a club first');
      return;
    }

    if (!user || !user.uid) {
      setError('User information is missing. Please log in again.');
      return;
    }

    // Check for duplicate team name in the same competition (optional - can be removed if you want exact duplicates)
    const duplicateTeam = teamsForCurrentCompetition.find(
      t => t.name.toLowerCase().trim() === teamName.toLowerCase().trim()
    );
    if (duplicateTeam) {
      setError(`A team named "${teamName}" already exists for ${competitionType}. Please use a different name.`);
      return;
    }

    const userId = user?.uid || user?.id || user?.userId;
    const userName = user?.name || user?.full_name || user?.fullName || 'Unknown';

    // Competition ID optional for /squad/add; include when available
    const competitionId = getCompetitionId(competitionType);
    if (!competitionId) {
      console.warn('Competition not found for:', competitionType, '- sending team create without competition_id');
    }

    // club_id from selected club (from /club/my/get)
    const clubIdForApi = selectedClub.id ?? selectedClub._id;
    // captain_id: user_id can be populated { _id } or a string id reference
    const captainIdFromClubMember =
      selectedCaptainForNewTeam?.user_id?._id ??
      selectedCaptainForNewTeam?.user_id ??
      selectedCaptainForNewTeam?._id;
    if (!captainIdFromClubMember) {
      if (!clubMembers.length) {
        setError('No club members loaded. Wait for the list to load or add members to the club first.');
      } else if (!selectedCaptainForNewTeam) {
        setError('Please select a captain from the club members list.');
      } else {
        setError('Captain ID could not be read from the selected member. Try selecting another member as captain.');
      }
      return;
    }

    // Clear any previous errors
    setError('');

    const selectedCompByName = competitions?.find(
      (c) =>
        (c.name || c.title || '').toString().toLowerCase() ===
        (competitionType || '').toString().toLowerCase()
    );

    if (normalizeEventType(selectedEventType) === 'ZRC') {
      // For ZRC we must resolve event_id using the Zonal Location selection.
      if (!zrcEventState || !zrcEventStartDate || !zrcEventEndDate || !resolvedZrcEventId) {
        setError('Please select a ZRC Zonal Location first.');
        return;
      }
    }
    if (['NRC', 'WRC'].includes(normalizeEventType(selectedEventType))) {
      if (!String(selectedEventInstanceId || '').trim()) {
        setError('Please select an event (NRC/WRC) first.');
        return;
      }
    }

    const activeComp =
      normalizeEventType(selectedEventType) === 'ZRC' && resolvedZrcEvent?.competition
        ? resolvedZrcEvent.competition
        : selectedCompByName;

    const competitionIdForApi = String(activeComp?._id ?? activeComp?.id ?? competitionId ?? '');

    const normalizedEventType = normalizeEventType(selectedEventType);
    const event_id =
      normalizedEventType === 'ZRC'
        ? String(resolvedZrcEventId || '')
        : (normalizedEventType === 'NRC' || normalizedEventType === 'WRC')
          ? String(selectedEventInstanceId || '')
          : (String(activeComp?.event?._id ?? activeComp?.event_id ?? competitionIdForApi ?? '') || competitionIdForApi);

    const category = String(selectedCategoryValue || activeComp?.category || 'Senior');
    const pilotId = getMemberIdForPayload(selectedPilot);
    const crewIds = (selectedCrew || []).map(getMemberIdForPayload).filter(Boolean);
    const members = pilotId ? [pilotId, ...crewIds] : crewIds;
    const entry_fee =
      Number(activeComp?.entry_fee ?? activeComp?.entryFee ?? 500) || 500;

    const teamNameTrimmed = teamName.trim();
    if (!teamNameTrimmed) {
      setError('Team name is required.');
      return;
    }
    if (!clubIdForApi) {
      setError('Club is required. Please select a club.');
      return;
    }

    // Required: club_id, teamName, captain_id — ensure they are passed successfully
    const fullPayload = {
      club_id: String(clubIdForApi),
      category,
      teamName: teamNameTrimmed,
      event_id,
      competition_id: competitionIdForApi,
      // bot_id: String(selectedBot?.bot_id ?? selectedBot?._id ?? selectedBot?.id ?? ''),
      // We keep captain_id at top-level for compatibility with older validations.
      captain_id: String(captainIdFromClubMember),
      lineup: {
        captain_id: String(captainIdFromClubMember),
        members,
      },
      entry_fee,
    };

    const payload = {
      clubId: clubIdForApi,
      teamData: fullPayload,
    };

    console.log('🚀 Creating team - Dispatching with full payload (club_id, teamName, captain_id required):', payload);

    dispatch(createTeamRequest(payload));

    console.log('✅ createTeamRequest action dispatched successfully');

    // Clear team name input immediately for better UX
    const createdTeamName = teamName;
    setTeamName('');

    // Refresh teams list after creation (Redux saga will handle success/error)
    setTimeout(() => {
      if (selectedClub?.id) {
        dispatch(fetchTeamsRequest({ clubId: selectedClub.id }));
      }
    }, 1000);
  };

  const handleEditTeam = (team) => {
    setEditingTeam(team);
  };

  const handleUpdateTeamSubmit = (formData) => {
    if (!editingTeam || !selectedClub) return;
    const clubId = selectedClub.id ?? selectedClub._id;
    const teamId = editingTeam.id ?? editingTeam._id;
    dispatch(
      updateTeamRequest({
        clubId,
        teamId,
        teamData: {
          ...formData,
          members: editingTeam.members ?? [],
          captainId: editingTeam.captainId ?? editingTeam.captain_id ?? null,
        },
      })
    );
    setEditingTeam(null);
  };

  const handleCloseEditModal = () => {
    setEditingTeam(null);
  };

  const handleConfirmDeleteSquad = () => {
    if (!squadToDelete) return;
    const squadId = squadToDelete._id ?? squadToDelete.id;
    const clubId = squadToDelete.club_id ?? squadToDelete.clubId ?? selectedClub?.id ?? selectedClub?._id;
    if (!squadId) {
      setError('Squad ID is missing');
      return;
    }
    setDeleteSquadLoading(true);
    setError('');
    deleteSquad(squadId)
      .then(() => {
        setSquadToDelete(null);
        setDeletedSquadId(squadId);
        setSuccess('Squad deleted successfully.');
        if (editingSquad?.teamId === squadId) {
          setEditingSquad(null);
          setSelectedTeam(null);
          setTeamName('');
        }
        if (clubId) dispatch(fetchTeamsRequest({ clubId }));
        setSquadsRefreshTrigger((t) => t + 1);
      })
      .catch((err) => {
        const msg = err.response?.data?.message || err.message || 'Failed to delete squad';
        setError(msg);
      })
      .finally(() => setDeleteSquadLoading(false));
  };

  // Add member to team
  const handleAddMember = () => {
    if (!newMemberData.name.trim() || !newMemberData.email.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    if (!selectedTeam || !selectedClub) {
      setError('Please select a team first');
      return;
    }

    // Check if member already exists
    const memberExists = selectedTeam.members?.some(m => m.email === newMemberData.email);
    if (memberExists) {
      setError('This member is already in the team');
      return;
    }

    dispatch(addMemberRequest({
      clubId: selectedClub.id,
      teamId: selectedTeam.id,
      memberData: {
        ...newMemberData,
        id: Date.now().toString(),
        joinedAt: new Date().toISOString()
      }
    }));

    setNewMemberData({ name: '', email: '', role: 'Member' });
    setShowAddMemberModal(false);
    setSuccess('Member added successfully!');
  };

  // Update captain
  const handleUpdateCaptain = (memberId) => {
    if (!selectedTeam || !selectedClub) return;

    dispatch(updateCaptainRequest({
      clubId: selectedClub.id,
      teamId: selectedTeam.id,
      captainId: memberId
    }));

    const captainMember = selectedTeam.members?.find(m => m.id === memberId);
    if (captainMember) {
      setCaptain(captainMember);
    }
    setSuccess('Captain updated successfully!');

    // Refresh teams to get updated captain
    setTimeout(() => {
      if (selectedClub?.id) {
        dispatch(fetchTeamsRequest({ clubId: selectedClub.id }));
      }
    }, 500);
  };

  // Join a team using invitation code
  const joinTeam = () => {
    if (!inviteCode.trim()) {
      setError('Please enter an invitation code');
      return;
    }

    if (!user || !user.uid) {
      setError('User information is missing. Please log in again.');
      return;
    }

    if (!selectedClub) {
      setError('Please select a club first');
      return;
    }

    const teamToJoin = teams.find(team =>
      (team.inviteCode === inviteCode.toUpperCase() || team.id === inviteCode) &&
      team.clubId === selectedClub.id
    );

    if (!teamToJoin) {
      setError('Invalid invitation code or team not found in this club');
      return;
    }

    const userId = user?.uid || user?.id || user?.userId;
    if (teamToJoin.members?.some(member => member.id === userId || member.uid === userId)) {
      setError('You are already a member of this team');
      return;
    }

    if (teamToJoin.members?.length >= 15) {
      setError('Team is full');
      return;
    }

    // Add member to team via Redux
    dispatch(addMemberRequest({
      clubId: selectedClub.id,
      teamId: teamToJoin.id,
      memberData: {
        id: userId,
        uid: userId,
        name: user.name || user.full_name || 'Unknown',
        email: user.email || '',
        role: 'Member',
        joinedAt: new Date().toISOString()
      }
    }));

    setSuccess(`Successfully joined team: ${teamToJoin.name}`);
    setInviteCode('');
    setShowInviteModal(false);
  };

  // Copy join link to clipboard (team-specific)
  const copyJoinLink = (team = null) => {
    const teamToUse = team || selectedTeam;
    if (!teamToUse) return;

    const link = generateJoinLink(teamToUse.id, teamToUse.inviteCode);
    navigator.clipboard.writeText(link);
    setCopied(true);
    setSuccess(`Join link for "${teamToUse.name}" copied to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  // Copy invite code to clipboard
  const copyInviteCode = (team = null) => {
    const teamToUse = team || selectedTeam;
    if (!teamToUse) return;

    const code = teamToUse.inviteCode || teamToUse.id;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setSuccess(`Invite code "${code}" copied to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  // Share via social media or other methods (team-specific)
  const shareTeamLink = async (team = null) => {
    const teamToUse = team || selectedTeam;
    if (!teamToUse) return;

    const link = generateJoinLink(teamToUse.id, teamToUse.inviteCode);
    const shareData = {
      title: `Join my team: ${teamToUse.name}`,
      text: `Join ${teamToUse.name} for the ${competitionType}! Use this link to join my team.`,
      url: link,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setSuccess(`Invite link for "${teamToUse.name}" shared successfully!`);
      } else {
        // Fallback to copying link
        copyJoinLink(teamToUse);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.log('Error sharing:', err);
        copyJoinLink(teamToUse);
      }
    }
  };

  // Send invite via email (team-specific)
  const handleSendInvite = async (team = null, email = null) => {
    const teamToUse = team || selectedTeam;
    const emailToUse = email || inviteEmail;

    if (!emailToUse || !teamToUse) {
      setError('Please enter an email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailToUse)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setSending(true);
      // TODO: call your API here
      // await sendTeamInvite({ 
      //   email: emailToUse, 
      //   teamId: teamToUse.id,
      //   teamName: teamToUse.name,
      //   competition: competitionType,
      //   inviteLink: generateJoinLink(teamToUse.id, teamToUse.inviteCode)
      // });

      setInviteEmail("");
      setSuccess(`Invitation sent to ${emailToUse} for team "${teamToUse.name}"!`);
      setTimeout(() => {
        setShowInviteModal(false);
        setSuccess('');
      }, 3000);
    } catch (error) {
      console.error(error);
      setError('Failed to send invite. Please try again.');
    } finally {
      setSending(false);
    }
  };

  // Filter team members for crew selection
  const availableTeamMembers = selectedTeam && selectedTeam.members ?
    selectedTeam.members.filter(member =>
      member.id !== (selectedPilot?.id) &&
      !selectedCrew.some(crew => crew.id === member.id) &&
      member.id !== (captain?.id)
    ) : [];

  // Check if user is captain or owner
  const isCaptain = selectedTeam?.captainId === userId;
  const isOwner = selectedTeam?.ownerId === userId || selectedClub?.ownerId === userId;
  const canManageTeam = isCaptain || isOwner;

  // Club owner: play for one club only; switch active (playing) vs inactive (manage only)
  const handleSetActiveClub = (clubId) => {
    dispatch(setActiveClub(clubId));
    setActiveClubIdToStorage(userId, clubId);
    setSuccess(clubId ? 'Club set as active for play. You can still manage all clubs.' : 'Club set to manage-only.');
    setError('');
    setTimeout(() => setSuccess(''), 4000);
  };

  const handleCrewSelect = (member) => {
    if (selectedCrew.some(m => m.id === member.id)) {
      setSelectedCrew(selectedCrew.filter(m => m.id !== member.id));
    } else if (totalTeamMembers < currentConfig.max) {
      setSelectedCrew([...selectedCrew, member]);
    }
  };

  /**
   * When user clicks a member card, add them to Pilot (if slot empty) or next Crew slot.
   * Works regardless of team selection so the lineup slots always update; team is required only for Submit.
   */
  const handleMemberClick = (member) => {
    const fullname =
      member.user?.fullName ||
      member.fullname ||
      member.user_id?.fullname ||
      member.user_id?.name ||
      member.name ||
      'Unknown';
    const rawUserId = member.user_id?._id ?? member.user?._id ?? member.user_id ?? member._id ?? member.id;
    const id = rawUserId != null ? String(rawUserId) : String(member._id ?? member.id ?? '');
    const lineupMember = {
      id,
      _id: member._id ?? id,
      name: fullname,
      role: member.role || 'Member',
      user_id: member.user_id || (typeof member.user_id === 'string' ? { _id: member.user_id } : { _id: id }),
    };
    setError('');

    const isAlreadyPilot = selectedPilot && String(selectedPilot.id) === id;
    const isAlreadyCrew = selectedCrew.some((m) => String(m.id) === id);

    if (isAlreadyPilot) {
      setSelectedPilot(null);
      return;
    }
    if (isAlreadyCrew) {
      setSelectedCrew(selectedCrew.filter((m) => String(m.id) !== id));
      return;
    }
    if (currentConfig.requiresPilot && !selectedPilot) {
      setSelectedPilot(lineupMember);
      if (!selectedTeam && selectedClub && competitionType) {
        const teamsForComp = teams.filter(
          (t) =>
            (t.clubId === selectedClub.id || t.club_id === selectedClub.id) &&
            (t.competition === competitionType || t.competition_id === getCompetitionId(competitionType))
        );
        if (teamsForComp.length > 0) setSelectedTeam(teamsForComp[0]);
      }
      return;
    }
    if (totalTeamMembers < currentConfig.max) {
      setSelectedCrew([...selectedCrew, lineupMember]);
      if (!selectedTeam && selectedClub && competitionType) {
        const teamsForComp = teams.filter(
          (t) =>
            (t.clubId === selectedClub.id || t.club_id === selectedClub.id) &&
            (t.competition === competitionType || t.competition_id === getCompetitionId(competitionType))
        );
        if (teamsForComp.length > 0) setSelectedTeam(teamsForComp[0]);
      }
    }
  };

  const handleSubmit = () => {
    const isEditMode = !!editingSquad?.clubId && !!editingSquad?.teamId;
    if (!isEditMode && !selectedTeam) {
      setError('Please create or select a team first');
      return;
    }
    if (!selectedBot) {
      setError('Please select a bot');
      return;
    }
    if (currentConfig.requiresPilot && !selectedPilot) {
      setError('This competition requires a pilot');
      return;
    }
    if (totalTeamMembers < currentConfig.min) {
      setError(`Minimum ${currentConfig.min} team members required`);
      return;
    }
    if (!captain) {
      setError('Please select a captain');
      return;
    }

    // Normalize IDs using the same logic as squad payload to avoid type/shape mismatches
    const captainPayloadId = getMemberIdForPayload(captain);

    const isCaptainInTeam =
      !!captainPayloadId &&
      Array.isArray(selectedTeam?.members) &&
      selectedTeam.members.some((member) => getMemberIdForPayload(member) === captainPayloadId);

    // Only enforce "captain must be a team member" on create flow.
    // For updates, allow editing existing squads even if historical data
    // doesn't strictly match current lineup rules.
    if (!isEditMode && !isCaptainInTeam) {
      setError('Captain must be a team member');
      return;
    }
    if (!selectedClub) {
      setError('Please select a club');
      return;
    }

    const squadPayload = buildSquadAddPayload();

    if (!squadPayload.club_id) {
      setError('Club ID is required. Please select a club.');
      return;
    }
    if (!(squadPayload.teamName && squadPayload.teamName.trim())) {
      setError('Team name is required.');
      return;
    }
    if (!squadPayload.lineup.captain_id) {
      setError('Captain ID is required. Please select a captain.');
      return;
    }
    if (!squadPayload.competition_id) {
      setError('Competition not found. Please select a valid competition.');
      return;
    }
    if (normalizeEventType(selectedEventType) === 'ZRC') {
      if (!resolvedZrcEventId) {
        setError('Please select a ZRC Zonal Location first.');
        return;
      }
    }
    if (!squadPayload.event_id) {
      setError('Event ID is missing. Please select a valid event.');
      return;
    }
    if (!squadPayload.bot_id) {
      setError('Bot ID is missing. Please reselect the bot.');
      return;
    }

    setError('');
    if (isEditMode) {
      // PUT /squad/update/{_id}: teamId is the squad _id
      const squadId = editingSquad.teamId ?? editingSquad.squadData?._id ?? editingSquad.squadData?.id;
      const clubIdToRefresh = editingSquad.clubId;
      dispatch(
        updateSquadRequest({
          clubId: editingSquad.clubId,
          teamId: squadId,
          teamData: squadPayload,
        })
      );
      setEditingSquad(null);
      setSuccess('Squad updated successfully.');
      if (clubIdToRefresh) {
        dispatch(fetchTeamsRequest({ clubId: clubIdToRefresh }));
      }
      return;
    }

    setPendingSquadSubmit(true);
    dispatch(addSquadRequest(squadPayload));

    const competitionEntry = {
      id: Date.now().toString(),
      competition: competitionType,
      bot: selectedBot,
      pilot: selectedPilot,
      crew: selectedCrew,
      captain: captain,
      teamId: selectedTeam.id,
      teamName: selectedTeam.name,
      entryFee: squadPayload.entry_fee,
      status: 'pending_payment',
      registeredAt: new Date().toISOString(),
    };
    localStorage.setItem('currentRegistration', JSON.stringify(competitionEntry));
  };


  // Update captain dropdown when team members change
  useEffect(() => {
    if (selectedTeam && selectedTeam.members) {
      const captainMember = selectedTeam.members.find(m => m.id === selectedTeam.captainId);
      if (captainMember) {
        setCaptain(captainMember);
      }
    }
  }, [selectedTeam]);

  const availableBots = getAvailableBots();

  const clubIdForMySquad = selectedClub?.id ?? selectedClub?._id;

  return (
    <div className="animate-fadeIn p-6">
      <button
        onClick={() => setPage('dashboard')}
        className="text-slate-500 text-sm mb-4 hover:text-white"
      >
        ← Back to Command Center
      </button>

      {/* My Squad / Manage tabs */}
      <div className="flex gap-1 p-1 mb-6 rounded-xl bg-slate-900/80 border border-slate-700 w-fit">
        <button
          type="button"
          onClick={() => setSquadTab('my_squad')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${squadTab === 'my_squad'
            ? 'bg-slate-700 text-white shadow'
            : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
        >
          <Users size={18} />
          Championship
        </button>
        <button
          type="button"
          onClick={() => setSquadTab('manage')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${squadTab === 'manage'
            ? 'bg-slate-700 text-white shadow'
            : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
        >
          <LayoutGrid size={18} />
          Apply Championship
        </button>
      </div>

      {squadTab === 'my_squad' && (
        <MySquadView
          clubId={clubIdForMySquad}
          clubs={clubs}
          squadsRefreshTrigger={squadsRefreshTrigger}
          onClubChange={(id) => setSelectedClub(clubs.find((c) => (c.id || c._id) === id) || null)}
          onEditSquad={(squad, clubId) => {
            setEditingSquad({
              clubId: clubId || clubIdForMySquad,
              teamId: squad._id ?? squad.id,
              squadData: squad,
            });
            setSquadTab('manage');
          }}
          onDeleteSquad={(squad) => setSquadToDelete(squad)}
          deletedSquadId={deletedSquadId}
          onDeletedSquadIdConsumed={() => setDeletedSquadId(null)}
        />
      )}

      {squadTab === 'manage' && (
        <>
          {/* Club Selection Section */}


          {/* Create Club Modal */}


          {/* Add Member & Invite Member Section */}


          {/* Team Creation/Join Section */}
          <div className="bg-slate-900 border hidden border-slate-700 rounded-xl p-6 mb-6 shadow-lg hidden">
            <div className="flex justify-between items-center mb-5">
              {teamsForCurrentCompetition.length > 0 && (
                <div className="text-sm text-slate-400">
                  You have {teamsForCurrentCompetition.length} team{teamsForCurrentCompetition.length !== 1 ? 's' : ''} for this competition
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Join Existing Club */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 transition-colors hover:border-slate-600">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-700/80 border border-slate-600">
                    <Key className="text-amber-400" size={18} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Join Existing Club</h3>
                </div>
                <p className="text-slate-400 text-sm mb-4">Enter invitation code or use a join link from your teammate.</p>
                <div className="flex gap-2 mb-3">
                  <div className="flex-1 relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                      type="text"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                      placeholder="Enter invitation code"
                      className="w-full bg-slate-800 text-white rounded-lg pl-10 pr-4 py-2.5 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-shadow placeholder:text-slate-500"
                    />
                  </div>
                  <button
                    onClick={joinTeam}
                    className="shrink-0 px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-green-500/20 active:scale-[0.98]"
                  >
                    Join
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  Or open a join link shared by your teammate in the browser.
                </p>
              </div>

              {/* Invite Member */}
              <button
                type="button"
                onClick={() => selectedTeam && setShowInviteModal(true)}
                disabled={!selectedTeam}
                className="flex items-center gap-4 w-full text-left bg-slate-800/50 border border-slate-700 rounded-xl p-5 transition-all hover:border-blue-500/50 hover:bg-slate-800/80 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:border-slate-700 disabled:hover:bg-slate-800/50 group"
              >
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-700/80 border border-slate-600 group-hover:border-blue-500/40 group-hover:bg-blue-500/10 transition-colors shrink-0">
                  <Send className="text-blue-400 group-hover:text-blue-300" size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-200 transition-colors">Invite Member</h3>
                  <p className="text-slate-400 text-sm mt-0.5">
                    {selectedTeam ? "Share invite code or link with your team" : "Select a team above to invite members"}
                  </p>
                </div>
                <ChevronRight className="text-slate-500 group-hover:text-blue-400 shrink-0 transition-colors" size={20} />
              </button>
            </div>
          </div>




          {/* Team Invite Modal */}
          {showInviteModal && selectedTeam && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg shadow-2xl">
                <div className="flex justify-between items-center p-6 border-b border-slate-700">
                  <div>
                    <h2 className="text-xl font-bold text-white">Invite to Team</h2>
                    <p className="text-sm text-slate-400 mt-1">
                      {selectedTeam.name} - {competitionType}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowInviteModal(false);
                      setInviteEmail('');
                      setError('');
                    }}
                    className="text-slate-400 hover:text-white"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Invite Code Section */}
                  <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Key className="text-blue-400" size={18} />
                        <p className="text-sm font-semibold text-white">Invite Code</p>
                      </div>
                      <button
                        onClick={() => copyInviteCode()}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded transition-colors"
                      >
                        <Copy size={14} />
                        Copy
                      </button>
                    </div>
                    <div className="bg-slate-900 rounded px-4 py-3 border border-slate-600">
                      <p className="text-lg font-mono font-bold text-center text-white tracking-wider">
                        {selectedTeam.inviteCode || selectedTeam.id}
                      </p>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 text-center">
                      Share this code with team members to join
                    </p>
                  </div>

                  {/* Invite Link Section */}
                  <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <LinkIcon className="text-green-400" size={18} />
                        <p className="text-sm font-semibold text-white">Invite Link</p>
                      </div>
                      <button
                        onClick={() => copyJoinLink()}
                        className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-500 text-white text-xs font-semibold rounded transition-colors"
                      >
                        <Copy size={14} />
                        {copied ? 'Copied!' : 'Copy Link'}
                      </button>
                    </div>
                    <div className="bg-slate-900 rounded px-4 py-3 border border-slate-600 break-all">
                      <p className="text-sm text-slate-300">
                        {generateJoinLink(selectedTeam.id, selectedTeam.inviteCode)}
                      </p>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => shareTeamLink()}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded transition-colors"
                      >
                        <Share2 size={16} />
                        Share Link
                      </button>
                    </div>
                  </div>

                  {/* Email Invite Section */}
                  <div className="border-t border-slate-700 pt-4">
                    <div className="flex items-center gap-2">
                      <Mail className="text-yellow-400" size={18} />
                      <p className="text-sm font-semibold text-white">Send Invite via Email</p>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        placeholder="Enter email address"
                        value={inviteEmail}
                        onChange={(e) => {
                          setInviteEmail(e.target.value);
                          setError('');
                        }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && inviteEmail) {
                            handleSendInvite();
                          }
                        }}
                        className="flex-1 bg-slate-800 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-yellow-500"
                      />
                      <button
                        onClick={() => handleSendInvite()}
                        disabled={sending || !inviteEmail}
                        className="bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                      >
                        {sending ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send size={16} />
                            Send
                          </>
                        )}
                      </button>
                    </div>
                    {error && (
                      <p className="text-xs text-red-400 mt-2">{error}</p>
                    )}
                  </div>

                  {/* Team Info */}
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
                    <p className="text-xs text-blue-300">
                      <strong>Team:</strong> {selectedTeam.name} |
                      <strong> Members:</strong> {selectedTeam.members?.length || 0} / {currentConfig.max} |
                      <strong> Competition:</strong> {competitionType}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add Member Modal */}
          {showAddMemberModal && selectedTeam && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md shadow-2xl">
                <div className="flex justify-between items-center p-6 border-b border-slate-700">
                  <h2 className="text-xl font-bold text-white">Add Team Member</h2>
                  <button
                    onClick={() => {
                      setShowAddMemberModal(false);
                      setNewMemberData({ name: '', email: '', role: 'Member' });
                    }}
                    className="text-slate-400 hover:text-white"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newMemberData.name}
                      onChange={(e) => setNewMemberData({ ...newMemberData, name: e.target.value })}
                      placeholder="Enter member name"
                      className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={newMemberData.email}
                      onChange={(e) => setNewMemberData({ ...newMemberData, email: e.target.value })}
                      placeholder="member@example.com"
                      className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Role
                    </label>
                    <select
                      value={newMemberData.role}
                      onChange={(e) => setNewMemberData({ ...newMemberData, role: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
                    >
                      <option value="Member">Member</option>
                      <option value="Pilot">Pilot</option>
                      <option value="Crew">Crew</option>
                      <option value="Engineer">Engineer</option>
                    </select>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => {
                        setShowAddMemberModal(false);
                        setNewMemberData({ name: '', email: '', role: 'Member' });
                      }}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddMember}
                      className="flex-1 bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      Add Member
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}



          {/* Team List - /team/list API response */}


          {/* Edit Team Modal - uses PUT /team/update/{_id} */}
          <TeamFormModal
            show={!!editingTeam}
            onClose={handleCloseEditModal}
            onSubmit={handleUpdateTeamSubmit}
            team={editingTeam ? {
              name: editingTeam.teamName ?? editingTeam.name ?? '',
              competition: editingTeam.competition ?? editingTeam.competition_id ?? '',
              description: editingTeam.description ?? '',
            } : null}
            mode={editingTeam ? 'edit' : 'create'}
          />

          {/* Teams Overview Section - Show all teams for the club grouped by event type */}
          {selectedClub && (
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Teams by Event</h2>
                  {selectedEventType && (
                    <p className="text-sm text-purple-400 mt-1 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
                      Selected: <span className="font-semibold">{selectedEventType}</span>
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-sm">
                    <span className="text-white font-bold">
                      {mergedEventTypes.length}
                    </span> / {mergedEventTypes.length} event type{mergedEventTypes.length !== 1 ? 's' : ''} available
                  </p>
                </div>
              </div>



              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {mergedEventTypes.map((eventType) => {
                  const eventTypeTeams = getTeamsForEventType(eventType);
                  const eventTypeCompetitions = competitionsByEventType[eventType] || [];
                  const firstCompetition = eventTypeCompetitions[0];
                  const maxMembers = firstCompetition?.teamRequirements?.maxMembers || 10;
                  const minMembers = firstCompetition?.teamRequirements?.minMembers || 1;
                  const hasTeams = eventTypeTeams.length > 0;

                  // Check if this event type is currently selected
                  const isSelected = selectedEventType === eventType;

                  return (
                    <div
                      key={eventType}
                      onClick={() => {
                        // Set selected event type (only one can be selected at a time)
                        setSelectedEventType(eventType);
                        // Set competition type to first competition of this event type
                        if (firstCompetition) {
                          setCompetitionType(firstCompetition.name);
                        }
                        // Reset/pre-fill ZRC event selection
                        if (eventType.toUpperCase() !== 'ZRC') {
                          setZrcEventState('');
                          setZrcEventStartDate('');
                          setZrcEventEndDate('');
                        } else if (firstCompetition?.event) {
                          const ev = firstCompetition.event;
                          const stateCandidate = ev.state ?? ev.zrc_state ?? ev.region ?? ev.zrc_region ?? '';
                          const start = normalizeDateInputValue(ev.start_date ?? ev.startDate ?? '');
                          const end = normalizeDateInputValue(ev.end_date ?? ev.endDate ?? '');
                          if (String(stateCandidate).trim() && start && end) {
                            setZrcEventState(String(stateCandidate).trim());
                            setZrcEventStartDate(start);
                            setZrcEventEndDate(end);
                          }
                        }
                        // Reset NRC/WRC event instance selection when switching types
                        if (!['NRC', 'WRC'].includes(eventType.toUpperCase())) {
                          setSelectedEventInstanceId('');
                        }
                        setError('');
                        setSuccess('');
                      }}
                      className={`p-4 rounded-lg border cursor-pointer transition-all group ${isSelected
                        ? 'bg-purple-900/30 border-purple-500/50 shadow-lg shadow-purple-900/20'
                        : hasTeams
                          ? 'bg-slate-800 border-slate-600 hover:border-purple-500/50 hover:bg-slate-750'
                          : 'bg-slate-800/50 border-slate-700 border-dashed hover:border-purple-500/30 hover:bg-slate-800/70'
                        }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-2 rounded-lg ${hasTeams ? 'bg-purple-900/30' : 'bg-slate-700/50'
                          }`}>
                          <Trophy className={`${hasTeams ? 'text-purple-400' : 'text-slate-500'}`} size={20} />
                        </div>
                        {hasTeams ? (
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                            <span className="text-xs text-green-400 font-semibold">{eventTypeTeams.length} team{eventTypeTeams.length !== 1 ? 's' : ''}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500">Available</span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-white mb-2 line-clamp-2">{eventType}</h3>
                      {hasTeams ? (
                        <div className="mt-3 space-y-2">
                          {eventTypeTeams.length === 1 ? (
                            <>
                              <div className="flex items-center justify-between">
                                <p className="text-xs text-slate-400">Team:</p>
                                <p className="text-xs text-white font-semibold">{eventTypeTeams[0].name}</p>
                              </div>
                              <div className="flex items-center justify-between">
                                <p className="text-xs text-slate-400">Members:</p>
                                <p className="text-xs text-white font-semibold">
                                  {eventTypeTeams[0].members?.length || 0}/{maxMembers}
                                </p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedEventType(eventType);
                                  if (firstCompetition) setCompetitionType(firstCompetition.name);
                                  setSelectedTeam(eventTypeTeams[0]);
                                  setTeamName(eventTypeTeams[0].name ?? '');
                                  setEditingSquad({
                                    clubId: selectedClub?.id ?? selectedClub?._id,
                                    teamId: eventTypeTeams[0].id ?? eventTypeTeams[0]._id,
                                  });
                                  setError('');
                                }}
                                className="mt-2 w-full flex items-center justify-center gap-1.5 text-xs bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 font-semibold py-1.5 px-3 rounded border border-purple-500/30 transition-colors"
                              >
                                <Edit2 size={12} />
                                Edit squad
                              </button>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-xs text-slate-400">Teams:</p>
                                <p className="text-xs text-white font-semibold">{eventTypeTeams.length}</p>
                              </div>
                              <div className="space-y-1 max-h-20 overflow-y-auto">
                                {eventTypeTeams.slice(0, 3).map(team => (
                                  <div key={team.id} className="flex items-center justify-between text-xs text-slate-300 bg-slate-700/30 px-2 py-1 rounded group">
                                    <span>{team.name} ({team.members?.length || 0} members)</span>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedEventType(eventType);
                                          if (firstCompetition) setCompetitionType(firstCompetition.name);
                                          setSelectedTeam(team);
                                          setTeamName(team.name ?? '');
                                          setEditingSquad({
                                            clubId: selectedClub?.id ?? selectedClub?._id,
                                            teamId: team.id ?? team._id,
                                          });
                                          setError('');
                                        }}
                                        className="text-purple-400 hover:text-purple-300"
                                        title="Edit squad"
                                      >
                                        <Edit2 size={12} />
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedEventType(eventType);
                                          setSelectedTeam(team);
                                          if (firstCompetition) {
                                            setCompetitionType(firstCompetition.name);
                                          }
                                          setShowInviteModal(true);
                                        }}
                                        className="text-green-400 hover:text-green-300"
                                        title="Send invite"
                                      >
                                        <Send size={12} />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                                {eventTypeTeams.length > 3 && (
                                  <p className="text-xs text-slate-500">+{eventTypeTeams.length - 3} more...</p>
                                )}
                              </div>
                              <div className="flex gap-2 mt-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedEventType(eventType);
                                    if (firstCompetition) {
                                      setCompetitionType(firstCompetition.name);
                                    }
                                    setTeamName('');
                                    setSelectedTeam(null);
                                    setError('');
                                  }}
                                  className="flex-1 text-xs bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 font-semibold py-1.5 px-3 rounded border border-purple-500/30 transition-colors"
                                >
                                  <Plus size={12} className="inline mr-1" />
                                  Create
                                </button>
                                {eventTypeTeams.length > 0 && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedEventType(eventType);
                                      if (firstCompetition) {
                                        setCompetitionType(firstCompetition.name);
                                      }
                                      setSelectedTeam(eventTypeTeams[0]);
                                      setShowInviteModal(true);
                                    }}
                                    className="flex-1 text-xs bg-green-600/20 hover:bg-green-600/30 text-green-400 font-semibold py-1.5 px-3 rounded border border-green-500/30 transition-colors flex items-center justify-center gap-1"
                                  >
                                    <Send size={12} />
                                    Invite
                                  </button>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="mt-3">
                          <p className="text-xs text-slate-500 mb-2"></p>

                        </div>
                      )}
                      {isSelected && (
                        <div className="mt-3 pt-3 border-t border-purple-500/30">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
                            <p className="text-xs text-purple-400 font-semibold">Managing Now</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Competition Registration Section - Only show if user has a club */}

          <>
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <h1 className="text-3xl font-black italic text-white bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        MANAGE SQUAD
                      </h1>
                      {selectedClub && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-blue-900/30 border border-blue-500/30 rounded-lg">
                          <Users size={16} className="text-blue-400" />
                          <p className="text-blue-400 text-sm font-bold">
                            {selectedClub.name}
                          </p>
                        </div>
                      )}
                    </div>

                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-3">
                    <div className="flex items-start flex-col justify-start gap-2 flex-wrap">
                      <div className="px-2 py-1 bg-purple-900/30 border border-purple-500/30 rounded">
                        <p className="text-purple-400 text-xs font-bold uppercase">Competition</p>
                      </div>
                      <div className="relative">
                        <select
                          value={competitionType}
                          onChange={(e) => {
                            const selectedCompName = e.target.value;
                            setCompetitionType(selectedCompName);

                            // Update selected event type based on selected competition
                            const selectedComp = competitions.find(c => c.name === selectedCompName);
                            if (selectedComp?.event?.type) {
                              const newEventType = normalizeEventType(selectedComp.event.type);
                              setSelectedEventType(newEventType);
                              // Reset/pre-fill ZRC event selection based on selected competition event fields.
                              if (newEventType.toUpperCase() !== 'ZRC') {
                                setZrcEventState('');
                                setZrcEventStartDate('');
                                setZrcEventEndDate('');
                              } else if (selectedComp?.event) {
                                const ev = selectedComp.event;
                                const stateCandidate = ev.state ?? ev.zrc_state ?? ev.region ?? ev.zrc_region ?? '';
                                const start = normalizeDateInputValue(ev.start_date ?? ev.startDate ?? '');
                                const end = normalizeDateInputValue(ev.end_date ?? ev.endDate ?? '');
                                if (String(stateCandidate).trim() && start && end) {
                                  setZrcEventState(String(stateCandidate).trim());
                                  setZrcEventStartDate(start);
                                  setZrcEventEndDate(end);
                                }
                              }
                            }

                            setSelectedBot(null);
                            setSelectedPilot(null);
                            setSelectedCrew([]);
                            setCaptain(null);
                            setSelectedTeamForCaptain(null);
                            setTeamName('');
                            setSelectedTeam(null);
                            setError('');
                          }}
                          className="bg-slate-800 text-white text-sm font-medium rounded-lg px-4 py-2 border border-slate-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer hover:bg-slate-700 transition-colors pr-10"
                        >
                          {competitionsLoading ? (
                            <option value="">Loading competitions...</option>
                          ) : competitions && competitions.length > 0 ? (
                            competitions.map((comp) => {
                              const compTeams = teamsByCompetition[comp.name] || [];
                              const teamCount = compTeams.length;
                              return (
                                <option key={comp._id} value={comp.name}>
                                  {comp.name} {teamCount > 0 ? `(${teamCount} team${teamCount !== 1 ? 's' : ''})` : ''}
                                </option>
                              );
                            })
                          ) : (
                            <option value="">No competitions available</option>
                          )}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      {teamsForCurrentCompetition.length > 0 && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-900/30 border border-green-500/30 rounded">
                          <Check size={14} className="text-green-400" />
                          <p className="text-green-400 text-xs font-semibold">
                            {teamsForCurrentCompetition.length} team{teamsForCurrentCompetition.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Team Selector - Show when multiple teams exist for competition */}
                    {teamsForCurrentCompetition.length > 1 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="px-2 py-1 bg-blue-900/30 border border-blue-500/30 rounded">
                          <p className="text-blue-400 text-xs font-bold uppercase">Select Team</p>
                        </div>
                        <div className="relative flex-1 min-w-[200px]">
                          <select
                            value={selectedTeam?.id || ''}
                            onChange={(e) => {
                              const teamId = e.target.value;
                              const team = teamsForCurrentCompetition.find(t => t.id === teamId);
                              if (team) {
                                setSelectedTeam(team);
                                setTeamName(team.name);
                                if (team.captainId) {
                                  const captainMember = team.members?.find(m => m.id === team.captainId);
                                  if (captainMember) {
                                    setCaptain(captainMember);
                                  }
                                }
                                setSelectedBot(null);
                                setSelectedPilot(null);
                                setSelectedCrew([]);
                                setError('');
                              }
                            }}
                            className="w-full bg-slate-800 text-white text-sm font-medium rounded-lg px-4 py-2 border border-slate-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer hover:bg-slate-700 transition-colors pr-10"
                          >
                            {teamsForCurrentCompetition.map((team) => (
                              <option key={team.id} value={team.id}>
                                {team.name} ({team.members?.length || 0} members)
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        {selectedTeam && (
                          <button
                            onClick={() => setShowInviteModal(true)}
                            className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold rounded-lg transition-colors"
                            title="Send invite for this team"
                          >
                            <Send size={16} />
                            Invite
                          </button>
                        )}
                      </div>
                    )}

                    {/* Single team invite button */}
                    {teamsForCurrentCompetition.length === 1 && selectedTeam && (
                      <button
                        onClick={() => setShowInviteModal(true)}
                        className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold rounded-lg transition-colors"
                        title="Send invite for this team"
                      >
                        <Send size={16} />
                        Invite Members
                      </button>
                    )}

                    <div className="flex-col flex items-start gap-2">
                      <div className="px-2 py-1 bg-green-900/30 border border-green-500/30 rounded">
                        <p className="text-green-400 text-xs font-bold uppercase">Category</p>
                      </div>
                      <div className="relative">
                        <select
                          value={selectedCategoryValue}
                          onChange={(e) => {
                            const category = e.target.value;
                            if (!category) {
                              setCompetitionType("");
                              return;
                            }
                            const firstInCategory = competitions.find(
                              (c) => (c.category || "").toString() === category
                            );
                            if (firstInCategory) {
                              setCompetitionType(firstInCategory.name || firstInCategory.title || firstInCategory._id);
                            }
                          }}
                          className="bg-slate-800 text-white text-sm font-medium rounded-lg px-4 py-2 border border-slate-600 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 appearance-none cursor-pointer hover:bg-slate-700 transition-colors pr-10 min-w-[200px]"
                        >
                          <option value="">Select Category</option>
                          {competitionsLoading ? (
                            <option value="" disabled>Loading categories...</option>
                          ) : uniqueCategories.length > 0 ? (
                            uniqueCategories.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))
                          ) : (
                            <option value="">No categories available</option>
                          )}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    {/* ZRC Zonal Location Select - Only show when ZRC is selected */}
                    {selectedEventType && normalizeEventType(selectedEventType) === 'ZRC' && (
                      <div className="flex items-start flex-col justify-start gap-2 flex-wrap">
                        <div className="text-green-400 text-xs font-bold bg-purple-900/20 uppercase">Zonal Location</div>
                        <div className="bg-purple-900/20 border border-purple-500/50 rounded-xl shadow-lg shadow-purple-900/20">
                          <div className="flex items-center justify-between gap-3 flex-wrap">
                            <div className="relative flex-1 w-[200px]">
                              <select
                                value={resolvedZrcEventId}
                                onChange={(e) => {
                                  const eventId = e.target.value;
                                  const inst = (zrcZonalLocationOptions || []).find((o) => o.value === eventId)?.instance;
                                  if (inst) {
                                    setZrcEventState(inst.state);
                                    setZrcEventStartDate(inst.start_date);
                                    setZrcEventEndDate(inst.end_date);
                                  } else {
                                    setZrcEventState('');
                                    setZrcEventStartDate('');
                                    setZrcEventEndDate('');
                                  }
                                  setError('');
                                }}
                                className="w-full bg-slate-900/90 text-white text-sm font-medium rounded-lg px-4 py-2.5 border-2 border-purple-500/50 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 appearance-none cursor-pointer hover:bg-slate-800 hover:border-purple-400/70 transition-all pr-10 shadow-sm"
                              >
                                <option value="" className="bg-slate-800 text-slate-300">
                                  Please Select
                                </option>
                                {zrcZonalLocationOptions.length > 0 ? (
                                  zrcZonalLocationOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value} className="bg-slate-800 text-white">
                                      {opt.label}
                                    </option>
                                  ))
                                ) : (
                                  <option value="" disabled className="bg-slate-800 text-slate-300">
                                    No ZRC locations available
                                  </option>
                                )}
                              </select>

                              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>
                          </div>

                         
                        </div>
                      </div>
                    )}
                    {/* NRC/WRC Event Select - Only show when NRC/WRC is selected */}
                    {selectedEventType && ['NRC', 'WRC'].includes(normalizeEventType(selectedEventType)) && (
                      <div className="flex items-start flex-col justify-start gap-2 flex-wrap">
                        <div className="text-green-400 text-xs font-bold bg-purple-900/20 uppercase">Event</div>
                        <div className="bg-purple-900/20 border border-purple-500/50 rounded-xl shadow-lg shadow-purple-900/20">
                          <div className="flex items-center justify-between gap-3 flex-wrap">
                            <div className="relative flex-1  w-[200px]">
                              <select
                                value={selectedEventInstanceId}
                                onChange={(e) => {
                                  setSelectedEventInstanceId(e.target.value);
                                  setError('');
                                }}
                                className="w-full bg-slate-900/90 text-white text-sm font-medium rounded-lg px-4 py-2.5 border-2 border-purple-500/50 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 appearance-none cursor-pointer hover:bg-slate-800 hover:border-purple-400/70 transition-all pr-10 shadow-sm"
                              >
                                <option value="" className="bg-slate-800 text-slate-300">
                                  Please Select
                                </option>
                                {nrcWrcEventOptions.length > 0 ? (
                                  nrcWrcEventOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value} className="bg-slate-800 text-white">
                                      {opt.label}
                                    </option>
                                  ))
                                ) : (
                                  <option value="" disabled className="bg-slate-800 text-slate-300">
                                    No events available
                                  </option>
                                )}
                              </select>
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                          {/* {!!String(selectedEventInstanceId || '').trim() && (
                            <div className="mt-3 flex items-center gap-2 px-3 py-1.5 bg-green-900/30 border border-green-500/30 rounded-lg">
                              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                              <p className="text-green-400 text-xs font-semibold">
                                Selected event_id: {String(selectedEventInstanceId).slice(0, 10)}…
                              </p>
                            </div>
                          )} */}
                        </div>
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-3 flex-1 min-w-0">
                      <div className="flex  flex-wrap items-center gap-2 flex-1 min-w-[200px]">
                        <input
                          type="text"
                          value={teamName}
                          onChange={(e) => {
                            setTeamName(e.target.value);
                            setError('');
                          }}
                          placeholder="Enter Squad Name"
                          className="flex-1 min-w-[140px] max-w-[220px] bg-slate-800 text-white text-sm rounded-lg px-3 py-2 border border-slate-600 placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                          aria-label="Team name"
                        />
                        <button
                          type="button"
                          onClick={editingSquad ? handleSubmit : createTeam}
                          disabled={loading === 1}
                          className="shrink-0 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors"
                          aria-label={editingSquad ? 'Update squad' : 'Create squad'}
                        >
                          {loading === 1
                            ? (editingSquad ? 'Updating...' : 'Creating...')
                            : (editingSquad ? 'Update Squad' : 'Create Squad')}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-wrap">
                    {selectedTeam ? (
                      <>
                        <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-lg border border-slate-600">
                          <div className={`w-2 h-2 rounded-full ${totalTeamMembers >= currentConfig.min ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                          <p className="text-xs text-slate-300">
                            Team: <span className="font-bold text-white">{selectedTeam.name}</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-lg border border-slate-600">
                          <p className="text-xs text-slate-300">
                            Members: <span className="font-bold text-white">{totalTeamMembers}</span>
                            <span className="text-slate-400"> / {currentConfig.max}</span>
                          </p>
                          {currentConfig && (
                            <span className="text-xs text-slate-400">
                              (<span className="text-green-400">min: {currentConfig.min}</span>)
                            </span>
                          )}
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>


              </div>
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-500/50 text-red-300 text-sm p-3 rounded mb-6">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-900/30 border border-green-500/50 text-green-300 text-sm p-3 rounded mb-6">
                {success}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Selection Area */}
              <div className="space-y-6">
                {/* Available Bots */}
                {/* <div className="bg-slate-900 p-4 rounded border border-slate-700">
              <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">
                Available Bots ({availableBots.length})
                {currentConfig.allowedCategories && (
                  <span className="ml-2 text-xs text-blue-400">
                    {currentConfig.allowedCategories.join(', ')}
                  </span>
                )}
              </h3>
              {botsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="animate-spin text-blue-400" size={20} />
                  <span className="text-slate-500 text-sm ml-2">Loading bots...</span>
                </div>
              ) : botsError ? (
                <p className="text-red-400 text-sm text-center py-4">
                  {botsError}
                </p>
              ) : availableBots.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-4">
                  No bots available
                </p>
              ) : (
                availableBots.map(bot => {
                  // Check if bot matches current competition filter
                  const matchesCompetition = bot.competition_name?.toLowerCase() === competitionType?.toLowerCase();
                  const config = COMPETITION_CONFIG[competitionType];
                  const matchesCategory = config?.allowedCategories?.some(cat =>
                    bot.category?.toLowerCase().includes(cat.toLowerCase())
                  );
                  const isFilteredMatch = matchesCompetition || matchesCategory;

                  return (
                    <div
                      key={bot.bot_id}
                      onClick={() => {
                        setSelectedBot(bot);
                        setError('');
                      }}
                      className={`flex items-start p-3 hover:bg-slate-800 cursor-pointer rounded mb-2 transition-all ${selectedBot?.bot_id === bot.bot_id
                        ? 'bg-blue-900/20 border border-blue-500'
                        : 'border border-transparent'
                        } ${!isFilteredMatch ? 'opacity-75' : ''}`}
                    >
                      <span className="text-2xl mr-3 flex-shrink-0">{bot.image}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{bot.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{bot.category || bot.competition_name || 'Bot'}</p>
                        {bot.specs?.maxWeight && (
                          <p className="text-xs text-green-400 mt-1">
                            Max Weight: {bot.specs.maxWeight}
                          </p>
                        )}
                        {bot.competition_name && (
                          <p className="text-xs text-blue-400 mt-1">
                            Competition: {bot.competition_name}
                          </p>
                        )}
                        {!isFilteredMatch && (
                          <p className="text-xs text-yellow-400 mt-1 italic">
                            Not matching current filter
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div> */}

                {/* Available Team Members */}

                <div className="flex justify-between items-center mb-3">

                  {selectedClub && (
                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 mb-6">
                      {/* Team Members Header */}
                      <div className="mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                            TEAM MEMBERS ({memberSearchQuery.trim() ? filteredClubMembers.length : paymentSuccessCount})
                          </h2>
                          <div className="flex items-center gap-2 flex-wrap justify-end">
                            {paymentSuccessLoading ? (
                              <span className="inline-flex items-center gap-2 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800/60 text-slate-300 border border-slate-700">
                                <Loader2 className="animate-spin" size={14} />
                                Payment status...
                              </span>
                            ) : paymentSuccessError ? (
                              <span className="inline-flex items-center gap-2 px-2.5 py-1 text-xs font-semibold rounded-lg bg-red-900/20 text-red-300 border border-red-700/40">
                                {paymentSuccessError}
                              </span>
                            ) : (
                              <span className="">
                                {/* Payment SUCCESS: {paymentSuccessCount} */}
                              </span>
                            )}
                          </div>
                          {memberSearchQuery.trim() && (
                            <p className="text-xs text-slate-500">
                              Showing {filteredClubMembers.length} of {paymentSuccessCount} members
                            </p>
                          )}
                        </div>

                        {/* Search Bar */}
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                          <input
                            type="text"
                            value={memberSearchQuery}
                            onChange={(e) => setMemberSearchQuery(e.target.value)}
                            placeholder="Search members by name, email"
                            className="w-full bg-slate-800/50 border border-slate-600 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-500 text-sm"
                          />
                          {memberSearchQuery && (
                            <button
                              onClick={() => setMemberSearchQuery('')}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                              aria-label="Clear search"
                            >
                              <X size={18} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Loading State */}
                      {paymentSuccessLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <Loader2 className="animate-spin text-blue-400" size={24} />
                          <span className="text-slate-400 text-sm ml-3">Loading paid members...</span>
                        </div>
                      ) : paymentSuccessMembers.length === 0 ? (
                        <div className="text-center py-12">
                          <Users className="mx-auto text-slate-600 mb-3" size={48} />
                          <p className="text-slate-500 text-sm">No paid members found (Payment: SUCCESS)</p>
                        </div>
                      ) : filteredClubMembers.length === 0 ? (
                        <div className="text-center py-12">
                          <Search className="mx-auto text-slate-600 mb-3" size={48} />
                          <p className="text-slate-500 text-sm mb-1">No members found matching "{memberSearchQuery}"</p>
                          <button
                            onClick={() => setMemberSearchQuery('')}
                            className="text-blue-400 hover:text-blue-300 text-sm mt-2 underline"
                          >
                            Clear search
                          </button>
                        </div>
                      ) : (
                        <>
                          {/* Team Members Cards Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-4">
                            {filteredClubMembers.map((member) => {
                              // Extract fullname and email from member (API: user.fullName, user.email)
                              const fullname =
                                member.user?.fullName ||
                                member.fullname ||
                                member.user_id?.fullname ||
                                member.user_id?.name ||
                                member.name ||
                                'Unknown';

                              const emailId =
                                member.user?.email ||
                                member.emailId ||
                                member.user_id?.emailId ||
                                member.user_id?.email ||
                                member.email ||
                                'No email';

                              const rawMemberId = member.user_id?._id ?? member.user?._id ?? member.user_id ?? member._id ?? member.id;
                              const memberId = rawMemberId != null ? String(rawMemberId) : '';
                              const isPilot = selectedPilot && String(selectedPilot.id) === memberId;
                              const isCrew = selectedCrew.some((c) => String(c.id) === memberId);
                              const isAssigned = isPilot || isCrew;
                              const paymentMeta = paymentSuccessByUserId.get(memberId);

                              // Generate AI avatar URL using DiceBear API
                              const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullname.trim())}`;

                              return (
                                <div
                                  key={member._id || member.id}
                                  onClick={() => handleMemberClick(member)}
                                  role="button"
                                  tabIndex={0}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                      e.preventDefault();
                                      handleMemberClick(member);
                                    }
                                  }}
                                  className={`rounded-lg p-4 transition-all group cursor-pointer select-none ${isPilot
                                    ? 'bg-green-900/30 border-2 border-green-500'
                                    : isCrew
                                      ? 'bg-purple-900/30 border-2 border-purple-500'
                                      : 'bg-slate-800/50 border border-slate-600 hover:border-slate-500 hover:bg-slate-800/70'
                                    }`}
                                >
                                  {/* Member Photo */}
                                  <div className="flex items-center gap-4 mb-3">
                                    <div className="relative flex-shrink-0">
                                      <div className="w-14 h-14 rounded-full border-2 border-slate-600 group-hover:border-slate-500 transition-colors overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative">
                                        <img
                                          src={avatarUrl}
                                          alt={fullname}
                                          className="w-full h-full object-cover relative z-10"
                                          onError={(e) => {
                                            // Hide image on error - fallback initials will show through background
                                            e.target.style.display = 'none';
                                          }}
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg pointer-events-none z-0">
                                          {fullname.charAt(0).toUpperCase()}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Member Info */}
                                    <div className="flex-1 min-w-0">
                                      <h3 className="text-sm font-semibold text-white truncate mb-1">
                                        {fullname}
                                      </h3>
                                      <p className="text-xs text-slate-400 truncate" title={emailId}>
                                        {emailId}
                                      </p>
                                      {member.role && (
                                        <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-blue-900/30 text-blue-400 rounded border border-blue-500/30">
                                          {member.role}
                                        </span>
                                      )}
                                      {/* {paymentMeta?.paymentStatus === 'SUCCESS' && (
                                        <span className="inline-block mt-1 ml-1 px-2 py-0.5 text-xs font-semibold bg-emerald-900/20 text-emerald-300 rounded border border-emerald-700/40">
                                          Payment: SUCCESS
                                        </span>
                                      )}
                                      {paymentMeta?.membershipStatus && (
                                        <span className="inline-block mt-1 ml-1 px-2 py-0.5 text-xs font-semibold bg-slate-700/30 text-slate-200 rounded border border-slate-600/50">
                                          Membership: {String(paymentMeta.membershipStatus)}
                                        </span>
                                      )} */}
                                      {isAssigned && (
                                        <span className={`inline-block mt-1 ml-1 px-2 py-0.5 text-xs font-semibold rounded ${isPilot ? 'bg-green-600/50 text-green-300 border border-green-500/50' : 'bg-purple-600/50 text-purple-300 border border-purple-500/50'}`}>
                                          {isPilot ? 'Pilot' : 'Crew'}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  {!isAssigned && (
                                    <p className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-600/50">
                                      Click to add as {currentConfig.requiresPilot && !selectedPilot ? 'Pilot' : 'Crew'}
                                    </p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          {selectedTeam ? (
                            <p className="text-xs text-slate-500 mt-3 text-center">
                              Click a member to add as Pilot or Crew. Click again to remove.
                            </p>
                          ) : (
                            <p className="text-xs text-amber-500/90 mt-3 text-center">
                              Select a team above to add members as Pilot or Crew.
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>


              </div>

              {/* Formation Board */}
              <div className="lg:col-span-2 bg-slate-900 border border-slate-700 rounded-xl p-8 relative">
                <div className="absolute top-4 right-4 text-xs text-slate-500 uppercase font-bold tracking-widest">
                  {competitionType}
                </div>

                <div className="flex flex-wrap gap-5 justify-center mt-8">
                 

                  {/* Pilot Slot */}
                  {currentConfig.requiresPilot && (
                    <div className={`w-40 h-56 border-2 ${selectedPilot ? 'border-green-500 bg-green-900/10' : 'border-slate-600 border-dashed'} rounded-xl flex flex-col items-center justify-center p-4 transition-all`}>
                      <p className="text-xs text-slate-500 uppercase mb-2">1. Select Pilot</p>
                      {selectedPilot ? (
                        <>
                          <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center text-xl font-bold text-white mb-2">
                            {selectedPilot.name.charAt(0)}
                          </div>
                          <p className="font-bold text-white text-center text-sm">{selectedPilot.name}</p>
                          <p className="text-xs text-slate-400 text-center">{selectedPilot.role}</p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPilot(null);
                            }}
                            className="text-red-400 hover:text-red-300 text-xs mt-2"
                          >
                            Remove
                          </button>
                        </>
                      ) : <Users className="text-slate-600" size={40} />}
                    </div>
                  )}

                  {/* Crew Slots */}
                  {[...Array(currentConfig.max - (currentConfig.requiresPilot ? 1 : 0))].map((_, index) => {
                    const crewMember = selectedCrew[index];
                    return (
                      <div
                        key={index}
                        className={`w-40 h-56 border-2 ${crewMember
                          ? 'border-purple-500 bg-purple-900/10'
                          : selectedCrew.length === index
                            ? 'border-dashed border-slate-600'
                            : 'border-slate-600'
                          } rounded-xl flex flex-col items-center justify-center p-4 transition-all`}
                      >
                        <p className="text-xs text-slate-500 uppercase mb-2">
                          {/* {currentConfig.requiresPilot ? `${index + 3}. ` : `${index + 2}. `} */}
                          Crew {index + 1}
                        </p>
                        {crewMember ? (
                          <>
                            <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-xl font-bold text-white mb-2">
                              {crewMember.name.charAt(0)}
                            </div>
                            <p className="font-bold text-white text-center text-sm">{crewMember.name}</p>
                            <p className="text-xs text-slate-400 text-center">{crewMember.role}</p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCrew(selectedCrew.filter((_, i) => i !== index));
                              }}
                              className="text-red-400 hover:text-red-300 text-xs mt-2"
                            >
                              Remove
                            </button>
                          </>
                        ) : (
                          <Users className="text-slate-600" size={40} />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-12 text-center space-y-4">
                  {!selectedTeam ? (
                    <p></p>
                  ) : (
                    <>
                      <div className="flex items-center justify-center gap-4 mb-4">
                        <div className={`px-4 py-2 rounded-lg border ${selectedBot ? 'bg-blue-900/30 border-blue-500/50' : 'bg-slate-800 border-slate-600'
                          }`}>
                          <p className="text-xs text-slate-400">Bot Selected</p>
                          <p className="text-sm font-bold text-white">{selectedBot ? '✓' : '✗'}</p>
                        </div>
                        {currentConfig.requiresPilot && (
                          <div className={`px-4 py-2 rounded-lg border ${selectedPilot ? 'bg-green-900/30 border-green-500/50' : 'bg-slate-800 border-slate-600'
                            }`}>
                            <p className="text-xs text-slate-400">Pilot Selected</p>
                            <p className="text-sm font-bold text-white">{selectedPilot ? '✓' : '✗'}</p>
                          </div>
                        )}
                        <div className={`px-4 py-2 rounded-lg border ${totalTeamMembers >= currentConfig.min ? 'bg-green-900/30 border-green-500/50' : 'bg-slate-800 border-slate-600'
                          }`}>
                          <p className="text-xs text-slate-400">Members</p>
                          <p className="text-sm font-bold text-white">{totalTeamMembers}/{currentConfig.min}</p>
                        </div>
                        <div className={`px-4 py-2 rounded-lg border ${captain ? 'bg-green-900/30 border-green-500/50' : 'bg-slate-800 border-slate-600'
                          }`}>
                          <p className="text-xs text-slate-400">Captain</p>
                          <p className="text-sm font-bold text-white">{captain ? '✓' : '✗'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 justify-center flex-wrap">
                        {editingSquad && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingSquad(null);
                              setSelectedTeam(null);
                              setTeamName('');
                              setCaptain(null);
                              setSelectedBot(null);
                              setSelectedPilot(null);
                              setSelectedCrew([]);
                              setError('');
                              setSuccess('');
                            }}
                            className="px-6 py-3 rounded font-semibold bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
                          >
                            Cancel edit
                          </button>
                        )}
                        <button
                          onClick={handleSubmit}
                          disabled={!selectedBot || (currentConfig.requiresPilot && !selectedPilot) || totalTeamMembers < currentConfig.min || !captain}
                          className={`px-8 py-3 rounded font-bold uppercase tracking-wide transition-all ${selectedBot && (!currentConfig.requiresPilot || selectedPilot) && totalTeamMembers >= currentConfig.min && captain
                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/50'
                            : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                            }`}
                        >
                          {editingSquad
                            ? (!selectedBot
                              ? 'Select a Bot'
                              : currentConfig.requiresPilot && !selectedPilot
                                ? 'Select a Pilot'
                                : totalTeamMembers < currentConfig.min
                                  ? `Add ${currentConfig.min - totalTeamMembers} more member(s)`
                                  : !captain
                                    ? 'Select a Captain'
                                    : 'Update squad')
                            : (!selectedBot
                              ? 'Select a Bot'
                              : currentConfig.requiresPilot && !selectedPilot
                                ? 'Select a Pilot'
                                : totalTeamMembers < currentConfig.min
                                  ? `Add ${currentConfig.min - totalTeamMembers} more member${currentConfig.min - totalTeamMembers > 1 ? 's' : ''}`
                                  : !captain
                                    ? 'Select a Captain'
                                    : 'Confirm Lineup & Pay')}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        </>
      )}

      {/* Delete Squad Confirmation Modal */}
      {squadToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">Delete Squad</h2>
              <button
                type="button"
                onClick={() => !deleteSquadLoading && setSquadToDelete(null)}
                disabled={deleteSquadLoading}
                className="text-slate-400 hover:text-white disabled:opacity-50"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-slate-300">
                Are you sure you want to delete the squad <strong className="text-white">{(squadToDelete.teamName || squadToDelete.name) ?? 'this squad'}</strong>? This action cannot be undone.
              </p>
              {error && <p className="text-sm text-red-400">{error}</p>}
            </div>
            <div className="flex gap-3 justify-end p-6 border-t border-slate-700">
              <button
                type="button"
                onClick={() => !deleteSquadLoading && setSquadToDelete(null)}
                disabled={deleteSquadLoading}
                className="px-4 py-2.5 rounded-lg font-semibold bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteSquad}
                disabled={deleteSquadLoading}
                className="px-4 py-2.5 rounded-lg font-semibold bg-red-600 hover:bg-red-500 text-white transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {deleteSquadLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Delete Squad
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};