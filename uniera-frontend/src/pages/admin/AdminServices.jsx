// Payments & services: payments, loan requests, test-prep bookings, accommodation requests, website enquiries.
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Landmark, BookOpen, Home as HomeIcon, Mail } from "lucide-react";
import { adminApi, errMsg, fmtDate, inr, money } from "../../api";
import { Card, Button, Spinner, Alert, Empty, PageTitle, Tabs, inputCls } from "../../components/ui";

const LOAN_STATUSES = ["Submitted", "Documents Collected", "Shared with Lender", "Sanctioned", "Disbursed", "Rejected"];
const ACCOM_STATUSES = ["Requested", "Confirmed", "Cancelled"];

const PILL = {
  Success: "bg-green-50 text-green-700",
  Confirmed: "bg-green-50 text-green-700",
  Sanctioned: "bg-green-50 text-green-700",
  Disbursed: "bg-emerald-600 text-white",
  Contacted: "bg-green-50 text-green-700",
  New: "bg-blue-50 text-blue-700",
  Submitted: "bg-blue-50 text-blue-700",
  Requested: "bg-amber-50 text-amber-700",
  Rejected: "bg-red-50 text-red-700",
  Cancelled: "bg-slate-100 text-slate-500",
};
const Pill = ({ s }) => (
  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${PILL[s] || "bg-violet-50 text-violet-700"}`}>{s}</span>
);

// Small reusable table: headers + rows (each row is an array of cells)
function Table({ headers, rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
          <tr>
            {headers.map((h) => (
              <th key={h} className="text-left font-semibold px-4 py-3 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((cells, i) => (
            <tr key={i} className="hover:bg-slate-50 align-top">
              {cells.map((c, j) => (
                <td key={j} className="px-4 py-3">{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// One loan row's editable status + remarks
function LoanEditor({ loan, onSave }) {
  const [status, setStatus] = useState(loan.status);
  const [remarks, setRemarks] = useState(loan.remarks || "");
  const [saving, setSaving] = useState(false);
  const save = async () => {
    setSaving(true);
    await onSave(loan.loan_id, { status, remarks });
    setSaving(false);
  };
  return (
    <div className="flex flex-col gap-2 min-w-[220px]">
      <select className={`${inputCls} py-1.5`} value={status} onChange={(e) => setStatus(e.target.value)}>
        {LOAN_STATUSES.map((s) => <option key={s}>{s}</option>)}
      </select>
      <input className={`${inputCls} py-1.5`} placeholder="Remarks for student" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
      <Button size="sm" variant="solid" loading={saving} onClick={save}>Update</Button>
    </div>
  );
}

export default function AdminServices() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("payments");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleError = (e) => {
    if (e?.response?.status === 401) {
      localStorage.removeItem("staff_token");
      navigate("/admin/login");
    } else setError(errMsg(e));
  };

  const load = () =>
    adminApi()
      .get("/services")
      .then((r) => setData(r.data))
      .catch(handleError);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // generic POST helper for the three update endpoints
  const update = async (path, body, okText) => {
    setError("");
    setMessage("");
    try {
      await adminApi().post(path, body);
      setMessage(okText);
      await load();
    } catch (e) {
      handleError(e);
    }
  };

  if (!data) return error ? <Alert>{error}</Alert> : <Spinner label="Loading services..." />;

  const newEnquiries = data.enquiries.filter((e) => e.status === "New").length;
  const tabs = [
    { value: "payments", label: `Payments (${data.payments.length})` },
    { value: "loans", label: `Loan requests (${data.loans.length})` },
    { value: "test_prep", label: `Test prep (${data.test_prep.length})` },
    { value: "accommodation", label: `Accommodation (${data.accommodation.length})` },
    { value: "enquiries", label: `Enquiries${newEnquiries ? ` · ${newEnquiries} new` : ` (${data.enquiries.length})`}` },
  ];

  const icons = { payments: CreditCard, loans: Landmark, test_prep: BookOpen, accommodation: HomeIcon, enquiries: Mail };
  const empty = <Empty icon={icons[tab]} title="Nothing here yet" />;

  return (
    <div className="space-y-6">
      <PageTitle title="Payments & Services" subtitle="Consultancy fees, loans, test prep, accommodation and website enquiries." />

      <Tabs tabs={tabs} value={tab} onChange={setTab} />
      <Alert>{error}</Alert>
      <Alert type="success">{message}</Alert>

      <Card className="overflow-hidden">
        {tab === "payments" && (
          <>
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <span className="text-sm text-slate-500">Total revenue collected</span>
              <span className="text-xl font-bold text-[#1e1147]">{inr(data.revenue_inr)}</span>
            </div>
            {data.payments.length === 0 ? empty : (
              <Table
                headers={["Date", "Student", "Purpose", "Amount", "Method", "Txn ref / Invoice", "Status"]}
                rows={data.payments.map((p) => [
                  <span className="whitespace-nowrap text-slate-500">{fmtDate(p.created_at, true)}</span>,
                  p.student_name || "—",
                  <div><p>{p.purpose}</p><p className="text-xs text-slate-500">{p.package}</p></div>,
                  <b className="whitespace-nowrap">{inr(p.amount_inr)}</b>,
                  <div><p>{p.method}</p><p className="text-xs text-slate-500">{p.method_detail}</p></div>,
                  <div className="font-mono text-xs"><p>{p.txn_ref}</p><p className="text-slate-500">{p.invoice_no}</p></div>,
                  <Pill s={p.status} />,
                ])}
              />
            )}
          </>
        )}

        {tab === "loans" && (data.loans.length === 0 ? empty : (
          <Table
            headers={["Ref", "Student", "Lender", "Amount", "Co-applicant", "Admission", "Status", "Update"]}
            rows={data.loans.map((l) => [
              <div><p className="font-mono text-xs">{l.loan_ref}</p><p className="text-xs text-slate-500">{fmtDate(l.created_at)}</p></div>,
              l.student_name || "—",
              l.lender,
              <div className="whitespace-nowrap"><b>{inr(l.amount_inr)}</b><p className="text-xs text-slate-500">Collateral: {l.collateral}</p></div>,
              <div>
                <p>{l.co_applicant_name}{l.co_applicant_relation ? ` (${l.co_applicant_relation})` : ""}</p>
                <p className="text-xs text-slate-500">Income {inr(l.co_applicant_income)}/yr</p>
              </div>,
              <span className="text-xs">{l.admission_status}</span>,
              <Pill s={l.status} />,
              <LoanEditor
                key={`${l.loan_id}-${l.status}`}
                loan={l}
                onSave={(id, body) => update(`/loans/${id}`, body, `Loan ${l.loan_ref} updated`)}
              />,
            ])}
          />
        ))}

        {tab === "test_prep" && (data.test_prep.length === 0 ? empty : (
          <Table
            headers={["Booked", "Student", "Test", "Batch", "Centre", "Starts", "Fee", "Status"]}
            rows={data.test_prep.map((b) => [
              <span className="whitespace-nowrap text-slate-500">{fmtDate(b.created_at)}</span>,
              b.student_name || "—",
              <b>{b.test_name} <span className="font-normal text-slate-500">· {b.mode}</span></b>,
              b.batch,
              b.centre,
              <span className="whitespace-nowrap">{fmtDate(b.start_date)}</span>,
              <span className="whitespace-nowrap">{inr(b.fee_inr)}</span>,
              <Pill s={b.status} />,
            ])}
          />
        ))}

        {tab === "accommodation" && (data.accommodation.length === 0 ? empty : (
          <Table
            headers={["Requested", "Student", "Property", "Room", "Move-in", "Weeks", "Rent", "Status"]}
            rows={data.accommodation.map((b) => [
              <span className="whitespace-nowrap text-slate-500">{fmtDate(b.created_at)}</span>,
              b.student_name || "—",
              <div><p>{b.property_name}</p><p className="text-xs text-slate-500">{b.city}</p></div>,
              b.room_type,
              <span className="whitespace-nowrap">{fmtDate(b.move_in)}</span>,
              b.weeks,
              <span className="whitespace-nowrap">{money(b.weekly_rent_aud)}/wk</span>,
              <select
                className={`${inputCls} py-1.5 min-w-[130px]`}
                value={b.status}
                onChange={(e) => update(`/accommodation/${b.booking_id}`, { status: e.target.value }, "Accommodation request updated")}
              >
                {ACCOM_STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>,
            ])}
          />
        ))}

        {tab === "enquiries" && (data.enquiries.length === 0 ? (
          <Empty icon={Mail} title="No enquiries yet" text="Messages from the website contact form appear here." />
        ) : (
          <Table
            headers={["Received", "Name", "Contact", "Message", "Status", ""]}
            rows={data.enquiries.map((q) => [
              <span className="whitespace-nowrap text-slate-500">{fmtDate(q.created_at, true)}</span>,
              <b>{q.name}</b>,
              <div><p>{q.email}</p><p className="text-xs text-slate-500">{q.phone}</p></div>,
              <p className="max-w-md text-slate-600">{q.message}</p>,
              <Pill s={q.status} />,
              q.status === "New" ? (
                <Button size="sm" variant="success" onClick={() => update(`/enquiries/${q.enquiry_id}`, { status: "Contacted" }, "Enquiry marked as contacted")}>
                  Mark contacted
                </Button>
              ) : null,
            ])}
          />
        ))}
      </Card>
    </div>
  );
}
