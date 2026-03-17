import { AlertTriangle, CheckCircle, PlusCircle, Trophy } from "lucide-react";
import { INITIAL_DB } from "../constants/userData";

export const Dashboard = ({ setPage, clubProfile }) => {
  const { club, currentUser } = INITIAL_DB;
  const captainName =
    clubProfile?.name ||
    currentUser?.full_name ||
    currentUser?.fullName ||
    "Captain";
  const clubName =
    clubProfile?.clubName ||
    clubProfile?.club_name ||
    clubProfile?.club ||
    club?.name ||
    "Club";

  return (
    <div className="animate-fadeIn space-y-6">
      {/* Header Stat Bar */}
      <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white">Hello, {captainName}</h1>
          <p className="text-slate-400 text-xs">{clubName}</p>
        </div>
        <div className="flex space-x-6 text-right">
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-bold">Wallet</p>
            <p className="text-lg font-mono text-green-400">₹0</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-bold">Rank</p>
            <p className="text-lg font-mono text-yellow-500">#0</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Season Progress Card */}
       

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
           
          </ul>
        </div>
        {/* create the team */}
       
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-800 p-4 rounded-lg text-center">
          <p className="text-slate-500 text-xs uppercase font-bold">Members</p>
          <p className="text-2xl font-mono text-white">0</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg text-center">
          <p className="text-slate-500 text-xs uppercase font-bold">Active Bots</p>
          <p className="text-2xl font-mono text-white">0</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg text-center">
          <p className="text-slate-500 text-xs uppercase font-bold">Total Wins</p>
          <p className="text-2xl font-mono text-white">0</p>
        </div>
      </div>
    </div>
  );
};