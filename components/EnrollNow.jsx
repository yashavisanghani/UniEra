import { useState } from "react";
import axios from "axios";
import logo from "../assets/logo.png";

export default function EnrollNow() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    alternate_phone: "",
    date_of_birth: "",
    gender: "",
    nationality: "",
    passport_number: "",
    current_address: "",
    current_city: "",
    current_country: "",

    emergency_contact_name: "",
    emergency_contact_relation: "",
    emergency_contact_phone: "",

    highest_qualification: "",
    field_of_study: "",
    institution_name: "",
    graduation_year: "",
    percentage_gpa: "",
    academic_gap: "No",
    academic_gap_reason: "",
    backlogs: "No",
    backlogs_count: 0,

    english_test_type: "Not_Taken",
    english_test_score: "",
    other_test_type: "None",
    other_test_score: "",

    preferred_country: "",
    preferred_university: "",
    preferred_course: "",
    course_level: "",
    intake_month_year: "",

    budget_range: "",
    funding_source: "",

    work_experience_years: 0,

    visa_applied_before: "No",
    visa_rejected_before: "No",
    visa_rejection_details: "",

    declaration_agreed: false,
  });

  const [files, setFiles] = useState({
    transcript_file: null,
    passport_file: null,
    resume_file: null,
    sop_file: null,
    recommendation_letter_file: null,
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setFiles({
      ...files,
      [e.target.name]: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.declaration_agreed) {
      setMessage("Please agree to the declaration before submitting.");
      return;
    }

    const user_id = localStorage.getItem("user_id");

    const formData = new FormData();

    formData.append("user_id", user_id);

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    Object.entries(files).forEach(([key, file]) => {
      if (file) {
        formData.append(key, file);
      }
    });

    try {
      await axios.post(
        "http://localhost:5000/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("Enrollment submitted successfully! 🎉");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Something went wrong."
      );
    }
  };

  const inputClass =
    "uniera-input w-full border border-gray-200 rounded-xl px-4 py-3 bg-white/80 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition";

  const sectionClass =
    "bg-white/75 backdrop-blur-md rounded-2xl p-6 border border-white/80 shadow-sm";

  const sectionTitle =
    "text-lg font-bold text-[#081D4A] mb-5 flex items-center gap-3";

  return (
    <div className="uniera-page min-h-screen py-28 px-4 sm:px-6">

      <div className="uniera-content max-w-4xl mx-auto">

        {/* ================= HEADER ================= */}

        <div className="uniera-gradient rounded-3xl p-7 sm:p-9 text-white shadow-xl mb-8 animate-slide-up">

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">

            <div className="bg-white rounded-2xl w-20 h-20 flex items-center justify-center shadow-lg shrink-0">

              <img
                src={logo}
                alt="UNIERA Logo"
                className="w-16 h-16 object-contain"
              />

            </div>

            <div className="text-center sm:text-left">

              <p className="text-purple-200 text-sm font-semibold uppercase tracking-widest mb-1">
                UNIERA
              </p>

              <h1 className="text-3xl sm:text-4xl font-bold">
                Enroll Now
              </h1>

              <p className="text-purple-100 mt-2 max-w-2xl">
                Tell us about your academic background and study goals —
                our team will take it from here.
              </p>

            </div>

          </div>

        </div>

        {/* ================= FORM CARD ================= */}

        <div className="uniera-card rounded-3xl p-5 sm:p-8 animate-fade-in">

          {message && (
            <div className="mb-6 rounded-xl bg-violet-50 border border-violet-200 px-4 py-3 text-sm text-violet-700 font-medium">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-7">

            {/* ================= PERSONAL DETAILS ================= */}

            <div className={sectionClass}>

              <h2 className={sectionTitle}>
                <span className="w-2 h-7 rounded-full bg-violet-600"></span>
                Personal Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <input
                  name="full_name"
                  placeholder="Full Name"
                  onChange={handleChange}
                  required
                  className={inputClass}
                />

                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  onChange={handleChange}
                  required
                  className={inputClass}
                />

                <input
                  name="phone_number"
                  placeholder="Phone Number"
                  onChange={handleChange}
                  required
                  className={inputClass}
                />

                <input
                  name="alternate_phone"
                  placeholder="Alternate Phone"
                  onChange={handleChange}
                  className={inputClass}
                />

                <input
                  type="date"
                  name="date_of_birth"
                  onChange={handleChange}
                  required
                  className={inputClass}
                />

                <select
                  name="gender"
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer_not_to_say">
                    Prefer not to say
                  </option>
                </select>

                <input
                  name="nationality"
                  placeholder="Nationality"
                  onChange={handleChange}
                  required
                  className={inputClass}
                />

                <input
                  name="passport_number"
                  placeholder="Passport Number"
                  onChange={handleChange}
                  className={inputClass}
                />

              </div>

              <input
                name="current_address"
                placeholder="Current Address"
                onChange={handleChange}
                className={`mt-4 ${inputClass}`}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">

                <input
                  name="current_city"
                  placeholder="Current City"
                  onChange={handleChange}
                  className={inputClass}
                />

                <input
                  name="current_country"
                  placeholder="Current Country"
                  onChange={handleChange}
                  className={inputClass}
                />

              </div>

            </div>

            {/* ================= EMERGENCY CONTACT ================= */}

            <div className={sectionClass}>

              <h2 className={sectionTitle}>
                <span className="w-2 h-7 rounded-full bg-violet-600"></span>
                Emergency Contact
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                <input
                  name="emergency_contact_name"
                  placeholder="Contact Name"
                  onChange={handleChange}
                  className={inputClass}
                />

                <input
                  name="emergency_contact_relation"
                  placeholder="Relation"
                  onChange={handleChange}
                  className={inputClass}
                />

                <input
                  name="emergency_contact_phone"
                  placeholder="Contact Phone"
                  onChange={handleChange}
                  className={inputClass}
                />

              </div>

            </div>

            {/* ================= ACADEMIC BACKGROUND ================= */}

            <div className={sectionClass}>

              <h2 className={sectionTitle}>
                <span className="w-2 h-7 rounded-full bg-violet-600"></span>
                Academic Background
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <select
                  name="highest_qualification"
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  <option value="">
                    Highest Qualification
                  </option>
                  <option value="12th">12th</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Bachelors">Bachelors</option>
                  <option value="Masters">Masters</option>
                  <option value="PhD">PhD</option>
                </select>

                <input
                  name="field_of_study"
                  placeholder="Field of Study"
                  onChange={handleChange}
                  className={inputClass}
                />

                <input
                  name="institution_name"
                  placeholder="Institution Name"
                  onChange={handleChange}
                  className={inputClass}
                />

                <input
                  name="graduation_year"
                  type="number"
                  placeholder="Graduation Year"
                  onChange={handleChange}
                  className={inputClass}
                />

                <input
                  name="percentage_gpa"
                  placeholder="Percentage / GPA"
                  onChange={handleChange}
                  className={`${inputClass} sm:col-span-2`}
                />

                <select
                  name="academic_gap"
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="No">
                    Academic Gap: No
                  </option>
                  <option value="Yes">
                    Academic Gap: Yes
                  </option>
                </select>

                {form.academic_gap === "Yes" && (
                  <input
                    name="academic_gap_reason"
                    placeholder="Reason for Academic Gap"
                    onChange={handleChange}
                    className={inputClass}
                  />
                )}

                <select
                  name="backlogs"
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="No">
                    Backlogs: No
                  </option>
                  <option value="Yes">
                    Backlogs: Yes
                  </option>
                </select>

                {form.backlogs === "Yes" && (
                  <input
                    name="backlogs_count"
                    type="number"
                    placeholder="Number of Backlogs"
                    onChange={handleChange}
                    className={inputClass}
                  />
                )}

              </div>

            </div>

            {/* ================= TEST SCORES ================= */}

            <div className={sectionClass}>

              <h2 className={sectionTitle}>
                <span className="w-2 h-7 rounded-full bg-violet-600"></span>
                Test Scores
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <select
                  name="english_test_type"
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="Not_Taken">
                    English Test: Not Taken
                  </option>
                  <option value="IELTS">IELTS</option>
                  <option value="TOEFL">TOEFL</option>
                  <option value="PTE">PTE</option>
                  <option value="Duolingo">Duolingo</option>
                </select>

                <input
                  name="english_test_score"
                  placeholder="English Test Score"
                  onChange={handleChange}
                  className={inputClass}
                />

                <select
                  name="other_test_type"
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="None">
                    Other Test: None
                  </option>
                  <option value="GRE">GRE</option>
                  <option value="GMAT">GMAT</option>
                  <option value="SAT">SAT</option>
                </select>

                <input
                  name="other_test_score"
                  placeholder="Other Test Score"
                  onChange={handleChange}
                  className={inputClass}
                />

              </div>

            </div>

            {/* ================= STUDY PREFERENCES ================= */}

            <div className={sectionClass}>

              <h2 className={sectionTitle}>
                <span className="w-2 h-7 rounded-full bg-violet-600"></span>
                Study Preferences
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <input
                  name="preferred_country"
                  placeholder="Preferred Country"
                  onChange={handleChange}
                  required
                  className={inputClass}
                />

                <input
                  name="preferred_university"
                  placeholder="Preferred University"
                  onChange={handleChange}
                  className={inputClass}
                />

                <input
                  name="preferred_course"
                  placeholder="Preferred Course"
                  onChange={handleChange}
                  required
                  className={inputClass}
                />

                <select
                  name="course_level"
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  <option value="">Course Level</option>
                  <option value="Undergraduate">
                    Undergraduate
                  </option>
                  <option value="Postgraduate">
                    Postgraduate
                  </option>
                  <option value="Diploma">
                    Diploma
                  </option>
                  <option value="PhD">
                    PhD
                  </option>
                </select>

                <select
                  name="intake_month_year"
                  onChange={handleChange}
                  required
                  className={`${inputClass} sm:col-span-2`}
                >
                  <option value="">Preferred Intake</option>
                  <option value="September 2026">
                    September 2026
                  </option>
                  <option value="January 2027">
                    January 2027
                  </option>
                  <option value="May 2027">
                    May 2027
                  </option>
                </select>

              </div>

            </div>

            {/* ================= BUDGET ================= */}

            <div className={sectionClass}>

              <h2 className={sectionTitle}>
                <span className="w-2 h-7 rounded-full bg-violet-600"></span>
                Budget & Funding
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <input
                  name="budget_range"
                  placeholder="Budget Range"
                  onChange={handleChange}
                  className={inputClass}
                />

                <select
                  name="funding_source"
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">
                    Funding Source
                  </option>
                  <option value="Self_Funded">
                    Self Funded
                  </option>
                  <option value="Education_Loan">
                    Education Loan
                  </option>
                  <option value="Scholarship">
                    Scholarship
                  </option>
                  <option value="Family_Sponsored">
                    Family Sponsored
                  </option>
                </select>

              </div>

            </div>

            {/* ================= WORK EXPERIENCE ================= */}

            <div className={sectionClass}>

              <h2 className={sectionTitle}>
                <span className="w-2 h-7 rounded-full bg-violet-600"></span>
                Work Experience
              </h2>

              <input
                name="work_experience_years"
                type="number"
                min="0"
                placeholder="Years of Work Experience"
                onChange={handleChange}
                className={inputClass}
              />

            </div>

            {/* ================= VISA HISTORY ================= */}

            <div className={sectionClass}>

              <h2 className={sectionTitle}>
                <span className="w-2 h-7 rounded-full bg-violet-600"></span>
                Visa History
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <select
                  name="visa_applied_before"
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="No">
                    Applied for visa before: No
                  </option>
                  <option value="Yes">
                    Applied for visa before: Yes
                  </option>
                </select>

                <select
                  name="visa_rejected_before"
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="No">
                    Visa ever rejected: No
                  </option>
                  <option value="Yes">
                    Visa ever rejected: Yes
                  </option>
                </select>

                {form.visa_rejected_before === "Yes" && (
                  <input
                    name="visa_rejection_details"
                    placeholder="Rejection Details"
                    onChange={handleChange}
                    className={`${inputClass} sm:col-span-2`}
                  />
                )}

              </div>

            </div>

            {/* ================= DOCUMENTS ================= */}

            <div className={sectionClass}>

              <h2 className={sectionTitle}>
                <span className="w-2 h-7 rounded-full bg-violet-600"></span>
                Documents
              </h2>

              <div className="space-y-4">

                {[
                  ["transcript_file", "Academic Transcript"],
                  ["passport_file", "Passport Copy"],
                  ["resume_file", "Resume / CV"],
                  ["sop_file", "Statement of Purpose (SOP)"],
                  [
                    "recommendation_letter_file",
                    "Recommendation Letter",
                  ],
                ].map(([name, label]) => (
                  <div
                    key={name}
                    className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                  >
                    <label className="text-sm font-semibold text-gray-700">
                      {label}
                    </label>

                    <input
                      type="file"
                      name={name}
                      onChange={handleFileChange}
                      className="block w-full text-sm mt-2"
                    />
                  </div>
                ))}

              </div>

            </div>

            {/* ================= DECLARATION ================= */}

            <div className="bg-violet-50 border border-violet-100 rounded-2xl p-5">

              <label className="flex items-start gap-3 text-sm text-gray-700">

                <input
                  type="checkbox"
                  name="declaration_agreed"
                  checked={form.declaration_agreed}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 accent-violet-600"
                />

                <span>
                  I declare that the information provided above is
                  true and accurate to the best of my knowledge.
                </span>

              </label>

            </div>

            {/* ================= SUBMIT ================= */}

            <button
              type="submit"
              className="uniera-gradient uniera-button w-full text-white py-4 rounded-xl font-semibold text-lg shadow-lg"
            >
              Submit Enrollment →
            </button>

          </form>

        </div>

      </div>
    </div>
  );
}