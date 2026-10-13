// src/pages/HelpSupport.jsx

import StudentSidebar from "../components/StudentTopbar";
import StudentTopbar from "../components/StudentSidebar";
import StudentFooter from "../components/StudentFooter";
import {
  HelpCircle,
  Mail,
  Phone,
  MessageCircle,
  ChevronDown,
} from "lucide-react";

const faqs = [
  {
    question: "How do I apply to a university?",
    answer:
      "Browse universities, choose your desired course, and click 'Apply Now'.",
  },
  {
    question: "How can I upload documents?",
    answer:
      "Open the Documents page and click the Upload Document button.",
  },
  {
    question: "Can I track my application status?",
    answer:
      "Yes. Visit the My Applications page to see real-time application updates.",
  },
  {
    question: "How do I contact my counselor?",
    answer:
      "Use the Contact Support section below or send an email to your assigned counselor.",
  },
];

function HelpSupport() {
  return (
    <div className="bg-[#F7F9FB] min-h-screen">
      <StudentSidebar />

      <div className="ml-72 min-h-screen flex flex-col">
        <StudentTopbar />

        <main className="flex-1 px-10 pt-28 pb-10">

          <div className="mb-10">
            <h1 className="text-5xl font-extrabold text-[#001A47]">
              Help & Support
            </h1>

            <p className="mt-3 text-lg text-gray-500">
              Need assistance? We're here to help you throughout your study abroad journey.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-10">

            <div className="bg-white rounded-3xl shadow-sm border p-6 text-center">

              <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-100 flex items-center justify-center">
                <Mail className="text-[#6533E2]" size={30} />
              </div>

              <h3 className="text-xl font-bold mt-5">Email Support</h3>

              <p className="text-gray-500 mt-2">
                support@uniera.com
              </p>

            </div>

            <div className="bg-white rounded-3xl shadow-sm border p-6 text-center">

              <div className="w-16 h-16 mx-auto rounded-2xl bg-green-100 flex items-center justify-center">
                <Phone className="text-green-600" size={30} />
              </div>

              <h3 className="text-xl font-bold mt-5">Call Us</h3>

              <p className="text-gray-500 mt-2">
                +91 98765 43210
              </p>

            </div>

            <div className="bg-white rounded-3xl shadow-sm border p-6 text-center">

              <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-100 flex items-center justify-center">
                <MessageCircle className="text-purple-600" size={30} />
              </div>

              <h3 className="text-xl font-bold mt-5">
                Live Chat
              </h3>

              <p className="text-gray-500 mt-2">
                Available 24 × 7
              </p>

            </div>

          </div>

          <div className="bg-white rounded-3xl shadow-sm border p-8">

            <div className="flex items-center gap-3 mb-8">

              <HelpCircle className="text-[#6533E2]" />

              <h2 className="text-3xl font-bold text-[#001A47]">
                Frequently Asked Questions
              </h2>

            </div>

            <div className="space-y-5">

              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border rounded-2xl p-5 hover:border-[#6533E2]"
                >
                  <div className="flex justify-between items-center">

                    <h3 className="font-semibold text-lg">
                      {faq.question}
                    </h3>

                    <ChevronDown />

                  </div>

                  <p className="mt-4 text-gray-500">
                    {faq.answer}
                  </p>

                </div>
              ))}

            </div>

          </div>

          <StudentFooter />

        </main>
      </div>
    </div>
  );
}

export default HelpSupport;