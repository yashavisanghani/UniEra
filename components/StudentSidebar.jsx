import {
  LayoutDashboard,
  FileText,
  Heart,
  Calendar,
  Settings,
  LogOut,
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";

function StudentSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    {
      icon: <LayoutDashboard size={20} />,
      name: "Dashboard",
      path: "/student-dashboard",
    },
    {
      icon: <FileText size={20} />,
      name: "Applications",
      path: "/applications",
    },
    {
      icon: <Heart size={20} />,
      name: "Saved",
      path: "/saved-universities",
    },
    {
      icon: <Calendar size={20} />,
      name: "Documents",
      path: "/document-checklist",
    },
    {
      icon: <Settings size={20} />,
      name: "Settings",
      path: "/settings",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("profileImage");
    localStorage.removeItem("qualification");
    localStorage.removeItem("interestedCourse");
    localStorage.removeItem("preferredCountry");

    navigate("/");
  };

  return (
    <aside className="fixed left-0 top-0 w-72 h-screen bg-[#001A47] text-white p-6 flex flex-col z-40">

      {/* Student Profile */}
      <div className="flex items-center gap-4 pb-6 mb-8 border-b border-white/10">

        <img
          src={
            localStorage.getItem("profileImage") ||
            "https://i.pravatar.cc/100?img=12"
          }
          alt="Student"
          className="w-14 h-14 rounded-full border-2 border-white object-cover shrink-0"
        />

        <div className="min-w-0">
          <h2 className="text-xl font-bold truncate">
            Prachi Patel
          </h2>

          <p className="text-sm text-white/70">
            Student
          </p>
        </div>

      </div>

      {/* Navigation */}
      <nav className="space-y-3 flex-1">

        {menu.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition ${
                isActive
                  ? "bg-[#6533E2]"
                  : "hover:bg-white/10"
              }`}
            >
              {item.icon}

              <span>
                {item.name}
              </span>
            </button>
          );
        })}

      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 text-red-300 hover:text-red-200 py-2 transition"
      >
        <LogOut size={20} />

        <span>
          Logout
        </span>
      </button>

    </aside>
  );
}

export default StudentSidebar;