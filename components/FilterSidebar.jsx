import { useState } from "react";
import {
  SlidersHorizontal,
  RotateCcw,
  Check,
} from "lucide-react";

const FilterSidebar = () => {
  const [country, setCountry] = useState("Australia");
  const [cgpa, setCgpa] = useState(3.2);
  const [degrees, setDegrees] = useState(["Master's"]);
  const [scholarshipType, setScholarshipType] = useState("Fully Funded");
  const [ielts, setIelts] = useState("");
  const [intake, setIntake] = useState("February");

  const toggleDegree = (degree) => {
    setDegrees((current) =>
      current.includes(degree)
        ? current.filter((item) => item !== degree)
        : [...current, degree]
    );
  };

  const resetFilters = () => {
    setCountry("Australia");
    setCgpa(3.2);
    setDegrees(["Master's"]);
    setScholarshipType("Fully Funded");
    setIelts("");
    setIntake("February");
  };

  return (
    <aside className="w-full">

      <div className="sticky top-24 rounded-3xl bg-white/95 backdrop-blur-xl border border-white shadow-xl p-6">

        {/* ================= HEADER ================= */}

        <div className="flex items-center justify-between mb-7">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
              <SlidersHorizontal
                size={19}
                className="text-violet-600"
              />
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-violet-600 font-bold">
                Refine
              </p>

              <h2 className="text-xl font-bold text-[#081D4A]">
                Filters
              </h2>
            </div>

          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="flex items-center gap-1.5 text-violet-600 font-semibold text-sm hover:text-violet-800 transition"
          >
            <RotateCcw size={14} />
            Reset
          </button>

        </div>

        <div className="space-y-7">

          {/* ================= COUNTRY ================= */}

          <div>

            <label className="block text-sm font-semibold text-[#081D4A] mb-2">
              Country
            </label>

            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-gray-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            >
              <option>Australia</option>
              <option>Canada</option>
              <option>United Kingdom</option>
              <option>USA</option>
              <option>Germany</option>
              <option>Ireland</option>
            </select>

          </div>

          {/* ================= DEGREE ================= */}

          <div>

            <label className="block text-sm font-semibold text-[#081D4A] mb-3">
              Degree
            </label>

            <div className="space-y-3">

              {["Bachelor's", "Master's", "PhD"].map((degree) => (

                <label
                  key={degree}
                  className="flex items-center gap-3 cursor-pointer group"
                >

                  <input
                    type="checkbox"
                    checked={degrees.includes(degree)}
                    onChange={() => toggleDegree(degree)}
                    className="w-4 h-4 accent-violet-600"
                  />

                  <span className="text-gray-600 group-hover:text-violet-700 transition">
                    {degree}
                  </span>

                </label>

              ))}

            </div>

          </div>

          {/* ================= SCHOLARSHIP TYPE ================= */}

          <div>

            <label className="block text-sm font-semibold text-[#081D4A] mb-3">
              Scholarship Type
            </label>

            <div className="flex flex-wrap gap-2">

              {["Fully Funded", "Partial", "Merit"].map((type) => (

                <button
                  key={type}
                  type="button"
                  onClick={() => setScholarshipType(type)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    scholarshipType === type
                      ? "bg-violet-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-violet-100 hover:text-violet-700"
                  }`}
                >
                  {type}
                </button>

              ))}

            </div>

          </div>

          {/* ================= GPA ================= */}

          <div>

            <div className="flex items-center justify-between mb-3">

              <label className="text-sm font-semibold text-[#081D4A]">
                Minimum GPA
              </label>

              <span className="bg-violet-100 text-violet-700 px-2.5 py-1 rounded-lg text-sm font-bold">
                {Number(cgpa).toFixed(1)}
              </span>

            </div>

            <input
              type="range"
              min="2"
              max="4"
              step="0.1"
              value={cgpa}
              onChange={(e) => setCgpa(Number(e.target.value))}
              className="w-full accent-violet-600 cursor-pointer"
            />

            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>2.0</span>
              <span>4.0</span>
            </div>

          </div>

          {/* ================= IELTS ================= */}

          <div>

            <label className="block text-sm font-semibold text-[#081D4A] mb-3">
              IELTS
            </label>

            <div className="grid grid-cols-2 gap-3">

              {["Required", "Not Required"].map((option) => (

                <button
                  key={option}
                  type="button"
                  onClick={() => setIelts(option)}
                  className={`rounded-xl border py-3 text-sm font-medium transition ${
                    ielts === option
                      ? "border-violet-600 bg-violet-50 text-violet-700"
                      : "border-gray-200 text-gray-600 hover:border-violet-400 hover:bg-violet-50"
                  }`}
                >
                  {option}
                </button>

              ))}

            </div>

          </div>

          {/* ================= INTAKE ================= */}

          <div>

            <label className="block text-sm font-semibold text-[#081D4A] mb-2">
              Intake
            </label>

            <select
              value={intake}
              onChange={(e) => setIntake(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-gray-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            >
              <option>February</option>
              <option>July</option>
              <option>September</option>
            </select>

          </div>

          {/* ================= SELECTED FILTERS ================= */}

          {(degrees.length > 0 ||
            scholarshipType ||
            ielts) && (

            <div className="bg-violet-50 rounded-2xl p-4">

              <p className="text-xs uppercase tracking-wider font-bold text-violet-600 mb-3">
                Active Filters
              </p>

              <div className="space-y-2 text-sm text-gray-600">

                {degrees.map((degree) => (
                  <div
                    key={degree}
                    className="flex items-center gap-2"
                  >
                    <Check
                      size={14}
                      className="text-violet-600"
                    />
                    {degree}
                  </div>
                ))}

                <div className="flex items-center gap-2">
                  <Check
                    size={14}
                    className="text-violet-600"
                  />
                  {scholarshipType}
                </div>

                {ielts && (
                  <div className="flex items-center gap-2">
                    <Check
                      size={14}
                      className="text-violet-600"
                    />
                    IELTS: {ielts}
                  </div>
                )}

              </div>

            </div>

          )}

          {/* ================= APPLY ================= */}

          <button
            type="button"
            className="w-full rounded-xl bg-gradient-to-r from-[#081D4A] to-[#6C3CE9] py-4 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition duration-300"
          >
            Apply Filters →
          </button>

        </div>

      </div>

    </aside>
  );
};

export default FilterSidebar;