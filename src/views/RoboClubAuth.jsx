import React, { useState, useEffect } from 'react';
import { Mail, Shield, Lock, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectOtpLoading,
  selectOtpError,
  selectLoginVerified,
  loginRequest,
  clearLoginVerified,
  clearAuthError,
} from '../app/auth/authSlice';
import RoboClubPasswordRecovery from '../components/roboclub/RoboClubPasswordRecovery';
import { RoboClubAuthPage, RoboClubAuthPrimaryButton } from '../components/roboclub/RoboClubAuthLayout';
import { useLocationPrefix } from '../hooks/useLocationPrefix';
import { pathWithLocationPrefix } from '../utils/locationRoutes';

const RoboClubAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { locationPrefix } = useLocationPrefix();
  const loading = useSelector(selectOtpLoading);
  const error = useSelector(selectOtpError);
  const loginVerified = useSelector(selectLoginVerified);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loginNotice, setLoginNotice] = useState(null);

  useEffect(() => {
    if (!loginVerified) return;
    dispatch(clearLoginVerified());
    navigate(pathWithLocationPrefix(locationPrefix, '/roboclub-dashboard'), { replace: true });
  }, [loginVerified, dispatch, navigate, locationPrefix]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (error) dispatch(clearAuthError());
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (loginNotice) setLoginNotice(null);
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

  const isLoading = loading === 1;

  if (showForgotPassword) {
    return (
      <RoboClubPasswordRecovery
        onBack={() => {
          setShowForgotPassword(false);
          setLoginNotice(null);
        }}
        onResetSuccess={(email) => {
          setShowForgotPassword(false);
          setFormData((prev) => ({ ...prev, email: email || prev.email, password: '' }));
          setLoginNotice({
            type: 'success',
            text: 'Password updated. Sign in with your new password.',
          });
        }}
      />
    );
  }

  return (
    <RoboClubAuthPage
      Icon={Shield}
      title="Login"
      description="Enter your email and password to access RoboClub"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
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
          {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
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
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
          <div className="flex justify-end mt-2">
            <button
              type="button"
              onClick={() => {
                if (error) dispatch(clearAuthError());
                setShowForgotPassword(true);
                setLoginNotice(null);
              }}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Forgot password?
            </button>
          </div>
        </div>

        {loginNotice?.text ? (
          <p
            className={`text-sm ${loginNotice.type === 'success' ? 'text-green-400' : 'text-red-400'}`}
          >
            {loginNotice.text}
          </p>
        ) : null}

        {(errors.form || error) ? (
          <p className="text-sm text-red-400">{errors.form || error}</p>
        ) : null}

        <RoboClubAuthPrimaryButton loading={isLoading} loadingLabel="Signing in…">
          <>
            <Lock className="h-4 w-4 mr-2" />
            Sign in
          </>
        </RoboClubAuthPrimaryButton>
      </form>

      <div className="text-center mt-6 pt-6 border-t border-gray-800">
        <Link
          to={pathWithLocationPrefix(locationPrefix, '/')}
          className="text-sm text-gray-400 hover:text-white transition-colors block mb-2"
        >
          ← Back to Home
        </Link>
        <Link
          to={pathWithLocationPrefix(locationPrefix, '/roboclub')}
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          Don&apos;t have an account? Sign up
        </Link>
      </div>
    </RoboClubAuthPage>
  );
};

export default RoboClubAuth;
