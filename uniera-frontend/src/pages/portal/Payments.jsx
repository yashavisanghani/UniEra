// All payments made to UniEra + printable receipts.
// GET /payments/:uid → { payments, user }
import { useEffect, useState } from "react";
import { CreditCard, Receipt, Printer, Wallet, Sparkles } from "lucide-react";
import { api, currentUser, errMsg, fmtDate, inr } from "../../api";
import { Card, Button, Spinner, Alert, Empty, PageTitle, StatCard, Modal } from "../../components/ui";

// Enrollment fees are charged as package price + 18% GST, so the amount already includes GST.
function splitGst(p) {
  if (p.purpose !== "Enrollment") return null;
  const base = Math.round(p.amount_inr / 1.18);
  return { base, gst: p.amount_inr - base };
}

// Only the invoice is printed: everything else is hidden while printing.
const PRINT_CSS = `
@media print {
  body * { visibility: hidden !important; }
  #invoice, #invoice * { visibility: visible !important; }
  #invoice { position: fixed; left: 0; top: 0; width: 100%; padding: 32px; }
}`;

function Invoice({ p, user }) {
  const gst = splitGst(p);
  return (
    <div id="invoice" className="bg-white text-slate-800">
      <style>{PRINT_CSS}</style>
      {/* letterhead */}
      <div className="flex items-start justify-between border-b-2 border-[#1e1147] pb-4">
        <div className="flex items-center gap-3">
          <img src="/uniera-logo.jpeg" alt="" className="w-12 h-12 rounded-full" />
          <div>
            <p className="text-xl font-bold text-[#1e1147] leading-none">UNIERA</p>
            <p className="text-xs text-slate-500 mt-1">Study-abroad consultancy · Australia</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-[#7c3aed]">TAX INVOICE / RECEIPT</p>
          <p className="text-xs text-slate-500 mt-1">{p.invoice_no}</p>
          <p className="text-xs text-slate-500">{fmtDate(p.created_at, true)}</p>
        </div>
      </div>

      {/* billed to */}
      <div className="grid grid-cols-2 gap-4 py-4 text-sm">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase">Billed to</p>
          <p className="font-medium">{user?.name}</p>
          <p className="text-slate-500">{user?.email}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold text-slate-500 uppercase">Payment</p>
          <p>{p.method} · {p.method_detail}</p>
          <p className="text-slate-500">Status: {p.status}</p>
        </div>
      </div>

      {/* line items */}
      <table className="w-full text-sm border border-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="text-left px-3 py-2">Description</th>
            <th className="text-right px-3 py-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-slate-200">
            <td className="px-3 py-2">
              {p.purpose === "Enrollment" ? `UniEra ${p.package} package – consultancy fee` : `${p.purpose}${p.package ? ` – ${p.package}` : ""}`}
            </td>
            <td className="px-3 py-2 text-right">{inr(gst ? gst.base : p.amount_inr)}</td>
          </tr>
          {gst && (
            <tr className="border-t border-slate-200">
              <td className="px-3 py-2">GST @ 18%</td>
              <td className="px-3 py-2 text-right">{inr(gst.gst)}</td>
            </tr>
          )}
          <tr className="border-t-2 border-slate-300 font-bold">
            <td className="px-3 py-2">Total paid</td>
            <td className="px-3 py-2 text-right text-[#1e1147]">{inr(p.amount_inr)}</td>
          </tr>
        </tbody>
      </table>

      <p className="text-xs text-slate-500 mt-4">Transaction reference: <span className="font-mono">{p.txn_ref}</span></p>
      <p className="text-[11px] text-slate-400 mt-1">
        This is a computer-generated receipt from the UniEra demo payment gateway and does not require a signature.
      </p>
    </div>
  );
}

export default function Payments() {
  const user = currentUser();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    api
      .get(`/payments/${user.id}`)
      .then((r) => setData(r.data))
      .catch((e) => setError(errMsg(e, "Could not load your payments")));
  }, [user.id]);

  if (error) return <Alert>{error}</Alert>;
  if (!data) return <Spinner label="Loading payments..." />;

  const payments = data.payments || [];
  const successful = payments.filter((p) => p.status === "Success");
  const totalPaid = successful.reduce((sum, p) => sum + Number(p.amount_inr || 0), 0);
  const activePackage = successful.find((p) => p.purpose === "Enrollment")?.package || "—";

  return (
    <div>
      <PageTitle title="Payments" subtitle="Every payment you have made to UniEra, with downloadable receipts." />

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={Wallet} label="Total paid" value={inr(totalPaid)} tone="green" />
        <StatCard icon={Sparkles} label="Active package" value={activePackage} />
        <StatCard icon={Receipt} label="Transactions" value={payments.length} tone="blue" />
      </div>

      <Card className="overflow-hidden">
        {payments.length === 0 ? (
          <Empty icon={CreditCard} title="No payments yet" text="Your enrolment and service payments will appear here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[860px]">
              <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                <tr>
                  <th className="text-left px-4 py-3">Date</th>
                  <th className="text-left px-4 py-3">Purpose</th>
                  <th className="text-left px-4 py-3">Package / item</th>
                  <th className="text-left px-4 py-3">Method</th>
                  <th className="text-left px-4 py-3">Txn ref</th>
                  <th className="text-left px-4 py-3">Invoice</th>
                  <th className="text-right px-4 py-3">Amount</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr key={p.payment_id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 whitespace-nowrap">{fmtDate(p.created_at)}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{p.purpose}</td>
                    <td className="px-4 py-3">{p.package || "—"}</td>
                    <td className="px-4 py-3">
                      {p.method}
                      <p className="text-xs text-slate-400">{p.method_detail}</p>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{p.txn_ref}</td>
                    <td className="px-4 py-3 font-mono text-xs">{p.invoice_no}</td>
                    <td className="px-4 py-3 text-right font-semibold text-[#1e1147]">{inr(p.amount_inr)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          p.status === "Success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="light" size="sm" onClick={() => setReceipt(p)}>
                        <Receipt size={14} /> View receipt
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={!!receipt} onClose={() => setReceipt(null)} title="Payment receipt" wide>
        {receipt && (
          <>
            <Invoice p={receipt} user={data.user || { name: user.name, email: user.email }} />
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="ghost" onClick={() => setReceipt(null)}>Close</Button>
              <Button onClick={() => window.print()}>
                <Printer size={16} /> Print
              </Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
