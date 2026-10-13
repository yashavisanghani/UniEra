// Public landing page of the UniEra consultancy.
// Everything numeric (stats, partner universities, packages, reviews) comes from GET /public/stats.
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  School,
  ClipboardCheck,
  Award,
  BookOpen,
  Landmark,
  Plane,
  BedDouble,
  LayoutDashboard,
  Search,
  CreditCard,
  Upload,
  Activity,
  ArrowRight,
  Star,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  Send,
  Check,
  GraduationCap,
  MessageSquareQuote,
  Lock,
} from "lucide-react";
import { api, currentUser, errMsg, inr } from "../api";
import { Card, Button, Field, Alert, Spinner, Tabs, inputCls } from "../components/ui";

// ---------------------------------------------------------------- static content
const SERVICES = [
  { icon: School, title: "Shortlisting & applications", text: "We shortlist universities that fit your profile and submit the applications for you." },
  { icon: ClipboardCheck, title: "Eligibility & document checks", text: "Counsellors check your academics, English scores and every document before it is sent." },
  { icon: Award, title: "Scholarship guidance", text: "Find university and government scholarships you qualify for and apply on time." },
  { icon: BookOpen, title: "IELTS / PTE / TOEFL prep", text: "Online and classroom batches to reach the English score your course needs." },
  { icon: Landmark, title: "Education loans", text: "Compare Indian banks and NBFCs and get help preparing your loan file." },
  { icon: Plane, title: "Student visa support", text: "Guidance with your subclass 500 visa file, GTE statement and financial evidence." },
  { icon: BedDouble, title: "Accommodation", text: "Student residences, shared apartments and homestays near your campus." },
  { icon: LayoutDashboard, title: "Payments & tracking dashboard", text: "One portal to track applications, offers, payments and bookings." },
];

const STEPS = [
  { icon: Search, title: "Explore", text: "Browse universities, courses, scholarships and costs — free, no login needed." },
  { icon: CreditCard, title: "Enroll & pay", text: "Create your profile and choose a Basic, Premium or Elite package." },
  { icon: Upload, title: "Upload documents — we apply", text: "Upload what each university needs. Our counsellors verify and apply for you." },
  { icon: Activity, title: "Track offers & visa", text: "Follow every application, accept offers and move on to your visa." },
];

const TIERS = [
  { value: "Group of Eight", label: "Group of Eight" },
  { value: "Mid-tier", label: "Mid-tier" },
  { value: "Regional", label: "Regional" },
];

const FAQS = [
  {
    q: "Can I apply to a university directly from this website?",
    a: "No. You can explore universities, scholarships, eligibility and costs freely, but applications are submitted by UniEra counsellors. To apply, enrol with UniEra and choose a package — your Student Portal then unlocks.",
  },
  {
    q: "What does the consultancy fee cover?",
    a: "Each package covers counselling, a set number of university applications, document review and application tracking. Higher packages add scholarship applications, loan assistance, visa filing support and more. All prices are in INR and 18% GST is added.",
  },
  {
    q: "Which English tests are accepted by Australian universities?",
    a: "Most universities accept IELTS Academic, PTE Academic and TOEFL iBT; many also accept the Duolingo English Test. The minimum score depends on the university and course — the eligibility checker shows it for each course.",
  },
  {
    q: "Which documents will I need?",
    a: "Usually academic transcripts, passport, resume, statement of purpose, English test scorecard and financial proof. Some universities or courses ask for more (e.g. degree certificate, portfolio). The portal shows the exact checklist for each university.",
  },
  {
    q: "Can UniEra help with an education loan?",
    a: "Yes. We compare indicative rates from Indian public banks and NBFCs, help you prepare the loan file and share it with the lender you choose. Final approval and interest rates are decided by the lender.",
  },
  {
    q: "How will I know the status of my application?",
    a: "Every application gets a reference number (e.g. UE-2026-00001). Enrolled students see live status in the portal, and anyone can check it on the Track Application page using the reference and registered email.",
  },
];

// ---------------------------------------------------------------- page
export default function Home() {
  const user = currentUser();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/public/stats")
      .then((res) => setStats(res.data))
      .catch((e) => setError(errMsg(e)))
      .finally(() => setLoading(false));
  }, []);

  // Primary CTA changes depending on who is visiting
  const enrollLink = user?.isEnrolled ? "/portal" : "/enroll";
  const enrollLabel = user?.isEnrolled ? "Go to Student Portal" : "Enroll Now";

  return (
    <div className="bg-white">
      <Hero enrollLink={enrollLink} enrollLabel={enrollLabel} />
      <StatsStrip stats={stats} loading={loading} error={error} />
      <Services />
      <HowItWorks />
      <Partners stats={stats} loading={loading} error={error} />
      <Packages stats={stats} loading={loading} error={error} />
      <Reviews stats={stats} loading={loading} />
      <Faq />
      <Contact />
    </div>
  );
}

// Small helper for section headings
function SectionHead({ eyebrow, title, text, center = true }) {
  return (
    <div className={`mb-10 ${center ? "text-center max-w-2xl mx-auto" : ""}`}>
      {eyebrow && <p className="text-sm font-semibold text-[#7c3aed] uppercase tracking-wider mb-2">{eyebrow}</p>}
      <h2 className="text-3xl sm:text-4xl font-bold text-[#1e1147] mb-3">{title}</h2>
      {text && <p className="text-slate-600">{text}</p>}
    </div>
  );
}

// ---------------------------------------------------------------- hero
function Hero({ enrollLink, enrollLabel }) {
  return (
    <section className="bg-gradient-to-br from-white via-[#faf9ff] to-[#f3f0ff]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <span className="inline-flex items-center gap-2 bg-violet-100 text-[#7c3aed] text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <GraduationCap size={16} /> Study in Australia with UniEra
          </span>
          <h1 className="text-5xl sm:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight text-[#1e1147] mb-8">
            Your Path
            <br />
            Abroad,
            <br />
            <span className="text-[#7c3aed]">Made Easy</span>
          </h1>

          <p className="text-lg text-slate-600 leading-relaxed max-w-lg mb-10">
            A study-abroad consultancy for Indian students. We shortlist universities, apply on your behalf, and
            support you with scholarships, test prep, education loans, visa and accommodation.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to={enrollLink}
              className="inline-flex items-center gap-2 bg-[#1e1147] hover:bg-[#2d1a63] text-white px-8 py-4 rounded-xl font-medium transition shadow-lg shadow-violet-200"
            >
              {enrollLabel} <ArrowRight size={18} />
            </Link>
            <Link
              to="/universities"
              className="border border-slate-300 hover:border-[#7c3aed] hover:text-[#7c3aed] text-slate-800 px-8 py-4 rounded-xl font-medium transition bg-white"
            >
              Explore Universities
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-3xl border border-purple-100 p-4 bg-white/60">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] max-h-[620px] w-full bg-gradient-to-b from-orange-200 via-amber-300 to-sky-700">
              <img
                src="/hero.jpg"
                alt="Studying in Australia"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />

              <div className="absolute top-5 left-5 bg-white rounded-2xl shadow-lg px-5 py-4 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#7c3aed] flex items-center justify-center text-white">
                  <School size={20} />
                </div>
                <div>
                  <p className="font-bold text-[#1e1147] leading-tight">We apply for you</p>
                  <p className="text-sm text-slate-500">Australian universities</p>
                </div>
              </div>

              <div className="absolute bottom-5 right-5 bg-white rounded-2xl shadow-lg px-5 py-4 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                  <Award size={20} />
                </div>
                <div>
                  <p className="font-bold text-[#1e1147] leading-tight">Scholarship guidance</p>
                  <p className="text-sm text-slate-500">University & government</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- live stats
function StatsStrip({ stats, loading, error }) {
  const items = [
    ["Partner universities", stats?.universities],
    ["Courses listed", stats?.courses],
    ["Scholarships tracked", stats?.scholarships],
    ["Cities covered", stats?.cities],
  ];
  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-8 -mt-2 lg:-mt-6 relative z-10">
      <Card className="p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 shadow-lg">
        {items.map(([label, value]) => (
          <div key={label} className="text-center">
            <p className="text-3xl sm:text-4xl font-bold text-[#1e1147] mb-1">
              {loading ? <span className="inline-block w-12 h-8 bg-slate-100 rounded animate-pulse" /> : value ?? "—"}
            </p>
            <p className="text-sm text-slate-500">{label}</p>
          </div>
        ))}
        {error && <p className="col-span-2 md:col-span-4 text-center text-xs text-red-500">{error}</p>}
      </Card>
    </section>
  );
}

// ---------------------------------------------------------------- services
function Services() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-8 py-20">
      <SectionHead
        eyebrow="What we do"
        title="Our services"
        text="Everything an Indian student needs to go from first search to arrival in Australia."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {SERVICES.map((s) => (
          <Card key={s.title} className="p-6 hover:border-violet-300 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-violet-50 text-[#7c3aed] flex items-center justify-center mb-4">
              <s.icon size={24} />
            </div>
            <h3 className="font-bold text-[#1e1147] mb-2">{s.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{s.text}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- how it works
function HowItWorks() {
  return (
    <section className="bg-gradient-to-br from-[#1e1147] to-[#4c1d95] text-white py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-sm font-semibold text-violet-300 uppercase tracking-wider mb-2">Process</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">How it works</h2>
          <p className="text-purple-200">Four simple steps. Our team handles the paperwork in between.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((s, i) => (
            <div key={s.title} className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-white text-[#7c3aed] flex items-center justify-center">
                  <s.icon size={22} />
                </div>
                <span className="text-4xl font-bold text-white/20">0{i + 1}</span>
              </div>
              <h3 className="font-bold text-lg mb-2">{s.title}</h3>
              <p className="text-sm text-purple-200 leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- partner universities
function Partners({ stats, loading, error }) {
  const [tier, setTier] = useState("Group of Eight");
  const list = (stats?.partners || []).filter((u) => u.uni_tier === tier);
  const count = (t) => (stats?.partners || []).filter((u) => u.uni_tier === t).length;

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-8 py-20">
      <SectionHead
        eyebrow="Universities"
        title="Partner universities"
        text="Australian universities we currently support admissions to. Click any university for courses, fees and entry requirements."
      />
      <div className="flex justify-center mb-8">
        <div className="max-w-full">
        <Tabs
          tabs={TIERS.map((t) => ({ value: t.value, label: stats ? `${t.label} (${count(t.value)})` : t.label }))}
          value={tier}
          onChange={setTier}
        />
        </div>
      </div>

      {loading ? (
        <Spinner label="Loading universities..." />
      ) : error ? (
        <Alert className="max-w-xl mx-auto">{error}</Alert>
      ) : list.length === 0 ? (
        <p className="text-center text-slate-500 py-10">No universities in this group yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {list.map((u) => (
            <Link
              key={u.university_id}
              to={`/universities/${u.university_id}`}
              className="group flex items-center gap-3 border border-slate-200 rounded-xl p-4 hover:border-[#7c3aed] hover:shadow-sm transition bg-white"
            >
              <div className="w-10 h-10 shrink-0 rounded-lg bg-violet-50 text-[#7c3aed] flex items-center justify-center font-bold">
                {u.name.replace(/^The /, "").charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-[#1e1147] text-sm leading-snug group-hover:text-[#7c3aed] truncate">
                  {u.name}
                </p>
                <p className="text-xs text-slate-500">
                  {u.city}, {u.state}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
      <div className="text-center mt-8">
        <Link to="/universities" className="inline-flex items-center gap-1 text-[#7c3aed] font-medium hover:underline">
          Search & filter all universities <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- packages
function Packages({ stats, loading, error }) {
  const packages = stats?.packages || [];
  return (
    <section className="bg-slate-50 py-20" id="packages">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <SectionHead
          eyebrow="Pricing"
          title="Consultancy packages"
          text="One-time consultancy fee. Pick the level of support you need — you can start applying as soon as you enrol."
        />
        {loading ? (
          <Spinner label="Loading packages..." />
        ) : error ? (
          <Alert className="max-w-xl mx-auto">{error}</Alert>
        ) : packages.length === 0 ? (
          <p className="text-center text-slate-500">Packages will be listed here soon.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {packages.map((p) => (
              <div
                key={p.id}
                className={`relative rounded-2xl p-7 flex flex-col bg-white border ${
                  p.popular ? "border-[#7c3aed] shadow-xl shadow-violet-100 md:-translate-y-2" : "border-slate-200 shadow-sm"
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#1e1147] to-[#7c3aed] text-white text-xs font-semibold px-4 py-1 rounded-full">
                    Most popular
                  </span>
                )}
                <h3 className="text-xl font-bold text-[#1e1147]">{p.id}</h3>
                <p className="text-sm text-slate-500 mb-5">{p.tagline}</p>
                <p className="mb-6">
                  <span className="text-4xl font-bold text-[#1e1147]">{inr(p.price_inr)}</span>
                  <span className="text-sm text-slate-500"> + 18% GST</span>
                </p>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2 text-sm text-slate-700">
                      <Check size={18} className="text-emerald-500 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/enroll"
                  className={`text-center py-3 rounded-xl font-medium transition ${
                    p.popular
                      ? "bg-gradient-to-r from-[#1e1147] to-[#7c3aed] text-white hover:opacity-90"
                      : "border border-slate-300 text-slate-700 hover:border-[#7c3aed] hover:text-[#7c3aed]"
                  }`}
                >
                  Choose {p.id}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- reviews (real data only)
function Stars({ value }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={16} className={n <= Math.round(value) ? "fill-amber-400 text-amber-400" : "text-slate-300"} />
      ))}
    </div>
  );
}

function Reviews({ stats, loading }) {
  const reviews = stats?.reviews || [];
  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-8 py-20">
      <SectionHead eyebrow="Reviews" title="What our students say" />
      {loading ? (
        <Spinner label="Loading reviews..." />
      ) : reviews.length === 0 ? (
        <Card className="max-w-xl mx-auto p-10 text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-violet-50 text-[#7c3aed] flex items-center justify-center mb-3">
            <MessageSquareQuote size={26} />
          </div>
          <p className="font-semibold text-slate-800">Reviews from enrolled students will appear here</p>
          <p className="text-sm text-slate-500 mt-1">
            Only students who have enrolled with UniEra can leave a review from their Student Portal.
          </p>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-center gap-3 mb-8 -mt-4">
            <Stars value={stats.avg_rating} />
            <span className="text-sm text-slate-600">
              <strong className="text-[#1e1147]">{stats.avg_rating.toFixed(1)}</strong> average from{" "}
              {stats.review_count} review{stats.review_count === 1 ? "" : "s"}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {reviews.map((r) => (
              <Card key={r.review_id} className="p-6 flex flex-col">
                <Stars value={r.rating} />
                <p className="text-slate-700 mt-3 mb-5 flex-1 leading-relaxed">&ldquo;{r.comment}&rdquo;</p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1e1147] to-[#7c3aed] text-white flex items-center justify-center font-semibold">
                    {(r.name || "S").charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-[#1e1147] text-sm">{r.name}</p>
                    <p className="text-xs text-slate-500">{r.university || "UniEra student"}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

// ---------------------------------------------------------------- FAQ accordion
function Faq() {
  const [open, setOpen] = useState(0); // index of the open question (-1 = none)
  return (
    <section className="bg-slate-50 py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-8">
        <SectionHead eyebrow="FAQ" title="Frequently asked questions" />
        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <div key={f.q} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="w-full flex items-center justify-between gap-4 text-left px-6 py-4 font-semibold text-[#1e1147]"
              >
                {f.q}
                <ChevronDown size={20} className={`shrink-0 text-slate-400 transition ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && <p className="px-6 pb-5 text-sm text-slate-600 leading-relaxed">{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- contact / enquiry
function Contact() {
  const empty = { name: "", email: "", phone: "", message: "" };
  const [form, setForm] = useState(empty);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState({ type: "", text: "" });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    setResult({ type: "", text: "" });
    try {
      const res = await api.post("/enquiries", form);
      setResult({ type: "success", text: res.data.message });
      setForm(empty);
    } catch (err) {
      setResult({ type: "error", text: errMsg(err) });
    }
    setSending(false);
  };

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-8 py-20" id="contact">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2">
          <p className="text-sm font-semibold text-[#7c3aed] uppercase tracking-wider mb-2">Contact</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1e1147] mb-3">Talk to a counsellor</h2>
          <p className="text-slate-600 mb-8">
            Have a question before you enrol? Send us a message and a UniEra counsellor will get back to you.
          </p>
          <ul className="space-y-4 text-slate-700">
            <li className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg bg-violet-50 text-[#7c3aed] flex items-center justify-center"><Phone size={18} /></span>
              +91 98765 43210
            </li>
            <li className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg bg-violet-50 text-[#7c3aed] flex items-center justify-center"><Mail size={18} /></span>
              hello@uniera.com
            </li>
            <li className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg bg-violet-50 text-[#7c3aed] flex items-center justify-center"><MapPin size={18} /></span>
              Offices in Ahmedabad · Mumbai · Pune
            </li>
          </ul>
          <div className="mt-8 flex gap-3 bg-violet-50 border border-violet-100 rounded-2xl p-5 text-sm text-violet-900">
            <Lock size={18} className="shrink-0 mt-0.5 text-[#7c3aed]" />
            <p>
              Exploring is free. To <strong>apply to universities</strong> through UniEra you need to{" "}
              <Link to="/enroll" className="font-semibold text-[#7c3aed] underline">enrol</Link> and choose a package —
              this unlocks your Student Portal.
            </p>
          </div>
        </div>

        <Card className="lg:col-span-3 p-6 sm:p-8">
          <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full name">
              <input className={inputCls} value={form.name} onChange={set("name")} required />
            </Field>
            <Field label="Email">
              <input type="email" className={inputCls} value={form.email} onChange={set("email")} required />
            </Field>
            <Field label="Phone (optional)" className="sm:col-span-2">
              <input className={inputCls} value={form.phone} onChange={set("phone")} placeholder="+91" />
            </Field>
            <Field label="Your message" className="sm:col-span-2">
              <textarea
                rows={5}
                className={inputCls}
                value={form.message}
                onChange={set("message")}
                placeholder="E.g. I want to do a Master of Data Science in Sydney, Feb 2027 intake..."
                required
              />
            </Field>
            {result.text && (
              <Alert type={result.type} className="sm:col-span-2">
                {result.text}
              </Alert>
            )}
            <div className="sm:col-span-2">
              <Button type="submit" size="lg" loading={sending} className="w-full sm:w-auto">
                <Send size={16} /> Send enquiry
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </section>
  );
}
