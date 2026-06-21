import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { Input } from "../ui/FormFields";

const CityModal = ({ open, onClose, onSubmit, editingCity }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setName(editingCity?.name || "");
      setError("");
    }
  }, [open, editingCity]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("City name is required.");
      return;
    }
    setLoading(true);
    try {
      await onSubmit(name.trim());
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={editingCity ? "Rename city" : "Add a new city"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-negative-50 border border-negative-200 text-negative-700 text-sm rounded-lg px-3.5 py-2.5">
            {error}
          </div>
        )}
        <Input
          label="City name"
          placeholder="e.g. Noida"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {editingCity ? "Save changes" : "Add city"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CityModal;
