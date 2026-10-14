# UniEra — Study-abroad consultancy platform (Australia)

UniEra is a consultancy website + student portal + counsellor desk.
Students can **explore** freely, but to **apply** they must **enrol and pay** the consultancy.
After that, UniEra (not the student) submits applications to universities using the documents the student uploads.

**Stack:** React (Vite) + Tailwind CSS · Python Flask · MySQL

---

## 1. Run it on Windows

### Database (XAMPP / MySQL)
1. Start **MySQL** in XAMPP.
2. If your `uniera` database **already has** your tables + data → nothing to do.
   Fresh computer only: run `database/01_core_tables_reference.sql` and then `database/02_sample_data_fresh_install_only.sql` in phpMyAdmin.
3. All the **new tables** (applications, documents, payments, loans, test prep, accommodation, shortlist, reviews,
   enquiries, notifications, chatbot, staff login, university details, courses) are **created automatically** when the backend starts.

### Backend
```bat
cd uniera-backend
pip install -r requirements.txt
python app.py
```
Runs on http://127.0.0.1:5000 — open http://127.0.0.1:5000/api/hello to check.
DB login is `root` with an empty password (change in `db.py` or set `DB_PASSWORD`).

**Optional demo data** (recommended before showing your guide):
```bat
python seed_demo.py
```
Creates `demo.student@uniera.com / Demo@123` with 3 applications: one waiting for the university, one with an offer letter, one where the counsellor has asked for a document again.

### Frontend
```bat
cd uniera-frontend
npm install
npm run dev
```
Open http://localhost:5173

### Logins
| Who | Where | Login |
|---|---|---|
| Student (new) | Enroll Now → Sign up | create any account |
| Demo student | /login | demo.student@uniera.com / Demo@123 (after `seed_demo.py`) |
| Consultancy counsellor | /admin/login (link in the footer) | admin@uniera.com / Admin@123 |

---

## 2. Demo script for the guide (≈10 minutes)

**A. Public website (not enrolled)**
1. Home page → services, how it works, partner universities (all 39 Australian universities, grouped by tier), packages, reviews, FAQ, contact form. **Enroll Now** is on the top right.
2. Universities → open e.g. *Macquarie University*: overview, courses & fees, **Eligibility checker** (for this university), **Documents required** (for this university + course), scholarships.
3. Point out the button says **"Enroll to apply"** — explore only, no applying.

**B. Enrolment + payment**
4. Enroll Now → sign up → fill the profile (upload transcript, passport, resume, SOP) → choose **Premium** → pay with UPI `anything@okaxis` (demo gateway) → receipt → **Go to Student Portal**.

**C. Student applies (the main flow)**
5. Portal → Universities → Macquarie → Eligibility checker (pre-filled from profile) → **Apply via UniEra**.
6. Step 1 course & intake → Step 2 **document upload screen** showing only what *this* university needs (profile documents are reused) → Step 3 review & declaration → **Submit**. You get a reference like `UE-2026-00005`.
7. My Applications / Dashboard → status **Submitted**, progress timeline, notifications bell.

**D. Consultancy side**
8. Open `/admin/login` (another browser or incognito) → Applications → the new application.
9. Verify each document (or reject one with a remark → the student sees it and re-uploads).
10. Mark **Documents Verified** → **Sent to University**.
11. Back as the student: status is **"Sent to University — waiting for the university's decision"** ✅ *(this is the state asked for)*.

**E. Beyond the milestone (optional)**
12. Counsellor → *Record university decision* → Unconditional Offer + upload offer letter → student sees it in **Offer Letters**, can download and accept.
13. Show Status Checker (public `/track` with ref + email), Test Prep booking (online/offline), Education Loan (lenders + EMI calculator + request), Accommodation, Payments (printable receipt), Shortlist & Compare, Chatbot (bottom-right), counsellor's Payments & Services page.

---

## 3. What's where

| Area | Files |
|---|---|
| Auth, enrolment form, scholarships, general eligibility, cost estimator | `uniera-backend/app.py` |
| Universities, per-university eligibility | `routes_universities.py`, `uni_data.py` |
| Applications, document upload, dashboard, notifications | `routes_applications.py` |
| Status workflow + **document requirements per university/level/course** | `workflow.py` (`required_docs`) |
| Payments, shortlist/compare, test prep, loans, accommodation, reviews, enquiries | `routes_portal.py` |
| Counsellor desk | `routes_admin.py` |
| Chatbot (rule-based, answers from the database) | `routes_chat.py` |
| Tables (auto-created) | `schema.py` |
| Public pages | `uniera-frontend/src/pages/*.jsx` |
| Student portal | `uniera-frontend/src/pages/portal/*.jsx` |
| Counsellor desk | `uniera-frontend/src/pages/admin/*.jsx` |
| Shared layout / UI | `uniera-frontend/src/components/` |

### Application status flow
Submitted → Under Review (or Documents Requested) → Documents Verified → Sent to University →
Conditional / Unconditional Offer (or Rejected) → Offer Accepted → CoE Issued → Visa Lodged → Visa Granted

### Honest limitations (say these if asked)
- **Payment gateway is a demo** — it validates UPI/card/net-banking details and records a transaction, but no real money moves. A real version would use Razorpay/Stripe test keys.
- Loan interest rates, test-prep batches and accommodation listings are **indicative sample data**.
- Students log in with a stored user id (fine for a prototype); the counsellor desk uses a signed token.
- Reviews on the home page appear only after enrolled students post them (no fake reviews).
-    DevOps SLA 2026 - edited on GitHub
