/**
 * WRC Hall of Fame — club marks bundled under src/assets/clublogo/.
 * Keys are WRC_WINNERS_RANKING[].id so filenames can change without touching UI.
 */
import logoAtom from '../assets/clublogo/ATOM.jpg';
import logoHarimohan from '../assets/clublogo/Harimohan Science Club.png';
import logoHeavyDrivers from '../assets/clublogo/HEAVY DRIVERS.jpeg';
import logoKarmayodha from '../assets/clublogo/KarmayodhaBots.png';
import logoRoboOdisha from '../assets/clublogo/RoboOdisha.png';
import logoRoboticsAviation from '../assets/clublogo/Robotics and AviationClub.png';
import logoTeamWarriors from '../assets/clublogo/Team Warriors.jpeg';
import logoTeamXenon from '../assets/clublogo/Team Xenon.png';
import logoWrcAze from '../assets/clublogo/wrc_aze.jpeg';

export const WRC_CLUB_LOGO_BY_WINNER_ID = {
  'wrc-2025-01': logoRoboOdisha,
  'wrc-2025-02': logoTeamWarriors,
  'wrc-2025-03': logoHeavyDrivers,
  'wrc-2025-04': logoRoboticsAviation,
  'wrc-2025-05': logoWrcAze,
  'wrc-2025-06': logoKarmayodha,
  'wrc-2025-07': logoAtom,
  'wrc-2025-08': logoTeamXenon,
  'wrc-2025-10': logoHarimohan,
};
