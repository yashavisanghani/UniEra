// University page: details, courses, per-university eligibility checker,
// required documents checklist, scholarships. In the portal it has "Apply via UniEra".
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import {
  MapPin, Globe, CalendarDays, Building2, Award, Heart, CheckCircle2, XCircle, FileCheck2, Lock,
  ArrowRight, GraduationCap, Wallet, BookOpen, ClipboardList, Info,
} from "lucide-react";
import { api, currentUser, errMsg, money, fmtDate } from "../api";
import { Card, Button, Field, Spinner, Alert, Tabs, inputCls } from "../components/ui";
import StatusBadge from "../components/StatusBadge";

const TIER_STYLE = {
  "Group of Eight": "bg-amber-100 text-amber-800",
  "Mid-tier": "bg-violet-100 text-violet-800",
  Regional: "bg-emerald-100 text-emerald-800",
};

export default function UniversityDetail({ portal = false }) {
  const { id } = useParams();
  const location = useLocation();
  const user = currentUser();
  const base = portal ? "/portal" : "";
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState(location.hash === "#eligibility" ? "eligibility" : "overview");
  const [level, setLevel] = useState("Masters");
  const [shortlisted, setShortlisted] = useState(false);

  useEffect(() => {
    api
      .get(`/universities/${id}`, { params: { user_id: user?.id } })
      .then((r) => {
        setData(r.data);
        const lv = r.data.profile?.course_level || "";
        if (/under|bach/i.test(lv)) setLevel("Bachelors");
        else if (/phd|doct/i.test(lv)) setLevel("PhD");
      })
      .catch((e) => setError(errMsg(e, "University not found")));
    if (portal && user)
      api.get(`/shortlist/${user.id}`).then((r) => setShortlisted(r.data.ids.university.includes(Number(id))));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const toggleShortlist = async () => {
    const r = await api.post("/shortlist", { user_id: user.id, item_type: "university", item_id: Number(id) });
    setShortlisted(r.data.added);
  };

  if (error) return <div className="max-w-4xl mx-auto p-8"><Alert>{error}</Alert></div>;
  if (!data) return <Spinner />;

  const u = data.university;
  const levels = [...new Set(data.courses.map((c) => c.level))];

  return (
    <div className={portal ? "" : "bg-slate-50 min-h-screen pb-16"}>
      {/* ---------- header ---------- */}
      <div className={portal ? "rounded-2xl overflow-hidden mb-6" : ""}>
        <div className="bg-gradient-to-r from-[#1e1147] to-[#7c3aed] text-white px-6 sm:px-10 py-10">
          <div className={portal ? "" : "max-w-6xl mx-auto"}>
            <Link to={`${base}/universities`} className="text-purple-200 text-sm hover:text-white">
              ← All universities
            </Link>
            <div className="flex flex-wrap items-start justify-between gap-6 mt-3">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${TIER_STYLE[u.uni_tier] || "bg-white/20"}`}>
                    {u.uni_tier}
                  </span>
                  {u.uni_group && <span className="text-xs bg-white/15 px-2.5 py-1 rounded-full">{u.uni_group}</span>}
                  <span className="text-xs bg-white/15 px-2.5 py-1 rounded-full">{u.uni_type || "Public"}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold">{u.name}</h1>
                <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-sm text-purple-100">
                  <span className="flex items-center gap-1.5"><MapPin size={15} /> {u.city}, {u.state}</span>
                  {u.established && <span className="flex items-center gap-1.5"><Building2 size={15} /> Est. {u.established}</span>}
                  <span className="flex items-center gap-1.5"><CalendarDays size={15} /> Intakes: {u.intakes}</span>
                  {u.website && (
                    <a href={u.website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white underline">
                      <Globe size={15} /> Official website
                    </a>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {portal ? (
                  <>
                    <button
                      onClick={toggleShortlist}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border ${
                        shortlisted ? "bg-pink-500 border-pink-500 text-white" : "border-white/40 text-white hover:bg-white/10"
                      }`}
                    >
                      <Heart size={16} fill={shortlisted ? "currentColor" : "none"} /> {shortlisted ? "Shortlisted" : "Shortlist"}
                    </button>
                    <Link
                      to={`/portal/apply/${u.university_id}`}
                      className="flex items-center gap-2 bg-white text-[#1e1147] px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-violet-50"
                    >
                      Apply via UniEra <ArrowRight size={16} />
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/enroll"
                    className="flex items-center gap-2 bg-white text-[#1e1147] px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-violet-50"
                  >
                    <Lock size={15} /> Enroll to apply
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={portal ? "" : "max-w-6xl mx-auto px-4 sm:px-6 -mt-6"}>
        {/* quick facts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Fact icon={BookOpen} label="Courses on UniEra" value={data.courses.length} />
          <Fact icon={Wallet} label="Tuition from" value={`${money(Math.min(...data.courses.map((c) => c.annual_fee_aud)))}/yr`} />
          <Fact icon={Award} label="Scholarships" value={data.scholarships.filter((s) => s.university_id).length + " + govt"} />
          <Fact icon={GraduationCap} label="1st-year est. total" value={money(data.cost_snapshot.total)} />
        </div>

        {portal && data.my_applications.length > 0 && (
          <Alert type="info" className="mb-6">
            You have applied here:{" "}
            {data.my_applications.map((a) => (
              <Link key={a.application_id} to={`/portal/applications/${a.application_id}`} className="font-semibold underline mr-3">
                {a.app_ref} · {a.course_name} ({a.status})
              </Link>
            ))}
          </Alert>
        )}

        <Tabs
          value={tab}
          onChange={setTab}
          tabs={[
            { value: "overview", label: "Overview" },
            { value: "courses", label: `Courses & fees` },
            { value: "eligibility", label: "Eligibility checker" },
            { value: "documents", label: "Documents required" },
            { value: "scholarships", label: "Scholarships" },
          ]}
        />

        <div className="mt-6">
          {tab === "overview" && <Overview data={data} />}
          {tab === "courses" && <Courses data={data} portal={portal} levels={levels} />}
          {tab === "eligibility" && <Eligibility data={data} portal={portal} level={level} setLevel={setLevel} levels={levels} />}
          {tab === "documents" && <Documents uniId={id} data={data} level={level} setLevel={setLevel} levels={levels} portal={portal} />}
          {tab === "scholarships" && <Scholarships data={data} />}
        </div>

        {!portal && (
          <Card className="mt-8 p-6 flex flex-wrap items-center justify-between gap-4 bg-violet-50 border-violet-200">
            <div>
              <p className="font-bold text-[#1e1147]">Want to apply to {u.name}?</p>
              <p className="text-sm text-slate-600">
                Enroll with UniEra — we check your documents and submit the application to the university for you.
              </p>
            </div>
            <Link to="/enroll">
              <Button>Enroll Now <ArrowRight size={16} /></Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}

function Fact({ icon: Icon, label, value }) {
  return (
    <Card className="p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-violet-50 text-[#7c3aed] flex items-center justify-center shrink-0">
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="font-bold text-[#1e1147] truncate">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </Card>
  );
}

function Overview({ data }) {
  const u = data.university;
  const c = data.cost_snapshot;
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <Card className="p-6 lg:col-span-2">
        <h2 className="font-bold text-lg text-[#1e1147] mb-2">About</h2>
        <p className="text-slate-600 leading-relaxed">{u.about}</p>
        <h3 className="font-semibold text-[#1e1147] mt-6 mb-2">Known for</h3>
        <div className="flex flex-wrap gap-2">
          {(u.known_for || "").split(",").map((k) => (
            <span key={k} className="text-sm bg-violet-50 text-[#7c3aed] px-3 py-1 rounded-full">{k.trim()}</span>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mt-6 text-sm">
          <Row k="Main campus" v={u.main_campus || `${u.city}, ${u.state}`} />
          <Row k="Type" v={u.uni_type || "Public"} />
          <Row k="Established" v={u.established || "—"} />
          <Row k="Intakes" v={u.intakes} />
          <Row k="University group" v={u.uni_group || "—"} />
          <Row k="Regional study benefits" v={c.is_regional ? "Yes – extra post-study work rights" : "No (metro)"} />
        </div>
      </Card>
      <Card className="p-6">
        <h2 className="font-bold text-lg text-[#1e1147] mb-1">First-year cost snapshot</h2>
        <p className="text-xs text-slate-500 mb-4">Based on the lowest course fee here. Indicative, in AUD.</p>
        {[
          ["Tuition (1 year)", c.tuition],
          [`Living costs (${u.city})`, c.living],
          ["Health cover (OSHC)", c.oshc],
          ["Visa + airfare + setup", c.one_time],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between py-2 border-b border-slate-100 text-sm">
            <span className="text-slate-600">{k}</span>
            <span className="font-medium">{money(v)}</span>
          </div>
        ))}
        <div className="flex justify-between pt-3 font-bold text-[#1e1147]">
          <span>Total</span>
          <span>{money(c.total)}</span>
        </div>
        <p className="text-xs text-slate-500 mt-1">≈ ₹{Math.round((c.total * 55) / 100000).toLocaleString("en-IN")} lakh</p>
        <h3 className="font-semibold text-[#1e1147] mt-6 mb-2 text-sm">Entry requirements (by level)</h3>
        {data.criteria.map((r) => (
          <div key={r.level} className="text-xs text-slate-600 py-1">
            <span className="font-semibold">{r.level}:</span> {r.min_percentage}%+, IELTS {r.min_ielts}, funds {money(r.min_funds_aud)}
          </div>
        ))}
      </Card>
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div className="bg-slate-50 rounded-lg px-3 py-2">
      <p className="text-xs text-slate-500">{k}</p>
      <p className="font-medium text-slate-800">{v}</p>
    </div>
  );
}

function Courses({ data, portal, levels }) {
  const [lv, setLv] = useState("All");
  const list = data.courses.filter((c) => lv === "All" || c.level === lv);
  return (
    <Card className="overflow-hidden">
      <div className="p-4 flex flex-wrap gap-2 border-b border-slate-100">
        {["All", ...levels].map((l) => (
          <button
            key={l}
            onClick={() => setLv(l)}
            className={`text-sm px-3 py-1.5 rounded-full border ${lv === l ? "bg-[#7c3aed] text-white border-[#7c3aed]" : "border-slate-200 text-slate-600"}`}
          >
            {l}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Course</th>
              <th className="text-left px-4 py-3">Level</th>
              <th className="text-left px-4 py-3">Duration</th>
              <th className="text-right px-4 py-3">Annual fee</th>
              <th className="text-center px-4 py-3">Min % / IELTS</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.course_id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-800">{c.name}<span className="block text-xs text-slate-400">{c.field}</span></td>
                <td className="px-4 py-3">{c.level}</td>
                <td className="px-4 py-3">{c.duration_years} yrs</td>
                <td className="px-4 py-3 text-right font-semibold">{money(c.annual_fee_aud)}</td>
                <td className="px-4 py-3 text-center">{c.min_percentage}% / {c.min_ielts}</td>
                <td className="px-4 py-3 text-right">
                  {portal ? (
                    <Link to={`/portal/apply/${data.university.university_id}?course=${c.course_id}`} className="text-[#7c3aed] font-semibold hover:underline whitespace-nowrap">
                      Apply →
                    </Link>
                  ) : (
                    <Link to="/enroll" className="text-slate-400 text-xs whitespace-nowrap">Enroll to apply</Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function Eligibility({ data, portal, level, setLevel, levels }) {
  const p = data.profile || {};
  const [form, setForm] = useState({
    course_id: "",
    percentage: p.percentage ?? "",
    ielts: p.ielts ?? "",
    budget_aud: p.budget_aud ?? "",
  });
  const [res, setRes] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const courses = data.courses.filter((c) => c.level === level);

  const check = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const r = await api.post(`/universities/${data.university.university_id}/eligibility`, {
        ...form,
        level,
        user_id: currentUser()?.id,
      });
      setRes(r.data);
    } catch (err) {
      setError(errMsg(err));
    }
    setLoading(false);
  };

  return (
    <div className="grid lg:grid-cols-5 gap-6" id="eligibility">
      <Card className="p-6 lg:col-span-2">
        <h2 className="font-bold text-lg text-[#1e1147]">Check your eligibility</h2>
        <p className="text-sm text-slate-500 mb-4">For {data.university.name} specifically.</p>
        {data.profile && (
          <Alert type="info" className="mb-4">Pre-filled from your enrolment profile ({p.english_test_type} {p.english_test_score}).</Alert>
        )}
        <form onSubmit={check} className="space-y-4">
          <Field label="Study level">
            <select className={inputCls} value={level} onChange={(e) => { setLevel(e.target.value); setForm({ ...form, course_id: "" }); }}>
              {levels.map((l) => <option key={l}>{l}</option>)}
            </select>
          </Field>
          <Field label="Course (optional — some courses need more)">
            <select className={inputCls} value={form.course_id} onChange={set("course_id")}>
              <option value="">Any {level} course</option>
              {courses.map((c) => <option key={c.course_id} value={c.course_id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Academic score (%)" hint="CGPA? Multiply by 9.5 (e.g. 8.0 → 76%)">
            <input className={inputCls} type="number" step="0.1" value={form.percentage} onChange={set("percentage")} required />
          </Field>
          <Field label="IELTS overall (or equivalent)" hint="PTE 58 ≈ 6.5 · TOEFL 79 ≈ 6.5">
            <input className={inputCls} type="number" step="0.5" min="0" max="9" value={form.ielts} onChange={set("ielts")} required />
          </Field>
          <Field label="Funds available for 1st year (A$)" hint="Savings + loan + sponsor. 1 A$ ≈ ₹55">
            <input className={inputCls} type="number" value={form.budget_aud} onChange={set("budget_aud")} required />
          </Field>
          <Alert>{error}</Alert>
          <Button type="submit" className="w-full" loading={loading}>Check eligibility</Button>
        </form>
      </Card>

      <div className="lg:col-span-3">
        {!res ? (
          <Card className="p-10 text-center text-slate-500 h-full flex flex-col items-center justify-center">
            <ClipboardList size={40} className="text-violet-300 mb-3" />
            Enter your scores to see if you meet {data.university.name}&apos;s entry requirements.
          </Card>
        ) : (
          <Card className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs text-slate-500">{res.course || `${res.level} (general)`} · {res.uni_tier}</p>
                <p className={`text-2xl font-bold ${res.eligible ? "text-emerald-600" : res.verdict === "Partially eligible" ? "text-amber-600" : "text-red-600"}`}>
                  {res.verdict}
                </p>
              </div>
              <div className="relative w-20 h-20">
                <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#ede9fe" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke={res.eligible ? "#059669" : "#7c3aed"} strokeWidth="3" strokeDasharray={`${res.score} 100`} />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center font-bold text-[#1e1147]">{res.score}%</span>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {res.checks.map((c) => (
                <div key={c.label} className={`flex items-center justify-between rounded-xl px-4 py-3 border ${c.passed ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}>
                  <div className="flex items-center gap-3">
                    {c.passed ? <CheckCircle2 className="text-emerald-600" size={20} /> : <XCircle className="text-red-500" size={20} />}
                    <div>
                      <p className="font-medium text-slate-800 text-sm">{c.label}</p>
                      <p className="text-xs text-slate-500">
                        Required {c.unit === "A$" ? money(c.required) : `${c.required}${c.unit}`} · Yours{" "}
                        {c.unit === "A$" ? money(c.yours) : `${c.yours}${c.unit}`}
                      </p>
                    </div>
                  </div>
                  {!c.passed && <span className="text-xs font-semibold text-red-600">Short by {c.unit === "A$" ? money(c.gap) : c.gap}</span>}
                </div>
              ))}
            </div>
            {res.advice.length > 0 && (
              <div className="mt-5">
                <p className="font-semibold text-sm text-[#1e1147] mb-2">How to close the gap</p>
                <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">{res.advice.map((a) => <li key={a}>{a}</li>)}</ul>
              </div>
            )}
            {res.warnings.length > 0 && (
              <Alert type="warn" className="mt-4">{res.warnings.join(" ")}</Alert>
            )}
            {res.first_year_cost && (
              <p className="text-sm text-slate-600 mt-4">
                Estimated first-year cost for this course: <strong>{money(res.first_year_cost.total)}</strong>
              </p>
            )}
            {res.notes && <p className="text-xs text-slate-400 mt-3 flex gap-1"><Info size={14} /> {res.notes}</p>}
            <div className="mt-5">
              {portal ? (
                <Link to={`/portal/apply/${data.university.university_id}${form.course_id ? `?course=${form.course_id}` : ""}`}>
                  <Button>{res.eligible ? "Apply now" : "Apply anyway — talk to your counsellor"} <ArrowRight size={16} /></Button>
                </Link>
              ) : (
                <Link to="/enroll"><Button>Enroll with UniEra to apply <ArrowRight size={16} /></Button></Link>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

function Documents({ uniId, data, level, setLevel, levels, portal }) {
  const [courseId, setCourseId] = useState("");
  const [res, setRes] = useState(null);
  const courses = useMemo(() => data.courses.filter((c) => c.level === level), [data, level]);

  useEffect(() => {
    api
      .get(`/universities/${uniId}/requirements`, { params: { level, course_id: courseId || undefined, user_id: currentUser()?.id } })
      .then((r) => setRes(r.data));
  }, [uniId, level, courseId]);

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
        <div>
          <h2 className="font-bold text-lg text-[#1e1147]">Documents required to apply</h2>
          <p className="text-sm text-slate-500">
            Keep these ready — you upload them to UniEra and we submit the application to {data.university.name}.
          </p>
        </div>
        <div className="flex gap-2">
          <select className={inputCls} value={level} onChange={(e) => { setLevel(e.target.value); setCourseId(""); }}>
            {levels.map((l) => <option key={l}>{l}</option>)}
          </select>
          <select className={inputCls} value={courseId} onChange={(e) => setCourseId(e.target.value)}>
            <option value="">Any course</option>
            {courses.map((c) => <option key={c.course_id} value={c.course_id}>{c.name}</option>)}
          </select>
        </div>
      </div>
      {!res ? (
        <Spinner />
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-3">
            {res.documents.map((d) => (
              <div key={d.doc_type} className="flex gap-3 border border-slate-200 rounded-xl p-4">
                <FileCheck2 className={d.required ? "text-[#7c3aed]" : "text-slate-400"} size={22} />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-slate-800 text-sm">{d.label}</p>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${d.required ? "bg-violet-100 text-violet-700" : "bg-slate-100 text-slate-500"}`}>
                      {d.required ? "Required" : "Optional"}
                    </span>
                    {d.in_profile && <StatusBadge status="On file" />}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{d.help}</p>
                  <p className="text-[11px] text-violet-600 mt-1">Why: {d.reason}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-4">
            {res.documents.filter((d) => d.required).length} required documents for {res.course || `${res.level} programs`}. Accepted
            formats: PDF, JPG, PNG, DOC, DOCX.
          </p>
          {portal && (
            <Link to={`/portal/apply/${uniId}${courseId ? `?course=${courseId}` : ""}`} className="inline-block mt-4">
              <Button>Start application <ArrowRight size={16} /></Button>
            </Link>
          )}
        </>
      )}
    </Card>
  );
}

function Scholarships({ data }) {
  if (!data.scholarships.length) return <Card className="p-8 text-center text-slate-500">No scholarships listed yet.</Card>;
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {data.scholarships.map((s) => (
        <Card key={s.scholarship_id} className="p-5">
          <div className="flex justify-between gap-3">
            <p className="font-semibold text-[#1e1147]">{s.name}</p>
            <span className="text-emerald-700 font-bold whitespace-nowrap">{money(s.amount_aud)}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {s.university_id ? "University scholarship" : "Government of Australia"} · {s.level} · {s.field} · {s.coverage}
          </p>
          <p className="text-sm text-slate-600 mt-2">{s.description}</p>
          <p className="text-xs text-slate-500 mt-2">
            Min {s.min_percentage}% · IELTS {s.min_ielts} · Deadline {s.deadline ? fmtDate(s.deadline) : "Rolling"}
          </p>
        </Card>
      ))}
    </div>
  );
}
