import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CreditCard, Shield, Lock, Loader2, Check, Users, DollarSign, AlertCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import { createPayment, verifyPayment } from '../api/paymentApi'
import { normalizePaymentCreateResponse, formatAmountFromPaise, buildPaymentVerifyPayload } from '../utils/paymentUtils.js'

/**
 * BulkPaymentModal - Payment gateway modal for bulk member payments
 * Handles Razorpay integration for processing payments for multiple members at once
 */
const BulkPaymentModal = ({ 
  isOpen, 
  onClose, 
  selectedMembers = [], 
  amountPerMember = 500, 
  currency = 'INR', 
  onPaymentSuccess 
}) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [paymentData, setPaymentData] = useState(null)
  const [razorpayInstance, setRazorpayInstance] = useState(null)

  // Calculate total amount - fixed amount per member
  const totalAmount = useMemo(() => {
    return selectedMembers.length * amountPerMember
  }, [selectedMembers.length, amountPerMember])

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
    if (!amountInPaise) return totalAmount.toFixed(2)
    return formatAmountFromPaise(amountInPaise)
  }

  const displayAmount = paymentData?.amount != null ? formatAmount(paymentData.amount) : totalAmount.toFixed(2)
  const displayCurrency = paymentData?.currency || currency

  const handlePayment = async () => {
    if (selectedMembers.length === 0) {
      toast.error('Please select at least one member', {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      })
      return
    }

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
      // Create payment order via API for bulk payment
      const response = await createPayment({
        gateway: "RAZORPAY",
        currency: currency,
        amount: Math.round(totalAmount * 100), // Convert to paise
        memberIds: selectedMembers.map(m => m.id),
        memberCount: selectedMembers.length,
        amountPerMember: amountPerMember,
        paymentType: 'BULK_MEMBER_PAYMENT',
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

      console.log('Bulk payment order created:', {
        paymentId: paymentData.paymentId,
        orderId: paymentData.orderId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        memberCount: selectedMembers.length,
      })

      setPaymentData(paymentData)

      // Razorpay checkout options
      const options = {
        key: paymentData.razorpayKey,
        amount: paymentData.amount,
        currency: paymentData.currency || currency,
        name: "Technoxian",
        description: `Bulk Member Payment - ${selectedMembers.length} member(s)`,
        order_id: paymentData.orderId,
        handler: function (razorpayResponse) {
          handlePaymentSuccess(razorpayResponse, paymentData.orderId, paymentData.paymentId)
        },
        prefill: {
          name: paymentData.userName || 'Club Administrator',
          email: paymentData.userEmail || '',
          contact: paymentData.userPhone || '',
        },
        notes: {
          paymentId: paymentData.paymentId,
          memberCount: selectedMembers.length.toString(),
          amountPerMember: amountPerMember.toString(),
          memberIds: selectedMembers.map(m => m.id).join(','),
          paymentType: 'BULK_MEMBER_PAYMENT',
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
      
      console.log('Bulk payment successful:', {
        razorpayPaymentId: razorpayResponse.razorpay_payment_id,
        razorpayOrderId: razorpayResponse.razorpay_order_id,
        razorpaySignature: razorpayResponse.razorpay_signature,
        backendPaymentId: backendPaymentId,
        memberCount: selectedMembers.length,
      })
      
      toast.success(`Payment successful for ${selectedMembers.length} member(s)! Verifying...`, {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      })

      // POST /payments/verify after successful Razorpay payment (frontend architecture: success → verify → callback)
      try {
        const verifyPayload = buildPaymentVerifyPayload(razorpayResponse)
        const verificationResponse = await verifyPayment(verifyPayload)
        
        console.log('Bulk payment verification successful:', verificationResponse.data)
        
        toast.success(`Payment verified! Processed for ${selectedMembers.length} member(s).`, {
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
            selectedMembers: selectedMembers,
            totalAmount: totalAmount,
            memberCount: selectedMembers.length,
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
            selectedMembers: selectedMembers,
            totalAmount: totalAmount,
            memberCount: selectedMembers.length,
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
            <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center">
                    <Users className="text-blue-400" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Bulk Member Payment</h2>
                    <p className="text-sm text-slate-400">
                      Process payment for {selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''}
                    </p>
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

                {/* Selected Members List */}
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 max-h-64 overflow-y-auto">
                  <h3 className="text-sm font-medium text-slate-400 mb-3">
                    Selected Members ({selectedMembers.length})
                    <span className="ml-2 text-xs text-blue-400">(₹{amountPerMember} each)</span>
                  </h3>
                  <div className="space-y-2">
                    {selectedMembers.map((member, index) => (
                      <div key={member.id || index} className="flex items-center justify-between gap-3 p-3 bg-slate-900/50 rounded-lg hover:bg-slate-900/70 transition-colors">
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium text-sm truncate">{member.fullname || member.name}</p>
                          <p className="text-slate-400 text-xs truncate">{member.emailId || member.email}</p>
                        </div>
                        <div className="text-blue-400 font-semibold text-sm">
                          ₹{amountPerMember}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Members Selected</span>
                      <span className="text-white font-medium">{selectedMembers.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Amount per Member</span>
                      <span className="text-white font-medium">
                        {currency === "INR" ? "₹" : "$"}{amountPerMember}
                      </span>
                    </div>
                    <div className="border-t border-slate-700 pt-3 flex items-center justify-between">
                      <span className="text-lg font-bold text-white">Total Amount</span>
                      <span className="text-2xl font-bold text-blue-400">
                        {displayCurrency === "INR" ? "₹" : "$"}{displayAmount} {displayCurrency}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Security Info */}
                <div className="flex items-start gap-3 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
                  <Shield className="text-green-400 shrink-0 mt-0.5" size={18} />
                  <div>
                    <h4 className="font-medium text-white text-sm mb-1">Secure Bulk Payment</h4>
                    <p className="text-xs text-slate-400">
                      Your payment information is encrypted and securely processed via Razorpay. 
                      This single payment will process fees for all {selectedMembers.length} selected member{selectedMembers.length !== 1 ? 's' : ''}.
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
                      I agree to the terms and conditions and authorize this bulk payment for {selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''}
                    </span>
                  </label>
                </div>

                {/* Payment Button */}
                <motion.button
                  onClick={handlePayment}
                  disabled={isProcessing || !termsAccepted || !razorpayLoaded || selectedMembers.length === 0}
                  whileHover={{ scale: isProcessing || !termsAccepted || selectedMembers.length === 0 ? 1 : 1.02 }}
                  whileTap={{ scale: isProcessing || !termsAccepted || selectedMembers.length === 0 ? 1 : 0.98 }}
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

                {/* Warning */}
                {selectedMembers.length === 0 && (
                  <div className="flex items-center gap-2 text-yellow-400 text-sm p-3 bg-yellow-400/10 rounded-lg border border-yellow-400/20">
                    <AlertCircle size={16} />
                    <span>Please select at least one member to proceed with payment.</span>
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

export default BulkPaymentModal
