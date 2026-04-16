// const logoModules = import.meta.glob("../assets/log/*.{png,PNG,jpg,JPG,jpeg,JPEG,svg,SVG,webp,WEBP}", {
//   eager: true,
//   import: "default",
// });

// const logos = Object.entries(logoModules)
//   .sort(([a], [b]) => a.localeCompare(b))
//   .map(([, url]) => url)
//   .filter(Boolean);

// const SIZE_CLASSES = {
//   md: "h-16 md:h-24",
//   lg: "h-20 md:h-28",
// };

// const LogoTicker = ({
//   title = "Supporting Organizations & Think Tanks",
//   size = "md",
//   className = "",
//   logos: logosProp,
// }) => {
//   const sourceLogos = Array.isArray(logosProp) && logosProp.length > 0 ? logosProp : logos;
//   if (sourceLogos.length === 0) return null;

//   // Repeat for smooth marquee loop
//   const loop = [...sourceLogos, ...sourceLogos, ...sourceLogos];
//   const sizeClass = SIZE_CLASSES[size] ?? SIZE_CLASSES.md;

//   return (
//     <section
//       aria-label={title}
//       className={[
//         // "bg-[black] border-t border-slate-200 dark:border-slate-800 py-8 overflow-hidden ",

//         // updated code
//         "bg-gradient-to-b mt-10 from-slate-950 via-slate-900 to-black border-t border-cyan-500/10 py-8 overflow-hidden relative",
//         className,
//       ].join(" ")}
//     >
//       <div className="container mx-auto px-4 mb-6 text-center">
//         <span className="text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-widest">{title}</span>
//       </div>
//       <div className="flex gap-14 md:gap-16 animate-marquee whitespace-nowrap items-center w-[200%]">
//         {loop.map((logo, i) => (
//           <img
//             key={i}
//             src={logo}
//             alt="Partner logo"
//             className={`${sizeClass} w-auto transition-all duration-300 object-contain`}
//             loading="lazy"
//           />
//         ))}
//       </div>
//     </section>
//   );
// };

// export default LogoTicker;



//latest code
const logoModules = import.meta.glob(
  "../assets/log/*.{png,PNG,jpg,JPG,jpeg,JPEG,svg,SVG,webp,WEBP}",
  {
    eager: true,
    import: "default",
  }
);

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
  const sourceLogos =
    Array.isArray(logosProp) && logosProp.length > 0 ? logosProp : logos;

  if (sourceLogos.length === 0) return null;

  const loop = [...sourceLogos, ...sourceLogos, ...sourceLogos];
  const sizeClass = SIZE_CLASSES[size] ?? SIZE_CLASSES.md;

  return (
    <section
      aria-label={title}
      className={[
        // 🎨 Updated color theme (cyan + purple consistent)
        "relative mt-10 py-8 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-black border-t border-cyan-500/20",
        className,
      ].join(" ")}
    >
      {/* Title */}
      <div className="container mx-auto px-4 mb-6 text-center">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {title}
        </span>
      </div>

      {/* Marquee */}
      <div className="flex gap-14 md:gap-16 animate-marquee whitespace-nowrap items-center w-[200%]">
        {loop.map((logo, i) => (
          <img
            key={i}
            src={logo}
            alt="Partner logo"
            className={`${sizeClass} w-auto object-contain transition-all duration-300 opacity-80 hover:opacity-100`}
            loading="lazy"
          />
        ))}
      </div>

      {/* Subtle glow overlay (matches site theme) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.05),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(168,85,247,0.05),transparent_40%)]" />
    </section>
  );
};

export default LogoTicker;

