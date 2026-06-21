import api from "./axios";

// Cities
export const getCities = () => api.get("/cities");
export const createCity = (data) => api.post("/cities", data);
export const updateCity = (id, data) => api.put(`/cities/${id}`, data);
export const deleteCity = (id) => api.delete(`/cities/${id}`);

// Sectors
export const getSectorsByCity = (cityId) => api.get(`/sectors/city/${cityId}`);
export const createSector = (data) => api.post("/sectors", data);
export const updateSector = (id, data) => api.put(`/sectors/${id}`, data);
export const deleteSector = (id) => api.delete(`/sectors/${id}`);

// Companies
export const getAllCompanies = () => api.get("/companies");
export const getCompaniesBySector = (sectorId) => api.get(`/companies/sector/${sectorId}`);
export const createCompany = (data) => api.post("/companies", data);
export const updateCompany = (id, data) => api.put(`/companies/${id}`, data);
export const deleteCompany = (id) => api.delete(`/companies/${id}`);
