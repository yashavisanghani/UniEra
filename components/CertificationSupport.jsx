import { ShieldCheck, ArrowRight } from "lucide-react";

function CertificationSupport() {
  return (
    <section className="mt-10 overflow-hidden rounded-[32px] bg-gradient-to-r from-[#001A47] via-[#143D8D] to-[#6533E2] p-8 text-white shadow-xl">

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

        {/* Left */}

        <div className="flex items-start gap-5">

          <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-sm">

            <ShieldCheck size={34} />

          </div>

          <div>

            <h2 className="text-3xl font-bold">
              Need help with certifications?
            </h2>

            <p className="mt-3 max-w-2xl text-white/80 leading-7">
              Our admission experts can guide you with document
              verification, English proficiency tests, financial
              statements, visa paperwork, and every certification
              required for your dream university.
            </p>

          </div>

        </div>

        {/* Right */}

        <div className="flex flex-wrap gap-4">

          <button className="px-7 py-3 rounded-xl bg-white text-[#001A47] font-semibold hover:scale-105 transition-all duration-300">
            Learn More
          </button>

          <button className="px-7 py-3 rounded-xl bg-[#6533E2] hover:bg-[#7748EB] font-semibold flex items-center gap-2 transition-all duration-300">
            Talk to an Expert

            <ArrowRight size={18} />
          </button>

        </div>

      </div>

    </section>
  );
}

export default CertificationSupport;