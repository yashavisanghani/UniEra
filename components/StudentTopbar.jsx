import { useState } from "react";
import { Search, Bell, CheckCircle2, FileText, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function StudentTopbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const userName =
    localStorage.getItem("userName") ||
    localStorage.getItem("name") ||
    "Prachi Patel";

  const profileImage =
    localStorage.getItem("profileImage") ||
    "https://i.pravatar.cc/100?img=12";

  const notifications = [
    {
      icon: CalendarDays,
      title: "IELTS Exam Reminder",
      description: "Your IELTS exam is scheduled for 15 August 2026.",
      time: "Today",
      color: "bg-[#E9E2FF] text-[#6533E2]",
    },
    {
      icon: CheckCircle2,
      title: "Offer Letter Received",
      description: "University of Sydney has uploaded your offer letter.",
      time: "Yesterday",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: FileText,
      title: "Upload SOP",
      description: "Your Statement of Purpose is still pending.",
      time: "2 days ago",
      color: "bg-blue-100 text-blue-600",
    },
  ];

  return (
    <header className="fixed top-0 left-72 right-0 h-20 bg-white border-b border-gray-200 z-50">

      <div className="h-full flex items-center justify-between px-8">

        {/* Left */}
        <div className="flex items-center gap-8">

          <img
            src={logo}
            alt="UNIERA Logo"
            className="h-14 w-auto object-contain"
          />

          {/* Search */}
          <div className="relative w-[520px]">

            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search universities..."
              className="w-full py-3 pl-12 pr-4 rounded-full border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#6533E2] focus:border-[#6533E2]"
            />

          </div>

        </div>

        {/* Right */}
        <div className="flex items-center gap-5">

          {/* Notification Bell */}
          <div className="relative">

            <button
              type="button"
              onClick={() =>
                setShowNotifications(!showNotifications)
              }
              className="relative w-11 h-11 rounded-full flex items-center justify-center hover:bg-[#F3F0FF] transition"
            >

              <Bell
                size={24}
                className="text-[#001A47]"
              />

              {/* Notification Dot */}
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white" />

            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-14 w-[380px] bg-white rounded-2xl border border-purple-100 shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="px-5 py-4 bg-gradient-to-r from-[#001A47] to-[#6533E2] text-white">

                  <div className="flex items-center justify-between">

                    <div>
                      <h3 className="font-bold text-lg">
                        Notifications
                      </h3>

                      <p className="text-sm text-purple-100">
                        Stay updated with your application
                      </p>
                    </div>

                    <Bell size={20} />

                  </div>

                </div>

                {/* Notifications */}
                <div className="max-h-[350px] overflow-y-auto">

                  {notifications.map((item, index) => {
                    const Icon = item.icon;

                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => navigate("/notifications")}
                        className="w-full text-left flex gap-4 p-4 border-b border-gray-100 hover:bg-[#F8F6FF] transition"
                      >

                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}
                        >
                          <Icon size={20} />
                        </div>

                        <div className="flex-1 min-w-0">

                          <div className="flex justify-between gap-3">

                            <h4 className="font-semibold text-[#001A47]">
                              {item.title}
                            </h4>

                            <span className="text-xs text-gray-400 whitespace-nowrap">
                              {item.time}
                            </span>

                          </div>

                          <p className="text-sm text-gray-500 mt-1 leading-5">
                            {item.description}
                          </p>

                        </div>

                      </button>
                    );
                  })}

                </div>

                {/* Footer */}
                <button
                  type="button"
                  onClick={() => navigate("/notifications")}
                  className="w-full py-4 text-sm font-semibold text-[#6533E2] hover:bg-[#F8F6FF] transition"
                >
                  View All Notifications →
                </button>

              </div>
            )}

          </div>

          {/* Profile */}
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="flex items-center gap-3 pl-3 border-l border-gray-200 hover:opacity-80 transition"
          >

            <img
              src={profileImage}
              alt={userName}
              className="w-10 h-10 rounded-full object-cover border-2 border-[#E9E2FF]"
            />

            <div className="text-left hidden xl:block">

              <p className="text-sm font-bold text-[#001A47]">
                {userName}
              </p>

              <p className="text-xs text-gray-500">
                Student
              </p>

            </div>

          </button>

        </div>

      </div>

    </header>
  );
}

export default StudentTopbar;