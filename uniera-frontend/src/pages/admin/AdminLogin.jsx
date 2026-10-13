// Consultancy staff login (standalone page, not inside AdminLayout).
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail, ArrowLeft, Briefcase } from "lucide-react";
import { api, errMsg } from "../../api";
import { Button, Field, Alert, inputCls } from "../../components/ui";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const r = await api.post("/admin/login", { email, password });
      localStorage.setItem("staff_token", r.data.token);
      localStorage.setItem("staff_name", r.data.name || "Counsellor");
      navigate("/admin");
    } catch (err) {
      setError(errMsg(err, "Login failed"));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#1e1147] to-[#7c3aed] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <img src="/uniera-logo.jpeg" alt="UniEra" className="w-16 h-16 rounded-full mx-auto shadow-lg" />
          <h1 className="text-white text-2xl font-bold mt-3">UniEra Consultancy Desk</h1>
          <p className="text-violet-200 text-sm mt-1">Staff and counsellor sign-in</p>
        </div>

        <form onSubmit={submit} className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 space-y-4">
          <Field label="Staff email">
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                className={`${inputCls} pl-9`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@uniera.com"
                required
              />
            </div>
          </Field>
          <Field label="Password">
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                className={`${inputCls} pl-9`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </Field>

          <Alert>{error}</Alert>

          <Button type="submit" size="lg" className="w-full" loading={loading}>
            <Briefcase size={16} /> Sign in
          </Button>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
            <b>Demo credentials:</b> admin@uniera.com / Admin@123
            <button
              type="button"
              className="ml-2 underline font-medium"
              onClick={() => {
                setEmail("admin@uniera.com");
                setPassword("Admin@123");
              }}
            >
              Fill in
            </button>
          </div>
        </form>

        <Link to="/" className="flex items-center justify-center gap-1.5 text-violet-100 hover:text-white text-sm mt-5">
          <ArrowLeft size={16} /> Back to website
        </Link>
      </div>
    </div>
  );
}
