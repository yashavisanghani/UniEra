import hero from "../assets/hero.png";
import UNIIMG from "../assets/smart_uni.jpg";

function Features() {
  return (
    <section className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black text-[#081D4A]">
            Why Choose UNIERA?
          </h2>

          <p className="mt-5 text-lg text-slate-600 max-w-3xl mx-auto">
            Everything you need for your study abroad journey in one intelligent
            platform.
          </p>
        </div>

        {/* Top Row */}
        <div className="grid lg:grid-cols-12 gap-6">

          {/* Smart Matching */}
          <div className="lg:col-span-7 rounded-[32px] bg-white shadow-xl p-10 hover:shadow-2xl duration-300">

            <div className="text-5xl mb-6">🎓</div>

            <h3 className="text-3xl font-bold text-[#081D4A]">
              Smart University Matching
            </h3>

            <p className="mt-5 text-slate-600 leading-8">
              Our AI-powered engine recommends universities based on your CGPA,
              budget, preferred course, IELTS score and career goals.
            </p>

            <div className="mt-10 rounded-3xl overflow-hidden">

              <img
                src={UNIIMG}
                alt="Students"
                className="w-full h-72 object-cover"
              />

            </div>

          </div>

          {/* Scholarship */}
          <div className="lg:col-span-5 rounded-[32px] bg-gradient-to-br from-[#6C3CE9] to-[#4A25C9] text-white p-10 shadow-xl">

            <div className="text-5xl">🏆</div>

            <h3 className="mt-6 text-3xl font-bold">
              Scholarship Finder
            </h3>

            <p className="mt-5 leading-8 text-purple-100">
              Discover scholarships that match your academic profile and never
              miss another deadline.
            </p>

            <div className="mt-16 border-t border-white/20 pt-8 flex justify-between items-center">

              <div>

                <h1 className="text-5xl font-black">
                  0+
                </h1>

                <p className="mt-2 text-purple-100">
                  Scholarships Tracked
                </p>

              </div>

              <div className="text-5xl">
                📈
              </div>

            </div>

          </div>

        </div>

        {/* Bottom Row */}
        <div className="grid lg:grid-cols-3 gap-6 mt-6">

          {/* Document */}
          <div className="rounded-[28px] bg-white shadow-lg p-8 min-h-[300px] hover:shadow-xl duration-300">

            <div className="text-5xl">
              📄
            </div>

            <h3 className="mt-5 text-2xl font-bold text-[#081D4A]">
              Document Vault
            </h3>

            <p className="mt-4 text-slate-600 leading-7">
              Store SOP, LOR, Passport, Transcripts and every important document
              securely in one place.
            </p>

          </div>

          {/* Roadmap */}
          <div className="rounded-[28px] bg-[#ECECFF] shadow-lg p-8 min-h-[300px] hover:shadow-xl duration-300">

            <div className="text-5xl">
              🛣️
            </div>

            <h3 className="mt-5 text-2xl font-bold text-[#081D4A]">
              Guided Roadmap
            </h3>

            <p className="mt-4 text-slate-600 leading-7">
              Follow every application stage from university selection to visa
              approval with step-by-step guidance.
            </p>

          </div>

          {/* Counselling */}
          <div className="rounded-[28px] bg-[#081D4A] text-white shadow-lg p-8 min-h-[300px] hover:shadow-xl duration-300">

            <div className="text-5xl">
              💬
            </div>

            <h3 className="mt-5 text-2xl font-bold">
              Expert Counselling
            </h3>

            <p className="mt-4 text-slate-300 leading-7">
              Connect with certified counsellors for personalised guidance,
              university shortlisting and visa support.
            </p>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Features;