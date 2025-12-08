import { useState } from 'react';
import { ChevronRight, X } from 'lucide-react';
import { MOCK_TEAMS } from '../constants/data';

const TeamsView = () => {
  const [viewLevel, setViewLevel] = useState('list');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const handleTeamClick = (team) => {
    setSelectedTeam(team);
    setViewLevel('team');
  };

  const handlePlayerClick = (player) => {
    setSelectedPlayer(player);
    setViewLevel('player');
  };

  return (
    <div className="animate-fadeIn pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <span className="cursor-pointer hover:text-blue-600" onClick={() => setViewLevel('list')}>
            Teams
          </span>
          {viewLevel !== 'list' && selectedTeam && (
            <>
              <ChevronRight size={14} />
              <span className="cursor-pointer hover:text-blue-600" onClick={() => setViewLevel('team')}>
                {selectedTeam.name}
              </span>
            </>
          )}
          {viewLevel === 'player' && selectedPlayer && (
            <>
              <ChevronRight size={14} /> <span className="font-bold text-slate-900">{selectedPlayer.name}</span>
            </>
          )}
        </div>

        {viewLevel === 'list' && (
          <>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Worso Clubs & Teams</h1>
            <div className="grid md:grid-cols-3 gap-6">
              {MOCK_TEAMS.map((team) => (
                <div
                  key={team.id}
                  onClick={() => handleTeamClick(team)}
                  className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img src={team.logo} className="w-16 h-16 rounded bg-slate-100" alt={team.name} />
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600">{team.name}</h3>
                      <div className="text-sm text-slate-500">{team.country}</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between">
                    <span className="text-sm font-bold text-slate-500">Global Rank #{team.rank}</span>
                    <span className="text-sm font-bold text-blue-600">View Roster →</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {viewLevel === 'team' && selectedTeam && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 p-8 text-white flex items-center gap-6">
              <img src={selectedTeam.logo} className="w-24 h-24 bg-white rounded-xl p-2" alt={selectedTeam.name} />
              <div>
                <h1 className="text-4xl font-bold">{selectedTeam.name}</h1>
                <p className="text-slate-400">{selectedTeam.history}</p>
              </div>
            </div>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Team Roster</h2>
              <div className="grid md:grid-cols-4 gap-6">
                {selectedTeam.players.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handlePlayerClick(p)}
                    className="border border-slate-200 rounded-xl overflow-hidden cursor-pointer hover:border-blue-500 transition-all"
                  >
                    <img src={p.image} className="w-full h-48 object-cover" alt={p.name} />
                    <div className="p-4">
                      <h3 className="font-bold text-slate-900">{p.name}</h3>
                      <p className="text-sm text-slate-500">{p.role}</p>
                      <button className="mt-3 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded">More Details</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {viewLevel === 'player' && selectedPlayer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden relative animate-fadeIn">
              <button onClick={() => setViewLevel('team')} className="absolute top-4 right-4 bg-slate-100 p-2 rounded-full hover:bg-slate-200">
                <X size={20} />
              </button>
              <div className="grid md:grid-cols-2">
                <img src={selectedPlayer.image} className="w-full h-full object-cover" alt={selectedPlayer.name} />
                <div className="p-8">
                  <div className="text-blue-600 font-bold text-sm uppercase mb-1">{selectedPlayer.role}</div>
                  <h2 className="text-3xl font-extrabold text-slate-900 mb-6">{selectedPlayer.name}</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Matches</span>
                      <span className="font-bold text-slate-900">{selectedPlayer.matches}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Win Rate</span>
                      <span className="font-bold text-green-600">{selectedPlayer.winRate}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Team</span>
                      <span className="font-bold text-slate-900">{selectedTeam.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamsView;

