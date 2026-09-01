import StudentSidebar from "../components/StudentTopbar";
import StudentTopbar from "../components/StudentSidebar";
import StudentFooter from "../components/StudentFooter";

import RoadmapHeader from "../components/RoadmapHeader";
import ProgressOverview from "../components/ProgressOverview";
import RoadmapTimeline from "../components/RoadmapTimeline";
import DeadlineTracker from "../components/DeadlineTracker";
import SmartReminderCard from "../components/SmartReminderCard";

function Roadmap() {
  return (
    <div
  className="min-h-screen"
  style={{
    background:
      "linear-gradient(135deg, #E9E2FF 0%, #DFE7FF 50%, #E0F0FF 100%)",
  }}
>

      <StudentSidebar />

      <div className="ml-72 min-h-screen flex flex-col">

        <StudentTopbar />

        <main className="flex-1 px-10 pt-28 pb-10">

          <RoadmapHeader />

          <ProgressOverview />

          <div className="mt-10">
            <RoadmapTimeline />
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mt-10">

            <div className="lg:col-span-2">
              <DeadlineTracker />
            </div>

            <SmartReminderCard />

          </div>

          <StudentFooter />

        </main>

      </div>

    </div>
  );
}

export default Roadmap;