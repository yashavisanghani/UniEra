// src/pages/ContactUs.jsx

import { useState } from "react";
import StudentSidebar from "../components/StudentTopbar";
import StudentTopbar from "../components/StudentSidebar";
import StudentFooter from "../components/StudentFooter";
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  Send,
} from "lucide-react";

function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-[#F7F9FB] min-h-screen">
      <StudentSidebar />

      <div className="ml-72 min-h-screen flex flex-col">
        <StudentTopbar />

        <main className="flex-1 px-10 py-10">

          <div className="mb-10">
            <h1 className="text-5xl font-extrabold text-[#001A47]">
              Contact Us
            </h1>

            <p className="mt-4 text-lg text-gray-500">
              Have questions? We'd love to hear from you.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">

            <div className="space-y-6">

              <div className="bg-white rounded-3xl shadow-sm border p-6">
                <MapPin className="text-[#6533E2] mb-4" size={28} />

                <h3 className="text-xl font-bold">
                  Office Address
                </h3>

                <p className="mt-3 text-gray-500 leading-7">
                  UNIERA Headquarters
                  <br />
                  Mumbai, Maharashtra
                  <br />
                  India
                </p>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border p-6">
                <Mail className="text-blue-600 mb-4" size={28} />

                <h3 className="text-xl font-bold">
                  Email
                </h3>

                <p className="mt-3 text-gray-500">
                  support@uniera.com
                </p>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border p-6">
                <Phone className="text-green-600 mb-4" size={28} />

                <h3 className="text-xl font-bold">
                  Phone
                </h3>

                <p className="mt-3 text-gray-500">
                  +91 98765 43210
                </p>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border p-6">
                <Clock className="text-orange-500 mb-4" size={28} />

                <h3 className="text-xl font-bold">
                  Working Hours
                </h3>

                <p className="mt-3 text-gray-500">
                  Monday - Friday
                  <br />
                  9:00 AM - 6:00 PM
                </p>
              </div>

            </div>

            <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border p-8">

              <h2 className="text-3xl font-bold text-[#001A47] mb-8">
                Send us a Message
              </h2>

              <div className="grid md:grid-cols-2 gap-6">

                <div>
                  <label className="font-semibold">
                    Full Name
                  </label>

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full mt-2 border rounded-xl p-3"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="font-semibold">
                    Email
                  </label>

                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full mt-2 border rounded-xl p-3"
                    placeholder="Enter your email"
                  />
                </div>

              </div>

              <div className="mt-6">

                <label className="font-semibold">
                  Subject
                </label>

                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full mt-2 border rounded-xl p-3"
                  placeholder="Enter subject"
                />

              </div>

              <div className="mt-6">

                <label className="font-semibold">
                  Message
                </label>

                <textarea
                  rows={6}
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  className="w-full mt-2 border rounded-xl p-3 resize-none"
                  placeholder="Write your message..."
                />

              </div>

              <button className="mt-8 flex items-center gap-3 bg-[#6533E2] hover:bg-[#5629d4] text-white px-8 py-3 rounded-xl font-semibold">

                <Send size={18} />

                Send Message

              </button>

            </div>

          </div>

          <StudentFooter />

        </main>
      </div>
    </div>
  );
}

export default ContactUs;