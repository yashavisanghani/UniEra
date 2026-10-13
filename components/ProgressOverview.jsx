function ProgressOverview() {
  return (
    <div className="relative overflow-hidden bg-white/75 backdrop-blur-md rounded-[28px] border border-white/60 shadow-sm p-8">

      {/* Background Glow */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-purple-100 blur-3xl opacity-60"></div>

      <div className="relative z-10">

        {/* Top */}
        <div className="flex justify-between items-center mb-6">

          <h2 className="text-3xl font-bold text-[#001A47]">
            Overall Progress
          </h2>

          <span className="text-4xl font-bold text-[#6533E2]">
            68%
          </span>

        </div>

        {/* Progress Bar */}
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">

          <div className="w-[68%] h-full rounded-full bg-gradient-to-r from-[#001A47] via-[#6533E2] to-[#8B5CF6]"></div>

        </div>

        {/* Dates */}
        <div className="flex justify-between mt-5 text-gray-500 font-medium">

          <span>Initiated Jan 2024</span>

          <span>Target Intake: Sept 2024</span>

        </div>

      </div>

    </div>
  );
}

export default ProgressOverview;