"""University list, university detail page and per-university eligibility checker."""
from flask import Blueprint, request, jsonify
from db import db, clean, clean_all, latest_enroll, to_percentage, budget_to_aud, parse_number

uni_bp = Blueprint("universities", __name__)

# Rough IELTS equivalents so PTE / TOEFL / Duolingo scores can be compared
IELTS_EQUIV = {
    "PTE": [(79, 8.0), (73, 7.5), (65, 7.0), (58, 6.5), (50, 6.0), (43, 5.5)],
    "TOEFL": [(110, 8.0), (102, 7.5), (94, 7.0), (79, 6.5), (60, 6.0), (46, 5.5)],
    "Duolingo": [(140, 8.0), (130, 7.5), (125, 7.0), (115, 6.5), (105, 6.0), (95, 5.5)],
}


def ielts_equivalent(test_type, score):
    s = parse_number(score)
    if s is None:
        return None
    if not test_type or test_type == "IELTS":
        return s
    for cutoff, band in IELTS_EQUIV.get(test_type, []):
        if s >= cutoff:
            return band
    return 5.0


def profile_prefill(cur, user_id):
    """Values from the student's enrolment form to pre-fill eligibility checks."""
    if not user_id:
        return None
    e = latest_enroll(cur, user_id)
    if not e:
        return None
    return {
        "percentage": to_percentage(e.get("percentage_gpa")),
        "ielts": ielts_equivalent(e.get("english_test_type"), e.get("english_test_score")),
        "english_test_type": e.get("english_test_type"),
        "english_test_score": e.get("english_test_score"),
        "budget_aud": budget_to_aud(e.get("budget_range")),
        "course_level": e.get("course_level"),
        "preferred_course": e.get("preferred_course"),
        "backlogs": e.get("backlogs"),
        "backlogs_count": e.get("backlogs_count"),
        "academic_gap": e.get("academic_gap"),
        "visa_rejected_before": e.get("visa_rejected_before"),
        "work_experience_years": e.get("work_experience_years"),
    }


def first_year_cost(cur, uni, annual_fee):
    cur.execute("SELECT * FROM cities WHERE city=%s", (uni["city"],))
    c = cur.fetchone()
    cur.execute("SELECT * FROM fixed_costs WHERE id=1")
    f = cur.fetchone()
    living = int(c["living_cost_aud"]) if c else 0
    oshc = int(f["oshc_per_year_aud"]) if f else 0
    one_time = int(f["visa_fee_aud"] + f["airfare_aud"] + f["initial_setup_aud"]) if f else 0
    return {
        "tuition": int(annual_fee or 0),
        "living": living,
        "oshc": oshc,
        "one_time": one_time,
        "total": int(annual_fee or 0) + living + oshc + one_time,
        "is_regional": bool(c["is_regional"]) if c else False,
    }


def evaluate(cur, uni, level, pct, ielts, funds, course=None, prefill=None):
    """Core eligibility logic for one university (+ optional course)."""
    cur.execute("""SELECT * FROM eligibility_criteria WHERE level=%s AND uni_tier=%s LIMIT 1""",
                (level, uni["uni_tier"]))
    c = cur.fetchone()
    if not c:
        return {"eligible": None, "message": f"No eligibility data for {level} at {uni['uni_tier']} universities."}

    req_pct = float(c["min_percentage"])
    req_ielts = float(c["min_ielts"])
    if course:
        if course.get("min_percentage") is not None:
            req_pct = max(req_pct, float(course["min_percentage"]))
        if course.get("min_ielts") is not None:
            req_ielts = max(req_ielts, float(course["min_ielts"]))
    req_funds = float(c["min_funds_aud"])

    checks = [
        {"label": "Academic score", "yours": pct, "required": req_pct, "unit": "%",
         "passed": pct is not None and pct >= req_pct,
         "gap": None if pct is None or pct >= req_pct else round(req_pct - pct, 1)},
        {"label": "English (IELTS overall)", "yours": ielts, "required": req_ielts, "unit": "",
         "passed": ielts is not None and ielts >= req_ielts,
         "gap": None if ielts is None or ielts >= req_ielts else round(req_ielts - ielts, 1)},
        {"label": "Proof of funds", "yours": funds, "required": req_funds, "unit": "A$",
         "passed": funds is not None and funds >= req_funds,
         "gap": None if funds is None or funds >= req_funds else round(req_funds - funds)},
    ]
    eligible = all(ch["passed"] for ch in checks)
    passed = sum(1 for ch in checks if ch["passed"])

    advice = []
    for ch in checks:
        if ch["passed"]:
            continue
        if ch["label"].startswith("Academic"):
            advice.append(f"Your academic score is {ch['gap']}% below the requirement. Consider a pathway/diploma "
                          f"or a university in a less competitive tier.")
        elif ch["label"].startswith("English"):
            advice.append(f"Improve your IELTS by {ch['gap']} band (or equivalent PTE/TOEFL) to meet the English requirement.")
        else:
            advice.append(f"Show about A${int(ch['gap']):,} more in funds (bank balance, education loan or sponsor).")

    warnings = []
    if prefill:
        if prefill.get("backlogs") == "Yes" and (prefill.get("backlogs_count") or 0) > 5:
            warnings.append("More than 5 backlogs may reduce your chances at competitive universities.")
        if prefill.get("academic_gap") == "Yes":
            warnings.append("You have an academic gap — keep documents (work letters etc.) ready to justify it.")
        if prefill.get("visa_rejected_before") == "Yes":
            warnings.append("A previous visa refusal must be declared; your counsellor will help address it.")

    cost = first_year_cost(cur, uni, course["annual_fee_aud"] if course else None)

    return {
        "eligible": eligible,
        "score": round(passed / 3 * 100),
        "verdict": "Eligible" if eligible else ("Partially eligible" if passed >= 2 else "Not eligible"),
        "checks": checks,
        "advice": advice,
        "warnings": warnings,
        "notes": c.get("notes"),
        "first_year_cost": cost if course else None,
    }


@uni_bp.route("/universities/filters", methods=["GET"])
def uni_filters():
    conn = db()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT DISTINCT state FROM universities ORDER BY state")
    states = [r["state"] for r in cur.fetchall()]
    cur.execute("SELECT DISTINCT uni_tier FROM universities ORDER BY uni_tier")
    tiers = [r["uni_tier"] for r in cur.fetchall()]
    cur.execute("SELECT DISTINCT city FROM universities ORDER BY city")
    cities = [r["city"] for r in cur.fetchall()]
    cur.execute("SELECT DISTINCT field FROM courses ORDER BY field")
    fields = [r["field"] for r in cur.fetchall()]
    cur.execute("SELECT level FROM tuition_base")
    levels = [r["level"] for r in cur.fetchall()]
    cur.close()
    conn.close()
    return jsonify(states=states, tiers=tiers, cities=cities, fields=fields, levels=levels)


@uni_bp.route("/universities", methods=["GET"])
def list_universities():
    search = (request.args.get("search") or "").strip()
    sql = """SELECT u.university_id, u.name, u.city, u.state, u.uni_tier, u.website,
                    d.established, d.uni_type, d.uni_group, d.about, d.known_for, d.intakes,
                    (SELECT COUNT(*) FROM courses c WHERE c.university_id=u.university_id) AS course_count,
                    (SELECT MIN(annual_fee_aud) FROM courses c WHERE c.university_id=u.university_id) AS min_fee,
                    (SELECT COUNT(*) FROM scholarships s WHERE s.university_id=u.university_id) AS scholarship_count
             FROM universities u LEFT JOIN university_details d ON d.university_id=u.university_id
             WHERE 1=1"""
    params = []
    for key, col in (("state", "u.state"), ("tier", "u.uni_tier"), ("city", "u.city")):
        v = request.args.get(key)
        if v and v != "All":
            sql += f" AND {col}=%s"
            params.append(v)
    field = request.args.get("field")
    if field and field != "All":
        sql += " AND EXISTS (SELECT 1 FROM courses c WHERE c.university_id=u.university_id AND c.field=%s)"
        params.append(field)
    if search:
        sql += " AND (u.name LIKE %s OR u.city LIKE %s OR d.known_for LIKE %s)"
        params += [f"%{search}%"] * 3
    sql += " ORDER BY u.uni_tier, u.name"
    conn = db()
    cur = conn.cursor(dictionary=True)
    cur.execute(sql, params)
    rows = clean_all(cur.fetchall())
    cur.close()
    conn.close()
    return jsonify(count=len(rows), universities=rows)


@uni_bp.route("/universities/<int:uid>", methods=["GET"])
def university_detail(uid):
    user_id = request.args.get("user_id")
    conn = db()
    cur = conn.cursor(dictionary=True)
    cur.execute("""SELECT u.*, d.established, d.uni_type, d.uni_group, d.about, d.known_for, d.intakes, d.main_campus
                   FROM universities u LEFT JOIN university_details d ON d.university_id=u.university_id
                   WHERE u.university_id=%s""", (uid,))
    uni = cur.fetchone()
    if not uni:
        cur.close()
        conn.close()
        return jsonify(error="University not found"), 404

    cur.execute("SELECT * FROM courses WHERE university_id=%s ORDER BY level, name", (uid,))
    courses = clean_all(cur.fetchall())
    cur.execute("""SELECT scholarship_id, name, level, field, amount_aud, coverage, min_percentage,
                          min_ielts, deadline, apply_link, description
                   FROM scholarships WHERE university_id=%s OR university_id IS NULL
                   ORDER BY university_id IS NULL, amount_aud DESC""", (uid,))
    schols = clean_all(cur.fetchall())
    cur.execute("SELECT * FROM eligibility_criteria WHERE uni_tier=%s ORDER BY min_percentage DESC", (uni["uni_tier"],))
    criteria = clean_all(cur.fetchall())
    cost = first_year_cost(cur, uni, min((c["annual_fee_aud"] for c in courses), default=0))

    my_apps = []
    if user_id:
        cur.execute("""SELECT application_id, app_ref, course_name, intake, status FROM applications
                       WHERE user_id=%s AND university_id=%s ORDER BY application_id DESC""", (user_id, uid))
        my_apps = clean_all(cur.fetchall())
    prefill = profile_prefill(cur, user_id)
    cur.close()
    conn.close()
    return jsonify(university=clean(uni), courses=courses, scholarships=schols, criteria=criteria,
                   cost_snapshot=cost, my_applications=my_apps, profile=prefill)


@uni_bp.route("/universities/<int:uid>/eligibility", methods=["POST"])
def university_eligibility(uid):
    data = request.get_json() or {}
    try:
        pct = float(data["percentage"]) if data.get("percentage") not in (None, "") else None
        ielts = float(data["ielts"]) if data.get("ielts") not in (None, "") else None
        funds = float(data["budget_aud"]) if data.get("budget_aud") not in (None, "") else None
    except (TypeError, ValueError):
        return jsonify(error="Please enter valid numbers"), 400
    if pct is None or ielts is None or funds is None:
        return jsonify(error="Academic %, IELTS and available funds are all required"), 400

    conn = db()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT * FROM universities WHERE university_id=%s", (uid,))
    uni = cur.fetchone()
    if not uni:
        cur.close()
        conn.close()
        return jsonify(error="University not found"), 404
    course = None
    level = data.get("level")
    if data.get("course_id"):
        cur.execute("SELECT * FROM courses WHERE course_id=%s AND university_id=%s", (data["course_id"], uid))
        course = cur.fetchone()
        if course:
            level = course["level"]
    if not level:
        cur.execute("SELECT level FROM tuition_base LIMIT 1")
        level = cur.fetchone()["level"]
    prefill = profile_prefill(cur, data.get("user_id"))
    result = evaluate(cur, uni, level, pct, ielts, funds, course, prefill)
    result.update(university=uni["name"], uni_tier=uni["uni_tier"], level=level,
                  course=course["name"] if course else None)
    cur.close()
    conn.close()
    return jsonify(result)
