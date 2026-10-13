// Shortlisted universities & scholarships, with side-by-side comparison.
// GET /shortlist/:uid, POST /shortlist (toggle = remove), GET /compare/universities
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Trash2, Scale, GraduationCap, MapPin, ExternalLink, Award } from "lucide-react";
import { api, currentUser, errMsg, money, fmtDate } from "../../api";
import { Card, Button, Spinner, Alert, Empty, PageTitle, Tabs, inputCls } from "../../components/ui";
import StatusBadge from "../../components/StatusBadge";

const LEVELS = ["Masters", "Bachelors", "PhD"];

// One row of a comparison table: label on the left, one cell per item
function Row({ label, items, render, highlight }) {
  return (
    <tr className="border-t border-slate-100">
      <th className="text-left text-xs font-semibold text-slate-500 bg-slate-50 px-4 py-3 w-44 align-top sticky left-0">
        {label}
      </th>
      {items.map((it, i) => (
        <td key={i} className={`px-4 py-3 text-sm text-slate-700 align-top ${highlight?.(it) ? "bg-emerald-50" : ""}`}>
          {render(it) ?? "—"}
        </td>
      ))}
    </tr>
  );
}

export default function Shortlist() {
  const user = currentUser();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("university");

  // university comparison
  const [selUnis, setSelUnis] = useState([]);
  const [level, setLevel] = useState("Masters");
  const [compare, setCompare] = useState(null);
  const [comparing, setComparing] = useState(false);
  const [compareError, setCompareError] = useState("");

  // scholarship comparison
  const [selSchols, setSelSchols] = useState([]);

  const [version, setVersion] = useState(0); // bump to reload the shortlist

  useEffect(() => {
    api
      .get(`/shortlist/${user.id}`)
      .then((r) => setData(r.data))
      .catch((e) => setError(errMsg(e, "Could not load your shortlist")));
  }, [user.id, version]);

  // Remove = toggle the item off in the shortlist
  const remove = async (itemType, itemId) => {
    try {
      await api.post("/shortlist", { user_id: user.id, item_type: itemType, item_id: itemId });
      if (itemType === "university") {
        setSelUnis((s) => s.filter((x) => x !== itemId));
        setCompare(null);
      } else {
        setSelSchols((s) => s.filter((x) => x !== itemId));
      }
      setVersion((v) => v + 1);
    } catch (e) {
      setError(errMsg(e, "Could not remove item"));
    }
  };

  const toggleUni = (id) => {
    setCompare(null);
    setSelUnis((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length < 4 ? [...s, id] : s));
  };
  const toggleSchol = (id) => setSelSchols((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const runCompare = async (lvl = level) => {
    setComparing(true);
    setCompareError("");
    try {
      const r = await api.get("/compare/universities", {
        params: { ids: selUnis.join(","), user_id: user.id, level: lvl },
      });
      setCompare(r.data);
    } catch (e) {
      setCompareError(errMsg(e, "Could not compare these universities"));
    }
    setComparing(false);
  };

  const changeLevel = (lvl) => {
    setLevel(lvl);
    if (compare) runCompare(lvl);
  };

  if (error && !data) return <Alert>{error}</Alert>;
  if (!data) return <Spinner label="Loading your shortlist..." />;

  const unis = data.universities || [];
  const schols = data.scholarships || [];

  // cheapest first-year cost among compared universities (only those with fee data for this level)
  const compared = compare?.universities || [];
  const costs = compared.filter((u) => u.fee_min).map((u) => u.first_year_cost?.total || Infinity);
  const cheapest = costs.length ? Math.min(...costs) : null;
  const isCheapest = (u) => u.fee_min && u.first_year_cost?.total === cheapest;

  const selectedSchols = schols.filter((s) => selSchols.includes(s.scholarship_id));

  return (
    <div>
      <PageTitle title="Shortlist & compare" subtitle="Save universities and scholarships, then compare them side by side." />
      <Alert className="mb-4">{error}</Alert>

      <div className="mb-5">
        <Tabs
          tabs={[
            { value: "university", label: `Universities (${unis.length})` },
            { value: "scholarship", label: `Scholarships (${schols.length})` },
          ]}
          value={tab}
          onChange={setTab}
        />
      </div>

      {/* ======================= universities ======================= */}
      {tab === "university" &&
        (unis.length === 0 ? (
          <Card>
            <Empty
              icon={Heart}
              title="No universities shortlisted"
              text="Tap the heart on any university to save it here and compare."
              action={<Button onClick={() => navigate("/portal/universities")}>Browse universities</Button>}
            />
          </Card>
        ) : (
          <div className="space-y-5">
            <Card className="p-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-600">
                Select <b>2–4</b> universities to compare · <b>{selUnis.length}</b> selected
              </p>
              <div className="flex items-center gap-2">
                <select className={`${inputCls} w-36`} value={level} onChange={(e) => changeLevel(e.target.value)}>
                  {LEVELS.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
                <Button disabled={selUnis.length < 2} loading={comparing} onClick={() => runCompare()}>
                  <Scale size={16} /> Compare
                </Button>
              </div>
            </Card>

            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {unis.map((u) => {
                const checked = selUnis.includes(u.university_id);
                return (
                  <Card key={u.university_id} className={`p-5 flex flex-col ${checked ? "border-[#7c3aed] ring-2 ring-violet-100" : ""}`}>
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        className="mt-1 w-4 h-4 accent-[#7c3aed]"
                        checked={checked}
                        disabled={!checked && selUnis.length >= 4}
                        onChange={() => toggleUni(u.university_id)}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-[#1e1147]">{u.name}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin size={12} /> {u.city}, {u.state} · {u.uni_tier}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-slate-600 mt-3 space-y-1">
                      {u.known_for && <p><span className="text-slate-400">Known for:</span> {u.known_for}</p>}
                      {u.intakes && <p><span className="text-slate-400">Intakes:</span> {u.intakes}</p>}
                      <p>
                        <span className="text-slate-400">Fees from:</span> {u.min_fee ? `${money(u.min_fee)}/yr` : "—"} ·{" "}
                        <span className="text-slate-400">Scholarships:</span> {u.scholarship_count}
                      </p>
                    </div>
                    <div className="flex gap-2 mt-auto pt-4">
                      <Link to={`/portal/universities/${u.university_id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">View</Button>
                      </Link>
                      <Link to={`/portal/apply/${u.university_id}`} className="flex-1">
                        <Button size="sm" className="w-full">Apply</Button>
                      </Link>
                      <Button variant="ghost" size="sm" title="Remove" onClick={() => remove("university", u.university_id)}>
                        <Trash2 size={15} className="text-red-500" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>

            <Alert className="mb-2">{compareError}</Alert>

            {compare && compared.length > 0 && (
              <Card className="overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-bold text-[#1e1147]">Comparison · {compare.level}</h2>
                  <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                    Green = lowest first-year cost
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px]">
                    <thead>
                      <tr>
                        <th className="bg-slate-50 sticky left-0" />
                        {compared.map((u) => (
                          <th key={u.university_id} className="px-4 py-4 text-left align-top">
                            <p className="font-bold text-[#1e1147]">{u.name}</p>
                            <div className="flex gap-2 mt-2">
                              <Link to={`/portal/universities/${u.university_id}`}>
                                <Button variant="outline" size="sm">View</Button>
                              </Link>
                              <Link to={`/portal/apply/${u.university_id}`}>
                                <Button size="sm">Apply</Button>
                              </Link>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <Row label="Tier" items={compared} render={(u) => u.uni_tier} />
                      <Row label="City / State" items={compared} render={(u) => `${u.city}, ${u.state}`} />
                      <Row label="Type" items={compared} render={(u) => u.uni_type} />
                      <Row label="Established" items={compared} render={(u) => u.established} />
                      <Row label="Intakes" items={compared} render={(u) => u.intakes} />
                      <Row label="Known for" items={compared} render={(u) => u.known_for} />
                      <Row
                        label={`Tuition / yr (${compare.level})`}
                        items={compared}
                        render={(u) => (u.fee_min ? `${money(u.fee_min)} – ${money(u.fee_max)}` : "No courses at this level")}
                      />
                      <Row
                        label="First-year total cost"
                        items={compared}
                        highlight={isCheapest}
                        render={(u) =>
                          u.fee_min ? (
                            <div>
                              <p className="font-bold text-[#1e1147]">{money(u.first_year_cost.total)}</p>
                              <p className="text-[11px] text-slate-500">
                                Tuition {money(u.first_year_cost.tuition)} + living {money(u.first_year_cost.living)} + OSHC{" "}
                                {money(u.first_year_cost.oshc)} + one-time {money(u.first_year_cost.one_time)}
                              </p>
                            </div>
                          ) : null
                        }
                      />
                      <Row label="Courses at this level" items={compared} render={(u) => u.courses} />
                      <Row
                        label="Scholarships"
                        items={compared}
                        render={(u) => (u.scholarships ? `${u.scholarships} (top ${money(u.top_scholarship)})` : "0")}
                      />
                      <Row
                        label="Entry criteria"
                        items={compared}
                        render={(u) =>
                          u.criteria ? (
                            <div className="space-y-0.5">
                              <p>Min {u.criteria.min_percentage}% academic</p>
                              <p>IELTS {u.criteria.min_ielts}+</p>
                              <p>Funds {money(u.criteria.min_funds_aud)}</p>
                            </div>
                          ) : null
                        }
                      />
                      <Row
                        label="Your eligibility"
                        items={compared}
                        render={(u) => (u.your_eligibility ? <StatusBadge status={u.your_eligibility} /> : "Complete your profile")}
                      />
                      <Row label="Required documents" items={compared} render={(u) => `${u.docs_required} documents`} />
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        ))}

      {/* ======================= scholarships ======================= */}
      {tab === "scholarship" &&
        (schols.length === 0 ? (
          <Card>
            <Empty
              icon={Award}
              title="No scholarships shortlisted"
              text="Save scholarships you are interested in and compare them here."
              action={<Button onClick={() => navigate("/portal/scholarships")}>Browse scholarships</Button>}
            />
          </Card>
        ) : (
          <div className="space-y-5">
            <p className="text-sm text-slate-600">Tick two or more scholarships to compare them.</p>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {schols.map((s) => {
                const checked = selSchols.includes(s.scholarship_id);
                return (
                  <Card key={s.scholarship_id} className={`p-5 flex flex-col ${checked ? "border-[#7c3aed] ring-2 ring-violet-100" : ""}`}>
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        className="mt-1 w-4 h-4 accent-[#7c3aed]"
                        checked={checked}
                        onChange={() => toggleSchol(s.scholarship_id)}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-[#1e1147]">{s.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                          <GraduationCap size={12} /> {s.university}
                        </p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-emerald-600 mt-3">
                      {s.amount_aud ? money(s.amount_aud) : s.coverage}
                    </p>
                    <p className="text-xs text-slate-500">
                      {s.level} · {s.field}
                    </p>
                    <div className="flex gap-2 mt-auto pt-4">
                      {s.apply_link && (
                        <a href={s.apply_link} target="_blank" rel="noreferrer" className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            Official page <ExternalLink size={12} />
                          </Button>
                        </a>
                      )}
                      <Button variant="ghost" size="sm" title="Remove" onClick={() => remove("scholarship", s.scholarship_id)}>
                        <Trash2 size={15} className="text-red-500" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>

            {selectedSchols.length >= 2 && (
              <Card className="overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100">
                  <h2 className="font-bold text-[#1e1147]">Scholarship comparison</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px]">
                    <thead>
                      <tr>
                        <th className="bg-slate-50 sticky left-0" />
                        {selectedSchols.map((s) => (
                          <th key={s.scholarship_id} className="px-4 py-4 text-left font-bold text-[#1e1147] align-top">
                            {s.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <Row label="Amount" items={selectedSchols} render={(s) => (s.amount_aud ? money(s.amount_aud) : "—")} />
                      <Row label="Coverage" items={selectedSchols} render={(s) => s.coverage} />
                      <Row label="Level" items={selectedSchols} render={(s) => s.level} />
                      <Row label="Field" items={selectedSchols} render={(s) => s.field} />
                      <Row label="Min academic %" items={selectedSchols} render={(s) => (s.min_percentage ? `${s.min_percentage}%` : null)} />
                      <Row label="Min IELTS" items={selectedSchols} render={(s) => s.min_ielts} />
                      <Row label="Deadline" items={selectedSchols} render={(s) => (s.deadline ? fmtDate(s.deadline) : null)} />
                      <Row label="University" items={selectedSchols} render={(s) => s.university} />
                      <Row
                        label="Apply"
                        items={selectedSchols}
                        render={(s) =>
                          s.apply_link ? (
                            <a href={s.apply_link} target="_blank" rel="noreferrer" className="text-[#7c3aed] hover:underline inline-flex items-center gap-1">
                              Official page <ExternalLink size={12} />
                            </a>
                          ) : null
                        }
                      />
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        ))}
    </div>
  );
}
