import { useParams } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import HomeView from './HomeView';

/**
 * Location-based route view
 * Handles routes like /RW, /RO, /AE, /CL
 * Shows home content with theme applied by LocationRouteHandler
 * 
 * Usage: Access theme in this component using useTheme() hook
 */
const LocationView = ({ setView, siteConfig, ...props }) => {
  const { locationCode } = useParams();
  const { themeConfig, selectedLocation } = useTheme();

  // Theme is handled by LocationRouteHandler component
  // This component just renders the view with theme already applied
  
  console.log(`[LocationView] Rendering for location: ${locationCode}, Theme: ${themeConfig?.theme || 'default'}, Selected: ${selectedLocation}`);

  // Show home view with theme applied and pass locationCode for partner home API
  return <HomeView setView={setView} siteConfig={siteConfig} locationCode={locationCode} {...props} />;
};

export default LocationView;
