import {
  Star,
  Quote,
} from "lucide-react";

function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      university: "University of Melbourne",
      image:
        "https://randomuser.me/api/portraits/women/68.jpg",
      review:
        "UNIERA made my study abroad journey incredibly smooth. The scholarship finder helped me secure financial aid and the roadmap kept me on track.",
    },
    {
      name: "Aarav Sharma",
      university: "Monash University",
      image:
        "https://randomuser.me/api/portraits/men/32.jpg",
      review:
        "Everything I needed was available in one place—from university recommendations to visa guidance. I couldn't have done it without UNIERA.",
    },
    {
      name: "Emily Carter",
      university: "University of Sydney",
      image:
        "https://randomuser.me/api/portraits/women/45.jpg",
      review:
        "The dashboard is beautiful and easy to use. The eligibility checker saved me so much time while applying.",
    },
  ];

  return (
    <section className="py-20 bg-transparent">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center">

          <span className="inline-block px-5 py-2 rounded-full bg-purple-100 text-[#6C3CE9] font-semibold">
            Student Success Stories
          </span>

          <h2 className="mt-6 text-5xl font-black text-[#081D4A]">
            Loved by Students Worldwide
          </h2>

          <p className="mt-5 text-lg text-slate-600 max-w-3xl mx-auto">
            Thousands of students have achieved their dream of studying abroad with UNIERA.
          </p>

        </div>

        <div className="grid lg:grid-cols-3 gap-8 mt-20">

          {testimonials.map((item, index) => (

            <div
              key={index}
              className="relative rounded-3xl bg-white p-8 shadow-xl hover:-translate-y-3 hover:shadow-2xl transition duration-300"
            >

              <Quote
                size={45}
                className="text-[#6C3CE9] opacity-20 absolute right-8 top-8"
              />

              <div className="flex">

                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    fill="#FFD43B"
                    color="#FFD43B"
                  />
                ))}

              </div>

              <p className="mt-6 text-slate-600 leading-8">
                "{item.review}"
              </p>

              <div className="flex items-center gap-4 mt-8">

                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 rounded-full object-cover"
                />

                <div>

                  <h3 className="font-bold text-lg text-[#081D4A]">
                    {item.name}
                  </h3>

                  <p className="text-slate-500">
                    {item.university}
                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default Testimonials;