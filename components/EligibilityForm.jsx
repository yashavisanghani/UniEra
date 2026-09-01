import { useState } from "react";

function EligibilityForm() {
  const [form, setForm] = useState({
    cgpa: "",
    budget: "",
    country: "",
    course: "",
    ielts: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">

      <div className="bg-white rounded-3xl shadow-xl p-10">

        <h2 className="text-3xl font-bold text-[#081D4A] mb-2">
          Academic Profile
        </h2>

        <p className="text-gray-500 mb-10">
          Fill in your details to check your eligibility for international universities.
        </p>

        <div className="grid md:grid-cols-2 gap-8">

          {/* CGPA */}
          <div>
            <label className="block mb-2 font-semibold">
              CGPA / GPA
            </label>

            <input
              type="number"
              step="0.1"
              name="cgpa"
              value={form.cgpa}
              onChange={handleChange}
              placeholder="e.g. 8.5"
              className="w-full border rounded-xl p-4 focus:ring-2 focus:ring-[#6C3CE9] outline-none"
            />
          </div>

          {/* Budget */}
          <div>
            <label className="block mb-2 font-semibold">
              Annual Budget (USD)
            </label>

            <input
              type="number"
              name="budget"
              value={form.budget}
              onChange={handleChange}
              placeholder="e.g. 35000"
              className="w-full border rounded-xl p-4 focus:ring-2 focus:ring-[#6C3CE9] outline-none"
            />
          </div>

          {/* Country */}
          <div>
            <label className="block mb-2 font-semibold">
              Preferred Country
            </label>

            <select
              name="country"
              value={form.country}
              onChange={handleChange}
              className="w-full border rounded-xl p-4 focus:ring-2 focus:ring-[#6C3CE9] outline-none"
            >
              <option value="">Select Country</option>
              <option>Australia</option>
              <option>Canada</option>
              <option>United Kingdom</option>
              <option>United States</option>
              <option>Germany</option>
              <option>Ireland</option>
              <option>New Zealand</option>
            </select>
          </div>

          {/* Course */}
          <div>
            <label className="block mb-2 font-semibold">
              Interested Course
            </label>

            <select
              name="course"
              value={form.course}
              onChange={handleChange}
              className="w-full border rounded-xl p-4 focus:ring-2 focus:ring-[#6C3CE9] outline-none"
            >
              <option value="">Select Course</option>
              <option>Computer Science</option>
              <option>Data Science</option>
              <option>Artificial Intelligence</option>
              <option>Business Administration</option>
              <option>Mechanical Engineering</option>
              <option>Civil Engineering</option>
              <option>Medicine</option>
            </select>
          </div>

          {/* IELTS */}
          <div className="md:col-span-2">
            <label className="block mb-2 font-semibold">
              IELTS Score
            </label>

            <input
              type="number"
              step="0.5"
              name="ielts"
              value={form.ielts}
              onChange={handleChange}
              placeholder="e.g. 7.5"
              className="w-full border rounded-xl p-4 focus:ring-2 focus:ring-[#6C3CE9] outline-none"
            />
          </div>

        </div>

        <div className="text-center mt-10">

          <button className="bg-gradient-to-r from-[#081D4A] to-[#6C3CE9] text-white px-12 py-4 rounded-xl text-lg font-semibold hover:scale-105 transition duration-300 shadow-lg">
            Check Eligibility
          </button>

        </div>

      </div>

    </section>
  );
}

export default EligibilityForm;