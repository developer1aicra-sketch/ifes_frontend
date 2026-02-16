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
          ? "border-blue-600 bg-blue-50 shadow-lg shadow-blue-500/10"
          : "border-gray-200 hover:border-blue-400 bg-white hover:bg-gray-50"
      }`}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Selected Badge */}
      {isSelected && (
        <motion.div
          className="absolute -top-3 -right-3 bg-blue-600 text-white rounded-full p-1.5 shadow-lg z-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <Check size={16} />
        </motion.div>
      )}

      {/* Icon */}
      <div className="mb-4 text-blue-600 flex justify-center">
        <Icon size={36} strokeWidth={1.5} />
      </div>

      {/* Category Name */}
      <h3 className="text-xl font-bold text-black mb-2 text-center capitalize">
        {category.name}
      </h3>

      {/* Category Description */}
      <p className="text-gray-600 text-sm leading-relaxed text-center">
        {category.description}
      </p>
    </motion.div>
  );
};
