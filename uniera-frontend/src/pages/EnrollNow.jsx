import { useState } from "react";
import axios from "axios";
import { GraduationCap } from "lucide-react";

export default function EnrollNow() {
  const [form, setForm] = useState({
    full_name: "",
    phone_number: "",
    alternate_phone: "",
    email: "",
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
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
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

    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    Object.entries(files).forEach(([key, file]) => {
      if (file) formData.append(key, file);
    });

    try {
      await axios.post("http://localhost:5000/enroll", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      localStorage.setItem("is_enrolled", "true");
      setMessage("Enrollment submitted successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  const inputClass =
    "border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500";

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
        <div className="flex items-center gap-2 mb-1">
          <GraduationCap className="text-violet-600" size={28} />
          <h2 className="text-3xl font-bold text-gray-900">Enroll Now</h2>
        </div>
        <p className="text-gray-500 mb-6">
          Tell us about your academic background and study goals — our team will take it from here.
        </p>

        {message && <p className="text-sm mb-4 text-violet-600 font-medium">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Personal Details */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Personal Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input name="full_name" placeholder="Full Name" onChange={handleChange} required className={inputClass} />
              <input name="email" type="email" placeholder="Email" onChange={handleChange} required className={inputClass} />
              <input name="phone_number" placeholder="Phone Number" onChange={handleChange} required className={inputClass} />
              <input name="alternate_phone" placeholder="Alternate Phone" onChange={handleChange} className={inputClass} />
              <input type="date" name="date_of_birth" onChange={handleChange} className={inputClass} required />
              <select name="gender" onChange={handleChange} className={inputClass}>
                <option value="">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer_not_to_say">Prefer not to say</option>
              </select>
              <input name="nationality" placeholder="Nationality" onChange={handleChange} required className={inputClass} />
              <input name="passport_number" placeholder="Passport Number" onChange={handleChange} className={inputClass} />
            </div>
            <input name="current_address" placeholder="Current Address" onChange={handleChange} className={`w-full mt-4 ${inputClass}`} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <input name="current_city" placeholder="Current City" onChange={handleChange} className={inputClass} />
              <input name="current_country" placeholder="Current Country" onChange={handleChange} className={inputClass} />
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Emergency Contact
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input name="emergency_contact_name" placeholder="Contact Name" onChange={handleChange} className={inputClass} />
              <input name="emergency_contact_relation" placeholder="Relation" onChange={handleChange} className={inputClass} />
              <input name="emergency_contact_phone" placeholder="Contact Phone" onChange={handleChange} className={inputClass} />
            </div>
          </div>

          {/* Academic Background */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Academic Background
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select name="highest_qualification" onChange={handleChange} required className={inputClass}>
                <option value="">Highest Qualification</option>
                <option value="12th">12th</option>
                <option value="Diploma">Diploma</option>
                <option value="Bachelors">Bachelors</option>
                <option value="Masters">Masters</option>
                <option value="PhD">PhD</option>
              </select>
              <input name="field_of_study" placeholder="Field of Study" onChange={handleChange} className={inputClass} />
              <input name="institution_name" placeholder="Institution Name" onChange={handleChange} className={inputClass} />
              <input name="graduation_year" type="number" placeholder="Graduation Year" onChange={handleChange} className={inputClass} />
              <input name="percentage_gpa" placeholder="Percentage / GPA" onChange={handleChange} className={`${inputClass} sm:col-span-2`} />

              <select name="academic_gap" onChange={handleChange} className={inputClass}>
                <option value="No">Academic Gap: No</option>
                <option value="Yes">Academic Gap: Yes</option>
              </select>
              {form.academic_gap === "Yes" && (
                <input name="academic_gap_reason" placeholder="Reason for Gap" onChange={handleChange} className={inputClass} />
              )}

              <select name="backlogs" onChange={handleChange} className={inputClass}>
                <option value="No">Backlogs: No</option>
                <option value="Yes">Backlogs: Yes</option>
              </select>
              {form.backlogs === "Yes" && (
                <input name="backlogs_count" type="number" placeholder="Number of Backlogs" onChange={handleChange} className={inputClass} />
              )}
            </div>
          </div>

          {/* Test Scores */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Test Scores
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select name="english_test_type" onChange={handleChange} className={inputClass}>
                <option value="Not_Taken">English Test: Not Taken</option>
                <option value="IELTS">IELTS</option>
                <option value="TOEFL">TOEFL</option>
                <option value="PTE">PTE</option>
                <option value="Duolingo">Duolingo</option>
              </select>
              <input name="english_test_score" placeholder="English Test Score" onChange={handleChange} className={inputClass} />

              <select name="other_test_type" onChange={handleChange} className={inputClass}>
                <option value="None">Other Test: None</option>
                <option value="GRE">GRE</option>
                <option value="GMAT">GMAT</option>
                <option value="SAT">SAT</option>
              </select>
              <input name="other_test_score" placeholder="Other Test Score" onChange={handleChange} className={inputClass} />
            </div>
          </div>

          {/* Study Preferences */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Study Preferences
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input name="preferred_country" placeholder="Preferred Country" onChange={handleChange} required className={inputClass} />
              <input name="preferred_university" placeholder="Preferred University" onChange={handleChange} className={inputClass} />
              <input name="preferred_course" placeholder="Preferred Course" onChange={handleChange} required className={inputClass} />
              <select name="course_level" onChange={handleChange} required className={inputClass}>
                <option value="">Course Level</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="Diploma">Diploma</option>
                <option value="PhD">PhD</option>
              </select>
              <select name="intake_month_year" onChange={handleChange} required className={`${inputClass} sm:col-span-2`}>
                <option value="">Preferred Intake</option>
                <option value="September 2026">September 2026</option>
                <option value="January 2027">January 2027</option>
                <option value="May 2027">May 2027</option>
              </select>
            </div>
          </div>

          {/* Budget & Funding */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Budget & Funding
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input name="budget_range" placeholder="Budget Range" onChange={handleChange} className={inputClass} />
              <select name="funding_source" onChange={handleChange} className={inputClass}>
                <option value="">Funding Source</option>
                <option value="Self_Funded">Self Funded</option>
                <option value="Education_Loan">Education Loan</option>
                <option value="Scholarship">Scholarship</option>
                <option value="Family_Sponsored">Family Sponsored</option>
              </select>
            </div>
          </div>

          {/* Work Experience */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Work Experience
            </h3>
            <input name="work_experience_years" type="number" min="0" placeholder="Years of Work Experience" onChange={handleChange} className={`w-full ${inputClass}`} />
          </div>

          {/* Visa History */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Visa History
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select name="visa_applied_before" onChange={handleChange} className={inputClass}>
                <option value="No">Applied for visa before: No</option>
                <option value="Yes">Applied for visa before: Yes</option>
              </select>
              <select name="visa_rejected_before" onChange={handleChange} className={inputClass}>
                <option value="No">Visa ever rejected: No</option>
                <option value="Yes">Visa ever rejected: Yes</option>
              </select>
              {form.visa_rejected_before === "Yes" && (
                <input name="visa_rejection_details" placeholder="Rejection Details" onChange={handleChange} className={`${inputClass} sm:col-span-2`} />
              )}
            </div>
          </div>

          {/* Documents */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Documents
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Academic Transcript</label>
                <input type="file" name="transcript_file" onChange={handleFileChange} className="block w-full text-sm mt-1" />
              </div>
              <div>
                <label className="text-sm text-gray-600">Passport Copy</label>
                <input type="file" name="passport_file" onChange={handleFileChange} className="block w-full text-sm mt-1" />
              </div>
              <div>
                <label className="text-sm text-gray-600">Resume / CV</label>
                <input type="file" name="resume_file" onChange={handleFileChange} className="block w-full text-sm mt-1" />
              </div>
              <div>
                <label className="text-sm text-gray-600">Statement of Purpose (SOP)</label>
                <input type="file" name="sop_file" onChange={handleFileChange} className="block w-full text-sm mt-1" />
              </div>
              <div>
                <label className="text-sm text-gray-600">Recommendation Letter</label>
                <input type="file" name="recommendation_letter_file" onChange={handleFileChange} className="block w-full text-sm mt-1" />
              </div>
            </div>
          </div>

          {/* Declaration */}
          <label className="flex items-start gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              name="declaration_agreed"
              checked={form.declaration_agreed}
              onChange={handleChange}
              className="mt-1 rounded"
            />
            I declare that the information provided above is true and accurate to the best of my knowledge.
          </label>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#1e1147] to-[#7c3aed] text-white py-3 rounded-lg font-medium hover:opacity-90 transition"
          >
            Submit Enrollment
          </button>
        </form>
      </div>
    </div>
  );
}