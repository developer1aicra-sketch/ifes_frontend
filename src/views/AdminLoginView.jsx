import { useEffect } from 'react';
import { Shield } from 'lucide-react';

const AdminLoginView = ({ setView, user }) => {
  // If already logged in as partner, redirect to partner portal
  useEffect(() => {
    if (user?.role === 'partner') {
      setView('partner-dashboard');
    }
  }, [user, setView]);

  return (
  <div className="animate-fadeIn pt-32 pb-20 bg-slate-900 min-h-screen flex justify-center items-center">
    <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl">
      <div className="flex justify-center mb-6">
        <Shield size={48} className="text-slate-900" />
      </div>
      <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Staff Portal</h2>
      <p className="text-center text-slate-500 text-sm mb-8">Authorized Personnel Only</p>
      <button
        onClick={() => setView('partner-login')}



        className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700"
      >
        Partner Admin Login
      </button>
    </div>
  </div>
  );
};

export default AdminLoginView;