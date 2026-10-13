// Apply to a university THROUGH the consultancy.
// Step 1: course + intake (with eligibility snapshot)
// Step 2: document upload screen — only the documents THIS university/course needs
// Step 3: review + declaration → submitted to UniEra (the counsellor then lodges it with the university)
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Check, UploadCloud, FileCheck2, FileText, ArrowLeft, ArrowRight, CheckCircle2, XCircle, Send, PartyPopper,
} from "lucide-react";
import { api, currentUser, errMsg, money } from "../../api";
import { Card, Button, Field, Spinner, Alert, inputCls } from "../../components/ui";
import StatusBadge from "../../components/StatusBadge";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MAX_MB = 5;
const OK_EXT = ["pdf", "jpg", "jpeg", "png", "doc", "docx"];

function intakeOptions(text) {
  const found = MONTHS.filter((m) => (text || "").toLowerCase().includes(m.toLowerCase()));
  const months = found.length ? found : ["February", "July"];
  const now = new Date();
  const out = [];
  for (const year of [now.getFullYear(), now.getFullYear() + 1, now.getFullYear() + 2]) {
    for (const m of months) {
      const d = new Date(year, MONTHS.indexOf(m), 1);
      // need ~4 months for offer, CoE and visa
      if (d - now > 1000 * 60 * 60 * 24 * 120) out.push(`${m} ${year}`);
    }
  }
  return out.slice(0, 5);
}

function Steps({ step }) {
  const items = ["Course & intake", "Upload documents", "Review & submit"];
  return (
    <div className="flex items-center gap-2 sm:gap-4 mb-8">
      {items.map((label, i) => (
        <div key={label} className="flex items-center gap-2 sm:gap-4 flex-1 last:flex-none">
          <div className="flex items-center gap-2">
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                i < step ? "bg-emerald-500 text-white" : i === step ? "bg-[#7c3aed] text-white ring-4 ring-violet-100" : "bg-slate-200 text-slate-500"
              }`}
            >
              {i < step ? <Check size={16} /> : i + 1}
            </span>
            <span className={`text-sm font-medium hidden sm:inline ${i === step ? "text-[#1e1147]" : "text-slate-400"}`}>{label}</span>
          </div>
          {i < items.length - 1 && <div className={`h-0.5 flex-1 ${i < step ? "bg-emerald-400" : "bg-slate-200"}`} />}
        </div>
      ))}
    </div>
  );
}

export default function Apply() {
  const { uniId } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const user = currentUser();

  const [uni, setUni] = useState(null);
  const [step, setStep] = useState(0);
  const [courseId, setCourseId] = useState(params.get("course") || "");
  const [intake, setIntake] = useState("");
  const [note, setNote] = useState("");
  const [elig, setElig] = useState(null);
  const [reqs, setReqs] = useState(null);
  const [files, setFiles] = useState({}); // doc_type -> File
  const [useProfile, setUseProfile] = useState({}); // doc_type -> bool
  const [declared, setDeclared] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(null);

  useEffect(() => {
    api.get(`/universities/${uniId}`, { params: { user_id: user.id } }).then((r) => {
      setUni(r.data);
      const lv = r.data.profile?.course_level || "";
      if (!params.get("course")) {
        const want = /under|bach/i.test(lv) ? "Bachelors" : /phd|doct/i.test(lv) ? "PhD" : "Masters";
        // prefer the course named in the enrolment profile, else the first course at that level
        const pref = (r.data.profile?.preferred_course || "").toLowerCase();
        const byName = pref && r.data.courses.find((c) => c.level === want && c.name.toLowerCase().includes(pref.replace(/^(master|bachelor)s? of /, "")));
        const first = byName || r.data.courses.find((c) => c.level === want);
        if (first) setCourseId(String(first.course_id));
      }
      setIntake(intakeOptions(r.data.university.intakes)[0] || "");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uniId]);

  const course = useMemo(() => uni?.courses.find((c) => String(c.course_id) === String(courseId)), [uni, courseId]);

  // eligibility snapshot from the enrolment profile whenever the course changes
  useEffect(() => {
    if (!uni || !course) return;
    const p = uni.profile || {};
    if (p.percentage == null || p.ielts == null) return;
    api
      .post(`/universities/${uniId}/eligibility`, {
        course_id: course.course_id, percentage: p.percentage, ielts: p.ielts, budget_aud: p.budget_aud || 0, user_id: user.id,
      })
      .then((r) => setElig(r.data))
      .catch(() => setElig(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course]);

  const loadRequirements = async () => {
    const r = await api.get(`/universities/${uniId}/requirements`, { params: { course_id: courseId, user_id: user.id } });
    setReqs(r.data.documents);
    const up = {};
    r.data.documents.forEach((d) => (up[d.doc_type] = d.in_profile));
    setUseProfile(up);
  };

  const pickFile = (dtype) => (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const ext = f.name.split(".").pop().toLowerCase();
    if (!OK_EXT.includes(ext)) return setError(`${f.name}: use PDF, JPG, PNG, DOC or DOCX`);
    if (f.size > MAX_MB * 1024 * 1024) return setError(`${f.name} is larger than ${MAX_MB} MB`);
    setError("");
    setFiles({ ...files, [dtype]: f });
    setUseProfile({ ...useProfile, [dtype]: false });
  };

  const ready = (d) => !!files[d.doc_type] || (d.in_profile && useProfile[d.doc_type]);
  const requiredDocs = reqs?.filter((d) => d.required) || [];
  const readyCount = requiredDocs.filter(ready).length;

  const next = async () => {
    setError("");
    if (step === 0) {
      if (!courseId || !intake) return setError("Choose a course and intake");
      await loadRequirements();
      setStep(1);
    } else if (step === 1) {
      const missing = requiredDocs.filter((d) => !ready(d)).map((d) => d.label);
      if (missing.length) return setError("Please upload: " + missing.join(", "));
      setStep(2);
    }
    window.scrollTo(0, 0);
  };

  const submit = async () => {
    if (!declared) return setError("Please accept the declaration");
    setError("");
    setSubmitting(true);
    const fd = new FormData();
    fd.append("user_id", user.id);
    fd.append("university_id", uniId);
    fd.append("course_id", courseId);
    fd.append("intake", intake);
    fd.append("student_note", note);
    fd.append("declaration", "true");
    Object.entries(files).forEach(([k, f]) => fd.append(`doc_${k}`, f));
    Object.entries(useProfile).forEach(([k, v]) => !v && fd.append(`use_profile_${k}`, "false"));
    try {
      const r = await api.post("/applications", fd);
      setDone(r.data);
      window.scrollTo(0, 0);
    } catch (e) {
      setError(errMsg(e));
    }
    setSubmitting(false);
  };

  if (!uni) return <Spinner />;
  const u = uni.university;

  if (done) {
    return (
      <Card className="max-w-2xl mx-auto p-10 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
          <PartyPopper size={32} />
        </div>
        <h1 className="text-2xl font-bold text-[#1e1147]">Application submitted to UniEra!</h1>
        <p className="text-slate-600 mt-2">
          Your application for <strong>{course?.name}</strong> at <strong>{u.name}</strong> ({intake}) has been sent to your
          counsellor.
        </p>
        <div className="bg-violet-50 rounded-xl p-4 my-6 inline-block">
          <p className="text-xs text-slate-500">Application reference</p>
          <p className="text-2xl font-bold tracking-wide text-[#7c3aed]">{done.app_ref}</p>
        </div>
        <ol className="text-left text-sm text-slate-600 space-y-2 max-w-md mx-auto mb-6">
          <li>1. A UniEra counsellor reviews and verifies your documents.</li>
          <li>2. We lodge the application with {u.name} on your behalf.</li>
          <li>3. You get notified here when the university replies with a decision / offer letter.</li>
        </ol>
        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={() => navigate(`/portal/applications/${done.application_id}`)}>Track this application</Button>
          <Button variant="outline" onClick={() => navigate("/portal/universities")}>Apply to another university</Button>
        </div>
      </Card>
    );
  }

  const levels = [...new Set(uni.courses.map((c) => c.level))];

  return (
    <div className="max-w-4xl mx-auto">
      <Link to={`/portal/universities/${uniId}`} className="text-sm text-slate-500 hover:text-[#7c3aed] flex items-center gap-1 mb-3">
        <ArrowLeft size={14} /> {u.name}
      </Link>
      <h1 className="text-2xl font-bold text-[#1e1147] mb-1">Apply to {u.name}</h1>
      <p className="text-sm text-slate-500 mb-6">
        UniEra submits this application for you — you don&apos;t need to use the university portal.
      </p>
      <Steps step={step} />

      {/* ---------------- step 1 ---------------- */}
      {step === 0 && (
        <div className="grid md:grid-cols-5 gap-6">
          <Card className="p-6 md:col-span-3 space-y-4">
            <Field label="Course">
              <select className={inputCls} value={courseId} onChange={(e) => setCourseId(e.target.value)}>
                <option value="">Choose a course</option>
                {levels.map((lv) => (
                  <optgroup key={lv} label={lv}>
                    {uni.courses.filter((c) => c.level === lv).map((c) => (
                      <option key={c.course_id} value={c.course_id}>
                        {c.name} — {money(c.annual_fee_aud)}/yr
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </Field>
            <Field label="Intake" hint={`${u.name} intakes: ${u.intakes}`}>
              <select className={inputCls} value={intake} onChange={(e) => setIntake(e.target.value)}>
                {intakeOptions(u.intakes).map((i) => <option key={i}>{i}</option>)}
              </select>
            </Field>
            <Field label="Note for your counsellor (optional)">
              <textarea className={inputCls} rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. I'd also like to be considered for the merit scholarship" />
            </Field>
            {course && (
              <div className="grid grid-cols-3 gap-3 text-center text-sm">
                <div className="bg-slate-50 rounded-lg p-3"><p className="text-xs text-slate-500">Duration</p><p className="font-semibold">{course.duration_years} yrs</p></div>
                <div className="bg-slate-50 rounded-lg p-3"><p className="text-xs text-slate-500">Annual fee</p><p className="font-semibold">{money(course.annual_fee_aud)}</p></div>
                <div className="bg-slate-50 rounded-lg p-3"><p className="text-xs text-slate-500">Min % / IELTS</p><p className="font-semibold">{course.min_percentage}% / {course.min_ielts}</p></div>
              </div>
            )}
          </Card>
          <Card className="p-6 md:col-span-2">
            <p className="font-semibold text-[#1e1147] mb-3">Your eligibility for this course</p>
            {!elig ? (
              <p className="text-sm text-slate-500">
                Add your academic score and English test to your profile to see an instant eligibility check.
              </p>
            ) : (
              <>
                <StatusBadge status={elig.verdict} className="text-sm" />
                <div className="mt-4 space-y-2">
                  {elig.checks.map((c) => (
                    <div key={c.label} className="flex items-center gap-2 text-sm">
                      {c.passed ? <CheckCircle2 size={16} className="text-emerald-600" /> : <XCircle size={16} className="text-red-500" />}
                      <span className="flex-1 text-slate-600">{c.label}</span>
                      <span className="text-xs text-slate-500">
                        {c.unit === "A$" ? money(c.yours) : c.yours} / {c.unit === "A$" ? money(c.required) : c.required}
                      </span>
                    </div>
                  ))}
                </div>
                {!elig.eligible && (
                  <p className="text-xs text-amber-700 bg-amber-50 rounded-lg p-2 mt-3">
                    You can still apply — your counsellor will advise on pathways or conditions.
                  </p>
                )}
              </>
            )}
          </Card>
        </div>
      )}

      {/* ---------------- step 2: document upload screen ---------------- */}
      {step === 1 && reqs && (
        <Card className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="font-bold text-lg text-[#1e1147]">Documents for {u.name}</h2>
              <p className="text-sm text-slate-500">{course?.name} · required list is specific to this university and course.</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-[#1e1147]">{readyCount} / {requiredDocs.length} required ready</p>
              <div className="w-48 h-2 bg-slate-100 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all" style={{ width: `${(readyCount / (requiredDocs.length || 1)) * 100}%` }} />
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {reqs.map((d) => {
              const ok = ready(d);
              return (
                <div key={d.doc_type} className={`border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 ${ok ? "border-emerald-200 bg-emerald-50/40" : "border-slate-200"}`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${ok ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
                    {ok ? <FileCheck2 size={20} /> : <FileText size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-sm text-slate-800">{d.label}</p>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${d.required ? "bg-violet-100 text-violet-700" : "bg-slate-100 text-slate-500"}`}>
                        {d.required ? "Required" : "Optional"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{d.help}</p>
                    {files[d.doc_type] && <p className="text-xs text-emerald-700 mt-1 truncate">✓ {files[d.doc_type].name}</p>}
                    {!files[d.doc_type] && d.in_profile && (
                      <label className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                        <input type="checkbox" checked={!!useProfile[d.doc_type]} onChange={(e) => setUseProfile({ ...useProfile, [d.doc_type]: e.target.checked })} />
                        Use the copy from my enrolment profile
                      </label>
                    )}
                  </div>
                  <label className="cursor-pointer inline-flex items-center gap-2 text-sm font-medium border border-slate-300 rounded-lg px-3 py-2 hover:border-[#7c3aed] hover:text-[#7c3aed] bg-white shrink-0">
                    <UploadCloud size={16} /> {files[d.doc_type] || (d.in_profile && useProfile[d.doc_type]) ? "Replace" : "Upload"}
                    <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={pickFile(d.doc_type)} />
                  </label>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-slate-400 mt-4">PDF, JPG, PNG, DOC or DOCX · max {MAX_MB} MB each.</p>
        </Card>
      )}

      {/* ---------------- step 3: review ---------------- */}
      {step === 2 && (
        <Card className="p-6 space-y-5">
          <h2 className="font-bold text-lg text-[#1e1147]">Review your application</h2>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            {[["University", u.name], ["Course", course?.name], ["Level", course?.level], ["Intake", intake], ["Annual tuition", money(course?.annual_fee_aud)], ["Eligibility", elig?.verdict || "—"]].map(([k, v]) => (
              <div key={k} className="bg-slate-50 rounded-lg px-3 py-2"><p className="text-xs text-slate-500">{k}</p><p className="font-medium">{v}</p></div>
            ))}
          </div>
          <div>
            <p className="font-semibold text-sm text-[#1e1147] mb-2">Documents being sent to UniEra</p>
            <ul className="text-sm divide-y divide-slate-100 border border-slate-100 rounded-lg">
              {reqs.filter(ready).map((d) => (
                <li key={d.doc_type} className="flex justify-between px-3 py-2">
                  <span>{d.label}</span>
                  <span className="text-xs text-slate-500">{files[d.doc_type] ? files[d.doc_type].name : "From profile"}</span>
                </li>
              ))}
            </ul>
          </div>
          {note && <p className="text-sm text-slate-600"><strong>Note:</strong> {note}</p>}
          <label className="flex items-start gap-2 text-sm text-slate-600">
            <input type="checkbox" className="mt-1" checked={declared} onChange={(e) => setDeclared(e.target.checked)} />
            I confirm the documents are genuine and authorise UniEra to submit this application to {u.name} on my behalf.
          </label>
        </Card>
      )}

      <Alert className="mt-5">{error}</Alert>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={() => (step === 0 ? navigate(-1) : setStep(step - 1))}>
          <ArrowLeft size={16} /> Back
        </Button>
        {step < 2 ? (
          <Button onClick={next}>Continue <ArrowRight size={16} /></Button>
        ) : (
          <Button onClick={submit} loading={submitting}><Send size={16} /> Submit application</Button>
        )}
      </div>
      {step === 1 && reqs?.some((d) => d.in_profile) && (
        <p className="text-xs text-slate-400 mt-3">
          Documents from your profile: {reqs.filter((d) => d.in_profile).map((d) => d.label).join(", ")}.{" "}
          <Link to="/portal/profile" className="underline">View profile</Link>
        </p>
      )}
    </div>
  );
}
