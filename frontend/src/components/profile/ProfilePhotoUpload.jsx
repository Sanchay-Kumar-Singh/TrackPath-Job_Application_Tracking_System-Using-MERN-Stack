import { useRef, useState } from "react";
import { Camera, Loader2, User } from "lucide-react";
import { getFileUrl } from "../../utils/fileUrl";

const ProfilePhotoUpload = ({ photoPath, onUpload, name }) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.type)) {
      setError("Please select a JPG, PNG or WEBP image.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Photo must be under 8MB.");
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

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="focus-ring relative h-28 w-28 rounded-2xl overflow-hidden group shrink-0 disabled:cursor-wait"
      >
        {photoPath ? (
          <img src={getFileUrl(photoPath)} alt={name || "Profile photo"} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
            {initials ? (
              <span className="text-3xl font-display font-semibold text-white">{initials}</span>
            ) : (
              <User size={36} className="text-white/80" />
            )}
          </div>
        )}

        <div className="absolute inset-0 bg-ink-950/0 group-hover:bg-ink-950/50 transition-colors flex items-center justify-center">
          {uploading ? (
            <Loader2 size={22} className="text-white animate-spin" />
          ) : (
            <Camera size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={handleFileSelect}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="focus-ring text-xs font-medium text-brand-600 hover:text-brand-700 mt-2.5"
      >
        {photoPath ? "Change photo" : "Upload photo"}
      </button>

      {error && <p className="text-xs text-negative-600 mt-1 text-center max-w-[140px]">{error}</p>}
    </div>
  );
};

export default ProfilePhotoUpload;
