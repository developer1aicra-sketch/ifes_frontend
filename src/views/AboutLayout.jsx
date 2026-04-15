import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Outlet, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { getLocationPrefix } from '../utils/locationRoutes';
import { REFEREES } from '../data/aboutPeople';
import { buildPartnerAboutTabsWithContent } from '../utils/partnerAboutTabs';
import PersonCard from '../components/partner/PersonCard';
import AdvisoryBoardGrid from '../components/about/AdvisoryBoardGrid';
import { usePartnerAboutPageData } from '../hooks/usePartnerAboutPageData';
import { pathWithLocationPrefix } from '../utils/locationRoutes';
import { useLocationPrefix } from '../hooks/useLocationPrefix';
import { ABOUT_NAV, LEGACY_HASH_TO_SEGMENT } from './about/aboutRouteConfig';

const AboutLayout = ({ setView }) => {
  void setView;
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { locationPrefix } = useLocationPrefix();
  const basePath = pathWithLocationPrefix(locationPrefix || '', '/about');

  const locationPrefixFromPath = getLocationPrefix(location.pathname);
  const partnerAboutPath = locationPrefixFromPath ? `${locationPrefixFromPath}/about` : '';
  const normalizedPath = location.pathname.replace(/\/$/, '') || '/';
  const isPartnerAboutRoute = Boolean(locationPrefixFromPath)
    && normalizedPath === partnerAboutPath;

  const [partnerActiveTab, setPartnerActiveTab] = useState('');
  const {
    partnerAboutError,
    partnerAboutLoading,
    partnerAboutSections,
    partnerAdvisoryBoard,
    partnerAdvisoryBoardError,
    partnerAdvisoryBoardLoading,
    partnerReferees,
    partnerRefereesError,
    partnerRefereesLoading,
  } = usePartnerAboutPageData(isPartnerAboutRoute, location.pathname);

  const tabsContainerRef = useRef(null);
  const tabRefs = useRef({});

  const partnerTabs = buildPartnerAboutTabsWithContent(partnerAboutSections);

  useEffect(() => {
    if (!isPartnerAboutRoute || partnerTabs.length === 0) return;
    const tab = searchParams.get('tab');
    if (tab && partnerTabs.some((t) => t.id === tab)) {
      setPartnerActiveTab(tab);
      return;
    }
    setPartnerActiveTab(partnerTabs[0].id);
  }, [isPartnerAboutRoute, partnerTabs, searchParams]);

  /** Legacy `/about#governance` etc. → `/about/mission-vision` */
  useEffect(() => {
    if (isPartnerAboutRoute) return;
    const raw = location.hash.replace(/^#/, '');
    if (!raw) return;
    const segment = LEGACY_HASH_TO_SEGMENT[raw];
    if (!segment) return;
    navigate(`${basePath}/${segment}`, { replace: true });
  }, [isPartnerAboutRoute, location.hash, basePath, navigate]);

  const pathSegment = normalizedPath.startsWith(`${basePath}/`)
    ? normalizedPath.slice(basePath.length + 1)
    : '';
  const activeSegment = ABOUT_NAV.some((t) => t.segment === pathSegment) ? pathSegment : ABOUT_NAV[0].segment;
  const currentTabIndex = ABOUT_NAV.findIndex((tab) => tab.segment === activeSegment);

  useEffect(() => {
    const activeTabElement = tabRefs.current[activeSegment];
    if (activeTabElement && tabsContainerRef.current) {
      const container = tabsContainerRef.current;
      const tabRect = activeTabElement.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      if (tabRect.left < containerRect.left) {
        activeTabElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      } else if (tabRect.right > containerRect.right) {
        activeTabElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'end' });
      }
    }
  }, [activeSegment]);

  const handleNextTab = () => {
    if (currentTabIndex < ABOUT_NAV.length - 1) {
      const next = ABOUT_NAV[currentTabIndex + 1];
      navigate(`${basePath}/${next.segment}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousTab = () => {
    if (currentTabIndex > 0) {
      const prev = ABOUT_NAV[currentTabIndex - 1];
      navigate(`${basePath}/${prev.segment}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const canGoPrevious = currentTabIndex > 0;
  const canGoNext = currentTabIndex < ABOUT_NAV.length - 1;

  if (isPartnerAboutRoute) {
    const activePartnerTab = partnerTabs.find((tab) => tab.id === partnerActiveTab) || partnerTabs[0];

    const renderPartnerAboutContent = () => {
      if (activePartnerTab?.type === 'advisory') {
        return (
          <div className="space-y-6">
            {partnerAdvisoryBoardError && (
              <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                {partnerAdvisoryBoardError}
              </p>
            )}
            {partnerAdvisoryBoardLoading ? (
              <p className="text-slate-500">Loading advisory board...</p>
            ) : partnerAdvisoryBoard.length === 0 ? (
              <p className="text-slate-600">No advisory board members are listed for this partner yet.</p>
            ) : (
              <AdvisoryBoardGrid members={partnerAdvisoryBoard} title="Advisory Board" />
            )}
          </div>
        );
      }

      if (activePartnerTab?.type === 'referees') {
        const members = partnerReferees.length > 0
          ? partnerReferees
          : REFEREES.map((item) => ({ ...item, id: item.id || item._id || item.name }));
        return (
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Official Referees & Judges</h2>
            {partnerRefereesError && <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">{partnerRefereesError}</p>}
            {partnerRefereesLoading ? (
              <p className="text-slate-500">Loading referees...</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map((person) => (
                  <PersonCard
                    key={person.id}
                    id={person.id}
                    name={person.name}
                    designation={person.designation}
                    image={person.image}
                  />
                ))}
              </div>
            )}
          </div>
        );
      }

      return (
        <div className="space-y-5">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{activePartnerTab?.heading || 'About'}</h2>
          {partnerAboutError && (
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
              {partnerAboutError}
            </p>
          )}
          {partnerAboutLoading ? (
            <p className="text-slate-500">Loading section...</p>
          ) : (
            /<[^>]+>/.test(activePartnerTab?.content || '') ? (
              <div
                className="text-slate-700 leading-relaxed prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: activePartnerTab?.content || '' }}
              />
            ) : (
              <div className="text-slate-700 leading-relaxed whitespace-pre-line">
                {activePartnerTab?.content || 'Content will be published soon.'}
              </div>
            )
          )}
        </div>
      );
    };

    return (
      <div className="animate-fadeIn min-h-screen flex flex-col">
        <div className="bg-white border-b border-slate-300 sticky top-0 z-30">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-10 overflow-x-auto scrollbar-hide">
              {partnerTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setPartnerActiveTab(tab.id);
                    setSearchParams({ tab: tab.id }, { replace: true });
                  }}
                  className={`py-3 text-sm md:text-base font-bold uppercase tracking-wide border-b-2 transition-colors whitespace-nowrap ${
                    partnerActiveTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab.label || tab.heading}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-grow bg-gradient-to-b from-slate-50 via-white to-slate-50">
          <div className="container mx-auto px-4 py-8">
            <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
              {renderPartnerAboutContent()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn bg-gradient-to-b from-slate-50 via-white to-slate-50 min-h-screen">
      {/* <div className="bg-white border-b border-slate-200 shadow-sm z-30">
        <div className="container mx-auto px-4 flex items-center gap-2">
          <button
            type="button"
            onClick={handlePreviousTab}
            disabled={!canGoPrevious}
            className={`p-2 rounded-lg transition-all ${
              canGoPrevious
                ? 'text-slate-600 hover:text-blue-600 hover:bg-slate-100 cursor-pointer'
                : 'text-slate-300 cursor-not-allowed'
            }`}
            aria-label="Previous tab"
          >
            <ChevronLeft size={20} />
          </button>

          <div ref={tabsContainerRef} className="flex gap-8 overflow-x-auto scrollbar-hide flex-1">
            {ABOUT_NAV.map((item) => (
              <span
                key={item.segment}
                ref={(el) => {
                  tabRefs.current[item.segment] = el;
                }}
                className="inline-flex"
              >
                <NavLink
                  to={`${basePath}/${item.segment}`}
                  className={({ isActive }) =>
                    `py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${
                      isActive
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-900'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={handleNextTab}
            disabled={!canGoNext}
            className={`p-2 rounded-lg transition-all ${
              canGoNext
                ? 'text-slate-600 hover:text-blue-600 hover:bg-slate-100 cursor-pointer'
                : 'text-slate-300 cursor-not-allowed'
            }`}
            aria-label="Next tab"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div> */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 min-h-[600px] transition-all duration-300">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AboutLayout;
