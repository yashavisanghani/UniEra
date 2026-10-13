from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import mysql.connector
import os

from db import db, norm, table_columns, save_upload, is_paid, UPLOAD_FOLDER
from schema import ensure_tables
from routes_universities import uni_bp
from routes_applications import apps_bp
from routes_admin import admin_bp
from routes_chat import chat_bp
from routes_portal import portal_bp

app = Flask(__name__)
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "uniera-dev-secret-change-me")
app.config["MAX_CONTENT_LENGTH"] = 20 * 1024 * 1024  # 20 MB per request
CORS(app)

for bp in (uni_bp, apps_bp, admin_bp, chat_bp, portal_bp):
    app.register_blueprint(bp)

# create the new tables + seed university details/courses/staff login on start-up
ensure_tables()


def match_payload(payload, columns):
    """Map incoming form keys onto real table columns, ignoring case/underscores."""
    lookup = {norm(c): c for c in columns}
    out = {}
    for k, v in payload.items():
        col = lookup.get(norm(k))
        if col and v not in (None, ""):
            out[col] = v
    return out


@app.route("/api/hello")
def hello():
    return jsonify(message="Uniera backend is running!")


# ================= AUTH =================

@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json() or {}
    conn = db()
    cur = conn.cursor()
    cols = table_columns(cur, "signup")

    pwd_col = next((c for c in cols if "pass" in c.lower()), None)
    email_col = next((c for c in cols if "mail" in c.lower()), None)
    raw_pwd = data.get("password") or data.get("Password")

    payload = match_payload(data, cols)
    payload.pop(pwd_col, None)
    if pwd_col and raw_pwd:
        payload[pwd_col] = generate_password_hash(raw_pwd)

    if email_col and payload.get(email_col):
        cur.execute(f"SELECT * FROM signup WHERE {email_col}=%s", (payload[email_col],))
        if cur.fetchone():
            cur.close()
            conn.close()
            return jsonify({"error": "An account with this email already exists"}), 409

    fields = ", ".join(payload.keys())
    marks = ", ".join(["%s"] * len(payload))
    try:
        cur.execute(f"INSERT INTO signup ({fields}) VALUES ({marks})", list(payload.values()))
        conn.commit()
        uid = cur.lastrowid
    except mysql.connector.Error as e:
        cur.close()
        conn.close()
        return jsonify({"error": str(e)}), 400
    cur.close()
    conn.close()
    return jsonify({"message": "Account created successfully", "user_id": uid}), 201


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")

    conn = db()
    cur = conn.cursor(dictionary=True)
    cols = table_columns(conn.cursor(), "signup")
    email_col = next((c for c in cols if "mail" in c.lower()), "email")
    pwd_col = next((c for c in cols if "pass" in c.lower()), "password")
    id_col = cols[0]

    cur.execute(f"SELECT * FROM signup WHERE {email_col}=%s", (email,))
    user = cur.fetchone()
    cur.close()
    conn.close()

    if not user:
        return jsonify({"error": "No account found with this email"}), 404

    stored = user.get(pwd_col) or ""
    if stored.startswith(("pbkdf2:", "scrypt:")):
        ok = check_password_hash(stored, password)
    else:
        ok = (stored == password)
    if not ok:
        return jsonify({"error": "Incorrect password"}), 401

    uid = user.get(id_col)
    conn = db()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT COUNT(*) AS c FROM enroll WHERE user_id=%s", (uid,))
    has_profile = cur.fetchone()["c"] > 0
    paid = is_paid(cur, uid)
    cur.close()
    conn.close()

    name_col = next((c for c in cols if "name" in c.lower()), None)
    return jsonify({
        "message": "Login successful",
        "user_id": uid,
        "name": user.get(name_col) if name_col else "",
        "email": email,
        "has_profile": has_profile,
        "is_paid": paid,
        "is_enrolled": has_profile and paid,
    }), 200


@app.route("/enroll", methods=["POST"])
def enroll():
    data = request.form.to_dict() if request.form else (request.get_json() or {})
    conn = db()
    cur = conn.cursor()
    cols = table_columns(cur, "enroll")

    for key, file in request.files.items():
        if file and file.filename:
            try:
                data[key] = save_upload(file, f"u{data.get('user_id', 'x')}_{key}")
            except ValueError as e:
                cur.close()
                conn.close()
                return jsonify({"error": str(e)}), 400
    if data.get("declaration_agreed") in ("true", True, "on"):
        data["declaration_agreed"] = "Yes"

    payload = match_payload(data, cols)
    if not payload:
        cur.close()
        conn.close()
        return jsonify({"error": "No matching fields received"}), 400
    # editing the profile: keep previously uploaded files that were not replaced
    if data.get("user_id"):
        dcur = conn.cursor(dictionary=True)
        dcur.execute(f"SELECT * FROM enroll WHERE user_id=%s ORDER BY {cols[0]} DESC LIMIT 1", (data["user_id"],))
        prev = dcur.fetchone() or {}
        dcur.close()
        for c in cols:
            if c.endswith("_file") and c not in payload and prev.get(c):
                payload[c] = prev[c]

    fields = ", ".join(payload.keys())
    marks = ", ".join(["%s"] * len(payload))
    try:
        cur.execute(f"INSERT INTO enroll ({fields}) VALUES ({marks})", list(payload.values()))
        conn.commit()
        eid = cur.lastrowid
    except mysql.connector.Error as e:
        cur.close()
        conn.close()
        return jsonify({"error": str(e)}), 400
    cur.close()
    conn.close()
    return jsonify({"message": "Profile saved. Complete the payment to activate your enrolment.",
                    "enroll_id": eid}), 201


# ================= OPTIONS =================

@app.route("/options", methods=["GET"])
def get_options():
    conn = db()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT city, state, is_regional FROM cities ORDER BY is_regional, city")
    cities = cur.fetchall()
    cur.execute("SELECT level FROM tuition_base")
    levels = [r["level"] for r in cur.fetchall()]
    cur.execute("SELECT DISTINCT field FROM scholarships ORDER BY field")
    fields = [r["field"] for r in cur.fetchall()]
    cur.execute("SELECT DISTINCT uni_tier FROM universities ORDER BY uni_tier")
    tiers = [r["uni_tier"] for r in cur.fetchall()]
    cur.close()
    conn.close()
    return jsonify({"cities": cities, "levels": levels, "fields": fields, "tiers": tiers}), 200


# ================= SCHOLARSHIPS =================

@app.route("/scholarships", methods=["GET"])
def get_scholarships():
    level = request.args.get("level")
    field = request.args.get("field")
    tier = request.args.get("tier")
    city = request.args.get("city")

    sql = """SELECT s.scholarship_id, s.name, s.level, s.field, s.amount_aud,
                    s.coverage, s.min_percentage, s.min_ielts, s.deadline,
                    s.apply_link, s.description,
                    IFNULL(u.name,'Government of Australia') AS university,
                    IFNULL(u.city,'Nationwide') AS city,
                    IFNULL(u.uni_tier,'Government') AS uni_tier
             FROM scholarships s
             LEFT JOIN universities u ON s.university_id = u.university_id
             WHERE 1=1"""
    params = []
    if level and level != "All":
        sql += " AND s.level=%s"
        params.append(level)
    if field and field != "All":
        sql += " AND s.field=%s"
        params.append(field)
    if tier and tier != "All":
        sql += " AND u.uni_tier=%s"
        params.append(tier)
    if city and city != "All":
        sql += " AND u.city=%s"
        params.append(city)
    sql += " ORDER BY s.amount_aud DESC"

    conn = db()
    cur = conn.cursor(dictionary=True)
    cur.execute(sql, params)
    rows = cur.fetchall()
    cur.close()
    conn.close()
    for r in rows:
        r["deadline"] = r["deadline"].strftime("%d %b %Y") if r["deadline"] else "Rolling"
        r["min_percentage"] = float(r["min_percentage"])
        r["min_ielts"] = float(r["min_ielts"])
    return jsonify({"count": len(rows), "scholarships": rows}), 200


# ================= ELIGIBILITY =================

@app.route("/check-eligibility", methods=["POST"])
def check_eligibility():
    data = request.get_json() or {}
    try:
        pct = float(data.get("percentage", 0))
        ielts = float(data.get("ielts", 0))
        funds = float(data.get("budget_aud", 0))
        level = data.get("level", "Masters")
    except (TypeError, ValueError):
        return jsonify({"error": "Please enter valid numbers"}), 400

    conn = db()
    cur = conn.cursor(dictionary=True)
    cur.execute("""SELECT uni_tier, min_percentage, min_ielts, min_funds_aud, notes
                   FROM eligibility_criteria WHERE level=%s
                   ORDER BY min_percentage DESC""", (level,))
    criteria = cur.fetchall()

    results = []
    qualified = []
    for c in criteria:
        checks = {
            "Academic %": pct >= float(c["min_percentage"]),
            "IELTS": ielts >= float(c["min_ielts"]),
            "Proof of funds": funds >= float(c["min_funds_aud"]),
        }
        passed = all(checks.values())
        if passed:
            qualified.append(c["uni_tier"])
        results.append({
            "uni_tier": c["uni_tier"],
            "eligible": passed,
            "required": {
                "percentage": float(c["min_percentage"]),
                "ielts": float(c["min_ielts"]),
                "funds_aud": c["min_funds_aud"],
            },
            "checks": checks,
            "notes": c["notes"],
        })

    unis = []
    schols = 0
    if qualified:
        ph = ",".join(["%s"] * len(qualified))
        cur.execute(f"""SELECT name, city, state, uni_tier, website FROM universities
                        WHERE uni_tier IN ({ph}) ORDER BY uni_tier, name""", qualified)
        unis = cur.fetchall()
        cur.execute(f"""SELECT COUNT(*) AS c FROM scholarships s
                        LEFT JOIN universities u ON s.university_id=u.university_id
                        WHERE s.level=%s AND s.min_percentage<=%s AND s.min_ielts<=%s
                          AND (u.uni_tier IN ({ph}) OR s.university_id IS NULL)""",
                    [level, pct, ielts] + qualified)
        schols = cur.fetchone()["c"]

    cur.close()
    conn.close()
    return jsonify({
        "eligible_anywhere": len(qualified) > 0,
        "qualified_tiers": qualified,
        "breakdown": results,
        "matching_universities": unis,
        "matching_scholarship_count": schols,
    }), 200


# ================= COST ESTIMATOR =================

@app.route("/estimate-cost", methods=["POST"])
def estimate_cost():
    data = request.get_json() or {}
    try:
        city = data["city"]
        level = data["level"]
        years = float(data.get("duration_years", 2))
        lifestyle = data.get("lifestyle", "Moderate")
    except (KeyError, TypeError, ValueError):
        return jsonify({"error": "City, level and duration are required"}), 400

    conn = db()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT * FROM cities WHERE city=%s", (city,))
    c = cur.fetchone()
    cur.execute("SELECT * FROM tuition_base WHERE level=%s", (level,))
    t = cur.fetchone()
    cur.execute("SELECT * FROM fixed_costs WHERE id=1")
    f = cur.fetchone()
    if not c or not t or not f:
        cur.close()
        conn.close()
        return jsonify({"error": "No cost data for that combination"}), 404

    idx = float(c["tuition_index"])
    mult = {"Budget": 0.85, "Moderate": 1.0, "Comfortable": 1.25}.get(lifestyle, 1.0)

    tuition_low = round(t["tuition_min_aud"] * idx * years)
    tuition_high = round(t["tuition_max_aud"] * idx * years)
    living = round(c["living_cost_aud"] * mult * years)
    oshc = round(f["oshc_per_year_aud"] * years)
    one_time = f["visa_fee_aud"] + f["airfare_aud"] + f["initial_setup_aud"]

    total_low = tuition_low + living + oshc + one_time
    total_high = tuition_high + living + oshc + one_time

    cur2 = conn.cursor()
    cur2.execute("""INSERT INTO cost_estimates (user_id, city, level, duration_years, total_aud)
                    VALUES (%s,%s,%s,%s,%s)""",
                 (data.get("user_id"), city, level, years, total_high))
    conn.commit()
    eid = cur2.lastrowid
    cur2.close()
    cur.close()
    conn.close()

    return jsonify({
        "estimate_id": eid,
        "city": city,
        "state": c["state"],
        "level": level,
        "duration_years": years,
        "lifestyle": lifestyle,
        "is_regional": bool(c["is_regional"]),
        "breakdown": [
            {"item": f"Tuition ({years} yrs)", "low": tuition_low, "high": tuition_high},
            {"item": f"Living costs ({lifestyle})", "low": living, "high": living},
            {"item": "Health cover (OSHC)", "low": oshc, "high": oshc},
            {"item": "Visa + airfare + setup", "low": one_time, "high": one_time},
        ],
        "total_low_aud": total_low,
        "total_high_aud": total_high,
        "total_low_inr": round(total_low * 55),
        "total_high_inr": round(total_high * 55),
    }), 200


if __name__ == "__main__":
    app.run(debug=True, port=5000)