// src/components/UniversityListingCard.jsx

import {
  Heart,
  MapPin,
  Star,
  GraduationCap,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";

function UniversityListingCard({ university }) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="group bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden border border-white shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">

      {/* ================= IMAGE ================= */}

      <div className="relative overflow-hidden">

        <img
          src={university.image}
          alt={university.name}
          className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Image Overlay */}

        <div className="absolute inset-0 bg-gradient-to-t from-[#081D4A]/60 via-transparent to-transparent opacity-70" />

        {/* Ranking Badge */}

        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-full px-3 py-1.5 shadow-lg">

          <span className="text-xs font-bold text-[#081D4A]">
            QS #{university.rank}
          </span>

        </div>

        {/* Favourite */}

        <button
          type="button"
          onClick={() => setLiked(!liked)}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/95 backdrop-blur-md shadow-lg flex items-center justify-center hover:scale-110 transition"
          aria-label="Save university"
        >

          <Heart
            size={19}
            className={
              liked
                ? "text-red-500"
                : "text-gray-600"
            }
            fill={liked ? "currentColor" : "none"}
          />

        </button>

      </div>

      {/* ================= CONTENT ================= */}

      <div className="p-6">

        {/* Name + Rating */}

        <div className="flex justify-between items-start gap-3">

          <div className="min-w-0">

            <h2 className="text-xl font-bold text-[#001A47] leading-tight group-hover:text-violet-700 transition">

              {university.name}

            </h2>

            <div className="flex items-center gap-1.5 mt-2 text-gray-500 text-sm">

              <MapPin
                size={15}
                className="text-violet-500 shrink-0"
              />

              <span>
                {university.location}
              </span>

            </div>

          </div>

          {/* Rating */}

          <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-100 px-2.5 py-1 rounded-full shrink-0">

            <Star
              size={14}
              fill="currentColor"
              className="text-yellow-500"
            />

            <span className="font-bold text-sm text-gray-700">
              {university.rating}
            </span>

          </div>

        </div>

        {/* ================= QUICK DETAILS ================= */}

        <div className="grid grid-cols-2 gap-3 mt-6">

          {/* Ranking */}

          <div className="bg-violet-50 rounded-xl p-3">

            <div className="flex items-center gap-2">

              <GraduationCap
                size={18}
                className="text-violet-600"
              />

              <span className="text-xs text-gray-500">
                Ranking
              </span>

            </div>

            <p className="font-bold text-[#081D4A] mt-1">
              QS #{university.rank}
            </p>

          </div>

          {/* Fees */}

          <div className="bg-blue-50 rounded-xl p-3">

            <div className="flex items-center gap-2">

              <DollarSign
                size={18}
                className="text-blue-600"
              />

              <span className="text-xs text-gray-500">
                Tuition
              </span>

            </div>

            <p className="font-bold text-[#081D4A] mt-1 text-sm">
              {university.fees}
            </p>

          </div>

        </div>

        {/* ================= DESCRIPTION ================= */}

        <p className="text-gray-600 mt-5 text-sm leading-6 line-clamp-3">

          {university.description}

        </p>

        {/* ================= ACTIONS ================= */}

        <div className="flex gap-3 mt-6">

          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#081D4A] to-[#6C3CE9] hover:opacity-95 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition duration-300"
          >

            View Details

            <ArrowRight size={16} />

          </button>

          <button
            type="button"
            className="px-5 border border-violet-200 text-violet-700 bg-violet-50 hover:bg-violet-600 hover:text-white hover:border-violet-600 py-3 rounded-xl font-semibold transition duration-300"
          >
            Compare
          </button>

        </div>

      </div>

    </div>
  );
}

export default UniversityListingCard;