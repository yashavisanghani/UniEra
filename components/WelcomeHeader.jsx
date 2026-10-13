import React from "react";

function WelcomeHeader() {
  return (
    <section className="mb-10">
      <h1 className="text-5xl font-extrabold text-[#001A47] tracking-tight">
        Welcome back, Student!
      </h1>

      <p className="text-lg text-gray-500 mt-3">
        Your global education journey is 65% complete.
      </p>
    </section>
  );
}

export default WelcomeHeader;