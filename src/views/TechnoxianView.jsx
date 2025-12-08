import { useState } from 'react';
import { Users, Ticket, Building, CreditCard } from 'lucide-react';
import { GAME_CATEGORIES } from '../constants/data';

const TechnoxianView = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [regType, setRegType] = useState('team');

  return (
    <div className="animate-fadeIn bg-slate-50 min-h-screen pt-20">
      <div className="bg-white border-b border-slate-200 sticky top-20 z-30 shadow-sm">
        <div className="container mx-auto px-4 flex gap-8 overflow-x-auto">
          {['overview', 'disciplines', 'schedule', 'gallery', 'register'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="container mx-auto px-4 py-12">
          <div className="bg-[#0f172a] rounded-3xl text-white p-12 mb-12 relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <div className="text-yellow-400 font-bold tracking-widest text-xs uppercase mb-4">Official Championship</div>
              <h1 className="text-5xl font-extrabold mb-6">Technoxian World Cup '26</h1>
              <button onClick={() => setActiveTab('register')} className="bg-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">
                Register Now
              </button>
            </div>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[{ l: 'Prize Pool', v: '$250k' }, { l: 'Teams', v: '120k+' }, { l: 'Countries', v: '95+' }, { l: 'Spectators', v: '2.5M' }].map((s, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
                <div className="text-4xl font-extrabold text-blue-600 mb-2">{s.v}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'disciplines' && (
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            {GAME_CATEGORIES.map((g) => (
              <div key={g.id} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
                <div className="text-5xl mb-6 bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center">{g.icon}</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{g.name}</h3>
                <p className="text-slate-500 mb-6 text-sm h-12 leading-relaxed">{g.desc}</p>
                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6 mb-6">
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase">Players</div>
                    <div className="font-bold text-slate-900">{g.players}</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase">Prize</div>
                    <div className="font-bold text-green-600">{g.prize}</div>
                  </div>
                </div>
                <button className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors">
                  Register for Game
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'register' && (
        <div className="container mx-auto px-4 py-12">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
            <div className="md:w-64 bg-slate-50 border-r border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 mb-6">Registration Type</h3>
              <div className="space-y-2">
                {['Team Registration', 'Visitor Pass', 'Exhibitor Space'].map((type) => {
                  const id = type.split(' ')[0].toLowerCase();
                  return (
                    <button
                      key={id}
                      onClick={() => setRegType(id)}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        regType === id ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex-1 p-8 md:p-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                {regType === 'team' && <Users className="text-blue-600" />}
                {regType === 'visitor' && <Ticket className="text-blue-600" />}
                {regType === 'exhibitor' && <Building className="text-blue-600" />}
                {regType.charAt(0).toUpperCase() + regType.slice(1)} Registration
              </h2>
              <div className="space-y-6 max-w-3xl">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">{regType === 'team' ? 'Team Name' : 'Full Name'}</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder={regType === 'team' ? 'e.g. RoboTitans' : 'John Doe'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Country</label>
                    <select className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                      <option>Select Country</option>
                      <option>India</option>
                      <option>UAE</option>
                      <option>USA</option>
                    </select>
                  </div>
                </div>
                {regType === 'team' && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Select Categories ($100/category)</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {GAME_CATEGORIES.map((g) => (
                        <label
                          key={g.id}
                          className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:border-blue-400 transition-colors"
                        >
                          <input type="checkbox" className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 custom-checkbox" />
                          <span className="text-sm font-medium text-slate-700">{g.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
                  <div>
                    <div className="text-sm text-slate-500">Total Payable Amount</div>
                    <div className="text-2xl font-bold text-slate-900">$200.00 USD</div>
                  </div>
                  <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <CreditCard size={18} /> Proceed to Pay
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnoxianView;

