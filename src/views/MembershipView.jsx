// import { motion } from "framer-motion";
// import {
//   ArrowRight,
//   Loader2
// } from "lucide-react";
// import { PaymentSection, ShippingInfoForm, PersonalInfoForm, PlanCard, CategoryCard, ProgressSteps, HeroSection, StudentMembershipComparisonSection } from "../components/membership";

// // Import constants
// import {
//   STEPS
// } from "../constants/membershipData";

// // Import hook
// import { useMembershipForm } from "../hooks/useMembershipForm";

// // Import icons
// import * as Icons from "lucide-react";
// import { useCallback, useEffect, useRef, useState } from "react";
// import { useLocation } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchCategoriesRequest, fetchCategoryRequest, selectCategories, selectCategoriesLoading, selectHasCategoriesLoaded, selectSingleCategory } from "../app/categories/categoriesSlice";

// // Simple Loading Component
// const SimpleLoading = () => (
//   <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center">
//     <div className="text-center">
//       <div className="inline-block relative">
//         <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
//         <div className="absolute inset-0 flex items-center justify-center">
//           <Loader2 className="w-8 h-8 text-blue-600 animate-pulse" />
//         </div>
//       </div>
//       <h3 className="mt-6 text-xl font-semibold text-black">Loading....</h3>
     
//     </div>
//   </div>
// );

// const MembershipPage = ({ setView }) => {
//   const location = useLocation();
//   const [selectedCategoryId, setSelectedCategoryId] = useState(null);
//   const [selectedPlanId, setSelectedPlanId] = useState(null);
//   const [selectedPaymentGateway, setSelectedPaymentGateway] = useState('razorpay'); // payment method only; never use for category_id
//   const [isLoading, setIsLoading] = useState(true);
//   const [hasShownLoading, setHasShownLoading] = useState(false);

//   const memberShipCategory = useSelector(selectCategories);
//   const hasCategoriesLoaded = useSelector(selectHasCategoriesLoaded);
//   const categoriesLoading = useSelector(selectCategoriesLoading);
//   const memberShipPlanData = useSelector(selectSingleCategory);
//   const dispatch = useDispatch();
//   const navState = location?.state || null;
//   const [hasAppliedNavState, setHasAppliedNavState] = useState(false);

//   const {
//     isRoboClub,
//     currentStep,
//     setCurrentStep,
//     formData,
//     updateFormData,
//     handleContinue,
//     handleBack,
//     nextStep,
//     prevStep,
//     prevStepCategory,
//     handlePayment
//   } = useMembershipForm();

//   useEffect(() => {
//     dispatch(fetchCategoriesRequest());
//   }, [dispatch]);

//   // Apply navigation state (e.g. coming from /student-membership CTA)
//   useEffect(() => {
//     if (hasAppliedNavState) return;
//     if (!navState) return;
//     if (!memberShipCategory?.data?.length) return;

//     const desiredCategoryName = (navState.autoCategoryName || "").toLowerCase();
//     if (!desiredCategoryName) {
//       setHasAppliedNavState(true);
//       return;
//     }

//     const foundCategory =
//       memberShipCategory.data.find((c) => (c?.name || "").toLowerCase().includes(desiredCategoryName)) || null;

//     if (foundCategory?._id) {
//       setSelectedCategoryId(foundCategory._id);
//     }

//     setHasAppliedNavState(true);
//   }, [hasAppliedNavState, navState, memberShipCategory?.data]);

//   useEffect(() => {
//     if (selectedCategoryId) {
//       dispatch(fetchCategoryRequest(selectedCategoryId));
//     }
//   }, [selectedCategoryId]);

//   // After category plans load, optionally auto-select plan + jump to Details step
//   useEffect(() => {
//     if (!navState) return;
//     if (!hasAppliedNavState) return;
//     if (!memberShipPlanData?.plans?.length) return;

//     // Auto select plan once
//     if (!selectedPlanId && navState.autoPlanName) {
//       const desiredPlanName = String(navState.autoPlanName).toLowerCase();
//       const foundPlan =
//         memberShipPlanData.plans.find((p) => (p?.name || "").toLowerCase().includes(desiredPlanName)) ||
//         memberShipPlanData.plans[0];

//       if (foundPlan?._id) {
//         setSelectedPlanId(foundPlan._id);
//         updateFormData("categoryId", selectedCategoryId);
//         updateFormData("planId", foundPlan._id);
//       }
//     }

//     // Jump to Personal & Contact Information (Details step)
//     // Important: only jump forward to step 2. Never pull the user back from later steps.
//     if (navState.jumpToStep === 2 && currentStep < 2) {
//       setCurrentStep(2);
//     }
//   }, [
//     navState,
//     hasAppliedNavState,
//     memberShipPlanData?.plans,
//     selectedPlanId,
//     selectedCategoryId,
//     currentStep,
//     setCurrentStep,
//     updateFormData,
//   ]);

//   // Scroll to Personal & Contact Information when requested
//   useEffect(() => {
//     if (!navState?.scrollTo) return;
//     if (currentStep !== 2) return;

//     const el = document.getElementById(navState.scrollTo);
//     if (!el) return;
//     const t = setTimeout(() => {
//       el.scrollIntoView({ behavior: "smooth", block: "start" });
//     }, 150);
//     return () => clearTimeout(t);
//   }, [navState?.scrollTo, currentStep]);

//   useEffect(() => {
//     // Only set loading to false once when categories are loaded
//     if (hasCategoriesLoaded && isLoading) {
//       const timer = setTimeout(() => {
//         setIsLoading(false);
//         setHasShownLoading(true);
//       }, 300);
//       return () => clearTimeout(timer);
//     }
//   }, [hasCategoriesLoaded, isLoading]);

//   const categoryAdvanceLockRef = useRef(false);

//   useEffect(() => {
//     categoryAdvanceLockRef.current = false;
//   }, [currentStep]);

//   /** Advance from step 0 using a concrete category (avoids stale state vs. setState batching). */
//   const proceedFromCategory = useCallback(
//     (category) => {
//       if (!category?._id || categoryAdvanceLockRef.current) return;
//       categoryAdvanceLockRef.current = true;

//       setSelectedCategoryId(category._id);
//       updateFormData("categoryId", category._id);

//       const name = category.name ?? "";
//       const lower = name.toLowerCase();
//       const isStudentCategory = lower.includes("student");
//       const isProfessionalCategory = lower.includes("professional");
//       const isInstituteCategory = lower.includes("institute") || lower.includes("institution");
//       const isCorporateCategory = lower.includes("corporate");

//       const releaseLock = () => {
//         queueMicrotask(() => {
//           categoryAdvanceLockRef.current = false;
//         });
//       };

//       if (isStudentCategory && typeof setView === "function") {
//         setView("student-membership");
//         releaseLock();
//         return;
//       }
//       if (isProfessionalCategory && typeof setView === "function") {
//         setView("professional-membership");
//         releaseLock();
//         return;
//       }
//       if (isInstituteCategory && typeof setView === "function") {
//         setView("institute-membership");
//         releaseLock();
//         return;
//       }
//       if (isCorporateCategory && typeof setView === "function") {
//         setView("corporate-membership");
//         releaseLock();
//         return;
//       }

//       handleContinue();
//     },
//     [handleContinue, setView, updateFormData]
//   );

//   // Removed auto-navigation to shipping form - user stays on step 1 after signup
//   // User can manually proceed to shipping form when ready

//   // Show loading only once on initial load
//   if (isLoading && !hasShownLoading) {
//     return (
//       <div className="min-h-screen bg-white">
//         <SimpleLoading />
//       </div>
//     );
//   }

//   // Map icon strings to actual components
//   const categoriesWithIcons = memberShipCategory?.data?.map(cat => ({
//     ...cat,
//     icon: Icons[cat.icon]
//   }));

//   const handleCategorySelect = (id) => {
//     setSelectedCategoryId(id);
//   };

//   const handlePlanSelect = (id) => {
//     setSelectedPlanId(id);
//   };

//   const handleContinueToDetails = () => {
//     // Capture categoryId and planId and add them to formData
//     if (selectedCategoryId && selectedPlanId) {
//       updateFormData('categoryId', selectedCategoryId);
//       updateFormData('planId', selectedPlanId);
//     }
//     handleContinue();
//   };

//   const renderStepContent = () => {
//     switch (currentStep) {
//       case 0:
//         return (
//           <motion.div
//             className="bg-white rounded-2xl shadow-xl p-8 max-w-5x mx-auto border border-gray-200"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//           >
//             <div className="text-center mb-10">
//               <h2 className="text-3xl font-bold text-black mb-3">Who is joining today?</h2>
//               <p className="text-gray-600 max-w-2xl mx-auto">
//                 Select the category that best describes you to get started with your robotics journey.
//               </p>
//             </div>

//             {!memberShipCategory?.data?.length ? (
//               <div className="flex flex-col items-center justify-center py-12">
//                 <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
//                 <p className="text-gray-600">Loading categories...</p>
//               </div>
//             ) : (
//               <>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                   {categoriesWithIcons?.map((category, index) => (
//                     <CategoryCard
//                       key={category._id}
//                       category={category}
//                       index={index}
//                       selectedCategoryId={selectedCategoryId}
//                       onSelectCategory={() => handleCategorySelect(category._id)}
//                       onViewDetails={proceedFromCategory}
//                     />
//                   ))}
//                 </div>
//               </>
//             )}
//           </motion.div>
//         );

//       case 1:
//         const selectedCategoryName =
//           memberShipCategory?.data?.find((c) => c._id === selectedCategoryId)?.name ?? "";
//         const isStudentCategory = selectedCategoryName.toLowerCase().includes("student");
//         return (
//           <motion.div
//             className="bg-white rounded-2xl shadow-xl p-8 max-w-6xl mx-auto border border-gray-200"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//           >
//             <div className="text-center mb-12">
//               <h2 className="text-3xl font-bold text-black mb-3">Select your Membership Plan</h2>
//               <p className="text-gray-600 max-w-2xl mx-auto">Unlock exclusive benefits tailored for your robotics journey.</p>
//             </div>

//             {isStudentCategory && (
//               <div className="mb-10">
//                 <StudentMembershipComparisonSection />
//               </div>
//             )}

//             {memberShipPlanData ? (
//               <div className={`grid ${selectedCategoryId ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-8 mb-12`}>
//                 <PlanCard
//                   plan={memberShipPlanData}
//                   selectedPlanId={selectedPlanId}
//                   onSelect={handlePlanSelect}
//                 />
//               </div>
//             ) : (
//               <div className="flex flex-col items-center justify-center py-12">
//                 <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
//                 <p className="text-gray-600">Loading plan details...</p>
//               </div>
//             )}

//             <div className="flex justify-between flex-wrap gap-5 items-center pt-8 border-t border-gray-200">
//               <motion.button
//                 whileHover={{ scale: 1.03 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={handleBack}
//                 className="px-8 py-3 rounded-xl border border-gray-300 text-gray-600 hover:text-black hover:border-gray-400 font-medium transition-all duration-300"
//               >
//                 ← Back
//               </motion.button>

//               <div className="flex items-center gap-4">
//                 <motion.button
//                   whileHover={{ scale: 1.03 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={handleContinueToDetails}
//                   disabled={!selectedPlanId}
//                   className={`px-10 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 ${
//                     selectedPlanId
//                       ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
//                       : 'bg-gray-200 text-gray-400 cursor-not-allowed'
//                   }`}
//                 >
//                   Continue to Details
//                   <ArrowRight size={18} />
//                 </motion.button>
//               </div>
//             </div>
//           </motion.div>
//         );

//       case 2:
//         return (
//           <motion.div
//             className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             <div className="p-8">
//               <div className="mb-8">
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-sm font-medium text-gray-600">
//                     Step {formData.currentFormStep} of 2
//                   </span>
//                   <span className="text-sm font-medium text-blue-600">
//                     {formData.currentFormStep === 1 ? 'Personal Information' : 'Shipping Details'}
//                   </span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2.5">
//                   <div
//                     className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
//                     style={{ width: formData.currentFormStep === 1 ? '50%' : '100%' }}
//                   ></div>
//                 </div>
//               </div>

//               {formData.currentFormStep === 1 ? (
//                 <div id="personal-contact-info">
//                   <PersonalInfoForm
//                     formData={formData}
//                     updateFormData={updateFormData}
//                     onNext={nextStep}
//                     onBack={prevStepCategory}
//                   />
//                 </div>
//               ) : (
//                 <ShippingInfoForm
//                   formData={formData}
//                   updateFormData={updateFormData}
//                   onNext={() => setCurrentStep(3)}
//                   onBack={prevStepCategory}
//                   selectedCategory={selectedCategoryId}
//                   selectedPlan={selectedPlanId}
//                 />
//               )}
//             </div>
//           </motion.div>
//         );

//       case 3: {
//         const selectedPlanObj = memberShipPlanData?.plans?.find((p) => p._id === selectedPlanId);
//         const categoryName =
//           memberShipPlanData?.name ??
//           memberShipCategory?.data?.find((c) => c._id === selectedCategoryId)?.name ??
//           '';
//         const planName = selectedPlanObj?.name ?? '';
//         const displayAmountRupees = selectedPlanObj?.price?.amount;
//         const displayCurrency = selectedPlanObj?.price?.currency ?? 'INR';
//         return (
//           <PaymentSection
//             selectedPayment={selectedPaymentGateway}
//             setSelectedPayment={setSelectedPaymentGateway}
//             selectedCategory={selectedCategoryId}
//             selectedPlan={selectedPlanId}
//             categoryName={categoryName}
//             planName={planName}
//             displayAmountRupees={displayAmountRupees}
//             displayCurrency={displayCurrency}
//             formData={formData}
//             onBack={handleBack}
//             onPayment={handlePayment}
//           />
//         );
//       }

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       <HeroSection isRoboClub={isRoboClub} />

//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <ProgressSteps steps={STEPS} currentStep={currentStep} />
//         {renderStepContent()}
//       </div>
//     </div>
//   );
// };

// export default MembershipPage;



// import { motion } from "framer-motion";
// import {
//   ArrowRight,
//   Loader2
// } from "lucide-react";
// import { PaymentSection, ShippingInfoForm, PersonalInfoForm, PlanCard, CategoryCard, ProgressSteps, HeroSection, StudentMembershipComparisonSection } from "../components/membership";

// // Import constants
// import {
//   STEPS
// } from "../constants/membershipData";

// // Import hook
// import { useMembershipForm } from "../hooks/useMembershipForm";

// // Import icons
// import * as Icons from "lucide-react";
// import { useCallback, useEffect, useRef, useState } from "react";
// import { useLocation } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchCategoriesRequest, fetchCategoryRequest, selectCategories, selectCategoriesLoading, selectHasCategoriesLoaded, selectSingleCategory } from "../app/categories/categoriesSlice";

// // 🌈 Dark Theme Loading Component
// const SimpleLoading = () => (
//   <div className="fixed inset-0 bg-[#020b10] z-50 flex items-center justify-center">
//     <div className="text-center">
//       <div className="inline-block relative">
//         <div className="w-16 h-16 border-4 border-gray-800 border-t-cyan-500 rounded-full animate-spin"></div>
//         <div className="absolute inset-0 flex items-center justify-center">
//           <Loader2 className="w-8 h-8 text-cyan-500 animate-pulse" />
//         </div>
//       </div>
//       <h3 className="mt-6 text-xl font-semibold text-white tracking-widest uppercase text-sm">Loading....</h3>
//     </div>
//   </div>
// );

// const MembershipPage = ({ setView }) => {
//   const location = useLocation();
//   const [selectedCategoryId, setSelectedCategoryId] = useState(null);
//   const [selectedPlanId, setSelectedPlanId] = useState(null);
//   const [selectedPaymentGateway, setSelectedPaymentGateway] = useState('razorpay'); 
//   const [isLoading, setIsLoading] = useState(true);
//   const [hasShownLoading, setHasShownLoading] = useState(false);

//   const memberShipCategory = useSelector(selectCategories);
//   const hasCategoriesLoaded = useSelector(selectHasCategoriesLoaded);
//   const categoriesLoading = useSelector(selectCategoriesLoading);
//   const memberShipPlanData = useSelector(selectSingleCategory);
//   const dispatch = useDispatch();
//   const navState = location?.state || null;
//   const [hasAppliedNavState, setHasAppliedNavState] = useState(false);

//   const {
//     isRoboClub,
//     currentStep,
//     setCurrentStep,
//     formData,
//     updateFormData,
//     handleContinue,
//     handleBack,
//     nextStep,
//     prevStep,
//     prevStepCategory,
//     handlePayment
//   } = useMembershipForm();

//   useEffect(() => {
//     dispatch(fetchCategoriesRequest());
//   }, [dispatch]);

//   useEffect(() => {
//     if (hasAppliedNavState) return;
//     if (!navState) return;
//     if (!memberShipCategory?.data?.length) return;

//     const desiredCategoryName = (navState.autoCategoryName || "").toLowerCase();
//     if (!desiredCategoryName) {
//       setHasAppliedNavState(true);
//       return;
//     }

//     const foundCategory =
//       memberShipCategory.data.find((c) => (c?.name || "").toLowerCase().includes(desiredCategoryName)) || null;

//     if (foundCategory?._id) {
//       setSelectedCategoryId(foundCategory._id);
//     }

//     setHasAppliedNavState(true);
//   }, [hasAppliedNavState, navState, memberShipCategory?.data]);

//   useEffect(() => {
//     if (selectedCategoryId) {
//       dispatch(fetchCategoryRequest(selectedCategoryId));
//     }
//   }, [selectedCategoryId]);

//   useEffect(() => {
//     if (!navState) return;
//     if (!hasAppliedNavState) return;
//     if (!memberShipPlanData?.plans?.length) return;

//     if (!selectedPlanId && navState.autoPlanName) {
//       const desiredPlanName = String(navState.autoPlanName).toLowerCase();
//       const foundPlan =
//         memberShipPlanData.plans.find((p) => (p?.name || "").toLowerCase().includes(desiredPlanName)) ||
//         memberShipPlanData.plans[0];

//       if (foundPlan?._id) {
//         setSelectedPlanId(foundPlan._id);
//         updateFormData("categoryId", selectedCategoryId);
//         updateFormData("planId", foundPlan._id);
//       }
//     }

//     if (navState.jumpToStep === 2 && currentStep < 2) {
//       setCurrentStep(2);
//     }
//   }, [
//     navState,
//     hasAppliedNavState,
//     memberShipPlanData?.plans,
//     selectedPlanId,
//     selectedCategoryId,
//     currentStep,
//     setCurrentStep,
//     updateFormData,
//   ]);

//   useEffect(() => {
//     if (!navState?.scrollTo) return;
//     if (currentStep !== 2) return;

//     const el = document.getElementById(navState.scrollTo);
//     if (!el) return;
//     const t = setTimeout(() => {
//       el.scrollIntoView({ behavior: "smooth", block: "start" });
//     }, 150);
//     return () => clearTimeout(t);
//   }, [navState?.scrollTo, currentStep]);

//   useEffect(() => {
//     if (hasCategoriesLoaded && isLoading) {
//       const timer = setTimeout(() => {
//         setIsLoading(false);
//         setHasShownLoading(true);
//       }, 300);
//       return () => clearTimeout(timer);
//     }
//   }, [hasCategoriesLoaded, isLoading]);

//   const categoryAdvanceLockRef = useRef(false);

//   useEffect(() => {
//     categoryAdvanceLockRef.current = false;
//   }, [currentStep]);

//   const proceedFromCategory = useCallback(
//     (category) => {
//       if (!category?._id || categoryAdvanceLockRef.current) return;
//       categoryAdvanceLockRef.current = true;

//       setSelectedCategoryId(category._id);
//       updateFormData("categoryId", category._id);

//       const name = category.name ?? "";
//       const lower = name.toLowerCase();
      
//       const releaseLock = () => {
//         queueMicrotask(() => {
//           categoryAdvanceLockRef.current = false;
//         });
//       };

//       // if (lower.includes("student") && typeof setView === "function") {
//       //   setView("student-membership"); releaseLock(); return;
//       // }
//       if (lower.includes("professional") && typeof setView === "function") {
//         setView("professional-membership"); releaseLock(); return;
//       }
//       if ((lower.includes("institute") || lower.includes("institution")) && typeof setView === "function") {
//         setView("institute-membership"); releaseLock(); return;
//       }
//       if (lower.includes("corporate") && typeof setView === "function") {
//         setView("corporate-membership"); releaseLock(); return;
//       }

//       handleContinue();
//     },
//     [handleContinue, setView, updateFormData]
//   );

//   if (isLoading && !hasShownLoading) {
//     return <SimpleLoading />;
//   }

//   const categoriesWithIcons = memberShipCategory?.data?.map(cat => ({
//     ...cat,
//     icon: Icons[cat.icon]
//   }));

//   const handleCategorySelect = (id) => setSelectedCategoryId(id);
//   const handlePlanSelect = (id) => setSelectedPlanId(id);

//   const handleContinueToDetails = () => {
//     if (selectedCategoryId && selectedPlanId) {
//       updateFormData('categoryId', selectedCategoryId);
//       updateFormData('planId', selectedPlanId);
//     }
//     handleContinue();
//   };

//   const renderStepContent = () => {
//     switch (currentStep) {
//       case 0:
//         return (
//           <motion.div
//             className="bg-[#0f172a]/40 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-6xl mx-auto border border-white/5 relative overflow-hidden"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//           >
//             <div className="text-center mb-10">
//               <h2 className="text-3xl md:text-4xl font-black text-white mb-3 uppercase tracking-tight">Who is joining today?</h2>
//               <p className="text-slate-400 max-w-2xl mx-auto">Select the category that best describes you to get started with your journey.</p>
//             </div>

//             {!memberShipCategory?.data?.length ? (
//               <div className="flex flex-col items-center justify-center py-12">
//                 <div className="w-12 h-12 border-4 border-gray-800 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                 {categoriesWithIcons?.map((category, index) => (
//                   <CategoryCard
//                     key={category._id}
//                     category={category}
//                     index={index}
//                     selectedCategoryId={selectedCategoryId}
//                     onSelectCategory={() => handleCategorySelect(category._id)}
//                     onViewDetails={proceedFromCategory}
//                   />
//                 ))}
//               </div>
//             )}
//           </motion.div>
//         );

//       case 1:
//         const selectedCategoryName = memberShipCategory?.data?.find((c) => c._id === selectedCategoryId)?.name ?? "";
//         return (
//           <motion.div
//             className="bg-[#0f172a]/40 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-6xl mx-auto border border-white/5"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//           >
//             <div className="text-center mb-12">
//               <h2 className="text-3xl font-black text-white mb-3 uppercase tracking-tight">Select your Membership Plan</h2>
//               <p className="text-slate-400 max-w-2xl mx-auto">Unlock exclusive benefits tailored for your robotics journey.</p>
//             </div>

//             {selectedCategoryName.toLowerCase().includes("student") && (
//               <div className="mb-10"><StudentMembershipComparisonSection /></div>
//             )}

//             {memberShipPlanData ? (
//               <div className="grid grid-cols-1 gap-8 mb-12">
//                 <PlanCard
//                   plan={memberShipPlanData}
//                   selectedPlanId={selectedPlanId}
//                   onSelect={handlePlanSelect}
//                 />
//               </div>
//             ) : (
//               <div className="flex flex-col items-center justify-center py-12">
//                 <div className="w-12 h-12 border-4 border-gray-800 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
//               </div>
//             )}

//             <div className="flex justify-between flex-wrap gap-5 items-center pt-8 border-t border-white/5">
//               <button onClick={handleBack} className="px-8 py-3 rounded-xl border border-white/10 text-slate-400 hover:text-white transition-all">← Back</button>
//               <motion.button
//                 onClick={handleContinueToDetails}
//                 disabled={!selectedPlanId}
//                 className={`px-10 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${selectedPlanId ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
//               >
//                 Continue to Details <ArrowRight size={18} />
//               </motion.button>
//             </div>
//           </motion.div>
//         );

//       case 2:
//         return (
//           <motion.div className="max-w-4xl mx-auto bg-[#0f172a]/60 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/5 p-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
//              <div className="mb-8">
//                 <div className="flex items-center justify-between mb-4 text-xs font-bold uppercase tracking-[0.2em]">
//                   <span className="text-slate-500 text-cyan-400">Step {formData.currentFormStep} of 2</span>
//                   <span className="text-white">{formData.currentFormStep === 1 ? 'Personal Information' : 'Shipping Details'}</span>
//                 </div>
//                 <div className="w-full bg-white/5 rounded-full h-1.5">
//                   <div className="bg-cyan-500 h-1.5 rounded-full transition-all duration-500" style={{ width: formData.currentFormStep === 1 ? '50%' : '100%' }}></div>
//                 </div>
//               </div>
//               {formData.currentFormStep === 1 ? (
//                 <div id="personal-contact-info">
//                   <PersonalInfoForm formData={formData} updateFormData={updateFormData} onNext={nextStep} onBack={prevStepCategory} />
//                 </div>
//               ) : (
//                 <ShippingInfoForm formData={formData} updateFormData={updateFormData} onNext={() => setCurrentStep(3)} onBack={prevStepCategory} selectedCategory={selectedCategoryId} selectedPlan={selectedPlanId} />
//               )}
//           </motion.div>
//         );

//       case 3:
//         const selectedPlanObj = memberShipPlanData?.plans?.find((p) => p._id === selectedPlanId);
//         return (
//           <PaymentSection
//             selectedPayment={selectedPaymentGateway}
//             setSelectedPayment={setSelectedPaymentGateway}
//             selectedCategory={selectedCategoryId}
//             selectedPlan={selectedPlanId}
//             categoryName={memberShipPlanData?.name ?? ""}
//             planName={selectedPlanObj?.name ?? ''}
//             displayAmountRupees={selectedPlanObj?.price?.amount}
//             displayCurrency={selectedPlanObj?.price?.currency ?? 'INR'}
//             formData={formData}
//             onBack={handleBack}
//             onPayment={handlePayment}
//           />
//         );

//       default: return null;
//     }
//   };

//   return (
//     /* 🌑 Screenshot Theme Wrapper */
//     <div className="min-h-screen bg-[#020b10] relative overflow-hidden">
      
//       {/* 🏁 Cyan Grid Layer */}
//       <div 
//         className="absolute inset-0 opacity-[0.12] pointer-events-none"
//         style={{
//           backgroundImage: `linear-gradient(#06b6d4 0.5px, transparent 0.5px), linear-gradient(90deg, #06b6d4 0.5px, transparent 0.5px)`,
//           backgroundSize: '50px 50px'
//         }}
//       ></div>

//       {/* 🔮 Depth Glows */}
//       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -z-10"></div>
//       <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] -z-10"></div>

//       <HeroSection isRoboClub={isRoboClub} />

//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
//         <ProgressSteps steps={STEPS} currentStep={currentStep} />
//         <div className="mt-12">
//             {renderStepContent()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MembershipPage;



// kailash code in memebership
import { motion } from "framer-motion";
import {
  ArrowRight,
  Loader2
} from "lucide-react";
import { PaymentSection, ShippingInfoForm, PersonalInfoForm, PlanCard, CategoryCard, ProgressSteps, HeroSection, StudentMembershipComparisonSection } from "../components/membership";

// Import constants
import {
  STEPS
} from "../constants/membershipData";

// Import hook
import { useMembershipForm } from "../hooks/useMembershipForm";

// Import icons
import * as Icons from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoriesRequest, fetchCategoryRequest, selectCategories, selectHasCategoriesLoaded, selectSingleCategory } from "../app/categories/categoriesSlice";

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
      <h3 className="mt-6 text-xl font-semibold text-black">Loading....</h3>
     
    </div>
  </div>
);

const MembershipPage = () => {
  // eslint config in this repo doesn't count `<motion.div>` as a usage of `motion`.
  // Keep a harmless reference so `no-unused-vars` doesn't fail.
  const _motion = motion;
  const location = useLocation();
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [selectedPaymentGateway, setSelectedPaymentGateway] = useState('razorpay'); // payment method only; never use for category_id
  const [isLoading, setIsLoading] = useState(true);
  const [hasShownLoading, setHasShownLoading] = useState(false);
  const [showStudentBenefits, setShowStudentBenefits] = useState(false);

  const memberShipCategory = useSelector(selectCategories);
  const hasCategoriesLoaded = useSelector(selectHasCategoriesLoaded);
  const memberShipPlanData = useSelector(selectSingleCategory);
  const dispatch = useDispatch();
  const navState = location?.state || null;
  const [hasAppliedNavState, setHasAppliedNavState] = useState(false);

  const {
    isRoboClub,
    currentStep,
    setCurrentStep,
    formData,
    updateFormData,
    handleContinue,
    handleBack,
    nextStep,
    prevStepCategory,
    handlePayment
  } = useMembershipForm();

  useEffect(() => {
    dispatch(fetchCategoriesRequest());
  }, [dispatch]);

  // Apply navigation state (e.g. coming from /student-membership CTA)
  useEffect(() => {
    if (hasAppliedNavState) return;
    if (!navState) return;
    if (!memberShipCategory?.data?.length) return;

    const desiredCategoryName = (navState.autoCategoryName || "").toLowerCase();
    if (!desiredCategoryName) {
      setTimeout(() => setHasAppliedNavState(true), 0);
      return;
    }

    const foundCategory =
      memberShipCategory.data.find((c) => (c?.name || "").toLowerCase().includes(desiredCategoryName)) || null;

    if (foundCategory?._id) {
      setTimeout(() => setSelectedCategoryId(foundCategory._id), 0);
    }

    setTimeout(() => setHasAppliedNavState(true), 0);
  }, [hasAppliedNavState, navState, memberShipCategory?.data]);

  useEffect(() => {
    if (selectedCategoryId) {
      dispatch(fetchCategoryRequest(selectedCategoryId));
    }
  }, [dispatch, selectedCategoryId]);

  // After category plans load, optionally auto-select plan + jump to Details step
  useEffect(() => {
    if (!navState) return;
    if (!hasAppliedNavState) return;
    if (!memberShipPlanData?.plans?.length) return;

    // Auto select plan once
    if (!selectedPlanId && navState.autoPlanName) {
      const desiredPlanName = String(navState.autoPlanName).toLowerCase();
      const foundPlan =
        memberShipPlanData.plans.find((p) => (p?.name || "").toLowerCase().includes(desiredPlanName)) ||
        memberShipPlanData.plans[0];

      if (foundPlan?._id) {
        setTimeout(() => {
          setSelectedPlanId(foundPlan._id);
          updateFormData("categoryId", selectedCategoryId);
          updateFormData("planId", foundPlan._id);
        }, 0);
      }
    }

    // Jump to Personal & Contact Information (Details step)
    // Important: only jump forward to step 2. Never pull the user back from later steps.
    if (navState.jumpToStep === 2 && currentStep < 2) {
      setCurrentStep(2);
    }
  }, [
    navState,
    hasAppliedNavState,
    memberShipPlanData?.plans,
    selectedPlanId,
    selectedCategoryId,
    currentStep,
    setCurrentStep,
    updateFormData,
  ]);

  // Scroll to Personal & Contact Information when requested
  useEffect(() => {
    if (!navState?.scrollTo) return;
    if (currentStep !== 2) return;

    const el = document.getElementById(navState.scrollTo);
    if (!el) return;
    const t = setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
    return () => clearTimeout(t);
  }, [navState?.scrollTo, currentStep]);

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

  const categoryAdvanceLockRef = useRef(false);

  useEffect(() => {
    categoryAdvanceLockRef.current = false;
  }, [currentStep]);

  /** Advance from step 0 using a concrete category (avoids stale state vs. setState batching). */
  const proceedFromCategory = useCallback(
    (category) => {
      if (!category?._id || categoryAdvanceLockRef.current) return;
      categoryAdvanceLockRef.current = true;

      setSelectedCategoryId(category._id);
      setSelectedPlanId(null);
      setShowStudentBenefits(false);
      updateFormData("categoryId", category._id);
      updateFormData("planId", "");

      handleContinue();
    },
    [handleContinue, updateFormData]
  );

  // Removed auto-navigation to shipping form - user stays on step 1 after signup
  // User can manually proceed to shipping form when ready

  const handleStudentComparisonSelect = useCallback(
    ({ planName, jumpToStep, scrollTo } = {}) => {
      const desiredPlanName = String(planName || "").toLowerCase();
      const foundPlan =
        memberShipPlanData?.plans?.find((p) => String(p?.name || "").toLowerCase().includes(desiredPlanName)) || null;

      if (!foundPlan?._id) return;

      setSelectedPlanId(foundPlan._id);
      updateFormData("categoryId", selectedCategoryId);
      updateFormData("planId", foundPlan._id);

      if (jumpToStep === 2) {
        setCurrentStep(2);
      }

      if (scrollTo) {
        setTimeout(() => {
          const el = document.getElementById(scrollTo);
          el?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
      }
    },
    [memberShipPlanData?.plans, selectedCategoryId, setCurrentStep, updateFormData]
  );

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
    setSelectedPlanId(null);
    setShowStudentBenefits(false);
    updateFormData("categoryId", id);
    updateFormData("planId", "");
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
            className="bg-white rounded-2xl shadow-xl p-8 max-w-5x mx-auto border border-gray-200"
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {categoriesWithIcons?.map((category, index) => (
                    <CategoryCard
                      key={category._id}
                      category={category}
                      index={index}
                      selectedCategoryId={selectedCategoryId}
                      onSelectCategory={() => handleCategorySelect(category._id)}
                      onViewDetails={proceedFromCategory}
                    />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        );

      case 1: {
        const selectedCategoryName =
          memberShipCategory?.data?.find((c) => c._id === selectedCategoryId)?.name ?? "";
        const isStudentCategory = selectedCategoryName.toLowerCase().includes("student");
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

            {/* {isStudentCategory && (
              <div className="mb-10">
                <button
                  type="button"
                  onClick={() => setShowStudentBenefits((v) => !v)}
                  className="w-full md:w-auto px-5 py-3 rounded-xl border border-gray-300 text-black font-semibold hover:border-gray-400 transition-colors"
                >
                  {showStudentBenefits ? "Hide student benefits" : "Explore student benefits"}
                </button>

                {showStudentBenefits && (
                  <div className="mt-6">
                    <StudentMembershipComparisonSection onSelectPlan={handleStudentComparisonSelect} />
                  </div>
                )}
              </div>
            )} */}

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
      }

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
                <div id="personal-contact-info">
                  <PersonalInfoForm
                    formData={formData}
                    updateFormData={updateFormData}
                    onNext={nextStep}
                    onBack={prevStepCategory}
                  />
                </div>
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

      case 3: {
        const selectedPlanObj = memberShipPlanData?.plans?.find((p) => p._id === selectedPlanId);
        const categoryName =
          memberShipPlanData?.name ??
          memberShipCategory?.data?.find((c) => c._id === selectedCategoryId)?.name ??
          '';
        const planName = selectedPlanObj?.name ?? '';
        const displayAmountRupees = selectedPlanObj?.price?.amount;
        const displayCurrency = selectedPlanObj?.price?.currency ?? 'INR';
        return (
          <PaymentSection
            selectedPayment={selectedPaymentGateway}
            setSelectedPayment={setSelectedPaymentGateway}
            selectedCategory={selectedCategoryId}
            selectedPlan={selectedPlanId}
            categoryName={categoryName}
            planName={planName}
            displayAmountRupees={displayAmountRupees}
            displayCurrency={displayCurrency}
            formData={formData}
            onBack={handleBack}
            onPayment={handlePayment}
          />
        );
      }

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