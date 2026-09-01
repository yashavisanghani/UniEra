// src/pages/TermsConditions.jsx

import StudentSidebar from "../components/StudentTopbar";
import StudentTopbar from "../components/StudentSidebar";
import StudentFooter from "../components/StudentFooter";
import {
  FileCheck,
  UserCheck,
  Shield,
  AlertTriangle,
} from "lucide-react";

function TermsConditions() {
  return (
    <div className="bg-[#F7F9FB] min-h-screen">
      <StudentSidebar />

      <div className="ml-72 min-h-screen flex flex-col">
        <StudentTopbar />

        <main className="flex-1 px-10 py-10">

          <div className="mb-10">

            <h1 className="text-5xl font-extrabold text-[#001A47]">
              Terms & Conditions
            </h1>

            <p className="mt-4 text-lg text-gray-500 max-w-3xl">
              By using UNIERA, you agree to comply with the following
              terms and conditions governing the use of our platform.
            </p>

          </div>

          <div className="space-y-8">

            <div className="bg-white rounded-3xl border shadow-sm p-8">

              <div className="flex items-center gap-3 mb-5">

                <UserCheck className="text-[#6533E2]" />

                <h2 className="text-2xl font-bold">
                  User Responsibilities
                </h2>

              </div>

              <ul className="list-disc ml-6 space-y-3 text-gray-600 leading-7">
                <li>Provide accurate personal and academic information.</li>
                <li>Keep your account credentials secure.</li>
                <li>Use the platform only for lawful purposes.</li>
                <li>Do not impersonate another user.</li>
              </ul>

            </div>

            <div className="bg-white rounded-3xl border shadow-sm p-8">

              <div className="flex items-center gap-3 mb-5">

                <FileCheck className="text-green-600" />

                <h2 className="text-2xl font-bold">
                  Application Information
                </h2>

              </div>

              <p className="text-gray-600 leading-8">
                UNIERA provides application tracking and university
                recommendations. Admission decisions are made solely by
                the respective universities.
              </p>

            </div>

            <div className="bg-white rounded-3xl border shadow-sm p-8">

              <div className="flex items-center gap-3 mb-5">

                <Shield className="text-blue-600" />

                <h2 className="text-2xl font-bold">
                  Intellectual Property
                </h2>

              </div>

              <p className="text-gray-600 leading-8">
                All content, branding, graphics, and software available
                on UNIERA are protected by intellectual property laws and
                may not be copied or redistributed without permission.
              </p>

            </div>

            <div className="bg-white rounded-3xl border shadow-sm p-8">

              <div className="flex items-center gap-3 mb-5">

                <AlertTriangle className="text-red-500" />

                <h2 className="text-2xl font-bold">
                  Limitation of Liability
                </h2>

              </div>

              <p className="text-gray-600 leading-8">
                UNIERA is not responsible for admission outcomes, visa
                approvals, scholarship decisions, or delays caused by
                universities or third-party organizations.
              </p>

            </div>

          </div>

          <StudentFooter />

        </main>
      </div>
    </div>
  );
}

export default TermsConditions;