"""UniEra Assistant — a rule-based chatbot that answers from the UniEra database.

It understands intents by keywords (no paid AI API needed, works offline):
application status, universities, courses/fees, scholarships, costs,
eligibility, documents, visa, intakes, IELTS, and how to apply.
"""
import re
from flask import Blueprint, request, jsonify
from db import db, clean_all, norm
from workflow import STUDENT_MESSAGE, DOC_TYPES

chat_bp = Blueprint("chat", __name__)

ALIASES = {
    "unsw": "unsw", "anu": "nationaluniversity", "uq": "universityofqueensland", "uwa": "westernaustralia",
    "uts": "technologysydney", "qut": "queenslanduniversityoftechnology", "rmit": "rmit", "mq": "macquarie",
    "jcu": "jamescook", "ecu": "edithcowan", "usyd": "universityofsydney", "unimelb": "universityofmelbourne",
    "wsu": "westernsydney", "uow": "wollongong", "csu": "charlessturt", "scu": "southerncross",
    "une": "newengland", "acu": "catholic", "vu": "victoriauniversity", "usq": "southernqueensland",
    "unisq": "southernqueensland", "usc": "sunshinecoast", "cdu": "charlesdarwin", "utas": "tasmania",
    "unisa": "southaustralia", "cqu": "cquniversity",
}

DEFAULT_SUGGESTIONS = ["What is my application status?", "Which documents do I need?",
                       "Scholarships for Masters in IT", "Cost of living in Sydney"]


def has(text, *words):
    return any(re.search(r"\b" + w, text) for w in words)


def find_university(cur, text):
    cur.execute("SELECT university_id, name, city, state, uni_tier, website FROM universities")
    unis = cur.fetchall()
    t = norm(text)
    words = re.findall(r"[a-z]+", text.lower())
    for w in words:
        if w in ALIASES:
            key = ALIASES[w]
            for u in unis:
                if key in norm(u["name"]):
                    return u
    best, best_len = None, 0
    for u in unis:
        core = norm(re.sub(r"(?i)\b(the|university|of|australia)\b", "", u["name"]))
        if len(core) >= 4 and core in t and len(core) > best_len:
            best, best_len = u, len(core)
    return best


def find_city(cur, text):
    cur.execute("SELECT * FROM cities")
    for c in cur.fetchall():
        if c["city"].lower() in text:
            return c
    return None


def reply(cur, user_id, text):
    t = text.lower().strip()

    if not t:
        return "Please type a question 🙂", DEFAULT_SUGGESTIONS, []

    if re.fullmatch(r"(hi|hello|hey|hii+|namaste|good (morning|afternoon|evening))[!. ]*", t):
        return ("Hi! I'm the UniEra Assistant 🎓. I can help with Australian universities, courses, fees, "
                "scholarships, eligibility, documents, visa questions and your application status."),\
            DEFAULT_SUGGESTIONS, []

    if has(t, "thank"):
        return "You're welcome! All the best with your applications 🎓", DEFAULT_SUGGESTIONS, []

    # ---------- application status ----------
    if has(t, "status", "my application", "applied", "track", "offer", "decision", "update"):
        if not user_id:
            return ("Please log in to see your application status, or use the Application Status checker "
                    "with your reference number (e.g. UE-2026-00001)."), [], [{"label": "Status checker",
                                                                               "to": "/application-status"}]
        cur.execute("""SELECT a.application_id, a.app_ref, a.course_name, a.status, u.name AS uni
                       FROM applications a JOIN universities u ON u.university_id=a.university_id
                       WHERE a.user_id=%s ORDER BY a.application_id DESC""", (user_id,))
        apps = cur.fetchall()
        if not apps:
            return ("You haven't submitted any applications yet. Open any university page and click "
                    "'Apply now' to start."), ["How do I apply?"], [{"label": "Browse universities",
                                                                    "to": "/universities"}]
        lines = [f"• {a['app_ref']} — {a['course_name']} at {a['uni']}: **{a['status']}**. "
                 f"{STUDENT_MESSAGE.get(a['status'], '')}" for a in apps[:5]]
        links = [{"label": f"Open {a['app_ref']}", "to": f"/applications/{a['application_id']}"} for a in apps[:3]]
        return "Here are your applications:\n" + "\n".join(lines), ["Which documents do I need?"], links

    uni = find_university(cur, t)

    # ---------- documents ----------
    if has(t, "document", "docs", "upload", "papers", "checklist"):
        req = [d[1] for d in DOC_TYPES if d[2]]
        opt = [d[1] for d in DOC_TYPES if not d[2]]
        return ("Documents needed for a UniEra application:\n" + "\n".join(f"• {r}" for r in req) +
                f"\nOptional but recommended: {', '.join(opt)}.\nFiles from your Enroll Now profile are "
                "reused automatically — you only upload what's missing (PDF, JPG, PNG or DOC)."),\
            ["How do I apply?", "What is my application status?"], []

    # ---------- how to apply ----------
    if has(t, "how (do|to|can) i apply", "apply", "process", "steps"):
        return ("Applying with UniEra takes 4 steps:\n1. Complete your Enroll Now profile (with documents).\n"
                "2. Open a university → check your eligibility for it.\n3. Click 'Apply now', choose course & "
                "intake, confirm documents and submit.\n4. Track it on your Dashboard — your counsellor verifies "
                "documents, lodges it with the university and you'll be notified of the decision."),\
            ["Which documents do I need?"], [{"label": "Browse universities", "to": "/universities"}]

    # ---------- scholarships ----------
    if has(t, "scholarship", "funding", "grant", "bursar"):
        sql = """SELECT s.name, s.amount_aud, s.coverage, s.level, s.field,
                        IFNULL(u.name,'Government of Australia') AS uni
                 FROM scholarships s LEFT JOIN universities u ON u.university_id=s.university_id WHERE 1=1"""
        params = []
        if uni:
            sql += " AND (s.university_id=%s)"
            params.append(uni["university_id"])
        for lvl in ("master", "bachelor", "phd"):
            if lvl in t:
                sql += " AND s.level LIKE %s"
                params.append(f"%{lvl}%")
        for fld in ("it", "business", "engineering", "health", "science", "law", "arts"):
            if re.search(r"\b" + fld + r"\b", t):
                sql += " AND (s.field LIKE %s OR s.field='Any')"
                params.append(f"%{fld}%")
                break
        sql += " ORDER BY s.amount_aud DESC LIMIT 4"
        cur.execute(sql, params)
        rows = cur.fetchall()
        if not rows:
            return ("I couldn't find a scholarship for exactly that — try the Scholarships page to "
                    "widen the filters."), [], [{"label": "Scholarships", "to": "/scholarships"}]
        lines = [f"• {r['name']} ({r['uni']}) — A${r['amount_aud']:,} {r['coverage'].lower()}, "
                 f"{r['level']}, {r['field']}" for r in rows]
        return "Top matching scholarships:\n" + "\n".join(lines), [], [{"label": "All scholarships",
                                                                          "to": "/scholarships"}]

    # ---------- costs / fees ----------
    if has(t, "cost", "fee", "tuition", "expens", "living", "budget", "rent", "cheap", "afford"):
        city = find_city(cur, t)
        if city and has(t, "living", "rent", "city") and not has(t, "universit", "tuition", "fee"):
            uni = None
        if uni:
            cur.execute("""SELECT name, level, annual_fee_aud FROM courses WHERE university_id=%s
                           ORDER BY annual_fee_aud LIMIT 5""", (uni["university_id"],))
            rows = cur.fetchall()
            lines = [f"• {r['name']} ({r['level']}) — about A${r['annual_fee_aud']:,}/year" for r in rows]
            return (f"Indicative tuition at {uni['name']}:\n" + "\n".join(lines) +
                    "\nUse the Cost Estimator for living, OSHC and visa costs."), [],\
                [{"label": f"View {uni['name']}", "to": f"/universities/{uni['university_id']}"},
                 {"label": "Cost Estimator", "to": "/cost-estimator"}]
        if city:
            return (f"Living costs in {city['city']} ({city['state']}) average about "
                    f"A${int(city['living_cost_aud']):,} per year"
                    f"{' — it is a regional area, which can give extra post-study work rights' if city['is_regional'] else ''}"
                    ". Add tuition, OSHC health cover and visa fees for the full picture."), [],\
                [{"label": "Cost Estimator", "to": "/cost-estimator"}]
        cur.execute("SELECT city, living_cost_aud FROM cities ORDER BY living_cost_aud LIMIT 3")
        cheap = ", ".join(f"{c['city']} (A${int(c['living_cost_aud']):,})" for c in cur.fetchall())
        return (f"Costs depend on city and course. Most affordable cities for living: {cheap}. "
                "Tell me a city or university, or use the Cost Estimator."),\
            ["Cost of living in Sydney", "Fees at Macquarie University"], [{"label": "Cost Estimator",
                                                                           "to": "/cost-estimator"}]

    # ---------- eligibility / IELTS ----------
    if has(t, "eligib", "qualify", "ielts", "pte", "toefl", "percentage", "cgpa", "gpa", "marks", "backlog",
           "requirement", "admission"):
        if uni:
            cur.execute("SELECT * FROM eligibility_criteria WHERE uni_tier=%s ORDER BY min_percentage DESC",
                        (uni["uni_tier"],))
            rows = cur.fetchall()
            lines = [f"• {r['level']}: {float(r['min_percentage']):g}%+, IELTS {float(r['min_ielts']):g}, "
                     f"funds A${int(r['min_funds_aud']):,}" for r in rows]
            return (f"{uni['name']} ({uni['uni_tier']}) typically requires:\n" + "\n".join(lines) +
                    "\nOpen the university page to check your own eligibility instantly."), [],\
                [{"label": "Check eligibility", "to": f"/universities/{uni['university_id']}#eligibility"}]
        cur.execute("""SELECT uni_tier, MIN(min_percentage) p, MIN(min_ielts) i FROM eligibility_criteria
                       GROUP BY uni_tier ORDER BY p DESC""")
        lines = [f"• {r['uni_tier']}: from {float(r['p']):g}% and IELTS {float(r['i']):g}" for r in cur.fetchall()]
        return ("Entry requirements by university tier:\n" + "\n".join(lines) +
                "\nMost Australian universities accept PTE and TOEFL as IELTS alternatives."), [],\
            [{"label": "Eligibility checker", "to": "/eligibility"}]

    # ---------- visa ----------
    if has(t, "visa", "subclass", "500", "gs ", "genuine student", "work right", "part time", "part-time"):
        cur.execute("SELECT * FROM fixed_costs WHERE id=1")
        f = cur.fetchone()
        fee = f" The visa application fee in our data is about A${int(f['visa_fee_aud']):,}." if f else ""
        return ("International students need the Student visa (subclass 500). You'll need a CoE from your "
                "university, OSHC health cover, proof of funds, English test results and a Genuine Student "
                "statement." + fee + " Student visa holders can generally work limited hours during study "
                "periods — always confirm current rules on the Department of Home Affairs website."), [],\
            [{"label": "Cost Estimator", "to": "/cost-estimator"}]

    # ---------- intakes ----------
    if has(t, "intake", "deadline", "when (can|should) i", "semester", "session", "start date"):
        if uni:
            cur.execute("SELECT intakes FROM university_details WHERE university_id=%s", (uni["university_id"],))
            d = cur.fetchone()
            return (f"{uni['name']} intakes: {d['intakes'] if d else 'February, July'}. Apply 3–6 months ahead "
                    "so there is time for offer, CoE and visa."), [], []
        return ("Most Australian universities have two main intakes — February and July — and some offer a "
                "third (November or trimester-based). Apply 3–6 months before the intake."), [], []

    # ---------- courses ----------
    if has(t, "course", "program", "master", "bachelor", "mba", "data science", "analytics", "it\\b", "engineering"):
        sql = """SELECT c.name, c.level, c.annual_fee_aud, u.name AS uni, u.university_id
                 FROM courses c JOIN universities u ON u.university_id=c.university_id WHERE 1=1"""
        params = []
        if uni:
            sql += " AND c.university_id=%s"
            params.append(uni["university_id"])
        for kw in ("data science", "analytics", "mba", "accounting", "cyber", "engineering", "nursing",
                   "information technology", "public health", "computer science", "project management"):
            if kw in t:
                sql += " AND c.name LIKE %s"
                params.append(f"%{kw}%")
                break
        sql += " ORDER BY c.annual_fee_aud LIMIT 5"
        cur.execute(sql, params)
        rows = cur.fetchall()
        if rows:
            lines = [f"• {r['name']} — {r['uni']} (~A${r['annual_fee_aud']:,}/yr)" for r in rows]
            return "Some matching courses (lowest fees first):\n" + "\n".join(lines), [],\
                [{"label": "Browse universities", "to": "/universities"}]

    # ---------- a university on its own ----------
    if uni:
        cur.execute("SELECT * FROM university_details WHERE university_id=%s", (uni["university_id"],))
        d = cur.fetchone() or {}
        cur.execute("SELECT COUNT(*) c, MIN(annual_fee_aud) m FROM courses WHERE university_id=%s",
                    (uni["university_id"],))
        c = cur.fetchone()
        est = f" Established {d['established']}." if d.get("established") else ""
        return (f"{uni['name']} — {uni['city']}, {uni['state']} ({uni['uni_tier']}).{est} "
                f"{d.get('about', '')} Known for: {d.get('known_for', '-')}. "
                f"{c['c']} courses on UniEra from about A${(c['m'] or 0):,}/year."),\
            [f"Scholarships at {uni['name']}", f"Eligibility for {uni['name']}"],\
            [{"label": "Open university page", "to": f"/universities/{uni['university_id']}"}]

    if has(t, "counsel", "contact", "human", "call", "email", "talk"):
        return ("Your UniEra counsellor reviews every application. After you apply, any message from them "
                "appears in your application timeline and notifications."), [], []

    return ("Sorry, I didn't quite get that. I can answer questions about universities, courses, fees, "
            "scholarships, eligibility, documents, visas and your application status."), DEFAULT_SUGGESTIONS, []


@chat_bp.route("/chat", methods=["POST"])
def chat():
    data = request.get_json() or {}
    user_id = data.get("user_id") or None
    message = (data.get("message") or "")[:500]
    conn = db()
    cur = conn.cursor(dictionary=True)
    text, suggestions, links = reply(cur, user_id, message)
    try:
        cur.execute("INSERT INTO chat_messages (user_id, sender, message) VALUES (%s,'user',%s)", (user_id, message))
        cur.execute("INSERT INTO chat_messages (user_id, sender, message) VALUES (%s,'bot',%s)", (user_id, text))
        conn.commit()
    except Exception:
        pass
    cur.close()
    conn.close()
    return jsonify(reply=text, suggestions=suggestions, links=links)


@chat_bp.route("/chat/history/<int:user_id>", methods=["GET"])
def history(user_id):
    conn = db()
    cur = conn.cursor(dictionary=True)
    cur.execute("""SELECT sender, message, created_at FROM chat_messages WHERE user_id=%s
                   ORDER BY chat_id DESC LIMIT 20""", (user_id,))
    rows = clean_all(cur.fetchall())[::-1]
    cur.close()
    conn.close()
    return jsonify(messages=rows)
