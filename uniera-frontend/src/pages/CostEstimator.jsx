import { useState, useEffect } from "react";

const API = "http://127.0.0.1:5000";

export default function CostEstimator() {
  const [options, setOptions] = useState({ cities: [], levels: [] });
  const [form, setForm] = useState({
    city: "Sydney",
    level: "Masters",
    duration_years: 2,
    lifestyle: "Moderate",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API}/options`)
      .then((r) => r.json())
      .then(setOptions)
      .catch(() => {});
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const estimate = async () => {
    setError("");
    setLoading(true);
    try {
      const userId = localStorage.getItem("user_id");
      const res = await fetch(`${API}/estimate-cost`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, user_id: userId ? Number(userId) : null }),
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
          <h1 className="text-4xl font-bold mb-2">Cost Estimator</h1>
          <p className="text-purple-200">
            Estimate the full cost of studying in Australia, city by city.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-8 pb-16">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
              <select value={form.city} onChange={set("city")}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3">
                {options.cities.map((c) => (
                  <option key={c.city} value={c.city}>
                    {c.city}, {c.state}{c.is_regional ? " (Regional)" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Study level</label>
              <select value={form.level} onChange={set("level")}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3">
                {options.levels.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Course duration (years)</label>
              <select value={form.duration_years} onChange={set("duration_years")}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3">
                {[1, 1.5, 2, 3, 4].map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Lifestyle</label>
              <select value={form.lifestyle} onChange={set("lifestyle")}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3">
                <option>Budget</option>
                <option>Moderate</option>
                <option>Comfortable</option>
              </select>
            </div>
          </div>

          {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

          <button onClick={estimate} disabled={loading}
                  className="mt-6 w-full bg-gradient-to-r from-[#1e1147] to-[#7c3aed] text-white py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50">
            {loading ? "Calculating..." : "Calculate Estimated Cost"}
          </button>
        </div>

        {result && (
          <div className="mt-8">
            <div className="bg-gradient-to-r from-[#1e1147] to-[#7c3aed] text-white rounded-xl p-8 mb-6">
              <p className="text-purple-200 text-sm mb-1">
                Estimated total for {result.duration_years} years in {result.city}, {result.state}
              </p>
              <p className="text-4xl font-bold mb-2">
                A${result.total_low_aud.toLocaleString()} &ndash; A${result.total_high_aud.toLocaleString()}
              </p>
              <p className="text-purple-200 text-sm">
                Approximately &#8377;{(result.total_low_inr / 100000).toFixed(1)}L &ndash;
                &#8377;{(result.total_high_inr / 100000).toFixed(1)}L
              </p>
              {result.is_regional && (
                <p className="mt-4 text-sm bg-white/15 rounded-lg px-4 py-2 inline-block">
                  Regional location &mdash; eligible for extra post-study work rights and migration points.
                </p>
              )}
            </div>

            <h3 className="font-semibold text-slate-700 mb-3">Cost breakdown</h3>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-6">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                  <tr>
                    <th className="text-left px-6 py-3">Item</th>
                    <th className="text-right px-6 py-3">Low</th>
                    <th className="text-right px-6 py-3">High</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {result.breakdown.map((b) => (
                    <tr key={b.item}>
                      <td className="px-6 py-3 text-slate-700">{b.item}</td>
                      <td className="px-6 py-3 text-right text-slate-600">A${b.low.toLocaleString()}</td>
                      <td className="px-6 py-3 text-right text-slate-600">A${b.high.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-semibold text-[#1e1147]">
                    <td className="px-6 py-3">Total</td>
                    <td className="px-6 py-3 text-right">A${result.total_low_aud.toLocaleString()}</td>
                    <td className="px-6 py-3 text-right">A${result.total_high_aud.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-xs text-slate-400">
              Estimate saved to your account (reference #{result.estimate_id}). Figures are indicative
              averages and vary by course and provider.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
