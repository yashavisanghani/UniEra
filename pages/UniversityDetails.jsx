import Footer from "../components/Footer";

export default function UniversityDetailsPart2() {
  const stats = [
    ["#12", "World Ranking"],
    ["£24k/year", "Average Tuition"],
    ["Jan & Sept", "Intakes"],
    ["42%", "International Students"],
  ];

  const programs = [
    {
      title: "MBA in Global Innovation",
      details: "24 Months • Full Time",
    },
    {
      title: "MSc Artificial Intelligence",
      details: "12 Months • Hybrid",
    },
  ];

  const campusImages = [
    "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a",
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644",
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f",
  ];

  return (
    <>
      <main
        className="relative min-h-screen overflow-hidden pt-28 pb-16 px-4 sm:px-6"
        style={{
          background:
            "linear-gradient(135deg, #ddd6fe 0%, #c7d2fe 45%, #bfdbfe 100%)",
        }}
      >

        {/* Background Glow 1 */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "500px",
            height: "500px",
            background: "rgba(124, 58, 237, 0.25)",
            filter: "blur(100px)",
            top: "100px",
            left: "-180px",
            animation: "universityGlow1 8s ease-in-out infinite",
          }}
        />

        {/* Background Glow 2 */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "550px",
            height: "550px",
            background: "rgba(37, 99, 235, 0.25)",
            filter: "blur(110px)",
            right: "-220px",
            top: "500px",
            animation: "universityGlow2 10s ease-in-out infinite",
          }}
        />

        {/* Background Glow 3 */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "300px",
            height: "300px",
            background: "rgba(168, 85, 247, 0.18)",
            filter: "blur(80px)",
            left: "45%",
            bottom: "100px",
            animation: "universityGlow3 7s ease-in-out infinite",
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto">

          {/* ================= HEADER ================= */}

          <div
            className="mb-10"
            style={{
              animation: "universityFadeUp 0.7s ease-out",
            }}
          >
            <p className="text-violet-700 font-semibold uppercase tracking-widest text-sm mb-2">
              University Information
            </p>

            <h1 className="text-4xl md:text-5xl font-bold text-[#081D4A]">
              University Details
            </h1>

            <p className="mt-3 text-gray-700 max-w-2xl text-lg">
              Explore programs, admission requirements, tuition,
              rankings and campus life.
            </p>
          </div>

          {/* ================= STATISTICS ================= */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {stats.map(([value, title], index) => (
              <div
                key={title}
                className="rounded-2xl p-6 bg-white/90 backdrop-blur-xl border border-white shadow-xl transition duration-300 hover:-translate-y-2"
                style={{
                  animation: `universityFadeUp ${
                    0.2 + index * 0.1
                  }s ease-out`,
                }}
              >
                <p className="text-sm font-medium text-gray-500">
                  {title}
                </p>

                <p className="text-3xl font-bold text-[#081D4A] mt-3">
                  {value}
                </p>

                <div className="mt-4 h-1 w-12 rounded-full bg-gradient-to-r from-violet-600 to-indigo-500" />
              </div>
            ))}

          </div>

          {/* ================= FEATURED PROGRAMS ================= */}

          <section className="mt-14">

            <div className="mb-6">

              <p className="text-violet-700 font-semibold text-sm uppercase tracking-wider">
                Study Options
              </p>

              <h2 className="text-3xl font-bold text-[#081D4A] mt-1">
                Featured Programs
              </h2>

              <p className="text-gray-700 mt-2">
                Explore popular programs offered by the university.
              </p>

            </div>

            <div className="grid md:grid-cols-2 gap-6">

              {programs.map((program, index) => (
                <div
                  key={program.title}
                  className="rounded-2xl p-7 bg-white/90 backdrop-blur-xl border border-white shadow-xl transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
                  style={{
                    animation: `universityFadeUp ${
                      0.4 + index * 0.15
                    }s ease-out`,
                  }}
                >

                  <div className="flex items-start gap-4">

                    <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">

                      <span className="text-violet-700 font-bold text-lg">
                        {index + 1}
                      </span>

                    </div>

                    <div>

                      <h3 className="text-xl font-bold text-[#081D4A]">
                        {program.title}
                      </h3>

                      <p className="mt-3 text-gray-600">
                        {program.details}
                      </p>

                    </div>

                  </div>

                  <button className="mt-6 text-violet-600 font-semibold hover:text-violet-800 transition">
                    View Program →
                  </button>

                </div>
              ))}

            </div>

          </section>

          {/* ================= ADMISSION REQUIREMENTS ================= */}

          <section className="mt-14">

            <div
              className="rounded-3xl p-8 md:p-10 text-white shadow-2xl"
              style={{
                background:
                  "linear-gradient(135deg, #081D4A 0%, #32156F 50%, #7C3AED 100%)",
                animation: "universityFadeUp 0.8s ease-out",
              }}
            >

              <p className="text-purple-200 font-semibold uppercase tracking-wider text-sm">
                Before You Apply
              </p>

              <h2 className="text-3xl md:text-4xl font-bold mt-2">
                Admission Requirements
              </h2>

              <p className="text-purple-100 mt-3">
                Make sure you meet the following requirements
                before starting your application.
              </p>

              <ul className="mt-7 space-y-4">

                <li className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center font-bold">
                    ✓
                  </span>

                  <span>
                    GPA <strong>3.5/4.0</strong>
                  </span>
                </li>

                <li className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center font-bold">
                    ✓
                  </span>

                  <span>
                    IELTS <strong>7.5</strong>
                  </span>
                </li>

                <li className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center font-bold">
                    ✓
                  </span>

                  <span>
                    Statement of Purpose & <strong>2 LORs</strong>
                  </span>
                </li>

              </ul>

            </div>

          </section>

          {/* ================= CAMPUS LIFE ================= */}

          <section className="mt-14">

            <div className="mb-6">

              <p className="text-violet-700 font-semibold text-sm uppercase tracking-wider">
                Experience
              </p>

              <h2 className="text-3xl font-bold text-[#081D4A] mt-1">
                Campus Life
              </h2>

              <p className="text-gray-700 mt-2">
                Get a glimpse of the student experience.
              </p>

            </div>

            <div className="grid md:grid-cols-3 gap-5">

              {campusImages.map((image, index) => (
                <div
                  key={image}
                  className="group overflow-hidden rounded-2xl shadow-xl bg-white"
                  style={{
                    animation: `universityFadeUp ${
                      0.5 + index * 0.15
                    }s ease-out`,
                  }}
                >

                  <img
                    src={image}
                    alt={`University campus ${index + 1}`}
                    className="w-full h-64 object-cover transition duration-700 group-hover:scale-110"
                  />

                </div>
              ))}

            </div>

          </section>

        </div>

        {/* Page-specific animations */}
        <style>{`
          @keyframes universityFadeUp {
            from {
              opacity: 0;
              transform: translateY(25px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes universityGlow1 {
            0%, 100% {
              transform: translate(0, 0);
            }

            50% {
              transform: translate(70px, 40px);
            }
          }

          @keyframes universityGlow2 {
            0%, 100% {
              transform: translate(0, 0);
            }

            50% {
              transform: translate(-70px, -40px);
            }
          }

          @keyframes universityGlow3 {
            0%, 100% {
              transform: translateY(0);
            }

            50% {
              transform: translateY(-50px);
            }
          }
        `}</style>

      </main>

      <Footer />
    </>
  );
}