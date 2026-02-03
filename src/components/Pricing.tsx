import { Check, Sparkles, Crown, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import heroBg from "@/assets/hero-bg.jpg";

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
  },
];

const SESSION_TIER = {
  name: "1:1 Session",
  price: 87,
  period: "/session",
  features: [
    "60-minute private session",
    "Personalized action plan",
    "Follow-up resources",
    "Online or in-person (Spain)",
    "Flexible scheduling",
  ],
  buttonText: "Book Session",
};

const Pricing = () => {
  const navigate = useNavigate();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

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
            cancel_url: `${window.location.origin}/`,
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

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/85 to-background" />
        <div className="absolute inset-0 bg-foreground/8" />
      </div>

      <div className="container relative z-10 px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.25)' }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <Sparkles size={16} className="text-primary" />
            <span className="text-sm font-sans font-medium text-primary">
              Simple Pricing
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-semibold mb-4">
            Invest in Your <span className="text-gradient-gold">Wellbeing</span>
          </h2>
          <p className="text-lg text-foreground/90 font-sans mb-3">
            <strong>4 Transformational Programs</strong> (12 Months Total) with <strong>12 Modules</strong> (A, B, C)
          </p>
          <p className="text-muted-foreground font-sans">
            Choose the membership that fits your needs. All options include access to our supportive expat community.
          </p>
        </div>

        {/* 4 Membership Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-8">
          {MEMBERSHIP_TIERS.map((tier) => (
            <Card
              key={tier.id}
              className="relative border-2 border-muted hover:border-primary/50 transition-all"
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
                    <span className="text-5xl font-extrabold text-primary">
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
                  className="w-full bg-primary"
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

        {/* 1:1 Session Card */}
        <div className="max-w-md mx-auto">
          <Card className="border-2 border-muted hover:border-primary/50 transition-all">
            <CardHeader className="text-center pt-8">
              <CardTitle className="text-xl font-serif mb-2">
                {SESSION_TIER.name}
              </CardTitle>
              <div className="mb-4">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-extrabold text-primary">
                    €{SESSION_TIER.price}
                  </span>
                  <span className="text-muted-foreground text-base font-medium">
                    {SESSION_TIER.period}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {SESSION_TIER.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check size={16} className="text-primary flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to="/booking">
                <Button className="w-full bg-primary">
                  {SESSION_TIER.buttonText}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
