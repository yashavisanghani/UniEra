import { Users, GraduationCap, Award, Globe } from "lucide-react";

function Stats() {
  const stats = [
    {
      icon: <Users size={34} />,
      value: "0+",
      title: "Students Guided",
      color: "bg-purple-100 text-purple-700",
    },
    {
      icon: <GraduationCap size={34} />,
      value: "0+",
      title: "Partner Universities",
      color: "bg-blue-100 text-blue-700",
    },
    {
      icon: <Award size={34} />,
      value: "0+",
      title: "Scholarships",
      color: "bg-green-100 text-green-700",
    },
    {
      icon: <Globe size={34} />,
      value: "5",
      title: "Countries",
      color: "bg-orange-100 text-orange-700",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-r from-[#081D4A] via-[#102A67] to-[#6C3CE9]">

      <div className="max-w-7xl mx-auto px-6">

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {stats.map((item, index) => (

            <div
              key={index}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 text-center hover:scale-105 hover:bg-white/20 transition duration-300"
            >

              <div
                className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center ${item.color}`}
              >
                {item.icon}
              </div>

              <h2 className="mt-6 text-5xl font-black text-white">
                {item.value}
              </h2>

              <p className="mt-3 text-lg text-gray-200">
                {item.title}
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default Stats;