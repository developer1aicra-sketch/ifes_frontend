import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, KeyRound } from 'lucide-react';
import { forgotPassword, resetPassword } from '../../app/auth/authApi';
import { RoboClubAuthPage, RoboClubAuthPrimaryButton } from './RoboClubAuthLayout';

function getApiErrorMessage(err) {
  const data = err.response?.data;
  if (typeof data?.message === 'string') return data.message;
  if (Array.isArray(data?.message)) return data.message.join(', ');
  return err.message || 'Something went wrong. Please try again.';
}

const inputClass =
  'bg-[#1a1a1a] border border-gray-700 text-white text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-3 placeholder-gray-500 transition-colors';

const labelClass = 'block text-sm font-medium text-gray-300 mb-2';

/**
 * Two-step recovery: POST /auth/forgot/password then POST /auth/reset/password.
 */
export default function RoboClubPasswordRecovery({ onBack, onResetSuccess }) {
  const [step, setStep] = useState('request');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [status, setStatus] = useState('idle');
  const [banner, setBanner] = useState({ type: null, text: '' });

  const loading = status === 'loading';

  const validateEmail = () => {
    const trimmed = email.trim();
    if (!trimmed) {
      setBanner({ type: 'error', text: 'Email is required' });
      return null;
    }
    if (!/\S+@\S+\.\S+/.test(trimmed)) {
      setBanner({ type: 'error', text: 'Please enter a valid email address' });
      return null;
    }
    return trimmed;
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setBanner({ type: null, text: '' });
    const validEmail = validateEmail();
    if (!validEmail) return;
    setStatus('loading');
    try {
      await forgotPassword({ email: validEmail });
      setEmail(validEmail);
      setStatus('idle');
      setBanner({ type: null, text: '' });
      setStep('reset');
    } catch (err) {
      setStatus('idle');
      setBanner({ type: 'error', text: getApiErrorMessage(err) });
    }
  };

  const validateReset = () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setBanner({ type: 'error', text: 'Email is required' });
      return false;
    }
    if (!otp.trim()) {
      setBanner({ type: 'error', text: 'Enter the code from your email' });
      return false;
    }
    if (!newPassword) {
      setBanner({ type: 'error', text: 'Choose a new password' });
      return false;
    }
    if (newPassword.length < 8) {
      setBanner({ type: 'error', text: 'Password must be at least 8 characters' });
      return false;
    }
    if (newPassword !== confirmPassword) {
      setBanner({ type: 'error', text: 'Passwords do not match' });
      return false;
    }
    return true;
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setBanner({ type: null, text: '' });
    if (!validateReset()) return;
    setStatus('loading');
    try {
      await resetPassword({
        email: email.trim(),
        newPassword,
        otp: otp.trim(),
      });
      setStatus('idle');
      onResetSuccess?.(email.trim());
    } catch (err) {
      setStatus('idle');
      setBanner({ type: 'error', text: getApiErrorMessage(err) });
    }
  };

  const goBackToLogin = () => {
    setStep('request');
    setEmail('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setStatus('idle');
    setBanner({ type: null, text: '' });
    onBack?.();
  };

  const backToRequest = () => {
    setStep('request');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setBanner({ type: null, text: '' });
  };

  if (step === 'request') {
    return (
      <RoboClubAuthPage
        Icon={Lock}
        title="Forgot password"
        description="We'll email you a code to set a new password."
      >
        <form onSubmit={handleRequestSubmit} className="space-y-6">
          <div>
            <label htmlFor="recovery-email" className={labelClass}>
              Email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" aria-hidden />
              </div>
              <input
                type="email"
                id="recovery-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="you@example.com"
                autoComplete="email"
                disabled={loading}
              />
            </div>
          </div>

          {banner.text ? (
            <p
              className={`text-sm ${banner.type === 'success' ? 'text-green-400' : 'text-red-400'}`}
            >
              {banner.text}
            </p>
          ) : null}

          <RoboClubAuthPrimaryButton loading={loading} loadingLabel="Sending…">
            Send reset code
          </RoboClubAuthPrimaryButton>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-gray-800">
          <button
            type="button"
            onClick={goBackToLogin}
            className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" aria-hidden />
            Back to login
          </button>
        </div>
      </RoboClubAuthPage>
    );
  }

  return (
    <RoboClubAuthPage
      Icon={KeyRound}
      title="Set new password"
      description="Enter the code from your email and choose a new password."
    >
      <form onSubmit={handleResetSubmit} className="space-y-5">
        <div>
          <label htmlFor="reset-email" className={labelClass}>
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" aria-hidden />
            </div>
            <input
              type="email"
              id="reset-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              autoComplete="email"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="reset-otp" className={labelClass}>
            Code from email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <KeyRound className="h-5 w-5 text-gray-400" aria-hidden />
            </div>
            <input
              type="text"
              id="reset-otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className={inputClass}
              placeholder="Enter OTP"
              autoComplete="one-time-code"
              inputMode="numeric"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="reset-new-password" className={labelClass}>
            New password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" aria-hidden />
            </div>
            <input
              type={showNewPassword ? 'text' : 'password'}
              id="reset-new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`${inputClass} pr-11`}
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((v) => !v)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors focus:outline-none"
              aria-label={showNewPassword ? 'Hide password' : 'Show password'}
            >
              {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="reset-confirm-password" className={labelClass}>
            Confirm password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" aria-hidden />
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="reset-confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`${inputClass} pr-11`}
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors focus:outline-none"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {banner.text ? (
          <p
            className={`text-sm ${banner.type === 'success' ? 'text-green-400' : 'text-red-400'}`}
          >
            {banner.text}
          </p>
        ) : null}

        <RoboClubAuthPrimaryButton loading={loading} loadingLabel="Updating…">
          Update password
        </RoboClubAuthPrimaryButton>
      </form>

      <div className="text-center mt-6 pt-6 border-t border-gray-800 space-y-3">
        <button
          type="button"
          onClick={backToRequest}
          className="block w-full text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          Resend code — use different email
        </button>
        <button
          type="button"
          onClick={goBackToLogin}
          className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" aria-hidden />
          Back to login
        </button>
      </div>
    </RoboClubAuthPage>
  );
}
