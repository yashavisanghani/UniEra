import { MapPin, BookmarkMinus } from "lucide-react";

const scholarships = [
  {
    id: 1,
    name: "Chevening Scholarship 2024",
    country: "United Kingdom",
    flag: "🇬🇧",
    value: "Full Tuition",
    deadline: "15 Oct 2024",
    status: "Open",
    time: "4 Days Left",
    image:
      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    urgent: false,
  },
  {
    id: 2,
    name: "Fulbright Foreign Student Program",
    country: "USA",
    flag: "🇺🇸",
    value: "$35,000 / Yr",
    deadline: "01 Nov 2024",
    status: "Open",
    time: "",
    image:
      "https://cdn-icons-png.flaticon.com/512/1995/1995574.png",
    urgent: false,
  },
  {
    id: 3,
    name: "DAAD Research Grants",
    country: "Germany",
    flag: "🇩🇪",
    value: "€1,200 Monthly",
    deadline: "12 Sep 2024",
    status: "Closing Soon",
    time: "24h Left",
    image:
      "https://cdn-icons-png.flaticon.com/512/3062/3062634.png",
    urgent: true,
  },
];

const SavedScholarshipCard = () => {
  return (
    <section className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">

      {scholarships.map((item) => (

        <div
          key={item.id}
          className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
        >

          {/* Top */}

          <div className="mb-6 flex items-start justify-between">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-200 bg-white">

              <img
                src={item.image}
                alt={item.name}
                className="h-10 w-10 object-contain"
              />

            </div>

            <div className="flex flex-col items-end gap-2">

              <span
                className={`rounded-full px-4 py-1 text-sm font-semibold ${
                  item.urgent
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {item.status}
              </span>

              {item.time && (
                <span className="rounded-full bg-red-100 px-4 py-1 text-sm font-semibold text-red-600">
                  {item.time}
                </span>
              )}

            </div>

          </div>

          {/* Title */}

          <h2 className="text-4 font-bold leading-snug text-[#00061C]">
            {item.name}
          </h2>

          {/* Country */}

          <div className="mt-4 flex items-center gap-2 text-gray-600">

            <MapPin size={18} />

            <span>{item.country}</span>

            <span>{item.flag}</span>

          </div>

          {/* Divider */}

          <hr className="my-6" />

          {/* Info */}

          <div className="mb-6 flex justify-between">

            <div>

              <p className="text-xs uppercase tracking-wider text-gray-400">
                Value
              </p>

              <h3 className="mt-2 text-3xl font-bold text-[#634FAC]">
                {item.value}
              </h3>

            </div>

            <div className="text-right">

              <p className="text-xs uppercase tracking-wider text-gray-400">
                Deadline
              </p>

              <h3 className="mt-2 font-semibold">
                {item.deadline}
              </h3>

            </div>

          </div>

          {/* Buttons */}

          <div className="flex gap-3">

            <button className="flex-1 rounded-xl bg-gradient-to-r from-[#00061C] to-[#634FAC] py-3 font-semibold text-white transition hover:opacity-90">

              Apply Now

            </button>

            <button className="rounded-xl border border-gray-300 p-3 transition hover:border-red-400 hover:bg-red-50 hover:text-red-500">

              <BookmarkMinus size={22} />

            </button>

          </div>

        </div>

      ))}

    </section>
  );
};

export default SavedScholarshipCard;