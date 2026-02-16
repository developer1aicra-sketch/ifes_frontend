import { useState, useEffect } from 'react';
import { Calendar, Layout, Building, Plus, Sparkles, LogOut, BookOpen, Lock, CheckCircle, Play, MessageSquare, Search, X, Users, UserPlus, Briefcase, Mail, Phone, UserCircle, Trophy, Trash2, Pencil } from 'lucide-react';
import ForumView from '../components/ForumView';
import CompetitionFormModal from '../components/CompetitionFormModal';
import { DEFAULT_SITES } from '../constants/data';
import { callGemini } from '../utils/gemini';
import {
  updatePartner,
  setPartnerAuth,
  getPartnerAuth,
  listSeasons,
  listEvents,
  listCompetitions,
  addSeason,
  updateSeason,
  deleteSeason,
  addEvent,
  updateEvent,
  deleteEvent,
  addCompetition,
  updateCompetition,
  deleteCompetition,
} from '../utils/api';

const AdminView = ({ setSites, sites, setView, defaultMode, user, setUser }) => {
  const [isAdminMode] = useState(defaultMode || user?.role || 'super');
  const partner = user?.partner ?? null;
  const [activeTab, setActiveTab] = useState('overview');
  // Partner profile edit (for partner role): form state and save status
  const [partnerEdit, setPartnerEdit] = useState({
    academyName: '',
    themeColor: 'Blue',
    contactEmail: '',
    phoneNumber: '',
  });
  const [partnerProfileSaving, setPartnerProfileSaving] = useState(false);
  const [partnerProfileError, setPartnerProfileError] = useState('');
  const [partnerProfileSuccess, setPartnerProfileSuccess] = useState(false);
  useEffect(() => {
    if (partner) {
      setPartnerEdit({
        academyName: partner.academyName ?? '',
        themeColor: partner.themeColor ?? 'Blue',
        contactEmail: partner.contactEmail ?? '',
        phoneNumber: partner.phoneNumber ?? '',
      });
    }
  }, [partner?._id]);

  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: 'Alex Johnson',
      role: 'Frontend Architect',
      email: 'alex.j@example.com',
      phone: '+1 (555) 123-4567',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      joinDate: '2023-01-15',
      skills: ['React', 'TypeScript', 'UI/UX', 'Performance'],
      bio: 'Passionate about building beautiful and performant user interfaces with React and modern web technologies.'
    },
    {
      id: 2,
      name: 'Sarah Chen',
      role: 'Senior Frontend Developer',
      email: 'sarah.c@example.com',
      phone: '+1 (555) 987-6543',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      joinDate: '2022-08-22',
      skills: ['JavaScript', 'React', 'State Management', 'Testing'],
      bio: 'Experienced in building scalable frontend applications with a focus on clean code and testing.'
    },
    {
      id: 3,
      name: 'Michael Rodriguez',
      role: 'UI/UX Designer',
      email: 'michael.r@example.com',
      phone: '+1 (555) 234-5678',
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
      joinDate: '2023-03-10',
      skills: ['Figma', 'UI Design', 'User Research', 'Prototyping'],
      bio: 'Creating intuitive and delightful user experiences through thoughtful design and user-centered approaches.'
    },
    {
      id: 4,
      name: 'Priya Patel',
      role: 'Senior React Developer',
      email: 'priya.p@example.com',
      phone: '+1 (555) 876-5432',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
      joinDate: '2022-11-05',
      skills: ['React', 'Redux', 'GraphQL', 'Jest'],
      bio: 'Specializing in building complex React applications with a focus on performance and maintainability.'
    },
    {
      id: 5,
      name: 'David Kim',
      role: 'Frontend Tech Lead',
      email: 'david.k@example.com',
      phone: '+1 (555) 345-6789',
      avatar: 'https://randomuser.me/api/portraits/men/54.jpg',
      joinDate: '2021-09-15',
      skills: ['React', 'TypeScript', 'Architecture', 'Mentoring'],
      bio: 'Leading the frontend team with a focus on best practices, code quality, and team growth.'
    },
    {
      id: 6,
      name: 'Emma Wilson',
      role: 'UI/UX Designer',
      email: 'emma.w@example.com',
      phone: '+1 (555) 765-4321',
      avatar: 'https://randomuser.me/api/portraits/women/36.jpg',
      joinDate: '2023-01-20',
      skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
      bio: 'Passionate about creating intuitive interfaces and seamless user experiences.'
    },
    {
      id: 7,
      name: 'James Wilson',
      role: 'Frontend Developer',
      email: 'james.w@example.com',
      phone: '+1 (555) 456-7890',
      avatar: 'https://randomuser.me/api/portraits/men/48.jpg',
      joinDate: '2023-04-15',
      skills: ['Vue.js', 'JavaScript', 'CSS', 'Jest'],
      bio: 'Focused on building responsive and accessible web applications with Vue.js.'
    },
    {
      id: 8,
      name: 'Olivia Martinez',
      role: 'Senior UI Developer',
      email: 'olivia.m@example.com',
      phone: '+1 (555) 567-8901',
      avatar: 'https://randomuser.me/api/portraits/women/52.jpg',
      joinDate: '2022-06-10',
      skills: ['HTML/CSS', 'Sass', 'JavaScript', 'Accessibility'],
      bio: 'Creating pixel-perfect, accessible interfaces with a focus on CSS architecture and performance.'
    },
    {
      id: 9,
      name: 'Rajesh Kumar',
      role: 'Backend Developer',
      email: 'rajesh.k@example.com',
      phone: '+91 98765 43210',
      avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
      joinDate: '2023-02-18',
      skills: ['Node.js', 'Express', 'MongoDB', 'REST APIs'],
      bio: 'Building robust and scalable backend systems with Node.js and modern JavaScript frameworks.'
    },
    {
      id: 10,
      name: 'Aisha Khan',
      role: 'DevOps Engineer',
      email: 'aisha.k@example.com',
      phone: '+44 7911 123456',
      avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
      joinDate: '2022-09-30',
      skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
      bio: 'Passionate about infrastructure as code and automating deployment pipelines for seamless software delivery.'
    },
    {
      id: 11,
      name: 'Carlos Mendez',
      role: 'Full Stack Developer',
      email: 'carlos.m@example.com',
      phone: '+1 (555) 678-9012',
      avatar: 'https://randomuser.me/api/portraits/men/29.jpg',
      joinDate: '2023-05-22',
      skills: ['React', 'Node.js', 'PostgreSQL', 'GraphQL'],
      bio: 'Versatile developer with expertise in both frontend and backend technologies, delivering end-to-end solutions.'
    },
    {
      id: 12,
      name: 'Yuki Tanaka',
      role: 'QA Automation Engineer',
      email: 'yuki.t@example.com',
      phone: '+81 90-1234-5678',
      avatar: 'https://randomuser.me/api/portraits/women/58.jpg',
      joinDate: '2023-01-10',
      skills: ['Selenium', 'Cypress', 'Jest', 'TestCafe'],
      bio: 'Ensuring software quality through comprehensive test automation and continuous integration practices.'
    }
  ]);
  const [newMember, setNewMember] = useState({
    name: '',
    role: 'Frontend Developer',
    email: '',
    phone: '',
    joinDate: new Date().toISOString().split('T')[0],
    skills: '',
    bio: ''
  });
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newPartner, setNewPartner] = useState({ country: '', theme: 'blue', subdomain: '' });
  const [newEvent, setNewEvent] = useState({ title: '', date: '', location: '' });
  const [genLoading, setGenLoading] = useState(false);
  const [genResult, setGenResult] = useState('');

  // My Events (Seasons / Events / Competitions) — API-driven
  const [eventsSubTab, setEventsSubTab] = useState('seasons');
  const [seasons, setSeasons] = useState([]);
  const [seasonsLoading, setSeasonsLoading] = useState(false);
  const [seasonsError, setSeasonsError] = useState('');
  const [eventList, setEventList] = useState([]); // from API list + newly added this session
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsListError, setEventsListError] = useState('');
  const [seasonForm, setSeasonForm] = useState({ name: '', year: new Date().getFullYear(), isActive: true });
  const [seasonSaving, setSeasonSaving] = useState(false);
  const [seasonError, setSeasonError] = useState('');
  const [editingSeasonId, setEditingSeasonId] = useState(null);
  const [editSeasonForm, setEditSeasonForm] = useState({ name: '', year: new Date().getFullYear(), isActive: true });
  const [eventForm, setEventForm] = useState({
    season_id: '',
    name: '',
    type: 'PRC',
    start_date: '',
    end_date: '',
    country: '',
    state: '',
    city: '',
    venue: '',
    registration_fee: 1000,
  });
  const [eventSaving, setEventSaving] = useState(false);
  const [eventError, setEventError] = useState('');

  const [competitionSaving, setCompetitionSaving] = useState(false);
  const [competitionError, setCompetitionError] = useState('');
  const [competitionList, setCompetitionList] = useState([]);
  const [competitionsLoading, setCompetitionsLoading] = useState(false);
  const [competitionsListError, setCompetitionsListError] = useState('');
  const [editingEventId, setEditingEventId] = useState(null);
  const [editEventForm, setEditEventForm] = useState({
    name: '', type: 'PRC', start_date: '', end_date: '', country: '', state: '', city: '', venue: '', registration_fee: 0, status: 'upcoming',
  });
  const [competitionDeletingId, setCompetitionDeletingId] = useState(null);
  const [showCompetitionModal, setShowCompetitionModal] = useState(false);
  const [editingCompetition, setEditingCompetition] = useState(null);

  // Fetch seasons and events list when My Events tab is active
  useEffect(() => {
    if (activeTab !== 'events') return;
    let cancelled = false;
    setSeasonsLoading(true);
    setSeasonsError('');
    setEventsLoading(true);
    setEventsListError('');
    Promise.allSettled([listSeasons(), listEvents()]).then(([seasonsResult, eventsResult]) => {
      if (cancelled) return;
      if (seasonsResult.status === 'fulfilled') {
        const list = seasonsResult.value?.data ?? seasonsResult.value?.seasons ?? (Array.isArray(seasonsResult.value) ? seasonsResult.value : []);
        setSeasons(Array.isArray(list) ? list : []);
      } else {
        setSeasonsError(seasonsResult.reason?.message ?? 'Failed to load seasons');
        setSeasons([]);
      }
      if (eventsResult.status === 'fulfilled') {
        const eventData = eventsResult.value?.data ?? (Array.isArray(eventsResult.value) ? eventsResult.value : []);
        setEventList(Array.isArray(eventData) ? eventData : []);
      } else {
        setEventsListError(eventsResult.reason?.message ?? 'Failed to load events');
        setEventList([]);
      }
    }).finally(() => {
      if (!cancelled) {
        setSeasonsLoading(false);
        setEventsLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [activeTab]);

  // Fetch competitions list when Competitions sub-tab is active
  useEffect(() => {
    if (activeTab !== 'events' || eventsSubTab !== 'competitions') return;
    let cancelled = false;
    setCompetitionsLoading(true);
    setCompetitionsListError('');
    listCompetitions()
      .then((res) => {
        if (cancelled) return;
        const list = res?.data ?? (Array.isArray(res) ? res : []);
        setCompetitionList(Array.isArray(list) ? list : []);
      })
      .catch((err) => {
        if (!cancelled) {
          setCompetitionsListError(err?.message ?? 'Failed to load competitions');
          setCompetitionList([]);
        }
      })
      .finally(() => {
        if (!cancelled) setCompetitionsLoading(false);
      });
    return () => { cancelled = true; };
  }, [activeTab, eventsSubTab]);

  // Course related states
  // Forum related states
  const [forums, setForums] = useState([
    {
      id: 1,
      title: 'General Discussion',
      description: 'Discuss anything related to our community',
      threads: 24,
      lastPost: '2 hours ago',
      icon: '💬',
    },
    {
      id: 2,
      title: 'Project Showcase',
      description: 'Share and discuss your projects',
      threads: 15,
      lastPost: '5 hours ago',
      icon: '🚀',
    },
    {
      id: 3,
      title: 'Q&A',
      description: 'Ask questions and get answers from the community',
      threads: 42,
      lastPost: '1 day ago',
      icon: '❓',
    },
  ]);

  const [threads, setThreads] = useState([
    {
      id: 1,
      title: 'Welcome to our new forum!',
      author: 'Admin',
      date: '2 hours ago',
      replies: 5,
      views: 42,
      lastReply: '30 minutes ago',
      isPinned: true,
    },
    {
      id: 2,
      title: 'How to get started with our platform?',
      author: 'NewUser',
      date: '5 hours ago',
      replies: 3,
      views: 28,
      lastReply: '1 hour ago',
      isPinned: false,
    },
  ]);

  const [selectedForum, setSelectedForum] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewForumModal, setShowNewForumModal] = useState(false);
  const [newForum, setNewForum] = useState({
    title: '',
    description: '',
    icon: '💬'
  });

  const [courses, setCourses] = useState([
    {
      id: 'intro-robotics',
      title: 'Introduction to Robotics',
      description: 'Learn the basics of robotics and automation',
      thumbnail: 'https://img.freepik.com/free-vector/robotics-technology-isometric-composition_1284-18098.jpg',
      modules: [
        {
          id: 'module-1',
          title: 'Getting Started with Robotics',
          videos: [
            { id: 'video-1', title: 'What is Robotics?', duration: '5:30', url: 'https://example.com/video1', completed: true },
            { id: 'video-2', title: 'Basic Components', duration: '7:15', url: 'https://example.com/video2', completed: false },
            { id: 'video-3', title: 'First Robot Build', duration: '10:45', url: 'https://example.com/video3', completed: false },
          ]
        },
        {
          id: 'module-2',
          title: 'Programming Basics',
          videos: [
            { id: 'video-4', title: 'Introduction to Programming', duration: '8:20', url: 'https://example.com/video4', completed: false },
            { id: 'video-5', title: 'Control Structures', duration: '12:10', url: 'https://example.com/video5', completed: false },
          ]
        }
      ]
    }
  ]);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoProgress, setVideoProgress] = useState({});

  // Load progress from localStorage on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('courseProgress');
    if (savedProgress) {
      setVideoProgress(JSON.parse(savedProgress));
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(videoProgress).length > 0) {
      localStorage.setItem('courseProgress', JSON.stringify(videoProgress));
    }
  }, [videoProgress]);

  const handleVideoComplete = (courseId, moduleId, videoId) => {
    const videoKey = `${courseId}-${moduleId}-${videoId}`;
    setVideoProgress(prev => ({
      ...prev,
      [videoKey]: 100
    }));

    // Find the current video and mark it as completed in the courses state
    setCourses(prevCourses => {
      return prevCourses.map(course => {
        if (course.id === courseId) {
          const updatedModules = course.modules.map(module => {
            if (module.id === moduleId) {
              const updatedVideos = module.videos.map(video => {
                if (video.id === videoId) {
                  return { ...video, completed: true };
                }
                return video;
              });
              return { ...module, videos: updatedVideos };
            }
            return module;
          });
          return { ...course, modules: updatedModules };
        }
        return course;
      });
    });
  };

  const isVideoLocked = (courseId, moduleIndex, videoIndex) => {
    if (moduleIndex === 0 && videoIndex === 0) return false; // First video is always unlocked
    if (moduleIndex === 0) {
      // For first module, check previous video in same module
      const prevVideo = courses
        .find(c => c.id === courseId)
        ?.modules[moduleIndex]?.videos[videoIndex - 1];
      return !prevVideo?.completed;
    }
    if (videoIndex === 0) {
      // First video of a new module, check last video of previous module
      const prevModule = courses
        .find(c => c.id === courseId)
        ?.modules[moduleIndex - 1];
      const lastVideoOfPrevModule = prevModule?.videos[prevModule.videos.length - 1];
      return !lastVideoOfPrevModule?.completed;
    }
    // For other videos, check previous video in same module
    const prevVideo = courses
      .find(c => c.id === courseId)
      ?.modules[moduleIndex]?.videos[videoIndex - 1];
    return !prevVideo?.completed;
  };

  const handleCreatePartner = () => {
    const id = (newPartner.subdomain || newPartner.country).toLowerCase().replace(/\s+/g, '');
    if (!id) return;

    const newSite = {
      id,
      name: `TECHNOXIAN ${newPartner.country || id}`,
      logo_text: `TECHNOXIAN ${(newPartner.country || id).toUpperCase()}`,
      subdomain: `${id}.worso.org`,
      sub_text: 'OFFICIAL PARTNER',
      theme: newPartner.theme,
      colors: newPartner.theme === 'emerald' ? DEFAULT_SITES.uae.colors : DEFAULT_SITES.global.colors,
      is_partner: true,
      local_events: [],
    };
    setSites({ ...sites, [id]: newSite });
    alert(`Partner site for ${newPartner.country || id} created at ${newSite.subdomain}. Credentials emailed.`);
    setNewPartner({ country: '', theme: 'blue', subdomain: '' });
  };

  const handleCreateEvent = () => {
    const targetSiteId = 'uae';
    const updatedSite = {
      ...sites[targetSiteId],
      local_events: [...sites[targetSiteId].local_events, { id: Date.now(), ...newEvent, status: 'Upcoming' }],
    };
    setSites({ ...sites, [targetSiteId]: updatedSite });
    alert('Local Event Created!');
    setNewEvent({ title: '', date: '', location: '' });
  };

  const handleAddSeason = async () => {
    setSeasonError('');
    setSeasonSaving(true);
    try {
      const res = await addSeason(seasonForm);
      const created = res?.data ?? res?.season ?? res;
      if (created?._id) setSeasons((prev) => [...prev, created]);
      else setSeasons((prev) => [...prev, { _id: res?.id ?? Date.now(), ...seasonForm }]);
      setSeasonForm({ name: '', year: new Date().getFullYear(), isActive: true });
    } catch (err) {
      setSeasonError(err?.message ?? 'Failed to add season');
    } finally {
      setSeasonSaving(false);
    }
  };

  const handleEditSeason = (s) => {
    setEditingSeasonId(s._id);
    setEditSeasonForm({ name: s.name ?? '', year: s.year ?? new Date().getFullYear(), isActive: s.isActive !== false });
  };

  const handleSaveEditSeason = async () => {
    if (!editingSeasonId) return;
    setSeasonError('');
    setSeasonSaving(true);
    try {
      await updateSeason(editingSeasonId, editSeasonForm);
      setSeasons((prev) => prev.map((s) => (s._id === editingSeasonId ? { ...s, ...editSeasonForm } : s)));
      setEditingSeasonId(null);
    } catch (err) {
      setSeasonError(err?.message ?? 'Failed to update season');
    } finally {
      setSeasonSaving(false);
    }
  };

  const handleDeleteSeason = async (id) => {
    if (!window.confirm('Delete this season?')) return;
    setSeasonError('');
    setSeasonSaving(true);
    try {
      await deleteSeason(id);
      setSeasons((prev) => prev.filter((s) => s._id !== id));
      if (editingSeasonId === id) setEditingSeasonId(null);
    } catch (err) {
      setSeasonError(err?.message ?? 'Failed to delete season');
    } finally {
      setSeasonSaving(false);
    }
  };

  const handleAddEvent = async () => {
    setEventError('');
    setEventSaving(true);
    try {
      const res = await addEvent(eventForm);
      const created = res?.data ?? res?.event ?? res;
      const id = created?._id ?? created?.id;
      const name = created?.name ?? eventForm.name;
      if (id) setEventList((prev) => [...prev, { _id: id, name, season_id: eventForm.season_id }]);
      setEventForm({
        season_id: eventForm.season_id,
        name: '',
        type: 'PRC',
        start_date: '',
        end_date: '',
        country: '',
        state: '',
        city: '',
        venue: '',
        registration_fee: 1000,
      });
    } catch (err) {
      setEventError(err?.message ?? 'Failed to add event');
    } finally {
      setEventSaving(false);
    }
  };

  const handleEditEvent = (ev) => {
    setEditingEventId(ev._id);
    setEditEventForm({
      name: ev.name ?? '',
      type: ev.type ?? 'PRC',
      start_date: ev.start_date ? ev.start_date.slice(0, 10) : '',
      end_date: ev.end_date ? ev.end_date.slice(0, 10) : '',
      country: ev.country ?? '',
      state: ev.state ?? '',
      city: ev.city ?? '',
      venue: ev.venue ?? '',
      registration_fee: ev.registration_fee ?? 0,
      status: ev.status ?? 'upcoming',
    });
  };

  const handleSaveEditEvent = async () => {
    if (!editingEventId) return;
    setEventError('');
    setEventSaving(true);
    try {
      await updateEvent(editingEventId, editEventForm);
      setEventList((prev) => prev.map((e) => (e._id === editingEventId ? { ...e, ...editEventForm } : e)));
      setEditingEventId(null);
    } catch (err) {
      setEventError(err?.message ?? 'Failed to update event');
    } finally {
      setEventSaving(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Delete this event? This cannot be undone.')) return;
    setEventError('');
    setEventSaving(true);
    try {
      await deleteEvent(id);
      setEventList((prev) => prev.filter((e) => e._id !== id));
      if (editingEventId === id) setEditingEventId(null);
    } catch (err) {
      setEventError(err?.message ?? 'Failed to delete event');
    } finally {
      setEventSaving(false);
    }
  };

  const handleDeleteCompetition = async (_id) => {
    if (!window.confirm('Delete this competition? This cannot be undone.')) return;
    setCompetitionError('');
    setCompetitionDeletingId(_id);
    try {
      await deleteCompetition(_id);
      setCompetitionList((prev) => prev.filter((c) => c._id !== _id));
    } catch (err) {
      setCompetitionError(err?.message ?? 'Failed to delete competition');
    } finally {
      setCompetitionDeletingId(null);
    }
  };

  // Normalize competition payload so backend always receives valid numbers (prizePool, duration.value, minMembers, maxMembers)
  // Normalize competition payload (flat bracket keys: duration[value], teamRequirements[minMembers], downloadTitles[i])
  const normalizeCompetitionPayload = (data) => {
    const prizePool = Number(data.prizePool);
    const prizePoolNum = Number.isFinite(prizePool) && prizePool >= 0 ? prizePool : 0;

    const rawMin = data['teamRequirements[minMembers]'] ?? data.teamRequirements?.minMembers;
    const rawMax = data['teamRequirements[maxMembers]'] ?? data.teamRequirements?.maxMembers;
    let minMembers = Number(rawMin);
    let maxMembers = Number(rawMax);
    minMembers = Number.isFinite(minMembers) && minMembers >= 0 ? minMembers : 1;
    maxMembers = Number.isFinite(maxMembers) && maxMembers >= 0 ? maxMembers : 4;
    if (minMembers > maxMembers) maxMembers = minMembers;

    const rawDurationValue = data['duration[value]'] ?? data.duration?.value;
    const rawDurationUnit = data['duration[unit]'] ?? data.duration?.unit;
    const durationValue = Number(rawDurationValue);
    const durationVal = Number.isFinite(durationValue) && durationValue >= 0 ? durationValue : 1;
    const durationUnit = typeof rawDurationUnit === 'string' && rawDurationUnit ? rawDurationUnit : 'day';

    const out = { ...data };
    out.prizePool = prizePoolNum;
    out['teamRequirements[minMembers]'] = minMembers;
    out['teamRequirements[maxMembers]'] = maxMembers;
    out['duration[value]'] = durationVal;
    out['duration[unit]'] = durationUnit;
    out.bannerImage = data.bannerImage instanceof File ? data.bannerImage : data.bannerImage || '';
    return out;
  };

  const handleCompetitionModalSave = async (competitionData) => {
    setCompetitionError('');
    setCompetitionSaving(true);
    try {
      const payload = normalizeCompetitionPayload(competitionData);
      if (editingCompetition?._id) {
        await updateCompetition(editingCompetition._id, payload);
      } else {
        await addCompetition(payload);
      }
      setShowCompetitionModal(false);
      setEditingCompetition(null);
      const res = await listCompetitions();
      const list = res?.data ?? (Array.isArray(res) ? res : []);
      setCompetitionList(Array.isArray(list) ? list : []);
    } catch (err) {
      setCompetitionError(err?.message ?? 'Failed to save competition');
    } finally {
      setCompetitionSaving(false);
    }
  };

  const handleCompetitionModalCancel = () => {
    setShowCompetitionModal(false);
    setEditingCompetition(null);
    setCompetitionError('');
  };

  const generatePressRelease = async (event) => {
    setGenLoading(true);
    const prompt = `Write a short, exciting press release (max 100 words) for a robotics event titled "${event.title}" happening at "${event.location}" on "${event.date}". Use professional but energetic tone.`;
    const result = await callGemini(prompt);
    setGenResult(result);
    setGenLoading(false);
  };

  const savePartnerProfile = async () => {
    if (!partner?._id || !user?.token || typeof setUser !== 'function') return;
    setPartnerProfileError('');
    setPartnerProfileSuccess(false);
    setPartnerProfileSaving(true);
    try {
      const payload = {
        academyName: partnerEdit.academyName.trim() || undefined,
        themeColor: partnerEdit.themeColor || undefined,
        contactEmail: partnerEdit.contactEmail.trim() || undefined,
        phoneNumber: partnerEdit.phoneNumber.trim() || undefined,
      };
      const data = await updatePartner(partner._id, user.token, payload);
      const updated = data?.partner ?? data;
      if (updated) {
        const auth = getPartnerAuth();
        if (auth) setPartnerAuth({ ...auth, partner: updated });
        setUser({ ...user, partner: updated });
      }
      setPartnerProfileSuccess(true);
      setTimeout(() => setPartnerProfileSuccess(false), 3000);
    } catch (err) {
      setPartnerProfileError(err?.message || 'Failed to save profile.');
    } finally {
      setPartnerProfileSaving(false);
    }
  };

  return (
    <div className="bg-slate-50 animate-fadeIn h-screen flex flex-col overflow-hidden">
      <div className="container mx-auto px-4 py-4 h-full">
        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden flex flex-col lg:flex-row h-[calc(100vh-2rem)]">
          <div className="w-72 bg-gradient-to-b from-slate-900 to-slate-800 text-white relative overflow-hidden border-r border-slate-700/50 shadow-xl">
            <div className="relative px-5 pt-10 pb-8 space-y-4 overflow-y-auto h-full" style={{ scrollbarColor: '#3b82f6 #1e293b', scrollbarWidth: 'thin' }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold uppercase text-blue-200">Portal</div>
                  <div className="font-extrabold text-xl">{isAdminMode === 'super' ? 'WORSO HQ' : 'Partner Portal'}</div>
                </div>
                <div className="px-3 py-1 rounded-full bg-white/10 text-[11px] font-semibold border border-white/10">
                  {isAdminMode === 'super' ? 'Super' : 'Partner'}
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all shadow-sm flex items-center gap-3 ${activeTab === 'overview'
                      ? 'bg-white/15 border-blue-400 text-white'
                      : 'bg-white/5 border-white/10 hover:border-blue-300 text-blue-100'
                    }`}
                >
                  <Layout size={18} /> Overview
                </button>

                {partner && (
                  <button
                    onClick={() => setActiveTab('partner-profile')}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all shadow-sm flex items-center gap-3 ${activeTab === 'partner-profile'
                        ? 'bg-white/15 border-blue-400 text-white'
                        : 'bg-white/5 border-white/10 hover:border-blue-300 text-blue-100'
                      }`}
                  >
                    <UserCircle size={18} /> Partner Profile
                  </button>
                )}

                {isAdminMode === 'super' ? (
                  <>
                    <button
                      onClick={() => setActiveTab('partners')}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all shadow-sm flex items-center gap-3 ${activeTab === 'partners'
                          ? 'bg-white/15 border-blue-400 text-white'
                          : 'bg-white/5 border-white/10 hover:border-blue-300 text-blue-100'
                        }`}
                    >
                      <Building size={18} /> Manage Partners
                    </button>
                    <button
                      onClick={() => setActiveTab('events')}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all shadow-sm flex items-center gap-3 ${activeTab === 'events'
                          ? 'bg-white/20 border-blue-400 text-white shadow-lg shadow-blue-500/20'
                          : 'bg-white/5 border-white/10 hover:border-blue-300 text-blue-100'
                        }`}
                    >
                      <Calendar size={18} /> Event Manager
                    </button>
                  </>
                ) : (
                  <div className="space-y-2 w-full">
                    <button
                      onClick={() => setActiveTab('events')}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all shadow-sm flex items-center gap-3 group ${activeTab === 'events'
                          ? 'bg-white/20 border-blue-400 text-white shadow-lg shadow-blue-500/20'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-blue-300/50 text-blue-100 hover:text-white'
                        }`}
                    >
                      <div className={`p-1.5 rounded-lg ${activeTab === 'events'
                          ? 'bg-blue-500/20'
                          : 'bg-white/5 group-hover:bg-blue-500/20'
                        }`}>
                        <Calendar size={16} className="text-blue-300" />
                      </div>
                      <span className="font-medium">My Events</span>
                      {activeTab === 'events' && (
                        <span className="ml-auto w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('courses');
                        if (courses.length > 0 && !selectedCourse) {
                          setSelectedCourse(courses[0]);
                        }
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all shadow-sm flex items-center gap-3 group ${activeTab === 'courses'
                          ? 'bg-white/20 border-blue-400 text-white shadow-lg shadow-blue-500/20'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-blue-300/50 text-blue-100 hover:text-white'
                        }`}
                    >
                      <div className={`p-1.5 rounded-lg ${activeTab === 'courses'
                          ? 'bg-blue-500/20'
                          : 'bg-white/5 group-hover:bg-blue-500/20'
                        }`}>
                        <BookOpen size={16} className="text-blue-300" />
                      </div>
                      <span className="font-medium">Courses</span>
                      {activeTab === 'courses' && (
                        <span className="ml-auto w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                      )}
                    </button>

                    <button
                      onClick={() => setActiveTab('team')}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all shadow-sm flex items-center gap-3 group ${activeTab === 'team'
                          ? 'bg-white/20 border-blue-400 text-white shadow-lg shadow-blue-500/20'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-blue-300/50 text-blue-100 hover:text-white'
                        }`}
                    >
                      <div className={`p-1.5 rounded-lg ${activeTab === 'team'
                          ? 'bg-blue-500/20'
                          : 'bg-white/5 group-hover:bg-blue-500/20'
                        }`}>
                        <Users size={16} className="text-blue-300" />
                      </div>
                      <span className="font-medium">Team Members</span>
                      {activeTab === 'team' && (
                        <span className="ml-auto w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                      )}
                    </button>

                    <button
                      onClick={() => setActiveTab('academia')}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all shadow-sm flex items-center gap-3 group ${activeTab === 'academia'
                          ? 'bg-white/20 border-blue-400 text-white shadow-lg shadow-blue-500/20'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-blue-300/50 text-blue-100 hover:text-white'
                        }`}
                    >
                      <div className={`p-1.5 rounded-lg ${activeTab === 'academia'
                          ? 'bg-blue-500/20'
                          : 'bg-white/5 group-hover:bg-blue-500/20'
                        }`}>
                        <BookOpen size={16} className="text-blue-300" />
                      </div>
                      <span className="font-medium">Academia</span>
                      {activeTab === 'academia' && (
                        <span className="ml-auto w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                      )}
                    </button>

                    <button
                      onClick={() => setActiveTab('forum')}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all shadow-sm flex items-center gap-3 group ${activeTab === 'forum'
                          ? 'bg-white/20 border-blue-400 text-white shadow-lg shadow-blue-500/20'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-blue-300/50 text-blue-100 hover:text-white'
                        }`}
                    >
                      <div className={`p-1.5 rounded-lg ${activeTab === 'forum'
                          ? 'bg-blue-500/20'
                          : 'bg-white/5 group-hover:bg-blue-500/20'
                        }`}>
                        <MessageSquare size={16} className="text-blue-300" />
                      </div>
                      <span className="font-medium">Community Forum</span>
                      {activeTab === 'forum' && (
                        <span className="ml-auto w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex-1 bg-white flex flex-col">
            <div className="px-8 py-5 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 backdrop-blur-sm shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold uppercase text-blue-600 mb-1">Admin Console</div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                    {activeTab === 'overview' && 'Dashboard Overview'}
                    {activeTab === 'partner-profile' && 'Edit Partner Profile'}
                    {activeTab === 'partners' && 'Partner Management'}
                    {activeTab === 'events' && (isAdminMode === 'super' ? 'Event Manager' : 'My Events')}

                    {activeTab === 'courses' && 'Course Management'}
                    {activeTab === 'academia' && 'Academia Portal'}
                    {activeTab === 'forum' && 'Community Forum'}
                  </h1>
                </div>
                <div className="px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-sm font-semibold border border-slate-200">
                  {isAdminMode === 'super' ? 'Global Control Panel' : (partner?.academyName ?? sites?.uae?.name ?? 'Partner Portal')}
                </div>
              </div>
            </div>
            <div
              className="p-6 lg:p-10 flex-1 overflow-y-auto bg-transparent h-full"
              style={{ scrollbarColor: '#1d4ed8 #f8fafc', scrollbarWidth: 'thin' }}
            >

              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {partner && (
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <div className="text-xs font-bold text-slate-500 uppercase mb-3">Partner profile (from login)</div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500 block">Academy</span>
                          <span className="font-semibold text-slate-900">{partner.academyName ?? '—'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Partner code</span>
                          <span className="font-semibold text-slate-900">{partner.partnerCode ?? '—'}</span>
                        </div>
                        {/* <div>
                          <span className="text-slate-500 block">Status</span>
                          <span className="font-semibold text-slate-900">{partner.status ?? '—'}</span>
                        </div> */}
                        <div>
                          <span className="text-slate-500 block">Theme</span>
                          <span className="font-semibold text-slate-900">{partner.themeColor ?? '—'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Location</span>
                          <span className="font-semibold text-slate-900">{partner.location ?? '—'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Contact email</span>
                          <span className="font-semibold text-slate-900">{partner.contactEmail ?? '—'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Phone</span>
                          <span className="font-semibold text-slate-900">{partner.phoneNumber ?? '—'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Commission</span>
                          <span className="font-semibold text-slate-900">{partner.commissionRate != null ? `${partner.commissionRate}%` : '—'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Revenue</span>
                          <span className="font-semibold text-slate-900">{partner.totalRevenue != null ? `₹${Number(partner.totalRevenue).toLocaleString()}` : (partner.revenue != null ? `₹${Number(partner.revenue).toLocaleString()}` : '—')}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Students</span>
                          <span className="font-semibold text-slate-900">{partner.studentsCount ?? 0}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Subdomain</span>
                          <span className="font-semibold text-slate-900 break-all">{partner.subdomain ?? '—'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Website</span>
                          <a href={partner.partnerWebsite} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline break-all">{partner.partnerWebsite ?? '—'}</a>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <div className="text-xs font-bold text-slate-500 uppercase mb-1">Revenue</div>
                      <div className="text-3xl font-bold text-slate-900">{isAdminMode === 'super' ? '$2.4M' : (partner ? `₹${Number(partner.totalRevenue ?? partner.revenue ?? 0).toLocaleString()}` : '$45,000')}</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <div className="text-xs font-bold text-slate-500 uppercase mb-1">{isAdminMode === 'super' ? 'Partners' : 'Registrations'}</div>
                      <div className="text-3xl font-bold text-slate-900">{isAdminMode === 'super' ? Object.keys(sites).length - 1 : (partner?.studentsCount ?? '128')}</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <div className="text-xs font-bold text-slate-500 uppercase mb-1">Field-Level Controls</div>
                      <div className="text-sm text-slate-600">
                        {isAdminMode === 'super' ? 'Rules + logos locked globally' : 'Local content editable; brand locked'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'partner-profile' && partner && (
                <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm max-w-xl">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-4">Partner profile (from login) — editable</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Academy</label>
                      <input
                        type="text"
                        value={partnerEdit.academyName}
                        onChange={(e) => setPartnerEdit((p) => ({ ...p, academyName: e.target.value }))}
                        placeholder="Academy name"
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Theme</label>
                      <select
                        value={partnerEdit.themeColor}
                        onChange={(e) => setPartnerEdit((p) => ({ ...p, themeColor: e.target.value }))}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option value="Green">Green</option>
                        <option value="Blue">Blue</option>
                        <option value="Purple">Purple</option>
                        <option value="Orange">Orange</option>
                        <option value="Red">Red</option>
                        <option value="Dark">Dark</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Contact email</label>
                      <div className="flex items-center gap-2">
                        <div className="p-3 bg-slate-100 rounded-lg">
                          <Mail size={18} className="text-slate-500" />
                        </div>
                        <input
                          type="email"
                          value={partnerEdit.contactEmail}
                          onChange={(e) => setPartnerEdit((p) => ({ ...p, contactEmail: e.target.value }))}
                          placeholder="contact@academy.com"
                          className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Phone</label>
                      <div className="flex items-center gap-2">
                        <div className="p-3 bg-slate-100 rounded-lg">
                          <Phone size={18} className="text-slate-500" />
                        </div>
                        <input
                          type="tel"
                          value={partnerEdit.phoneNumber}
                          onChange={(e) => setPartnerEdit((p) => ({ ...p, phoneNumber: e.target.value }))}
                          placeholder="+1 234 567 8900"
                          className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>
                    {partnerProfileError && (
                      <div className="text-sm text-red-600 font-medium">{partnerProfileError}</div>
                    )}
                    {partnerProfileSuccess && (
                      <div className="text-sm text-emerald-600 font-medium flex items-center gap-2">
                        <CheckCircle size={18} /> Profile saved successfully.
                      </div>
                    )}
                    <button
                      onClick={savePartnerProfile}
                      disabled={partnerProfileSaving}
                      className="w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {partnerProfileSaving ? 'Saving…' : 'Save profile'}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'partners' && (
                <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm max-w-2xl">
                  <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                    <Plus size={20} /> Add New Partner Nation
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Country Name</label>
                      <input
                        type="text"
                        className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="e.g. South Korea"
                        value={newPartner.country}
                        onChange={(e) => setNewPartner({ ...newPartner, country: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Subdomain</label>
                      <input
                        type="text"
                        className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="korea"
                        value={newPartner.subdomain}
                        onChange={(e) => setNewPartner({ ...newPartner, subdomain: e.target.value })}
                      />
                      <p className="text-xs text-slate-500 mt-1">Middleware will auto-route *.worso.org to the correct tenant.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Theme Color</label>
                      <select
                        className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        value={newPartner.theme}
                        onChange={(e) => setNewPartner({ ...newPartner, theme: e.target.value })}
                      >
                        <option value="blue">Worso Blue</option>
                        <option value="emerald">Emerald Green</option>
                        <option value="red">Crimson Red</option>
                      </select>
                    </div>
                    <button onClick={handleCreatePartner} className="px-6 py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 w-full">
                      Generate Micro-Site & Credentials
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'events' && (
                <div className="space-y-6">
                  <div className="flex gap-2 border-b border-slate-200 pb-2">
                    <button
                      onClick={() => setEventsSubTab('seasons')}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold ${eventsSubTab === 'seasons' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                    >
                      Seasons
                    </button>
                    <button
                      onClick={() => setEventsSubTab('events')}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold ${eventsSubTab === 'events' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                    >
                      Events
                    </button>
                    <button
                      onClick={() => setEventsSubTab('competitions')}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold ${eventsSubTab === 'competitions' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                    >
                      Competitions
                    </button>
                  </div>

                  {eventsSubTab === 'seasons' && (
                    <div className="space-y-6">
                      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                          <Calendar size={20} /> Add Season
                        </h3>
                        {seasonsError && <p className="text-sm text-red-600 mb-3">{seasonsError}</p>}
                        {seasonError && <p className="text-sm text-red-600 mb-3">{seasonError}</p>}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Name</label>
                            <input
                              type="text"
                              value={seasonForm.name}
                              onChange={(e) => setSeasonForm((f) => ({ ...f, name: e.target.value }))}
                              placeholder="e.g. Technoxian World Cup 16"
                              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Year</label>
                            <input
                              type="number"
                              value={seasonForm.year}
                              onChange={(e) => setSeasonForm((f) => ({ ...f, year: Number(e.target.value) || new Date().getFullYear() }))}
                              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                          </div>
                          <div className="flex items-end">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={seasonForm.isActive}
                                onChange={(e) => setSeasonForm((f) => ({ ...f, isActive: e.target.checked }))}
                                className="rounded border-slate-300"
                              />
                              <span className="text-sm font-medium text-slate-700">Active</span>
                            </label>
                          </div>
                          <div className="flex items-end">
                            <button onClick={handleAddSeason} disabled={seasonSaving} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50">
                              {seasonSaving ? 'Adding…' : 'Add Season'}
                            </button>
                          </div>
                        </div>
                        <div className="border-t border-slate-100 pt-4">
                          <h4 className="font-semibold text-slate-800 mb-3">Seasons list</h4>
                          {seasonsLoading ? (
                            <p className="text-slate-500 text-sm">Loading seasons…</p>
                          ) : seasons.length === 0 ? (
                            <p className="text-slate-500 text-sm">No seasons yet. Add one above.</p>
                          ) : (
                            <ul className="space-y-2">
                              {seasons.map((s) => (
                                <li key={s._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                  {editingSeasonId === s._id ? (
                                    <div className="flex flex-wrap items-center gap-2 flex-1">
                                      <input
                                        type="text"
                                        value={editSeasonForm.name}
                                        onChange={(e) => setEditSeasonForm((f) => ({ ...f, name: e.target.value }))}
                                        className="flex-1 min-w-[120px] p-2 border rounded"
                                      />
                                      <input
                                        type="number"
                                        value={editSeasonForm.year}
                                        onChange={(e) => setEditSeasonForm((f) => ({ ...f, year: Number(e.target.value) || new Date().getFullYear() }))}
                                        className="w-20 p-2 border rounded"
                                      />
                                      <label className="flex items-center gap-1 text-sm">
                                        <input
                                          type="checkbox"
                                          checked={editSeasonForm.isActive}
                                          onChange={(e) => setEditSeasonForm((f) => ({ ...f, isActive: e.target.checked }))}
                                        />
                                        Active
                                      </label>
                                      <button onClick={handleSaveEditSeason} className="px-3 py-1 bg-emerald-600 text-white text-sm rounded">Save</button>
                                      <button onClick={() => setEditingSeasonId(null)} className="px-3 py-1 bg-slate-200 text-slate-700 text-sm rounded">Cancel</button>
                                    </div>
                                  ) : (
                                    <>
                                      <span className="font-medium text-slate-800">{s.name} ({s.year})</span>
                                      <span className="text-xs text-slate-500">{s.isActive !== false ? 'Active' : 'Inactive'}</span>
                                      <div className="flex gap-2">
                                        <button onClick={() => handleEditSeason(s)} className="p-1.5 text-slate-600 hover:bg-slate-200 rounded" title="Edit"><Pencil size={14} /></button>
                                        <button onClick={() => handleDeleteSeason(s._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete"><Trash2 size={14} /></button>
                                      </div>
                                    </>
                                  )}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {eventsSubTab === 'events' && (
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-2xl">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Calendar size={20} /> Add Event
                      </h3>
                      {eventsListError && <p className="text-sm text-amber-600 mb-3">{eventsListError}</p>}
                      {eventError && <p className="text-sm text-red-600 mb-3">{eventError}</p>}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Season</label>
                          <select
                            value={eventForm.season_id}
                            onChange={(e) => setEventForm((f) => ({ ...f, season_id: e.target.value }))}
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          >
                            <option value="">Select season</option>
                            {seasons.map((s) => (
                              <option key={s._id} value={s._id}>{s.name} ({s.year})</option>
                            ))}
                          </select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Name</label>
                            <input
                              type="text"
                              value={eventForm.name}
                              onChange={(e) => setEventForm((f) => ({ ...f, name: e.target.value }))}
                              placeholder="e.g. PRC Bangalore Open"
                              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Type</label>
                            <select
                              value={eventForm.type}
                              onChange={(e) => setEventForm((f) => ({ ...f, type: e.target.value }))}
                              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                              <option value="PRC">PRC</option>
                              <option value="ZRC">ZRC</option>
                              <option value="NRC">NRC</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Start date</label>
                            <input
                              type="date"
                              value={eventForm.start_date}
                              onChange={(e) => setEventForm((f) => ({ ...f, start_date: e.target.value }))}
                              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">End date</label>
                            <input
                              type="date"
                              value={eventForm.end_date}
                              onChange={(e) => setEventForm((f) => ({ ...f, end_date: e.target.value }))}
                              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Country</label>
                            <input
                              type="text"
                              value={eventForm.country}
                              onChange={(e) => setEventForm((f) => ({ ...f, country: e.target.value }))}
                              placeholder="e.g. India"
                              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">State</label>
                            <input
                              type="text"
                              value={eventForm.state}
                              onChange={(e) => setEventForm((f) => ({ ...f, state: e.target.value }))}
                              placeholder="e.g. Karnataka"
                              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">City</label>
                            <input
                              type="text"
                              value={eventForm.city}
                              onChange={(e) => setEventForm((f) => ({ ...f, city: e.target.value }))}
                              placeholder="e.g. Bangalore"
                              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Venue</label>
                          <input
                            type="text"
                            value={eventForm.venue}
                            onChange={(e) => setEventForm((f) => ({ ...f, venue: e.target.value }))}
                            placeholder="e.g. Kanteerava Stadium"
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Registration fee</label>
                          <input
                            type="number"
                            value={eventForm.registration_fee}
                            onChange={(e) => setEventForm((f) => ({ ...f, registration_fee: Number(e.target.value) || 0 }))}
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>
                        <button onClick={handleAddEvent} disabled={eventSaving} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50">
                          {eventSaving ? 'Adding…' : 'Add Event'}
                        </button>
                      </div>
                      <div className="mt-6 border-t border-slate-100 pt-4">
                        <h4 className="font-semibold text-slate-800 mb-3">All events (from API)</h4>
                        {eventsLoading ? (
                          <p className="text-sm text-slate-500">Loading events…</p>
                        ) : eventList.length === 0 ? (
                          <p className="text-sm text-slate-500">No events yet. Add one above or they will appear here once loaded.</p>
                        ) : (
                          <div className="space-y-4 max-h-[32rem] overflow-y-auto pr-1">
                            {eventList.map((ev) => {
                              const isEditing = editingEventId === ev._id;
                              const startDate = ev.start_date ? new Date(ev.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
                              const endDate = ev.end_date ? new Date(ev.end_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
                              const seasonName = Array.isArray(ev.season) && ev.season[0] ? `${ev.season[0].name} (${ev.season[0].year})` : null;
                              const competitions = Array.isArray(ev.competition) ? ev.competition : [];
                              const statusColor = ev.status === 'live' ? 'bg-emerald-100 text-emerald-700' : ev.status === 'closed' ? 'bg-slate-200 text-slate-700' : 'bg-amber-100 text-amber-700';
                              return (
                                <div key={ev._id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                                  {isEditing ? (
                                    <div className="space-y-3">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        <input value={editEventForm.name} onChange={(e) => setEditEventForm((f) => ({ ...f, name: e.target.value }))} placeholder="Name" className="p-2 border rounded text-sm" />
                                        <select value={editEventForm.type} onChange={(e) => setEditEventForm((f) => ({ ...f, type: e.target.value }))} className="p-2 border rounded text-sm">
                                          <option value="PRC">PRC</option><option value="ZRC">ZRC</option><option value="NRC">NRC</option><option value="WRC">WRC</option>
                                        </select>
                                        <input type="date" value={editEventForm.start_date} onChange={(e) => setEditEventForm((f) => ({ ...f, start_date: e.target.value }))} className="p-2 border rounded text-sm" />
                                        <input type="date" value={editEventForm.end_date} onChange={(e) => setEditEventForm((f) => ({ ...f, end_date: e.target.value }))} className="p-2 border rounded text-sm" />
                                        <input value={editEventForm.country} onChange={(e) => setEditEventForm((f) => ({ ...f, country: e.target.value }))} placeholder="Country" className="p-2 border rounded text-sm" />
                                        <input value={editEventForm.state} onChange={(e) => setEditEventForm((f) => ({ ...f, state: e.target.value }))} placeholder="State" className="p-2 border rounded text-sm" />
                                        <input value={editEventForm.city} onChange={(e) => setEditEventForm((f) => ({ ...f, city: e.target.value }))} placeholder="City" className="p-2 border rounded text-sm" />
                                        <input value={editEventForm.venue} onChange={(e) => setEditEventForm((f) => ({ ...f, venue: e.target.value }))} placeholder="Venue" className="p-2 border rounded text-sm md:col-span-2" />
                                        <input type="number" value={editEventForm.registration_fee} onChange={(e) => setEditEventForm((f) => ({ ...f, registration_fee: Number(e.target.value) || 0 }))} placeholder="Fee" className="p-2 border rounded text-sm" />
                                        <select value={editEventForm.status} onChange={(e) => setEditEventForm((f) => ({ ...f, status: e.target.value }))} className="p-2 border rounded text-sm">
                                          <option value="upcoming">Upcoming</option><option value="live">Live</option><option value="closed">Closed</option>
                                        </select>
                                      </div>
                                      <div className="flex gap-2">
                                        <button onClick={handleSaveEditEvent} disabled={eventSaving} className="px-3 py-1.5 bg-emerald-600 text-white text-sm font-medium rounded hover:bg-emerald-700 disabled:opacity-50">Save</button>
                                        <button onClick={() => setEditingEventId(null)} className="px-3 py-1.5 bg-slate-200 text-slate-700 text-sm rounded hover:bg-slate-300">Cancel</button>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                                        <div>
                                          <h5 className="font-bold text-slate-900">{ev.name}</h5>
                                          {ev.publicEventId && <p className="text-xs text-slate-500 font-mono">{ev.publicEventId}</p>}
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${statusColor}`}>
                                            {ev.status ?? 'upcoming'}
                                          </span>
                                          <button onClick={() => handleEditEvent(ev)} className="p-1.5 text-slate-600 hover:bg-slate-200 rounded" title="Edit"><Pencil size={14} /></button>
                                          <button onClick={() => handleDeleteEvent(ev._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete"><Trash2 size={14} /></button>
                                        </div>
                                      </div>
                                      <div className="flex flex-wrap gap-2 mb-2">
                                        <span className="inline-flex px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-medium">{ev.type}</span>
                                        {ev.zone && <span className="inline-flex px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs">{ev.zone}</span>}
                                      </div>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-slate-600 mb-2">
                                        <p><span className="text-slate-500">Dates:</span> {startDate} – {endDate}</p>
                                        <p><span className="text-slate-500">Venue:</span> {ev.venue || '—'}</p>
                                        <p><span className="text-slate-500">Location:</span> {[ev.city, ev.state, ev.country].filter(Boolean).join(', ') || '—'}</p>
                                        <p><span className="text-slate-500">Fee:</span> ₹{Number(ev.registration_fee ?? 0).toLocaleString()}</p>
                                      </div>
                                      {seasonName && <p className="text-xs text-slate-500 mb-2">Season: {seasonName}</p>}
                                      {competitions.length > 0 && (
                                        <div className="mt-2 pt-2 border-t border-slate-100">
                                          <p className="text-xs font-semibold text-slate-600 mb-1">Competitions ({competitions.length})</p>
                                          <ul className="flex flex-wrap gap-1">
                                            {competitions.map((c) => (
                                              <li key={c._id} className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700">{c.name}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {eventsSubTab === 'competitions' && (
                    <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                          <Trophy size={20} /> Competitions
                        </h3>
                        <button
                          type="button"
                          onClick={() => { setEditingCompetition(null); setShowCompetitionModal(true); }}
                          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 flex items-center gap-2"
                        >
                          <Plus size={18} /> Add Competition
                        </button>
                      </div>
                      {competitionError && <p className="text-sm text-red-600 mt-3">{competitionError}</p>}
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <h4 className="font-semibold text-slate-800 mb-3">All competitions (from API)</h4>
                      {competitionsListError && <p className="text-sm text-amber-600 mb-2">{competitionsListError}</p>}
                      {competitionsLoading ? (
                        <p className="text-sm text-slate-500">Loading competitions…</p>
                      ) : competitionList.length === 0 ? (
                        <p className="text-sm text-slate-500">No competitions yet.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[28rem] overflow-y-auto">
                          {competitionList.map((c) => {
                            const ev = c.event && typeof c.event === 'object' ? c.event : {};
                            const season = c.season && typeof c.season === 'object' && !Array.isArray(c.season) ? c.season : null;
                            const seasonName = season ? `${season.name} (${season.year})` : null;
                            return (
                              <div key={c._id} className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 hover:shadow-sm transition-shadow">
                                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                  <div>
                                    <h5 className="font-bold text-slate-900">{c.name}</h5>
                                    <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800">{c.category}</span>
                                  </div>
                                  <div className="flex gap-1">
                                    <button
                                      type="button"
                                      onClick={() => { setEditingCompetition(c); setShowCompetitionModal(true); }}
                                      className="p-1.5 text-slate-600 hover:bg-slate-200 rounded"
                                      title="Edit competition"
                                    >
                                      <Pencil size={14} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteCompetition(c._id)}
                                      disabled={competitionDeletingId === c._id}
                                      className="p-1.5 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                                      title="Delete competition"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </div>
                                {c.bannerImage && <img src={c.bannerImage} alt="" className="w-full h-28 object-cover rounded-lg mb-2" />}
                                <p className="text-sm text-slate-600 mb-2 line-clamp-2">{c.description || '—'}</p>
                                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                                  <span>Event: {ev.name || '—'}</span>
                                  {seasonName && <span>Season: {seasonName}</span>}
                                  <span>Prize: ₹{Number(c.prizePool ?? 0).toLocaleString()}</span>
                                  <span>Team: {c.teamRequirements?.minMembers ?? 0}–{c.teamRequirements?.maxMembers ?? 0}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    </div>
                  )}

                  {showCompetitionModal && (
                    <CompetitionFormModal
                      competition={editingCompetition}
                      events={eventList}
                      seasons={seasons}
                      selectedEvent={null}
                      selectedSeason={null}
                      onSave={handleCompetitionModalSave}
                      onCancel={handleCompetitionModalCancel}
                    />
                  )}
                </div>
              )}
              {activeTab === 'academia' && (
                <div className="space-y-6">
                  <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Academia Portal</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                        <h3 className="font-bold text-blue-700 mb-3">Academic Programs</h3>
                        <p className="text-sm text-slate-600 mb-4">Manage degree programs, courses, and academic requirements for your institution.</p>
                        <button className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-md font-medium">
                          View Programs
                        </button>
                      </div>
                      <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                        <h3 className="font-bold text-green-700 mb-3">Faculty Management</h3>
                        <p className="text-sm text-slate-600 mb-4">Add, remove, or update faculty members and their academic profiles.</p>
                        <button className="text-sm bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-md font-medium">
                          Manage Faculty
                        </button>
                      </div>
                      <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
                        <h3 className="font-bold text-purple-700 mb-3">Student Portal</h3>
                        <p className="text-sm text-slate-600 mb-4">Access student records, grades, and academic progress tracking.</p>
                        <button className="text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-md font-medium">
                          View Students
                        </button>
                      </div>
                    </div>
                    <div className="mt-8 bg-white border border-slate-200 rounded-lg p-6">
                      <h3 className="font-bold text-lg text-slate-800 mb-4">Academic Calendar</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-slate-700 mb-3">Upcoming Events</h4>
                          <ul className="space-y-3">
                            <li className="flex items-start">
                              <div className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded mr-3">MAY 15</div>
                              <div>
                                <div className="font-medium text-slate-800">Fall Semester Registration Opens</div>
                                <div className="text-xs text-slate-500">All day</div>
                              </div>
                            </li>
                            <li className="flex items-start">
                              <div className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded mr-3">JUN 1</div>
                              <div>
                                <div className="font-medium text-slate-800">Summer Research Symposium</div>
                                <div className="text-xs text-slate-500">10:00 AM - 4:00 PM</div>
                              </div>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-700 mb-3">Quick Actions</h4>
                          <div className="space-y-2">
                            <button className="w-full text-left px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-md text-sm font-medium">
                              Add New Course
                            </button>
                            <button className="w-full text-left px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-md text-sm font-medium">
                              Generate Academic Report
                            </button>
                            <button className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md text-sm font-medium">
                              Publish Academic Calendar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {
                activeTab === "team" && (
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-slate-800">Team Members</h2>
                        <button
                          onClick={() => setShowAddMemberModal(true)}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          <UserPlus size={18} />
                          Add Team Member
                        </button>
                      </div>

                      <div className="mb-6">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                          <input
                            type="text"
                            placeholder="Search team members..."
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {teamMembers.map((member) => (
                          <div key={member.id} className="bg-white border border-slate-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-5">
                              <div className="flex items-start space-x-4">
                                <img
                                  src={member.avatar}
                                  alt={member.name}
                                  className="w-16 h-16 rounded-lg object-cover border border-slate-200"
                                />
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-bold text-slate-800 text-lg truncate">{member.name}</h3>
                                  <p className="text-blue-600 font-medium text-sm">{member.role}</p>
                                  <p className="text-slate-500 text-sm mt-1 flex items-center">
                                    <Mail size={14} className="mr-1.5 flex-shrink-0" />
                                    <span className="truncate">{member.email}</span>
                                  </p>
                                  <p className="text-slate-500 text-sm flex items-center">
                                    <Phone size={14} className="mr-1.5 flex-shrink-0" />
                                    {member.phone}
                                  </p>
                                </div>
                              </div>


                            </div>
                            <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex justify-end space-x-2">
                              <button className="text-sm text-slate-600 hover:text-blue-600 p-1.5 hover:bg-blue-50 rounded-md">
                                Edit
                              </button>
                              <button className="text-sm text-slate-600 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-md">
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              }
              {activeTab === 'courses' && (
                <div className="space-y-8">
                  {/* Course List Sidebar */}
                  <div className="lg:col-span-1 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/50 p-4 overflow-y-auto h-full">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2 sticky top-0 bg-white pb-2 z-10">
                      <BookOpen size={20} /> Available Courses
                    </h3>
                    <div className="space-y-3 -mt-2">
                      {courses.map(course => {
                        const progress = 60; // This should be calculated based on actual progress
                        const lessonCount = course.modules.reduce((total, module) => total + module.videos.length, 0);

                        return (
                          <div
                            key={course.id}
                            onClick={() => setSelectedCourse(course)}
                            className={`p-4 rounded-xl cursor-pointer transition-all ${selectedCourse?.id === course.id
                                ? 'bg-gradient-to-r from-blue-50 to-blue-50 border border-blue-100 shadow-sm'
                                : 'hover:bg-slate-50 border border-slate-100 hover:border-slate-200'
                              }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center ${selectedCourse?.id === course.id ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
                                }`}>
                                <BookOpen size={16} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-slate-800 truncate">{course.title}</div>
                                <div className="flex items-center justify-between mt-1">
                                  <span className="text-xs text-slate-500">{lessonCount} {lessonCount === 1 ? 'lesson' : 'lessons'}</span>
                                  <span className="text-xs font-medium text-blue-600">{progress}%</span>
                                </div>
                                <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5">
                                  <div
                                    className="bg-gradient-to-r from-blue-500 to-blue-400 h-1.5 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Course Content Area */}
                  <div className="lg:col-span-3 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/50 flex flex-col h-full overflow-hidden">
                    {selectedCourse ? (
                      <div className="flex flex-col h-full">
                        {/* Video Player */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 aspect-video flex-shrink-0 flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                          {selectedVideo ? (
                            <div className="w-full h-full flex items-center justify-center relative z-20">
                              <div className="text-center p-6 max-w-3xl">
                                <div className="text-3xl font-bold text-white mb-3">{selectedVideo.title}</div>
                                <div className="aspect-video bg-slate-800/80 rounded-xl flex items-center justify-center mb-6 border border-slate-700/50 shadow-xl">
                                  <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer group">
                                    <Play size={28} className="text-white ml-1 group-hover:scale-110 transition-transform" />
                                  </div>
                                </div>
                                <div className="text-slate-300 mb-6 text-sm bg-slate-900/30 p-4 rounded-lg border border-slate-800/50">
                                  <p className="mb-3">
                                    This is a placeholder for the video player. In a real implementation,
                                    this would show the actual video content for: <span className="font-medium text-white">{selectedVideo.title}</span>
                                  </p>
                                  <button
                                    onClick={() => handleVideoComplete(selectedCourse.id,
                                      selectedCourse.modules.find(m => m.videos.some(v => v.id === selectedVideo.id))?.id,
                                      selectedVideo.id
                                    )}
                                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-all hover:shadow-lg hover:-translate-y-0.5"
                                  >
                                    <CheckCircle size={16} />
                                    Mark as Complete
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center p-8 relative z-20">
                              <div className="w-20 h-20 mx-auto mb-5 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/10">
                                <BookOpen size={32} className="text-blue-400/80" />
                              </div>
                              <h3 className="text-2xl font-bold text-white mb-2">Welcome to {selectedCourse.title}</h3>
                              <p className="text-slate-300 max-w-md mx-auto">
                                Select a lesson from the course content to begin your learning journey.
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Course Modules */}
                        <div className="flex-1 overflow-y-auto">
                          <div className="max-w-4xl mx-auto p-6">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedCourse.title}</h2>
                            <p className="text-slate-600 mb-8">{selectedCourse.description}</p>
                            <div className="space-y-6">
                              {selectedCourse.modules.map((module, moduleIndex) => {
                                const completedVideos = module.videos.filter(v => v.completed).length;
                                const totalVideos = module.videos.length;
                                const progress = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;


                                return (
                                  <div key={module.id} className="border border-slate-100 rounded-xl overflow-hidden">
                                    <div className="bg-slate-50 p-4 border-b border-slate-100">
                                      <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-slate-800 flex items-center">
                                          <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mr-3 text-sm font-bold">
                                            {moduleIndex + 1}
                                          </span>
                                          {module.title}
                                        </h3>
                                        <div className="flex items-center">
                                          <span className="text-xs font-medium text-slate-500 mr-2">{completedVideos}/{totalVideos} completed</span>
                                          <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                            <div
                                              className="h-full bg-blue-500 transition-all duration-300"
                                              style={{ width: `${progress}%` }}
                                            ></div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="divide-y divide-slate-100">
                                      {module.videos.map((video, videoIndex) => {
                                        const isLocked = isVideoLocked(selectedCourse.id, moduleIndex, videoIndex);
                                        const isActive = selectedVideo?.id === video.id;

                                        return (
                                          <div
                                            key={video.id}
                                            onClick={() => !isLocked && setSelectedVideo(video)}
                                            className={`p-4 transition-all ${isActive
                                                ? 'bg-blue-50/50'
                                                : isLocked
                                                  ? 'bg-white'
                                                  : 'bg-white hover:bg-slate-50/80 cursor-pointer'
                                              }`}
                                          >
                                            <div className="flex items-start">
                                              <div className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center ${video.completed
                                                  ? 'bg-green-50 text-green-600 border border-green-100'
                                                  : isLocked
                                                    ? 'bg-slate-100 text-slate-400 border border-slate-200'
                                                    : 'bg-blue-50 text-blue-600 border border-blue-100'
                                                }`}>
                                                {video.completed ? (
                                                  <CheckCircle size={16} className="fill-current" />
                                                ) : isLocked ? (
                                                  <Lock size={14} />
                                                ) : (
                                                  <Play size={14} className="ml-0.5" />
                                                )}
                                              </div>
                                              <div className="flex-1 min-w-0">
                                                <div className={`font-medium ${isLocked ? 'text-slate-400' : 'text-slate-800'
                                                  }`}>
                                                  {video.title}
                                                </div>
                                                <div className="flex items-center mt-1">
                                                  <span className="text-xs text-slate-500">{video.duration}</span>
                                                  <span className="mx-2 text-slate-300">•</span>
                                                  <span className={`text-xs font-medium ${video.completed
                                                      ? 'text-green-600 bg-green-50 px-2 py-0.5 rounded-full'
                                                      : isLocked
                                                        ? 'text-slate-500'
                                                        : 'text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full'
                                                    }`}>
                                                    {isLocked ? 'Locked' : video.completed ? 'Completed' : 'Not started'}
                                                  </span>
                                                </div>
                                              </div>
                                              {isActive && (
                                                <div className="ml-2 text-blue-600">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M5 12h14"></path>
                                                    <path d="m12 5 7 7-7 7"></path>
                                                  </svg>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-center p-8">
                        <div>
                          <BookOpen size={48} className="mx-auto mb-4 text-slate-300" />
                          <h3 className="text-xl font-bold text-slate-700 mb-2">No Course Selected</h3>
                          <p className="text-slate-500">
                            {courses.length > 0
                              ? 'Select a course from the sidebar to get started.'
                              : 'No courses available at the moment.'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {activeTab === 'forum' && (
                <ForumView />
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminView;

