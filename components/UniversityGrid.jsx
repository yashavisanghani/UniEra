// src/components/UniversityGrid.jsx

import UniversityListingCard from "./UniversityListingCard";

const universities = [
  {
    id: 1,
    name: "University of Melbourne",
    location: "Melbourne, Australia",
    rank: 13,
    rating: 4.9,
    fees: "AUD 40,000 - 55,000 / year",
    image:
      "https://cdn.britannica.com/96/130496-050-1443F0BC/Main-Building-University-of-Melbourne-Ormond-College.jpg?w=300",
    description:
      "One of Australia's top universities offering world-class education, research opportunities, and global recognition.",
  },
  {
    id: 2,
    name: "University of Sydney",
    location: "Sydney, Australia",
    rank: 18,
    rating: 4.8,
    fees: "AUD 40,000 - 55,000 / year",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwBkzpFoMxYW_qn7gjw6CY_gny-P_wBqWkRvualfnt74ZjZs9b4v3WUZU0&s=10",
    description:
      "A prestigious Group of Eight university known for academic excellence, innovation, and outstanding student experience.",
  },
  {
    id: 3,
    name: "Australian National University",
    location: "Canberra, Australia",
    rank: 30,
    rating: 4.9,
    fees: "AUD 44,000 - 60,000 / year",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBVT14ESO98hyxUELsucOqm1-OOy3ie9554QQB_4ELmdXf63kULIY4nb4u&s=10",
    description:
      "Australia's national university, globally recognized for excellence in research, science, and international studies.",
  },
  {
    id: 4,
    name: "University of New South Wales (UNSW)",
    location: "Sydney, Australia",
    rank: 19,
    rating: 4.8,
    fees: "AUD 42,000 - 58,000 / year",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtaJo1V7OUAc27JvK5qlL-1QFipaTK3WtyCNd1n0PFW-GD4aIBzoX-t2oN&s=10",
    description:
      "A leading Group of Eight university known for engineering, business, technology, and innovation.",
  },
  {
    id: 5,
    name: "University of Queensland",
    location: "Brisbane, Australia",
    rank: 40,
    rating: 4.8,
    fees: "AUD 41,000 - 56,000 / year",
    image:
      "https://images.shiksha.com/mediadata/images/1533634003phpU487Ny.png",
    description:
      "One of Australia's leading universities with excellent research and student opportunities.",
  },
  {
    id: 6,
    name: "Monash University",
    location: "Melbourne, Australia",
    rank: 37,
    rating: 4.8,
    fees: "AUD 40,000 - 55,000 / year",
    image:
      "https://universitiesaustralia.edu.au/wp-content/uploads/2019/05/Monash-University-Indonesia-1335x1000.jpg",
    description:
      "An internationally recognized university offering excellent programs in medicine, engineering, IT, and business.",
  },
  {
    id: 7,
    name: "University of Western Australia",
    location: "Perth, Australia",
    rank: 77,
    rating: 4.7,
    fees: "AUD 39,000 - 53,000 / year",
    image:
      "https://universitiesaustralia.edu.au/wp-content/uploads/2019/06/UWA-3-web-1333x1000.jpg",
    description:
      "Known for world-class research, beautiful campus, and strong industry collaborations.",
  },
  {
    id: 8,
    name: "Adelaide University",
    location: "Adelaide, Australia",
    rank: 82,
    rating: 4.7,
    fees: "AUD 38,000 - 52,000 / year",
    image:
      "https://images.shiksha.com/mediadata/images/1507613211phpOfXXhe.jpeg",
    description:
      "Offers quality education, excellent research opportunities, and strong graduate employability.",
  },
];

function UniversityGrid() {
  return (
    <div className="relative">

      {/* Small section heading */}
      <div className="mb-6">

        <p className="text-violet-700 font-semibold text-sm uppercase tracking-widest">
          Explore Universities
        </p>

        <h2 className="text-2xl md:text-3xl font-bold text-[#081D4A] mt-1">
          Find Your Perfect University
        </h2>

        <p className="text-gray-600 mt-2">
          Compare top universities and discover the right destination
          for your study-abroad journey.
        </p>

      </div>

      {/* University Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">

        {universities.map((university, index) => (
          <div
            key={university.id}
            className="group rounded-2xl bg-white/95 backdrop-blur-xl border border-white shadow-lg overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            style={{
              animation: `universityCardIn ${
                0.15 + index * 0.08
              }s ease-out both`,
            }}
          >

            {/* Image area */}
            <div className="relative overflow-hidden">

              <img
                src={university.image}
                alt={university.name}
                className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Image overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#081D4A]/60 via-transparent to-transparent opacity-70" />

              {/* Ranking badge */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-full px-3 py-1.5 shadow-md">
                <span className="text-xs font-bold text-[#081D4A]">
                  #{university.rank} Ranked
                </span>
              </div>

              {/* Rating */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-full px-3 py-1.5 shadow-md flex items-center gap-1">
                <span className="text-yellow-500">★</span>

                <span className="text-sm font-bold text-gray-800">
                  {university.rating}
                </span>
              </div>

            </div>

            {/* Card Content */}
            <div className="p-6">

              {/* University Name */}
              <h3 className="text-xl font-bold text-[#081D4A] leading-tight group-hover:text-violet-700 transition">
                {university.name}
              </h3>

              {/* Location */}
              <p className="text-sm text-gray-500 mt-2 flex items-center gap-1.5">
                📍 {university.location}
              </p>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed mt-4 line-clamp-3">
                {university.description}
              </p>

              {/* Divider */}
              <div className="h-px bg-gray-100 my-5" />

              {/* Fees */}
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                    Tuition
                  </p>

                  <p className="text-sm font-semibold text-gray-800 mt-1">
                    {university.fees}
                  </p>
                </div>

                <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center group-hover:bg-violet-600 transition duration-300">
                  <span className="text-violet-700 group-hover:text-white transition">
                    →
                  </span>
                </div>

              </div>

              {/* View Details */}
              <button
                className="w-full mt-5 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#081D4A] to-[#6C3CE9] shadow-md hover:shadow-lg hover:opacity-95 transition"
              >
                View University Details
              </button>

            </div>

          </div>
        ))}

      </div>

      {/* Card animation */}
      <style>{`
        @keyframes universityCardIn {
          from {
            opacity: 0;
            transform: translateY(25px);
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

export default UniversityGrid;