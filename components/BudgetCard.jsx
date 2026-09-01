import { Wallet } from "lucide-react";

function BudgetCard() {
  return (
    <div className="bg-white rounded-[28px] border border-purple-100 shadow-sm p-8 h-full">

      {/* Heading */}

      <h2 className="text-2xl font-bold text-[#001A47] mb-8">
        Budget Breakdown
      </h2>

      {/* Tuition */}

      <div className="mb-7">

        <div className="flex justify-between mb-2">

          <span className="font-semibold text-gray-700">
            Tuition Fees
          </span>

          <span className="font-bold text-[#001A47]">
            $45,000
          </span>

        </div>

        <div className="w-full h-3 bg-[#E5E0F5] rounded-full">

          <div className="h-full w-[70%] rounded-full bg-[#001A47]"></div>

        </div>

      </div>

      {/* Living */}

      <div className="mb-7">

        <div className="flex justify-between mb-2">

          <span className="font-semibold text-gray-700">
            Living Expenses
          </span>

          <span className="font-bold text-[#001A47]">
            $12,000
          </span>

        </div>

        <div className="w-full h-3 bg-[#E5E0F5] rounded-full">

          <div className="h-full w-[20%] rounded-full bg-[#6533E2]"></div>

        </div>

      </div>

      {/* Visa */}

      <div>

        <div className="flex justify-between mb-2">

          <span className="font-semibold text-gray-700">
            Visa & Travel
          </span>

          <span className="font-bold text-[#001A47]">
            $3,000
          </span>

        </div>

        <div className="w-full h-3 bg-[#E5E0F5] rounded-full">

          <div className="h-full w-[10%] rounded-full bg-green-500"></div>

        </div>

      </div>

      {/* Total */}

      <div className="mt-10 bg-gradient-to-r from-[#E9E2FF] to-[#DFE7FF] border border-purple-100 rounded-2xl p-5">

        <div className="flex items-center gap-4">

          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#001A47] to-[#6533E2] flex items-center justify-center">

            <Wallet className="text-white" size={22} />

          </div>

          <div>

            <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">
              Estimated Total
            </p>

            <h3 className="text-3xl font-bold text-[#001A47]">

              $60,000

              <span className="text-base font-normal text-gray-500">
                {" "}
                / yr
              </span>

            </h3>

          </div>

        </div>

      </div>

    </div>
  );
}

export default BudgetCard;