import React from 'react';
import { useSelector } from 'react-redux';
import { selectIsGlobalLoading } from '../app/ui/uiSlice';

export default function GlobalLoadingOverlay() {
  const isGlobalLoading = useSelector(selectIsGlobalLoading);
  if (!isGlobalLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
      <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900/80 px-5 py-4 shadow-xl">
        <div
          className="h-5 w-5 rounded-full border-2 border-slate-300/30 border-t-slate-200 animate-spin"
          aria-hidden="true"
        />
        <div className="text-sm font-medium text-slate-100">Loading…</div>
      </div>
    </div>
  );
}

