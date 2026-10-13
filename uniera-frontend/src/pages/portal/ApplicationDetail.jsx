// One application: progress timeline, documents (re-upload when asked), history,
// university decision + offer letter, accept/decline, withdraw.
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FileText, UploadCloud, Download, Award, AlertTriangle, Clock, MessageSquare } from "lucide-react";
import { api, currentUser, errMsg, fmtDate, fileUrl } from "../../api";
import { Card, Button, Spinner, Alert, Modal } from "../../components/ui";
import StatusBadge from "../../components/StatusBadge";
import Timeline from "../../components/Timeline";

export default function ApplicationDetail() {
  const { id } = useParams();
  const user = currentUser();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [version, setVersion] = useState(0);
  const [busy, setBusy] = useState("");
  const [confirm, setConfirm] = useState(null); // 'accept' | 'decline' | 'withdraw'

  useEffect(() => {
    api
      .get(`/applications/${id}`, { params: { user_id: user.id } })
      .then((r) => setData(r.data))
      .catch((e) => setError(errMsg(e, "Application not found")));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, version]);

  const upload = (dtype) => async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(dtype);
    setMsg("");
    setError("");
    const fd = new FormData();
    fd.append("user_id", user.id);
    fd.append("doc_type", dtype);
    fd.append("file", f);
    try {
      const r = await api.post(`/applications/${id}/documents`, fd);
      setMsg(r.data.message);
      setVersion((v) => v + 1);
    } catch (err) {
      setError(errMsg(err));
    }
    setBusy("");
  };

  const act = async () => {
    setError("");
    try {
      if (confirm === "withdraw") await api.post(`/applications/${id}/withdraw`, { user_id: user.id });
      else await api.post(`/applications/${id}/offer-response`, { user_id: user.id, action: confirm });
      setMsg(confirm === "accept" ? "Offer accepted! Your counsellor will guide you through the tuition deposit and CoE." : "Updated.");
      setVersion((v) => v + 1);
    } catch (err) {
      setError(errMsg(err));
    }
    setConfirm(null);
  };

  if (error && !data) return <Alert>{error}</Alert>;
  if (!data) return <Spinner />;
  const a = data.application;
  const u = data.university;
  const isOffer = ["Conditional Offer", "Unconditional Offer"].includes(a.status);
  const closed = ["Withdrawn", "Rejected", "Visa Granted"].includes(a.status);
  const canUpload = !closed;

  return (
    <div className="space-y-6">
      <Link to="/portal/applications" className="text-sm text-slate-500 hover:text-[#7c3aed] flex items-center gap-1">
        <ArrowLeft size={14} /> My applications
      </Link>

      {/* header */}
      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#7c3aed] tracking-wide">{a.app_ref}</p>
            <h1 className="text-2xl font-bold text-[#1e1147]">{a.course_name}</h1>
            <p className="text-slate-600">
              <Link to={`/portal/universities/${u.university_id}`} className="hover:underline">{u.name}</Link> · {u.city}, {u.state} · {a.intake}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Submitted {fmtDate(a.created_at)} · Last update {fmtDate(a.updated_at, true)} · Eligibility at submission: {a.eligibility_result}
            </p>
          </div>
          <StatusBadge status={a.status} className="text-sm px-3 py-1.5" />
        </div>
        <div
          className={`mt-5 rounded-xl px-4 py-3 text-sm flex gap-2 ${
            a.status === "Documents Requested"
              ? "bg-orange-50 text-orange-800 border border-orange-200"
              : isOffer || a.status === "Visa Granted"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : a.status === "Rejected"
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-violet-50 text-violet-800 border border-violet-100"
          }`}
        >
          {a.status === "Documents Requested" ? <AlertTriangle size={18} className="shrink-0" /> : <Clock size={18} className="shrink-0" />}
          {data.status_message}
        </div>
        <div className="mt-6">
          <Timeline steps={data.timeline} />
        </div>
      </Card>

      <Alert type="success">{msg}</Alert>
      {data && <Alert>{error}</Alert>}

      {/* university decision */}
      {(a.university_response || a.offer_letter_file) && (
        <Card className="p-6 border-emerald-200">
          <div className="flex items-center gap-2 mb-2">
            <Award className="text-emerald-600" />
            <h2 className="font-bold text-lg text-[#1e1147]">University decision</h2>
          </div>
          {a.university_response && <p className="text-slate-700 whitespace-pre-line">{a.university_response}</p>}
          <div className="flex flex-wrap gap-3 mt-4">
            {a.offer_letter_file && (
              <a href={fileUrl(a.offer_letter_file)} target="_blank" rel="noreferrer">
                <Button variant="success"><Download size={16} /> Download offer letter</Button>
              </a>
            )}
            {isOffer && (
              <>
                <Button onClick={() => setConfirm("accept")}>Accept offer</Button>
                <Button variant="outline" onClick={() => setConfirm("decline")}>Decline</Button>
              </>
            )}
          </div>
        </Card>
      )}

      <div className="grid lg:grid-cols-5 gap-6">
        {/* documents */}
        <Card className="p-6 lg:col-span-3">
          <h2 className="font-bold text-lg text-[#1e1147] mb-1">Documents</h2>
          <p className="text-sm text-slate-500 mb-4">Your counsellor verifies each document before lodging the application.</p>
          <div className="space-y-2">
            {data.checklist.map((d) => (
              <div
                key={d.doc_type}
                className={`flex flex-wrap items-center gap-3 border rounded-xl px-4 py-3 ${
                  d.status === "Rejected" ? "border-red-200 bg-red-50/50" : "border-slate-200"
                }`}
              >
                <FileText size={18} className="text-slate-400" />
                <div className="flex-1 min-w-[160px]">
                  <p className="text-sm font-medium text-slate-800">
                    {d.label} {d.required && <span className="text-red-500">*</span>}
                  </p>
                  {d.remarks && <p className="text-xs text-red-600">Counsellor: {d.remarks}</p>}
                  {d.file_name && (
                    <a href={fileUrl(d.file_name)} target="_blank" rel="noreferrer" className="text-xs text-[#7c3aed] hover:underline">
                      View file
                    </a>
                  )}
                </div>
                <StatusBadge status={d.status} />
                {canUpload && d.status !== "Verified" && (
                  <label className="cursor-pointer text-xs font-medium border border-slate-300 rounded-lg px-2.5 py-1.5 hover:border-[#7c3aed] hover:text-[#7c3aed] flex items-center gap-1">
                    <UploadCloud size={14} /> {busy === d.doc_type ? "Uploading..." : d.uploaded ? "Re-upload" : "Upload"}
                    <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={upload(d.doc_type)} />
                  </label>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* history */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="font-bold text-lg text-[#1e1147] mb-4">Activity</h2>
          <ol className="relative border-l-2 border-violet-100 ml-2 space-y-5">
            {[...data.history].reverse().map((h) => (
              <li key={h.history_id} className="ml-4">
                <span className="absolute -left-[7px] w-3 h-3 rounded-full bg-[#7c3aed] mt-1.5" />
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={h.status} />
                  <span className="text-[11px] text-slate-400">{fmtDate(h.changed_at, true)}</span>
                </div>
                {h.remarks && (
                  <p className="text-sm text-slate-600 mt-1 flex gap-1.5">
                    <MessageSquare size={14} className="mt-0.5 shrink-0 text-slate-400" /> {h.remarks}
                  </p>
                )}
                <p className="text-[11px] text-slate-400">by {h.changed_by}</p>
              </li>
            ))}
          </ol>
          {a.student_note && <p className="text-xs text-slate-500 mt-5 bg-slate-50 rounded-lg p-3">Your note: {a.student_note}</p>}
          {!closed && !["Offer Accepted", "CoE Issued", "Visa Lodged"].includes(a.status) && (
            <button onClick={() => setConfirm("withdraw")} className="text-xs text-red-500 hover:underline mt-5">
              Withdraw this application
            </button>
          )}
        </Card>
      </div>

      <Modal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title={confirm === "accept" ? "Accept this offer?" : confirm === "decline" ? "Decline this offer?" : "Withdraw application?"}
      >
        <p className="text-sm text-slate-600 mb-5">
          {confirm === "accept"
            ? `You're accepting the offer from ${u.name}. Next steps: pay the tuition deposit, receive your CoE and lodge your student visa.`
            : confirm === "decline"
            ? "The university will be informed that you are not taking up this offer. This cannot be undone."
            : "Your counsellor will stop processing this application. This cannot be undone."}
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setConfirm(null)}>Cancel</Button>
          <Button variant={confirm === "accept" ? "success" : "danger"} onClick={act}>Confirm</Button>
        </div>
      </Modal>
    </div>
  );
}
