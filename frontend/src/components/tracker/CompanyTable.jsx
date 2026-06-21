import { useState } from "react";
import { Plus, Pencil, Trash2, FileText, Briefcase, CheckCheck } from "lucide-react";
import { StatusBadge } from "../ui/StatusBadge";
import {
  RESPONSE_OPTIONS,
  PROCESS_OPTIONS,
  responseStyles,
  processStyles,
  responseDot,
  processDot,
} from "../../utils/statusConfig";

const typeBadgeStyles = {
  "Walk-in": "bg-brand-50 text-brand-700",
  Online: "bg-slate-100 text-slate-600",
  Referral: "bg-pending-50 text-pending-600",
  Consultancy: "bg-positive-50 text-positive-700",
  Other: "bg-slate-100 text-slate-600",
};

const CompanyTable = ({
  companies,
  onAddCompany,
  onUpdateCompany,
  onEditCompany,
  onDeleteCompany,
  onViewDetail,
}) => {
  const [togglingId, setTogglingId] = useState(null);

  const handleAppliedToggle = async (company) => {
    setTogglingId(company._id);
    await onUpdateCompany(company._id, { applied: !company.applied });
    setTogglingId(null);
  };

  if (companies.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl2 shadow-panel">
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="h-12 w-12 rounded-xl bg-brand-50 flex items-center justify-center mb-3">
            <Briefcase size={20} className="text-brand-600" />
          </div>
          <p className="text-sm font-medium text-ink-800">No companies added in this sector yet</p>
          <p className="text-sm text-slate-500 mt-1 max-w-xs">
            Start logging the companies you're approaching here.
          </p>
          <button
            onClick={onAddCompany}
            className="focus-ring mt-5 inline-flex items-center gap-2 bg-brand-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-brand-700 transition-colors shadow-sm shadow-brand-600/20"
          >
            <Plus size={15} />
            Add company
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl2 shadow-panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left font-medium text-slate-500 px-4 py-3 w-12">S.N.</th>
              <th className="text-left font-medium text-slate-500 px-4 py-3 min-w-[180px]">
                Company Name
              </th>
              <th className="text-left font-medium text-slate-500 px-4 py-3 w-32">Type</th>
              <th className="text-left font-medium text-slate-500 px-4 py-3 w-28">Applied</th>
              <th className="text-left font-medium text-slate-500 px-4 py-3 w-36">Response</th>
              <th className="text-left font-medium text-slate-500 px-4 py-3 w-40">Process</th>
              <th className="text-left font-medium text-slate-500 px-4 py-3 w-24">Detail</th>
              <th className="text-right font-medium text-slate-500 px-4 py-3 w-20">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {companies.map((company, idx) => (
              <tr key={company._id} className="hover:bg-slate-50/60 transition-colors group">
                <td className="px-4 py-3 text-slate-400 align-middle">{idx + 1}</td>
                <td className="px-4 py-3 align-middle">
                  <span className="font-medium text-ink-900">{company.companyName}</span>
                </td>
                <td className="px-4 py-3 align-middle">
                  <span
                    className={`inline-flex text-xs font-medium px-2 py-1 rounded-full ${typeBadgeStyles[company.type]}`}
                  >
                    {company.type}
                  </span>
                </td>
                <td className="px-4 py-3 align-middle">
                  <button
                    onClick={() => handleAppliedToggle(company)}
                    disabled={togglingId === company._id}
                    className={`focus-ring inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60 ${
                      company.applied
                        ? "bg-positive-600 text-white hover:bg-positive-700"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    {company.applied && <CheckCheck size={13} />}
                    {company.applied ? "Applied" : "Not yet"}
                  </button>
                </td>
                <td className="px-4 py-3 align-middle">
                  <StatusBadge
                    value={company.response}
                    styles={responseStyles}
                    dotStyles={responseDot}
                    options={RESPONSE_OPTIONS}
                    onChange={(val) => onUpdateCompany(company._id, { response: val })}
                  />
                </td>
                <td className="px-4 py-3 align-middle">
                  <StatusBadge
                    value={company.process}
                    styles={processStyles}
                    dotStyles={processDot}
                    options={PROCESS_OPTIONS}
                    onChange={(val) => onUpdateCompany(company._id, { process: val })}
                  />
                </td>
                <td className="px-4 py-3 align-middle">
                  <button
                    onClick={() => onViewDetail(company)}
                    className={`focus-ring inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors ${
                      company.detail
                        ? "bg-brand-50 text-brand-700 hover:bg-brand-100"
                        : "text-slate-400 hover:bg-slate-100"
                    }`}
                  >
                    <FileText size={13} />
                    {company.detail ? "View" : "Add"}
                  </button>
                </td>
                <td className="px-4 py-3 align-middle">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEditCompany(company)}
                      className="focus-ring h-7 w-7 rounded-md flex items-center justify-center text-slate-400 hover:text-brand-600 hover:bg-brand-50"
                      title="Edit"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => onDeleteCompany(company)}
                      className="focus-ring h-7 w-7 rounded-md flex items-center justify-center text-slate-400 hover:text-negative-600 hover:bg-negative-50"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 border-t border-slate-100">
        <button
          onClick={onAddCompany}
          className="focus-ring inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700 px-2 py-1.5 rounded-lg hover:bg-brand-50 transition-colors"
        >
          <Plus size={15} />
          Add company
        </button>
      </div>
    </div>
  );
};

export default CompanyTable;
