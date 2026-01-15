import { motion } from "framer-motion";
import {
  Shield,
  ArrowRight
} from "lucide-react";

// Import components
import { HeroSection } from "../components/membership/HeroSection";
import { ProgressSteps } from "../components/membership/ProgressSteps";
import { CategoryCard } from "../components/membership/CategoryCard";
import { PlanCard } from "../components/membership/PlanCard";
import { PersonalInfoForm } from "../components/membership/PersonalInfoForm";
import { ShippingInfoForm } from "../components/membership/ShippingInfoForm";
import { PaymentSection } from "../components/membership/PaymentSection";

// Import constants
import {
  CATEGORIES,
  STUDENT_PLANS,
  PROFESSIONAL_PLANS,
  INSTITUTE_PLANS,
  CORPORATE_PLANS,
  STEPS
} from "../constants/membershipData";

// Import hook
import { useMembershipForm } from "../hooks/useMembershipForm";

// Import icons
import * as Icons from "lucide-react";

const MembershipPage = () => {
  const {
    isRoboClub,
    selectedCategory,
    setSelectedCategory,
    currentStep,
    setCurrentStep,
    selectedPlan,
    setSelectedPlan,
    selectedPayment,
    setSelectedPayment,
    formData,
    updateFormData,
    handleCategorySelect,
    handleContinue,
    handleBack,
    nextStep,
    prevStep,
    prevStepCategory,
    handlePayment
  } = useMembershipForm();

  // Map icon strings to actual components
  const categoriesWithIcons = CATEGORIES.map(cat => ({
    ...cat,
    icon: Icons[cat.icon]
  }));

  const getPlansForCategory = () => {
    switch (selectedCategory) {
      case 'student':
        return STUDENT_PLANS.map(plan => ({
          ...plan,
          features: plan.features.map(feat => ({
            ...feat,
            icon: Icons[feat.icon]
          }))
        }));
      case 'professional':
        return PROFESSIONAL_PLANS.map(plan => ({
          ...plan,
          features: plan.features.map(feat => ({
            ...feat,
            icon: Icons[feat.icon]
          }))
        }));
      case 'institute':
        return INSTITUTE_PLANS.map(plan => ({
          ...plan,
          features: plan.features.map(feat => ({
            ...feat,
            icon: Icons[feat.icon]
          }))
        }));
      case 'corporate':
        return CORPORATE_PLANS.map(plan => ({
          ...plan,
          features: plan.features.map(feat => ({
            ...feat,
            icon: Icons[feat.icon]
          }))
        }));
      default:
        return [];
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            className=" rounded-2xl shadow-2xl p-8 max-w-5xl mx-auto border border-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-blue-600 mb-3">Who is joining today?</h2>
              <p className="text-slate-900 max-w-2xl mx-auto">
                Select the category that best describes you to get started with your robotics journey.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {categoriesWithIcons.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  isSelected={selectedCategory === category.id}
                  onClick={() => handleCategorySelect(category.id)}
                />
              ))}
            </div>

            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleContinue}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-10 rounded-xl flex items-center transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Continue to Next Step
                <ArrowRight className="ml-3" size={20} />
              </motion.button>
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            className=" rounded-2xl shadow-2xl p-8 max-w-6xl mx-auto border border-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-blue-600 mb-3">Select your Membership Plan</h2>
              <p className="text-black max-w-2xl mx-auto">Unlock exclusive benefits tailored for your robotics journey.</p>
            </div>

            <div className={`grid ${selectedCategory === 'student' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-8 mb-12`}>
              {getPlansForCategory().map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  isSelected={selectedPlan === plan.id}
                  onSelect={() => setSelectedPlan(plan.id)}
                />
              ))}
            </div>

            <div className="flex justify-between items-center pt-8 border-t border-gray-800">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBack}
                className="px-8 py-3 rounded-xl border border-gray-700 text-black-400 hover:text-white hover:border-gray-600 font-medium transition-all duration-300"
              >
                ← Back
              </motion.button>

              <div className="flex items-center gap-4">
                <motion.div
                  className="flex items-center gap-2 text-gray-400"
                  animate={{ opacity: selectedPlan ? 1 : 0.5 }}
                >
                  <Shield size={16} className=" text-slate-700" />
                  <span className="text-sm text-slate-700">Secure Payment</span>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleContinue}
                  disabled={!selectedPlan}
                  className={`px-10 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 ${
                    selectedPlan
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed'
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
            className="max-w-4xl mx-auto  rounded-2xl shadow-2xl overflow-hidden border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-8">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-black-300">
                    Step {formData.currentFormStep} of 2
                  </span>
                  <span className="text-sm font-medium text-black-400">
                    {formData.currentFormStep === 1 ? 'Personal Information' : 'Shipping Details'}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
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
                  onBack={prevStep}
                  selectedCategory={selectedCategory}
                  selectedPlan={selectedPlan}
                />
              )}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <PaymentSection
            selectedPayment={selectedPayment}
            setSelectedPayment={setSelectedPayment}
            selectedCategory={selectedCategory}
            selectedPlan={selectedPlan}
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
    <div className="min-h-screen ">
      <HeroSection isRoboClub={isRoboClub} />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProgressSteps steps={STEPS} currentStep={currentStep} />
        {renderStepContent()}
      </div>
    </div>
  );
};

export default MembershipPage;