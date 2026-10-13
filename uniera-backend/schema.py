"""Creates the new tables automatically when the backend starts and seeds
university details, courses and a default consultancy (admin) login.
Safe to run every time: uses CREATE TABLE IF NOT EXISTS and only seeds
rows that are missing."""
from werkzeug.security import generate_password_hash
from db import db
from uni_data import find_info, COURSE_CATALOGUE, level_key, DEFAULT_INTAKES

DEFAULT_STAFF_EMAIL = "admin@uniera.com"
DEFAULT_STAFF_PASSWORD = "Admin@123"

TABLES = [
    """CREATE TABLE IF NOT EXISTS university_details (
        university_id INT PRIMARY KEY,
        established INT,
        uni_type VARCHAR(20),
        uni_group VARCHAR(40),
        about TEXT,
        known_for VARCHAR(255),
        intakes VARCHAR(120),
        main_campus VARCHAR(120)
    )""",
    """CREATE TABLE IF NOT EXISTS courses (
        course_id INT AUTO_INCREMENT PRIMARY KEY,
        university_id INT NOT NULL,
        name VARCHAR(150) NOT NULL,
        level VARCHAR(30) NOT NULL,
        field VARCHAR(40),
        duration_years DECIMAL(3,1),
        annual_fee_aud INT,
        min_percentage DECIMAL(5,2),
        min_ielts DECIMAL(3,1),
        INDEX (university_id)
    )""",
    """CREATE TABLE IF NOT EXISTS applications (
        application_id INT AUTO_INCREMENT PRIMARY KEY,
        app_ref VARCHAR(20) UNIQUE,
        user_id INT NOT NULL,
        university_id INT NOT NULL,
        course_id INT NULL,
        course_name VARCHAR(150),
        level VARCHAR(30),
        intake VARCHAR(40),
        status VARCHAR(40) NOT NULL DEFAULT 'Submitted',
        eligibility_result VARCHAR(20),
        student_note TEXT,
        university_response TEXT,
        offer_letter_file VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX (user_id), INDEX (status)
    )""",
    """CREATE TABLE IF NOT EXISTS application_documents (
        doc_id INT AUTO_INCREMENT PRIMARY KEY,
        application_id INT NOT NULL,
        user_id INT NOT NULL,
        doc_type VARCHAR(40) NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        source VARCHAR(20) DEFAULT 'upload',
        status VARCHAR(20) DEFAULT 'Pending',
        remarks VARCHAR(255),
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX (application_id)
    )""",
    """CREATE TABLE IF NOT EXISTS application_status_history (
        history_id INT AUTO_INCREMENT PRIMARY KEY,
        application_id INT NOT NULL,
        status VARCHAR(40) NOT NULL,
        remarks TEXT,
        changed_by VARCHAR(100),
        changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX (application_id)
    )""",
    """CREATE TABLE IF NOT EXISTS notifications (
        notification_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        application_id INT NULL,
        title VARCHAR(150),
        message TEXT,
        is_read TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX (user_id)
    )""",
    """CREATE TABLE IF NOT EXISTS chat_messages (
        chat_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NULL,
        sender VARCHAR(10) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX (user_id)
    )""",
    """CREATE TABLE IF NOT EXISTS staff_users (
        staff_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(120),
        email VARCHAR(150) UNIQUE,
        password_hash VARCHAR(255),
        role VARCHAR(30) DEFAULT 'Counsellor',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )""",
    """CREATE TABLE IF NOT EXISTS payments (
        payment_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        purpose VARCHAR(40) NOT NULL,
        package VARCHAR(40),
        amount_inr INT NOT NULL,
        method VARCHAR(30),
        method_detail VARCHAR(60),
        status VARCHAR(20) DEFAULT 'Success',
        txn_ref VARCHAR(40),
        invoice_no VARCHAR(30),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX (user_id)
    )""",
    """CREATE TABLE IF NOT EXISTS shortlist (
        shortlist_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        item_type VARCHAR(20) NOT NULL,
        item_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_short (user_id, item_type, item_id)
    )""",
    """CREATE TABLE IF NOT EXISTS test_prep_bookings (
        booking_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        test_name VARCHAR(20),
        mode VARCHAR(10),
        batch VARCHAR(80),
        centre VARCHAR(80),
        start_date DATE,
        fee_inr INT,
        payment_id INT NULL,
        status VARCHAR(20) DEFAULT 'Confirmed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX (user_id)
    )""",
    """CREATE TABLE IF NOT EXISTS loan_applications (
        loan_id INT AUTO_INCREMENT PRIMARY KEY,
        loan_ref VARCHAR(20),
        user_id INT NOT NULL,
        application_id INT NULL,
        lender VARCHAR(80),
        amount_inr INT,
        collateral VARCHAR(10),
        co_applicant_name VARCHAR(120),
        co_applicant_relation VARCHAR(40),
        co_applicant_income INT,
        admission_status VARCHAR(40),
        status VARCHAR(30) DEFAULT 'Submitted',
        remarks TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX (user_id)
    )""",
    """CREATE TABLE IF NOT EXISTS accommodation_bookings (
        booking_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        property_id INT,
        property_name VARCHAR(120),
        city VARCHAR(60),
        room_type VARCHAR(40),
        weekly_rent_aud INT,
        move_in DATE,
        weeks INT,
        status VARCHAR(20) DEFAULT 'Requested',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX (user_id)
    )""",
    """CREATE TABLE IF NOT EXISTS reviews (
        review_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(120),
        rating INT,
        comment TEXT,
        university VARCHAR(150),
        approved TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )""",
    """CREATE TABLE IF NOT EXISTS enquiries (
        enquiry_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(120),
        email VARCHAR(150),
        phone VARCHAR(20),
        message TEXT,
        status VARCHAR(20) DEFAULT 'New',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )""",
]

FIELD_FACTOR = {"IT": 1.0, "Business": 0.95, "Engineering": 1.06, "Health": 1.02, "Research": 0.92}


def tier_positions(cur):
    """0.0 = least competitive tier, 1.0 = most competitive (based on eligibility_criteria)."""
    cur.execute("SELECT uni_tier, AVG(min_percentage) AS p FROM eligibility_criteria GROUP BY uni_tier ORDER BY p")
    rows = cur.fetchall()
    if len(rows) <= 1:
        return {r["uni_tier"]: 0.5 for r in rows}
    return {r["uni_tier"]: i / (len(rows) - 1) for i, r in enumerate(rows)}


def seed(conn):
    cur = conn.cursor(dictionary=True)

    # ---- staff login ----
    cur.execute("SELECT COUNT(*) AS c FROM staff_users")
    if cur.fetchone()["c"] == 0:
        cur.execute("INSERT INTO staff_users (name, email, password_hash, role) VALUES (%s,%s,%s,%s)",
                    ("UniEra Counsellor", DEFAULT_STAFF_EMAIL, generate_password_hash(DEFAULT_STAFF_PASSWORD), "Counsellor"))

    # ---- university details ----
    cur.execute("""SELECT u.* FROM universities u
                   LEFT JOIN university_details d ON d.university_id = u.university_id
                   WHERE d.university_id IS NULL""")
    for u in cur.fetchall():
        info = find_info(u["name"]) or {}
        about = info.get("about") or (
            f"{u['name']} is a {u.get('uni_tier') or ''} Australian university based in {u.get('city')}, {u.get('state')}."
        )
        cur.execute("""INSERT INTO university_details
                       (university_id, established, uni_type, uni_group, about, known_for, intakes, main_campus)
                       VALUES (%s,%s,%s,%s,%s,%s,%s,%s)""",
                    (u["university_id"], info.get("established"), info.get("type", "Public"),
                     info.get("group", ""), about, info.get("known_for", "Business, IT, Engineering, Health"),
                     info.get("intakes", DEFAULT_INTAKES), f"{u.get('city')}, {u.get('state')}"))

    # ---- courses ----
    cur.execute("SELECT * FROM tuition_base")
    levels = cur.fetchall()
    positions = tier_positions(cur)
    cur.execute("SELECT level, uni_tier, min_percentage, min_ielts FROM eligibility_criteria")
    crit = {(r["level"], r["uni_tier"]): r for r in cur.fetchall()}

    cur.execute("""SELECT u.* FROM universities u
                   WHERE NOT EXISTS (SELECT 1 FROM courses c WHERE c.university_id = u.university_id)""")
    for u in cur.fetchall():
        uid = u["university_id"]
        pos = positions.get(u.get("uni_tier"), 0.5)
        for lv in levels:
            key = level_key(lv["level"])
            if not key:
                continue
            catalogue = COURSE_CATALOGUE[key]
            # each university offers a slightly different subset
            chosen = [c for i, c in enumerate(catalogue) if (i + uid) % 5 != 0] or catalogue
            c = crit.get((lv["level"], u.get("uni_tier")), {})
            for idx, (name, field, dur) in enumerate(chosen):
                base = lv["tuition_min_aud"] + (lv["tuition_max_aud"] - lv["tuition_min_aud"]) * (0.15 + 0.7 * pos)
                jitter = 1 + (((uid * 7 + idx * 3) % 9) - 4) / 100
                fee = int(round(base * FIELD_FACTOR.get(field, 1.0) * jitter / 100.0) * 100)
                ielts = float(c.get("min_ielts") or 6.5)
                if field == "Health":
                    ielts = max(ielts, 7.0)
                cur.execute("""INSERT INTO courses (university_id, name, level, field, duration_years,
                               annual_fee_aud, min_percentage, min_ielts) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)""",
                            (uid, name, lv["level"], field, dur, fee, c.get("min_percentage"), ielts))
    conn.commit()
    cur.close()


def ensure_tables():
    conn = db()
    cur = conn.cursor()
    for sql in TABLES:
        cur.execute(sql)
    # make sure text columns can store ₹, emoji etc. (older MySQL/XAMPP defaults to latin1)
    for t in ("notifications", "chat_messages", "application_status_history", "loan_applications",
              "reviews", "enquiries", "applications", "university_details"):
        cur.execute(f"SELECT CCSA.character_set_name FROM information_schema.TABLES T JOIN "
                    f"information_schema.COLLATION_CHARACTER_SET_APPLICABILITY CCSA "
                    f"ON CCSA.collation_name = T.table_collation WHERE T.table_schema = DATABASE() "
                    f"AND T.table_name = %s", (t,))
        row = cur.fetchone()
        if row and row[0] != "utf8mb4":
            cur.execute(f"ALTER TABLE {t} CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci")
    conn.commit()
    cur.close()
    seed(conn)
    conn.close()


if __name__ == "__main__":
    ensure_tables()
    print("UniEra tables ready.")
