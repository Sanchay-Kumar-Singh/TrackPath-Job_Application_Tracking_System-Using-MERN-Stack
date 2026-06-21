import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { Input, Select, Textarea } from "../ui/FormFields";
import { TYPE_OPTIONS, RESPONSE_OPTIONS, PROCESS_OPTIONS } from "../../utils/statusConfig";

const emptyForm = {
  companyName: "",
  type: "Walk-in",
  applied: false,
  response: "Pending",
  process: "Not Started",
  detail: "",
};

const CompanyModal = ({ open, onClose, onSubmit, editingCompany }) => {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm(
        editingCompany
          ? {
              companyName: editingCompany.companyName,
              type: editingCompany.type,
              applied: editingCompany.applied,
              response: editingCompany.response,
              process: editingCompany.process,
              detail: editingCompany.detail || "",
            }
          : emptyForm
      );
      setError("");
    }
  }, [open, editingCompany]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.companyName.trim()) {
      setError("Company name is required.");
      return;
    }
    setLoading(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editingCompany ? "Edit company" : "Add company"}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-negative-50 border border-negative-200 text-negative-700 text-sm rounded-lg px-3.5 py-2.5">
            {error}
          </div>
        )}

        <Input
          label="Company name"
          name="companyName"
          placeholder="e.g. Tech Mahindra"
          value={form.companyName}
          onChange={handleChange}
          autoFocus
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select label="Type" name="type" value={form.type} onChange={handleChange}>
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </Select>

          <label className="block">
            <span className="block text-sm font-medium text-ink-800 mb-1.5">Applied</span>
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, applied: !p.applied }))}
              className={`focus-ring w-full rounded-lg border px-3.5 py-2.5 text-sm font-medium transition-colors ${
                form.applied
                  ? "bg-positive-600 border-positive-600 text-white hover:bg-positive-700"
                  : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
              }`}
            >
              {form.applied ? "Yes, applied" : "Not applied yet"}
            </button>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select label="Response" name="response" value={form.response} onChange={handleChange}>
            {RESPONSE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </Select>

          <Select label="Process" name="process" value={form.process} onChange={handleChange}>
            {PROCESS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </Select>
        </div>

        <Textarea
          label="Detail / notes"
          name="detail"
          placeholder="Interview rounds, recruiter contact, next steps, salary discussed, etc."
          rows={4}
          value={form.detail}
          onChange={handleChange}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {editingCompany ? "Save changes" : "Add company"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CompanyModal;
