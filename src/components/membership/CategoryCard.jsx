import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { categoryIcons } from "../../constants/membershipData";

export const CategoryCard = ({
  category,
  selectedCategoryId,
  onSelectCategory,
  onViewDetails,
  index
}) => {
  const Icon = categoryIcons[index];
  const isSelected = selectedCategoryId === category._id;
  const canProceed = Boolean(category?._id);

  const handleCardActivate = () => {
    if (typeof onSelectCategory === "function") {
      onSelectCategory();
    }
  };

  const handleViewDetailsClick = (e) => {
    e.stopPropagation();
    if (!canProceed || typeof onViewDetails !== "function") return;
    onViewDetails(category);
  };

  return (
    <motion.article
      aria-labelledby={`category-title-${category._id}`}
      onClick={handleCardActivate}
      className={`relative flex flex-col p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
        isSelected
          ? "border-blue-600 bg-blue-50 shadow-lg shadow-blue-500/10"
          : "border-gray-200 hover:border-blue-400 bg-white hover:bg-gray-50"
      }`}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      {isSelected && (
        <motion.div
          className="absolute -top-3 -right-3 bg-blue-600 text-white rounded-full p-1.5 shadow-lg z-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          aria-hidden
        >
          <Check size={16} />
        </motion.div>
      )}

      <div className="mb-4 text-blue-600 flex justify-center">
        <Icon size={36} strokeWidth={1.5} aria-hidden />
      </div>

      <h3
        id={`category-title-${category._id}`}
        className="text-xl font-bold text-black mb-2 text-center capitalize"
      >
        {category.name}
      </h3>

      <p className="text-gray-600 text-sm leading-relaxed text-center grow mb-5">
        {category.description}
      </p>

      <motion.button
        type="button"
        whileHover={canProceed ? { scale: 1.02 } : undefined}
        whileTap={canProceed ? { scale: 0.98 } : undefined}
        onClick={handleViewDetailsClick}
        disabled={!canProceed}
        aria-label={`View details and continue with ${category.name}`}
        className={`mt-auto text-blue-500 w-full flex items-center justify-center gap-2  rounded-xl font-semibold text-sm transition-all duration-300  ${
          canProceed
            ? " "
            : " "
        }`}
      >
        View Details
        <ArrowRight size={18} aria-hidden />
      </motion.button>
    </motion.article>
  );
};
