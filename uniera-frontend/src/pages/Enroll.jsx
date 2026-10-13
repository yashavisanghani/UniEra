// Enrolment wizard (/enroll) — the student must be logged in (RequireAuth in App.jsx).
//   Step 1  Profile   -> POST /enroll (multipart: all profile fields + 5 documents)
//   Step 2  Package   -> GET /packages
//   Step 3  Payment   -> POST /payments/enrollment (demo gateway)
//   Step 4  Success   -> receipt + link to the Student Portal
// If the student is already enrolled we just show a "You're enrolled" card.
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  GraduationCap,
  FileText,
  Target,
  Wallet,
  Plane,
  Upload,
  ChevronDown,
  Check,
  CircleCheck,
  PartyPopper,
  ArrowLeft,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";
import { api, currentUser, setEnrolled, errMsg, inr, fmtDate } from "../api";
import { Card, Button, Field, Alert, Spinner, inputCls } from "../components/ui";
import PaymentForm from "../components/PaymentForm";

// ---------------------------------------------------------------- form definition
// Every field of the old EnrollNow form, grouped into sections.
// `required` fields are checked before submitting; `showIf` hides a field until it is relevant.
const SECTIONS = [
  {
    title: "Personal details",
    icon: User,
    fields: [
      { name: "full_name", label: "Full name", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "phone_number", label: "Phone number", required: true },
      { name: "alternate_phone", label: "Alternate phone" },
      { name: "date_of_birth", label: "Date of birth", type: "date", required: true },
      { name: "gender", label: "Gender", options: [["Male", "Male"], ["Female", "Female"], ["Other", "Other"], ["Prefer_not_to_say", "Prefer not to say"]] },
      { name: "nationality", label: "Nationality", placeholder: "e.g. Indian", required: true },
      { name: "passport_number", label: "Passport number" },
      { name: "current_address", label: "Current address", full: true },
      { name: "current_city", label: "Current city" },
      { name: "current_country", label: "Current country" },
    ],
  },
  {
    title: "Emergency contact",
    icon: Phone,
    fields: [
      { name: "emergency_contact_name", label: "Contact name" },
      { name: "emergency_contact_relation", label: "Relation" },
      { name: "emergency_contact_phone", label: "Contact phone" },
    ],
  },
  {
    title: "Academic background",
    icon: GraduationCap,
    fields: [
      { name: "highest_qualification", label: "Highest qualification", required: true, options: ["12th", "Diploma", "Bachelors", "Masters", "PhD"] },
      { name: "field_of_study", label: "Field of study" },
      { name: "institution_name", label: "Institution name" },
      { name: "graduation_year", label: "Graduation year", type: "number" },
      { name: "percentage_gpa", label: "Percentage / GPA" },
      { name: "academic_gap", label: "Any academic gap?", options: ["No", "Yes"], noBlank: true },
      { name: "academic_gap_reason", label: "Reason for gap", showIf: (f) => f.academic_gap === "Yes" },
      { name: "backlogs", label: "Any backlogs?", options: ["No", "Yes"], noBlank: true },
      { name: "backlogs_count", label: "Number of backlogs", type: "number", showIf: (f) => f.backlogs === "Yes" },
    ],
  },
  {
    title: "Test scores",
    icon: FileText,
    fields: [
      { name: "english_test_type", label: "English test", noBlank: true, options: [["Not_Taken", "Not taken yet"], ["IELTS", "IELTS"], ["TOEFL", "TOEFL"], ["PTE", "PTE"], ["Duolingo", "Duolingo"]] },
      { name: "english_test_score", label: "English test score", showIf: (f) => f.english_test_type !== "Not_Taken" },
      { name: "other_test_type", label: "Other test", noBlank: true, options: [["None", "None"], ["GRE", "GRE"], ["GMAT", "GMAT"], ["SAT", "SAT"]] },
      { name: "other_test_score", label: "Other test score", showIf: (f) => f.other_test_type !== "None" },
    ],
  },
  {
    title: "Study preferences",
    icon: Target,
    fields: [
      { name: "preferred_country", label: "Preferred country", required: true },
      { name: "preferred_university", label: "Preferred university" },
      { name: "preferred_course", label: "Preferred course", placeholder: "e.g. Master of Data Science", required: true },
      { name: "course_level", label: "Course level", required: true, options: ["Undergraduate", "Postgraduate", "Diploma", "PhD"] },
      { name: "intake_month_year", label: "Preferred intake", required: true, options: ["Feb 2027", "Jul 2027", "Nov 2027", "Feb 2028"] },
    ],
  },
  {
    title: "Budget, work & visa history",
    icon: Wallet,
    fields: [
      { name: "budget_range", label: "Budget range", placeholder: "e.g. ₹30–40 lakh total" },
      { name: "funding_source", label: "Funding source", options: [["Self_Funded", "Self funded"], ["Education_Loan", "Education loan"], ["Scholarship", "Scholarship"], ["Family_Sponsored", "Family sponsored"]] },
      { name: "work_experience_years", label: "Years of work experience", type: "number" },
      { name: "visa_applied_before", label: "Applied for a visa before?", options: ["No", "Yes"], noBlank: true },
      { name: "visa_rejected_before", label: "Visa ever rejected?", options: ["No", "Yes"], noBlank: true },
      { name: "visa_rejection_details", label: "Rejection details", full: true, showIf: (f) => f.visa_rejected_before === "Yes" },
    ],
  },
];

const FILES = [
  { name: "transcript_file", label: "Academic transcript" },
  { name: "passport_file", label: "Passport copy" },
  { name: "resume_file", label: "Resume / CV" },
  { name: "sop_file", label: "Statement of Purpose (SOP)" },
  { name: "recommendation_letter_file", label: "Recommendation letter" },
];

const EMPTY_FORM = {
  full_name: "", email: "", phone_number: "", alternate_phone: "", date_of_birth: "", gender: "",
  nationality: "", passport_number: "", current_address: "", current_city: "", current_country: "",
  emergency_contact_name: "", emergency_contact_relation: "", emergency_contact_phone: "",
  highest_qualification: "", field_of_study: "", institution_name: "", graduation_year: "", percentage_gpa: "",
  academic_gap: "No", academic_gap_reason: "", backlogs: "No", backlogs_count: 0,
  english_test_type: "Not_Taken", english_test_score: "", other_test_type: "None", other_test_score: "",
  preferred_country: "Australia", preferred_university: "", preferred_course: "", course_level: "", intake_month_year: "",
  budget_range: "", funding_source: "", work_experience_years: 0,
  visa_applied_before: "No", visa_rejected_before: "No", visa_rejection_details: "",
  declaration_agreed: false,
};

const STEPS = ["Profile", "Package", "Payment", "Done"];

// ---------------------------------------------------------------- main page
export default function Enroll() {
  const user = currentUser();
  const [status, setStatus] = useState(null); // response of /enrollment/status
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [pkg, setPkg] = useState(null); // chosen package object
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    api
      .get(`/enrollment/status/${user.id}`)
      .then((r) => {
        setStatus(r.data);
        if (r.data.is_enrolled) setEnrolled(true);
      })
      .catch((e) => setError(errMsg(e)))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onProfileSaved = () => {
    localStorage.setItem("has_profile", "true");
    setStatus((s) => ({ ...s, has_profile: true }));
    setStep(2);
    window.scrollTo(0, 0);
  };

  const onPackageChosen = (p) => {
    setPkg(p);
    setStep(3);
    window.scrollTo(0, 0);
  };

  const pay = async (details) => {
    try {
      const r = await api.post("/payments/enrollment", { user_id: user.id, package: pkg.id, ...details });
      setReceipt({ ...r.data, date: new Date().toISOString() });
      setEnrolled(true);
      localStorage.setItem("has_profile", "true");
      setStep(4);
      window.scrollTo(0, 0);
    } catch (e) {
      throw new Error(errMsg(e), { cause: e }); // PaymentForm shows this message
    }
  };

  let content;
  if (loading) content = <Spinner label="Checking your enrolment..." />;
  else if (error) content = <Alert>{error}</Alert>;
  else if (status?.is_enrolled && step !== 4) content = <AlreadyEnrolled status={status} />;
  else
    content = (
      <>
        <Progress step={step} />
        {step === 1 && <ProfileStep user={user} hasProfile={status?.has_profile} onSaved={onProfileSaved} onSkip={() => setStep(2)} />}
        {step === 2 && <PackageStep selected={pkg} onChoose={onPackageChosen} onBack={() => setStep(1)} />}
        {step === 3 && pkg && <PaymentStep pkg={pkg} onPay={pay} onBack={() => setStep(2)} />}
        {step === 4 && receipt && <SuccessStep receipt={receipt} />}
      </>
    );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-[#1e1147] to-[#7c3aed] text-white pt-10 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Enrol with UniEra</h1>
          <p className="text-purple-200">
            Complete your profile, choose a package and pay the consultancy fee to unlock your Student Portal.
          </p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-12 pb-16">{content}</div>
    </div>
  );
}

// ---------------------------------------------------------------- progress bar
function Progress({ step }) {
  return (
    <Card className="p-5 mb-6">
      <ol className="flex items-center">
        {STEPS.map((label, i) => {
          const n = i + 1;
          const done = n < step;
          const current = n === step;
          return (
            <li key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <span
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                    done
                      ? "bg-[#7c3aed] border-[#7c3aed] text-white"
                      : current
                      ? "border-[#7c3aed] text-[#7c3aed] ring-4 ring-violet-100"
                      : "border-slate-300 text-slate-400"
                  }`}
                >
                  {done ? <Check size={16} /> : n}
                </span>
                <span className={`text-xs sm:text-sm font-medium ${current ? "text-[#1e1147]" : "text-slate-500"}`}>{label}</span>
              </div>
              {n < STEPS.length && <span className={`flex-1 h-0.5 mx-2 sm:mx-4 ${done ? "bg-[#7c3aed]" : "bg-slate-200"}`} />}
            </li>
          );
        })}
      </ol>
    </Card>
  );
}

// ---------------------------------------------------------------- already enrolled
function AlreadyEnrolled({ status }) {
  const navigate = useNavigate();
  const p = status.payment;
  return (
    <Card className="p-8 sm:p-10 text-center">
      <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
        <CircleCheck size={34} />
      </div>
      <h2 className="text-2xl font-bold text-[#1e1147] mb-2">You're enrolled with UniEra</h2>
      <p className="text-slate-600 mb-6">
        {status.package ? <>Your <strong>{status.package}</strong> package is active.</> : "Your enrolment is active."}
        {p?.created_at && <> Paid on {fmtDate(p.created_at)}.</>}
      </p>
      <Button size="lg" onClick={() => navigate("/portal")}>
        <LayoutDashboard size={18} /> Go to Student Portal
      </Button>
    </Card>
  );
}

// ---------------------------------------------------------------- step 1: profile
function ProfileStep({ user, hasProfile, onSaved, onSkip }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, full_name: user.name, email: user.email });
  const [files, setFiles] = useState({});
  const [existingFiles, setExistingFiles] = useState({}); // files already saved in a previous profile
  const [open, setOpen] = useState(0); // which section is expanded
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(!hasProfile); // show the form straight away if no profile yet

  // If a profile already exists, load it so the student can edit instead of retyping
  useEffect(() => {
    if (!hasProfile) return;
    api
      .get(`/profile/${user.id}`)
      .then((r) => {
        const saved = r.data.enroll || {};
        const merged = { ...EMPTY_FORM };
        Object.keys(EMPTY_FORM).forEach((k) => {
          if (saved[k] !== null && saved[k] !== undefined && k !== "declaration_agreed") merged[k] = saved[k];
        });
        if (merged.date_of_birth) merged.date_of_birth = String(merged.date_of_birth).slice(0, 10);
        setForm(merged);
        const ex = {};
        FILES.forEach((f) => saved[f.name] && (ex[f.name] = saved[f.name]));
        setExistingFiles(ex);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasProfile]);

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  // returns the index of the first section with a missing required field, or -1
  const firstMissing = () =>
    SECTIONS.findIndex((s) => s.fields.some((f) => f.required && (!f.showIf || f.showIf(form)) && !String(form[f.name] ?? "").trim()));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const missing = firstMissing();
    if (missing !== -1) {
      const names = SECTIONS[missing].fields.filter((f) => f.required && !String(form[f.name] ?? "").trim()).map((f) => f.label);
      setOpen(missing);
      setError(`Please fill in: ${names.join(", ")} (${SECTIONS[missing].title}).`);
      return;
    }
    if (!form.declaration_agreed) {
      setError("Please agree to the declaration before continuing.");
      return;
    }

    const data = new FormData();
    data.append("user_id", user.id);
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    Object.entries(files).forEach(([k, file]) => file && data.append(k, file));

    setSaving(true);
    try {
      await api.post("/enroll", data);
      onSaved();
    } catch (err) {
      setError(errMsg(err));
    }
    setSaving(false);
  };

  // Profile already saved: offer to skip straight to packages
  if (!editing) {
    return (
      <Card className="p-8 text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
          <CircleCheck size={28} />
        </div>
        <h2 className="text-xl font-bold text-[#1e1147] mb-1">Profile already saved</h2>
        <p className="text-slate-600 mb-6">Continue to choose your package, or review your details first.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button variant="outline" onClick={() => setEditing(true)}>Review / update profile</Button>
          <Button onClick={onSkip}>
            Continue <ArrowRight size={16} />
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3" noValidate>
      {SECTIONS.map((s, i) => (
        <Section key={s.title} icon={s.icon} title={s.title} index={i} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {s.fields
              .filter((f) => !f.showIf || f.showIf(form))
              .map((f) => (
                <FormField key={f.name} f={f} value={form[f.name]} onChange={change} />
              ))}
          </div>
          <div className="flex justify-end mt-5">
            <Button type="button" variant="light" size="sm" onClick={() => setOpen(i + 1)}>
              Next section <ArrowRight size={14} />
            </Button>
          </div>
        </Section>
      ))}

      <Section icon={Upload} title="Documents" index={SECTIONS.length} open={open === SECTIONS.length} onToggle={() => setOpen(open === SECTIONS.length ? -1 : SECTIONS.length)}>
        <p className="text-sm text-slate-500 mb-4">PDF, JPG or PNG. You can also upload these later from the portal.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FILES.map((f) => (
            <Field key={f.name} label={f.label} hint={existingFiles[f.name] && !files[f.name] ? "Already uploaded — choose a file only to replace it" : ""}>
              <input
                type="file"
                name={f.name}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={(e) => setFiles({ ...files, [f.name]: e.target.files[0] })}
                className="block w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-violet-50 file:text-[#7c3aed] file:font-medium hover:file:bg-violet-100"
              />
            </Field>
          ))}
        </div>
      </Section>

      <Card className="p-6 space-y-4">
        <label className="flex items-start gap-3 text-sm text-slate-600">
          <input type="checkbox" name="declaration_agreed" checked={form.declaration_agreed} onChange={change} className="mt-1" />
          I declare that the information provided above is true and accurate to the best of my knowledge.
        </label>
        <Alert>{error}</Alert>
        <div className="flex flex-wrap justify-between gap-3">
          {hasProfile ? (
            <Button type="button" variant="ghost" onClick={onSkip}>
              Skip — keep saved profile
            </Button>
          ) : (
            <span />
          )}
          <Button type="submit" size="lg" loading={saving}>
            Save profile & continue <ArrowRight size={16} />
          </Button>
        </div>
      </Card>
    </form>
  );
}

function Section({ icon: Icon, title, index, open, onToggle, children }) {
  return (
    <Card className="overflow-hidden">
      <button type="button" onClick={onToggle} className="w-full flex items-center gap-3 px-6 py-4 text-left">
        <span className="w-9 h-9 rounded-lg bg-violet-50 text-[#7c3aed] flex items-center justify-center">
          <Icon size={18} />
        </span>
        <span className="flex-1 font-semibold text-[#1e1147]">
          <span className="text-slate-400 mr-2">{index + 1}.</span>
          {title}
        </span>
        <ChevronDown size={20} className={`text-slate-400 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-6 pb-6 pt-1 border-t border-slate-100">{children}</div>}
    </Card>
  );
}

// One input/select, built from the field definition
function FormField({ f, value, onChange }) {
  const label = f.required ? `${f.label} *` : f.label;
  const cls = f.full ? "sm:col-span-2" : "";
  if (f.options) {
    // options can be plain strings or [value, label] pairs
    const opts = f.options.map((o) => (Array.isArray(o) ? o : [o, o]));
    return (
      <Field label={label} className={cls}>
        <select name={f.name} value={value ?? ""} onChange={onChange} className={inputCls}>
          {!f.noBlank && <option value="">Select...</option>}
          {opts.map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
      </Field>
    );
  }
  return (
    <Field label={label} className={cls}>
      <input
        name={f.name}
        type={f.type || "text"}
        min={f.type === "number" ? 0 : undefined}
        value={value ?? ""}
        onChange={onChange}
        placeholder={f.placeholder}
        className={inputCls}
      />
    </Field>
  );
}

// ---------------------------------------------------------------- step 2: package
function PackageStep({ selected, onChoose, onBack }) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/packages")
      .then((r) => setPackages(r.data.packages || []))
      .catch((e) => setError(errMsg(e)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Card><Spinner label="Loading packages..." /></Card>;
  if (error) return <Alert>{error}</Alert>;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
        {packages.map((p) => (
          <div
            key={p.id}
            className={`relative rounded-2xl p-6 flex flex-col bg-white border ${
              p.popular ? "border-[#7c3aed] shadow-xl shadow-violet-100" : "border-slate-200 shadow-sm"
            } ${selected?.id === p.id ? "ring-2 ring-[#7c3aed]" : ""}`}
          >
            {p.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#1e1147] to-[#7c3aed] text-white text-xs font-semibold px-4 py-1 rounded-full whitespace-nowrap">
                Most popular
              </span>
            )}
            <h3 className="text-xl font-bold text-[#1e1147]">{p.id}</h3>
            <p className="text-sm text-slate-500 mb-4">{p.tagline}</p>
            <p className="mb-5">
              <span className="text-3xl font-bold text-[#1e1147]">{inr(p.price_inr)}</span>
              <span className="text-sm text-slate-500"> + 18% GST</span>
            </p>
            <ul className="space-y-2 mb-6 flex-1">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2 text-sm text-slate-700">
                  <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" /> {f}
                </li>
              ))}
            </ul>
            <Button variant={p.popular ? "primary" : "outline"} onClick={() => onChoose(p)} className="w-full">
              Choose {p.id}
            </Button>
          </div>
        ))}
      </div>
      <Button variant="ghost" onClick={onBack} className="mt-5">
        <ArrowLeft size={16} /> Back to profile
      </Button>
    </div>
  );
}

// ---------------------------------------------------------------- step 3: payment
function PaymentStep({ pkg, onPay, onBack }) {
  const gst = Math.round(pkg.price_inr * 0.18);
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
      <Card className="md:col-span-2 p-6 h-fit">
        <p className="text-xs text-slate-500">You selected</p>
        <h3 className="text-xl font-bold text-[#1e1147] mb-1">{pkg.id} package</h3>
        <p className="text-sm text-slate-500 mb-4">{pkg.tagline}</p>
        <ul className="space-y-2">
          {pkg.features.map((f) => (
            <li key={f} className="flex gap-2 text-sm text-slate-700">
              <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" /> {f}
            </li>
          ))}
        </ul>
        <Button variant="ghost" size="sm" onClick={onBack} className="mt-5 -ml-2">
          <ArrowLeft size={14} /> Change package
        </Button>
      </Card>
      <Card className="md:col-span-3 p-6">
        <h3 className="font-bold text-[#1e1147] mb-4">Pay consultancy fee</h3>
        <PaymentForm
          amount={pkg.price_inr + gst}
          breakdown={[[`${pkg.id} package`, pkg.price_inr], ["GST 18%", gst]]}
          onPay={onPay}
        />
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------- step 4: success
function SuccessStep({ receipt }) {
  const navigate = useNavigate();
  const rows = [
    ["Transaction reference", receipt.txn_ref],
    ["Invoice number", receipt.invoice_no],
    ["Package", receipt.package],
    ["Amount paid (incl. GST)", inr(receipt.amount_inr)],
    ["Date", fmtDate(receipt.date, true)],
  ];
  return (
    <Card className="p-8 sm:p-10 text-center">
      <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
        <PartyPopper size={32} />
      </div>
      <h2 className="text-2xl font-bold text-[#1e1147] mb-1">Payment successful — welcome to UniEra!</h2>
      <p className="text-slate-600 mb-6">Your Student Portal is now unlocked. A copy of this receipt is in Payments.</p>

      <div className="max-w-md mx-auto text-left bg-slate-50 rounded-xl divide-y divide-slate-200 mb-8">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 px-5 py-3 text-sm">
            <span className="text-slate-500">{k}</span>
            <span className="font-semibold text-[#1e1147] text-right break-all">{v}</span>
          </div>
        ))}
      </div>

      <Button size="lg" className="px-10" onClick={() => navigate("/portal")}>
        <Plane size={18} /> Go to Student Portal
      </Button>
    </Card>
  );
}
