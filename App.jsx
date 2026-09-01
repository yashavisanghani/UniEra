import { BrowserRouter, Routes, Route } from "react-router-dom";

// Auth Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EnrollNow from "./components/EnrollNow";

// Public Pages
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";

// Dashboard
import StudentDashboard from "./pages/StudentDashboard";

// Main Modules
import UniversityExplorer from "./pages/UniversityExplorer";
import UniversityDetails from "./pages/UniversityDetails";
import ScholarshipFinder from "./pages/ScholarshipFinder";
import Roadmap from "./pages/Roadmap";
import EligibilityChecker from "./pages/EligibilityChecker";
import CostEstimator from "./pages/CostEstimator";
import DocumentChecklist from "./pages/DocumentChecklist";

// Student Pages
import Profile from "./pages/Profile";
import MyApplications from "./pages/MyApplications";
import SavedUniversities from "./pages/SavedUniversities";
import Documents from "./pages/Documents";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import HelpSupport from "./pages/HelpSupport";

// Error Page
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />

        {/* Dashboard */}
        <Route path="/student-dashboard" element={<StudentDashboard />} />

        {/* Universities */}
        <Route path="/universities" element={<UniversityExplorer />} />
        <Route path="/university/:id" element={<UniversityDetails />} />
        <Route path="/saved-universities" element={<SavedUniversities />} />

        {/* Scholarships */}
        <Route path="/scholarship-finder" element={<ScholarshipFinder />} />

        {/* Student Tools */}
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/eligibility" element={<EligibilityChecker />} />
        <Route path="/cost-estimator" element={<CostEstimator />} />
        <Route path="/document-checklist" element={<DocumentChecklist />} />

        {/* Student */}
        <Route path="/applications" element={<MyApplications />} />
        <Route path="/enroll" element={<EnrollNow />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help-support" element={<HelpSupport />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;