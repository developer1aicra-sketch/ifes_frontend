// import { motion } from "framer-motion";
// import { Crown } from "lucide-react";

// export const HeroSection = ({ isRoboClub }) => {
//   return (
//     <div className={`relative py-20 px-4 sm:px-6 lg:px-8 ${isRoboClub ? '' : 'pt-16 pb-20'}`}>
//       {/* Background gradient with blue accent */}
//       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl -z-10"></div>
      
//       <div className="container mx-auto text-center relative z-10">
//         <motion.h1
//           className="text-4xl md:text-5xl text-black lg:text-6xl font-extrabold mb-6"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//         >
//           Join Our <span className="text-blue-600">IFES</span> Community
//         </motion.h1>
//         <motion.p
//           className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.2 }}
//         >
//           From beginners to experts, we have a place for everyone passionate about robotics and technology.
//         </motion.p>
//         <motion.button
//           className="bg-blue-600 hover:bg-blue-700 text-sm text-white font-semibold py-3 px-8 rounded-full flex items-center mx-auto transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/20"
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.98 }}
//         >
//           <Crown className="mr-2" size={20} />
//           Join 1800+ Industry Experts & IFeS Masters
//         </motion.button>
//       </div>
//     </div>
//   );
// };


// updated code 

import React from "react";
import { motion } from "framer-motion";
import { Crown } from "lucide-react";

export const HeroSection = ({ isRoboClub }) => {
  return (
    <section className="relative min-h-[90vh] w-full bg-[#020617] overflow-hidden flex items-center justify-center">
      
      {/* 1. Background Grid - Jo screenshot mein dikh rahi hai */}
      <div 
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)`,
          backgroundSize: '45px 45px'
        }}
      ></div>

      {/* 2. Radial Glow Effects (Theme colors: Cyan & Navy) */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] -z-10"></div>

      <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
        
        {/* 🔥 Badge Style Label */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1.5 mb-6 rounded-full border border-cyan-500/30 bg-cyan-500/5 backdrop-blur-sm"
        >
          <span className="text-cyan-400 text-xs font-bold tracking-[0.2em] uppercase">
            Global Tech Network
          </span>
        </motion.div>

        {/* 🏆 Main Heading - Dark Theme Style */}
        <motion.h1
          className="text-5xl md:text-7xl font-black text-white leading-tight mb-8 tracking-tight"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          Join Our{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
            IFeS Community
          </span>
        </motion.h1>

        {/* 📄 Description - Light Gray/Blue for Dark Background */}
        <motion.p
          className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          From beginners to experts, we have a place for everyone passionate about 
          <span className="text-white font-medium"> Gaming And E-Sport</span>. 
          Uniting innovators to shape the future of tech.
        </motion.p>

        {/* 🚀 Button - High Intensity Neon Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.button
            className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-xl font-bold text-white 
                       bg-gradient-to-r from-blue-600 to-cyan-500 
                       hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Crown className="text-white group-hover:rotate-12 transition-transform" size={20} />
            <span className="tracking-wide">Join 1800+ Industry Experts</span>
            
            {/* Subtle glow under button */}
            <div className="absolute inset-0 rounded-xl bg-cyan-400 blur-lg opacity-0 group-hover:opacity-20 transition-opacity"></div>
          </motion.button>
        </motion.div>

        {/* ⚡ Bottom Decorative Line */}
        <div className="mt-20 w-full max-w-md mx-auto h-[1px] bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
      </div>
    </section>
  );
};