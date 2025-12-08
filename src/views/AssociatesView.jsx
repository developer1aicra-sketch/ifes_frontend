import { Award, ArrowRight, Gamepad2 } from 'lucide-react';

const AssociatesView = () => (
  <div className="animate-fadeIn pt-24 pb-20 bg-white min-h-screen">
    <div className="container mx-auto px-4 max-w-5xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Associates & Partners</h1>
        <p className="text-xl text-slate-500">Building the global ecosystem for robotics and esports.</p>
      </div>

      <div className="bg-slate-50 rounded-3xl p-12 border border-slate-200 mb-12 flex flex-col md:flex-row gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm h-fit">
          <Award size={48} className="text-blue-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Sports Associations/Federations</h2>
          <p className="text-slate-600 text-lg leading-relaxed mb-8">
            Sports associations promoting competitive gaming, fairness, and growth can apply to join WORSO for global recognition.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-blue-700 transition-all">
              Join WORSO
            </button>
            <button className="bg-white border border-slate-200 text-slate-700 px-8 py-3 rounded-lg font-bold hover:bg-slate-100 transition-all flex items-center gap-2">
              List of Associations <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#0f172a] rounded-3xl p-12 text-white flex flex-col md:flex-row gap-8">
        <div className="bg-white/10 p-6 rounded-2xl h-fit border border-white/10">
          <Gamepad2 size={48} className="text-purple-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white mb-2">National Esports Partner</h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-8">
            NEP plays a key role in fostering and organizing Esports in respective countries in collaboration with WORSO and Gaming Associations.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-purple-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-purple-700 transition-all">
              Apply for NEP
            </button>
            <button className="bg-transparent border border-white/20 text-white px-8 py-3 rounded-lg font-bold hover:bg-white/10 transition-all flex items-center gap-2">
              List of NEP <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AssociatesView;

