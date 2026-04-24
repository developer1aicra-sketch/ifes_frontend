import React from 'react';

const NationalEsportsPartner = () => {
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
                National
             </div>
             <div className="absolute top-10 left-10 w-16 h-16 border border-yellow-500/30 rounded-full blur-[1px]"></div>
             <div className="absolute top-14 left-14 w-3 h-3 bg-yellow-500/60 rounded-full blur-[2px]"></div>
        </div>

        {/* Banner Content */}
        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            National <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400">Esports Partner</span>
          </h1>
          <nav className="flex items-center justify-center gap-3 text-sm font-medium uppercase tracking-widest text-gray-400">
             <a href="/" className="hover:text-white transition">Home</a>
             <span className="text-gray-700">/</span>
             <span className="text-purple-500">National Esports Partner</span>
          </nav>
        </div>
      </div>

      {/* --- MAIN CONTENT - White Background Container --- */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl shadow-black/20 p-8 md:p-12">
          
          {/* Introduction Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-sm font-bold text-purple-600 uppercase tracking-[0.3em] mb-4">Official Partnership</h2>
              <h3 className="text-2xl md:text-3xl font-extrabold mb-5 leading-tight text-slate-900">
                Become a <span className="text-slate-900">National Esports Partner (NEP)</span><br />
                of the International Federation of Esports (IFeS)
              </h3>
              <p className="text-slate-600 text-base leading-relaxed">
               The International Federation of Esports (IFES) is dedicated to the growth and regulation of competitive gaming across the globe. As part of our mission, we are seeking dynamic and forward-thinking organizations to join us as National Esports Partners. These partners will be responsible for organizing esports and gaming events on behalf of IFES in collaboration with local governments and esports associations to bring esports to the forefront of their respective countries.
              </p>
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-slate-100 border border-slate-200 rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src="https://ifes.in/images/nep.jpg" 
                  alt="Esports Arena" 
                  className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
              </div>
            </div>
          </div>

          {/* "Why Become" Section */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 md:p-12 mb-16">
            <div className="flex flex-col lg:flex-row gap-12 items-start">
              <div className="w-full lg:w-1/2">
                 <h2 className="text-2xl md:text-3xl font-bold mb-8 text-slate-900">Why Become A <br/><span className="text-purple-600">National Esports Partner?</span></h2>
                 <div className="space-y-6">
                    {[
                      { t: "Exclusive Access & Authority", d: "As a National Esports Partner, your organization will have the exclusive rights to organize esports and gaming competitions within your country, in close coordination with IFES and relevant local authorities." },
                      { t: "Global Recognition", d: "Become an official part of the IFES network, recognized globally for your role in advancing esports. Enhance your brand's visibility and credibility within the esports community." },
                      { t: "Sponsorship Opportunities", d: "As a National Partner, you will be responsible for sourcing and securing sponsors for esports competitions. Tap into a rapidly growing market and attract key industry sponsors to support your events." },
                      { t: "Player Registration and Management", d: "Manage the registration and participation of players in regional and international competitions, ensuring smooth and organized tournament structures." },
                      { t: "Collaboration with IFES and Local Governments", d: "Work alongside IFES and local government entities to ensure esports growth and regulation within your country. Help shape policies and drive the development of esports ecosystems." }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4 group">
                        <div className="flex-shrink-0 w-10 h-10 bg-purple-100 border border-purple-200 rounded-xl flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all">
                          <span className="font-bold text-base">{i + 1}</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-bold mb-1 text-slate-800">{item.t}</h4>
                          <p className="text-slate-500 text-sm">{item.d}</p>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="w-full lg:w-1/2">
                 <img src="https://ifes.in/images/worldmap.jpeg" alt="World Map" className="rounded-2xl opacity-80 hover:opacity-100 transition duration-500 shadow-lg"/>
              </div>
            </div>
          </div>

          {/* Content Section - With tick marks and proper spacing */}
          <div className="space-y-4 text-slate-700">
            <div className="flex items-start gap-3">
              <span className="text-green-600 mt-0.5 font-bold">✓</span>
              <p className="text-sm leading-relaxed">Have a solid track record in organizing competitive gaming events or esports tournaments in your country.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 mt-0.5 font-bold">✓</span>
              <p className="text-sm leading-relaxed">Work effectively with local government bodies, esports associations, and other relevant stakeholders to promote esports.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 mt-0.5 font-bold">✓</span>
              <p className="text-sm leading-relaxed">Demonstrate commitment to fostering esports growth, including player development, infrastructure, and community engagement.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 mt-0.5 font-bold">✓</span>
              <p className="text-sm leading-relaxed">Be able to manage and oversee sponsorship and funding for esports events.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 mt-0.5 font-bold">✓</span>
              <p className="text-sm leading-relaxed">To become an official National Esports Partner of IFES, an annual license fee of USD 2,000 to be paid.</p>
            </div>
            
            {/* Extra gap after license fee line */}
            <div className="h-4"></div>
            
            <div className="flex items-start gap-3">
              <span className="text-purple-600 mt-0.5 font-bold">◆</span>
              <p className="text-sm leading-relaxed">Organize national esports competitions and events under the IFES banner.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-600 mt-0.5 font-bold">◆</span>
              <p className="text-sm leading-relaxed">Coordinate with local government and esports bodies.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-600 mt-0.5 font-bold">◆</span>
              <p className="text-sm leading-relaxed">Access IFES branding, event guidelines, and resources.</p>
            </div>

            <div className="pt-4">
              <p className="text-slate-600 text-sm leading-relaxed">
                Becoming a National Esports Partner of IFES is an exciting opportunity to play a central role in shaping the future of esports in your country. Together with IFES, we can elevate competitive gaming, provide opportunities for players, and create a thriving esports culture. Submit your application in attached online form. Our team will review your application, and upon approval, you will be notified of your official status as a National Esports Partner.
              </p>
            </div>

            <div className="pt-2">
              <p className="text-slate-500 text-sm">
                For any questions or assistance with the application process, feel free to contact our team at:<br />
                <span className="text-purple-600 font-medium">presidentdesk@ifes.in</span> or WhatsApp @ <span className="text-green-600 font-medium">+91 92890 95407</span>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NationalEsportsPartner;