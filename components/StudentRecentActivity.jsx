import {
  FileCheck,
  GraduationCap,
  Bell,
  Upload,
} from "lucide-react";

function StudentRecentActivity() {
  const activities = [
    {
      icon: <Upload size={18} />,
      title: "Passport Uploaded",
      description: "Your passport has been verified successfully.",
      time: "2 hours ago",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: <GraduationCap size={18} />,
      title: "Application Submitted",
      description: "Application sent to Stanford University.",
      time: "Yesterday",
      color: "bg-[#E9E2FF] text-[#6533E2]",
    },
    {
      icon: <FileCheck size={18} />,
      title: "Transcript Approved",
      description: "Academic transcript has been approved.",
      time: "2 days ago",
      color: "bg-[#DFE7FF] text-[#3155A6]",
    },
    {
      icon: <Bell size={18} />,
      title: "Scholarship Alert",
      description: "New scholarship matching your profile is available.",
      time: "3 days ago",
      color: "bg-yellow-100 text-yellow-600",
    },
  ];

  return (
    <div className="bg-white rounded-[28px] border border-purple-100 shadow-sm p-8">

      {/* Header */}

      <div className="flex justify-between items-center mb-8">

        <h2 className="text-2xl font-bold text-[#001A47]">
          Recent Activity
        </h2>

        <button className="text-[#6533E2] font-semibold hover:underline">
          View All
        </button>

      </div>

      {/* Activities */}

      <div className="space-y-6">

        {activities.map((activity, index) => (

          <div
            key={index}
            className="flex gap-5 items-start p-4 rounded-2xl hover:bg-[#F8F6FF] transition-all duration-300"
          >

            {/* Icon */}

            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${activity.color}`}
            >
              {activity.icon}
            </div>

            {/* Content */}

            <div className="flex-1 min-w-0">

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">

                <h3 className="font-semibold text-[#001A47]">
                  {activity.title}
                </h3>

                <span className="text-sm text-gray-400 whitespace-nowrap">
                  {activity.time}
                </span>

              </div>

              <p className="text-gray-500 mt-1 leading-6">
                {activity.description}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default StudentRecentActivity;