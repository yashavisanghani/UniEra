import { useState } from "react";
<<<<<<< HEAD
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import AuthSidePanel from "../components/AuthSidePanel";
import { api, saveSession, errMsg } from "../api";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  // page the user was trying to open before being sent to login (set by RequireAuth)
  const from = location.state?.from;
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
=======
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import axios from "axios";
import AuthSidePanel from "../components/AuthSidePanel";
import AuthTabs from "../components/AuthTabs";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
>>>>>>> f7cc527880b4d30cc38f9ff9a9d54e623d718278

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
<<<<<<< HEAD
    setLoading(true);
    try {
      const res = await api.post("/login", form);
      saveSession(res.data);
      // go back to where they came from, else portal (enrolled) or home
      if (from) navigate(from, { replace: true });
      else if (res.data.is_enrolled) navigate("/portal", { replace: true });
      else navigate("/", { replace: true });
    } catch (err) {
      setError(errMsg(err, "Invalid email or password"));
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <AuthSidePanel
        heading={
          <>
            Your Path Abroad,
            <br />
            Made Easy.
          </>
        }
        description="Access the world's most prestigious universities and scholarships with our premium global education platform."
      />

      <div className="flex-1 overflow-y-auto bg-white">
        <div className="flex justify-center px-6 py-16">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-gray-900 mb-1">Welcome Back</h2>
            <p className="text-gray-500 mb-6">
              Please enter your details to continue your journey.
            </p>

            <div className="grid grid-cols-2 bg-gray-100 rounded-xl p-1 mb-6">
              <span className="text-center py-2.5 rounded-lg bg-white shadow-sm font-medium text-gray-900">
                Login
              </span>
              <Link
                to="/signup"
                state={location.state}
                className="text-center py-2.5 rounded-lg text-gray-500 hover:text-gray-800 transition"
              >
                Signup
              </Link>
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <form onSubmit={handleSubmit}>
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative mt-1 mb-4">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <span />
              </div>
              <div className="relative mt-1 mb-3">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                <input type="checkbox" className="rounded" />
                Remember me for 30 days
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#1e1147] to-[#7c3aed] text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login \u2192"}
              </button>
            </form>

            <p className="text-sm text-center text-gray-500 mt-6">
              Don&apos;t have an account?{" "}
              <Link to="/signup" state={location.state} className="text-violet-600 font-medium hover:underline">
                Signup
              </Link>
            </p>

            <div className="flex justify-between items-center text-sm mt-8 pt-6 border-t border-gray-100">
              <Link to="/" className="text-gray-500 hover:text-gray-800">
                &larr; Back to website
              </Link>
              <Link to="/admin/login" className="text-violet-600 hover:underline">
                Consultancy staff? Log in here
              </Link>
            </div>
          </div>
=======
    try {
      const res = await axios.post("http://localhost:5000/login", form);
      localStorage.setItem("user_id", res.data.user_id);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="flex min-h-screen">
      <AuthSidePanel
        heading={<>Your Path Abroad,<br />Made Easy.</>}
        description="Access the world's most prestigious universities and scholarships with our premium global education platform."
      />

      <div className="flex flex-1 items-center justify-center px-6 py-10 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-1">Welcome Back</h2>
          <p className="text-gray-500 mb-6">Please enter your details to continue your journey.</p>

          <AuthTabs active="login" />

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <form onSubmit={handleSubmit}>
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <div className="relative mt-1 mb-4">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <Link to="/forgot-password" className="text-sm text-violet-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative mt-1 mb-3">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-600 mb-6">
              <input type="checkbox" className="rounded" />
              Remember me for 30 days
            </label>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#1e1147] to-[#7c3aed] text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 transition"
            >
              Sign In →
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">OR CONTINUE WITH</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="border border-gray-200 rounded-lg py-2.5 font-medium hover:bg-gray-50">
              Google
            </button>
            <button className="border border-gray-200 rounded-lg py-2.5 font-medium hover:bg-gray-50">
              Facebook
            </button>
          </div>

          <p className="text-sm text-center text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-violet-600 font-medium hover:underline">
              Signup
            </Link>
          </p>
>>>>>>> f7cc527880b4d30cc38f9ff9a9d54e623d718278
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> f7cc527880b4d30cc38f9ff9a9d54e623d718278
