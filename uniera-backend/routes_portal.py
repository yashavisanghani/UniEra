"""Consultancy services: enrolment packages & payments, shortlist/compare,
per-university document checklist, test preparation, education loans,
accommodation, reviews, contact enquiries and public home-page stats."""
import datetime
import random
from flask import Blueprint, request, jsonify
from db import db, clean, clean_all, get_user, latest_enroll, is_paid
from workflow import required_docs, notify
from routes_universities import evaluate, profile_prefill, first_year_cost

portal_bp = Blueprint("portal", __name__)

# ---------------------------------------------------------------- static catalogues
PACKAGES = [
    {"id": "Basic", "price_inr": 25000, "tagline": "Apply to up to 3 universities",
     "features": ["Profile evaluation & counselling", "Up to 3 university applications",
                  "SOP & document review", "Application tracking dashboard", "Chat support"]},
    {"id": "Premium", "price_inr": 45000, "tagline": "Most popular — up to 8 universities", "popular": True,
     "features": ["Everything in Basic", "Up to 8 university applications", "Scholarship applications",
                  "Education loan assistance", "Student visa (subclass 500) filing support",
                  "Pre-departure briefing"]},
    {"id": "Elite", "price_inr": 75000, "tagline": "Unlimited applications + end-to-end support",
     "features": ["Everything in Premium", "Unlimited university applications", "Dedicated senior counsellor",
                  "Free IELTS/PTE online batch", "Accommodation & airport pickup assistance",
                  "Post-arrival support"]},
]
PACKAGE_LIMIT = {"Basic": 3, "Premium": 8, "Elite": 999}

TEST_BATCHES = [
    # test, mode, batch name, centre, weeks, fee
    ("IELTS", "Online", "IELTS Weekday Evening (Mon–Fri, 7–9 pm)", "Live online classroom", 6, 12000),
    ("IELTS", "Online", "IELTS Weekend Intensive (Sat–Sun, 10 am–1 pm)", "Live online classroom", 5, 11000),
    ("IELTS", "Offline", "IELTS Classroom Morning (Mon–Fri, 9–11 am)", "UniEra Centre – Ahmedabad", 6, 15000),
    ("IELTS", "Offline", "IELTS Classroom Evening (Mon–Fri, 6–8 pm)", "UniEra Centre – Mumbai", 6, 16000),
    ("PTE", "Online", "PTE Academic Fast-track (Mon–Sat, 8–10 pm)", "Live online classroom", 4, 10000),
    ("PTE", "Offline", "PTE Academic Classroom (Mon–Fri, 4–6 pm)", "UniEra Centre – Pune", 4, 13000),
    ("TOEFL", "Online", "TOEFL iBT Weekend (Sat–Sun, 5–8 pm)", "Live online classroom", 6, 12500),
    ("Duolingo", "Online", "Duolingo English Test Crash Course", "Self-paced + 4 live sessions", 2, 5000),
    ("GRE", "Online", "GRE Quant & Verbal (Tue/Thu/Sat, 7–9 pm)", "Live online classroom", 8, 18000),
    ("GMAT", "Offline", "GMAT Focus Classroom (Weekends)", "UniEra Centre – Ahmedabad", 8, 22000),
]

# Indicative figures only — rates change; students must confirm with the lender.
LENDERS = [
    {"name": "State Bank of India – Global Ed-Vantage", "type": "Public bank", "rate": 10.15,
     "max_inr": 30000000, "collateral": "Required above ₹7.5 lakh", "processing": "₹10,000",
     "tenure_years": 15},
    {"name": "Bank of Baroda – Baroda Scholar", "type": "Public bank", "rate": 10.40, "max_inr": 15000000,
     "collateral": "Required above ₹7.5 lakh", "processing": "Nil for premier institutes", "tenure_years": 15},
    {"name": "HDFC Credila", "type": "NBFC", "rate": 11.25, "max_inr": 10000000,
     "collateral": "Optional (higher rate without)", "processing": "Up to 1%", "tenure_years": 14},
    {"name": "Avanse Financial Services", "type": "NBFC", "rate": 11.50, "max_inr": 10000000,
     "collateral": "Optional", "processing": "Up to 1.5%", "tenure_years": 12},
    {"name": "Auxilo Finserve", "type": "NBFC", "rate": 11.75, "max_inr": 8000000,
     "collateral": "Optional", "processing": "Up to 1.5%", "tenure_years": 12},
    {"name": "InCred Finance", "type": "NBFC", "rate": 12.00, "max_inr": 7500000,
     "collateral": "Not required for top universities", "processing": "Up to 1.5%", "tenure_years": 12},
]

ROOMS = [("Shared room (twin)", 0.75), ("Private studio", 1.35), ("Ensuite room", 1.0)]
PROPERTY_TYPES = ["Student Residence", "Homestay Network", "Shared Apartment", "Campus Village"]


def properties_for(cur, city=None):
    cur.execute("SELECT city, state, living_cost_aud, is_regional FROM cities ORDER BY city")
    out = []
    pid = 1
    for c in cur.fetchall():
        base = int(c["living_cost_aud"]) / 52 * 0.45  # rent ~45% of living cost
        for i, ptype in enumerate(PROPERTY_TYPES[:3] if not c["is_regional"] else PROPERTY_TYPES[:2]):
            out.append({
                "property_id": pid,
                "name": f"UniEra Partner {ptype} – {c['city']}",
                "city": c["city"], "state": c["state"], "type": ptype,
                "distance": ["5 min walk to campus", "15 min by tram/bus", "10 min by bus"][i % 3],
                "amenities": [["Wi-Fi", "Study rooms", "Gym", "Laundry", "24/7 security"],
                              ["Meals included", "Wi-Fi", "Family environment", "Airport pickup"],
                              ["Wi-Fi", "Furnished", "Shared kitchen", "Bills included"]][i % 3],
                "rooms": [{"room_type": r, "weekly_rent_aud": int(round(base * m * (1 + 0.08 * i) / 5) * 5)}
                          for r, m in ROOMS],
            })
            pid += 1
    if city and city != "All":
        out = [p for p in out if p["city"] == city]
    return out


def invoice_no():
    return f"INV-{datetime.date.today():%Y%m}-{random.randint(10000, 99999)}"


def txn_ref():
    return "TXN" + datetime.datetime.now().strftime("%y%m%d%H%M%S") + str(random.randint(100, 999))


def make_payment(cur, user_id, purpose, amount, method, detail, package=None):
    ref, inv = txn_ref(), invoice_no()
    cur.execute("""INSERT INTO payments (user_id, purpose, package, amount_inr, method, method_detail, status,
                   txn_ref, invoice_no) VALUES (%s,%s,%s,%s,%s,%s,'Success',%s,%s)""",
                (user_id, purpose, package, amount, method, detail, ref, inv))
    return cur.lastrowid, ref, inv


def validate_method(data):
    method = data.get("method")
    if method == "UPI":
        upi = (data.get("upi_id") or "").strip()
        if "@" not in upi or len(upi) < 5:
            return None, "Enter a valid UPI ID (e.g. name@okaxis)"
        return ("UPI", upi), None
    if method == "Card":
        num = "".join(ch for ch in str(data.get("card_number") or "") if ch.isdigit())
        if len(num) < 12 or not data.get("card_name") or not data.get("expiry") or len(str(data.get("cvv") or "")) < 3:
            return None, "Enter valid card details"
        return ("Card", "Card ending " + num[-4:]), None
    if method == "NetBanking":
        if not data.get("bank"):
            return None, "Choose your bank"
        return ("NetBanking", data["bank"]), None
    return None, "Choose a payment method"


# ---------------------------------------------------------------- public
@portal_bp.route("/public/stats", methods=["GET"])
def public_stats():
    conn = db()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT COUNT(*) c FROM universities")
    unis = cur.fetchone()["c"]
    cur.execute("SELECT COUNT(*) c FROM scholarships")
    schols = cur.fetchone()["c"]
    cur.execute("SELECT COUNT(*) c FROM courses")
    courses = cur.fetchone()["c"]
    cur.execute("SELECT COUNT(DISTINCT city) c FROM universities")
    cities = cur.fetchone()["c"]
    cur.execute("""SELECT u.university_id, u.name, u.city, u.state, u.uni_tier, u.website
                   FROM universities u ORDER BY FIELD(u.uni_tier,'Group of Eight','Mid-tier','Regional'), u.name""")
    partners = cur.fetchall()
    cur.execute("SELECT review_id, name, rating, comment, university, created_at FROM reviews WHERE approved=1 "
                "ORDER BY review_id DESC LIMIT 9")
    reviews = clean_all(cur.fetchall())
    cur.execute("SELECT AVG(rating) a, COUNT(*) c FROM reviews WHERE approved=1")
    r = cur.fetchone()
    cur.close()
    conn.close()
    return jsonify(universities=unis, scholarships=schols, courses=courses, cities=cities, partners=partners,
                   reviews=reviews, avg_rating=float(r["a"] or 0), review_count=r["c"], packages=PACKAGES)


@portal_bp.route("/packages", methods=["GET"])
def packages():
    return jsonify(packages=PACKAGES)


@portal_bp.route("/enquiries", methods=["POST"])
def enquiry():
    d = request.get_json() or {}
    if not d.get("name") or not d.get("email") or not d.get("message"):
        return jsonify(error="Name, email and message are required"), 400
    conn = db()
    cur = conn.cursor()
    cur.execute("INSERT INTO enquiries (name, email, phone, message) VALUES (%s,%s,%s,%s)",
                (d["name"], d["email"], d.get("phone"), d["message"]))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify(message="Thanks! A UniEra counsellor will contact you within 24 hours."), 201


@portal_bp.route("/universities/<int:uid>/requirements", methods=["GET"])
def uni_requirements(uid):
    """Document checklist for a university — public, so students can explore before enrolling."""
    level = request.args.get("level") or "Masters"
    course_id = request.args.get("course_id")
    user_id = request.args.get("user_id")
    conn = db()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT * FROM universities WHERE university_id=%s", (uid,))
    uni = cur.fetchone()
    if not uni:
        cur.close()
        conn.close()
        return jsonify(error="University not found"), 404
    course = None
    if course_id:
        cur.execute("SELECT * FROM courses WHERE course_id=%s", (course_id,))
        course = cur.fetchone()
        if course:
            level = course["level"]
    enroll = latest_enroll(cur, user_id) if user_id else None
    docs = required_docs(uni, level, course["name"] if course else None, enroll)
    for d in docs:
        d["in_profile"] = bool(enroll and d["profile_col"] and enroll.get(d["profile_col"]))
    cur.close()
    conn.close()
    return jsonify(university=uni["name"], level=level, course=course["name"] if course else None, documents=docs)


# ---------------------------------------------------------------- enrolment + payments
@portal_bp.route("/enrollment/status/<int:user_id>", methods=["GET"])
def enrollment_status(user_id):
    conn = db()
    cur = conn.cursor(dictionary=True)
    e = latest_enroll(cur, user_id)
    paid = is_paid(cur, user_id)
    cur.execute("""SELECT * FROM payments WHERE user_id=%s AND purpose='Enrollment' AND status='Success'
                   ORDER BY payment_id DESC LIMIT 1""", (user_id,))
    p = clean(cur.fetchone())
    cur.close()
    conn.close()
    return jsonify(has_profile=e is not None, is_paid=paid, is_enrolled=paid and e is not None,
                   package=p["package"] if p else None, payment=p)


@portal_bp.route("/payments/enrollment", methods=["POST"])
def pay_enrollment():
    d = request.get_json() or {}
    user_id = d.get("user_id")
    pkg = next((p for p in PACKAGES if p["id"] == d.get("package")), None)
    if not user_id or not pkg:
        return jsonify(error="Choose a package"), 400
    m, err = validate_method(d)
    if err:
        return jsonify(error=err), 400
    conn = db()
    cur = conn.cursor(dictionary=True)
    try:
        if not get_user(cur, user_id):
            return jsonify(error="Please log in again"), 401
        if not latest_enroll(cur, user_id):
            return jsonify(error="Please complete your enrolment profile first"), 400
        if is_paid(cur, user_id):
            return jsonify(error="You are already enrolled with UniEra"), 409
        gst = round(pkg["price_inr"] * 0.18)
        pid, ref, inv = make_payment(cur, user_id, "Enrollment", pkg["price_inr"] + gst, m[0], m[1], pkg["id"])
        notify(cur, user_id, "Welcome to UniEra 🎉",
               f"Your {pkg['id']} package is active (payment {ref}). You can now shortlist universities and apply.")
        conn.commit()
        return jsonify(message="Payment successful", payment_id=pid, txn_ref=ref, invoice_no=inv,
                       amount_inr=pkg["price_inr"] + gst, package=pkg["id"]), 201
    finally:
        cur.close()
        conn.close()


@portal_bp.route("/payments/<int:user_id>", methods=["GET"])
def list_payments(user_id):
    conn = db()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT * FROM payments WHERE user_id=%s ORDER BY payment_id DESC", (user_id,))
    rows = clean_all(cur.fetchall())
    user = get_user(cur, user_id)
    cur.close()
    conn.close()
    return jsonify(payments=rows, user=user)


# ---------------------------------------------------------------- shortlist + compare
@portal_bp.route("/shortlist/<int:user_id>", methods=["GET"])
def get_shortlist(user_id):
    conn = db()
    cur = conn.cursor(dictionary=True)
    cur.execute("""SELECT s.shortlist_id, u.university_id, u.name, u.city, u.state, u.uni_tier, u.website,
                          d.intakes, d.known_for,
                          (SELECT MIN(annual_fee_aud) FROM courses c WHERE c.university_id=u.university_id) min_fee,
                          (SELECT COUNT(*) FROM scholarships x WHERE x.university_id=u.university_id) scholarship_count
                   FROM shortlist s JOIN universities u ON u.university_id=s.item_id
                   LEFT JOIN university_details d ON d.university_id=u.university_id
                   WHERE s.user_id=%s AND s.item_type='university' ORDER BY s.shortlist_id DESC""", (user_id,))
    unis = clean_all(cur.fetchall())
    cur.execute("""SELECT s.shortlist_id, x.scholarship_id, x.name, x.level, x.field, x.amount_aud, x.coverage,
                          x.min_percentage, x.min_ielts, x.deadline, x.apply_link,
                          IFNULL(u.name,'Government of Australia') AS university
                   FROM shortlist s JOIN scholarships x ON x.scholarship_id=s.item_id
                   LEFT JOIN universities u ON u.university_id=x.university_id
                   WHERE s.user_id=%s AND s.item_type='scholarship' ORDER BY s.shortlist_id DESC""", (user_id,))
    schols = clean_all(cur.fetchall())
    cur.close()
    conn.close()
    return jsonify(universities=unis, scholarships=schols,
                   ids={"university": [u["university_id"] for u in unis],
                        "scholarship": [s["scholarship_id"] for s in schols]})


@portal_bp.route("/shortlist", methods=["POST"])
def toggle_shortlist():
    d = request.get_json() or {}
    user_id, itype, iid = d.get("user_id"), d.get("item_type"), d.get("item_id")
    if not user_id or itype not in ("university", "scholarship") or not iid:
        return jsonify(error="Invalid shortlist request"), 400
    conn = db()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT shortlist_id FROM shortlist WHERE user_id=%s AND item_type=%s AND item_id=%s",
                (user_id, itype, iid))
    row = cur.fetchone()
    if row:
        cur.execute("DELETE FROM shortlist WHERE shortlist_id=%s", (row["shortlist_id"],))
        added = False
    else:
        cur.execute("INSERT INTO shortlist (user_id, item_type, item_id) VALUES (%s,%s,%s)", (user_id, itype, iid))
        added = True
    conn.commit()
    cur.close()
    conn.close()
    return jsonify(added=added, message="Added to shortlist" if added else "Removed from shortlist")


@portal_bp.route("/compare/universities", methods=["GET"])
def compare_universities():
    ids = [int(x) for x in (request.args.get("ids") or "").split(",") if x.strip().isdigit()][:4]
    user_id = request.args.get("user_id")
    level = request.args.get("level") or "Masters"
    if len(ids) < 2:
        return jsonify(error="Pick at least 2 universities to compare"), 400
    conn = db()
    cur = conn.cursor(dictionary=True)
    pre = profile_prefill(cur, user_id) if user_id else None
    out = []
    for uid in ids:
        cur.execute("""SELECT u.*, d.established, d.uni_type, d.uni_group, d.intakes, d.known_for
                       FROM universities u LEFT JOIN university_details d ON d.university_id=u.university_id
                       WHERE u.university_id=%s""", (uid,))
        u = cur.fetchone()
        if not u:
            continue
        cur.execute("""SELECT MIN(annual_fee_aud) mn, MAX(annual_fee_aud) mx, COUNT(*) c FROM courses
                       WHERE university_id=%s AND level=%s""", (uid, level))
        f = cur.fetchone()
        cur.execute("SELECT COUNT(*) c, MAX(amount_aud) m FROM scholarships WHERE university_id=%s", (uid,))
        s = cur.fetchone()
        cur.execute("SELECT * FROM eligibility_criteria WHERE level=%s AND uni_tier=%s", (level, u["uni_tier"]))
        c = clean(cur.fetchone())
        cost = first_year_cost(cur, u, f["mn"] or 0)
        elig = None
        if pre and pre.get("percentage") is not None and pre.get("ielts") is not None:
            e = evaluate(cur, u, level, pre["percentage"], pre["ielts"], pre.get("budget_aud") or 0, None, pre)
            elig = e.get("verdict")
        out.append({**clean(u), "fee_min": f["mn"], "fee_max": f["mx"], "courses": f["c"],
                    "scholarships": s["c"], "top_scholarship": s["m"], "criteria": c,
                    "first_year_cost": cost, "your_eligibility": elig,
                    "docs_required": len([d for d in required_docs(u, level) if d["required"]])})
    cur.close()
    conn.close()
    return jsonify(level=level, universities=out)


# ---------------------------------------------------------------- test prep
@portal_bp.route("/test-prep/batches", methods=["GET"])
def batches():
    today = datetime.date.today()
    out = []
    for i, (test, mode, name, centre, weeks, fee) in enumerate(TEST_BATCHES):
        start = today + datetime.timedelta(days=(7 - today.weekday()) % 7 + 7 * (i % 3))
        out.append({"batch_id": i + 1, "test": test, "mode": mode, "batch": name, "centre": centre,
                    "weeks": weeks, "fee_inr": fee, "start_date": start.isoformat(),
                    "seats_left": 4 + (i * 7) % 11})
    return jsonify(batches=out)


@portal_bp.route("/test-prep/book", methods=["POST"])
def book_test_prep():
    d = request.get_json() or {}
    user_id = d.get("user_id")
    try:
        b = TEST_BATCHES[int(d.get("batch_id")) - 1]
    except (TypeError, ValueError, IndexError):
        return jsonify(error="Choose a batch"), 400
    m, err = validate_method(d)
    if err:
        return jsonify(error=err), 400
    conn = db()
    cur = conn.cursor(dictionary=True)
    try:
        if not is_paid(cur, user_id):
            return jsonify(error="Enrol with UniEra to book test preparation"), 402
        start = d.get("start_date") or datetime.date.today().isoformat()
        pid, ref, inv = make_payment(cur, user_id, "Test Prep", b[5], m[0], m[1], f"{b[0]} {b[1]}")
        cur.execute("""INSERT INTO test_prep_bookings (user_id, test_name, mode, batch, centre, start_date, fee_inr,
                       payment_id) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)""",
                    (user_id, b[0], b[1], b[2], b[3], start, b[5], pid))
        notify(cur, user_id, f"{b[0]} batch booked", f"{b[2]} starting {start}. Payment {ref}.")
        conn.commit()
        return jsonify(message="Seat booked!", txn_ref=ref, invoice_no=inv), 201
    finally:
        cur.close()
        conn.close()


@portal_bp.route("/test-prep/bookings/<int:user_id>", methods=["GET"])
def my_bookings(user_id):
    conn = db()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT * FROM test_prep_bookings WHERE user_id=%s ORDER BY booking_id DESC", (user_id,))
    rows = clean_all(cur.fetchall())
    cur.close()
    conn.close()
    return jsonify(bookings=rows)


# ---------------------------------------------------------------- education loans
@portal_bp.route("/loans/lenders", methods=["GET"])
def lenders():
    return jsonify(lenders=LENDERS)


@portal_bp.route("/loans", methods=["POST"])
def apply_loan():
    d = request.get_json() or {}
    user_id = d.get("user_id")
    try:
        amount = int(float(d.get("amount_inr") or 0))
        income = int(float(d.get("co_applicant_income") or 0))
    except ValueError:
        return jsonify(error="Enter valid amounts"), 400
    lender = next((l for l in LENDERS if l["name"] == d.get("lender")), None)
    if not lender or amount <= 0 or not d.get("co_applicant_name"):
        return jsonify(error="Lender, amount and co-applicant details are required"), 400
    if amount > lender["max_inr"]:
        return jsonify(error=f"{lender['name']} lends up to ₹{lender['max_inr']:,}"), 400
    conn = db()
    cur = conn.cursor(dictionary=True)
    try:
        if not is_paid(cur, user_id):
            return jsonify(error="Enrol with UniEra to use loan assistance"), 402
        adm = "Not applied yet"
        if d.get("application_id"):
            cur.execute("SELECT status FROM applications WHERE application_id=%s AND user_id=%s",
                        (d["application_id"], user_id))
            a = cur.fetchone()
            adm = a["status"] if a else adm
        cur.execute("""INSERT INTO loan_applications (user_id, application_id, lender, amount_inr, collateral,
                       co_applicant_name, co_applicant_relation, co_applicant_income, admission_status)
                       VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
                    (user_id, d.get("application_id") or None, lender["name"], amount, d.get("collateral") or "No",
                     d["co_applicant_name"], d.get("co_applicant_relation"), income, adm))
        lid = cur.lastrowid
        ref = f"LN-{datetime.date.today().year}-{lid:04d}"
        cur.execute("UPDATE loan_applications SET loan_ref=%s WHERE loan_id=%s", (ref, lid))
        notify(cur, user_id, "Loan request submitted",
               f"{ref}: ₹{amount:,} with {lender['name']}. Your counsellor will share it with the lender.")
        conn.commit()
        return jsonify(message="Loan request submitted", loan_ref=ref), 201
    finally:
        cur.close()
        conn.close()


@portal_bp.route("/loans/<int:user_id>", methods=["GET"])
def my_loans(user_id):
    conn = db()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT * FROM loan_applications WHERE user_id=%s ORDER BY loan_id DESC", (user_id,))
    rows = clean_all(cur.fetchall())
    cur.close()
    conn.close()
    return jsonify(loans=rows)


# ---------------------------------------------------------------- accommodation
@portal_bp.route("/accommodation", methods=["GET"])
def accommodation():
    conn = db()
    cur = conn.cursor(dictionary=True)
    props = properties_for(cur, request.args.get("city"))
    cur.close()
    conn.close()
    return jsonify(properties=props)


@portal_bp.route("/accommodation/book", methods=["POST"])
def book_accommodation():
    d = request.get_json() or {}
    user_id = d.get("user_id")
    conn = db()
    cur = conn.cursor(dictionary=True)
    try:
        if not is_paid(cur, user_id):
            return jsonify(error="Enrol with UniEra to book accommodation"), 402
        prop = next((p for p in properties_for(cur) if p["property_id"] == int(d.get("property_id") or 0)), None)
        room = next((r for r in (prop or {}).get("rooms", []) if r["room_type"] == d.get("room_type")), None)
        if not prop or not room or not d.get("move_in"):
            return jsonify(error="Choose a property, room type and move-in date"), 400
        weeks = int(d.get("weeks") or 12)
        cur.execute("""INSERT INTO accommodation_bookings (user_id, property_id, property_name, city, room_type,
                       weekly_rent_aud, move_in, weeks) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)""",
                    (user_id, prop["property_id"], prop["name"], prop["city"], room["room_type"],
                     room["weekly_rent_aud"], d["move_in"], weeks))
        notify(cur, user_id, "Accommodation request sent",
               f"{prop['name']} ({room['room_type']}) from {d['move_in']}. We'll confirm availability.")
        conn.commit()
        return jsonify(message="Request sent — your counsellor will confirm availability"), 201
    finally:
        cur.close()
        conn.close()


@portal_bp.route("/accommodation/bookings/<int:user_id>", methods=["GET"])
def my_accommodation(user_id):
    conn = db()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT * FROM accommodation_bookings WHERE user_id=%s ORDER BY booking_id DESC", (user_id,))
    rows = clean_all(cur.fetchall())
    cur.close()
    conn.close()
    return jsonify(bookings=rows)


# ---------------------------------------------------------------- reviews
@portal_bp.route("/reviews", methods=["POST"])
def add_review():
    d = request.get_json() or {}
    user_id = d.get("user_id")
    try:
        rating = int(d.get("rating"))
    except (TypeError, ValueError):
        rating = 0
    if not (1 <= rating <= 5) or len((d.get("comment") or "").strip()) < 10:
        return jsonify(error="Give a rating and at least a short comment"), 400
    conn = db()
    cur = conn.cursor(dictionary=True)
    try:
        if not is_paid(cur, user_id):
            return jsonify(error="Only enrolled students can post reviews"), 402
        u = get_user(cur, user_id)
        cur.execute("INSERT INTO reviews (user_id, name, rating, comment, university) VALUES (%s,%s,%s,%s,%s)",
                    (user_id, u["name"], rating, d["comment"].strip(), d.get("university")))
        conn.commit()
        return jsonify(message="Thanks for your review!"), 201
    finally:
        cur.close()
        conn.close()
