import { motion } from "framer-motion";
import { ArrowRight, BriefcaseBusiness } from "lucide-react";
import { HeroSection, WorsoOrgMembershipTierSection } from "../components/membership";

const ProfessionalMembershipView = ({ setView }) => {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection isRoboClub={false} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <motion.div
          className="max-w-5xl mx-auto mb-10 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
            <BriefcaseBusiness className="w-4 h-4" />
            <span className="text-sm font-semibold">Professional Membership</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-black mt-5">
            Grow your credibility, reach, and impact
          </h2>
          <p className="text-gray-600 mt-3">
            For coaches, trainers, innovators, and high-value partners seeking recognition and access.
          </p>

          {setView && (
            <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                href="#comparison"
                className="border border-gray-300 hover:border-gray-400 text-black font-semibold py-3 px-8 rounded-xl inline-flex items-center justify-center gap-2 bg-white"
              >
                Explore benefits
                <ArrowRight className="w-4 h-4" />
              </motion.a>
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  setView("membership", {
                    state: {
                      autoCategoryName: "professional",
                      jumpToStep: 2,
                      scrollTo: "personal-contact-info",
                    },
                  })
                }
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl inline-flex items-center justify-center gap-2"
              >
                Join now
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          )}
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div id="comparison">
            <WorsoOrgMembershipTierSection
              tierId="professional"
              onJoin={() => {
                if (!setView) return;
                setView("membership", {
                  state: {
                    autoCategoryName: "professional",
                    jumpToStep: 2,
                    scrollTo: "personal-contact-info",
                  },
                });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalMembershipView;

