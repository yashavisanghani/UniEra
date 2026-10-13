import {
  Sparkles,
  ArrowRight,
  Brain,
  Target,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

function AIRecommendationBanner() {
  return (
    <section className="py-14 sm:py-20">

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div
          className="relative overflow-hidden rounded-[32px] p-7 sm:p-10 lg:p-12 shadow-2xl"
          style={{
            background:
              "linear-gradient(135deg, #06183d 0%, #21145f 45%, #6C3CE9 100%)",
            animation: "aiBannerFade 0.8s ease-out",
          }}
        >

          {/* ================= BACKGROUND GLOWS ================= */}

          <div
            className="absolute -top-40 -right-32 w-[28rem] h-[28rem] rounded-full bg-purple-400/20 blur-3xl"
            style={{
              animation: "aiGlow1 8s ease-in-out infinite",
            }}
          />

          <div
            className="absolute -bottom-40 -left-32 w-[28rem] h-[28rem] rounded-full bg-blue-400/15 blur-3xl"
            style={{
              animation: "aiGlow2 10s ease-in-out infinite",
            }}
          />

          <div className="absolute top-10 right-20 w-3 h-3 rounded-full bg-white/30" />
          <div className="absolute bottom-16 left-1/3 w-2 h-2 rounded-full bg-purple-200/50" />
          <div className="absolute top-1/2 left-10 w-2 h-2 rounded-full bg-blue-200/40" />

          {/* ================= CONTENT ================= */}

          <div className="relative z-10 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* ================= LEFT ================= */}

            <div>

              {/* Badge */}

              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 backdrop-blur-md rounded-full px-4 py-2 mb-6">

                <Sparkles
                  className="text-yellow-300"
                  size={18}
                />

                <span className="font-semibold text-white text-sm">
                  AI Scholarship Match
                </span>

              </div>

              {/* Heading */}

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">

                Let AI Find

                <span className="block bg-gradient-to-r from-purple-200 via-white to-blue-200 bg-clip-text text-transparent">
                  Scholarships Perfect For You
                </span>

              </h2>

              {/* Description */}

              <p className="mt-5 text-base sm:text-lg leading-7 text-white/75 max-w-xl">

                Our AI analyzes your academic profile, GPA, preferred
                country, budget, and career goals to recommend scholarships
                that match your profile.

              </p>

              {/* ================= FEATURES ================= */}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-7">

                {/* Smart Matching */}

                <div className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-xl p-3 backdrop-blur-sm hover:bg-white/15 transition">

                  <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">

                    <Brain
                      size={18}
                      className="text-purple-200"
                    />

                  </div>

                  <span className="text-sm text-white/80 font-medium">
                    Smart Matching
                  </span>

                </div>

                {/* Personalized */}

                <div className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-xl p-3 backdrop-blur-sm hover:bg-white/15 transition">

                  <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">

                    <Target
                      size={18}
                      className="text-blue-200"
                    />

                  </div>

                  <span className="text-sm text-white/80 font-medium">
                    Personalized
                  </span>

                </div>

                {/* Fast Results */}

                <div className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-xl p-3 backdrop-blur-sm hover:bg-white/15 transition">

                  <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">

                    <Zap
                      size={18}
                      className="text-yellow-200"
                    />

                  </div>

                  <span className="text-sm text-white/80 font-medium">
                    Fast Results
                  </span>

                </div>

              </div>

            </div>

            {/* ================= RIGHT ================= */}

            <div className="flex flex-col items-center lg:items-end">

              {/* AI Visual */}

              <div className="relative w-44 h-44 sm:w-52 sm:h-52 mb-7">

                {/* Outer Circle */}

                <div
                  className="absolute inset-0 rounded-full bg-white/10 border border-white/10 backdrop-blur-md"
                  style={{
                    animation: "aiPulse 4s ease-in-out infinite",
                  }}
                />

                {/* Middle Circle */}

                <div
                  className="absolute inset-4 rounded-full border border-white/10"
                  style={{
                    animation: "aiRotate 12s linear infinite",
                  }}
                />

                {/* AI Core */}

                <div className="absolute inset-8 rounded-full bg-gradient-to-br from-violet-500/70 to-blue-400/40 flex items-center justify-center shadow-2xl">

                  <Sparkles
                    size={54}
                    className="text-white"
                  />

                </div>

                {/* Orbit Dots */}

                <span className="absolute top-1 left-1/2 w-3 h-3 bg-purple-200 rounded-full shadow-lg" />

                <span className="absolute bottom-5 right-3 w-2.5 h-2.5 bg-blue-200 rounded-full" />

                <span className="absolute left-3 bottom-10 w-2 h-2 bg-yellow-200 rounded-full" />

              </div>

              {/* ================= BUTTONS ================= */}

              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 w-full lg:w-auto">

                {/* AI Recommendation */}

                <Link
                  to="/profile"
                  className="flex items-center justify-center gap-2 rounded-xl bg-white text-[#6C3CE9] px-7 py-3.5 font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition duration-300 whitespace-nowrap"
                >

                  <Sparkles size={17} />

                  Get AI Recommendations

                </Link>

                {/* Profile */}

                <Link
                  to="/profile"
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/40 text-white px-7 py-3.5 font-semibold hover:bg-white/10 hover:-translate-y-1 transition duration-300 whitespace-nowrap"
                >

                  Build My Profile

                  <ArrowRight size={18} />

                </Link>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ================= ANIMATIONS ================= */}

      <style>{`

        @keyframes aiBannerFade {
          from {
            opacity: 0;
            transform: translateY(25px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes aiGlow1 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }

          50% {
            transform: translate(-40px, 40px) scale(1.12);
          }
        }

        @keyframes aiGlow2 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }

          50% {
            transform: translate(50px, -30px) scale(1.1);
          }
        }

        @keyframes aiPulse {
          0%, 100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.06);
          }
        }

        @keyframes aiRotate {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

      `}</style>

    </section>
  );
}

export default AIRecommendationBanner;