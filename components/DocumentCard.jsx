import {
  Eye,
  Trash2,
  Upload,
  CheckCircle2,
  Clock3,
  Lock,
} from "lucide-react";

function DocumentCard({
  title,
  description,
  icon,
  status,
  statusColor,
  statusIcon,
  upload = false,
  optional = false,
}) {
  return (
    <div
      className={`rounded-[32px] p-6 border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col
      ${
        upload
          ? "border-2 border-dashed border-[#6533E2]/30 bg-[#F8F5FF]"
          : "bg-white border-gray-200"
      }`}
    >
      {/* Top */}

      <div className="flex justify-between items-start mb-6">

        <div className="w-14 h-14 rounded-2xl bg-[#F2F4F8] flex items-center justify-center">

          {icon}

        </div>

        <div
          className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${statusColor}`}
        >

          {statusIcon}

          {status}

        </div>

      </div>

      {/* Title */}

      <h3 className="text-2xl font-bold text-[#001A47]">
        {title}
      </h3>

      {/* Description */}

      <p className="text-gray-500 mt-3 leading-7 flex-1">
        {description}
      </p>

      {/* Bottom */}

      <div className="pt-5 mt-6 border-t border-gray-200">

        {upload ? (
          <div className="flex items-center justify-between">

            <span
              className={`text-sm ${
                optional ? "text-gray-400" : "text-[#6533E2]"
              }`}
            >
              {optional ? "No files yet" : "Required soon"}
            </span>

            <button
              className={`px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2 transition
              ${
                optional
                  ? "bg-[#001A47] hover:bg-[#0B2E6B]"
                  : "bg-gradient-to-r from-[#001A47] to-[#6533E2]"
              }`}
            >
              <Upload size={18} />

              Upload File
            </button>

          </div>
        ) : (
          <div className="flex justify-between items-center">

            <div className="flex gap-3">

              <button className="w-10 h-10 rounded-full hover:bg-[#E8DEFF] flex items-center justify-center transition">

                <Eye size={18} className="text-[#001A47]" />

              </button>

              <button className="w-10 h-10 rounded-full hover:bg-red-100 flex items-center justify-center transition">

                <Trash2 size={18} className="text-red-500" />

              </button>

            </div>

            <button
              disabled
              className="px-5 py-2 rounded-xl border border-[#001A47]/10 text-[#001A47] font-semibold opacity-50 cursor-not-allowed"
            >
              Re-upload
            </button>

          </div>
        )}

      </div>

    </div>
  );
}

export default DocumentCard;

/* ---------- Status Icons to use ----------

Done:
<CheckCircle2 size={15} />

Pending:
<Clock3 size={15} />

Optional:
<Lock size={15} />

------------------------------------------- */