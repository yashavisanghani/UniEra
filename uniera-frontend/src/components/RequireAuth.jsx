import { Navigate, useLocation } from "react-router-dom";

// Logged-in students only
export function RequireAuth({ children }) {
  const location = useLocation();
  if (!localStorage.getItem("user_id")) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return children;
}

// Logged-in AND enrolled (profile + payment done) — the student portal
export function RequireEnrolled({ children }) {
  const location = useLocation();
  if (!localStorage.getItem("user_id")) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  if (localStorage.getItem("is_enrolled") !== "true") return <Navigate to="/enroll" replace />;
  return children;
}

// Consultancy staff
export function RequireStaff({ children }) {
  if (!localStorage.getItem("staff_token")) return <Navigate to="/admin/login" replace />;
  return children;
}
