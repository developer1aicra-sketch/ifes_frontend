import { motion } from "framer-motion";
import { Check, Shield, Lock, CreditCard, Globe, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import { verifyPayment, normalizePaymentCreateResponse } from "../../api/paymentApi";
import { createMembershipThenPayment } from "../../app/membership/membershipApi";
import { CurrencySelect } from "../common/CurrencySelect";
import { PAYMENT_CURRENCY_OPTIONS } from "../../constants/paymentCurrencies";

// Currency list moved to `src/constants/paymentCurrencies.js`.

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
  const theme = useThemeClasses();
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [paymentData, setPaymentData] = useState(null); // Store payment data from API
  const [razorpayInstance, setRazorpayInstance] = useState(null); // Store Razorpay instance for cleanup
  const [selectedCurrency, setSelectedCurrency] = useState(displayCurrencyProp || "INR");

  // Centralized style tokens for light-blue payment UI architecture.
  const PAYMENT_THEME = {
    pageBg: "bg-sky-50",
    card: "bg-white border border-sky-100 shadow-sm rounded-xl",
    innerSurface: "bg-sky-50/80 border border-sky-100",
    textPrimary: "text-slate-900",
    textMuted: "text-slate-600",
    textSoft: "text-slate-500",
    accentText: theme.textPrimary || "text-sky-600",
    accentBg: theme.bgPrimary || "bg-sky-600",
    accentHover: theme.bgHover || "hover:bg-sky-700",
    accentRing: theme.ringPrimary || "ring-sky-500",
    accentBorder: "border-sky-300",
    accentSubtleBg: "bg-sky-100",
    accentSubtleText: "text-sky-700",
    divider: "border-sky-100",
  };

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

  const isCurrencyLocked = Boolean(paymentData?.orderId || paymentData?.paymentId);
  const displayCurrency = isCurrencyLocked
    ? (paymentData?.currency || "INR")
    : (selectedCurrency || displayCurrencyProp || "INR");

  useEffect(() => {
    if (isCurrencyLocked && paymentData?.currency && paymentData.currency !== selectedCurrency) {
      setSelectedCurrency(paymentData.currency);
    }
  }, [isCurrencyLocked, paymentData?.currency]);

  useEffect(() => {
    // If user changes plan/category (or navigates back and changes selections),
    // unlock currency by resetting previously created payment order state.
    setPaymentData(null);
  }, [selectedCategory, selectedPlan]);

  const amountNumber = displayAmount !== "" ? Number(displayAmount) : null;
  const formattedMoney =
    amountNumber == null || Number.isNaN(amountNumber)
      ? ""
      : new Intl.NumberFormat(displayCurrency === "INR" ? "en-IN" : "en-US", {
          style: "currency",
          currency: displayCurrency,
          currencyDisplay: "narrowSymbol",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(amountNumber);

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
        currency: selectedCurrency,
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
        currency: paymentData.currency || selectedCurrency || displayCurrencyProp || "INR",
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
          color: '#0ea5e9', // Light blue accent
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
      className={`min-h-screen py-10 sm:py-12 px-4 sm:px-6 lg:px-8 ${PAYMENT_THEME.pageBg}`}
    >
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className={`text-2xl sm:text-3xl font-bold ${PAYMENT_THEME.textPrimary} mb-2`}>Complete Your Membership</h1>
          <p className={PAYMENT_THEME.textMuted}>Final step to join our robotics community</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Gateway - Razorpay */}
            <div className={`${PAYMENT_THEME.card} p-5 sm:p-6`}>
              <div className="flex items-center justify-between mb-5 sm:mb-6">
                <h2 className={`text-lg sm:text-xl font-semibold ${PAYMENT_THEME.textPrimary}`}>Payment Method</h2>
                <div className={`flex items-center ${PAYMENT_THEME.accentText} text-sm max-sm:text-xs`}>
                  <Lock size={14} className="mr-1 flex-shrink-0" />
                  <span>Secure Payment</span>
                </div>
              </div>

              {/* Razorpay Payment Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`border-2 ${PAYMENT_THEME.accentBorder} ${PAYMENT_THEME.innerSurface} rounded-xl p-4 sm:p-5`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-lg font-bold ${PAYMENT_THEME.accentBg} text-white flex-shrink-0`}>
                      {razorpayGateway.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`font-semibold ${PAYMENT_THEME.textPrimary}`}>{razorpayGateway.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${PAYMENT_THEME.accentSubtleBg} ${PAYMENT_THEME.accentSubtleText} border ${PAYMENT_THEME.accentBorder}`}>
                          {razorpayGateway.badge}
                        </span>
                      </div>
                      <p className={`text-sm ${PAYMENT_THEME.textMuted} mt-1`}>{razorpayGateway.description}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {razorpayGateway.features.map((feature, index) => (
                          <span key={index} className="text-xs px-2 py-1 rounded bg-white text-slate-700 border border-sky-100">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 ${PAYMENT_THEME.accentBorder} ${PAYMENT_THEME.accentBg} flex items-center justify-center flex-shrink-0`}>
                    <Check size={12} className="text-white" />
                  </div>
                </div>
              </motion.div>

          
            </div>

            {/* Payment Details Form (for direct card input if needed) - hidden */}
            <div className={`${PAYMENT_THEME.card} p-6 hidden`}>
              <h3 className={`text-lg font-semibold ${PAYMENT_THEME.textPrimary} mb-4`}>Card Details</h3>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${PAYMENT_THEME.textMuted} mb-2`}>
                    Card Number
                  </label>
                  <div className="flex items-center bg-white border border-sky-100 rounded-lg px-4 py-3">
                    <CreditCard size={20} className="text-slate-500 mr-3 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="bg-transparent text-slate-900 w-full outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${PAYMENT_THEME.textMuted} mb-2`}>
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full bg-white border border-sky-100 rounded-lg px-4 py-3 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${PAYMENT_THEME.textMuted} mb-2`}>
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full bg-white border border-sky-100 rounded-lg px-4 py-3 text-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary & Payment */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className={`${PAYMENT_THEME.card} p-5 sm:p-6`}>
              <h2 className={`text-lg sm:text-xl font-semibold ${PAYMENT_THEME.textPrimary} mb-4`}>Order Summary</h2>

              <div className="space-y-4">
                {/* Currency */}
                <div
                  className={`${PAYMENT_THEME.innerSurface} rounded-lg p-2 flex items-start justify-between gap-3`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className={`text-sm font-medium ${PAYMENT_THEME.textPrimary}`}>Currency</div>
                      {isCurrencyLocked ? (
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold ${PAYMENT_THEME.accentSubtleText} bg-sky-100 border border-sky-200 rounded-full px-2 py-0.5 flex-shrink-0`}
                          title="Currency is locked after the payment order is created."
                        >
                          <Lock size={14} className={PAYMENT_THEME.accentText} />
                          Locked
                        </span>
                      ) : (
                      <></>
                      )}
                    </div>
                    <div className={`text-xs ${PAYMENT_THEME.textSoft} mt-1`}>
                      {isCurrencyLocked
                        ? `Using ${displayCurrency}`
                        : "Select before starting the payment checkout"}
                    </div>
                  </div>
                </div>
                  <CurrencySelect
                    value={displayCurrency}
                    disabled={isProcessing || isCurrencyLocked}
                    onChange={(code) => {
                      const next = String(code || "").toUpperCase();
                      setSelectedCurrency(next || "INR");
                    }}
                    size="sm"
                    className="w-[260px] sm:w-[320px] flex-shrink-0"
                    ariaLabel="Select currency"
                  />

                {/* Membership Details */}
                <div className="bg-sky-50/80 rounded-lg p-4 border border-sky-100">
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <div className="min-w-0">
                      <h3 className={`font-medium ${PAYMENT_THEME.textPrimary}`}>{orderSummaryTitle}</h3>
                      <p className={`text-sm ${PAYMENT_THEME.textMuted}`}>Annual Membership</p>
                    </div>
                    <span className={`font-bold ${PAYMENT_THEME.accentText} flex-shrink-0`}>
                      {formattedMoney !== "" ? formattedMoney : "—"}
                    </span>
                  </div>
                  <div className={`text-xs ${PAYMENT_THEME.textSoft}`}>
                    Billed annually • Auto-renewable
                  </div>
                </div>

                {/* User Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-2">
                    <span className={PAYMENT_THEME.textMuted}>Name:</span>
                    <span className={`font-medium ${PAYMENT_THEME.textPrimary} text-right truncate max-w-[60%]`}>{formData?.fullName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className={PAYMENT_THEME.textMuted}>Email:</span>
                    <span className={`font-medium ${PAYMENT_THEME.textPrimary} text-right truncate max-w-[60%]`}>{formData?.email || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className={PAYMENT_THEME.textMuted}>Phone:</span>
                    <span className={`font-medium ${PAYMENT_THEME.textPrimary} text-right`}>{formData?.phone || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className={PAYMENT_THEME.textMuted}>Location:</span>
                    <span className={`font-medium ${PAYMENT_THEME.textPrimary} text-right truncate max-w-[60%]`}>
                      {formData?.city || 'N/A'}, {formData?.country || 'N/A'}
                    </span>
                  </div>
                </div>

                <hr className={`my-4 ${PAYMENT_THEME.divider}`} />

                {/* Total Amount */}
                <div className="space-y-2">
                  <div className={`flex justify-between ${PAYMENT_THEME.textMuted}`}>
                    <span>Subtotal</span>
                    <span>
                      {formattedMoney !== "" ? formattedMoney : "—"}
                    </span>
                  </div>
                  <div className={`flex justify-between ${PAYMENT_THEME.textMuted}`}>
                    <span>Processing Fee</span>
                    <span className={PAYMENT_THEME.accentText}>
                      {new Intl.NumberFormat(displayCurrency === "INR" ? "en-IN" : "en-US", {
                        style: "currency",
                        currency: displayCurrency,
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(0)}
                    </span>
                  </div>
                  <div className={`flex justify-between text-lg font-bold pt-2 border-t ${PAYMENT_THEME.divider}`}>
                    <span className={PAYMENT_THEME.textPrimary}>Total Amount</span>
                    <span className={PAYMENT_THEME.accentText}>
                      {formattedMoney !== "" ? formattedMoney : "—"}
                    </span>
                  </div>
                  <div className={`text-xs ${PAYMENT_THEME.textSoft} text-right`}>
                    Currency: {displayCurrency}
                  </div>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className={`${PAYMENT_THEME.card} p-5 sm:p-6`}>
              <div className="flex items-start gap-3 mb-4">
                <Globe size={18} className={`${PAYMENT_THEME.accentText} mt-0.5 flex-shrink-0`} />
                <div>
                  <h4 className={`font-medium ${PAYMENT_THEME.textPrimary} mb-1`}>Terms & Conditions</h4>
                  <p className={`text-xs ${PAYMENT_THEME.textMuted}`}>
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
                  className={`rounded bg-white border-sky-300 text-sky-600 focus:${PAYMENT_THEME.accentRing} focus:ring-offset-0 focus:ring-offset-transparent`} 
                />
                <span className={`text-sm ${PAYMENT_THEME.textMuted}`}>
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
                className={`w-full ${PAYMENT_THEME.accentBg} ${PAYMENT_THEME.accentHover} text-white font-semibold py-3.5 sm:py-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl ${
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
                    <span className="truncate">
                      Complete Registration{formattedMoney !== "" ? ` - ${formattedMoney}` : ""}
                    </span>
                  </>
                )}
              </motion.button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={onBack}
                  className={`text-sm font-medium transition-colors ${PAYMENT_THEME.textMuted} ${PAYMENT_THEME.accentText}`}
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