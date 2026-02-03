import { FileText, Shield, UserCheck } from "lucide-react";
import { INITIAL_DB } from "../constants/userData";

export const AdminConsole = ({ onVerify }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-red-900/20 border border-red-500/50 p-4 rounded-lg flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className="text-red-500" size={24} />
          <div>
            <h2 className="text-xl font-bold text-white">Federation Admin Console</h2>
            <p className="text-red-400 text-xs">AUTHORIZED PERSONNEL ONLY</p>
          </div>
        </div>
      </div>

      {/* Verification Queue */}
      <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center">
          <h3 className="font-bold text-white flex items-center">
            <UserCheck className="mr-2 text-blue-400" size={16} /> ZRC Winner Claims
          </h3>
          <span className="text-xs bg-blue-900 text-blue-200 px-2 py-1 rounded">
            Manual Check Required
          </span>
        </div>

        <div className="divide-y divide-slate-700">
          {INITIAL_DB.admin_verification_queue.map((claim) => (
            <div key={claim.id} className="p-4 hover:bg-slate-800 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-white">{claim.club_name}</h4>
                  <p className="text-xs text-slate-400">{claim.event} • {claim.category}</p>
                </div>
                <span className="bg-yellow-900/50 text-yellow-500 text-xs px-2 py-1 rounded border border-yellow-700/50">
                  Claims {claim.claimed_rank}
                </span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <button className="text-xs text-blue-400 hover:underline flex items-center">
                  <FileText size={12} className="mr-1" /> View Proof ({claim.proof_doc})
                </button>
                <div className="flex space-x-2">
                  <button className="bg-red-900/50 hover:bg-red-900 text-red-400 text-xs px-3 py-1 rounded transition-colors">
                    Reject
                  </button>
                  <button
                    onClick={() => onVerify(claim.id)}
                    className="bg-green-600 hover:bg-green-500 text-white text-xs px-3 py-1 rounded font-bold shadow-lg shadow-green-900/20 transition-all"
                  >
                    Verify & Unlock NRC
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};