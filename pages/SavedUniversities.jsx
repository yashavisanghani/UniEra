// src/pages/SavedUniversities.jsx

import StudentSidebar from "../components/StudentTopbar";
import StudentTopbar from "../components/StudentSidebar";
import StudentFooter from "../components/StudentFooter";
import { Heart, MapPin, Star, ExternalLink } from "lucide-react";

const universities = [
  {
    name: "University of Melbourne",
    location: "Melbourne, Australia",
    ranking: "#14",
    course: "Master of IT",
    fee: "$45,500 AUD / year",
  },
  {
    name: "University of Sydney",
    location: "Sydney, Australia",
    ranking: "#19",
    course: "Master of Data Science",
    fee: "$49,000 AUD / year",
  },
  {
    name: "Monash University",
    location: "Melbourne, Australia",
    ranking: "#42",
    course: "Master of AI",
    fee: "$44,000 AUD / year",
  },
  {
    name: "UNSW Sydney",
    location: "Sydney, Australia",
    ranking: "#34",
    course: "Master of Cyber Security",
    fee: "$47,200 AUD / year",
  },
];

function SavedUniversities() {
  return (
    <div
  className="min-h-screen"
  style={{
    background:
      "linear-gradient(135deg, #E9E2FF 0%, #DFE7FF 50%, #E0F0FF 100%)",
  }}
>

      <StudentSidebar />

      <div className="ml-72 min-h-screen flex flex-col">

        <StudentTopbar />

        <main className="flex-1 px-10 pt-28 pb-10">

          <div className="mb-10">

            <h1 className="text-5xl font-extrabold text-[#001A47]">
              Saved Universities
            </h1>

            <p className="mt-3 text-lg text-gray-500">
              Universities you've bookmarked for future applications.
            </p>

          </div>

          <div className="grid lg:grid-cols-2 gap-6">

            {universities.map((uni, index) => (

              <div
                key={index}
                className="bg-white rounded-3xl border border-gray-200 shadow-sm p-7 hover:shadow-xl transition"
              >

                <div className="flex justify-between items-start">

                  <div>

                    <h2 className="text-2xl font-bold text-[#001A47]">
                      {uni.name}
                    </h2>

                    <div className="flex items-center gap-2 mt-2 text-gray-500">

                      <MapPin size={16} />

                      {uni.location}

                    </div>

                  </div>

                  <button className="text-red-500">

                    <Heart fill="currentColor" size={22} />

                  </button>

                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">

                  <div className="bg-gray-50 rounded-xl p-4">

                    <p className="text-sm text-gray-500">
                      World Ranking
                    </p>

                    <h3 className="text-2xl font-bold mt-2">
                      {uni.ranking}
                    </h3>

                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">

                    <p className="text-sm text-gray-500">
                      Tuition Fee
                    </p>

                    <h3 className="text-lg font-bold mt-2">
                      {uni.fee}
                    </h3>

                  </div>

                </div>

                <div className="mt-6">

                  <p className="text-sm text-gray-500">
                    Recommended Course
                  </p>

                  <h3 className="text-xl font-semibold mt-2">
                    {uni.course}
                  </h3>

                </div>

                <div className="flex gap-3 mt-8">

                  <button className="flex-1 h-12 rounded-xl bg-[#001A47] text-white font-semibold hover:bg-[#173972]">

                    Apply Now

                  </button>

                  <button className="px-5 rounded-xl border border-[#6533E2] text-[#6533E2] hover:bg-[#6533E2] hover:text-white transition">

                    <ExternalLink size={18} />

                  </button>

                </div>

              </div>

            ))}

          </div>

          <StudentFooter />

        </main>

      </div>

    </div>
  );
}

export default SavedUniversities;