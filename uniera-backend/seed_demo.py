"""Creates a ready-made DEMO student so you can show every stage quickly.

Run once (backend folder, with MySQL running):   python seed_demo.py

It goes through the real API (Flask test client), exactly like the website does:
signup -> enrolment profile -> payment -> 3 applications -> counsellor actions.

Demo student : demo.student@uniera.com / Demo@123
Staff login  : admin@uniera.com / Admin@123
Safe to run again: if the demo student already exists it does nothing.
"""
import io
from app import app
from db import db, signup_meta

EMAIL, PASSWORD = "demo.student@uniera.com", "Demo@123"
PDF = b"%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF"


def pdf(name):
    return (io.BytesIO(PDF), name)


def main():
    c = app.test_client()
    conn = db()
    cur = conn.cursor(dictionary=True)
    m = signup_meta(cur)  # your signup table's own column names (id / email)
    cur.execute(f"SELECT {m['id']} FROM signup WHERE {m['email']}=%s", (EMAIL,))
    if cur.fetchone():
        print("Demo student already exists — nothing to do.")
        return

    # several spellings so it matches whatever your signup columns are called
    r = c.post("/signup", json={"full_name": "Demo Student", "name": "Demo Student", "email": EMAIL,
                                "phone_number": "9000000001", "phone": "9000000001",
                                "password": PASSWORD, "confirm_password": PASSWORD})
    if r.status_code != 201:
        raise SystemExit(f"Signup failed: {r.get_json()}")
    login = c.post("/login", json={"email": EMAIL, "password": PASSWORD}).get_json()
    if "user_id" not in login:
        raise SystemExit(f"Login failed: {login}")
    uid = login["user_id"]

    profile = {"user_id": uid, "full_name": "Demo Student", "email": EMAIL, "phone_number": "9000000001",
               "date_of_birth": "2002-08-15", "gender": "Female", "nationality": "Indian",
               "passport_number": "P7654321", "current_city": "Ahmedabad", "current_country": "India",
               "highest_qualification": "Bachelors", "field_of_study": "Information Technology",
               "institution_name": "Gujarat Technological University", "graduation_year": "2025",
               "percentage_gpa": "74%", "english_test_type": "IELTS", "english_test_score": "7.0",
               "preferred_country": "Australia", "preferred_course": "Master of Information Technology",
               "course_level": "Postgraduate", "intake_month_year": "Feb 2027", "budget_range": "85000",
               "funding_source": "Education_Loan", "work_experience_years": "1", "declaration_agreed": "true"}
    files = {k: pdf(f"{k}.pdf") for k in ("transcript_file", "passport_file", "resume_file", "sop_file",
                                           "recommendation_letter_file")}
    c.post("/enroll", data={**profile, **files}, content_type="multipart/form-data")
    c.post("/payments/enrollment", json={"user_id": uid, "package": "Premium", "method": "UPI",
                                          "upi_id": "demo@okaxis"})

    token = c.post("/admin/login", json={"email": "admin@uniera.com", "password": "Admin@123"}).get_json()["token"]
    H = {"Authorization": f"Bearer {token}"}

    def apply(uni_name, course_like):
        cur.execute("SELECT university_id FROM universities WHERE name LIKE %s LIMIT 1", (f"%{uni_name}%",))
        u = cur.fetchone()
        cur.execute("SELECT course_id FROM courses WHERE university_id=%s AND level='Masters' AND name LIKE %s LIMIT 1",
                    (u["university_id"], f"%{course_like}%"))
        course = cur.fetchone()
        if not course:  # not every university offers every course — take any Masters course
            cur.execute("SELECT course_id FROM courses WHERE university_id=%s AND level='Masters' LIMIT 1",
                        (u["university_id"],))
            course = cur.fetchone()
        req = c.get(f"/universities/{u['university_id']}/requirements",
                    query_string={"course_id": course["course_id"], "user_id": uid}).get_json()["documents"]
        data = {"user_id": uid, "university_id": u["university_id"], "course_id": course["course_id"],
                "intake": "February 2027", "declaration": "true"}
        for d in req:
            if d["required"] and not d["in_profile"]:
                data[f"doc_{d['doc_type']}"] = pdf(f"{d['doc_type']}.pdf")
        r = c.post("/applications", data=data, content_type="multipart/form-data").get_json()
        return r["application_id"]

    def verify_all(app_id):
        a = c.get(f"/admin/applications/{app_id}", headers=H).get_json()
        for d in a["checklist"]:
            if d["doc_id"]:
                c.post(f"/admin/documents/{d['doc_id']}", json={"status": "Verified"}, headers=H)

    def status(app_id, st, remarks=""):
        c.post(f"/admin/applications/{app_id}/status", json={"status": st, "remarks": remarks}, headers=H)

    # 1) Waiting for the university's reply
    a1 = apply("Macquarie", "Information Technology")
    verify_all(a1)
    status(a1, "Documents Verified")
    status(a1, "Sent to University", "Lodged with Macquarie University admissions.")

    # 2) Offer received (with offer letter)
    a2 = apply("Technology Sydney", "Data Science")
    verify_all(a2)
    status(a2, "Documents Verified")
    status(a2, "Sent to University")
    c.post(f"/admin/applications/{a2}/decision", headers=H, content_type="multipart/form-data",
           data={"decision": "Unconditional Offer",
                 "response": "Unconditional offer for the February 2027 intake. Accept and pay the "
                             "tuition deposit to receive your CoE.",
                 "offer_letter": pdf("UTS_offer_letter.pdf")})

    # 3) Counsellor asked for a document again
    a3 = apply("Deakin", "Information Technology")
    a = c.get(f"/admin/applications/{a3}", headers=H).get_json()
    fin = next(d for d in a["checklist"] if d["doc_type"] == "financial_proof")
    c.post(f"/admin/documents/{fin['doc_id']}", headers=H,
           json={"status": "Rejected", "remarks": "Bank statement is older than 3 months — please upload a recent one."})
    status(a3, "Documents Requested", "Please upload a bank statement from the last 3 months.")

    c.post("/shortlist", json={"user_id": uid, "item_type": "university", "item_id": 1})
    print(f"Demo student ready: {EMAIL} / {PASSWORD}  (3 applications at different stages)")


if __name__ == "__main__":
    main()
