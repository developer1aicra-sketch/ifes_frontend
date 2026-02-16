import { motion } from "framer-motion";
import { Crown } from "lucide-react";

export const HeroSection = ({ isRoboClub }) => {
  return (
    <div className={`relative py-20 px-4 sm:px-6 lg:px-8 ${isRoboClub ? '' : 'pt-16 pb-20'}`}>
      {/* Background gradient with blue accent */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto text-center relative z-10">
        <motion.h1
          className="text-4xl md:text-5xl text-black lg:text-6xl font-extrabold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Join Our <span className="text-blue-600">Robotics</span> Community
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          From beginners to experts, we have a place for everyone passionate about robotics and technology.
        </motion.p>
        <motion.button
          className="bg-blue-600 hover:bg-blue-700 text-sm text-white font-semibold py-3 px-8 rounded-full flex items-center mx-auto transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/20"
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