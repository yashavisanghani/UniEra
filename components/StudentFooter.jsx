import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function StudentFooter() {
  return (
    <footer className="mt-16 bg-white border border-gray-200 rounded-[28px] shadow-sm overflow-hidden">

      <div className="px-8 lg:px-10 py-10">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div>

            <div className="flex items-center gap-3 mb-5">

              {/* UNIERA Logo */}
              <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden">
                <img
                  src={logo}
                  alt="UNIERA Logo"
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#001A47]">
                  UNIERA
                </h2>

                <p className="text-sm text-gray-500">
                  Study Abroad Platform
                </p>
              </div>

            </div>

            <p className="text-gray-500 leading-7 max-w-md">
              Helping students discover universities, manage applications,
              and achieve their dream of studying abroad.
            </p>

          </div>

          {/* Quick Links */}
          <div>

            <h3 className="text-lg font-bold text-[#001A47] mb-5">
              Quick Links
            </h3>

            <div className="flex flex-col gap-3">

              <Link
                to="/student-dashboard"
                className="text-gray-500 hover:text-[#6533E2] transition"
              >
                Dashboard
              </Link>

              <Link
                to="/applications"
                className="text-gray-500 hover:text-[#6533E2] transition"
              >
                Applications
              </Link>

              <Link
                to="/saved-universities"
                className="text-gray-500 hover:text-[#6533E2] transition"
              >
                Saved Universities
              </Link>

              <Link
                to="/document-checklist"
                className="text-gray-500 hover:text-[#6533E2] transition"
              >
                Documents
              </Link>

              <Link
                to="/settings"
                className="text-gray-500 hover:text-[#6533E2] transition"
              >
                Settings
              </Link>

            </div>

          </div>

          {/* Contact */}
          <div>

            <h3 className="text-lg font-bold text-[#001A47] mb-5">
              Contact
            </h3>

            <div className="space-y-4">

              <div className="flex items-center gap-3 text-gray-500">
                <Mail
                  size={19}
                  className="text-[#6533E2]"
                />
                <span>support@uniera.com</span>
              </div>

              <div className="flex items-center gap-3 text-gray-500">
                <Phone
                  size={19}
                  className="text-[#6533E2]"
                />
                <span>+91 98765 43210</span>
              </div>

              <div className="flex items-center gap-3 text-gray-500">
                <MapPin
                  size={19}
                  className="text-[#6533E2]"
                />
                <span>Mumbai, India</span>
              </div>

            </div>

          </div>

        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">

          <p className="text-sm text-gray-400">
            © 2026 UNIERA. All Rights Reserved.
          </p>

          <div className="flex items-center gap-6 text-sm">

            <Link
              to="/privacy-policy"
              className="text-gray-400 hover:text-[#6533E2] transition"
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms-conditions"
              className="text-gray-400 hover:text-[#6533E2] transition"
            >
              Terms
            </Link>

            <Link
              to="/contact"
              className="text-gray-400 hover:text-[#6533E2] transition"
            >
              Help Center
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
}

export default StudentFooter;