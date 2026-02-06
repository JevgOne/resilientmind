import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Cookie } from "lucide-react";
import PageHero from "@/components/PageHero";
import SEO from "@/components/SEO";

const Cookies = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Cookies Policy | Resilient Mind"
        description="Learn how Resilient Mind uses cookies and similar technologies on our website, and how you can manage your preferences."
        path="/cookies"
      />
      <Navbar />

      <main className="pt-20">
        <PageHero>
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                <Cookie size={16} className="text-primary" />
                <span className="text-sm font-sans font-medium text-primary">
                  Cookies
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-serif font-semibold mb-6">
                Cookies Policy
              </h1>

              <p className="text-lg text-muted-foreground font-sans">
                Last updated: February 2026
              </p>
            </div>
        </PageHero>

        <section className="py-16 md:py-24 bg-background">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto prose prose-lg">
              <p className="text-muted-foreground font-sans mb-6">
                This Cookies Policy explains how Resilient Mind ("we," "our," "us") uses cookies and similar technologies on our website. It also explains your options for managing or disabling cookies.
              </p>
              <p className="text-muted-foreground font-sans mb-8">
                By using our website, you consent to our use of cookies as described in this policy.
              </p>

              <h2 className="text-2xl font-serif font-semibold mb-4">1. What Are Cookies?</h2>
              <p className="text-muted-foreground font-sans mb-6">
                A cookie is a small file that is downloaded to your computer or device when you visit a website. Cookies help websites recognize your device, store preferences, analyze usage, and provide personalized content or advertisements.
              </p>

              <h2 className="text-2xl font-serif font-semibold mb-4">2. Types of Cookies We Use</h2>

              <h3 className="text-xl font-serif font-semibold mb-3">a) Analytical / Performance Cookies</h3>
              <ul className="list-disc pl-6 text-muted-foreground font-sans mb-2 space-y-2">
                <li>These cookies help us measure how users interact with our website.</li>
                <li>Examples: Google Analytics cookies to track page visits, time on site, and navigation patterns.</li>
              </ul>
              <p className="text-muted-foreground font-sans mb-6">
                <strong>Purpose:</strong> To improve website performance and enhance your experience.
              </p>

              <h3 className="text-xl font-serif font-semibold mb-3">b) Functional / Preference Cookies</h3>
              <ul className="list-disc pl-6 text-muted-foreground font-sans mb-2 space-y-2">
                <li>Remember your preferences, such as language or settings in tools like video/audio players.</li>
              </ul>
              <p className="text-muted-foreground font-sans mb-6">
                <strong>Purpose:</strong> To ensure the website works as you expect each time you visit.
              </p>

              <h3 className="text-xl font-serif font-semibold mb-3">c) Registration / Authentication Cookies</h3>
              <ul className="list-disc pl-6 text-muted-foreground font-sans mb-2 space-y-2">
                <li>Used when you register or log in to a service on our website.</li>
              </ul>
              <p className="text-muted-foreground font-sans mb-6">
                <strong>Purpose:</strong> To keep you logged in and identify authorized users for restricted areas.
              </p>

              <h3 className="text-xl font-serif font-semibold mb-3">d) Advertising / Marketing Cookies</h3>
              <ul className="list-disc pl-6 text-muted-foreground font-sans mb-2 space-y-2">
                <li>Used to show personalized content or advertisements.</li>
                <li>May be set by us or by third-party advertising partners.</li>
              </ul>
              <p className="text-muted-foreground font-sans mb-6">
                <strong>Purpose:</strong> To deliver relevant ads based on browsing behavior.
              </p>

              <h3 className="text-xl font-serif font-semibold mb-3">e) Geolocation Cookies</h3>
              <ul className="list-disc pl-6 text-muted-foreground font-sans mb-2 space-y-2">
                <li>Identify the country or region of your visit to provide relevant content.</li>
                <li>Fully anonymous and only used for content targeting purposes.</li>
              </ul>

              <h2 className="text-2xl font-serif font-semibold mb-4 mt-8">3. Session vs Persistent Cookies</h2>
              <ul className="list-disc pl-6 text-muted-foreground font-sans mb-6 space-y-2">
                <li><strong>Session cookies:</strong> Deleted when you close your browser.</li>
                <li><strong>Persistent cookies:</strong> Stored until they expire or are manually deleted, e.g., to keep you logged in.</li>
              </ul>

              <h2 className="text-2xl font-serif font-semibold mb-4">4. First-Party vs Third-Party Cookies</h2>
              <ul className="list-disc pl-6 text-muted-foreground font-sans mb-6 space-y-2">
                <li><strong>First-party cookies:</strong> Set directly by Resilient Mind to provide our services.</li>
                <li><strong>Third-party cookies:</strong> Set by external services (e.g., Google Analytics, social media platforms) that may track your interactions with our website.</li>
              </ul>

              <h2 className="text-2xl font-serif font-semibold mb-4">5. Social Media Cookies</h2>
              <p className="text-muted-foreground font-sans mb-4">
                If you interact with our content on social media platforms (e.g., Facebook, Instagram, YouTube), these platforms may set cookies to measure engagement.
              </p>
              <ul className="list-disc pl-6 text-muted-foreground font-sans mb-6 space-y-2">
                <li>Their use is governed by the social platform's own privacy policy.</li>
                <li>We do not control how these third-party cookies are used.</li>
              </ul>

              <h2 className="text-2xl font-serif font-semibold mb-4">6. Managing or Disabling Cookies</h2>
              <p className="text-muted-foreground font-sans mb-4">
                You can manage, block, or delete cookies via your browser settings. Options are available for most browsers, such as:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground font-sans mb-4 space-y-2">
                <li><strong>Chrome:</strong>{" "}
                  <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">support.google.com/chrome/answer/95647</a>
                </li>
                <li><strong>Firefox:</strong>{" "}
                  <a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">support.mozilla.org</a>
                </li>
                <li><strong>Safari:</strong>{" "}
                  <a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">support.apple.com</a>
                </li>
              </ul>
              <p className="text-muted-foreground font-sans mb-6">
                You can choose to accept all cookies, reject all cookies, or be notified when a cookie is sent.
              </p>

              <h2 className="text-2xl font-serif font-semibold mb-4">7. Cookie Consent</h2>
              <p className="text-muted-foreground font-sans mb-6">
                When you first visit our website, you will see a cookie notice asking for your consent. Non-essential cookies (analytics, marketing) are only installed after you provide consent.
              </p>

              <h2 className="text-2xl font-serif font-semibold mb-4">8. Updates to This Policy</h2>
              <p className="text-muted-foreground font-sans mb-6">
                We may update this Cookies Policy to comply with new legal requirements or to reflect changes in our services. Updates will be published on this page. We recommend checking this page periodically.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Cookies;
