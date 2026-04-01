import React from 'react';

/**
 * Shared full-page layout for RoboClub auth screens (login, password recovery).
 */
export function RoboClubAuthPage({ Icon, title, description, children }) {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-600/20">
              {Icon ? <Icon className="h-8 w-8 text-blue-400" aria-hidden /> : null}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
          {description ? (
            <p className="text-gray-400">{description}</p>
          ) : null}
        </div>
        <div className="bg-[#0f0f0f] rounded-lg shadow-lg p-8 border border-gray-800">
          {children}
        </div>
      </div>
    </div>
  );
}

export function RoboClubAuthPrimaryButton({
  type = 'submit',
  loading,
  disabled,
  children,
  loadingLabel = 'Please wait…',
  className = '',
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 ${className}`}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {loadingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}
