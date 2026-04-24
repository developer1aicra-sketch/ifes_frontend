// import { useState, useEffect, useMemo } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
// import { Mail, Phone, MapPin } from "lucide-react";
// import logo from '../assets/logo.png';
// import { fetchPartners, getCurrentSubdomain, findPartnerBySubdomain, getPrimaryPartnerByLocation } from '../utils/api';
// import { getLocationCodeFromPath, pathWithLocationPrefix } from '../utils/locationRoutes';
// import { useTheme } from '../contexts/ThemeContext';
// import { useLocationPrefix } from '../hooks/useLocationPrefix';
// import LocationSwitcher, { DEFAULT_LOCATION_CODES } from './LocationSwitcher';

// // Default footer contact & social when NOT on a partner route (/XX or /XX/...)
// const DEFAULT_FOOTER = {
//   email: 'info@ifes.in',
//   phone: '+91 9555022200',
//   address: '',
//   social: {
//     facebook: 'https://www.facebook.com/IFeScommunity',
//     instagram: 'https://www.instagram.com/ifesassociation',
//     linkedin: 'https://in.linkedin.com/company/IFeS',
//     youtube: 'https://www.youtube.com/@IFeSassociation',
//   },
// };

// const ABOUT_SECTION_LINKS = [
//   { segment: 'advisory-board', label: 'ADVISORY BOARD' },
//   { segment: 'executive-committee', label: 'EXECUTIVE COMMITTEE' },
//   { segment: 'federation-services', label: 'FEDERATION SERVICES' },
//   // { segment: 'tech-for-good', label: 'Gaming For Robotics' },
//   { segment: 'working-at-worso', label: 'WORKING AT IFeS' },
// ];

// const Footer = ({ setView, switchSite, currentSite }) => {
//   const [partners, setPartners] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { updateTheme, themeConfig, selectedLocation } = useTheme();
//   const routerLocation = useLocation();
//   const navigate = useNavigate();
//   const { locationPrefix } = useLocationPrefix();

//   // Route countryCode (e.g. /TH, /AE). If present, LocationRouteHandler owns theme switching.
//   const routeCountryCode = useMemo(() => {
//     const seg = routerLocation.pathname.split('/').filter(Boolean)[0];
//     const code = seg ? String(seg).toUpperCase().trim() : null;
//     if (!code) return null;
//     const isTwoLetter = code.length === 2 && /^[A-Z]{2}$/.test(code);
//     return isTwoLetter ? code : null;
//   }, [routerLocation.pathname]);

//   // Only treat as "partner route" when path starts with a valid location code (same as LocationRouteHandler).
//   const isOnPartnerRoute = useMemo(
//     () => getLocationCodeFromPath(routerLocation.pathname) != null,
//     [routerLocation.pathname]
//   );

//   const activeCountryCode = routeCountryCode || selectedLocation || null;

//   const activePartner = useMemo(() => {
//     if (!activeCountryCode || !partners?.length) return null;
//     return getPrimaryPartnerByLocation(partners, activeCountryCode);
//   }, [partners, activeCountryCode]);

//   useEffect(() => {
//     const loadPartners = async () => {
//       try {
//         setLoading(true);
//         const data = await fetchPartners();
        
//         if (data.success && data.partners && data.partners.length > 0) {
//           setPartners(data.partners);
//         }
//         setError(null);
//       } catch (err) {
//         console.error('Failed to load partners:', err);
//         setError('Failed to load partners data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadPartners();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Build country codes for LocationSwitcher from API (fallback to DEFAULT_LOCATION_CODES)
//   const countryCodes = useMemo(() => {
//     const fromApi = partners
//       .filter((p) => p?.isActive && p?.countryCode)
//       .map((p) => String(p.countryCode).toUpperCase().trim())
//       .filter(Boolean);
//     const unique = Array.from(new Set(fromApi));
//     return unique.length > 0 ? unique : DEFAULT_LOCATION_CODES;
//   }, [partners]);

//   // Map countryCode -> themeColor for LocationSwitcher. API data + Blue fallback.
//   const locationThemeMap = useMemo(() => {
//     const map = {};
//     countryCodes.forEach(code => {
//       map[code] = 'Blue';
//     });
//     partners.forEach(partner => {
//       const code = partner?.countryCode ? String(partner.countryCode).toUpperCase().trim() : null;
//       if (code && partner.isActive && partner.themeColor) {
//         if (countryCodes.includes(code)) {
//           map[code] = partner.themeColor;
//         }
//       }
//     });
//     return map;
//   }, [partners, countryCodes]);

//   // Apply theme when NOT on a country route:
//   // - priority: selectedLocation (persisted) -> subdomain partner -> first active
//   useEffect(() => {
//     if (!partners?.length) return;
//     if (routeCountryCode) return; // Route handler should own theme selection on /XX

//     // 1) Persisted selection (countryCode)
//     if (selectedLocation) {
//       const locationPartner = getPrimaryPartnerByLocation(partners, selectedLocation);
//       if (locationPartner?.themeColor) {
//         updateTheme(locationPartner.themeColor, selectedLocation);
//         return;
//       }
//     }

//     // 2) Subdomain partner
//     const currentSubdomain = getCurrentSubdomain();
//     let partnerToUse = null;
//     if (currentSubdomain) {
//       partnerToUse = findPartnerBySubdomain(partners, currentSubdomain);
//     }

//     // 3) Fallback
//     if (!partnerToUse) {
//       partnerToUse = partners.find(p => p.isActive) || partners[0];
//     }

//     const partnerCode = partnerToUse?.countryCode ? String(partnerToUse.countryCode).toUpperCase().trim() : null;
//     if (partnerToUse?.themeColor) {
//       updateTheme(partnerToUse.themeColor, partnerCode);
//     }
//   }, [partners, routeCountryCode, selectedLocation, updateTheme]);

//   const aboutBasePath = useMemo(
//     () => pathWithLocationPrefix(locationPrefix || '', '/about'),
//     [locationPrefix],
//   );

//   const isOnAboutPage = useMemo(() => {
//     const p = routerLocation.pathname || '';
//     if (p.endsWith('/governance') || p === '/governance') return true;
//     return p === aboutBasePath || p.startsWith(`${aboutBasePath}/`);
//   }, [routerLocation.pathname, aboutBasePath]);

//   const activeAboutSection = useMemo(() => {
//     const p = routerLocation.pathname || '';
//     if (!p.startsWith(`${aboutBasePath}/`)) return null;
//     const seg = p.slice(aboutBasePath.length + 1);
//     return ABOUT_SECTION_LINKS.some((l) => l.segment === seg) ? seg : null;
//   }, [routerLocation.pathname, aboutBasePath]);

//   const handleAboutSectionClick = (segment) => {
//     navigate(`${aboutBasePath}/${segment}`, { replace: true });
//     window.scrollTo(0, 0);
//   };

//   const footerEmail = isOnPartnerRoute && activePartner
//     ? (activePartner?.footerInfo?.email || activePartner?.contactEmail || DEFAULT_FOOTER.email)
//     : DEFAULT_FOOTER.email;
//   const footerPhone = isOnPartnerRoute && activePartner
//     ? (activePartner?.footerInfo?.phone || activePartner?.phoneNumber || DEFAULT_FOOTER.phone)
//     : DEFAULT_FOOTER.phone;
//   const footerAddress = isOnPartnerRoute && activePartner
//     ? (activePartner?.footerInfo?.address || activePartner?.location || DEFAULT_FOOTER.address)
//     : DEFAULT_FOOTER.address;
//   const social = isOnPartnerRoute && activePartner?.socialLinks
//     ? { ...DEFAULT_FOOTER.social, ...activePartner.socialLinks }
//     : DEFAULT_FOOTER.social;

//   return (
//     <footer className={`${themeConfig?.colors?.gradient || 'bg-[#0a0f1a]'} text-slate-400 pt-10`}>
//       <div className="container mx-auto px-4 sm:px-6 max-w-[1600px]">
//         {/* Three-column layout */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 lg:gap-16 mb-10 md:mb-12">
//           {/* Column 1: Logo, description, contact, country, social */}
//           <div className="flex flex-col">
//             <div className="flex items-center gap-3 mb-4">
//               <img
//                 src="https://ifes.in/images/logo.png"
//                 alt="IFeS Logo"
//                 className="h-10 w-auto object-contain sm:h-12"
//               />
//               <span className="text-white font-bold text-xl tracking-tight">
//                 {currentSite.is_partner ? "TECHNOXIAN" : "IFeS"}
//               </span>
//             </div>
//             <p className="max-w-md mb-6 leading-relaxed text-sm text-slate-400">
//               {currentSite.is_partner
//                 ? "The official regional chapter of the World Robotics Championship."
//                 : "The World Robotics Sports Organization is the global regulatory body for robotics competitions and esports."}
//             </p>
//             <div className="space-y-3 mb-4">
//               <a
//                 href={`mailto:${footerEmail}`}
//                 className="flex items-center gap-3 text-sm hover:text-white transition-colors"
//               >
//                 <Mail size={16} className="text-slate-500 flex-shrink-0" />
//                 {footerEmail}
//               </a>
//               <a
//                 href={`tel:${footerPhone}`}
//                 className="flex items-center gap-3 text-sm hover:text-white transition-colors"
//               >
//                 <Phone size={16} className="text-slate-500 flex-shrink-0" />
//                 {footerPhone}
//               </a>
//             </div>
//             <div className="flex flex-col gap-2 mb-6">
          
//               {footerAddress ? (
//                 <div className="flex items-center gap-2 text-xs text-slate-400">
//                   <MapPin size={14} className="flex-shrink-0" />
//                   {footerAddress}
//                 </div>
//               ) : null}
//               {error ? <div className="text-xs text-red-300">{error}</div> : null}
//               {loading ? <div className="text-xs text-slate-500">Loading partners…</div> : null}
//             </div>
//             <div>
//               <h4 className="text-white font-bold mb-3 text-sm uppercase tracking-wider">Follow Us</h4>
//               <div className="flex gap-3 text-lg">
//                 <a href={social.facebook || "https://www.facebook.com/IFeScommunity"} className="hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800/50" aria-label="Facebook"><FaFacebookF /></a>
//                 <a href={social.instagram || "https://www.instagram.com/iFeSassociation"} className="hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800/50" aria-label="Instagram"><FaInstagram /></a>
//                 <a href={social.linkedin || "https://in.linkedin.com/company/IFeS"} className="hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800/50" aria-label="LinkedIn"><FaLinkedinIn /></a>
//                 <a href={social.youtube || "https://www.youtube.com/@IFeSassociation"} className="hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800/50" aria-label="YouTube"><FaYoutube /></a>
//               </div>
//             </div>
//           </div>

//           {/* Column 2: Quick Links */}
//           <div className="flex flex-col">
//             <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Quick Links</h4>
//             <ul className="space-y-3 text-sm">
//               <li>
//                 <button onClick={() => setView("technoxian")} className="text-sm hover:text-white transition-colors text-left w-full py-1">
//                   Games
//                 </button>
//               </li>
//               <li>
//                 <button onClick={() => setView("teams")} className="text-sm hover:text-white transition-colors text-left w-full py-1">
//                   Teams & Rankings
//                 </button>
//               </li>
//               <li>
//                 <button onClick={() => setView("news")} className="hover:text-white transition-colors text-left w-full py-1">
//                   News
//                 </button>
//               </li>
//               <li className="">
//                 <button onClick={() => setView("privacy-policy")} className="text-sm hover:text-white transition-colors text-left w-full py-1">
//                   Privacy Policy
//                 </button>
//               </li>
//               <li>
//                 <button onClick={() => setView("terms-of-use")} className="hover:text-white transition-colors text-left w-full py-1">
//                   Terms of Use
//                 </button>
//               </li>
//             </ul>
//           </div>

//           {/* Column 3: Organizational links (About sections) */}
//           <nav className="flex flex-col">
//             <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Governance</h4>
//             <ul className="space-y-3 text-sm">
//               {ABOUT_SECTION_LINKS.map((link) => {
//                 const isActive = isOnAboutPage && activeAboutSection === link.segment;
//                 return (
//                   <li key={link.segment}>
//                     <button
//                       onClick={() => handleAboutSectionClick(link.segment)}
//                       className={`text-sm capitalize hover:text-white transition-colors text-left w-full py-1 ${
//                         isActive
//                           ? `${themeConfig?.colors?.textLight || 'text-blue-400'}`
//                           : 'text-slate-400 hover:text-white'
//                       }`}
//                     >
//                       {link.label}
//                     </button>
//                   </li>
//                 );
//               })}
//             </ul>
//           </nav>
//           <div className="flex flex-col gap-3 flex-wrap">
//                 <LocationSwitcher
//                   regionLabel="Country"
//                   locationCodes={countryCodes}
//                   locationThemeMap={locationThemeMap}
//                   showFullNames
//                 />
//                 {/* <div>

//                 <button
//                   type="button"
//                   onClick={() => navigate(pathWithLocationPrefix(locationPrefix || '', '/partners'))}
//                   className="text-sm font-medium px-3 py-1.5 rounded-md transition-all duration-300 no-underline text-slate-300 hover:text-white hover:bg-slate-800 border border-transparent"
//                 >
//                   See all
//                 </button>
//                 </div> */}
//               </div>
//         </div>

//         {/* Bottom bar */}
//         <div className="py4 md:py-4 border-t border-slate-700/50 flex justify-center">
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
//             {/* <button
//               onClick={() => setView("staff-login")}
//               className="text-[10px] text-slate-500 hover:text-white font-bold uppercase transition-colors order-2 sm:order-1"
//             >
//               Staff Access
//             </button> */}
//             <div className="text-xs text-slate-500 text-center order-1 sm:order-2 flex-1 sm:flex-initial">
//               © 2026 World Robotics Sports Organization. All Rights Reserved.
//             </div>
//             <div className="hidden sm:block w-20 flex-shrink-0" aria-hidden="true" />
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;



// latest updated code 
import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { Mail, Phone, MapPin } from "lucide-react";
import { fetchPartners, getCurrentSubdomain, findPartnerBySubdomain, getPrimaryPartnerByLocation } from '../utils/api';
import { getLocationCodeFromPath, pathWithLocationPrefix } from '../utils/locationRoutes';
import { useTheme } from '../contexts/ThemeContext';
import { useLocationPrefix } from '../hooks/useLocationPrefix';
import LocationSwitcher, { DEFAULT_LOCATION_CODES } from './LocationSwitcher';

// Default footer contact & social when NOT on a partner route (/XX or /XX/...)
const DEFAULT_FOOTER = {
  email: 'info@ifes.in',
  phone: '+91 9555022200',
  address: '',
  social: {
    facebook: 'https://www.facebook.com/IFeScommunity',
    instagram: 'https://www.instagram.com/ifesassociation',
    linkedin: 'https://in.linkedin.com/company/IFeS',
    youtube: 'https://www.youtube.com/@IFeSassociation',
  },
};

const ABOUT_SECTION_LINKS = [
  { segment: 'advisory-board', label: 'ADVISORY BOARD' },
  { segment: 'executive-committee', label: 'EXECUTIVE COMMITTEE' },
  { segment: 'federation-services', label: 'FEDERATION SERVICES' },
  { segment: 'working-at-worso', label: 'WORKING AT IFeS' },
];

const Footer = ({ setView, switchSite, currentSite }) => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { updateTheme, themeConfig, selectedLocation } = useTheme();
  const routerLocation = useLocation();
  const navigate = useNavigate();
  const { locationPrefix } = useLocationPrefix();

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

  // Initialize Tawk.to chat widget
  useEffect(() => {
    // Check if Tawk.to script is already loaded
    if (window.Tawk_API) return;

    // Create and load Tawk.to script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://embed.tawk.to/672f046b2480f5b4f59b11cb/1ic7qihii';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    
    // Initialize Tawk_API object before script loads
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();
    
    script.onload = () => {
      console.log('Tawk.to chat widget loaded successfully');
    };
    
    document.body.appendChild(script);
    
    // Cleanup function (optional - keeps widget on unmount)
    return () => {
      // Don't remove script on unmount to maintain chat history
      // The widget will persist across navigation
    };
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

  const aboutBasePath = useMemo(
    () => pathWithLocationPrefix(locationPrefix || '', '/about'),
    [locationPrefix],
  );

  const isOnAboutPage = useMemo(() => {
    const p = routerLocation.pathname || '';
    if (p.endsWith('/governance') || p === '/governance') return true;
    return p === aboutBasePath || p.startsWith(`${aboutBasePath}/`);
  }, [routerLocation.pathname, aboutBasePath]);

  const activeAboutSection = useMemo(() => {
    const p = routerLocation.pathname || '';
    if (!p.startsWith(`${aboutBasePath}/`)) return null;
    const seg = p.slice(aboutBasePath.length + 1);
    return ABOUT_SECTION_LINKS.some((l) => l.segment === seg) ? seg : null;
  }, [routerLocation.pathname, aboutBasePath]);

  const handleAboutSectionClick = (segment) => {
    navigate(`${aboutBasePath}/${segment}`, { replace: true });
    window.scrollTo(0, 0);
  };

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
    <footer className={`${themeConfig?.colors?.gradient || 'bg-[#0a0f1a]'} text-slate-400 pt-10`}>
      <div className="container mx-auto px-4 sm:px-6 max-w-[1600px]">
        {/* Four-column layout - removed bg-red-500 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 lg:gap-16 mb-10 md:mb-12">
          
          {/* Column 1: Logo and content */}
          <div className="flex flex-col">
            {/* Logo with text side by side */}
            <div className="flex items-center gap-3 mb-6">
              <img
                src="https://ifes.in/images/logo.png"
                alt="IFeS Logo"
                className="h-12 w-auto object-contain"
              />
              <p className="text-white font-semibold text-base">
                International Federation of Esports (IFeS)
              </p>
            </div>
            
            {/* Content moved up - removed extra spacing */}
            <div className="mb-4">
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Unites global esports ecosystem, enabling competitions, governance, and industry growth
              </p>
              
              {/* Location with icon - better color */}
              <div className="flex items-start gap-3 mb-3">
                <MapPin size={16} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                <p className="text-slate-400 text-sm">
                  10 US Complex, Jasola, New Delhi (India) - 110076
                </p>
              </div>
              
              {/* Email with icon - better color */}
              <div className="flex items-center gap-3 mb-2">
                <Mail size={16} className="text-cyan-400 flex-shrink-0" />
                <a href="mailto:contact@ifes.in" className="text-slate-400 hover:text-white transition-colors text-sm">
                  contact@ifes.in
                </a>
              </div>
              
              {/* Phone with icon - better color */}
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-cyan-400 flex-shrink-0" />
                <a href="tel:+917042198418" className="text-slate-400 hover:text-white transition-colors text-sm">
                  +91 70421 98418
                </a>
              </div>
            </div>
            
            {/* Follow Us section */}
            <div className="mt-4">
              <h4 className="text-white font-bold mb-3 text-sm uppercase tracking-wider">Follow Us</h4>
              <div className="flex gap-3 text-lg">
                <a href={social.facebook || "https://www.facebook.com/IFeScommunity"} className="hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800/50" aria-label="Facebook"><FaFacebookF /></a>
                <a href={social.instagram || "https://www.instagram.com/iFeSassociation"} className="hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800/50" aria-label="Instagram"><FaInstagram /></a>
                <a href={social.linkedin || "https://in.linkedin.com/company/IFeS"} className="hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800/50" aria-label="LinkedIn"><FaLinkedinIn /></a>
                <a href={social.youtube || "https://www.youtube.com/@IFeSassociation"} className="hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800/50" aria-label="YouTube"><FaYoutube /></a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col">
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <button onClick={() => setView("games")} className="hover:text-white transition-colors text-left w-full py-1">
                  Games
                </button>
              </li>
              <li>
                <button onClick={() => setView("events")} className="hover:text-white transition-colors text-left w-full py-1">
                  Events
                </button>
              </li>
              <li>
                <button onClick={() => setView("ranking")} className="hover:text-white transition-colors text-left w-full py-1">
                  Ranking
                </button>
              </li>
              <li>
                <button onClick={() => setView("ifes-tv")} className="hover:text-white transition-colors text-left w-full py-1">
                  IFeS TV - OTT
                </button>
              </li>
              <li>
                <button onClick={() => setView("news")} className="hover:text-white transition-colors text-left w-full py-1">
                  News
                </button>
              </li>
              <li>
                <button onClick={() => setView("privacy-policy")} className="hover:text-white transition-colors text-left w-full py-1">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => setView("terms")} className="hover:text-white transition-colors text-left w-full py-1">
                  Terms of Use
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Governance */}
          <div className="flex flex-col">
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Governance</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <button onClick={() => handleAboutSectionClick("advisory-board")} className="hover:text-white transition-colors text-left w-full py-1">
                  ADVISORY BOARD
                </button>
              </li>
              <li>
                <button onClick={() => handleAboutSectionClick("executive-committee")} className="hover:text-white transition-colors text-left w-full py-1">
                  EXECUTIVE COMMITTEE
                </button>
              </li>
              <li>
                <button onClick={() => handleAboutSectionClick("federation-services")} className="hover:text-white transition-colors text-left w-full py-1">
                  FEDERATION SERVICES
                </button>
              </li>
              <li>
                <button onClick={() => handleAboutSectionClick("working-at-worso")} className="hover:text-white transition-colors text-left w-full py-1">
                  WORKING AT IFeS
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Programs & Initiatives */}
          <div className="flex flex-col">
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">
              Programs & Initiatives
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="hover:text-white cursor-pointer transition-colors py-1">
                Esports Education
              </li>
              <li className="hover:text-white cursor-pointer transition-colors py-1">
                Certification Programs
              </li>
              <li className="hover:text-white cursor-pointer transition-colors py-1">
                Grassroots Development
              </li>
              <li className="hover:text-white cursor-pointer transition-colors py-1">
                IFeS Esports World Cup
              </li>
              <li className="hover:text-white cursor-pointer transition-colors py-1">
                Industry Summits
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-4 md:py-4 border-t border-slate-700/50 flex justify-center">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
            <div className="text-xs text-slate-500 text-center">
              © 2026 World Robotics Sports Organization. All Rights Reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;