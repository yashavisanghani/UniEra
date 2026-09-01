import { GraduationCap, DollarSign, BadgeCheck } from "lucide-react";
import logo from "../assets/logo.png";

export default function AuthSidePanel({ heading, description }) {
  return (
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
    </div>
  );
}

function StatCard({ icon, value, label }) {
  return (
    <div className="bg-white/10 backdrop-blur rounded-xl py-5 px-3 flex flex-col items-center text-center">
      <div className="text-purple-300 mb-2">{icon}</div>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs text-gray-300">{label}</p>
    </div>
  );
}