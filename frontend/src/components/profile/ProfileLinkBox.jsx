import { ExternalLink } from "lucide-react";

const colorMap = {
  brand: { bg: "bg-brand-50", text: "text-brand-600", border: "hover:border-brand-300" },
  ink: { bg: "bg-slate-100", text: "text-ink-700", border: "hover:border-slate-400" },
  positive: { bg: "bg-positive-50", text: "text-positive-600", border: "hover:border-positive-300" },
  pending: { bg: "bg-pending-50", text: "text-pending-600", border: "hover:border-pending-300" },
};

const ProfileLinkBox = ({ icon: Icon, label, url, color = "brand" }) => {
  const c = colorMap[color] || colorMap.brand;
  const hasUrl = !!url;

  const content = (
    <div
      className={`flex items-center gap-3 border border-slate-200 rounded-xl p-4 bg-white transition-colors ${
        hasUrl ? `${c.border} cursor-pointer` : "opacity-50"
      }`}
    >
      <div className={`h-10 w-10 rounded-lg ${c.bg} flex items-center justify-center shrink-0`}>
        <Icon size={18} className={c.text} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink-900">{label}</p>
        <p className="text-xs text-slate-400 truncate">
          {hasUrl ? url.replace(/^https?:\/\//, "") : "Not added yet"}
        </p>
      </div>
      {hasUrl && <ExternalLink size={14} className="text-slate-300 shrink-0" />}
    </div>
  );

  if (!hasUrl) return content;

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block focus-ring rounded-xl">
      {content}
    </a>
  );
};

export default ProfileLinkBox;
