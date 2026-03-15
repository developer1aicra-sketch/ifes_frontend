import { motion } from "framer-motion";
import { Check, Shield, Lock, CreditCard, Globe, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";
import { verifyPayment, normalizePaymentCreateResponse } from "../../api/paymentApi";
import { createMembershipThenPayment } from "../../app/membership/membershipApi";

export const PaymentSection = ({
  selectedPayment,
  setSelectedPayment,
  selectedCategory,
  selectedPlan,
  categoryName = '',
  planName = '',
  displayAmountRupees,
  displayCurrency: displayCurrencyProp = 'INR',
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

  // Format amount from API response (amount is in paise, convert to rupees)
  const formatAmountFromPaise = (amountInPaise) =>
    amountInPaise != null ? (Number(amountInPaise) / 100).toFixed(2) : '';

  // Display amount: use payment/create response when available, else use plan price from props
  const displayAmount =
    paymentData?.amount != null
      ? formatAmountFromPaise(paymentData.amount)
      : (displayAmountRupees != null && displayAmountRupees !== '')
        ? Number(displayAmountRupees).toFixed(2)
        : '';

  const displayCurrency = paymentData?.currency || displayCurrencyProp || 'INR';

  // Order summary title: "CategoryName PlanName" e.g. "Student Basic"
  const orderSummaryTitle =
    categoryName && planName
      ? `${categoryName} ${planName}`
      : planName || categoryName || 'Membership';

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

    // user_id for membership/bulk = objectId from auth/signup (e.g. "69b4fd868055802980b91e90")
    const userId = formData?.createdUserId;
    if (!userId) {
      toast.error('Session expired. Please complete signup from the beginning.', {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }

    if (!selectedCategory || !selectedPlan) {
      toast.error('Category and plan are required. Please go back and select them.', {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Complete Registration: run /api/membership/bulk then /api/payment/create; use payment/create response for Razorpay
      const { paymentResponse } = await createMembershipThenPayment({
        userId,
        categoryId: selectedCategory,
        planId: selectedPlan,
      });

      const paymentData = normalizePaymentCreateResponse(paymentResponse);
      console.log('Payment order created (/payment/create response):', {
        paymentId: paymentData.paymentId,
        orderId: paymentData.orderId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        userName: paymentData.userName,
      });

      // Store payment data for display
      setPaymentData(paymentData);

      // Amount in paise: prefer API response; fallback to plan-derived (displayAmountRupees * 100) when backend doesn't return amount
      const amountPaise =
        paymentData.amount != null && paymentData.amount > 0
          ? paymentData.amount
          : displayAmountRupees != null && displayAmountRupees !== ''
            ? Math.round(Number(displayAmountRupees) * 100)
            : undefined;
      if (!amountPaise || amountPaise <= 0) {
        toast.error('Unable to determine payment amount. Please go back and select a plan.', {
          position: 'top-right',
          autoClose: 4000,
          theme: 'dark',
        });
        setIsProcessing(false);
        return;
      }

      // Razorpay checkout options
      const options = {
        key: paymentData.razorpayKey, // Razorpay public key from backend
        amount: amountPaise, // Amount in paise (from API or plan-derived)
        currency: paymentData.currency || displayCurrencyProp || 'INR',
        name: "Technoxian",
        description: `Membership Payment - ${orderSummaryTitle}`,
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
          color: '#3b82f6', // Dark blue theme accent
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

      // Log API details when membership/bulk or payment/create fails (helps debug)
      if (error.response) {
        console.error('API error:', {
          status: error.response.status,
          url: error.config?.url,
          data: error.response.data,
        });
      }

      // Extract error message from API response or use default
      const errData = error.response?.data;
      const errorMessage =
        (typeof errData?.message === 'string' && errData.message) ||
        (typeof errData?.error === 'string' && errData.error) ||
        errData?.msg ||
        error.message ||
        'Failed to initialize payment. Please try again.';
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
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
        
        toast.success('Payment verified! Redirecting to home...', {
          position: "top-right",
          autoClose: 2000,
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

        // Navigate to home on successful verification
        navigate('/', { replace: true });
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
      className="min-h-screen py-10 sm:py-12 px-4 sm:px-6 lg:px-8 bg-[#0a0f1a]"
    >
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Complete Your Membership</h1>
          <p className="text-slate-400">Final step to join our robotics community</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Gateway - Razorpay */}
            <div className="bg-slate-800/50 rounded-xl border border-white/10 shadow-lg p-5 sm:p-6">
              <div className="flex items-center justify-between mb-5 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-white">Payment Method</h2>
                <div className="flex items-center text-emerald-400 text-sm max-sm:text-xs">
                  <Lock size={14} className="mr-1 flex-shrink-0" />
                  <span>Secure Payment</span>
                </div>
              </div>

              {/* Razorpay Payment Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="border-2 border-blue-500/50 bg-slate-900/50 rounded-xl p-4 sm:p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-lg font-bold bg-blue-600 text-white flex-shrink-0">
                      {razorpayGateway.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-white">{razorpayGateway.name}</h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {razorpayGateway.badge}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 mt-1">{razorpayGateway.description}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {razorpayGateway.features.map((feature, index) => (
                          <span key={index} className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-300">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 border-blue-500 bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-white" />
                  </div>
                </div>
              </motion.div>

              {/* Payment Security Info */}
              <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-white/10">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex-shrink-0">
                    <Shield className="text-emerald-400" size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-1">Payment Security</h4>
                    <p className="text-sm text-slate-400">
                      Your payment information is encrypted and securely processed. 
                      We never store your credit card details on our servers.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details Form (for direct card input if needed) - hidden */}
            <div className="bg-slate-800/50 rounded-xl border border-white/10 shadow-lg p-6 hidden">
              <h3 className="text-lg font-semibold text-white mb-4">Card Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Card Number
                  </label>
                  <div className="flex items-center bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3">
                    <CreditCard size={20} className="text-slate-400 mr-3 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="bg-transparent text-white w-full outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary & Payment */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-slate-800/50 rounded-xl border border-white/10 shadow-lg p-5 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Order Summary</h2>

              <div className="space-y-4">
                {/* Membership Details */}
                <div className="bg-slate-900/50 rounded-lg p-4 border border-white/5">
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <div className="min-w-0">
                      <h3 className="font-medium text-white">{orderSummaryTitle}</h3>
                      <p className="text-sm text-slate-400">Annual Membership</p>
                    </div>
                    <span className="font-bold text-blue-400 flex-shrink-0">
                      {displayAmount !== '' ? (displayCurrency === "INR" ? "₹" : "$") + displayAmount : '—'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Billed annually • Auto-renewable
                  </div>
                </div>

                {/* User Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-400">Name:</span>
                    <span className="font-medium text-white text-right truncate max-w-[60%]">{formData?.fullName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-400">Email:</span>
                    <span className="font-medium text-white text-right truncate max-w-[60%]">{formData?.email || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-400">Phone:</span>
                    <span className="font-medium text-white text-right">{formData?.phone || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-400">Location:</span>
                    <span className="font-medium text-white text-right truncate max-w-[60%]">
                      {formData?.city || 'N/A'}, {formData?.country || 'N/A'}
                    </span>
                  </div>
                </div>

                <hr className="my-4 border-white/10" />

                {/* Total Amount */}
                <div className="space-y-2">
                  <div className="flex justify-between text-slate-300">
                    <span>Subtotal</span>
                    <span>
                      {displayAmount !== '' ? (displayCurrency === "INR" ? "₹" : "$") + displayAmount + " " + displayCurrency : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Processing Fee</span>
                    <span className="text-emerald-400">
                      {displayCurrency === "INR" ? "₹" : "$"}0.00
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-white/10">
                    <span className="text-white">Total Amount</span>
                    <span className="text-blue-400">
                      {displayAmount !== '' ? (displayCurrency === "INR" ? "₹" : "$") + displayAmount + " " + displayCurrency : "—"}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 text-right">
                    Currency: {displayCurrency}
                  </div>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="bg-slate-800/50 rounded-xl border border-white/10 shadow-lg p-5 sm:p-6">
              <div className="flex items-start gap-3 mb-4">
                <Globe size={18} className="text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-white mb-1">Terms & Conditions</h4>
                  <p className="text-xs text-slate-400">
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
                  className="rounded bg-slate-700 border-white/20 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 focus:ring-offset-transparent" 
                />
                <span className="text-sm text-slate-300">
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
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 sm:py-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl ${
                  isProcessing ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={20} className="animate-spin flex-shrink-0" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Check size={20} className="flex-shrink-0" />
                    <span className="truncate">Complete Registration{displayAmount !== '' ? ` - ${displayCurrency === "INR" ? "₹" : "$"}${displayAmount} ${displayCurrency}` : ''}</span>
                  </>
                )}
              </motion.button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={onBack}
                  className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
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