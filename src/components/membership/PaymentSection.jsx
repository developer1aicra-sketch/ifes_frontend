import { motion } from "framer-motion";
import { Check, Shield, Lock, CreditCard, Globe, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";
import { createPayment, verifyPayment } from "../../api/paymentApi";

export const PaymentSection = ({
  selectedPayment,
  setSelectedPayment,
  selectedCategory,
  selectedPlan,
  formData,
  onBack,
  onPayment
}) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [paymentData, setPaymentData] = useState(null); // Store payment data from API
  const [razorpayInstance, setRazorpayInstance] = useState(null); // Store Razorpay instance for cleanup

  // Ensure Razorpay is always selected (only payment option available)
  useEffect(() => {
    if (selectedPayment !== 'razorpay' && setSelectedPayment) {
      setSelectedPayment('razorpay');
    }
  }, [selectedPayment]); // Removed setSelectedPayment from deps to avoid unnecessary re-renders
  
  const calculateTotal = () => {
    switch (selectedCategory) {
      case 'student':
        return selectedPlan === 'basic' ? 10 : 50;
      case 'professional':
        return 100;
      case 'institute':
        return 200;
      case 'corporate':
        return 500;
      default:
        return 0;
    }
  };

  const totalAmount = calculateTotal();
  
  // Format amount from API response (amount is in paise, convert to rupees)
  const formatAmount = (amountInPaise) => {
    if (!amountInPaise) return totalAmount;
    return (amountInPaise / 100).toFixed(2);
  };
  
  // Get display amount - use API response if available, otherwise use calculated total
  const displayAmount = paymentData?.amount 
    ? formatAmount(paymentData.amount) 
    : totalAmount;
  
  // Get currency from API response or default to INR
  const displayCurrency = paymentData?.currency || "INR";

  // Load Razorpay script on component mount (always needed since it's the only payment option)
  useEffect(() => {
    if (!razorpayLoaded) {
      // Check if script already exists
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript) {
        // Script already exists, just mark as loaded
        setRazorpayLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        setRazorpayLoaded(true);
        console.log('Razorpay SDK loaded successfully');
      };
      script.onerror = () => {
        setRazorpayLoaded(false);
        toast.error('Failed to load Razorpay SDK. Please refresh the page.', {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        });
      };
      document.body.appendChild(script);

      return () => {
        // Cleanup script on unmount - safely check if script exists before removing
        try {
          const scriptToRemove = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
          if (scriptToRemove && scriptToRemove.parentNode) {
            scriptToRemove.parentNode.removeChild(scriptToRemove);
          }
        } catch (error) {
          console.warn('Error removing Razorpay script:', error);
        }
      };
    }
  }, [razorpayLoaded]);

  // Razorpay payment gateway configuration (only payment option)
  const razorpayGateway = {
    id: 'razorpay',
    name: 'Razorpay',
    description: 'Secure payment via Cards, UPI, Net Banking, Wallets',
    icon: 'Rs',
    badge: 'Secure & Fast',
    features: ['Cards (Visa/Mastercard/Rupay)', 'UPI', 'Net Banking', 'Wallets']
  };

  const getPlanName = () => {
    const categoryNames = {
      student: 'Student',
      professional: 'Professional',
      institute: 'Institute',
      corporate: 'Corporate'
    };
    
    const planNames = {
      basic: 'Basic',
      premium: 'Premium',
      professional: 'Professional',
      institute: 'Institute',
      corporate: 'Corporate'
    };
    
    return `${categoryNames[selectedCategory]} ${planNames[selectedPlan]}`;
  };

  // Handle Razorpay payment
  const handleRazorpayPayment = async () => {
    if (!termsAccepted) {
      toast.error('Please accept the terms and conditions to proceed', {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }

    if (!razorpayLoaded) {
      toast.error('Payment gateway is loading. Please wait...', {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment order via API
      const response = await createPayment({
        gateway: "RAZORPAY",
        currency: "INR"
      });

      // Extract payment data from API response
      // Expected response structure:
      // {
      //   "success": true,
      //   "data": {
      //     "paymentId": "698daa634f31a0886addeca8",
      //     "orderId": "order_SFCTljhspOYAtp",
      //     "amount": 90738,
      //     "currency": "INR",
      //     "razorpayKey": "rzp_live_vOWkG1W1TBWQ1H",
      //     "userName": "Kailash Tanwar"
      //   }
      // }
      const paymentData = response.data?.success 
        ? response.data.data 
        : (response.data?.data || response.data);

      // Validate required fields from API response
      if (!paymentData) {
        throw new Error('Invalid payment response: No data received');
      }

      if (!paymentData.razorpayKey) {
        throw new Error('Invalid payment response: Missing razorpayKey');
      }

      if (!paymentData.orderId) {
        throw new Error('Invalid payment response: Missing orderId');
      }

      if (!paymentData.amount || paymentData.amount <= 0) {
        throw new Error('Invalid payment response: Missing or invalid amount');
      }

      console.log('Payment order created:', {
        paymentId: paymentData.paymentId,
        orderId: paymentData.orderId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        userName: paymentData.userName
      });

      // Store payment data for display
      setPaymentData(paymentData);

      // Razorpay checkout options
      const options = {
        key: paymentData.razorpayKey, // Razorpay public key from backend
        amount: paymentData.amount, // Amount in paise (already in correct format from API)
        currency: paymentData.currency || "INR", // Currency from API response
        name: "Technoxian",
        description: `Membership Payment - ${getPlanName()}`,
        order_id: paymentData.orderId, // Razorpay order ID from backend
        handler: function (razorpayResponse) {
          // Payment success handler - called by Razorpay after successful payment
          handlePaymentSuccess(razorpayResponse, paymentData.orderId, paymentData.paymentId);
        },
        prefill: {
          name: paymentData.userName || formData?.fullName || '',
          email: formData?.email || '',
          contact: formData?.phone || '',
        },
        notes: {
          paymentId: paymentData.paymentId, // Backend payment ID
          address: `${formData?.address || ''}, ${formData?.city || ''}, ${formData?.state || ''}, ${formData?.country || ''}`,
          membership_category: selectedCategory,
          membership_plan: selectedPlan,
        },
        theme: {
          color: '#DC2626', // Red color matching your theme
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
            setPaymentData(null); // Reset payment data on cancellation
            setRazorpayInstance(null); // Clear Razorpay instance
            toast.info('Payment cancelled', {
              position: "top-right",
              autoClose: 2000,
              theme: "dark",
            });
            // Navigate to /membership page when payment is cancelled
            setTimeout(() => {
              navigate('/membership');
            }, 500); // Small delay to allow toast to show
          }
        }
      };

      // Initialize Razorpay checkout
      if (window.Razorpay) {
        const razorpay = new window.Razorpay(options);
        setRazorpayInstance(razorpay); // Store instance for cleanup
        razorpay.open();
      } else {
        throw new Error('Razorpay SDK not loaded. Please refresh the page.');
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      setIsProcessing(false);
      setPaymentData(null); // Reset payment data on error
      
      // Extract error message from API response or use default
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || error.message 
        || 'Failed to initialize payment. Please try again.';
      
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000,
        theme: "dark",
      });
    }
  };

  // Handle payment success
  const handlePaymentSuccess = async (razorpayResponse, razorpayOrderId, backendPaymentId) => {
    try {
      setIsProcessing(true);
      
      console.log('Razorpay payment successful:', {
        razorpayPaymentId: razorpayResponse.razorpay_payment_id,
        razorpayOrderId: razorpayResponse.razorpay_order_id,
        razorpaySignature: razorpayResponse.razorpay_signature,
        backendPaymentId: backendPaymentId
      });
      
      toast.success('Payment successful! Verifying payment...', {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });

      // Call /payments/verify after successful Razorpay payment
      try {
        const verifyPayload = {
          paymentId: razorpayResponse.razorpay_payment_id,
          orderId: razorpayResponse.razorpay_order_id,
          signature: razorpayResponse.razorpay_signature,
        };

        console.log('Calling /payments/verify:', verifyPayload);
        const verificationResponse = await verifyPayment(verifyPayload);
        
        console.log('Payment verification successful:', verificationResponse.data);
        
        toast.success('Payment verified! Processing your membership...', {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        });

        // Call the parent's onPayment callback with complete payment details
        if (onPayment) {
          onPayment({
            success: true,
            paymentId: backendPaymentId, // Backend payment ID
            razorpayPaymentId: razorpayResponse.razorpay_payment_id,
            razorpayOrderId: razorpayResponse.razorpay_order_id,
            razorpaySignature: razorpayResponse.razorpay_signature,
            verificationData: verificationResponse.data,
          });
        }
      } catch (verifyError) {
        console.error('Payment verification error:', verifyError);
        
        // Extract error message
        const errorMessage = verifyError.response?.data?.message 
          || verifyError.response?.data?.error 
          || verifyError.message 
          || 'Verification failed';
        
        // Still call onPayment callback even if verification fails
        // (payment was successful at Razorpay, verification is backend confirmation)
        if (onPayment) {
          onPayment({
            success: true,
            paymentId: backendPaymentId,
            razorpayPaymentId: razorpayResponse.razorpay_payment_id,
            razorpayOrderId: razorpayResponse.razorpay_order_id,
            razorpaySignature: razorpayResponse.razorpay_signature,
            verificationError: errorMessage,
          });
        }
        
        toast.warning('Payment successful but verification failed. Please contact support.', {
          position: "top-right",
          autoClose: 4000,
          theme: "dark",
        });
      }
    } catch (error) {
      console.error('Error handling payment success:', error);
      toast.error('Error processing payment. Please contact support.', {
        position: "top-right",
        autoClose: 4000,
        theme: "dark",
      });
    } finally {
      setIsProcessing(false);
      setRazorpayInstance(null); // Clear Razorpay instance after payment processing
    }
  };

  // Cleanup Razorpay instance on component unmount
  useEffect(() => {
    return () => {
      if (razorpayInstance) {
        try {
          // Close Razorpay modal if still open
          if (razorpayInstance.close) {
            razorpayInstance.close();
          }
        } catch (error) {
          console.warn('Error closing Razorpay modal:', error);
        }
        setRazorpayInstance(null);
      }
    };
  }, [razorpayInstance]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    await handleRazorpayPayment();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-900"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Complete Your Membership</h1>
          <p className="text-gray-400">Final step to join our robotics community</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Gateway - Razorpay */}
            <div className="bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Payment Method</h2>
                <div className="flex items-center text-green-400 text-sm max-sm:text-xs">
                  <Lock size={14} className="mr-1" />
                  <span>Secure Payment</span>
                </div>
              </div>

              {/* Razorpay Payment Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="border-2 border-red-600 bg-gray-700/50 rounded-xl p-5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold bg-red-600 text-white">
                      {razorpayGateway.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">{razorpayGateway.name}</h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-red-600/20 text-red-400 border border-red-600/30">
                          {razorpayGateway.badge}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{razorpayGateway.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        {razorpayGateway.features.map((feature, index) => (
                          <span key={index} className="text-xs px-2 py-1 rounded bg-gray-900/50 text-gray-300">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-5 h-5 rounded-full border-2 border-red-600 bg-red-600 flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                </div>
              </motion.div>

              {/* Payment Security Info */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Shield className="text-green-400" size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-1">Payment Security</h4>
                    <p className="text-sm text-gray-400">
                      Your payment information is encrypted and securely processed. 
                      We never store your credit card details on our servers.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details Form (for direct card input if needed) */}
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 hidden">
              <h3 className="text-lg font-semibold text-white mb-4">Card Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Card Number
                  </label>
                  <div className="flex items-center bg-gray-700 border border-gray-600 rounded-lg px-4 py-3">
                    <CreditCard size={20} className="text-gray-400 mr-3" />
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="bg-transparent text-white w-full outline-none"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary & Payment */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>

              <div className="space-y-4">
                {/* Membership Details */}
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-white">{getPlanName()}</h3>
                      <p className="text-sm text-gray-400">Annual Membership</p>
                    </div>
                    <span className="font-bold text-red-400">
                      {displayCurrency === "INR" ? "₹" : "$"}{displayAmount}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Billed annually • Auto-renewable
                  </div>
                </div>

                {/* User Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Name:</span>
                    <span className="font-medium text-white">{formData?.fullName || 'N/A'}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Email:</span>
                    <span className="font-medium text-white">{formData?.email || 'N/A'}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Phone:</span>
                    <span className="font-medium text-white">{formData?.phone || 'N/A'}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Location:</span>
                    <span className="font-medium text-white">
                      {formData?.city || 'N/A'}, {formData?.country || 'N/A'}
                    </span>
                  </div>
                </div>

                <hr className="my-4 border-gray-700" />

                {/* Total Amount */}
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>
                      {displayCurrency === "INR" ? "₹" : "$"}{displayAmount} {displayCurrency}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-gray-300">
                    <span>Processing Fee</span>
                    <span className="text-green-400">
                      {displayCurrency === "INR" ? "₹" : "$"}0.00
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-700">
                    <span className="text-white">Total Amount</span>
                    <span className="text-red-400">
                      {displayCurrency === "INR" ? "₹" : "$"}{displayAmount} {displayCurrency}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-500 text-right">
                    Currency: {displayCurrency}
                  </div>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-start gap-3 mb-4">
                <Globe size={18} className="text-blue-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-white mb-1">Terms & Conditions</h4>
                  <p className="text-xs text-gray-400">
                    By completing this payment, you agree to our Terms of Service and Privacy Policy. 
                    Membership is non-refundable after 7 days.
                  </p>
                </div>
              </div>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="rounded bg-gray-700 border-gray-600 text-red-600 focus:ring-red-500" 
                />
                <span className="text-sm text-gray-300">
                  I agree to the terms and conditions
                </span>
              </label>
            </div>

            {/* Payment Button */}
            <motion.form
              onSubmit={handlePaymentSubmit}
              className="space-y-4"
            >
              <motion.button
                whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                type="submit"
                disabled={isProcessing}
                className={`w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl ${
                  isProcessing ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Check size={20} />
                    Complete Registration - {displayCurrency === "INR" ? "₹" : "$"}{displayAmount} {displayCurrency}
                  </>
                )}
              </motion.button>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={onBack}
                  className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
                >
                  ← Back to details
                </button>
              </div>
            </motion.form>

            {/* Payment Security Badges */}
          
          </div>
        </div>

        {/* Additional Info */}
        
      </div>
    </motion.div>
  );
};