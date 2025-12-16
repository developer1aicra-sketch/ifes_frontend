import { useState } from "react";
import { ChevronDown, ArrowLeft, ArrowRight, Check, X } from "lucide-react";

const CompareMembershipView = ({ setView }) => {
  const [openRows, setOpenRows] = useState({});
  const [hoveredRow, setHoveredRow] = useState(null);

  const plans = [
    { id: "institute", label: "Institute" },
    { id: "professional", label: "Professional" },
    { id: "corporate", label: "Corporate" },
  ];

  const rows = [
    {
      title: "Official Membership Recognition",
      desc: "Formal recognition by WORSO with official badges, listings, and credibility across global platforms.",
      values: [true, true, true],
    },
    {
      title: "Global Directory Listing",
      desc: "Visibility on WORSO’s official global directories accessed by institutions, students, partners, and governments.",
      values: [true, true, true],
    },
    {
      title: "Robotics, STEM & AI Lab Support",
      desc: "Support for robotics labs, STEM labs, AI innovation centers, and RoboClubs.",
      values: [true, false, true],
    },
    {
      title: "Training, Mentorship & Coaching Roles",
      desc: "Opportunities to mentor, judge, coach competitions, and lead innovation programs.",
      values: [false, true, false],
    },
    {
      title: "CSR & Outreach Programs",
      desc: "Participation in CSR initiatives, STEM outreach, and underprivileged student programs.",
      values: [true, true, true],
    },
    {
      title: "Hosting & Partnership Rights",
      desc: "Rights to host leagues, competitions, innovation labs, and regional programs.",
      values: [true, false, true],
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen animate-fadeIn">
      <div className="container mx-auto px-6 max-w-7xl py-20">

        {/* Header */}
        <div className="mb-16 text-center relative">
          <button
            onClick={() => setView("home")}
            className="absolute left-0 top-1 flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
            WORSO Membership
          </span>
          <h1 className="text-5xl font-extrabold text-slate-900 mt-4">
            Compare All Membership Plans
          </h1>
          <p className="text-lg text-slate-600 mt-6 max-w-3xl mx-auto">
            Explore a detailed, feature-by-feature comparison to choose the right membership.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-3xl bg-white border shadow-sm">
          <table className="w-full border-collapse">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-6 text-left text-sm font-bold text-slate-700">
                  Feature
                </th>

                {plans.map(plan => (
                  <th key={plan.id} className="p-6 text-center">
                    <div className="font-bold mb-4">{plan.label}</div>
                    <button
                      onClick={() => setView(`enroll-${plan.id}`)}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-xl
                        bg-blue-600 text-white text-sm font-bold
                        hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5
                        transition-all"
                    >
                      Enroll Now
                      <ArrowRight size={14} />
                    </button>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y">
              {rows.map((row, i) => {
                const isOpen = !!openRows[i];
                const isHovered = hoveredRow === i;

                return (
                  <tr
                    key={i}
                    onMouseEnter={() => setHoveredRow(i)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    {/* Feature column */}
                    <td className="p-6 align-top">
                      <button
                        onClick={() =>
                          setOpenRows(prev => ({ ...prev, [i]: !prev[i] }))
                        }
                        className="flex items-start gap-2 text-left w-full group"
                      >
                        <ChevronDown
                          size={16}
                          className={`mt-1 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                        <span className="font-medium text-slate-800 group-hover:text-blue-600 transition-colors">
                          {row.title}
                        </span>
                      </button>

                      {(isHovered || isOpen) && (
                        <div className="mt-3">
                          <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-200 shadow-sm max-w-xl">
                            {row.desc}
                          </p>
                          {isHovered && !isOpen && (
                            <div className="text-xs text-slate-500 mt-2 italic">
                              Click to keep open
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Values */}
                    {row.values.map((v, idx) => (
                      <td key={idx} className="p-6 text-center">
                        {v === true && (
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700">
                            <Check size={16} />
                          </span>
                        )}
                        {v === false && (
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600">
                            <X size={16} />
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompareMembershipView;
