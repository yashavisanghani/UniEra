import { GraduationCap, Award, Handshake } from "lucide-react";
import logo from "../assets/uniera-logo.jpg";

export default function AuthSidePanel({ heading, description }) {
  return (
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
    </div>
  );
}

function StatCard({ icon, value, label }) {
  return (
    <div className="bg-white/10 backdrop-blur rounded-xl py-5 px-3 flex flex-col items-center text-center">
      <div className="text-purple-300 mb-2">{icon}</div>
      <p className="text-base font-bold leading-tight">{value}</p>
      <p className="text-xs text-gray-300">{label}</p>
    </div>
  );
}
