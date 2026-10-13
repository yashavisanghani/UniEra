// Counsellor review screen: student profile, verify/reject each document,
// move the status forward, lodge with university and record the university's decision.
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileText, Check, X, Send, Award, User } from "lucide-react";
import { adminApi, errMsg, fmtDate, fileUrl } from "../../api";
import { Card, Button, Field, Spinner, Alert, inputCls } from "../../components/ui";
import StatusBadge from "../../components/StatusBadge";
import Timeline from "../../components/Timeline";

export default function AdminApplication() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [version, setVersion] = useState(0);
  const [remarks, setRemarks] = useState("");
  const [docRemarks, setDocRemarks] = useState({});
  const [decision, setDecision] = useState({ decision: "Unconditional Offer", response: "", file: null });
  const [busy, setBusy] = useState(false);

  const handle = (e) => {
    if (e?.response?.status === 401) {
      localStorage.removeItem("staff_token");
      navigate("/admin/login");
    }
    setError(errMsg(e));
  };

  useEffect(() => {
    adminApi().get(`/applications/${id}`).then((r) => setData(r.data)).catch(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, version]);

  const done = (m) => {
    setMsg(m);
    setError("");
    setVersion((v) => v + 1);
  };

  const reviewDoc = async (doc_id, status) => {
    try {
      const r = await adminApi().post(`/documents/${doc_id}`, { status, remarks: docRemarks[doc_id] || "" });
      done(r.data.message);
    } catch (e) {
      handle(e);
    }
  };

  const setStatus = async (status) => {
    setBusy(true);
    try {
      const r = await adminApi().post(`/applications/${id}/status`, { status, remarks });
      setRemarks("");
      done(r.data.message);
    } catch (e) {
      handle(e);
    }
    setBusy(false);
  };

  const recordDecision = async (e) => {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData();
    fd.append("decision", decision.decision);
    fd.append("response", decision.response);
    if (decision.file) fd.append("offer_letter", decision.file);
    try {
      const r = await adminApi().post(`/applications/${id}/decision`, fd);
      setDecision({ decision: "Unconditional Offer", response: "", file: null });
      done(r.data.message);
    } catch (err) {
      handle(err);
    }
    setBusy(false);
  };

  if (!data) return error ? <Alert>{error}</Alert> : <Spinner />;
  const a = data.application;
  const p = data.profile || {};
  const s = data.student || {};
  const docs = data.checklist.filter((d) => d.uploaded);
  const pending = docs.filter((d) => d.status === "Pending").length;
  const canDecide = ["Sent to University", "Conditional Offer"].includes(a.status);

  return (
    <div className="space-y-6">
      <Link to="/admin/applications" className="text-sm text-slate-500 hover:text-amber-600 flex items-center gap-1">
        <ArrowLeft size={14} /> All applications
      </Link>

      <Card className="p-6">
        <div className="flex flex-wrap justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-amber-600">{a.app_ref}</p>
            <h1 className="text-2xl font-bold text-slate-900">{s.name} → {data.university.name}</h1>
            <p className="text-slate-600">{a.course_name} · {a.level} · {a.intake}</p>
            <p className="text-xs text-slate-400 mt-1">Submitted {fmtDate(a.created_at, true)} · Eligibility check: {a.eligibility_result}</p>
          </div>
          <StatusBadge status={a.status} className="text-sm px-3 py-1.5 h-fit" />
        </div>
        <div className="mt-6"><Timeline steps={data.timeline} /></div>
      </Card>

      <Alert type="success">{msg}</Alert>
      <Alert>{error}</Alert>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* documents */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">Documents</h2>
              <span className="text-xs text-slate-500">{pending} pending review</span>
            </div>
            <div className="space-y-3">
              {data.checklist.map((d) => (
                <div key={d.doc_type} className="border border-slate-200 rounded-xl p-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <FileText size={18} className="text-slate-400" />
                    <div className="flex-1 min-w-[150px]">
                      <p className="text-sm font-medium">{d.label} {d.required && <span className="text-red-500">*</span>}</p>
                      {d.file_name ? (
                        <a href={fileUrl(d.file_name)} target="_blank" rel="noreferrer" className="text-xs text-amber-600 hover:underline">
                          Open file ({d.source === "profile" ? "from profile" : "uploaded"})
                        </a>
                      ) : (
                        <p className="text-xs text-slate-400">Not uploaded</p>
                      )}
                      {d.remarks && <p className="text-xs text-red-600">Remark: {d.remarks}</p>}
                    </div>
                    <StatusBadge status={d.status} />
                  </div>
                  {d.doc_id && d.status !== "Verified" && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      <input
                        className={`${inputCls} flex-1 min-w-[180px] py-1.5`}
                        placeholder="Remark (needed when rejecting)"
                        value={docRemarks[d.doc_id] || ""}
                        onChange={(e) => setDocRemarks({ ...docRemarks, [d.doc_id]: e.target.value })}
                      />
                      <Button size="sm" variant="success" onClick={() => reviewDoc(d.doc_id, "Verified")}><Check size={14} /> Verify</Button>
                      <Button size="sm" variant="danger" onClick={() => reviewDoc(d.doc_id, "Rejected")}><X size={14} /> Reject</Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* university decision */}
          <Card className={`p-6 ${canDecide ? "border-emerald-300" : "opacity-70"}`}>
            <h2 className="font-bold text-lg flex items-center gap-2"><Award size={20} className="text-emerald-600" /> Record university decision</h2>
            {!canDecide ? (
              <p className="text-sm text-slate-500 mt-2">Available after the application is marked “Sent to University”.</p>
            ) : (
              <form onSubmit={recordDecision} className="grid sm:grid-cols-2 gap-4 mt-4">
                <Field label="Decision">
                  <select className={inputCls} value={decision.decision} onChange={(e) => setDecision({ ...decision, decision: e.target.value })}>
                    <option>Unconditional Offer</option>
                    <option>Conditional Offer</option>
                    <option>Rejected</option>
                  </select>
                </Field>
                <Field label="Offer letter (PDF)">
                  <input type="file" accept=".pdf,.jpg,.png,.doc,.docx" className="text-sm mt-2" onChange={(e) => setDecision({ ...decision, file: e.target.files[0] })} />
                </Field>
                <Field label="Message from university / conditions" className="sm:col-span-2">
                  <textarea className={inputCls} rows={3} value={decision.response} onChange={(e) => setDecision({ ...decision, response: e.target.value })}
                    placeholder="e.g. Offer for Feb 2027 intake. Accept by 30 Nov and pay A$10,000 deposit." />
                </Field>
                <Button type="submit" variant="success" loading={busy} className="sm:col-span-2">Save decision & notify student</Button>
              </form>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          {/* status actions */}
          <Card className="p-6">
            <h2 className="font-bold text-lg mb-3">Move application</h2>
            <textarea className={inputCls} rows={3} value={remarks} onChange={(e) => setRemarks(e.target.value)}
              placeholder="Remarks for the student (required for 'Documents Requested')" />
            <div className="flex flex-col gap-2 mt-3">
              {data.next_statuses.length === 0 && <p className="text-sm text-slate-500">No further steps.</p>}
              {data.next_statuses.map((st) => (
                <Button key={st} variant={st === "Documents Requested" || st === "Rejected" ? "outline" : "primary"} loading={busy} onClick={() => setStatus(st)}>
                  {st === "Sent to University" && <Send size={16} />} Mark as “{st}”
                </Button>
              ))}
            </div>
          </Card>

          {/* student profile */}
          <Card className="p-6">
            <h2 className="font-bold text-lg mb-3 flex items-center gap-2"><User size={18} /> Student</h2>
            <dl className="text-sm space-y-2">
              {[
                ["Email", s.email], ["Phone", s.phone], ["Qualification", `${p.highest_qualification || "—"} · ${p.field_of_study || ""}`],
                ["Institution", p.institution_name], ["Score", p.percentage_gpa], ["English", `${p.english_test_type || ""} ${p.english_test_score || ""}`],
                ["Other test", p.other_test_type !== "None" ? `${p.other_test_type} ${p.other_test_score || ""}` : "—"],
                ["Budget", p.budget_range], ["Funding", p.funding_source], ["Work exp.", `${p.work_experience_years ?? 0} yrs`],
                ["Academic gap", p.academic_gap], ["Backlogs", p.backlogs === "Yes" ? p.backlogs_count : "No"],
                ["Visa refused before", p.visa_rejected_before],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <dt className="text-slate-500">{k}</dt>
                  <dd className="font-medium text-right">{v || "—"}</dd>
                </div>
              ))}
            </dl>
            {a.student_note && <p className="text-xs bg-amber-50 rounded-lg p-3 mt-4">Student note: {a.student_note}</p>}
          </Card>

          <Card className="p-6">
            <h2 className="font-bold text-lg mb-3">History</h2>
            <ol className="space-y-3 text-sm">
              {[...data.history].reverse().map((h) => (
                <li key={h.history_id} className="border-l-2 border-amber-300 pl-3">
                  <p className="font-medium">{h.status}</p>
                  {h.remarks && <p className="text-slate-600 text-xs">{h.remarks}</p>}
                  <p className="text-[11px] text-slate-400">{h.changed_by} · {fmtDate(h.changed_at, true)}</p>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
    </div>
  );
}
