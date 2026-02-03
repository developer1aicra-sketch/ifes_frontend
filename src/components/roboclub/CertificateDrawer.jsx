import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, X, User, Lock, ChevronRight, CheckCircle, Download } from 'lucide-react';

const CertificateDrawer = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) setStep(1);
  }, [isOpen]);

  const handleSendOTP = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1500);
  };

  const handleVerify = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-slate-900 border-l border-white/10 shadow-2xl z-[70] flex flex-col"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-900">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Award className="text-yellow-400" /> Claim Certificate
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400">
                <X size={20} />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 p-8 overflow-y-auto">
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-slate-800 rounded-full mx-auto flex items-center justify-center mb-4">
                      <User className="text-cyan-400 w-8 h-8" />
                    </div>
                    <p className="text-slate-400">Enter your Participant UID to verify your achievement.</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Participant UID</label>
                      <input type="text" placeholder="e.g. TX-2026-8892" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Registered Email</label>
                      <input type="email" placeholder="name@team.com" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 outline-none transition-colors" />
                    </div>
                    <button
                      onClick={handleSendOTP}
                      disabled={loading}
                      className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all flex justify-center items-center gap-2 mt-4"
                    >
                      {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <>Verify Identity <ChevronRight size={16}/></>}
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-slate-800 rounded-full mx-auto flex items-center justify-center mb-4">
                      <Lock className="text-yellow-400 w-8 h-8" />
                    </div>
                    <h3 className="text-white text-lg font-bold">Check your Email</h3>
                    <p className="text-slate-400 text-sm mt-2">We sent a 6-digit code to your registered email.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-2 justify-center">
                      {[1,2,3,4,5,6].map(i => (
                        <input key={i} type="text" maxLength={1} className="w-10 h-12 bg-slate-950 border border-slate-700 rounded text-center text-white text-xl font-bold focus:border-cyan-500 outline-none" />
                      ))}
                    </div>
                    <button
                      onClick={handleVerify}
                      disabled={loading}
                      className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold rounded-lg transition-all flex justify-center items-center gap-2 mt-4"
                    >
                      {loading ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span> : "Validate Code"}
                    </button>
                    <button onClick={() => setStep(1)} className="w-full text-sm text-slate-500 hover:text-white mt-2">Back to UID</button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6 pt-10">
                  <div className="w-24 h-24 bg-green-500/20 rounded-full mx-auto flex items-center justify-center border-4 border-slate-900 shadow-xl">
                    <CheckCircle className="text-green-500 w-12 h-12" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Verified!</h3>
                    <p className="text-slate-400 mt-2">Your Certificate of Excellence is ready.</p>
                  </div>
                  
                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center gap-4 text-left">
                    <div className="bg-red-500/20 p-3 rounded-lg text-red-400">
                      <Award size={24} />
                    </div>
                    <div>
                      <div className="text-white font-bold">WRC 2025 Finalist.pdf</div>
                      <div className="text-xs text-slate-500">2.4 MB • Signed digitally</div>
                    </div>
                  </div>

                  <button className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl shadow-lg shadow-green-600/20 transition-all flex justify-center items-center gap-2">
                    <Download size={20} /> Download Certificate
                  </button>
                </motion.div>
              )}
            </div>
           
            <div className="p-4 bg-slate-950 border-t border-white/5 text-center text-xs text-slate-600">
              Protected by Technoxian SecureAuth™
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CertificateDrawer;