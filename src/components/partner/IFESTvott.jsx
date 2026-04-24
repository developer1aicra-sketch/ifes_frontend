import React from 'react';

const IFESTvott = () => {
  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white font-sans selection:bg-purple-500/30 overflow-x-hidden">
      
      {/* --- SECTION 1: DYNAMIC BANNER --- */}
      <div className="relative w-full py-24 flex flex-col items-center justify-center border-b border-white/5">
        {/* Background Grid Layer */}
        <div className="absolute inset-0 z-0 opacity-10" 
             style={{ backgroundImage: `linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)`, backgroundSize: '40px 40px' }}>
        </div>
        
        {/* Neon Glow & Background Text Decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/[0.02] font-black text-[15vw] uppercase tracking-tighter select-none">
                IFES TV
             </div>
             <div className="absolute top-10 left-10 w-16 h-16 border border-yellow-500/30 rounded-full blur-[1px]"></div>
             <div className="absolute top-14 left-14 w-3 h-3 bg-yellow-500/60 rounded-full blur-[2px]"></div>
        </div>

        {/* Banner Content */}
        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            IFES <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400">TV - OTT</span>
          </h1>
          <nav className="flex items-center justify-center gap-3 text-sm font-medium uppercase tracking-widest text-gray-400">
             <a href="/" className="hover:text-white transition">Home</a>
             <span className="text-gray-700">/</span>
             <span className="text-purple-500">IFES TV - OTT</span>
          </nav>
        </div>
      </div>

      {/* --- MAIN CONTENT - White Background Container --- */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl shadow-black/20 p-8 md:p-12">
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Your all-in-one platform for IFES Community
            </h2>
            <p className="text-slate-600 text-lg">
              Create, Live Streaming, and Country Qualifiers.
            </p>
            <button className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl">
              Join the Waitlist
            </button>
          </div>

          {/* What to Expect Section */}
          <div className="mt-16">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-10">
              What to Expect from IFES OTT
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Card 1 */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-2">Engage with the Community</h4>
                <p className="text-slate-500 text-sm">Connect and engage with the global IFES community through forums and discussions.</p>
              </div>

              {/* Card 2 */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 6v12M16 6v12" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-2">Exclusive Content Library</h4>
                <p className="text-slate-500 text-sm">Access a rich library of exclusive IFES videos, articles, and more.</p>
              </div>

              {/* Card 3 */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-2">Live Events and Broadcasts</h4>
                <p className="text-slate-500 text-sm">Watch live streams of IFES events, tournaments, and special broadcasts.</p>
              </div>

              {/* Card 4 */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-2">Country Qualifiers</h4>
                <p className="text-slate-500 text-sm">Follow and participate in national competitions and qualifiers.</p>
              </div>
            </div>
          </div>

          {/* Bottom CTA Section */}
          <div className="text-center mt-12 pt-8 border-t border-slate-200">
            <p className="text-slate-600 mb-4">Be the first to know when IFES OTT launches</p>
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl">
              Join the Waitlist
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default IFESTvott;