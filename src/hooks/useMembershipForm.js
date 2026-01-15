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
    phone: '',
    dateOfBirth: '',
    gender: '',
    tshirtSize: '',
    address: '',
    city: '',
    state: '',
    country: '',
    institute: '',
    grade: '',
    currentFormStep: 1
  });

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

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
    handleCategorySelect,
    handleContinue,
    handleBack,
    nextStep,
    prevStep,
    prevStepCategory,
    handlePayment
  };
};