import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import PortalLayout from "./components/PortalLayout";
import AdminLayout from "./components/AdminLayout";
import { RequireAuth, RequireEnrolled, RequireStaff } from "./components/RequireAuth";

// public website
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Enroll from "./pages/Enroll";
import Universities from "./pages/Universities";
import UniversityDetail from "./pages/UniversityDetail";
import Scholarships from "./pages/Scholarships";
import EligibilityChecker from "./pages/EligibilityChecker";
import CostEstimator from "./pages/CostEstimator";
import TrackApplication from "./pages/TrackApplication";

// student portal (after enrolment + payment)
import Dashboard from "./pages/portal/Dashboard";
import Shortlist from "./pages/portal/Shortlist";
import Applications from "./pages/portal/Applications";
import ApplicationDetail from "./pages/portal/ApplicationDetail";
import Apply from "./pages/portal/Apply";
import Offers from "./pages/portal/Offers";
import TestPrep from "./pages/portal/TestPrep";
import Loans from "./pages/portal/Loans";
import Accommodation from "./pages/portal/Accommodation";
import Payments from "./pages/portal/Payments";
import Profile from "./pages/portal/Profile";
import Review from "./pages/portal/Review";

// consultancy desk
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminApplications from "./pages/admin/AdminApplications";
import AdminApplication from "./pages/admin/AdminApplication";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminServices from "./pages/admin/AdminServices";

const pub = (el) => <Layout>{el}</Layout>;

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ---------- public: anyone can explore ---------- */}
        <Route path="/" element={pub(<Home />)} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/universities" element={pub(<Universities />)} />
        <Route path="/universities/:id" element={pub(<UniversityDetail />)} />
        <Route path="/scholarships" element={pub(<Scholarships />)} />
        <Route path="/eligibility" element={pub(<EligibilityChecker />)} />
        <Route path="/cost-estimator" element={pub(<CostEstimator />)} />
        <Route path="/track" element={pub(<TrackApplication />)} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/enroll" element={<RequireAuth>{pub(<Enroll />)}</RequireAuth>} />
        <Route path="/enroll-now" element={<Navigate to="/enroll" replace />} />

        {/* ---------- student portal: only after enrolment + payment ---------- */}
        <Route path="/portal" element={<RequireEnrolled><PortalLayout /></RequireEnrolled>}>
          <Route index element={<Dashboard />} />
          <Route path="universities" element={<Universities portal />} />
          <Route path="universities/:id" element={<UniversityDetail portal />} />
          <Route path="scholarships" element={<Scholarships portal />} />
          <Route path="shortlist" element={<Shortlist />} />
          <Route path="apply/:uniId" element={<Apply />} />
          <Route path="applications" element={<Applications />} />
          <Route path="applications/:id" element={<ApplicationDetail />} />
          <Route path="offers" element={<Offers />} />
          <Route path="status" element={<TrackApplication portal />} />
          <Route path="test-prep" element={<TestPrep />} />
          <Route path="loans" element={<Loans />} />
          <Route path="accommodation" element={<Accommodation />} />
          <Route path="payments" element={<Payments />} />
          <Route path="profile" element={<Profile />} />
          <Route path="review" element={<Review />} />
        </Route>

        {/* ---------- consultancy desk ---------- */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<RequireStaff><AdminLayout /></RequireStaff>}>
          <Route index element={<AdminDashboard />} />
          <Route path="applications" element={<AdminApplications />} />
          <Route path="applications/:id" element={<AdminApplication />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="services" element={<AdminServices />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
