// src/pages/MyApplications.jsx

import StudentSidebar from "../components/StudentTopbar";
import StudentTopbar from "../components/StudentSidebar";
import StudentFooter from "../components/StudentFooter";
import { Search, Filter, Eye } from "lucide-react";

const applications = [
  {
    university: "University of Melbourne",
    course: "Master of Information Technology",
    intake: "July 2026",
    status: "Applied",
    color: "bg-blue-100 text-blue-700",
  },
  {
    university: "University of Sydney",
    course: "Master of Data Science",
    intake: "July 2026",
    status: "Offer Received",
    color: "bg-green-100 text-green-700",
  },
  {
    university: "Monash University",
    course: "Master of Artificial Intelligence",
    intake: "February 2027",
    status: "Under Review",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    university: "UNSW Sydney",
    course: "Master of Cyber Security",
    intake: "July 2026",
    status: "Rejected",
    color: "bg-red-100 text-red-700",
  },
];

function MyApplications() {
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

          <div className="flex justify-between items-center mb-8">

            <div>

              <h1 className="text-5xl font-extrabold text-[#001A47]">
                My Applications
              </h1>

              <p className="text-gray-500 mt-3 text-lg">
                Track all your university applications.
              </p>

            </div>

            <button className="bg-[#6533E2] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#5429c5]">
              + New Application
            </button>

          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 mb-8 flex gap-4">

            <div className="flex-1 relative">

              <Search
                size={18}
                className="absolute left-4 top-4 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search university..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border outline-none focus:border-[#6533E2]"
              />

            </div>

            <button className="flex items-center gap-2 px-5 rounded-xl border hover:bg-gray-100">

              <Filter size={18} />

              Filter

            </button>

          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">

            <table className="w-full">

              <thead className="bg-gray-50">

                <tr>

                  <th className="text-left p-5">University</th>
                  <th className="text-left p-5">Course</th>
                  <th className="text-left p-5">Intake</th>
                  <th className="text-left p-5">Status</th>
                  <th className="text-center p-5">Action</th>

                </tr>

              </thead>

              <tbody>

                {applications.map((app, index) => (

                  <tr
                    key={index}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="p-5 font-semibold text-[#001A47]">
                      {app.university}
                    </td>

                    <td className="p-5">
                      {app.course}
                    </td>

                    <td className="p-5">
                      {app.intake}
                    </td>

                    <td className="p-5">

                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${app.color}`}
                      >
                        {app.status}
                      </span>

                    </td>

                    <td className="p-5 text-center">

                      <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#001A47] text-white hover:bg-[#173972]">

                        <Eye size={18} />

                        View

                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          <StudentFooter />

        </main>

      </div>

    </div>
  );
}

export default MyApplications;