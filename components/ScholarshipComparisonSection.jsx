// src/components/ScholarshipComparisonSection.jsx

import {
  GitCompareArrows,
  ArrowRight,
  Check,
  X,
  Sparkles,
} from "lucide-react";

function ScholarshipComparisonSection() {
  const comparisonData = [
    ["Funding", "Fully Funded", "Partial Funding"],
    ["Tuition Fees", "100%", "75%"],
    ["Living Expenses", "Included", "Included"],
    ["Accommodation", "Free", "Not Included"],
    ["Health Insurance", "Included", "Included"],
    ["Visa Support", "Yes", "No"],
    ["Internship", "Available", "Available"],
    ["Work Rights", "20 hrs/week", "20 hrs/week"],
  ];

  const isPositive = (value) => {
    const positiveValues = [
      "Fully Funded",
      "100%",
      "Included",
      "Free",
      "Yes",
      "Available",
      "20 hrs/week",
    ];

    return positiveValues.includes(value);
  };

  return (
    <section className="py-16 sm:py-20">

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ================= HEADER ================= */}

        <div
          className="text-center mb-10"
          style={{
            animation: "comparisonFadeUp 0.7s ease-out",
          }}
        >

          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-violet-100 border border-violet-200 text-violet-700 font-semibold text-sm">

            <GitCompareArrows size={17} />

            Scholarship Comparison

          </span>

          <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-black text-[#081D4A]">

            Compare Scholarships

            <span className="block text-violet-700">
              Side by Side
            </span>

          </h2>

          <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">

            Compare scholarship benefits, funding, accommodation,
            and other important factors before making your decision.

          </p>

        </div>

        {/* ================= COMPARISON CARD ================= */}

        <div
          className="bg-white/95 backdrop-blur-xl rounded-[32px] border border-white shadow-2xl overflow-hidden"
          style={{
            animation: "comparisonFadeUp 0.9s ease-out",
          }}
        >

          {/* ================= CARD HEADER ================= */}

          <div
            className="px-6 sm:px-8 py-6 text-white"
            style={{
              background:
                "linear-gradient(135deg, #081D4A 0%, #32156F 50%, #6C3CE9 100%)",
            }}
          >

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center">

                <GitCompareArrows
                  size={24}
                  className="text-white"
                />

              </div>

              <div>

                <p className="text-purple-200 text-xs uppercase tracking-widest font-semibold">
                  Compare Options
                </p>

                <h3 className="text-xl sm:text-2xl font-bold mt-1">
                  Scholarship Comparison
                </h3>

              </div>

            </div>

          </div>

          {/* ================= TABLE ================= */}

          <div className="overflow-x-auto">

            <table className="w-full min-w-[700px]">

              <thead>

                <tr className="bg-violet-50/70">

                  <th className="text-left px-6 sm:px-8 py-5 text-[#081D4A] font-bold">
                    Feature
                  </th>

                  <th className="text-center px-6 sm:px-8 py-5 text-violet-700 font-bold">
                    Scholarship A
                  </th>

                  <th className="text-center px-6 sm:px-8 py-5 text-indigo-700 font-bold">
                    Scholarship B
                  </th>

                </tr>

              </thead>

              <tbody>

                {comparisonData.map((row, index) => (

                  <tr
                    key={index}
                    className="border-t border-gray-100 hover:bg-violet-50/40 transition duration-200"
                  >

                    {/* Feature */}

                    <td className="px-6 sm:px-8 py-5 font-semibold text-[#081D4A]">
                      {row[0]}
                    </td>

                    {/* Scholarship A */}

                    <td className="px-6 sm:px-8 py-5 text-center">

                      <div className="inline-flex items-center justify-center gap-2">

                        {isPositive(row[1]) ? (

                          <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">

                            <Check
                              size={14}
                              className="text-green-600"
                            />

                          </span>

                        ) : (

                          <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">

                            <X
                              size={14}
                              className="text-gray-400"
                            />

                          </span>

                        )}

                        <span className="text-gray-700 font-medium">
                          {row[1]}
                        </span>

                      </div>

                    </td>

                    {/* Scholarship B */}

                    <td className="px-6 sm:px-8 py-5 text-center">

                      <div className="inline-flex items-center justify-center gap-2">

                        {isPositive(row[2]) ? (

                          <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">

                            <Check
                              size={14}
                              className="text-green-600"
                            />

                          </span>

                        ) : (

                          <span className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">

                            <X
                              size={14}
                              className="text-red-500"
                            />

                          </span>

                        )}

                        <span className="text-gray-700 font-medium">
                          {row[2]}
                        </span>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* ================= FOOTER ================= */}

          <div className="px-6 sm:px-8 py-7 flex flex-col sm:flex-row items-center justify-between gap-5 bg-gray-50/70">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">

                <Sparkles
                  size={18}
                  className="text-violet-600"
                />

              </div>

              <div>

                <p className="font-semibold text-[#081D4A]">
                  Need more options?
                </p>

                <p className="text-sm text-gray-500">
                  Compare more scholarships and find your best match.
                </p>

              </div>

            </div>

            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#081D4A] to-[#6C3CE9] px-7 py-3.5 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition duration-300 whitespace-nowrap"
            >

              Compare More

              <ArrowRight size={18} />

            </button>

          </div>

        </div>

      </div>

      {/* ================= ANIMATION ================= */}

      <style>{`

        @keyframes comparisonFadeUp {

          from {
            opacity: 0;
            transform: translateY(25px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }

        }

      `}</style>

    </section>
  );
}

export default ScholarshipComparisonSection;