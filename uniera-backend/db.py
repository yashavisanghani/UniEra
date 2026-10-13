"""Shared database + helper functions used by every route file."""
import os
import datetime
import decimal
import mysql.connector
from werkzeug.utils import secure_filename

DB_CONFIG = {
    "host": os.environ.get("DB_HOST", "localhost"),
    "user": os.environ.get("DB_USER", "root"),
    "password": os.environ.get("DB_PASSWORD", ""),
    "database": os.environ.get("DB_NAME", "uniera"),
    "charset": "utf8mb4",
    "collation": "utf8mb4_general_ci",
}

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ALLOWED_EXT = {"pdf", "png", "jpg", "jpeg", "doc", "docx"}


def db():
    return mysql.connector.connect(**DB_CONFIG)


def norm(s):
    return "".join(ch for ch in str(s or "").lower() if ch.isalnum())


def table_columns(cur, table):
    cur.execute(f"SHOW COLUMNS FROM {table}")
    return [r[0] if isinstance(r, tuple) else r["Field"] for r in cur.fetchall()]


def clean(row):
    """Make a DB row JSON-safe (dates, decimals, bytes)."""
    if row is None:
        return None
    out = {}
    for k, v in row.items():
        if isinstance(v, (datetime.datetime, datetime.date)):
            out[k] = v.isoformat()
        elif isinstance(v, decimal.Decimal):
            out[k] = float(v)
        elif isinstance(v, (bytes, bytearray)):
            out[k] = v.decode(errors="ignore")
        else:
            out[k] = v
    return out


def clean_all(rows):
    return [clean(r) for r in rows]


def signup_meta(cur):
    """Work out the column names of the signup table (id / name / email / phone)."""
    cols = table_columns(cur, "signup")
    return {
        "id": cols[0],
        "name": next((c for c in cols if "name" in c.lower()), None),
        "email": next((c for c in cols if "mail" in c.lower()), None),
        "phone": next((c for c in cols if "phone" in c.lower()), None),
        "password": next((c for c in cols if "pass" in c.lower() and "confirm" not in c.lower()), None),
    }


def get_user(cur, user_id):
    m = signup_meta(cur)
    cur.execute(f"SELECT * FROM signup WHERE {m['id']}=%s", (user_id,))
    row = cur.fetchone()
    if not row:
        return None
    return {
        "user_id": row.get(m["id"]),
        "name": row.get(m["name"]) if m["name"] else "",
        "email": row.get(m["email"]) if m["email"] else "",
        "phone": row.get(m["phone"]) if m["phone"] else "",
    }


def latest_enroll(cur, user_id):
    cols = table_columns(cur, "enroll")
    cur.execute(f"SELECT * FROM enroll WHERE user_id=%s ORDER BY {cols[0]} DESC LIMIT 1", (user_id,))
    return cur.fetchone()


def save_upload(file, prefix):
    """Save an uploaded file with a unique, safe name. Returns stored filename or None."""
    if not file or not file.filename:
        return None
    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    if ext not in ALLOWED_EXT:
        raise ValueError(f"File type .{ext} not allowed (use PDF, JPG, PNG, DOC, DOCX)")
    stamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S%f")
    name = f"{prefix}_{stamp}_{secure_filename(file.filename)}"
    file.save(os.path.join(UPLOAD_FOLDER, name))
    return name


def parse_number(text):
    """Pull the first number out of text like '72%', '8.1 CGPA', '6.5'."""
    import re
    if text is None:
        return None
    m = re.search(r"\d+(\.\d+)?", str(text))
    return float(m.group()) if m else None


def to_percentage(text):
    """Convert '8.2' (CGPA out of 10) or '3.4' (GPA out of 4) or '72%' into a percentage."""
    n = parse_number(text)
    if n is None:
        return None
    t = str(text).lower()
    if n <= 4.0 and ("gpa" in t or n <= 4.0) and "%" not in t:
        return round(n / 4.0 * 100, 1)
    if n <= 10.0 and "%" not in t:
        return round(n * 9.5, 1)  # common Indian CGPA -> % conversion
    return n


def budget_to_aud(text):
    """'70000', 'A$70,000', '40L INR', '40 lakh' -> AUD (approx, 1 AUD ~ 55 INR)."""
    if text is None:
        return None
    t = str(text).lower().replace(",", "")
    n = parse_number(t)
    if n is None:
        return None
    if "lakh" in t or "lac" in t or t.strip().endswith("l") or " l" in t:
        return round(n * 100000 / 55)
    if "inr" in t or "rs" in t or "₹" in t:
        return round(n / 55)
    return n


def is_paid(cur, user_id):
    """A student is 'enrolled' with the consultancy once the enrolment fee is paid."""
    if not user_id:
        return False
    try:
        cur.execute("""SELECT COUNT(*) AS c FROM payments WHERE user_id=%s AND purpose='Enrollment'
                       AND status='Success'""", (user_id,))
        row = cur.fetchone()
        return (row["c"] if isinstance(row, dict) else row[0]) > 0
    except Exception:
        return False
