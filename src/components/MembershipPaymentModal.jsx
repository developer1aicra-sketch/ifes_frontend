import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CreditCard, Shield, Lock, Loader2, AlertCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import { createMembershipPayment, verifyPayment } from '../api/paymentApi'
import { normalizePaymentCreateResponse, formatAmountFromPaise, buildPaymentVerifyPayload } from '../utils/paymentUtils.js'
import { CurrencySelect } from './common/CurrencySelect'
import { getFxRate } from '../utils/fxRates'

/**
 * MembershipPaymentModal - Payment for memberships created via bulk membership API.
 * Calls POST /payment/create with purchase_type: MEMBERSHIP and items (membership_id, plan_id).
 * Then opens Razorpay and verifies on success.
 */
const MembershipPaymentModal = ({
  isOpen,
  onClose,
  createdMemberships = [],
  currency = 'INR',
  baseAmountRupees: baseAmountRupeesProp = null,
  baseCurrency: baseCurrencyProp = null,
  isBaseAmountAvailable: isBaseAmountAvailableProp = false,
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
      const s = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')
      if (s?.parentNode) s.parentNode.removeChild(s)
    }
  }, [isOpen, razorpayLoaded])

  useEffect(() => {
    return () => {
      if (razorpayInstance?.close) {
        try { razorpayInstance.close() } catch (e) { /* no-op */ }
      }
      setRazorpayInstance(null)
    }
  }, [razorpayInstance])

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
    }
  }, [isOpen, currency])

  const formatAmount = (amountInPaise) => {
    if (!amountInPaise) return '0.00'
    return formatAmountFromPaise(amountInPaise)
  }

  const isCurrencyLocked = Boolean(isProcessing || razorpayInstance || paymentData)
  const baseCurrency =
    String(baseCurrencyProp || currency || 'INR').toUpperCase()

  // Best-effort base amount for FX preview (before order is created).
  // Backend bulk response may (optionally) populate plan/category objects with amounts.
  const baseAmountRupeesFallback = (() => {
    const items = Array.isArray(createdMemberships) ? createdMemberships : []
    if (items.length === 0) return null

    const getAmountFromAnyShape = (m) => {
      const candidates = [
        m?.amount,
        m?.price,
        m?.planAmount,
        m?.plan_amount,
        m?.membershipAmount,
        m?.membership_amount,
        m?.totalAmount,
        m?.total_amount,
        m?.plan?.amount,
        m?.plan?.price,
        m?.plan_id?.amount,
        m?.plan_id?.price,
      ]
      for (const c of candidates) {
        if (c == null) continue
        const n = Number(c)
        if (!Number.isNaN(n) && n > 0) return n
      }
      return null
    }

    let sum = 0
    let count = 0
    for (const m of items) {
      const a = getAmountFromAnyShape(m)
      if (a != null) {
        sum += a
        count += 1
      }
    }

    // Only trust the estimate if we could compute for all memberships.
    if (count !== items.length) return null
    return sum
  })()

  const baseAmountRupees =
    baseAmountRupeesProp != null && Number.isFinite(Number(baseAmountRupeesProp))
      ? Number(baseAmountRupeesProp)
      : baseAmountRupeesFallback

  const isBaseAmountAvailable =
    Boolean(isBaseAmountAvailableProp) ||
    (baseAmountRupeesProp != null && Number.isFinite(Number(baseAmountRupeesProp))) ||
    baseAmountRupeesFallback != null

  useEffect(() => {
    if (!isOpen) return
    if (isCurrencyLocked) return

    const baseAmount =
      baseAmountRupees != null && baseAmountRupees !== '' ? Number(baseAmountRupees) : null

    if (baseAmount == null || Number.isNaN(baseAmount)) {
      setConvertedAmount(null)
      setConversionError(false)
      return
    }

    const targetCurrency = String(selectedCurrency || baseCurrency).toUpperCase()
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
  }, [isOpen, isCurrencyLocked, baseAmountRupees, baseCurrency, selectedCurrency])

  // Display amount priority:
  // - Backend order (source of truth; in selected currency)
  // - Frontend FX preview (if we can compute an estimate before order creation)
  const displayCurrency =
    isCurrencyLocked ? (paymentData?.currency || baseCurrency) : (conversionError ? baseCurrency : String(selectedCurrency || baseCurrency).toUpperCase())

  const displayAmount =
    paymentData?.amount != null
      ? formatAmount(paymentData.amount)
      : convertedAmount != null
        ? Number(convertedAmount).toFixed(2)
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
    if (!createdMemberships?.length) return
    if (!razorpayLoaded) return
    if (paymentData) return

    setOrderInitError(null)
    setIsProcessing(true)
    try {
      const response = await createMembershipPayment(createdMemberships, selectedCurrency)
      const rawData = response.data?.success ? response.data.data : (response.data?.data || response.data)
      const data = normalizePaymentCreateResponse(rawData)

      if (!data.razorpayKey || !data.orderId) {
        throw new Error('Invalid payment response from server')
      }
      if (!data.amount || data.amount <= 0) {
        throw new Error('Invalid payment amount')
      }

      setPaymentData(data)
      return data
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to initialize payment.'
      setOrderInitError(msg)
      toast.error(msg, { position: 'top-right', autoClose: 4000, theme: 'dark' })
      return undefined
    } finally {
      setIsProcessing(false)
    }
  }

  // Intentionally do NOT auto-create order on modal open.
  // Flow: user selects currency -> clicks "Proceed to Payment".

  const handlePayment = async () => {
    if (!createdMemberships?.length) {
      toast.error('No memberships to pay for.', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'dark',
      })
      return
    }
    if (!termsAccepted) {
      toast.error('Please accept the terms and conditions to proceed.', {
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

      if (!data.razorpayKey || !data.orderId) {
        throw new Error('Invalid payment response from server')
      }
      if (!data.amount || data.amount <= 0) {
        throw new Error('Invalid payment amount')
      }

      const options = {
        key: data.razorpayKey,
        amount: data.amount,
        currency: data.currency || selectedCurrency,
        name: 'Technoxian',
        description: `Membership payment - ${createdMemberships.length} membership(s)`,
        order_id: data.orderId,
        handler: (razorpayResponse) => {
          handlePaymentSuccess(razorpayResponse, data.orderId, data.paymentId)
        },
        prefill: {
          name: data.userName || 'Club Administrator',
          email: data.userEmail || '',
          contact: data.userPhone || '',
        },
        notes: {
          paymentId: data.paymentId,
          purchaseType: 'MEMBERSHIP',
          membershipCount: createdMemberships.length.toString(),
        },
        theme: { color: '#2563EB' },
        modal: {
          ondismiss: () => {
            setIsProcessing(false)
            setRazorpayInstance(null)
            toast.info('Payment cancelled', { position: 'top-right', autoClose: 2000, theme: 'dark' })
          },
        },
        handler_error: (error) => {
          setIsProcessing(false)
          setRazorpayInstance(null)
          const msg = error.error?.description || error.error?.reason || error.error?.code || 'Payment failed.'
          toast.error(`Payment failed: ${msg}`, { position: 'top-right', autoClose: 4000, theme: 'dark' })
        },
      }

      if (window.Razorpay) {
        const razorpay = new window.Razorpay(options)
        setRazorpayInstance(razorpay)
        razorpay.open()
      } else {
        throw new Error('Razorpay SDK not loaded. Please refresh the page.')
      }
    } catch (error) {
      setIsProcessing(false)
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to initialize payment.'
      toast.error(msg, { position: 'top-right', autoClose: 4000, theme: 'dark' })
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
        toast.success('Payment verified. Memberships activated.', {
          position: 'top-right',
          autoClose: 3000,
          theme: 'dark',
        })
        if (typeof onPaymentSuccess === 'function') {
          onPaymentSuccess({
            success: true,
            paymentId: backendPaymentId,
            razorpayPaymentId: razorpayResponse.razorpay_payment_id,
            verificationData: verificationResponse.data,
            createdMemberships,
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
            createdMemberships,
          })
        }
      }
    } catch (error) {
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

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
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
            <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center">
                    <CreditCard className="text-blue-400" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Membership Payment</h2>
                    <p className="text-sm text-slate-400">
                      Pay for {createdMemberships.length} membership(s) via Razorpay
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
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 max-h-48 overflow-y-auto">
                  <h3 className="text-sm font-medium text-slate-400 mb-3">
                    Memberships to pay ({createdMemberships.length})
                  </h3>
                  <div className="space-y-2">
                    {createdMemberships.map((m, i) => (
                      <div
                        key={m._id || i}
                        className="flex items-center justify-between gap-3 p-3 bg-slate-900/50 rounded-lg"
                      >
                        <span className="text-white font-mono text-xs">
                          {m.publicMemberShipId || m._id}
                        </span>
                        <span className="text-slate-400 text-xs">{m.status || 'PENDING'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-[180px]">
                      <span className="text-slate-400 text-sm">Total</span>
                      <span className="text-2xl font-bold text-blue-400 block mt-1">
                        {formattedMoney}
                      </span>
                      {!isCurrencyLocked && isConverting && (
                        <div className="mt-1 text-[11px] text-slate-500">Updating total…</div>
                      )}
                      {!isCurrencyLocked && conversionError && (
                        <div className="mt-1 text-[11px] text-yellow-300">
                          FX conversion unavailable. Showing base estimate.
                        </div>
                      )}
                    </div>

                    <div className="w-full sm:w-[240px]">
                      <div className="text-slate-400 text-xs mb-1">Currency</div>
                      <CurrencySelect
                        value={selectedCurrency}
                        onChange={(code) => {
                          if (paymentData) return
                          setSelectedCurrency(String(code || '').toUpperCase())
                        }}
                        size="sm"
                        variant="dark"
                        ariaLabel="Select membership payment currency"
                        disabled={isProcessing || !!paymentData}
                        placeholder="Search currency…"
                      />
                      {paymentData && (
                        <div className="mt-1 text-[11px] text-slate-500">
                          Currency locked for this payment.
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {!paymentData && !isBaseAmountAvailable
                      ? 'Amount will be shown after creating order.'
                      : !paymentData
                        ? `Estimated total based on selected members' plan prices (${baseCurrency}).`
                        : 'Amount is finalized from the payment order.'}
                  </p>
                </div>

                <div className="flex items-start gap-3 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
                  <Shield className="text-green-400 shrink-0 mt-0.5" size={18} />
                  <p className="text-xs text-slate-400">
                    Payment is secure and processed via Razorpay. One payment will cover all
                    selected memberships.
                  </p>
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    disabled={isProcessing}
                    className="mt-1 rounded bg-slate-700 border-slate-600 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-300">
                    I agree to the terms and authorize this membership payment.
                  </span>
                </label>

                <motion.button
                  onClick={handlePayment}
                  disabled={isProcessing || !termsAccepted || !razorpayLoaded || createdMemberships.length === 0}
                  whileHover={{ scale: isProcessing || !termsAccepted ? 1 : 1.02 }}
                  whileTap={{ scale: isProcessing || !termsAccepted ? 1 : 0.98 }}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock size={18} />
                      Proceed to Payment
                      {paymentData?.amount && (
                        <span>
                          — {displayCurrency === 'INR' ? '₹' : '$'}
                          {displayAmount}
                        </span>
                      )}
                    </>
                  )}
                </motion.button>

                {!razorpayLoaded && (
                  <div className="flex items-center gap-2 text-yellow-400 text-sm">
                    <Loader2 size={16} className="animate-spin" />
                    Loading payment gateway...
                  </div>
                )}
               
                {!!orderInitError && (
                  <div className="flex items-center gap-2 text-red-300 text-sm p-3 bg-red-500/10 rounded-lg border border-red-600/30">
                    <AlertCircle size={16} />
                    {orderInitError}
                  </div>
                )}
                {createdMemberships.length === 0 && (
                  <div className="flex items-center gap-2 text-yellow-400 text-sm p-3 bg-yellow-400/10 rounded-lg">
                    <AlertCircle size={16} />
                    No memberships to pay.
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

export default MembershipPaymentModal
