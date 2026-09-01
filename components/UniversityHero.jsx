// src/components/UniversityHero.jsx

import { Search, SlidersHorizontal, Sparkles, Globe2 } from "lucide-react";

function UniversityHero() {
  return (
    <section
      className="relative overflow-hidden rounded-[2rem] px-6 sm:px-10 py-16 sm:py-20 text-white shadow-2xl"
      style={{
        background:
          "linear-gradient(135deg, #06183d 0%, #17105a 45%, #6533E2 100%)",
        animation: "heroFadeIn 0.8s ease-out",
      }}
    >

      {/* ================= BACKGROUND GLOWS ================= */}

      <div
        className="absolute -top-32 -right-20 w-96 h-96 rounded-full bg-purple-500/25 blur-3xl"
        style={{
          animation: "heroFloat1 8s ease-in-out infinite",
        }}
      />

      <div
        className="absolute -bottom-40 -left-24 w-[28rem] h-[28rem] rounded-full bg-blue-500/20 blur-3xl"
        style={{
          animation: "heroFloat2 10s ease-in-out infinite",
        }}
      />

      <div
        className="absolute top-1/2 left-1/2 w-72 h-72 rounded-full bg-violet-400/10 blur-3xl"
        style={{
          animation: "heroFloat3 7s ease-in-out infinite",
        }}
      />

      {/* Decorative circles */}

      <div className="absolute top-10 left-10 w-3 h-3 rounded-full bg-white/30" />

      <div className="absolute top-24 right-1/4 w-2 h-2 rounded-full bg-purple-200/50" />

      <div className="absolute bottom-16 right-16 w-4 h-4 rounded-full bg-white/20" />

      {/* ================= CONTENT ================= */}

      <div className="relative z-10 max-w-4xl mx-auto text-center">

        {/* Small Badge */}

        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 rounded-full px-4 py-2 text-sm font-medium text-purple-100 mb-6">

          <Sparkles size={16} />

          AI-Powered University Discovery

        </div>

        {/* Heading */}

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">

          Discover Your

          <span className="block bg-gradient-to-r from-purple-200 via-white to-blue-200 bg-clip-text text-transparent">
            Dream University
          </span>

        </h1>

        {/* Description */}

        <p className="mt-6 text-base sm:text-lg text-white/75 max-w-2xl mx-auto leading-relaxed">

          Explore 50,000+ universities across the world with
          AI-powered recommendations tailored to your profile,
          goals, and study preferences.

        </p>

        {/* ================= SEARCH BAR ================= */}

        <div className="mt-10 bg-white/95 backdrop-blur-xl rounded-2xl md:rounded-full p-2 flex flex-col md:flex-row items-center gap-2 shadow-2xl">

          {/* Search Input */}

          <div className="flex items-center flex-1 px-4 sm:px-5 w-full">

            <Search
              size={21}
              className="text-gray-400 shrink-0"
            />

            <input
              type="text"
              placeholder="Search universities, countries or courses..."
              className="w-full px-3 py-3.5 outline-none text-gray-700 bg-transparent placeholder-gray-400"
            />

          </div>

          {/* Filters */}

          <button
            type="button"
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-gray-100 hover:bg-violet-100 text-[#001A47] font-semibold px-6 py-3.5 rounded-xl md:rounded-full transition duration-300"
          >

            <SlidersHorizontal size={18} />

            Filters

          </button>

          {/* Search */}

          <button
            type="button"
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#6533E2] to-[#7C3AED] hover:from-[#5427cb] hover:to-[#6D28D9] text-white font-semibold px-8 py-3.5 rounded-xl md:rounded-full shadow-lg hover:shadow-xl transition duration-300 hover:-translate-y-0.5"
          >

            <Search size={18} />

            Search

          </button>

        </div>

        {/* ================= QUICK INFO ================= */}

        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-white/70">

          <div className="flex items-center gap-2">

            <Globe2 size={17} />

            <span>150+ Countries</span>

          </div>

          <div className="w-1 h-1 rounded-full bg-white/40 hidden sm:block" />

          <div>
            50,000+ Universities
          </div>

          <div className="w-1 h-1 rounded-full bg-white/40 hidden sm:block" />

          <div>
            AI Recommendations
          </div>

        </div>

      </div>

      {/* ================= ANIMATIONS ================= */}

      <style>{`

        @keyframes heroFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes heroFloat1 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }

          50% {
            transform: translate(-40px, 35px) scale(1.12);
          }
        }

        @keyframes heroFloat2 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }

          50% {
            transform: translate(50px, -30px) scale(1.1);
          }
        }

        @keyframes heroFloat3 {
          0%, 100% {
            transform: translate(0, 0);
          }

          50% {
            transform: translate(30px, -40px);
          }
        }

      `}</style>

    </section>
  );
}

export default UniversityHero;