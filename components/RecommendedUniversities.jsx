function RecommendedUniversities() {
  const universities = [
    {
      name: "University of Oxford",
      country: "United Kingdom",
      rank: "#2 World Rank",
      match: "94%",
      fees: "$42,000/yr",
      image:
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
    },
    {
      name: "National University of Singapore",
      country: "Singapore",
      rank: "#8 World Rank",
      match: "88%",
      fees: "$35,000/yr",
      image:
        "https://images.unsplash.com/photo-1562774053-701939374585?w=800",
    },
    {
      name: "University of Melbourne",
      country: "Australia",
      rank: "#14 World Rank",
      match: "81%",
      fees: "$28,000/yr",
      image:
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800",
    },
  ];

  return (
    <section className="mt-10">

      {/* Header */}

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-3xl font-bold text-[#001A47]">
          Recommended Universities
        </h2>

        <button className="text-[#6533E2] font-semibold hover:underline">
          View All
        </button>

      </div>

      {/* University Cards */}

      <div className="flex gap-6 overflow-x-auto pb-4">

        {universities.map((uni, index) => (

          <div
            key={index}
            className="min-w-[320px] bg-white rounded-[28px] shadow-sm border border-purple-100 overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
          >

            {/* Image */}

            <img
              src={uni.image}
              alt={uni.name}
              className="w-full h-44 object-cover"
            />

            {/* Body */}

            <div className="p-6">

              <div className="flex justify-between items-start gap-3">

                <h3 className="text-xl font-bold text-[#001A47] leading-7">

                  {uni.name}

                </h3>

                <span className="bg-[#E9E2FF] text-[#6533E2] px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">

                  Match {uni.match}

                </span>

              </div>

              <p className="text-gray-500 mt-2">

                {uni.country} • {uni.rank}

              </p>

              <div className="mt-6 flex justify-between items-center">

                <span className="text-xl font-bold text-[#001A47]">

                  {uni.fees}

                </span>

                <button className="text-[#6533E2] font-semibold hover:underline">

                  Details

                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

export default RecommendedUniversities;