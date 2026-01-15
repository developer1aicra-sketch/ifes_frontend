import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export const ShippingInfoForm = ({
  formData,
  updateFormData,
  onNext,
  onBack,
  selectedCategory,
  selectedPlan
}) => {
  
  const calculatePrice = () => {
    switch (selectedCategory) {
      case 'student':
        return selectedPlan === 'basic' ? { subtotal: 10, total: 10 } : { subtotal: 50, total: 50 };
      case 'professional':
        return { subtotal: 100, total: 100 };
      case 'institute':
        return { subtotal: 200, total: 200 };
      case 'corporate':
        return { subtotal: 500, total: 500 };
      default:
        return { subtotal: 0, total: 0 };
    }
  };

  const prices = calculatePrice();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column - Shipping Form */}
        <div className="md:w-2/3 space-y-6">
          <h3 className="text-xl font-bold text-black flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Shipping & Additional Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                className="w-full px-4 py-3  border border-gray-600 rounded-lg text-black focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            
            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => updateFormData('gender', e.target.value)}
                className="w-full px-4 py-3 text-black border border-gray-600 rounded-lg text-black focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
            
            {/* T-Shirt Size */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                T-Shirt Size <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.tshirtSize}
                onChange={(e) => updateFormData('tshirtSize', e.target.value)}
                className="w-full px-4 py-3 text-black border border-gray-600 rounded-lg text-black focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              >
                <option value="">Select Size</option>
                <option value="XS">Extra Small (XS)</option>
                <option value="S">Small (S)</option>
                <option value="M">Medium (M)</option>
                <option value="L">Large (L)</option>
                <option value="XL">Extra Large (XL)</option>
                <option value="XXL">Double Extra Large (XXL)</option>
              </select>
            </div>
            
            {/* Full Shipping Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-black mb-1">
                Full Shipping Address <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => updateFormData('address', e.target.value)}
                className="w-full px-4 py-3 text-black border border-gray-600 rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="House No, Street Name, Area, Landmark"
                rows="3"
                required
              />
            </div>
            
            {/* City */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => updateFormData('city', e.target.value)}
                className="w-full px-4 py-3 text-black border border-gray-600 rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="e.g., Mumbai"
                required
              />
            </div>
            
            {/* State/Province */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                State / Province <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => updateFormData('state', e.target.value)}
                className="w-full px-4 py-3 text-black border border-gray-600 rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="e.g., Maharashtra"
                required
              />
            </div>
            
            {/* Country */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-black mb-1">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.country}
                onChange={(e) => updateFormData('country', e.target.value)}
                className="w-full px-4 py-3 text-black border border-gray-600 rounded-lg text-black focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              >
                <option value="">Select Country</option>
                <option value="IN">India</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
                <option value="JP">Japan</option>
                <option value="SG">Singapore</option>
                <option value="AE">United Arab Emirates</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            {/* School/College/Organization Name */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                {selectedCategory === 'student' ? 'School / College Name' : 
                 selectedCategory === 'professional' ? 'Organization / Company' :
                 selectedCategory === 'institute' ? 'Institution Name' :
                 'Company Name'} {selectedCategory !== 'professional' && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                value={formData.institute}
                onChange={(e) => updateFormData('institute', e.target.value)}
                className="w-full px-4 py-3 text-black border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder={`Enter ${selectedCategory === 'student' ? 'school/college' : selectedCategory === 'professional' ? 'organization' : selectedCategory === 'institute' ? 'institution' : 'company'} name`}
                required={selectedCategory !== 'professional'}
              />
            </div>
            
            {/* Grade/Class/Position */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                {selectedCategory === 'student' ? 'Grade / Class / Year' : 
                 selectedCategory === 'professional' ? 'Position / Role' :
                 selectedCategory === 'institute' ? 'Department' :
                 'Industry Sector'}
              </label>
              <input
                type="text"
                value={formData.grade}
                onChange={(e) => updateFormData('grade', e.target.value)}
                className="w-full px-4 py-3 text-black border border-gray-600 rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder={
                  selectedCategory === 'student' ? 'e.g., 10th Grade or 2nd Year Engineering' : 
                  selectedCategory === 'professional' ? 'e.g., Robotics Engineer or Technical Lead' :
                  selectedCategory === 'institute' ? 'e.g., Computer Science Department' :
                  'e.g., Technology or Education'
                }
              />
            </div>
            
            {/* Additional Notes (Optional) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-black mb-1">
                Additional Notes (Optional)
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => updateFormData('notes', e.target.value)}
                className="w-full px-4 py-3 text-black border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Any special requirements or additional information..."
                rows="2"
              />
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="md:w-1/3">
          <div className=" rounded-xl p-6 border border-gray-700 sticky top-6">
            <h3 className="text-lg font-bold text-black mb-4">Order Summary</h3>

            {/* Membership Plan Details */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-black">Membership Plan</span>
                <span className="text-sm font-medium text-black">
                  {selectedCategory === 'student' ? 'Student' : 
                   selectedCategory === 'professional' ? 'Professional' :
                   selectedCategory === 'institute' ? 'Institute' : 'Corporate'} 
                  {selectedCategory === 'student' && selectedPlan === 'basic' ? ' Basic' : 
                   selectedCategory === 'student' && selectedPlan === 'premium' ? ' Premium' : ''}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-black">Duration</span>
                <span className="text-sm text-black">1 Year</span>
              </div>
            </div>

            <div className="border-t border-gray-700 my-4"></div>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-sm text-black">Membership Fee</span>
                <span className="text-sm">
                  ${prices.subtotal} USD
                </span>
              </div>
              
              {/* Optional: Add shipping cost if applicable */}
              <div className="flex justify-between">
                <span className="text-sm text-black">Shipping</span>
                <span className="text-sm text-blue-400">Free</span>
              </div>
              
              <div className="flex justify-between text-lg font-semibold mt-4 pt-2 border-t border-gray-700">
                <span className="text-black">Total Amount</span>
                <span className="text-blue-600">
                  ${prices.total} USD
                </span>
              </div>
            </div>

            {/* Benefits Preview */}
            <div className="mt-6 pt-4 border-t border-gray-700">
              <h4 className="text-sm font-medium text-black mb-2">What's Included:</h4>
              <ul className="text-xs text-gray-400 space-y-1">
                {selectedCategory === 'student' && selectedPlan === 'basic' && (
                  <>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-1">✓</span>
                      <span  className="text-black" >WORSO Digital Certificate & ID</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-1">✓</span>
                      <span  className="text-black" >Student Directory Listing</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-1">✓</span>
                      <span  className="text-black" >Discounted DIY Kits Access</span>
                    </li>
                  </>
                )}
                {selectedCategory === 'student' && selectedPlan === 'premium' && (
                  <>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-1">✓</span>
                      <span  className="text-black" >Personalized ID Card with QR</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-1">✓</span>
                      <span  className="text-black" >Premium Digital Badge</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-1">✓</span>
                      <span  className="text-black" >Priority Internship Access</span>
                    </li>
                  </>
                )}
                {selectedCategory === 'professional' && (
                  <>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-1">✓</span>
                      <span className="text-black">Certified Professional Badge</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-1">✓</span>
                      <span className="text-black">Global Expert Directory Listing</span>
                    </li>
                  </>
                )}
                {selectedCategory === 'institute' && (
                  <>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-1">✓</span>
                      <span className="text-black">Accredited Institution Badge</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-1">✓</span>
                      <span className="text-black">STEM Lab Setup Support</span>
                    </li>
                  </>
                )}
                {selectedCategory === 'corporate' && (
                  <>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-1">✓</span>
                      <span className="text-black">Official Corporate Member Badge</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-1">✓</span>
                      <span className="text-black">Brand Exposure & Recognition</span>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Security Badge */}
            <div className="mt-6 pt-4 border-t border-gray-700">
              <div className="flex items-center text-xs text-gray-400">
                <svg className="w-4 h-4 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-black">Secure & encrypted payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-700 flex justify-between">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-gray-600 text-black font-medium rounded-lg hover:text-black transition-colors"
        >
          Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onNext}
          className="px-8 py-3 bg-blue-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
        >
          <span>Proceed to Payment</span>
          <ArrowRight size={18} />
        </motion.button>
      </div>
    </div>
  );
};