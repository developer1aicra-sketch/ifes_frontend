import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Users, Smartphone, ArrowRight } from 'lucide-react';

const CommunitySection = () => (
  <div>
{/* 
  <section id="community" className="py-24 bg-slate-950">
    <div className=" mx-auto px-6">
      <div className="text-center mb-16">
        <span className="text-cyan-400 font-bold tracking-widest text-sm uppercase">Global Network</span>
        <h2 className="text-4xl font-black text-white mt-2 mb-4">The Roboclub Community</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">Connect with 50,000+ robotics enthusiasts, mentors, and engineers. Share blueprints, debug code, and form alliances.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
      
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 z-10">
            <div className="bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full border border-green-500/20 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> 1,240 Online
            </div>
          </div>
          <div className="p-8 pb-0">
            <div className="flex gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <MessageCircle className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Live Discussion</h3>
                <p className="text-sm text-slate-500">#general • #hardware-help • #wrc-2026</p>
              </div>
            </div>
            
           
            <div className="space-y-4 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10 h-32 bottom-0 pointer-events-none"></div>
              {[1, 2, 3].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2 }}
                  className="flex gap-3 max-w-md"
                >
                  <img src={`https://i.pravatar.cc/100?img=${i+20}`} className="w-8 h-8 rounded-full border border-slate-700" alt="user" />
                  <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-700">
                    <p className="text-slate-300 text-sm">Anyone know the best servo for a 3kg combat bot? Need high torque.</p>
                  </div>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="flex gap-3 max-w-md ml-auto flex-row-reverse"
              >
                <img src={`https://i.pravatar.cc/100?img=33`} className="w-8 h-8 rounded-full border border-slate-700" alt="user" />
                <div className="bg-cyan-900/30 p-3 rounded-2xl rounded-tr-none border border-cyan-500/30">
                  <p className="text-cyan-100 text-sm">Check out the TX-Servo X9. Used it last year, total beast!</p>
                </div>
              </motion.div>
            </div>
          </div>
          <div className="absolute bottom-0 w-full p-6 bg-slate-900 z-20">
            <button className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors flex items-center justify-center gap-2 group-hover:bg-cyan-600">
              Join the Conversation <ArrowRight size={16} />
            </button>
          </div>
        </div>

       
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-violet-500/50 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-400 mb-4">
              <Users size={20} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Find a Team</h3>
            <p className="text-slate-400 text-sm mb-4">Looking for a coder or mechanical engineer? Browse player profiles.</p>
            <a href="#" className="text-violet-400 text-sm font-bold hover:underline">Browse Listings &rarr;</a>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/50 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
              <Smartphone size={20} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Workshops</h3>
            <p className="text-slate-400 text-sm mb-4">Weekly live sessions on fusion 360, ROS2, and PCB design.</p>
            <a href="#" className="text-cyan-400 text-sm font-bold hover:underline">View Calendar &rarr;</a>
          </div>
        </div>
      </div>
    </div>
  </section> */}
  </div>

);

export default CommunitySection;