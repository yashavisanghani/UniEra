import { Quote, Star, BadgeCheck, GraduationCap } from "lucide-react";

const SuccessStoryCard = ({ story }) => {
  return (
    <div className="group relative bg-white/95 backdrop-blur-xl rounded-3xl border border-white shadow-lg p-6 sm:p-7 overflow-hidden hover:-translate-y-2 hover:shadow-2xl transition-all duration-500">

      {/* Decorative glow */}

      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-violet-100/70 blur-3xl group-hover:bg-violet-200/70 transition duration-500" />

      {/* Quote icon */}

      <div className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center">

        <Quote
          className="text-violet-300"
          size={25}
        />

      </div>

      {/* Student Info */}

      <div className="relative flex items-center gap-4 pr-12">

        <div className="relative shrink-0">

          <img
            src={
              story.image ||
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300"
            }
            alt={story.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-violet-100 shadow-md group-hover:scale-105 transition duration-300"
          />

          {/* Verified badge */}

          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center">

            <BadgeCheck
              size={18}
              className="text-green-500"
              fill="currentColor"
            />

          </div>

        </div>

        <div className="min-w-0">

          <h3 className="text-lg sm:text-xl font-bold text-[#081D4A] truncate">
            {story.name}
          </h3>

          <div className="flex items-center gap-1.5 mt-1 text-gray-500">

            <GraduationCap
              size={15}
              className="text-violet-500 shrink-0"
            />

            <p className="text-sm truncate">
              {story.university}
            </p>

          </div>

          {/* Rating */}

          <div className="flex gap-0.5 mt-2">

            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={14}
                className="fill-yellow-400 text-yellow-400"
              />
            ))}

          </div>

        </div>

      </div>

      {/* Quote */}

      <div className="relative mt-7">

        <p className="text-gray-600 leading-7 italic text-sm sm:text-base">

          "{story.quote ||
            "UNIERA guided me through every step of my scholarship journey. From finding the perfect opportunity to submitting my application, everything became simple and stress-free."}"

        </p>

      </div>

      {/* Bottom */}

      <div className="relative mt-7 pt-5 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

        <div className="inline-flex self-start px-4 py-2 rounded-full bg-gradient-to-r from-violet-100 to-indigo-100 text-violet-700 font-bold text-sm">

          {story.amount}

        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">

          <span className="w-2 h-2 rounded-full bg-green-500" />

          Verified Student

        </div>

      </div>

    </div>
  );
};

export default SuccessStoryCard;