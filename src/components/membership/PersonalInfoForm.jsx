import { ArrowRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../contexts/ToastContext";
import { 
  selectOtp, 
  signUpSendOtpRequest, 
  signUpVerifyOtpRequest, 
  signUpRequest, 
  selectOtpLoading, 
  selectOtpError,
  selectReceivedOtp,
  selectHasOtpLoaded,
  selectOtpVerified,
  selectIsVerifyingOtp,
  selectIsSigningUp,
  selectCurrentOperation
} from "../../app/auth/authSlice";
import { initiateMembership } from "../../app/auth/authApi";

export const PersonalInfoForm = ({
  formData,
  updateFormData,
  onNext,
  onBack
}) => {
  const dispatch = useDispatch()
  const otp = useSelector(selectOtp)
  const isLoading = useSelector(selectOtpLoading)
  const error = useSelector(selectOtpError)
  const signupResponse = useSelector(selectReceivedOtp)
  const hasOtpLoaded = useSelector(selectHasOtpLoaded)
  const otpVerified = useSelector(selectOtpVerified)
  const isVerifyingOtp = useSelector(selectIsVerifyingOtp)
  const isSigningUp = useSelector(selectIsSigningUp)
  const currentOperation = useSelector(selectCurrentOperation)
  const toast = useToast();

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isInitiatingMembership, setIsInitiatingMembership] = useState(false);
  
  // Track previous OTP verification state to detect when it changes from false to true
  const prevOtpVerifiedRef = useRef(false);
  // Track previous operation state to detect when operations complete
  const prevOperationRef = useRef(null);
  // Track if toasts have been shown to prevent repeated messages
  const hasShownOtpSendToastRef = useRef(false);
  const hasShownOtpVerifyToastRef = useRef(false);
  const hasShownSignupSuccessToastRef = useRef(false);
  
  // Reset toast flags when email changes (new user flow) or component mounts fresh
  useEffect(() => {
    // Reset flags when email is cleared or changed (indicating new flow)
    if (!formData.email) {
      hasShownOtpSendToastRef.current = false;
      hasShownOtpVerifyToastRef.current = false;
      hasShownSignupSuccessToastRef.current = false;
      prevOtpVerifiedRef.current = false;
      prevOperationRef.current = null;
    }
  }, [formData.email]);

  // Handle OTP send success
  useEffect(() => {
    // Detect when operation completes: was 'sendOtp', now null
    const operationJustCompleted = prevOperationRef.current === 'sendOtp' && currentOperation === null;
    
    if (operationJustCompleted && hasOtpLoaded && !error && isSendingOtp && !hasShownOtpSendToastRef.current) {
      setIsOtpSent(true);
      setIsSendingOtp(false);
      hasShownOtpSendToastRef.current = true; // Mark toast as shown
      toast.success("OTP sent successfully to your email", {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });
    } else if (error && operationJustCompleted && isSendingOtp) {
      setIsSendingOtp(false);
      // Check if user already exists
      const errorMessage = error?.toLowerCase() || '';
      const userAlreadyExists = errorMessage.includes('already exists') || 
                                errorMessage.includes('user exists') ||
                                errorMessage.includes('already registered');
      
      if (userAlreadyExists && !hasShownOtpSendToastRef.current) {
        // User already exists - navigate to step 2 (ShippingInfoForm)
        hasShownOtpSendToastRef.current = true; // Mark toast as shown
        toast.info("User already exists. Redirecting to shipping details...", {
          position: "top-right",
          autoClose: 2000,
          theme: "dark",
        });
        // Navigate to step 2 (ShippingInfoForm) after showing toast
        setTimeout(() => {
          if (onNext) {
            onNext(); // Navigate to ShippingInfoForm (step 2)
          }
        }, 500);
      } else if (!userAlreadyExists) {
        toast.error(error || "Failed to send OTP. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        });
      }
    }
    
    // Update previous operation ref
    prevOperationRef.current = currentOperation;
  }, [currentOperation, hasOtpLoaded, error, isSendingOtp, onNext]);

  const handleSendOtp = async () => {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address', {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });
      return;
    }

    setIsSendingOtp(true);
    dispatch(signUpSendOtpRequest({email:formData.email}));
  };

  // Handle OTP verification success
  useEffect(() => {
    // Detect when verification operation completes: was 'verifyOtp', now null
    const verificationJustCompleted = prevOperationRef.current === 'verifyOtp' && currentOperation === null;
    // Only show toast when otpVerified changes from false to true (verification just completed)
    const otpJustVerified = otpVerified && !prevOtpVerifiedRef.current;
    
    if (otpJustVerified && verificationJustCompleted && hasOtpLoaded && !error && !hasShownOtpVerifyToastRef.current) {
      hasShownOtpVerifyToastRef.current = true; // Mark toast as shown
      toast.success("OTP Verify Successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    }
    
    // Update refs to track current state
    prevOperationRef.current = currentOperation;
    prevOtpVerifiedRef.current = otpVerified;
    
    // Handle OTP verification error (only show when operation just completed)
    if (error && verificationJustCompleted && isVerifyingOtp === false && !otpVerified) {
      toast.error(error || "OTP verification failed. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
    }
  }, [otpVerified, currentOperation, hasOtpLoaded, error, isVerifyingOtp]);

  // Mock function for sending OTP (replace with actual API call)
  const sendOtpToEmail = async (email) => {
    // Your API call to send OTP
    console.log('Sending OTP to:', email);
    return new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
  };

  const handleVerifyOtp = async () => {
    // Validate OTP format
    if (!formData.otp || formData.otp.trim().length !== 6) {
      toast.error("Please enter a valid 6-digit OTP", {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });
      return;
    }

    if (!formData.email) {
      toast.error("Email is required for OTP verification", {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });
      return;
    }

    dispatch(signUpVerifyOtpRequest({email:formData.email,otp:formData.otp}));
  };

  const handleSubmit = async () => {
    // Prevent submission if OTP is being verified
    if (isVerifyingOtp) {
      toast.warning("Please wait for OTP verification to complete", {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });
      return;
    }

    // Prevent submission if already submitting
    if (isSubmitting || isSigningUp) {
      return;
    }

    // Validate required fields
    if (!formData.fullName || !formData.designation || !formData.phone || !formData.email || !formData.countryCode) {
      toast.error('Please fill in all required fields', {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });
      return;
    }

    // Validate phone number
    if (formData.phone.trim().length < 10) {
      toast.error('Please enter a valid phone number', {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });
      return;
    }

    // Validate country code
    if (!formData.countryCode || !formData.countryCode.startsWith('+')) {
      toast.error('Please select a valid country code', {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });
      return;
    }

    // Validate that categoryId and planId are present
    if (!formData.categoryId || !formData.planId) {
      toast.error('Category and Plan selection is required. Please go back and select them.', {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }

    // Validate OTP is verified
    if (!isOtpSent || !otpVerified) {
      toast.error('Please verify your email by sending and verifying OTP first', {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare the complete mobile number with country code
      // Format: +911234567890 (countryCode + phone)
      const countryCode = formData.countryCode?.trim() || '+91';
      // Sanitize phone number: remove spaces, dashes, parentheses, and other non-numeric characters
      const sanitizedPhone = formData.phone.trim().replace(/[\s\-\(\)\.]/g, '');
      const completeMobileNumber = `${countryCode}${sanitizedPhone}`;

      // Prepare the signup payload according to API requirements
      const signupPayload = {
        fullName: formData.fullName.trim(),
        designation: formData.designation,
        mobile: completeMobileNumber, // Complete mobile number with country code (e.g., +911234567890)
        countryCode: countryCode, // Also include country code separately if API needs it
        categoryId: formData.categoryId,
        planId: formData.planId
      };

      console.log('Submitting signup:', signupPayload);
      console.log('Mobile number breakdown:', {
        countryCode: countryCode,
        phone: sanitizedPhone,
        completeMobile: completeMobileNumber
      });
      dispatch(signUpRequest(signupPayload));
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit form. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
      setIsSubmitting(false);
    }
  };

  // Handle successful signup
  useEffect(() => {
    // Detect when signup operation has finished while this component
    // is in a submitting state. We don't rely on prevOperationRef here
    // to avoid conflicts with other operations (sendOtp/verifyOtp).
    const signupCompletedWhileSubmitting =
      isSubmitting &&
      !isSigningUp &&
      currentOperation !== 'signup';

    if (signupCompletedWhileSubmitting) {
      if (error) {
        // Signup failed
        console.error('Signup error:', error);
        toast.error(error || 'Failed to submit form. Please try again.', {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        });
        setIsSubmitting(false);
      } else if (signupResponse && hasOtpLoaded && !hasShownSignupSuccessToastRef.current) {
        // Signup successful - call membership/initiate API
        console.log('Signup successful:', signupResponse);
        hasShownSignupSuccessToastRef.current = true; // Mark toast as shown
        
        // Call membership/initiate API after successful signup
        const callMembershipInitiate = async () => {
          setIsInitiatingMembership(true);
          try {
            // Get token from localStorage (should be available after signup)
            const token = localStorage.getItem('token');
            if (!token) {
              console.warn('No token found in localStorage for membership initiation');
            }
            
            // Call membership/initiate API
            // Token will be automatically added as Bearer token by axiosInstance interceptor
            const response = await initiateMembership({
              categoryId: formData.categoryId,
              planId: formData.planId
            });
            
            console.log('Membership initiation successful:', response.data);
            toast.success("Registration successful! Proceeding to shipping details...", {
              position: "top-right",
              autoClose: 2000,
              theme: "dark",
            });
            
            setIsSubmitting(false);
            setIsInitiatingMembership(false);
            
            // Navigate to shipping form (step 2) after showing success message
            setTimeout(() => {
              onNext(); // Navigate to ShippingInfoForm (step 2)
            }, 500);
          } catch (error) {
            console.error('Error initiating membership:', error);
            setIsInitiatingMembership(false);
            setIsSubmitting(false);
            
            // Show error but still allow navigation
            toast.error(error.response?.data?.message || 'Failed to initiate membership. Please try again.', {
              position: "top-right",
              autoClose: 3000,
              theme: "dark",
            });
            
            // Still navigate to next step even if membership initiation fails
            setTimeout(() => {
              onNext();
            }, 1000);
          }
        };
        
        callMembershipInitiate();
      }
    }
  }, [signupResponse, error, isLoading, isSubmitting, currentOperation, isSigningUp, hasOtpLoaded, onNext]);
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-black flex items-center">
        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Personal & Contact Information
      </h3>

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
          {/* Email Input with Send OTP Button */}
          <div className="flex flex-row w-full justify-between mb-4 ">
            <div className="w-full">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                className="px-4 py-3 w-full bg-white border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="rahul@example.com"
                required
                disabled={isOtpSent} // Disable email input after OTP is sent
              />
            </div>
            <div className="w-[15%] flex items-center justify-end">
              <button
                onClick={handleSendOtp}
                disabled={!formData.email || isSendingOtp || isOtpSent}
                className="bg-blue-600 px-4 py-4 text-sm text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isSendingOtp ? 'Sending...' : isOtpSent ? 'Sent ✓' : 'Send OTP'}
              </button>
            </div>
          </div>

          {/* OTP Input Field (shown only after OTP is sent and before verification) */}
          {isOtpSent && !otpVerified && (
            <div className="flex flex-row w-full justify-between mt-4">
              <div className="w-full">
                <input
                  type="text"
                  value={formData.otp}
                  onChange={(e) => updateFormData('otp', e.target.value)}
                  className="px-4 py-3 w-full bg-white border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  required
                />
              </div>
              <div className="w-[15%] flex items-center justify-end">
              <button
                onClick={handleVerifyOtp}
                disabled={(formData.otp || '').trim().length !== 6 || isVerifyingOtp}
                className="bg-green-600 px-4 py-3 text-sm text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                  {isVerifyingOtp ? 'Verifying...' : 'Verify'}
              </button>
              </div>
            </div>
          )}

          {/* Show success message when OTP is verified */}
          {otpVerified && (
            <div className="mt-4 p-3 bg-green-50 border border-green-500 rounded-lg">
              <div className="flex items-center gap-2 text-green-700 text-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Email verified successfully</span>
              </div>
            </div>
          )}

          {/* Option to resend OTP (only show if not verified) */}
          {isOtpSent && !otpVerified && (
            <div className="mt-2 text-right">
              <button
                onClick={handleSendOtp}
                disabled={isSendingOtp || currentOperation === 'sendOtp'}
                className="text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {isSendingOtp ? 'Sending...' : 'Resend OTP'}
              </button>
            </div>
          )}
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
              value={formData.phone}
              onChange={(e) => updateFormData('phone', e.target.value)}
              className="flex-1 px-4 py-3 bg-white border border-l-0 border-gray-300 rounded-r-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter phone number"
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
          disabled={isSubmitting || isSigningUp || isVerifyingOtp || !otpVerified || isInitiatingMembership}
          className={`px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 ${
            isSubmitting || isSigningUp || isVerifyingOtp || !otpVerified || isInitiatingMembership ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting || isSigningUp || isInitiatingMembership ? (isInitiatingMembership ? 'Initiating Membership...' : 'Submitting...') : 'Continue to Subscribe'}
          {!(isSubmitting || isSigningUp || isInitiatingMembership) && <ArrowRight size={18} />}
        </button>
      </div>
    </div>
  );
};