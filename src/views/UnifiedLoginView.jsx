import { useState } from 'react';
import { Mail, KeyRound, User, Shield } from 'lucide-react';

const UnifiedLoginView = ({ setView, setUser, siteConfig }) => {
  const [role, setRole] = useState('member');
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const sendOtp = async () => {
    setError('');
    if (!validateEmail(email)) {
      setError('Enter a valid email address');
      return;
    }
    setLoading(true);
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(code);
    setTimeout(() => {
      setOtpSent(true);
      setLoading(false);
    }, 600);
  };

  const verifyOtp = () => {
    setError('');
    if (otpInput.trim() !== generatedOtp) {
      setError('Invalid OTP');
      return;
    }
    if (role === 'member') {
      setUser({ type: 'member', email });
      setView('member-dashboard');
      return;
    }
    if (role === 'super-admin') {
      setUser({ type: 'admin', role: 'super', email });
      setView('admin-dashboard');
      return;
    }
    setUser({ type: 'admin', role: 'partner', email });
    setView('admin-dashboard');
  };

  return (
    <div className="animate-fadeIn pt-28 pb-20 min-h-screen bg-slate-50 flex justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded flex items-center justify-center text-white ${siteConfig?.colors?.primary}`}>
            {role === 'member' ? <User size={20} /> : <Shield size={20} />}
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Unified Login</h2>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6 text-xs font-bold">
          <button
            onClick={() => setRole('member')}
            className={`px-3 py-2 rounded ${role === 'member' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            Member
          </button>
          <button
            onClick={() => setRole('super-admin')}
            className={`px-3 py-2 rounded ${role === 'super-admin' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            Super Admin
          </button>
          <button
            onClick={() => setRole('partner-admin')}
            className={`px-3 py-2 rounded ${role === 'partner-admin' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            Partner Admin
          </button>
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
                  className="flex-1 p-3 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
            {error && <div className="text-xs text-red-600 font-bold">{error}</div>}
            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="text-xs font-bold text-slate-500 mb-2">OTP sent to {email}</div>
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
                  className="flex-1 p-3 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none tracking-widest"
                />
              </div>
            </div>
            {error && <div className="text-xs text-red-600 font-bold">{error}</div>}
            <button onClick={verifyOtp} className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700">
              Verify & Continue
            </button>
            <button
              onClick={() => {
                setOtpSent(false);
                setGeneratedOtp('');
                setOtpInput('');
              }}
              className="w-full text-slate-600 font-bold text-xs mt-2"
            >
              Resend / Change Email
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedLoginView;

