import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Lock, ArrowRight, CheckCircle, Mail, Github, User } from 'lucide-react';

const DashboardLoginSection = () => {
  const [loginStep, setLoginStep] = useState('email');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setLoginStep('otp');
    }, 1500);
  };

  const handleVerifyOTP = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setLoginStep('success');
    }, 1500);
  };

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      <div className=" mx-auto px-6">
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596496181848-3091d4878b24?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 to-slate-900/60"></div>
         
          <div className="relative z-10 p-12 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="max-w-xl">
              {/* <div className="inline-block px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-xs font-bold mb-4">
                COMMAND CENTER v2.0
              </div> */}
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                
                {/* Command Center Access
 */}
                Command Center <br/> Access.</h2>

              <p className="text-slate-400 mb-8 text-lg leading-relaxed">
               Manage your team, track real-time rankings, access learning resources, and register for upcoming WRC events all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
               
                <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                <User size={18} /> Member Login
              </button>
              <button className="px-6 py-3 bg-transparent border border-slate-600 text-slate-300 hover:border-white hover:text-white rounded-lg transition-all flex items-center justify-center gap-2">
                Create Team Account
              </button>
            </div>

              </div>
            </div>
           
            {/* SSO / OTP Login Form */}
            <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500"></div>
             
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white">Member Access</h3>
                <p className="text-slate-400 text-sm">Log in via SSO or One-Time Password.</p>
              </div>

              {loginStep === 'email' && (
                <motion.div initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} className="space-y-4">
                  {/* SSO Buttons */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <button className="flex items-center justify-center gap-2 py-2.5 bg-white text-slate-900 rounded-lg font-bold text-sm hover:bg-slate-100 transition-colors">
                      <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                      Google
                    </button>
                    <button className="flex items-center justify-center gap-2 py-2.5 bg-[#24292e] text-white rounded-lg font-bold text-sm hover:bg-[#2b3137] transition-colors">
                      <Github size={16} /> GitHub
                    </button>
                  </div>

                  <div className="relative flex items-center gap-4 py-2">
                    <div className="flex-grow h-px bg-slate-700"></div>
                    <span className="text-xs text-slate-500 font-bold uppercase">OR</span>
                    <div className="flex-grow h-px bg-slate-700"></div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                    <div className="flex items-center gap-3 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 focus-within:border-cyan-500 transition-colors">
                      <Mail size={16} className="text-slate-500" />
                      <input type="email" placeholder="team@university.edu" className="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-slate-600" />
                    </div>
                  </div>
                  <button
                    onClick={handleSendOTP}
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg shadow-lg shadow-cyan-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <>Continue <ArrowRight size={16}/></>}
                  </button>
                </motion.div>
              )}

              {loginStep === 'otp' && (
                <motion.div initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} className="space-y-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Lock className="text-cyan-400" size={20} />
                    </div>
                    <h4 className="text-white font-bold">Enter Verification Code</h4>
                    <p className="text-slate-400 text-xs mt-1">Sent to team@university.edu</p>
                  </div>
                  <div className="flex gap-2 justify-center">
                    {[1,2,3,4].map(i => (
                      <input key={i} type="text" maxLength={1} className="w-12 h-14 bg-slate-900/80 border border-slate-700 rounded-lg text-center text-white text-2xl font-bold focus:border-cyan-500 outline-none" />
                    ))}
                  </div>
                  <button
                    onClick={handleVerifyOTP}
                    disabled={isLoading}
                    className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-lg transition-colors"
                  >
                    {isLoading ? "Verifying..." : "Verify & Login"}
                  </button>
                  <button onClick={() => setLoginStep('email')} className="w-full text-xs text-slate-500 hover:text-white">Change Email</button>
                </motion.div>
              )}

              {loginStep === 'success' && (
                <motion.div initial={{opacity: 0, scale: 0.9}} animate={{opacity: 1, scale: 1}} className="text-center py-8">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-500/20">
                    <CheckCircle className="text-green-500" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Welcome Back!</h3>
                  <p className="text-slate-400 text-sm mt-2">Redirecting to command center...</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardLoginSection;