import { useState, useEffect, useCallback } from "react";
import { MapPin, Layers } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import CityList from "../components/tracker/CityList";
import SectorTabs from "../components/tracker/SectorTabs";
import CompanyTable from "../components/tracker/CompanyTable";
import CityModal from "../components/tracker/CityModal";
import SectorModal from "../components/tracker/SectorModal";
import CompanyModal from "../components/tracker/CompanyModal";
import DetailModal from "../components/tracker/DetailModal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useToast } from "../context/ToastContext";
import * as api from "../api/trackerApi";

const TrackerPage = () => {
  const { showToast } = useToast();

  const [cities, setCities] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [activeCity, setActiveCity] = useState(null);
  const [activeSector, setActiveSector] = useState(null);

  const [loadingCities, setLoadingCities] = useState(true);
  const [loadingSectors, setLoadingSectors] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(false);

  // Modal states
  const [cityModalOpen, setCityModalOpen] = useState(false);
  const [editingCity, setEditingCity] = useState(null);
  const [sectorModalOpen, setSectorModalOpen] = useState(false);
  const [editingSector, setEditingSector] = useState(null);
  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailCompany, setDetailCompany] = useState(null);

  const [confirmDelete, setConfirmDelete] = useState(null); // { type, item }
  const [deleting, setDeleting] = useState(false);

  // Load cities on mount
  useEffect(() => {
    const loadCities = async () => {
      try {
        const { data } = await api.getCities();
        setCities(data);
        if (data.length > 0) setActiveCity(data[0]);
      } catch (err) {
        showToast("Failed to load cities.", "error");
      } finally {
        setLoadingCities(false);
      }
    };
    loadCities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load sectors when active city changes
  const loadSectors = useCallback(async (cityId) => {
    setLoadingSectors(true);
    try {
      const { data } = await api.getSectorsByCity(cityId);
      setSectors(data);
      setActiveSector(data.length > 0 ? data[0] : null);
    } catch (err) {
      showToast("Failed to load sectors.", "error");
    } finally {
      setLoadingSectors(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeCity) {
      loadSectors(activeCity._id);
    } else {
      setSectors([]);
      setActiveSector(null);
    }
  }, [activeCity, loadSectors]);

  // Load companies when active sector changes
  const loadCompanies = useCallback(async (sectorId) => {
    setLoadingCompanies(true);
    try {
      const { data } = await api.getCompaniesBySector(sectorId);
      setCompanies(data);
    } catch (err) {
      showToast("Failed to load companies.", "error");
    } finally {
      setLoadingCompanies(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeSector) {
      loadCompanies(activeSector._id);
    } else {
      setCompanies([]);
    }
  }, [activeSector, loadCompanies]);

  // ----- City handlers -----
  const handleCitySubmit = async (name) => {
    if (editingCity) {
      const { data } = await api.updateCity(editingCity._id, { name });
      setCities((prev) => prev.map((c) => (c._id === data._id ? data : c)));
      if (activeCity?._id === data._id) setActiveCity(data);
      showToast("City renamed.", "success");
    } else {
      const { data } = await api.createCity({ name });
      setCities((prev) => [...prev, data]);
      setActiveCity(data);
      showToast("City added.", "success");
    }
  };

  const handleDeleteCity = async () => {
    setDeleting(true);
    try {
      await api.deleteCity(confirmDelete.item._id);
      const remaining = cities.filter((c) => c._id !== confirmDelete.item._id);
      setCities(remaining);
      if (activeCity?._id === confirmDelete.item._id) {
        setActiveCity(remaining.length > 0 ? remaining[0] : null);
      }
      showToast("City deleted.", "success");
      setConfirmDelete(null);
    } catch (err) {
      showToast("Failed to delete city.", "error");
    } finally {
      setDeleting(false);
    }
  };

  // ----- Sector handlers -----
  const handleSectorSubmit = async (name) => {
    if (editingSector) {
      const { data } = await api.updateSector(editingSector._id, { name });
      setSectors((prev) => prev.map((s) => (s._id === data._id ? data : s)));
      if (activeSector?._id === data._id) setActiveSector(data);
      showToast("Sector renamed.", "success");
    } else {
      const { data } = await api.createSector({ name, cityId: activeCity._id });
      setSectors((prev) => [...prev, data]);
      setActiveSector(data);
      showToast("Sector added.", "success");
    }
  };

  const handleDeleteSector = async () => {
    setDeleting(true);
    try {
      await api.deleteSector(confirmDelete.item._id);
      const remaining = sectors.filter((s) => s._id !== confirmDelete.item._id);
      setSectors(remaining);
      if (activeSector?._id === confirmDelete.item._id) {
        setActiveSector(remaining.length > 0 ? remaining[0] : null);
      }
      showToast("Sector deleted.", "success");
      setConfirmDelete(null);
    } catch (err) {
      showToast("Failed to delete sector.", "error");
    } finally {
      setDeleting(false);
    }
  };

  // ----- Company handlers -----
  const handleCompanySubmit = async (form) => {
    if (editingCompany) {
      const { data } = await api.updateCompany(editingCompany._id, form);
      setCompanies((prev) => prev.map((c) => (c._id === data._id ? data : c)));
      showToast("Company updated.", "success");
    } else {
      const { data } = await api.createCompany({
        ...form,
        cityId: activeCity._id,
        sectorId: activeSector._id,
      });
      setCompanies((prev) => [...prev, data]);
      showToast("Company added.", "success");
    }
  };

  const handleUpdateCompanyField = async (id, fields) => {
    try {
      const { data } = await api.updateCompany(id, fields);
      setCompanies((prev) => prev.map((c) => (c._id === id ? data : c)));
    } catch (err) {
      showToast("Failed to update.", "error");
    }
  };

  const handleDeleteCompany = async () => {
    setDeleting(true);
    try {
      await api.deleteCompany(confirmDelete.item._id);
      setCompanies((prev) => prev.filter((c) => c._id !== confirmDelete.item._id));
      showToast("Company removed.", "success");
      setConfirmDelete(null);
    } catch (err) {
      showToast("Failed to delete company.", "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleDetailSubmit = async (detail) => {
    await handleUpdateCompanyField(detailCompany._id, { detail });
    showToast("Notes saved.", "success");
  };

  const confirmMessages = {
    city: `This will permanently delete "${confirmDelete?.item?.name}" along with all of its sectors and companies. This cannot be undone.`,
    sector: `This will permanently delete "${confirmDelete?.item?.name}" along with all companies listed under it. This cannot be undone.`,
    company: `This will permanently remove "${confirmDelete?.item?.companyName}" from your tracker.`,
  };

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-8 py-5 sm:py-7">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-semibold text-ink-900 tracking-tight">
            Job Tracker
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Organize companies by city and sector, and track every application's progress.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5">
          {/* Left: City list */}
          <div>
            {loadingCities ? (
              <div className="bg-white border border-slate-200 rounded-xl2 shadow-panel p-8 text-center text-sm text-slate-400">
                Loading cities…
              </div>
            ) : (
              <CityList
                cities={cities}
                activeCity={activeCity}
                onSelectCity={setActiveCity}
                onAddCity={() => {
                  setEditingCity(null);
                  setCityModalOpen(true);
                }}
                onEditCity={(city) => {
                  setEditingCity(city);
                  setCityModalOpen(true);
                }}
                onDeleteCity={(city) => setConfirmDelete({ type: "city", item: city })}
              />
            )}
          </div>

          {/* Right: Sectors + table */}
          <div className="min-w-0">
            {!activeCity ? (
              <div className="bg-white border border-slate-200 rounded-xl2 shadow-panel">
                <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                  <div className="h-12 w-12 rounded-xl bg-brand-50 flex items-center justify-center mb-3">
                    <MapPin size={20} className="text-brand-600" />
                  </div>
                  <p className="text-sm font-medium text-ink-800">No city selected</p>
                  <p className="text-sm text-slate-500 mt-1 max-w-xs">
                    Add a city like "Noida" to start organizing your job search.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
                  <MapPin size={14} />
                  <span className="font-medium text-ink-700">{activeCity.name}</span>
                  {activeSector && (
                    <>
                      <span className="text-slate-300">/</span>
                      <Layers size={13} />
                      <span>{activeSector.name}</span>
                    </>
                  )}
                </div>

                <div className="mb-5">
                  {loadingSectors ? (
                    <div className="text-sm text-slate-400">Loading sectors…</div>
                  ) : (
                    <SectorTabs
                      sectors={sectors}
                      activeSector={activeSector}
                      onSelectSector={setActiveSector}
                      onAddSector={() => {
                        setEditingSector(null);
                        setSectorModalOpen(true);
                      }}
                      onEditSector={(sector) => {
                        setEditingSector(sector);
                        setSectorModalOpen(true);
                      }}
                      onDeleteSector={(sector) => setConfirmDelete({ type: "sector", item: sector })}
                    />
                  )}
                </div>

                {!activeSector ? (
                  <div className="bg-white border border-slate-200 rounded-xl2 shadow-panel">
                    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                      <div className="h-12 w-12 rounded-xl bg-brand-50 flex items-center justify-center mb-3">
                        <Layers size={20} className="text-brand-600" />
                      </div>
                      <p className="text-sm font-medium text-ink-800">No sector selected</p>
                      <p className="text-sm text-slate-500 mt-1 max-w-xs">
                        Add a sector like "Sector 62" inside {activeCity.name} to begin adding
                        companies.
                      </p>
                    </div>
                  </div>
                ) : loadingCompanies ? (
                  <div className="bg-white border border-slate-200 rounded-xl2 shadow-panel p-12 text-center text-sm text-slate-400">
                    Loading companies…
                  </div>
                ) : (
                  <CompanyTable
                    companies={companies}
                    onAddCompany={() => {
                      setEditingCompany(null);
                      setCompanyModalOpen(true);
                    }}
                    onUpdateCompany={handleUpdateCompanyField}
                    onEditCompany={(company) => {
                      setEditingCompany(company);
                      setCompanyModalOpen(true);
                    }}
                    onDeleteCompany={(company) => setConfirmDelete({ type: "company", item: company })}
                    onViewDetail={(company) => {
                      setDetailCompany(company);
                      setDetailModalOpen(true);
                    }}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <CityModal
        open={cityModalOpen}
        onClose={() => setCityModalOpen(false)}
        onSubmit={handleCitySubmit}
        editingCity={editingCity}
      />

      <SectorModal
        open={sectorModalOpen}
        onClose={() => setSectorModalOpen(false)}
        onSubmit={handleSectorSubmit}
        editingSector={editingSector}
        cityName={activeCity?.name}
      />

      <CompanyModal
        open={companyModalOpen}
        onClose={() => setCompanyModalOpen(false)}
        onSubmit={handleCompanySubmit}
        editingCompany={editingCompany}
      />

      <DetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        onSubmit={handleDetailSubmit}
        company={detailCompany}
      />

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={
          confirmDelete?.type === "city"
            ? handleDeleteCity
            : confirmDelete?.type === "sector"
            ? handleDeleteSector
            : handleDeleteCompany
        }
        title={`Delete ${confirmDelete?.type || ""}?`}
        message={confirmDelete ? confirmMessages[confirmDelete.type] : ""}
        loading={deleting}
      />
    </DashboardLayout>
  );
};

export default TrackerPage;
