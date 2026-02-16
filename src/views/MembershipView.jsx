import { motion } from "framer-motion";
import {
  ArrowRight,
  Loader2
} from "lucide-react";
import { PaymentSection, ShippingInfoForm, PersonalInfoForm, PlanCard, CategoryCard, ProgressSteps, HeroSection } from "../components/membership";

// Import constants
import {
  STEPS
} from "../constants/membershipData";

// Import hook
import { useMembershipForm } from "../hooks/useMembershipForm";

// Import icons
import * as Icons from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoriesRequest, fetchCategoryRequest, selectCategories, selectCategoriesLoading, selectHasCategoriesLoaded, selectSingleCategory } from "../app/categories/categoriesSlice";
import { selectReceivedOtp, selectHasOtpLoaded } from "../app/auth/authSlice";

// Simple Loading Component
const SimpleLoading = () => (
  <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block relative">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-pulse" />
        </div>
      </div>
      <h3 className="mt-6 text-xl font-semibold text-black">Loading Membership Data</h3>
      <p className="mt-2 text-gray-600">Please wait while we prepare your experience...</p>
    </div>
  </div>
);

const MembershipPage = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasShownLoading, setHasShownLoading] = useState(false);

  const memberShipCategory = useSelector(selectCategories);
  const hasCategoriesLoaded = useSelector(selectHasCategoriesLoaded);
  const categoriesLoading = useSelector(selectCategoriesLoading);
  const memberShipPlanData = useSelector(selectSingleCategory);
  const signupResponse = useSelector(selectReceivedOtp);
  const hasOtpLoaded = useSelector(selectHasOtpLoaded);
  
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategoriesRequest());
  }, [dispatch]);

  useEffect(() => {
    if (selectedCategoryId) {
      dispatch(fetchCategoryRequest(selectedCategoryId));
    }
  }, [selectedCategoryId]);

  useEffect(() => {
    // Only set loading to false once when categories are loaded
    if (hasCategoriesLoaded && isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        setHasShownLoading(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [hasCategoriesLoaded, isLoading]);

  const {
    isRoboClub,
    currentStep,
    setCurrentStep,
    formData,
    updateFormData,
    handleContinue,
    handleBack,
    nextStep,
    prevStep,
    prevStepCategory,
    handlePayment
  } = useMembershipForm();

  // Removed auto-navigation to shipping form - user stays on step 1 after signup
  // User can manually proceed to shipping form when ready

  // Show loading only once on initial load
  if (isLoading && !hasShownLoading) {
    return (
      <div className="min-h-screen bg-white">
        <SimpleLoading />
      </div>
    );
  }

  // Map icon strings to actual components
  const categoriesWithIcons = memberShipCategory?.data?.map(cat => ({
    ...cat,
    icon: Icons[cat.icon]
  }));

  const handleCategorySelect = (id) => {
    setSelectedCategoryId(id);
  };

  const handlePlanSelect = (id) => {
    setSelectedPlanId(id);
  };

  const handleContinueToDetails = () => {
    // Capture categoryId and planId and add them to formData
    if (selectedCategoryId && selectedPlanId) {
      updateFormData('categoryId', selectedCategoryId);
      updateFormData('planId', selectedPlanId);
    }
    handleContinue();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-8 max-w-5xl mx-auto border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-black mb-3">Who is joining today?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Select the category that best describes you to get started with your robotics journey.
              </p>
            </div>

            {!memberShipCategory?.data?.length ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">Loading categories...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                  {categoriesWithIcons?.map((category, index) => (
                    <CategoryCard
                      key={category._id}
                      category={category}
                      index={index}
                      selectedCategoryId={selectedCategoryId}
                      onClick={() => handleCategorySelect(category._id)}
                    />
                  ))}
                </div>

                <div className="flex justify-center">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleContinue}
                    disabled={!selectedCategoryId}
                    className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-10 rounded-xl flex items-center transition-all duration-300 shadow-lg hover:shadow-xl ${
                      !selectedCategoryId ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    Continue to Next Step
                    <ArrowRight className="ml-3" size={20} />
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-8 max-w-6xl mx-auto border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-black mb-3">Select your Membership Plan</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Unlock exclusive benefits tailored for your robotics journey.</p>
            </div>

            {memberShipPlanData ? (
              <div className={`grid ${selectedCategoryId ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-8 mb-12`}>
                <PlanCard
                  plan={memberShipPlanData}
                  selectedPlanId={selectedPlanId}
                  onSelect={handlePlanSelect}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">Loading plan details...</p>
              </div>
            )}

            <div className="flex justify-between flex-wrap gap-5 items-center pt-8 border-t border-gray-200">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBack}
                className="px-8 py-3 rounded-xl border border-gray-300 text-gray-600 hover:text-black hover:border-gray-400 font-medium transition-all duration-300"
              >
                ← Back
              </motion.button>

              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleContinueToDetails}
                  disabled={!selectedPlanId}
                  className={`px-10 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 ${
                    selectedPlanId
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Continue to Details
                  <ArrowRight size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-8">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Step {formData.currentFormStep} of 2
                  </span>
                  <span className="text-sm font-medium text-blue-600">
                    {formData.currentFormStep === 1 ? 'Personal Information' : 'Shipping Details'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: formData.currentFormStep === 1 ? '50%' : '100%' }}
                  ></div>
                </div>
              </div>

              {formData.currentFormStep === 1 ? (
                <PersonalInfoForm
                  formData={formData}
                  updateFormData={updateFormData}
                  onNext={nextStep}
                  onBack={prevStepCategory}
                />
              ) : (
                <ShippingInfoForm
                  formData={formData}
                  updateFormData={updateFormData}
                  onNext={() => setCurrentStep(3)}
                  onBack={prevStepCategory}
                  selectedCategory={selectedCategoryId}
                  selectedPlan={selectedPlanId}
                />
              )}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <PaymentSection
            selectedPayment={selectedCategoryId}
            setSelectedPayment={setSelectedCategoryId}
            selectedCategory={selectedCategoryId}
            selectedPlan={selectedPlanId}
            formData={formData}
            onBack={handleBack}
            onPayment={handlePayment}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <HeroSection isRoboClub={isRoboClub} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProgressSteps steps={STEPS} currentStep={currentStep} />
        {renderStepContent()}
      </div>
    </div>
  );
};

export default MembershipPage;