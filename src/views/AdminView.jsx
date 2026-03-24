import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Calendar, Layout, Building, Plus, Sparkles, LogOut, BookOpen, Lock, CheckCircle, Play, MessageSquare, Search, X, Users, UserPlus, Briefcase, Mail, Phone, UserCircle, Trophy, Trash2, Pencil, CreditCard, Shield, ArrowRight, User, Building2, GraduationCap, MapPin, Upload, Image as ImageIcon } from 'lucide-react';
import RichTextEditor from '../components/RichTextEditor';
import ForumView from '../components/ForumView';
import { DEFAULT_SITES } from '../constants/data';
import { COMPETITION_CATEGORIES } from '../constants/competition';
import { COUNTRY_DIAL_CODES } from '../constants/countryDialCodes';
import { callGemini } from '../utils/gemini';
import { getMyMembership } from '../app/auth/authApi';
import { getMembershipsByPartner } from '../api/membershipApi';
import { addClubAdmin, deleteClub, getClubsByPartner, getClubsWithMembersByPartner, updateClub } from '../api/clubApi';
import { addPartnerAbout, getPartnerAbout, updatePartnerAbout, deletePartnerAbout } from '../api/partnerAboutApi';
import { addAdvisoryBoard, getAdvisoryBoard, editAdvisoryBoard, deleteAdvisoryBoard, addAdvisoryRefree, getAdvisoryRefree, editAdvisoryRefree, deleteAdvisoryRefree } from '../api/advisoryApi';
import { useLogout } from '../hooks/useLogout';
import {
  fetchPartnerById,
  updatePartner,
  updatePartnerFormData,
  setPartnerAuth,
  getPartnerAuth,
  listSeasons,
  listSeasonsGet,
  listCompetitionsGet,
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
import { getEventsList, getEventsByWebsite } from '../api/eventApi';
import { getLocationCodeFromPath } from '../utils/locationRoutes';
import { COUNTRIES, getStatesByCountry, getCitiesByState } from '../constants/locationData';

const AdminView = ({ setSites, sites, setView, defaultMode, user, setUser }) => {
  const location = useLocation();
  const [isAdminMode] = useState(defaultMode || user?.role || 'super');
  const partner = user?.partner ?? null;
  const { logout } = useLogout({ setUser, setView, type: 'partner' });
  // Partner code from user.partner or route (e.g. /TH/admin-dashboard → TH)
  const partnerCode = (partner?.partnerCode || getLocationCodeFromPath(location?.pathname || '') || '').toString().trim().toUpperCase();
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

  // Partner home content state
  const [partnerHomeData, setPartnerHomeData] = useState(null);
  const [partnerHomeLoading, setPartnerHomeLoading] = useState(false);
  const [partnerHomeSaving, setPartnerHomeSaving] = useState(false);
  const [partnerHomeError, setPartnerHomeError] = useState('');
  const [partnerHomeSuccess, setPartnerHomeSuccess] = useState(false);
  const [partnerHomeSubTab, setPartnerHomeSubTab] = useState('home');
  const emptyPartnerAboutForm = { _id: '', heading: '', content: '' };
  const [partnerAboutForm, setPartnerAboutForm] = useState(emptyPartnerAboutForm);
  const [partnerAboutList, setPartnerAboutList] = useState([]);
  const [selectedPartnerAbout, setSelectedPartnerAbout] = useState(null);
  const [partnerAboutLoading, setPartnerAboutLoading] = useState(false);
  const [showPartnerAboutForm, setShowPartnerAboutForm] = useState(false);
  const [partnerAboutSaving, setPartnerAboutSaving] = useState(false);
  const [partnerAboutDeleting, setPartnerAboutDeleting] = useState(false);
  const [partnerAboutError, setPartnerAboutError] = useState('');
  const [partnerAboutSuccess, setPartnerAboutSuccess] = useState('');
  const emptyAdvisoryForm = { _id: '', name: '', designation: '', image: '', _imageFile: null };
  const [advisoryBoardForm, setAdvisoryBoardForm] = useState(emptyAdvisoryForm);
  const [advisoryBoardList, setAdvisoryBoardList] = useState([]);
  const [advisoryBoardLoading, setAdvisoryBoardLoading] = useState(false);
  const [showAdvisoryBoardForm, setShowAdvisoryBoardForm] = useState(false);
  const [advisoryBoardSaving, setAdvisoryBoardSaving] = useState(false);
  const [advisoryBoardDeleting, setAdvisoryBoardDeleting] = useState(false);
  const [advisoryBoardError, setAdvisoryBoardError] = useState('');
  const [advisoryBoardSuccess, setAdvisoryBoardSuccess] = useState('');
  const [advisoryRefreeForm, setAdvisoryRefreeForm] = useState(emptyAdvisoryForm);
  const [advisoryRefreeList, setAdvisoryRefreeList] = useState([]);
  const [advisoryRefreeLoading, setAdvisoryRefreeLoading] = useState(false);
  const [showAdvisoryRefreeForm, setShowAdvisoryRefreeForm] = useState(false);
  const [advisoryRefreeSaving, setAdvisoryRefreeSaving] = useState(false);
  const [advisoryRefreeDeleting, setAdvisoryRefreeDeleting] = useState(false);
  const [advisoryRefreeError, setAdvisoryRefreeError] = useState('');
  const [advisoryRefreeSuccess, setAdvisoryRefreeSuccess] = useState('');

  const normalizePartnerAbout = (payload) => {
    if (!payload || typeof payload !== 'object') return null;
    const heading = payload.heading || payload.title || '';
    const content = payload.content || payload.description || '';
    if (!heading && !content && !payload._id) return null;
    return {
      _id: payload._id || payload.id || '',
      heading,
      content,
    };
  };

  const normalizeAdvisoryPerson = (payload) => {
    if (!payload || typeof payload !== 'object') return null;
    const name = payload.name || '';
    const designation = payload.designation || '';
    const image = payload.image || payload.photo || payload.avatar || '';
    if (!payload._id && !name && !designation && !image) return null;
    return {
      _id: payload._id || payload.id || '',
      name,
      designation,
      image,
      _imageFile: null,
    };
  };

  const getPlainTextPreview = (html = '') =>
    String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

  const buildAdvisoryFormData = (formState) => {
    const fd = new FormData();
    const name = (formState?.name || '').trim();
    const designation = (formState?.designation || '').trim();
    if (name) fd.append('name', name);
    if (designation) fd.append('designation', designation);
    if (formState?._imageFile) fd.append('image', formState._imageFile);
    return fd;
  };

  const mapPartnerToHomeContent = (partnerRecord) => {
    if (!partnerRecord) return null;

    const footerInfo = partnerRecord.footerInfo || {};

    // youtubeVideo: array of { url }. No title. Backend key = youtubeVideo, value = array (or JSON string)
    let youtubeVideo = [];
    const yv = partnerRecord.youtubeVideo;
    if (Array.isArray(yv) && yv.length > 0) {
      youtubeVideo = yv.map((v) => ({ url: v?.url || v?.youtubeUrl || (typeof v === 'string' ? v : '') }));
    } else if (typeof yv === 'string' && yv.trim()) {
      try {
        const parsed = JSON.parse(yv);
        if (Array.isArray(parsed) && parsed.length > 0) {
          youtubeVideo = parsed.map((v) => ({ url: v?.url || v?.youtubeUrl || (typeof v === 'string' ? v : '') }));
        } else {
          youtubeVideo = [{ url: yv.trim() }];
        }
      } catch {
        youtubeVideo = [{ url: yv.trim() }];
      }
    }

    return {
      home: {
        title: partnerRecord.heroTitle || '',
        subtitle: partnerRecord.heroSubtitle || '',
        bannerImage: partnerRecord.heroBannerImage || partnerRecord.bannerImage || '',
        bannerVideo: partnerRecord.bannerVideo || '',
        youtubeVideo,
        themeColor: partnerRecord.themeColor || 'Blue',
      },
      event: {
        title: partnerRecord.eventTitle || '',
        location: partnerRecord.eventLocation || '',
        date: partnerRecord.eventDate || '',
      },
      socialLinks: partnerRecord.socialLinks || {},
      footer: {
        email: footerInfo.email || '',
        phone: footerInfo.phone || '',
        address: footerInfo.address || '',
        countries: Array.isArray(footerInfo.countries) ? footerInfo.countries : [],
      },
      quickLinks: Array.isArray(partnerRecord.quickLinks) ? partnerRecord.quickLinks : [],
      videos: Array.isArray(partnerRecord.videos) ? partnerRecord.videos : [],
      products: Array.isArray(partnerRecord.products) ? partnerRecord.products : [],
      news: Array.isArray(partnerRecord.news) ? partnerRecord.news : [],
      supporters: Array.isArray(partnerRecord.supporters) ? partnerRecord.supporters : [],
      stats: {
        challenges: partnerRecord.stats?.challenges ?? partnerRecord.challenges ?? '',
        teams: partnerRecord.stats?.teams ?? partnerRecord.teams ?? '',
        club: partnerRecord.stats?.club ?? partnerRecord.club ?? '',
        member: partnerRecord.stats?.member ?? partnerRecord.member ?? '',
        viewership: partnerRecord.stats?.viewership ?? partnerRecord.viewership ?? '',
      },
    };
  };

  const buildHomeContentPayload = (data) => {
    if (!data) return {};

    const payload = {
      heroTitle: data.home?.title?.trim() || undefined,
      heroSubtitle: data.home?.subtitle?.trim() || undefined,
      youtubeVideo: Array.isArray(data.home?.youtubeVideo) && data.home.youtubeVideo.length > 0 ? data.home.youtubeVideo : undefined,
      bannerVideo: data.home?.bannerVideo?.trim() || undefined,
      themeColor: data.home?.themeColor || undefined,
      eventTitle: data.event?.title?.trim() || undefined,
      eventLocation: data.event?.location?.trim() || undefined,
      eventDate: data.event?.date?.trim() || undefined,
      socialLinks: data.socialLinks || undefined,
      footerInfo: data.footer || undefined,
      quickLinks: Array.isArray(data.quickLinks) ? data.quickLinks : undefined,
      videos: Array.isArray(data.videos) ? data.videos : undefined,
      products: Array.isArray(data.products) ? data.products : undefined,
      news: Array.isArray(data.news) ? data.news : undefined,
      supporters: Array.isArray(data.supporters) ? data.supporters : undefined,
    };

    if (data.stats && typeof data.stats === 'object') {
      if (data.stats.challenges?.trim()) payload.challenges = data.stats.challenges.trim();
      if (data.stats.teams?.trim()) payload.teams = data.stats.teams.trim();
      if (data.stats.club?.trim()) payload.club = data.stats.club.trim();
      if (data.stats.member?.trim()) payload.member = data.stats.member.trim();
      if (data.stats.viewership?.trim()) payload.viewership = data.stats.viewership.trim();
    }

    return payload;
  };

  const buildPartnerHomeFormData = (data) => {
    const form = new FormData();
    const home = data?.home || {};
    if (home.title?.trim()) form.append('heroTitle', home.title.trim());
    if (home.subtitle?.trim()) form.append('heroSubtitle', home.subtitle.trim());
    if (Array.isArray(home.youtubeVideo) && home.youtubeVideo.length > 0) {
      const arr = home.youtubeVideo.map((v) => (typeof v === 'string' ? v : v?.url || v?.youtubeUrl || '')).filter((s) => typeof s === 'string' && s.trim());
      if (arr.length > 0) form.append('youtubeVideo', JSON.stringify(arr));
    }
    if (home.themeColor?.trim()) form.append('themeColor', home.themeColor.trim());
    if (home._bannerVideoFile) form.append('bannerVideo', home._bannerVideoFile);
    else if (home.bannerVideo?.trim()) form.append('bannerVideo', home.bannerVideo.trim());

    const event = data?.event || {};
    if (event.title?.trim()) form.append('eventTitle', event.title.trim());
    if (event.location?.trim()) form.append('eventLocation', event.location.trim());
    if (event.date?.trim()) form.append('eventDate', event.date.trim());

    if (data?.socialLinks && Object.keys(data.socialLinks).length > 0) {
      form.append('socialLinks', JSON.stringify(data.socialLinks));
    }
    if (data?.footer && Object.keys(data.footer).length > 0) {
      form.append('footerInfo', JSON.stringify(data.footer));
    }
    if (Array.isArray(data?.quickLinks) && data.quickLinks.length > 0) {
      form.append('quickLinks', JSON.stringify(data.quickLinks));
    }
    if (Array.isArray(data?.videos) && data.videos.length > 0) {
      form.append('videos', JSON.stringify(data.videos));
    }
    if (Array.isArray(data?.products) && data.products.length > 0) {
      form.append('products', JSON.stringify(data.products));
    }

    if (Array.isArray(data?.news) && data.news.length > 0) {
      const newsForPayload = data.news.map((item) => {
        const { _imageFile, image, ...rest } = item;
        return _imageFile ? rest : { ...rest, image };
      });
      form.append('news', JSON.stringify(newsForPayload));
      data.news.forEach((item, i) => {
        if (item._imageFile) form.append(`newsImage_${i}`, item._imageFile);
      });
    }

    if (Array.isArray(data?.supporters) && data.supporters.length > 0) {
      const supportersForPayload = data.supporters.map((item) => {
        const { _logoFile, logo, ...rest } = item;
        return _logoFile ? rest : { ...rest, logo };
      });
      form.append('supporters', JSON.stringify(supportersForPayload));
      data.supporters.forEach((item, i) => {
        if (item._logoFile) form.append(`supporterLogo_${i}`, item._logoFile);
      });
    }

    const stats = data?.stats;
    if (stats && typeof stats === 'object') {
      const v = (s) => String(s ?? '').trim();
      if (v(stats.challenges)) form.append('challenges', v(stats.challenges));
      if (v(stats.teams)) form.append('teams', v(stats.teams));
      if (v(stats.club)) form.append('club', v(stats.club));
      if (v(stats.member)) form.append('member', v(stats.member));
      if (v(stats.viewership)) form.append('viewership', v(stats.viewership));
    }

    return form;
  };

  const handleVideoThumbnailFileChange = (index, event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      window.alert('Please select an image file for the thumbnail.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      window.alert('Thumbnail image should be smaller than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      if (typeof dataUrl !== 'string') return;

      setPartnerHomeData((prev) => {
        if (!prev) return prev;
        const videos = Array.isArray(prev.videos) ? [...prev.videos] : [];
        const existing = videos[index] || {};
        videos[index] = { ...existing, thumbnail: dataUrl };
        return { ...prev, videos };
      });
    };

    reader.readAsDataURL(file);
  };

  const handleNewsImageChange = (index, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      window.alert('Please select an image file (JPEG, PNG, GIF, WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      window.alert('Image must be smaller than 5MB.');
      return;
    }
    setPartnerHomeData((prev) => {
      if (!prev) return prev;
      const news = [...(prev.news || [])];
      const item = news[index] || {};
      news[index] = { ...item, _imageFile: file };
      return { ...prev, news };
    });
    event.target.value = '';
  };

  const handleNewsImageRemove = (index) => {
    setPartnerHomeData((prev) => {
      if (!prev) return prev;
      const news = [...(prev.news || [])];
      const item = news[index] || {};
      news[index] = { ...item, image: '', _imageFile: null };
      return { ...prev, news };
    });
  };

  const handleSupporterLogoChange = (index, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      window.alert('Please select an image file (JPEG, PNG, GIF, WebP).');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      window.alert('Logo must be smaller than 2MB.');
      return;
    }
    setPartnerHomeData((prev) => {
      if (!prev) return prev;
      const supporters = [...(prev.supporters || [])];
      const item = supporters[index] || {};
      supporters[index] = { ...item, _logoFile: file };
      return { ...prev, supporters };
    });
    event.target.value = '';
  };

  const handleSupporterLogoRemove = (index) => {
    setPartnerHomeData((prev) => {
      if (!prev) return prev;
      const supporters = [...(prev.supporters || [])];
      const item = supporters[index] || {};
      supporters[index] = { ...item, logo: '', _logoFile: null };
      return { ...prev, supporters };
    });
  };

  const handleBannerVideoFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      window.alert('Please select a video file (MP4, WebM, etc.).');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      window.alert('Banner video must be smaller than 50MB.');
      return;
    }
    setPartnerHomeData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        home: { ...prev.home, _bannerVideoFile: file },
      };
    });
    event.target.value = '';
  };

  const handleBannerVideoRemove = () => {
    setPartnerHomeData((prev) => {
      if (!prev) return prev;
      const home = { ...prev.home };
      delete home._bannerVideoFile;
      home.bannerVideo = '';
      return { ...prev, home };
    });
  };

  // Fetch partner home content
  useEffect(() => {
    const loadPartnerHome = async () => {
      if (!partner?._id) return;
      setPartnerHomeLoading(true);
      setPartnerHomeError('');
      try {
        const data = await fetchPartnerById(partner._id);
        const partnerRecord = data?.partner ?? data;
        if (partnerRecord) {
          setPartnerHomeData(mapPartnerToHomeContent(partnerRecord));
          const about =
            normalizePartnerAbout(partnerRecord?.about) ||
            normalizePartnerAbout(partnerRecord?.aboutSection) ||
            normalizePartnerAbout(Array.isArray(partnerRecord?.abouts) ? partnerRecord.abouts[0] : null) ||
            normalizePartnerAbout(Array.isArray(partnerRecord?.aboutsData) ? partnerRecord.aboutsData[0] : null) ||
            normalizePartnerAbout(Array.isArray(partnerRecord?.partnerAbout) ? partnerRecord.partnerAbout[0] : partnerRecord?.partnerAbout);
          if (about) {
            setPartnerAboutList([about]);
            setSelectedPartnerAbout(about);
          } else {
            setPartnerAboutList([]);
            setSelectedPartnerAbout(null);
          }
          setPartnerAboutForm({ _id: '', heading: '', content: '' });
          setShowPartnerAboutForm(false);
          const advisoryBoardArr = Array.isArray(partnerRecord?.advisoryBoard)
            ? partnerRecord.advisoryBoard
            : Array.isArray(partnerRecord?.advisory_board)
              ? partnerRecord.advisory_board
              : [];
          setAdvisoryBoardList(advisoryBoardArr.map((item) => normalizeAdvisoryPerson(item)).filter(Boolean));
          setAdvisoryBoardForm(emptyAdvisoryForm);

          const advisoryRefreeArr = Array.isArray(partnerRecord?.advisoryRefree)
            ? partnerRecord.advisoryRefree
            : Array.isArray(partnerRecord?.advisory_refree)
              ? partnerRecord.advisory_refree
              : Array.isArray(partnerRecord?.advisoryReferee)
                ? partnerRecord.advisoryReferee
                : [];
          setAdvisoryRefreeList(advisoryRefreeArr.map((item) => normalizeAdvisoryPerson(item)).filter(Boolean));
          setAdvisoryRefreeForm(emptyAdvisoryForm);
        } else {
          setPartnerHomeError('Partner not found.');
        }
      } catch (err) {
        console.error('Failed to load partner home:', err);
        setPartnerHomeError(err?.message || 'Failed to load content');
      } finally {
        setPartnerHomeLoading(false);
      }
    };
    
    if (partner && activeTab === 'partner-home') {
      loadPartnerHome();
    }
  }, [partner?._id, activeTab]);

  const loadAdvisoryBoard = useCallback(async () => {
    setAdvisoryBoardLoading(true);
    setAdvisoryBoardError('');
    try {
      const res = await getAdvisoryBoard('worso');
      const payload = res?.data?.data ?? res?.data?.advisoryBoard ?? res?.data ?? res;
      const list = Array.isArray(payload) ? payload : [];
      setAdvisoryBoardList(list.map((item) => normalizeAdvisoryPerson(item)).filter(Boolean));
    } catch (err) {
      setAdvisoryBoardError(err?.response?.data?.message || err?.message || 'Failed to load advisory board list.');
    } finally {
      setAdvisoryBoardLoading(false);
    }
  }, []);

  const loadPartnerAbout = useCallback(async () => {
    setPartnerAboutLoading(true);
    setPartnerAboutError('');
    try {
      const res = await getPartnerAbout('worso', partnerCode || 'IN');
      const payload = res?.data?.data ?? res?.data?.about ?? res?.data ?? res;
      const list = Array.isArray(payload) ? payload : [payload];
      const normalizedList = list.map((item) => normalizePartnerAbout(item)).filter(Boolean);
      setPartnerAboutList(normalizedList);
      setSelectedPartnerAbout((prev) => {
        if (!normalizedList.length) return null;
        if (prev?._id) {
          const matched = normalizedList.find((item) => item._id === prev._id);
          if (matched) return matched;
        }
        return normalizedList[0];
      });
      if (!showPartnerAboutForm) {
        setPartnerAboutForm({ _id: '', heading: '', content: '' });
      }
    } catch (err) {
      setPartnerAboutError(err?.response?.data?.message || err?.message || 'Failed to load about content.');
    } finally {
      setPartnerAboutLoading(false);
    }
  }, [partnerCode, showPartnerAboutForm]);

  const loadAdvisoryRefree = useCallback(async () => {
    setAdvisoryRefreeLoading(true);
    setAdvisoryRefreeError('');
    try {
      const res = await getAdvisoryRefree('worso');
      const payload = res?.data?.data ?? res?.data?.advisoryRefree ?? res?.data ?? res;
      const list = Array.isArray(payload) ? payload : [];
      setAdvisoryRefreeList(list.map((item) => normalizeAdvisoryPerson(item)).filter(Boolean));
    } catch (err) {
      setAdvisoryRefreeError(err?.response?.data?.message || err?.message || 'Failed to load advisory refree list.');
    } finally {
      setAdvisoryRefreeLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab !== 'partner-home') return;
    if (partnerHomeSubTab === 'about') {
      loadPartnerAbout();
    } else if (partnerHomeSubTab === 'advisory-board') {
      loadAdvisoryBoard();
    } else if (partnerHomeSubTab === 'advisory-refree') {
      loadAdvisoryRefree();
    }
  }, [activeTab, partnerHomeSubTab, loadPartnerAbout, loadAdvisoryBoard, loadAdvisoryRefree]);

  const [teamMembers, setTeamMembers] = useState([]);
  const [teamMembersLoading, setTeamMembersLoading] = useState(false);
  const [teamMembersError, setTeamMembersError] = useState('');
  const [teamMembersPage, setTeamMembersPage] = useState(1);
  const [teamMembersLimit] = useState(9);
  const [teamMembersTotalPages, setTeamMembersTotalPages] = useState(1);
  const [teamMembersTotalCount, setTeamMembersTotalCount] = useState(0);
  const [teamMembersSearch, setTeamMembersSearch] = useState('');
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);

  const normalizeMembershipMember = useCallback((item, index) => {
    const userInfo = item?.user_id || item?.user || item?.member || {};
    const firstName = userInfo?.firstName || item?.firstName || '';
    const lastName = userInfo?.lastName || item?.lastName || '';
    const fullNameFromParts = `${firstName} ${lastName}`.trim();
    const fallbackName = item?.name || item?.fullName || userInfo?.name || userInfo?.fullName || fullNameFromParts || '----';

    return {
      id: item?._id || item?.id || userInfo?._id || userInfo?.id || `${fallbackName}-${index}`,
      name: fallbackName,
      role: item?.role || item?.designation || item?.planTitle || item?.planName || 'Member',
      email: item?.email || item?.emailId || userInfo?.email || userInfo?.emailId || 'N/A',
      phone: item?.phone || item?.mobile || item?.mobileNo || userInfo?.phone || userInfo?.mobile || userInfo?.mobileNo || 'N/A',
      avatar: item?.avatar || item?.profileImage || userInfo?.avatar || userInfo?.profileImage || 'https://randomuser.me/api/portraits/lego/1.jpg',
      membershipId: item?.publicMembershipId || item?.publicMemberShipId || item?.membershipId || item?._id || 'N/A',
      category: item?.category_id?.name || item?.category?.name || item?.category_id || item?.category || 'N/A',
      plan: item?.plan_id?.name || item?.planTitle || item?.planName || item?.plan?.name || item?.plan_id?.title || 'N/A',
      status: item?.status || 'N/A',
      paymentStatus: item?.paymentStatus || 'N/A',
      createdAt: item?.createdAt || item?.startDate || '',
    };
  }, []);

  const getSafeDisplayValue = (value) => {
    if (typeof value === 'string' && value.trim()) return value.trim();
    return 'N/A';
  };

  const getPaymentStatusBadgeClass = (status) => {
    const normalizedStatus = String(status || '').trim().toUpperCase();
    if (normalizedStatus === 'SUCCESS' || normalizedStatus === 'COMPLETED' || normalizedStatus === 'PAID') {
      return 'bg-green-50 text-green-700 border border-green-200';
    }
    if (normalizedStatus === 'FAILED' || normalizedStatus === 'ERROR') {
      return 'bg-red-50 text-red-700 border border-red-200';
    }
    if (normalizedStatus === 'PENDING') {
      return 'bg-amber-50 text-amber-700 border border-amber-200';
    }
    return 'bg-slate-100 text-slate-700 border border-slate-200';
  };

  const filteredTeamMembers = teamMembers.filter((member) => {
    const q = teamMembersSearch.trim().toLowerCase();
    if (!q) return true;
    const haystack = `${member.name} ${member.role} ${member.email} ${member.phone}`.toLowerCase();
    return haystack.includes(q);
  });

  useEffect(() => {
    if (activeTab !== 'team') return;
    let cancelled = false;
    const fetchTeamMembers = async () => {
      setTeamMembersLoading(true);
      setTeamMembersError('');
      try {
        const res = await getMembershipsByPartner('IN', { page: teamMembersPage, limit: teamMembersLimit });
        const responseData = res?.data ?? res;
        const list = responseData?.data ?? responseData?.memberships ?? responseData?.members ?? responseData?.items ?? [];
        const meta = responseData?.meta ?? responseData?.pagination ?? {};
        const normalized = (Array.isArray(list) ? list : []).map((item, index) => normalizeMembershipMember(item, index));
        if (!cancelled) {
          setTeamMembers(normalized);
          const totalPages = Number(meta?.totalPages || responseData?.totalPages || 1);
          const totalCount = Number(meta?.totalItems || meta?.totalCount || responseData?.totalCount || normalized.length || 0);
          setTeamMembersTotalPages(totalPages > 0 ? totalPages : 1);
          setTeamMembersTotalCount(totalCount >= 0 ? totalCount : 0);
        }
      } catch (err) {
        if (!cancelled) {
          setTeamMembersError(err?.response?.data?.message || err?.message || 'Failed to load memberships');
          setTeamMembers([]);
          setTeamMembersTotalPages(1);
          setTeamMembersTotalCount(0);
        }
      } finally {
        if (!cancelled) setTeamMembersLoading(false);
      }
    };
    fetchTeamMembers();
    return () => { cancelled = true; };
  }, [activeTab, teamMembersPage, teamMembersLimit, normalizeMembershipMember]);
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
  const [showAddSeasonForm, setShowAddSeasonForm] = useState(false);
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
  const [showAddCompetitionForm, setShowAddCompetitionForm] = useState(false);
  const [editingCompetition, setEditingCompetition] = useState(null);
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [competitionForm, setCompetitionForm] = useState({
    name: '', category: '', description: '', prizePool: 0,
    teamRequirements: { minMembers: 1, maxMembers: 4 },
    duration: { value: 1, unit: 'day' },
    downloadTitles: [],
    rulesAndRegulations: '', trainingResourseUrl: '', pastWinnerUrl: '', globalRankingeUrl: '',
    bannerImage: '', hasBots: false, isActive: true, event_id: '', season_id: '',
  });
  const [competitionFormErrors, setCompetitionFormErrors] = useState({});
  const [competitionDownloadTitle, setCompetitionDownloadTitle] = useState('');
  const [competitionBannerImageFile, setCompetitionBannerImageFile] = useState(null);
  const [competitionBannerImagePreview, setCompetitionBannerImagePreview] = useState('');

  // Fetch seasons and events list when My Events tab is active
  // Uses partner-specific APIs when partnerCode is available:
  // - seasons/get?website=worso&partnerCode={partnerCode}
  // - event/get?website={partnerCode} (e.g. website=EG)
  useEffect(() => {
    if (activeTab !== 'events') return;
    let cancelled = false;
    setSeasonsLoading(true);
    setSeasonsError('');
    setEventsLoading(true);
    setEventsListError('');
    const fetchSeasons = partnerCode ? () => listSeasonsGet(partnerCode) : listSeasons;
    const fetchEvents = partnerCode
      ? () => getEventsByWebsite(partnerCode)
      : () => getEventsList();
    Promise.allSettled([fetchSeasons(), fetchEvents()]).then(([seasonsResult, eventsResult]) => {
      if (cancelled) return;
      if (seasonsResult.status === 'fulfilled') {
        const list = seasonsResult.value?.data ?? seasonsResult.value?.seasons ?? (Array.isArray(seasonsResult.value) ? seasonsResult.value : []);
        setSeasons(Array.isArray(list) ? list : []);
      } else {
        setSeasonsError(seasonsResult.reason?.message ?? 'Failed to load seasons');
        setSeasons([]);
      }
      if (eventsResult.status === 'fulfilled') {
        const res = eventsResult.value?.data ?? eventsResult.value;
        const eventData = res?.data ?? res?.events ?? res?.data?.events ?? (Array.isArray(res) ? res : []);
        setEventList(Array.isArray(eventData) ? eventData : []);
      } else {
        setEventsListError(eventsResult.reason?.response?.data?.message ?? eventsResult.reason?.message ?? 'Failed to load events');
        setEventList([]);
      }
    }).finally(() => {
      if (!cancelled) {
        setSeasonsLoading(false);
        setEventsLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [activeTab, partnerCode]);

  // Fetch competitions and events when Competitions sub-tab is active
  // Ensures event dropdown has data when Add Competition form is shown
  useEffect(() => {
    if (activeTab !== 'events' || eventsSubTab !== 'competitions') return;
    let cancelled = false;
    setCompetitionsLoading(true);
    setCompetitionsListError('');
    setEventsLoading(true);
    setEventsListError('');
    const fetchCompetitions = partnerCode ? () => listCompetitionsGet(partnerCode) : listCompetitions;
    const fetchEvents = partnerCode ? () => getEventsByWebsite(partnerCode) : () => getEventsList();
    Promise.allSettled([fetchCompetitions(), fetchEvents()]).then(([compResult, eventsResult]) => {
      if (cancelled) return;
      if (compResult.status === 'fulfilled') {
        const list = compResult.value?.data ?? (Array.isArray(compResult.value) ? compResult.value : []);
        setCompetitionList(Array.isArray(list) ? list : []);
      } else {
        setCompetitionsListError(compResult.reason?.message ?? 'Failed to load competitions');
        setCompetitionList([]);
      }
      if (eventsResult.status === 'fulfilled') {
        const res = eventsResult.value?.data ?? eventsResult.value;
        const eventData = res?.data ?? res?.events ?? res?.data?.events ?? (Array.isArray(res) ? res : []);
        setEventList(Array.isArray(eventData) ? eventData : []);
      } else {
        setEventsListError(eventsResult.reason?.response?.data?.message ?? eventsResult.reason?.message ?? 'Failed to load events');
        setEventList([]);
      }
    }).finally(() => {
      if (!cancelled) {
        setCompetitionsLoading(false);
        setEventsLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [activeTab, eventsSubTab, partnerCode]);

  // Membership related states
  const [membershipData, setMembershipData] = useState(null);
  const [membershipLoading, setMembershipLoading] = useState(false);
  const [membershipError, setMembershipError] = useState('');

  // Fetch membership data when membership tab is active
  useEffect(() => {
    if (activeTab !== 'membership') return;
    let cancelled = false;
    setMembershipLoading(true);
    setMembershipError('');
    getMyMembership()
      .then((res) => {
        if (cancelled) return;
        // Handle response structure: { success: true, data: {...} }
        const responseData = res?.data;
        setMembershipData(responseData?.data ?? responseData);
      })
      .catch((err) => {
        if (!cancelled) {
          setMembershipError(err?.response?.data?.message ?? err?.message ?? 'Failed to load membership data');
          setMembershipData(null);
        }
      })
      .finally(() => {
        if (!cancelled) setMembershipLoading(false);
      });
    return () => { cancelled = true; };
  }, [activeTab]);

  // RoboClub: my club list states
  const [myClubs, setMyClubs] = useState([]);
  const [myClubsLoading, setMyClubsLoading] = useState(false);
  const [myClubsError, setMyClubsError] = useState('');
  const [selectedClubId, setSelectedClubId] = useState('');

  const normalizeMyClubList = useCallback((payload) => {
    const source = Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload)
        ? payload
        : [];

    return source.map((entry) => {
      const details = entry?.clubDetails && typeof entry.clubDetails === 'object' ? entry.clubDetails : entry;
      const members = Array.isArray(entry?.members) ? entry.members : [];
      return {
        ...details,
        members,
        _rawClubDetails: details,
      };
    });
  }, []);

  const refreshMyClubs = useCallback(async () => {
    setMyClubsLoading(true);
    setMyClubsError('');
    try {
      const res = await getClubsWithMembersByPartner(partnerCode);
      const payload = res?.data;
      const clubs = normalizeMyClubList(payload);
      setMyClubs(clubs);
      setSelectedClubId((prev) => (clubs.some((club) => club?._id === prev) ? prev : ''));
      return clubs;
    } catch (err) {
      try {
        const fallbackRes = await getClubsByPartner(partnerCode);
        const fallbackPayload = fallbackRes?.data;
        const fallbackClubs = normalizeMyClubList(fallbackPayload);
        setMyClubs(fallbackClubs);
        setSelectedClubId((prev) => (fallbackClubs.some((club) => club?._id === prev) ? prev : ''));
        return fallbackClubs;
      } catch (fallbackErr) {
        setMyClubsError(
          fallbackErr?.response?.data?.message
          ?? err?.response?.data?.message
          ?? fallbackErr?.message
          ?? err?.message
          ?? 'Failed to load club data',
        );
        setMyClubs([]);
        setSelectedClubId('');
        return [];
      }
    } finally {
      setMyClubsLoading(false);
    }
  }, [normalizeMyClubList, partnerCode]);

  // Fetch club data when RoboClub tab is active (prefers /club/all/get, falls back to /club/get)
  useEffect(() => {
    if (activeTab !== 'roboclub') return;
    let cancelled = false;
    (async () => {
      setMyClubsLoading(true);
      setMyClubsError('');
      try {
        const res = await getClubsWithMembersByPartner(partnerCode);
        if (cancelled) return;
        const payload = res?.data;
        const clubs = normalizeMyClubList(payload);
        setMyClubs(clubs);
        setSelectedClubId((prev) => (clubs.some((club) => club?._id === prev) ? prev : ''));
      } catch (err) {
        try {
          const fallbackRes = await getClubsByPartner(partnerCode);
          if (cancelled) return;
          const fallbackPayload = fallbackRes?.data;
          const fallbackClubs = normalizeMyClubList(fallbackPayload);
          setMyClubs(fallbackClubs);
          setSelectedClubId((prev) => (fallbackClubs.some((club) => club?._id === prev) ? prev : ''));
        } catch (fallbackErr) {
          if (cancelled) return;
          setMyClubsError(
            fallbackErr?.response?.data?.message
            ?? err?.response?.data?.message
            ?? fallbackErr?.message
            ?? err?.message
            ?? 'Failed to load club data',
          );
          setMyClubs([]);
          setSelectedClubId('');
        }
      } finally {
        if (!cancelled) setMyClubsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [activeTab, normalizeMyClubList, partnerCode]);

  // RoboClub: show add form (false = list only, true = form visible)
  const [showRoboClubForm, setShowRoboClubForm] = useState(false);
  // RoboClub Registration states (direct registration, no OTP)
  const [roboClubError, setRoboClubError] = useState('');
  const [roboClubLoading, setRoboClubLoading] = useState(false);
  const [editingClubId, setEditingClubId] = useState(null);
  const [deletingClubId, setDeletingClubId] = useState(null);

  // RoboClub Add payload — frontend data contract when adding a RoboClub
  // Payload shape: { name, clubName, instituteName, countryCode, country, state, city, mobile, email }
  const ROBO_CLUB_FORM_INITIAL = {
    name: '',
    clubName: '',
    instituteName: '',
    countryCode: 'IN',
    state: '',
    city: '',
    mobile: '',
    email: '',
  };

  const [roboClubForm, setRoboClubForm] = useState(ROBO_CLUB_FORM_INITIAL);

  // Country / State / City options for RoboClub registration
  const COUNTRY_OPTIONS = COUNTRIES.map((country) => ({ code: country.id, name: country.name }));
  const ROBOCLUB_FALLBACK_STATE_OPTIONS = [{ id: 'OTHER_STATE', name: 'Other' }];
  const ROBOCLUB_FALLBACK_CITY_OPTIONS = [{ id: 'OTHER_CITY', name: 'Other' }];

  const roboClubStateOptions = (() => {
    const states = getStatesByCountry(roboClubForm.countryCode);
    return Array.isArray(states) && states.length > 0 ? states : ROBOCLUB_FALLBACK_STATE_OPTIONS;
  })();

  const selectedRoboClubStateOption = roboClubStateOptions.find((state) => state.name === roboClubForm.state);
  const roboClubCityOptions = (() => {
    if (!selectedRoboClubStateOption?.id) return [];
    const cities = getCitiesByState(selectedRoboClubStateOption.id);
    return Array.isArray(cities) && cities.length > 0 ? cities : ROBOCLUB_FALLBACK_CITY_OPTIONS;
  })();

  // Handle club registration form update
  const updateRoboClubForm = (field, value) => {
    setRoboClubForm((prev) => {
      if (field === 'countryCode') {
        return { ...prev, countryCode: value, state: '', city: '' };
      }
      if (field === 'state') {
        return { ...prev, state: value, city: '' };
      }
      return { ...prev, [field]: value };
    });
    setRoboClubError('');
  };

  const closeRoboClubForm = () => {
    setShowRoboClubForm(false);
    setEditingClubId(null);
    setRoboClubForm(ROBO_CLUB_FORM_INITIAL);
    setRoboClubError('');
  };

  const getCountryCodeFromClub = (club) => {
    const rawCode = String(club?.countryCode ?? '').trim().toUpperCase();
    if (rawCode && COUNTRY_OPTIONS.some((item) => item.code === rawCode)) {
      return rawCode;
    }
    const rawCountry = String(club?.country ?? '').trim().toLowerCase();
    if (!rawCountry) return 'IN';
    const matched = COUNTRY_OPTIONS.find((item) => item.name.toLowerCase() === rawCountry);
    return matched?.code ?? 'IN';
  };

  const handleEditClub = (club) => {
    if (!club?._id) return;
    setEditingClubId(club._id);
    setShowRoboClubForm(true);
    setRoboClubError('');
    setRoboClubForm({
      name: String(club?.name ?? '').trim(),
      clubName: String(club?.clubName ?? '').trim(),
      instituteName: String(club?.instituteName ?? '').trim(),
      countryCode: getCountryCodeFromClub(club),
      state: String(club?.state ?? '').trim(),
      city: String(club?.city ?? '').trim(),
      mobile: String(club?.mobile ?? '').replace(/\D/g, '').slice(0, 10),
      email: String(club?.email ?? '').trim(),
    });
  };

  const handleDeleteClub = async (clubId) => {
    if (!clubId) return;
    const confirmed = window.confirm('Are you sure you want to delete this RoboClub?');
    if (!confirmed) return;
    setDeletingClubId(clubId);
    setMyClubsError('');
    try {
      const response = await deleteClub(clubId);
      if (response?.data?.success || response?.status === 200) {
        if (editingClubId === clubId) {
          closeRoboClubForm();
        }
        setSelectedClubId((prev) => (prev === clubId ? '' : prev));
        await refreshMyClubs();
      } else {
        setMyClubsError(response?.data?.message || 'Failed to delete club');
      }
    } catch (err) {
      setMyClubsError(err?.response?.data?.message || err?.message || 'Failed to delete club');
    } finally {
      setDeletingClubId(null);
    }
  };

  // Handle submit club registration (direct, no OTP)
  const handleSubmitClub = async () => {
    const requiredFieldChecks = [
      { key: 'name', label: 'Name' },
      { key: 'clubName', label: 'Club name' },
      { key: 'instituteName', label: 'Institute name' },
      { key: 'countryCode', label: 'Country' },
      { key: 'state', label: 'State' },
      { key: 'city', label: 'City' },
      { key: 'mobile', label: 'Mobile' },
    ];
    if (!editingClubId) {
      requiredFieldChecks.splice(1, 0, { key: 'email', label: 'Email' });
    }
    const missingField = requiredFieldChecks.find(({ key }) => !String(roboClubForm[key] ?? '').trim());
    if (missingField) {
      setRoboClubError(`${missingField.label} is required`);
      return;
    }

    const normalizedEmail = String(roboClubForm.email || '').trim().toLowerCase();
    if (!editingClubId && (!normalizedEmail || !normalizedEmail.includes('@'))) {
      setRoboClubError('Please enter a valid email address');
      return;
    }
    const normalizedMobile = String(roboClubForm.mobile || '').replace(/\D/g, '').trim();
    if (!normalizedMobile) {
      setRoboClubError('Mobile is required');
      return;
    }
    if (normalizedMobile.length !== 10) {
      setRoboClubError('Mobile must be exactly 10 digits');
      return;
    }

    setRoboClubLoading(true);
    setRoboClubError('');
    try {
      const countryObj = COUNTRY_OPTIONS.find((c) => c.code === roboClubForm.countryCode);
      const payload = {
        name: roboClubForm.name.trim(),
        clubName: roboClubForm.clubName.trim(),
        instituteName: roboClubForm.instituteName.trim(),
        country: countryObj?.name ?? '',
        state: roboClubForm.state?.trim() ?? '',
        city: roboClubForm.city?.trim() ?? '',
        mobile: normalizedMobile,
      };
      const response = editingClubId
        ? await updateClub(editingClubId, payload)
        : await addClubAdmin({
          ...payload,
          countryCode: roboClubForm.countryCode,
          email: normalizedEmail,
        });

      if (response?.data?.success || response?.status === 200 || response?.status === 201) {
        alert(editingClubId ? 'RoboClub updated successfully!' : 'RoboClub registered successfully!');
        await refreshMyClubs();
        closeRoboClubForm();
      } else {
        setRoboClubError(response?.data?.message || (editingClubId ? 'Failed to update club' : 'Failed to register club'));
      }
    } catch (err) {
      setRoboClubError(
        err?.response?.data?.message
          || err?.message
          || (editingClubId ? 'Failed to update club. Please try again.' : 'Failed to register club. Please try again.'),
      );
    } finally {
      setRoboClubLoading(false);
    }
  };

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
      setShowAddSeasonForm(false);
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
      setShowAddEventForm(false);
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

  useEffect(() => {
    if (editingCompetition) {
      let downloadTitles = [];
      if (editingCompetition.downloadTitles && Array.isArray(editingCompetition.downloadTitles)) {
        downloadTitles = editingCompetition.downloadTitles;
      } else if (editingCompetition.downloads && Array.isArray(editingCompetition.downloads)) {
        downloadTitles = editingCompetition.downloads.map((d) => (typeof d === 'string' ? d : d.title || ''));
      }
      setCompetitionForm({
        name: editingCompetition.name || '',
        category: editingCompetition.category || '',
        description: editingCompetition.description || '',
        prizePool: editingCompetition.prizePool || 0,
        teamRequirements: editingCompetition.teamRequirements || { minMembers: 1, maxMembers: 4 },
        duration: editingCompetition.duration || { value: 1, unit: 'day' },
        downloadTitles,
        rulesAndRegulations: editingCompetition.rulesAndRegulations || '',
        trainingResourseUrl: editingCompetition.trainingResourseUrl || '',
        pastWinnerUrl: editingCompetition.pastWinnerUrl || '',
        globalRankingeUrl: editingCompetition.globalRankingeUrl || '',
        bannerImage: editingCompetition.bannerImage || '',
        hasBots: editingCompetition.hasBots !== undefined ? editingCompetition.hasBots : false,
        isActive: editingCompetition.isActive !== undefined ? editingCompetition.isActive : true,
        event_id: editingCompetition.event_id || editingCompetition.eventId || (editingCompetition.event && (editingCompetition.event._id || editingCompetition.event.id)) || '',
        season_id: editingCompetition.season_id || editingCompetition.seasonId || (editingCompetition.season && (editingCompetition.season._id || editingCompetition.season.id)) || '',
      });
      setCompetitionBannerImagePreview(editingCompetition.bannerImage || '');
      setCompetitionBannerImageFile(null);
    } else if (showAddCompetitionForm) {
      setCompetitionForm({
        name: '', category: '', description: '', prizePool: 0,
        teamRequirements: { minMembers: 1, maxMembers: 4 },
        duration: { value: 1, unit: 'day' },
        downloadTitles: [],
        rulesAndRegulations: '', trainingResourseUrl: '', pastWinnerUrl: '', globalRankingeUrl: '',
        bannerImage: '', hasBots: false, isActive: true, event_id: '', season_id: '',
      });
      setCompetitionBannerImagePreview('');
      setCompetitionBannerImageFile(null);
    }
  }, [editingCompetition, showAddCompetitionForm]);

  const handleCompetitionFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'teamRequirements.minMembers' || name === 'teamRequirements.maxMembers') {
      const field = name.split('.')[1];
      const num = parseInt(value, 10) || (field === 'minMembers' ? 1 : 4);
      setCompetitionForm((prev) => {
        const next = { ...prev.teamRequirements, [field]: num };
        if (field === 'minMembers' && next.minMembers > (next.maxMembers ?? 4)) next.maxMembers = next.minMembers;
        if (field === 'maxMembers' && next.maxMembers < (next.minMembers ?? 1)) next.minMembers = next.maxMembers;
        return { ...prev, teamRequirements: next };
      });
    } else if (name === 'duration.value' || name === 'duration.unit') {
      const field = name.split('.')[1];
      setCompetitionForm((prev) => ({
        ...prev,
        duration: {
          ...prev.duration,
          [field]: field === 'value' ? Math.max(1, parseInt(value, 10) || 1) : value,
        },
      }));
    } else {
      setCompetitionForm((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || 0 : value,
      }));
    }
    if (competitionFormErrors[name]) setCompetitionFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleAddCompetitionDownload = () => {
    if (competitionDownloadTitle.trim()) {
      setCompetitionForm((prev) => ({ ...prev, downloadTitles: [...prev.downloadTitles, competitionDownloadTitle.trim()] }));
      setCompetitionDownloadTitle('');
    }
  };

  const handleRemoveCompetitionDownload = (index) => {
    setCompetitionForm((prev) => ({ ...prev, downloadTitles: prev.downloadTitles.filter((_, i) => i !== index) }));
  };

  const handleCompetitionBannerImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setCompetitionFormErrors((prev) => ({ ...prev, bannerImage: 'Please upload a valid image (JPEG, PNG, GIF, or WebP)' }));
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setCompetitionFormErrors((prev) => ({ ...prev, bannerImage: 'Image must be smaller than 10MB' }));
        return;
      }
      setCompetitionBannerImageFile(file);
      setCompetitionFormErrors((prev) => ({ ...prev, bannerImage: '' }));
      const reader = new FileReader();
      reader.onload = () => setCompetitionBannerImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveCompetitionBannerImage = () => {
    setCompetitionBannerImageFile(null);
    setCompetitionBannerImagePreview('');
    setCompetitionForm((prev) => ({ ...prev, bannerImage: '' }));
  };

  const validateCompetitionForm = () => {
    const newErrors = {};
    if (!competitionForm.name.trim()) newErrors.name = 'Competition name is required';
    if (!competitionForm.category) newErrors.category = 'Category is required';
    if (!competitionForm.season_id) newErrors.season_id = 'Season is required';
    if (!competitionForm.event_id) newErrors.event_id = 'Event is required';
    if (!competitionBannerImageFile && (!competitionForm.bannerImage || !String(competitionForm.bannerImage).trim()) && !editingCompetition) {
      newErrors.bannerImage = 'Banner image is required for new competition';
    }
    const minM = competitionForm.teamRequirements?.minMembers ?? 1;
    const maxM = competitionForm.teamRequirements?.maxMembers ?? 4;
    if (minM < 1) newErrors.minMembers = 'Minimum members must be at least 1';
    if (maxM < minM) newErrors.maxMembers = 'Maximum members must be ≥ minimum members';
    if ((competitionForm.duration?.value ?? 1) < 1) newErrors.duration = 'Duration must be at least 1';
    return newErrors;
  };

  const buildCompetitionPayload = () => {
    const minMembers = Math.max(1, parseInt(competitionForm.teamRequirements?.minMembers, 10) || 1);
    let maxMembers = Math.max(1, parseInt(competitionForm.teamRequirements?.maxMembers, 10) || 4);
    if (minMembers > maxMembers) maxMembers = minMembers;
    const durationValue = Math.max(1, parseInt(competitionForm.duration?.value, 10) || 1);
    const durationUnit = competitionForm.duration?.unit || 'day';
    const titles = competitionForm.downloadTitles || [];
    const competitionData = {
      name: competitionForm.name.trim(),
      category: competitionForm.category || '',
      description: (competitionForm.description || '').trim(),
      prizePool: parseFloat(competitionForm.prizePool) || 0,
      'duration[value]': durationValue,
      'duration[unit]': durationUnit,
      'teamRequirements[minMembers]': minMembers,
      'teamRequirements[maxMembers]': maxMembers,
      rulesAndRegulations: (competitionForm.rulesAndRegulations || '').trim(),
      trainingResourseUrl: (competitionForm.trainingResourseUrl || '').trim() || '',
      pastWinnerUrl: (competitionForm.pastWinnerUrl || '').trim() || '',
      globalRankingeUrl: (competitionForm.globalRankingeUrl || '').trim() || '',
      bannerImage: competitionBannerImageFile || competitionForm.bannerImage || '',
      hasBots: !!competitionForm.hasBots,
      isActive: !!competitionForm.isActive,
      event_id: competitionForm.event_id || '',
      season_id: competitionForm.season_id || '',
    };
    titles.forEach((title, index) => {
      competitionData[`downloadTitles[${index}]`] = title;
    });
    return competitionData;
  };

  const handleSaveCompetition = async () => {
    const formErrors = validateCompetitionForm();
    if (Object.keys(formErrors).length > 0) {
      setCompetitionFormErrors(formErrors);
      return;
    }
    setCompetitionError('');
    setCompetitionSaving(true);
    try {
      const competitionData = buildCompetitionPayload();
      const payload = normalizeCompetitionPayload(competitionData);
      if (editingCompetition?._id) {
        await updateCompetition(editingCompetition._id, payload);
      } else {
        await addCompetition(payload);
      }
      setShowAddCompetitionForm(false);
      setEditingCompetition(null);
      const fetchCompetitions = partnerCode ? () => listCompetitionsGet(partnerCode) : listCompetitions;
      const res = await fetchCompetitions();
      const list = res?.data ?? (Array.isArray(res) ? res : []);
      setCompetitionList(Array.isArray(list) ? list : []);
    } catch (err) {
      setCompetitionError(err?.message ?? 'Failed to save competition');
    } finally {
      setCompetitionSaving(false);
    }
  };

  const handleCancelCompetitionForm = () => {
    setShowAddCompetitionForm(false);
    setEditingCompetition(null);
    setCompetitionError('');
    setCompetitionFormErrors({});
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

  const savePartnerHome = async () => {
    if (!partner?._id || !partnerHomeData) return;
    setPartnerHomeError('');
    setPartnerHomeSuccess(false);
    setPartnerHomeSaving(true);
    try {
      const formData = buildPartnerHomeFormData(partnerHomeData);
      const data = await updatePartnerFormData(partner._id, user?.token, formData);
      const updatedPartner = data?.partner ?? data;
      if (updatedPartner) {
        const auth = getPartnerAuth();
        if (auth) setPartnerAuth({ ...auth, partner: updatedPartner });
        if (typeof setUser === 'function') {
          setUser({ ...user, partner: updatedPartner });
        }
        setPartnerHomeData(mapPartnerToHomeContent(updatedPartner));
      }
      setPartnerHomeSuccess(true);
      setTimeout(() => setPartnerHomeSuccess(false), 3000);
    } catch (err) {
      setPartnerHomeError(err?.message || 'Failed to save home content.');
    } finally {
      setPartnerHomeSaving(false);
    }
  };

  const savePartnerAbout = async () => {
    const heading = (partnerAboutForm.heading || '').trim();
    const content = (partnerAboutForm.content || '').trim();
    if (!heading || !content) {
      setPartnerAboutError('Heading and content are required.');
      setPartnerAboutSuccess('');
      return;
    }
    if (!partnerAboutForm._id && partnerAboutList.length > 0) {
      setPartnerAboutError('Only one About Partner record is allowed.');
      setPartnerAboutSuccess('');
      return;
    }

    setPartnerAboutSaving(true);
    setPartnerAboutError('');
    setPartnerAboutSuccess('');
    try {
      const payload = { heading, content };
      if (partnerAboutForm._id) {
        await updatePartnerAbout(partnerAboutForm._id, payload);
        await loadPartnerAbout();
        setShowPartnerAboutForm(false);
        setPartnerAboutForm(emptyPartnerAboutForm);
        setPartnerAboutSuccess('About content updated successfully.');
      } else {
        await addPartnerAbout(payload);
        await loadPartnerAbout();
        setShowPartnerAboutForm(false);
        setPartnerAboutForm(emptyPartnerAboutForm);
        setPartnerAboutSuccess('About content created successfully.');
      }
    } catch (err) {
      setPartnerAboutError(err?.response?.data?.message || err?.message || 'Failed to save about content.');
    } finally {
      setPartnerAboutSaving(false);
    }
  };

  const handleDeletePartnerAbout = async (id) => {
    const recordId = id || partnerAboutForm._id;
    if (!recordId) {
      setPartnerAboutError('No About record id found to delete.');
      setPartnerAboutSuccess('');
      return;
    }
    const confirmed = window.confirm('Delete this About content?');
    if (!confirmed) return;

    setPartnerAboutDeleting(true);
    setPartnerAboutError('');
    setPartnerAboutSuccess('');
    try {
      await deletePartnerAbout(recordId);
      await loadPartnerAbout();
      setPartnerAboutForm(emptyPartnerAboutForm);
      setShowPartnerAboutForm(false);
      setPartnerAboutSuccess('About content deleted successfully.');
    } catch (err) {
      setPartnerAboutError(err?.response?.data?.message || err?.message || 'Failed to delete about content.');
    } finally {
      setPartnerAboutDeleting(false);
    }
  };

  const handleAdvisoryImageChange = (type, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      window.alert('Please select an image file (JPEG, PNG, GIF, WebP).');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      window.alert('Image must be smaller than 2MB.');
      return;
    }
    if (type === 'board') {
      setAdvisoryBoardForm((prev) => ({ ...prev, _imageFile: file }));
    } else {
      setAdvisoryRefreeForm((prev) => ({ ...prev, _imageFile: file }));
    }
    event.target.value = '';
  };

  const saveAdvisoryBoard = async () => {
    const name = (advisoryBoardForm.name || '').trim();
    const designation = (advisoryBoardForm.designation || '').trim();
    if (!name || !designation) {
      setAdvisoryBoardError('Name and designation are required.');
      setAdvisoryBoardSuccess('');
      return;
    }
    setAdvisoryBoardSaving(true);
    setAdvisoryBoardError('');
    setAdvisoryBoardSuccess('');
    try {
      const formData = buildAdvisoryFormData(advisoryBoardForm);
      const res = advisoryBoardForm._id
        ? await editAdvisoryBoard(advisoryBoardForm._id, formData)
        : await addAdvisoryBoard(formData);
      const normalized = normalizeAdvisoryPerson(res?.data?.data ?? res?.data ?? res);
      if (normalized) setAdvisoryBoardForm(normalized);
      await loadAdvisoryBoard();
      setShowAdvisoryBoardForm(false);
      setAdvisoryBoardSuccess(advisoryBoardForm._id ? 'Advisory Board updated successfully.' : 'Advisory Board added successfully.');
    } catch (err) {
      setAdvisoryBoardError(err?.response?.data?.message || err?.message || 'Failed to save advisory board.');
    } finally {
      setAdvisoryBoardSaving(false);
    }
  };

  const handleDeleteAdvisoryBoard = async (id) => {
    const recordId = id || advisoryBoardForm._id;
    if (!recordId) {
      setAdvisoryBoardError('No Advisory Board record id found to delete.');
      setAdvisoryBoardSuccess('');
      return;
    }
    if (!window.confirm('Delete this Advisory Board entry?')) return;
    setAdvisoryBoardDeleting(true);
    setAdvisoryBoardError('');
    setAdvisoryBoardSuccess('');
    try {
      await deleteAdvisoryBoard(recordId);
      setAdvisoryBoardForm(emptyAdvisoryForm);
      await loadAdvisoryBoard();
      setShowAdvisoryBoardForm(false);
      setAdvisoryBoardSuccess('Advisory Board deleted successfully.');
    } catch (err) {
      setAdvisoryBoardError(err?.response?.data?.message || err?.message || 'Failed to delete advisory board.');
    } finally {
      setAdvisoryBoardDeleting(false);
    }
  };

  const saveAdvisoryRefree = async () => {
    const name = (advisoryRefreeForm.name || '').trim();
    const designation = (advisoryRefreeForm.designation || '').trim();
    if (!name || !designation) {
      setAdvisoryRefreeError('Name and designation are required.');
      setAdvisoryRefreeSuccess('');
      return;
    }
    setAdvisoryRefreeSaving(true);
    setAdvisoryRefreeError('');
    setAdvisoryRefreeSuccess('');
    try {
      const formData = buildAdvisoryFormData(advisoryRefreeForm);
      const res = advisoryRefreeForm._id
        ? await editAdvisoryRefree(advisoryRefreeForm._id, formData)
        : await addAdvisoryRefree(formData);
      const normalized = normalizeAdvisoryPerson(res?.data?.data ?? res?.data ?? res);
      if (normalized) setAdvisoryRefreeForm(normalized);
      await loadAdvisoryRefree();
      setShowAdvisoryRefreeForm(false);
      setAdvisoryRefreeSuccess(advisoryRefreeForm._id ? 'Advisory Refree updated successfully.' : 'Advisory Refree added successfully.');
    } catch (err) {
      setAdvisoryRefreeError(err?.response?.data?.message || err?.message || 'Failed to save advisory refree.');
    } finally {
      setAdvisoryRefreeSaving(false);
    }
  };

  const handleDeleteAdvisoryRefree = async (id) => {
    const recordId = id || advisoryRefreeForm._id;
    if (!recordId) {
      setAdvisoryRefreeError('No Advisory Refree record id found to delete.');
      setAdvisoryRefreeSuccess('');
      return;
    }
    if (!window.confirm('Delete this Advisory Refree entry?')) return;
    setAdvisoryRefreeDeleting(true);
    setAdvisoryRefreeError('');
    setAdvisoryRefreeSuccess('');
    try {
      await deleteAdvisoryRefree(recordId);
      setAdvisoryRefreeForm(emptyAdvisoryForm);
      await loadAdvisoryRefree();
      setShowAdvisoryRefreeForm(false);
      setAdvisoryRefreeSuccess('Advisory Refree deleted successfully.');
    } catch (err) {
      setAdvisoryRefreeError(err?.response?.data?.message || err?.message || 'Failed to delete advisory refree.');
    } finally {
      setAdvisoryRefreeDeleting(false);
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
                  <Layout size={18} /> Profile
                </button>

                {partner && (
                  <>
                    {/* <button
                      onClick={() => setActiveTab('partner-profile')}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all shadow-sm flex items-center gap-3 ${activeTab === 'partner-profile'
                          ? 'bg-white/15 border-blue-400 text-white'
                          : 'bg-white/5 border-white/10 hover:border-blue-300 text-blue-100'
                        }`}
                    >
                      <UserCircle size={18} /> Partner Profile
                    </button> */}
                    <button
                      onClick={() => setActiveTab('partner-home')}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all shadow-sm flex items-center gap-3 ${activeTab === 'partner-home'
                          ? 'bg-white/15 border-blue-400 text-white'
                          : 'bg-white/5 border-white/10 hover:border-blue-300 text-blue-100'
                        }`}
                    >
                      <Layout size={18} /> Pages Content
                    </button>
                  </>
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
                    {/* <button
                      onClick={() => setActiveTab('membership')}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all shadow-sm flex items-center gap-3 group ${activeTab === 'membership'
                          ? 'bg-white/20 border-blue-400 text-white shadow-lg shadow-blue-500/20'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-blue-300/50 text-blue-100 hover:text-white'
                        }`}
                    >
                      <div className={`p-1.5 rounded-lg ${activeTab === 'membership'
                          ? 'bg-blue-500/20'
                          : 'bg-white/5 group-hover:bg-blue-500/20'
                        }`}>
                        <CreditCard size={16} className="text-blue-300" />
                      </div>
                      <span className="font-medium">My Membership</span>
                      {activeTab === 'membership' && (
                        <span className="ml-auto w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                      )}
                    </button> */}
                    <button
                      onClick={() => setActiveTab('roboclub')}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all shadow-sm flex items-center gap-3 group ${activeTab === 'roboclub'
                          ? 'bg-white/20 border-blue-400 text-white shadow-lg shadow-blue-500/20'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-blue-300/50 text-blue-100 hover:text-white'
                        }`}
                    >
                      <div className={`p-1.5 rounded-lg ${activeTab === 'roboclub'
                          ? 'bg-blue-500/20'
                          : 'bg-white/5 group-hover:bg-blue-500/20'
                        }`}>
                        <Building2 size={16} className="text-blue-300" />
                      </div>
                      <span className="font-medium">RoboClub Registration</span>
                      {activeTab === 'roboclub' && (
                        <span className="ml-auto w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                      )}
                    </button>
                    {/* <button
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
                    </button> */}
  {/* <button
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
                      <span className="font-medium">Club Member</span>
                      {activeTab === 'academia' && (
                        <span className="ml-auto w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                      )}
                    </button> */}
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
                      <span className="font-medium">Membership</span>
                      {activeTab === 'team' && (
                        <span className="ml-auto w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                      )}
                    </button>

                  

                    {/* <button
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
                    </button> */}

                    

                      
                  </div>
                )}

                {/* Logout - visible for both partner and super admin */}
             
              </div>
            </div>
          </div>
          <div className="flex-1 bg-white flex flex-col">
            <div className="px-8 py-5 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 backdrop-blur-sm shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  {/* <div className="text-xs font-bold uppercase text-blue-600 mb-1">Admin Console</div> */}
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                    {activeTab === 'overview' && 'Profile'}
                    {activeTab === 'partner-profile' && 'Edit Partner Profile'}
                    {activeTab === 'partner-home' && 'Partner  Content'}
                    {activeTab === 'partners' && 'Partner Management'}
                    {activeTab === 'events' && (isAdminMode === 'super' ? 'Event Manager' : 'My Events')}
                    {/* {activeTab === 'roboclub' && 'RoboClub Registration'} */}
                    {activeTab === 'membership' && 'My Membership'}

                    {activeTab === 'courses' && 'Course Management'}
                    {activeTab === 'academia' && 'Academia Portal'}
                    {activeTab === 'forum' && 'Community Forum'}
                  </h1>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-sm font-semibold border border-slate-200">
                    {isAdminMode === 'super' ? 'Global Control Panel' : (partner?.academyName ?? sites?.uae?.name ?? 'Partner Portal')}
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
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
                      <div className="text-xs font-bold text-slate-500 uppercase mb-3">Partner profile</div>
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
                          <span className="text-slate-500 block">Country</span>
                          <span className="font-semibold text-slate-900">
                            {partner.country ?? (partner.countryCode ? (COUNTRY_DIAL_CODES.find((c) => c.code === (partner.countryCode || '').toUpperCase())?.name) : null) ?? '—'}
                          </span>
                        </div>
                        {/* <div>
                          <span className="text-slate-500 block">Location</span>
                          <span className="font-semibold text-slate-900">{partner.location ?? '—'}</span>
                        </div> */}
                        <div>
                          <span className="text-slate-500 block">Contact email</span>
                          <span className="font-semibold text-slate-900">{partner.contactEmail ?? '—'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Phone</span>
                          <span className="font-semibold text-slate-900">{partner.phoneNumber ?? '—'}</span>
                        </div>
                        {/* <div>
                          <span className="text-slate-500 block">Commission</span>
                          <span className="font-semibold text-slate-900">{partner.commissionRate != null ? `${partner.commissionRate}%` : '—'}</span>
                        </div> */}
                        {/* <div>
                          <span className="text-slate-500 block">Revenue</span>
                          <span className="font-semibold text-slate-900">{partner.totalRevenue != null ? `₹${Number(partner.totalRevenue).toLocaleString()}` : (partner.revenue != null ? `₹${Number(partner.revenue).toLocaleString()}` : '—')}</span>
                        </div> */}
                        {/* <div>
                          <span className="text-slate-500 block">Students</span>
                          <span className="font-semibold text-slate-900">{partner.studentsCount ?? 0}</span>
                        </div> */}
                        {/* <div>
                          <span className="text-slate-500 block">Subdomain</span>
                          <span className="font-semibold text-slate-900 break-all">{partner.subdomain ?? '—'}</span>
                        </div> */}
                        {/* <div>
                          <span className="text-slate-500 block">Website</span>
                          <a href={partner.partnerWebsite} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline break-all">{partner.partnerWebsite ?? '—'}</a>
                        </div> */}
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-6 hidden">
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
                        className="w-full p-3 border text-[black] border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    {/* <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Theme</label>
                      <select
                        value={partnerEdit.themeColor}
                        onChange={(e) => setPartnerEdit((p) => ({ ...p, themeColor: e.target.value }))}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none  text-[black] "
                      >
                        <option value="Green">Green</option>
                        <option value="Blue">Blue</option>
                        <option value="Purple">Purple</option>
                        <option value="Orange">Orange</option>
                        <option value="Red">Red</option>
                        <option value="Dark">Dark</option>
                      </select>
                    </div> */}
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
                          className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none  text-[black]"
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
                          className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none  text-[black]"
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

              {activeTab === 'partner-home' && partner && (
                <div className="space-y-6">
                  {partnerHomeLoading ? (
                    <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                      <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="mt-4 text-black">Loading partner home content...</p>
                      </div>
                    </div>
                  ) : partnerHomeError && !partnerHomeData ? (
                    <div className="bg-white p-8 rounded-xl border border-red-200 shadow-sm">
                      <div className="text-red-600 font-medium">{partnerHomeError}</div>
                    </div>
                  ) : partnerHomeData ? (
                    <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-8">
                      <div className="text-xs font-bold text-black uppercase mb-4">Partner  Content Editor</div>
                      <div className="flex gap-2 border-b border-slate-200 pb-3">
                        <button
                          type="button"
                          onClick={() => setPartnerHomeSubTab('home')}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold ${partnerHomeSubTab === 'home' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                        >
                          Home
                        </button>
                        <button
                          type="button"
                          onClick={() => setPartnerHomeSubTab('about')}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold ${partnerHomeSubTab === 'about' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                        >
                          About
                        </button>
                        <button
                          type="button"
                          onClick={() => setPartnerHomeSubTab('advisory-board')}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold ${partnerHomeSubTab === 'advisory-board' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                        >
                          Advisory Board
                        </button>
                        <button
                          type="button"
                          onClick={() => setPartnerHomeSubTab('advisory-refree')}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold ${partnerHomeSubTab === 'advisory-refree' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                        >
                           Refree
                        </button>
                      </div>

                      {partnerHomeSubTab === 'home' && (
                        <>
                      {/* Home Section */}
                      <div className="border-b border-slate-200 pb-6">
                        <h3 className="text-lg font-bold text-black mb-4">Home Section</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-bold text-black mb-1">Hero Title</label>
                            <input
                              type="text"
                              value={partnerHomeData.home?.title || ''}
                              onChange={(e) => setPartnerHomeData({
                                ...partnerHomeData,
                                home: { ...partnerHomeData.home, title: e.target.value }
                              })}
                              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 text-[black] focus:ring-blue-500 outline-none"
                              placeholder="Enter hero title"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-black mb-1">Hero Subtitle</label>
                            <input
                              type="text"
                              value={partnerHomeData.home?.subtitle || ''}
                              onChange={(e) => setPartnerHomeData({
                                ...partnerHomeData,
                                home: { ...partnerHomeData.home, subtitle: e.target.value }
                              })}
                              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-[black]"
                              placeholder="Enter hero subtitle"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-black mb-2">YouTube Video (Featured)</label>
                            <div className="space-y-3">
                              {(partnerHomeData.home?.youtubeVideo || []).map((url, index) => (
                                <div key={`yt-${index}`} className="border border-slate-200 rounded-lg p-3 bg-slate-50/50 flex items-center gap-2">
                                  <input
                                    type="url"
                                    value={typeof url === 'string' ? url : ''}
                                    onChange={(e) => {
                                      const arr = [...(partnerHomeData.home?.youtubeVideo || [])];
                                      arr[index] = e.target.value;
                                      setPartnerHomeData({ ...partnerHomeData, home: { ...partnerHomeData.home, youtubeVideo: arr } });
                                    }}
                                    className="flex-1 p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-[black] text-sm"
                                    placeholder="https://youtu.be/... or https://youtube.com/watch?v=..."
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const arr = (partnerHomeData.home?.youtubeVideo || []).filter((_, i) => i !== index);
                                      setPartnerHomeData({ ...partnerHomeData, home: { ...partnerHomeData.home, youtubeVideo: arr } });
                                    }}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg flex-shrink-0"
                                    aria-label="Remove video"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => {
                                  const arr = [...(partnerHomeData.home?.youtubeVideo || []), ''];
                                  setPartnerHomeData({ ...partnerHomeData, home: { ...partnerHomeData.home, youtubeVideo: arr } });
                                }}
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium border border-dashed border-slate-300 rounded-lg hover:border-blue-500 hover:text-blue-600 text-slate-600"
                              >
                                <Plus className="w-4 h-4" />
                                Add YouTube Video
                              </button>
                            </div>
                            <p className="mt-1 text-xs text-slate-500">Add multiple featured YouTube videos.</p>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-black mb-1">Banner Video (Upload)</label>
                            {(partnerHomeData.home?._bannerVideoFile || partnerHomeData.home?.bannerVideo) ? (
                              <div className="border border-slate-200 rounded-lg p-4 space-y-2">
                                <div className="flex items-center gap-3">
                                  <video
                                    src={partnerHomeData.home._bannerVideoFile ? URL.createObjectURL(partnerHomeData.home._bannerVideoFile) : (partnerHomeData.home.bannerVideo || undefined)}
                                    className="h-24 w-auto rounded object-cover bg-slate-100"
                                    muted
                                    loop
                                    playsInline
                                    preload="metadata"
                                  />
                                  <div className="flex-1 min-w-0">
                                    {partnerHomeData.home._bannerVideoFile ? (
                                      <p className="text-sm font-medium text-black truncate">{partnerHomeData.home._bannerVideoFile.name}</p>
                                    ) : (
                                      <p className="text-sm text-slate-600">Current banner video</p>
                                    )}
                                    <p className="text-xs text-slate-500">MP4, WebM. Max 50MB.</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <label className="cursor-pointer px-3 py-2 text-sm font-medium border border-slate-300 rounded-lg hover:border-blue-500 hover:text-blue-600 text-black">
                                      <Upload className="w-4 h-4 inline-block mr-1 align-middle" />
                                      Change
                                      <input type="file" className="hidden" accept="video/*" onChange={handleBannerVideoFileChange} />
                                    </label>
                                    <button
                                      type="button"
                                      onClick={handleBannerVideoRemove}
                                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-slate-50/50 transition-colors">
                                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                                <span className="text-sm font-medium text-slate-600">Upload banner video</span>
                                <span className="text-xs text-slate-500 mt-1">MP4 or WebM, max 50MB</span>
                                <input type="file" className="hidden" accept="video/mp4,video/webm" onChange={handleBannerVideoFileChange} />
                              </label>
                            )}
                            <p className="mt-1 text-xs text-slate-500">Hero banner background video. Leave empty to use default.</p>
                          </div>
                        </div>
                      </div>

                      {/* Social Links */}
                      <div className="border-b border-slate-200 pb-6">
                        <h3 className="text-lg font-bold text-black mb-4">Social Links</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-bold text-black mb-1">Facebook</label>
                            <input
                              type="url"
                              value={partnerHomeData.socialLinks?.facebook || ''}
                              onChange={(e) => setPartnerHomeData({
                                ...partnerHomeData,
                                socialLinks: { ...partnerHomeData.socialLinks, facebook: e.target.value }
                              })}
                              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-[black]"
                              placeholder="https://facebook.com/..."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-black mb-1">Instagram</label>
                            <input
                              type="url"
                              value={partnerHomeData.socialLinks?.instagram || ''}
                              onChange={(e) => setPartnerHomeData({
                                ...partnerHomeData,
                                socialLinks: { ...partnerHomeData.socialLinks, instagram: e.target.value }
                              })}
                              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-[black]"
                              placeholder="https://instagram.com/..."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-black mb-1">LinkedIn</label>
                            <input
                              type="url"
                              value={partnerHomeData.socialLinks?.linkedin || ''}
                              onChange={(e) => setPartnerHomeData({
                                ...partnerHomeData,
                                socialLinks: { ...partnerHomeData.socialLinks, linkedin: e.target.value }
                              })}
                              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-[black]"
                              placeholder="https://linkedin.com/company/..."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-black mb-1">YouTube</label>
                            <input
                              type="url"
                              value={partnerHomeData.socialLinks?.youtube || ''}
                              onChange={(e) => setPartnerHomeData({
                                ...partnerHomeData,
                                socialLinks: { ...partnerHomeData.socialLinks, youtube: e.target.value }
                              })}
                              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-[black]"
                              placeholder="https://youtube.com/..."
                            />
                          </div>
                        </div>
                      </div>

                      {/* Stats Section (Challenges, Teams, Club, Member, Viewership) */}
                      <div className="border-b border-slate-200 pb-6">
                        <h3 className="text-lg font-bold text-black mb-4">Stats Section</h3>
                        <p className="text-sm text-slate-600 mb-4">Display values on the partner home page (e.g. 15+, 3k+, 10.2M+).</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                          {[
                            { key: 'challenges', label: 'Challenges', placeholder: '15+' },
                            { key: 'teams', label: 'Teams', placeholder: '3k+' },
                            { key: 'club', label: 'Club', placeholder: '3.2k+' },
                            { key: 'member', label: 'Member', placeholder: '10.2M+' },
                            { key: 'viewership', label: 'Viewership', placeholder: '150M+' },
                          ].map(({ key, label, placeholder }) => (
                            <div key={key}>
                              <label className="block text-sm font-bold text-black mb-1">{label}</label>
                              <input
                                type="text"
                                value={partnerHomeData.stats?.[key] ?? ''}
                                onChange={(e) => setPartnerHomeData({
                                  ...partnerHomeData,
                                  stats: { ...(partnerHomeData.stats || {}), [key]: e.target.value }
                                })}
                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-[black]"
                                placeholder={placeholder}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="border-b border-slate-200 pb-6">
                        <h3 className="text-lg font-bold text-black mb-4">Footer Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-bold text-black mb-1">Email</label>
                            <input
                              type="email"
                              value={partnerHomeData.footer?.email || ''}
                              onChange={(e) => setPartnerHomeData({
                                ...partnerHomeData,
                                footer: { ...partnerHomeData.footer, email: e.target.value }
                              })}
                              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-[black]"
                              placeholder="info@example.com"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-black mb-1">Phone</label>
                            <input
                              type="tel"
                              value={partnerHomeData.footer?.phone || ''}
                              onChange={(e) => setPartnerHomeData({
                                ...partnerHomeData,
                                footer: { ...partnerHomeData.footer, phone: e.target.value }
                              })}
                              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-[black]"
                              placeholder="+1 234 567 8900"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-black mb-1">Address</label>
                            <input
                              type="text"
                              value={partnerHomeData.footer?.address || ''}
                              onChange={(e) => setPartnerHomeData({
                                ...partnerHomeData,
                                footer: { ...partnerHomeData.footer, address: e.target.value }
                              })}
                              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-[black]"
                              placeholder="City, Country"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-black mb-1">Countries (comma-separated)</label>
                            <input
                              type="text"
                              value={Array.isArray(partnerHomeData.footer?.countries) ? partnerHomeData.footer.countries.join(', ') : (partnerHomeData.footer?.countries || '')}
                              onChange={(e) => {
                                const val = e.target.value || '';
                                const countries = val.split(',').map((c) => c.trim()).filter(Boolean);
                                setPartnerHomeData({
                                  ...partnerHomeData,
                                  footer: { ...partnerHomeData.footer, countries }
                                });
                              }}
                              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-[black]"
                              placeholder="India, Thailand, USA"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Videos */}
                      {/* <div className="border-b border-slate-200 pb-6">
                        <h3 className="text-lg font-bold text-black mb-4">Videos</h3>
                        <div className="space-y-3">
                          {partnerHomeData.videos?.map((video, index) => (
                            <div key={video._id || index} className="border border-slate-200 rounded-lg p-4 space-y-3">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <input
                                  type="text"
                                  value={video.title || ''}
                                  onChange={(e) => {
                                    const newVideos = [...partnerHomeData.videos];
                                    newVideos[index] = { ...newVideos[index], title: e.target.value };
                                    setPartnerHomeData({ ...partnerHomeData, videos: newVideos });
                                  }}
                                  placeholder="Video title"
                                  className="p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-[black]"
                                />
                                <input
                                  type="url"
                                  value={video.youtubeUrl || ''}
                                  onChange={(e) => {
                                    const newVideos = [...partnerHomeData.videos];
                                    newVideos[index] = { ...newVideos[index], youtubeUrl: e.target.value };
                                    setPartnerHomeData({ ...partnerHomeData, videos: newVideos });
                                  }}
                                  placeholder="YouTube URL"
                                  className="p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-3 flex-1">
                                  {video.thumbnail && (
                                    <img
                                      src={video.thumbnail}
                                      alt={video.title || 'Video thumbnail'}
                                      className="w-16 h-16 rounded object-cover border border-slate-200 text-[black]"
                                    />
                                  )}
                                  <div>
                                    <label className="block text-xs font-bold text-black mb-1">
                                      Thumbnail image
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const input = document.getElementById(`video-thumbnail-input-${index}`);
                                        if (input) {
                                          input.click();
                                        }
                                      }}
                                      className="px-3 py-2 text-sm font-medium border border-slate-300 rounded-lg hover:border-blue-500 hover:text-blue-600 text-[black]"
                                    >
                                      {video.thumbnail ? 'Change image' : 'Upload image'}
                                    </button>
                                    <input
                                      id={`video-thumbnail-input-${index}`}
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(event) => handleVideoThumbnailFileChange(index, event)}
                                    />
                                  </div>
                                </div>
                                <label className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={video.isActive !== false}
                                    onChange={(e) => {
                                      const newVideos = [...partnerHomeData.videos];
                                      newVideos[index] = { ...newVideos[index], isActive: e.target.checked };
                                      setPartnerHomeData({ ...partnerHomeData, videos: newVideos });
                                    }}
                                    className="w-4 h-4"
                                  />
                                  <span className="text-sm text-black">Active</span>
                                </label>
                                <button
                                  onClick={() => {
                                    const newVideos = partnerHomeData.videos.filter((_, i) => i !== index);
                                    setPartnerHomeData({ ...partnerHomeData, videos: newVideos });
                                  }}
                                  className="p-3 text-red-600 hover:bg-red-50 rounded-lg "
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>
                          ))}
                          <button
                            onClick={() => {
                              const newVideos = [...(partnerHomeData.videos || []), { title: '', youtubeUrl: '', thumbnail: '', isActive: true, _id: `temp-${Date.now()}` }];
                              setPartnerHomeData({ ...partnerHomeData, videos: newVideos });
                            }}
                            className="w-full py-2 px-4 border-2 border-dashed border-slate-300 rounded-lg text-black hover:border-blue-500 hover:text-blue-600 font-medium text-[black]"
                          >
                            + Add Video
                          </button>
                        </div>
                      </div> */}

                      {/* News */}
                      <div className="border-b border-slate-200 pb-6">
                        <h3 className="text-lg font-bold text-black mb-4">News</h3>
                        <div className="space-y-3">
                          {partnerHomeData.news?.map((item, index) => (
                            <div key={item._id || index} className="border border-slate-200 rounded-lg p-4 space-y-3">
                              <input
                                type="text"
                                value={item.title || ''}
                                onChange={(e) => {
                                  const newNews = [...partnerHomeData.news];
                                  newNews[index] = { ...newNews[index], title: e.target.value };
                                  setPartnerHomeData({ ...partnerHomeData, news: newNews });
                                }}
                                placeholder="News title"
                                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-[black]"
                              />
                              <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
                                <RichTextEditor
                                  value={item.description || ''}
                                  onChange={(html) => {
                                    const newNews = [...partnerHomeData.news];
                                    newNews[index] = { ...newNews[index], description: html };
                                    setPartnerHomeData({ ...partnerHomeData, news: newNews });
                                  }}
                                  placeholder="News description (use toolbar for headings, lists, bold, italic)"
                                  minHeight="140px"
                                />
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-medium text-slate-600 mb-1">Date</label>
                                  <input
                                    type="date"
                                    value={item.Date || item.date || ''}
                                    onChange={(e) => {
                                      const newNews = [...partnerHomeData.news];
                                      newNews[index] = { ...newNews[index], Date: e.target.value };
                                      setPartnerHomeData({ ...partnerHomeData, news: newNews });
                                    }}
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-[black]"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-medium text-slate-600 mb-1">Image</label>
                                  {(item._imageFile || item.image) ? (
                                    <div className="relative group">
                                      <div className="w-full h-24 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
                                        <img
                                          src={item._imageFile ? URL.createObjectURL(item._imageFile) : (item.image || '')}
                                          alt=""
                                          className="max-h-full max-w-full object-contain"
                                          onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/120x80?text=Image'; }}
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                          <label className="cursor-pointer p-2 bg-white rounded-lg shadow">
                                            <Upload className="w-4 h-4 text-slate-700" />
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleNewsImageChange(index, e)} />
                                          </label>
                                          <button type="button" onClick={() => handleNewsImageRemove(index)} className="p-2 bg-white rounded-lg shadow">
                                            <X className="w-4 h-4 text-slate-700" />
                                          </button>
                                        </div>
                                      </div>
                                      {item._imageFile && <p className="mt-1 text-xs text-slate-500">{item._imageFile.name}</p>}
                                    </div>
                                  ) : (
                                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-slate-50/50 transition-colors">
                                      <ImageIcon className="w-6 h-6 text-slate-400 mb-1" />
                                      <span className="text-xs text-slate-500">Upload image</span>
                                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleNewsImageChange(index, e)} />
                                    </label>
                                  )}
                                </div>
                                <select
                                  value={item.type || 'GENERAL'}
                                  onChange={(e) => {
                                    const newNews = [...partnerHomeData.news];
                                    newNews[index] = { ...newNews[index], type: e.target.value };
                                    setPartnerHomeData({ ...partnerHomeData, news: newNews });
                                  }}
                                  className="p-3 border border-slate-300 rounded-lg focus:ring-2 text-[black] focus:ring-blue-500 outline-none"
                                >
                                  <option value="GENERAL">General</option>
                                  <option value="EVENT">Event</option>
                                  <option value="REGULATION">Regulation</option>
                                </select>
                              </div>
                              <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={item.isActive !== false}
                                    onChange={(e) => {
                                      const newNews = [...partnerHomeData.news];
                                      newNews[index] = { ...newNews[index], isActive: e.target.checked };
                                      setPartnerHomeData({ ...partnerHomeData, news: newNews });
                                    }}
                                    className="w-4 h-4"
                                  />
                                  <span className="text-sm text-black">Active</span>
                                </label>
                                <button
                                  onClick={() => {
                                    const newNews = partnerHomeData.news.filter((_, i) => i !== index);
                                    setPartnerHomeData({ ...partnerHomeData, news: newNews });
                                  }}
                                  className="ml-auto p-3 text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>
                          ))}
                          <button
                            onClick={() => {
                              const newNews = [...(partnerHomeData.news || []), { title: '', description: '', Date: '', image: '', type: 'GENERAL', isActive: true, _id: `temp-${Date.now()}`, _imageFile: null }];
                              setPartnerHomeData({ ...partnerHomeData, news: newNews });
                            }}
                            className="w-full py-2 px-4 border-2 border-dashed border-slate-300 rounded-lg text-black hover:border-blue-500 hover:text-blue-600 font-medium"
                          >
                            + Add News Item
                          </button>
                        </div>
                      </div>

                      {/* Supporters */}
                      <div className="pb-6">
                        <h3 className="text-lg font-bold text-black mb-4">Supporters</h3>
                        <div className="space-y-3">
                          {partnerHomeData.supporters?.map((supporter, index) => (
                            <div key={supporter._id || index} className="border border-slate-200 rounded-lg p-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {/* <input
                                  type="text"
                                  value={supporter.name || ''}
                                  onChange={(e) => {
                                    const newSupporters = [...partnerHomeData.supporters];
                                    newSupporters[index] = { ...newSupporters[index], name: e.target.value };
                                    setPartnerHomeData({ ...partnerHomeData, supporters: newSupporters });
                                  }}
                                  placeholder="Supporter name"
                                  className="p-3 border text-[black] border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                /> */}
                                <div>
                                  <label className="block text-xs font-medium text-slate-600 mb-1">Logo</label>
                                  {(supporter._logoFile || supporter.logo) ? (
                                    <div className="relative group">
                                      <div className="w-full h-16 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
                                        <img
                                          src={supporter._logoFile ? URL.createObjectURL(supporter._logoFile) : (supporter.logo || '')}
                                          alt=""
                                          className="max-h-full max-w-full object-contain"
                                          onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/80x40?text=Logo'; }}
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                          <label className="cursor-pointer p-2 bg-white rounded-lg shadow">
                                            <Upload className="w-4 h-4 text-slate-700" />
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleSupporterLogoChange(index, e)} />
                                          </label>
                                          <button type="button" onClick={() => handleSupporterLogoRemove(index)} className="p-2 bg-white rounded-lg shadow">
                                            <X className="w-4 h-4 text-slate-700" />
                                          </button>
                                        </div>
                                      </div>
                                      {supporter._logoFile && <p className="mt-1 text-xs text-slate-500">{supporter._logoFile.name}</p>}
                                    </div>
                                  ) : (
                                    <label className="flex flex-col items-center justify-center w-full h-16 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-slate-50/50 transition-colors">
                                      <ImageIcon className="w-5 h-5 text-slate-400 mb-1" />
                                      <span className="text-xs text-slate-500">Upload logo</span>
                                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleSupporterLogoChange(index, e)} />
                                    </label>
                                  )}
                                </div>
                                <div className="flex items-center gap-3">
                                  <input
                                    type="url"
                                    value={supporter.website || ''}
                                    onChange={(e) => {
                                      const newSupporters = [...partnerHomeData.supporters];
                                      newSupporters[index] = { ...newSupporters[index], website: e.target.value };
                                      setPartnerHomeData({ ...partnerHomeData, supporters: newSupporters });
                                    }}
                                    placeholder="Website URL"
                                    className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-[black]"
                                  />
                                  <label className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={supporter.isActive !== false}
                                      onChange={(e) => {
                                        const newSupporters = [...partnerHomeData.supporters];
                                        newSupporters[index] = { ...newSupporters[index], isActive: e.target.checked };
                                        setPartnerHomeData({ ...partnerHomeData, supporters: newSupporters });
                                      }}
                                      className="w-4 h-4"
                                    />
                                    <span className="text-sm text-black">Active</span>
                                  </label>
                                  <button
                                    onClick={() => {
                                      const newSupporters = partnerHomeData.supporters.filter((_, i) => i !== index);
                                      setPartnerHomeData({ ...partnerHomeData, supporters: newSupporters });
                                    }}
                                    className="p-3 text-red-600 hover:bg-red-50 rounded-lg"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                          <button
                            onClick={() => {
                              const newSupporters = [...(partnerHomeData.supporters || []), { name: '', logo: '', website: '', isActive: true, _id: `temp-${Date.now()}`, _logoFile: null }];
                              setPartnerHomeData({ ...partnerHomeData, supporters: newSupporters });
                            }}
                            className="w-full py-2 px-4 border-2 border-dashed border-slate-300 rounded-lg text-black hover:border-blue-500 hover:text-blue-600 font-medium"
                          >
                            + Add Supporter
                          </button>
                        </div>
                      </div>

                      {/* Error and Success Messages */}
                      {partnerHomeError && (
                        <div className="text-sm text-red-600 font-medium bg-red-50 p-4 rounded-lg">{partnerHomeError}</div>
                      )}
                      {partnerHomeSuccess && (
                        <div className="text-sm text-emerald-600 font-medium bg-emerald-50 p-4 rounded-lg flex items-center gap-2">
                          <CheckCircle size={18} /> Home content saved successfully.
                        </div>
                      )}

                      {/* Save Button */}
                      <button
                        onClick={savePartnerHome}
                        disabled={partnerHomeSaving}
                        className="w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {partnerHomeSaving ? 'Saving…' : 'Save Home Content'}
                      </button>
                        </>
                      )}

                      {partnerHomeSubTab === 'about' && (
                        <div className="space-y-5">
                          <div className="rounded-xl border border-slate-200 p-5">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-base font-bold text-black">About Partner</h4>
                              {partnerAboutList.length === 0 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setPartnerAboutForm(emptyPartnerAboutForm);
                                    setPartnerAboutSuccess('');
                                    setPartnerAboutError('');
                                    setShowPartnerAboutForm(true);
                                  }}
                                  className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg text-black hover:border-slate-400"
                                >
                                  Add About Partner
                                </button>
                              )}
                            </div>
                            {partnerAboutLoading ? (
                              <p className="text-sm text-slate-600">Loading about partner...</p>
                            ) : partnerAboutList.length === 0 ? (
                              <p className="text-sm text-slate-500">No about partner records yet.</p>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {partnerAboutList.map((item) => (
                                  <div
                                    key={item._id || `${item.heading}-${item.content?.slice(0, 20)}`}
                                    className={`p-3 rounded-lg border transition-colors ${partnerAboutForm._id === item._id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}
                                  >
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="min-w-0">
                                        {/* <p className="font-semibold text-black truncate">{item.heading || 'Untitled'}</p> */}
                                        <p className="font-semibold text-black truncate">{getPlainTextPreview(item.content) || '-'}</p>
                                      </div>
                                      <div className="flex items-center gap-2 shrink-0">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setSelectedPartnerAbout(item);
                                            setPartnerAboutSuccess('');
                                            setPartnerAboutError('');
                                          }}
                                          className="px-2.5 py-1.5 text-xs font-semibold rounded-md border border-slate-300 text-slate-700 hover:border-slate-400"
                                          title="View About Partner"
                                        >
                                          View
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setPartnerAboutForm(item);
                                            setPartnerAboutSuccess('');
                                            setPartnerAboutError('');
                                            setShowPartnerAboutForm(true);
                                          }}
                                          className="p-1.5 rounded-md text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                                          title="Edit About Partner"
                                        >
                                          <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDeletePartnerAbout(item._id)}
                                          disabled={partnerAboutDeleting}
                                          className="p-1.5 rounded-md text-slate-600 hover:text-red-600 hover:bg-red-50 disabled:opacity-50"
                                          title="Delete About Partner"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          {selectedPartnerAbout ? (
                            <div className="rounded-xl border border-slate-200 p-5">
                              <h3 className="text-lg font-bold text-black mb-3">About Partner Details</h3>
                              <div className="space-y-3">
                                {/* <div>
                                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Heading</p>
                                  <p className="text-base font-semibold text-black">{selectedPartnerAbout.heading || '-'}</p>
                                </div> */}
                                <div>
                                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Content</p>
                                  <div
                                    className="prose prose-sm max-w-none text-black"
                                    dangerouslySetInnerHTML={{ __html: selectedPartnerAbout.content || '<p>-</p>' }}
                                  />
                                </div>
                              </div>
                            </div>
                          ) : null}
                          {showPartnerAboutForm ? (
                            <div className="rounded-xl border border-slate-200 p-5">
                              <div className="flex items-center justify-between gap-3 mb-4">
                                <h3 className="text-lg font-bold text-black">About Partner</h3>
                                {partnerAboutForm._id ? (
                                  <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
                                    ID: {partnerAboutForm._id}
                                  </span>
                                ) : (
                                  <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-1 rounded">
                                    New record
                                  </span>
                                )}
                              </div>

                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-bold text-black mb-1">Heading</label>
                                  <input
                                    type="text"
                                    value={partnerAboutForm.heading}
                                    onChange={(e) => setPartnerAboutForm((prev) => ({ ...prev, heading: e.target.value }))}
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 text-[black] focus:ring-blue-500 outline-none"
                                    placeholder="About Our Partner"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-bold text-black mb-1">Content</label>
                                  <RichTextEditor
                                    value={partnerAboutForm.content}
                                    onChange={(html) => setPartnerAboutForm((prev) => ({ ...prev, content: html }))}
                                    placeholder="Write about the partner. You can use heading, paragraph, bullet list, etc."
                                    minHeight="180px"
                                  />
                                </div>
                              </div>
                            </div>
                          ) : null}

                          {partnerAboutError ? (
                            <div className="text-sm text-red-600 font-medium bg-red-50 p-4 rounded-lg">{partnerAboutError}</div>
                          ) : null}
                          {partnerAboutSuccess ? (
                            <div className="text-sm text-emerald-600 font-medium bg-emerald-50 p-4 rounded-lg flex items-center gap-2">
                              <CheckCircle size={18} /> {partnerAboutSuccess}
                            </div>
                          ) : null}

                          {showPartnerAboutForm ? (
                            <div className="flex flex-wrap items-center gap-3">
                              <button
                                type="button"
                                onClick={savePartnerAbout}
                                disabled={partnerAboutSaving}
                                className="px-5 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {partnerAboutSaving ? 'Saving…' : partnerAboutForm._id ? 'Update About' : 'Add About'}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setPartnerAboutForm(emptyPartnerAboutForm);
                                  setShowPartnerAboutForm(false);
                                }}
                                disabled={partnerAboutSaving || partnerAboutDeleting}
                                className="px-5 py-3 border border-slate-300 text-black font-semibold rounded-lg hover:border-slate-400 disabled:opacity-50"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : null}
                        </div>
                      )}

                      {partnerHomeSubTab === 'advisory-board' && (
                        <div className="space-y-5">
                          <div className="rounded-xl border border-slate-200 p-5">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-base font-bold text-black">Advisory Board List</h4>
                              <button
                                type="button"
                                onClick={() => {
                                  setAdvisoryBoardForm(emptyAdvisoryForm);
                                  setAdvisoryBoardSuccess('');
                                  setAdvisoryBoardError('');
                                  setShowAdvisoryBoardForm(true);
                                }}
                                className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg text-black hover:border-slate-400"
                              >
                                Add Advisory Board
                              </button>
                            </div>
                            {advisoryBoardLoading ? (
                              <p className="text-sm text-slate-600">Loading advisory board...</p>
                            ) : advisoryBoardList.length === 0 ? (
                              <p className="text-sm text-slate-500">No advisory board members yet.</p>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {advisoryBoardList.map((item) => (
                                  <div
                                    key={item._id || `${item.name}-${item.designation}`}
                                    className={`p-3 rounded-lg border transition-colors ${advisoryBoardForm._id === item._id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}
                                  >
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="min-w-0">
                                        <p className="font-semibold text-black">{item.name || 'Unnamed'}</p>
                                        <p className="text-sm text-slate-600">{item.designation || '-'}</p>
                                      </div>
                                      <div className="flex items-center gap-2 shrink-0">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setAdvisoryBoardForm({ ...item, _imageFile: null });
                                            setAdvisoryBoardSuccess('');
                                            setAdvisoryBoardError('');
                                            setShowAdvisoryBoardForm(true);
                                          }}
                                          className="p-1.5 rounded-md text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                                          title="Edit Advisory Board"
                                        >
                                          <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteAdvisoryBoard(item._id)}
                                          disabled={advisoryBoardDeleting}
                                          className="p-1.5 rounded-md text-slate-600 hover:text-red-600 hover:bg-red-50 disabled:opacity-50"
                                          title="Delete Advisory Board"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          {showAdvisoryBoardForm ? (
                          <div className="rounded-xl border border-slate-200 p-5">
                            <div className="flex items-center justify-between gap-3 mb-4">
                              <h3 className="text-lg font-bold text-black">Advisory Board</h3>
                              {advisoryBoardForm._id ? (
                                <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">ID: {advisoryBoardForm._id}</span>
                              ) : (
                                <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-1 rounded">New record</span>
                              )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-bold text-black mb-1">Name</label>
                                <input
                                  type="text"
                                  value={advisoryBoardForm.name}
                                  onChange={(e) => setAdvisoryBoardForm((prev) => ({ ...prev, name: e.target.value }))}
                                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 text-[black] focus:ring-blue-500 outline-none"
                                  placeholder="Enter name"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-bold text-black mb-1">Designation</label>
                                <input
                                  type="text"
                                  value={advisoryBoardForm.designation}
                                  onChange={(e) => setAdvisoryBoardForm((prev) => ({ ...prev, designation: e.target.value }))}
                                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 text-[black] focus:ring-blue-500 outline-none"
                                  placeholder="Enter designation"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-black mb-1">Image</label>
                                {(advisoryBoardForm._imageFile || advisoryBoardForm.image) ? (
                                  <div className="relative group w-full max-w-xs">
                                    <div className="h-36 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
                                      <img
                                        src={advisoryBoardForm._imageFile ? URL.createObjectURL(advisoryBoardForm._imageFile) : advisoryBoardForm.image}
                                        alt=""
                                        className="max-h-full max-w-full object-contain"
                                      />
                                    </div>
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                      <label className="cursor-pointer p-2 bg-white rounded-lg shadow">
                                        <Upload className="w-4 h-4 text-slate-700" />
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleAdvisoryImageChange('board', e)} />
                                      </label>
                                      <button type="button" onClick={() => setAdvisoryBoardForm((prev) => ({ ...prev, image: '', _imageFile: null }))} className="p-2 bg-white rounded-lg shadow">
                                        <X className="w-4 h-4 text-slate-700" />
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <label className="flex flex-col items-center justify-center w-full max-w-xs h-36 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-slate-50/50 transition-colors">
                                    <ImageIcon className="w-6 h-6 text-slate-400 mb-1" />
                                    <span className="text-xs text-slate-500">Upload image</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleAdvisoryImageChange('board', e)} />
                                  </label>
                                )}
                                {advisoryBoardForm._imageFile ? <p className="mt-1 text-xs text-slate-500">{advisoryBoardForm._imageFile.name}</p> : null}
                              </div>
                            </div>
                          </div>
                          ) : null}
                          {advisoryBoardError ? <div className="text-sm text-red-600 font-medium bg-red-50 p-4 rounded-lg">{advisoryBoardError}</div> : null}
                          {advisoryBoardSuccess ? (
                            <div className="text-sm text-emerald-600 font-medium bg-emerald-50 p-4 rounded-lg flex items-center gap-2">
                              <CheckCircle size={18} /> {advisoryBoardSuccess}
                            </div>
                          ) : null}
                          {showAdvisoryBoardForm ? (
                            <div className="flex flex-wrap items-center gap-3">
                              <button type="button" onClick={saveAdvisoryBoard} disabled={advisoryBoardSaving} className="px-5 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                                {advisoryBoardSaving ? 'Saving…' : advisoryBoardForm._id ? 'Update Advisory Board' : 'Add Advisory Board'}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setAdvisoryBoardForm(emptyAdvisoryForm);
                                  setShowAdvisoryBoardForm(false);
                                }}
                                disabled={advisoryBoardSaving || advisoryBoardDeleting}
                                className="px-5 py-3 border border-slate-300 text-black font-semibold rounded-lg hover:border-slate-400 disabled:opacity-50"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : null}
                        </div>
                      )}

                      {partnerHomeSubTab === 'advisory-refree' && (
                        <div className="space-y-5">
                          <div className="rounded-xl border border-slate-200 p-5">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-base font-bold text-black"> Refree List</h4>
                              <button
                                type="button"
                                onClick={() => {
                                  setAdvisoryRefreeForm(emptyAdvisoryForm);
                                  setAdvisoryRefreeSuccess('');
                                  setAdvisoryRefreeError('');
                                  setShowAdvisoryRefreeForm(true);
                                }}
                                className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg text-black hover:border-slate-400"
                              >
                                Add  Refree
                              </button>
                            </div>
                            {advisoryRefreeLoading ? (
                              <p className="text-sm text-slate-600">Loading  refree...</p>
                            ) : advisoryRefreeList.length === 0 ? (
                              <p className="text-sm text-slate-500">No  refree members yet.</p>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {advisoryRefreeList.map((item) => (
                                  <div
                                    key={item._id || `${item.name}-${item.designation}`}
                                    className={`p-3 rounded-lg border transition-colors ${advisoryRefreeForm._id === item._id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}
                                  >
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="min-w-0">
                                        <p className="font-semibold text-black">{item.name || 'Unnamed'}</p>
                                        <p className="text-sm text-slate-600">{item.designation || '-'}</p>
                                      </div>
                                      <div className="flex items-center gap-2 shrink-0">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setAdvisoryRefreeForm({ ...item, _imageFile: null });
                                            setAdvisoryRefreeSuccess('');
                                            setAdvisoryRefreeError('');
                                            setShowAdvisoryRefreeForm(true);
                                          }}
                                          className="p-1.5 rounded-md text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                                          title="Edit  Refree"
                                        >
                                          <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteAdvisoryRefree(item._id)}
                                          disabled={advisoryRefreeDeleting}
                                          className="p-1.5 rounded-md text-slate-600 hover:text-red-600 hover:bg-red-50 disabled:opacity-50"
                                          title="Delete  Refree"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          {showAdvisoryRefreeForm ? (
                          <div className="rounded-xl border border-slate-200 p-5">
                            <div className="flex items-center justify-between gap-3 mb-4">
                              <h3 className="text-lg font-bold text-black"> Refree</h3>
                              {advisoryRefreeForm._id ? (
                                <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">ID: {advisoryRefreeForm._id}</span>
                              ) : (
                                <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-1 rounded">New record</span>
                              )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-bold text-black mb-1">Name</label>
                                <input
                                  type="text"
                                  value={advisoryRefreeForm.name}
                                  onChange={(e) => setAdvisoryRefreeForm((prev) => ({ ...prev, name: e.target.value }))}
                                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 text-[black] focus:ring-blue-500 outline-none"
                                  placeholder="Enter name"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-bold text-black mb-1">Designation</label>
                                <input
                                  type="text"
                                  value={advisoryRefreeForm.designation}
                                  onChange={(e) => setAdvisoryRefreeForm((prev) => ({ ...prev, designation: e.target.value }))}
                                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 text-[black] focus:ring-blue-500 outline-none"
                                  placeholder="Enter designation"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-black mb-1">Image</label>
                                {(advisoryRefreeForm._imageFile || advisoryRefreeForm.image) ? (
                                  <div className="relative group w-full max-w-xs">
                                    <div className="h-36 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
                                      <img
                                        src={advisoryRefreeForm._imageFile ? URL.createObjectURL(advisoryRefreeForm._imageFile) : advisoryRefreeForm.image}
                                        alt=""
                                        className="max-h-full max-w-full object-contain"
                                      />
                                    </div>
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                      <label className="cursor-pointer p-2 bg-white rounded-lg shadow">
                                        <Upload className="w-4 h-4 text-slate-700" />
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleAdvisoryImageChange('refree', e)} />
                                      </label>
                                      <button type="button" onClick={() => setAdvisoryRefreeForm((prev) => ({ ...prev, image: '', _imageFile: null }))} className="p-2 bg-white rounded-lg shadow">
                                        <X className="w-4 h-4 text-slate-700" />
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <label className="flex flex-col items-center justify-center w-full max-w-xs h-36 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-slate-50/50 transition-colors">
                                    <ImageIcon className="w-6 h-6 text-slate-400 mb-1" />
                                    <span className="text-xs text-slate-500">Upload image</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleAdvisoryImageChange('refree', e)} />
                                  </label>
                                )}
                                {advisoryRefreeForm._imageFile ? <p className="mt-1 text-xs text-slate-500">{advisoryRefreeForm._imageFile.name}</p> : null}
                              </div>
                            </div>
                          </div>
                          ) : null}
                          {advisoryRefreeError ? <div className="text-sm text-red-600 font-medium bg-red-50 p-4 rounded-lg">{advisoryRefreeError}</div> : null}
                          {advisoryRefreeSuccess ? (
                            <div className="text-sm text-emerald-600 font-medium bg-emerald-50 p-4 rounded-lg flex items-center gap-2">
                              <CheckCircle size={18} /> {advisoryRefreeSuccess}
                            </div>
                          ) : null}
                          {showAdvisoryRefreeForm ? (
                            <div className="flex flex-wrap items-center gap-3">
                              <button type="button" onClick={saveAdvisoryRefree} disabled={advisoryRefreeSaving} className="px-5 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                                {advisoryRefreeSaving ? 'Saving…' : advisoryRefreeForm._id ? 'Update Advisory Refree' : 'Add Advisory Refree'}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setAdvisoryRefreeForm(emptyAdvisoryForm);
                                  setShowAdvisoryRefreeForm(false);
                                }}
                                disabled={advisoryRefreeSaving || advisoryRefreeDeleting}
                                className="px-5 py-3 border border-slate-300 text-black font-semibold rounded-lg hover:border-slate-400 disabled:opacity-50"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  ) : null}
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
                    <button onClick={handleCreatePartner} className="px-6 py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 w-full">
                      Generate Micro-Site & Credentials
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'events' && (
                <div className="space-y-6 text-black">
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
                        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                          <h4 className="font-semibold text-slate-800">Seasons list</h4>
                          {!showAddSeasonForm ? (
                            <button
                              onClick={() => setShowAddSeasonForm(true)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <Plus size={18} /> Add Season
                            </button>
                          ) : null}
                        </div>
                        {showAddSeasonForm && (
                          <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="font-bold text-lg flex items-center gap-2">
                                <Calendar size={20} /> Add Season
                              </h3>
                              <button
                                onClick={() => { setShowAddSeasonForm(false); setSeasonError(''); }}
                                className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded"
                                title="Close"
                              >
                                <X size={18} />
                              </button>
                            </div>
                            {seasonsError && <p className="text-sm text-red-600 mb-3">{seasonsError}</p>}
                            {seasonError && <p className="text-sm text-red-600 mb-3">{seasonError}</p>}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                          </div>
                        )}
                        <div className="border-t border-slate-100 pt-4">
                          {seasonsLoading ? (
                            <p className="text-slate-500 text-sm">Loading seasons…</p>
                          ) : seasons.length === 0 ? (
                            <p className="text-slate-500 text-sm">No seasons yet. Click <strong>Add Season</strong> to create one.</p>
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
                      <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                        <h4 className="font-semibold text-slate-800">Events list</h4>
                        {!showAddEventForm ? (
                          <button
                            onClick={() => setShowAddEventForm(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Plus size={18} /> Add Event
                          </button>
                        ) : null}
                      </div>
                      {showAddEventForm && (
                        <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                              <Calendar size={20} /> Add Event
                            </h3>
                            <button
                              onClick={() => { setShowAddEventForm(false); setEventError(''); }}
                              className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded"
                              title="Close"
                            >
                              <X size={18} />
                            </button>
                          </div>
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
                        </div>
                      )}
                      <div className="border-t border-slate-100 pt-4">
                        {eventsLoading ? (
                          <p className="text-sm text-slate-500">Loading events…</p>
                        ) : eventList.length === 0 ? (
                          <p className="text-sm text-slate-500">No events yet. Click <strong>Add Event</strong> to create one.</p>
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
                                          <p className="text-xs text-black font-semibold text-slate-600 mb-1">Competitions ({competitions.length})</p>
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
                      <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                        <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                          <Trophy size={20} /> Competitions list
                        </h4>
                        {!showAddCompetitionForm ? (
                          <button
                            type="button"
                            onClick={() => { setEditingCompetition(null); setShowAddCompetitionForm(true); }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Plus size={18} /> Add Competition
                          </button>
                        ) : null}
                      </div>
                      {competitionError && <p className="text-sm text-red-600 mb-3">{competitionError}</p>}
                      {showAddCompetitionForm && (
                        <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                              <Trophy size={20} /> {editingCompetition ? 'Edit Competition' : 'Add Competition'}
                            </h3>
                            <button onClick={handleCancelCompetitionForm} className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded" title="Close"><X size={18} /></button>
                          </div>
                          {Object.keys(competitionFormErrors).length > 0 && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">Please fix the errors below.</div>
                          )}
                          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Competition Name *</label>
                                <input name="name" value={competitionForm.name} onChange={handleCompetitionFormChange} placeholder="e.g., Water Rocket Challenge" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                {competitionFormErrors.name && <p className="mt-1 text-sm text-red-600">{competitionFormErrors.name}</p>}
                              </div>
                              <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Category *</label>
                                <select name="category" value={competitionForm.category} onChange={handleCompetitionFormChange} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                  <option value="">Select Category</option>
                                  {COMPETITION_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                                {competitionFormErrors.category && <p className="mt-1 text-sm text-red-600">{competitionFormErrors.category}</p>}
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                              <textarea name="description" value={competitionForm.description} onChange={handleCompetitionFormChange} rows={3} placeholder="Enter competition description" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Season *</label>
                                <select name="season_id" value={competitionForm.season_id} onChange={handleCompetitionFormChange} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                  <option value="">Select Season</option>
                                  {seasons.map((s) => <option key={s._id || s.id} value={s._id || s.id}>{s.name} ({s.year})</option>)}
                                </select>
                                {competitionFormErrors.season_id && <p className="mt-1 text-sm text-red-600">{competitionFormErrors.season_id}</p>}
                              </div>
                              <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Event *</label>
                                <select name="event_id" value={competitionForm.event_id} onChange={handleCompetitionFormChange} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                  <option value="">Select Event</option>
                                  {(() => {
                                    const getEventSeasonId = (e) => e.season_id || e.seasonId || e.season?._id || e.season?.id;
                                    const filtered = competitionForm.season_id
                                      ? eventList.filter((e) => getEventSeasonId(e) === competitionForm.season_id)
                                      : eventList;
                                    const eventsForSelect = filtered.length > 0 ? filtered : eventList;
                                    return eventsForSelect.map((ev) => (
                                      <option key={ev._id || ev.id} value={ev._id || ev.id}>{ev.name || ev.title || ev.eventName || 'Unnamed Event'}</option>
                                    ));
                                  })()}
                                </select>
                                {eventsLoading && eventList.length === 0 && <p className="mt-1 text-sm text-slate-500">Loading events…</p>}
                                {!eventsLoading && eventList.length === 0 && !eventsListError && <p className="mt-1 text-sm text-amber-600">No events yet. Add events in the Events tab first.</p>}
                                {competitionFormErrors.event_id && <p className="mt-1 text-sm text-red-600">{competitionFormErrors.event_id}</p>}
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Prize Pool</label>
                                <input name="prizePool" type="number" min={0} value={competitionForm.prizePool} onChange={handleCompetitionFormChange} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                              </div>
                              <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Min Team Members</label>
                                <input name="teamRequirements.minMembers" type="number" min={1} value={competitionForm.teamRequirements?.minMembers ?? 1} onChange={handleCompetitionFormChange} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                {competitionFormErrors.minMembers && <p className="mt-1 text-sm text-red-600">{competitionFormErrors.minMembers}</p>}
                              </div>
                              <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Max Team Members</label>
                                <input name="teamRequirements.maxMembers" type="number" min={competitionForm.teamRequirements?.minMembers ?? 1} value={competitionForm.teamRequirements?.maxMembers ?? 4} onChange={handleCompetitionFormChange} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                {competitionFormErrors.maxMembers && <p className="mt-1 text-sm text-red-600">{competitionFormErrors.maxMembers}</p>}
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Duration Value</label>
                                <input name="duration.value" type="number" min={1} value={competitionForm.duration?.value ?? 1} onChange={handleCompetitionFormChange} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                {competitionFormErrors.duration && <p className="mt-1 text-sm text-red-600">{competitionFormErrors.duration}</p>}
                              </div>
                              <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Duration Unit</label>
                                <select name="duration.unit" value={competitionForm.duration?.unit ?? 'day'} onChange={handleCompetitionFormChange} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                  <option value="day">Day(s)</option>
                                  <option value="days">Days</option>
                                  <option value="week">Week(s)</option>
                                  <option value="hours">Hours</option>
                                  <option value="month">Month(s)</option>
                                </select>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-slate-700 mb-1">Banner Image {!editingCompetition && '*'}</label>
                              {competitionBannerImagePreview ? (
                                <div className="relative group">
                                  <div className="relative w-full h-40 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                                    <img src={competitionBannerImagePreview} alt="Banner" className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/800x400?text=Image+Error'; }} />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                      <label className="cursor-pointer p-2 bg-white/90 rounded-lg"><Upload size={18} /><input type="file" className="hidden" accept="image/*" onChange={handleCompetitionBannerImageChange} /></label>
                                      <button type="button" onClick={handleRemoveCompetitionBannerImage} className="p-2 bg-white/90 rounded-lg"><X size={18} /></button>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-400 cursor-pointer" onClick={() => document.getElementById('competition-banner-input')?.click()}>
                                  <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                  <p className="text-sm text-slate-600">Upload banner (PNG, JPG, GIF, WebP up to 10MB)</p>
                                  <input id="competition-banner-input" type="file" className="hidden" accept="image/*" onChange={handleCompetitionBannerImageChange} />
                                </div>
                              )}
                              {competitionFormErrors.bannerImage && <p className="mt-1 text-sm text-red-600">{competitionFormErrors.bannerImage}</p>}
                            </div>
                            <div className="border border-slate-200 rounded-lg p-4 bg-white">
                              <h4 className="font-semibold text-slate-800 mb-3">Download Titles</h4>
                              <div className="flex gap-2 mb-3">
                                <input value={competitionDownloadTitle} onChange={(e) => setCompetitionDownloadTitle(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCompetitionDownload(); } }} placeholder="e.g., Rulebook" className="flex-1 p-2 border rounded-lg text-sm" />
                                <button type="button" onClick={handleAddCompetitionDownload} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium flex items-center gap-1"><Plus size={14} /> Add</button>
                              </div>
                              {competitionForm.downloadTitles?.length > 0 && (
                                <div className="space-y-2">
                                  {competitionForm.downloadTitles.map((title, i) => (
                                    <div key={i} className="flex justify-between items-center p-2 bg-slate-50 rounded border">
                                      <span className="text-sm">{title}</span>
                                      <button type="button" onClick={() => handleRemoveCompetitionDownload(i)} className="p-1 text-slate-500 hover:text-red-600"><X size={14} /></button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-slate-700 mb-1">Rules and Regulations</label>
                              <textarea name="rulesAndRegulations" value={competitionForm.rulesAndRegulations} onChange={handleCompetitionFormChange} rows={3} placeholder="Enter rules" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Training Resource URL</label>
                                <input name="trainingResourseUrl" value={competitionForm.trainingResourseUrl} onChange={handleCompetitionFormChange} placeholder="https://..." className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                              </div>
                              <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Past Winner URL</label>
                                <input name="pastWinnerUrl" value={competitionForm.pastWinnerUrl} onChange={handleCompetitionFormChange} placeholder="https://..." className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                              </div>
                              <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Global Ranking URL</label>
                                <input name="globalRankingeUrl" value={competitionForm.globalRankingeUrl} onChange={handleCompetitionFormChange} placeholder="https://..." className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                              </div>
                            </div>
                            <div className="flex gap-4">
                              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="isActive" checked={competitionForm.isActive} onChange={handleCompetitionFormChange} className="rounded border-slate-300" /><span className="text-sm">Active</span></label>
                              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="hasBots" checked={competitionForm.hasBots} onChange={handleCompetitionFormChange} className="rounded border-slate-300" /><span className="text-sm">Has Bots</span></label>
                            </div>
                            <div className="flex gap-3 pt-2">
                              <button type="button" onClick={handleCancelCompetitionForm} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-medium">Cancel</button>
                              <button type="button" onClick={handleSaveCompetition} disabled={competitionSaving} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50">{competitionSaving ? 'Saving…' : (editingCompetition ? 'Update Competition' : 'Create Competition')}</button>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="border-t border-slate-100 pt-4">
                      {competitionsListError && <p className="text-sm text-amber-600 mb-2">{competitionsListError}</p>}
                      {competitionsLoading ? (
                        <p className="text-sm text-slate-500">Loading competitions…</p>
                      ) : competitionList.length === 0 ? (
                        <p className="text-sm text-slate-500">No competitions yet. Click <strong>Add Competition</strong> to create one.</p>
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
                                      onClick={() => { setEditingCompetition(c); setShowAddCompetitionForm(true); }}
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
                    </div>
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
                        <h2 className="text-2xl font-bold text-slate-800">Membership</h2>
                        {/* <button
                          onClick={() => setShowAddMemberModal(true)}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          <UserPlus size={18} />
                          Add Team Member
                        </button> */}
                      </div>

                      <div className="mb-6">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-black" size={18} />
                          <input
                            type="text"
                            placeholder="Search Member..."
                            value={teamMembersSearch}
                            onChange={(e) => {
                              setTeamMembersSearch(e.target.value);
                              setTeamMembersPage(1);
                            }}
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-black focus:border-blue-500 outline-none"
                          />
                        </div>
                      </div>

                      <div className="mb-4 flex items-center justify-between text-sm text-slate-500">
                        <span>
                          {teamMembersTotalCount > 0
                            ? `Total memberships: ${teamMembersTotalCount}`
                            : 'No memberships found'}
                        </span>
                        <span>Page {teamMembersPage} of {teamMembersTotalPages}</span>
                      </div>

                      {teamMembersLoading ? (
                        <div className="py-12 text-center text-slate-500">Loading memberships...</div>
                      ) : teamMembersError ? (
                        <div className="py-12 text-center text-red-500">{teamMembersError}</div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredTeamMembers.map((member) => (
                          <div
                            key={member.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => setSelectedTeamMember(member)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setSelectedTeamMember(member);
                              }
                            }}
                            className="bg-white border border-slate-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                          >
                            <div className="p-5">
                              <div className="flex items-start space-x-4">
                             
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

                              <div className="mt-4 grid grid-cols-1 gap-2 text-sm">
                                <div className="rounded-md border border-slate-200 px-3 py-2">
                                  <p className="text-xs text-slate-500">Category</p>
                                  <p className="font-medium text-slate-800">{getSafeDisplayValue(member.category)}</p>
                                </div>
                                <div className="rounded-md border border-slate-200 px-3 py-2">
                                  <p className="text-xs text-slate-500">Plan</p>
                                  <p className="font-medium text-slate-800">{getSafeDisplayValue(member.plan)}</p>
                                </div>
                                <div className="rounded-md border border-slate-200 px-3 py-2 flex items-center justify-between gap-2">
                                  <p className="text-xs text-slate-500">Payment Status</p>
                                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPaymentStatusBadgeClass(member.paymentStatus)}`}>
                                    {getSafeDisplayValue(member.paymentStatus).toUpperCase()}
                                  </span>
                                </div>
                              </div>


                            </div>
                          
                          </div>
                          ))}
                          {teamMembers.length > 0 && filteredTeamMembers.length === 0 && (
                              <div className="col-span-full py-10 text-center text-slate-500">
                                No members matched &quot;{teamMembersSearch}&quot;.
                              </div>
                            )}
                        </div>
                      )}

                      {/* {selectedTeamMember && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                          <div className="w-full max-w-xl rounded-xl bg-white shadow-2xl border border-slate-200">
                            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                              <h3 className="text-lg font-semibold text-slate-800">Membership Details</h3>
                              <button
                                type="button"
                                onClick={() => setSelectedTeamMember(null)}
                                className="p-1.5 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                              >
                                <X size={18} />
                              </button>
                            </div>
                            <div className="p-5 space-y-5">
                              <div className="flex items-start gap-4">
                                
                                <div className="min-w-0">
                                  <h4 className="text-xl font-bold text-slate-800">{selectedTeamMember.name}</h4>
                                  <p className="text-blue-600 font-medium">{selectedTeamMember.role}</p>
                                  <p className="text-sm text-slate-500 mt-1">{selectedTeamMember.email}</p>
                                  <p className="text-sm text-slate-500">{selectedTeamMember.phone}</p>
                                  
                                </div>
                                
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                              
                                <div className="rounded-lg border border-slate-200 p-3">
                                  <p className="text-slate-500">Category</p>
                                  <p className="font-medium text-slate-800">{getSafeDisplayValue(selectedTeamMember.category)}</p>
                                </div>
                                <div className="rounded-lg border border-slate-200 p-3">
                                  <p className="text-slate-500">Plan</p>
                                  <p className="font-medium text-slate-800">{getSafeDisplayValue(selectedTeamMember.plan)}</p>
                                </div>
                                <div className="rounded-lg border border-slate-200 p-3 sm:col-span-2">
                                  <p className="text-slate-500">Payment Status</p>
                                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getPaymentStatusBadgeClass(selectedTeamMember.paymentStatus)}`}>
                                    {getSafeDisplayValue(selectedTeamMember.paymentStatus).toUpperCase()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="px-5 py-4 border-t border-slate-100 flex justify-end">
                              <button
                                type="button"
                                onClick={() => setSelectedTeamMember(null)}
                                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                              >
                                Close
                              </button>
                            </div>
                          </div>
                        </div>
                      )} */}

                      <div className="mt-6 flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setTeamMembersPage((prev) => Math.max(prev - 1, 1))}
                          disabled={teamMembersLoading || teamMembersPage <= 1}
                          className="px-3 py-1.5 text-sm rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <button
                          type="button"
                          onClick={() => setTeamMembersPage((prev) => Math.min(prev + 1, teamMembersTotalPages))}
                          disabled={teamMembersLoading || teamMembersPage >= teamMembersTotalPages}
                          className="px-3 py-1.5 text-sm rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
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
              {activeTab === 'roboclub' && (
                <div className="max-w-2xl mx-auto space-y-6">
                  {/* Add RoboClub form – shown when Add RoboClub is clicked */}
                  {showRoboClubForm && (
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                    <div className="space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                          <div className="text-center flex-1">
                            <h3 className="text-xl font-bold text-slate-900">{editingClubId ? 'Update RoboClub' : 'Register for RoboClub'}</h3>
                            <p className="text-slate-600 text-sm">
                              {editingClubId ? 'Update your club details.' : 'Fill in your club and institute details to register.'}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={closeRoboClubForm}
                            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all"
                            aria-label="Close form"
                          >
                            <X size={20} />
                          </button>
                        </div>

                        {roboClubError && (
                          <p className="text-red-600 text-sm flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
                            <Shield size={14} />
                            {roboClubError}
                          </p>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="sm:col-span-2">
                            <label className="block text-slate-700 text-sm font-medium mb-1">Name</label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                              <input
                                type="text"
                                value={roboClubForm.name}
                                onChange={(e) => updateRoboClubForm('name', e.target.value)}
                                placeholder="Name"
                                required
                                className="w-full border border-slate-300 text-slate-900 pl-10 pr-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-slate-700 text-sm font-medium mb-1">Email</label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                              <input
                                type="email"
                                value={roboClubForm.email}
                                onChange={(e) => updateRoboClubForm('email', e.target.value)}
                                placeholder="Email"
                                required
                                disabled={Boolean(editingClubId)}
                                className="w-full border border-slate-300 text-slate-900 pl-10 pr-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                              />
                            </div>
                            <p className="text-slate-500 text-xs mt-1">
                              {editingClubId ? 'Email cannot be updated from here.' : 'Used for your RoboClub captain account.'}
                            </p>
                          </div>

                          <div>
                            <label className="block text-slate-700 text-sm font-medium mb-1">Club name</label>
                            <div className="relative">
                              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                              <input
                                type="text"
                                value={roboClubForm.clubName}
                                onChange={(e) => updateRoboClubForm('clubName', e.target.value)}
                                placeholder="Club Name"
                                required
                                className="w-full border border-slate-300 text-slate-900 pl-10 pr-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-slate-700 text-sm font-medium mb-1">Institute name</label>
                            <div className="relative">
                              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                              <input
                                type="text"
                                value={roboClubForm.instituteName}
                                onChange={(e) => updateRoboClubForm('instituteName', e.target.value)}
                                placeholder="e.g. DU"
                                required
                                className="w-full border border-slate-300 text-slate-900 pl-10 pr-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-slate-700 text-sm font-medium mb-1">Country</label>
                            <select
                              value={roboClubForm.countryCode}
                              onChange={(e) => updateRoboClubForm('countryCode', e.target.value)}
                              required
                              className="w-full border border-slate-300 text-slate-900 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            >
                              {COUNTRY_OPTIONS.map((c) => (
                                <option key={c.code} value={c.code}>
                                  {c.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-slate-700 text-sm font-medium mb-1">State</label>
                            <select
                              value={roboClubForm.state}
                              onChange={(e) => updateRoboClubForm('state', e.target.value)}
                              required
                              className="w-full border border-slate-300 text-slate-900 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            >
                              <option value="">Select state</option>
                              {roboClubStateOptions.map((state) => (
                                <option key={state.id} value={state.name}>
                                  {state.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-slate-700 text-sm font-medium mb-1">City</label>
                            <select
                              value={roboClubForm.city}
                              onChange={(e) => updateRoboClubForm('city', e.target.value)}
                              disabled={!roboClubForm.state}
                              required
                              className="w-full border border-slate-300 text-slate-900 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-slate-100 disabled:text-slate-400"
                            >
                              <option value="">{roboClubForm.state ? 'Select city' : 'Select state first'}</option>
                              {roboClubCityOptions.map((city) => (
                                <option key={city.id} value={city.name}>
                                  {city.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-slate-700 text-sm font-medium mb-1">Mobile</label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                              <input
                                type="tel"
                                value={roboClubForm.mobile}
                                onChange={(e) => updateRoboClubForm('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                                placeholder="e.g. 9876543210"
                                required
                                maxLength={10}
                                inputMode="numeric"
                                pattern="\d{10}"
                                className="w-full border border-slate-300 text-slate-900 pl-10 pr-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                              />
                            </div>
                          </div>

                        </div>

                        <button
                          onClick={handleSubmitClub}
                          disabled={roboClubLoading}
                          className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {roboClubLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              {editingClubId ? 'Update RoboClub' : 'Register for RoboClub'}
                              <ArrowRight size={18} />
                            </>
                          )}
                        </button>
                      </div>

                  </div>
                  )}

                  {/* My RoboClubs – shown first */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">My RoboClubs</h3>
                        <p className="text-slate-600 text-sm">Your registered clubs linked to this account</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingClubId(null);
                            setRoboClubForm(ROBO_CLUB_FORM_INITIAL);
                            setRoboClubError('');
                            setShowRoboClubForm(true);
                          }}
                          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all text-sm font-semibold flex items-center gap-2"
                        >
                          <Plus size={18} />
                          Add RoboClub
                        </button>
                        <button
                          type="button"
                          onClick={refreshMyClubs}
                          disabled={myClubsLoading}
                          className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
                        >
                          Refresh
                        </button>
                      </div>
                    </div>

                    {myClubsLoading ? (
                      <div className="flex items-center justify-center py-10">
                        <div className="text-center">
                          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
                          <p className="text-slate-600">Loading your clubs...</p>
                        </div>
                      </div>
                    ) : myClubsError ? (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800 font-medium">Error loading clubs</p>
                        <p className="text-red-600 text-sm mt-1">{myClubsError}</p>
                      </div>
                    ) : Array.isArray(myClubs) && myClubs.length > 0 ? (
                      <div className="space-y-3">
                        {myClubs.map((club) => {
                          const isSelected = selectedClubId === club?._id;
                          return (
                            <div
                            key={club?._id ?? `${club?.clubCode ?? 'club'}-${club?.email ?? ''}`}
                            className={`border rounded-xl p-4 transition-all cursor-pointer ${
                              isSelected
                                ? 'border-blue-300 bg-blue-50/40'
                                : 'border-slate-200 hover:bg-slate-50/60'
                            }`}
                            onClick={() => setSelectedClubId((prev) => (prev === club?._id ? '' : (club?._id || '')))}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="text-base font-bold text-slate-900 truncate">{club?.clubName || 'RoboClub'}</h4>
                                  {club?.clubCode && (
                                    <span className="text-xs font-mono px-2 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                                      {club.clubCode}
                                    </span>
                                  )}
                                </div>
                                <p className="text-slate-600 text-sm mt-1">
                                  {club?.instituteName ? club.instituteName : '—'}
                                  {(club?.city || club?.state) ? (
                                    <span className="text-slate-400"> • {club?.city}{club?.city && club?.state ? ', ' : ''}{club?.state}</span>
                                  ) : null}
                                </p>
                              </div>
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                                club?.status === 'ACTIVE' || club?.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : club?.status === 'PENDING' || club?.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : club?.status === 'REJECTED' || club?.status === 'rejected'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-slate-100 text-slate-800'
                              }`}>
                                {club?.status || 'N/A'}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 text-sm">
                              <div className="flex items-center gap-2 text-slate-700">
                                <Mail size={14} className="text-slate-400" />
                                <span className="truncate">{club?.email || '—'}</span>
                              </div>
                              <div className="flex items-center gap-2 text-slate-700">
                                <Phone size={14} className="text-slate-400" />
                                <span className="truncate">{club?.mobile || '—'}</span>
                              </div>
                            </div>

                            {club?.createdAt && (
                              <div className="mt-3 text-xs text-slate-500">
                                Created: {new Date(club.createdAt).toLocaleString()}
                              </div>
                            )}
                            <div className="mt-4 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditClub(club);
                                }}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-all text-xs font-semibold flex items-center gap-1"
                              >
                                <Pencil size={14} />
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteClub(club?._id);
                                }}
                                disabled={deletingClubId === club?._id}
                                className="px-3 py-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 transition-all text-xs font-semibold flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Trash2 size={14} />
                                {deletingClubId === club?._id ? 'Deleting...' : 'Delete'}
                              </button>
                            </div>
                            {isSelected && (
                              <div className="mt-4 border-t border-slate-200 pt-4 space-y-4">
                                <div>
                                  <h5 className="text-sm font-bold text-slate-900 mb-2">Club Details</h5>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                    <p className="text-slate-700"><span className="font-semibold text-slate-900">Owner Name:</span> {club?.name || '—'}</p>
                                   
                                    {/* <p className="text-slate-700"><span className="font-semibold text-slate-900">Partner Code:</span> {club?.partnerCode || '—'}</p> */}
                                    <p className="text-slate-700"><span className="font-semibold text-slate-900">Country:</span> {club?.country || '—'} {club?.countryCode ? `(${club.countryCode})` : ''}</p>
                                    {/* <p className="text-slate-700"><span className="font-semibold text-slate-900">Email Verified:</span> {club?.isEmailVerified ? 'Yes' : 'No'}</p> */}
                                    {/* <p className="text-slate-700"><span className="font-semibold text-slate-900">Deleted:</span> {club?.isDeleted ? 'Yes' : 'No'}</p> */}
                                    {/* <p className="text-slate-700"><span className="font-semibold text-slate-900">Updated:</span> {club?.updatedAt ? new Date(club.updatedAt).toLocaleString() : '—'}</p> */}
                                  </div>
                                </div>
                                <div>
                                  <h5 className="text-sm font-bold text-slate-900 mb-2">Members ({Array.isArray(club?.members) ? club.members.length : 0})</h5>
                                  {Array.isArray(club?.members) && club.members.length > 0 ? (
                                    <div className="space-y-2">
                                      {club.members.map((member) => (
                                        <div key={member?._id || `${member?.club_id || 'club'}-${member?.user_id?._id || 'member'}`} className="rounded-lg border border-slate-200 bg-white p-3">
                                          <div className="flex flex-wrap items-center justify-between gap-2">
                                            <p className="text-sm font-semibold text-slate-900">{member?.user_id?.fullName || 'Member'}</p>
                                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                                              {member?.role || 'N/A'}
                                            </span>
                                          </div>
                                          <p className="text-xs text-slate-600 mt-1">{member?.user_id?.email || '—'}</p>
                                          <p className="text-xs text-slate-600 mt-0.5">{member?.user_id?.mobile || '—'}</p>
                                          <p className="text-xs text-slate-500 mt-1">Status: {member?.status || 'N/A'}</p>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-sm text-slate-500">No members found for this club.</p>
                                  )}
                                </div>
                              </div>
                            )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <Building2 className="mx-auto mb-3 text-slate-300" size={42} />
                        <h4 className="text-base font-bold text-slate-700 mb-1">No clubs found</h4>
                        <p className="text-slate-500 text-sm">Click &quot;Add RoboClub&quot; above to register your first club.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {activeTab === 'membership' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Membership Details</h2>
                    
                    {membershipLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                          <p className="text-slate-600">Loading membership data...</p>
                        </div>
                      </div>
                    ) : membershipError ? (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800 font-medium">Error loading membership</p>
                        <p className="text-red-600 text-sm mt-1">{membershipError}</p>
                      </div>
                    ) : membershipData ? (
                      <div className="space-y-6">
                        {/* Main Membership Card */}
                        <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-50 rounded-xl p-8 border border-blue-200 shadow-lg">
                          <div className="flex items-start justify-between mb-6">
                            <div>
                              <h3 className="text-2xl font-bold text-slate-900 mb-2">{membershipData.planTitle || membershipData.planName || 'Membership'}</h3>
                              <p className="text-slate-600 text-sm">{membershipData.planName && membershipData.planName !== membershipData.planTitle ? membershipData.planName : ''}</p>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-200">
                              <CreditCard className="text-blue-600" size={32} />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-blue-100">
                              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide block mb-2">Membership ID</span>
                              <span className="text-lg font-mono font-bold text-slate-900">{membershipData.publicMembershipId || 'N/A'}</span>
                            </div>
                            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-blue-100">
                              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide block mb-2">Category</span>
                              <span className="text-lg font-semibold text-slate-900 capitalize">{membershipData.category || 'N/A'}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-3">
                            <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-blue-200">
                              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide block mb-1">Status</span>
                              <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                                membershipData.status === 'ACTIVE' || membershipData.status === 'active'
                                  ? 'bg-green-100 text-green-800' 
                                  : membershipData.status === 'EXPIRED' || membershipData.status === 'expired'
                                  ? 'bg-red-100 text-red-800'
                                  : membershipData.status === 'PENDING' || membershipData.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-slate-100 text-slate-800'
                              }`}>
                                {membershipData.status || 'N/A'}
                              </span>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-blue-200">
                              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide block mb-1">Payment Status</span>
                              <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                                membershipData.paymentStatus === 'COMPLETED' || membershipData.paymentStatus === 'completed' || membershipData.paymentStatus === 'PAID' || membershipData.paymentStatus === 'paid'
                                  ? 'bg-green-100 text-green-800' 
                                  : membershipData.paymentStatus === 'FAILED' || membershipData.paymentStatus === 'failed'
                                  ? 'bg-red-100 text-red-800'
                                  : membershipData.paymentStatus === 'PENDING' || membershipData.paymentStatus === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-slate-100 text-slate-800'
                              }`}>
                                {membershipData.paymentStatus || 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>

                    
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <CreditCard className="mx-auto mb-4 text-slate-300" size={48} />
                        <h3 className="text-xl font-bold text-slate-700 mb-2">No Membership Found</h3>
                        <p className="text-slate-500">You don't have an active membership yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminView;

