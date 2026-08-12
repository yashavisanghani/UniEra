import { Link, useNavigate } from "react-router-dom";
import { Bell, LogOut } from "lucide-react";
import logo from "../assets/uniera-logo.jpg";

export default function Navbar() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");
  const isEnrolled = localStorage.getItem("is_enrolled") === "true";

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("is_enrolled");
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-white">
      <div className="flex items-center gap-3">
        <img src={logo} alt="Uniera" className="w-10 h-10 rounded-lg" />
        <span className="text-xl font-extrabold text-[#1e1147]">UNIERA</span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
        <Link to="/" className="text-violet-600 border-b-2 border-violet-600 pb-1">Home</Link>
        <Link to="/universities" className="hover:text-violet-600">Universities</Link>

        {isEnrolled && (
          <>
            <Link to="/scholarships" className="hover:text-violet-600">Scholarships</Link>
            <Link to="/eligibility" className="hover:text-violet-600">Eligibility</Link>
            <Link to="/profile" className="hover:text-violet-600">Profile</Link>
          </>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50">
          <Bell size={18} className="text-gray-500" />
        </button>

        {userId ? (
          <>
            {!isEnrolled && (
              <Link
                to="/enroll-now"
                className="bg-gradient-to-r from-[#1e1147] to-[#7c3aed] text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition"
              >
                Enroll Now
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50"
              title="Logout"
            >
              <LogOut size={16} className="text-gray-500" />
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-violet-600">
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-gradient-to-r from-[#1e1147] to-[#7c3aed] text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}