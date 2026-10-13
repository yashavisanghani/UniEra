// Student portal home: summary of the student's journey with UniEra.
// Data comes from one call: GET /dashboard/:uid
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText, Clock, Building2, Award, AlertTriangle, Search, Heart, BookOpen, Landmark, House,
  Bell, Sparkles, ArrowRight, ChevronRight, User, GraduationCap, Calendar,
} from "lucide-react";
import { api, currentUser, errMsg, fmtDate, inr } from "../../api";
import { Card, Button, Spinner, Alert, Empty, StatCard } from "../../components/ui";
import StatusBadge from "../../components/StatusBadge";

// The 8 stages of an application (stage_index 0..7 from the backend)
const STAGES = ["Submitted", "Review", "Verified", "Sent", "Decision", "Accepted", "CoE", "Visa"];

// Small progress bar that shows how far an application has moved
export function MiniProgress({ stage = 0, status }) {
  const closed = status === "Rejected" || status === "Withdrawn";
  const pct = Math.round(((stage + 1) / STAGES.length) * 100);
  return (
    <div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${closed ? "bg-slate-300" : "bg-gradient-to-r from-[#7c3aed] to-[#a78bfa]"}`}
          style={{ width: `${closed ? 100 : pct}%` }}
        />
      </div>
      <p className="text-[11px] text-slate-400 mt-1">
        {closed ? "Closed" : `Stage ${stage + 1} of ${STAGES.length} · ${STAGES[stage]}`}
      </p>
    </div>
  );
}

const QUICK_ACTIONS = [
  { to: "/portal/universities", label: "Find universities", text: "Explore Australian universities", icon: Search },
  { to: "/portal/shortlist", label: "Shortlist & compare", text: "Compare fees, costs and eligibility", icon: Heart },
  { to: "/portal/test-prep", label: "Test prep", text: "IELTS, PTE, TOEFL, GRE batches", icon: BookOpen },
  { to: "/portal/loans", label: "Education loan", text: "Compare lenders and apply", icon: Landmark },
  { to: "/portal/accommodation", label: "Accommodation", text: "Student housing near campus", icon: House },
];

export default function Dashboard() {
  const user = currentUser();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/dashboard/${user.id}`)
      .then((r) => setData(r.data))
      .catch((e) => setError(errMsg(e, "Could not load your dashboard")));
  }, [user.id]);

  if (error) return <Alert>{error}</Alert>;
  if (!data) return <Spinner label="Loading your dashboard..." />;

  const { stats, applications, notifications, recommendations, shortlist = {}, loans = [], test_prep = [] } = data;
  const completeness = data.profile_completeness || 0;

  return (
    <div className="space-y-6">
      {/* ---------- welcome banner ---------- */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1e1147] via-[#3b1d8f] to-[#7c3aed] text-white p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10" />
        <div className="absolute right-20 -bottom-16 w-40 h-40 rounded-full bg-white/5" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-violet-200 text-sm">Welcome back,</p>
            <h1 className="text-2xl sm:text-3xl font-bold mt-1">{data.user?.name || user.name}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-3 text-sm">
              {data.package && (
                <span className="inline-flex items-center gap-1.5 bg-white/15 border border-white/20 px-3 py-1 rounded-full font-medium">
                  <Sparkles size={14} /> {data.package} package
                </span>
              )}
              {data.enrolled_on && (
                <span className="inline-flex items-center gap-1.5 text-violet-100">
                  <Calendar size={14} /> Enrolled on {fmtDate(data.enrolled_on)}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="light" onClick={() => navigate("/portal/universities")}>
              <Search size={16} /> Find universities
            </Button>
          </div>
        </div>
      </div>

      {/* ---------- profile completeness ---------- */}
      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-[#7c3aed] flex items-center justify-center">
              <User size={20} />
            </div>
            <div>
              <p className="font-semibold text-slate-800">Profile completeness</p>
              <p className="text-xs text-slate-500">
                A complete profile lets us reuse your documents in every application.
              </p>
            </div>
          </div>
          <Link to="/portal/profile" className="text-sm font-medium text-[#7c3aed] hover:underline inline-flex items-center gap-1">
            {completeness < 100 ? "Complete profile" : "View profile"} <ChevronRight size={16} />
          </Link>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${completeness >= 80 ? "bg-emerald-500" : completeness >= 50 ? "bg-amber-500" : "bg-red-400"}`}
              style={{ width: `${completeness}%` }}
            />
          </div>
          <span className="text-sm font-bold text-[#1e1147] w-12 text-right">{completeness}%</span>
        </div>
      </Card>

      {/* ---------- stat cards ---------- */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard icon={FileText} label="Total applications" value={stats.total} onClick={() => navigate("/portal/applications")} />
        <StatCard icon={Clock} label="In progress" value={stats.in_progress} tone="blue" />
        <StatCard icon={Building2} label="Awaiting university" value={stats.awaiting_university} tone="amber" />
        <StatCard icon={Award} label="Offers" value={stats.offers} tone="green" onClick={() => navigate("/portal/offers")} />
        <StatCard icon={AlertTriangle} label="Action needed" value={stats.action_needed} tone="red" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ---------- left column ---------- */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="font-bold text-[#1e1147]">My applications</h2>
              {applications.length > 0 && (
                <Link to="/portal/applications" className="text-sm text-[#7c3aed] hover:underline">View all</Link>
              )}
            </div>
            {applications.length === 0 ? (
              <Empty
                icon={FileText}
                title="You haven't applied yet"
                text="Open a university → check eligibility → click “Apply via UniEra”. We'll track every step here."
                action={
                  <Button onClick={() => navigate("/portal/universities")}>
                    Browse universities <ArrowRight size={16} />
                  </Button>
                }
              />
            ) : (
              <ul className="divide-y divide-slate-100">
                {applications.slice(0, 5).map((a) => (
                  <li key={a.application_id}>
                    <Link
                      to={`/portal/applications/${a.application_id}`}
                      className="grid sm:grid-cols-[1fr_180px_auto] gap-3 items-center px-5 py-4 hover:bg-slate-50"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 truncate">{a.university}</p>
                        <p className="text-sm text-slate-500 truncate">{a.course_name}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {a.app_ref} · {a.intake}
                        </p>
                      </div>
                      <MiniProgress stage={a.stage_index} status={a.status} />
                      <div className="flex items-center gap-2 sm:justify-end">
                        <StatusBadge status={a.status} />
                        <ChevronRight size={16} className="text-slate-300" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* quick actions */}
          <div>
            <h2 className="font-bold text-[#1e1147] mb-3">Quick actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
              {QUICK_ACTIONS.map((q) => (
                <Link
                  key={q.to}
                  to={q.to}
                  className="bg-white border border-slate-200 rounded-2xl p-4 hover:border-violet-300 hover:shadow-md transition group"
                >
                  <div className="w-10 h-10 rounded-xl bg-violet-50 text-[#7c3aed] flex items-center justify-center group-hover:bg-[#7c3aed] group-hover:text-white transition">
                    <q.icon size={20} />
                  </div>
                  <p className="font-semibold text-sm text-slate-800 mt-3">{q.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{q.text}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* recommended universities */}
          <Card className="p-5">
            <h2 className="font-bold text-[#1e1147]">Recommended for your profile</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Universities in tiers whose entry criteria match your academic score, English score and budget.
            </p>
            {recommendations.length === 0 ? (
              <p className="text-sm text-slate-500 mt-4">
                Add your academic percentage and English test score to your{" "}
                <Link to="/portal/profile" className="text-[#7c3aed] hover:underline">profile</Link> to get recommendations.
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3 mt-4">
                {recommendations.map((u) => (
                  <Link
                    key={u.university_id}
                    to={`/portal/universities/${u.university_id}`}
                    className="flex items-center gap-3 border border-slate-200 rounded-xl p-3 hover:border-violet-300 hover:bg-violet-50/40"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1e1147] to-[#7c3aed] text-white flex items-center justify-center shrink-0">
                      <GraduationCap size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-slate-800 truncate">{u.name}</p>
                      <p className="text-xs text-slate-500">
                        {u.city}, {u.state} · {u.uni_tier}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* ---------- right column ---------- */}
        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
              <Bell size={18} className="text-[#7c3aed]" />
              <h2 className="font-bold text-[#1e1147]">Recent updates</h2>
              {data.unread > 0 && (
                <span className="ml-auto text-[11px] font-semibold bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
                  {data.unread} new
                </span>
              )}
            </div>
            {notifications.length === 0 ? (
              <p className="p-5 text-sm text-slate-500">No updates yet.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {notifications.map((n) => (
                  <li key={n.notification_id} className="px-5 py-3">
                    <p className="text-sm font-medium text-slate-800 flex items-center gap-2">
                      {!n.is_read && <span className="w-2 h-2 rounded-full bg-[#7c3aed] shrink-0" />}
                      {n.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{fmtDate(n.created_at, true)}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="p-5">
            <h2 className="font-bold text-[#1e1147] mb-3">My shortlist</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/portal/shortlist" className="rounded-xl bg-violet-50 p-3 text-center hover:bg-violet-100">
                <p className="text-2xl font-bold text-[#7c3aed]">{shortlist.university || 0}</p>
                <p className="text-xs text-slate-600">Universities</p>
              </Link>
              <Link to="/portal/shortlist" className="rounded-xl bg-sky-50 p-3 text-center hover:bg-sky-100">
                <p className="text-2xl font-bold text-sky-600">{shortlist.scholarship || 0}</p>
                <p className="text-xs text-slate-600">Scholarships</p>
              </Link>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-[#1e1147]">Education loans</h2>
              <Link to="/portal/loans" className="text-xs text-[#7c3aed] hover:underline">Open</Link>
            </div>
            {loans.length === 0 ? (
              <p className="text-sm text-slate-500">No loan requests yet.</p>
            ) : (
              <ul className="space-y-2">
                {loans.map((l) => (
                  <li key={l.loan_ref} className="flex items-center justify-between gap-2 text-sm">
                    <div className="min-w-0">
                      <p className="font-medium text-slate-800 truncate">{l.lender}</p>
                      <p className="text-xs text-slate-500">
                        {l.loan_ref} · {inr(l.amount_inr)}
                      </p>
                    </div>
                    <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full whitespace-nowrap">
                      {l.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-[#1e1147]">Test preparation</h2>
              <Link to="/portal/test-prep" className="text-xs text-[#7c3aed] hover:underline">Open</Link>
            </div>
            {test_prep.length === 0 ? (
              <p className="text-sm text-slate-500">No batches booked yet.</p>
            ) : (
              <ul className="space-y-2">
                {test_prep.map((t, i) => (
                  <li key={i} className="text-sm">
                    <p className="font-medium text-slate-800">
                      {t.test_name} · {t.mode}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {t.batch} · starts {fmtDate(t.start_date)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
