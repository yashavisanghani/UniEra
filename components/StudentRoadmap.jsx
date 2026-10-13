import {
  CheckCircle2,
  Circle,
  FileText,
  GraduationCap,
  Plane,
  User,
} from "lucide-react";

function StudentRoadmap() {
  const steps = [
    {
      title: "Profile Completed",
      description: "Personal details and academic profile completed.",
      completed: true,
      icon: <User size={20} />,
    },
    {
      title: "Documents Uploaded",
      description: "Passport and transcripts uploaded successfully.",
      completed: true,
      icon: <FileText size={20} />,
    },
    {
      title: "Applications Submitted",
      description: "Applications sent to selected universities.",
      completed: true,
      icon: <GraduationCap size={20} />,
    },
    {
      title: "Admission Received",
      description: "Waiting for admission decision.",
      completed: false,
      icon: <GraduationCap size={20} />,
    },
    {
      title: "Visa Approved",
      description: "Final step before beginning your journey.",
      completed: false,
      icon: <Plane size={20} />,
    },
  ];

  return (
    <div className="bg-white rounded-[28px] border border-purple-100 shadow-sm p-8">

      {/* Heading */}

      <h2 className="text-2xl font-bold text-[#001A47] mb-8">
        Journey Roadmap
      </h2>

      {/* Timeline */}

      <div className="space-y-8">

        {steps.map((step, index) => (
          <div key={index} className="flex gap-5">

            {/* Timeline */}

            <div className="flex flex-col items-center">

              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                  step.completed
                    ? "bg-gradient-to-br from-[#6533E2] to-[#8B5CF6] text-white"
                    : "bg-[#E9E2FF] text-[#6533E2]"
                }`}
              >
                {step.completed ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <Circle size={18} />
                )}
              </div>

              {index !== steps.length - 1 && (
                <div className="w-1 h-12 bg-gradient-to-b from-[#D8CFFF] to-[#DFE7FF] mt-2 rounded-full"></div>
              )}

            </div>

            {/* Content */}

            <div className="pb-6">

              <div className="flex items-center gap-2">

                <span className="text-[#6533E2]">
                  {step.icon}
                </span>

                <h3 className="font-bold text-lg text-[#001A47]">
                  {step.title}
                </h3>

              </div>

              <p className="text-gray-500 mt-2 leading-6">
                {step.description}
              </p>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default StudentRoadmap;