// src/components/UniversityStats.jsx

import { Globe2, GraduationCap, Award, Users } from "lucide-react";

const stats = [
  {
    number: "0+",
    label: "Universities",
    icon: GraduationCap,
  },
  {
    number: "1+",
    label: "Countries Covered",
    icon: Globe2,
  },
  {
    number: "0+",
    label: "Scholarships",
    icon: Award,
  },
  {
    number: "0+",
    label: "Students Helped",
    icon: Users,
  },
];

function UniversityStats() {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-5 mt-10">

      {stats.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={index}
            className="group bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-white shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-400 text-center"
            style={{
              animation: `statsFadeUp ${
                0.2 + index * 0.12
              }s ease-out both`,
            }}
          >

            {/* Icon */}

            <div className="mx-auto w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center group-hover:bg-violet-600 transition duration-300">

              <Icon
                size={23}
                className="text-violet-600 group-hover:text-white transition duration-300"
              />

            </div>

            {/* Number */}

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#001A47] mt-5 group-hover:text-violet-700 transition">

              {item.number}

            </h2>

            {/* Label */}

            <p className="mt-2 text-gray-500 font-semibold uppercase tracking-wider text-xs sm:text-sm">

              {item.label}

            </p>

            {/* Decorative Line */}

            <div className="mx-auto mt-4 h-1 w-8 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 group-hover:w-14 transition-all duration-300" />

          </div>
        );
      })}

      {/* Animation */}

      <style>{`

        @keyframes statsFadeUp {

          from {
            opacity: 0;
            transform: translateY(20px);
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

export default UniversityStats;