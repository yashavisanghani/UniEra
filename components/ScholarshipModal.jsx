import {
  X,
  Calendar,
  Clock,
  CheckCircle,
  Bookmark,
  Globe,
  GraduationCap,
  DollarSign,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

const ScholarshipModal = ({ scholarship, onClose }) => {
  const [saved, setSaved] = useState(false);

  if (!scholarship) return null;

  const provider =
    scholarship.organization || scholarship.provider;

  const eligibility = [
    "Excellent academic performance",
    "Valid Passport",
    "English Language Proficiency",
    "Admission Offer Letter",
    "Statement of Purpose",
    "Letters of Recommendation",
  ];

  const benefits = [
    {
      icon: "🎓",
      title: "Full Tuition Fee",
    },
    {
      icon: "🏠",
      title: "Accommodation Support",
    },
    {
      icon: "💵",
      title: "Monthly Stipend",
    },
    {
      icon: "🩺",
      title: "Health Insurance",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#081D4A]/70 backdrop-blur-md p-3 sm:p-5"
      onClick={onClose}
    >

      {/* ================= MODAL ================= */}

      <div
        className="bg-white rounded-[28px] sm:rounded-[32px] w-full max-w-6xl max-h-[92vh] overflow-y-auto shadow-2xl animate-modalIn"
        onClick={(e) => e.stopPropagation()}
      >

        {/* ================= HEADER ================= */}

        <div className="relative overflow-hidden bg-gradient-to-br from-[#081D4A] via-[#2B2F8A] to-[#6C3CE9] px-6 sm:px-10 py-8 sm:py-10">

          {/* Decorative glow */}

          <div className="absolute -top-32 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-32 left-10 w-72 h-72 rounded-full bg-purple-300/10 blur-3xl" />

          <div className="relative z-10">

            {/* Close */}

            <button
              type="button"
              onClick={onClose}
              className="absolute -top-1 right-0 sm:top-0 sm:right-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 text-gray-700 flex items-center justify-center shadow-lg hover:bg-white hover:scale-105 transition"
              aria-label="Close scholarship details"
            >
              <X size={21} />
            </button>

            {/* Badge */}

            <span className="inline-flex items-center gap-2 bg-white/15 border border-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs sm:text-sm font-semibold">

              <Sparkles
                size={15}
                className="text-yellow-300"
              />

              Featured Scholarship

            </span>

            {/* Title */}

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-6 max-w-4xl leading-tight pr-10">

              {scholarship.title}

            </h2>

            <p className="text-white/70 text-base sm:text-lg mt-3">

              {provider}

            </p>

          </div>

        </div>

        {/* ================= CONTENT ================= */}

        <div className="grid lg:grid-cols-3 gap-8 p-6 sm:p-10">

          {/* ================= LEFT ================= */}

          <div className="lg:col-span-2 space-y-10">

            {/* About */}

            <section>

              <h3 className="text-2xl sm:text-3xl font-bold text-[#081D4A] mb-4">
                About Scholarship
              </h3>

              <p className="text-gray-600 leading-7">

                This scholarship provides financial assistance to outstanding
                international students pursuing higher education abroad. It
                covers tuition fees, living expenses and additional academic
                support depending upon eligibility.

              </p>

            </section>

            {/* Eligibility */}

            <section>

              <h3 className="text-2xl sm:text-3xl font-bold text-[#081D4A] mb-5">
                Eligibility
              </h3>

              <div className="grid sm:grid-cols-2 gap-3">

                {eligibility.map((item) => (

                  <div
                    key={item}
                    className="flex items-center gap-3 bg-gray-50 hover:bg-green-50 rounded-xl p-4 transition"
                  >

                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">

                      <CheckCircle
                        size={17}
                        className="text-green-600"
                      />

                    </div>

                    <span className="text-gray-700 text-sm font-medium">
                      {item}
                    </span>

                  </div>

                ))}

              </div>

            </section>

            {/* Benefits */}

            <section>

              <h3 className="text-2xl sm:text-3xl font-bold text-[#081D4A] mb-5">
                Benefits
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">

                {benefits.map((benefit) => (

                  <div
                    key={benefit.title}
                    className="group rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 p-5 hover:-translate-y-1 hover:shadow-md transition duration-300"
                  >

                    <div className="text-2xl mb-3">
                      {benefit.icon}
                    </div>

                    <p className="font-semibold text-[#081D4A]">
                      {benefit.title}
                    </p>

                  </div>

                ))}

              </div>

            </section>

          </div>

          {/* ================= RIGHT ================= */}

          <div>

            <div className="rounded-3xl border border-gray-200 shadow-lg p-6 sm:p-7 lg:sticky lg:top-5 bg-white">

              <div className="flex items-center gap-3 mb-7">

                <div className="w-11 h-11 rounded-xl bg-violet-100 flex items-center justify-center">

                  <Sparkles
                    size={20}
                    className="text-violet-600"
                  />

                </div>

                <div>

                  <p className="text-xs uppercase tracking-wider text-violet-600 font-bold">
                    Overview
                  </p>

                  <h3 className="text-xl font-bold text-[#081D4A]">
                    Scholarship Details
                  </h3>

                </div>

              </div>

              <div className="space-y-5">

                {/* Funding */}

                <div className="flex gap-3">

                  <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">

                    <DollarSign
                      size={19}
                      className="text-violet-600"
                    />

                  </div>

                  <div>

                    <p className="text-gray-400 text-xs">
                      Funding
                    </p>

                    <p className="font-bold text-[#081D4A] mt-1">
                      {scholarship.amount}
                    </p>

                  </div>

                </div>

                {/* Country */}

                <div className="flex gap-3">

                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">

                    <Globe
                      size={19}
                      className="text-blue-600"
                    />

                  </div>

                  <div>

                    <p className="text-gray-400 text-xs">
                      Country
                    </p>

                    <p className="font-bold text-[#081D4A] mt-1">
                      {scholarship.country}
                    </p>

                  </div>

                </div>

                {/* Degree */}

                <div className="flex gap-3">

                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">

                    <GraduationCap
                      size={19}
                      className="text-purple-600"
                    />

                  </div>

                  <div>

                    <p className="text-gray-400 text-xs">
                      Degree
                    </p>

                    <p className="font-bold text-[#081D4A] mt-1">
                      {scholarship.degree}
                    </p>

                  </div>

                </div>

                {/* Deadline */}

                <div className="flex gap-3">

                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">

                    <Calendar
                      size={19}
                      className="text-red-500"
                    />

                  </div>

                  <div>

                    <p className="text-gray-400 text-xs">
                      Deadline
                    </p>

                    <p className="font-bold text-red-600 mt-1">
                      {scholarship.deadline}
                    </p>

                  </div>

                </div>

                {/* Duration */}

                <div className="flex gap-3">

                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">

                    <Clock
                      size={19}
                      className="text-green-600"
                    />

                  </div>

                  <div>

                    <p className="text-gray-400 text-xs">
                      Duration
                    </p>

                    <p className="font-bold text-[#081D4A] mt-1">
                      1 - 2 Years
                    </p>

                  </div>

                </div>

                {/* Divider */}

                <div className="border-t border-gray-100 pt-5">

                  {/* Apply */}

                  <button
                    type="button"
                    onClick={() =>
                      alert(`Applying for ${scholarship.title}`)
                    }
                    className="w-full rounded-xl bg-gradient-to-r from-[#081D4A] to-[#6C3CE9] py-4 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition duration-300"
                  >
                    Apply Now →
                  </button>

                  {/* Save */}

                  <button
                    type="button"
                    onClick={() => setSaved(!saved)}
                    className={`w-full mt-3 rounded-xl border py-4 flex items-center justify-center gap-3 font-semibold transition ${
                      saved
                        ? "border-violet-300 bg-violet-50 text-violet-700"
                        : "border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >

                    <Bookmark
                      size={19}
                      fill={saved ? "currentColor" : "none"}
                    />

                    {saved
                      ? "Scholarship Saved"
                      : "Save Scholarship"}

                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ================= ANIMATION ================= */}

      <style>{`

        @keyframes modalIn {
          from {
            opacity: 0;
            transform: translateY(25px) scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-modalIn {
          animation: modalIn 0.3s ease-out;
        }

      `}</style>

    </div>
  );
};

export default ScholarshipModal;