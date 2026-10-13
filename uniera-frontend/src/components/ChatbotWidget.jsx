import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { api, currentUser } from "../api";

const WELCOME = {
  sender: "bot",
  message:
    "Hi! I'm the UniEra Assistant 🎓 Ask me about universities, courses, fees, scholarships, eligibility, documents, visas or your application status.",
};
const STARTERS = [
  "What is my application status?",
  "Which documents do I need?",
  "Scholarships for Masters in IT",
  "Cost of living in Sydney",
];

// turns **bold** into <strong>
function Rich({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") ? <strong key={i}>{p.slice(2, -2)}</strong> : <span key={i}>{p}</span>
  );
}

export default function ChatbotWidget() {
  const navigate = useNavigate();
  const user = currentUser();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [suggestions, setSuggestions] = useState(STARTERS);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (open && user && !loaded.current) {
      loaded.current = true;
      api
        .get(`/chat/history/${user.id}`)
        .then((r) => r.data.messages.length && setMessages([WELCOME, ...r.data.messages]))
        .catch(() => {});
    }
  }, [open, user]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, open]);

  const send = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg) return;
    setInput("");
    setMessages((m) => [...m, { sender: "user", message: msg }]);
    setTyping(true);
    try {
      const r = await api.post("/chat", { user_id: user?.id || null, message: msg });
      setMessages((m) => [...m, { sender: "bot", message: r.data.reply, links: r.data.links }]);
      setSuggestions(r.data.suggestions?.length ? r.data.suggestions : []);
    } catch {
      setMessages((m) => [...m, { sender: "bot", message: "I can't reach the server right now. Please try again." }]);
    }
    setTyping(false);
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[#1e1147] to-[#7c3aed] text-white shadow-xl flex items-center justify-center hover:scale-105 transition"
          title="Chat with UniEra Assistant"
        >
          <MessageCircle size={26} />
        </button>
      )}

      {open && (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-50 sm:w-[380px] h-[560px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
          <div className="bg-gradient-to-r from-[#1e1147] to-[#7c3aed] text-white px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <Bot size={20} />
            </div>
            <div className="flex-1">
              <p className="font-semibold leading-tight">UniEra Assistant</p>
              <p className="text-xs text-purple-200">Usually replies instantly</p>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 hover:bg-white/10 rounded">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-line leading-relaxed ${
                    m.sender === "user"
                      ? "bg-[#7c3aed] text-white rounded-br-sm"
                      : "bg-white text-slate-700 border border-slate-100 rounded-bl-sm"
                  }`}
                >
                  <Rich text={m.message} />
                  {m.links?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {m.links.map((l) => (
                        <button
                          key={l.to}
                          onClick={() => {
                            navigate(l.to);
                            if (window.innerWidth < 640) setOpen(false);
                          }}
                          className="text-xs font-medium bg-violet-50 text-[#7c3aed] border border-violet-200 rounded-full px-3 py-1 hover:bg-violet-100"
                        >
                          {l.label} →
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className="bg-white border border-slate-100 rounded-2xl px-4 py-3 w-16 flex gap-1">
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${d * 0.15}s` }}
                  />
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          {suggestions.length > 0 && (
            <div className="px-3 pt-2 flex gap-2 overflow-x-auto bg-white">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="shrink-0 text-xs border border-slate-200 rounded-full px-3 py-1.5 text-slate-600 hover:border-[#7c3aed] hover:text-[#7c3aed]"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="p-3 flex gap-2 bg-white"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
            <button
              type="submit"
              className="w-10 h-10 rounded-full bg-[#7c3aed] text-white flex items-center justify-center hover:bg-[#6d28d9]"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
