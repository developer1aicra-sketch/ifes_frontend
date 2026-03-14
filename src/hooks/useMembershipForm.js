import { useState } from "react";
import { useLocation } from "react-router-dom";

export const useMembershipForm = () => {
  const location = useLocation();
  const isRoboClub = location.pathname === "/roboclub";
  
  const [selectedCategory, setSelectedCategory] = useState("student");
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState("basic");
  const [selectedPayment, setSelectedPayment] = useState('razorpay');
  
  const [formData, setFormData] = useState({
    fullName: '',
    designation: '',
    email: '',
    password: '',
    phone: '',
    countryCode: '+91', // Default to India
    categoryId: '',
    planId: '',
    createdUserId: '', // Backend objectId from auth/signup; sent as user_id in membership/bulk
    dateOfBirth: '',
    gender: '',
    tshirtSize: '',
    address: '',
    city: '',
    state: '',
    country: '', // Cascading: user selects Country first, then State, then City
    institute: '',
    grade: '',
    personalAndShippingAddress: {},
    currentFormStep: 1
  });

  // const handleCategorySelect = (categoryId) => {
  //   setSelectedCategory(categoryId);
  // };

  const handleContinue = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const nextStep = () => {
    setFormData(prev => ({ ...prev, currentFormStep: 2 }));
  };

  const prevStep = () => {
    setFormData(prev => ({ ...prev, currentFormStep: 1 }));
  };

  const prevStepCategory = () => {
    setCurrentStep(0);
    // Reset form step to 1 (PersonalInfoForm) when going back to category selection
    setFormData(prev => ({ ...prev, currentFormStep: 1 }));
  };

  const handlePayment = () => {
    console.log('Processing payment with:', selectedPayment);
    alert(`Redirecting to ${selectedPayment === 'razorpay' ? 'Razorpay' : 'PayPal'} payment gateway...`);
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return {
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
    // handleCategorySelect,
    handleContinue,
    handleBack,
    nextStep,
    prevStep,
    prevStepCategory,
    handlePayment
  };
};