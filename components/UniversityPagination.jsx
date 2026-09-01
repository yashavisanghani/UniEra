// src/components/UniversityPagination.jsx

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

function UniversityPagination() {
  const [currentPage, setCurrentPage] = useState(1);

  const pages = [1, 2, 3, 10];

  return (
    <div
      className="flex items-center justify-center gap-2 sm:gap-3 mt-10 mb-4"
      style={{
        animation: "paginationFadeUp 0.7s ease-out",
      }}
    >

      {/* Previous */}

      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() =>
          setCurrentPage((page) => Math.max(1, page - 1))
        }
        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center border transition duration-300 ${
          currentPage === 1
            ? "border-gray-200 text-gray-300 cursor-not-allowed bg-white/60"
            : "border-white bg-white/90 text-gray-600 hover:bg-violet-100 hover:text-violet-700 hover:border-violet-200"
        }`}
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Page 1 */}

      <button
        type="button"
        onClick={() => setCurrentPage(1)}
        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl font-semibold transition duration-300 ${
          currentPage === 1
            ? "bg-gradient-to-r from-[#081D4A] to-[#6C3CE9] text-white shadow-lg scale-105"
            : "bg-white/90 text-gray-600 border border-white hover:bg-violet-100 hover:text-violet-700"
        }`}
      >
        1
      </button>

      {/* Page 2 */}

      <button
        type="button"
        onClick={() => setCurrentPage(2)}
        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl font-semibold transition duration-300 ${
          currentPage === 2
            ? "bg-gradient-to-r from-[#081D4A] to-[#6C3CE9] text-white shadow-lg scale-105"
            : "bg-white/90 text-gray-600 border border-white hover:bg-violet-100 hover:text-violet-700"
        }`}
      >
        2
      </button>

      {/* Page 3 */}

      <button
        type="button"
        onClick={() => setCurrentPage(3)}
        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl font-semibold transition duration-300 ${
          currentPage === 3
            ? "bg-gradient-to-r from-[#081D4A] to-[#6C3CE9] text-white shadow-lg scale-105"
            : "bg-white/90 text-gray-600 border border-white hover:bg-violet-100 hover:text-violet-700"
        }`}
      >
        3
      </button>

      {/* Dots */}

      <span className="px-1 sm:px-2 text-gray-500 font-semibold">
        ...
      </span>

      {/* Page 10 */}

      <button
        type="button"
        onClick={() => setCurrentPage(10)}
        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl font-semibold transition duration-300 ${
          currentPage === 10
            ? "bg-gradient-to-r from-[#081D4A] to-[#6C3CE9] text-white shadow-lg scale-105"
            : "bg-white/90 text-gray-600 border border-white hover:bg-violet-100 hover:text-violet-700"
        }`}
      >
        10
      </button>

      {/* Next */}

      <button
        type="button"
        disabled={currentPage === 10}
        onClick={() =>
          setCurrentPage((page) => Math.min(10, page + 1))
        }
        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center border transition duration-300 ${
          currentPage === 10
            ? "border-gray-200 text-gray-300 cursor-not-allowed bg-white/60"
            : "border-white bg-white/90 text-gray-600 hover:bg-violet-100 hover:text-violet-700 hover:border-violet-200"
        }`}
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>

      {/* Animation */}

      <style>{`
        @keyframes paginationFadeUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

    </div>
  );
}

export default UniversityPagination;