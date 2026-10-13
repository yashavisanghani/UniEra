import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import UniversityHero from "../components/UniversityHero";
import UniversityStats from "../components/UniversityStats";
import UniversityFilters from "../components/UniversityFilters";
import UniversityGrid from "../components/UniversityGrid";
import UniversityPagination from "../components/UniversityPagination";

function UniversityExplorer() {
  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #ddd6fe 0%, #c7d2fe 45%, #bfdbfe 100%)",
      }}
    >

      {/* ================= BACKGROUND GLOWS ================= */}

      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: "520px",
          height: "520px",
          top: "120px",
          left: "-200px",
          background: "rgba(124, 58, 237, 0.22)",
          filter: "blur(100px)",
          animation: "explorerGlow1 9s ease-in-out infinite",
        }}
      />

      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: "600px",
          height: "600px",
          top: "900px",
          right: "-250px",
          background: "rgba(37, 99, 235, 0.20)",
          filter: "blur(110px)",
          animation: "explorerGlow2 11s ease-in-out infinite",
        }}
      />

      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: "350px",
          height: "350px",
          top: "1800px",
          left: "40%",
          background: "rgba(168, 85, 247, 0.15)",
          filter: "blur(90px)",
          animation: "explorerGlow3 8s ease-in-out infinite",
        }}
      />

      {/* ================= NAVBAR ================= */}

      <Navbar />

      {/* ================= MAIN CONTENT ================= */}

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-28">

        {/* ================= HERO ================= */}

        <div
          style={{
            animation: "explorerFadeUp 0.7s ease-out",
          }}
        >
          <UniversityHero />
        </div>

        {/* ================= STATS ================= */}

        <div
          className="mt-8"
          style={{
            animation: "explorerFadeUp 0.8s ease-out",
          }}
        >
          <UniversityStats />
        </div>

        {/* ================= FILTER + UNIVERSITY GRID ================= */}

        <div
          className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-10"
          style={{
            animation: "explorerFadeUp 0.9s ease-out",
          }}
        >

          {/* Filters */}

          <div className="lg:col-span-1">

            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white p-1">

              <UniversityFilters />

            </div>

          </div>

          {/* University List */}

          <div className="lg:col-span-3">

            <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-4">

              <UniversityGrid />

              <UniversityPagination />

            </div>

          </div>

        </div>

      </main>

      {/* ================= FOOTER ================= */}

      <Footer />

      {/* ================= ANIMATIONS ================= */}

      <style>{`

        @keyframes explorerFadeUp {

          from {
            opacity: 0;
            transform: translateY(25px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }

        }

        @keyframes explorerGlow1 {

          0%, 100% {
            transform: translate(0, 0) scale(1);
          }

          50% {
            transform: translate(80px, 40px) scale(1.12);
          }

        }

        @keyframes explorerGlow2 {

          0%, 100% {
            transform: translate(0, 0) scale(1);
          }

          50% {
            transform: translate(-70px, -50px) scale(1.1);
          }

        }

        @keyframes explorerGlow3 {

          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-60px);
          }

        }

      `}</style>

    </div>
  );
}

export default UniversityExplorer;