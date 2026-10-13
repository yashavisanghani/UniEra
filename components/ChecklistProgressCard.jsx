import { CheckCircle2 } from "lucide-react";

function ProgressCard() {
  const progress = 66;

  return (
    <section className="bg-white rounded-[30px] border border-gray-200 shadow-sm p-6">

      {/* Header */}

      <div className="flex justify-between items-center mb-5">

        <div>

          <p className="uppercase tracking-[0.15em] text-xs font-bold text-gray-500">
            Overall Progress
          </p>

          <h2 className="mt-2 text-4xl font-extrabold text-[#6533E2]">
            {progress}%
          </h2>

        </div>

        <div className="w-14 h-14 rounded-2xl bg-[#E8DEFF] flex items-center justify-center">

          <CheckCircle2
            size={28}
            className="text-[#6533E2]"
          />

        </div>

      </div>

      {/* Progress Bar */}

      <div className="w-full h-4 rounded-full bg-gray-200 overflow-hidden">

        <div
          className="h-full bg-gradient-to-r from-[#001A47] to-[#6533E2] rounded-full transition-all duration-700"
          style={{ width: `${progress}%` }}
        />

      </div>

      {/* Footer */}

      <div className="mt-5 flex items-center justify-between">

        <span className="text-sm text-gray-500">
          Completed Files
        </span>

        <span className="text-sm font-semibold text-[#001A47]">
          4 of 6 files completed
        </span>

      </div>

      {/* Mini Stats */}

      <div className="grid grid-cols-2 gap-4 mt-6">

        <div className="rounded-2xl bg-[#F8F9FC] p-4 text-center">

          <h3 className="text-2xl font-bold text-[#001A47]">
            4
          </h3>

          <p className="text-xs text-gray-500 mt-1">
            Uploaded
          </p>

        </div>

        <div className="rounded-2xl bg-[#F8F9FC] p-4 text-center">

          <h3 className="text-2xl font-bold text-[#6533E2]">
            2
          </h3>

          <p className="text-xs text-gray-500 mt-1">
            Remaining
          </p>

        </div>

      </div>

    </section>
  );
}

export default ProgressCard;