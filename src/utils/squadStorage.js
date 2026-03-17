/**
 * Local Storage utilities for Squad Manager
 * This provides a fallback when the backend API is not available
 * In production, these should be replaced with actual API calls
 */

const STORAGE_KEYS = {
    CLUBS: 'squad_clubs',
    TEAMS: 'squad_teams',
    ACTIVE_CLUB_PREFIX: 'squad_active_club_', // + userId
  };
  
  // ===== Clubs =====
  export const getClubsFromStorage = (userId) => {
    try {
      const clubs = JSON.parse(localStorage.getItem(STORAGE_KEYS.CLUBS) || '[]');
      return clubs.filter(club => club.ownerId === userId);
    } catch (error) {
      console.error('Error reading clubs from storage:', error);
      return [];
    }
  };
  
  export const saveClubToStorage = (club) => {
    try {
      const clubs = JSON.parse(localStorage.getItem(STORAGE_KEYS.CLUBS) || '[]');
      const existingIndex = clubs.findIndex(c => c.id === club.id);
      
      if (existingIndex >= 0) {
        clubs[existingIndex] = club;
      } else {
        clubs.push(club);
      }
      
      localStorage.setItem(STORAGE_KEYS.CLUBS, JSON.stringify(clubs));
      return club;
    } catch (error) {
      console.error('Error saving club to storage:', error);
      throw error;
    }
  };
  
  // ===== Active club (play vs manage) =====
  export const getActiveClubIdFromStorage = (userId) => {
    if (!userId) return null;
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_CLUB_PREFIX + userId) || null;
    } catch (error) {
      return null;
    }
  };
  
  export const setActiveClubIdToStorage = (userId, clubId) => {
    if (!userId) return;
    try {
      if (clubId) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_CLUB_PREFIX + userId, clubId);
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_CLUB_PREFIX + userId);
      }
    } catch (error) {
      console.error('Error saving active club to storage:', error);
    }
  };
  
  // ===== Clubs =====
  export const deleteClubFromStorage = (clubId) => {
    try {
      const clubs = JSON.parse(localStorage.getItem(STORAGE_KEYS.CLUBS) || '[]');
      const filtered = clubs.filter(c => c.id !== clubId);
      localStorage.setItem(STORAGE_KEYS.CLUBS, JSON.stringify(filtered));
      
      // Also delete associated teams
      const teams = JSON.parse(localStorage.getItem(STORAGE_KEYS.TEAMS) || '[]');
      const filteredTeams = teams.filter(t => t.clubId !== clubId);
      localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(filteredTeams));
      
      return true;
    } catch (error) {
      console.error('Error deleting club from storage:', error);
      throw error;
    }
  };
  
  // ===== Teams =====
  export const getTeamsFromStorage = (clubId) => {
    try {
      const teams = JSON.parse(localStorage.getItem(STORAGE_KEYS.TEAMS) || '[]');
      return teams.filter(team => team.clubId === clubId);
    } catch (error) {
      console.error('Error reading teams from storage:', error);
      return [];
    }
  };
  
  export const saveTeamToStorage = (team) => {
    try {
      const teams = JSON.parse(localStorage.getItem(STORAGE_KEYS.TEAMS) || '[]');
      const existingIndex = teams.findIndex(t => t.id === team.id);
      
      if (existingIndex >= 0) {
        teams[existingIndex] = team;
      } else {
        teams.push(team);
      }
      
      localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
      return team;
    } catch (error) {
      console.error('Error saving team to storage:', error);
      throw error;
    }
  };
  
  export const deleteTeamFromStorage = (teamId) => {
    try {
      const teams = JSON.parse(localStorage.getItem(STORAGE_KEYS.TEAMS) || '[]');
      const filtered = teams.filter(t => t.id !== teamId);
      localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error deleting team from storage:', error);
      throw error;
    }
  };
  
  // ===== Helper Functions =====
  export const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };
  
  export const clearSquadStorage = () => {
    localStorage.removeItem(STORAGE_KEYS.CLUBS);
    localStorage.removeItem(STORAGE_KEYS.TEAMS);
  };
  