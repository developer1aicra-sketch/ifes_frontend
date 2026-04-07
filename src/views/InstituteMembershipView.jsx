import { motion } from "framer-motion";
import { ArrowRight, GraduationCap } from "lucide-react";
import { HeroSection, WorsoOrgMembershipTierSection } from "../components/membership";

const InstituteMembershipView = ({ setView }) => {
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
            <GraduationCap className="w-4 h-4" />
            <span className="text-sm font-semibold">Institute Membership</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-black mt-5">
            Build robotics infrastructure and recognition for your institution
          </h2>
          <p className="text-gray-600 mt-3">
            For schools, colleges, universities, and vocational institutes.
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
                      autoCategoryName: "institute",
                      jumpToStep: 2,
                      scrollTo: "personal-contact-info",
                    },
                  })
                }
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-xl inline-flex items-center justify-center gap-2"
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
              tierId="institute"
              onJoin={() => {
                if (!setView) return;
                setView("membership", {
                  state: {
                    autoCategoryName: "institute",
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

export default InstituteMembershipView;

