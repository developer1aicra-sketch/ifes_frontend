const Footer = ({ setView, switchSite, currentSite }) => (
  <footer className="bg-[#0f172a] text-slate-400 py-16 border-t border-slate-800">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-8 h-8 rounded flex items-center justify-center text-white font-bold ${currentSite.colors.primary}`}>
              {currentSite.is_partner ? 'T' : 'W'}
            </div>
            <span className="text-white font-bold text-xl tracking-tight">{currentSite.is_partner ? 'TECHNOXIAN' : 'WORSO'}</span>
          </div>
          <p className="max-w-sm mb-6 leading-relaxed text-sm">
            {currentSite.is_partner ? 'The official regional chapter of the World Robotics Championship.' : 'The World Robotics Society is the global regulatory body.'}
          </p>
        </div>
        <div>
          {!currentSite.is_partner && (
            <>
              <h4 className="text-white font-bold mb-6">Governance</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <button onClick={() => setView('about')} className="hover:text-white">
                    Board of Directors
                  </button>
                </li>
                <li>
                  <button onClick={() => setView('about')} className="hover:text-white">
                    Constitution
                  </button>
                </li>
                <li>
                  <button onClick={() => setView('about')} className="hover:text-white">
                    Ethics Committee
                  </button>
                </li>
              </ul>
            </>
          )}
        </div>
        <div>
          <h4 className="text-white font-bold mb-6">Quick Links</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <button onClick={() => setView('technoxian')} className="hover:text-white">
                Technoxian Games
              </button>
            </li>
            <li>
              <button onClick={() => setView('teams')} className="hover:text-white">
                Teams & Rankings
              </button>
            </li>
            <li>
              <button onClick={() => setView('login')} className="hover:text-white">
                Verify Certificates
              </button>
            </li>
            <li>
              <button onClick={() => setView('careers')} className="hover:text-white">
                Careers at Worso
              </button>
            </li>
            <li className="pt-2 border-t border-slate-800">
              <a href="#" className="hover:text-white">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Terms of Use
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 pt-8 flex items-center justify-between">
        <div className="text-xs text-slate-600">© 2025. All Rights Reserved.</div>
        <div className="flex items-center gap-4">
          <button onClick={() => setView('staff-login')} className="text-[10px] text-slate-800 hover:text-slate-600 font-bold uppercase">
            Staff Access
          </button>
          <div className="h-4 w-px bg-slate-800"></div>
          <span className="text-[10px] font-bold text-slate-600 uppercase">View As:</span>
          <button onClick={() => switchSite('global')} className={`text-[10px] font-bold ${currentSite.id === 'global' ? 'text-blue-500' : 'text-slate-500'}`}>
            Global
          </button>
          <button onClick={() => switchSite('uae')} className={`text-[10px] font-bold ${currentSite.id === 'uae' ? 'text-emerald-500' : 'text-slate-500'}`}>
            UAE
          </button>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;

