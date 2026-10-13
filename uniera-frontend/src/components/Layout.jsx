// Public website layout: top navbar with "Enroll Now" on the top-right, footer, chatbot.
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LayoutDashboard, LogOut, Phone, Mail, MapPin } from "lucide-react";
import ChatbotWidget from "./ChatbotWidget";
import { currentUser, logout } from "../api";

const NAV = [
  { to: "/", label: "Home", end: true },
  { to: "/universities", label: "Universities" },
  { to: "/scholarships", label: "Scholarships" },
  { to: "/eligibility", label: "Eligibility" },
  { to: "/cost-estimator", label: "Cost Estimator" },
  { to: "/track", label: "Track Application" },
];

export function PublicNavbar() {
  const navigate = useNavigate();
  const user = currentUser();
  const [open, setOpen] = useState(false);

  const out = () => {
    logout();
    navigate("/");
  };

  const linkCls = ({ isActive }) =>
    `text-[15px] transition ${isActive ? "text-[#7c3aed] font-semibold" : "text-slate-700 hover:text-[#7c3aed]"}`;

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 h-18 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img src="/uniera-logo.jpeg" alt="UniEra" className="w-10 h-10 rounded-full object-cover" />
          <span className="text-2xl font-bold tracking-tight text-[#1e1147]">UNIERA</span>
        </Link>

        <div className="hidden xl:flex items-center gap-7">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={linkCls}>
              {n.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-slate-600 hidden md:inline">Hi, {user.name.split(" ")[0] || "there"}</span>
              {user.isEnrolled ? (
                <Link
                  to="/portal"
                  className="flex items-center gap-2 bg-gradient-to-r from-[#1e1147] to-[#7c3aed] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-90"
                >
                  <LayoutDashboard size={16} /> Student Portal
                </Link>
              ) : (
                <Link
                  to="/enroll"
                  className="bg-gradient-to-r from-[#1e1147] to-[#7c3aed] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 shadow-md shadow-violet-200"
                >
                  Enroll Now
                </Link>
              )}
              <button onClick={out} title="Log out" className="p-2 rounded-full border border-slate-200 hover:bg-slate-50">
                <LogOut size={16} className="text-slate-500" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-[15px] text-slate-700 hover:text-[#7c3aed] hidden sm:inline">
                Login
              </Link>
              <Link
                to="/enroll"
                className="bg-gradient-to-r from-[#1e1147] to-[#7c3aed] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 shadow-md shadow-violet-200"
              >
                Enroll Now
              </Link>
            </>
          )}
          <button className="xl:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <div className="xl:hidden border-t border-slate-100 px-4 py-3 flex flex-col gap-3 bg-white">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={linkCls} onClick={() => setOpen(false)}>
              {n.label}
            </NavLink>
          ))}
          {!user && (
            <Link to="/login" className="text-slate-700" onClick={() => setOpen(false)}>
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#140b33] text-slate-300" id="contact-footer">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-3">
            <img src="/uniera-logo.jpeg" alt="" className="w-9 h-9 rounded-full" />
            <span className="text-xl font-bold text-white">UNIERA</span>
          </div>
          <p className="max-w-sm text-slate-400">
            Study-abroad consultancy helping Indian students get into Australian universities — from
            shortlisting and applications to loans, visa and accommodation.
          </p>
        </div>
        <div>
          <p className="font-semibold text-white mb-3">Explore</p>
          <ul className="space-y-2">
            {NAV.slice(1).map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="hover:text-white">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white mb-3">Contact</p>
          <ul className="space-y-2">
            <li className="flex gap-2"><Phone size={16} /> +91 98765 43210</li>
            <li className="flex gap-2"><Mail size={16} /> hello@uniera.com</li>
            <li className="flex gap-2"><MapPin size={16} /> Ahmedabad · Mumbai · Pune</li>
            <li>
              <Link to="/admin/login" className="text-slate-500 hover:text-white text-xs">
                Consultancy staff login →
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-slate-500">
        © 2026 UniEra · Currently supporting admissions to Australia
      </div>
    </footer>
  );
}

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <ChatbotWidget />
    </div>
  );
}

// Purple page header used across public pages
export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="bg-gradient-to-r from-[#1e1147] to-[#7c3aed] text-white py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">{title}</h1>
        {subtitle && <p className="text-purple-200">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}
