import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import FilterChip from "./FilterChip";

const filters = [
  "All",
  "Fully Funded",
  "Masters",
  "PhD",
  "Engineering",
];

const SearchBar = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  return (
    <section
      className="relative overflow-hidden py-24 sm:py-28"
      style={{
        background:
          "linear-gradient(135deg, #06183d 0%, #21145f 48%, #6C3CE9 100%)",
        animation: "scholarshipHeroFade 0.8s ease-out",
      }}
    >

      {/* ================= BACKGROUND GLOWS ================= */}

      <div
        className="absolute -top-40 -right-32 w-[600px] h-[600px] rounded-full bg-purple-400/20 blur-[140px]"
        style={{
          animation: "scholarshipGlow1 9s ease-in-out infinite",
        }}
      />

      <div
        className="absolute -bottom-40 -left-32 w-[500px] h-[500px] rounded-full bg-blue-400/20 blur-[130px]"
        style={{
          animation: "scholarshipGlow2 11s ease-in-out infinite",
        }}
      />

      <div className="absolute top-20 left-20 w-3 h-3 rounded-full bg-white/30" />
      <div className="absolute top-32 right-1/4 w-2 h-2 rounded-full bg-purple-200/50" />
      <div className="absolute bottom-20 right-20 w-4 h-4 rounded-full bg-white/20" />

      {/* ================= CONTENT ================= */}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">

        {/* Badge */}

        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 backdrop-blur-md text-white px-5 py-2.5 rounded-full text-sm font-semibold mb-6">

          <Sparkles
            size={16}
            className="text-yellow-300"
          />

          12,000+ Global Scholarships

        </div>

        {/* Heading */}

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">

          Discover Scholarships

          <br />

          That Match

          <span className="block bg-gradient-to-r from-purple-200 via-white to-blue-200 bg-clip-text text-transparent">
            Your Dream
          </span>

        </h1>

        {/* Description */}

        <p className="mt-7 text-base sm:text-lg text-white/75 max-w-2xl mx-auto leading-relaxed">

          Explore fully funded and partially funded scholarships from
          top universities across the world and find opportunities
          that match your goals.

        </p>

        {/* ================= SEARCH BOX ================= */}

        <div className="mt-10 bg-white/95 backdrop-blur-xl rounded-2xl md:rounded-full p-2 shadow-2xl">

          <div className="flex flex-col md:flex-row items-center gap-2">

            {/* Input */}

            <div className="flex items-center flex-1 w-full px-4">

              <Search
                size={21}
                className="text-gray-400 shrink-0"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search scholarships, universities or countries..."
                className="flex-1 px-3 py-3.5 outline-none text-gray-700 bg-transparent placeholder-gray-400"
              />

            </div>

            {/* Search Button */}

            <button
              type="button"
              className="w-full md:w-auto bg-gradient-to-r from-[#081D4A] to-[#6C3CE9] text-white px-8 py-3.5 rounded-xl md:rounded-full font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition duration-300"
            >
              Search
            </button>

          </div>

        </div>

        {/* ================= FILTER CHIPS ================= */}

        <div className="flex flex-wrap justify-center gap-2.5 mt-8">

          {filters.map((filter) => (

            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`rounded-full transition-all duration-300 ${
                activeFilter === filter
                  ? "scale-105 shadow-lg"
                  : "hover:scale-105"
              }`}
            >

              <FilterChip
                label={filter}
                active={activeFilter === filter}
              />

            </button>

          ))}

        </div>

        {/* Small helper text */}

        <p className="mt-6 text-sm text-white/50">
          Search by scholarship name, university, country, degree or field.
        </p>

      </div>

      {/* ================= ANIMATIONS ================= */}

      <style>{`

        @keyframes scholarshipHeroFade {
          from {
            opacity: 0;
            transform: translateY(20px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scholarshipGlow1 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }

          50% {
            transform: translate(-50px, 40px) scale(1.12);
          }
        }

        @keyframes scholarshipGlow2 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }

          50% {
            transform: translate(50px, -30px) scale(1.1);
          }
        }

      `}</style>

    </section>
  );
};

export default SearchBar;