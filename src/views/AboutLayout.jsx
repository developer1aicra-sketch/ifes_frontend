import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Cpu, Shield, Users, Globe2, Map, ClipboardList, Lock, Layers } from 'lucide-react';

const AboutLayout = ({ setView }) => {
  const [activeSection, setActiveSection] = useState('governance');
  void motion;

  const renderContent = () => {
    switch (activeSection) {
      case 'governance':
        return (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="text-blue-600" />
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Mission & Vision</h2>
                <p className="text-sm text-slate-500">The root authority for a federated sport.</p>
              </div>
            </div>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              WORSO is the global regulatory root for the sport of robotics—writing the laws of play, publishing safety protocols, and certifying every affiliated event. Federation over
              centralization keeps local context alive while the core stays immutable.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-blue-600">
                  <Shield size={16} /> Integrity
                </div>
                <p className="text-sm text-slate-600 mt-3">One rulebook, synchronized to every partner subdomain via middleware.</p>
              </div>
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-blue-600">
                  <Award size={16} /> Excellence
                </div>
                <p className="text-sm text-slate-600 mt-3">Tiered officiating, replay, and telemetry audits ready for global finals.</p>
              </div>
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-blue-600">
                  <Cpu size={16} /> Innovation
                </div>
                <p className="text-sm text-slate-600 mt-3">Open APIs for scoring, video review, CMS, and partner data sync.</p>
              </div>
            </div>
          </div>
        );
      case 'president':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">President's Message</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              "Federation beats centralization. By giving every nation its own subdomain, we scale safely while protecting the sport’s DNA." — Dr. Richard H. Vance, President.
            </p>
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="font-bold mb-2">Global Mandate</h4>
              <p className="text-sm text-slate-500">Codify rules, accredit partners, and run the World Cup calendar.</p>
            </div>
          </div>
        );
      case 'advisory':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Advisory Board</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {['Safety & Compliance', 'Technology & AI', 'Fan Experience', 'Commercial'].map((track) => (
                <div key={track} className="p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
                  <h4 className="font-bold text-lg text-slate-900">{track}</h4>
                  <p className="text-sm text-slate-500">Subject-matter leaders who ratify updates before they propagate to partner portals.</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'affiliation':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Affiliation Process</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              Apply for a partner subdomain (e.g., uae.worso.org). On approval, you receive admin credentials, middleware keys, and field-level CMS permissions.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <Globe2 size={18} className="text-blue-600" /> Steps
                </div>
                {['Submit federation charter', 'Security & safety audit', 'Assign subdomain + theme', 'Go-live with local content JSON'].map((step, i) => (
                  <div key={step} className="flex items-center gap-3">
                    <span className="text-sm font-bold text-blue-600">{i + 1}</span>
                    <span className="text-sm text-slate-600">{step}</span>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-blue-50 rounded-xl border border-blue-100 space-y-2">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <ClipboardList size={18} className="text-blue-600" /> What Partners Control
                </div>
                <ul className="text-sm text-slate-700 list-disc list-inside space-y-1">
                  <li>Local welcome message & language</li>
                  <li>Local event gallery and news</li>
                  <li>Team registrations & ticketing data</li>
                </ul>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-700 mt-3">
                  <Lock size={14} /> Global brand, logo, and rulebook stay locked.
                </div>
              </div>
            </div>
          </div>
        );
      case 'working':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Working at WORSO</h2>
            <p className="text-slate-600 mb-6">Join a team of visionaries, engineers, and sports management professionals.</p>
            <button onClick={() => setView('careers')} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">
              View Openings
            </button>
          </div>
        );
      case 'data':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Data Layer: Teams & Rankings</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">World ranks, prize pools, rosters, and Technoxian history stay centralized and are surfaced to every micro-site.</p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Global Rank</div>
                <div className="text-2xl font-extrabold text-blue-600">#1 - #5000</div>
                <p className="text-sm text-slate-600 mt-2">Unified ladder feeds partner directories.</p>
              </div>
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Prize Money</div>
                <div className="text-2xl font-extrabold text-slate-900">$250k+ pool</div>
                <p className="text-sm text-slate-600 mt-2">Transparent payouts with audit-ready logs.</p>
              </div>
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Roster Cards</div>
                <div className="text-2xl font-extrabold text-emerald-600">Field-level lock</div>
                <p className="text-sm text-slate-600 mt-2">Players sync from HQ; partners can localize bios.</p>
              </div>
            </div>
          </div>
        );
      case 'partners':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Partner Network</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">Subdomains route through middleware: `*.worso.org` resolves tenant, injects theme, and serves local content.</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-6 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-600 mb-2">
                  <Map size={16} /> Directory
                </div>
                <p className="text-sm text-slate-600">Map + list of partners with status badges (live, onboarding, prospect).</p>
                <p className="text-xs text-slate-500 mt-2">Example: uae.worso.org, india.worso.org, korea.worso.org.</p>
              </div>
              <div className="p-6 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-600 mb-2">
                  <Layers size={16} /> Micro-Site Shell
                </div>
                <p className="text-sm text-slate-600">One React codebase, multi-tenant middleware, JSON-driven assets (logo, hero, translations, sponsors).</p>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Select a section</div>;
    }
  };

  return (
    <div className="animate-fadeIn bg-gradient-to-b from-slate-50 via-white to-slate-50 min-h-screen">
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-[56px] z-30">
        <div className="container mx-auto px-4 flex gap-8 overflow-x-auto">
          {[
            { id: 'governance', label: 'Mission & Vision' },
            { id: 'president', label: "President's Message" },
            { id: 'advisory', label: 'Advisory Board' },
            { id: 'affiliation', label: 'Affiliation' },
            { id: 'working', label: 'Working at WORSO' },
            { id: 'data', label: 'Data Layer' },
            { id: 'partners', label: 'Partner Network' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${
                activeSection === item.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="container mx-auto px-4 py-10">
        <div className="bg-[#0f172a] rounded-3xl text-white p-12 md:p-14 shadow-2xl relative overflow-hidden">
          <div className="text-yellow-400 font-bold tracking-widest text-xs uppercase mb-4">Root Governance</div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">Governance</h1>
          <p className="text-slate-200 text-lg max-w-3xl mb-6">
            Mission, mandate, affiliation, data, and the federated partner network that powers the sport of robotics.
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="bg-white/10 px-4 py-3 rounded-xl border border-white/10">
              <div className="text-xs font-bold uppercase text-slate-200">Mode</div>
              <div className="text-lg font-extrabold text-white">Federated</div>
            </div>
            <div className="bg-white/10 px-4 py-3 rounded-xl border border-white/10">
              <div className="text-xs font-bold uppercase text-slate-200">Rulebook</div>
              <div className="text-lg font-extrabold text-emerald-200">v2.0</div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 min-h-[600px] transition-all duration-300">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AboutLayout;

