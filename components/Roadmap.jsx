import {
  GraduationCap,
  Search,
  FileCheck,
  Plane,
} from "lucide-react";

function Roadmap() {
  const steps = [
    {
      icon: <Search size={30} />,
      title: "Discover",
      description:
        "Explore universities, courses and scholarships that perfectly match your profile.",
    },
    {
      icon: <GraduationCap size={30} />,
      title: "Apply",
      description:
        "Complete applications with document verification and expert guidance.",
    },
    {
      icon: <FileCheck size={30} />,
      title: "Get Approved",
      description:
        "Track admission offers, scholarships and visa documentation in one dashboard.",
    },
    {
      icon: <Plane size={30} />,
      title: "Fly Abroad",
      description:
        "Prepare for departure with accommodation, travel and onboarding assistance.",
    },
  ];

  return (
    <section className="py-20 bg-transparent">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center">

          <h2 className="text-5xl font-black text-[#081D4A]">
            Your Journey Starts Here
          </h2>

          <p className="mt-5 text-lg text-slate-600 max-w-3xl mx-auto">
            UNIERA guides you from choosing the perfect university
            to landing safely in your dream country.
          </p>

        </div>

        <div className="relative mt-24">

          {/* Vertical Line */}

          <div className="absolute left-1/2 top-0 hidden lg:block h-full w-1 -translate-x-1/2 bg-gradient-to-b from-[#6C3CE9] to-[#081D4A] rounded-full"></div>

          <div className="space-y-16">

            {steps.map((step, index) => (

              <div
                key={index}
                className={`flex flex-col lg:flex-row items-center gap-8 ${
                  index % 2 !== 0 ? "lg:flex-row-reverse" : ""
                }`}
              >

                {/* Card */}

                <div className="w-full lg:w-5/12">

                  <div className="rounded-3xl bg-white p-8 shadow-xl hover:shadow-2xl duration-300">

                    <div className="w-16 h-16 rounded-2xl bg-[#ECECFF] flex items-center justify-center text-[#6C3CE9]">

                      {step.icon}

                    </div>

                    <h3 className="mt-6 text-3xl font-bold text-[#081D4A]">
                      {step.title}
                    </h3>

                    <p className="mt-4 text-slate-600 leading-8">
                      {step.description}
                    </p>

                  </div>

                </div>

                {/* Timeline Circle */}

                <div className="hidden lg:flex w-2/12 justify-center">

                  <div className="w-10 h-10 rounded-full bg-[#6C3CE9] border-8 border-white shadow-lg"></div>

                </div>

                <div className="hidden lg:block w-5/12"></div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </section>
  );
}

export default Roadmap;