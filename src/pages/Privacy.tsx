import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield } from "lucide-react";
import PageHero from "@/components/PageHero";
import SEO from "@/components/SEO";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Personal Data Protection (GDPR) | Resilient Mind"
        description="Statement on the Processing of Personal Data in accordance with GDPR. How Resilient Mind handles your personal data and your rights."
        path="/privacy"
      />
      <Navbar />

      <main className="pt-20">
        <PageHero>
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                <Shield size={16} className="text-primary" />
                <span className="text-sm font-sans font-medium text-primary">
                  Privacy
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-serif font-semibold mb-6">
                Personal Data Protection (GDPR)
              </h1>

              <p className="text-lg text-muted-foreground font-sans">
                Last updated: February 2026
              </p>
            </div>
        </PageHero>

        <section className="py-16 md:py-24 bg-background">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto prose prose-lg">
              <p className="text-muted-foreground font-sans mb-8 text-center italic">
                Statement on the Processing of Personal Data in accordance with Regulation (EU) 2016/679 (GDPR)
              </p>

              <p className="text-muted-foreground font-sans mb-8">
                If you are a customer, newsletter subscriber, or visitor of this website, you entrust us with your personal data. We are responsible for protecting it and ensuring its security. Please read this statement to understand how we handle your personal data and your rights under GDPR.
              </p>

              <h2 className="text-2xl font-serif font-semibold mb-4">1. Data Controller</h2>
              <p className="text-muted-foreground font-sans mb-2">
                The data controller for personal data on the website resilientmind.io is:
              </p>
              <p className="text-muted-foreground font-sans mb-6 pl-6">
                <strong>Resilient Mind</strong><br />
                Owner: Silvie Bogdanova<br />
                Country: Spain
              </p>

              <h2 className="text-2xl font-serif font-semibold mb-4">2. Contact Details</h2>
              <p className="text-muted-foreground font-sans mb-6">
                If you wish to contact the controller regarding personal data processing, you may email us at:{" "}
                <a href="mailto:contact@resilientmind.io" className="text-gold hover:underline">contact@resilientmind.io</a>
              </p>

              <h2 className="text-2xl font-serif font-semibold mb-4">3. Controller's Declaration</h2>
              <p className="text-muted-foreground font-sans mb-4">
                As the controller of your personal data, we declare that:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground font-sans mb-6 space-y-2">
                <li>We process personal data only on a valid legal basis: performance of a contract, legitimate interest, legal obligation, or your consent.</li>
                <li>We fulfill our information obligations in accordance with Article 13 of GDPR.</li>
                <li>We enable and support the exercise of your rights under GDPR.</li>
              </ul>

              <h2 className="text-2xl font-serif font-semibold mb-4">4. Scope of Personal Data Processed</h2>
              <p className="text-muted-foreground font-sans mb-4">
                We process personal data only for the purposes, duration, and extent necessary to provide our services, which may include:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground font-sans mb-6 space-y-2">
                <li>First and last name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Postal address</li>
                <li>Billing details (company name, VAT number, bank details)</li>
                <li>Other information required depending on the service provided</li>
              </ul>

              <h2 className="text-2xl font-serif font-semibold mb-4">5. Photos and Audio-Visual Recordings</h2>
              <p className="text-muted-foreground font-sans mb-6">
                During certain events, courses, or webinars, photographs or audio-visual recordings may be made. These materials may be used for promotional or educational purposes. Participants' names are never published without explicit consent.
              </p>

              <h2 className="text-2xl font-serif font-semibold mb-4">6. Cookies</h2>
              <p className="text-muted-foreground font-sans mb-4">
                When browsing our website, we may record your IP address, time spent on the site, and referring page.
              </p>
              <ul className="list-disc pl-6 text-muted-foreground font-sans mb-4 space-y-2">
                <li>Analytical cookies are processed based on our legitimate interest to improve our services.</li>
                <li>Marketing cookies are processed only with your consent.</li>
              </ul>
              <p className="text-muted-foreground font-sans mb-6">
                You can manage or disable cookies through your browser settings.
              </p>

              <h2 className="text-2xl font-serif font-semibold mb-4">7. Data Security</h2>
              <p className="text-muted-foreground font-sans mb-6">
                We use modern technical and organizational measures to protect personal data against misuse, damage, or loss. Our security measures are designed to match current technological standards.
              </p>

              <h2 className="text-2xl font-serif font-semibold mb-4">8. Transfer of Personal Data to Third Parties</h2>
              <p className="text-muted-foreground font-sans mb-4">
                For certain processing operations, we rely on trusted processors who comply with GDPR, including:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground font-sans mb-4 space-y-2">
                <li>Stripe (payments)</li>
                <li>Email marketing platforms</li>
                <li>Website analytics providers</li>
              </ul>
              <p className="text-muted-foreground font-sans mb-6">
                Personal data may also be disclosed if required by law.
              </p>

              <h2 className="text-2xl font-serif font-semibold mb-4">9. Your Rights</h2>
              <p className="text-muted-foreground font-sans mb-4">
                Under GDPR, you have the following rights:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground font-sans mb-4 space-y-2">
                <li>Access your personal data</li>
                <li>Rectify inaccurate data</li>
                <li>Request erasure ("right to be forgotten")</li>
                <li>Restrict processing</li>
                <li>Data portability</li>
                <li>Object to processing</li>
                <li>Withdraw consent at any time</li>
              </ul>
              <p className="text-muted-foreground font-sans mb-6">
                To exercise your rights, contact us at:{" "}
                <a href="mailto:contact@resilientmind.io" className="text-gold hover:underline">contact@resilientmind.io</a>
              </p>

              <h2 className="text-2xl font-serif font-semibold mb-4">10. Confidentiality</h2>
              <p className="text-muted-foreground font-sans mb-6">
                We are bound by confidentiality regarding personal data and our security measures. This obligation continues even after the end of any contractual relationship. Personal data will not be shared with third parties without your consent, unless required by law.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
