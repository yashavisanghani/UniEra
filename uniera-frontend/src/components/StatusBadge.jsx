const COLORS = {
  Submitted: "bg-blue-50 text-blue-700 border-blue-200",
  "Under Review": "bg-amber-50 text-amber-700 border-amber-200",
  "Documents Requested": "bg-orange-50 text-orange-700 border-orange-300",
  "Documents Verified": "bg-teal-50 text-teal-700 border-teal-200",
  "Sent to University": "bg-violet-50 text-violet-700 border-violet-200",
  "Conditional Offer": "bg-lime-50 text-lime-700 border-lime-300",
  "Unconditional Offer": "bg-green-50 text-green-700 border-green-300",
  "Offer Accepted": "bg-green-100 text-green-800 border-green-300",
  "CoE Issued": "bg-emerald-100 text-emerald-800 border-emerald-300",
  "Visa Lodged": "bg-sky-100 text-sky-800 border-sky-300",
  "Visa Granted": "bg-emerald-600 text-white border-emerald-600",
  Rejected: "bg-red-50 text-red-700 border-red-200",
  Withdrawn: "bg-slate-100 text-slate-500 border-slate-200",
  // document statuses
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Verified: "bg-green-50 text-green-700 border-green-200",
  Missing: "bg-slate-100 text-slate-500 border-slate-200",
  Eligible: "bg-green-50 text-green-700 border-green-200",
  "Partially eligible": "bg-amber-50 text-amber-700 border-amber-200",
  "Not eligible": "bg-red-50 text-red-700 border-red-200",
  "On file": "bg-emerald-50 text-emerald-700 border-emerald-200",
  Replaced: "bg-slate-100 text-slate-400 border-slate-200",
  Requested: "bg-amber-50 text-amber-700 border-amber-200",
  Confirmed: "bg-green-50 text-green-700 border-green-200",
  Cancelled: "bg-slate-100 text-slate-500 border-slate-200",
  Success: "bg-green-50 text-green-700 border-green-200",
};

export default function StatusBadge({ status, className = "" }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap text-xs font-semibold px-2.5 py-1 rounded-full border ${
        COLORS[status] || "bg-slate-100 text-slate-600 border-slate-200"
      } ${className}`}
    >
      {status}
    </span>
  );
}
