import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Bell } from "lucide-react";

import logo from "../assets/logo.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Check login status
  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, [location.pathname]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("profileImage");
    localStorage.removeItem("qualification");
    localStorage.removeItem("interestedCourse");
    localStorage.removeItem("preferredCountry");

    setIsLoggedIn(false);
    setOpen(false);

    navigate("/");
  };

  // Public navigation
  const publicLinks = [
    { name: "Home", path: "/" },
    { name: "Universities", path: "/universities" },
    { name: "Scholarships", path: "/scholarship-finder" },
    { name: "Eligibility", path: "/eligibility" },
  ];

  // Logged-in navigation
  const privateLinks = [
    { name: "Home", path: "/" },
    { name: "Universities", path: "/universities" },
    { name: "Scholarships", path: "/scholarship-finder" },
    { name: "Eligibility", path: "/eligibility" },
    { name: "Enroll", path: "/enroll" },
    { name: "Profile", path: "/profile" },
  ];

  const links = isLoggedIn ? privateLinks : publicLinks;

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">

      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <img
            src={logo}
            alt="UNIERA"
            className="h-12 w-auto"
          />

          <div className="hidden md:block">
            <h1 className="text-2xl font-black tracking-wide text-[#081D4A]">
              UNIERA
            </h1>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 text-[15px] font-medium">

          {links.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "text-[#6C3CE9] relative after:absolute after:left-0 after:-bottom-2 after:h-[2px] after:w-full after:bg-[#6C3CE9]"
                  : "text-slate-600 hover:text-[#6C3CE9] transition duration-300"
              }
            >
              {item.name}
            </NavLink>
          ))}

        </nav>

        {/* Right Side */}
        <div className="hidden lg:flex items-center gap-4">

          {isLoggedIn ? (
            <>
              {/* Notifications */}
              <Link
                to="/notifications"
                className="w-11 h-11 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition"
                title="Notifications"
              >
                <Bell size={18} />
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="text-sm font-semibold text-slate-700 hover:text-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Login */}
              <Link
                to="/login"
                className="text-sm font-semibold text-slate-700 hover:text-[#6C3CE9] transition"
              >
                Login
              </Link>

              {/* Sign Up */}
              <Link
                to="/signup"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#081D4A] to-[#6C3CE9] text-white font-semibold shadow-lg hover:scale-105 transition"
              >
                Sign Up
              </Link>
            </>
          )}

        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-[#081D4A]"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>

      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden bg-white border-t border-slate-200">

          <div className="flex flex-col p-6 gap-5">

            {links.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "text-[#6C3CE9] font-semibold"
                    : "text-slate-700 font-medium"
                }
              >
                {item.name}
              </NavLink>
            ))}

            {isLoggedIn ? (
              <>
                <NavLink
                  to="/notifications"
                  onClick={() => setOpen(false)}
                  className="text-slate-700 font-medium"
                >
                  Notifications
                </NavLink>

                <button
                  onClick={handleLogout}
                  className="text-left py-3 rounded-xl text-red-600 font-semibold"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="text-center py-3 rounded-xl border border-slate-200"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  onClick={() => setOpen(false)}
                  className="text-center py-3 rounded-xl bg-[#6C3CE9] text-white font-semibold"
                >
                  Sign Up
                </Link>
              </>
            )}

          </div>

        </div>
      )}

    </header>
  );
}