import { useState } from 'react';
import { Award, Cpu, Heart, Shield } from 'lucide-react';

const AboutLayout = ({ setView }) => {
  const [activeSection, setActiveSection] = useState('vision');

  const Content = () => {
    switch (activeSection) {
      case 'vision':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Vision & Values</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              To create a unified regulatory framework for autonomous sports. We value Integrity, Innovation, and Inclusivity.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                <Shield className="text-blue-600 mb-2" />
                <h4 className="font-bold">Integrity</h4>
              </div>
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                <Award className="text-blue-600 mb-2" />
                <h4 className="font-bold">Excellence</h4>
              </div>
            </div>
          </div>
        );
      case 'structure':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Leadership Structure</h2>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex gap-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                <div>
                  <h4 className="font-bold text-lg">Dr. Richard H. Vance</h4>
                  <div className="text-blue-600 font-bold text-sm">PRESIDENT</div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h4 className="font-bold">Executive Committee</h4>
                  <p className="text-sm text-slate-500">Daily Operations</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h4 className="font-bold">Advisory Board</h4>
                  <p className="text-sm text-slate-500">Strategic Guidance</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'strategy':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Strategic Roadmap</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              Our 5-year plan focuses on expanding the Technoxian footprint to 150 nations, standardizing robotic kits for accessibility, and launching the professional "Pro-League".
            </p>
            <div className="p-6 bg-slate-50 rounded-xl border-l-4 border-blue-600">
              <h4 className="font-bold mb-2">2026 Goal</h4>
              <p className="text-sm text-slate-500">Launch the first inter-continental autonomous drone racing league.</p>
            </div>
          </div>
        );
      case 'tech':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Tech for Good</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              We believe competition drives innovation that solves real-world problems. Our "Innovation Challenge" category has produced patents for agricultural drones and disaster relief bots.
            </p>
            <div className="mt-6 flex gap-4">
              <Cpu size={32} className="text-emerald-600" />
              <Heart size={32} className="text-red-600" />
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
      case 'referees':
        return (
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Referees Board</h2>
            <p className="text-slate-600 mb-6">The Referees Board ensures fair play and technical compliance across all global events.</p>
            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-bold">Certification Program</h4>
              <p className="text-sm text-slate-500">Apply to become an accredited WORSO official.</p>
            </div>
          </div>
        );
      default:
        return <div>Select a section</div>;
    }
  };

  return (
    <div className="animate-fadeIn pt-20 bg-slate-50 min-h-screen">
      <div className="bg-[#0f172a] text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-extrabold">About WORSO</h1>
          <p className="text-slate-400 mt-2">The governing body for the sport of robotics.</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12 grid md:grid-cols-12 gap-12">
        <div className="md:col-span-3">
          <div className="sticky top-24 space-y-1">
            {['Vision & Values', 'Structure', 'Strategy', 'Tech for Good', 'Working at WORSO', 'Referees'].map((item) => {
              const id = item.split(' ')[0].toLowerCase();
              return (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${
                    activeSection === id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
        <div className="md:col-span-9 bg-white p-12 rounded-2xl border border-slate-200 shadow-sm min-h-[500px]">
          <Content />
        </div>
      </div>
    </div>
  );
};

export default AboutLayout;

