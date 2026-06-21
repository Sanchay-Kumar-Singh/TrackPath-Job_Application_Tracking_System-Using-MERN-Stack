import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { Textarea } from "../ui/FormFields";

const DetailModal = ({ open, onClose, onSubmit, company }) => {
  const [detail, setDetail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) setDetail(company?.detail || "");
  }, [open, company]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(detail);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={company?.companyName || "Details"} maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          label="Process notes"
          placeholder="Round 1: Technical interview on 14 Jul, cleared. Round 2: HR scheduled for 18 Jul..."
          rows={8}
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          autoFocus
        />
        <div className="flex justify-end gap-2 pt-1">
          <Button variant="secondary" type="button" onClick={onClose}>
            Close
          </Button>
          <Button type="submit" loading={loading}>
            Save notes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default DetailModal;
