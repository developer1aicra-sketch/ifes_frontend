// Theme color mapping utility
// Maps themeColor strings from API to Tailwind CSS color schemes

export const THEME_COLOR_MAP = {
  'Green': {
    theme: 'emerald',
    colors: {
      primary: 'bg-emerald-600',
      hover: 'hover:bg-emerald-700',
      text: 'text-emerald-600',
      textLight: 'text-emerald-500',
      gradient: 'bg-[#022c22]',
      border: 'border-emerald-600',
      ring: 'ring-emerald-500',
    },
    cssVariables: {
      '--theme-primary': '#059669',
      '--theme-primary-hover': '#047857',
      '--theme-text': '#059669',
      '--theme-gradient': '#022c22',
    },
  },
  'Blue': {
    theme: 'blue',
    colors: {
      primary: 'bg-blue-600',
      hover: 'hover:bg-blue-700',
      text: 'text-blue-600',
      textLight: 'text-blue-500',
      gradient: 'bg-[#0f172a]',
      border: 'border-blue-600',
      ring: 'ring-blue-500',
    },
    cssVariables: {
      '--theme-primary': '#2563eb',
      '--theme-primary-hover': '#1d4ed8',
      '--theme-text': '#2563eb',
      '--theme-gradient': '#0f172a',
    },
  },
  'Red': {
    theme: 'red',
    colors: {
      primary: 'bg-red-600',
      hover: 'hover:bg-red-700',
      text: 'text-red-600',
      textLight: 'text-red-500',
      gradient: 'bg-[#7f1d1d]',
      border: 'border-red-600',
      ring: 'ring-red-500',
    },
    cssVariables: {
      '--theme-primary': '#dc2626',
      '--theme-primary-hover': '#b91c1c',
      '--theme-text': '#dc2626',
      '--theme-gradient': '#7f1d1d',
    },
  },
  'Purple': {
    theme: 'purple',
    colors: {
      primary: 'bg-purple-600',
      hover: 'hover:bg-purple-700',
      text: 'text-purple-600',
      textLight: 'text-purple-500',
      gradient: 'bg-[#3b0764]',
      border: 'border-purple-600',
      ring: 'ring-purple-500',
    },
    cssVariables: {
      '--theme-primary': '#9333ea',
      '--theme-primary-hover': '#7e22ce',
      '--theme-text': '#9333ea',
      '--theme-gradient': '#3b0764',
    },
  },
  'Orange': {
    theme: 'orange',
    colors: {
      primary: 'bg-orange-600',
      hover: 'hover:bg-orange-700',
      text: 'text-orange-600',
      textLight: 'text-orange-500',
      gradient: 'bg-[#7c2d12]',
      border: 'border-orange-600',
      ring: 'ring-orange-500',
    },
    cssVariables: {
      '--theme-primary': '#ea580c',
      '--theme-primary-hover': '#c2410c',
      '--theme-text': '#ea580c',
      '--theme-gradient': '#7c2d12',
    },
  },
  'Yellow': {
    theme: 'yellow',
    colors: {
      primary: 'bg-yellow-600',
      hover: 'hover:bg-yellow-700',
      text: 'text-yellow-600',
      textLight: 'text-yellow-500',
      gradient: 'bg-[#713f12]',
      border: 'border-yellow-600',
      ring: 'ring-yellow-500',
    },
    cssVariables: {
      '--theme-primary': '#ca8a04',
      '--theme-primary-hover': '#a16207',
      '--theme-text': '#ca8a04',
      '--theme-gradient': '#713f12',
    },
  },
};

/**
 * Gets theme configuration based on themeColor string
 * @param {string} themeColor - Theme color name (e.g., "Green", "Blue")
 * @returns {Object} Theme configuration object
 */
export const getThemeConfig = (themeColor) => {
  const normalizedColor = themeColor?.trim() || 'Blue';
  return THEME_COLOR_MAP[normalizedColor] || THEME_COLOR_MAP['Blue'];
};

/**
 * Applies CSS variables to the document root with smooth transitions
 * @param {string} themeColor - Theme color name
 */
export const applyThemeVariables = (themeColor) => {
  if (typeof document === 'undefined') {
    console.warn('[Theme] Cannot apply theme variables: document is undefined');
    return;
  }
  
  const themeConfig = getThemeConfig(themeColor);
  const root = document.documentElement;
  const body = document.body;
  
  if (!root || !body) {
    console.warn('[Theme] Cannot apply theme variables: root or body not found');
    return;
  }
  
  console.log(`[Theme] Applying CSS variables for theme: ${themeColor} (${themeConfig.theme})`);
  
  // Add transition class for smooth theme changes
  root.classList.add('theme-transitioning');
  
  // Apply CSS variables
  Object.entries(themeConfig.cssVariables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
    console.log(`[Theme] Set CSS variable: ${key} = ${value}`);
  });
  
  // Add theme class to body for global styling
  body.setAttribute('data-theme', themeConfig.theme);
  
  // Add theme class to root element as well
  root.setAttribute('data-theme', themeConfig.theme);
  
  console.log(`[Theme] Applied data-theme="${themeConfig.theme}" to body and root`);
  
  // Remove transition class after animation completes
  setTimeout(() => {
    root.classList.remove('theme-transitioning');
  }, 300);
};

/**
 * Gets theme color value as hex/rgb for inline styles
 * @param {string} themeColor - Theme color name
 * @param {string} property - CSS variable property name (e.g., 'primary', 'text')
 * @returns {string} Color value
 */
export const getThemeColorValue = (themeColor, property = 'primary') => {
  const config = getThemeConfig(themeColor);
  const varMap = {
    primary: '--theme-primary',
    hover: '--theme-primary-hover',
    text: '--theme-text',
    gradient: '--theme-gradient',
  };
  
  return config.cssVariables[varMap[property]] || config.cssVariables['--theme-primary'];
};

/**
 * Removes theme CSS variables from document root
 */
export const removeThemeVariables = () => {
  const root = document.documentElement;
  Object.keys(THEME_COLOR_MAP['Blue'].cssVariables).forEach((key) => {
    root.style.removeProperty(key);
  });
};
