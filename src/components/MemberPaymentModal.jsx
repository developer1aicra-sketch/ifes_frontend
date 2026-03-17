import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CreditCard, Shield, Lock, Loader2, Check, AlertCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import { createPayment, verifyPayment } from '../api/paymentApi'
import { normalizePaymentCreateResponse, formatAmountFromPaise, buildPaymentVerifyPayload } from '../utils/paymentUtils.js'

/**
 * MemberPaymentModal - Payment gateway modal for member payments
 * Handles Razorpay integration for member subscription/fee payments
 */
const MemberPaymentModal = ({ isOpen, onClose, memberData, amount, currency = 'INR', onPaymentSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [paymentData, setPaymentData] = useState(null)
  const [razorpayInstance, setRazorpayInstance] = useState(null)

  // Load Razorpay script
  useEffect(() => {
    if (!isOpen || razorpayLoaded) return

    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')
    if (existingScript) {
      setRazorpayLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => {
      setRazorpayLoaded(true)
      console.log('Razorpay SDK loaded successfully')
    }
    script.onerror = () => {
      setRazorpayLoaded(false)
      toast.error('Failed to load Razorpay SDK. Please refresh the page.', {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      })
    }
    document.body.appendChild(script)

    return () => {
      try {
        const scriptToRemove = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')
        if (scriptToRemove && scriptToRemove.parentNode) {
          scriptToRemove.parentNode.removeChild(scriptToRemove)
        }
      } catch (error) {
        console.warn('Error removing Razorpay script:', error)
      }
    }
  }, [isOpen, razorpayLoaded])

  // Cleanup Razorpay instance on unmount
  useEffect(() => {
    return () => {
      if (razorpayInstance) {
        try {
          if (razorpayInstance.close) {
            razorpayInstance.close()
          }
        } catch (error) {
          console.warn('Error closing Razorpay modal:', error)
        }
        setRazorpayInstance(null)
      }
    }
  }, [razorpayInstance])

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsProcessing(false)
      setPaymentData(null)
      setTermsAccepted(false)
      setRazorpayInstance(null)
    }
  }, [isOpen])

  const formatAmount = (amountInPaise) => {
    if (!amountInPaise) return (amount || 0).toFixed(2)
    return formatAmountFromPaise(amountInPaise)
  }

  const displayAmount = paymentData?.amount != null ? formatAmount(paymentData.amount) : (amount || 0).toFixed(2)
  const displayCurrency = paymentData?.currency || currency

  const handlePayment = async () => {
    if (!termsAccepted) {
      toast.error('Please accept the terms and conditions to proceed', {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      })
      return
    }

    if (!razorpayLoaded) {
      toast.error('Payment gateway is loading. Please wait...', {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Create payment order via API
      const response = await createPayment({
        gateway: "RAZORPAY",
        currency: currency,
        amount: amount ? Math.round(amount * 100) : undefined, // Convert to paise if amount provided
        memberId: memberData?.id,
        memberEmail: memberData?.emailId || memberData?.email,
        memberName: memberData?.fullname || memberData?.name,
      })

      const rawData = response.data?.success 
        ? response.data.data 
        : (response.data?.data || response.data)

      const paymentData = normalizePaymentCreateResponse(rawData)

      if (!paymentData.razorpayKey || !paymentData.orderId) {
        throw new Error('Invalid payment response from server')
      }

      if (!paymentData.amount || paymentData.amount <= 0) {
        throw new Error('Invalid payment amount')
      }

      console.log('Payment order created:', {
        paymentId: paymentData.paymentId,
        orderId: paymentData.orderId,
        amount: paymentData.amount,
        currency: paymentData.currency,
      })

      setPaymentData(paymentData)

      // Razorpay checkout options
      const options = {
        key: paymentData.razorpayKey,
        amount: paymentData.amount,
        currency: paymentData.currency || currency,
        name: "Technoxian",
        description: `Member Payment - ${memberData?.fullname || memberData?.name || 'Member'}`,
        order_id: paymentData.orderId,
        handler: function (razorpayResponse) {
          handlePaymentSuccess(razorpayResponse, paymentData.orderId, paymentData.paymentId)
        },
        prefill: {
          name: paymentData.userName || memberData?.fullname || memberData?.name || '',
          email: memberData?.emailId || memberData?.email || '',
          contact: memberData?.phone || '',
        },
        notes: {
          paymentId: paymentData.paymentId,
          memberId: memberData?.id,
          memberEmail: memberData?.emailId || memberData?.email,
        },
        theme: {
          color: '#2563EB', // Blue color matching the component theme
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false)
            setPaymentData(null)
            setRazorpayInstance(null)
            toast.info('Payment cancelled', {
              position: "top-right",
              autoClose: 2000,
              theme: "dark",
            })
          }
        },
        handler_error: function(error) {
          console.error('Razorpay payment error:', error)
          setIsProcessing(false)
          setPaymentData(null)
          setRazorpayInstance(null)
          
          const errorMessage = error.error?.description 
            || error.error?.reason 
            || error.error?.code 
            || 'Payment failed. Please try again.'
          
          toast.error(`Payment failed: ${errorMessage}`, {
            position: "top-right",
            autoClose: 4000,
            theme: "dark",
          })
        }
      }

      // Initialize Razorpay checkout
      if (window.Razorpay) {
        const razorpay = new window.Razorpay(options)
        setRazorpayInstance(razorpay)
        razorpay.open()
      } else {
        throw new Error('Razorpay SDK not loaded. Please refresh the page.')
      }
    } catch (error) {
      console.error('Payment initialization error:', error)
      setIsProcessing(false)
      setPaymentData(null)
      
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || error.message 
        || 'Failed to initialize payment. Please try again.'
      
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000,
        theme: "dark",
      })
    }
  }

  const handlePaymentSuccess = async (razorpayResponse, razorpayOrderId, backendPaymentId) => {
    try {
      setIsProcessing(true)
      
      console.log('Razorpay payment successful:', {
        razorpayPaymentId: razorpayResponse.razorpay_payment_id,
        razorpayOrderId: razorpayResponse.razorpay_order_id,
        razorpaySignature: razorpayResponse.razorpay_signature,
        backendPaymentId: backendPaymentId
      })
      
      toast.success('Payment successful! Verifying payment...', {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      })

      // POST /payments/verify after successful Razorpay payment (frontend architecture: success → verify → callback)
      try {
        const verifyPayload = buildPaymentVerifyPayload(razorpayResponse)
        const verificationResponse = await verifyPayment(verifyPayload)
        
        console.log('Payment verification successful:', verificationResponse.data)
        
        toast.success('Payment verified successfully!', {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        })

        // Call success callback
        if (onPaymentSuccess && typeof onPaymentSuccess === 'function') {
          onPaymentSuccess({
            success: true,
            paymentId: backendPaymentId,
            razorpayPaymentId: razorpayResponse.razorpay_payment_id,
            razorpayOrderId: razorpayResponse.razorpay_order_id,
            razorpaySignature: razorpayResponse.razorpay_signature,
            verificationData: verificationResponse.data,
            memberData: memberData,
          })
        }

        // Close modal after successful payment
        setTimeout(() => {
          onClose()
        }, 1500)
      } catch (verifyError) {
        console.error('Payment verification error:', verifyError)
        
        const errorMessage = verifyError.response?.data?.message 
          || verifyError.response?.data?.error 
          || verifyError.message 
          || 'Verification failed'
        
        toast.warning('Payment successful but verification failed. Please contact support.', {
          position: "top-right",
          autoClose: 4000,
          theme: "dark",
        })

        // Still call success callback with verification error flag
        if (onPaymentSuccess && typeof onPaymentSuccess === 'function') {
          onPaymentSuccess({
            success: true,
            paymentId: backendPaymentId,
            razorpayPaymentId: razorpayResponse.razorpay_payment_id,
            razorpayOrderId: razorpayResponse.razorpay_order_id,
            razorpaySignature: razorpayResponse.razorpay_signature,
            verificationError: errorMessage,
            verificationFailed: true,
            memberData: memberData,
          })
        }
      }
    } catch (error) {
      console.error('Error handling payment success:', error)
      toast.error('Error processing payment. Please contact support.', {
        position: "top-right",
        autoClose: 4000,
        theme: "dark",
      })
    } finally {
      setIsProcessing(false)
      setRazorpayInstance(null)
      setPaymentData(null)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center">
                    <CreditCard className="text-blue-400" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Member Payment</h2>
                    <p className="text-sm text-slate-400">Complete payment to proceed</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  disabled={isProcessing}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Member Info */}
                {memberData && (
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <h3 className="text-sm font-medium text-slate-400 mb-2">Member Details</h3>
                    <div className="space-y-1">
                      <p className="text-white font-medium">{memberData.fullname || memberData.name}</p>
                      <p className="text-slate-400 text-sm">{memberData.emailId || memberData.email}</p>
                    </div>
                  </div>
                )}

                {/* Payment Amount */}
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Total Amount</span>
                    <span className="text-2xl font-bold text-blue-400">
                      {displayCurrency === "INR" ? "₹" : "$"}{displayAmount} {displayCurrency}
                    </span>
                  </div>
                </div>

                {/* Payment Security Info */}
                <div className="flex items-start gap-3 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
                  <Shield className="text-green-400 shrink-0 mt-0.5" size={18} />
                  <div>
                    <h4 className="font-medium text-white text-sm mb-1">Secure Payment</h4>
                    <p className="text-xs text-slate-400">
                      Your payment information is encrypted and securely processed via Razorpay. 
                      We never store your credit card details.
                    </p>
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      disabled={isProcessing}
                      className="mt-1 rounded bg-slate-700 border-slate-600 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50" 
                    />
                    <span className="text-sm text-slate-300">
                      I agree to the terms and conditions and authorize this payment
                    </span>
                  </label>
                </div>

                {/* Payment Button */}
                <motion.button
                  onClick={handlePayment}
                  disabled={isProcessing || !termsAccepted || !razorpayLoaded}
                  whileHover={{ scale: isProcessing || !termsAccepted ? 1 : 1.02 }}
                  whileTap={{ scale: isProcessing || !termsAccepted ? 1 : 0.98 }}
                  className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
                    isProcessing ? 'cursor-wait' : ''
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Lock size={18} />
                      Proceed to Payment - {displayCurrency === "INR" ? "₹" : "$"}{displayAmount}
                    </>
                  )}
                </motion.button>

                {/* Loading State */}
                {!razorpayLoaded && (
                  <div className="flex items-center gap-2 text-yellow-400 text-sm">
                    <Loader2 size={16} className="animate-spin" />
                    <span>Loading payment gateway...</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default MemberPaymentModal
