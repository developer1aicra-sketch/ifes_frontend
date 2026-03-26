import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, KeyRound, Shield } from 'lucide-react';
import { partnerLoginSendOtp, partnerLoginVerifyOtp, setPartnerAuth } from '../utils/api';
import { getPartnerPortalPath } from '../utils/locationRoutes';

const PartnerAdminLoginView = ({ setView, setUser, siteConfig, user }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in as partner, redirect to partner portal at /:partnerCode/partner/portal
  useEffect(() => {
    if (user?.role === 'partner' && user?.partner?.partnerCode) {
      const path = getPartnerPortalPath(user.partner.partnerCode);
      if (path) navigate(path, { replace: true });
    }
  }, [user, navigate]);

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const sendOtp = async () => {
    setError('');
    if (!validateEmail(email)) {
      setError('Enter a valid email address');
      return;
    }
    setLoading(true);
    try {
      await partnerLoginSendOtp(email);
      setOtpSent(true);
    } catch (err) {
      setError(err?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setError('');
    if (!otpInput.trim()) {
      setError('Enter the OTP sent to your email');
      return;
    }
    setLoading(true);
    try {
      const res = await partnerLoginVerifyOtp(email, otpInput.trim());
      const token = res?.token;
      const partner = res?.partner ?? null;
      const userPayload = {
        type: 'admin',
        role: 'partner',
        email: partner?.contactEmail ?? email,
        token,
        partner,
      };
      if (token && partner) {
        setPartnerAuth({ token, partner, email: userPayload.email });
      }
      setUser(userPayload);
      const path = getPartnerPortalPath(partner?.partnerCode);
      if (path) {
        navigate(path, { replace: true });
      } else {
        setView('partner-dashboard');
      }
    } catch (err) {
      setError(err?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn pt-28 pb-20 min-h-screen bg-slate-50 flex justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded flex items-center justify-center text-white ${siteConfig?.colors?.primary}`}>
            <Shield size={20} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Partner Admin Login</h2>
        </div>

        {!otpSent ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
              <div className="flex items-center gap-2">
                <div className="p-3 bg-slate-100 rounded-lg">
                  <Mail size={18} className="text-slate-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 p-3 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-[black]"
                />
              </div>
            </div>
            {error && <div className="text-xs text-red-600 font-bold">{error}</div>}
            <button onClick={sendOtp} disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="text-xs font-bold text-slate-500 mb-1">OTP sent to {email}</div>
              <div className="flex items-center gap-2">
                <div className="p-3 bg-slate-100 rounded-lg">
                  <KeyRound size={18} className="text-slate-500" />
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit OTP"
                  className="flex-1 p-3 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none tracking-widest text-[black]"
                />
              </div>
            </div>
            {error && <div className="text-xs text-red-600 font-bold">{error}</div>}
            <button onClick={verifyOtp} disabled={loading} className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 disabled:opacity-50">
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>
            <button onClick={() => { setOtpSent(false); setOtpInput(''); }} className="w-full text-slate-600 font-bold text-xs mt-2">Resend / Change Email</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerAdminLoginView;
