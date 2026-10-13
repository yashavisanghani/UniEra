import { useState } from "react";
import {
  Heart,
  Globe,
  CalendarDays,
  GraduationCap,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const ScholarshipCard = ({
  title,
  organization,
  country,
  amount,
  degree,
  category,
  deadline,
  onClick,
}) => {
  const [saved, setSaved] = useState(false);

  const handleFavourite = (e) => {
    e.stopPropagation();
    setSaved((prev) => !prev);
  };

  const handleApply = (e) => {
    e.stopPropagation();

    // Keep the button ready for your application/enrollment flow.
    alert(`Applying for ${title}`);
  };

  return (
    <div
      onClick={onClick}
      className="group relative bg-white/95 backdrop-blur-xl rounded-3xl border border-white shadow-lg cursor-pointer overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
    >

      {/* ================= TOP ACCENT ================= */}

      <div className="h-1.5 w-full bg-gradient-to-r from-[#081D4A] via-[#4F46E5] to-[#6C3CE9]" />

      <div className="p-6 sm:p-7">

        {/* ================= TOP ROW ================= */}

        <div className="flex items-start justify-between gap-4 mb-5">

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">

              <GraduationCap
                size={24}
                className="text-[#6C3CE9]"
              />

            </div>

            <div>

              <p className="text-xs uppercase tracking-wider font-bold text-violet-600">
                Scholarship
              </p>

              <p className="text-sm text-gray-500 mt-0.5">
                {organization}
              </p>

            </div>

          </div>

          {/* Favourite */}

          <button
            type="button"
            onClick={handleFavourite}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              saved
                ? "bg-red-50 text-red-500 scale-110"
                : "bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500"
            }`}
            aria-label="Save scholarship"
          >

            <Heart
              size={20}
              fill={saved ? "currentColor" : "none"}
            />

          </button>

        </div>

        {/* ================= TITLE ================= */}

        <h3 className="text-2xl font-bold text-[#081D4A] leading-tight line-clamp-2 group-hover:text-[#6C3CE9] transition-colors duration-300">
          {title}
        </h3>

        {/* ================= COUNTRY ================= */}

        <div className="flex items-center gap-2 text-gray-500 mt-3">

          <Globe
            size={17}
            className="text-violet-500"
          />

          <span className="text-sm font-medium">
            {country}
          </span>

        </div>

        {/* ================= AMOUNT ================= */}

        <div className="relative overflow-hidden bg-gradient-to-r from-violet-50 to-indigo-50 rounded-2xl p-5 mt-6 mb-5 border border-violet-100">

          <div className="absolute -right-5 -top-5 w-20 h-20 rounded-full bg-violet-200/30 blur-xl" />

          <div className="relative flex items-start justify-between">

            <div>

              <p className="uppercase text-xs font-bold tracking-wider text-violet-600">
                Scholarship Amount
              </p>

              <h4 className="text-2xl font-black text-[#081D4A] mt-1">
                {amount}
              </h4>

            </div>

            <Sparkles
              size={20}
              className="text-violet-500"
            />

          </div>

        </div>

        {/* ================= TAGS ================= */}

        <div className="flex flex-wrap gap-2 mb-6">

          <span className="flex items-center gap-1.5 bg-violet-100 text-violet-700 px-3 py-1.5 rounded-full text-xs font-bold">

            <GraduationCap size={13} />

            {degree}

          </span>

          <span className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-xs font-bold">
            {category}
          </span>

        </div>

        {/* ================= FOOTER ================= */}

        <div className="border-t border-gray-100 pt-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

          {/* Deadline */}

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">

              <CalendarDays
                size={18}
                className="text-red-500"
              />

            </div>

            <div>

              <p className="text-xs text-gray-400 font-medium">
                Application Deadline
              </p>

              <p className="font-bold text-red-600 text-sm">
                {deadline}
              </p>

            </div>

          </div>

          {/* Buttons */}

          <div className="flex gap-2">

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClick?.();
              }}
              className="px-4 py-2.5 rounded-xl border border-violet-200 text-violet-700 font-semibold text-sm hover:bg-violet-50 transition"
            >
              Details
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="flex items-center gap-2 bg-gradient-to-r from-[#081D4A] to-[#6C3CE9] hover:shadow-lg text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5"
            >
              Apply
              <ArrowRight size={15} />
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ScholarshipCard;