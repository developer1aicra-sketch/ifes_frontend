import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { categoryIcons } from "../../constants/membershipData";

export const CategoryCard = ({
  category,
  selectedCategoryId,
  onClick,
  index
}) => {
  const Icon = categoryIcons[index];
  const isSelected = selectedCategoryId === category._id ;

  return (
    <motion.div
      onClick={onClick}
      className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
        isSelected
          ? "border-red-500 bg-gray-800/50 shadow-lg shadow-red-500/10"
          : "border-gray-700 hover:border-red-400/50 bg-gray-800/30 hover:bg-gray-800/50"
      }`}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Selected Badge */}
      {isSelected && (
        <motion.div
          className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 shadow-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <Check size={16} />
        </motion.div>
      )}

      {/* Icon */}
      <div className="mb-4 text-red-400">
        <Icon size={36} />
      </div>

      {/* Category Name */}
      <h3 className="text-xl font-bold text-white mb-2 capitalize">
        {category.name}
      </h3>

      {/* Category Description */}
      <p className="text-gray-300 text-sm leading-relaxed">
        {category.description}
      </p>
    </motion.div>
  );
};
