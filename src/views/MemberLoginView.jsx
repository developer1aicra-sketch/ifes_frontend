import { useState } from 'react';
import { Mail, KeyRound, User } from 'lucide-react';
import { memberLogin } from '../utils/api';
import { setAuthToken } from '../api/authToken';

const MemberLoginView = ({ setView, setUser, siteConfig }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Enter a valid email address');
      return;
    }
    if (!password) {
      setError('Enter your password');
      return;
    }

    setLoading(true);
    try {
      const data = await memberLogin(email, password);

      // Store token so /membership/my/get and other protected APIs get Authorization header
      if (data?.token) {
        setAuthToken(data.token);
      }

      setUser({
        type: 'member',
        email,
        ...data,
      });

      setView('member-dashboard');
    } catch (err) {
      setError(err?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn pt-28 pb-20 min-h-screen bg-slate-50 flex justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded flex items-center justify-center text-white ${siteConfig?.colors?.primary}`}>
            <User size={20} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Member Login</h2>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
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

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
            <div className="flex items-center gap-2">
              <div className="p-3 bg-slate-100 rounded-lg">
                <KeyRound size={18} className="text-slate-500" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="flex-1 p-3 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {error && <div className="text-xs text-red-600 font-bold">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="text-[11px] text-slate-500 mt-1">
            For testing, you can use email <span className="font-mono font-semibold">dd@gmail.com</span> and password <span className="font-mono font-semibold">dd</span>.
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberLoginView;
