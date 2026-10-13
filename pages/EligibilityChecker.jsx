import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import EligibilityHero from "../components/EligibilityHero";
import EligibilityForm from "../components/EligibilityForm";
import EligibilityResult from "../components/EligibilityResult";
import FAQ from "../components/FAQ";

function EligibilityChecker() {
  return (
    <>
      <Navbar />

      <main className="bg-gradient-to-br from-[#E9E2FF] via-[#DFE7FF] to-[#E0F0FF] pt-20">

        <EligibilityHero />

        <EligibilityForm />

        <EligibilityResult />

        <FAQ />

      </main>

      <Footer />
    </>
  );
}

export default EligibilityChecker;