// src/pages/Documents.jsx

import StudentSidebar from "../components/StudentTopbar";
import StudentTopbar from "../components/StudentSidebar";
import StudentFooter from "../components/StudentFooter";
import {
  FileText,
  Upload,
  CheckCircle,
  Clock,
  Download,
} from "lucide-react";

const documents = [
  {
    name: "Passport",
    status: "Verified",
    color: "bg-green-100 text-green-700",
  },
  {
    name: "Academic Transcript",
    status: "Pending",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    name: "IELTS Scorecard",
    status: "Uploaded",
    color: "bg-blue-100 text-blue-700",
  },
  {
    name: "Statement of Purpose",
    status: "Not Uploaded",
    color: "bg-red-100 text-red-700",
  },
  {
    name: "Letter of Recommendation",
    status: "Uploaded",
    color: "bg-blue-100 text-blue-700",
  },
];

function Documents() {
  return (
    <div className="bg-[#F7F9FB] min-h-screen">
      <StudentSidebar />

      <div className="ml-72 min-h-screen flex flex-col">
        <StudentTopbar />

        <main className="flex-1 px-10 pt-28 pb-10">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-5xl font-extrabold text-[#001A47]">
                Documents
              </h1>

              <p className="mt-3 text-lg text-gray-500">
                Upload and manage your application documents.
              </p>
            </div>

            <button className="flex items-center gap-2 bg-[#6533E2] text-white px-6 py-3 rounded-xl hover:bg-[#5428c7]">
              <Upload size={18} />
              Upload Document
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-5">Document</th>
                  <th className="text-left p-5">Status</th>
                  <th className="text-center p-5">Action</th>
                </tr>
              </thead>

              <tbody>
                {documents.map((doc, index) => (
                  <tr
                    key={index}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <FileText
                          className="text-[#6533E2]"
                          size={22}
                        />

                        <span className="font-semibold text-[#001A47]">
                          {doc.name}
                        </span>
                      </div>
                    </td>

                    <td className="p-5">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${doc.color}`}
                      >
                        {doc.status}
                      </span>
                    </td>

                    <td className="p-5">
                      <div className="flex justify-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#001A47] text-white hover:bg-[#16315d]">
                          <Download size={18} />
                          Download
                        </button>

                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#6533E2] text-[#6533E2] hover:bg-[#6533E2] hover:text-white">
                          <Upload size={18} />
                          Replace
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-10">
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <CheckCircle
                className="text-green-600 mb-4"
                size={32}
              />

              <h2 className="text-3xl font-bold">2</h2>

              <p className="text-gray-500 mt-2">
                Verified Documents
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <Clock
                className="text-yellow-500 mb-4"
                size={32}
              />

              <h2 className="text-3xl font-bold">1</h2>

              <p className="text-gray-500 mt-2">
                Pending Verification
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <Upload
                className="text-[#6533E2] mb-4"
                size={32}
              />

              <h2 className="text-3xl font-bold">2</h2>

              <p className="text-gray-500 mt-2">
                Remaining Uploads
              </p>
            </div>
          </div>

          <StudentFooter />
        </main>
      </div>
    </div>
  );
}

export default Documents;