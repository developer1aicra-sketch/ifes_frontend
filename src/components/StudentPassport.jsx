import { useState } from "react";
import { INITIAL_DB } from "../constants/userData";
import { Activity, Award, Edit2, Share2, Trophy } from "lucide-react";

export const StudentPassport = ({ setPage }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    full_name: INITIAL_DB.currentUser.full_name,
    club: { ...INITIAL_DB.club }
  });

  const user = INITIAL_DB.currentUser;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'clubName') {
      setEditedUser(prev => ({
        ...prev,
        club: {
          ...prev.club,
          name: value
        }
      }));
    } else {
      setEditedUser(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = () => {
    // In a real app, you would update the state/API here
    user.full_name = editedUser.full_name;
    INITIAL_DB.club.name = editedUser.club.name;
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setEditedUser({
      full_name: user.full_name,
      club: { ...INITIAL_DB.club }
    });
    setIsEditing(true);
  };

  return (
    <div className="p-6 animate-fadeIn max-w-4xl mx-auto">
      <button onClick={() => setPage('dashboard')} className="text-slate-500 text-sm mb-4 hover:text-white">← Back</button>

      <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="h-32 bg-gradient-to-r from-blue-900 to-slate-900"></div>
        <div className="px-8 pb-8 -mt-12 flex justify-between items-end">
          <div className="flex items-end space-x-4">
            <img src={user.avatar} className="w-24 h-24 rounded-xl border-4 border-slate-900 bg-slate-800" />
            <div className="mb-1">
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    name="full_name"
                    value={editedUser.full_name}
                    onChange={handleInputChange}
                    className="bg-slate-800 text-white border border-slate-700 rounded px-2 py-1 w-full"
                  />
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-400 font-bold text-sm">Captain - </span>
                    <input
                      type="text"
                      name="clubName"
                      value={editedUser.club.name}
                      onChange={handleInputChange}
                      className="bg-slate-800 text-blue-400 font-bold text-sm border border-slate-700 rounded px-2 py-1 flex-1"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-black text-white uppercase">{user.full_name}</h1>
                  <p className="text-blue-400 font-bold text-sm">Captain - {INITIAL_DB.club.name}</p>
                </>
              )}
            </div>
          </div>
          <div className="space-x-2 flex">
            <button
              onClick={isEditing ? handleSave : handleEditClick}
              className="bg-slate-800 p-2 rounded border border-slate-700 hover:bg-blue-600 hover:text-white text-slate-400 hover:border-blue-500 transition-colors"
            >
              {isEditing ? 'Save' : <Edit2 size={16} />}
            </button>
            {isEditing && (
              <button
                onClick={() => setIsEditing(false)}
                className="bg-slate-800 p-2 rounded border border-slate-700 hover:bg-red-600 hover:text-white text-slate-400 hover:border-red-500 transition-colors"
              >
                <X size={16} />
              </button>
            )}
            <button className="bg-slate-800 p-2 rounded border border-slate-700 hover:text-white text-slate-400 hover:bg-slate-700 transition-colors">
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* Stats Card */}
        <div className="px-8 py-6 border-b border-slate-800 grid grid-cols-3 gap-4">
          <div className="bg-black/30 p-4 rounded text-center">
            <p className="text-xs text-slate-500 uppercase font-bold">Matches</p>
            <p className="text-2xl font-mono text-white">{user.career_stats.matches}</p>
          </div>
          <div className="bg-black/30 p-4 rounded text-center">
            <p className="text-xs text-slate-500 uppercase font-bold">Gold</p>
            <p className="text-2xl font-mono text-yellow-500">{user.career_stats.golds}</p>
          </div>
          <div className="bg-black/30 p-4 rounded text-center">
            <p className="text-xs text-slate-500 uppercase font-bold">Silver</p>
            <p className="text-2xl font-mono text-slate-300">{user.career_stats.silvers}</p>
          </div>
        </div>

        {/* Career History */}
        <div className="px-8 py-6 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white uppercase mb-4">Career History</h3>
          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="mt-1 mr-3"><Trophy size={16} className="text-yellow-500" /></div>
              <div>
                <p className="text-white font-bold text-sm">Winner - ZRC Pune - RoboRace</p>
                <p className="text-slate-500 text-xs">2025 • Captain</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="mt-1 mr-3"><Activity size={16} className="text-slate-500" /></div>
              <div>
                <p className="text-slate-300 font-bold text-sm">Participant - WRC UAE - Soccer</p>
                <p className="text-slate-500 text-xs">2024 • Pilot</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Certificates */}
        <div className="px-8 py-6">
          <h3 className="text-sm font-bold text-white uppercase mb-4">Certificates (Blockchain Verified)</h3>
          <div className="flex space-x-4">
            {user.certificates.map(c => (
              <div key={c.id} className="bg-slate-800 p-3 rounded border border-slate-700 flex items-center space-x-3 cursor-pointer hover:border-blue-500">
                <Award className="text-blue-500" size={24} />
                <div>
                  <p className="text-xs font-bold text-white">{c.title}</p>
                  <p className="text-[10px] text-slate-500">{c.date} • #{c.id}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};