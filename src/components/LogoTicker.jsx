const logoModules = import.meta.glob("../assets/log/*.{png,PNG,jpg,JPG,jpeg,JPEG,svg,SVG,webp,WEBP}", {
  eager: true,
  import: "default",
});

const logos = Object.entries(logoModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, url]) => url)
  .filter(Boolean);

const LogoTicker = ({ title = "Supporting Organizations & Think Tanks" }) => {
  if (logos.length === 0) return null;

  // Repeat for smooth marquee loop
  const loop = [...logos, ...logos, ...logos];

  return (
    <div className="bg-slate-50 border-t border-slate-200 py-8 overflow-hidden">
      <div className="container mx-auto px-4 mb-6 text-center">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</span>
      </div>
      <div className="flex gap-14 md:gap-16 animate-marquee whitespace-nowrap items-center w-[200%]">
        {loop.map((logo, i) => (
          <img
            key={i}
            src={logo}
            alt="Partner logo"
            className="h-14 w-auto md:h-20    transition-all duration-300 object-contain"
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
};

export default LogoTicker;

