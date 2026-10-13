import {
  Check,
  FileText,
  Mail,
  BadgeCheck,
  Plane,
} from "lucide-react";

const steps = [
  {
    title: "Profile Complete",
    status: "Completed",
    deadline: "Jan 15",
    icon: <Check size={22} />,
    active: false,
    completed: true,
  },
  {
    title: "Univ. Selection",
    status: "Completed",
    deadline: "Feb 10",
    icon: <Check size={22} />,
    active: false,
    completed: true,
  },
  {
    title: "English Exam",
    status: "In Progress",
    deadline: "Mar 30",
    icon: <FileText size={22} />,
    active: true,
    completed: false,
  },
  {
    title: "Offer Letter",
    status: "Locked",
    deadline: "May 15",
    icon: <Mail size={22} />,
    active: false,
    completed: false,
  },
  {
    title: "Visa Process",
    status: "Locked",
    deadline: "July 01",
    icon: <BadgeCheck size={22} />,
    active: false,
    completed: false,
  },
  {
    title: "Travel Prep",
    status: "Locked",
    deadline: "Aug 20",
    icon: <Plane size={22} />,
    active: false,
    completed: false,
  },
];

function RoadmapTimeline() {
  return (
    <section className="relative mt-10 overflow-x-auto pb-8">

      <div className="min-w-[1180px] relative">

        {/* Timeline Line */}

        <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full"></div>

        <div className="flex justify-between relative z-10">

          {steps.map((step, index) => (

            <div
              key={index}
              className="w-44 flex flex-col items-center text-center"
            >

              {/* Circle */}

              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-4 border-white
                ${
                  step.completed
                    ? "bg-emerald-400 text-white"
                    : step.active
                    ? "bg-[#6533E2] text-white animate-pulse"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {step.icon}
              </div>

              {/* Card */}

              <div
                className={`mt-6 w-full rounded-2xl border bg-white p-4 shadow-sm
                ${
                  step.completed
                    ? "border-emerald-400"
                    : step.active
                    ? "border-[#6533E2] shadow-lg"
                    : "opacity-60"
                }`}
              >

                <h3 className="font-bold text-[#001A47]">
                  {step.title}
                </h3>

                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold
                  ${
                    step.completed
                      ? "bg-emerald-100 text-emerald-600"
                      : step.active
                      ? "bg-purple-100 text-[#6533E2]"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step.status}
                </span>

                <p className="mt-6 text-sm text-gray-500">
                  Deadline: {step.deadline}
                </p>

                {step.active && (
                  <>
                    <button className="mt-4 w-full rounded-lg bg-[#6533E2] text-white py-2 text-sm font-semibold hover:bg-[#5429c5] transition">
                      Submit Scores
                    </button>
                  </>
                )}

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default RoadmapTimeline;