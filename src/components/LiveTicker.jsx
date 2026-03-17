export const LiveTicker = ({ news, tickerText }) => {
  const items = Array.isArray(news) ? news : tickerText ? [tickerText] : [];

  if (items.length === 0) return null;

  return (
    <marquee className="bg-black text-white text-xs  font-mono py-2 overflow-hidden border-b border-gray-800 sticky top-0 z-50">
      <div className="relative flex overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {items.map((item, i) => (
            <span key={i} className="flex items-center mx-6">
              <span className="text-red-500 mr-2">&gt;&gt;</span>
              {item}
            </span>
          ))}
        </div>

        {/* Duplicate content for seamless loop */}
        <div className="flex whitespace-nowrap animate-marquee">
          {items.map((item, i) => (
            <span key={`dup-${i}`} className="flex items-center mx-6">
              <span className="text-red-500 mr-2">&gt;&gt;</span>
              {item}
            </span>
          ))}
        </div>
      </div>
    </marquee>
  );
};
