function ProgressCard() {
  return (
    <div className="bg-white rounded-[28px] shadow-sm border border-gray-200 p-8">

      {/* Header */}

      <div className="flex justify-between items-start mb-8">

        <div>

          <h2 className="text-3xl font-bold text-[#001A47]">
            Application Progress
          </h2>

          <p className="text-gray-500 mt-2">
            Real-time status of your university admissions
          </p>

        </div>

        <span className="px-4 py-2 rounded-full bg-[#6533E2]/10 text-[#6533E2] font-semibold text-sm">
          On Track
        </span>

      </div>

      {/* Content */}

      <div className="grid lg:grid-cols-2 gap-10 items-center">

        {/* Progress Circle */}

        <div className="flex justify-center">

          <div className="relative w-60 h-60">

            <svg
              className="w-60 h-60 -rotate-90"
              viewBox="0 0 220 220"
            >

              <circle
                cx="110"
                cy="110"
                r="95"
                stroke="#E5E7EB"
                strokeWidth="12"
                fill="none"
              />

              <circle
                cx="110"
                cy="110"
                r="95"
                stroke="#6533E2"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="597"
                strokeDashoffset="209"
              />

            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">

              <h2 className="text-5xl font-extrabold text-[#001A47]">
                65%
              </h2>

              <p className="uppercase tracking-widest text-xs text-gray-500 font-bold">
                Complete
              </p>

            </div>

          </div>

        </div>

        {/* Applications */}

        <div className="space-y-5">

          {/* Stanford */}

          <div className="bg-[#F8F6FF] rounded-2xl p-5 border border-purple-100">

            <div className="flex justify-between mb-3">

              <h4 className="font-semibold text-[#001A47]">
                Stanford University
              </h4>

              <span className="text-[#6533E2] font-bold">
                Reviewing
              </span>

            </div>

            <div className="h-2 rounded-full bg-[#E5E0F5]">

              <div className="h-full w-[85%] bg-[#6533E2] rounded-full"></div>

            </div>

          </div>

          {/* Toronto */}

          <div className="bg-[#F8F6FF] rounded-2xl p-5 border border-purple-100">

            <div className="flex justify-between mb-3">

              <h4 className="font-semibold text-[#001A47]">
                University of Toronto
              </h4>

              <span className="text-green-500 font-bold">
                Interview
              </span>

            </div>

            <div className="h-2 rounded-full bg-[#E5E0F5]">

              <div className="h-full w-[40%] bg-green-500 rounded-full"></div>

            </div>

          </div>

          {/* ETH Zurich */}

          <div className="bg-[#F8F6FF] rounded-2xl p-5 border border-purple-100">

            <div className="flex justify-between mb-3">

              <h4 className="font-semibold text-[#001A47]">
                ETH Zurich
              </h4>

              <span className="text-gray-600 font-bold">
                Submitted
              </span>

            </div>

            <div className="h-2 rounded-full bg-[#E5E0F5]">

              <div className="h-full w-[25%] bg-[#001A47] rounded-full"></div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ProgressCard;