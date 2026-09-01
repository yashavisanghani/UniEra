// src/components/CostInputForm.jsx

import {
  Calculator,
  GraduationCap,
  Building2,
  Home,
  Bus,
  Utensils,
  Shield,
} from "lucide-react";

function CostInputForm() {
  return (
    <section className="bg-white rounded-[30px] border border-gray-200 shadow-sm p-8">

      {/* Header */}

      <div className="flex items-center gap-3 mb-8">

        <div className="w-12 h-12 rounded-xl bg-[#E8DEFF] flex items-center justify-center">
          <Calculator className="text-[#6533E2]" size={24} />
        </div>

        <div>

          <h2 className="text-2xl font-bold text-[#001A47]">
            Input Variables
          </h2>

          <p className="text-gray-500">
            Estimate your yearly expenses
          </p>

        </div>

      </div>

      <div className="space-y-6">

        {/* University */}

        <div>

          <label className="block text-sm font-semibold text-gray-600 mb-2">
            University Destination
          </label>

          <div className="relative">

            <select className="w-full rounded-xl bg-gray-100 border border-transparent py-4 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-[#6533E2]/20">

              <option>Imperial College London</option>
              <option>University of Oxford</option>
              <option>University of Cambridge</option>
              <option>Stanford University</option>
              <option>MIT</option>

            </select>

            <Building2
              size={18}
              className="absolute right-4 top-4 text-gray-400"
            />

          </div>

        </div>

        {/* Course */}

        <div>

          <label className="block text-sm font-semibold text-gray-600 mb-2">
            Course of Study
          </label>

          <div className="relative">

            <select className="w-full rounded-xl bg-gray-100 border border-transparent py-4 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-[#6533E2]/20">

              <option>MSc. Artificial Intelligence</option>
              <option>MSc. Data Science</option>
              <option>MBA</option>
              <option>BSc. Computer Science</option>

            </select>

            <GraduationCap
              size={18}
              className="absolute right-4 top-4 text-gray-400"
            />

          </div>

        </div>

        {/* Accommodation + Transport */}

        <div className="grid grid-cols-2 gap-5">

          <div>

            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Accommodation
            </label>

            <div className="relative">

              <select className="w-full rounded-xl bg-gray-100 border border-transparent py-4 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-[#6533E2]/20">

                <option>University Hall</option>
                <option>Private Apartment</option>
                <option>Shared Apartment</option>

              </select>

              <Home
                size={18}
                className="absolute right-3 top-4 text-gray-400"
              />

            </div>

          </div>

          <div>

            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Transport
            </label>

            <div className="relative">

              <select className="w-full rounded-xl bg-gray-100 border border-transparent py-4 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-[#6533E2]/20">

                <option>Public Pass</option>
                <option>Taxi</option>
                <option>Bicycle</option>

              </select>

              <Bus
                size={18}
                className="absolute right-3 top-4 text-gray-400"
              />

            </div>

          </div>

        </div>

        {/* Food + Insurance */}

        <div className="grid grid-cols-2 gap-5">

          <div>

            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Food Plan
            </label>

            <div className="relative">

              <select className="w-full rounded-xl bg-gray-100 border border-transparent py-4 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-[#6533E2]/20">

                <option>Self Cooking</option>
                <option>Meal Plan</option>
                <option>Dining Out</option>

              </select>

              <Utensils
                size={18}
                className="absolute right-3 top-4 text-gray-400"
              />

            </div>

          </div>

          <div>

            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Health Insurance
            </label>

            <div className="relative">

              <select className="w-full rounded-xl bg-gray-100 border border-transparent py-4 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-[#6533E2]/20">

                <option>Standard Global</option>
                <option>Premium Plus</option>
                <option>Student Basic</option>

              </select>

              <Shield
                size={18}
                className="absolute right-3 top-4 text-gray-400"
              />

            </div>

          </div>

        </div>

      </div>

      {/* Button */}

      <div className="mt-8 pt-8 border-t border-gray-200">

        <button className="w-full bg-gradient-to-r from-[#001A47] to-[#6533E2] text-white text-lg font-bold py-4 rounded-2xl shadow-lg hover:scale-[1.02] transition">

          Recalculate Estimates

        </button>

      </div>

    </section>
  );
}

export default CostInputForm;