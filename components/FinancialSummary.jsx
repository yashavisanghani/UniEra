// src/components/FinancialSummary.jsx

import { TrendingUp } from "lucide-react";

function FinancialSummary() {
  return (
    <section className="bg-white rounded-[30px] border border-gray-200 shadow-sm p-8">

      <div className="flex flex-col md:flex-row items-center gap-8">

        {/* Circular Cost */}

        <div className="relative flex justify-center">

          <div className="relative w-44 h-44">

            <svg
              className="-rotate-90"
              viewBox="0 0 160 160"
            >
              {/* Background */}

              <circle
                cx="80"
                cy="80"
                r="68"
                fill="none"
                stroke="#E8DEFF"
                strokeWidth="12"
              />

              {/* Progress */}

              <circle
                cx="80"
                cy="80"
                r="68"
                fill="none"
                stroke="#6533E2"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray="427"
                strokeDashoffset="105"
              />

            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">

              <span className="uppercase tracking-[0.2em] text-[10px] text-gray-400 font-bold">
                Est. Total
              </span>

              <h2 className="text-5xl font-extrabold text-[#001A47]">
                ₹42.8L
              </h2>

              <span className="text-[#6533E2] text-sm font-semibold mt-2">
                Per Program
              </span>

            </div>

            {/* Floating Icon */}

            <div className="absolute top-2 right-2 w-10 h-10 rounded-full bg-[#6533E2] flex items-center justify-center shadow-lg">

              <TrendingUp
                size={18}
                className="text-white"
              />

            </div>

          </div>

        </div>

        {/* Details */}

        <div className="flex-1">

          <h2 className="text-3xl font-bold text-[#001A47]">
            Financial Summary
          </h2>

          <p className="text-gray-500 leading-7 mt-4">
            Based on current university benchmarks, your estimated
            first-year education cost is approximately
            <span className="font-bold text-[#001A47]">
              {" "}
              ₹42,80,000
            </span>
            . This includes tuition fees, accommodation, transport,
            insurance and daily living expenses.
          </p>

          {/* Cost Cards */}

          <div className="grid grid-cols-2 gap-4 mt-8">

            <div className="rounded-2xl bg-[#F3EEFF] p-5">

              <p className="uppercase text-xs tracking-widest font-bold text-[#6533E2]">
                Tuition
              </p>

              <h3 className="mt-2 text-3xl font-bold text-[#001A47]">
                ₹28.5L
              </h3>

            </div>

            <div className="rounded-2xl bg-[#ECFFF5] p-5">

              <p className="uppercase text-xs tracking-widest font-bold text-green-600">
                Living
              </p>

              <h3 className="mt-2 text-3xl font-bold text-[#001A47]">
                ₹14.3L
              </h3>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default FinancialSummary;