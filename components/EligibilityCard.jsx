import { Sparkles } from "lucide-react";

function EligibilityCard() {
  return (
    <div className="bg-white rounded-[28px] shadow-sm border border-gray-200 p-8 h-full flex flex-col justify-between">

      {/* Heading */}

      <div>

        <h2 className="text-3xl font-bold text-[#001A47]">
          Eligibility Score
        </h2>

        <p className="text-gray-500 mt-2 leading-7">
          Based on your GPA (3.9)
          <br />
          and IELTS (8.0)
        </p>

      </div>

      {/* Score */}

      <div className="flex flex-col items-center my-10">

        <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[#E9E2FF] to-[#DFE7FF] flex items-center justify-center shadow-inner">

          <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center">

            <h1 className="text-6xl font-extrabold text-[#6533E2]">
              842
            </h1>

          </div>

        </div>

        <div className="mt-5 bg-green-100 text-green-700 rounded-full px-6 py-2 flex items-center gap-2 font-semibold">

          <Sparkles size={18} />

          Highly Qualified

        </div>

      </div>

      {/* Footer */}

      <div className="border-t border-purple-100 pt-6">

        <p className="text-sm italic text-gray-500 leading-6">

          "Your profile exceeds requirements for
          <span className="font-semibold text-[#6533E2]"> 82% </span>
          of selected universities."

        </p>

      </div>

    </div>
  );
}

export default EligibilityCard;