// src/pages/AboutUs.jsx

import StudentSidebar from "../components/StudentTopbar";
import StudentTopbar from "../components/StudentSidebar";
import StudentFooter from "../components/StudentFooter";
import {
  GraduationCap,
  Globe,
  Target,
  Users,
  CheckCircle2,
} from "lucide-react";

function AboutUs() {
  return (
    <div className="bg-[#F7F9FB] min-h-screen">
      <StudentSidebar />

      <div className="ml-72 min-h-screen flex flex-col">
        <StudentTopbar />

        <main className="flex-1 px-10 py-10">

          <div className="mb-10">

            <h1 className="text-5xl font-extrabold text-[#001A47]">
              About UNIERA
            </h1>

            <p className="mt-4 text-lg text-gray-500 max-w-3xl">
              UNIERA is an AI-powered study abroad platform that helps
              students discover universities, manage applications,
              track deadlines, and achieve their dream of studying overseas.
            </p>

          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-10">

            <div className="bg-white rounded-3xl shadow-sm border p-8">

              <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center mb-6">
                <Target className="text-[#6533E2]" size={30} />
              </div>

              <h2 className="text-2xl font-bold mb-3">
                Our Mission
              </h2>

              <p className="text-gray-500 leading-7">
                To simplify the study abroad journey through intelligent
                guidance, personalized recommendations, and seamless
                application tracking.
              </p>

            </div>

            <div className="bg-white rounded-3xl shadow-sm border p-8">

              <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mb-6">
                <Globe className="text-green-600" size={30} />
              </div>

              <h2 className="text-2xl font-bold mb-3">
                Our Vision
              </h2>

              <p className="text-gray-500 leading-7">
                To become the world's most trusted digital platform
                connecting students with global education opportunities.
              </p>

            </div>

            <div className="bg-white rounded-3xl shadow-sm border p-8">

              <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mb-6">
                <Users className="text-purple-600" size={30} />
              </div>

              <h2 className="text-2xl font-bold mb-3">
                Our Community
              </h2>

              <p className="text-gray-500 leading-7">
                Thousands of students trust UNIERA to manage applications,
                scholarships, visa preparation, and university selection.
              </p>

            </div>

          </div>

          <div className="bg-white rounded-3xl shadow-sm border p-10">

            <div className="flex items-center gap-3 mb-8">

              <GraduationCap
                className="text-[#6533E2]"
                size={32}
              />

              <h2 className="text-3xl font-bold text-[#001A47]">
                Why Choose UNIERA?
              </h2>

            </div>

            <div className="grid md:grid-cols-2 gap-6">

              {[
                "AI-powered university recommendations",
                "Personalized eligibility analysis",
                "Application deadline tracker",
                "Scholarship discovery",
                "Document management",
                "Progress dashboard",
                "Visa preparation roadmap",
                "24×7 student support",
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2
                    className="text-green-600"
                    size={22}
                  />

                  <span className="text-gray-700 text-lg">
                    {item}
                  </span>
                </div>
              ))}

            </div>

          </div>

          <StudentFooter />

        </main>
      </div>
    </div>
  );
}

export default AboutUs;