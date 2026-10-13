// Test preparation: browse online / offline batches, book a seat (demo payment), see my bookings.
import { useEffect, useState } from "react";
import { BookOpen, CalendarDays, Clock, MapPin, Monitor, Users, CheckCircle2 } from "lucide-react";
import { api, currentUser, errMsg, inr, fmtDate } from "../../api";
import { Card, Button, Spinner, Alert, Empty, PageTitle, Tabs, Modal } from "../../components/ui";
import StatusBadge from "../../components/StatusBadge";
import PaymentForm from "../../components/PaymentForm";

const TESTS = ["All", "IELTS", "PTE", "TOEFL", "Duolingo", "GRE", "GMAT"];
const MODES = ["All", "Online", "Offline"];

// General, indicative comparison of English tests (always confirm on the university's course page)
const ENGLISH_TESTS = [
  { test: "IELTS Academic", scale: "0 – 9 bands", typical: "6.5 overall (no band < 6.0)", result: "~3–5 days (computer) / ~13 days (paper)" },
  { test: "PTE Academic", scale: "10 – 90", typical: "58 – 65 overall", result: "Usually within 2 days" },
  { test: "TOEFL iBT", scale: "0 – 120", typical: "79 – 90 overall", result: "~4–8 days" },
  { test: "Duolingo English Test", scale: "10 – 160", typical: "110 – 120 (not accepted by all)", result: "~2 days" },
];

export default function TestPrep() {
  const user = currentUser();
  const [batches, setBatches] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [test, setTest] = useState("All");
  const [mode, setMode] = useState("All");
  const [selected, setSelected] = useState(null); // batch being booked
  const [done, setDone] = useState(null); // success info after payment

  const loadBookings = () =>
    api.get(`/test-prep/bookings/${user.id}`).then((r) => setBookings(r.data.bookings || []));

  useEffect(() => {
    Promise.all([api.get("/test-prep/batches").then((r) => setBatches(r.data.batches || [])), loadBookings()])
      .catch((e) => setError(errMsg(e)))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shown = batches.filter((b) => (test === "All" || b.test === test) && (mode === "All" || b.mode === mode));

  // Called by PaymentForm; throwing an Error shows the message inside the form
  const pay = async (details) => {
    try {
      const r = await api.post("/test-prep/book", {
        user_id: user.id,
        batch_id: selected.batch_id,
        start_date: selected.start_date,
        ...details,
      });
      setDone({ ...r.data, batch: selected });
      setSelected(null);
      loadBookings();
    } catch (e) {
      throw new Error(errMsg(e), { cause: e });
    }
  };

  if (loading) return <Spinner label="Loading batches..." />;

  return (
    <div className="space-y-8">
      <PageTitle
        title="Test Preparation"
        subtitle="IELTS, PTE, TOEFL, Duolingo, GRE and GMAT coaching — live online classes or at a UniEra centre."
      />

      <Alert>{error}</Alert>
      {done && (
        <Alert type="success">
          Seat booked for <b>{done.batch.batch}</b>. Transaction ref <b>{done.txn_ref}</b> · Invoice {done.invoice_no}
        </Alert>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <Tabs tabs={TESTS} value={test} onChange={setTest} />
        <Tabs tabs={MODES} value={mode} onChange={setMode} />
      </div>

      {/* Batch cards */}
      {shown.length === 0 ? (
        <Card>
          <Empty icon={BookOpen} title="No batches match" text="Try another test or mode." />
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {shown.map((b) => (
            <Card key={b.batch_id} className="p-5 flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <span className="text-lg font-bold text-[#1e1147]">{b.test}</span>
                <span
                  className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                    b.mode === "Online" ? "bg-sky-50 text-sky-700" : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {b.mode === "Online" ? <Monitor size={12} /> : <MapPin size={12} />} {b.mode}
                </span>
              </div>
              <p className="text-sm text-slate-700 mt-2 font-medium">{b.batch}</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600 flex-1">
                <li className="flex items-center gap-2">
                  {b.mode === "Online" ? <Monitor size={15} /> : <MapPin size={15} />} {b.centre}
                </li>
                <li className="flex items-center gap-2">
                  <Clock size={15} /> {b.weeks} weeks
                </li>
                <li className="flex items-center gap-2">
                  <CalendarDays size={15} /> Starts {fmtDate(b.start_date)}
                </li>
                <li className="flex items-center gap-2">
                  <Users size={15} />
                  <span className={b.seats_left <= 5 ? "text-red-600 font-medium" : ""}>{b.seats_left} seats left</span>
                </li>
              </ul>
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
                <span className="text-xl font-bold text-[#1e1147]">{inr(b.fee_inr)}</span>
                <Button size="sm" onClick={() => { setDone(null); setSelected(b); }}>
                  Book seat
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-6">
        {/* My bookings */}
        <Card className="p-5 lg:col-span-3">
          <h2 className="font-bold text-[#1e1147] mb-3">My bookings</h2>
          {bookings.length === 0 ? (
            <Empty icon={BookOpen} title="No bookings yet" text="Book a batch above to start preparing." />
          ) : (
            <div className="divide-y divide-slate-100">
              {bookings.map((b) => (
                <div key={b.booking_id} className="py-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-slate-800">
                      {b.test_name} · {b.mode}
                    </p>
                    <p className="text-xs text-slate-500">
                      {b.batch} — {b.centre} · starts {fmtDate(b.start_date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">{inr(b.fee_inr)}</span>
                    <StatusBadge status={b.status || "Confirmed"} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* English test comparison */}
        <Card className="p-5 lg:col-span-2">
          <h2 className="font-bold text-[#1e1147]">Which English test?</h2>
          <p className="text-xs text-slate-500 mt-1 mb-3">
            Indicative only — typical Australian master's requirements. Always check your course page.
          </p>
          <div className="space-y-3">
            {ENGLISH_TESTS.map((t) => (
              <div key={t.test} className="bg-slate-50 rounded-xl p-3 text-sm">
                <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-[#7c3aed]" /> {t.test}
                </p>
                <p className="text-xs text-slate-600 mt-1">Score scale: {t.scale}</p>
                <p className="text-xs text-slate-600">Typical masters: {t.typical}</p>
                <p className="text-xs text-slate-600">Results: {t.result}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected ? `Book ${selected.test} — ${selected.mode}` : ""}>
        {selected && (
          <>
            <p className="text-sm text-slate-600 mb-4">
              {selected.batch}
              <br />
              {selected.centre} · starts {fmtDate(selected.start_date)} · {selected.weeks} weeks
            </p>
            <PaymentForm
              amount={selected.fee_inr}
              breakdown={[[`${selected.test} ${selected.mode} course fee`, selected.fee_inr]]}
              onPay={pay}
              payLabel="Pay"
            />
          </>
        )}
      </Modal>
    </div>
  );
}
