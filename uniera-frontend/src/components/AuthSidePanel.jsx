<<<<<<< HEAD
import { GraduationCap, Award, Handshake } from "lucide-react";
=======
import { GraduationCap, DollarSign, BadgeCheck } from "lucide-react";
>>>>>>> f7cc527880b4d30cc38f9ff9a9d54e623d718278
import logo from "../assets/uniera-logo.jpg";

export default function AuthSidePanel({ heading, description }) {
  return (
<<<<<<< HEAD
    <div className="hidden lg:flex flex-col justify-center items-center w-1/2 shrink-0 h-screen overflow-hidden bg-gradient-to-br from-[#1e1147] via-[#3b1a78] to-[#6d28d9] text-white px-12 py-10">
      <img
        src={logo}
        alt="Uniera"
        className="w-36 h-36 rounded-2xl bg-white p-3 mb-8 shadow-lg"
      />

      <h1 className="text-5xl font-extrabold text-center leading-tight mb-6">{heading}</h1>

      <p className="text-center text-gray-300 max-w-md mb-12">{description}</p>

      <div className="grid grid-cols-3 gap-4 w-full max-w-md">
        {/* Honest, verifiable highlights only (no made-up success rates) */}
        <StatCard icon={<GraduationCap size={22} />} value="39" label="Australian universities" />
        <StatCard icon={<Award size={22} />} value="Scholarship" label="guidance" />
        <StatCard icon={<Handshake size={22} />} value="End-to-end" label="support" />
      </div>

      <p className="text-xs text-gray-400 mt-12">&copy; 2026 UNIERA INTERNATIONAL EDUCATION</p>
=======
    <div className="hidden lg:flex flex-col justify-center items-center w-1/2 min-h-screen bg-gradient-to-br from-[#1e1147] via-[#3b1a78] to-[#6d28d9] text-white px-12 py-10">
      <img
        src={logo}
        alt="Uniera"
        className="w-40 h-40 rounded-2xl bg-white p-3 mb-10 shadow-lg"
      />

      <h1 className="text-5xl font-extrabold text-center leading-tight mb-6">
        {heading}
      </h1>

      <p className="text-center text-gray-300 max-w-md mb-14">
        {description}
      </p>

      <div className="grid grid-cols-3 gap-4 w-full max-w-md">
        <StatCard icon={<GraduationCap size={22} />} value="500+" label="Universities" />
        <StatCard icon={<DollarSign size={22} />} value="$2M+" label="Scholarships" />
        <StatCard icon={<BadgeCheck size={22} />} value="98%" label="Visa Success" />
      </div>

      <p className="text-xs text-gray-400 mt-16">
        © 2026 UNIERA INTERNATIONAL EDUCATION
      </p>
>>>>>>> f7cc527880b4d30cc38f9ff9a9d54e623d718278
    </div>
  );
}

function StatCard({ icon, value, label }) {
  return (
    <div className="bg-white/10 backdrop-blur rounded-xl py-5 px-3 flex flex-col items-center text-center">
      <div className="text-purple-300 mb-2">{icon}</div>
<<<<<<< HEAD
      <p className="text-base font-bold leading-tight">{value}</p>
      <p className="text-xs text-gray-300">{label}</p>
    </div>
  );
}
=======
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs text-gray-300">{label}</p>
    </div>
  );
}
>>>>>>> f7cc527880b4d30cc38f9ff9a9d54e623d718278
