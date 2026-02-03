import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProgramOverview from "@/components/ProgramOverview";
import { Check, Sparkles, Download, ArrowRight, Heart, Brain, Users, Globe, Coins, Fingerprint, Crown, Star, Zap, Video, FileText, Headphones } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageHero from "@/components/PageHero";
import SEO from "@/components/SEO";

const whatYouWillGain = [
  {
    icon: Heart,
    title: "Cultivate Inner Stability",
    description: "Independent of your external circumstances"
  },
  {
    icon: Brain,
    title: "Manage Emotional Stress",
    description: "Using EFT, Byron Katie, and mindfulness techniques"
  },
  {
    icon: Globe,
    title: "Navigate Cultural Differences",
    description: "With confidence and ease"
  },
  {
    icon: Users,
    title: "Strengthen Relationships",
    description: "With loved ones despite distance"
  },
  {
    icon: Coins,
    title: "Build Financial and Practical Resilience",
    description: "In a new environment"
  },
  {
    icon: Fingerprint,
    title: "Transform Your Identity",
    description: "Draw strength from both your home and new country"
  }
];

const programIncludes = [
  "48 weekly videos (10-15 min each)",
  "48 workbooks with exercises",
  "Guided meditations",
  "EFT / Art Therapy / Journaling practices",
  "Monthly integration rituals"
];

const whyDifferent = [
  {
    title: "Created by an expatriate for expatriates",
    description: "Built on 13 years of real-world experience living abroad"
  },
  {
    title: "Holistic integration",
    description: "Mind, body, and energy techniques working together for complete transformation"
  },
  {
    title: "Expressive arts approach",
    description: "Process complex emotions through creative expression when words aren't enough"
  },
  {
    title: "Personal experience with health challenges",
    description: "Optional specialized support for managing chronic conditions abroad"
  }
];

const ResilientHubs = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="12-Month Membership Program to Inner Strength | Resilient Mind"
        description="Join a 12-month guided program with video lessons, workbooks and community support designed for expatriates seeking inner strength."
        path="/resilient-hubs"
      />
      <Navbar />

      <main className="pt-20">
        {/* Hero Section */}
        <PageHero>
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                <Sparkles size={16} className="text-primary" />
                <span className="text-sm font-sans font-medium text-primary">
                  Building RESILIENT MIND
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-semibold mb-6">
                <span className="text-gradient-gold">12 Months Program</span>
                <br />
                to Inner Strength
              </h1>

              <p className="text-lg text-muted-foreground font-sans leading-relaxed mb-8 max-w-3xl mx-auto">
                Expat life can be rewarding, but it also comes with challenges—loneliness, cultural differences, uncertainty, and navigating health challenges while away from your familiar support network. I've been there. Using my 13 years of experience living abroad and my expertise in personal development, expressive arts, and holistic therapies, I created a program that turns these challenges into opportunities for growth and inner strength.
              </p>
            </div>
        </PageHero>

        {/* What You'll Gain */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-4xl font-serif font-semibold mb-4 text-center">
                What You'll Gain
              </h2>
              <p className="text-center text-muted-foreground font-sans mb-12">
                By the end of this 12-month journey, you will:
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                {whatYouWillGain.map((item, index) => (
                  <div key={index} className="flex gap-4 p-6 bg-card rounded-2xl border border-border">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-serif font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground font-sans">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How the Program Works */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl md:text-4xl font-serif font-semibold mb-6">
                How the Program Works
              </h2>
              <p className="text-lg text-muted-foreground font-sans mb-12 max-w-2xl mx-auto">
                Each month focuses on a specific aspect of resilience. You'll engage with creative exercises, therapeutic techniques, and reflective practices to build skills that last a lifetime.
              </p>

              <div className="bg-gradient-warm rounded-2xl p-8 md:p-12">
                <h3 className="text-xl md:text-2xl font-serif font-semibold mb-6">
                  Program Includes
                </h3>
                <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {programIncludes.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 text-left">
                      <Check size={20} className="text-primary flex-shrink-0" />
                      <span className="font-sans text-foreground/90">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Program Content / Video Lessons */}
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

        {/* Why Different */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-4xl font-serif font-semibold mb-12 text-center">
                Why <span className="text-gradient-gold">Resilient Hubs</span> are Different
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {whyDifferent.map((item, index) => (
                  <div key={index} className="p-6 bg-card rounded-2xl border border-border">
                    <h3 className="text-lg font-serif font-semibold mb-3 text-primary">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground font-sans">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 md:py-24 bg-gradient-warm">
          <div className="container px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                  <Crown size={16} className="text-primary" />
                  <span className="text-sm font-sans font-medium text-primary">Choose Your Path</span>
                </div>
                <h2 className="text-2xl md:text-4xl font-serif font-semibold mb-4">
                  Membership <span className="text-gradient-gold">Plans</span>
                </h2>
                <p className="text-muted-foreground font-sans max-w-2xl mx-auto">
                  Every plan gives you access to the full 12-month transformational journey. Choose the level of support that fits your needs.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
                {/* Basic Plan */}
                <Card className="border-2 border-muted hover:border-primary/40 transition-all relative overflow-hidden">
                  <CardHeader className="text-center pb-2">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-serif mb-1">Basic</CardTitle>
                    <p className="text-muted-foreground text-sm font-sans">Foundation for your transformation</p>
                    <div className="mt-4 space-y-1">
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-5xl font-extrabold text-primary">€27</span>
                        <span className="text-muted-foreground font-medium">/month</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        or <span className="font-semibold text-foreground">€270/year</span>
                        <Badge className="ml-2 bg-green-100 text-green-700 border-green-300 text-xs">Save €54</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3 mb-8">
                      {[
                        { icon: Video, text: "Monthly foundational video module (Module A)" },
                        { icon: FileText, text: "Downloadable worksheets & exercises" },
                        { icon: Headphones, text: "Full meditation & visualization library" },
                        { icon: Star, text: "Monthly content updates with new themes" },
                        { icon: Check, text: "Self-paced — work on your own schedule" },
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <item.icon size={18} className="text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm font-sans">{item.text}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to="/pricing">
                      <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white text-base py-6">
                        Start Basic Plan
                        <ArrowRight size={18} className="ml-2" />
                      </Button>
                    </Link>
                    <p className="text-xs text-center text-muted-foreground mt-3">
                      Perfect for self-guided learners
                    </p>
                  </CardContent>
                </Card>

                {/* Premium Plan */}
                <Card className="border-2 border-primary shadow-elevated relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 bg-gradient-gold text-white text-center text-sm font-semibold py-1.5">
                    ⭐ Most Popular — Best Value
                  </div>
                  <CardHeader className="text-center pb-2 pt-10">
                    <div className="w-16 h-16 bg-gradient-gold rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Crown className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-serif mb-1">Premium</CardTitle>
                    <p className="text-muted-foreground text-sm font-sans">Complete transformation with personal support</p>
                    <div className="mt-4 space-y-1">
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-gold">€47</span>
                        <span className="text-muted-foreground font-medium">/month</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        or <span className="font-semibold text-foreground">€470/year</span>
                        <Badge className="ml-2 bg-green-100 text-green-700 border-green-300 text-xs">Save €94</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3 mb-8">
                      {[
                        { icon: Video, text: "All modules (A, B, C) — complete program access" },
                        { icon: FileText, text: "All worksheets, workbooks & exercises" },
                        { icon: Headphones, text: "Full meditation & visualization library" },
                        { icon: Users, text: "4 hours personal consultations (€348 value)" },
                        { icon: Zap, text: "Art expressive therapy materials kit" },
                        { icon: Heart, text: "Access to all Specialized Hubs" },
                        { icon: Star, text: "Priority support & monthly check-ins" },
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <item.icon size={18} className="text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm font-sans">{item.text}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to="/pricing">
                      <Button className="w-full bg-gradient-gold text-white text-base py-6 shadow-gold hover:shadow-elevated transition-all">
                        Start Premium Plan
                        <ArrowRight size={18} className="ml-2" />
                      </Button>
                    </Link>
                    <p className="text-xs text-center text-muted-foreground mt-3">
                      Includes €348+ in personal consultation value
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Money back guarantee */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground font-sans">
                  💛 Not sure yet? <Link to="/free-guide" className="text-primary underline underline-offset-4 hover:text-primary/80">Download our free guide</Link> to get a taste of the program first.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-4xl font-serif font-semibold mb-4">
                Begin Your <span className="text-gradient-gold">Alchemical Journey</span>
              </h2>

              <p className="text-lg text-muted-foreground font-sans mb-6 max-w-2xl mx-auto">
                Your transformation doesn't wait for perfect circumstances—it begins the moment you decide to transform uncertainty into your greatest strength.
              </p>

              <p className="text-xl font-serif font-medium text-foreground/90 mb-8">
                With Resilient Mind, Your Inner Strength Goes Wherever Life Takes You
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link
                  to="/pricing"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-gold text-primary-foreground font-sans font-semibold rounded-full shadow-gold hover:shadow-elevated transition-all"
                >
                  Choose Your Membership – Start Today
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/free-guide"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-card border border-border font-sans font-medium rounded-full hover:bg-secondary transition-all"
                >
                  <Download size={18} />
                  Download 3 Resilience Techniques
                </Link>
              </div>

              {/* Testimonial */}
              <div className="bg-card rounded-2xl p-8 border border-border max-w-2xl mx-auto">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-gold rounded-full flex items-center justify-center">
                    <Heart size={28} className="text-primary-foreground" />
                  </div>
                  <div className="text-left">
                    <div className="font-serif font-semibold text-lg">Silvie</div>
                    <div className="text-sm text-muted-foreground font-sans">Founder, Resilient Mind</div>
                  </div>
                </div>
                <p className="text-muted-foreground font-sans italic text-left">
                  "The moment I stopped fighting against my expatriate challenges and started transforming them instead, everything changed. You can create your 'inner home' wherever you go."
                </p>
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
