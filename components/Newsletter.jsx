import { useState } from "react";
import {
  Mail,
  Sparkles,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return;
    }

    setSubscribed(true);
  };

  return (
    <section className="py-20 sm:py-24">

      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#081D4A] via-[#2B2F8A] to-[#6C3CE9] px-6 sm:px-10 py-14 sm:py-16 text-center shadow-2xl">

          {/* Background Glow */}

          <div
            className="absolute -top-32 -right-20 w-80 h-80 rounded-full bg-purple-300/20 blur-3xl"
            style={{
              animation: "newsletterGlow1 8s ease-in-out infinite",
            }}
          />

          <div
            className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-blue-300/20 blur-3xl"
            style={{
              animation: "newsletterGlow2 10s ease-in-out infinite",
            }}
          />

          {/* Content */}

          <div
            className="relative z-10"
            style={{
              animation: "newsletterFadeUp 0.7s ease-out",
            }}
          >

            {/* Badge */}

            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md text-white px-5 py-2.5 rounded-full text-sm font-semibold mb-6">

              <Sparkles
                size={16}
                className="text-yellow-300"
              />

              Stay Updated

            </div>

            {/* Heading */}

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">

              Never Miss a Scholarship Deadline

            </h2>

            {/* Description */}

            <p className="max-w-3xl mx-auto mt-6 text-base sm:text-lg text-white/75 leading-8">

              Receive personalized scholarship recommendations,
              application reminders, and the latest funding opportunities
              from top universities directly in your inbox.

            </p>

            {/* ================= FORM ================= */}

            {!subscribed ? (

              <form
                onSubmit={handleSubscribe}
                className="mt-10 flex flex-col sm:flex-row gap-3 justify-center max-w-3xl mx-auto"
              >

                {/* Email */}

                <div className="relative flex-1">

                  <Mail
                    size={19}
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full rounded-2xl bg-white px-6 py-4 pl-12 text-[#081D4A] outline-none border-2 border-transparent focus:border-violet-300 shadow-lg transition"
                  />

                </div>

                {/* Subscribe */}

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-white text-[#6C3CE9] px-8 py-4 font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition duration-300 whitespace-nowrap"
                >

                  Subscribe Now

                  <ArrowRight size={18} />

                </button>

              </form>

            ) : (

              /* ================= SUCCESS ================= */

              <div className="mt-10 max-w-xl mx-auto rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md px-6 py-5">

                <div className="flex items-center justify-center gap-3 text-white">

                  <CheckCircle
                    size={24}
                    className="text-green-300"
                  />

                  <p className="font-semibold">
                    You're subscribed successfully!
                  </p>

                </div>

                <p className="text-white/60 text-sm mt-2">
                  We'll send scholarship updates to {email}.
                </p>

              </div>

            )}

            {/* Bottom Text */}

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-7 text-sm text-white/50">

              <span>No spam</span>

              <span>•</span>

              <span>Unsubscribe anytime</span>

              <span>•</span>

              <span>100% Free</span>

            </div>

          </div>

        </div>

      </div>

      {/* ================= ANIMATIONS ================= */}

      <style>{`

        @keyframes newsletterFadeUp {

          from {
            opacity: 0;
            transform: translateY(25px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }

        }

        @keyframes newsletterGlow1 {

          0%, 100% {
            transform: translate(0, 0) scale(1);
          }

          50% {
            transform: translate(-40px, 35px) scale(1.12);
          }

        }

        @keyframes newsletterGlow2 {

          0%, 100% {
            transform: translate(0, 0) scale(1);
          }

          50% {
            transform: translate(45px, -35px) scale(1.1);
          }

        }

      `}</style>

    </section>
  );
};

export default Newsletter;