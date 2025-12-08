import { Award, Download } from 'lucide-react';

const MemberDashboard = () => (
  <div className="animate-fadeIn pt-24 pb-20 bg-slate-50 min-h-screen">
    <div className="container mx-auto px-4">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">JD</div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome, John Doe</h1>
          <div className="text-slate-500">Team: RoboTitans India | ID: W-IND-001</div>
        </div>
      </div>

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
    </div>
  </div>
);

export default MemberDashboard;

