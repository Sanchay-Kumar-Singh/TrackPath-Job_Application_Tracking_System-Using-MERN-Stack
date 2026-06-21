import { useRef, useState } from "react";
import { Upload, Download, Trash2, FileText, Loader2 } from "lucide-react";
import { getFileUrl } from "../../utils/fileUrl";

const ResumeViewer = ({ resumeFile, resumeFileName, onUpload, onDelete }) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please select a PDF file.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Resume must be under 8MB.");
      return;
    }

    setError("");
    setUploading(true);
    try {
      await onUpload(file);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete();
    } finally {
      setDeleting(false);
    }
  };

  const fileUrl = resumeFile ? getFileUrl(resumeFile) : "";

  return (
    <div className="bg-white border border-slate-200 rounded-xl2 shadow-panel overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-brand-50 flex items-center justify-center">
            <FileText size={16} className="text-brand-600" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-ink-900 text-sm">Resume</h2>
            {resumeFileName && <p className="text-xs text-slate-400">{resumeFileName}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {resumeFile && (
            <>
              <a
                href={fileUrl}
                download={resumeFileName || "resume.pdf"}
                className="focus-ring inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors"
              >
                <Download size={13} />
                Download
              </a>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="focus-ring inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-negative-200 text-negative-600 hover:bg-negative-50 transition-colors disabled:opacity-50"
              >
                {deleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                Remove
              </button>
            </>
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="focus-ring inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
            {resumeFile ? "Replace" : "Upload PDF"}
          </button>
        </div>
      </div>

      {error && (
        <div className="px-5 py-2.5 bg-negative-50 border-b border-negative-100 text-xs text-negative-700">
          {error}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileSelect}
        className="hidden"
      />

      {resumeFile ? (
        <div className="relative">
          <object
            key={fileUrl}
            data={`${fileUrl}#toolbar=1&view=FitH`}
            type="application/pdf"
            className="w-full block"
            style={{ height: "1400px" }}
          >
            {/* Fallback shown if the browser can't render the <object> (e.g. some mobile browsers) */}
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <FileText size={28} className="text-slate-300 mb-3" />
              <p className="text-sm text-slate-600 font-medium">
                Your browser can't preview this PDF inline.
              </p>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700"
              >
                Open resume in a new tab →
              </a>
            </div>
          </object>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="h-12 w-12 rounded-xl bg-brand-50 flex items-center justify-center mb-3">
            <FileText size={20} className="text-brand-600" />
          </div>
          <p className="text-sm font-medium text-ink-800">No resume uploaded yet</p>
          <p className="text-sm text-slate-500 mt-1 max-w-xs">
            Upload your resume as a PDF — it will display here in full and be available for download.
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="focus-ring mt-5 inline-flex items-center gap-2 bg-brand-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-brand-700 transition-colors shadow-sm shadow-brand-600/20 disabled:opacity-60"
          >
            {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
            Upload resume PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default ResumeViewer;
