import api from "./axios";

export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const getProfile = () => api.get("/auth/profile");
export const updateProfile = (data) => api.put("/auth/profile", data);

export const uploadPhoto = (file) => {
  const formData = new FormData();
  formData.append("photo", file);
  return api.post("/auth/profile/photo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append("resume", file);
  return api.post("/auth/profile/resume", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteResume = () => api.delete("/auth/profile/resume");
