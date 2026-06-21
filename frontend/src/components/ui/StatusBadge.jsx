import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export const StatusBadge = ({ value, styles, dotStyles, options, onChange, disabled }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={`focus-ring inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${styles[value]}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${dotStyles[value]}`} />
        {value}
        {!disabled && <ChevronDown size={12} className="opacity-60" />}
      </button>

      {open && !disabled && (
        <div className="absolute z-20 top-full left-0 mt-1.5 w-40 bg-white border border-slate-200 rounded-xl shadow-popover py-1.5 animate-in fade-in zoom-in-95 duration-100">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left hover:bg-slate-50 transition-colors ${
                opt === value ? "font-semibold text-ink-900" : "text-slate-600"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${dotStyles[opt]}`} />
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
