import {
  Award,
  Globe2,
  DollarSign,
  Users,
} from "lucide-react";

const stats = [
  {
    icon: Award,
    value: "12,000+",
    label: "Scholarships",
    color: "bg-purple-100 text-[#6C3CE9]",
  },
  {
    icon: Globe2,
    value: "1+",
    label: "Countries",
    color: "bg-blue-100 text-[#081D4A]",
  },
  {
    icon: DollarSign,
    value: "150M+",
    label: "Funding Available",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Users,
    value: "98%",
    label: "Success Rate",
    color: "bg-orange-100 text-orange-500",
  },
];

const StatsSection = () => {
  return (
    <section className="py-14 sm:py-16">

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">

          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="group bg-white/95 backdrop-blur-xl rounded-3xl p-5 sm:p-7 border border-white shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-500"
                style={{
                  animation: `scholarshipStatIn ${
                    0.2 + index * 0.12
                  }s ease-out both`,
                }}
              >

                {/* Icon */}

                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-5 ${item.color} group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon size={27} />
                </div>

                {/* Number */}

                <h2 className="text-2xl sm:text-4xl font-black text-[#081D4A] group-hover:text-[#6C3CE9] transition-colors duration-300">
                  {item.value}
                </h2>

                {/* Label */}

                <p className="mt-2 text-gray-500 font-semibold text-sm sm:text-base">
                  {item.label}
                </p>

                {/* Decorative line */}

                <div className="mt-4 h-1 w-7 rounded-full bg-gradient-to-r from-[#081D4A] to-[#6C3CE9] group-hover:w-12 transition-all duration-300" />

              </div>
            );
          })}

        </div>

      </div>

      {/* Animation */}

      <style>{`

        @keyframes scholarshipStatIn {
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
};

export default StatsSection;