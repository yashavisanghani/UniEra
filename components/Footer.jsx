import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function Footer() {
  return (
    <footer className="bg-[#081D4A] text-white">

      {/* Footer */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-4 gap-10">

        {/* Logo */}
        <div>

          <div className="flex items-center gap-3">
            <img src={logo} alt="logo" className="h-12" />
            <h2 className="text-3xl font-bold">UNIERA</h2>
          </div>

          <p className="mt-6 text-gray-300">
            Helping students discover universities, scholarships,
            eligibility and admissions worldwide.
          </p>

        </div>

        {/* Quick Links */}
        <div>

          <h3 className="font-bold text-xl mb-5">Quick Links</h3>

          <ul className="space-y-3">

            <li>
              <Link
                to="/"
                className="text-gray-300 hover:text-white transition"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/universities"
                className="text-gray-300 hover:text-white transition"
              >
                Universities
              </Link>
            </li>

            <li>
              <Link
                to="/scholarship-finder"
                className="text-gray-300 hover:text-white transition"
              >
                Scholarships
              </Link>
            </li>

            <li>
              <Link
                to="/eligibility"
                className="text-gray-300 hover:text-white transition"
              >
                Eligibility
              </Link>
            </li>

            <li>
              <Link
                to="/profile"
                className="text-gray-300 hover:text-white transition"
              >
                Profile
              </Link>
            </li>

          </ul>

        </div>

        {/* Study Destinations */}
        <div>

          <h3 className="font-bold text-xl mb-5">
            Study Destinations
          </h3>

          <ul className="space-y-3 text-gray-300">
            <li>🇦🇺 Australia</li>
            <li>🇨🇦 Canada</li>
            <li>🇬🇧 United Kingdom</li>
            <li>🇺🇸 USA</li>
            <li>🇩🇪 Germany</li>
          </ul>

        </div>

        {/* Contact */}
        <div>

          <h3 className="font-bold text-xl mb-5">
            Contact
          </h3>

          <div className="space-y-4">

            <div className="flex items-center gap-2">
              <Mail size={18} />
              support@uniera.com
            </div>

            <div className="flex items-center gap-2">
              <Phone size={18} />
              +91 9876543210
            </div>

            <div className="flex items-center gap-2">
              <MapPin size={18} />
              Mumbai, India
            </div>

          </div>

        </div>

      </div>

      <div className="border-t border-gray-700 py-6 text-center text-gray-400">
        © 2026 UNIERA. All Rights Reserved.
      </div>

    </footer>
  );
}

export default Footer;