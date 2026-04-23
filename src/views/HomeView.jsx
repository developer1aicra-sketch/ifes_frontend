import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  ChevronDown,
  Shield,
  Trophy,
  MapPin,
  Calendar,
  ArrowRight,
  Users,
  Globe,
  Building,
  ChevronRight,
  Network,
  ServerCog,
  LayoutDashboard,
  ExternalLink,
  Menu,
  X,
  Gamepad2,
  Radio,
  Eye,
  MessageCircle,
  TrendingUp,
  Image as ImageIcon,
  Handshake,
  FileText,
  DiscIcon as Discord,
  Twitch,
  Youtube,
  Twitter,
  Phone,
  Mail,
  ArrowLeft,
} from "lucide-react";
import LogoTicker from "../components/LogoTicker";
import FeaturedShopSection from "../components/FeaturedShopSection";
import {
  PartnerVideoSection,
  PartnerNewsSection,
  PartnerSupporterSection,
  PartnerCompetitionSection,
} from "../components/partner";
import { NavLink, useParams } from "react-router-dom";
import { useThemeClasses } from "../hooks/useThemeClasses";
import { usePartnerHome } from "../hooks/usePartnerHome";
import { usePartnerEvent } from "../hooks/usePartnerEvent";
import { usePartnerCompetitions } from "../hooks/usePartnerCompetitions";
import { useCompetitionList } from "../hooks/useCompetitionList";
import { useLocationPrefix } from "../hooks/useLocationPrefix";
import HomeGallerySection from "../components/HomeGallerySection";
import { galleryImages } from "../assets/gallery";
import { PARTNER_HOME_STATIC } from "../data/partnerHomeStatic";
import TrophyVideo from "../assets/technoxian zrc_1.mp4";
import { useNavigate } from "react-router-dom";
import homologo1 from "../assets/homelogo/escom.png";
import homologo2 from "../assets/homelogo/escom2.png";

// Countdown Timer Component - Updated for 07-08 August 2026
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    mins: "00",
    secs: "00",
  });
  const [isEventLive, setIsEventLive] = useState(false);

  useEffect(() => {
    // Event start date: 07 August 2026
    const eventStartDate = new Date("August 7, 2026 00:00:00 UTC").getTime();
    // Event end date: 08 August 2026 23:59:59 UTC
    const eventEndDate = new Date("August 8, 2026 23:59:59 UTC").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();

      // If event is currently live
      if (now >= eventStartDate && now <= eventEndDate) {
        setIsEventLive(true);
        setTimeLeft({
          days: "00",
          hours: "00",
          mins: "00",
          secs: "00",
        });
        return;
      }

      // If event has ended
      if (now > eventEndDate) {
        setIsEventLive(false);
        setTimeLeft({
          days: "00",
          hours: "00",
          mins: "00",
          secs: "00",
        });
        return;
      }

      // Event hasn't started yet - countdown to start
      setIsEventLive(false);
      const diff = eventStartDate - now;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);

      setTimeLeft({
        days: days < 10 ? `0${days}` : `${days}`,
        hours: hours < 10 ? `0${hours}` : `${hours}`,
        mins: mins < 10 ? `0${mins}` : `${mins}`,
        secs: secs < 10 ? `0${secs}` : `${secs}`,
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  if (isEventLive) {
    return (
      <div className="text-center mb-5">
        <div className="text-2xl font-bold text-green-400 font-mono animate-pulse">
          🔴 EVENT LIVE NOW!
        </div>
        <div className="text-[10px] text-slate-400 mt-2">07-08 August 2026</div>
      </div>
    );
  }

  return (
    <div className="flex justify-between text-center mb-5">
      {[
        { label: "DAYS", value: timeLeft.days },
        { label: "HRS", value: timeLeft.hours },
        { label: "MIN", value: timeLeft.mins },
        { label: "SEC", value: timeLeft.secs },
      ].map((item, i) => (
        <div key={i} className="flex-1">
          <div className="text-2xl font-bold text-cyan-400 font-mono">
            {item.value}
          </div>
          <div className="text-[9px] text-slate-500 tracking-wide">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
};

/** Format raw stat (number or string) for display: 121 → 121, 3200 → 3.2k+, 10200000 → 10.2M+ */
function formatStatValue(raw) {
  if (raw == null || raw === "") return null;
  const s = String(raw).trim();
  if (!s) return null;
  // Already formatted (contains k, M, +, etc.)
  if (/[kKmM+]/.test(s)) return s;
  const n = parseFloat(s.replace(/[^0-9.]/g, "")) || 0;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1).replace(/\.0$/, "")}M+`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1).replace(/\.0$/, "")}k+`;
  return `${Math.round(n)}+`;
}

const HomeView = ({
  setView,
  siteConfig,
  newsItems = [],
  newsLoading,
  newsError,
  locationCode: locationCodeProp,
}) => {
  const theme = useThemeClasses();
  const { locationPrefix, locationCode: locationCodeFromPath } =
    useLocationPrefix();
  const { locationCode: locationCodeFromParams } = useParams();
  // Partner content: prefer prop (LocationView), then URL param, then path-derived code
  const locationCode =
    locationCodeProp ?? locationCodeFromParams ?? locationCodeFromPath ?? null;
  void motion;

  const [latestNewsIndex, setLatestNewsIndex] = useState(0);
  const [mostReadIndex, setMostReadIndex] = useState(0);
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [escomNews, setEscomNews] = useState([]);
  const [escomNewsLoading, setEscomNewsLoading] = useState(false);
  const [escomNewsError, setEscomNewsError] = useState(null);
  const [breakingNews, setBreakingNews] = useState([]);
  const [breakingNewsLoading, setBreakingNewsLoading] = useState(false);
  const [breakingNewsError, setBreakingNewsError] = useState(null);

  // State for single news detail view
  const [selectedNews, setSelectedNews] = useState(null);
  const [newsDetailLoading, setNewsDetailLoading] = useState(false);
  const [showNewsDetail, setShowNewsDetail] = useState(false);
  const navigate = useNavigate();

  /** ✅ FIX: parent-controlled open state (Zoom-style) */
  const [openRows, setOpenRows] = useState({});

  // Partner home data: fetch from https://worso-backend-amber.vercel.app/api/partners/home/{countryCode}
  const defaultPartnerCode = import.meta.env.VITE_DEFAULT_PARTNER_CODE || null;
  const {
    data: partnerHomeData,
    loading: partnerHomeLoading,
    error: partnerHomeError,
  } = usePartnerHome(locationCode, {
    defaultCode: defaultPartnerCode,
  });

  // Event API: fetch single event from /api/event/get?website=worso&partnerCode=XX (first item only)
  const effectivePartnerCode = locationCode || defaultPartnerCode || null;
  const { data: partnerEvent } = usePartnerEvent(effectivePartnerCode);
  const {
    data: partnerCompetitions,
    loading: partnerCompetitionsLoading,
    error: partnerCompetitionsError,
  } = usePartnerCompetitions(effectivePartnerCode);

  const {
    competitions: homeCompetitionList,
    loading: homeCompetitionsLoading,
    error: homeCompetitionsError,
  } = useCompetitionList();

  // --- ESCOM News Fetching ---
  useEffect(() => {
    const fetchEscomNews = async () => {
      setEscomNewsLoading(true);
      setEscomNewsError(null);
      try {
        const response = await axios.get(
          "https://app.aicra.org/api/escomapi/escom-news-feed.php",
        );
        if (
          response.data &&
          response.data.status === true &&
          response.data.posts
        ) {
          // Transform ESCOM posts to match your news item structure
          const formattedNews = response.data.posts.map((post) => ({
            id: post.id,
            title: post.title,
            body: post.content?.replace(/<[^>]*>/g, "").substring(0, 300) || "",
            desc: post.content?.replace(/<[^>]*>/g, "").substring(0, 150) || "",
            category: post.categories?.[0] || "ESCOM",
            date: post.date,
            featuredImage: post.featured_image,
            link: post.link,
            slug: post.slug,
            isEscom: true,
          }));
          setEscomNews(formattedNews);
        } else {
          throw new Error("Invalid API response structure");
        }
      } catch (err) {
        console.error("Failed to fetch ESCOM news:", err);
        setEscomNewsError(err.message || "Failed to load news");
      } finally {
        setEscomNewsLoading(false);
      }
    };

    fetchEscomNews();
  }, []);

  // --- Breaking News Fetching (FutureTech media) ---
  useEffect(() => {
    const fetchBreakingNews = async () => {
      setBreakingNewsLoading(true);
      setBreakingNewsError(null);
      try {
        const response = await axios.get(
          "https://app.aicra.org/api/escomapi/breaking-escom-news-feed.php",
        );
        if (
          response.data &&
          response.data.status === true &&
          response.data.posts
        ) {
          // Transform breaking news posts
          const formattedBreakingNews = response.data.posts
            .slice(0, 5)
            .map((post) => ({
              id: post.id,
              title: post.title,
              date: post.date,
              link: post.link,
              slug: post.slug,
              featuredImage: post.featured_image,
              content:
                post.content?.replace(/<[^>]*>/g, "").substring(0, 200) || "",
            }));
          setBreakingNews(formattedBreakingNews);
        } else {
          throw new Error("Invalid API response structure");
        }
      } catch (err) {
        console.error("Failed to fetch breaking news:", err);
        setBreakingNewsError(err.message || "Failed to load breaking news");
      } finally {
        setBreakingNewsLoading(false);
      }
    };

    fetchBreakingNews();
  }, []);

  // Function to handle news click - fetch single post and show detail view
  const handleNewsClick = async (slug, title) => {
    if (!slug) {
      console.error("No slug provided for news article");
      return;
    }

    setNewsDetailLoading(true);
    setShowNewsDetail(true);

    try {
      const response = await axios.get(
        `https://app.aicra.org/api/escomapi/escom-news-feed-single.php?slug=${slug}`,
      );
      if (response.data && response.data.status === true) {
        setSelectedNews({
          ...response.data.post,
          title: title || response.data.post.title,
          slug: slug,
        });
      } else {
        throw new Error(response.data.message || "Failed to fetch news detail");
      }
    } catch (err) {
      console.error("Failed to fetch news detail:", err);
      setSelectedNews(null);
    } finally {
      setNewsDetailLoading(false);
    }
  };

  // Function to go back to main view
  const handleBackToNews = () => {
    setShowNewsDetail(false);
    setSelectedNews(null);
  };

  // Function to strip HTML tags from content
  const stripHtmlTags = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "");
  };

  const competitionsForCarousel = useMemo(() => {
    if (homeCompetitionList.length > 0) return homeCompetitionList;
    return (partnerCompetitions || []).filter((c) => c && c.isActive !== false);
  }, [homeCompetitionList, partnerCompetitions]);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    )
      return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setPrefersReducedMotion(Boolean(media.matches));
    onChange();
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    }
    // Safari < 14
    media.addListener(onChange);
    return () => media.removeListener(onChange);
  }, []);

  // Use partner home news if available, otherwise use props newsItems, then fallback to ESCOM news
  const newsData = useMemo(() => {
    // Priority 1: Partner-specific news from API
    if (partnerHomeData?.news && partnerHomeData.news.length > 0) {
      return partnerHomeData.news
        .filter((item) => item.isActive)
        .map((item) => ({
          id: item._id,
          title: item.title,
          body: item.description,
          desc: item.description,
          category: item.type || "GENERAL",
          date: item.Date
            ? new Date(item.Date).toLocaleDateString()
            : new Date().toLocaleDateString(),
          featuredImage: item.image,
        }));
    }
    // Priority 2: ESCOM News (for global view or fallback)
    if (escomNews.length > 0 && !locationCode) {
      return escomNews;
    }
    // Priority 3: News from props (legacy or fallback)
    return newsItems;
  }, [partnerHomeData?.news, escomNews, newsItems, locationCode]);

  const preparedNews = useMemo(() => newsData.filter(Boolean), [newsData]);
  const headline = preparedNews[0];
  const latestPool = preparedNews.slice(1);
  const mostReadPool = [...preparedNews].reverse().slice(1);

  // Featured YouTube videos from home.youtubeVideo or top-level youtubeVideo (array of URL strings)
  const featuredVideos = useMemo(() => {
    const arr =
      partnerHomeData?.home?.youtubeVideo ??
      partnerHomeData?.youtubeVideo ??
      [];
    if (!Array.isArray(arr)) return [];
    return arr.filter((u) => typeof u === "string" && u.trim());
  }, [partnerHomeData?.home?.youtubeVideo, partnerHomeData?.youtubeVideo]);

  // Helper function to build paths with location prefix
  const buildPath = (path) => {
    if (locationPrefix && path) {
      return `${locationPrefix}${path.startsWith("/") ? path : `/${path}`}`;
    }
    return path || "#";
  };

  useEffect(() => {
    if (latestPool.length < 2) return;
    const i = setInterval(() => {
      setLatestNewsIndex((p) => (p + 1) % latestPool.length);
    }, 4000);
    return () => clearInterval(i);
  }, [latestPool.length]);

  useEffect(() => {
    if (mostReadPool.length < 2) return;
    const i = setInterval(() => {
      setMostReadIndex((p) => (p + 1) % mostReadPool.length);
    }, 4500);
    return () => clearInterval(i);
  }, [mostReadPool.length]);

  // Show loading state when fetching partner home (location route or default code)
  if (partnerHomeLoading) {
    return (
      <div className="min-h-screen bg-[#03050b] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading cyber arena...</p>
        </div>
      </div>
    );
  }

  // Show error state when partner home fetch failed
  if (partnerHomeError) {
    return (
      <div className="min-h-screen bg-[#03050b] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <Shield size={48} className="mx-auto" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            Error Loading Content
          </h2>
          <p className="text-slate-400 mb-4">{partnerHomeError}</p>
          <button
            onClick={() => window.location.reload()}
            className="cyber-btn px-6 py-2 rounded-full font-bold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Determine if we should show the news section (global home or when no partner home data)
  const shouldShowNewsSection =
    !(locationCode || partnerHomeData) && preparedNews.length > 0;

  // If showing news detail view
  if (showNewsDetail) {
    return (
      <div className="min-h-screen bg-[#03050b] text-white relative">
        {/* Ambient background effects */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,255,255,0.12)_0%,transparent_45%)]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,255,0.08)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-5 py-10">
          {/* Back Button */}
          <button
            onClick={handleBackToNews}
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-6 group"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span>Back to News</span>
          </button>

          {newsDetailLoading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
              <p className="text-slate-400">Loading article...</p>
            </div>
          ) : selectedNews ? (
            <div className="glow-card rounded-2xl p-6 md:p-8">
              {/* Featured Image */}
              {selectedNews.featured_image && (
                <div className="rounded-xl overflow-hidden mb-6">
                  <img
                    src={selectedNews.featured_image}
                    alt={selectedNews.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}

              {/* Date */}
              <div className="text-cyan-400 text-sm mb-3">
                {selectedNews.date}
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6">
                {selectedNews.title}
              </h1>

              {/* Content */}
              <div className="prose prose-invert max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      selectedNews.content ||
                      selectedNews.body ||
                      "<p>Content not available</p>",
                  }}
                  className="text-slate-300 leading-relaxed space-y-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-cyan-400 [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-cyan-300 [&_h3]:mt-5 [&_h3]:mb-2 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_li]:mb-1 [&_a]:text-cyan-400 [&_a]:hover:text-cyan-300 [&_a]:underline [&_strong]:text-white [&_blockquote]:border-l-4 [&_blockquote]:border-cyan-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-400 [&_blockquote]:my-4"
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-red-400">
                Failed to load article. Please try again.
              </p>
              <button
                onClick={handleBackToNews}
                className="mt-4 text-cyan-400 hover:text-cyan-300 underline"
              >
                Go Back
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#03050b] text-white relative">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,255,255,0.12)_0%,transparent_45%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,255,0.08)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 40 44\' width=\'40\' height=\'44\'%3E%3Cpath fill=\'none\' stroke=\'%2300ffff\' stroke-width=\'0.4\' d=\'M20 2 L38 12 L38 32 L20 42 L2 32 L2 12 Z\'/%3E%3C/svg%3E')] bg-repeat bg-[length:32px] opacity-10"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* LEFT CONTENT */}
            <div className="space-y-6">
              {/* MAIN HEADING */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] uppercase tracking-tight">
                <span className="bg-gradient-to-r from-cyan-400 via-white to-purple-400 bg-clip-text text-transparent">
                  SHAPING THE FUTURE OF
                </span>

                <br />

                <span
                  className="bg-gradient-to-r from-cyan-400 via-blue-300 to-pink-400 bg-clip-text text-transparent 
          drop-shadow-[0_0_10px_rgba(34,211,238,0.6)] 
          drop-shadow-[0_0_25px_rgba(168,85,247,0.5)]"
                >
                  GLOBAL ESPORTS
                </span>
              </h1>

              {/* SUB HEADING */}
              <p className="text-[22px] md:text-[25px] italic text-slate-300 leading-relaxed max-w-3xl">
                Uniting Nations. Empowering Athletes. Elevating Esports.
              </p>

              {/* DESCRIPTION */}
              <p className="text-[13px] md:text-[14.5px] text-slate-400 leading-relaxed max-w-xl">
                The{" "}
                <span className="text-white font-semibold">
                  International Federation of Esports (IFeS)
                </span>{" "}
                is a global governing platform committed to building a
                <span className="text-white font-semibold">
                  {" "}
                  structured, inclusive, and future-ready esports ecosystem
                </span>
                .
              </p>

              <p className="text-base md:text-lg text-slate-400 leading-relaxed max-w-xl">
                From international tournaments to policy development, IFeS is
                transforming esports into a
                <span className="text-white font-semibold">
                  {" "}
                  recognized, respected, and career-driven global sport
                </span>
                .
              </p>

              {/* CTA */}
              <div className="pt-4">
                <a
                  href="https://www.escom.ifes.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="bg-gradient-to-r from-purple-600 to-purple-500 px-7 py-3 text-base font-semibold text-white rounded-lg hover:brightness-110 transition shadow-lg shadow-purple-500/20">
                    Join the Movement
                  </button>
                </a>
              </div>
            </div>

            {/* RIGHT SIDE CARD */}
            <div className="max-w-md mx-auto w-full">
              <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-cyan-500/30 via-purple-500/20 to-transparent">
                <div className="relative rounded-2xl p-8 bg-slate-900/80 backdrop-blur-md border border-white/5 overflow-hidden">
                  {/* Glow */}
                  <div className="absolute -top-10 -right-10 w-36 h-36 bg-cyan-500/20 blur-3xl"></div>

                  <div className="flex justify-between items-center mb-5">
                    <span className="text-xs tracking-wider text-cyan-400 font-semibold uppercase">
                      NEXT EVENT
                    </span>
                    <span className="text-xs text-slate-500">
                      07–08 August 2026
                    </span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold text-white">
                    ESCOM <span className="text-cyan-400">2.0</span>
                  </h3>

                  <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent my-5"></div>

                  <CountdownTimer />

                  <div className="flex justify-between items-center bg-black/40 border border-cyan-500/20 rounded-lg px-4 py-3 mt-5">
                    <span className="text-slate-400 text-[13px] whitespace-nowrap overflow-hidden text-ellipsis">
                      Sponsorship & Expo Booking Window Open
                    </span>
                    <span className="text-cyan-400 font-semibold text-[14px]">
                      $2.5M
                    </span>
                  </div>

                  {/* <button className="w-full mt-6 py-3 rounded-lg text-base font-semibold text-white bg-gradient-to-r from-cyan-600 to-purple-600 hover:brightness-110 transition shadow-lg shadow-cyan-500/20">
              REGISTER ESCOM
            </button> */}
                  <button
                    onClick={() =>
                      (window.location.href =
                        "https://www.escom.ifes.in/delegate/")
                    }
                    className="w-full mt-6 py-3 rounded-lg text-base font-semibold text-white bg-gradient-to-r from-cyan-600 to-purple-600 hover:brightness-110 transition shadow-lg shadow-cyan-500/20"
                  >
                    SECURE YOUR PASS
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 🔥 Background Glow Effect */}
        <div
          className="absolute inset-0 pointer-events-none 
    bg-[radial-gradient(circle_at_20%_30%,rgba(34,211,238,0.08),transparent_40%),
         radial-gradient(circle_at_80%_40%,rgba(168,85,247,0.08),transparent_40%)]"
        />
      </section>

      <section className="py-10 px-5 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
            {/* CARD 1 */}
            <div className="glow-card rounded-2xl p-6 min-h-[180px] flex flex-col gap-2 hover:scale-[1.02] transition-transform">
              <div className="border-b border-white/10 pb-1">
                <span className="font-semibold text-cyan-400 text-sm">
                  🎮 COMPETITION
                </span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                World-class tournaments and global championships
              </p>
            </div>

            {/* CARD 2 */}
            <div className="glow-card rounded-2xl p-6 min-h-[180px] flex flex-col gap-2 hover:scale-[1.02] transition-transform">
              <div className="border-b border-white/10 pb-1">
                <span className="font-semibold text-cyan-400 text-sm">
                  ⚖️ GOVERNANCE
                </span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                Standardization, integrity, and fair play frameworks
              </p>
            </div>

            {/* CARD 3 */}
            <div className="glow-card rounded-2xl p-6 min-h-[180px] flex flex-col gap-2 hover:scale-[1.02] transition-transform">
              <div className="border-b border-white/10 pb-1">
                <span className="font-semibold text-cyan-400 text-sm">
                  🎓 DEVELOPMENT
                </span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                Talent, education, and career pathways
              </p>
            </div>

            {/* CARD 4 */}
            <div className="glow-card rounded-2xl p-6 min-h-[180px] flex flex-col gap-2 hover:scale-[1.02] transition-transform">
              <div className="border-b border-white/10 pb-1">
                <span className="font-semibold text-cyan-400 text-sm">
                  🌐 COLLABORATION
                </span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                Global partnerships across industry and governments
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Match Hub */}
      <section className="py-10 relative">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex justify-between items-center mb-8 flex-wrap gap-3">
            <div>
              <svg
                className="w-5 h-5 text-red-500 inline"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.879 16.121A3 3 0 1012.12 13.88 3 3 0 009.88 16.12z"
                />
              </svg>
              <h2 className="text-2xl md:text-3xl font-extrabold inline-block ml-2 tracking-tight">
                IFES <span className="text-cyan-400 ml-1">EVENTS</span>
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Ongoing Robotics Clashes · Global Scoreboard
              </p>
            </div>
            <div className="bg-black/50 border border-cyan-500/40 rounded-full px-3 py-1 text-[10px] font-mono">
              <span className="w-2 h-2 bg-red-500 rounded-full inline-block animate-pulse mr-1"></span>
              3 ACTIVE ARENAS
            </div>
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glow-card rounded-2xl p-5 flex flex-col md:flex-row gap-5 items-center">
              <div className="w-full md:w-2/5 bg-gradient-to-br from-gray-900 to-black rounded-xl p-3 text-center border border-cyan-400/50 overflow-hidden">
                <img
                  src={homologo2}
                  alt="esports"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="inline-block bg-red-600/40 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wide">
                  <Clock size={10} className="inline mr-1" />
                  STEAMING ON 07-08 AUG - 2nd EDITION
                </div>
                <p className="text-xs text-slate-300 mt-2">
                  The eSports Community and Industry Summit (ESCOM) is a premier
                  event that unites industry leaders, gamers, and enthusiasts to
                  explore the latest trends, innovations, and opportunities in
                  eSports.
                </p>
                <button className="mt-3 bg-cyan-800/40 border border-cyan-400 px-5 py-1.5 rounded-full text-[11px] font-semibold hover:bg-cyan-600/60 transition">
                  JOIN SPECTATE <Radio size={12} className="inline ml-1" />
                </button>
              </div>
            </div>
            <div className="glow-card rounded-2xl p-5">
              <div className="flex justify-between border-b border-white/10 pb-2 text-sm">
                <span className="font-semibold text-cyan-400">
                  🏅 WORLD RANKING
                </span>
                <TrendingUp size={14} className="text-cyan-300" />
              </div>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <span className="text-yellow-400 font-bold">#1</span>
                    <span>🇰🇷 DRACO ROBOTICS</span>
                  </div>
                  <span className="text-cyan-400 font-mono text-xs">
                    3120 PTS
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <span className="text-gray-300 font-bold">#2</span>
                    <span>🇺🇸 IRON LEGION</span>
                  </div>
                  <span className="text-cyan-400 font-mono text-xs">
                    2987 PTS
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <span className="text-amber-600 font-bold">#3</span>
                    <span>🇯🇵 KAMIKAZE UNIT</span>
                  </div>
                  <span className="text-cyan-400 font-mono text-xs">
                    2890 PTS
                  </span>
                </div>
                <div className="pt-2 text-center">
                  <button
                    onClick={() => setView("teams")}
                    className="text-[10px] text-cyan-500 underline"
                  >
                    FULL LEADERBOARD →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="py-12 border-y border-cyan-500/20 bg-black/40 my-8">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {[
              {
                key: "challenges",
                label: "Countries",
                fallback: "50+",
                suffix: "",
              },
              {
                key: "teams",
                label: "Partnerships",
                fallback: "140+",
                suffix: "",
              },
              {
                key: "club",
                label: "Active Clubs",
                fallback: "3800+",
                suffix: "",
              },
              {
                key: "member",
                label: "Community Reach",
                fallback: "1200,000+ ",
                suffix: "M",
                divider: 1000000,
              },
              {
                key: "viewership",
                label: "Global viewership",
                fallback: "200,000,000+",
                suffix: "M",
                divider: 1000000,
              },
            ].map((stat) => {
              const raw = partnerHomeData?.[stat.key];
              let displayValue = stat.fallback;
              if (raw) {
                if (stat.suffix === "M") {
                  const num = parseFloat(raw);
                  displayValue = !isNaN(num)
                    ? (num / stat.divider).toFixed(1) + stat.suffix
                    : raw;
                } else {
                  displayValue = raw.toString();
                }
              }
              return (
                <div key={stat.key} className="space-y-1">
                  <div className="text-3xl md:text-4xl font-extrabold text-cyan-400 font-mono tracking-tight">
                    {displayValue}
                  </div>
                  <p className="text-[10px] md:text-[11px] uppercase tracking-wide text-slate-400">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section> */}

      {/*  updated code */}
      <section className="py-12 border-y border-cyan-500/20 bg-black/40 my-8">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {[
              { key: "challenges", label: "Countries", fallback: "50+" },
              { key: "teams", label: "Partnerships", fallback: "140+" },
              { key: "club", label: "Active Clubs", fallback: "3.8K+" },
              { key: "member", label: "Community Reach", fallback: "1.2M+" },
              {
                key: "viewership",
                label: "Global viewership",
                fallback: "200M+",
              },
            ].map((stat) => {
              const raw = partnerHomeData?.[stat.key];

              let displayValue = stat.fallback;

              if (raw) {
                const num = Number(raw.toString().replace(/,/g, ""));

                if (!isNaN(num)) {
                  if (num >= 1_000_000) {
                    displayValue =
                      (num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 1) +
                      "M+";
                  } else if (num >= 1_000) {
                    displayValue =
                      (num / 1_000).toFixed(num % 1_000 === 0 ? 0 : 1) + "K+";
                  } else {
                    displayValue = num + "+";
                  }
                }
              }

              return (
                <div key={stat.key} className="space-y-1">
                  <div className="text-3xl md:text-4xl font-extrabold text-cyan-400 font-mono tracking-tight">
                    {displayValue}
                  </div>

                  <p className="text-[10px] md:text-[11px] uppercase tracking-wide text-slate-400">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Federation Partners Marquee */}
      <div className="overflow-hidden py-4 border-b border-cyan-500/30 bg-black/30">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex gap-10 text-xs md:text-sm font-semibold uppercase px-6 tracking-wide text-slate-300 min-w-max"
            >
              <span className="text-cyan-300">IFeS ESPORTS WORLD CUP</span>
              <span className="opacity-80">ESCOM 2.0</span>
              <span className="text-fuchsia-300">CATEGORY GAMES</span>
              <span className="opacity-80">GOVT-INDUSTRY ROUNDTABLES</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tournament Bracket & News */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* LEFT SECTION */}
            <div className="glow-card rounded-2xl p-5 lg:col-span-2">
              <div className="flex justify-between items-center">
                <h4 className="text-xl md:text-2xl font-extrabold tracking-tight">
                  <svg
                    className="w-5 h-5 inline mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  BUILDING THE COMPLETE ESPORTS ECOSYSTEM
                </h4>

                <span className="text-[9px] md:text-[10px] bg-cyan-900/60 px-2 py-1 rounded font-medium tracking-wide">
                  QUARTERFINALS
                </span>
              </div>
              {/* Subtitle */}
              <p className="text-[11px] md:text-sm text-cyan-300 mt-2">
                IFeS connects every stakeholder shaping the future of esports
              </p>
              {/* Boxes */}
              {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-xs md:text-sm text-center">
                <div className="border border-cyan-500/30 px-4 py-3 rounded-2xl bg-black/50 backdrop-blur-md hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-200">
                  🎮 Game Publishers & Developers
                </div>

                <div className="border border-cyan-500/30 px-4 py-3 rounded-2xl bg-black/50 backdrop-blur-md hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-200">
                  🏆 Tournament Organizers
                </div>

                <div className="border border-cyan-500/30 px-4 py-3 rounded-2xl bg-black/50 backdrop-blur-md hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-200">
                  🎥 Content Creators & Influencers
                </div>

                <div className="border border-cyan-500/30 px-4 py-3 rounded-2xl bg-black/50 backdrop-blur-md hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-200">
                  💼 Brands & Sponsors
                </div>

                <div className="border border-cyan-500/30 px-4 py-3 rounded-2xl bg-black/50 backdrop-blur-md hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-200">
                  🎓 Universities & Training Institutes
                </div>

                <div className="border border-cyan-500/30 px-4 py-3 rounded-2xl bg-black/50 backdrop-blur-md hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-200">
                  🌍 National Federations & Governments
                </div>
              </div> */}

              {/* updated latest code */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-sm md:text-base">
                {[
                  { icon: "🎮", text: "Game Publishers & Developers" },
                  { icon: "🏆", text: "Tournament Organizers" },
                  { icon: "🎥", text: "Content Creators & Influencers" },
                  { icon: "💼", text: "Brands & Sponsors" },
                  { icon: "🎓", text: "Universities & Training Institutes" },
                  { icon: "🌍", text: "National Federations & Governments" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="h-[90px] flex items-center
      border border-cyan-500/30 px-4 rounded-2xl 
      bg-black/50 backdrop-blur-md 
      hover:bg-cyan-500/10 hover:border-cyan-400 
      transition-all duration-200"
                  >
                    <div className="flex items-center gap-2 text-left w-full">
                      <span className="text-base">{item.icon}</span>
                      <span className="leading-snug text-white/90">
                        {item.text}
                      </span>
                    </div>
                  </div>
                ))}

                {/* SIRF YEH MOVE KIYA HAI */}
                <p className="col-span-2 flex items-center text-sm md:text-base text-slate-300 leading-relaxed text-left">
                  Join International Federation of Esports—connect, collaborate,
                  and shape the global esports ecosystem. Inquire or partner
                  today.
                </p>
              </div>
            </div>

            {/* RIGHT SECTION - FutureTech media with API */}
            <div className="glow-card rounded-2xl p-5">
              <h3 className="text-sm md:text-base font-semibold text-cyan-400 flex gap-2 items-center">
                <FileText size={14} /> Breaking News
              </h3>

              <p className="text-[11px] md:text-sm text-cyan-300 mt-2">
                Latest breaking news from the esports world:
              </p>

              <div className="mt-3 space-y-3 max-h-64 overflow-y-auto pr-1 custom-scroll">
                {breakingNewsLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400 mx-auto"></div>
                    <p className="text-xs text-slate-400 mt-2">
                      Loading news...
                    </p>
                  </div>
                ) : breakingNewsError ? (
                  <div className="text-center py-4">
                    <p className="text-xs text-red-400">Failed to load news</p>
                  </div>
                ) : breakingNews.length > 0 ? (
                  breakingNews.map((news, index) => (
                    <div
                      key={news.id}
                      onClick={() => handleNewsClick(news.slug, news.title)}
                      className={`${index !== breakingNews.length - 1 ? "border-b border-white/10 pb-2" : ""} cursor-pointer hover:bg-white/5 transition-colors p-2 rounded-lg`}
                    >
                      <p className="text-[10px] text-cyan-300">{news.date}</p>
                      <p className="text-xs md:text-sm font-medium text-white hover:text-cyan-300 transition-colors">
                        {news.title}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-xs text-slate-400">No news available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <HomeGallerySection
        images={galleryImages}
        title="GLOBAL ESPORTS IN ACTION"
        carouselId="home-gallery-carousel"
      />

      {/* Federation Network Section (only for global home) */}
      {!siteConfig.is_partner && (
        <section className="py-16 max-w-7xl mx-auto px-5">
          <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-2xl p-6 md:p-10 shadow-xl border border-white/5 flex flex-col md:flex-row items-center gap-10 transition-all duration-500 hover:border-cyan-400/20 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.06),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(168,85,247,0.06),transparent_40%)]" />
            <div className="flex-1 relative z-10">
              <span className="text-cyan-400/70 font-medium tracking-[0.3em] text-[10px] uppercase block mb-3">
                Global Reach
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-white leading-snug mb-4">
                A{" "}
                <span className="relative inline-block">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">
                    Federated
                  </span>
                  <span className="absolute left-0 bottom-0 w-full h-[4px] bg-gradient-to-r from-cyan-400/40 to-purple-500/40 blur-sm"></span>
                </span>{" "}
                Network
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-md">
                The IFeS federated network unites national bodies, partners, and
                communities worldwide to standardize, collaborate, and grow
                esports sustainably together.
              </p>
              <a href="http://localhost:5173/partner-with-us">
                <button className="group relative px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_18px_rgba(34,211,238,0.35)] active:scale-95">
                  <span className="relative z-10 flex items-center gap-2">
                    Explore Partner Directory{" "}
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </span>
                </button>
              </a>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5 w-full relative z-10">
              <div className="group bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-white/5 transition-all duration-500 hover:bg-slate-800/60 hover:-translate-y-1">
                <div className="mb-3 inline-block p-2.5 bg-cyan-500/10 rounded-xl group-hover:bg-cyan-500/20 transition">
                  <Globe
                    className="text-cyan-400 transition-transform group-hover:rotate-6"
                    size={26}
                  />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                  25+
                </div>
                <div className="text-[10px] font-medium text-cyan-400/70 uppercase mt-1 tracking-wider">
                  National Partners
                </div>
              </div>
              <div className="group bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-white/5 transition-all duration-500 hover:bg-slate-800/60 hover:-translate-y-1">
                <div className="mb-3 inline-block p-2.5 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 transition">
                  <Building
                    className="text-purple-400 transition-transform group-hover:-rotate-6"
                    size={26}
                  />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                  82+
                </div>
                <div className="text-[10px] font-medium text-purple-400/70 uppercase mt-1 tracking-wider">
                  Cities & Events
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Core Platform Cards */}
      {/* <section className="py-16 mt-10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="group relative p-[1px] rounded-xl bg-gradient-to-r from-cyan-500/40 via-blue-500/30 to-transparent">
              <div className="relative p-6 md:p-7 min-h-[220px] bg-slate-900/80 backdrop-blur-md rounded-xl border border-white/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/10 overflow-hidden flex flex-col justify-between">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500 rounded-xl" />
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500 opacity-60" />
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-cyan-400 mb-4 px-2.5 py-1 bg-cyan-500/10 rounded border border-cyan-500/20 group-hover:border-cyan-400/40 transition">
                    <Network
                      size={14}
                      className="group-hover:rotate-6 transition duration-300"
                    />
                    Federated Control
                  </div>
                  <h3 className="font-semibold text-base text-white mb-3 group-hover:text-cyan-300 transition">
                    Root Governance
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed group-hover:text-slate-300 transition">
                    IFeS Global sets the laws of the sport and synchronizes
                    updates to every partner subdomain in real time—no
                    fragmented rulebooks.
                  </p>
                </div>
              </div>
            </div>
            <div className="group relative p-[1px] rounded-xl bg-gradient-to-r from-purple-500/40 via-pink-500/30 to-transparent">
              <div className="relative p-6 md:p-7 min-h-[220px] bg-slate-900/80 backdrop-blur-md rounded-xl border border-white/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/10 overflow-hidden flex flex-col justify-between">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500 rounded-xl" />
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-400 to-pink-500 opacity-60" />
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-purple-400 mb-4 px-2.5 py-1 bg-purple-500/10 rounded border border-purple-500/20 group-hover:border-purple-400/40 transition">
                    <ServerCog
                      size={14}
                      className="group-hover:rotate-6 transition duration-300"
                    />
                    Micro-Website Shell
                  </div>
                  <h3 className="font-semibold text-base text-white mb-3 group-hover:text-purple-300 transition">
                    Multi-tenant React
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed group-hover:text-slate-300 transition">
                    One codebase; many subdomains. Middleware detects
                    `*.IFeS.org`, injects logos, language packs, and partner
                    content JSON.
                  </p>
                </div>
              </div>
            </div>
            <div className="group relative p-[1px] rounded-xl bg-gradient-to-r from-pink-500/40 via-rose-500/30 to-transparent">
              <div className="relative p-6 md:p-7 min-h-[220px] bg-slate-900/80 backdrop-blur-md rounded-xl border border-white/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-500/10 overflow-hidden flex flex-col justify-between">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500 rounded-xl" />
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-pink-400 to-rose-500 opacity-60" />
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-pink-400 mb-4 px-2.5 py-1 bg-pink-500/10 rounded border border-pink-500/20 group-hover:border-pink-400/40 transition">
                    <LayoutDashboard
                      size={14}
                      className="group-hover:rotate-6 transition duration-300"
                    />
                    Two-tier CMS
                  </div>
                  <h3 className="font-semibold text-base text-white mb-3 group-hover:text-pink-300 transition">
                    HQ vs Partner Roles
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed group-hover:text-slate-300 transition">
                    Super Admins create partners, assign subdomains, and push
                    global rules. Partner Admins manage local content only.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* updated code  */}
      <section className="py-16 mt-10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-5">
          {/* HEADING */}
          <h2 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-10">
            Testimonials
          </h2>

       <div className="grid md:grid-cols-3 gap-6">
  {/* CARD 1 - Vikash Goel */}
  <div className="group relative p-[1px] rounded-xl bg-gradient-to-r from-cyan-500/40 via-blue-500/30 to-transparent">
    <div className="relative p-8 min-h-[260px] bg-slate-900/80 backdrop-blur-md rounded-xl border border-white/5 flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/10">
      {/* IMAGE - pravatar placeholder for Vikash */}
      <img
        src="https://i.pravatar.cc/80?img=8"
        alt="Vikash Goel"
        className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-cyan-400/30"
      />
      {/* NAME + DESIGNATION */}
      <div className="mb-4">
        <h4 className="text-white text-sm font-semibold">Vikash Goel</h4>
        <p className="text-xs text-slate-400">Founder & CEO eSport XO</p>
      </div>
      {/* TESTIMONIAL STATEMENT */}
      <p className="text-sm text-slate-300 leading-relaxed">
        “The International Federation of Esports is building a unified global framework that strengthens competitive gaming worldwide. IFES’s leadership in governance, collaboration, and innovation is helping esports mature into a structured, credible, and internationally respected sporting ecosystem.”
      </p>
    </div>
  </div>

  {/* CARD 2 - Santanu Basu */}
  <div className="group relative p-[1px] rounded-xl bg-gradient-to-r from-purple-500/40 via-pink-500/30 to-transparent">
    <div className="relative p-8 min-h-[260px] bg-slate-900/80 backdrop-blur-md rounded-xl border border-white/5 flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/10">
      <img
        src="https://i.pravatar.cc/80?img=18"
        alt="Santanu Basu"
        className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-purple-400/30"
      />
      <div className="mb-4">
        <h4 className="text-white text-sm font-semibold">Santanu Basu</h4>
        <p className="text-xs text-slate-400">Founder of Lets Game Now</p>
      </div>
      <p className="text-sm text-slate-300 leading-relaxed">
        “IFES plays a vital role in connecting global esports stakeholders through structured competitions and transparent governance. Their commitment to education, inclusivity, and professional development creates meaningful opportunities for players, organizations, and emerging esports communities across regions.”
      </p>
    </div>
  </div>

  {/* CARD 3 - Utkarsh Rampal */}
  <div className="group relative p-[1px] rounded-xl bg-gradient-to-r from-pink-500/40 via-rose-500/30 to-transparent">
    <div className="relative p-8 min-h-[260px] bg-slate-900/80 backdrop-blur-md rounded-xl border border-white/5 flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-500/10">
      <img
        src="https://i.pravatar.cc/80?img=28"
        alt="Utkarsh Rampal"
        className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-pink-400/30"
      />
      <div className="mb-4">
        <h4 className="text-white text-sm font-semibold">Utkarsh Rampal</h4>
        <p className="text-xs text-slate-400">GR Content Manager, Sportskeeda</p>
      </div>
      <p className="text-sm text-slate-300 leading-relaxed">
        “Through visionary leadership and innovative platforms like e-World, IFES is transforming how esports competitions operate globally. Their focus on integrity, collaboration, and talent development positions the federation as a driving force behind the future of competitive gaming.”
      </p>
    </div>
  </div>

  {/* CARD 4 - NEW DESIGN: Chaetan Chandgude (Unique gradient / orange-amber) */}
  <div className="group relative p-[1px] rounded-xl bg-gradient-to-r from-amber-500/40 via-orange-500/30 to-rose-500/30">
    <div className="relative p-8 min-h-[260px] bg-slate-900/80 backdrop-blur-md rounded-xl border border-white/5 flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/10">
      <img
        src="https://i.pravatar.cc/80?img=42"
        alt="Chaetan Chandgude"
        className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-amber-400/40"
      />
      <div className="mb-4">
        <h4 className="text-white text-sm font-semibold">Chaetan Chandgude</h4>
        <p className="text-xs text-slate-400">Founder & CEO Godlike Esports</p>
      </div>
      <p className="text-sm text-slate-300 leading-relaxed">
        “IFES is shaping a sustainable esports ecosystem by combining technology, governance, and global partnerships. Their dedication to diversity, education, and structured growth ensures esports continues evolving as a professional industry with lasting global impact.”
      </p>
    </div>
  </div>
</div>
        </div>
      </section>

      {/* Supporting Organizations */}
      {!siteConfig.is_partner && !locationCode && <LogoTicker />}

      {/* Featured Shop */}
      <FeaturedShopSection />

      {/* Competitions */}
      {homeCompetitionsLoading && competitionsForCarousel.length === 0 && (
        <section className="py-16 bg-white border-t border-slate-100">
          <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
            Loading competitions…
          </div>
        </section>
      )}
      {/* {competitionsForCarousel.length > 0 && (
        <PartnerCompetitionSection
          competitions={competitionsForCarousel}
          title="Competitions"
          carouselId="home-competition-carousel"
        />
      )} */}

      {/* Partner Sections */}
      {(locationCode || partnerHomeData) && (
        <>
          {featuredVideos.length > 0 && (
            <PartnerVideoSection
              videos={featuredVideos}
              title="Videos"
              carouselId="featured-video-carousel"
            />
          )}
          <PartnerNewsSection
            news={
              partnerHomeData?.news?.length
                ? partnerHomeData.news
                : PARTNER_HOME_STATIC.news
            }
            title="News"
            buildNewsPath={(id) => buildPath(`/news/${id}`)}
          />
        </>
      )}

      {/* Supporters */}
      {(locationCode || partnerHomeData) && (
        <PartnerSupporterSection
          supporters={
            partnerHomeData?.supporters?.length
              ? partnerHomeData.supporters
              : PARTNER_HOME_STATIC.supporters
          }
          title="Our Supporters"
        />
      )}

      {/* News Section for Global Home (Now with ESCOM API Integration) */}
      {shouldShowNewsSection && (
        <section className="py-16 mt-10 bg-gradient-to-b from-slate-950 via-slate-900 to-black border-t border-white/5">
          <div className="max-w-7xl mx-auto px-5">
            {/* Show loading or error states for ESCOM news if applicable */}
            {escomNewsLoading && (
              <div className="text-xs text-cyan-400 mb-4 text-center">
                Loading latest esports news...
              </div>
            )}
            {escomNewsError && (
              <div className="text-xs text-red-400 mb-4 text-center">
                Could not load latest news.
              </div>
            )}

            {!escomNewsLoading && !escomNewsError && (
              // <div className="grid md:grid-cols-5 gap-5">
              //   {/* HEADLINE */}
              //   <div className="md:col-span-3">
              //     <div className="flex items-center gap-2 mb-3">
              //       <h2 className="text-lg md:text-xl font-semibold text-white tracking-tight">Headline</h2>
              //       <button onClick={() => setView('news-list-headline')} className="p-1 rounded hover:bg-white/10"><ChevronRight size={16} className="text-slate-400" /></button>
              //     </div>
              //     <div className="bg-slate-900/70 backdrop-blur-md rounded-xl border border-white/5 p-4 h-[420px] flex flex-col overflow-hidden hover:shadow-md hover:shadow-cyan-500/10 transition">
              //       {headline && (
              //         <article className="flex flex-col h-full space-y-3">
              //           {headline.featuredImage && (
              //             <div className="rounded-lg overflow-hidden">
              //               <img src={headline.featuredImage} alt={headline.title} className="w-full h-[160px] object-cover transition duration-500 hover:scale-105" />
              //             </div>
              //           )}
              //           <div className="flex items-center gap-3 text-[11px]">
              //             <span className="font-medium text-cyan-400 uppercase">{headline.category}</span>
              //             <span className="text-slate-500">{headline.date}</span>
              //           </div>
              //           <h3 className="text-lg font-semibold text-white hover:text-cyan-300 transition cursor-pointer leading-snug line-clamp-2" onClick={() => setView(`news-${headline.id}`)}>{headline.title}</h3>
              //           <p className="text-xs text-slate-400 leading-relaxed flex-grow line-clamp-3">{headline.body || headline.desc}</p>
              //           <button onClick={() => setView(`news-${headline.id}`)} className="text-xs text-cyan-400 font-medium hover:text-cyan-300 inline-flex items-center gap-1">Continue Reading <ArrowRight size={12} /></button>
              //         </article>
              //       )}
              //     </div>
              //   </div>

              //   {/* LATEST */}
              //   <div className="md:col-span-1">
              //     <div className="flex items-center gap-2 mb-3"><h2 className="text-lg font-semibold text-white">Latest</h2><button onClick={() => setView('news-list-latest')} className="p-1 rounded hover:bg-white/10"><ChevronRight size={16} className="text-slate-400" /></button></div>
              //     <div className="bg-slate-900/70 backdrop-blur-md rounded-xl border border-white/5 p-3 h-[420px] overflow-hidden">
              //       <motion.div key={latestNewsIndex} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-2">
              //         {latestPool.slice(0, 3).map((news) => (
              //           <article key={news.id} className="rounded-lg p-2.5 border border-white/5 bg-slate-800/60 hover:bg-slate-800 transition">
              //             <div className="flex items-center gap-2 mb-1 text-[10px]"><span className="font-medium text-purple-400 uppercase">{news.category}</span><span className="text-slate-500">{news.date}</span></div>
              //             <h3 className="text-xs font-semibold text-white mb-1 hover:text-purple-300 transition cursor-pointer line-clamp-2" onClick={() => setView(`news-${news.id}`)}>{news.title}</h3>
              //             <button onClick={() => setView(`news-${news.id}`)} className="text-[10px] text-purple-400 hover:text-purple-300 inline-flex items-center gap-1">Read <ArrowRight size={10} /></button>
              //           </article>
              //         ))}
              //       </motion.div>
              //     </div>
              //   </div>

              //   {/* POPULAR */}
              //   <div className="md:col-span-1">
              //     <div className="flex items-center gap-2 mb-3"><h2 className="text-lg font-semibold text-white">Popular</h2><button onClick={() => setView('news-list-most')} className="p-1 rounded hover:bg-white/10"><ChevronRight size={16} className="text-slate-400" /></button></div>
              //     <div className="bg-slate-900/70 backdrop-blur-md rounded-xl border border-white/5 p-3 h-[420px] overflow-hidden">
              //       <motion.div key={mostReadIndex} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-2">
              //         {mostReadPool.slice(0, 3).map((news) => (
              //           <article key={news.id} className="rounded-lg p-2.5 border border-white/5 bg-slate-800/60 hover:bg-slate-800 transition">
              //             <div className="flex items-center gap-2 mb-1 text-[10px]"><span className="font-medium text-pink-400 uppercase">{news.category}</span><span className="text-slate-500">{news.date}</span></div>
              //             <h3 className="text-xs font-semibold text-white mb-1 hover:text-pink-300 transition cursor-pointer line-clamp-2" onClick={() => setView(`news-${news.id}`)}>{news.title}</h3>
              //             <button onClick={() => setView(`news-${news.id}`)} className="text-[10px] text-pink-400 hover:text-pink-300 inline-flex items-center gap-1">Read <ArrowRight size={10} /></button>
              //           </article>
              //         ))}
              //       </motion.div>
              //     </div>
              //   </div>
              // </div>

              // updated code
              <div className="grid md:grid-cols-5 gap-5 items-stretch">
                {/* HEADLINE */}
                <div className="md:col-span-3 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <h2 className="text-lg md:text-xl font-semibold text-white tracking-tight">
                      Headline
                    </h2>
                    <button
                      onClick={() => setView("news-list-headline")}
                      className="p-1 rounded hover:bg-white/10"
                    >
                      <ChevronRight size={16} className="text-slate-400" />
                    </button>
                  </div>

                  <div className="bg-slate-900/70 backdrop-blur-md rounded-xl border border-white/5 p-4 flex flex-col flex-1 hover:shadow-md hover:shadow-cyan-500/10 transition">
                    {headline && (
                      <article className="flex flex-col h-full space-y-3">
                        {/* IMAGE HEIGHT INCREASED */}
                        {/* {headline.featuredImage && (
                          <div className="rounded-lg overflow-hidden">
                            <img
                              src={headline.featuredImage}
                              alt={headline.title}
                              className="w-full h-[240px] object-cover transition duration-500 hover:scale-105"
                            />
                          </div>
                        )} */}

                        {homologo1 && (
                          <div className="rounded-lg overflow-hidden">
                            <img
                              src={homologo1}
                              alt="headline image"
                              className="w-full h-[240px] object-cover transition duration-500 hover:scale-105"
                            />
                          </div>
                        )}

                        <div className="flex items-center gap-3 text-[11px]">
                          <span className="font-medium text-cyan-400 uppercase">
                            {headline.category}
                          </span>
                          <span className="text-slate-500">
                            {headline.date}
                          </span>
                        </div>

                        <h3
                          className="text-lg font-semibold text-white hover:text-cyan-300 transition cursor-pointer leading-snug line-clamp-2"
                          onClick={() => setView(`news-${headline.id}`)}
                        >
                          {headline.title}
                        </h3>

                        <p className="text-xs text-slate-400 leading-relaxed flex-grow line-clamp-4">
                          {headline.body || headline.desc}
                        </p>

                        <button
                          onClick={() => setView(`news-${headline.id}`)}
                          className="text-xs text-cyan-400 font-medium hover:text-cyan-300 inline-flex items-center gap-1 mt-auto"
                        >
                          Continue Reading <ArrowRight size={12} />
                        </button>
                      </article>
                    )}
                  </div>
                </div>

                {/* LATEST */}
                <div className="md:col-span-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <h2 className="text-lg font-semibold text-white">Latest</h2>
                    <button
                      onClick={() => setView("news-list-latest")}
                      className="p-1 rounded hover:bg-white/10"
                    >
                      <ChevronRight size={16} className="text-slate-400" />
                    </button>
                  </div>

                  {/* GAP FIX */}
                  <div className="bg-slate-900/70 backdrop-blur-md rounded-xl border border-white/5 p-3 flex flex-col justify-between flex-1">
                    <motion.div
                      key={latestNewsIndex}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-2 flex flex-col h-full"
                    >
                      {latestPool.slice(0, 3).map((news) => (
                        <article
                          key={news.id}
                          className="rounded-lg p-2.5 border border-white/5 bg-slate-800/60 hover:bg-slate-800 transition flex flex-col flex-1"
                        >
                          <div className="flex items-center gap-2 mb-1 text-[10px]">
                            <span className="font-medium text-purple-400 uppercase">
                              {news.category}
                            </span>
                            <span className="text-slate-500">{news.date}</span>
                          </div>

                          <h3
                            className="text-xs font-semibold text-white mb-1 hover:text-purple-300 transition cursor-pointer line-clamp-2"
                            onClick={() => setView(`news-${news.id}`)}
                          >
                            {news.title}
                          </h3>

                          <button
                            onClick={() => setView(`news-${news.id}`)}
                            className="text-[10px] text-purple-400 hover:text-purple-300 inline-flex items-center gap-1 mt-auto"
                          >
                            Read <ArrowRight size={10} />
                          </button>
                        </article>
                      ))}
                    </motion.div>
                  </div>
                </div>

                {/* POPULAR */}
                <div className="md:col-span-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <h2 className="text-lg font-semibold text-white">
                      Popular
                    </h2>
                    <button
                      onClick={() => setView("news-list-most")}
                      className="p-1 rounded hover:bg-white/10"
                    >
                      <ChevronRight size={16} className="text-slate-400" />
                    </button>
                  </div>

                  {/* GAP FIX */}
                  <div className="bg-slate-900/70 backdrop-blur-md rounded-xl border border-white/5 p-3 flex flex-col justify-between flex-1">
                    <motion.div
                      key={mostReadIndex}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-2 flex flex-col h-full"
                    >
                      {mostReadPool.slice(0, 3).map((news) => (
                        <article
                          key={news.id}
                          className="rounded-lg p-2.5 border border-white/5 bg-slate-800/60 hover:bg-slate-800 transition flex flex-col flex-1"
                        >
                          <div className="flex items-center gap-2 mb-1 text-[10px]">
                            <span className="font-medium text-pink-400 uppercase">
                              {news.category}
                            </span>
                            <span className="text-slate-500">{news.date}</span>
                          </div>

                          <h3
                            className="text-xs font-semibold text-white mb-1 hover:text-pink-300 transition cursor-pointer line-clamp-2"
                            onClick={() => setView(`news-${news.id}`)}
                          >
                            {news.title}
                          </h3>

                          <button
                            onClick={() => setView(`news-${news.id}`)}
                            className="text-[10px] text-pink-400 hover:text-pink-300 inline-flex items-center gap-1 mt-auto"
                          >
                            Read <ArrowRight size={10} />
                          </button>
                        </article>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-5 text-center">
          <div className="bg-gradient-to-r from-cyan-950/20 via-black/70 to-fuchsia-950/20 rounded-2xl p-8 md:p-10 border border-cyan-500/30 backdrop-blur-md shadow-[0_0_25px_rgba(0,255,255,0.12)]">
            <Handshake size={36} className="text-cyan-400 mx-auto mb-3" />
            <h2 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">
              BUILD YOUR <span className="text-cyan-400">LEGACY</span>
            </h2>
            <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto mt-3">
              Partner with International Federation of Esports to expand global
              reach, collaborate on initiatives, and shape the future of esports
              worldwide.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <button
                onClick={() =>
                  (window.location.href =
                    "http://localhost:5173/partner-with-us")
                }
                className="bg-gradient-to-r from-cyan-600 to-blue-500 hover:brightness-110 px-6 py-2.5 rounded-full text-sm font-semibold transition shadow-md shadow-cyan-500/20"
              >
                <Building size={14} className="inline mr-2" /> PARTNER WITH US
              </button>
              <button className="border border-white/20 px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-white/10 transition">
                <FileText size={14} className="inline mr-2" /> RULEBOOK & KIT
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Helper component for clock icon
const Clock = ({ size = 10, className = "" }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

// Add marquee animation to tailwind config equivalent via style
const style = document.createElement("style");
style.textContent = `
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-48%); }
  }
  .animate-marquee {
    animation: marquee 28s linear infinite;
    display: flex;
    width: max-content;
  }
  .glow-card {
    background: rgba(8, 12, 30, 0.65);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(0, 255, 255, 0.3);
    transition: all 0.25s cubic-bezier(0.2, 0.9, 0.4, 1.1);
    box-shadow: 0 8px 20px -8px rgba(0,0,0,0.6), 0 0 0 0px rgba(0,255,255,0);
  }
  .glow-card:hover {
    border-color: #0ff;
    box-shadow: 0 0 24px rgba(0, 255, 255, 0.4), inset 0 0 12px rgba(0,255,255,0.05);
    transform: translateY(-4px);
  }
  .cyber-btn {
    background: linear-gradient(95deg, #0a0f1f, #01020a);
    border: 1px solid #0ff;
    transition: 0.2s;
    box-shadow: 0 0 8px rgba(0,255,255,0.2);
  }
  .cyber-btn:hover {
    background: #0a6c7c;
    border-color: white;
    box-shadow: 0 0 22px #0ff, inset 0 0 6px white;
    transform: scale(1.02);
  }
  .custom-scroll::-webkit-scrollbar {
    height: 3px;
    background: #0f172a;
  }
  .custom-scroll::-webkit-scrollbar-thumb {
    background: cyan;
    border-radius: 20px;
  }
`;
document.head.appendChild(style);

export default HomeView;
