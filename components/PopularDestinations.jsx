// src/components/PopularDestinations.jsx

import { Globe, ArrowRight, Sparkles } from "lucide-react";

const destinations = [
  {
    country: "Australia",
    flag: "🇦🇺",
    scholarships: "2,300+ Scholarships",
    funding: "Up to AUD 50,000",
    universities: "University of Melbourne • Monash • UNSW",
    image:
      "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800",
  },
  {
    country: "Canada",
    flag: "🇨🇦",
    scholarships: "1,850+ Scholarships",
    funding: "Up to CAD 45,000",
    universities: "Toronto • UBC • McGill",
    image:
      "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800",
  },
  {
    country: "United Kingdom",
    flag: "🇬🇧",
    scholarships: "2,100+ Scholarships",
    funding: "Fully Funded",
    universities: "Oxford • Cambridge • Imperial",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800",
  },
  {
    country: "United States",
    flag: "🇺🇸",
    scholarships: "4,000+ Scholarships",
    funding: "Up to $80,000",
    universities: "MIT • Harvard • Stanford",
    image:
      "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800",
  },
];

function PopularDestinations() {
  return (
    <section className="py-16">

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ================= HEADER ================= */}

        <div
          className="text-center mb-12"
          style={{
            animation: "destinationFadeUp 0.7s ease-out",
          }}
        >

          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-violet-100 border border-violet-200 text-violet-700 font-semibold text-sm">

            <Sparkles size={16} />

            Popular Destinations

          </span>

          <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-black text-[#081D4A]">

            Explore Scholarships
            <span className="block text-violet-700">
              by Country
            </span>

          </h2>

          <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">

            Discover top destinations offering world-class education
            and generous scholarship opportunities.

          </p>

        </div>

        {/* ================= DESTINATION CARDS ================= */}

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

          {destinations.map((item, index) => (

            <div
              key={item.country}
              className="group bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden border border-white shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-500"
              style={{
                animation: `destinationFadeUp ${
                  0.2 + index * 0.12
                }s ease-out both`,
              }}
            >

              {/* ================= IMAGE ================= */}

              <div className="relative h-52 overflow-hidden">

                <img
                  src={item.image}
                  alt={item.country}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Image overlay */}

                <div className="absolute inset-0 bg-gradient-to-t from-[#081D4A]/70 via-transparent to-transparent" />

                {/* Country badge */}

                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-full px-3 py-1.5 shadow-lg">

                  <span className="text-sm font-bold text-gray-800">
                    {item.flag} {item.country}
                  </span>

                </div>

                {/* Globe icon */}

                <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg">

                  <Globe
                    size={19}
                    className="text-violet-600"
                  />

                </div>

              </div>

              {/* ================= CONTENT ================= */}

              <div className="p-6">

                <h3 className="text-xl font-bold text-[#081D4A]">
                  {item.country}
                </h3>

                {/* Scholarships */}

                <div className="mt-4">

                  <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                    Scholarships
                  </p>

                  <p className="mt-1 font-bold text-violet-700">
                    {item.scholarships}
                  </p>

                </div>

                {/* Funding */}

                <div className="mt-3">

                  <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                    Funding
                  </p>

                  <p className="mt-1 text-gray-700 font-medium">
                    {item.funding}
                  </p>

                </div>

                {/* Universities */}

                <div className="mt-4 pt-4 border-t border-gray-100">

                  <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">
                    Top Universities
                  </p>

                  <p className="text-sm text-gray-500 leading-6">
                    {item.universities}
                  </p>

                </div>

                {/* Explore */}

                <button
                  type="button"
                  className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl bg-violet-50 text-violet-700 font-semibold py-3 hover:bg-violet-600 hover:text-white transition-all duration-300 group/explore"
                >

                  Explore

                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover/explore:translate-x-1"
                  />

                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* ================= ANIMATION ================= */}

      <style>{`

        @keyframes destinationFadeUp {
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

export default PopularDestinations;