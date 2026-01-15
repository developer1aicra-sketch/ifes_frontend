import { motion } from "framer-motion";
import { Check, Shield, Lock, CreditCard, Globe } from "lucide-react";

export const PaymentSection = ({
  selectedPayment,
  setSelectedPayment,
  selectedCategory,
  selectedPlan,
  formData,
  onBack,
  onPayment
}) => {
  
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

  const paymentGateways = [
    {
      id: 'razorpay',
      name: 'Razorpay',
      description: 'Pay in USD via Cards, UPI, Net Banking, Wallet',
      icon: 'Rs',
      badge: 'Recommended for India',
      features: ['Cards (Visa/Mastercard/Rupay)', 'UPI', 'Net Banking', 'Wallet']
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'International Payments in USD',
      icon: 'P',
      badge: 'Global Payments',
      features: ['PayPal Balance', 'Credit/Debit Cards', 'Bank Transfer']
    },
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Secure global card payments',
      icon: 'S',
      badge: 'International Cards',
      features: ['All Major Cards', 'Apple Pay', 'Google Pay', 'SEPA']
    }
  ];

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

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    onPayment();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 "
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-black mb-2">Complete Your Membership</h1>
          <p className="text-black">Final step to join our robotics community</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Gateway Selection */}
            <div className="border border-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-black">Select Payment Method</h2>
                <div className="flex items-center text-green-400 text-sm">
                  <Lock size={14} className="mr-1 text-blue-600" />
                  <span className=" text-blue-600">Secure Payment</span>
                </div>
              </div>

              <div className="space-y-4">
                {paymentGateways.map((gateway) => (
                  <motion.div
                    key={gateway.id}
                    whileHover={{ scale: 1.01 }}
                    className={`border-2 ${selectedPayment === gateway.id 
                      ? 'border-blue-600 ' 
                      : 'border-gray-700 '} 
                      rounded-xl p-5 cursor-pointer transition-all duration-200`}
                    onClick={() => setSelectedPayment(gateway.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold 
                          ${selectedPayment === gateway.id ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                          {gateway.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-black">{gateway.name}</h3>
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">
                              {gateway.badge}
                            </span>
                          </div>
                          <p className="text-sm text-black-400 mt-1">{gateway.description}</p>
                          
                          <div className="flex flex-wrap gap-2 mt-3">
                            {gateway.features.map((feature, index) => (
                              <span key={index} className="text-xs px-2 py-1 rounded text-black-300">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center 
                        ${selectedPayment === gateway.id ? 'border-blue-600 bg-blue-600' : 'border-gray-600'}`}>
                        {selectedPayment === gateway.id && (
                          <Check size={12} className="text-white" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Payment Security Info */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Shield className="text-black-400" size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-black mb-1">Payment Security</h4>
                    <p className="text-sm text-black-400">
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
            <div className=" rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-black mb-4">Order Summary</h2>

              <div className="space-y-4">
                {/* Membership Details */}
                <div className=" rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-black">{getPlanName()}</h3>
                      <p className="text-sm text-gray-400">Annual Membership</p>
                    </div>
                    <span className="font-bold text-red-400">${totalAmount}</span>
                  </div>
                  <div className="text-xs text-black">
                    Billed annually • Auto-renewable
                  </div>
                </div>

                {/* User Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-black">Name:</span>
                    <span className="font-medium text-white">{formData.fullName}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-black">Email:</span>
                    <span className="font-medium text-white">{formData.email}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-black">Phone:</span>
                    <span className="font-medium text-white">{formData.phone}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-black">Location:</span>
                    <span className="font-medium text-white">
                      {formData.city}, {formData.country}
                    </span>
                  </div>
                </div>

                <hr className="my-4 border-gray-700" />

                {/* Total Amount */}
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-300">
                    <span className="text-black"> Subtotal</span>
                    <span className="text-black">${totalAmount} USD</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-300">
                    <span className="text-black">Processing Fee</span>
                    <span className="text-green-400">$0.00</span>
                  </div>
                  
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-700">
                    <span className="text-black">Total Amount</span>
                    <span className="text-red-400">${totalAmount} USD</span>
                  </div>
                  
                  <div className="text-xs text-black-500 text-right">
                    ≈ ₹{totalAmount * 83} INR • ≈ €{totalAmount * 0.92} EUR
                  </div>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className=" rounded-xl shadow-lg p-6">
              {/* <div className="flex items-start gap-3 mb-4">
                <Globe size={18} className="text-blue-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-white mb-1">Terms & Conditions</h4>
                  <p className="text-xs text-gray-400">
                    By completing this payment, you agree to our Terms of Service and Privacy Policy. 
                    Membership is non-refundable after 7 days.
                  </p>
                </div>
              </div> */}
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded bg-gray-700 border-gray-600 text-red-600 focus:ring-red-500" />
                <span className="text-sm text-black">
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
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-blue-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl"
              >
                <Check size={20} />
                Complete Registration - ${totalAmount} USD
              </motion.button>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={onBack}
                  className="text-black hover:text-white text-sm font-medium transition-colors"
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