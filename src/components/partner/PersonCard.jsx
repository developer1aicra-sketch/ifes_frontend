import React from 'react';

/**
 * Reusable PersonCard for Executive Members and Referees.
 * Frontend architecture: unified display of name, designation, and image.
 *
 * @param {object} props
 * @param {string} props.name - Person's full name
 * @param {string} props.designation - Role/title (e.g. "President", "Referee · Drone Rescue")
 * @param {string} [props.image] - Image URL or imported asset; if omitted, uses avatar placeholder
 * @param {string} [props.id] - Optional key for list rendering
 * @param {string} [props.subtitle] - Optional extra line (e.g. expertise/game)
 * @param {string} [props.className] - Optional wrapper class
 */
const PersonCard = ({ name, designation, image, id, subtitle, className = '' }) => {
  const imageSrc = image || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || '')}&background=0f172a&color=fff&size=256`;
  const fallbackSvg = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2MxYzVjYiIgc3Ryb2tlLXdpZHRoPSIxLjUiPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTE1Ljc1IDZhLjc1Ljc1IDAgMTEtMS41IDAgLjc1Ljc1IDAgMDExLjUgMHpNNC41IDguNWE2LjM3NiA2LjM3NiAwIDAxMS41LS4xNzdjLjg2MiAwIDEuNjg5LjEyNCAyLjQ1Ny4zNWEuNS41IDAgMTEtLjI4Ni45NjMgNC44NzggNC44NzggMCAwMC0yLjk5LS4xMDhBLiUuNSAwIDAxNC41IDguNXpNOCAyNGE4LjAwMSA4LjAwMSAwIDAwOC04YzAtMS4xNjgtLjI0NS0yLjI3Ni0uNjg0LTMuTC4yODJhLjUwMS41MDEgMCAwMS42Ni0uNjYxYy42MjguMjQyIDEuMjk2LjM5MyAyLjAyNC40M0ExNC42NiAxNC42NiAwIDAwMjIuNSAxNGMwIDguMDA4LTYuMjY4IDExLjc1LTExLjM2OCA5LjcyOWEuNDc4LjQ3OCAwIDAwLS4yNjQgMEM1Ljc2OCAyNS43NSAyLjUgMjIuMDA4IDIuNSAxNGMwLTQuMTQyIDEuNjY1LTcuOTExIDQuNDM5LTEwLjU2MWEuNS41IDAgMDEuNzA4LjcwNUM1LjlEOSA2Ljk3OSAzLjUgMTAuMzc2IDMuNSAxNGMwIDcuNTIxIDMuNDc1IDEwLjYyNSA4LjQzIDExLjgxOUE2LjQ1IDYuNDUgMCAwMTggMjR6Ii8+PC9zdmc+';
  return (
    <div
      className={`group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 p-8 flex flex-col items-center text-center hover:border-blue-200 ${className}`}
      data-person-id={id}
    >
      <div className="relative w-40 h-40 mb-6">
        <div className="absolute inset-0 rounded-lg overflow-hidden border-4 border-white shadow-lg group-hover:border-blue-100 transition-colors duration-300">
          <img
            src={imageSrc}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = fallbackSvg;
            }}
          />
        </div>
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
          {name}
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          {designation}
        </p>
        {subtitle && (
          <div className="mt-4 inline-block bg-slate-100 px-4 py-2 rounded-full text-sm text-slate-700 font-medium">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonCard;
