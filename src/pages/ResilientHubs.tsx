import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProgramOverview from "@/components/ProgramOverview";
import { Check, Sparkles, Download, ArrowRight, Heart, Brain, Users, Globe, Crown, Star, Zap, Video, FileText, Headphones, Shield, Clock, Loader2, X, ChevronDown, MessageCircle, Palette, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import PageHero from "@/components/PageHero";
import SEO from "@/components/SEO";

const MEMBERSHIP_TIERS = [
  {
    id: "monthly_basic",
    name: "Basic Monthly",
    price: 27,
    period: "/month",
    savings: null,
    badge: null,
    features: [
      "Monthly foundational module (Module A)",
      "Downloadable worksheets for Module A",
      "Access to meditation library",
      "Monthly content updates",
    ],
    buttonText: "Start Basic Monthly",
    highlighted: false,
  },
  {
    id: "yearly_basic",
    name: "Basic Yearly",
    price: 270,
    period: "/year",
    savings: "Save €54",
    badge: "Best Value",
    features: [
      "All 4 transformational programs (12 months)",
      "Complete access to all modules (A, B, C)",
      "All downloadable worksheets & exercises",
      "Full meditation & visualization library",
    ],
    buttonText: "Save with Basic Yearly",
    highlighted: true,
  },
  {
    id: "monthly_premium",
    name: "Premium Monthly",
    price: 47,
    period: "/month",
    savings: null,
    badge: null,
    features: [
      "Modules A & B of current month",
      "All Basic Monthly benefits",
      "Access to additional Resilient Hub (Module A)",
      "Priority support",
    ],
    buttonText: "Go Premium Monthly",
    highlighted: false,
  },
  {
    id: "yearly_premium",
    name: "Premium Yearly",
    price: 470,
    period: "/year",
    savings: "Save €94",
    badge: "Most Popular",
    features: [
      "All 4 programs with all modules (A, B, C)",
      "4 hours personal consultations (€348 value)",
      "Art expressive therapy materials kit",
      "Additional Resilient Hubs access",
      "All worksheets, meditations & exercises",
    ],
    buttonText: "Save with Premium Yearly",
    highlighted: true,
  },
];

const ResilientHubs = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const createCheckoutSession = async (productType: string) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      toast.error("Please log in first");
      navigate("/auth");
      return;
    }
    setLoadingTier(productType);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({
            product_type: productType,
            user_id: userData.user.id,
            success_url: `${window.location.origin}/pricing/success`,
            cancel_url: `${window.location.origin}/resilient-hubs`,
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create checkout session");
      }
      const data = await response.json();
      if (data.url) window.location.href = data.url;
      else throw new Error("No checkout URL returned");
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Failed to start checkout");
    } finally {
      setLoadingTier(null);
    }
  };

  const faqs = [
    {
      q: "Who is this program for?",
      a: "This program is designed specifically for expatriates — people living abroad who face unique challenges like cultural displacement, loneliness, identity shifts, and building a new life far from home. Whether you just moved or have lived abroad for years, this program meets you where you are."
    },
    {
      q: "How much time do I need per week?",
      a: "Each weekly session takes about 15–30 minutes. The video lessons are 10–15 minutes, and the workbook exercises can be done at your own pace. Everything is on-demand — no live schedules to worry about."
    },
    {
      q: "What's the difference between Basic and Premium?",
      a: "Basic gives you the foundational module each month — perfect for self-guided learners. Premium unlocks all modules (A, B, C), gives you 4 hours of personal consultations with Silvie, an art therapy materials kit, and access to all Specialized Hubs. It's the full transformation experience."
    },
    {
      q: "Can I cancel anytime?",
      a: "Yes, absolutely. Monthly plans can be cancelled anytime with no penalties. Yearly plans are a one-time payment with full access for 12 months."
    },
    {
      q: "Do I need any prior experience with therapy or art?",
      a: "Not at all! The techniques are designed for beginners. EFT tapping, art therapy exercises, and guided meditations are all explained step-by-step. You don't need to be 'artistic' — the creative exercises are about expression, not perfection."
    },
    {
      q: "What if I'm not sure it's right for me?",
      a: "Download our free guide first — it includes 3 of our core techniques so you can experience the approach before committing. You'll know within minutes if this resonates with you."
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="12-Month Membership Program to Inner Strength | Resilient Mind"
        description="Join a 12-month guided program with video lessons, workbooks and community support designed for expatriates seeking inner strength. From €27/month."
        path="/resilient-hubs"
      />
      <Navbar />

      <main className="pt-20">
        {/* Hero Section — Emotional hook */}
        <PageHero>
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Sparkles size={16} className="text-primary" />
              <span className="text-sm font-sans font-medium text-primary">
                For Expats Ready to Thrive
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold mb-6" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.25)' }}>
              Stop Surviving Abroad.
              <br />
              <span className="text-gradient-gold">Start Thriving.</span>
            </h1>

            <p className="text-lg md:text-xl text-foreground/85 font-sans leading-relaxed mb-4 max-w-3xl mx-auto">
              A 12-month guided program that transforms the loneliness, uncertainty, and cultural stress of expat life into your greatest strengths.
            </p>

            <p className="text-base text-muted-foreground font-sans mb-8 max-w-2xl mx-auto">
              Created by Silvie — an expatriate of 13+ years who turned her own struggles into a proven methodology combining EFT, art therapy, and energy work.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a
                href="#pricing"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-gold text-primary-foreground font-sans font-semibold rounded-full shadow-gold hover:shadow-elevated transition-all hover:scale-105"
              >
                See Plans & Pricing
                <ArrowRight size={18} />
              </a>
              <Link
                to="/free-guide"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-card/80 backdrop-blur-sm border border-border text-foreground font-sans font-medium rounded-full hover:bg-card transition-all"
              >
                <Download size={18} />
                Try Free Guide First
              </Link>
            </div>

            {/* Quick stats */}
            <div className="flex items-center justify-center gap-8 text-sm text-foreground/70">
              <span className="flex items-center gap-1.5"><Video size={14} className="text-primary" /> 48 video lessons</span>
              <span className="flex items-center gap-1.5"><FileText size={14} className="text-primary" /> 48 workbooks</span>
              <span className="flex items-center gap-1.5"><Clock size={14} className="text-primary" /> 15 min/week</span>
            </div>
          </div>
        </PageHero>

        {/* Pain Points — "Does this sound like you?" */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-4xl font-serif font-semibold mb-4 text-center">
                Does This Sound Like You?
              </h2>
              <p className="text-center text-muted-foreground font-sans mb-12 max-w-2xl mx-auto">
                If you're nodding to any of these, this program was built for you.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "You feel like you don't fully belong — not here, not back home",
                  "Loneliness hits you at unexpected moments, even in a crowd",
                  "You struggle to explain what you're going through to people who haven't lived abroad",
                  "Cultural differences exhaust you — small things feel overwhelming",
                  "You miss your support network and feel isolated in health challenges",
                  "You've lost parts of your identity and don't know who you're becoming",
                ].map((pain, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-card rounded-xl border border-border/50">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={14} className="text-primary" />
                    </div>
                    <span className="text-foreground/90 font-sans text-sm leading-relaxed">{pain}</span>
                  </div>
                ))}
              </div>

              <div className="text-center mt-10">
                <p className="text-lg font-serif text-foreground/80 italic max-w-2xl mx-auto">
                  "You don't need to figure this out alone. I've been exactly where you are — and I built this program to be the guide I wished I had."
                </p>
                <p className="text-sm text-primary font-sans font-medium mt-3">— Silvie, Founder</p>
              </div>
            </div>
          </div>
        </section>

        {/* What You Get — The Transformation */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-4xl font-serif font-semibold mb-4">
                  Your <span className="text-gradient-gold">12-Month Transformation</span>
                </h2>
                <p className="text-lg text-muted-foreground font-sans max-w-2xl mx-auto">
                  Each month tackles a different dimension of expat resilience. By the end, you'll have an unshakable inner foundation.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {[
                  { icon: Heart, title: "Inner Stability", desc: "Build emotional resilience that doesn't depend on your external circumstances", color: "bg-rose-50 text-rose-600" },
                  { icon: Brain, title: "Stress Management", desc: "Master EFT tapping, Byron Katie's method, and mindfulness for real-world challenges", color: "bg-blue-50 text-blue-600" },
                  { icon: Globe, title: "Cultural Navigation", desc: "Turn cultural differences from a source of stress into a source of strength", color: "bg-emerald-50 text-emerald-600" },
                  { icon: Users, title: "Relationships", desc: "Strengthen bonds with loved ones — both far away and in your new home", color: "bg-amber-50 text-amber-600" },
                  { icon: Palette, title: "Creative Expression", desc: "Process complex emotions through art therapy — no artistic talent needed", color: "bg-purple-50 text-purple-600" },
                  { icon: Activity, title: "Identity & Growth", desc: "Transform your expatriate identity into your greatest asset", color: "bg-teal-50 text-teal-600" },
                ].map((item, i) => (
                  <div key={i} className="p-6 bg-background rounded-2xl border border-border hover:border-primary/30 transition-all hover:shadow-md group">
                    <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <item.icon size={24} />
                    </div>
                    <h3 className="text-lg font-serif font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground font-sans leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Numbers strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-gradient-warm rounded-2xl">
                {[
                  { num: "48", label: "Video Lessons", sub: "10-15 min each" },
                  { num: "48", label: "Workbooks", sub: "With practical exercises" },
                  { num: "12", label: "Monthly Themes", sub: "Comprehensive journey" },
                  { num: "3", label: "Therapy Methods", sub: "EFT, Art, Meditation" },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-3xl md:text-4xl font-serif font-bold text-primary mb-1">{stat.num}</div>
                    <div className="text-sm font-sans font-semibold text-foreground/80">{stat.label}</div>
                    <div className="text-xs font-sans text-muted-foreground">{stat.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How It Works — Simple steps */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-4xl font-serif font-semibold mb-12 text-center">
                How It Works
              </h2>

              <div className="space-y-8">
                {[
                  { step: "1", title: "Choose Your Plan", desc: "Pick Basic for self-guided learning or Premium for the full experience with personal consultations and art therapy kit.", icon: Crown },
                  { step: "2", title: "Start This Month's Theme", desc: "Each month, a new module unlocks with video lessons, workbooks, and guided exercises tailored to a specific aspect of resilience.", icon: Video },
                  { step: "3", title: "Practice at Your Own Pace", desc: "Watch 1-2 videos per week (15 min each), complete the workbook exercises, and integrate the techniques into your daily life.", icon: FileText },
                  { step: "4", title: "Transform Over 12 Months", desc: "By month 12, you'll have a complete toolkit of resilience techniques and an unshakable inner foundation — your 'inner home' that travels with you.", icon: Heart },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-gradient-gold rounded-2xl flex items-center justify-center shadow-md">
                        <span className="text-xl font-bold text-white">{item.step}</span>
                      </div>
                    </div>
                    <div className="pt-1">
                      <h3 className="text-xl font-serif font-semibold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground font-sans leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Program Content Preview */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-4xl font-serif font-semibold mb-4 text-center">
                Explore the <span className="text-gradient-gold">Program Content</span>
              </h2>
              <p className="text-center text-muted-foreground font-sans mb-8">
                Preview the monthly video lessons, workbooks, and exercises included in your membership.
              </p>
              <ProgramOverview />
            </div>
          </div>
        </section>

        {/* Why Resilient Mind — Differentiators */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-4xl font-serif font-semibold mb-4 text-center">
                Why Resilient Mind Is <span className="text-gradient-gold">Different</span>
              </h2>
              <p className="text-center text-muted-foreground font-sans mb-12 max-w-2xl mx-auto">
                This isn't generic self-help. It's a program built from real expatriate experience.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { title: "Built by someone who's lived it", desc: "Silvie has 13+ years of expatriate experience across multiple countries. Every technique in this program was forged in real life — not a textbook.", icon: Globe },
                  { title: "Three proven methods, one program", desc: "We combine EFT tapping (evidence-based stress relief), expressive art therapy (emotional processing), and guided meditation (inner calm) into a single, cohesive journey.", icon: Zap },
                  { title: "Made for busy expat lives", desc: "15 minutes per week. No live schedules. No group calls to coordinate across time zones. Watch when you want, practice at your own pace.", icon: Clock },
                  { title: "Not just coping — transforming", desc: "Other programs teach you to 'manage' challenges. We help you turn uncertainty, cultural stress, and identity shifts into actual sources of strength and growth.", icon: Star },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-6 bg-card rounded-2xl border border-border hover:border-primary/30 transition-all">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-serif font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground font-sans leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 md:py-24 bg-gradient-warm" id="pricing">
          <div className="container px-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                  <Crown size={16} className="text-primary" />
                  <span className="text-sm font-sans font-medium text-primary">Choose Your Path</span>
                </div>
                <h2 className="text-2xl md:text-4xl font-serif font-semibold mb-4">
                  Invest in Your <span className="text-gradient-gold">Transformation</span>
                </h2>
                <p className="text-lg text-muted-foreground font-sans max-w-2xl mx-auto">
                  Less than the cost of one therapy session per month — with tools you'll use for the rest of your life.
                </p>
              </div>

              {/* 4 Pricing Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {MEMBERSHIP_TIERS.map((tier) => (
                  <Card
                    key={tier.id}
                    className={`relative border-2 transition-all ${
                      tier.highlighted
                        ? "border-primary shadow-elevated scale-105"
                        : "border-muted hover:border-primary/50"
                    }`}
                  >
                    {tier.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-gradient-gold text-white px-4 py-1">
                          {tier.badge}
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="text-center pt-8">
                      <div className="mb-4">
                        {tier.name.includes("Premium") ? (
                          <Crown className="h-10 w-10 mx-auto text-primary" />
                        ) : (
                          <Sparkles className="h-10 w-10 mx-auto text-primary" />
                        )}
                      </div>
                      <CardTitle className="text-xl font-serif mb-2">
                        {tier.name}
                      </CardTitle>
                      <div className="mb-4">
                        <div className="flex items-baseline justify-center gap-1">
                          <span className={`text-5xl font-extrabold ${tier.highlighted ? 'text-transparent bg-clip-text bg-gradient-gold' : 'text-primary'}`}>
                            €{tier.price}
                          </span>
                          <span className="text-muted-foreground text-base font-medium">
                            {tier.period}
                          </span>
                        </div>
                        {tier.savings && (
                          <Badge className="mt-3 bg-green-100 text-green-700 border-green-300 text-sm px-3 py-1">
                            {tier.savings}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      <ul className="space-y-3">
                        {tier.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Check size={16} className="text-primary flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        onClick={() => createCheckoutSession(tier.id)}
                        disabled={loadingTier === tier.id}
                        className={`w-full ${
                          tier.highlighted
                            ? "bg-gradient-gold text-white"
                            : "bg-primary"
                        }`}
                      >
                        {loadingTier === tier.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          tier.buttonText
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Trust signals */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield size={18} className="text-primary" />
                  <span>Secure payment via Stripe</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-primary" />
                  <span>Cancel anytime — no lock-in</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart size={18} className="text-primary" />
                  <span>Instant access after payment</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-4xl font-serif font-semibold mb-4 text-center">
                Frequently Asked Questions
              </h2>
              <p className="text-center text-muted-foreground font-sans mb-12">
                Everything you need to know before starting your journey.
              </p>

              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="border border-border rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
                    >
                      <span className="font-sans font-medium text-foreground pr-4">{faq.q}</span>
                      <ChevronDown size={20} className={`text-muted-foreground flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-5 -mt-1">
                        <p className="text-sm text-muted-foreground font-sans leading-relaxed">{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="mb-8">
                <div className="w-20 h-20 bg-gradient-gold rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart size={36} className="text-white" />
                </div>
                <h2 className="text-2xl md:text-4xl font-serif font-bold mb-4">
                  Your Inner Strength Goes
                  <br />
                  <span className="text-gradient-gold">Wherever Life Takes You</span>
                </h2>
                <p className="text-lg text-muted-foreground font-sans mb-3 max-w-2xl mx-auto">
                  You moved abroad for a reason. You took one of the bravest steps most people never will. Now it's time to build the resilience that matches your courage.
                </p>
                <p className="text-base text-foreground/80 font-sans italic max-w-xl mx-auto">
                  "The moment I stopped fighting against my expatriate challenges and started transforming them instead, everything changed."
                </p>
                <p className="text-sm text-primary font-sans font-medium mt-2">— Silvie, Founder of Resilient Mind</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#pricing"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-gold text-primary-foreground font-sans font-semibold rounded-full shadow-gold hover:shadow-elevated transition-all hover:scale-105"
                >
                  Start Your Transformation Today
                  <ArrowRight size={18} />
                </a>
                <Link
                  to="/free-guide"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-card border border-border font-sans font-medium rounded-full hover:bg-secondary transition-all"
                >
                  <Download size={18} />
                  Download Free Guide First
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ResilientHubs;
