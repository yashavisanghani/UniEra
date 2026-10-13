// src/components/YearlyComparison.jsx

import { BarChart3, TrendingUp } from "lucide-react";

function YearlyComparison() {
  const yearlyData = [
    {
      year: "YR1",
      amount: "₹42.8L",
      height: "h-32",
      color: "bg-[#6533E2]",
    },
    {
      year: "YR2",
      amount: "₹45.1L",
      height: "h-40",
      color: "bg-[#7C4DFF]",
    },
    {
      year: "YR3",
      amount: "₹47.6L",
      height: "h-48",
      color: "bg-[#001A47]",
    },
  ];

  return (
    <section className="bg-white rounded-[30px] border border-gray-200 shadow-sm p-6 h-full">

      {/* Header */}

      <div className="flex items-center justify-between mb-8">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-[#E8DEFF] flex items-center justify-center">
            <BarChart3 className="text-[#6533E2]" size={22} />
          </div>

          <div>

            <h2 className="text-xl font-bold text-[#001A47]">
              Yearly Comparison
            </h2>

            <p className="text-sm text-gray-500">
              Projected study cost
            </p>

          </div>

        </div>

        <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">

          <TrendingUp size={16} />

          +5% / Year

        </div>

      </div>

      {/* Bar Chart */}

      <div className="h-72 flex items-end justify-around gap-6 border-b border-l border-gray-200 pb-4 pl-3">

        {yearlyData.map((item) => (
          <div
            key={item.year}
            className="flex flex-col items-center flex-1"
          >

            <span className="text-xs font-semibold text-[#001A47] mb-3">
              {item.amount}
            </span>

            <div
              className={`${item.height} w-14 ${item.color} rounded-t-2xl hover:scale-105 transition-all duration-300`}
            />

            <span className="mt-4 font-bold text-gray-600">
              {item.year}
            </span>

          </div>
        ))}

      </div>

      {/* Footer */}

      <div className="mt-6 rounded-2xl bg-[#F8F9FC] p-4">

        <div className="flex justify-between items-center">

          <span className="text-gray-500">
            Average Annual Increase
          </span>

          <span className="font-bold text-[#6533E2]">
            5.6%
          </span>

        </div>

        <div className="mt-3 w-full h-2 rounded-full bg-gray-200 overflow-hidden">

          <div className="h-full w-[56%] bg-gradient-to-r from-[#6533E2] to-[#001A47]" />

        </div>

      </div>

    </section>
  );
}

export default YearlyComparison;