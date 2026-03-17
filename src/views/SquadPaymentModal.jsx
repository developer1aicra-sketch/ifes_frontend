import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Shield, Lock, Loader2, AlertCircle, Users, Trophy } from 'lucide-react';
import { toast } from 'react-toastify';
import { createCompetitionPaymentForSquads, verifyPayment } from '../api/paymentApi.js';
import { normalizePaymentCreateResponse, formatAmountFromPaise, buildPaymentVerifyPayload } from '../utils/paymentUtils.js';

/**
 * SquadPaymentModal - Payment gateway modal for squad entry fee
 * Uses POST /payment/create and POST /payments/verify with Razorpay.
 */
const SquadPaymentModal = ({
  isOpen,
  onClose,
  squad,
  clubId,
  currency = 'INR',
  onPaymentSuccess,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [razorpayInstance, setRazorpayInstance] = useState(null);

  const entryFee = Number(squad?.entry_fee ?? 0);
  const teamName = squad?.teamName || squad?.name || 'Squad';
  const category = squad?.category || 'Competition';

  // Load Razorpay script when modal opens
  useEffect(() => {
    if (!isOpen || razorpayLoaded) return;

    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existingScript) {
      setRazorpayLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => {
      setRazorpayLoaded(false);
      toast.error('Failed to load Razorpay SDK. Please refresh the page.', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'dark',
      });
    };
    document.body.appendChild(script);

    return () => {
      try {
        const scriptToRemove = document.querySelector(
          'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
        );
        if (scriptToRemove && scriptToRemove.parentNode) {
          scriptToRemove.parentNode.removeChild(scriptToRemove);
        }
      } catch {
        // no-op
      }
    };
  }, [isOpen, razorpayLoaded]);

  // Cleanup Razorpay instance when unmounting
  useEffect(() => {
    return () => {
      if (razorpayInstance?.close) {
        try {
          razorpayInstance.close();
        } catch {
          // no-op
        }
      }
      setRazorpayInstance(null);
    };
  }, [razorpayInstance]);

  // Reset internal state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsProcessing(false);
      setPaymentData(null);
      setTermsAccepted(false);
      setRazorpayInstance(null);
    }
  }, [isOpen]);

  const formatAmount = (amountInPaise) => {
    if (!amountInPaise) return (entryFee || 0).toFixed(2);
    return formatAmountFromPaise(amountInPaise);
  };

  const displayAmount =
    paymentData?.amount != null ? formatAmount(paymentData.amount) : (entryFee || 0).toFixed(2);
  const displayCurrency = paymentData?.currency || currency;

  const openRazorpayCheckout = (rawData) => {
    const normalized = normalizePaymentCreateResponse(rawData);

    if (!normalized.amount || normalized.amount <= 0) {
      throw new Error('Invalid payment amount');
    }

    setPaymentData(normalized);

    const options = {
      key: normalized.razorpayKey,
      amount: normalized.amount,
      currency: normalized.currency || currency,
      name: 'Technoxian',
      description: `Squad Entry Fee - ${teamName}`,
      order_id: normalized.orderId,
      handler: (razorpayResponse) => {
        handlePaymentSuccess(razorpayResponse, normalized.orderId, normalized.paymentId);
      },
      prefill: {
        name: normalized.userName || 'Club Administrator',
        email: normalized.userEmail || '',
        contact: normalized.userPhone || '',
      },
      notes: {
        paymentId: normalized.paymentId,
        purchaseType: 'COMPETITION',
        squadId: squad._id || squad.id,
        clubId: clubId || squad.club_id,
        competitionId: squad.competition_id || squad.competitionId,
        teamName,
        category,
      },
      theme: {
        color: '#22c55e',
      },
      modal: {
        ondismiss: () => {
          setIsProcessing(false);
          setPaymentData(null);
          setRazorpayInstance(null);
          toast.info('Payment cancelled', {
            position: 'top-right',
            autoClose: 2000,
            theme: 'dark',
          });
        },
      },
      handler_error: (error) => {
        setIsProcessing(false);
        setPaymentData(null);
        setRazorpayInstance(null);
        const msg =
          error?.error?.description ||
          error?.error?.reason ||
          error?.error?.code ||
          'Payment failed. Please try again.';
        toast.error(`Payment failed: ${msg}`, {
          position: 'top-right',
          autoClose: 4000,
          theme: 'dark',
        });
      },
    };

    if (window.Razorpay) {
      const razorpay = new window.Razorpay(options);
      setRazorpayInstance(razorpay);
      razorpay.open();
    } else {
      throw new Error('Razorpay SDK not loaded. Please refresh the page.');
    }
  };

  const handlePayment = async () => {
    if (!squad || !squad._id) {
      toast.error('Invalid squad selected for payment.', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'dark',
      });
      return;
    }

    if (!termsAccepted) {
      toast.error('Please accept the terms and conditions to proceed', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'dark',
      });
      return;
    }

    if (!razorpayLoaded) {
      toast.error('Payment gateway is loading. Please wait...', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'dark',
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create competition payment order for this squad (POST /payment/create)
      const response = await createCompetitionPaymentForSquads(squad);
      const rawData = response.data?.success
        ? response.data.data
        : response.data?.data || response.data;

      openRazorpayCheckout(rawData);
    } catch (error) {
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        '';

      const lowerMsg =
        typeof backendMessage === 'string' ? backendMessage.toLowerCase() : '';

      const maybeExistingPaymentData =
        error?.response?.data?.data ||
        error?.response?.data?.payment ||
        error?.response?.data?.order ||
        error?.response?.data;

      // Special case: backend says all items already have payment in progress.
      // In this case we still want to open Razorpay using existing payment/order data.
      if (
        lowerMsg.includes('all selected items already have payment in progress') &&
        maybeExistingPaymentData
      ) {
        try {
          openRazorpayCheckout(maybeExistingPaymentData);
          return;
        } catch (inner) {
          console.error('Failed to initialize Razorpay from existing competition payment:', inner);
        }
      }

      setIsProcessing(false);
      setPaymentData(null);
      const msg =
        backendMessage ||
        'Failed to initialize payment. Please try again.';
      toast.error(msg, {
        position: 'top-right',
        autoClose: 4000,
        theme: 'dark',
      });
    }
  };

  const handlePaymentSuccess = async (razorpayResponse, razorpayOrderId, backendPaymentId) => {
    try {
      setIsProcessing(true);
      toast.success('Payment successful! Verifying...', {
        position: 'top-right',
        autoClose: 2000,
        theme: 'dark',
      });

      try {
        const verifyPayload = buildPaymentVerifyPayload(razorpayResponse);
        const verificationResponse = await verifyPayment(verifyPayload);

        toast.success('Payment verified. Squad entry confirmed.', {
          position: 'top-right',
          autoClose: 3000,
          theme: 'dark',
        });

        if (typeof onPaymentSuccess === 'function') {
          onPaymentSuccess({
            success: true,
            paymentId: backendPaymentId,
            razorpayPaymentId: razorpayResponse.razorpay_payment_id,
            razorpayOrderId,
            verificationData: verificationResponse.data,
            squad,
          });
        }

        setTimeout(() => onClose(), 1500);
      } catch (verifyError) {
        const msg =
          verifyError.response?.data?.message ||
          verifyError.response?.data?.error ||
          verifyError.message ||
          'Verification failed';

        toast.warning('Payment successful but verification failed. Please contact support.', {
          position: 'top-right',
          autoClose: 4000,
          theme: 'dark',
        });

        if (typeof onPaymentSuccess === 'function') {
          onPaymentSuccess({
            success: true,
            paymentId: backendPaymentId,
            verificationFailed: true,
            verificationError: msg,
            squad,
          });
        }
      }
    } catch {
      toast.error('Error processing payment. Please contact support.', {
        position: 'top-right',
        autoClose: 4000,
        theme: 'dark',
      });
    } finally {
      setIsProcessing(false);
      setRazorpayInstance(null);
      setPaymentData(null);
    }
  };

  if (!isOpen || !squad) return null;

  return (
    <AnimatePresence>
      {isOpen && squad && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-600/20 flex items-center justify-center">
                    <CreditCard className="text-emerald-400" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Squad Payment</h2>
                    <p className="text-sm text-slate-400">
                      Pay entry fee for <span className="font-semibold">{teamName}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  disabled={isProcessing}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <h3 className="text-sm font-medium text-slate-400 mb-3">Squad details</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Users size={16} className="text-blue-400" />
                        <span className="font-medium">{teamName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <Trophy size={16} className="text-amber-400" />
                        <span className="text-sm">{category}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Entry fee</span>
                      <span className="text-lg font-bold text-emerald-400">
                        {displayCurrency === 'INR' ? '₹' : '$'}
                        {displayAmount} {displayCurrency}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
                  <Shield className="text-green-400 shrink-0 mt-0.5" size={18} />
                  <p className="text-xs text-slate-400">
                    Your payment is encrypted and securely processed via Razorpay. Once verified, this
                    squad will be marked as paid for the selected competition.
                  </p>
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    disabled={isProcessing}
                    className="mt-1 rounded bg-slate-700 border-slate-600 text-emerald-600 focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-slate-300">
                    I agree to the terms and authorize this squad entry fee payment.
                  </span>
                </label>

                <motion.button
                  onClick={handlePayment}
                  disabled={isProcessing || !termsAccepted || !razorpayLoaded}
                  whileHover={{ scale: isProcessing || !termsAccepted ? 1 : 1.02 }}
                  whileTap={{ scale: isProcessing || !termsAccepted ? 1 : 0.98 }}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Processing payment...
                    </>
                  ) : (
                    <>
                      <Lock size={18} />
                      Pay Now - {displayCurrency === 'INR' ? '₹' : '$'}
                      {displayAmount}
                    </>
                  )}
                </motion.button>

                {!razorpayLoaded && (
                  <div className="flex items-center gap-2 text-yellow-400 text-sm">
                    <Loader2 size={16} className="animate-spin" />
                    <span>Loading payment gateway...</span>
                  </div>
                )}

                {entryFee <= 0 && (
                  <div className="flex items-center gap-2 text-yellow-400 text-sm p-3 bg-yellow-400/10 rounded-lg border border-yellow-400/20">
                    <AlertCircle size={16} />
                    <span>
                      Entry fee amount is not set for this squad. The backend may override the amount
                      when creating the payment order.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SquadPaymentModal;

