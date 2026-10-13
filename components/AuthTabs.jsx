import { useNavigate } from "react-router-dom";

export default function AuthTabs({ active }) {
  const navigate = useNavigate();

  return (
    <div className="flex bg-gray-100 rounded-lg p-1 mb-8">
      <button
        onClick={() => navigate("/login")}
        className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
          active === "login" ? "bg-white shadow text-gray-900" : "text-gray-500"
        }`}
      >
        Login
      </button>
      <button
        onClick={() => navigate("/signup")}
        className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
          active === "signup" ? "bg-white shadow text-gray-900" : "text-gray-500"
        }`}
      >
        Signup
      </button>
    </div>
  );
}