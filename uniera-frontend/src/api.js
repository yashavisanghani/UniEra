import axios from "axios";

// One place for the backend URL. Override with VITE_API_URL in a .env file if needed.
export const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

export const api = axios.create({ baseURL: API });

export const adminApi = () =>
  axios.create({
    baseURL: `${API}/admin`,
    headers: { Authorization: `Bearer ${localStorage.getItem("staff_token") || ""}` },
  });

export const fileUrl = (name) => `${API}/uploads/${encodeURIComponent(name)}`;

export const currentUser = () => {
  const id = localStorage.getItem("user_id");
  if (!id) return null;
  return {
    id,
    name: localStorage.getItem("name") || "",
    email: localStorage.getItem("email") || "",
    isEnrolled: localStorage.getItem("is_enrolled") === "true",
    hasProfile: localStorage.getItem("has_profile") === "true",
  };
};

// Save what /login returns
export const saveSession = (d) => {
  localStorage.setItem("user_id", d.user_id);
  localStorage.setItem("name", d.name || "");
  localStorage.setItem("email", d.email || "");
  localStorage.setItem("is_enrolled", String(!!d.is_enrolled));
  localStorage.setItem("has_profile", String(!!d.has_profile));
};

export const setEnrolled = (v = true) => localStorage.setItem("is_enrolled", String(v));

export const logout = () => {
  ["user_id", "name", "email", "is_enrolled", "has_profile"].forEach((k) => localStorage.removeItem(k));
};

export const inr = (n) => `₹${Math.round(Number(n || 0)).toLocaleString("en-IN")}`;

export const errMsg = (e, fallback = "Something went wrong") =>
  e?.response?.data?.error ||
  e?.response?.data?.message ||
  (e?.response ? fallback : "Could not reach the server. Is the backend running?");

export const money = (n) => `A$${Math.round(Number(n || 0)).toLocaleString()}`;

export const fmtDate = (d, withTime = false) => {
  if (!d) return "";
  const dt = new Date(d);
  if (isNaN(dt)) return d;
  return dt.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
};

// Base document list (per-university requirements come from /universities/:id/requirements)
export const DOC_TYPES = [
  { type: "transcript", label: "Academic Transcripts", required: true, profileKey: "transcript_file" },
  { type: "passport", label: "Passport Copy", required: true, profileKey: "passport_file" },
  { type: "resume", label: "Resume / CV", required: true, profileKey: "resume_file" },
  { type: "sop", label: "Statement of Purpose (SOP)", required: true, profileKey: "sop_file" },
  { type: "english_test", label: "English Test Scorecard (IELTS/PTE/TOEFL)", required: true, profileKey: null },
  { type: "financial_proof", label: "Financial Proof / Bank Statement", required: true, profileKey: null },
  { type: "lor", label: "Recommendation Letter", required: false, profileKey: "recommendation_letter_file" },
];
