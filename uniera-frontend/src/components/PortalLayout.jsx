// Student portal (only after enrolment + payment): sidebar + top bar + chatbot.
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, School, Heart, FileText, Award, Search, BookOpen, Landmark, Home as HomeIcon,
  CreditCard, User, Bell, LogOut, Menu, X, Globe, Star, GraduationCap,
} from "lucide-react";
import ChatbotWidget from "./ChatbotWidget";
import { api, currentUser, logout, fmtDate } from "../api";

const PORTAL_NAV = [
  { to: "/portal", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/portal/universities", label: "Universities", icon: School },
  { to: "/portal/scholarships", label: "Scholarships", icon: GraduationCap },
  { to: "/portal/shortlist", label: "Shortlist & Compare", icon: Heart },
  { to: "/portal/applications", label: "My Applications", icon: FileText },
  { to: "/portal/offers", label: "Offer Letters", icon: Award },
  { to: "/portal/status", label: "Status Checker", icon: Search },
  { to: "/portal/test-prep", label: "Test Preparation", icon: BookOpen },
  { to: "/portal/loans", label: "Education Loan", icon: Landmark },
  { to: "/portal/accommodation", label: "Accommodation", icon: HomeIcon },
  { to: "/portal/payments", label: "Payments", icon: CreditCard },
  { to: "/portal/profile", label: "My Profile", icon: User },
  { to: "/portal/review", label: "Write a Review", icon: Star },
];

function Bell_({ user }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({ notifications: [], unread: 0 });
  const load = () => api.get(`/notifications/${user.id}`).then((r) => setData(r.data)).catch(() => {});
  useEffect(() => {
    load();
    const t = setInterval(load, 20000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const toggle = () => {
    setOpen(!open);
    if (!open && data.unread) api.post(`/notifications/${user.id}/read`).then(() => setTimeout(load, 500));
  };
  return (
    <div className="relative">
      <button onClick={toggle} className="relative p-2 rounded-full border border-slate-200 hover:bg-slate-50">
        <Bell size={18} className="text-slate-600" />
        {data.unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
            {data.unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-[340px] max-h-[420px] overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl z-50">
          <p className="px-4 py-3 font-semibold text-sm border-b border-slate-100">Notifications</p>
          {data.notifications.length === 0 && <p className="p-4 text-sm text-slate-500">No notifications yet.</p>}
          {data.notifications.map((n) => (
            <Link
              key={n.notification_id}
              to={n.application_id ? `/portal/applications/${n.application_id}` : "/portal"}
              onClick={() => setOpen(false)}
              className={`block px-4 py-3 border-b border-slate-50 hover:bg-slate-50 ${n.is_read ? "" : "bg-violet-50/60"}`}
            >
              <p className="text-sm font-medium text-slate-800">{n.title}</p>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
              <p className="text-[10px] text-slate-400 mt-1">{fmtDate(n.created_at, true)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PortalLayout() {
  const navigate = useNavigate();
  const user = currentUser();
  const [open, setOpen] = useState(false);

  const out = () => {
    logout();
    navigate("/");
  };

  const Side = (
    <aside className="w-64 shrink-0 bg-[#140b33] text-slate-300 flex flex-col h-full">
      <Link to="/portal" className="flex items-center gap-3 px-5 h-16 border-b border-white/10">
        <img src="/uniera-logo.jpeg" alt="" className="w-9 h-9 rounded-full" />
        <div>
          <p className="text-white font-bold leading-none">UNIERA</p>
          <p className="text-[10px] text-violet-300 tracking-wider mt-1">STUDENT PORTAL</p>
        </div>
      </Link>
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
        {PORTAL_NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                isActive ? "bg-[#7c3aed] text-white font-medium" : "hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <n.icon size={18} /> {n.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-white/10 space-y-1">
        <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-white/5">
          <Globe size={18} /> Public website
        </Link>
        <button onClick={out} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-white/5">
          <LogOut size={18} /> Log out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="h-screen flex bg-slate-50">
      <div className="hidden lg:flex">{Side}</div>
      {open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {Side}
          <div className="flex-1 bg-black/40" onClick={() => setOpen(false)} />
        </div>
      )}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setOpen(true)}>
              {open ? <X /> : <Menu />}
            </button>
            <p className="text-sm text-slate-500 hidden sm:block">
              Welcome back, <span className="font-semibold text-slate-800">{user?.name || "Student"}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            {user && <Bell_ user={user} />}
            <Link
              to="/portal/profile"
              className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1e1147] to-[#7c3aed] text-white flex items-center justify-center font-semibold text-sm"
            >
              {(user?.name || "S")[0].toUpperCase()}
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
      <ChatbotWidget />
    </div>
  );
}
