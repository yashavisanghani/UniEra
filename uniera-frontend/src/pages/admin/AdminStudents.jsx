// All registered students: profile / package / application count.
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Users, CheckCircle2, XCircle } from "lucide-react";
import { adminApi, errMsg, fmtDate } from "../../api";
import { Card, Spinner, Alert, Empty, PageTitle, inputCls } from "../../components/ui";

export default function AdminStudents() {
  const navigate = useNavigate();
  const [students, setStudents] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi()
      .get("/students")
      .then((r) => setStudents(r.data.students || []))
      .catch((e) => {
        if (e?.response?.status === 401) {
          localStorage.removeItem("staff_token");
          navigate("/admin/login");
        } else setError(errMsg(e));
      });
  }, [navigate]);

  // the signup table's column names can vary, so fall back gracefully
  const nameOf = (s) => s.full_name || s.name || "—";
  const phoneOf = (s) => s.phone_number || s.phone || "—";

  const q = search.trim().toLowerCase();
  const shown = (students || []).filter(
    (s) => !q || `${nameOf(s)} ${s.email} ${phoneOf(s)}`.toLowerCase().includes(q)
  );

  return (
    <div className="space-y-6">
      <PageTitle
        title="Students"
        subtitle={students ? `${students.length} registered · ${students.filter((s) => s.is_enrolled).length} enrolled` : ""}
      />

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input className={`${inputCls} pl-9`} placeholder="Search name, email or phone" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Alert>{error}</Alert>

      <Card className="overflow-hidden">
        {!students && !error ? (
          <Spinner />
        ) : shown.length === 0 ? (
          <Empty icon={Users} title="No students found" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                <tr>
                  {["Name", "Email", "Phone", "Signed up", "Profile", "Package", "Applications"].map((h) => (
                    <th key={h} className="text-left font-semibold px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {shown.map((s) => (
                  <tr key={s.user_id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{nameOf(s)}</td>
                    <td className="px-4 py-3 text-slate-600">{s.email}</td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{phoneOf(s)}</td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{fmtDate(s.created_at) || "—"}</td>
                    <td className="px-4 py-3">
                      {s.has_profile ? (
                        <CheckCircle2 size={18} className="text-emerald-600" />
                      ) : (
                        <XCircle size={18} className="text-slate-300" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {s.package ? (
                        <span className="text-xs font-semibold bg-violet-50 text-[#7c3aed] px-2.5 py-1 rounded-full">{s.package}</span>
                      ) : (
                        <span className="text-xs text-slate-400">Not enrolled</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold">{s.applications}</td>
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
