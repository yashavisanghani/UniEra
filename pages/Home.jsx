import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Features from "../components/Features";
import Roadmap from "../components/Roadmap";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
import FloatingChat from "../components/FloatingChat";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E9E2FF] via-[#DFE7FF] to-[#E0F0FF]">

      <Navbar />

      <Hero />

      <Stats />

      <Features />

      <Roadmap />

      <Testimonials />

      <Footer />

      <FloatingChat />

    </div>
  );
}

export default Home;