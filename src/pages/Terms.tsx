import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FileText } from "lucide-react";
import PageHero from "@/components/PageHero";
import SEO from "@/components/SEO";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="General Terms and Conditions | Resilient Mind"
        description="General Terms and Conditions for the sale of digital products by Resilient Mind. Rights, obligations, payments, refunds and data protection."
        path="/terms"
      />
      <Navbar />

      <main className="pt-20">
        <PageHero>
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                <FileText size={16} className="text-primary" />
                <span className="text-sm font-sans font-medium text-primary">
                  Legal
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-serif font-semibold mb-6">
                General Terms and Conditions
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
                for the Sale of Digital Products — Resilient Mind
              </p>

              <h2 className="text-2xl font-serif font-semibold mb-4">1. General Provisions</h2>
              <p className="text-muted-foreground font-sans mb-2">
                1.1 These General Terms and Conditions ("Terms") apply to the sale of digital products ("Products") by the Seller:
              </p>
              <p className="text-muted-foreground font-sans mb-2 pl-6">
                <strong>Resilient Mind</strong><br />
                Owner: Silvie Bogdanova<br />
                Website: www.resilientmind.io<br />
                Country: Spain
              </p>
              <p className="text-muted-foreground font-sans mb-2">
                1.2 These Terms define the rights and obligations of the Seller and the Buyer (also referred to as "Customer" or "Participant").
              </p>
              <p className="text-muted-foreground font-sans mb-2">
                1.3 These Terms form an integral part of the purchase contract.
              </p>
              <p className="text-muted-foreground font-sans mb-2">
                1.4 If the contracting party is a consumer, relationships not governed by these Terms are subject to applicable consumer protection and civil law regulations.
              </p>
              <p className="text-muted-foreground font-sans mb-6">
                1.5 These Terms are published on the Seller's website: www.resilientmind.io
              </p>

              <h2 className="text-2xl font-serif font-semibold mb-4">2. Order and Conclusion of Contract</h2>
              <p className="text-muted-foreground font-sans mb-2">
                2.1 The Product description, main features, and price (including applicable taxes) are stated on the Seller's website. The offer remains valid while displayed on the website.
              </p>
              <p className="text-muted-foreground font-sans mb-2">
                2.2 The order form contains Customer information, selected Product, price (including taxes and fees), payment method, and delivery method. Costs incurred when using remote communication means are borne by the Customer.
              </p>
              <p className="text-muted-foreground font-sans mb-2">
                2.3 The contract arises when the Customer submits the order by clicking the "Submit" button. By submitting the order, the Customer confirms acceptance of these Terms. The Seller does not accept offers with amendments or deviations.
              </p>
              <p className="text-muted-foreground font-sans mb-2">
                2.4 The Customer may review and correct entered data before submitting the order. Submitted data is considered accurate.
              </p>
              <p className="text-muted-foreground font-sans mb-2">
                2.5 The Customer agrees to use remote communication means for concluding the contract.
              </p>
              <p className="text-muted-foreground font-sans mb-2">
                2.6 The contract is concluded in English and stored electronically by the Seller for three (3) years.
              </p>
              <p className="text-muted-foreground font-sans mb-2">
                2.7 The Seller undertakes to deliver the ordered Product, and the Customer undertakes to pay the purchase price.
              </p>
              <p className="text-muted-foreground font-sans mb-6">
                2.8 The Customer acknowledges that proper use of digital Products requires up-to-date software and internet browsers.
              </p>

              <h2 className="text-2xl font-serif font-semibold mb-4">3. Price and Payment Terms</h2>
              <p className="text-muted-foreground font-sans mb-2">
                3.1 The Product price is listed on the Seller's website and in the order form.
              </p>
              <p className="text-muted-foreground font-sans mb-2">
                3.2 The Seller issues an invoice as proof of purchase. The Seller is not a VAT payer unless stated otherwise.
              </p>
              <p className="text-muted-foreground font-sans mb-2">
                3.3 Payment is cashless according to the order and invoice.
              </p>
              <p className="text-muted-foreground font-sans mb-2">
                3.4 Payments may be processed via secure third-party gateways, such as Stripe.
              </p>
              <p className="text-muted-foreground font-sans mb-2">
                3.5 Available payment methods are listed in the order form.
              </p>
              <p className="text-muted-foreground font-sans mb-2">
                3.6 Payment is made as a one-time transaction unless otherwise stated.
              </p>
              <p className="text-muted-foreground font-sans mb-2">
                3.7 The Customer must provide correct payment identification details.
              </p>
              <p className="text-muted-foreground font-sans mb-6">
                3.8 The purchase price is due within five (5) days of invoice issuance.
              </p>

              <h2 className="text-2xl font-serif font-semibold mb-4">4. Delivery Terms</h2>
              <p className="text-muted-foreground font-sans mb-2">
                4.1 Delivery of digital Products consists of sending access credentials or a URL link to the Customer's email address.
              </p>
              <p className="text-muted-foreground font-sans mb-6">
                4.2 Access is granted after full payment, no later than three (3) days unless stated otherwise.
              </p>

              <h2 className="text-2xl font-serif font-semibold mb-4">5. Copyright and Access Security</h2>
              <p className="text-muted-foreground font-sans mb-2">
                5.1 Access credentials are for personal use only. The Customer must keep login details confidential.
              </p>
              <p className="text-muted-foreground font-sans mb-6">
                5.2 All Products and content are protected by copyright law. Unauthorized distribution is prohibited.
              </p>

              <h2 className="text-2xl font-serif font-semibold mb-4">6. Withdrawal from Contract</h2>
              <p className="text-muted-foreground font-sans mb-2">
                <strong>6.1 Consumer withdrawal</strong><br />
                Consumers may withdraw from the contract within fourteen (14) days of delivery without giving reasons.
              </p>
              <p className="text-muted-foreground font-sans mb-2">
                <strong>6.2 Withdrawal procedure</strong><br />
                Notice of withdrawal must be sent by email to{" "}
                <a href="mailto:contact@resilientmind.io" className="text-gold hover:underline">contact@resilientmind.io</a>.
                Refunds are processed within 14 days.
              </p>
              <p className="text-muted-foreground font-sans mb-6">
                <strong>6.3 Seller withdrawal</strong><br />
                The Seller may withdraw from the contract if the Customer materially breaches obligations, including non-payment or copyright infringement.
              </p>

              <h2 className="text-2xl font-serif font-semibold mb-4">7. Defective Performance</h2>
              <p className="text-muted-foreground font-sans mb-2">
                7.1 Rights arising from defective performance are governed by applicable law.
              </p>
              <p className="text-muted-foreground font-sans mb-6">
                7.2 The Seller is not liable for issues caused by insufficient technical conditions or improper use.
              </p>

              <h2 className="text-2xl font-serif font-semibold mb-4">8. Money-Back Guarantee</h2>
              <p className="text-muted-foreground font-sans mb-2">
                8.1 Selected Products may include a satisfaction guarantee under conditions stated on the Product page.
              </p>
              <p className="text-muted-foreground font-sans mb-2">
                8.2 Withdrawal requests must be sent to{" "}
                <a href="mailto:contact@resilientmind.io" className="text-gold hover:underline">contact@resilientmind.io</a>{" "}
                with proof of purchase.
              </p>
              <p className="text-muted-foreground font-sans mb-6">
                8.3 Refunds are processed within 14 days, and access will be deactivated.
              </p>

              <h2 className="text-2xl font-serif font-semibold mb-4">9. Disclaimer of Liability</h2>
              <p className="text-muted-foreground font-sans mb-6">
                9.1 Products are provided for educational and informational purposes only and do not replace professional medical or psychological care.
              </p>

              <h2 className="text-2xl font-serif font-semibold mb-4">10. Personal Data Protection</h2>
              <p className="text-muted-foreground font-sans mb-2">
                10.1 Personal data is processed in accordance with GDPR and the{" "}
                <a href="/privacy" className="text-gold hover:underline">Privacy Policy</a>.
              </p>
              <p className="text-muted-foreground font-sans mb-2">
                10.2 Customers may request information, corrections, or deletion via{" "}
                <a href="mailto:contact@resilientmind.io" className="text-gold hover:underline">contact@resilientmind.io</a>.
              </p>
              <p className="text-muted-foreground font-sans mb-2">
                10.3 Data may be collected automatically when visiting the website.
              </p>
              <p className="text-muted-foreground font-sans mb-2">
                10.4 Marketing communications are voluntary and can be unsubscribed at any time.
              </p>
              <p className="text-muted-foreground font-sans mb-2">
                10.5 By submitting the order form, the Customer consents to personal data processing for marketing purposes until consent is withdrawn.
              </p>
              <p className="text-muted-foreground font-sans mb-6">
                10.6 Cookies may be used to improve website functionality.
              </p>

              <h2 className="text-2xl font-serif font-semibold mb-4">11. Final Provisions</h2>
              <p className="text-muted-foreground font-sans mb-2">
                11.1 These Terms are published on the Seller's website.
              </p>
              <p className="text-muted-foreground font-sans mb-2">
                11.2 Complaints may be submitted via email to{" "}
                <a href="mailto:contact@resilientmind.io" className="text-gold hover:underline">contact@resilientmind.io</a>.
              </p>
              <p className="text-muted-foreground font-sans mb-2">
                11.3 Any disputes shall be resolved by courts of the Seller's registered country unless mandatory consumer laws apply.
              </p>
              <p className="text-muted-foreground font-sans mb-2">
                11.4 The Seller reserves the right to amend these Terms.
              </p>
              <p className="text-muted-foreground font-sans mb-6">
                11.5 The valid and effective version of these Terms is effective from February 2026.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
