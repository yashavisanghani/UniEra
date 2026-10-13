// Offer letters from universities + accept / decline.
// GET /applications?user_id (filter offer statuses), POST /applications/:id/offer-response
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Award, FileText, ExternalLink, CheckCircle2, XCircle, Landmark, House, ArrowRight, Calendar, GraduationCap,
} from "lucide-react";
import { api, currentUser, errMsg, fileUrl } from "../../api";
import { Card, Button, Spinner, Alert, Empty, PageTitle, Modal } from "../../components/ui";
import StatusBadge from "../../components/StatusBadge";

const OFFER_STATUSES = ["Conditional Offer", "Unconditional Offer", "Offer Accepted", "CoE Issued", "Visa Lodged", "Visa Granted"];
const AWAITING_RESPONSE = ["Conditional Offer", "Unconditional Offer"];

// What the student should do next, depending on where the offer is
function nextStep(status) {
  switch (status) {
    case "Conditional Offer":
      return "Meet the conditions listed in the offer (e.g. final transcripts or English score), then accept the offer.";
    case "Unconditional Offer":
      return "Accept the offer, then pay the tuition deposit so the university can issue your CoE.";
    case "Offer Accepted":
      return "Pay the tuition deposit and OSHC. The university will then issue your Confirmation of Enrolment (CoE).";
    case "CoE Issued":
      return "Your CoE is ready — your counsellor will lodge your student visa (subclass 500).";
    case "Visa Lodged":
      return "Your visa is with the Department of Home Affairs. Start arranging accommodation and flights.";
    case "Visa Granted":
      return "Congratulations! Book your accommodation and prepare for departure.";
    default:
      return "";
  }
}

// Load the student's applications that have reached the offer stage.
async function fetchOffers(userId) {
  const r = await api.get("/applications", { params: { user_id: userId } });
  const list = (r.data.applications || []).filter((a) => OFFER_STATUSES.includes(a.status));
  // The list normally includes the offer letter + university response.
  // If not, fetch each application's details to get them.
  return Promise.all(
    list.map(async (a) => {
      if ("offer_letter_file" in a && "university_response" in a) return a;
      const d = await api.get(`/applications/${a.application_id}`, { params: { user_id: userId } });
      return { ...a, ...d.data.application };
    })
  );
}

export default function Offers() {
  const user = currentUser();
  const [offers, setOffers] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [confirm, setConfirm] = useState(null); // { app, action: 'accept' | 'decline' }
  const [saving, setSaving] = useState(false);

  const [version, setVersion] = useState(0); // bump to reload the list

  useEffect(() => {
    fetchOffers(user.id)
      .then(setOffers)
      .catch((e) => setError(errMsg(e, "Could not load your offers")));
  }, [user.id, version]);

  const respond = async () => {
    setSaving(true);
    setError("");
    try {
      const r = await api.post(`/applications/${confirm.app.application_id}/offer-response`, {
        user_id: user.id,
        action: confirm.action,
      });
      setNotice(r.data.message);
      setConfirm(null);
      setVersion((v) => v + 1);
    } catch (e) {
      setError(errMsg(e, "Could not record your response"));
      setConfirm(null);
    }
    setSaving(false);
  };

  return (
    <div>
      <PageTitle title="Offer letters" subtitle="Decisions from universities, your offer letters and what to do next." />

      <Alert className="mb-4">{error}</Alert>
      <Alert type="success" className="mb-4">{notice}</Alert>

      {!offers && !error && <Spinner label="Loading offers..." />}

      {offers && offers.length === 0 && (
        <Card>
          <Empty
            icon={Award}
            title="No offers yet — your applications are with the universities"
            text="As soon as a university sends a decision, your offer letter will appear here."
            action={
              <Link to="/portal/applications">
                <Button variant="outline">View my applications</Button>
              </Link>
            }
          />
        </Card>
      )}

      {offers && offers.length > 0 && (
        <div className="space-y-5">
          {offers.map((a) => (
            <Card key={a.application_id} className="overflow-hidden">
              <div className="flex flex-wrap items-start justify-between gap-3 p-5 border-b border-slate-100">
                <div className="flex gap-3">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Award size={22} />
                  </div>
                  <div>
                    <p className="font-bold text-[#1e1147]">{a.university}</p>
                    <p className="text-sm text-slate-600">{a.course_name}</p>
                    <div className="flex flex-wrap gap-x-4 text-xs text-slate-500 mt-1">
                      <span className="inline-flex items-center gap-1"><GraduationCap size={13} /> {a.level}</span>
                      <span className="inline-flex items-center gap-1"><Calendar size={13} /> Intake {a.intake}</span>
                      <span className="font-mono">{a.app_ref}</span>
                    </div>
                  </div>
                </div>
                <StatusBadge status={a.status} />
              </div>

              <div className="p-5 grid md:grid-cols-2 gap-5">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">University response</p>
                  <p className="text-sm text-slate-700 whitespace-pre-line">
                    {a.university_response || "The university has not added any comments."}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {a.offer_letter_file ? (
                      <a href={fileUrl(a.offer_letter_file)} target="_blank" rel="noreferrer">
                        <Button variant="light" size="sm">
                          <FileText size={14} /> View offer letter <ExternalLink size={12} />
                        </Button>
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400">Offer letter file not uploaded yet</span>
                    )}
                    <Link to={`/portal/applications/${a.application_id}`}>
                      <Button variant="ghost" size="sm">Application details</Button>
                    </Link>
                  </div>
                </div>

                <div className="bg-violet-50/60 border border-violet-100 rounded-xl p-4">
                  <p className="text-xs font-semibold text-[#7c3aed] uppercase tracking-wide mb-1">Next step</p>
                  <p className="text-sm text-slate-700">{nextStep(a.status)}</p>
                  <p className="text-[11px] text-slate-500 mt-2">
                    Tuition deposit → CoE → Student visa → Travel
                  </p>
                  <div className="flex flex-wrap gap-3 mt-3 text-sm">
                    <Link to="/portal/loans" className="inline-flex items-center gap-1 text-[#7c3aed] hover:underline">
                      <Landmark size={14} /> Education loan
                    </Link>
                    <Link to="/portal/accommodation" className="inline-flex items-center gap-1 text-[#7c3aed] hover:underline">
                      <House size={14} /> Accommodation
                    </Link>
                  </div>
                </div>
              </div>

              {AWAITING_RESPONSE.includes(a.status) && (
                <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 bg-slate-50 border-t border-slate-100">
                  <p className="text-sm text-slate-600">Please respond to this offer.</p>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setConfirm({ app: a, action: "decline" })}>
                      <XCircle size={16} /> Decline
                    </Button>
                    <Button variant="success" onClick={() => setConfirm({ app: a, action: "accept" })}>
                      <CheckCircle2 size={16} /> Accept offer
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* confirmation popup */}
      <Modal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title={confirm?.action === "accept" ? "Accept this offer?" : "Decline this offer?"}
      >
        {confirm && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              {confirm.action === "accept" ? (
                <>
                  You are accepting the offer from <b>{confirm.app.university}</b> for <b>{confirm.app.course_name}</b> (
                  {confirm.app.intake}). Your counsellor will guide you through the tuition deposit and CoE.
                </>
              ) : (
                <>
                  Declining will close your application to <b>{confirm.app.university}</b>. This cannot be undone.
                </>
              )}
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setConfirm(null)}>Cancel</Button>
              <Button variant={confirm.action === "accept" ? "success" : "danger"} loading={saving} onClick={respond}>
                {confirm.action === "accept" ? "Yes, accept" : "Yes, decline"} <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
