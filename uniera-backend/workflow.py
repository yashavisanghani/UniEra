"""Application status workflow, document checklist and notification helper."""

# Big stages shown on the student's progress timeline
STAGES = [
    "Submitted",
    "Under Review",
    "Documents Verified",
    "Sent to University",
    "University Decision",
    "Offer Accepted",
    "CoE Issued",
    "Visa Granted",
]

# Every status an application can have -> which timeline stage it belongs to
STATUS_STAGE = {
    "Submitted": 0,
    "Under Review": 1,
    "Documents Requested": 1,
    "Documents Verified": 2,
    "Sent to University": 3,
    "Conditional Offer": 4,
    "Unconditional Offer": 4,
    "Rejected": 4,
    "Offer Accepted": 5,
    "CoE Issued": 6,
    "Visa Lodged": 7,
    "Visa Granted": 7,
    "Withdrawn": 0,
}

ALL_STATUSES = list(STATUS_STAGE.keys())

# What the consultancy is allowed to move an application to next
NEXT_STATUSES = {
    "Submitted": ["Under Review", "Documents Requested"],
    "Under Review": ["Documents Verified", "Documents Requested"],
    "Documents Requested": ["Under Review", "Documents Verified"],
    "Documents Verified": ["Sent to University", "Documents Requested"],
    "Sent to University": ["Conditional Offer", "Unconditional Offer", "Rejected"],
    "Conditional Offer": ["Unconditional Offer", "Offer Accepted", "Rejected"],
    "Unconditional Offer": ["Offer Accepted"],
    "Offer Accepted": ["CoE Issued"],
    "CoE Issued": ["Visa Lodged"],
    "Visa Lodged": ["Visa Granted"],
    "Visa Granted": [],
    "Rejected": [],
    "Withdrawn": [],
}

STUDENT_MESSAGE = {
    "Submitted": "Your application has been received by UniEra. A counsellor will start reviewing it shortly.",
    "Under Review": "A UniEra counsellor is reviewing your application and documents.",
    "Documents Requested": "Your counsellor needs one or more documents re-uploaded. Please check the remarks and upload them below.",
    "Documents Verified": "All your documents are verified. Your application will be lodged with the university next.",
    "Sent to University": "Your application has been lodged with the university. Waiting for the university's decision (usually 2–6 weeks).",
    "Conditional Offer": "Congratulations! You have a conditional offer. Check the conditions in the university response below.",
    "Unconditional Offer": "Congratulations! You have an unconditional offer. Accept it to move on to CoE and visa.",
    "Rejected": "Unfortunately the university did not offer you a place. Your counsellor can suggest alternatives.",
    "Offer Accepted": "You have accepted the offer. Next: tuition deposit and Confirmation of Enrolment (CoE).",
    "CoE Issued": "Your CoE has been issued. You can now lodge your student visa (subclass 500).",
    "Visa Lodged": "Your student visa application has been lodged.",
    "Visa Granted": "Visa granted — you're ready to fly! 🎓",
    "Withdrawn": "This application was withdrawn.",
}

# Master catalogue of every document the consultancy may ask for.
# (doc_type, label, matching column in the enroll table or None, short help text)
DOC_CATALOGUE = [
    ("passport", "Passport (first & last page)", "passport_file", "Valid for at least 6 months beyond your course start."),
    ("photo", "Passport-size Photograph", None, "White background, JPG/PNG."),
    ("class10_12", "Class 10 & 12 Marksheets", None, "Board marksheets and passing certificates."),
    ("transcript", "Academic Transcripts", "transcript_file", "Semester-wise marksheets of your highest qualification."),
    ("degree_certificate", "Degree / Provisional Certificate", None, "Bachelor's degree or provisional certificate."),
    ("english_test", "English Test Scorecard (IELTS/PTE/TOEFL)", None, "Test report form, valid for 2 years."),
    ("resume", "Resume / CV", "resume_file", "Education, experience, projects and skills."),
    ("sop", "Statement of Purpose (SOP)", "sop_file", "Why this course, this university and Australia."),
    ("gs_statement", "Genuine Student (GS) Statement", None, "Required by Australian universities for the student visa."),
    ("lor", "Recommendation Letter 1", "recommendation_letter_file", "From a professor or employer, on letterhead."),
    ("lor2", "Recommendation Letter 2", None, "A second academic or professional reference."),
    ("financial_proof", "Financial Proof / Bank Statement", None, "Funds for tuition + living (bank letter / loan sanction)."),
    ("work_experience", "Work Experience Letters", None, "Experience / relieving letters with dates and role."),
    ("gre_gmat", "GRE / GMAT Scorecard", None, "Only if you have taken the test."),
    ("research_proposal", "Research Proposal", None, "2–3 pages: topic, aims, method, and potential supervisor."),
    ("publications", "Publications / Research Work", None, "Papers, thesis or project reports if any."),
    ("gap_explanation", "Gap Explanation Letter", None, "Explain any gap in education with supporting documents."),
]
DOC_LABEL = {d[0]: d[1] for d in DOC_CATALOGUE}
DOC_PROFILE_COL = {d[0]: d[2] for d in DOC_CATALOGUE}
DOC_HELP = {d[0]: d[3] for d in DOC_CATALOGUE}

# Backwards-compatible list used by the chatbot: (doc_type, label, required, enroll column)
_BASE_REQUIRED = ["passport", "transcript", "english_test", "resume", "sop", "financial_proof"]
DOC_TYPES = [(d[0], d[1], d[0] in _BASE_REQUIRED, d[2]) for d in DOC_CATALOGUE
             if d[0] in _BASE_REQUIRED + ["lor"]]
REQUIRED_DOCS = _BASE_REQUIRED


def _level(level):
    l = (level or "").lower()
    if "phd" in l or "doct" in l or "research" in l:
        return "phd"
    if "bach" in l or "under" in l or l == "ug":
        return "bachelors"
    if "diploma" in l:
        return "diploma"
    return "masters"


def required_docs(uni=None, level="Masters", course_name=None, profile=None):
    """Document checklist for ONE university + level (+ course).
    Returns list of {doc_type, label, required, reason, help, profile_col}."""
    lv = _level(level)
    tier = (uni or {}).get("uni_tier") or ""
    name = ((uni or {}).get("name") or "").lower()
    course = (course_name or "").lower()
    items = {}

    def add(dtype, required, reason):
        if dtype in items and items[dtype]["required"]:
            return
        items[dtype] = {"doc_type": dtype, "label": DOC_LABEL[dtype], "required": required, "reason": reason,
                        "help": DOC_HELP[dtype], "profile_col": DOC_PROFILE_COL[dtype]}

    # Everyone
    add("passport", True, "Identity & visa")
    add("photo", True, "Application form")
    add("english_test", True, "English language requirement")
    add("financial_proof", True, "Proof of funds for CoE & visa")
    add("gs_statement", True, "Genuine Student requirement (subclass 500)")
    add("sop", True, "Admission assessment")

    if lv == "bachelors" or lv == "diploma":
        add("class10_12", True, "Year 12 equivalent entry")
        add("resume", False, "Helps with scholarship assessment")
        add("lor", False, "Optional reference")
    elif lv == "masters":
        add("transcript", True, "Bachelor's degree assessment")
        add("degree_certificate", True, "Proof of completed degree")
        add("resume", True, "Admission assessment")
        add("lor", tier == "Group of Eight", "Group of Eight universities ask for a reference" if tier == "Group of Eight" else "Recommended")
        add("work_experience", "mba" in course or "business administration" in course,
            "MBA needs 2–3 years of work experience" if "mba" in course else "If you have work experience")
        add("gre_gmat", False, "Optional – can strengthen your profile")
    else:  # phd
        add("transcript", True, "Bachelor's and Master's transcripts")
        add("degree_certificate", True, "Proof of completed degrees")
        add("resume", True, "Academic CV")
        add("research_proposal", True, "Research degree requirement")
        add("lor", True, "Academic referee 1")
        add("lor2", True, "Academic referee 2")
        add("publications", False, "Strengthens research application")

    if tier == "Group of Eight" and lv != "bachelors":
        add("lor2", lv == "phd", "Second referee" if lv == "phd" else "Recommended for competitive entry")
    if "bond" in name:
        add("lor", True, "Bond University asks for a reference for all applicants")
    if profile and str(profile.get("academic_gap") or "").lower() == "yes":
        add("gap_explanation", True, "You declared a gap in your education")

    order = [d[0] for d in DOC_CATALOGUE]
    return sorted(items.values(), key=lambda x: (not x["required"], order.index(x["doc_type"])))


def timeline(status, history):
    """Build the stage list for the progress tracker."""
    current = STATUS_STAGE.get(status, 0)
    dates = {}
    for h in history:
        st = STATUS_STAGE.get(h["status"])
        if st is not None and st not in dates:
            dates[st] = h["changed_at"]
    steps = []
    for i, name in enumerate(STAGES):
        label = name
        if i == 4 and status in ("Conditional Offer", "Unconditional Offer", "Rejected"):
            label = status
        if i == 7 and status == "Visa Lodged":
            label = "Visa Lodged"
        state = "done" if i < current else ("current" if i == current else "upcoming")
        if status == "Visa Granted" and i == 7:
            state = "done"
        if status == "Rejected" and i == 4:
            state = "rejected"
        if status == "Withdrawn":
            state = "upcoming" if i else "done"
        steps.append({"stage": label, "state": state, "date": dates.get(i)})
    return steps


def notify(cur, user_id, title, message, application_id=None):
    cur.execute("""INSERT INTO notifications (user_id, application_id, title, message)
                   VALUES (%s,%s,%s,%s)""", (user_id, application_id, title, message))


def add_history(cur, application_id, status, remarks, by):
    cur.execute("""INSERT INTO application_status_history (application_id, status, remarks, changed_by)
                   VALUES (%s,%s,%s,%s)""", (application_id, status, remarks, by))
