import React, { createContext, useContext, useState, useEffect } from 'react';
import { getThemeConfig, applyThemeVariables } from '../utils/theme';

const THEME_STORAGE_KEY = 'worso_selected_theme';
const LOCATION_STORAGE_KEY = 'worso_selected_location';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  // Load persisted theme from localStorage on mount
  const [themeColor, setThemeColor] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(THEME_STORAGE_KEY) || null;
    }
    return null;
  });
  
  const [selectedLocation, setSelectedLocation] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(LOCATION_STORAGE_KEY) || null;
    }
    return null;
  });
  
  const [themeConfig, setThemeConfig] = useState(null);

  useEffect(() => {
    const effectiveTheme = themeColor || 'Blue';
    const config = getThemeConfig(effectiveTheme);
    setThemeConfig(config);
    applyThemeVariables(effectiveTheme);
    if (themeColor && typeof window !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, themeColor);
    }
  }, [themeColor]);

  const updateTheme = (newThemeColor, locationCode = null) => {
    setThemeColor(newThemeColor);
    
    // Persist location if provided
    if (locationCode && typeof window !== 'undefined') {
      localStorage.setItem(LOCATION_STORAGE_KEY, locationCode);
      setSelectedLocation(locationCode);
    }
  };

  const clearTheme = () => {
    setThemeColor(null);
    setSelectedLocation(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(THEME_STORAGE_KEY);
      localStorage.removeItem(LOCATION_STORAGE_KEY);
    }
  };

  const value = {
    themeColor,
    themeConfig,
    selectedLocation,
    updateTheme,
    clearTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
