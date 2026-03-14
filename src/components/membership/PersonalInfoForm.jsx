import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useToast } from "../../contexts/ToastContext";
import { authSignup, signupStep2 } from "../../app/auth/authApi";
import { setAuthToken } from "../../api/authToken";

export const PersonalInfoForm = ({
  formData,
  updateFormData,
  onNext,
  onBack
}) => {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // Phase 1 = only auth/signup done; Phase 2 = show rest of form, then signup/step2
  const [accountCreated, setAccountCreated] = useState(false);

  /** Phase 1: Only API hit is POST /api/auth/signup. No other API runs before this. */
  const handleCreateAccount = async () => {
    if (isSubmitting) return;
    const email = (formData.email || '').trim();
    const password = (formData.password || '').trim();
    if (!email || !password) {
      toast.error('Please enter email and password', {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const signupRes = await authSignup({ email, password });
      const signupData = signupRes?.data?.data ?? signupRes?.data;
      const token = signupData?.token ?? signupRes?.data?.token;
      const user = signupData?.user ?? signupData;
      // Backend may return user id as objectId (MongoDB ObjectId); use as user_id in membership/bulk
      const userId =
        user?.objectId ??
        user?._id ??
        user?.id ??
        signupData?.objectId ??
        signupData?.userId ??
        signupData?.user_id;
      if (token) setAuthToken(token);
      if (userId) updateFormData('createdUserId', userId);
      setAccountCreated(true);
      toast.success('Account created. Fill in your details below.', {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Something went wrong.';
      toast.error(msg, {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /** Phase 2: Only runs after auth/signup succeeded. Calls POST /api/signup/step2 then proceeds. */
  const handleSubmit = async () => {
    if (!accountCreated || isSubmitting) return;
    if (!formData.fullName?.trim() || !formData.designation || !formData.phone || !formData.countryCode) {
      toast.error('Please fill in all required fields', {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });
      return;
    }
    const phoneDigits = formData.phone.trim().replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      toast.error('Mobile number must be exactly 10 digits', {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });
      return;
    }
    if (!formData.countryCode.startsWith('+')) {
      toast.error('Please select a valid country code', {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });
      return;
    }
    if (!formData.categoryId || !formData.planId) {
      toast.error('Category and Plan selection is required. Please go back and select them.', {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }
    const countryCode = formData.countryCode?.trim() || '+91';
    const completeMobileNumber = `${countryCode}${phoneDigits}`;

    setIsSubmitting(true);
    try {
      await signupStep2({
        categoryId: formData.categoryId,
        designation: formData.designation,
        fullName: formData.fullName.trim(),
        mobile: completeMobileNumber,
        planId: formData.planId,
      });
      toast.success('Proceeding to shipping details...', {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });
      onNext();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Something went wrong.';
      toast.error(msg, {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-black flex items-center">
        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Personal & Contact Information
      </h3>

      {/* Phase 1: Create account — only POST /api/auth/signup runs here; no other API before this */}
      {!accountCreated && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Step 1: Create your account (email & password).</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="rahul@example.com"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password || ''}
                  onChange={(e) => updateFormData('password', e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Choose a password"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleCreateAccount}
              disabled={isSubmitting || !formData.email?.trim() || !formData.password?.trim()}
              className={`px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 ${
                isSubmitting || !formData.email?.trim() || !formData.password?.trim() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
              {!isSubmitting && <ArrowRight size={18} />}
            </button>
          </div>
        </div>
      )}

      {/* Phase 2: Only after auth/signup success — no password field here; then POST /api/signup/step2 on submit */}
      {accountCreated && (
        <>
          <p className="text-sm text-gray-600 mb-4">Account created. Complete your profile below.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => updateFormData('fullName', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. Rahul Sharma"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Designation <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.designation}
                onChange={(e) => updateFormData('designation', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select any one</option>
                <option value="student">Student</option>
                <option value="professional">Professional</option>
                <option value="educator">Educator</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-black mb-1">
                Mobile No <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <div className="flex items-center px-3 bg-white border border-r-0 border-gray-300 rounded-l-lg">
                  <select
                    className="bg-white text-black border-none focus:outline-none focus:ring-0"
                    onChange={(e) => updateFormData('countryCode', e.target.value)}
                    value={formData.countryCode}
                  >
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+971">🇦🇪 +971</option>
                    <option value="+966">🇸🇦 +966</option>
                    <option value="+61">🇦🇺 +61</option>
                    <option value="+65">🇸🇬 +65</option>
                    <option value="+86">🇨🇳 +86</option>
                    <option value="+81">🇯🇵 +81</option>
                    <option value="+82">🇰🇷 +82</option>
                    <option value="+49">🇩🇪 +49</option>
                    <option value="+33">🇫🇷 +33</option>
                    <option value="+92">🇵🇰 +92</option>
                    <option value="+880">🇧🇩 +880</option>
                    <option value="+94">🇱🇰 +94</option>
                  </select>
                </div>
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  value={formData.phone}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                    updateFormData('phone', digits);
                  }}
                  className="flex-1 px-4 py-3 bg-white border border-l-0 border-gray-300 rounded-r-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="10-digit mobile number"
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 flex flex-wrap gap-5 justify-between">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 border border-gray-300 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.fullName?.trim() || !formData.designation || (formData.phone?.replace(/\D/g, '') || '').length !== 10 || !formData.categoryId || !formData.planId}
              className={`px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Continue to Subscribe'}
              {!isSubmitting && <ArrowRight size={18} />}
            </button>
          </div>
        </>
      )}
    </div>
  );
};