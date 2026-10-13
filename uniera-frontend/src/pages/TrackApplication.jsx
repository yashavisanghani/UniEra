// Application status checker.
//   /track          (public)  -> anyone with the reference number + registered email
//   /portal/status  (portal)  -> email prefilled, student's own applications shown as quick-pick chips
import { useEffect, useState } from "react";
import { Search, Building2, BookOpen, CalendarDays, History, ListChecks, MessageSquare, FileSearch } from "lucide-react";
import { api, currentUser, errMsg, fmtDate } from "../api";
import { Card, Button, Field, Alert, Empty, PageTitle, inputCls } from "../components/ui";
import { PageHeader } from "../components/Layout";
import StatusBadge from "../components/StatusBadge";
import Timeline from "../components/Timeline";

export default function TrackApplication({ portal }) {
  const user = currentUser();
  const [ref, setRef] = useState("");
  const [email, setEmail] = useState(portal && user ? user.email : "");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [myApps, setMyApps] = useState([]); // portal only

  useEffect(() => {
    if (!portal || !user) return;
    api
      .get("/applications", { params: { user_id: user.id } })
      .then((r) => setMyApps(r.data.applications || []))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portal]);

  const track = async (refValue = ref) => {
    setError("");
    setData(null);
    setLoading(true);
    try {
      const r = await api.get("/applications/track", { params: { ref: refValue.trim(), email: email.trim() } });
      setData(r.data);
    } catch (e) {
      setError(errMsg(e));
    }
    setLoading(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    track();
  };

  // clicking a chip fills the reference and checks straight away
  const pick = (appRef) => {
    setRef(appRef);
    track(appRef);
  };

  const form = (
    <Card className="p-6">
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
        <Field label="Application reference">
          <input
            className={inputCls}
            placeholder="e.g. UE-2026-00001"
            value={ref}
            onChange={(e) => setRef(e.target.value.toUpperCase())}
            required
          />
        </Field>
        <Field label="Registered email">
          <input
            type="email"
            className={inputCls}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>
        <Button type="submit" loading={loading} className="h-[42px]">
          <Search size={16} /> Check status
        </Button>
      </form>

      {portal && myApps.length > 0 && (
        <div className="mt-5 pt-4 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-500 mb-2">Your applications</p>
          <div className="flex flex-wrap gap-2">
            {myApps.map((a) => (
              <button
                key={a.application_id}
                type="button"
                onClick={() => pick(a.app_ref)}
                className={`text-xs px-3 py-1.5 rounded-full border transition ${
                  ref === a.app_ref
                    ? "border-[#7c3aed] bg-violet-50 text-[#7c3aed]"
                    : "border-slate-200 text-slate-600 hover:border-[#7c3aed]"
                }`}
              >
                <strong>{a.app_ref}</strong> · {a.university}
              </button>
            ))}
          </div>
        </div>
      )}
    </Card>
  );

  const body = (
    <div className="space-y-6">
      {form}
      <Alert>{error}</Alert>
      {data ? (
        <Result data={data} />
      ) : (
        !loading &&
        !error && (
          <Card>
            <Empty
              icon={FileSearch}
              title="Enter your reference to see the status"
              text="Your reference number (like UE-2026-00001) is shown in your Student Portal and in the confirmation after you apply."
            />
          </Card>
        )
      )}
    </div>
  );

  if (portal) {
    return (
      <div>
        <PageTitle title="Application status" subtitle="Check the live status of any of your applications." />
        {body}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader
        title="Track your application"
        subtitle="Enter the reference number and the email you registered with UniEra."
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">{body}</div>
    </div>
  );
}

// ---------------------------------------------------------------- result card
function Result({ data }) {
  const a = data.application;
  const uni = data.university || {};
  const history = [...(data.history || [])].reverse(); // newest first
  const checklist = data.checklist || [];

  return (
    <div className="space-y-6">
      {/* summary */}
      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
          <div>
            <p className="text-xs text-slate-500">Reference</p>
            <p className="text-xl font-bold text-[#1e1147]">{a.app_ref}</p>
          </div>
          <StatusBadge status={a.status} className="text-sm" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <Info icon={Building2} label="University" value={uni.name} sub={uni.city ? `${uni.city}, ${uni.state}` : ""} />
          <Info icon={BookOpen} label="Course" value={a.course_name} sub={a.level} />
          <Info icon={CalendarDays} label="Intake" value={a.intake} sub={`Applied ${fmtDate(a.created_at)}`} />
        </div>

        {data.status_message && <Alert type="info">{data.status_message}</Alert>}
      </Card>

      {/* progress */}
      <Card className="p-6">
        <h3 className="font-bold text-[#1e1147] mb-6">Progress</h3>
        <Timeline steps={data.timeline} />
      </Card>

      {a.university_response && (
        <Card className="p-6 border-violet-200 bg-violet-50/40">
          <h3 className="font-bold text-[#1e1147] mb-2 flex items-center gap-2">
            <MessageSquare size={18} /> University response
          </h3>
          <p className="text-sm text-slate-700 whitespace-pre-line">{a.university_response}</p>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* history */}
        <Card className="p-6">
          <h3 className="font-bold text-[#1e1147] mb-4 flex items-center gap-2">
            <History size={18} /> History
          </h3>
          {history.length === 0 ? (
            <p className="text-sm text-slate-500">No updates yet.</p>
          ) : (
            <ul className="space-y-4">
              {history.map((h) => (
                <li key={h.history_id} className="flex gap-3">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-[#7c3aed] shrink-0" />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={h.status} />
                      <span className="text-xs text-slate-400">{fmtDate(h.changed_at, true)}</span>
                    </div>
                    {h.remarks && <p className="text-sm text-slate-700 mt-1">{h.remarks}</p>}
                    <p className="text-xs text-slate-400 mt-0.5">by {h.changed_by}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* documents */}
        <Card className="p-6">
          <h3 className="font-bold text-[#1e1147] mb-4 flex items-center gap-2">
            <ListChecks size={18} /> Document checklist
          </h3>
          {checklist.length === 0 ? (
            <p className="text-sm text-slate-500">No documents listed.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {checklist.map((c) => (
                <li key={c.doc_type} className="flex items-center justify-between gap-3 py-2.5">
                  <span className="text-sm text-slate-700">
                    {c.label}
                    {!c.required && <span className="text-xs text-slate-400"> (optional)</span>}
                  </span>
                  <StatusBadge status={c.status} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, value, sub }) {
  return (
    <div className="flex gap-3 bg-slate-50 rounded-xl p-4">
      <Icon size={20} className="text-[#7c3aed] shrink-0 mt-0.5" />
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="font-semibold text-[#1e1147] text-sm">{value || "—"}</p>
        {sub && <p className="text-xs text-slate-500">{sub}</p>}
      </div>
    </div>
  );
}
