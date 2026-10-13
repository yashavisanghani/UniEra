// src/components/UniversityFilters.jsx

import { useState } from "react";

function UniversityFilters() {
  const [destination, setDestination] = useState("All Countries");
  const [degree, setDegree] = useState([]);
  const [tuition, setTuition] = useState(100000);
  const [ranking, setRanking] = useState("");
  const [scholarshipOnly, setScholarshipOnly] = useState(false);

  const toggleDegree = (value) => {
    setDegree((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  };

  const handleReset = () => {
    setDestination("All Countries");
    setDegree([]);
    setTuition(100000);
    setRanking("");
    setScholarshipOnly(false);
  };

  return (
    <aside className="bg-white/95 backdrop-blur-xl rounded-3xl border border-white shadow-xl p-6 sticky top-24">

      {/* ================= HEADER ================= */}

      <div className="flex items-center justify-between mb-6">

        <div>
          <p className="text-violet-600 text-xs font-bold uppercase tracking-widest">
            Discover
          </p>

          <h2 className="text-2xl font-bold text-[#001A47] mt-1">
            Filters
          </h2>
        </div>

        <button
          onClick={handleReset}
          className="text-sm text-violet-600 font-semibold hover:text-violet-800 transition"
        >
          Reset
        </button>

      </div>

      <div className="space-y-7">

        {/* ================= DESTINATION ================= */}

        <div>

          <label className="block mb-2 font-semibold text-gray-700">
            Destination
          </label>

          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 text-gray-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
          >
            <option>All Countries</option>
            <option>Australia</option>
            <option>Canada</option>
            <option>USA</option>
            <option>United Kingdom</option>
            <option>Germany</option>
            <option>Ireland</option>
          </select>

        </div>

        {/* ================= DEGREE LEVEL ================= */}

        <div>

          <label className="block mb-3 font-semibold text-gray-700">
            Degree Level
          </label>

          <div className="space-y-3">

            {[
              ["Undergraduate", "Undergraduate"],
              ["Postgraduate", "Postgraduate"],
              ["Doctorate", "Doctorate"],
            ].map(([value, label]) => (

              <label
                key={value}
                className="flex items-center gap-3 cursor-pointer group"
              >

                <input
                  type="checkbox"
                  checked={degree.includes(value)}
                  onChange={() => toggleDegree(value)}
                  className="w-4 h-4 accent-violet-600"
                />

                <span className="text-gray-600 group-hover:text-violet-700 transition">
                  {label}
                </span>

              </label>

            ))}

          </div>

        </div>

        {/* ================= TUITION ================= */}

        <div>

          <div className="flex justify-between items-center mb-2">

            <label className="font-semibold text-gray-700">
              Tuition Fee (USD)
            </label>

            <span className="text-sm font-bold text-violet-600">
              ${(tuition / 1000).toFixed(0)}K
            </span>

          </div>

          <input
            type="range"
            min="5000"
            max="100000"
            step="5000"
            value={tuition}
            onChange={(e) => setTuition(Number(e.target.value))}
            className="w-full accent-violet-600 cursor-pointer"
          />

          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>$5K</span>
            <span>$100K</span>
          </div>

        </div>

        {/* ================= QS RANKING ================= */}

        <div>

          <label className="block mb-3 font-semibold text-gray-700">
            QS Ranking
          </label>

          <div className="grid grid-cols-3 gap-2">

            {["Top 50", "Top 100", "Top 200"].map((item) => (

              <button
                key={item}
                type="button"
                onClick={() =>
                  setRanking(ranking === item ? "" : item)
                }
                className={`border rounded-xl py-2 text-sm font-medium transition ${
                  ranking === item
                    ? "bg-violet-600 text-white border-violet-600 shadow-md"
                    : "border-gray-200 text-gray-600 hover:border-violet-400 hover:text-violet-700 hover:bg-violet-50"
                }`}
              >
                {item}
              </button>

            ))}

          </div>

        </div>

        {/* ================= SCHOLARSHIP ================= */}

        <div className="flex items-center justify-between bg-violet-50 rounded-xl p-4">

          <div>

            <p className="font-semibold text-gray-700">
              Scholarship Only
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Show universities with scholarships
            </p>

          </div>

          <button
            type="button"
            onClick={() => setScholarshipOnly(!scholarshipOnly)}
            className={`relative w-11 h-6 rounded-full transition ${
              scholarshipOnly
                ? "bg-violet-600"
                : "bg-gray-300"
            }`}
          >

            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition ${
                scholarshipOnly
                  ? "left-6"
                  : "left-1"
              }`}
            />

          </button>

        </div>

        {/* ================= APPLY ================= */}

        <button
          type="button"
          className="w-full bg-gradient-to-r from-[#081D4A] to-[#6C3CE9] text-white py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition duration-300"
        >
          Apply Filters →
        </button>

      </div>

    </aside>
  );
}

export default UniversityFilters;