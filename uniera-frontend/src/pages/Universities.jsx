// University explorer. Used in two places:
//   /universities          (public website)  -> purple PageHeader
//   /portal/universities   (student portal)  -> PageTitle + shortlist hearts
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Heart, BookOpen, Award, CalendarDays, Building2, GitCompare, X } from "lucide-react";
import { api, currentUser, errMsg, money } from "../api";
import { Card, Spinner, Alert, Empty, PageTitle, inputCls } from "../components/ui";
import { PageHeader } from "../components/Layout";

const TIER_STYLE = {
  "Group of Eight": "bg-violet-100 text-violet-700",
  "Mid-tier": "bg-sky-100 text-sky-700",
  Regional: "bg-emerald-100 text-emerald-700",
};

const EMPTY_FILTERS = { search: "", state: "All", tier: "All", city: "All", field: "All" };

export default function Universities({ portal }) {
  const user = currentUser();
  const [options, setOptions] = useState({ states: [], tiers: [], cities: [], fields: [] });
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [search, setSearch] = useState(""); // text box value (applied after a short pause)
  const [unis, setUnis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [shortlisted, setShortlisted] = useState([]); // university ids in the student's shortlist
  const [notice, setNotice] = useState("");

  // dropdown options
  useEffect(() => {
    api.get("/universities/filters").then((r) => setOptions(r.data)).catch(() => {});
  }, []);

  // shortlist (portal only)
  useEffect(() => {
    if (!portal || !user) return;
    api
      .get(`/shortlist/${user.id}`)
      .then((r) => setShortlisted(r.data.ids?.university || []))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portal]);

  // wait 350 ms after typing before searching
  useEffect(() => {
    if (search === filters.search) return;
    const t = setTimeout(() => {
      setLoading(true);
      setFilters((f) => ({ ...f, search }));
    }, 350);
    return () => clearTimeout(t);
  }, [search, filters.search]);

  // load universities whenever filters change
  useEffect(() => {
    api
      .get("/universities", { params: filters })
      .then((r) => {
        setUnis(r.data.universities || []);
        setError("");
      })
      .catch((e) => setError(errMsg(e)))
      .finally(() => setLoading(false));
  }, [filters]);

  // changing a filter shows the spinner; the effect above then reloads the list
  const set = (k) => (e) => {
    setLoading(true);
    setFilters({ ...filters, [k]: e.target.value });
  };
  const clearAll = () => {
    setLoading(true);
    setSearch("");
    setFilters(EMPTY_FILTERS);
  };
  const hasFilters = search || ["state", "tier", "city", "field"].some((k) => filters[k] !== "All");

  const toggleShortlist = async (id) => {
    try {
      const r = await api.post("/shortlist", { user_id: user.id, item_type: "university", item_id: id });
      setShortlisted((ids) => (r.data.added ? [...ids, id] : ids.filter((x) => x !== id)));
      setNotice(r.data.message);
      setTimeout(() => setNotice(""), 2000);
    } catch (e) {
      setNotice(errMsg(e));
    }
  };

  const base = portal ? "/portal" : "";

  const content = (
    <>
      {/* ---------- filters ---------- */}
      <Card className={`p-5 ${portal ? "" : "shadow-lg"}`}>
        <div className="relative mb-4">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className={`${inputCls} pl-10`}
            placeholder="Search by university name, city or specialisation (e.g. Data Science)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Select label="State" value={filters.state} onChange={set("state")} items={options.states} />
          <Select label="Tier" value={filters.tier} onChange={set("tier")} items={options.tiers} />
          <Select label="City" value={filters.city} onChange={set("city")} items={options.cities} />
          <Select label="Field of study" value={filters.field} onChange={set("field")} items={options.fields} />
        </div>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3 py-5">
        <p className="text-sm text-slate-600">
          <strong className="text-[#1e1147] text-lg">{loading ? "…" : unis.length}</strong> universities found
          {hasFilters && (
            <button onClick={clearAll} className="ml-3 inline-flex items-center gap-1 text-[#7c3aed] hover:underline">
              <X size={14} /> Clear filters
            </button>
          )}
        </p>
        {portal && (
          <Link
            to="/portal/shortlist"
            className="inline-flex items-center gap-2 text-sm bg-violet-50 text-[#7c3aed] px-3 py-2 rounded-lg hover:bg-violet-100"
          >
            <GitCompare size={16} /> {shortlisted.length} shortlisted — tap ♥ to add, then compare in Shortlist
          </Link>
        )}
      </div>

      {notice && <Alert type="info" className="mb-4">{notice}</Alert>}

      {/* ---------- results ---------- */}
      {loading ? (
        <Spinner label="Loading universities..." />
      ) : error ? (
        <Alert>{error}</Alert>
      ) : unis.length === 0 ? (
        <Card>
          <Empty icon={Building2} title="No universities match" text="Try removing a filter or searching for something else." />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pb-16">
          {unis.map((u) => (
            <UniCard
              key={u.university_id}
              u={u}
              to={`${base}/universities/${u.university_id}`}
              portal={portal}
              saved={shortlisted.includes(u.university_id)}
              onToggle={() => toggleShortlist(u.university_id)}
            />
          ))}
        </div>
      )}
    </>
  );

  if (portal) {
    return (
      <div>
        <PageTitle
          title="Explore universities"
          subtitle="Search Australian universities, shortlist the ones you like and apply through UniEra."
        />
        {content}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader
        title="Australian universities"
        subtitle="Compare every university by location, tier, fees, courses and scholarships."
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8">{content}</div>
    </div>
  );
}

function Select({ label, value, onChange, items = [] }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">{label}</span>
      <select className={inputCls} value={value} onChange={onChange}>
        <option value="All">All</option>
        {items.map((x) => (
          <option key={x}>{x}</option>
        ))}
      </select>
    </label>
  );
}

function UniCard({ u, to, portal, saved, onToggle }) {
  return (
    <Card className="p-5 flex flex-col hover:shadow-md hover:border-violet-200 transition">
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${TIER_STYLE[u.uni_tier] || "bg-slate-100 text-slate-600"}`}>
          {u.uni_tier}
        </span>
        {portal && (
          <button
            onClick={onToggle}
            title={saved ? "Remove from shortlist" : "Add to shortlist"}
            className={`p-2 -m-2 rounded-full hover:bg-rose-50 ${saved ? "text-rose-500" : "text-slate-300 hover:text-rose-400"}`}
          >
            <Heart size={20} className={saved ? "fill-rose-500" : ""} />
          </button>
        )}
      </div>

      <Link to={to} className="font-bold text-lg text-[#1e1147] leading-snug hover:text-[#7c3aed]">
        {u.name}
      </Link>
      <p className="flex items-center gap-1 text-sm text-slate-500 mt-1">
        <MapPin size={14} /> {u.city}, {u.state}
        {u.established && <span className="text-slate-400"> · Est. {u.established}</span>}
      </p>

      {u.known_for && <p className="text-sm text-slate-600 mt-3 line-clamp-2">Known for: {u.known_for}</p>}

      <div className="grid grid-cols-3 gap-2 my-4 text-center">
        <div className="bg-slate-50 rounded-lg py-2">
          <p className="text-sm font-bold text-[#1e1147]">{u.min_fee ? money(u.min_fee) : "—"}</p>
          <p className="text-[10px] text-slate-500">from / year</p>
        </div>
        <div className="bg-slate-50 rounded-lg py-2">
          <p className="text-sm font-bold text-[#1e1147] flex items-center justify-center gap-1">
            <BookOpen size={13} /> {u.course_count}
          </p>
          <p className="text-[10px] text-slate-500">courses</p>
        </div>
        <div className="bg-slate-50 rounded-lg py-2">
          <p className="text-sm font-bold text-[#1e1147] flex items-center justify-center gap-1">
            <Award size={13} /> {u.scholarship_count}
          </p>
          <p className="text-[10px] text-slate-500">scholarships</p>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
        <span className="flex items-center gap-1 text-xs text-slate-500 min-w-0">
          <CalendarDays size={14} className="shrink-0" />
          <span className="truncate">{u.intakes || "Intakes vary"}</span>
        </span>
        <Link to={to} className="text-sm font-medium text-[#7c3aed] hover:underline shrink-0">
          View details →
        </Link>
      </div>
    </Card>
  );
}
