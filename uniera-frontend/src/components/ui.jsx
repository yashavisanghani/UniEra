// Small shared UI kit so every page looks the same.
import { Loader2, AlertCircle, CheckCircle2, Info } from "lucide-react";

export const inputCls =
  "w-full border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white";

export function Card({ className = "", children, ...rest }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function Button({ variant = "primary", size = "md", className = "", loading, children, ...rest }) {
  const v = {
    primary: "bg-gradient-to-r from-[#1e1147] to-[#7c3aed] text-white hover:opacity-90",
    solid: "bg-[#7c3aed] text-white hover:bg-[#6d28d9]",
    outline: "border border-slate-300 text-slate-700 hover:border-[#7c3aed] hover:text-[#7c3aed] bg-white",
    ghost: "text-slate-600 hover:bg-slate-100",
    danger: "bg-red-600 text-white hover:bg-red-700",
    success: "bg-emerald-600 text-white hover:bg-emerald-700",
    light: "bg-violet-50 text-[#7c3aed] hover:bg-violet-100",
  }[variant];
  const s = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2.5 text-sm", lg: "px-6 py-3 text-base" }[size];
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${v} ${s} ${className}`}
      disabled={loading || rest.disabled}
      {...rest}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}

export function Field({ label, hint, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      {label && <span className="block text-xs font-semibold text-slate-600 mb-1">{label}</span>}
      {children}
      {hint && <span className="block text-[11px] text-slate-400 mt-1">{hint}</span>}
    </label>
  );
}

export function Spinner({ label = "Loading..." }) {
  return (
    <div className="flex items-center justify-center gap-2 text-slate-500 py-16">
      <Loader2 className="animate-spin" size={20} /> {label}
    </div>
  );
}

export function Alert({ type = "error", children, className = "" }) {
  if (!children) return null;
  const map = {
    error: ["bg-red-50 border-red-200 text-red-700", AlertCircle],
    success: ["bg-emerald-50 border-emerald-200 text-emerald-700", CheckCircle2],
    info: ["bg-violet-50 border-violet-200 text-violet-800", Info],
    warn: ["bg-amber-50 border-amber-200 text-amber-800", AlertCircle],
  };
  const [cls, Icon] = map[type] || map.info;
  return (
    <div className={`flex items-start gap-2 border rounded-lg px-3 py-2.5 text-sm ${cls} ${className}`}>
      <Icon size={18} className="shrink-0 mt-0.5" />
      <div className="flex-1">{children}</div>
    </div>
  );
}

export function Empty({ icon: Icon = Info, title, text, action }) {
  return (
    <div className="text-center py-14 px-6">
      <div className="w-14 h-14 mx-auto rounded-full bg-violet-50 text-[#7c3aed] flex items-center justify-center mb-3">
        <Icon size={26} />
      </div>
      <p className="font-semibold text-slate-800">{title}</p>
      {text && <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// Heading used inside the portal / admin pages
export function PageTitle({ title, subtitle, actions }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1e1147]">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({ icon: Icon, label, value, tone = "violet", onClick }) {
  const tones = {
    violet: "bg-violet-50 text-[#7c3aed]",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-sky-50 text-sky-600",
    red: "bg-red-50 text-red-600",
  };
  return (
    <Card className={`p-5 flex items-center gap-4 ${onClick ? "cursor-pointer hover:border-violet-300" : ""}`} onClick={onClick}>
      {Icon && (
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${tones[tone]}`}>
          <Icon size={22} />
        </div>
      )}
      <div>
        <p className="text-2xl font-bold text-[#1e1147] leading-none">{value}</p>
        <p className="text-xs text-slate-500 mt-1">{label}</p>
      </div>
    </Card>
  );
}

export function Tabs({ tabs, value, onChange }) {
  return (
    <div className="flex gap-1 bg-slate-100 rounded-xl p-1 overflow-x-auto">
      {tabs.map((t) => {
        const key = typeof t === "string" ? t : t.value;
        const label = typeof t === "string" ? t : t.label;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
              value === key ? "bg-white shadow-sm text-[#1e1147]" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export function Modal({ open, onClose, title, children, wide }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full ${wide ? "max-w-3xl" : "max-w-lg"} max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-[#1e1147]">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xl leading-none">
            &times;
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
