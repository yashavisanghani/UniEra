import { Download } from "lucide-react";

function CostEstimatorHeader() {
  return (
    <section className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

      {/* Left */}

      <div>

        <p className="text-[#6533E2] font-semibold uppercase tracking-[0.2em] text-sm">
          Module 8
        </p>

        <h1 className="mt-2 text-5xl font-extrabold text-[#001A47]">
          Global Cost Estimator
        </h1>

        <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-500">
          Accurately project your international education expenses.
          Our smart calculator adjusts for inflation and local living
          standards.
        </p>

      </div>

      {/* Right */}

      <button className="flex items-center gap-3 rounded-2xl bg-[#001A47] px-7 py-4 text-white font-semibold shadow-lg hover:bg-[#0B2E6B] transition">

        <Download size={20} />

        Download PDF Report

      </button>

    </section>
  );
}

export default CostEstimatorHeader;