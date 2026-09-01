import { useState } from "react";
import {
  ChevronDown,
  HelpCircle,
  Sparkles,
} from "lucide-react";

export default function FAQ() {
  const faqs = [
    {
      question: "How do I apply for a scholarship?",
      answer:
        "Browse scholarships, check the eligibility criteria, prepare the required documents, and click 'Apply Now' to begin your application.",
    },
    {
      question: "Is IELTS mandatory for every scholarship?",
      answer:
        "No. Some scholarships require IELTS, while many universities also accept TOEFL, PTE, Duolingo, or waive English tests under certain conditions.",
    },
    {
      question: "What GPA or percentage is required?",
      answer:
        "The minimum academic requirement depends on the university and scholarship. Most merit-based scholarships require a strong academic record.",
    },
    {
      question: "Which documents are usually required?",
      answer:
        "Common documents include academic transcripts, passport, Statement of Purpose (SOP), Letters of Recommendation (LOR), CV/Resume, and English proficiency scores.",
    },
    {
      question: "Can UNIERA help with visa guidance?",
      answer:
        "Yes. UNIERA provides document checklists, application tracking, and guidance to help students prepare for their student visa process.",
    },
  ];

  const [open, setOpen] = useState(0);

  return (
    <section className="py-20 sm:py-24">

      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* ================= HEADER ================= */}

        <div
          className="text-center mb-12 sm:mb-14"
          style={{
            animation: "faqFadeUp 0.7s ease-out",
          }}
        >

          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-violet-100 border border-violet-200 text-violet-700 font-semibold text-sm">

            <HelpCircle size={17} />

            Frequently Asked Questions

          </div>

          <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-black text-[#081D4A] leading-tight">

            Everything You Need
            <span className="block text-violet-700">
              to Know
            </span>

          </h2>

          <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-7">

            Find answers to common questions about scholarships,
            eligibility, applications, and studying abroad with UNIERA.

          </p>

        </div>

        {/* ================= FAQ LIST ================= */}

        <div className="space-y-4">

          {faqs.map((faq, index) => {

            const isOpen = open === index;

            return (
              <div
                key={index}
                className={`bg-white/95 backdrop-blur-xl rounded-2xl border shadow-lg overflow-hidden transition-all duration-300 ${
                  isOpen
                    ? "border-violet-200 shadow-xl"
                    : "border-white hover:border-violet-100 hover:shadow-xl"
                }`}
                style={{
                  animation: `faqCardIn ${
                    0.2 + index * 0.1
                  }s ease-out both`,
                }}
              >

                {/* Question */}

                <button
                  type="button"
                  onClick={() =>
                    setOpen(isOpen ? -1 : index)
                  }
                  className="w-full px-5 sm:px-7 py-5 sm:py-6 flex items-center justify-between gap-5 text-left"
                  aria-expanded={isOpen}
                >

                  <div className="flex items-center gap-4">

                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition ${
                        isOpen
                          ? "bg-violet-600 text-white"
                          : "bg-violet-50 text-violet-600"
                      }`}
                    >
                      {isOpen ? (
                        <Sparkles size={16} />
                      ) : (
                        <HelpCircle size={17} />
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[#081D4A]">
                      {faq.question}
                    </h3>

                  </div>

                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition ${
                      isOpen
                        ? "bg-violet-100"
                        : "bg-gray-50"
                    }`}
                  >

                    <ChevronDown
                      size={19}
                      className={`text-violet-600 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />

                  </div>

                </button>

                {/* Answer */}

                <div
                  className={`grid transition-all duration-300 ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >

                  <div className="overflow-hidden">

                    <div className="px-5 sm:px-7 pb-6 sm:pb-7 pl-[4.5rem] sm:pl-[4.75rem]">

                      <div className="border-l-2 border-violet-200 pl-4">

                        <p className="text-gray-600 leading-7 text-sm sm:text-base">
                          {faq.answer}
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

      </div>

      {/* ================= ANIMATIONS ================= */}

      <style>{`

        @keyframes faqFadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes faqCardIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

      `}</style>

    </section>
  );
}