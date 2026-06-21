import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Briefcase } from "lucide-react";
import Logo from "../components/Logo";
import Button from "../components/ui/Button";
import { Input } from "../components/ui/FormFields";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      showToast("Welcome back! Logged in successfully.", "success");
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left - form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-20 py-12">
        <div className="w-full max-w-sm mx-auto">
          <Logo size="md" />

          <h1 className="font-display text-2xl font-semibold text-ink-900 mt-10 tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-slate-500 mt-1.5">
            Sign in to continue tracking your job search.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error && (
              <div className="bg-negative-50 border border-negative-200 text-negative-700 text-sm rounded-lg px-3.5 py-2.5">
                {error}
              </div>
            )}

            <div className="relative">
              <Input
                label="Email address"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="pl-10"
              />
              <Mail size={16} className="absolute left-3.5 top-[2.45rem] text-slate-400" />
            </div>

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
                className="pl-10 pr-10"
              />
              <Lock size={16} className="absolute left-3.5 top-[2.45rem] text-slate-400" />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3.5 top-[2.3rem] text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <Button type="submit" className="w-full mt-2" loading={loading}>
              Sign in
              <ArrowRight size={16} />
            </Button>
          </form>

          <p className="text-sm text-slate-500 text-center mt-7">
            Don't have an account?{" "}
            <Link to="/register" className="text-brand-600 font-medium hover:text-brand-700">
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* Right - visual panel */}
      <div className="hidden lg:flex flex-1 bg-ink-950 relative overflow-hidden items-center justify-center px-16">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-brand-600/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-brand-500/10 blur-3xl" />

        <div className="relative max-w-md">
          <div className="h-12 w-12 rounded-xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center mb-6">
            <Briefcase size={22} className="text-brand-300" />
          </div>
          <h2 className="font-display text-3xl font-semibold text-white leading-tight tracking-tight">
            Every application, every outcome, in one place.
          </h2>
          <p className="text-slate-400 text-sm mt-4 leading-relaxed">
            Organize your job search by city and sector, track applied status, responses and interview
            progress — without losing track of a single company.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              ["City-wise", "tracking"],
              ["Live status", "updates"],
              ["JWT secured", "profile"],
            ].map(([a, b], i) => (
              <div key={i} className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-3">
                <p className="text-white text-sm font-medium">{a}</p>
                <p className="text-slate-500 text-xs">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
