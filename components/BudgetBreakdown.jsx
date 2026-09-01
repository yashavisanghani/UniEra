// src/components/BudgetBreakdown.jsx

import { PieChart } from "lucide-react";

function BudgetBreakdown() {
  return (
    <section className="bg-white rounded-[30px] border border-gray-200 shadow-sm p-6 h-full">

      {/* Header */}

      <div className="flex items-center gap-3 mb-6">

        <div className="w-11 h-11 rounded-xl bg-[#E8DEFF] flex items-center justify-center">
          <PieChart className="text-[#6533E2]" size={22} />
        </div>

        <div>

          <h2 className="text-xl font-bold text-[#001A47]">
            Budget Breakdown
          </h2>

          <p className="text-sm text-gray-500">
            Estimated yearly expenses
          </p>

        </div>

      </div>

      {/* Donut Chart */}

      <div className="flex justify-center">

        <div className="relative w-52 h-52">

          <svg
            viewBox="0 0 160 160"
            className="-rotate-90"
          >
            {/* Background */}

            <circle
              cx="80"
              cy="80"
              r="58"
              fill="none"
              stroke="#ECECEC"
              strokeWidth="14"
            />

            {/* Tuition */}

            <circle
              cx="80"
              cy="80"
              r="58"
              fill="none"
              stroke="#6533E2"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray="237 364"
            />

            {/* Housing */}

            <circle
              cx="80"
              cy="80"
              r="58"
              fill="none"
              stroke="#4ADE80"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray="91 364"
              strokeDashoffset="-237"
            />

            {/* Other */}

            <circle
              cx="80"
              cy="80"
              r="58"
              fill="none"
              stroke="#001A47"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray="36 364"
              strokeDashoffset="-328"
            />

          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">

            <span className="text-4xl font-extrabold text-[#001A47]">
              ₹42.8L
            </span>

            <span className="text-sm text-gray-500 mt-1">
              Total Cost
            </span>

          </div>

        </div>

      </div>

      {/* Legend */}

      <div className="mt-8 space-y-4">

        <div className="flex justify-between items-center">

          <div className="flex items-center gap-3">

            <span className="w-4 h-4 rounded-full bg-[#6533E2]" />

            <span className="font-medium text-gray-700">
              Tuition Fees
            </span>

          </div>

          <span className="font-bold text-[#001A47]">
            65%
          </span>

        </div>

        <div className="flex justify-between items-center">

          <div className="flex items-center gap-3">

            <span className="w-4 h-4 rounded-full bg-green-400" />

            <span className="font-medium text-gray-700">
              Accommodation
            </span>

          </div>

          <span className="font-bold text-[#001A47]">
            25%
          </span>

        </div>

        <div className="flex justify-between items-center">

          <div className="flex items-center gap-3">

            <span className="w-4 h-4 rounded-full bg-[#001A47]" />

            <span className="font-medium text-gray-700">
              Other Expenses
            </span>

          </div>

          <span className="font-bold text-[#001A47]">
            10%
          </span>

        </div>

      </div>

    </section>
  );
}

export default BudgetBreakdown;