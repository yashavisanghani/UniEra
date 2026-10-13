// src/pages/Notifications.jsx

import StudentSidebar from "../components/StudentSidebar";
import StudentTopbar from "../components/StudentTopbar";
import StudentFooter from "../components/StudentFooter";

import {
  Bell,
  Calendar,
  FileText,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const notifications = [
  {
    title: "IELTS Exam Reminder",
    description: "Your IELTS exam is scheduled for 15 August 2026.",
    date: "Today",
    icon: Calendar,
    color: "bg-blue-100 text-blue-600",
    unread: true,
  },
  {
    title: "Offer Letter Received",
    description: "University of Sydney has uploaded your offer letter.",
    date: "Yesterday",
    icon: CheckCircle2,
    color: "bg-green-100 text-green-600",
    unread: true,
  },
  {
    title: "Upload SOP",
    description: "Your Statement of Purpose is still pending.",
    date: "2 days ago",
    icon: FileText,
    color: "bg-yellow-100 text-yellow-600",
    unread: false,
  },
  {
    title: "Visa Documentation",
    description: "Prepare your visa documents before September.",
    date: "4 days ago",
    icon: Bell,
    color: "bg-purple-100 text-purple-600",
    unread: false,
  },
];

function Notifications() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E9E2FF] via-[#DFE7FF] to-[#E0F0FF]">

      <StudentSidebar />

      <div className="ml-72 min-h-screen flex flex-col">

        <StudentTopbar />

        <main className="flex-1 px-10 pt-28 pb-10">

          {/* Header */}
          <div className="mb-10">

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mt-5">

              <div>

                <h1 className="text-5xl font-extrabold text-[#001A47]">
                  Stay Updated
                </h1>

                <p className="mt-3 text-lg text-gray-600">
                  Stay updated with important application activities.
                </p>

              </div>

              <span className="px-5 py-2 rounded-full bg-[#6C3CE9] text-white font-semibold shadow-lg w-fit">
                2 Unread
              </span>

            </div>

          </div>

          {/* Notifications */}
          <div className="space-y-5">

            {notifications.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className={`group relative bg-white rounded-3xl border shadow-lg p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    item.unread
                      ? "border-[#6C3CE9]/30"
                      : "border-gray-200"
                  }`}
                >

                  {/* Unread Indicator */}
                  {item.unread && (
                    <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r-full bg-[#6C3CE9]" />
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">

                    <div className="flex items-start gap-5">

                      {/* Icon */}
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${item.color}`}
                      >
                        <Icon size={26} />
                      </div>

                      {/* Content */}
                      <div>

                        <div className="flex items-center gap-3 flex-wrap">

                          <h2 className="text-xl font-bold text-[#001A47]">
                            {item.title}
                          </h2>

                          {item.unread && (
                            <span className="w-2.5 h-2.5 rounded-full bg-[#6C3CE9]" />
                          )}

                        </div>

                        <p className="text-gray-500 mt-2 leading-7">
                          {item.description}
                        </p>

                        <button className="mt-4 flex items-center gap-2 text-[#6C3CE9] font-semibold text-sm group-hover:gap-3 transition-all">
                          View Details
                          <ArrowRight size={16} />
                        </button>

                      </div>

                    </div>

                    {/* Date */}
                    <span className="text-sm text-gray-400 whitespace-nowrap self-start sm:self-center">
                      {item.date}
                    </span>

                  </div>

                </div>
              );
            })}

          </div>

          <StudentFooter />

        </main>

      </div>

    </div>
  );
}

export default Notifications;