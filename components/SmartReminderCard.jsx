// src/components/SmartReminderCard.jsx

import {
  BellRing,
  CheckCircle2,
} from "lucide-react";

function SmartReminderCard() {
  return (
    <div className="rounded-[28px] overflow-hidden bg-gradient-to-br from-[#001A47] via-[#163A78] to-[#6533E2] p-8 text-white shadow-xl">

      <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6">

        <BellRing size={30} />

      </div>

      <h2 className="text-3xl font-bold leading-tight">
        Smart
        <br />
        Reminders
      </h2>

      <p className="mt-5 text-white/80 leading-7">
        Receive WhatsApp and Email alerts 48 hours before every
        important application deadline.
      </p>

      <button className="mt-8 w-full h-14 rounded-xl bg-white text-[#001A47] font-bold hover:scale-[1.02] transition-all">
        Enable Global Alerts
      </button>

      <div className="mt-8 border-t border-white/20 pt-6">

        <div className="flex items-center gap-3 mb-4">

          <CheckCircle2
            size={18}
            className="text-green-300"
          />

          <span className="text-sm">
            WhatsApp Notifications
          </span>

        </div>

        <div className="flex items-center gap-3 mb-4">

          <CheckCircle2
            size={18}
            className="text-green-300"
          />

          <span className="text-sm">
            Email Reminders
          </span>

        </div>

        <div className="flex items-center gap-3">

          <CheckCircle2
            size={18}
            className="text-green-300"
          />

          <span className="text-sm">
            Visa & University Alerts
          </span>

        </div>

      </div>

      <div className="flex items-center mt-8">

        <div className="flex -space-x-3">

          <div className="w-8 h-8 rounded-full bg-purple-300 border-2 border-white"></div>

          <div className="w-8 h-8 rounded-full bg-pink-300 border-2 border-white"></div>

          <div className="w-8 h-8 rounded-full bg-yellow-300 border-2 border-white"></div>

        </div>

        <span className="ml-4 text-sm text-white/70">
          Trusted by 12k+ students
        </span>

      </div>

    </div>
  );
}

export default SmartReminderCard;