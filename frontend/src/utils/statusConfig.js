export const RESPONSE_OPTIONS = ["Pending", "Positive", "Negative"];
export const PROCESS_OPTIONS = ["Not Started", "Ongoing", "Selected", "Rejected"];
export const TYPE_OPTIONS = ["Walk-in", "Online", "Referral", "Linkedin", "Other"];

export const responseStyles = {
  Positive: "bg-positive-50 text-positive-700 border-positive-200",
  Negative: "bg-negative-50 text-negative-700 border-negative-200",
  Pending: "bg-pending-50 text-pending-600 border-pending-200",
};

export const processStyles = {
  "Not Started": "bg-slate-100 text-slate-600 border-slate-200",
  Ongoing: "bg-brand-50 text-brand-700 border-brand-200",
  Selected: "bg-positive-50 text-positive-700 border-positive-200",
  Rejected: "bg-negative-50 text-negative-700 border-negative-200",
};

export const responseDot = {
  Positive: "bg-positive-500",
  Negative: "bg-negative-500",
  Pending: "bg-pending-400",
};

export const processDot = {
  "Not Started": "bg-slate-400",
  Ongoing: "bg-brand-500",
  Selected: "bg-positive-500",
  Rejected: "bg-negative-500",
};
