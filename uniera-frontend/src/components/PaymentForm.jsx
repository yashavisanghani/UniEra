// Demo payment gateway: UPI / Card / Net banking. No real money moves —
// the backend validates the details and records a successful transaction.
import { useState } from "react";
import { CreditCard, Smartphone, Landmark, ShieldCheck, Lock } from "lucide-react";
import { Button, Field, Alert, inputCls } from "./ui";
import { inr } from "../api";

const BANKS = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra Bank", "Bank of Baroda"];

export default function PaymentForm({ amount, breakdown = [], onPay, payLabel = "Pay" }) {
  const [method, setMethod] = useState("UPI");
  const [d, setD] = useState({ upi_id: "", card_number: "", card_name: "", expiry: "", cvv: "", bank: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const set = (k) => (e) => setD({ ...d, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // small delay so it feels like a real gateway
      await new Promise((r) => setTimeout(r, 1200));
      await onPay({ method, ...d });
    } catch (err) {
      setError(err?.message || "Payment failed");
    }
    setLoading(false);
  };

  const methods = [
    { id: "UPI", label: "UPI", icon: Smartphone },
    { id: "Card", label: "Card", icon: CreditCard },
    { id: "NetBanking", label: "Net banking", icon: Landmark },
  ];

  return (
    <form onSubmit={submit} className="space-y-5">
      {breakdown.length > 0 && (
        <div className="bg-slate-50 rounded-xl p-4 text-sm space-y-1.5">
          {breakdown.map(([k, v]) => (
            <div key={k} className="flex justify-between text-slate-600">
              <span>{k}</span>
              <span>{inr(v)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-[#1e1147] pt-2 border-t border-slate-200">
            <span>Total payable</span>
            <span>{inr(amount)}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        {methods.map((m) => (
          <button
            type="button"
            key={m.id}
            onClick={() => setMethod(m.id)}
            className={`flex flex-col items-center gap-1 py-3 rounded-xl border text-sm font-medium transition ${
              method === m.id ? "border-[#7c3aed] bg-violet-50 text-[#7c3aed]" : "border-slate-200 text-slate-600"
            }`}
          >
            <m.icon size={20} />
            {m.label}
          </button>
        ))}
      </div>

      {method === "UPI" && (
        <Field label="UPI ID" hint="e.g. yourname@okaxis, 98xxxxxx@paytm">
          <input className={inputCls} value={d.upi_id} onChange={set("upi_id")} placeholder="name@bank" required />
        </Field>
      )}
      {method === "Card" && (
        <div className="grid grid-cols-2 gap-3">
          <Field label="Card number" className="col-span-2">
            <input
              className={inputCls}
              value={d.card_number}
              onChange={(e) =>
                setD({ ...d, card_number: e.target.value.replace(/[^\d]/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim() })
              }
              placeholder="4111 1111 1111 1111"
              required
            />
          </Field>
          <Field label="Name on card" className="col-span-2">
            <input className={inputCls} value={d.card_name} onChange={set("card_name")} required />
          </Field>
          <Field label="Expiry (MM/YY)">
            <input className={inputCls} value={d.expiry} onChange={set("expiry")} placeholder="12/28" required />
          </Field>
          <Field label="CVV">
            <input className={inputCls} type="password" maxLength={4} value={d.cvv} onChange={set("cvv")} required />
          </Field>
        </div>
      )}
      {method === "NetBanking" && (
        <Field label="Choose your bank">
          <select className={inputCls} value={d.bank} onChange={set("bank")} required>
            <option value="">Select bank</option>
            {BANKS.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </Field>
      )}

      <Alert>{error}</Alert>

      <Button type="submit" size="lg" className="w-full" loading={loading}>
        <Lock size={16} /> {loading ? "Processing payment..." : `${payLabel} ${inr(amount)}`}
      </Button>
      <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
        <ShieldCheck size={14} /> Secure demo gateway — no real money is charged
      </p>
    </form>
  );
}
