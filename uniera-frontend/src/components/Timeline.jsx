import { Check, X } from "lucide-react";
import { fmtDate } from "../api";

// Progress tracker: Submitted -> ... -> Visa Granted
export default function Timeline({ steps = [] }) {
  return (
    <ol className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-y-6">
      {steps.map((s, i) => {
        const done = s.state === "done";
        const current = s.state === "current";
        const rejected = s.state === "rejected";
        return (
          <li key={i} className="relative flex flex-col items-center text-center px-1">
            {i < steps.length - 1 && (
              <span
                className={`hidden lg:block absolute top-4 left-1/2 w-full h-0.5 ${
                  done ? "bg-[#7c3aed]" : "bg-slate-200"
                }`}
              />
            )}
            <span
              className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                rejected
                  ? "bg-red-500 border-red-500 text-white"
                  : done
                  ? "bg-[#7c3aed] border-[#7c3aed] text-white"
                  : current
                  ? "bg-white border-[#7c3aed] text-[#7c3aed] ring-4 ring-violet-100"
                  : "bg-white border-slate-300 text-slate-400"
              }`}
            >
              {rejected ? <X size={16} /> : done ? <Check size={16} /> : i + 1}
            </span>
            <span
              className={`mt-2 text-xs font-medium leading-tight ${
                current ? "text-[#7c3aed]" : rejected ? "text-red-600" : done ? "text-slate-800" : "text-slate-400"
              }`}
            >
              {s.stage}
            </span>
            {s.date && <span className="text-[10px] text-slate-400 mt-0.5">{fmtDate(s.date)}</span>}
            {current && <span className="text-[10px] text-violet-500 mt-0.5">In progress</span>}
          </li>
        );
      })}
    </ol>
  );
}
