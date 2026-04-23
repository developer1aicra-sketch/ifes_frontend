import AboutWorsoPage from './pages/AboutWorsoPage';
import MissionVisionPage from './pages/MissionVisionPage';
import StrategyPage from './pages/StrategyPage';
import PresidentMessagePage from './pages/PresidentMessagePage';
import AdvisoryBoardPage from './pages/AdvisoryBoardPage';
import ExecutiveCommitteePage from './pages/ExecutiveCommitteePage';
import FederationServicesPage from './pages/FederationServicesPage';
import TechForGoodPage from './pages/TechForGoodPage';
import WorkingAtWorsoPage from './pages/WorkingAtWorsoPage';
import RefereesPage from './pages/RefereesPage';

/** Ordered list matching `aboutRouteConfig.ABOUT_NAV` */
export const ABOUT_PAGE_ROUTES = [
  { path: 'about-ifes', Component: AboutWorsoPage },
  { path: 'mission-vision', Component: MissionVisionPage },
  { path: 'strategy', Component: StrategyPage },
  { path: 'presidents-message', Component: PresidentMessagePage },
  { path: 'advisory-board', Component: AdvisoryBoardPage },
  { path: 'executive-committee', Component: ExecutiveCommitteePage },
  { path: 'federation-services', Component: FederationServicesPage },
  { path: 'tech-for-good', Component: TechForGoodPage },
  { path: 'working-at-worso', Component: WorkingAtWorsoPage },
  { path: 'referees', Component: RefereesPage },
];
