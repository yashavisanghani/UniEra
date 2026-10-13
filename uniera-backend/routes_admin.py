"""Consultancy / counsellor side: review applications, verify documents,
send to university and record the university's decision."""
import os
from functools import wraps
from flask import Blueprint, request, jsonify, current_app, g
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from werkzeug.security import check_password_hash
from db import db, clean, clean_all, get_user, latest_enroll, save_upload
from workflow import (NEXT_STATUSES, ALL_STATUSES, DOC_LABEL, STUDENT_MESSAGE, STATUS_STAGE,
                      notify, add_history)
from routes_applications import application_payload

admin_bp = Blueprint("admin", __name__, url_prefix="/admin")


def serializer():
    return URLSafeTimedSerializer(current_app.config["SECRET_KEY"], salt="uniera-staff")


def staff_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        token = (request.headers.get("Authorization") or "").replace("Bearer ", "")
        try:
            g.staff = serializer().loads(token, max_age=60 * 60 * 12)
        except (BadSignature, SignatureExpired):
            return jsonify(error="Please log in as consultancy staff"), 401
        return fn(*args, **kwargs)
    return wrapper


@admin_bp.route("/login", methods=["POST"])
def admin_login():
    data = request.get_json() or {}
    conn = db()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT * FROM staff_users WHERE email=%s", (data.get("email"),))
    s = cur.fetchone()
    cur.close()
    conn.close()
    if not s or not check_password_hash(s["password_hash"], data.get("password") or ""):
        return jsonify(error="Invalid staff email or password"), 401
    token = serializer().dumps({"staff_id": s["staff_id"], "name": s["name"], "role": s["role"]})
    return jsonify(token=token, name=s["name"], role=s["role"])


@admin_bp.route("/stats", methods=["GET"])
@staff_required
def stats():
    conn = db()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT status, COUNT(*) AS c FROM applications GROUP BY status")
    by_status = {r["status"]: r["c"] for r in cur.fetchall()}
    cur.execute("SELECT COUNT(*) AS c FROM signup")
    students = cur.fetchone()["c"]
    cur.execute("SELECT COUNT(DISTINCT user_id) AS c FROM payments WHERE purpose='Enrollment' AND status='Success'")
    enrolled = cur.fetchone()["c"]
    cur.execute("SELECT COALESCE(SUM(amount_inr),0) AS t FROM payments WHERE status='Success'")
    revenue = int(cur.fetchone()["t"])
    cur.execute("SELECT COUNT(*) AS c FROM loan_applications WHERE status NOT IN ('Disbursed','Rejected')")
    open_loans = cur.fetchone()["c"]
    cur.execute("SELECT COUNT(*) AS c FROM enquiries WHERE status='New'")
    new_enquiries = cur.fetchone()["c"]
    cur.execute("""SELECT COUNT(*) AS c FROM application_documents d JOIN applications a
                   ON a.application_id=d.application_id
                   WHERE d.status='Pending' AND a.status NOT IN ('Withdrawn','Rejected')""")
    pending_docs = cur.fetchone()["c"]
    cur.execute("""SELECT u.name, COUNT(*) AS c FROM applications a JOIN universities u
                   ON u.university_id=a.university_id GROUP BY u.name ORDER BY c DESC LIMIT 5""")
    top_unis = cur.fetchall()
    cur.close()
    conn.close()
    total = sum(by_status.values())
    return jsonify(
        total_applications=total, students=students, enrolled=enrolled, pending_documents=pending_docs,
        revenue_inr=revenue, open_loans=open_loans, new_enquiries=new_enquiries,
        new=by_status.get("Submitted", 0),
        in_review=by_status.get("Under Review", 0) + by_status.get("Documents Requested", 0)
        + by_status.get("Documents Verified", 0),
        awaiting_university=by_status.get("Sent to University", 0),
        offers=sum(by_status.get(s, 0) for s in ("Conditional Offer", "Unconditional Offer", "Offer Accepted",
                                                  "CoE Issued", "Visa Lodged", "Visa Granted")),
        by_status=by_status, top_universities=top_unis, statuses=ALL_STATUSES)


@admin_bp.route("/applications", methods=["GET"])
@staff_required
def admin_applications():
    status = request.args.get("status")
    search = (request.args.get("search") or "").strip()
    conn = db()
    cur = conn.cursor(dictionary=True)
    cur.execute("SHOW COLUMNS FROM signup")
    cols = [r["Field"] for r in cur.fetchall()]
    id_col = cols[0]
    name_col = next((c for c in cols if "name" in c.lower()), id_col)
    email_col = next((c for c in cols if "mail" in c.lower()), id_col)
    sql = f"""SELECT a.application_id, a.app_ref, a.course_name, a.level, a.intake, a.status,
                     a.eligibility_result, a.created_at, a.updated_at,
                     u.name AS university, u.city,
                     s.{name_col} AS student_name, s.{email_col} AS student_email,
                     (SELECT COUNT(*) FROM application_documents d WHERE d.application_id=a.application_id
                        AND d.status='Pending') AS pending_docs
              FROM applications a
              JOIN universities u ON u.university_id=a.university_id
              LEFT JOIN signup s ON s.{id_col}=a.user_id WHERE 1=1"""
    params = []
    if status and status != "All":
        sql += " AND a.status=%s"
        params.append(status)
    if search:
        sql += f" AND (a.app_ref LIKE %s OR s.{name_col} LIKE %s OR u.name LIKE %s OR a.course_name LIKE %s)"
        params += [f"%{search}%"] * 4
    sql += " ORDER BY a.updated_at DESC"
    cur.execute(sql, params)
    rows = clean_all(cur.fetchall())
    cur.close()
    conn.close()
    return jsonify(applications=rows)


@admin_bp.route("/applications/<int:app_id>", methods=["GET"])
@staff_required
def admin_application(app_id):
    conn = db()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT * FROM applications WHERE application_id=%s", (app_id,))
    a = cur.fetchone()
    if not a:
        cur.close()
        conn.close()
        return jsonify(error="Application not found"), 404
    out = application_payload(cur, a)
    out["student"] = get_user(cur, a["user_id"])
    out["profile"] = clean(latest_enroll(cur, a["user_id"]))
    out["next_statuses"] = NEXT_STATUSES.get(a["status"], [])
    cur.close()
    conn.close()
    return jsonify(out)


@admin_bp.route("/applications/<int:app_id>/status", methods=["POST"])
@staff_required
def update_status(app_id):
    data = request.get_json() or {}
    new = data.get("status")
    remarks = (data.get("remarks") or "").strip()
    if new not in ALL_STATUSES:
        return jsonify(error="Unknown status"), 400
    conn = db()
    cur = conn.cursor(dictionary=True)
    try:
        cur.execute("SELECT * FROM applications WHERE application_id=%s", (app_id,))
        a = cur.fetchone()
        if not a:
            return jsonify(error="Application not found"), 404
        if new == "Documents Verified":
            cur.execute("""SELECT doc_type FROM application_documents WHERE application_id=%s
                           AND status IN ('Pending','Rejected')""", (app_id,))
            left = [DOC_LABEL.get(r["doc_type"], r["doc_type"]) for r in cur.fetchall()]
            if left:
                return jsonify(error="Verify all documents first. Not yet verified: " + ", ".join(left)), 400
        if new == "Documents Requested" and not remarks:
            return jsonify(error="Tell the student which documents are needed (remarks)"), 400
        cur.execute("UPDATE applications SET status=%s WHERE application_id=%s", (new, app_id))
        add_history(cur, app_id, new, remarks or None, g.staff["name"])
        notify(cur, a["user_id"], f"{a['app_ref']}: {new}",
               (remarks + " — " if remarks else "") + STUDENT_MESSAGE.get(new, ""), app_id)
        conn.commit()
        return jsonify(message=f"Status updated to {new}", status=new)
    finally:
        cur.close()
        conn.close()


@admin_bp.route("/documents/<int:doc_id>", methods=["POST"])
@staff_required
def review_document(doc_id):
    data = request.get_json() or {}
    status = data.get("status")
    if status not in ("Verified", "Rejected", "Pending"):
        return jsonify(error="Status must be Verified or Rejected"), 400
    conn = db()
    cur = conn.cursor(dictionary=True)
    try:
        cur.execute("""SELECT d.*, a.app_ref, a.status AS app_status FROM application_documents d
                       JOIN applications a ON a.application_id=d.application_id WHERE d.doc_id=%s""", (doc_id,))
        d = cur.fetchone()
        if not d:
            return jsonify(error="Document not found"), 404
        cur.execute("UPDATE application_documents SET status=%s, remarks=%s WHERE doc_id=%s",
                    (status, data.get("remarks") or None, doc_id))
        label = DOC_LABEL.get(d["doc_type"], d["doc_type"])
        add_history(cur, d["application_id"], d["app_status"],
                    f"{label} marked {status}" + (f": {data.get('remarks')}" if data.get("remarks") else ""),
                    g.staff["name"])
        if status == "Rejected":
            notify(cur, d["user_id"], f"{d['app_ref']}: document needs attention",
                   f"Your {label} was not accepted. " + (data.get("remarks") or "Please upload a clearer copy."),
                   d["application_id"])
        if d["app_status"] == "Submitted":
            cur.execute("UPDATE applications SET status='Under Review' WHERE application_id=%s",
                        (d["application_id"],))
            add_history(cur, d["application_id"], "Under Review", "Counsellor started reviewing documents",
                        g.staff["name"])
        conn.commit()
        return jsonify(message=f"{label} marked {status}")
    finally:
        cur.close()
        conn.close()


@admin_bp.route("/applications/<int:app_id>/decision", methods=["POST"])
@staff_required
def university_decision(app_id):
    decision = request.form.get("decision")
    response = (request.form.get("response") or "").strip()
    if decision not in ("Conditional Offer", "Unconditional Offer", "Rejected"):
        return jsonify(error="Choose the university's decision"), 400
    conn = db()
    cur = conn.cursor(dictionary=True)
    try:
        cur.execute("SELECT a.*, u.name AS uni FROM applications a JOIN universities u "
                    "ON u.university_id=a.university_id WHERE application_id=%s", (app_id,))
        a = cur.fetchone()
        if not a:
            return jsonify(error="Application not found"), 404
        if a["status"] not in ("Sent to University", "Conditional Offer"):
            return jsonify(error="Send the application to the university first"), 400
        letter = None
        if request.files.get("offer_letter"):
            try:
                letter = save_upload(request.files["offer_letter"], f"u{a['user_id']}_offer")
            except ValueError as e:
                return jsonify(error=str(e)), 400
        cur.execute("""UPDATE applications SET status=%s, university_response=%s,
                       offer_letter_file=COALESCE(%s, offer_letter_file) WHERE application_id=%s""",
                    (decision, response or None, letter, app_id))
        add_history(cur, app_id, decision, f"University decision recorded. {response}".strip(), g.staff["name"])
        title = "🎉 Offer received!" if decision != "Rejected" else "University decision"
        notify(cur, a["user_id"], f"{a['app_ref']}: {title}",
               f"{a['uni']} — {decision}. {response}".strip(), app_id)
        conn.commit()
        return jsonify(message=f"Decision recorded: {decision}")
    finally:
        cur.close()
        conn.close()


@admin_bp.route("/students", methods=["GET"])
@staff_required
def students():
    conn = db()
    cur = conn.cursor(dictionary=True)
    cur.execute("SHOW COLUMNS FROM signup")
    cols = [r["Field"] for r in cur.fetchall()]
    safe = [c for c in cols if "pass" not in c.lower()]
    cur.execute(f"SELECT {', '.join(safe)} FROM signup ORDER BY {cols[0]} DESC")
    users = clean_all(cur.fetchall())
    cur.execute("SELECT DISTINCT user_id FROM enroll")
    enrolled = {r["user_id"] for r in cur.fetchall()}
    cur.execute("SELECT user_id, COUNT(*) AS c FROM applications GROUP BY user_id")
    counts = {r["user_id"]: r["c"] for r in cur.fetchall()}
    cur.execute("SELECT user_id, package FROM payments WHERE purpose='Enrollment' AND status='Success'")
    paid = {r["user_id"]: r["package"] for r in cur.fetchall()}
    for u in users:
        uid = u[cols[0]]
        u["user_id"] = uid
        u["has_profile"] = uid in enrolled
        u["package"] = paid.get(uid)
        u["is_enrolled"] = uid in paid
        u["applications"] = counts.get(uid, 0)
    cur.close()
    conn.close()
    return jsonify(students=users)


# ---------------------------------------------------------------- consultancy services
@admin_bp.route("/services", methods=["GET"])
@staff_required
def services_overview():
    """Payments, loan requests, test-prep and accommodation bookings, enquiries — one call."""
    conn = db()
    cur = conn.cursor(dictionary=True)
    cur.execute("SHOW COLUMNS FROM signup")
    cols = [r["Field"] for r in cur.fetchall()]
    id_col = cols[0]
    name_col = next((c for c in cols if "name" in c.lower()), id_col)
    join = f"LEFT JOIN signup s ON s.{id_col}=x.user_id"
    out = {}
    for key, table in (("payments", "payments"), ("loans", "loan_applications"),
                       ("test_prep", "test_prep_bookings"), ("accommodation", "accommodation_bookings")):
        cur.execute(f"SELECT x.*, s.{name_col} AS student_name FROM {table} x {join} ORDER BY 1 DESC LIMIT 200")
        out[key] = clean_all(cur.fetchall())
    cur.execute("SELECT * FROM enquiries ORDER BY enquiry_id DESC LIMIT 200")
    out["enquiries"] = clean_all(cur.fetchall())
    cur.execute("SELECT COALESCE(SUM(amount_inr),0) t FROM payments WHERE status='Success'")
    out["revenue_inr"] = int(cur.fetchone()["t"])
    cur.close()
    conn.close()
    return jsonify(out)


LOAN_STATUSES = ["Submitted", "Documents Collected", "Shared with Lender", "Sanctioned", "Disbursed", "Rejected"]


@admin_bp.route("/loans/<int:loan_id>", methods=["POST"])
@staff_required
def update_loan(loan_id):
    d = request.get_json() or {}
    if d.get("status") not in LOAN_STATUSES:
        return jsonify(error="Unknown loan status"), 400
    conn = db()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT * FROM loan_applications WHERE loan_id=%s", (loan_id,))
    l = cur.fetchone()
    if not l:
        cur.close()
        conn.close()
        return jsonify(error="Loan request not found"), 404
    cur.execute("UPDATE loan_applications SET status=%s, remarks=%s WHERE loan_id=%s",
                (d["status"], d.get("remarks") or l["remarks"], loan_id))
    notify(cur, l["user_id"], f"{l['loan_ref']}: {d['status']}",
           f"Your education loan with {l['lender']} is now '{d['status']}'. {d.get('remarks') or ''}".strip())
    conn.commit()
    cur.close()
    conn.close()
    return jsonify(message="Loan updated")


@admin_bp.route("/accommodation/<int:booking_id>", methods=["POST"])
@staff_required
def update_accommodation(booking_id):
    d = request.get_json() or {}
    if d.get("status") not in ("Requested", "Confirmed", "Cancelled"):
        return jsonify(error="Unknown status"), 400
    conn = db()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT * FROM accommodation_bookings WHERE booking_id=%s", (booking_id,))
    b = cur.fetchone()
    if not b:
        cur.close()
        conn.close()
        return jsonify(error="Booking not found"), 404
    cur.execute("UPDATE accommodation_bookings SET status=%s WHERE booking_id=%s", (d["status"], booking_id))
    notify(cur, b["user_id"], f"Accommodation {d['status'].lower()}",
           f"{b['property_name']} ({b['room_type']}) from {b['move_in']} is {d['status'].lower()}.")
    conn.commit()
    cur.close()
    conn.close()
    return jsonify(message="Booking updated")


@admin_bp.route("/enquiries/<int:eid>", methods=["POST"])
@staff_required
def update_enquiry(eid):
    conn = db()
    cur = conn.cursor()
    cur.execute("UPDATE enquiries SET status=%s WHERE enquiry_id=%s", ((request.get_json() or {}).get("status", "Contacted"), eid))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify(message="Enquiry updated")
