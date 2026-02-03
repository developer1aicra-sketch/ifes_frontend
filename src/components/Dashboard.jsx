import { AlertTriangle, CheckCircle, PlusCircle, Trophy } from "lucide-react";
import { INITIAL_DB } from "../constants/userData";

export const Dashboard = ({ setPage }) => {
  const { club, currentUser } = INITIAL_DB;

  return (
    <div className="animate-fadeIn space-y-6">
      {/* Header Stat Bar */}
      <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white">Hello, Captain {currentUser.full_name}</h1>
          <p className="text-slate-400 text-xs">{club.name}</p>
        </div>
        <div className="flex space-x-6 text-right">
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-bold">Wallet</p>
            <p className="text-lg font-mono text-green-400">₹{club.wallet_balance.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-bold">Rank</p>
            <p className="text-lg font-mono text-yellow-500">#{club.global_rank}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Season Progress Card */}
        <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl">
          <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Season Progress</h3>
          <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-white">NEXT EVENT: ZRC PUNE</span>
              <span className="text-xs text-blue-400">14 Days Left</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Status: 2/3 Ready</span>
              <button onClick={() => setPage('squad_manager')} className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-xs font-bold">
                Manage Squad
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-xs text-green-400"><CheckCircle size={12} className="mr-2" /> Registration Paid</div>
            <div className="flex items-center text-xs text-slate-500"><CheckCircle size={12} className="mr-2" /> Travel Manifest Pending</div>
          </div>
        </div>

        {/* Club Alerts */}
        <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl">
          <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Club Alerts</h3>
          <ul className="space-y-3">
            <li className="flex items-start text-sm text-slate-300">
              <AlertTriangle size={16} className="text-yellow-500 mr-2 mt-0.5" />
              <span className="cursor-pointer hover:text-white" onClick={() => setPage('user')}>
                ⚠️ Profile is incomplete. <span className="underline">Fix now.</span>
              </span>
            </li>
            <li className="flex items-start text-sm text-slate-300">
              <Trophy size={16} className="text-purple-500 mr-2 mt-0.5" />
              <span>🎉 You unlocked "Zone Conqueror" Badge!</span>
            </li>
          </ul>
        </div>
        {/* create the team */}
        <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl hover:border-blue-500 transition-colors cursor-pointer">
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
          

            <PlusCircle size={48} className="text-slate-600 mb-3" />
            <h3 className="text-lg font-bold  text-slate-500 mb-1">Create New Team</h3>
            {/* <p className="text-sm text-slate-400 mb-4">Assemble your dream team for the competition</p> */}
            {/* <button 
      // onClick={() => setPage('create_team')}
      className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
    >
      Get Started
    </button> */}
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-800 p-4 rounded-lg text-center">
          <p className="text-slate-500 text-xs uppercase font-bold">Members</p>
          <p className="text-2xl font-mono text-white">{club.members.length}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg text-center">
          <p className="text-slate-500 text-xs uppercase font-bold">Active Bots</p>
          <p className="text-2xl font-mono text-white">{INITIAL_DB.garage.filter(b => b.status === 'Ready').length}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg text-center">
          <p className="text-slate-500 text-xs uppercase font-bold">Total Wins</p>
          <p className="text-2xl font-mono text-white">8</p>
        </div>
      </div>
    </div>
  );
};