// src/components/SmartInsights.jsx

import {
  Lightbulb,
  TrendingUp,
  Award,
  ArrowRight,
} from "lucide-react";

function SmartInsights() {
  return (
    <section className="mt-8">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Smart Tip */}

        <div className="bg-white rounded-[30px] border border-gray-200 shadow-sm p-7 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">

          <div className="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center">

            <Lightbulb
              size={28}
              className="text-yellow-600"
            />

          </div>

          <h3 className="mt-6 text-2xl font-bold text-[#001A47]">
            Smart Tip
          </h3>

          <p className="mt-4 text-gray-500 leading-7">
            Choosing university accommodation during your first year
            can reduce living expenses by nearly
            <span className="font-semibold text-[#001A47]">
              {" "}15%
            </span>
            .
          </p>

          <button className="mt-6 flex items-center gap-2 text-[#6533E2] font-semibold hover:gap-3 transition-all">

            Learn More

            <ArrowRight size={18} />

          </button>

        </div>

        {/* Currency Hedge */}

        <div className="bg-gradient-to-br from-[#6533E2] to-[#001A47] rounded-[30px] shadow-lg text-white p-7 hover:-translate-y-1 transition-all duration-300">

          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">

            <TrendingUp size={28} />

          </div>

          <h3 className="mt-6 text-2xl font-bold">
            Currency Hedge
          </h3>

          <p className="mt-4 text-white/90 leading-7">
            Exchange rates fluctuate throughout the year.
            Locking tuition payments early could help you save
            significantly if your destination currency appreciates.
          </p>

          <button className="mt-6 flex items-center gap-2 font-semibold hover:gap-3 transition-all">

            View Forecast

            <ArrowRight size={18} />

          </button>

        </div>

        {/* Grant Eligible */}

        <div className="bg-white rounded-[30px] border border-gray-200 shadow-sm p-7 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">

          <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">

            <Award
              size={28}
              className="text-green-600"
            />

          </div>

          <h3 className="mt-6 text-2xl font-bold text-[#001A47]">
            Grant Eligible
          </h3>

          <p className="mt-4 text-gray-500 leading-7">
            Based on your academic profile, you may qualify for
            scholarships covering up to
            <span className="font-semibold text-[#001A47]">
              {" "}₹6,00,000
            </span>
            of your annual education expenses.
          </p>

          <button className="mt-6 flex items-center gap-2 text-green-600 font-semibold hover:gap-3 transition-all">

            Explore Grants

            <ArrowRight size={18} />

          </button>

        </div>

      </div>

    </section>
  );
}

export default SmartInsights;