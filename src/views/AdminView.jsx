import { useState } from 'react';
import { Calendar, Layout, Building, Plus, Sparkles, LogOut } from 'lucide-react';
import { DEFAULT_SITES } from '../constants/data';
import { callGemini } from '../utils/gemini';

const AdminView = ({ setSites, sites, defaultMode }) => {
  const [isAdminMode] = useState(defaultMode || 'super');
  const [activeTab, setActiveTab] = useState('overview');
  const [newPartner, setNewPartner] = useState({ country: '', theme: 'blue', subdomain: '' });
  const [newEvent, setNewEvent] = useState({ title: '', date: '', location: '' });
  const [genLoading, setGenLoading] = useState(false);
  const [genResult, setGenResult] = useState('');

  const handleCreatePartner = () => {
    const id = (newPartner.subdomain || newPartner.country).toLowerCase().replace(/\s+/g, '');
    if (!id) return;

    const newSite = {
      id,
      name: `TECHNOXIAN ${newPartner.country || id}`,
      logo_text: `TECHNOXIAN ${(newPartner.country || id).toUpperCase()}`,
      subdomain: `${id}.worso.org`,
      sub_text: 'OFFICIAL PARTNER',
      theme: newPartner.theme,
      colors: newPartner.theme === 'emerald' ? DEFAULT_SITES.uae.colors : DEFAULT_SITES.global.colors,
      is_partner: true,
      local_events: [],
    };
    setSites({ ...sites, [id]: newSite });
    alert(`Partner site for ${newPartner.country || id} created at ${newSite.subdomain}. Credentials emailed.`);
    setNewPartner({ country: '', theme: 'blue', subdomain: '' });
  };

  const handleCreateEvent = () => {
    const targetSiteId = 'uae';
    const updatedSite = {
      ...sites[targetSiteId],
      local_events: [...sites[targetSiteId].local_events, { id: Date.now(), ...newEvent, status: 'Upcoming' }],
    };
    setSites({ ...sites, [targetSiteId]: updatedSite });
    alert('Local Event Created!');
    setNewEvent({ title: '', date: '', location: '' });
  };

  const generatePressRelease = async (event) => {
    setGenLoading(true);
    const prompt = `Write a short, exciting press release (max 100 words) for a robotics event titled "${event.title}" happening at "${event.location}" on "${event.date}". Use professional but energetic tone.`;
    const result = await callGemini(prompt);
    setGenResult(result);
    setGenLoading(false);
  };

  return (
    <div className="bg-slate-50 animate-fadeIn min-h-screen flex flex-col">
      <div className="container mx-auto px-4 flex-1 pb-16 pt-12">
        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden flex flex-col lg:flex-row h-full min-h-[80vh]">
      <div className="w-72 bg-[#0f172a] text-white relative overflow-hidden border-r border-slate-800">
        <div className="relative px-6 pt-12 pb-6 space-y-6 overflow-y-auto" style={{ scrollbarColor: '#1d4ed8 #0f172a', scrollbarWidth: 'thin' }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase text-blue-200">Portal</div>
              <div className="font-extrabold text-xl">{isAdminMode === 'super' ? 'WORSO HQ' : 'Partner Portal'}</div>
            </div>
            <div className="px-3 py-1 rounded-full bg-white/10 text-[11px] font-semibold border border-white/10">
              {isAdminMode === 'super' ? 'Super' : 'Partner'}
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
              <Layout size={18} /> Overview
            </button>

            {isAdminMode === 'super' ? (
              <button
                onClick={() => setActiveTab('partners')}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all shadow-sm flex items-center gap-3 ${
                  activeTab === 'partners'
                    ? 'bg-white/15 border-blue-400 text-white'
                    : 'bg-white/5 border-white/10 hover:border-blue-300 text-blue-100'
                }`}
              >
                <Building size={18} /> Manage Partners
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('events')}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all shadow-sm flex items-center gap-3 ${
                  activeTab === 'events'
                    ? 'bg-white/15 border-blue-400 text-white'
                    : 'bg-white/5 border-white/10 hover:border-blue-300 text-blue-100'
                }`}
              >
                <Calendar size={18} /> My Events
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="flex-1 bg-white flex flex-col">
        <div className="px-8 py-6 border-b border-slate-100 bg-white/90 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase text-blue-600 mb-1">Admin Console</div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                {activeTab === 'overview' && 'Dashboard Overview'}
                {activeTab === 'partners' && 'Partner Management'}
                {activeTab === 'events' && 'Local Event Manager'}
              </h1>
            </div>
            <div className="px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-sm font-semibold border border-slate-200">
              {isAdminMode === 'super' ? 'Global Control Panel' : `Managing: ${sites.uae.name}`}
            </div>
          </div>
        </div>
        <div
          className="p-8 lg:p-12 flex-1 overflow-y-auto"
          style={{ scrollbarColor: '#1d4ed8 #f8fafc', scrollbarWidth: 'thin' }}
        >

        {activeTab === 'overview' && (
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-xs font-bold text-slate-500 uppercase mb-1">Revenue</div>
              <div className="text-3xl font-bold text-slate-900">{isAdminMode === 'super' ? '$2.4M' : '$45,000'}</div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-xs font-bold text-slate-500 uppercase mb-1">{isAdminMode === 'super' ? 'Partners' : 'Registrations'}</div>
              <div className="text-3xl font-bold text-slate-900">{isAdminMode === 'super' ? Object.keys(sites).length - 1 : '128'}</div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-xs font-bold text-slate-500 uppercase mb-1">Field-Level Controls</div>
              <div className="text-sm text-slate-600">
                {isAdminMode === 'super' ? 'Rules + logos locked globally' : 'Local content editable; brand locked'}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'partners' && (
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm max-w-2xl">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <Plus size={20} /> Add New Partner Nation
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Country Name</label>
                <input
                  type="text"
                  className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. South Korea"
                  value={newPartner.country}
                  onChange={(e) => setNewPartner({ ...newPartner, country: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Subdomain</label>
                <input
                  type="text"
                  className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="korea"
                  value={newPartner.subdomain}
                  onChange={(e) => setNewPartner({ ...newPartner, subdomain: e.target.value })}
                />
                <p className="text-xs text-slate-500 mt-1">Middleware will auto-route *.worso.org to the correct tenant.</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Theme Color</label>
                <select
                  className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newPartner.theme}
                  onChange={(e) => setNewPartner({ ...newPartner, theme: e.target.value })}
                >
                  <option value="blue">Worso Blue</option>
                  <option value="emerald">Emerald Green</option>
                  <option value="red">Crimson Red</option>
                </select>
              </div>
              <button onClick={handleCreatePartner} className="px-6 py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 w-full">
                Generate Micro-Site & Credentials
              </button>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm max-w-2xl">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Calendar size={20} /> Create Local Event
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Event Title</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="e.g. Dubai Zonal Qualifier"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  />
                </div>
                <button onClick={handleCreateEvent} className="px-6 py-3 bg-emerald-600 text-white font-bold rounded hover:bg-emerald-700 w-full">
                  Publish Event
                </button>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm max-w-2xl">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-purple-600">
                <Sparkles size={20} /> AI Press Generator
              </h3>
              <p className="text-sm text-slate-500 mb-4">Generate instant press releases for your local events using Gemini AI.</p>
              {sites.uae.local_events.map((evt) => (
                <div key={evt.id} className="flex justify-between items-center p-3 border border-slate-100 rounded-lg mb-2">
                  <div>
                    <div className="font-bold">{evt.title}</div>
                    <div className="text-xs text-slate-500">{evt.date}</div>
                  </div>
                  <button
                    onClick={() => generatePressRelease(evt)}
                    disabled={genLoading}
                    className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded font-bold hover:bg-purple-200"
                  >
                    {genLoading ? 'Generating...' : '✨ Generate'}
                  </button>
                </div>
              ))}
              {genResult && <div className="mt-4 p-4 bg-purple-50 rounded-lg text-sm border border-purple-100 italic">{genResult}</div>}
            </div>
            <div className="bg-white p-6 rounded-xl border border-amber-200 shadow-sm max-w-2xl">
              <div className="text-sm font-bold text-amber-700 mb-2">Field-Level Permissions</div>
              <p className="text-sm text-amber-700">Partner admins cannot edit logos or core rules. Only local content blocks (welcome message, galleries, registrations) are writable.</p>
            </div>
          </div>
        )}
        </div>
      </div>
        </div>
      </div>
    </div>
  );
};

export default AdminView;

