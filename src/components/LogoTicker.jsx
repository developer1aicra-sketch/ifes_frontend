import { THINK_TANK_LOGOS } from '../constants/data';

const LogoTicker = () => (
  <div className="bg-slate-50 border-t border-slate-200 py-8 overflow-hidden">
    <div className="container mx-auto px-4 mb-6 text-center">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Supporting Organizations & Think Tanks</span>
    </div>
    <div className="flex gap-16 animate-marquee whitespace-nowrap items-center w-[200%]">
      {[...THINK_TANK_LOGOS, ...THINK_TANK_LOGOS, ...THINK_TANK_LOGOS].map((logo, i) => (
        <img
          key={i}
          src={logo}
          alt="Partner"
          className="h-8 md:h-10 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
        />
      ))}
    </div>
  </div>
);

export default LogoTicker;

