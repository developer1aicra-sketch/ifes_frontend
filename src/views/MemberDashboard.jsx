import { useState } from 'react';
import { Award, Download, LayoutDashboard } from 'lucide-react';

const MemberDashboard = () => {
  const [activeTab, setActiveTab] = useState('certificates');

  return (
    <div className="animate-fadeIn bg-slate-50 min-h-screen flex flex-col">
      <div className="container mx-auto px-4 flex-1 pb-16 pt-24">
        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden flex flex-col lg:flex-row h-full min-h-[75vh]">
          {/* Sidebar styled like Technoxian schedule */}
          <aside className="w-72 bg-slate-900 text-white relative overflow-hidden border-r border-slate-800">
            <div className="w-72 bg-[#0f172a] text-white relative overflow-hidden border-r border-slate-800" />
            <div className="relative p-6 space-y-4 overflow-y-auto" style={{ scrollbarColor: '#1d4ed8 #0f172a', scrollbarWidth: 'thin' }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">JD</div>
                <div>
                  <div className="text-[11px] font-bold uppercase text-blue-200">Member</div>
                  <div className="font-extrabold">John Doe</div>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all shadow-sm flex items-center gap-3 ${
                    activeTab === 'overview'
                      ? 'bg-white/15 border-blue-400 text-white'
                      : 'bg-white/5 border-white/10 hover:border-blue-300 text-blue-100'
                  }`}
                >
                  <LayoutDashboard size={18} /> Overview
                </button>
                <button
                  onClick={() => setActiveTab('certificates')}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all shadow-sm flex items-center gap-3 ${
                    activeTab === 'certificates'
                      ? 'bg-white/15 border-blue-400 text-white'
                      : 'bg-white/5 border-white/10 hover:border-blue-300 text-blue-100'
                  }`}
                >
                  <Award size={18} /> Certificates
                </button>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main
            className="flex-1 bg-white flex flex-col"
          >
            <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-slate-100">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {activeTab === 'overview' && 'Dashboard Overview'}
                  {activeTab === 'certificates' && 'Certificates'}
                </h1>
                <div className="text-slate-500">Team: RoboTitans India | ID: W-IND-001</div>
              </div>
              <div className="text-sm text-slate-500">Member Portal</div>
            </div>

            <div
              className="flex-1 p-8 lg:p-10 overflow-y-auto"
              style={{ scrollbarColor: '#1d4ed8 #f8fafc', scrollbarWidth: 'thin' }}
            >
              {activeTab === 'overview' && (
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-xs font-bold uppercase text-slate-500 mb-1">Participation</div>
                    <div className="text-3xl font-bold text-slate-900">7</div>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-xs font-bold uppercase text-slate-500 mb-1">Certificates</div>
                    <div className="text-3xl font-bold text-slate-900">5</div>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-xs font-bold uppercase text-slate-500 mb-1">Rank</div>
                    <div className="text-3xl font-bold text-slate-900">#12 National</div>
                  </div>
                </div>
              )}

              {activeTab === 'certificates' && (
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Award className="text-blue-600" /> Certificates
                    </h3>
                    <div className="p-4 bg-slate-50 rounded border border-slate-100 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-sm">Participation 2024</div>
                        <div className="text-xs text-slate-500">Technoxian World Cup</div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800">
                        <Download size={20} />
                      </button>
                    </div>
                    <button className="w-full mt-4 text-sm font-bold text-blue-600 border border-blue-200 rounded py-2 hover:bg-blue-50">
                      Verify A Certificate
                    </button>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;

