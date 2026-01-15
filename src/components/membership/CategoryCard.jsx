import { motion } from "framer-motion";
import { Check } from "lucide-react";

export const CategoryCard = ({ 
  category, 
  isSelected, 
  onClick 
}) => {
  const Icon = category.icon;

  return (
    <motion.div
      className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
        isSelected
          ? 'border-blue-500  shadow-lg shadow-red-500/10'
          : 'border-gray-700 hover:border-red-400/50  '
      }`}
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.1)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {isSelected && (
        <motion.div
          className="absolute -top-3 -right-3 bg-blue-500 text-white rounded-full p-1.5 shadow-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <Check size={16} />
        </motion.div>
      )}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300"
        style={{
          backgroundColor: `${category.color}15`,
          border: `1px solid ${category.color}30`
        }}
      >
        <Icon size={28} style={{ color: category.color }} />
      </div>
      <h3 className="text-xl font-bold text-black mb-2">
        {category.title}
      </h3>
      <p className="text-black text-sm leading-relaxed">{category.description}</p>
    </motion.div>
  );
};