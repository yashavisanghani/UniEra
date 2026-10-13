import { useState, useEffect } from "react";

const API = "http://127.0.0.1:5000";

export default function EligibilityChecker() {
  const [levels, setLevels] = useState([]);
  const [form, setForm] = useState({ percentage: "", ielts: "", budget_aud: "", level: "Masters" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API}/options`)
      .then((r) => r.json())
      .then((d) => setLevels(d.levels || []))
      .catch(() => {});
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const check = async () => {
    setError("");
    if (!form.percentage || !form.ielts || !form.budget_aud) {
      setError("Please fill in all four fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/check-eligibility`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Something went wrong.");
      else setResult(data);
    } catch {
      setError("Could not reach the server. Is the backend running?");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-[#1e1147] to-[#7c3aed] text-white py-14 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Eligibility Checker</h1>
          <p className="text-purple-200">
            See which tier of Australian universities you currently qualify for.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-8 pb-16">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Study level</label>
              <select value={form.level} onChange={set("level")}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3">
                {levels.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Academic percentage</label>
              <input type="number" value={form.percentage} onChange={set("percentage")}
                     placeholder="e.g. 72" min="0" max="100"
                     className="w-full border border-slate-300 rounded-lg px-4 py-3" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">IELTS overall band</label>
              <input type="number" step="0.5" value={form.ielts} onChange={set("ielts")}
                     placeholder="e.g. 6.5" min="0" max="9"
                     className="w-full border border-slate-300 rounded-lg px-4 py-3" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Available funds (AUD)</label>
              <input type="number" value={form.budget_aud} onChange={set("budget_aud")}
                     placeholder="e.g. 70000"
                     className="w-full border border-slate-300 rounded-lg px-4 py-3" />
            </div>
          </div>

          {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

          <button onClick={check} disabled={loading}
                  className="mt-6 w-full bg-gradient-to-r from-[#1e1147] to-[#7c3aed] text-white py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50">
            {loading ? "Checking..." : "Check My Eligibility"}
          </button>
        </div>

        {result && (
          <div className="mt-8">
            <div className={`rounded-xl p-6 mb-6 ${
              result.eligible_anywhere ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"
            }`}>
              <h2 className="text-xl font-bold mb-1 text-slate-800">
                {result.eligible_anywhere
                  ? `You qualify for ${result.qualified_tiers.join(" and ")} universities`
                  : "You don't yet meet the minimum for any tier"}
              </h2>
              <p className="text-sm text-slate-600">
                {result.eligible_anywhere
                  ? `${result.matching_universities.length} universities and ${result.matching_scholarship_count} scholarships match your profile.`
                  : "Improving your IELTS band or academic percentage will open up the Regional tier first."}
              </p>
            </div>

            <h3 className="font-semibold text-slate-700 mb-3">Requirement breakdown</h3>
            <div className="space-y-3 mb-8">
              {result.breakdown.map((b) => (
                <div key={b.uni_tier} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-[#1e1147]">{b.uni_tier}</h4>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      b.eligible ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                    }`}>{b.eligible ? "Eligible" : "Not eligible"}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm mb-3">
                    {Object.entries(b.checks).map(([label, passed]) => (
                      <div key={label} className="flex items-center gap-2">
                        <span className={passed ? "text-green-600" : "text-red-500"}>
                          {passed ? "\u2713" : "\u2717"}
                        </span>
                        <span className="text-slate-600">{label}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">
                    Requires {b.required.percentage}% &middot; IELTS {b.required.ielts} &middot;
                    A${b.required.funds_aud.toLocaleString()} funds
                  </p>
                  <p className="text-xs text-slate-400 mt-2 italic">{b.notes}</p>
                </div>
              ))}
            </div>

            {result.matching_universities.length > 0 && (
              <>
                <h3 className="font-semibold text-slate-700 mb-3">
                  Universities you can apply to ({result.matching_universities.length})
                </h3>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 divide-y divide-slate-100">
                  {result.matching_universities.map((u) => (
                    <div key={u.name} className="flex justify-between items-center px-5 py-3">
                      <div>
                        <p className="font-medium text-slate-800 text-sm">{u.name}</p>
                        <p className="text-xs text-slate-500">{u.city}, {u.state}</p>
                      </div>
                      <span className="text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-full">
                        {u.uni_tier}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
