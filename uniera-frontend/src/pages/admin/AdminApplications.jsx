// All student applications with status filter + search. Each row links to the review page.
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Search, FileText } from "lucide-react";
import { adminApi, errMsg, fmtDate } from "../../api";
import { Card, Spinner, Alert, Empty, PageTitle, inputCls } from "../../components/ui";
import StatusBadge from "../../components/StatusBadge";

export default function AdminApplications() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const status = params.get("status") || "All"; // kept in the URL so dashboard links work
  const [search, setSearch] = useState("");
  const [statuses, setStatuses] = useState([]);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleError = (e) => {
    if (e?.response?.status === 401) {
      localStorage.removeItem("staff_token");
      navigate("/admin/login");
    } else setError(errMsg(e));
  };

  // status list for the filter chips
  useEffect(() => {
    adminApi().get("/stats").then((r) => setStatuses(r.data.statuses || [])).catch(handleError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // reload when filter / search changes (search is debounced by 300 ms)
  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(true);
      setError("");
      adminApi()
        .get("/applications", { params: { status: status === "All" ? undefined : status, search: search || undefined } })
        .then((r) => setApps(r.data.applications || []))
        .catch(handleError)
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, search]);

  const pickStatus = (s) => setParams(s === "All" ? {} : { status: s });

  return (
    <div className="space-y-6">
      <PageTitle title="Applications" subtitle="Review documents, move status and record university decisions." />

      <div className="flex flex-wrap gap-2">
        {["All", ...statuses].map((s) => (
          <button
            key={s}
            onClick={() => pickStatus(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
              status === s ? "bg-[#1e1147] text-white border-[#1e1147]" : "bg-white text-slate-600 border-slate-200 hover:border-[#7c3aed]"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          className={`${inputCls} pl-9`}
          placeholder="Search ref, student, university or course"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Alert>{error}</Alert>

      <Card className="overflow-hidden">
        {loading ? (
          <Spinner />
        ) : apps.length === 0 ? (
          <Empty icon={FileText} title="No applications found" text="Try another status or search term." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                <tr>
                  {["Ref", "Student", "University / course", "Intake", "Status", "Pending docs", "Eligibility", "Updated", ""].map((h) => (
                    <th key={h} className="text-left font-semibold px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {apps.map((a) => (
                  <tr key={a.application_id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">{a.app_ref}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800">{a.student_name || "—"}</p>
                      <p className="text-xs text-slate-500">{a.student_email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-slate-800">{a.university}</p>
                      <p className="text-xs text-slate-500">{a.course_name}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{a.intake || "—"}</td>
                    <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                    <td className="px-4 py-3 text-center">
                      {a.pending_docs > 0 ? (
                        <span className="text-xs font-semibold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">{a.pending_docs}</span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{a.eligibility_result ? <StatusBadge status={a.eligibility_result} /> : "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-500">{fmtDate(a.updated_at)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Link to={`/admin/applications/${a.application_id}`} className="text-[#7c3aed] font-medium hover:underline">
                        Review →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
