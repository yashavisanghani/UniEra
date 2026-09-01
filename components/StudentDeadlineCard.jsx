import { CalendarDays, Clock } from "lucide-react";

function DeadlineCard() {
  const deadlines = [
    {
      title: "Early Action Deadline",
      university: "Stanford University",
      date: "15 Aug",
      days: "12 Days Left",
      color: "bg-red-100 text-red-600",
    },
    {
      title: "IELTS Score Submission",
      university: "University of Toronto",
      date: "28 Aug",
      days: "25 Days Left",
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Merit Scholarship",
      university: "University of Melbourne",
      date: "10 Sep",
      days: "38 Days Left",
      color: "bg-green-100 text-green-600",
    },
  ];

  return (
    <div className="bg-white rounded-[28px] border border-purple-100 shadow-sm p-8 h-full">

      {/* Header */}

      <div className="flex justify-between items-center mb-8">

        <h2 className="text-2xl font-bold text-[#001A47]">
          Upcoming Deadlines
        </h2>

        <div className="w-11 h-11 rounded-xl bg-[#E9E2FF] flex items-center justify-center">
          <CalendarDays
            className="text-[#6533E2]"
            size={24}
          />
        </div>

      </div>

      {/* Deadlines */}

      <div className="space-y-5">

        {deadlines.map((item, index) => (

          <div
            key={index}
            className="flex justify-between items-center p-5 rounded-2xl border border-purple-100 bg-[#FCFBFF] hover:border-[#6533E2] hover:shadow-md transition-all duration-300"
          >

            <div>

              <h3 className="font-bold text-[#001A47]">
                {item.title}
              </h3>

              <p className="text-gray-500 text-sm mt-1">
                {item.university}
              </p>

              <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">

                <Clock size={15} />

                {item.days}

              </div>

            </div>

            <div
              className={`w-16 h-16 rounded-2xl flex flex-col justify-center items-center font-bold ${item.color}`}
            >

              <span className="text-lg">
                {item.date.split(" ")[0]}
              </span>

              <span className="text-xs">
                {item.date.split(" ")[1]}
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default DeadlineCard;