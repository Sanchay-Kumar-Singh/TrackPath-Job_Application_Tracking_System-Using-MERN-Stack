import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Target } from "lucide-react";
import Logo from "../components/Logo";
import Button from "../components/ui/Button";
import { Input } from "../components/ui/FormFields";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const RegisterPage = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      showToast("Account created. Welcome to TrackPath!", "success");
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left - visual panel */}
      <div className="hidden lg:flex flex-1 bg-ink-950 relative overflow-hidden items-center justify-center px-16">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-brand-600/20 blur-3xl" />
        <div className="absolute top-0 right-10 h-72 w-72 rounded-full bg-brand-500/10 blur-3xl" />

        <div className="relative max-w-md">
          <div className="h-12 w-12 rounded-xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center mb-6">
            <Target size={22} className="text-brand-300" />
          </div>
          <h2 className="font-display text-3xl font-semibold text-white leading-tight tracking-tight">
            Built for a focused, multi-city job search.
          </h2>
          <p className="text-slate-400 text-sm mt-4 leading-relaxed">
            Add cities, break them into sectors, log every company you approach — walk-ins, online
            applications, referrals — and watch your pipeline take shape.
          </p>

          <ul className="mt-9 space-y-3">
            {[
              "Organize by city → sector → company",
              "Track applied, response and interview process",
              "Secure, JWT-authenticated personal data",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-400 mt-1.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right - form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-20 py-12">
        <div className="w-full max-w-sm mx-auto">
          <Logo size="md" />

          <h1 className="font-display text-2xl font-semibold text-ink-900 mt-10 tracking-tight">
            Create your account
          </h1>
          <p className="text-sm text-slate-500 mt-1.5">
            Start tracking your applications in minutes.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error && (
              <div className="bg-negative-50 border border-negative-200 text-negative-700 text-sm rounded-lg px-3.5 py-2.5">
                {error}
              </div>
            )}

            <div className="relative">
              <Input
                label="Full name"
                type="text"
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                required
                className="pl-10"
              />
              <User size={16} className="absolute left-3.5 top-[2.45rem] text-slate-400" />
            </div>

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
                placeholder="At least 6 characters"
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

            <div className="relative">
              <Input
                label="Confirm password"
                type={showPassword ? "text" : "password"}
                name="confirm"
                placeholder="Re-enter your password"
                value={form.confirm}
                onChange={handleChange}
                required
                className="pl-10"
              />
              <Lock size={16} className="absolute left-3.5 top-[2.45rem] text-slate-400" />
            </div>

            <Button type="submit" className="w-full mt-2" loading={loading}>
              Create account
              <ArrowRight size={16} />
            </Button>
          </form>

          <p className="text-sm text-slate-500 text-center mt-7">
            Already have an account?{" "}
            <Link to="/login" className="text-brand-600 font-medium hover:text-brand-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
