import { Sparkles } from "lucide-react";

function RoadmapHeader() {
  return (
    <section className="mb-10">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">

        <div>
          <h1 className="text-5xl font-extrabold text-[#001A47] mb-3">
            Application Roadmap
          </h1>

          <p className="text-lg text-gray-500 max-w-3xl leading-8">
            Track your progress toward international education. We've mapped
            out the key milestones to ensure you never miss a deadline.
          </p>
        </div>

        <div className="px-5 py-3 rounded-full bg-[#E8DEFF] text-[#6533E2] font-semibold flex items-center gap-2 w-fit">
          <Sparkles size={18} />
          4/6 Completed
        </div>

      </div>
    </section>
  );
}

export default RoadmapHeader;