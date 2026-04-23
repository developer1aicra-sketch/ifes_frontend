// import React from 'react';
// import { Zap, Award } from 'lucide-react';
// import { Link, NavLink } from 'react-router-dom';
// import { useLocationPrefix } from '../../hooks/useLocationPrefix';
// import { pathWithLocationPrefix } from '../../utils/locationRoutes';

// const Navbar = ({ onOpenCertificate, onNavigateHome, isAuthenticated }) => {
//   const { locationPrefix } = useLocationPrefix();

//   return (
//     <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center border-b border-white/10 bg-slate-950/60 backdrop-blur-xl">
//     <NavLink to={pathWithLocationPrefix(locationPrefix, '/')} className="flex items-center gap-2 cursor-pointer">
//       <div className="w-8 h-8 bg-gradient-to-tr from-cyan-400 to-violet-600 rounded-lg flex items-center justify-center">
//         <Zap className="text-white w-5 h-5 fill-current" />
//       </div>
//       <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
//         EXCLUB<span className="text-cyan-400">.</span>
//       </span>
//     </NavLink>

//     <div className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-300 flex-wrap justify-end max-w-2xl">
//       <button
//         type="button"
//         onClick={() => onNavigateHome?.()}
//         className="hover:text-cyan-400 transition-colors shrink-0"
//       >
//         Home
//       </button>
//       <a href="#about-robo" className="hover:text-cyan-400 transition-colors shrink-0">About</a>
//       <a href="#learning-tracks" className="hover:text-cyan-400 transition-colors shrink-0">Learn</a>
//       <a href="#competitions-events" className="hover:text-cyan-400 transition-colors shrink-0">Events</a>
//       {/* <a href="#project-showcase" className="hover:text-cyan-400 transition-colors shrink-0">Showcase</a>
//       <a href="#testimonials" className="hover:text-cyan-400 transition-colors shrink-0">Stories</a>
//       <a href="#community" className="hover:text-cyan-400 transition-colors shrink-0">Community</a> */}
//       {/* <a href="#shop" className="hover:text-cyan-400 transition-colors shrink-0">Shop</a> */}
//       <a href="#winners" className="hover:text-cyan-400 transition-colors shrink-0">Champions</a>
//     </div>

//     <div className="flex items-center gap-4">
//       <button
//         onClick={onOpenCertificate}
//         className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-semibold uppercase tracking-wider transition-all"
//       >
//         <Award className="w-4 h-4 text-yellow-400" />
//         <span>Certificate</span>
//       </button>

//       {isAuthenticated ? (
//         <Link
//           to={pathWithLocationPrefix(locationPrefix, '/roboclub-dashboard')}
//           className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold rounded-lg shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all text-sm"
//         >
//           Open Dashboard
//         </Link>
//       ) : (
//         <Link
//           to={pathWithLocationPrefix(locationPrefix, '/roboclub-login')}
//           className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all text-sm"
//         >
//           Login
//         </Link>
//       )}
//     </div>
//   </nav>
//   );
// };

// export default Navbar;

// latest updated code
import { useState, useEffect } from "react";
import { Trophy, Menu, X, User, LogOut, Star, ChevronDown } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import { pathWithLocationPrefix } from "../../utils/locationRoutes";
import { useEffectiveLocationPrefix } from "../../hooks/useEffectiveLocationPrefix";
import { usePartnerAboutMegaMenuItems } from "../../hooks/usePartnerAboutMegaMenuItems";
import {
  partnerLogout,
  clearPartnerAuth,
  getPartnerAuth,
} from "../../utils/api";
import { clearAuthToken, getAuthToken } from "../../api/authToken";
import {
  AboutWorsoDesktopMegaMenu,
  AboutWorsoMobileLinks,
} from "../AboutWorsoMegaMenu";
import { useLocationPrefix } from "../../hooks/useLocationPrefix";
import exclub from "../../assets/exclublogo/exclub.png";

const Navbar = ({
  setView,
  toggleMobileMenu,
  isMobileMenuOpen,
  siteConfig,
  user,
  setUser,
  onOpenCertificate,
  onNavigateHome,
  isAuthenticated,
}) => {
  const [aboutMobileOpen, setAboutMobileOpen] = useState(false);
  const theme = useThemeClasses();
  const location = useLocation();
  const navigate = useNavigate();
  const effectiveLocationPrefix = useEffectiveLocationPrefix(siteConfig);
  const { locationPrefix } = useLocationPrefix();
  const path = (p) => pathWithLocationPrefix(effectiveLocationPrefix, p);
  const {
    isRegionalChapter,
    partnerTabs,
    loading: partnerAboutNavLoading,
  } = usePartnerAboutMegaMenuItems(effectiveLocationPrefix);
  const partnerSession = getPartnerAuth();
  const isPartnerAuthenticated = Boolean(
    partnerSession?.token && partnerSession?.partner,
  );
  const isMemberAuthenticated = Boolean(getAuthToken());

  const isMemberPortalActive =
    location.pathname === "/member/portal" ||
    location.pathname.endsWith("/member/portal");
  const isPartnerPortalActive =
    location.pathname === "/partner/portal" ||
    location.pathname.endsWith("/partner/portal");
  const activePortalButtonClass =
    "bg-blue-600 ring-2 ring-blue-300/80 border-blue-300/70";

  const openMemberPortal = () => {
    console.log("Member Login clicked");
    if (!isMemberAuthenticated) {
      if (setView) {
        setView("member-login");
      } else {
        navigate("/member/login");
      }
      return;
    }
    setUser?.((prev) =>
      prev?.type === "member" ? prev : { type: "member", email: prev?.email },
    );
    if (setView) {
      setView("member-dashboard");
    } else {
      navigate("/member/dashboard");
    }
  };

  const openPartnerPortal = () => {
    console.log("Partner Login clicked");
    if (!isPartnerAuthenticated) {
      if (setView) {
        setView("partner-login");
      } else {
        navigate("/partner/login");
      }
      return;
    }
    setUser?.({
      type: "admin",
      role: "partner",
      email: partnerSession.partner.contactEmail ?? partnerSession.email,
      token: partnerSession.token,
      partner: partnerSession.partner,
    });
    if (setView) {
      setView("partner-dashboard");
    } else {
      navigate("/partner/dashboard");
    }
  };

  const logout = async () => {
    const shouldLogoutPartner =
      Boolean(partnerSession?.token) && user?.type !== "member";
    const shouldLogoutMember = Boolean(getAuthToken()) && !shouldLogoutPartner;
    try {
      if (shouldLogoutPartner && partnerSession?.token) {
        await partnerLogout(partnerSession.token);
      }
    } catch {
      // still clear local session on logout API failure
    } finally {
      if (shouldLogoutMember) clearAuthToken();
      if (shouldLogoutPartner) clearPartnerAuth();
      setUser?.(null);
      if (setView) {
        setView("home");
      } else {
        navigate("/");
      }
    }
  };

  const closeAnd = (fn) => () => {
    toggleMobileMenu?.();
    fn?.();
  };

  useEffect(() => {
    if (!isMobileMenuOpen) setAboutMobileOpen(false);
  }, [isMobileMenuOpen]);

  // Handle navigation for menu items
  const handleNavigation = (view) => {
    if (setView) {
      setView(view);
    } else {
      navigate(path(`/${view}`));
    }
    toggleMobileMenu?.();
  };

  // Handle home navigation separately
  const handleHomeClick = () => {
    console.log("Home/Logo clicked");
    if (setView) {
      setView("home");
    } else {
      navigate("/");
    }
    toggleMobileMenu?.();
  };

  return (
    <>
      {/* Thin Top Bar */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-gray-900/95 via-gray-900/90 to-gray-900/95 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 py-1 max-w-[1600px]">
          <div className="flex justify-end items-center gap-2">
            <button
              onClick={openMemberPortal}
              className={`flex items-center gap-1.5 text-[13px] font-medium py-1 px-2.5 rounded-md transition-all duration-200 ${
                isMemberPortalActive
                  ? `text-white ${activePortalButtonClass}`
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <User size={13} className="shrink-0" />
              <span>
                {isMemberAuthenticated ? "Member Portal" : "Member Login"}
              </span>
            </button>
            <div className="w-px h-3 bg-white/20" aria-hidden="true" />
            <button
              onClick={openPartnerPortal}
              className={`flex items-center gap-1.5 text-[13px] font-medium py-1 px-2.5 rounded-md transition-all duration-200 ${
                isPartnerPortalActive
                  ? `text-white ${activePortalButtonClass}`
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <User size={13} className="shrink-0" />
              <span>
                {isPartnerAuthenticated ? "Partner Portal" : "Partner Login"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav
        className={`sticky top-0 z-40 transition-all duration-300 ${theme.bgGradient || "bg-[#0a0f1a]"} border-b border-white/10`}
      >
        <div className="container mx-auto px-4 sm:px-6 py-2 md:py-1 flex justify-between items-center max-w-[1600px]">
          {/* Logo - Fixed home navigation */}
          <div
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group min-w-0"
            onClick={handleHomeClick}
          >
            <img
              src="https://ifes.in/images/logo.png"
              alt="IFES Logo"
              className="h-10 w-auto object-contain sm:h-20"
            />
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 font-bold text-[14px] uppercase tracking-widest text-slate-300">
            <div className="relative group/about">
              <button
                type="button"
                onClick={() => handleNavigation("about")}
                className="hover:text-white transition-colors py-2 flex items-center gap-1 text-inherit"
              >
                {effectiveLocationPrefix || siteConfig?.is_partner
                  ? "About"
                  : "IFeS"}
                <ChevronDown
                  size={14}
                  className="opacity-70 shrink-0 transition-transform duration-200 group-hover/about:rotate-180"
                  aria-hidden
                />
              </button>
              <AboutWorsoDesktopMegaMenu
                pathWithPrefix={path}
                pathname={location.pathname}
                search={location.search}
                siteConfig={siteConfig}
                isRegionalChapter={isRegionalChapter}
                partnerTabs={partnerTabs}
                partnerNavLoading={partnerAboutNavLoading}
              />
            </div>

            <Link
              to={path("/membership")}
              className="normal-case hover:text-white transition-colors"
            >
              Membership
            </Link>

            <Link
              to={path("/exclubs")}
              className="flex gap-2 items-center normal-case hover:text-white transition-colors"
            >
              <Star
                size={14}
                className={
                  location.pathname.endsWith("/exclubs")
                    ? "text-yellow-400"
                    : "text-yellow-500"
                }
              />{" "}
              EX Clubs
            </Link>

            <div className="relative group">
              <a
                href="https://ifes.in/esportsworldcup/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1 normal-case"
              >
                <Trophy className="w-3 h-3 text-yellow-500" />
                {siteConfig?.is_partner ? "Local Events" : "E-Sport"}
              </a>
            </div>

            {/* Event Dropdown */}
            <div className="relative group">
              <button className="hover:text-white transition-colors">
                Event
              </button>
              <div className="absolute left-0 mt-2 w-44 bg-slate-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <a
                  href="https://www.escom.ifes.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white"
                >
                  ESCOM-2.0
                </a>
              </div>
            </div>

            {/* Partner Dropdown */}
            <div className="relative group">
              <button className="hover:text-white transition-colors flex items-center gap-1">
                Partner
                <ChevronDown
                  size={14}
                  className="opacity-70 shrink-0 transition-transform duration-200 group-hover:rotate-180"
                />
              </button>
              <div
                className="absolute left-1/2 -translate-x-1/2 mt-3 w-48 
                              bg-slate-800/95 backdrop-blur-md 
                              rounded-lg shadow-xl border border-white/10
                              opacity-0 invisible group-hover:opacity-100 group-hover:visible
                              transition-all duration-200 z-50"
              >
                <Link
                  to={path("/nep-nea")}
                  className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-slate-700 hover:text-white rounded-t-lg transition"
                >
                  NEP/NEA
                </Link>
                <Link
                  to={path("/ifes-tv-ott")}
                  className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-slate-700 hover:text-white rounded-b-lg transition"
                >
                  IFES TV - OTT
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2 -m-2 touch-manipulation"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile menu overlay + panel */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-50 md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile menu"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={toggleMobileMenu}
              aria-hidden="true"
            />
            <div
              className={`absolute top-0 right-0 bottom-0 w-full max-w-[320px] sm:max-w-sm ${theme.bgGradient || "bg-[#0a0f1a]"} border-l border-white/10 shadow-2xl overflow-y-auto`}
            >
              <div className="flex justify-between items-center p-4 border-b border-white/10">
                <span className="text-white font-bold text-sm uppercase">
                  Menu
                </span>
                <button
                  className="text-white p-2 -m-2"
                  onClick={toggleMobileMenu}
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="flex flex-col py-4 font-bold text-[13px] uppercase tracking-widest text-slate-300">
                <button
                  type="button"
                  onClick={() => setAboutMobileOpen((o) => !o)}
                  className={`text-left px-6 py-4 hover:bg-white/5 hover:text-white transition-colors flex items-center justify-between gap-2 ${
                    aboutMobileOpen ? "bg-white/5 text-white" : ""
                  }`}
                  aria-expanded={aboutMobileOpen}
                >
                  <span>
                    {effectiveLocationPrefix || siteConfig?.is_partner
                      ? "About"
                      : "Ifes"}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 opacity-80 transition-transform ${aboutMobileOpen ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                </button>
                {aboutMobileOpen && (
                  <div className="px-4 pb-2">
                    <AboutWorsoMobileLinks
                      pathWithPrefix={path}
                      pathname={location.pathname}
                      search={location.search}
                      siteConfig={siteConfig}
                      isRegionalChapter={isRegionalChapter}
                      partnerTabs={partnerTabs}
                      onNavigate={closeAnd()}
                    />
                  </div>
                )}
                <Link
                  to={path("/membership")}
                  onClick={closeAnd()}
                  className="px-6 py-4 hover:bg-white/5 hover:text-white transition-colors"
                >
                  Membership
                </Link>

                <button
                  onClick={closeAnd(() => handleNavigation("teams"))}
                  className="text-left px-6 py-4 hover:bg-white/5 hover:text-white transition-colors"
                >
                  Teams / Players
                </button>
                <Link
                  to={path("/challenges")}
                  onClick={closeAnd()}
                  className="text-left px-6 py-4 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Trophy className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                  {siteConfig?.is_partner ? "Local Events" : "WRC Challenges"}
                </Link>
                <Link
                  to={path("/partner-with-us")}
                  onClick={closeAnd()}
                  className="px-6 py-4 hover:bg-white/5 hover:text-white transition-colors"
                >
                  Become a Partner
                </Link>
                <div className="mt-4 pt-4 border-t border-white/10 px-6">
                  <button
                    onClick={closeAnd(openMemberPortal)}
                    className={`text-white w-full py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 ${
                      isMemberPortalActive
                        ? activePortalButtonClass
                        : `${theme.bgPrimary || siteConfig?.colors?.primary || "bg-blue-600"}`
                    }`}
                  >
                    <User size={16} />
                    {isMemberAuthenticated ? "Member Portal" : "Member Login"}
                  </button>
                  <button
                    onClick={closeAnd(openPartnerPortal)}
                    className={`text-white w-full py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 mt-3 border ${
                      isPartnerPortalActive
                        ? activePortalButtonClass
                        : "bg-slate-700/70 border-slate-500/50"
                    }`}
                  >
                    <User size={16} />
                    {isPartnerAuthenticated
                      ? "Partner Portal"
                      : "Partner Login"}
                  </button>
                  {(isMemberAuthenticated || isPartnerAuthenticated) && (
                    <div className="mt-3 space-y-1">
                      <button
                        onClick={closeAnd(logout)}
                        className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-red-600/15 text-red-400 flex items-center gap-2 text-sm"
                      >
                        <LogOut size={14} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
