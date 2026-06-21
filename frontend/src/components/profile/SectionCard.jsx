const accentMap = {
  blue: {
    border: "before:bg-brand-500",
    iconBg: "bg-brand-50",
    iconText: "text-brand-600",
  },
  navy: {
    border: "before:bg-ink-700",
    iconBg: "bg-slate-100",
    iconText: "text-ink-700",
  },
  teal: {
    border: "before:bg-positive-500",
    iconBg: "bg-positive-50",
    iconText: "text-positive-600",
  },
  amber: {
    border: "before:bg-pending-500",
    iconBg: "bg-pending-50",
    iconText: "text-pending-600",
  },
  indigo: {
    border: "before:bg-brand-700",
    iconBg: "bg-brand-100",
    iconText: "text-brand-700",
  },
};

const SectionCard = ({ icon: Icon, title, subtitle, accent = "blue", action, children }) => {
  const a = accentMap[accent] || accentMap.blue;

  return (
    <div
      className={`relative before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:rounded-t-xl2 ${a.border} bg-white border border-slate-200 rounded-xl2 shadow-panel p-5 overflow-hidden`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={`h-9 w-9 rounded-lg ${a.iconBg} flex items-center justify-center shrink-0`}>
              <Icon size={17} className={a.iconText} />
            </div>
          )}
          <div>
            <h2 className="font-display font-semibold text-ink-900 text-sm">{title}</h2>
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
};

export default SectionCard;
