// Consultancy (counsellor/admin) portal layout.
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, FileText, Users, Briefcase, LogOut, Globe } from "lucide-react";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/applications", label: "Applications", icon: FileText },
  { to: "/admin/students", label: "Students", icon: Users },
  { to: "/admin/services", label: "Payments & Services", icon: Briefcase },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const name = localStorage.getItem("staff_name") || "Counsellor";
  const out = () => {
    localStorage.removeItem("staff_token");
    localStorage.removeItem("staff_name");
    navigate("/admin/login");
  };
  return (
    <div className="h-screen flex bg-slate-50">
      <aside className="w-60 shrink-0 bg-slate-900 text-slate-300 hidden md:flex flex-col">
        <Link to="/admin" className="flex items-center gap-3 px-5 h-16 border-b border-white/10">
          <img src="/uniera-logo.jpeg" alt="" className="w-9 h-9 rounded-full" />
          <div>
            <p className="text-white font-bold leading-none">UNIERA</p>
            <p className="text-[10px] text-amber-300 tracking-wider mt-1">CONSULTANCY DESK</p>
          </div>
        </Link>
        <nav className="flex-1 py-3 px-3 space-y-0.5">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${
                  isActive ? "bg-amber-500 text-slate-900 font-semibold" : "hover:bg-white/5 hover:text-white"
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
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="md:hidden flex gap-3 text-sm">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} className="text-slate-600">
                {n.label.split(" ")[0]}
              </Link>
            ))}
          </div>
          <p className="text-sm text-slate-500 hidden md:block">UniEra Consultancy — Counsellor Desk</p>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-8 h-8 rounded-full bg-amber-500 text-slate-900 font-bold flex items-center justify-center">
              {name[0]}
            </span>
            <span className="text-slate-700 hidden sm:inline">{name}</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
