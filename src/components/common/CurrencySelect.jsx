import { useEffect, useMemo, useRef, useState } from "react";
import { PAYMENT_CURRENCY_OPTIONS, getCurrencyLabel } from "../../constants/paymentCurrencies";

export function CurrencySelect({
  value,
  onChange,
  disabled = false,
  className = "",
  inputClassName = "",
  listClassName = "",
  variant = "light", // "dark" for matching dark panels
  size = "md", // "sm" for compact UI
  placeholder = "Search currency…",
  ariaLabel = "Select currency",
}) {
  const isDark = String(variant).toLowerCase() === "dark";
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const options = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PAYMENT_CURRENCY_OPTIONS;
    return PAYMENT_CURRENCY_OPTIONS.filter((opt) => {
      const hay = `${opt.code} ${opt.label}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query]);

  useEffect(() => {
    function onDocMouseDown(e) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  useEffect(() => {
    // Keep the input readable when value changes externally (ex: after paymentData locks it).
    if (!open) setQuery("");
  }, [value, open]);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={`w-full border border-black ${isDark ? 'bg-slate-900' : 'bg-white'} rounded-lg ${
          size === "sm" ? "px-2 py-1.5 text-sm" : "px-3 py-2 text-sm"
        } ${isDark ? 'text-slate-200' : 'text-slate-900'} focus:outline-none focus:ring-2 ${
          isDark ? 'ring-sky-500' : 'ring-sky-500'
        } flex items-center justify-between gap-2 ${
          disabled ? "opacity-75 cursor-not-allowed" : ""
        } ${inputClassName}`}
        aria-label={ariaLabel}
        aria-expanded={open}
      >
        <span className="truncate">{getCurrencyLabel(value)}</span>
        <span className="text-slate-400">▾</span>
      </button>

      {open && !disabled && (
        <div
          className={`absolute z-50 mt-2 w-full border border-black ${isDark ? 'bg-slate-900' : 'bg-white'} rounded-lg shadow-lg overflow-hidden ${listClassName}`}
          role="listbox"
        >
          <div
            className={
              size === "sm"
                ? `p-1.5 ${isDark ? 'border-b border-slate-700' : 'border-b border-sky-100'}`
                : `p-2 ${isDark ? 'border-b border-slate-700' : 'border-b border-sky-100'}`
            }
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className={`w-full border border-black ${isDark ? 'bg-slate-900 text-slate-200' : 'bg-sky-50/70 text-slate-900'} rounded-md ${
                size === "sm" ? "px-2 py-1.5 text-sm" : "px-3 py-2 text-sm"
              } outline-none focus:ring-2 ring-sky-500`}
              autoFocus
            />
          </div>
          <div className="max-h-56 overflow-auto">
            {options.length === 0 ? (
              <div
                className={
                  size === "sm"
                    ? `px-2 py-1.5 text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`
                    : `px-3 py-2 text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`
                }
              >
                No matches
              </div>
            ) : (
              options.map((opt) => (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => {
                    onChange(opt.code);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={`w-full text-left ${
                    size === "sm" ? "px-2 py-1.5" : "px-3 py-2"
                  } text-sm ${
                    isDark ? 'hover:bg-slate-800' : 'hover:bg-sky-50'
                  } transition-colors ${
                    opt.code === value
                      ? isDark
                        ? 'bg-slate-800'
                        : 'bg-sky-50'
                      : ''
                  }`}
                  role="option"
                  aria-selected={opt.code === value}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`font-medium ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{opt.code}</span>
                    <span className={`truncate ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {opt.label.replace(`${opt.code} — `, "")}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

