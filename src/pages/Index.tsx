import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import AboutPreview from "@/components/AboutPreview";
import Pricing from "@/components/Pricing";
import LeadMagnet from "@/components/LeadMagnet";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <AboutPreview />
        <Pricing />
        <LeadMagnet />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
