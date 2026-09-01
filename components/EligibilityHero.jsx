import { Sparkles, CheckCircle } from "lucide-react";

function EligibilityHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#081D4A] via-[#2B2F8A] to-[#6C3CE9] py-24">

      {/* Background Glow */}
      <div className="absolute -top-40 right-0 w-[600px] h-[600px] rounded-full bg-white/10 blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-purple-300/20 blur-[120px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">

        <div className="text-center">

          <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-white px-5 py-2 rounded-full text-sm font-semibold mb-6">
            <Sparkles size={16} />
            AI Powered Eligibility Checker
          </span>

          <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight">
            Check Your Admission
            <br />
            <span className="text-[#D8C7FF]">
              Eligibility
            </span>
          </h1>

          <p className="mt-8 text-lg text-gray-200 max-w-3xl mx-auto leading-8">
            Discover your chances of getting admitted to top universities
            based on your academic profile, budget, preferred country,
            and English proficiency.
          </p>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16">

          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 text-center border border-white/10">

            <h2 className="text-4xl font-bold text-white">
              40+
            </h2>

            <p className="text-white/80 mt-2">
              Universities
            </p>

          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 text-center border border-white/10">

            <h2 className="text-4xl font-bold text-white">
              5+
            </h2>

            <p className="text-white/80 mt-2">
              Countries
            </p>

          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 text-center border border-white/10">

            <h2 className="text-4xl font-bold text-white">
              95%
            </h2>

            <p className="text-white/80 mt-2">
              AI Accuracy
            </p>

          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 text-center border border-white/10 flex flex-col items-center">

            <CheckCircle
              size={40}
              className="text-green-300 mb-2"
            />

            <p className="text-white font-semibold">
              Instant Results
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}

export default EligibilityHero;