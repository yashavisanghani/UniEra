import StudentSidebar from "../components/StudentSidebar";
import StudentTopbar from "../components/StudentTopbar";
import StudentFooter from "../components/StudentFooter";

import WelcomeHeader from "../components/WelcomeHeader";
import ProgressCard from "../components/ProgressCard";
import EligibilityCard from "../components/EligibilityCard";
import RecommendedUniversities from "../components/RecommendedUniversities";
import BudgetCard from "../components/BudgetCard";
import StudentDeadlineCard from "../components/StudentDeadlineCard";
import StudentDocumentsCard from "../components/StudentDocumentsCard";
import StudentRoadmap from "../components/StudentRoadmap";
import StudentRecentActivity from "../components/StudentRecentActivity";

function StudentDashboard() {
  return (
    <div
  className="min-h-screen"
  style={{
    background:
      "linear-gradient(135deg, #E9E2FF 0%, #DFE7FF 50%, #E0F0FF 100%)",
  }}
>

      {/* Sidebar */}
      <StudentSidebar />

      {/* Main Content */}
      <div className="ml-72">

        {/* Topbar */}
        <StudentTopbar />

        {/* Page Content */}
        <main className="pt-28 px-8 pb-8">

          <WelcomeHeader />

          {/* Progress + Eligibility */}
          <div className="grid lg:grid-cols-3 gap-8 mt-8">

            <div className="lg:col-span-2">
              <ProgressCard />
            </div>

            <EligibilityCard />

          </div>

          {/* Recommended Universities */}
          <div className="mt-10">
            <RecommendedUniversities />
          </div>

          {/* Budget + Deadlines */}
          <div className="grid lg:grid-cols-2 gap-8 mt-10">

            <BudgetCard />

            <StudentDeadlineCard />

          </div>

          {/* Documents + Roadmap */}
          <div className="grid lg:grid-cols-2 gap-8 mt-10">

            <StudentDocumentsCard />

            <StudentRoadmap />

          </div>

          {/* Recent Activity */}
          <div className="mt-10">
            <StudentRecentActivity />
          </div>

        </main>

        {/* Footer */}
        <StudentFooter />

      </div>

    </div>
  );
}

export default StudentDashboard;