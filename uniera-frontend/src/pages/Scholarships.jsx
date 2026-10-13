// Scholarship finder.
//   /scholarships         (public)  -> purple header + "enrol to shortlist" banner
//   /portal/scholarships  (portal)  -> PageTitle + shortlist hearts
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Lock, Award } from "lucide-react";
import { api, currentUser, errMsg } from "../api";
import { Card, Spinner, Alert, Empty, PageTitle } from "../components/ui";

export default function Scholarships({ portal }) {
  const user = currentUser();
  const [options, setOptions] = useState({ cities: [], levels: [], fields: [], tiers: [] });
  const [filters, setFilters] = useState({ level: "All", field: "All", tier: "All", city: "All" });
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [shortlisted, setShortlisted] = useState([]); // scholarship ids (portal only)
  const [notice, setNotice] = useState("");

  useEffect(() => {
    api.get("/options").then((r) => setOptions(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!portal || !user) return;
    api
      .get(`/shortlist/${user.id}`)
      .then((r) => setShortlisted(r.data.ids?.scholarship || []))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portal]);

  useEffect(() => {
    api
      .get("/scholarships", { params: filters })
      .then((r) => {
        setScholarships(r.data.scholarships || []);
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

  const toggleShortlist = async (id) => {
    try {
      const r = await api.post("/shortlist", { user_id: user.id, item_type: "scholarship", item_id: id });
      setShortlisted((ids) => (r.data.added ? [...ids, id] : ids.filter((x) => x !== id)));
      setNotice(r.data.message);
      setTimeout(() => setNotice(""), 2000);
    } catch (e) {
      setNotice(errMsg(e));
    }
  };

  const totalValue = scholarships.reduce((s, x) => s + Number(x.amount_aud || 0), 0);

  const filterBox = (
    <div className={`bg-white rounded-xl p-6 grid grid-cols-1 md:grid-cols-4 gap-4 ${portal ? "border border-slate-200 shadow-sm" : "shadow-lg"}`}>
      <FilterSelect label="STUDY LEVEL" value={filters.level} onChange={set("level")} items={options.levels} />
      <FilterSelect label="FIELD" value={filters.field} onChange={set("field")} items={options.fields} />
      <FilterSelect label="UNIVERSITY TIER" value={filters.tier} onChange={set("tier")} items={options.tiers} />
      <FilterSelect label="CITY" value={filters.city} onChange={set("city")} items={(options.cities || []).map((c) => c.city)} />
    </div>
  );

  const results = (
    <>
      <div className="flex flex-wrap gap-6 py-6 text-sm text-slate-600">
        <span><strong className="text-[#1e1147] text-lg">{scholarships.length}</strong> scholarships found</span>
        <span><strong className="text-[#1e1147] text-lg">A${totalValue.toLocaleString()}</strong> total value</span>
        {portal && (
          <Link to="/portal/shortlist" className="text-[#7c3aed] hover:underline">
            {shortlisted.length} shortlisted →
          </Link>
        )}
      </div>

      {notice && <Alert type="info" className="mb-4">{notice}</Alert>}

      {loading ? (
        <Spinner label="Loading scholarships..." />
      ) : error ? (
        <Alert className="mb-12">{error}</Alert>
      ) : scholarships.length === 0 ? (
        <Card className="mb-12">
          <Empty icon={Award} title="No scholarships match these filters" text="Try widening your search." />
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pb-16">
          {scholarships.map((s) => {
            const saved = shortlisted.includes(s.scholarship_id);
            return (
              <div key={s.scholarship_id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6 border border-slate-100">
                <div className="flex justify-between items-start gap-4 mb-3">
                  <h3 className="font-bold text-lg text-[#1e1147] leading-snug">{s.name}</h3>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      s.coverage === "Full" ? "bg-green-100 text-green-700" : "bg-purple-100 text-purple-700"
                    }`}>{s.coverage}</span>
                    {portal && (
                      <button
                        onClick={() => toggleShortlist(s.scholarship_id)}
                        title={saved ? "Remove from shortlist" : "Add to shortlist"}
                        className={`p-1.5 rounded-full hover:bg-rose-50 ${saved ? "text-rose-500" : "text-slate-300 hover:text-rose-400"}`}
                      >
                        <Heart size={20} className={saved ? "fill-rose-500" : ""} />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-sm text-slate-500 mb-1">{s.university}</p>
                <p className="text-xs text-slate-400 mb-4">{s.city} &middot; {s.uni_tier}</p>

                <p className="text-2xl font-bold text-[#7c3aed] mb-4">
                  A${Number(s.amount_aud).toLocaleString()}
                </p>

                <p className="text-sm text-slate-600 mb-4">{s.description}</p>

                <div className="flex flex-wrap gap-2 mb-4 text-xs">
                  <span className="bg-slate-100 px-2 py-1 rounded">{s.level}</span>
                  <span className="bg-slate-100 px-2 py-1 rounded">{s.field}</span>
                  <span className="bg-slate-100 px-2 py-1 rounded">Min {s.min_percentage}%</span>
                  <span className="bg-slate-100 px-2 py-1 rounded">IELTS {s.min_ielts}</span>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <span className="text-xs text-slate-500">Deadline: <strong>{s.deadline}</strong></span>
                  <a href={s.apply_link} target="_blank" rel="noreferrer"
                     className="text-sm font-medium text-[#7c3aed] hover:underline">
                    Official page &rarr;
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );

  // ---------- portal version ----------
  if (portal) {
    return (
      <div>
        <PageTitle
          title="Scholarships"
          subtitle="Shortlist scholarships you are interested in — your counsellor will help you apply."
        />
        {filterBox}
        {results}
      </div>
    );
  }

  // ---------- public version ----------
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-[#1e1147] to-[#7c3aed] text-white py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Scholarships in Australia</h1>
          <p className="text-purple-200">
            Browse funding opportunities across 39 Australian universities and national government programs.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8">
        {filterBox}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 bg-violet-50 border border-violet-200 rounded-xl px-5 py-3 text-sm text-violet-900">
          <span className="flex items-center gap-2">
            <Lock size={16} className="text-[#7c3aed]" />
            Enroll with UniEra to shortlist and apply for scholarships.
          </span>
          <Link to="/enroll" className="font-semibold text-[#7c3aed] hover:underline">
            Enroll now &rarr;
          </Link>
        </div>

        {results}
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, items = [] }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1">{label}</label>
      <select value={value} onChange={onChange} className="w-full border border-slate-300 rounded-lg px-3 py-2">
        <option>All</option>
        {items.map((x) => <option key={x}>{x}</option>)}
      </select>
    </div>
  );
}
