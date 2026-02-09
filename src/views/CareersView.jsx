import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';

const CareersView = () => {
  return (
    <div className="animate-fadeIn min-h-screen bg-white">
      {/* Hero — aligned with AboutLayout / app design system */}
      <section className="relative overflow-hidden bg-[#0f172a] text-white">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 py-20 md:py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-3xl"
          >
            <p className="text-blue-400 font-bold tracking-widest text-xs uppercase mb-4">Careers</p>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              Build the future of robotics sports with WORSO
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl">
              Join the global regulatory body for competitive robotics. We’re looking for people who want to set standards, run world-class events, and grow the sport.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Coming soon */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="max-w-xl mx-auto text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 mb-6">
            <Briefcase size={32} />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">Coming soon</h2>
          <p className="text-slate-500 leading-relaxed">
            We’re preparing our careers page and open roles. 
          </p>
        </motion.div>
      </section>
    </div>
  );
};

export default CareersView;
