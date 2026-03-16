import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { Mail, Phone, MapPin } from "lucide-react";
import logo from '../assets/logo.png';
import { fetchPartners, getCurrentSubdomain, findPartnerBySubdomain, getPrimaryPartnerByLocation } from '../utils/api';
import { getLocationCodeFromPath } from '../utils/locationRoutes';
import { useTheme } from '../contexts/ThemeContext';
import LocationSwitcher, { DEFAULT_LOCATION_CODES } from './LocationSwitcher';

// Default footer contact & social when NOT on a partner route (/XX or /XX/...)
const DEFAULT_FOOTER = {
  email: 'info@worso.in',
  phone: '+91 7835053333',
  address: '',
  social: {
    facebook: 'https://www.facebook.com/WORSOcommunity',
    instagram: 'https://www.instagram.com/worsoassociation',
    linkedin: 'https://in.linkedin.com/company/worso',
    youtube: 'https://www.youtube.com/@WORSOassociation',
  },
};

const Footer = ({ setView, switchSite, currentSite }) => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { updateTheme, themeConfig, selectedLocation } = useTheme();
  const routerLocation = useLocation();

  // Route countryCode (e.g. /TH, /AE). If present, LocationRouteHandler owns theme switching.
  const routeCountryCode = useMemo(() => {
    const seg = routerLocation.pathname.split('/').filter(Boolean)[0];
    const code = seg ? String(seg).toUpperCase().trim() : null;
    if (!code) return null;
    const isTwoLetter = code.length === 2 && /^[A-Z]{2}$/.test(code);
    return isTwoLetter ? code : null;
  }, [routerLocation.pathname]);

  // Only treat as "partner route" when path starts with a valid location code (same as LocationRouteHandler).
  const isOnPartnerRoute = useMemo(
    () => getLocationCodeFromPath(routerLocation.pathname) != null,
    [routerLocation.pathname]
  );

  const activeCountryCode = routeCountryCode || selectedLocation || null;

  const activePartner = useMemo(() => {
    if (!activeCountryCode || !partners?.length) return null;
    return getPrimaryPartnerByLocation(partners, activeCountryCode);
  }, [partners, activeCountryCode]);

  useEffect(() => {
    const loadPartners = async () => {
      try {
        setLoading(true);
        const data = await fetchPartners();
        
        if (data.success && data.partners && data.partners.length > 0) {
          setPartners(data.partners);
        }
        setError(null);
      } catch (err) {
        console.error('Failed to load partners:', err);
        setError('Failed to load partners data');
      } finally {
        setLoading(false);
      }
    };

    loadPartners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Build country codes for LocationSwitcher from API (fallback to DEFAULT_LOCATION_CODES)
  const countryCodes = useMemo(() => {
    const fromApi = partners
      .filter((p) => p?.isActive && p?.countryCode)
      .map((p) => String(p.countryCode).toUpperCase().trim())
      .filter(Boolean);
    const unique = Array.from(new Set(fromApi));
    return unique.length > 0 ? unique : DEFAULT_LOCATION_CODES;
  }, [partners]);

  // Map countryCode -> themeColor for LocationSwitcher. API data + Blue fallback.
  const locationThemeMap = useMemo(() => {
    const map = {};
    countryCodes.forEach(code => {
      map[code] = 'Blue';
    });
    partners.forEach(partner => {
      const code = partner?.countryCode ? String(partner.countryCode).toUpperCase().trim() : null;
      if (code && partner.isActive && partner.themeColor) {
        if (countryCodes.includes(code)) {
          map[code] = partner.themeColor;
        }
      }
    });
    return map;
  }, [partners, countryCodes]);

  // Apply theme when NOT on a country route:
  // - priority: selectedLocation (persisted) -> subdomain partner -> first active
  useEffect(() => {
    if (!partners?.length) return;
    if (routeCountryCode) return; // Route handler should own theme selection on /XX

    // 1) Persisted selection (countryCode)
    if (selectedLocation) {
      const locationPartner = getPrimaryPartnerByLocation(partners, selectedLocation);
      if (locationPartner?.themeColor) {
        updateTheme(locationPartner.themeColor, selectedLocation);
        return;
      }
    }

    // 2) Subdomain partner
    const currentSubdomain = getCurrentSubdomain();
    let partnerToUse = null;
    if (currentSubdomain) {
      partnerToUse = findPartnerBySubdomain(partners, currentSubdomain);
    }

    // 3) Fallback
    if (!partnerToUse) {
      partnerToUse = partners.find(p => p.isActive) || partners[0];
    }

    const partnerCode = partnerToUse?.countryCode ? String(partnerToUse.countryCode).toUpperCase().trim() : null;
    if (partnerToUse?.themeColor) {
      updateTheme(partnerToUse.themeColor, partnerCode);
    }
  }, [partners, routeCountryCode, selectedLocation, updateTheme]);

  const footerEmail = isOnPartnerRoute && activePartner
    ? (activePartner?.footerInfo?.email || activePartner?.contactEmail || DEFAULT_FOOTER.email)
    : DEFAULT_FOOTER.email;
  const footerPhone = isOnPartnerRoute && activePartner
    ? (activePartner?.footerInfo?.phone || activePartner?.phoneNumber || DEFAULT_FOOTER.phone)
    : DEFAULT_FOOTER.phone;
  const footerAddress = isOnPartnerRoute && activePartner
    ? (activePartner?.footerInfo?.address || activePartner?.location || DEFAULT_FOOTER.address)
    : DEFAULT_FOOTER.address;
  const social = isOnPartnerRoute && activePartner?.socialLinks
    ? { ...DEFAULT_FOOTER.social, ...activePartner.socialLinks }
    : DEFAULT_FOOTER.social;

  return (
    <footer className={`${themeConfig?.colors?.gradient || 'bg-[#0a0f1a]'} text-slate-400 py-10 sm:py-12 md:py-16`}>
    <div className="container mx-auto px-4 sm:px-6 max-w-[1600px]">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-12">

        {/* LOGO + CONTACT INFO + SOCIAL - LEFT SIDE */}
        <div className="md:col-span-3">
          <div className="flex flex-col">
            <div className="mb-6 md:mb-8">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <img
                  src={logo}
                  alt="WORSO Logo"
                  className="h-10 w-auto object-contain sm:h-12"
                />
                <span className="text-white font-bold text-xl tracking-tight">
                  {currentSite.is_partner ? "TECHNOXIAN" : "WORSO"}
                </span>
              </div>

              {/* Contact Info - Email & Phone */}
              <div className="mb-6 space-y-4">
                <p className="max-w-md mb-8 leading-relaxed text-sm">
                  {currentSite.is_partner
                    ? "The official regional chapter of the World Robotics Championship."
                    : "The World Robotics Sports Organization is the global regulatory body for robotics competitions and esports."}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-slate-500" />
                <a
                  href={`mailto:${footerEmail}`}
                  className="text-sm hover:text-white transition-colors"
                >
                  {footerEmail}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-slate-500" />
                <a
                  href={`tel:${footerPhone}`}
                  className="text-sm hover:text-white transition-colors"
                >
                  {footerPhone}</a>
              </div>
              
              {/* Country routes: /TH, /VN, /AE, etc – opens /XX and applies partner themeColor */}
              <div className="flex items-center gap-3 mt-4">
                {/* <MapPin size={16} className="text-slate-500 flex-shrink-0" /> */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* <LocationSwitcher
                      regionLabel="Country"
                      locationCodes={countryCodes}
                      locationThemeMap={locationThemeMap}
                    /> */}
                    {/* <span className="text-xs text-slate-300 border border-white/10 bg-white/5 px-2 py-1 rounded-md">
                      Active: <span className="font-bold text-white">{activeCountryCode || 'GLOBAL'}</span>
                      {activePartner?.themeColor ? (
                        <span className="ml-2 text-slate-300">Theme: <span className="font-semibold text-white">{activePartner.themeColor}</span></span>
                      ) : null}
                    </span> */}
                  </div>
                  {/* {footerAddress ? (
                    <div className="text-xs text-slate-400">
                      {footerAddress}
                    </div>
                  ) : null} */}
                  {/* {error ? (
                    <div className="text-xs text-red-300">
                      {error}
                    </div>
                  ) : null} */}
                  {/* {loading ? (
                    <div className="text-xs text-slate-500">
                      Loading partners…
                    </div>
                  ) : null} */}
                </div>
              </div>
            </div>


            {/* SOCIAL ICONS */}
         
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Follow Us</h4>
              <div className="flex gap-4 text-xl">
                <a
                  href={social.facebook || "https://www.facebook.com/WORSOcommunity"}
                  className="hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800"
                  aria-label="Facebook"
                >
                  <FaFacebookF />
                </a>
                <a
                  href={social.instagram || "https://www.instagram.com/worsoassociation"}
                  className="hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800"
                  aria-label="Instagram"
                >
                  <FaInstagram />
                </a>
                <a
                  href={social.linkedin || "https://in.linkedin.com/company/worso"}
                  className="hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800"
                  aria-label="LinkedIn"
                >
                  <FaLinkedinIn />
                </a>
                <a
                  href={social.youtube || "https://www.youtube.com/@WORSOassociation"}
                  className="hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800"
                  aria-label="YouTube"
                >
                  <FaYoutube />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* QUICK LINKS - RIGHT SIDE */}
        <div className="md:col-span-1">
          <h4 className="text-white font-bold mb-6 text-lg">Quick Links</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <button
                onClick={() => setView("technoxian")}
                className="hover:text-white transition-colors text-left w-full py-1"
              >
                WRC Challenges
              </button>
            </li>
            <li>
              <button
                onClick={() => setView("teams")}
                className="hover:text-white transition-colors text-left w-full py-1"
              >
                Teams & Rankings
              </button>
            </li>
            <li>
              <button
                onClick={() => setView("careers")}
                className="hover:text-white transition-colors text-left w-full py-1"
              >
                Careers
              </button>
            </li>
            <li>
              <button
                onClick={() => setView("news")}
                className="hover:text-white transition-colors text-left w-full py-1"
              >
                News
              </button>
            </li>
            <li className="pt-4 mt-4 border-t border-slate-800">
              <button
                onClick={() => setView("privacy-policy")}
                className="hover:text-white transition-colors text-left w-full py-1"
              >
                Privacy Policy
              </button>
            </li>
            <li>
              <button
                onClick={() => setView("terms-of-use")}
                className="hover:text-white transition-colors text-left w-full py-1"
              >
                Terms of Use
              </button>
            </li>
          </ul>
        </div>

      </div>

      <div className="pt-6 md:pt-8 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-wrap">
          <div className="flex items-center gap-4 flex-wrap">
            {/* <button
              onClick={() => setView("staff-login")}
              className="text-[10px] text-slate-700 hover:text-white font-bold uppercase transition-colors"
            >
              Staff Access
            </button> */}

            <div className="h-4 w-px bg-slate-800"></div>

            <span className="text-[10px] font-bold text-slate-400 uppercase">
              View As:
            </span>

            <button
              onClick={() => switchSite("global")}
              className={`text-[10px] font-bold transition-colors ${currentSite.id === "global" ? `${themeConfig?.colors?.textLight || 'text-blue-500'}` : "text-slate-400 hover:text-white"
                }`}
            >
              Global
            </button>

            <button
              onClick={() => switchSite("uae")}
              className={`text-[10px] font-bold transition-colors ${currentSite.id === "uae" ? `${themeConfig?.colors?.textLight || 'text-emerald-500'}` : "text-slate-400 hover:text-white"
                }`}
            >
              UAE
            </button>
          </div>

          <div className="text-xs text-slate-400 md:mx-auto">
            © 2025 World Robotics Sports Organization. All Rights Reserved.
          </div>
        </div>
      </div>

    </div>
    </footer>
  );
};

export default Footer;