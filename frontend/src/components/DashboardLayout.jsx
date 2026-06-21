import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, MapPin, UserCircle2, LogOut, Menu, X } from "lucide-react";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tracker", label: "Job Tracker", icon: MapPin },
  { to: "/profile", label: "My Profile", icon: UserCircle2 },
];

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close the mobile drawer automatically whenever the route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Prevent background scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  const SidebarContent = (
    <>
      <div className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `focus-ring flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-600/15 text-white border border-brand-500/30"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.05] border border-transparent"
              }`
            }
          >
            <Icon size={17} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </div>

      <div className="px-3 py-4 border-t border-white/[0.06] shrink-0">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg mb-1.5">
          <div className="h-8 w-8 rounded-full bg-brand-600 flex items-center justify-center text-xs font-semibold text-white shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="focus-ring w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
        >
          <LogOut size={17} />
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      {/* Mobile top bar — visible below lg breakpoint only */}
      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between bg-ink-950 px-4 py-3 border-b border-white/[0.06]">
        <div className="[&_span]:text-white">
          <Logo size="sm" />
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="focus-ring h-9 w-9 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/[0.08] transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-ink-950/60 backdrop-blur-[2px]"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer panel */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-[280px] max-w-[82vw] bg-ink-950 text-slate-300 flex flex-col transform transition-transform duration-200 ease-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/[0.06] shrink-0">
          <div className="[&_span]:text-white">
            <Logo size="md" />
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="focus-ring h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>
        {SidebarContent}
      </aside>

      {/* Desktop sidebar — fixed, visible at lg and above */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-ink-950 text-slate-300 flex-col fixed h-screen">
        <div className="px-5 py-5 border-b border-white/[0.06] shrink-0">
          <div className="[&_span]:text-white">
            <Logo size="md" />
          </div>
        </div>
        {SidebarContent}
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:ml-64 min-h-screen w-full min-w-0">{children}</main>
    </div>
  );
};

export default DashboardLayout;
