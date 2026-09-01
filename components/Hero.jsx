import { Link } from "react-router-dom";
import heroImage from "../assets/sydney-opera.jpg";
import FadeIn from "./FadeIn";

function Hero() {
  return (
    <section className="py-28 bg-gradient-to-br from-[#E9E2FF] via-[#DFE7FF] to-[#E0F0FF]">

      {/* Background Blur */}
      <div className="absolute -top-40 right-0 w-[700px] h-[700px] rounded-full bg-purple-300/20 blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-blue-200/20 blur-[120px]" />

      <FadeIn>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-20 items-center relative z-10">

          {/* Left Side */}
          <div>

            <h1 className="text-5xl lg:text-7xl font-black leading-tight text-[#081D4A]">
              Your Path Abroad,
              <br />
              <span className="text-[#6C3CE9]">
                Made Easy
              </span>
            </h1>

            <p className="mt-8 text-lg leading-8 text-slate-600 max-w-xl">
              Helping students discover universities,
              scholarships, estimate costs and manage every
              step of studying abroad.
            </p>

            <div className="mt-10 flex flex-wrap gap-5">

              <Link
                to="/signup"
                className="rounded-2xl bg-gradient-to-r from-[#081D4A] to-[#6C3CE9] px-8 py-4 text-white font-semibold shadow-xl hover:scale-105 duration-300"
              >
                Get Started →
              </Link>

              <Link
                to="/universities"
                className="rounded-2xl border border-slate-300 bg-white px-8 py-4 font-semibold hover:bg-slate-100 duration-300"
              >
                Explore Universities
              </Link>

            </div>

          </div>

          {/* Right Side */}
          <div className="relative">

            <div className="rounded-[36px] bg-white/70 backdrop-blur-xl p-5 shadow-2xl border border-white">

              <div className="relative overflow-hidden rounded-[28px]">

                <img
                  src={heroImage}
                  alt="Sydney Opera House"
                  className="w-full h-[550px] object-cover object-center"
                />

                {/* Admission Card */}
                <div className="absolute left-5 top-5 rounded-2xl bg-white p-4 shadow-xl">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6C3CE9] text-white">
                      🎓
                    </div>

                    <div>

                      <h3 className="text-sm font-bold text-[#081D4A]">
                        Admission Secured
                      </h3>

                      <p className="text-xs text-gray-500">
                        Australian University
                      </p>

                    </div>

                  </div>

                </div>

                {/* Scholarship Card */}
                <div className="absolute right-5 bottom-5 rounded-2xl bg-white p-4 shadow-xl">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                      💰
                    </div>

                    <div>

                      <h3 className="text-sm font-bold text-[#081D4A]">
                        Scholarship Awarded
                      </h3>

                      <p className="text-xs text-gray-500">
                        $25,000 Support
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

            <div className="absolute -left-4 -top-4 h-full w-full rounded-[40px] border-2 border-[#6C3CE9]/20 -z-10"></div>

          </div>

        </div>
      </FadeIn>

    </section>
  );
}

export default Hero;