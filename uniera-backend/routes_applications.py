"""Student side: applications, documents, status checker, dashboard, profile, notifications."""
import datetime
from flask import Blueprint, request, jsonify, send_from_directory
from db import db, clean, clean_all, get_user, latest_enroll, save_upload, UPLOAD_FOLDER, is_paid
from workflow import (DOC_LABEL, STUDENT_MESSAGE, STATUS_STAGE, DOC_CATALOGUE,
                      timeline, notify, add_history, required_docs)
from routes_universities import evaluate, profile_prefill
from uni_data import level_key

apps_bp = Blueprint("applications", __name__)

ACTIVE_EXCLUDE = ("Withdrawn", "Rejected")


@apps_bp.route("/uploads/<path:filename>")
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


def doc_checklist(docs, reqs):
    """Latest document of each required type + whether the requirement is met."""
    latest = {}
    for d in docs:
        if d["status"] == "Replaced":
            continue
        latest[d["doc_type"]] = d
    out = []
    listed = set()
    for r in reqs:
        d = latest.get(r["doc_type"])
        listed.add(r["doc_type"])
        out.append({**r, "uploaded": d is not None,
                    "doc_id": d["doc_id"] if d else None,
                    "file_name": d["file_name"] if d else None,
                    "status": d["status"] if d else "Missing",
                    "remarks": d["remarks"] if d else None,
                    "source": d["source"] if d else None})
    for dtype, d in latest.items():  # extra docs the student chose to add
        if dtype not in listed:
            out.append({"doc_type": dtype, "label": DOC_LABEL.get(dtype, dtype), "required": False,
                        "reason": "Additional document", "help": "", "uploaded": True, "doc_id": d["doc_id"],
                        "file_name": d["file_name"], "status": d["status"], "remarks": d["remarks"],
                        "source": d["source"]})
    return out


def application_payload(cur, app_row):
    cur.execute("""SELECT u.university_id, u.name, u.city, u.state, u.uni_tier, u.website
                   FROM universities u WHERE u.university_id=%s""", (app_row["university_id"],))
    uni = cur.fetchone()
    cur.execute("SELECT * FROM application_documents WHERE application_id=%s ORDER BY doc_id",
                (app_row["application_id"],))
    docs = clean_all(cur.fetchall())
    cur.execute("""SELECT * FROM application_status_history WHERE application_id=%s ORDER BY history_id""",
                (app_row["application_id"],))
    history = clean_all(cur.fetchall())
    a = clean(app_row)
    reqs = required_docs(uni, a.get("level"), a.get("course_name"), latest_enroll(cur, a["user_id"]))
    return {
        "application": a,
        "university": clean(uni),
        "documents": docs,
        "checklist": doc_checklist(docs, reqs),
        "history": history,
        "timeline": timeline(a["status"], history),
        "status_message": STUDENT_MESSAGE.get(a["status"], ""),
    }


# ------------------------------------------------------------------ create
@apps_bp.route("/applications", methods=["POST"])
def create_application():
    f = request.form
    user_id = f.get("user_id")
    uni_id = f.get("university_id")
    course_id = f.get("course_id")
    intake = f.get("intake")
    if not user_id or not uni_id or not course_id or not intake:
        return jsonify(error="University, course and intake are required"), 400
    if f.get("declaration") not in ("true", "1", "on", "yes"):
        return jsonify(error="Please accept the declaration before submitting"), 400

    conn = db()
    cur = conn.cursor(dictionary=True)
    try:
        user = get_user(cur, user_id)
        if not user:
            return jsonify(error="Please log in again"), 401
        enroll = latest_enroll(cur, user_id)
        if not enroll:
            return jsonify(error="Please complete your Enroll Now profile before applying"), 400

        cur.execute("SELECT * FROM universities WHERE university_id=%s", (uni_id,))
        uni = cur.fetchone()
        cur.execute("SELECT * FROM courses WHERE course_id=%s AND university_id=%s", (course_id, uni_id))
        course = cur.fetchone()
        if not uni or not course:
            return jsonify(error="Course not found for this university"), 404

        cur.execute(f"""SELECT app_ref FROM applications WHERE user_id=%s AND course_id=%s AND intake=%s
                        AND status NOT IN ('Withdrawn','Rejected')""", (user_id, course_id, intake))
        dup = cur.fetchone()
        if dup:
            return jsonify(error=f"You already applied for this course and intake (ref {dup['app_ref']})"), 409

        if not is_paid(cur, user_id):
            return jsonify(error="Please complete your UniEra enrolment payment before applying"), 402
        from routes_portal import PACKAGE_LIMIT
        cur.execute("""SELECT package FROM payments WHERE user_id=%s AND purpose='Enrollment' AND status='Success'
                       ORDER BY payment_id DESC LIMIT 1""", (user_id,))
        pkg = cur.fetchone()["package"]
        cur.execute("SELECT COUNT(*) AS c FROM applications WHERE user_id=%s AND status<>'Withdrawn'", (user_id,))
        if cur.fetchone()["c"] >= PACKAGE_LIMIT.get(pkg, 3):
            return jsonify(error=f"Your {pkg} package allows {PACKAGE_LIMIT.get(pkg, 3)} applications. "
                                 "Contact your counsellor to upgrade."), 403

        # documents required by THIS university/course; reuse from profile unless a new file is uploaded
        reqs = required_docs(uni, course["level"], course["name"], enroll)
        docs = []
        for dtype in [d[0] for d in DOC_CATALOGUE]:
            file = request.files.get(f"doc_{dtype}")
            if file and file.filename:
                try:
                    name = save_upload(file, f"u{user_id}_{dtype}")
                except ValueError as e:
                    return jsonify(error=str(e)), 400
                docs.append((dtype, name, "upload"))
            else:
                col = next((r["profile_col"] for r in reqs if r["doc_type"] == dtype), None)
                if col and enroll.get(col) and f.get(f"use_profile_{dtype}", "true") != "false":
                    docs.append((dtype, enroll[col], "profile"))
        have = {d[0] for d in docs}
        missing = [r["label"] for r in reqs if r["required"] and r["doc_type"] not in have]
        if missing:
            return jsonify(error="Missing required documents: " + ", ".join(missing), missing=missing), 400

        # eligibility snapshot (does not block the application)
        pre = profile_prefill(cur, user_id) or {}
        elig = evaluate(cur, uni, course["level"], pre.get("percentage"), pre.get("ielts"),
                        pre.get("budget_aud"), course, pre)
        verdict = elig.get("verdict") or "Unknown"

        cur.execute("""INSERT INTO applications (user_id, university_id, course_id, course_name, level, intake,
                       status, eligibility_result, student_note) VALUES (%s,%s,%s,%s,%s,%s,'Submitted',%s,%s)""",
                    (user_id, uni_id, course_id, course["name"], course["level"], intake, verdict,
                     f.get("student_note") or None))
        app_id = cur.lastrowid
        ref = f"UE-{datetime.date.today().year}-{app_id:05d}"
        cur.execute("UPDATE applications SET app_ref=%s WHERE application_id=%s", (ref, app_id))
        for dtype, name, source in docs:
            cur.execute("""INSERT INTO application_documents (application_id, user_id, doc_type, file_name, source)
                           VALUES (%s,%s,%s,%s,%s)""", (app_id, user_id, dtype, name, source))
        add_history(cur, app_id, "Submitted", "Application submitted by student", user["name"] or "Student")
        notify(cur, user_id, "Application submitted",
               f"Your application {ref} for {course['name']} at {uni['name']} was submitted successfully.", app_id)
        conn.commit()
        return jsonify(message="Application submitted successfully", application_id=app_id, app_ref=ref,
                       eligibility=verdict), 201
    finally:
        cur.close()
        conn.close()


# ------------------------------------------------------------------ read
@apps_bp.route("/applications", methods=["GET"])
def list_applications():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify(error="user_id required"), 400
    conn = db()
    cur = conn.cursor(dictionary=True)
    cur.execute("""SELECT a.*, u.name AS university, u.city, u.state, u.uni_tier
                   FROM applications a JOIN universities u ON u.university_id=a.university_id
                   WHERE a.user_id=%s ORDER BY a.application_id DESC""", (user_id,))
    rows = clean_all(cur.fetchall())
    for r in rows:
        r["stage_index"] = STATUS_STAGE.get(r["status"], 0)
        r["status_message"] = STUDENT_MESSAGE.get(r["status"], "")
    cur.close()
    conn.close()
    return jsonify(applications=rows)


@apps_bp.route("/applications/<int:app_id>", methods=["GET"])
def get_application(app_id):
    user_id = request.args.get("user_id")
    conn = db()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT * FROM applications WHERE application_id=%s", (app_id,))
    a = cur.fetchone()
    if not a or str(a["user_id"]) != str(user_id):
        cur.close()
        conn.close()
        return jsonify(error="Application not found"), 404
    out = application_payload(cur, a)
    cur.close()
    conn.close()
    return jsonify(out)


@apps_bp.route("/applications/track", methods=["GET"])
def track_application():
    """Public status checker: reference number + registered email."""
    ref = (request.args.get("ref") or "").strip().upper()
    email = (request.args.get("email") or "").strip().lower()
    if not ref or not email:
        return jsonify(error="Enter your application reference and registered email"), 400
    conn = db()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT * FROM applications WHERE app_ref=%s", (ref,))
    a = cur.fetchone()
    user = get_user(cur, a["user_id"]) if a else None
    if not a or not user or (user["email"] or "").lower() != email:
        cur.close()
        conn.close()
        return jsonify(error="No application found with that reference and email"), 404
    out = application_payload(cur, a)
    out.pop("documents", None)
    cur.close()
    conn.close()
    return jsonify(out)


# ------------------------------------------------------------------ student actions
@apps_bp.route("/applications/<int:app_id>/documents", methods=["POST"])
def upload_document(app_id):
    user_id = request.form.get("user_id")
    dtype = request.form.get("doc_type")
    file = request.files.get("file")
    if dtype not in DOC_LABEL or not file or not file.filename:
        return jsonify(error="Choose a document type and file"), 400
    conn = db()
    cur = conn.cursor(dictionary=True)
    try:
        cur.execute("SELECT * FROM applications WHERE application_id=%s", (app_id,))
        a = cur.fetchone()
        if not a or str(a["user_id"]) != str(user_id):
            return jsonify(error="Application not found"), 404
        if a["status"] in ("Withdrawn", "Rejected"):
            return jsonify(error="This application is closed"), 400
        try:
            name = save_upload(file, f"u{user_id}_{dtype}")
        except ValueError as e:
            return jsonify(error=str(e)), 400
        cur.execute("""UPDATE application_documents SET status='Replaced'
                       WHERE application_id=%s AND doc_type=%s AND status<>'Verified'""", (app_id, dtype))
        cur.execute("""INSERT INTO application_documents (application_id, user_id, doc_type, file_name, source)
                       VALUES (%s,%s,%s,%s,'upload')""", (app_id, user_id, dtype, name))
        add_history(cur, app_id, a["status"], f"Student uploaded {DOC_LABEL[dtype]}", "Student")
        if a["status"] == "Documents Requested":
            cur.execute("UPDATE applications SET status='Under Review' WHERE application_id=%s", (app_id,))
            add_history(cur, app_id, "Under Review", "Requested documents re-uploaded; back under review", "System")
        conn.commit()
        return jsonify(message=f"{DOC_LABEL[dtype]} uploaded", file_name=name), 201
    finally:
        cur.close()
        conn.close()


@apps_bp.route("/applications/<int:app_id>/offer-response", methods=["POST"])
def offer_response(app_id):
    data = request.get_json() or {}
    user_id, action = data.get("user_id"), data.get("action")
    conn = db()
    cur = conn.cursor(dictionary=True)
    try:
        cur.execute("SELECT * FROM applications WHERE application_id=%s", (app_id,))
        a = cur.fetchone()
        if not a or str(a["user_id"]) != str(user_id):
            return jsonify(error="Application not found"), 404
        if a["status"] not in ("Conditional Offer", "Unconditional Offer"):
            return jsonify(error="There is no offer to respond to yet"), 400
        new = "Offer Accepted" if action == "accept" else "Withdrawn"
        cur.execute("UPDATE applications SET status=%s WHERE application_id=%s", (new, app_id))
        add_history(cur, app_id, new, "Student " + ("accepted" if action == "accept" else "declined") + " the offer",
                    "Student")
        conn.commit()
        return jsonify(message=f"Offer {'accepted' if action == 'accept' else 'declined'}", status=new)
    finally:
        cur.close()
        conn.close()


@apps_bp.route("/applications/<int:app_id>/withdraw", methods=["POST"])
def withdraw(app_id):
    data = request.get_json() or {}
    conn = db()
    cur = conn.cursor(dictionary=True)
    try:
        cur.execute("SELECT * FROM applications WHERE application_id=%s", (app_id,))
        a = cur.fetchone()
        if not a or str(a["user_id"]) != str(data.get("user_id")):
            return jsonify(error="Application not found"), 404
        cur.execute("UPDATE applications SET status='Withdrawn' WHERE application_id=%s", (app_id,))
        add_history(cur, app_id, "Withdrawn", data.get("reason") or "Withdrawn by student", "Student")
        conn.commit()
        return jsonify(message="Application withdrawn")
    finally:
        cur.close()
        conn.close()


# ------------------------------------------------------------------ profile
@apps_bp.route("/profile/<int:user_id>", methods=["GET"])
def profile(user_id):
    conn = db()
    cur = conn.cursor(dictionary=True)
    user = get_user(cur, user_id)
    if not user:
        cur.close()
        conn.close()
        return jsonify(error="User not found"), 404
    e = latest_enroll(cur, user_id)
    cur.close()
    conn.close()
    docs = []
    if e:
        for dtype, label, col, _ in DOC_CATALOGUE:
            if col and e.get(col):
                docs.append({"doc_type": dtype, "label": label, "file_name": e[col]})
    return jsonify(user=user, enroll=clean(e), documents=docs, is_enrolled=e is not None)


def profile_completeness(e):
    if not e:
        return 0
    keys = ["full_name", "email", "phone_number", "date_of_birth", "nationality", "passport_number",
            "highest_qualification", "institution_name", "percentage_gpa", "english_test_score",
            "preferred_course", "course_level", "budget_range", "funding_source",
            "transcript_file", "passport_file", "resume_file", "sop_file", "recommendation_letter_file"]
    present = [k for k in keys if k in e]
    if not present:
        return 0
    filled = sum(1 for k in present if e.get(k) not in (None, "", 0))
    return round(filled / len(present) * 100)


# ------------------------------------------------------------------ dashboard
@apps_bp.route("/dashboard/<int:user_id>", methods=["GET"])
def dashboard(user_id):
    conn = db()
    cur = conn.cursor(dictionary=True)
    user = get_user(cur, user_id)
    if not user:
        cur.close()
        conn.close()
        return jsonify(error="User not found"), 404
    e = latest_enroll(cur, user_id)

    cur.execute("""SELECT a.application_id, a.app_ref, a.course_name, a.level, a.intake, a.status,
                          a.eligibility_result, a.created_at, a.updated_at,
                          u.name AS university, u.city, u.university_id
                   FROM applications a JOIN universities u ON u.university_id=a.university_id
                   WHERE a.user_id=%s ORDER BY a.updated_at DESC""", (user_id,))
    apps = clean_all(cur.fetchall())
    for a in apps:
        a["stage_index"] = STATUS_STAGE.get(a["status"], 0)
        a["status_message"] = STUDENT_MESSAGE.get(a["status"], "")

    stats = {
        "total": len(apps),
        "in_progress": sum(1 for a in apps if a["status"] not in ACTIVE_EXCLUDE
                           and a["status"] not in ("Conditional Offer", "Unconditional Offer", "Offer Accepted",
                                                   "CoE Issued", "Visa Lodged", "Visa Granted")),
        "awaiting_university": sum(1 for a in apps if a["status"] == "Sent to University"),
        "offers": sum(1 for a in apps if a["status"] in ("Conditional Offer", "Unconditional Offer",
                                                          "Offer Accepted", "CoE Issued", "Visa Lodged",
                                                          "Visa Granted")),
        "action_needed": sum(1 for a in apps if a["status"] in ("Documents Requested", "Conditional Offer",
                                                                 "Unconditional Offer")),
    }

    cur.execute("""SELECT * FROM notifications WHERE user_id=%s ORDER BY notification_id DESC LIMIT 6""",
                (user_id,))
    notes = clean_all(cur.fetchall())
    cur.execute("SELECT COUNT(*) AS c FROM notifications WHERE user_id=%s AND is_read=0", (user_id,))
    unread = cur.fetchone()["c"]

    estimates = []
    try:
        cur.execute("""SELECT * FROM cost_estimates WHERE user_id=%s ORDER BY 1 DESC LIMIT 3""", (user_id,))
        estimates = clean_all(cur.fetchall())
    except Exception:
        pass

    # recommendations: universities in tiers the profile qualifies for
    recs = []
    pre = profile_prefill(cur, user_id)
    if pre and pre.get("percentage") is not None and pre.get("ielts") is not None:
        cur.execute("SELECT level FROM tuition_base")
        levels = [r["level"] for r in cur.fetchall()]
        want = level_key(pre.get("course_level")) or "masters"
        level = next((l for l in levels if level_key(l) == want), None)
        if not level:
            level = next((l for l in levels if "master" in l.lower()), levels[0] if levels else None)
        cur.execute("""SELECT uni_tier FROM eligibility_criteria WHERE level=%s AND min_percentage<=%s
                       AND min_ielts<=%s AND min_funds_aud<=%s""",
                    (level, pre["percentage"], pre["ielts"], pre.get("budget_aud") or 0))
        tiers = [r["uni_tier"] for r in cur.fetchall()]
        if tiers:
            ph = ",".join(["%s"] * len(tiers))
            cur.execute(f"""SELECT university_id, name, city, state, uni_tier FROM universities
                            WHERE uni_tier IN ({ph}) ORDER BY RAND() LIMIT 4""", tiers)
            recs = cur.fetchall()

    cur.execute("""SELECT package, created_at FROM payments WHERE user_id=%s AND purpose='Enrollment'
                   AND status='Success' ORDER BY payment_id DESC LIMIT 1""", (user_id,))
    pay = clean(cur.fetchone())
    cur.execute("SELECT item_type, COUNT(*) c FROM shortlist WHERE user_id=%s GROUP BY item_type", (user_id,))
    short = {r["item_type"]: r["c"] for r in cur.fetchall()}
    cur.execute("SELECT loan_ref, lender, amount_inr, status FROM loan_applications WHERE user_id=%s "
                "ORDER BY loan_id DESC LIMIT 3", (user_id,))
    loans = clean_all(cur.fetchall())
    cur.execute("SELECT test_name, mode, batch, start_date, status FROM test_prep_bookings WHERE user_id=%s "
                "ORDER BY booking_id DESC LIMIT 3", (user_id,))
    tests = clean_all(cur.fetchall())
    cur.close()
    conn.close()
    return jsonify(user=user, is_enrolled=bool(pay) and e is not None, has_profile=e is not None,
                   package=pay["package"] if pay else None, enrolled_on=pay["created_at"] if pay else None,
                   shortlist=short, loans=loans, test_prep=tests,
                   profile_completeness=profile_completeness(e),
                   profile_summary={
                       "qualification": e.get("highest_qualification") if e else None,
                       "field": e.get("field_of_study") if e else None,
                       "score": e.get("percentage_gpa") if e else None,
                       "english": f"{e.get('english_test_type')} {e.get('english_test_score') or ''}".strip()
                       if e else None,
                       "preferred_course": e.get("preferred_course") if e else None,
                       "intake": e.get("intake_month_year") if e else None,
                   },
                   stats=stats, applications=apps, notifications=notes, unread=unread,
                   cost_estimates=estimates, recommendations=recs)


# ------------------------------------------------------------------ notifications
@apps_bp.route("/notifications/<int:user_id>", methods=["GET"])
def notifications(user_id):
    conn = db()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT * FROM notifications WHERE user_id=%s ORDER BY notification_id DESC LIMIT 30", (user_id,))
    rows = clean_all(cur.fetchall())
    cur.close()
    conn.close()
    return jsonify(notifications=rows, unread=sum(1 for r in rows if not r["is_read"]))


@apps_bp.route("/notifications/<int:user_id>/read", methods=["POST"])
def mark_read(user_id):
    conn = db()
    cur = conn.cursor()
    cur.execute("UPDATE notifications SET is_read=1 WHERE user_id=%s", (user_id,))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify(message="ok")
