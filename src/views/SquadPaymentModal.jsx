import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CreditCard, Shield, Lock, Loader2, AlertCircle, Users, Trophy } from 'lucide-react'
import { toast } from 'react-toastify'
import { createCompetitionPaymentForSquads, verifyPayment } from '../api/paymentApi.js'
import { normalizePaymentCreateResponse, formatAmountFromPaise, buildPaymentVerifyPayload } from '../utils/paymentUtils.js'
import { CurrencySelect } from '../components/common/CurrencySelect'
import { getFxRate } from '../utils/fxRates'

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
  const [isProcessing, setIsProcessing] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [paymentData, setPaymentData] = useState(null)
  const [razorpayInstance, setRazorpayInstance] = useState(null)
  const [orderInitError, setOrderInitError] = useState(null)
  const [selectedCurrency, setSelectedCurrency] = useState(currency || 'INR')
  const [convertedAmount, setConvertedAmount] = useState(null) // preview amount in selectedCurrency (unit currency)
  const [isConverting, setIsConverting] = useState(false)
  const [conversionError, setConversionError] = useState(false)

  const entryFee = Number(squad?.entry_fee ?? 0)
  const teamName = squad?.teamName || squad?.name || 'Squad'
  const category = squad?.category || 'Competition'

  // Source-of-truth currency for `squad.entry_fee` is USD (unless provided explicitly on the squad).
  // `currency` prop controls the initially selected/display currency, NOT the source currency.
  const baseCurrency = String(squad?.entry_fee_currency || 'USD').toUpperCase()
  const baseAmount = Number.isFinite(entryFee) && entryFee > 0 ? entryFee : null
  const isCurrencyLocked = Boolean(isProcessing || razorpayInstance || paymentData)

  // Load Razorpay script when modal opens
  useEffect(() => {
    if (!isOpen || razorpayLoaded) return

    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    )
    if (existingScript) {
      setRazorpayLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => setRazorpayLoaded(true)
    script.onerror = () => {
      setRazorpayLoaded(false)
      toast.error('Failed to load Razorpay SDK. Please refresh the page.', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'dark',
      })
    }
    document.body.appendChild(script)

    return () => {
      try {
        const scriptToRemove = document.querySelector(
          'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
        )
        if (scriptToRemove && scriptToRemove.parentNode) {
          scriptToRemove.parentNode.removeChild(scriptToRemove)
        }
      } catch {
        // no-op
      }
    }
  }, [isOpen, razorpayLoaded])

  // Cleanup Razorpay instance when unmounting
  useEffect(() => {
    return () => {
      if (razorpayInstance?.close) {
        try {
          razorpayInstance.close()
        } catch {
          // no-op
        }
      }
      setRazorpayInstance(null)
    }
  }, [razorpayInstance])

  // Reset internal state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsProcessing(false)
      setPaymentData(null)
      setOrderInitError(null)
      setTermsAccepted(false)
      setRazorpayInstance(null)
      setSelectedCurrency(currency || 'INR')
      setConvertedAmount(null)
      setIsConverting(false)
      setConversionError(false)
      return
    }

    // Initialize currency selection when the modal opens.
    setSelectedCurrency(currency || 'INR')
  }, [isOpen, currency])

  useEffect(() => {
    if (!isOpen) return
    if (isCurrencyLocked) return

    const targetCurrency = String(selectedCurrency || baseCurrency).toUpperCase()
    if (baseAmount == null) {
      setConvertedAmount(null)
      setConversionError(false)
      return
    }

    if (baseCurrency === targetCurrency) {
      setConvertedAmount(baseAmount)
      setConversionError(false)
      setIsConverting(false)
      return
    }

    let cancelled = false
    const t = setTimeout(async () => {
      try {
        setIsConverting(true)
        setConversionError(false)
        const rate = await getFxRate(baseCurrency, targetCurrency)
        if (cancelled) return
        setConvertedAmount(baseAmount * rate)
      } catch (e) {
        if (cancelled) return
        setConvertedAmount(baseAmount)
        setConversionError(true)
      } finally {
        if (!cancelled) setIsConverting(false)
      }
    }, 250)

    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [isOpen, isCurrencyLocked, baseAmount, baseCurrency, selectedCurrency])

  const formatAmount = (amountInPaise) => {
    if (!amountInPaise) return '0.00'
    return formatAmountFromPaise(amountInPaise)
  }

  // Display amount priority:
  // - Backend order (source of truth; in selected currency)
  // - Frontend FX preview (entryFee is in baseCurrency)
  const displayCurrency = isCurrencyLocked
    ? (paymentData?.currency || baseCurrency)
    : (conversionError ? baseCurrency : String(selectedCurrency || baseCurrency).toUpperCase())

  const displayAmount =
    paymentData?.amount != null
      ? formatAmount(paymentData.amount)
      : convertedAmount != null
        ? Number(convertedAmount).toFixed(2)
        : baseAmount != null
          ? Number(baseAmount).toFixed(2)
          : '—'

  const amountNumber = displayAmount !== '—' ? Number(displayAmount) : null
  const formattedMoney =
    amountNumber == null || Number.isNaN(amountNumber)
      ? '—'
      : new Intl.NumberFormat(displayCurrency === 'INR' ? 'en-IN' : 'en-US', {
          style: 'currency',
          currency: displayCurrency,
          currencyDisplay: 'narrowSymbol',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(amountNumber)

  const initPaymentOrder = async () => {
    if (!squad || !squad._id) return
    if (!razorpayLoaded) return
    if (paymentData) return

    const paymentCurrency = String(selectedCurrency || baseCurrency || 'INR').toUpperCase()
    setOrderInitError(null)
    setIsProcessing(true)

    try {
      const response = await createCompetitionPaymentForSquads(squad, paymentCurrency)
      const rawData = response.data?.success ? response.data.data : response.data?.data || response.data
      const normalized = normalizePaymentCreateResponse(rawData)

      if (!normalized.razorpayKey || !normalized.orderId) {
        throw new Error('Invalid payment response from server')
      }
      if (!normalized.amount || normalized.amount <= 0) {
        throw new Error('Invalid payment amount')
      }

      setPaymentData(normalized)
      return normalized
    } catch (error) {
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to initialize payment.'

      const lowerMsg = typeof backendMessage === 'string' ? backendMessage.toLowerCase() : ''
      const maybeExistingPaymentData =
        error?.response?.data?.data ||
        error?.response?.data?.payment ||
        error?.response?.data?.order ||
        error?.response?.data

      // Special case: backend says all items already have payment in progress.
      // In this case we still want to open Razorpay using existing payment/order data.
      if (
        lowerMsg.includes('all selected items already have payment in progress') &&
        maybeExistingPaymentData
      ) {
        const normalizedExisting = normalizePaymentCreateResponse(maybeExistingPaymentData)
        if (normalizedExisting?.razorpayKey && normalizedExisting?.orderId) {
          setPaymentData(normalizedExisting)
          return normalizedExisting
        }
      }

      setOrderInitError(backendMessage)
      toast.error(backendMessage, { position: 'top-right', autoClose: 4000, theme: 'dark' })
      return undefined
    } finally {
      setIsProcessing(false)
    }
  }
  const openRazorpayCheckout = (normalizedData, paymentCurrency) => {
    const normalized = normalizePaymentCreateResponse(normalizedData)

    if (!normalized.amount || normalized.amount <= 0) {
      throw new Error('Invalid payment amount')
    }

    setPaymentData(normalized)

    const options = {
      key: normalized.razorpayKey,
      amount: normalized.amount,
      currency: normalized.currency || paymentCurrency,
      name: 'Technoxian',
      description: `Squad Entry Fee - ${teamName}`,
      order_id: normalized.orderId,
      handler: (razorpayResponse) => {
        handlePaymentSuccess(razorpayResponse, normalized.orderId, normalized.paymentId)
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
          setIsProcessing(false)
          setRazorpayInstance(null)
          toast.info('Payment cancelled', {
            position: 'top-right',
            autoClose: 2000,
            theme: 'dark',
          })
        },
      },
      handler_error: (error) => {
        setIsProcessing(false)
        setRazorpayInstance(null)
        const msg =
          error?.error?.description ||
          error?.error?.reason ||
          error?.error?.code ||
          'Payment failed. Please try again.'
        toast.error(`Payment failed: ${msg}`, {
          position: 'top-right',
          autoClose: 4000,
          theme: 'dark',
        })
      },
    }

    if (window.Razorpay) {
      const razorpay = new window.Razorpay(options)
      setRazorpayInstance(razorpay)
      razorpay.open()
    } else {
      throw new Error('Razorpay SDK not loaded. Please refresh the page.')
    }
  }

  const handlePayment = async () => {
    if (!squad || !squad._id) {
      toast.error('Invalid squad selected for payment.', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'dark',
      })
      return
    }

    if (!termsAccepted) {
      toast.error('Please accept the terms and conditions to proceed', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'dark',
      })
      return
    }

    if (!razorpayLoaded) {
      toast.error('Payment gateway is loading. Please wait...', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'dark',
      })
      return
    }

    try {
      let data = paymentData
      if (!data) {
        data = await initPaymentOrder()
      }
      if (!data) {
        throw new Error(orderInitError || 'Payment order could not be created. Please try again.')
      }

      const paymentCurrency = String(data.currency || selectedCurrency || baseCurrency || 'INR').toUpperCase()
      openRazorpayCheckout(data, paymentCurrency)
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to initialize payment. Please try again.'
      toast.error(msg, {
        position: 'top-right',
        autoClose: 4000,
        theme: 'dark',
      })
    }
  }

  const handlePaymentSuccess = async (razorpayResponse, razorpayOrderId, backendPaymentId) => {
    try {
      setIsProcessing(true)
      toast.success('Payment successful! Verifying...', {
        position: 'top-right',
        autoClose: 2000,
        theme: 'dark',
      })

      try {
        const verifyPayload = buildPaymentVerifyPayload(razorpayResponse)
        const verificationResponse = await verifyPayment(verifyPayload)

        toast.success('Payment verified. Squad entry confirmed.', {
          position: 'top-right',
          autoClose: 3000,
          theme: 'dark',
        })

        if (typeof onPaymentSuccess === 'function') {
          onPaymentSuccess({
            success: true,
            paymentId: backendPaymentId,
            razorpayPaymentId: razorpayResponse.razorpay_payment_id,
            razorpayOrderId,
            verificationData: verificationResponse.data,
            squad,
          })
        }

        setTimeout(() => onClose(), 1500)
      } catch (verifyError) {
        const msg =
          verifyError.response?.data?.message ||
          verifyError.response?.data?.error ||
          verifyError.message ||
          'Verification failed'

        toast.warning('Payment successful but verification failed. Please contact support.', {
          position: 'top-right',
          autoClose: 4000,
          theme: 'dark',
        })

        if (typeof onPaymentSuccess === 'function') {
          onPaymentSuccess({
            success: true,
            paymentId: backendPaymentId,
            verificationFailed: true,
            verificationError: msg,
            squad,
          })
        }
      }
    } catch {
      toast.error('Error processing payment. Please contact support.', {
        position: 'top-right',
        autoClose: 4000,
        theme: 'dark',
      })
    } finally {
      setIsProcessing(false)
      setRazorpayInstance(null)
      setPaymentData(null)
    }
  }

  if (!isOpen || !squad) return null

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
                        {formattedMoney}
                      </span>
                    </div>
                    {!isCurrencyLocked && isConverting && (
                      <div className="mt-1 text-[11px] text-slate-500">Updating total…</div>
                    )}
                    {!isCurrencyLocked && conversionError && (
                      <div className="mt-1 text-[11px] text-yellow-300">
                        FX conversion unavailable. Showing base estimate.
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <span className="text-xs text-slate-500 whitespace-nowrap">Currency</span>
                  <div className="w-full sm:w-[240px]">
                    <CurrencySelect
                      value={selectedCurrency}
                      onChange={(code) => {
                        if (paymentData) return
                        setSelectedCurrency(String(code || '').toUpperCase())
                      }}
                      disabled={isProcessing || !!paymentData}
                      variant="dark"
                      size="sm"
                      ariaLabel="Select payment currency"
                      placeholder="Search currency…"
                    />
                    {paymentData && (
                      <div className="mt-1 text-[11px] text-slate-500">
                        Currency locked for this payment.
                      </div>
                    )}
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
                      Pay Now
                      {paymentData?.amount != null && (
                        <span>
                          {' '}
                          — {formattedMoney}
                        </span>
                      )}
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

                {!!orderInitError && (
                  <div className="flex items-center gap-2 text-red-300 text-sm p-3 bg-red-500/10 rounded-lg border border-red-600/30">
                    <AlertCircle size={16} />
                    {orderInitError}
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

export default SquadPaymentModal

