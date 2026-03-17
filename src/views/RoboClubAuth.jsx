import React, { useState, useEffect } from 'react';
import { Mail, Shield, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectOtpLoading,
  selectOtpError,
  selectLoginVerified,
  loginRequest,
  clearLoginVerified,
} from '../app/auth/authSlice';
// import { forgotPassword as forgotPasswordApi } from '../app/auth/authApi';

const RoboClubAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectOtpLoading);
  const error = useSelector(selectOtpError);
  const loginVerified = useSelector(selectLoginVerified);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password flow (local state; no Redux)
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [forgotMessage, setForgotMessage] = useState('');

  useEffect(() => {
    if (error) {
      setErrors({ form: error });
    }
  }, [error]);

  useEffect(() => {
    if (loginVerified) {
      dispatch(clearLoginVerified());
      setFormData({ email: '', password: '' });
      setErrors({});
      navigate('/roboclub-dashboard', { replace: true });
    }
  }, [loginVerified, dispatch, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name] || errors.form) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        delete next.form;
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setErrors({});
    dispatch(loginRequest({ email: formData.email, password: formData.password }));
  };

  const validateForgotEmail = () => {
    if (!forgotEmail.trim()) {
      setForgotMessage('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(forgotEmail)) {
      setForgotMessage('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setForgotMessage('');
    if (!validateForgotEmail()) return;
    setForgotStatus('loading');
    try {
      await forgotPasswordApi({ email: forgotEmail.trim() });
      setForgotStatus('success');
      setForgotMessage('Check your email for instructions to reset your password.');
    } catch (err) {
      setForgotStatus('error');
      setForgotMessage(
        err.response?.data?.message || err.message || 'Something went wrong. Please try again.'
      );
    }
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setForgotEmail('');
    setForgotStatus('idle');
    setForgotMessage('');
  };

  const isLoading = loading === 1;

  // Forgot password view
  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-600/20">
                <Lock className="h-8 w-8 text-blue-400" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Forgot password</h1>
            <p className="text-gray-400">
              Enter your email and we&apos;ll send you instructions to reset your password
            </p>
          </div>

          <div className="bg-[#0f0f0f] rounded-lg shadow-lg p-8 border border-gray-800">
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="forgot-email"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="forgot-email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="bg-[#1a1a1a] border border-gray-700 text-white text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-3 placeholder-gray-500 transition-colors"
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={forgotStatus === 'loading'}
                  />
                </div>
              </div>

              {forgotMessage && (
                <p
                  className={`text-sm ${forgotStatus === 'success' ? 'text-green-400' : 'text-red-400'}`}
                >
                  {forgotMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={forgotStatus === 'loading'}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
              >
                {forgotStatus === 'loading' ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Send reset link'
                )}
              </button>
            </form>

            <div className="text-center mt-6 pt-6 border-t border-gray-800">
              <button
                type="button"
                onClick={handleBackToLogin}
                className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Login view
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-600/20">
              <Shield className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Login</h1>
          <p className="text-gray-400">
            Enter your email and password to access RoboClub
          </p>
        </div>

        <div className="bg-[#0f0f0f] rounded-lg shadow-lg p-8 border border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-[#1a1a1a] border border-gray-700 text-white text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-3 placeholder-gray-500 transition-colors"
                  placeholder="you@example.com"
                  autoComplete="email"
                  autoFocus
                  required
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-[#1a1a1a] border border-gray-700 text-white text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-11 p-3 placeholder-gray-500 transition-colors"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors focus:outline-none focus:ring-0"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
              {/* <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div> */}
            </div>

            {errors.form && (
              <p className="text-sm text-red-400">{errors.form}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Sign in
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-6 pt-6 border-t border-gray-800">
            <Link
              to="/"
              className="text-sm text-gray-400 hover:text-white transition-colors block mb-2"
            >
              ← Back to Home
            </Link>
            <Link
              to="/membership"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Don't have an account? Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoboClubAuth;
