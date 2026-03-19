const logoModules = import.meta.glob("../assets/log/*.{png,PNG,jpg,JPG,jpeg,JPEG,svg,SVG,webp,WEBP}", {
  eager: true,
  import: "default",
});

const logos = Object.entries(logoModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, url]) => url)
  .filter(Boolean);

const SIZE_CLASSES = {
  md: "h-16 md:h-24",
  lg: "h-20 md:h-28",
};

const LogoTicker = ({
  title = "Supporting Organizations & Think Tanks",
  size = "md",
  className = "",
  logos: logosProp,
}) => {
  const sourceLogos = Array.isArray(logosProp) && logosProp.length > 0 ? logosProp : logos;
  if (sourceLogos.length === 0) return null;

  // Repeat for smooth marquee loop
  const loop = [...sourceLogos, ...sourceLogos, ...sourceLogos];
  const sizeClass = SIZE_CLASSES[size] ?? SIZE_CLASSES.md;

  return (
    <section
      aria-label={title}
      className={[
        "bg-[black] border-t border-slate-200 dark:border-slate-800 py-8 overflow-hidden  ",
        className,
      ].join(" ")}
    >
      <div className="container mx-auto px-4 mb-6 text-center">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-widest">{title}</span>
      </div>
      <div className="flex gap-14 md:gap-16 animate-marquee whitespace-nowrap items-center w-[200%]">
        {loop.map((logo, i) => (
          <img
            key={i}
            src={logo}
            alt="Partner logo"
            className={`${sizeClass} w-auto transition-all duration-300 object-contain`}
            loading="lazy"
          />
        ))}
      </div>
    </section>
  );
};

export default LogoTicker;

