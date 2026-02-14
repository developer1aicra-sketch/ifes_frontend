import { useThemeClasses } from '../hooks/useThemeClasses';

const LiveTicker = ({ tickerText, siteConfig }) => {
  const theme = useThemeClasses();
  
  return (
  <div className={`${theme.bgGradient || 'bg-[#0b1120]'} text-white text-[10px] font-bold py-2 overflow-hidden relative z-50 border-b border-white/5`}>
    <div className="container mx-auto px-4 flex items-center">
      {/* <span className={`px-2 py-0.5 rounded text-white text-[9px] font-bold mr-4 uppercase tracking-wider ${siteConfig.is_partner ? 'bg-emerald-600' : 'bg-red-600'} animate-pulse`}>
        {siteConfig.is_partner ? 'UAE CHAPTER' : 'LIVE'}
      </span> */}
      <div className="whitespace-nowrap overflow-hidden flex-1 relative h-4">
        <div className="absolute top-0 left-0 whitespace-nowrap animate-marquee">
          {tickerText}
        </div>
      </div>
    </div>
  </div>
  );
};

export default LiveTicker;