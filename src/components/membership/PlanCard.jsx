import { motion } from "framer-motion";
import { Check, CheckCircle, Clock, Zap } from "lucide-react";

export const PlanCard = ({ 
  plan, 
  isSelected, 
  onSelect 
}) => {
  return (
    <motion.div
      key={plan.id}
      className={`relative rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
        isSelected
          ? 'border-blue-700 shadow-2xl shadow-red-500/10'
          : 'border-gray-700 hover:border-red-400/50'
      } ${plan.popular ? 'ring-2 ring-red-500 ring-opacity-20' : ''}`}
      whileHover={{ y: -5 }}
      onClick={onSelect}
    >
      {isSelected && (
        <motion.div
          className="absolute top-4 right-4 bg-blue-500 text-black rounded-full p-2 shadow-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <Check size={18} />
        </motion.div>
      )}

      <div className="p-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-black-400 font-medium text-sm">{plan.tagline}</span>
            {plan.popular && (
              <div className="flex items-center text-yellow-400 text-sm">
                <Zap size={14} className="mr-1" />
                <span>Recommended</span>
              </div>
            )}
          </div>
          <h3 className="text-2xl font-bold text-black mb-2">{plan.name}</h3>
          <div className="flex items-baseline mb-4">
            <span className="text-4xl font-bold text-black">$ {plan.price}</span>
            <span className="text-black ml-2">{plan.period}</span>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          {plan.features.map((feature, index) => {
            const FeatureIcon = feature.icon;
            return (
              <div key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <FeatureIcon size={16} className="text-red-400" />
                </div>
                <span className="text-black-300">{feature.text}</span>
              </div>
            );
          })}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
            isSelected
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-white'
          }`}
        >
          {isSelected ? 'Selected ✓' : 'Select Plan'}
        </motion.button>
      </div>

      <div className="border-t border-gray-800  p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-black">Full Benefits</h4>
          <Clock size={16} className="text-black-400" />
        </div>
        <div className="space-y-3">
          {plan.benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle size={16} className="text-green-400 mt-1 flex-shrink-0" />
              <span className="text-black-400 text-sm">{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};