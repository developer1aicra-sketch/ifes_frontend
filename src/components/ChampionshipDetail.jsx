export const ChampionshipDetail = ({ setPage }) => (
  <div className="max-w-5xl mx-auto py-10 animate-fadeIn px-4">
    <button onClick={() => setPage('home')} className="text-slate-500 text-sm mb-4 hover:text-white"> Back to Stadium</button>

    {/* Header */}
    <div className="bg-slate-900 border border-slate-700 p-8 rounded-xl mb-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-black italic text-white mb-2">ROBORACE CHALLENGE</h1>
          <div className="flex space-x-4 text-sm font-bold text-slate-400">
            <span className="text-white border-b-2 border-blue-500 pb-1">Overview</span>
            <span className="hover:text-white">Rules</span>
            <span className="hover:text-white">Schedule</span>
            <span className="hover:text-white">Registered Teams</span>
          </div>
        </div>
        <div className="text-right">
          <Zap className="text-yellow-500 inline-block mb-1" />
          <p className="text-white font-bold">Speed & Precision</p>
          <p className="text-green-400 text-xs">Status: Zonal Rounds Active</p>
        </div>
      </div>
    </div>

    {/* Path To Glory */}
    <div className="bg-slate-900 border border-slate-700 p-8 rounded-xl mb-8">
      <h3 className="text-sm font-bold text-slate-400 uppercase mb-6">Path to Glory</h3>
      <div className="flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -z-10"></div>

        {/* ZRC Node */}
        <div className="bg-slate-900 p-2">
          <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-black font-bold mb-2 mx-auto">
            <CheckCircle size={20} />
          </div>
          <div className="text-center">
            <p className="text-white font-bold">ZRC</p>
            <p className="text-green-400 text-xs">Open</p>
          </div>
        </div>

        {/* NRC Node */}
        <div className="bg-slate-900 p-2">
          <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center text-slate-500 mb-2 mx-auto">
            <Lock size={20} />
          </div>
          <div className="text-center">
            <p className="text-slate-500 font-bold">NRC</p>
            <p className="text-slate-600 text-xs">Locked</p>
          </div>
        </div>

        {/* WRC Node */}
        <div className="bg-slate-900 p-2">
          <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center text-slate-500 mb-2 mx-auto">
            <Lock size={20} />
          </div>
          <div className="text-center">
            <p className="text-slate-500 font-bold">WRC</p>
            <p className="text-slate-600 text-xs">Locked</p>
          </div>
        </div>
      </div>
      <p className="text-center text-slate-400 text-sm mt-6">"Win at Zonal to unlock National entry."</p>
    </div>
  </div>
);