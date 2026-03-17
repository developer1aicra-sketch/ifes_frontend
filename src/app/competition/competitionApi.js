import axiosInstance from '../../api/axiosInstance';
import endpoints from '../../api/endpoints';

export const fetchCompetitions = () => axiosInstance.get(endpoints.competition.list);

export const fetchCompetition = (id) => {
  const competitionId = String(id ?? '').trim();
  if (!competitionId) throw new Error('Competition id is required');
  return axiosInstance.get(endpoints.competition.details(competitionId));
};

