import { motion } from "framer-motion";
import { Crown } from "lucide-react";

export const HeroSection = ({ isRoboClub }) => {
  return (
    <div className={`text-white py-20 px-4 sm:px-6 lg:px-8 ${isRoboClub ? '' : 'pt-16 pb-20'}`}>
      <div className="max-w-7xl mx-auto text-center">
        <motion.h1
          className="text-4xl md:text-5xl text-slate-900 lg:text-6xl font-extrabold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Join Our <span className="text-blue-600">Robotics</span> Community
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl text-slate-900 max-w-3xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          From beginners to experts, we have a place for everyone passionate about robotics and technology.
        </motion.p>
        <motion.button
          className=" bg-blue-600 hover:bg-red-700 text-sm text-white font-semibold py-3 px-8 rounded-full flex items-center mx-auto transition-all duration-300 transform hover:scale-105 shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <Crown className="mr-2" size={20} />
          Join 1800+ Industry Experts & Robo Masters
        </motion.button>
      </div>
    </div>
  );
};