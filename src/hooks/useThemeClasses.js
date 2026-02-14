import { useTheme } from '../contexts/ThemeContext';
import { getThemeConfig } from '../utils/theme';

/**
 * Hook to get theme-aware CSS classes
 * Provides easy access to theme colors throughout the application
 */
export const useThemeClasses = () => {
  const { themeConfig, themeColor } = useTheme();
  
  // Get theme config (fallback to blue if no theme)
  const config = themeConfig || getThemeConfig('Blue');
  
  return {
    // Background colors
    bgPrimary: config.colors.primary,
    bgGradient: config.colors.gradient,
    bgHover: config.colors.hover,
    
    // Text colors
    textPrimary: config.colors.text,
    textLight: config.colors.textLight,
    
    // Border colors
    borderPrimary: config.colors.border,
    
    // Ring colors (for focus states)
    ringPrimary: config.colors.ring,
    
    // Theme name
    themeName: config.theme,
    
    // Full config for advanced usage
    themeConfig: config,
    
    // Check if theme is active
    hasTheme: !!themeColor,
  };
};

/**
 * Get theme-aware button classes
 * @param {string} variant - 'primary', 'secondary', 'outline', 'ghost'
 * @param {boolean} isActive - Whether button is in active state
 */
export const useThemeButton = (variant = 'primary', isActive = false) => {
  const classes = useThemeClasses();
  
  const variants = {
    primary: `${classes.bgPrimary} ${classes.textLight} ${classes.bgHover} text-white`,
    secondary: `bg-slate-700 hover:bg-slate-600 text-white`,
    outline: `border-2 ${classes.borderPrimary} ${classes.textPrimary} hover:${classes.bgPrimary} hover:text-white`,
    ghost: `${classes.textPrimary} hover:${classes.bgPrimary} hover:text-white hover:bg-opacity-10`,
  };
  
  const baseClasses = 'px-4 py-2 rounded-lg font-semibold transition-all duration-200';
  const activeClasses = isActive ? `${classes.bgPrimary} text-white shadow-lg` : '';
  
  return `${baseClasses} ${variants[variant]} ${activeClasses}`.trim();
};

/**
 * Get theme-aware link classes
 */
export const useThemeLink = () => {
  const classes = useThemeClasses();
  
  return {
    default: `${classes.textPrimary} hover:${classes.textLight} underline-offset-4 hover:underline transition-colors`,
    button: `${classes.bgPrimary} ${classes.textLight} ${classes.bgHover} text-white px-4 py-2 rounded-lg font-semibold transition-all`,
    nav: `${classes.textLight} hover:text-white transition-colors`,
  };
};
