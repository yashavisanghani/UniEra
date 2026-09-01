// src/pages/PrivacyPolicy.jsx

import StudentSidebar from "../components/StudentTopbar";
import StudentTopbar from "../components/StudentSidebar";
import StudentFooter from "../components/StudentFooter";
import {
  ShieldCheck,
  Lock,
  Database,
  Eye,
} from "lucide-react";

function PrivacyPolicy() {
  return (
    <div className="bg-[#F7F9FB] min-h-screen">

      <StudentSidebar />

      <div className="ml-72 min-h-screen flex flex-col">

        <StudentTopbar />

        <main className="flex-1 px-10 py-10">

          <div className="mb-10">

            <h1 className="text-5xl font-extrabold text-[#001A47]">
              Privacy Policy
            </h1>

            <p className="mt-4 text-lg text-gray-500 max-w-3xl">
              Your privacy is important to us. This policy explains how
              UNIERA collects, stores, and protects your personal data.
            </p>

          </div>

          <div className="space-y-8">

            <div className="bg-white rounded-3xl border shadow-sm p-8">

              <div className="flex items-center gap-3 mb-5">

                <Database className="text-[#6533E2]" />

                <h2 className="text-2xl font-bold">
                  Information We Collect
                </h2>

              </div>

              <ul className="list-disc ml-6 space-y-3 text-gray-600 leading-7">
                <li>Personal information (Name, Email, Phone Number)</li>
                <li>Academic qualifications</li>
                <li>University preferences</li>
                <li>Uploaded documents</li>
                <li>Application history</li>
              </ul>

            </div>

            <div className="bg-white rounded-3xl border shadow-sm p-8">

              <div className="flex items-center gap-3 mb-5">

                <Eye className="text-blue-600" />

                <h2 className="text-2xl font-bold">
                  How We Use Your Data
                </h2>

              </div>

              <ul className="list-disc ml-6 space-y-3 text-gray-600 leading-7">
                <li>Provide personalized university recommendations.</li>
                <li>Track your application progress.</li>
                <li>Send reminders and notifications.</li>
                <li>Improve our AI recommendation system.</li>
                <li>Respond to your support requests.</li>
              </ul>

            </div>

            <div className="bg-white rounded-3xl border shadow-sm p-8">

              <div className="flex items-center gap-3 mb-5">

                <Lock className="text-green-600" />

                <h2 className="text-2xl font-bold">
                  Data Security
                </h2>

              </div>

              <p className="text-gray-600 leading-8">
                We use secure servers, encrypted communication, and
                industry-standard security practices to safeguard your
                personal information from unauthorized access.
              </p>

            </div>

            <div className="bg-white rounded-3xl border shadow-sm p-8">

              <div className="flex items-center gap-3 mb-5">

                <ShieldCheck className="text-purple-600" />

                <h2 className="text-2xl font-bold">
                  Your Rights
                </h2>

              </div>

              <ul className="list-disc ml-6 space-y-3 text-gray-600 leading-7">
                <li>Access your personal information.</li>
                <li>Update or correct your details.</li>
                <li>Request deletion of your account.</li>
                <li>Withdraw consent for notifications.</li>
              </ul>

            </div>

          </div>

          <StudentFooter />

        </main>

      </div>

    </div>
  );
}

export default PrivacyPolicy;