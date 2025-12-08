import { Clock, MapPin } from 'lucide-react';
import { CAREERS } from '../constants/data';

const CareersView = () => (
  <div className="animate-fadeIn pt-24 pb-20 bg-white min-h-screen">
    <div className="container mx-auto px-4 max-w-4xl">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Careers at WORSO</h1>
      <p className="text-slate-500 mb-12">Join us in shaping the future of competitive robotics.</p>
      <div className="space-y-4">
        {CAREERS.map((job) => (
          <div
            key={job.id}
            className="border border-slate-200 p-6 rounded-xl flex justify-between items-center hover:border-blue-500 transition-colors cursor-pointer group"
          >
            <div>
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600">{job.title}</h3>
              <div className="flex gap-4 text-sm text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} /> {job.type}
                </span>
              </div>
            </div>
            <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold">Apply Now</button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default CareersView;

