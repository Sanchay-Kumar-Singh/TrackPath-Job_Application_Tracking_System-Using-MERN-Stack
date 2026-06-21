import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  CheckCircle2,
  Clock,
  TrendingUp,
  ArrowUpRight,
  MapPin,
  Plus,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { getAllCompanies, getCities } from "../api/trackerApi";
import { responseDot, processStyles } from "../utils/statusConfig";

const StatCard = ({ icon: Icon, label, value, accent }) => (
  <div className="bg-white border border-slate-200 rounded-xl2 p-5 shadow-panel">
    <div className="flex items-center justify-between">
      <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${accent.bg}`}>
        <Icon size={17} className={accent.text} />
      </div>
    </div>
    <p className="text-2xl font-display font-semibold text-ink-900 mt-4">{value}</p>
    <p className="text-sm text-slate-500 mt-0.5">{label}</p>
  </div>
);

const DashboardPage = () => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companiesRes, citiesRes] = await Promise.all([getAllCompanies(), getCities()]);
        setCompanies(companiesRes.data);
        setCities(citiesRes.data);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalApplied = companies.filter((c) => c.applied).length;
  const positiveResponses = companies.filter((c) => c.response === "Positive").length;
  const ongoingProcess = companies.filter((c) => c.process === "Ongoing").length;
  const selected = companies.filter((c) => c.process === "Selected").length;

  const recentCompanies = [...companies]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 6);

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-8 py-5 sm:py-7 max-w-6xl">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink-900 tracking-tight">
              Welcome back, {firstName}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Here's how your job search is progressing across {cities.length}{" "}
              {cities.length === 1 ? "city" : "cities"}.
            </p>
          </div>
          <Link to="/tracker">
            <button className="focus-ring inline-flex items-center gap-2 bg-brand-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-brand-700 transition-colors shadow-sm shadow-brand-600/20">
              <Plus size={16} />
              Open Tracker
            </button>
          </Link>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-7">
          <StatCard
            icon={Building2}
            label="Companies applied"
            value={loading ? "—" : totalApplied}
            accent={{ bg: "bg-brand-50", text: "text-brand-600" }}
          />
          <StatCard
            icon={CheckCircle2}
            label="Positive responses"
            value={loading ? "—" : positiveResponses}
            accent={{ bg: "bg-positive-50", text: "text-positive-600" }}
          />
          <StatCard
            icon={Clock}
            label="Interviews ongoing"
            value={loading ? "—" : ongoingProcess}
            accent={{ bg: "bg-pending-50", text: "text-pending-600" }}
          />
          <StatCard
            icon={TrendingUp}
            label="Selected"
            value={loading ? "—" : selected}
            accent={{ bg: "bg-positive-50", text: "text-positive-600" }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-7">
          {/* Recent activity */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl2 shadow-panel overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-display font-semibold text-ink-900 text-sm">Recent activity</h2>
              <Link
                to="/tracker"
                className="text-xs text-brand-600 font-medium hover:text-brand-700 inline-flex items-center gap-1"
              >
                View all <ArrowUpRight size={13} />
              </Link>
            </div>

            {loading ? (
              <div className="px-5 py-10 text-center text-sm text-slate-400">Loading…</div>
            ) : recentCompanies.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p className="text-sm text-slate-500">No companies added yet.</p>
                <Link
                  to="/tracker"
                  className="text-sm text-brand-600 font-medium hover:text-brand-700 mt-1.5 inline-block"
                >
                  Add your first company →
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentCompanies.map((c) => (
                  <div key={c._id} className="px-5 py-3.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink-900 truncate">{c.companyName}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {c.city?.name} · {c.sector?.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`h-1.5 w-1.5 rounded-full ${responseDot[c.response]}`} />
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full border ${processStyles[c.process]}`}
                      >
                        {c.process}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cities overview */}
          <div className="bg-white border border-slate-200 rounded-xl2 shadow-panel overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-display font-semibold text-ink-900 text-sm">Cities</h2>
              <Link
                to="/tracker"
                className="text-xs text-brand-600 font-medium hover:text-brand-700 inline-flex items-center gap-1"
              >
                Manage <ArrowUpRight size={13} />
              </Link>
            </div>

            {loading ? (
              <div className="px-5 py-10 text-center text-sm text-slate-400">Loading…</div>
            ) : cities.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <MapPin size={20} className="text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No cities added yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {cities.map((city) => {
                  const cityCompanyCount = companies.filter(
                    (c) => c.city?._id === city._id
                  ).length;
                  return (
                    <div key={city._id} className="px-5 py-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-md bg-brand-50 flex items-center justify-center">
                          <MapPin size={13} className="text-brand-600" />
                        </div>
                        <span className="text-sm font-medium text-ink-800">{city.name}</span>
                      </div>
                      <span className="text-xs text-slate-400">{cityCompanyCount} companies</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
