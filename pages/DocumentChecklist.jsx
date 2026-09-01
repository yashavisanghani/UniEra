import StudentSidebar from "../components/StudentSidebar";
import StudentTopbar from "../components/StudentTopbar";
import StudentFooter from "../components/StudentFooter";

import DocumentChecklistHeader from "../components/DocumentChecklistHeader";
import ChecklistProgressCard from "../components/ChecklistProgressCard";
import DocumentGrid from "../components/DocumentGrid";
import CertificationSupport from "../components/CertificationSupport";

function DocumentChecklist() {
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
      <div className="ml-72 min-h-screen flex flex-col">

        {/* Topbar */}
        <StudentTopbar />

        {/* Page Content */}
        <main className="flex-1 px-10 pt-24 pb-10">

          {/* ================= HEADER ================= */}
          <div className="mb-8">
            <DocumentChecklistHeader />
          </div>

          {/* ================= DOCUMENTS ================= */}
          <div className="w-full">
            <DocumentGrid />
          </div>

          {/* ================= OVERALL PROGRESS ================= */}
          <div className="mt-10 w-full max-w-5xl mx-auto">
            <ChecklistProgressCard />
          </div>

          {/* ================= SUPPORT ================= */}
          <div className="mt-10">
            <CertificationSupport />
          </div>

        </main>

        {/* Footer */}
        <StudentFooter />

      </div>
    </div>
  );
}

export default DocumentChecklist;