// Education loan portal: compare Indian lenders, EMI calculator, apply through UniEra, track requests.
import { useEffect, useState } from "react";
import { Landmark, Calculator, FileCheck2, Check, Send } from "lucide-react";
import { api, currentUser, errMsg, inr, fmtDate } from "../../api";
import { Card, Button, Field, inputCls, Spinner, Alert, Empty, PageTitle } from "../../components/ui";

const LOAN_STEPS = ["Submitted", "Documents Collected", "Shared with Lender", "Sanctioned", "Disbursed"];

const LOAN_COLORS = {
  Submitted: "bg-blue-50 text-blue-700 border-blue-200",
  "Documents Collected": "bg-amber-50 text-amber-700 border-amber-200",
  "Shared with Lender": "bg-violet-50 text-violet-700 border-violet-200",
  Sanctioned: "bg-green-50 text-green-700 border-green-300",
  Disbursed: "bg-emerald-600 text-white border-emerald-600",
  Rejected: "bg-red-50 text-red-700 border-red-200",
};

const DOCUMENTS = [
  "Admission / offer letter from the university",
  "Fee structure and estimated cost of study",
  "KYC of student and co-applicant (PAN, Aadhaar, passport)",
  "Academic records (10th, 12th, degree mark sheets)",
  "English test / entrance scorecard (IELTS, PTE, GRE...)",
  "Co-applicant income proof (salary slips / ITR, bank statements)",
  "Collateral papers (property documents, FD), if secured loan",
  "Passport-size photographs",
];

// Standard EMI formula: EMI = P·r·(1+r)^n / ((1+r)^n − 1), r = monthly rate, n = months
function calcEmi(principal, annualRate, years) {
  const P = Number(principal) || 0;
  const n = Math.round((Number(years) || 0) * 12);
  const r = (Number(annualRate) || 0) / 12 / 100;
  if (P <= 0 || n <= 0) return { emi: 0, total: 0, interest: 0 };
  const emi = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const total = emi * n;
  return { emi, total, interest: total - P };
}

function LoanPill({ status }) {
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${LOAN_COLORS[status] || "bg-slate-100 text-slate-600 border-slate-200"}`}>
      {status}
    </span>
  );
}

// Horizontal stepper: Submitted → ... → Disbursed
function LoanStepper({ status }) {
  const current = LOAN_STEPS.indexOf(status);
  if (status === "Rejected") return <p className="text-sm text-red-600 mt-3">This request was not approved by the lender.</p>;
  return (
    <div className="flex items-start mt-4 overflow-x-auto pb-1">
      {LOAN_STEPS.map((s, i) => {
        const reached = i <= current;
        return (
          <div key={s} className="flex-1 min-w-[80px] flex flex-col items-center relative">
            {i > 0 && (
              <div className={`absolute top-3 right-1/2 w-full h-0.5 ${reached ? "bg-[#7c3aed]" : "bg-slate-200"}`} />
            )}
            <div
              className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                reached ? "bg-[#7c3aed] text-white" : "bg-slate-200 text-slate-500"
              }`}
            >
              {reached ? <Check size={13} /> : i + 1}
            </div>
            <p className={`text-[11px] text-center mt-1 ${reached ? "text-slate-800 font-medium" : "text-slate-400"}`}>{s}</p>
          </div>
        );
      })}
    </div>
  );
}

const EMPTY_FORM = {
  lender: "", amount_inr: "", collateral: "No",
  co_applicant_name: "", co_applicant_relation: "", co_applicant_income: "", application_id: "",
};

export default function Loans() {
  const user = currentUser();
  const [lenders, setLenders] = useState([]);
  const [loans, setLoans] = useState([]);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // EMI calculator inputs
  const [calc, setCalc] = useState({ amount: 3000000, rate: 11, years: 10 });
  const { emi, total, interest } = calcEmi(calc.amount, calc.rate, calc.years);

  // Apply form
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formMsg, setFormMsg] = useState({ type: "", text: "" });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const loadLoans = () => api.get(`/loans/${user.id}`).then((r) => setLoans(r.data.loans || []));

  useEffect(() => {
    Promise.all([
      api.get("/loans/lenders").then((r) => setLenders(r.data.lenders || [])),
      loadLoans(),
      // optional — used to link a loan to an application
      api.get("/applications", { params: { user_id: user.id } }).then((r) => setApps(r.data.applications || [])).catch(() => {}),
    ])
      .catch((e) => setError(errMsg(e)))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pickLender = (l) => {
    setCalc({ ...calc, rate: l.rate });
    setForm({ ...form, lender: l.name });
    document.getElementById("apply-loan")?.scrollIntoView({ behavior: "smooth" });
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormMsg({ type: "", text: "" });
    try {
      const r = await api.post("/loans", { user_id: user.id, ...form, application_id: form.application_id || null });
      setFormMsg({ type: "success", text: `Loan request ${r.data.loan_ref} submitted. Your counsellor will contact you.` });
      setForm(EMPTY_FORM);
      loadLoans();
    } catch (err) {
      setFormMsg({ type: "error", text: errMsg(err) });
    }
    setSaving(false);
  };

  if (loading) return <Spinner label="Loading lenders..." />;

  return (
    <div className="space-y-8">
      <PageTitle
        title="Education Loan"
        subtitle="Compare Indian lenders, estimate your EMI and apply — UniEra shares your file with the lender."
      />
      <Alert>{error}</Alert>

      {/* Lenders */}
      <section>
        <Alert type="warn" className="mb-4">
          Interest rates, limits and fees below are <b>indicative only</b> — they change often. Please confirm the final terms with the lender.
        </Alert>
        {lenders.length === 0 ? (
          <Card><Empty icon={Landmark} title="No lenders available" /></Card>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {lenders.map((l) => (
              <Card key={l.name} className="p-5 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-[#1e1147]">{l.name}</p>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${l.type === "NBFC" ? "bg-amber-50 text-amber-700" : "bg-sky-50 text-sky-700"}`}>
                    {l.type}
                  </span>
                </div>
                <p className="text-3xl font-bold text-[#7c3aed] mt-3">
                  {l.rate}% <span className="text-xs font-normal text-slate-500">p.a. (from)</span>
                </p>
                <dl className="mt-3 text-sm space-y-1.5 flex-1">
                  <Row k="Max amount" v={inr(l.max_inr)} />
                  <Row k="Collateral" v={l.collateral} />
                  <Row k="Processing fee" v={l.processing} />
                  <Row k="Max tenure" v={`${l.tenure_years} years`} />
                </dl>
                <Button variant="light" size="sm" className="mt-4" onClick={() => pickLender(l)}>
                  Use this lender
                </Button>
              </Card>
            ))}
          </div>
        )}
      </section>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* EMI calculator */}
        <Card className="p-5">
          <h2 className="font-bold text-[#1e1147] flex items-center gap-2 mb-4">
            <Calculator size={18} /> EMI calculator
          </h2>
          <div className="grid sm:grid-cols-3 gap-3">
            <Field label="Loan amount (₹)">
              <input type="number" min="0" className={inputCls} value={calc.amount} onChange={(e) => setCalc({ ...calc, amount: e.target.value })} />
            </Field>
            <Field label="Interest rate (% p.a.)">
              <input type="number" step="0.05" min="0" className={inputCls} value={calc.rate} onChange={(e) => setCalc({ ...calc, rate: e.target.value })} />
            </Field>
            <Field label="Tenure (years)">
              <input type="number" min="1" max="20" className={inputCls} value={calc.years} onChange={(e) => setCalc({ ...calc, years: e.target.value })} />
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-5">
            <Result label="Monthly EMI" value={inr(emi)} highlight />
            <Result label="Total interest" value={inr(interest)} />
            <Result label="Total payable" value={inr(total)} />
          </div>
          <p className="text-xs text-slate-500 mt-4">
            Most education loans have a <b>moratorium</b> (course duration + 6–12 months) during which EMIs have not started;
            simple interest may accrue in that period and is usually added to the loan. This calculator shows the EMI after the moratorium.
          </p>
        </Card>

        {/* Document checklist */}
        <Card className="p-5">
          <h2 className="font-bold text-[#1e1147] flex items-center gap-2 mb-4">
            <FileCheck2 size={18} /> Documents typically needed
          </h2>
          <ul className="space-y-2.5">
            {DOCUMENTS.map((d) => (
              <li key={d} className="flex items-start gap-2 text-sm text-slate-700">
                <Check size={16} className="text-emerald-600 shrink-0 mt-0.5" /> {d}
              </li>
            ))}
          </ul>
          <p className="text-xs text-slate-500 mt-4">Exact list varies by lender — your counsellor will confirm.</p>
        </Card>
      </div>

      {/* Apply */}
      <Card className="p-5" id="apply-loan">
        <h2 className="font-bold text-[#1e1147] flex items-center gap-2 mb-4">
          <Send size={18} /> Apply for a loan
        </h2>
        <form onSubmit={submit} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Field label="Lender" className="sm:col-span-2">
            <select className={inputCls} value={form.lender} onChange={set("lender")} required>
              <option value="">Select lender</option>
              {lenders.map((l) => (
                <option key={l.name} value={l.name}>{l.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Amount needed (₹)">
            <input type="number" min="1" className={inputCls} value={form.amount_inr} onChange={set("amount_inr")} required />
          </Field>
          <Field label="Collateral available?">
            <select className={inputCls} value={form.collateral} onChange={set("collateral")}>
              <option>No</option>
              <option>Yes</option>
            </select>
          </Field>
          <Field label="Co-applicant name">
            <input className={inputCls} value={form.co_applicant_name} onChange={set("co_applicant_name")} required />
          </Field>
          <Field label="Relation">
            <select className={inputCls} value={form.co_applicant_relation} onChange={set("co_applicant_relation")} required>
              <option value="">Select</option>
              {["Father", "Mother", "Spouse", "Sibling", "Guardian", "Other"].map((r) => <option key={r}>{r}</option>)}
            </select>
          </Field>
          <Field label="Co-applicant annual income (₹)">
            <input type="number" min="0" className={inputCls} value={form.co_applicant_income} onChange={set("co_applicant_income")} required />
          </Field>
          <Field label="Link to application (optional)">
            <select className={inputCls} value={form.application_id} onChange={set("application_id")}>
              <option value="">Not linked</option>
              {apps.map((a) => (
                <option key={a.application_id} value={a.application_id}>
                  {a.app_ref} — {a.university}
                </option>
              ))}
            </select>
          </Field>
          <div className="sm:col-span-2 lg:col-span-4 space-y-3">
            <Alert type={formMsg.type || "info"}>{formMsg.text}</Alert>
            <Button type="submit" loading={saving}>Submit loan request</Button>
          </div>
        </form>
      </Card>

      {/* My loan requests */}
      <section>
        <h2 className="font-bold text-[#1e1147] mb-3">My loan requests</h2>
        {loans.length === 0 ? (
          <Card><Empty icon={Landmark} title="No loan requests yet" text="Submit the form above and track it here." /></Card>
        ) : (
          <div className="space-y-4">
            {loans.map((l) => (
              <Card key={l.loan_id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-800">{l.loan_ref} · {l.lender}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {inr(l.amount_inr)} · Collateral: {l.collateral} · Co-applicant: {l.co_applicant_name}
                      {l.co_applicant_relation ? ` (${l.co_applicant_relation})` : ""} · Applied {fmtDate(l.created_at)}
                    </p>
                  </div>
                  <LoanPill status={l.status} />
                </div>
                <LoanStepper status={l.status} />
                {l.remarks && (
                  <p className="text-sm bg-slate-50 rounded-lg px-3 py-2 mt-3 text-slate-700">
                    <b>Counsellor remarks:</b> {l.remarks}
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-slate-500">{k}</dt>
      <dd className="text-slate-800 text-right">{v}</dd>
    </div>
  );
}

function Result({ label, value, highlight }) {
  return (
    <div className={`rounded-xl p-3 text-center ${highlight ? "bg-gradient-to-br from-[#1e1147] to-[#7c3aed] text-white" : "bg-slate-50"}`}>
      <p className={`text-[11px] ${highlight ? "text-violet-200" : "text-slate-500"}`}>{label}</p>
      <p className="font-bold text-sm sm:text-lg mt-0.5">{value}</p>
    </div>
  );
}
