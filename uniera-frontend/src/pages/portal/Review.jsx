// Enrolled students can review their experience with UniEra.
// POST /reviews {user_id, rating, comment, university} — reviews appear on the home page.
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star, Send, CheckCircle2 } from "lucide-react";
import { api, currentUser, errMsg } from "../../api";
import { Card, Button, Alert, PageTitle, Field, inputCls } from "../../components/ui";

const LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];
const OTHER = "__other__";

export default function Review() {
  const user = currentUser();
  const [universities, setUniversities] = useState([]); // from the student's applications
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [choice, setChoice] = useState("");
  const [otherUni, setOtherUni] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  // Offer the universities the student has applied to (the list is optional — free text also works)
  useEffect(() => {
    api
      .get("/applications", { params: { user_id: user.id } })
      .then((r) => {
        const names = [...new Set((r.data.applications || []).map((a) => a.university))];
        setUniversities(names);
      })
      .catch(() => setUniversities([]));
  }, [user.id]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!rating) return setError("Please choose a star rating.");
    if (comment.trim().length < 10) return setError("Please write at least a short comment (10+ characters).");
    setSaving(true);
    try {
      const university = choice === OTHER ? otherUni.trim() : choice;
      await api.post("/reviews", { user_id: user.id, rating, comment: comment.trim(), university: university || null });
      setDone(true);
    } catch (err) {
      setError(errMsg(err, "Could not submit your review"));
    }
    setSaving(false);
  };

  if (done) {
    return (
      <Card className="max-w-xl mx-auto p-8 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <CheckCircle2 size={32} />
        </div>
        <h1 className="text-xl font-bold text-[#1e1147] mt-4">Thank you for your review!</h1>
        <p className="text-sm text-slate-500 mt-2">
          Your feedback helps future students choose with confidence. Reviews are shown on the UniEra home page.
        </p>
        <div className="flex justify-center gap-2 mt-6">
          <Link to="/">
            <Button>See it on the home page</Button>
          </Link>
          <Link to="/portal">
            <Button variant="outline">Back to dashboard</Button>
          </Link>
        </div>
      </Card>
    );
  }

  const shown = hover || rating;

  return (
    <div className="max-w-2xl">
      <PageTitle title="Write a review" subtitle="Tell other students about your experience with UniEra." />

      <Card className="p-6">
        <form onSubmit={submit} className="space-y-5">
          <div>
            <p className="text-xs font-semibold text-slate-600 mb-2">Your rating</p>
            <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  type="button"
                  key={n}
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHover(n)}
                  className="p-1"
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                >
                  <Star
                    size={32}
                    className={n <= shown ? "fill-amber-400 text-amber-400" : "text-slate-300"}
                  />
                </button>
              ))}
              <span className="ml-3 text-sm font-medium text-slate-600">{LABELS[shown]}</span>
            </div>
          </div>

          <Field label="University (optional)" hint="Which university did UniEra help you with?">
            <select className={inputCls} value={choice} onChange={(e) => setChoice(e.target.value)}>
              <option value="">General experience with UniEra</option>
              {universities.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
              <option value={OTHER}>Other (type the name)</option>
            </select>
          </Field>
          {choice === OTHER && (
            <Field label="University name">
              <input className={inputCls} value={otherUni} onChange={(e) => setOtherUni(e.target.value)} />
            </Field>
          )}

          <Field label="Your review" hint={`${comment.trim().length} characters · minimum 10`}>
            <textarea
              className={`${inputCls} min-h-[140px]`}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How was the counselling, application support and communication?"
            />
          </Field>

          <Alert>{error}</Alert>

          <Button type="submit" loading={saving}>
            <Send size={16} /> Submit review
          </Button>
        </form>
      </Card>
    </div>
  );
}
