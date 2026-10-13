// Consultancy desk overview: key numbers, applications by status, top universities, items needing action.
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users, UserCheck, FileText, Inbox, Search, Send, Award, FileWarning, IndianRupee, Landmark, Mail, School, ArrowRight,
} from "lucide-react";
import { adminApi, errMsg, fmtDate, inr } from "../../api";
import { Card, Spinner, Alert, Empty, PageTitle, StatCard } from "../../components/ui";
import StatusBadge from "../../components/StatusBadge";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [attention, setAttention] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const http = adminApi();
    Promise.all([
      http.get("/stats"),
      http.get("/applications", { params: { status: "Submitted" } }),
      http.get("/applications", { params: { status: "Documents Requested" } }),
    ])
      .then(([s, a, b]) => {
        setStats(s.data);
        setAttention([...a.data.applications, ...b.data.applications]);
      })
      .catch((e) => {
        // token expired / missing → back to staff login
        if (e?.response?.status === 401) {
          localStorage.removeItem("staff_token");
          navigate("/admin/login");
          return;
        }
        setError(errMsg(e));
      });
  }, [navigate]);

  if (error) return <Alert>{error}</Alert>;
  if (!stats) return <Spinner label="Loading dashboard..." />;

  const go = (status) => navigate(`/admin/applications${status ? `?status=${encodeURIComponent(status)}` : ""}`);
  const byStatus = Object.entries(stats.by_status || {}).sort((a, b) => b[1] - a[1]);
  const maxCount = Math.max(1, ...byStatus.map(([, c]) => c));

  return (
    <div className="space-y-8">
      <PageTitle title="Dashboard" subtitle="Everything happening at UniEra today." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Registered students" value={stats.students} onClick={() => navigate("/admin/students")} />
        <StatCard icon={UserCheck} label="Enrolled (paid)" value={stats.enrolled} tone="green" onClick={() => navigate("/admin/students")} />
        <StatCard icon={FileText} label="Total applications" value={stats.total_applications} onClick={() => go()} />
        <StatCard icon={Inbox} label="New (submitted)" value={stats.new} tone="blue" onClick={() => go("Submitted")} />
        <StatCard icon={Search} label="In review" value={stats.in_review} tone="amber" onClick={() => go("Under Review")} />
        <StatCard icon={Send} label="Awaiting university" value={stats.awaiting_university} onClick={() => go("Sent to University")} />
        <StatCard icon={Award} label="Offers & beyond" value={stats.offers} tone="green" />
        <StatCard icon={FileWarning} label="Pending documents" value={stats.pending_documents} tone="red" />
        <StatCard icon={IndianRupee} label="Revenue collected" value={inr(stats.revenue_inr)} tone="green" onClick={() => navigate("/admin/services")} />
        <StatCard icon={Landmark} label="Open loan requests" value={stats.open_loans} tone="amber" onClick={() => navigate("/admin/services")} />
        <StatCard icon={Mail} label="New enquiries" value={stats.new_enquiries} tone="blue" onClick={() => navigate("/admin/services")} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Applications by status — simple div bars */}
        <Card className="p-5 lg:col-span-2">
          <h2 className="font-bold text-[#1e1147] mb-4">Applications by status</h2>
          {byStatus.length === 0 ? (
            <Empty icon={FileText} title="No applications yet" />
          ) : (
            <div className="space-y-3">
              {byStatus.map(([status, count]) => (
                <button key={status} onClick={() => go(status)} className="w-full text-left group">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700 group-hover:text-[#7c3aed]">{status}</span>
                    <span className="font-semibold text-slate-800">{count}</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#1e1147] to-[#7c3aed]"
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </Card>

        {/* Top universities */}
        <Card className="p-5">
          <h2 className="font-bold text-[#1e1147] mb-4">Top universities</h2>
          {(stats.top_universities || []).length === 0 ? (
            <Empty icon={School} title="No data yet" />
          ) : (
            <ol className="space-y-3">
              {stats.top_universities.map((u, i) => (
                <li key={u.name} className="flex items-center gap-3 text-sm">
                  <span className="w-6 h-6 rounded-full bg-violet-50 text-[#7c3aed] text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-slate-700">{u.name}</span>
                  <span className="font-semibold">{u.c}</span>
                </li>
              ))}
            </ol>
          )}
        </Card>
      </div>

      {/* Needs attention */}
      <Card className="p-5">
        <h2 className="font-bold text-[#1e1147] mb-1">Needs your attention</h2>
        <p className="text-xs text-slate-500 mb-4">New submissions to review and applications waiting on student documents.</p>
        {attention.length === 0 ? (
          <Empty icon={Inbox} title="All caught up" text="No new or document-requested applications." />
        ) : (
          <div className="divide-y divide-slate-100">
            {attention.map((a) => (
              <Link
                key={a.application_id}
                to={`/admin/applications/${a.application_id}`}
                className="py-3 flex flex-wrap items-center justify-between gap-2 hover:bg-slate-50 -mx-2 px-2 rounded-lg"
              >
                <div>
                  <p className="font-medium text-slate-800">
                    {a.app_ref} · {a.student_name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {a.university} — {a.course_name} · updated {fmtDate(a.updated_at)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={a.status} />
                  <ArrowRight size={16} className="text-slate-400" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
