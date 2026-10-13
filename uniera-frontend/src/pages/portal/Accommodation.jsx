// Student accommodation: browse partner properties by city, request a booking, track my requests.
import { useEffect, useState } from "react";
import { Home as HomeIcon, MapPin, BedDouble, CalendarDays } from "lucide-react";
import { api, currentUser, errMsg, money, fmtDate } from "../../api";
import { Card, Button, Field, inputCls, Spinner, Alert, Empty, PageTitle, Modal } from "../../components/ui";

const WEEKS = [12, 24, 48];

const STATUS_CLS = {
  Requested: "bg-amber-50 text-amber-700 border-amber-200",
  Confirmed: "bg-green-50 text-green-700 border-green-300",
  Cancelled: "bg-slate-100 text-slate-500 border-slate-200",
};

export default function Accommodation() {
  const user = currentUser();
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState(null); // null until we know the default city
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // booking modal
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ room_type: "", move_in: "", weeks: 12 });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const loadBookings = () =>
    api.get(`/accommodation/bookings/${user.id}`).then((r) => setBookings(r.data.bookings || []));

  // First load: list of cities (from all properties), default city = city of my first application
  useEffect(() => {
    Promise.all([
      api.get("/accommodation"),
      api.get("/applications", { params: { user_id: user.id } }).catch(() => ({ data: {} })),
      loadBookings(),
    ])
      .then(([all, apps]) => {
        const list = [...new Set((all.data.properties || []).map((p) => p.city))].sort();
        setCities(list);
        const firstApp = (apps.data.applications || [])[0];
        setCity(firstApp && list.includes(firstApp.city) ? firstApp.city : "All");
      })
      .catch((e) => {
        setError(errMsg(e));
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reload properties whenever the city changes
  useEffect(() => {
    if (city === null) return;
    api
      .get("/accommodation", { params: { city } })
      .then((r) => setProperties(r.data.properties || []))
      .catch((e) => setError(errMsg(e)))
      .finally(() => setLoading(false));
  }, [city]);

  const changeCity = (c) => {
    setLoading(true); // the effect above fetches the new city's properties
    setCity(c);
  };

  const openBooking = (p) => {
    setSelected(p);
    setForm({ room_type: p.rooms[0]?.room_type || "", move_in: "", weeks: 12 });
    setFormError("");
    setMessage("");
  };

  const room = selected?.rooms.find((r) => r.room_type === form.room_type);
  const estimate = room ? room.weekly_rent_aud * Number(form.weeks) : 0;

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      const r = await api.post("/accommodation/book", {
        user_id: user.id,
        property_id: selected.property_id,
        ...form,
      });
      setMessage(r.data.message || "Request sent");
      setSelected(null);
      loadBookings();
    } catch (err) {
      setFormError(errMsg(err));
    }
    setSaving(false);
  };

  return (
    <div className="space-y-8">
      <PageTitle
        title="Accommodation"
        subtitle="UniEra partner student housing across Australian cities. Rents are weekly, in Australian dollars."
        actions={
          <select className={`${inputCls} w-48`} value={city || "All"} onChange={(e) => changeCity(e.target.value)}>
            <option value="All">All cities</option>
            {cities.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        }
      />

      <Alert>{error}</Alert>
      <Alert type="success">{message}</Alert>

      {loading ? (
        <Spinner label="Loading properties..." />
      ) : properties.length === 0 ? (
        <Card>
          <Empty icon={HomeIcon} title="No properties found" text="Try another city." />
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {properties.map((p) => (
            <Card key={p.property_id} className="p-5 flex flex-col">
              <span className="self-start text-[11px] font-semibold px-2 py-0.5 rounded-full bg-violet-50 text-[#7c3aed]">
                {p.type}
              </span>
              <p className="font-bold text-[#1e1147] mt-2">{p.name}</p>
              <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                <MapPin size={14} /> {p.city}, {p.state} · {p.distance}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {p.amenities.map((a) => (
                  <span key={a} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                    {a}
                  </span>
                ))}
              </div>
              <div className="mt-4 space-y-1.5 flex-1">
                {p.rooms.map((r) => (
                  <div key={r.room_type} className="flex justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <BedDouble size={14} /> {r.room_type}
                    </span>
                    <span className="font-semibold text-slate-800">{money(r.weekly_rent_aud)}/wk</span>
                  </div>
                ))}
              </div>
              <Button size="sm" className="mt-5" onClick={() => openBooking(p)}>
                Request booking
              </Button>
            </Card>
          ))}
        </div>
      )}

      {/* My requests */}
      <section>
        <h2 className="font-bold text-[#1e1147] mb-3">My requests</h2>
        <Card className="p-5">
          {bookings.length === 0 ? (
            <Empty icon={HomeIcon} title="No accommodation requests yet" text="Pick a property above and request a room." />
          ) : (
            <div className="divide-y divide-slate-100">
              {bookings.map((b) => (
                <div key={b.booking_id} className="py-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-slate-800">{b.property_name}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <CalendarDays size={12} /> {b.room_type} · move-in {fmtDate(b.move_in)} · {b.weeks} weeks ·{" "}
                      {money(b.weekly_rent_aud)}/wk (≈ {money(b.weekly_rent_aud * b.weeks)} total)
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_CLS[b.status] || STATUS_CLS.Requested}`}>
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </section>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Request booking">
        {selected && (
          <form onSubmit={submit} className="space-y-4">
            <p className="text-sm text-slate-600">
              <b>{selected.name}</b>
              <br />
              {selected.city} · {selected.distance}
            </p>
            <Field label="Room type">
              <select className={inputCls} value={form.room_type} onChange={(e) => setForm({ ...form, room_type: e.target.value })}>
                {selected.rooms.map((r) => (
                  <option key={r.room_type} value={r.room_type}>
                    {r.room_type} — {money(r.weekly_rent_aud)}/wk
                  </option>
                ))}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Move-in date">
                <input
                  type="date"
                  className={inputCls}
                  value={form.move_in}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setForm({ ...form, move_in: e.target.value })}
                  required
                />
              </Field>
              <Field label="Stay length">
                <select className={inputCls} value={form.weeks} onChange={(e) => setForm({ ...form, weeks: e.target.value })}>
                  {WEEKS.map((w) => (
                    <option key={w} value={w}>
                      {w} weeks
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 flex justify-between items-center">
              <span className="text-sm text-slate-600">Estimated total rent</span>
              <span className="text-xl font-bold text-[#1e1147]">{money(estimate)}</span>
            </div>
            <p className="text-xs text-slate-400">No payment now — your counsellor confirms availability first.</p>
            <Alert>{formError}</Alert>
            <Button type="submit" className="w-full" loading={saving}>
              Send request
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
}
