export const LiveTicker = ({ news, tickerText }) => {
  const items = Array.isArray(news) ? news : tickerText ? [tickerText] : [];

  const logoModules = import.meta.glob("../assets/log/*.{png,PNG,jpg,JPG,jpeg,JPEG,svg,SVG,webp,WEBP}", {
    eager: true,
    import: "default",
  });

  const logos = Object.entries(logoModules)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, url]) => url)
    .filter(Boolean);

  if (items.length === 0 && logos.length === 0) return null;

  const segments = [
    ...logos.map((src, i) => ({
      key: `logo-${i}`,
      node: (
        <span className="flex items-center mx-6" aria-hidden="true">
          <img src={src} alt="" className="h-5 w-auto object-contain" loading="lazy" />
        </span>
      ),
    })),
    ...items.map((item, i) => ({
      key: `text-${i}`,
      node: (
        <span className="flex items-center mx-6">
          <span className="text-red-500 mr-2">&gt;&gt;</span>
          {item}
        </span>
      ),
    })),
  ];

  return (
    <marquee className="bg-black text-white text-xs  font-mono py-2 overflow-hidden border-b border-gray-800 sticky top-0 z-50">
      <div className="relative flex overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {segments.map(({ key, node }) => (
            <span key={key}>{node}</span>
          ))}
        </div>

        {/* Duplicate content for seamless loop */}
        <div className="flex whitespace-nowrap animate-marquee">
          {segments.map(({ key, node }) => (
            <span key={`dup-${key}`}>{node}</span>
          ))}
        </div>
      </div>
    </marquee>
  );
};
