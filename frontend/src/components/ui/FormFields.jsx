export const Input = ({ label, error, className = "", ...props }) => (
  <label className="block">
    {label && (
      <span className="block text-sm font-medium text-ink-800 mb-1.5">{label}</span>
    )}
    <input
      className={`focus-ring w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-slate-400 transition-colors ${
        error ? "border-negative-300" : "border-slate-200 hover:border-slate-300"
      } ${className}`}
      {...props}
    />
    {error && <span className="block text-xs text-negative-600 mt-1">{error}</span>}
  </label>
);

export const Textarea = ({ label, error, className = "", ...props }) => (
  <label className="block">
    {label && (
      <span className="block text-sm font-medium text-ink-800 mb-1.5">{label}</span>
    )}
    <textarea
      className={`focus-ring w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-slate-400 transition-colors resize-none ${
        error ? "border-negative-300" : "border-slate-200 hover:border-slate-300"
      } ${className}`}
      {...props}
    />
    {error && <span className="block text-xs text-negative-600 mt-1">{error}</span>}
  </label>
);

export const Select = ({ label, error, className = "", children, ...props }) => (
  <label className="block">
    {label && (
      <span className="block text-sm font-medium text-ink-800 mb-1.5">{label}</span>
    )}
    <select
      className={`focus-ring w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-ink-900 transition-colors cursor-pointer ${
        error ? "border-negative-300" : "border-slate-200 hover:border-slate-300"
      } ${className}`}
      {...props}
    >
      {children}
    </select>
  </label>
);
