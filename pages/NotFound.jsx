// src/pages/NotFound.jsx

import { Link } from "react-router-dom";
import { Home, SearchX } from "lucide-react";

function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEF2FF] via-white to-[#F7F9FB] flex items-center justify-center px-6">

      <div className="bg-white max-w-2xl w-full rounded-[32px] shadow-xl border border-gray-200 p-12 text-center">

        <div className="w-24 h-24 mx-auto rounded-full bg-[#E8DEFF] flex items-center justify-center mb-8">

          <SearchX
            size={52}
            className="text-[#6533E2]"
          />

        </div>

        <h1 className="text-8xl font-extrabold text-[#6533E2]">
          404
        </h1>

        <h2 className="text-4xl font-bold text-[#001A47] mt-5">
          Page Not Found
        </h2>

        <p className="mt-5 text-lg text-gray-500 leading-8 max-w-xl mx-auto">
          Sorry, the page you are looking for doesn't exist,
          has been moved, or the URL is incorrect.
        </p>

        <div className="flex justify-center gap-5 mt-10">

          <Link
            to="/student-dashboard"
            className="flex items-center gap-2 bg-[#6533E2] hover:bg-[#5629d4] text-white px-7 py-3 rounded-xl font-semibold transition"
          >
            <Home size={18} />
            Dashboard
          </Link>

          <Link
            to="/"
            className="px-7 py-3 rounded-xl border border-[#6533E2] text-[#6533E2] hover:bg-[#6533E2] hover:text-white transition font-semibold"
          >
            Home
          </Link>

        </div>

      </div>

    </div>
  );
}

export default NotFound;