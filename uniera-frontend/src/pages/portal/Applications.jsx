// List of all the student's applications with filter tabs.
// GET /applications?user_id=
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, Plus, ChevronRight, MapPin, Calendar, GraduationCap } from "lucide-react";
import { api, currentUser, errMsg, fmtDate } from "../../api";
import { Card, Button, Spinner, Alert, Empty, PageTitle, Tabs } from "../../components/ui";
import StatusBadge from "../../components/StatusBadge";
import { MiniProgress } from "./Dashboard";

const OFFER_STATUSES = ["Conditional Offer", "Unconditional Offer", "Offer Accepted", "CoE Issued", "Visa Lodged", "Visa Granted"];
const CLOSED_STATUSES = ["Rejected", "Withdrawn"];

// Same grouping the backend uses for the dashboard counts
const FILTERS = {
  all: () => true,
  progress: (a) => !CLOSED_STATUSES.includes(a.status) && !OFFER_STATUSES.includes(a.status),
  awaiting: (a) => a.status === "Sent to University",
  offers: (a) => OFFER_STATUSES.includes(a.status),
  closed: (a) => CLOSED_STATUSES.includes(a.status),
};

export default function Applications() {
  const user = currentUser();
  const navigate = useNavigate();
  const [apps, setApps] = useState(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("all");

  useEffect(() => {
    api
      .get("/applications", { params: { user_id: user.id } })
      .then((r) => setApps(r.data.applications || []))
      .catch((e) => setError(errMsg(e, "Could not load your applications")));
  }, [user.id]);

  const count = (key) => (apps || []).filter(FILTERS[key]).length;
  const tabs = [
    { value: "all", label: `All (${count("all")})` },
    { value: "progress", label: `In progress (${count("progress")})` },
    { value: "awaiting", label: `Awaiting university (${count("awaiting")})` },
    { value: "offers", label: `Offers (${count("offers")})` },
    { value: "closed", label: `Closed (${count("closed")})` },
  ];
  const shown = (apps || []).filter(FILTERS[tab]);

  return (
    <div>
      <PageTitle
        title="My applications"
        subtitle="Every application you have lodged through UniEra and where it stands."
        actions={
          <Button onClick={() => navigate("/portal/universities")}>
            <Plus size={16} /> New application
          </Button>
        }
      />

      {error && <Alert>{error}</Alert>}
      {!apps && !error && <Spinner label="Loading applications..." />}

      {apps && (
        <>
          <div className="mb-5">
            <Tabs tabs={tabs} value={tab} onChange={setTab} />
          </div>

          {shown.length === 0 ? (
            <Card>
              {apps.length === 0 ? (
                <Empty
                  icon={FileText}
                  title="No applications yet"
                  text="Open a university → check eligibility → click “Apply via UniEra”."
                  action={<Button onClick={() => navigate("/portal/universities")}>Browse universities</Button>}
                />
              ) : (
                <Empty icon={FileText} title="Nothing here" text="No applications match this filter." />
              )}
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {shown.map((a) => (
                <Link key={a.application_id} to={`/portal/applications/${a.application_id}`} className="block group">
                  <Card className="p-5 h-full flex flex-col group-hover:border-violet-300 group-hover:shadow-md transition">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-bold text-[#1e1147] truncate">{a.university}</p>
                        <p className="text-sm text-slate-600 truncate">{a.course_name}</p>
                      </div>
                      <StatusBadge status={a.status} />
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1"><GraduationCap size={13} /> {a.level}</span>
                      <span className="inline-flex items-center gap-1"><Calendar size={13} /> Intake {a.intake}</span>
                      {a.city && <span className="inline-flex items-center gap-1"><MapPin size={13} /> {a.city}</span>}
                    </div>

                    <p className="text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2 mt-3">{a.status_message}</p>

                    <div className="mt-4">
                      <MiniProgress stage={a.stage_index} status={a.status} />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 mt-auto pt-4 text-xs">
                      <div className="text-slate-500 space-x-3">
                        <span className="font-mono font-semibold text-slate-700">{a.app_ref}</span>
                        <span>Submitted {fmtDate(a.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {a.eligibility_result && <StatusBadge status={a.eligibility_result} />}
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-[#7c3aed]" />
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
