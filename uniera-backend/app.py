from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
import os

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="uniera"
    )

# ---------------- SIGNUP ----------------
@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    full_name = data.get("full_name")
    phone_number = data.get("phone_number")
    email = data.get("email")
    password = data.get("password")

    if not full_name or not phone_number or not email or not password:
        return jsonify({"message": "Missing required fields"}), 400

    hashed_password = generate_password_hash(password)

    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO signup (full_name, phone_number, email, password) VALUES (%s, %s, %s, %s)",
            (full_name, phone_number, email, hashed_password)
        )
        conn.commit()
        return jsonify({"message": "Signup successful"}), 201
    except mysql.connector.Error as err:
        return jsonify({"message": str(err)}), 400
    finally:
        cursor.close()
        conn.close()

# ---------------- LOGIN ----------------
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM signup WHERE email = %s", (email,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if user and check_password_hash(user["password"], password):
        return jsonify({"message": "Login successful", "user_id": user["user_id"]}), 200
    else:
        return jsonify({"message": "Invalid email or password"}), 401

# ---------------- ENROLL ----------------
@app.route("/enroll", methods=["POST"])
def enroll():
    form = request.form
    files = request.files

    user_id = form.get("user_id")

    saved_files = {}
    file_fields = ["transcript_file", "passport_file", "resume_file", "sop_file", "recommendation_letter_file"]
    for field in file_fields:
        file = files.get(field)
        if file and file.filename:
            filename = secure_filename(f"{user_id}_{field}_{file.filename}")
            filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
            file.save(filepath)
            saved_files[field] = filepath
        else:
            saved_files[field] = None

    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO enroll (
                user_id, full_name, email, phone_number, alternate_phone,
                date_of_birth, gender, nationality, passport_number,
                current_address, current_city, current_country,
                emergency_contact_name, emergency_contact_relation, emergency_contact_phone,
                highest_qualification, field_of_study, institution_name, graduation_year, percentage_gpa,
                academic_gap, academic_gap_reason, backlogs, backlogs_count,
                english_test_type, english_test_score, other_test_type, other_test_score,
                preferred_country, preferred_university, preferred_course, course_level, intake_month_year,
                budget_range, funding_source, work_experience_years,
                visa_applied_before, visa_rejected_before, visa_rejection_details,
                transcript_file, passport_file, resume_file, sop_file, recommendation_letter_file,
                declaration_agreed
            ) VALUES (
                %s, %s, %s, %s, %s,
                %s, %s, %s, %s,
                %s, %s, %s,
                %s, %s, %s,
                %s, %s, %s, %s, %s,
                %s, %s, %s, %s,
                %s, %s, %s, %s,
                %s, %s, %s, %s, %s,
                %s, %s, %s,
                %s, %s, %s,
                %s, %s, %s, %s, %s,
                %s
            )
        """, (
            user_id, form.get("full_name"), form.get("email"), form.get("phone_number"), form.get("alternate_phone"),
            form.get("date_of_birth") or None, form.get("gender") or None, form.get("nationality"), form.get("passport_number"),
            form.get("current_address"), form.get("current_city"), form.get("current_country"),
            form.get("emergency_contact_name"), form.get("emergency_contact_relation"), form.get("emergency_contact_phone"),
            form.get("highest_qualification"), form.get("field_of_study"), form.get("institution_name"),
            form.get("graduation_year") or None, form.get("percentage_gpa"),
            form.get("academic_gap"), form.get("academic_gap_reason"), form.get("backlogs"), form.get("backlogs_count") or 0,
            form.get("english_test_type"), form.get("english_test_score"), form.get("other_test_type"), form.get("other_test_score"),
            form.get("preferred_country"), form.get("preferred_university"), form.get("preferred_course"),
            form.get("course_level"), form.get("intake_month_year"),
            form.get("budget_range"), form.get("funding_source") or None, form.get("work_experience_years") or 0,
            form.get("visa_applied_before"), form.get("visa_rejected_before"), form.get("visa_rejection_details"),
            saved_files["transcript_file"], saved_files["passport_file"], saved_files["resume_file"],
            saved_files["sop_file"], saved_files["recommendation_letter_file"],
            form.get("declaration_agreed") == "true"
        ))
        conn.commit()
        return jsonify({"message": "Enrollment submitted successfully"}), 201
    except mysql.connector.Error as err:
        return jsonify({"message": str(err)}), 400
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    app.run(debug=True, port=5000)