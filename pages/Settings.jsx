// src/pages/Settings.jsx

import { useState } from "react";
import StudentSidebar from "../components/StudentTopbar";
import StudentTopbar from "../components/StudentSidebar";
import StudentFooter from "../components/StudentFooter";
import {
  User,
  Lock,
  Bell,
  Globe,
  Save,
} from "lucide-react";

function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [newsletter, setNewsletter] = useState(false);

  return (
    <div
  className="min-h-screen"
  style={{
    background:
      "linear-gradient(135deg, #E9E2FF 0%, #DFE7FF 50%, #E0F0FF 100%)",
  }}
>

      <StudentSidebar />

      <div className="ml-72 min-h-screen flex flex-col">

        <StudentTopbar />

        <main className="flex-1 px-10 pt-28 pb-10">

          <div className="mb-10">

            <h1 className="text-5xl font-extrabold text-[#001A47]">
              Settings
            </h1>

            <p className="mt-3 text-lg text-gray-500">
              Manage your account preferences and security.
            </p>

          </div>

          <div className="space-y-8">

            {/* Profile */}

            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">

              <div className="flex items-center gap-3 mb-6">

                <User className="text-[#6533E2]" />

                <h2 className="text-2xl font-bold text-[#001A47]">
                  Profile Settings
                </h2>

              </div>

              <div className="grid md:grid-cols-2 gap-6">

                <div>

                  <label className="font-semibold">
                    Full Name
                  </label>

                  <input
                    type="text"
                    defaultValue="Prachi Patel"
                    className="w-full mt-2 p-3 border rounded-xl focus:outline-none focus:border-[#6533E2]"
                  />

                </div>

                <div>

                  <label className="font-semibold">
                    Email
                  </label>

                  <input
                    type="email"
                    defaultValue="prachi@example.com"
                    className="w-full mt-2 p-3 border rounded-xl focus:outline-none focus:border-[#6533E2]"
                  />

                </div>

              </div>

            </div>

            {/* Password */}

            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">

              <div className="flex items-center gap-3 mb-6">

                <Lock className="text-[#6533E2]" />

                <h2 className="text-2xl font-bold text-[#001A47]">
                  Security
                </h2>

              </div>

              <div className="space-y-5">

                <input
                  type="password"
                  placeholder="Current Password"
                  className="w-full p-3 border rounded-xl"
                />

                <input
                  type="password"
                  placeholder="New Password"
                  className="w-full p-3 border rounded-xl"
                />

                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full p-3 border rounded-xl"
                />

              </div>

            </div>

            {/* Notifications */}

            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">

              <div className="flex items-center gap-3 mb-6">

                <Bell className="text-[#6533E2]" />

                <h2 className="text-2xl font-bold text-[#001A47]">
                  Notifications
                </h2>

              </div>

              <div className="space-y-5">

                <label className="flex justify-between items-center">

                  <span>Email Notifications</span>

                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={() =>
                      setNotifications(!notifications)
                    }
                  />

                </label>

                <label className="flex justify-between items-center">

                  <span>Newsletter Updates</span>

                  <input
                    type="checkbox"
                    checked={newsletter}
                    onChange={() =>
                      setNewsletter(!newsletter)
                    }
                  />

                </label>

              </div>

            </div>

            {/* Language */}

            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">

              <div className="flex items-center gap-3 mb-6">

                <Globe className="text-[#6533E2]" />

                <h2 className="text-2xl font-bold text-[#001A47]">
                  Language
                </h2>

              </div>

              <select className="w-full md:w-72 border rounded-xl p-3">

                <option>English</option>
                <option>Hindi</option>

              </select>

            </div>

            <button className="flex items-center gap-2 bg-[#6533E2] hover:bg-[#5229c6] text-white px-8 py-3 rounded-xl font-semibold">

              <Save size={18} />

              Save Changes

            </button>

          </div>

          <StudentFooter />

        </main>

      </div>

    </div>
  );
}

export default Settings;