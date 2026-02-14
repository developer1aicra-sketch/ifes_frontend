/**
 * Example Component: How to Access Theme in Routes
 * 
 * This file demonstrates different ways to access and use theme in route components
 */

import { useTheme } from '../contexts/ThemeContext';
import { useThemeClasses } from '../hooks/useThemeClasses';
import { useRouteThemeAccess } from '../hooks/useRouteThemeAccess';
import { ThemeButton } from '../components/ThemeWrapper';

// Example 1: Basic Theme Access
export const BasicThemeExample = () => {
  const { themeConfig, themeColor, selectedLocation } = useTheme();
  
  return (
    <div className={`min-h-screen ${themeConfig?.colors.gradient || 'bg-slate-900'} text-white p-8`}>
      <h1 className={`text-4xl font-bold ${themeConfig?.colors.textLight || 'text-white'}`}>
        Current Theme: {themeColor || 'Default'}
      </h1>
      <p className="text-lg mt-4">
        Location: {selectedLocation || 'Global'}
      </p>
    </div>
  );
};

// Example 2: Using Theme Classes Hook
export const ThemeClassesExample = () => {
  const theme = useThemeClasses();
  
  return (
    <div className={`min-h-screen ${theme.bgGradient} text-white p-8`}>
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-4xl font-bold ${theme.textLight} mb-6`}>
          Theme Classes Example
        </h1>
        
        <div className="space-y-4">
          <button className={`${theme.bgPrimary} px-6 py-3 rounded-lg font-semibold`}>
            Primary Button
          </button>
          
          <p className={theme.textPrimary}>
            This text uses primary theme color
          </p>
          
          <div className={`border-2 ${theme.borderPrimary} p-4 rounded-lg`}>
            Bordered container with theme border
          </div>
        </div>
      </div>
    </div>
  );
};

// Example 3: Route-Specific Theme Access
export const RouteThemeExample = () => {
  const { theme, locationCode, isLocationRoute, selectedLocation } = useRouteThemeAccess();
  
  return (
    <div className={`min-h-screen ${theme.bgGradient} text-white p-8`}>
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-4xl font-bold ${theme.textLight} mb-6`}>
          Route Theme Access Example
        </h1>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 space-y-4">
          <div>
            <p className="text-sm opacity-75">Is Location Route:</p>
            <p className="text-xl font-bold">{isLocationRoute ? 'Yes' : 'No'}</p>
          </div>
          
          {locationCode && (
            <div>
              <p className="text-sm opacity-75">Location Code:</p>
              <p className="text-xl font-bold">{locationCode}</p>
            </div>
          )}
          
          <div>
            <p className="text-sm opacity-75">Selected Location:</p>
            <p className="text-xl font-bold">{selectedLocation || 'None'}</p>
          </div>
          
          <div>
            <p className="text-sm opacity-75">Theme Name:</p>
            <p className="text-xl font-bold">{theme.themeName}</p>
          </div>
        </div>
        
        <div className="mt-8 space-x-4">
          <ThemeButton variant="primary">
            Themed Button
          </ThemeButton>
          
          <ThemeButton variant="outline">
            Outline Button
          </ThemeButton>
        </div>
      </div>
    </div>
  );
};

// Example 4: Conditional Theme Based on Route
export const ConditionalThemeExample = () => {
  const { theme, isLocationRoute, locationCode } = useRouteThemeAccess();
  
  if (isLocationRoute) {
    return (
      <div className={`min-h-screen ${theme.bgGradient} text-white p-8`}>
        <div className="max-w-4xl mx-auto">
          <h1 className={`text-4xl font-bold ${theme.textLight}`}>
            Location-Specific View: {locationCode}
          </h1>
          <p className="mt-4 text-lg">
            This view shows location-specific content with theme applied
          </p>
          <button className={`${theme.bgPrimary} px-6 py-3 rounded-lg mt-6`}>
            Location Action
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold">Default View</h1>
        <p className="mt-4 text-lg">
          This is the default view (not a location route)
        </p>
      </div>
    </div>
  );
};

// Example 5: Complete Route Component with Theme
export const CompleteRouteExample = ({ setView, siteConfig }) => {
  const { theme, locationCode, isLocationRoute, selectedLocation } = useRouteThemeAccess();
  const { themeConfig, themeColor } = useTheme();
  
  return (
    <div className={`min-h-screen ${theme.bgGradient} transition-all duration-300`}>
      {/* Header */}
      <header className={`${theme.bgPrimary} text-white p-6`}>
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">
            {isLocationRoute ? `${locationCode} Region` : 'WORSO'}
          </h1>
          <p className="text-sm opacity-90">
            Theme: {themeColor || 'Default'} | Location: {selectedLocation || 'Global'}
          </p>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-white">
          <h2 className={`text-3xl font-bold ${theme.textLight} mb-4`}>
            Welcome to {locationCode || 'WORSO'}
          </h2>
          
          <p className="text-lg mb-6">
            This component demonstrates complete theme access in routes.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className={`${theme.bgPrimary} p-4 rounded-lg`}>
              <p className="font-bold">Primary Color</p>
              <p className="text-sm">{themeConfig?.theme || 'default'}</p>
            </div>
            
            <div className={`border-2 ${theme.borderPrimary} p-4 rounded-lg`}>
              <p className="font-bold">Border Color</p>
              <p className="text-sm">{theme.themeName}</p>
            </div>
            
            <div className={`${theme.textPrimary} p-4 rounded-lg bg-white/5`}>
              <p className="font-bold">Text Color</p>
              <p className="text-sm">{themeColor || 'default'}</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <ThemeButton variant="primary" onClick={() => setView('home')}>
              Go Home
            </ThemeButton>
            
            <ThemeButton variant="outline" onClick={() => setView('teams')}>
              View Teams
            </ThemeButton>
          </div>
        </div>
      </main>
    </div>
  );
};
