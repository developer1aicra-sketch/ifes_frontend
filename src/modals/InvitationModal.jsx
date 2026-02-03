import React, { useState } from 'react';
import { X, Lock, Shield, ArrowRight, CheckCircle } from 'lucide-react';

const InvitationModal = ({ showInvitationModal, setShowInvitationModal, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [invitationCode, setInvitationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmitCode = async () => {
    if (!invitationCode.trim()) {
      setError('Please enter an invitation code');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate API call to verify invitation code
    setTimeout(() => {
      // For demo purposes, accept any 6-digit code
      if (invitationCode.length === 6 && /^\d+$/.test(invitationCode)) {
        setStep(2);
        setError('');
      } else {
        setError('Invalid invitation code. Please check and try again.');
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleContinue = () => {
    setShowInvitationModal(false);
    if (onSuccess) {
      onSuccess();
    }
  };

  const handleClose = () => {
    setShowInvitationModal(false);
    setStep(1);
    setInvitationCode('');
    setError('');
  };

  if (!showInvitationModal) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-cyan-500/30 w-full max-w-md rounded-2xl shadow-2xl animate-fade-in-up my-auto relative overflow-hidden">
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 pointer-events-none"></div>
        
        {/* Close button */}
        <button 
          onClick={handleClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-white z-10 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="relative z-10 p-8">
          {step === 1 ? (
            <div className="space-y-6">
              {/* Icon and title */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(34,211,238,0.5)]">
                  <Lock size={28} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Enter Invitation Code</h3>
                <p className="text-slate-400 text-sm">Access your exclusive robotics journey</p>
              </div>

              {/* Input field */}
              <div className="space-y-2">
                <label className="block text-slate-300 text-sm font-medium">Invitation Code</label>
                <input
                  type="text"
                  value={invitationCode}
                  onChange={(e) => setInvitationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit code"
                  className="w-full bg-slate-800/50 border border-slate-600 text-white p-4 rounded-lg text-center text-xl font-mono tracking-widest outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all"
                  maxLength={6}
                />
                {error && (
                  <p className="text-red-400 text-sm flex items-center gap-2">
                    <Shield size={14} />
                    {error}
                  </p>
                )}
              </div>

              {/* Security note */}
              <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-3">
                <p className="text-slate-400 text-xs flex items-center gap-2">
                  <Shield size={14} className="text-cyan-400" />
                  Your invitation code is secure and encrypted
                </p>
              </div>

              {/* Submit button */}
              <button
                onClick={handleSubmitCode}
                disabled={isLoading || invitationCode.length !== 6}
                className="w-full bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-bold py-4 rounded-lg hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Verifying...
                  </>
                ) : (
                  <>
                    Unlock Access
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6 text-center">
              {/* Success icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(74,222,128,0.5)]">
                <CheckCircle size={28} className="text-white" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Welcome Aboard!</h3>
                <p className="text-slate-400 text-sm mb-4">
                  Your invitation has been verified successfully
                </p>
                <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
                  <p className="text-cyan-400 font-mono text-sm mb-1">Access Granted</p>
                  <p className="text-white font-bold">Technoxian Championship 2026</p>
                </div>
              </div>

              <button
                onClick={handleContinue}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 rounded-lg hover:shadow-[0_0_30px_rgba(74,222,128,0.5)] transition-all flex items-center justify-center gap-2"
              >
                Continue to Dashboard
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvitationModal;
