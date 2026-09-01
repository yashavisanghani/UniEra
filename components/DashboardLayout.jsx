import StudentSidebar from "../components/StudentSidebar";
import StudentTopbar from "../components/StudentTopbar";
import StudentFooter from "../components/StudentFooter";

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Sidebar */}
      <StudentSidebar />

      {/* Main Content */}
      <div className="ml-72 min-h-screen flex flex-col">

        {/* Topbar */}
        <StudentTopbar />

        {/* Page Content */}
        <main className="flex-1 p-8">
          {children}
        </main>

        {/* Footer */}
        <StudentFooter />

      </div>
    </div>
  );
}

export default DashboardLayout;