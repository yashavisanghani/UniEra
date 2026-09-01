import StudentSidebar from "../components/StudentTopbar";
import StudentTopbar from "../components/StudentSidebar";
import StudentFooter from "../components/StudentFooter";

import CostEstimatorHeader from "../components/CostEstimatorHeader";
import CostInputForm from "../components/CostInputForm";
import FinancialSummary from "../components/FinancialSummary";
import BudgetBreakdown from "../components/BudgetBreakdown";
import YearlyComparison from "../components/YearlyComparison";
import SmartInsights from "../components/SmartInsights";

function CostEstimator() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] flex">

      <StudentSidebar />

      <div className="flex-1 flex flex-col ml-72">

        <StudentTopbar />

        <main className="flex-1 px-10 py-8">

          <CostEstimatorHeader />

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left Side */}

            <div className="lg:col-span-5">

              <CostInputForm />

            </div>

            {/* Right Side */}

            <div className="lg:col-span-7 space-y-6">

              <FinancialSummary />

              <div className="grid md:grid-cols-2 gap-6">

                <BudgetBreakdown />

                <YearlyComparison />

              </div>

            </div>

          </div>

          <SmartInsights />

        </main>

        <StudentFooter />

      </div>

    </div>
  );
}

export default CostEstimator;