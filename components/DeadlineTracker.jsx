// src/components/DeadlineTracker.jsx

import {
  CalendarDays,
  FileText,
  ArrowRight,
} from "lucide-react";

const deadlines = [
  {
    title: "IELTS Exam Date",
    location: "British Council, City Center",
    date: "March 28, 2024",
    remaining: "5 Days Remaining",
    danger: true,
  },
  {
    title: "Transcript Submission",
    location: "Kings College London Portal",
    date: "April 05, 2024",
    remaining: "12 Days Remaining",
    danger: false,
  },
];

function DeadlineTracker() {
  return (
    <div className="bg-white rounded-[28px] border border-gray-200 shadow-sm p-8">

      <div className="flex justify-between items-center mb-8">

        <h2 className="text-3xl font-bold text-[#001A47]">
          Deadline Tracker
        </h2>

        <button className="flex items-center gap-2 text-[#6533E2] font-semibold hover:gap-3 transition-all">
          View All
          <ArrowRight size={18} />
        </button>

      </div>

      <div className="space-y-5">

        {deadlines.map((item, index) => (

          <div
            key={index}
            className="flex justify-between items-center rounded-2xl border border-gray-200 bg-[#FAFBFC] p-5 hover:shadow-md transition"
          >

            <div className="flex items-center gap-5">

              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                  item.danger
                    ? "bg-red-100 text-red-600"
                    : "bg-blue-100 text-[#001A47]"
                }`}
              >
                {item.danger ? (
                  <CalendarDays size={24} />
                ) : (
                  <FileText size={24} />
                )}
              </div>

              <div>

                <h3 className="text-lg font-bold text-[#001A47]">
                  {item.title}
                </h3>

                <p className="text-gray-500 mt-1">
                  {item.location}
                </p>

              </div>

            </div>

            <div className="text-right">

              <h4
                className={`font-bold text-lg ${
                  item.danger
                    ? "text-red-600"
                    : "text-[#001A47]"
                }`}
              >
                {item.date}
              </h4>

              <p className="text-sm text-gray-500 mt-1">
                {item.remaining}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default DeadlineTracker;