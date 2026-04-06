import { ADVISORY_BOARD } from '../../../data/aboutPeople';
import AdvisoryBoardGrid from '../../../components/about/AdvisoryBoardGrid';

const AdvisoryBoardPage = () => (
  <div>
    <AdvisoryBoardGrid members={ADVISORY_BOARD} />
  </div>
);

export default AdvisoryBoardPage;
