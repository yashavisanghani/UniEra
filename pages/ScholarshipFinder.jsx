import { useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
import FilterSidebar from "../components/FilterSidebar";
import StatsSection from "../components/StatsSection";
import ScholarshipCard from "../components/ScholarshipCard";
import SuccessStoryCard from "../components/SuccessStoryCard";
import Newsletter from "../components/Newsletter";
import ScholarshipModal from "../components/ScholarshipModal";
import AIRecommendationBanner from "../components/AIRecommendationBanner";
import PopularDestinations from "../components/PopularDestinations";
import ScholarshipComparisonSection from "../components/ScholarshipComparisonSection";
import FAQ from "../components/FAQ";

const ScholarshipFinder = () => {
  const [selectedScholarship, setSelectedScholarship] = useState(null);

  const scholarships = [
    {
      id: 1,
      title: "Clarendon Fund Scholarship",
      provider: "University of Oxford",
      country: "United Kingdom",
      amount: "Fully Funded",
      deadline: "Dec 15, 2025",
      degree: "Masters",
      category: "Merit",
    },
    {
      id: 2,
      title: "Lester B. Pearson Scholarship",
      provider: "University of Toronto",
      country: "Canada",
      amount: "$30,000",
      deadline: "Jan 10, 2026",
      degree: "Bachelor",
      category: "International",
    },
  ];

  const stories = [
    {
      name: "Priya Sharma",
      university: "University of Melbourne",
      amount: "$40,000 Scholarship",
    },
    {
      name: "Samuel Adebayo",
      university: "University of Sydney",
      amount: "Full Scholarship",
    },
    {
      name: "Elena Fischer",
      university: "University of Melbourne",
      amount: "AUS$25,000",
    },
  ];

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
          width: "500px",
          height: "500px",
          top: "250px",
          left: "-220px",
          background: "rgba(124, 58, 237, 0.20)",
          filter: "blur(110px)",
          animation: "scholarshipGlow1 9s ease-in-out infinite",
        }}
      />

      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: "600px",
          height: "600px",
          top: "1100px",
          right: "-260px",
          background: "rgba(37, 99, 235, 0.18)",
          filter: "blur(120px)",
          animation: "scholarshipGlow2 11s ease-in-out infinite",
        }}
      />

      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: "400px",
          height: "400px",
          top: "2300px",
          left: "35%",
          background: "rgba(168, 85, 247, 0.15)",
          filter: "blur(100px)",
          animation: "scholarshipGlow3 8s ease-in-out infinite",
        }}
      />

      {/* ================= NAVBAR ================= */}

      <Navbar />

      {/* ================= MAIN ================= */}

      <main className="relative z-10 pt-24">

        {/* ================= SEARCH ================= */}

        <div
          style={{
            animation: "scholarshipFadeUp 0.7s ease-out",
          }}
        >
          <SearchBar />
        </div>

        {/* ================= STATS ================= */}

        <div
          style={{
            animation: "scholarshipFadeUp 0.8s ease-out",
          }}
        >
          <StatsSection />
        </div>

        {/* ================= SCHOLARSHIP LIST ================= */}

        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">

          <div
            className="grid lg:grid-cols-4 gap-8"
            style={{
              animation: "scholarshipFadeUp 0.9s ease-out",
            }}
          >

            {/* Filters */}

            <div className="lg:col-span-1">

              <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white shadow-xl">

                <FilterSidebar />

              </div>

            </div>

            {/* Scholarship Cards */}

            <div className="lg:col-span-3 space-y-6">

              {/* Section Heading */}

              <div className="mb-5">

                <p className="text-violet-700 font-semibold text-sm uppercase tracking-widest">
                  Scholarship Opportunities
                </p>

                <h2 className="text-3xl font-black text-[#081D4A] mt-1">
                  Find Funding For Your Future
                </h2>

                <p className="text-gray-600 mt-2">
                  Explore scholarships that can help make your study-abroad
                  journey more affordable.
                </p>

              </div>

              {scholarships.map((item, index) => (

                <div
                  key={item.id}
                  style={{
                    animation: `scholarshipCardIn ${
                      0.3 + index * 0.15
                    }s ease-out both`,
                  }}
                >

                  <ScholarshipCard
                    title={item.title}
                    organization={item.provider}
                    country={item.country}
                    amount={item.amount}
                    degree={item.degree}
                    category={item.category}
                    deadline={item.deadline}
                    logo={item.image}
                    onClick={() =>
                      setSelectedScholarship(item)
                    }
                  />

                </div>

              ))}

            </div>

          </div>

        </section>

        {/* ================= AI RECOMMENDATION ================= */}

        <div
          style={{
            animation: "scholarshipFadeUp 1s ease-out",
          }}
        >
          <AIRecommendationBanner />
        </div>

        {/* ================= DESTINATIONS ================= */}

        <div
          style={{
            animation: "scholarshipFadeUp 1.1s ease-out",
          }}
        >
          <PopularDestinations />
        </div>

        {/* ================= SUCCESS STORIES ================= */}

        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">

          <div
            className="text-center mb-12"
            style={{
              animation: "scholarshipFadeUp 0.8s ease-out",
            }}
          >

            <p className="text-violet-700 font-semibold text-sm uppercase tracking-widest">
              Student Success
            </p>

            <h2 className="text-3xl sm:text-4xl font-black text-[#081D4A] mt-2">
              Success Stories
            </h2>

            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
              See how students turned their study-abroad dreams into reality
              with the right scholarship.
            </p>

          </div>

          <div className="grid md:grid-cols-3 gap-6">

            {stories.map((story, index) => (

              <div
                key={index}
                style={{
                  animation: `scholarshipCardIn ${
                    0.3 + index * 0.12
                  }s ease-out both`,
                }}
              >

                <SuccessStoryCard story={story} />

              </div>

            ))}

          </div>

        </section>

        {/* ================= COMPARISON ================= */}

        <ScholarshipComparisonSection />

        {/* ================= FAQ ================= */}

        <section className="relative">

          <FAQ />

        </section>

        {/* ================= NEWSLETTER ================= */}

        <section className="relative">

          <Newsletter />

        </section>

      </main>

      {/* ================= FOOTER ================= */}

      <Footer />

      {/* ================= SCHOLARSHIP MODAL ================= */}

      {selectedScholarship && (
        <ScholarshipModal
          scholarship={selectedScholarship}
          onClose={() => setSelectedScholarship(null)}
        />
      )}

      {/* ================= ANIMATIONS ================= */}

      <style>{`

        @keyframes scholarshipFadeUp {
          from {
            opacity: 0;
            transform: translateY(25px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scholarshipCardIn {
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
            transform: translate(70px, 40px) scale(1.12);
          }
        }

        @keyframes scholarshipGlow2 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }

          50% {
            transform: translate(-60px, -50px) scale(1.1);
          }
        }

        @keyframes scholarshipGlow3 {
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
};

export default ScholarshipFinder;