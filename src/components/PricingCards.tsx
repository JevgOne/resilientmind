import { Check, Sparkles, Crown, Loader2, Shield, Clock, Heart, Leaf, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  getVisibleTiers,
  getTierPrice,
  isEarlyBird,
  formatEarlyBirdEnd,
  type MembershipTier,
} from "@/lib/pricing";

interface PricingCardsProps {
  cancelUrl?: string;
}

const tierEmoji: Record<string, string> = {
  basic_monthly: '',
  basic_yearly: '',
  premium_monthly: '',
  premium_yearly: '',
};

const PricingCards = ({ cancelUrl = "/" }: PricingCardsProps) => {
  const navigate = useNavigate();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const visibleTiers = getVisibleTiers();
  const earlyBird = isEarlyBird();

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
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({
            product_type: productType,
            user_id: userData.user.id,
            success_url: `${window.location.origin}/pricing/success`,
            cancel_url: `${window.location.origin}${cancelUrl}`,
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

  const gridCols = visibleTiers.length <= 2 ? "lg:grid-cols-2" : "lg:grid-cols-4";

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 ${gridCols} gap-5 max-w-5xl mx-auto`}>
      {visibleTiers.map((tier) => {
        const currentPrice = getTierPrice(tier);
        const hasDiscount = earlyBird && tier.regularPrice !== tier.earlyBirdPrice;
        const isSelected = selectedTier === tier.id;

        return (
          <div
            key={tier.id}
            onClick={() => setSelectedTier(tier.id)}
            className={`group relative bg-card/80 backdrop-blur-sm rounded-3xl border-2 p-1 transition-all duration-300 cursor-pointer ${
              isSelected
                ? "border-primary bg-primary/5 shadow-[0_0_0_3px_rgba(196,155,65,0.2)] scale-[1.02]"
                : "border-border/60 hover:border-primary/30 hover:shadow-[0_8px_30px_-12px_hsla(30,25%,30%,0.12)]"
            }`}
          >
            {/* Badge */}
            {tier.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                <span className="inline-flex items-center gap-1 px-4 py-1.5 bg-gradient-gold text-white text-xs font-sans font-semibold rounded-full shadow-gold">
                  {tier.badge}
                </span>
              </div>
            )}

            {/* Early Bird Badge */}
            {hasDiscount && (
              <div className="absolute -top-3 right-4 z-10">
                <span className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-xs font-sans font-semibold rounded-full">
                  Early Bird
                </span>
              </div>
            )}

            {/* Selected indicator */}
            {isSelected && (
              <div className="absolute -top-2.5 left-4 px-3 py-0.5 bg-primary text-primary-foreground text-xs font-semibold rounded-full z-10">
                Selected
              </div>
            )}

            <div className="rounded-[1.25rem] bg-gradient-to-b from-background/60 to-background/30 p-6 pt-8 h-full flex flex-col">
              {/* Icon */}
              <div className="mb-4 flex justify-center">
                <div className="w-11 h-11 rounded-2xl bg-primary/8 flex items-center justify-center group-hover:bg-primary/12 transition-colors">
                  {tier.membershipType === 'premium' ? (
                    <Crown size={20} className="text-primary" />
                  ) : (
                    <Leaf size={20} className="text-primary" />
                  )}
                </div>
              </div>

              {/* Name */}
              <h3 className="text-center text-lg font-serif font-semibold text-foreground mb-2">
                {tier.name}
              </h3>

              {/* Subtitle */}
              <p className="text-center text-xs text-muted-foreground font-sans mb-4 leading-relaxed">
                {tier.subtitle}
              </p>

              {/* Price */}
              <div className="text-center mb-2">
                {hasDiscount && (
                  <div className="text-sm font-sans text-muted-foreground line-through mb-1">
                    €{tier.regularPrice}
                  </div>
                )}
                <div className="inline-flex items-baseline gap-0.5">
                  <span className="text-sm font-sans font-medium text-muted-foreground/70 -mr-0.5">€</span>
                  <span className="text-4xl font-serif font-bold tracking-tight text-foreground">
                    {currentPrice}
                  </span>
                </div>
                <div className="text-sm font-sans text-muted-foreground mt-0.5">
                  {tier.period}
                </div>
              </div>

              {/* Divider */}
              <div className="w-12 h-px bg-border/80 mx-auto my-4" />

              {/* What's included */}
              <p className="text-xs font-sans font-semibold text-foreground/70 uppercase tracking-wider mb-3">
                What's included
              </p>
              <ul className="space-y-2.5 mb-5">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-foreground/80">
                    <div className="w-4 h-4 rounded-full bg-primary/8 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={10} className="text-primary" strokeWidth={3} />
                    </div>
                    <span className="font-sans">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Quote */}
              {tier.quote && (
                <p className="text-xs text-muted-foreground italic font-sans text-center mb-4 px-2">
                  {tier.quote}
                </p>
              )}

              {/* Ideal for */}
              {tier.idealFor && tier.idealFor.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs font-sans font-semibold text-foreground/70 uppercase tracking-wider mb-2">
                    This is for you if you
                  </p>
                  <ul className="space-y-1.5">
                    {tier.idealFor.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-[12px] text-muted-foreground font-sans">
                        <Star size={10} className="text-primary mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Spacer to push button to bottom */}
              <div className="flex-grow" />

              {/* Pause note */}
              <p className="text-[11px] text-center text-muted-foreground/60 font-sans mb-3">
                {tier.interval === 'month'
                  ? 'You can pause anytime. Continue when it feels right.'
                  : 'Self-paced — the program stays open until you finish.'}
              </p>

              {/* Button */}
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  createCheckoutSession(tier.id);
                }}
                disabled={loadingTier === tier.id}
                className={`w-full rounded-full h-11 font-sans font-medium text-sm transition-all ${
                  isSelected
                    ? "bg-gradient-gold text-white shadow-gold hover:shadow-elevated"
                    : "bg-primary hover:bg-primary/90"
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
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const PricingTrustSignals = () => (
  <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-[13px] text-muted-foreground/70 mt-10">
    <div className="flex items-center gap-2">
      <Shield size={15} className="text-primary/60" />
      <span className="font-sans">Secure payment via Stripe</span>
    </div>
    <div className="flex items-center gap-2">
      <Clock size={15} className="text-primary/60" />
      <span className="font-sans">Cancel anytime — no lock-in</span>
    </div>
    <div className="flex items-center gap-2">
      <Heart size={15} className="text-primary/60" />
      <span className="font-sans">Instant access after payment</span>
    </div>
  </div>
);

export const EarlyBirdBanner = () => {
  const earlyBird = isEarlyBird();
  if (!earlyBird) return null;
  return (
    <div className="mb-8 inline-block bg-gradient-gold text-primary-foreground rounded-full px-6 py-2 font-sans font-semibold text-sm">
      Early-bird pricing until {formatEarlyBirdEnd()} — Save €10/month!
    </div>
  );
};

export default PricingCards;
