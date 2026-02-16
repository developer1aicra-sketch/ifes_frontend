import { motion } from "framer-motion";
import { Check, CheckCircle, Clock, Zap } from "lucide-react";

export const PlanCard = ({
  plan,
  selectedPlanId,
  onSelect,
  onClick
}) => {
  if (!plan?.plans?.length) return null;
  // const isSelected = selectedPlanId === plan._id;

  return (
    <>
      {plan.plans.map((item) => {
   const isSelected = selectedPlanId === item._id;
        return (
          <motion.div
            key={item._id}
            className={`relative rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
              isSelected
                ? "border-red-500 shadow-2xl shadow-red-500/10"
                : "border-gray-700 hover:border-red-400/50"
            } ${item.popular ? "ring-2 ring-red-500 ring-opacity-20" : ""}`}
            whileHover={{ y: -5 }}
            onClick={() => onSelect(item._id)}
          >
            {/* Selected Tick */}
            {isSelected && (
              <motion.div
                className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2 shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <Check size={18} />
              </motion.div>
            )}

            {/* Card Content */}
            <div className="p-8 bg-gray-800/50">
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400 text-sm">
                    {item.tagline}
                  </span>

                  {item.popular && (
                    <div className="flex items-center text-yellow-400 text-sm">
                      <Zap size={14} className="mr-1" />
                      Recommended
                    </div>
                  )}
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">
                  {item.name}
                </h3>

                {/* ✅ FIXED PRICE RENDERING */}
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold text-white">
                    {item.price?.currency === "INR" ? "₹" : "$"}
                    {item.price?.amount}
                  </span>
                  <span className="text-gray-400 ml-2">
                    {item.period}
                  </span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {item.features?.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle size={16} className="text-green-400" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 rounded-xl font-semibold ${
                  isSelected
                    ? "bg-red-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {isSelected ? "Selected ✓" : "Select Plan"}
              </motion.button>
            </div>

            {/* Benefits */}
            <div className="border-t border-gray-800 bg-gray-900/50 p-6">
              <div className="flex justify-between mb-4">
                <h4 className="text-lg font-semibold text-white">
                  Full Benefits
                </h4>
                <Clock size={16} className="text-gray-400" />
              </div>

              <div className="space-y-3">
                {item.benefits?.map((benefit, index) => (
                  <div key={index} className="flex gap-3">
                    <CheckCircle size={16} className="text-green-400 mt-1" />
                    <span className="text-gray-400 text-sm">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );
      })}
    </>
  );
};
