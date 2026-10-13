import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Phone, UserPlus } from "lucide-react";
import axios from "axios";
import AuthSidePanel from "../components/AuthSidePanel";
import AuthTabs from "../components/AuthTabs";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    phone_number: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm_password) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/signup",
        {
          full_name: form.full_name,
          phone_number: form.phone_number,
          email: form.email,
          password: form.password,
        }
      );

      if (res.data.success) {
        alert("Account Created Successfully");
        navigate("/login");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Signup failed. Please try again."
      );
    }
  };

  return (
    <div className="flex min-h-screen">
      <AuthSidePanel
        heading={
          <>
            Begin Your<br />
            Global Journey.
          </>
        }
        description="Join thousands of students achieving their dream of studying abroad."
      />

      <div className="flex flex-1 items-center justify-center px-6 py-10 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-1">
            Create Account
          </h2>

          <p className="text-gray-500 mb-6">
            Start your study abroad journey today.
          </p>

          <AuthTabs active="register" />

          {error && (
            <p className="text-red-500 text-sm mb-4">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <label className="text-sm font-medium text-gray-700">
              Full Name
            </label>

            <div className="relative mt-1 mb-4">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />

              <input
                type="text"
                name="full_name"
                placeholder="John Doe"
                value={form.full_name}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            {/* Phone Number */}
            <label className="text-sm font-medium text-gray-700">
              Phone Number
            </label>

            <div className="relative mt-1 mb-4">
              <Phone
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />

              <input
                type="tel"
                name="phone_number"
                placeholder="9876543210"
                value={form.phone_number}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            {/* Email */}
            <label className="text-sm font-medium text-gray-700">
              Email Address
            </label>

            <div className="relative mt-1 mb-4">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />

              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            {/* Password */}
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>

            <div className="relative mt-1 mb-4">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />

              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            {/* Confirm Password */}
            <label className="text-sm font-medium text-gray-700">
              Confirm Password
            </label>

            <div className="relative mt-1 mb-6">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />

              <input
                type="password"
                name="confirm_password"
                placeholder="••••••••"
                value={form.confirm_password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#1e1147] to-[#7c3aed] text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 transition"
            >
              Create Account
              <UserPlus size={18} />
            </button>
          </form>

          {/* Login Link */}
          <p className="text-sm text-center text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-violet-600 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}