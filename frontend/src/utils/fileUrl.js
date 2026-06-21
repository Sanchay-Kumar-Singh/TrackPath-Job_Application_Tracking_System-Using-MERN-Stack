// The backend serves uploaded files (photos, resumes) from its root, not under /api.
// e.g. API_URL = http://localhost:5000/api -> file server root = http://localhost:5000
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const FILE_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

export const getFileUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${FILE_BASE_URL}${path}`;
};
