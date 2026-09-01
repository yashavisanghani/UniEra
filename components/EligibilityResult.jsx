import {
  CheckCircle,
  GraduationCap,
  Globe,
  Award,
  TrendingUp,
} from "lucide-react";

function EligibilityResult() {
  return (
    <section className="max-w-6xl mx-auto px-6 pb-20">

      <div className="bg-white rounded-3xl shadow-xl p-10">

        {/* Heading */}
        <div className="text-center">

          <span className="bg-green-100 text-green-700 px-5 py-2 rounded-full font-semibold">
            AI Evaluation Complete
          </span>

          <h2 className="text-4xl font-black text-[#081D4A] mt-5">
            Your Eligibility Result
          </h2>

        </div>

        {/* Score */}
        <div className="flex justify-center mt-10">

          <div className="w-48 h-48 rounded-full border-[12px] border-[#6C3CE9] flex flex-col items-center justify-center">

            <h1 className="text-6xl font-black text-[#6C3CE9]">
              0%
            </h1>

            <p className="font-semibold text-gray-500 mt-2">
              Eligible
            </p>

          </div>

        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-14">

          {/* Universities */}
          <div className="rounded-2xl border border-gray-200 p-6">

            <div className="flex items-center gap-3 mb-5">

              <GraduationCap
                className="text-[#6C3CE9]"
                size={26}
              />

              <h3 className="text-xl font-bold text-[#081D4A]">
                Universities
              </h3>

            </div>

            <ul className="space-y-3 text-gray-600">

              <li>• University of Melbourne</li>

              <li>• Monash University</li>

              <li>• University of Sydney</li>

              <li>• UNSW Sydney</li>

            </ul>

          </div>

          {/* Countries */}
          <div className="rounded-2xl border border-gray-200 p-6">

            <div className="flex items-center gap-3 mb-5">

              <Globe
                className="text-[#6C3CE9]"
                size={26}
              />

              <h3 className="text-xl font-bold text-[#081D4A]">
                Best Countries
              </h3>

            </div>

            <ul className="space-y-3 text-gray-600">

              <li>🇦🇺 Australia</li>

              <li>🇨🇦 Canada</li>

              <li>🇬🇧 United Kingdom</li>

              <li>🇩🇪 Germany</li>

            </ul>

          </div>

          {/* Scholarships */}
          <div className="rounded-2xl border border-gray-200 p-6">

            <div className="flex items-center gap-3 mb-5">

              <Award
                className="text-[#6C3CE9]"
                size={26}
              />

              <h3 className="text-xl font-bold text-[#081D4A]">
                Scholarships
              </h3>

            </div>

            <ul className="space-y-3 text-gray-600">

              <li>• Australia Awards</li>

              <li>• Chevening Scholarship</li>

              <li>• DAAD Scholarship</li>

              <li>• Vanier Scholarship</li>

            </ul>

          </div>

        </div>

        {/* Tips */}
        <div className="mt-12 rounded-3xl bg-gradient-to-r from-[#081D4A] to-[#6C3CE9] p-8 text-white">

          <div className="flex items-center gap-3 mb-6">

            <TrendingUp size={28} />

            <h3 className="text-2xl font-bold">
              Improve Your Chances
            </h3>

          </div>

          <div className="grid md:grid-cols-2 gap-5">

            <div className="flex gap-3">
              <CheckCircle className="text-green-300" />
              <p>Improve IELTS score to 7.5 or above.</p>
            </div>

            <div className="flex gap-3">
              <CheckCircle className="text-green-300" />
              <p>Maintain a CGPA above 8.5.</p>
            </div>

            <div className="flex gap-3">
              <CheckCircle className="text-green-300" />
              <p>Build a strong Statement of Purpose.</p>
            </div>

            <div className="flex gap-3">
              <CheckCircle className="text-green-300" />
              <p>Add internships and certifications.</p>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default EligibilityResult;