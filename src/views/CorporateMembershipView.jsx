import { motion } from "framer-motion";
import { ArrowRight, Building2 } from "lucide-react";
import { HeroSection, WorsoOrgMembershipTierSection } from "../components/membership";

const CorporateMembershipView = ({ setView }) => {
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 text-violet-700 border border-violet-100">
            <Building2 className="w-4 h-4" />
            <span className="text-sm font-semibold">Corporate Membership</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-black mt-5">
            Partner with WORSO for talent, visibility, and innovation
          </h2>
          <p className="text-gray-600 mt-3">
            For companies, NGOs, and startups looking to collaborate and scale impact globally.
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
                      autoCategoryName: "corporate",
                      jumpToStep: 2,
                      scrollTo: "personal-contact-info",
                    },
                  })
                }
                className="bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 px-8 rounded-xl inline-flex items-center justify-center gap-2"
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
              tierId="corporate"
              onJoin={() => {
                if (!setView) return;
                setView("membership", {
                  state: {
                    autoCategoryName: "corporate",
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

export default CorporateMembershipView;

