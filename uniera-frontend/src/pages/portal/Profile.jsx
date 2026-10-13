// Student profile (the enrolment form data) + documents on file.
// GET /profile/:uid → { user, enroll, documents }
// Editing re-submits the form to POST /enroll (multipart). The backend saves a new
// version of the profile and keeps old files unless a new one is uploaded.
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  User, GraduationCap, Languages, Globe, Wallet, Plane, FileText, ExternalLink, Pencil, Save, X, Upload,
} from "lucide-react";
import { api, currentUser, errMsg, fileUrl, fmtDate } from "../../api";
import { Card, Button, Spinner, Alert, Empty, PageTitle, Field, inputCls } from "../../components/ui";

// Each section: [field key, label, input type or list of select options]
const SECTIONS = [
  {
    title: "Personal details",
    icon: User,
    fields: [
      ["full_name", "Full name"],
      ["email", "Email", "email"],
      ["phone_number", "Phone"],
      ["alternate_phone", "Alternate phone"],
      ["date_of_birth", "Date of birth", "date"],
      ["gender", "Gender", ["Male", "Female", "Other", "Prefer_not_to_say"]],
      ["nationality", "Nationality"],
      ["passport_number", "Passport number"],
      ["current_address", "Current address"],
      ["current_city", "City"],
      ["current_country", "Country"],
      ["emergency_contact_name", "Emergency contact"],
      ["emergency_contact_relation", "Relation"],
      ["emergency_contact_phone", "Emergency phone"],
    ],
  },
  {
    title: "Academic background",
    icon: GraduationCap,
    fields: [
      ["highest_qualification", "Highest qualification", ["12th", "Diploma", "Bachelors", "Masters", "PhD"]],
      ["field_of_study", "Field of study"],
      ["institution_name", "Institution"],
      ["graduation_year", "Graduation year", "number"],
      ["percentage_gpa", "Percentage / GPA"],
      ["academic_gap", "Academic gap", ["No", "Yes"]],
      ["academic_gap_reason", "Gap reason"],
      ["backlogs", "Backlogs", ["No", "Yes"]],
      ["backlogs_count", "Number of backlogs", "number"],
      ["work_experience_years", "Work experience (years)", "number"],
    ],
  },
  {
    title: "Test scores",
    icon: Languages,
    fields: [
      ["english_test_type", "English test", ["Not_Taken", "IELTS", "TOEFL", "PTE", "Duolingo"]],
      ["english_test_score", "English score"],
      ["other_test_type", "Other test", ["None", "GRE", "GMAT", "SAT"]],
      ["other_test_score", "Other test score"],
    ],
  },
  {
    title: "Study preferences",
    icon: Globe,
    fields: [
      ["preferred_country", "Preferred country"],
      ["preferred_university", "Preferred university"],
      ["preferred_course", "Preferred course"],
      ["course_level", "Course level", ["Undergraduate", "Postgraduate", "Diploma", "PhD"]],
      ["intake_month_year", "Preferred intake"],
    ],
  },
  {
    title: "Budget & funding",
    icon: Wallet,
    fields: [
      ["budget_range", "Budget (A$ per year)"],
      ["funding_source", "Funding source", ["Self_Funded", "Education_Loan", "Scholarship", "Family_Sponsored"]],
    ],
  },
  {
    title: "Visa history",
    icon: Plane,
    fields: [
      ["visa_applied_before", "Applied for a visa before", ["No", "Yes"]],
      ["visa_rejected_before", "Visa ever rejected", ["No", "Yes"]],
      ["visa_rejection_details", "Rejection details"],
    ],
  },
];

const FILES = [
  ["transcript_file", "Academic transcripts"],
  ["passport_file", "Passport"],
  ["resume_file", "Resume / CV"],
  ["sop_file", "Statement of purpose"],
  ["recommendation_letter_file", "Recommendation letter"],
];

// "Self_Funded" → "Self Funded", dates → readable
const pretty = (key, value) => {
  if (value === null || value === undefined || value === "") return null;
  if (key === "date_of_birth") return fmtDate(value);
  return String(value).replaceAll("_", " ");
};

export default function Profile() {
  const user = currentUser();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [files, setFiles] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [notice, setNotice] = useState("");

  const [version, setVersion] = useState(0); // bump to reload after saving

  useEffect(() => {
    api
      .get(`/profile/${user.id}`)
      .then((r) => setData(r.data))
      .catch((e) => setError(errMsg(e, "Could not load your profile")));
  }, [user.id, version]);

  const startEdit = () => {
    const e = data.enroll || {};
    const initial = {};
    SECTIONS.forEach((s) =>
      s.fields.forEach(([key]) => {
        let v = e[key] ?? "";
        if (key === "date_of_birth" && v) v = String(v).slice(0, 10); // yyyy-mm-dd for the date input
        initial[key] = v;
      })
    );
    setForm(initial);
    setFiles({});
    setSaveError("");
    setNotice("");
    setEditing(true);
  };

  const save = async (ev) => {
    ev.preventDefault();
    setSaving(true);
    setSaveError("");
    try {
      const fd = new FormData();
      // start from the current profile so fields we don't show in the form are kept
      Object.entries(data.enroll || {}).forEach(([k, v]) => {
        if (["enroll_id", "created_at"].includes(k) || k.endsWith("_file")) return;
        if (v !== null && v !== undefined) fd.append(k, v);
      });
      Object.entries(form).forEach(([k, v]) => fd.set(k, v ?? ""));
      fd.set("user_id", user.id);
      fd.set("declaration_agreed", "Yes");
      Object.entries(files).forEach(([k, f]) => f && fd.append(k, f));

      await api.post("/enroll", fd);
      setVersion((v) => v + 1);
      setEditing(false);
      setNotice("Profile updated successfully.");
      document.querySelector("main")?.scrollTo({ top: 0, behavior: "smooth" }); // the portal scrolls inside <main>
    } catch (e) {
      setSaveError(errMsg(e, "Could not save your profile"));
    }
    setSaving(false);
  };

  if (error) return <Alert>{error}</Alert>;
  if (!data) return <Spinner label="Loading your profile..." />;

  const enroll = data.enroll;

  if (!enroll) {
    return (
      <div>
        <PageTitle title="My profile" />
        <Card>
          <Empty
            icon={User}
            title="No enrolment profile yet"
            text="Fill in the enrolment form so we can evaluate your profile and reuse your documents."
            action={
              <Link to="/enroll">
                <Button>Complete enrolment form</Button>
              </Link>
            }
          />
        </Card>
      </div>
    );
  }

  // ------------------------------------------------ edit mode
  if (editing) {
    return (
      <form onSubmit={save}>
        <PageTitle
          title="Edit profile"
          subtitle="Changes are used for eligibility checks and future applications."
          actions={
            <>
              <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
                <X size={16} /> Cancel
              </Button>
              <Button type="submit" loading={saving}>
                <Save size={16} /> Save changes
              </Button>
            </>
          }
        />
        <Alert className="mb-4">{saveError}</Alert>

        <div className="space-y-5">
          {SECTIONS.map((s) => (
            <Card key={s.title} className="p-5">
              <h2 className="font-bold text-[#1e1147] flex items-center gap-2 mb-4">
                <s.icon size={18} className="text-[#7c3aed]" /> {s.title}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {s.fields.map(([key, label, type]) => (
                  <Field key={key} label={label}>
                    {Array.isArray(type) ? (
                      <select className={inputCls} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}>
                        <option value="">Select</option>
                        {type.map((o) => (
                          <option key={o} value={o}>{o.replaceAll("_", " ")}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        className={inputCls}
                        type={type || "text"}
                        value={form[key]}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      />
                    )}
                  </Field>
                ))}
              </div>
            </Card>
          ))}

          <Card className="p-5">
            <h2 className="font-bold text-[#1e1147] flex items-center gap-2 mb-1">
              <Upload size={18} className="text-[#7c3aed]" /> Replace documents (optional)
            </h2>
            <p className="text-xs text-slate-500 mb-4">Leave empty to keep the file already on record.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {FILES.map(([key, label]) => (
                <Field key={key} label={label} hint={enroll[key] ? "On file — upload only to replace" : "Not uploaded yet"}>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    className="block w-full text-sm file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-violet-50 file:text-[#7c3aed]"
                    onChange={(e) => setFiles({ ...files, [key]: e.target.files[0] })}
                  />
                </Field>
              ))}
            </div>
          </Card>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>
              <Save size={16} /> Save changes
            </Button>
          </div>
        </div>
      </form>
    );
  }

  // ------------------------------------------------ read-only view
  return (
    <div>
      <PageTitle
        title="My profile"
        subtitle="The details UniEra uses to check your eligibility and prepare applications."
        actions={
          <Button onClick={startEdit}>
            <Pencil size={16} /> Edit profile
          </Button>
        }
      />
      <Alert type="success" className="mb-4">{notice}</Alert>

      <Card className="p-5 mb-5 flex flex-wrap items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1e1147] to-[#7c3aed] text-white flex items-center justify-center text-xl font-bold">
          {(enroll.full_name || data.user?.name || "S")[0].toUpperCase()}
        </div>
        <div>
          <p className="text-lg font-bold text-[#1e1147]">{enroll.full_name || data.user?.name}</p>
          <p className="text-sm text-slate-500">
            {enroll.email || data.user?.email}
            {enroll.phone_number ? ` · ${enroll.phone_number}` : ""}
          </p>
        </div>
        <p className="text-xs text-slate-400 ml-auto">Last updated {fmtDate(enroll.created_at, true)}</p>
      </Card>

      <div className="grid lg:grid-cols-2 gap-5">
        {SECTIONS.map((s) => (
          <Card key={s.title} className="p-5">
            <h2 className="font-bold text-[#1e1147] flex items-center gap-2 mb-3">
              <s.icon size={18} className="text-[#7c3aed]" /> {s.title}
            </h2>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
              {s.fields.map(([key, label]) => (
                <div key={key}>
                  <dt className="text-[11px] text-slate-400">{label}</dt>
                  <dd className="text-sm text-slate-800 break-words">
                    {pretty(key, enroll[key]) ?? <span className="text-slate-300">Not provided</span>}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>
        ))}

        <Card className="p-5 lg:col-span-2">
          <h2 className="font-bold text-[#1e1147] flex items-center gap-2 mb-3">
            <FileText size={18} className="text-[#7c3aed]" /> Documents on file
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FILES.map(([key, label]) => (
              <div key={key} className="flex items-center justify-between gap-2 border border-slate-200 rounded-xl px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800">{label}</p>
                  <p className="text-[11px] text-slate-400 truncate">{enroll[key] || "Not uploaded"}</p>
                </div>
                {enroll[key] ? (
                  <a href={fileUrl(enroll[key])} target="_blank" rel="noreferrer" className="text-[#7c3aed] hover:text-[#1e1147] shrink-0">
                    <ExternalLink size={16} />
                  </a>
                ) : (
                  <span className="text-[11px] text-amber-600 shrink-0">Missing</span>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
