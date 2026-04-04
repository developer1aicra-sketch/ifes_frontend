import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Sparkles, Cpu, Users, Trophy, BadgeCheck } from 'lucide-react';
import { ROBOCLUB_ABOUT } from '../../constants/roboclubLandingData';

const iconMap = {
  cpu: Cpu,
  users: Users,
  trophy: Trophy,
  badge: BadgeCheck,
};

const AboutRoboClubSection = () => (
  <section id="about-robo" className="relative py-24 bg-slate-950 border-t border-slate-900 overflow-hidden">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
    <div className="absolute top-20 right-0 w-[420px] h-[420px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
    <div className="absolute bottom-0 left-10 w-[380px] h-[380px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

    <div className="relative z-10 max-w-6xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <span className="inline-flex items-center gap-2 text-cyan-400 font-bold tracking-[0.2em] text-xs uppercase">
          <Sparkles className="w-4 h-4" />
          About RoboClub
        </span>
        <h2 className="text-4xl md:text-5xl font-black text-white mt-4 leading-tight">
          {ROBOCLUB_ABOUT.headline}
        </h2>
        <p className="text-slate-400 text-lg mt-6 leading-relaxed">{ROBOCLUB_ABOUT.intro}</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {[
          {
            title: 'Mission',
            body: ROBOCLUB_ABOUT.mission,
            Icon: Target,
            grad: 'from-cyan-500/20 to-transparent',
          },
          {
            title: 'Vision',
            body: ROBOCLUB_ABOUT.vision,
            Icon: Eye,
            grad: 'from-violet-500/20 to-transparent',
          },
          {
            title: 'Who Can Join',
            body: ROBOCLUB_ABOUT.purpose,
            Icon: Sparkles,
            grad: 'from-fuchsia-500/20 to-transparent',
          },
        ].map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className={`relative rounded-2xl border border-slate-800 bg-gradient-to-br ${card.grad} p-6 backdrop-blur-sm`}
          >
            <div className="w-12 h-12 rounded-xl bg-slate-900/80 border border-slate-700 flex items-center justify-center mb-4">
              <card.Icon className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{card.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{card.body}</p>
          </motion.div>
        ))}
      </div>

      <div>
        <h3 className="text-center text-sm font-bold uppercase tracking-widest text-slate-500 mb-10">
          What you gain by joining
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ROBOCLUB_ABOUT.gains.map((item, i) => {
            const Icon = iconMap[item.icon] || Cpu;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-5 hover:border-cyan-500/40 transition-colors"
              >
                <div className="w-11 h-11 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-white font-bold mb-2">{item.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{item.blurb}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);

export default AboutRoboClubSection;
