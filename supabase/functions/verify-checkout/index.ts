import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function sendMembershipEmail(supabaseAdmin: ReturnType<typeof createClient>, userId: string, membershipType: string) {
  try {
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("email, full_name")
      .eq("user_id", userId)
      .single();

    if (!profile?.email) {
      console.error(`No email found for user ${userId}, skipping confirmation email`);
      return;
    }

    const brevoApiKey = Deno.env.get("BREVO_API_KEY");
    if (!brevoApiKey) {
      console.error("BREVO_API_KEY not configured, skipping confirmation email");
      return;
    }

    const tierLabel = membershipType === "premium" ? "Premium" : "Basic";
    const displayName = profile.full_name || "there";
    const SITE_URL = "https://resilientmind.io";

    const htmlContent = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="margin:0;padding:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background-color:#faf9f6;color:#2d2d2d;"><div style="max-width:600px;margin:0 auto;padding:40px 24px;"><div style="text-align:center;margin-bottom:32px;"><h1 style="font-size:28px;color:#2d2d2d;margin:0 0 8px;">Resilient Mind</h1><p style="font-size:14px;color:#8a8578;margin:0;">Membership Confirmation</p></div><div style="background:#ffffff;border-radius:16px;padding:32px;border:1px solid #e8e4dc;"><p style="font-size:18px;margin:0 0 16px;">Hi ${displayName},</p><p style="font-size:16px;line-height:1.6;color:#4a4a4a;margin:0 0 8px;">Thank you for joining Resilient Mind! &#127881;</p><p style="font-size:16px;line-height:1.6;color:#4a4a4a;margin:0 0 24px;">Your <strong>${tierLabel} Membership</strong> is now active. You have full access to the Resilient Hub &#8212; video lessons, workbooks, and all the tools designed to support your journey.</p><div style="border-top:1px solid #e8e4dc;padding-top:24px;margin-bottom:24px;"><p style="font-size:16px;font-weight:bold;color:#2d2d2d;margin:0 0 16px;">What you can do now:</p><div style="padding:14px 20px;background:#faf5eb;border:1px solid #e8dcc8;border-radius:12px;margin-bottom:12px;"><strong style="font-size:15px;">1. Go to your Dashboard</strong><span style="display:block;font-size:14px;color:#8a8578;margin-top:4px;">Access your video lessons and workbooks for each month</span></div><div style="padding:14px 20px;background:#faf5eb;border:1px solid #e8dcc8;border-radius:12px;margin-bottom:12px;"><strong style="font-size:15px;">2. Start with Month 1</strong><span style="display:block;font-size:14px;color:#8a8578;margin-top:4px;">Open the first month, choose a week, and watch your first video</span></div><div style="padding:14px 20px;background:#faf5eb;border:1px solid #e8dcc8;border-radius:12px;margin-bottom:12px;"><strong style="font-size:15px;">3. Download your Workbook</strong><span style="display:block;font-size:14px;color:#8a8578;margin-top:4px;">Each video has a PDF workbook &#8212; practice at your own pace</span></div></div><div style="text-align:center;margin-bottom:24px;"><a href="${SITE_URL}/dashboard" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#b8976a,#d4b896);color:#ffffff;font-size:16px;font-weight:bold;text-decoration:none;border-radius:50px;">Go to My Dashboard &#8594;</a></div><p style="font-size:16px;line-height:1.6;color:#4a4a4a;margin:0 0 24px;">Remember: resilience isn&#8217;t something you&#8217;re born with &#8212; it&#8217;s something you practice gently, one month at a time.</p><p style="font-size:16px;color:#4a4a4a;margin:0;">Warmly,<br><strong>Silvie</strong></p></div><div style="text-align:center;margin-top:32px;"><p style="font-size:12px;color:#b0a998;margin:0;">&copy; Resilient Mind | <a href="${SITE_URL}" style="color:#b8976a;text-decoration:none;">resilientmind.io</a></p></div></div></body></html>`;

    const emailResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "Content-Type": "application/json", "api-key": brevoApiKey },
      body: JSON.stringify({
        sender: { name: "Silvie from Resilient Mind", email: "contact@resilientmind.io" },
        to: [{ email: profile.email, name: profile.full_name || undefined }],
        subject: `Welcome to Resilient Mind \u2013 Your ${tierLabel} Membership Is Active \u2705`,
        htmlContent,
      }),
    });

    if (!emailResponse.ok) {
      const errText = await emailResponse.text();
      console.error("Brevo email error:", emailResponse.status, errText);
    } else {
      console.log(`Membership confirmation email sent to ${profile.email}`);
    }
  } catch (err) {
    console.error("Failed to send membership confirmation email:", err);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("Stripe not configured");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Verify user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser(token);
    if (userError || !user) throw new Error("Unauthorized");

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { sessionId } = await req.json();
    if (!sessionId) throw new Error("Missing sessionId");

    // Retrieve checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Security: verify this session belongs to the requesting user
    if (session.metadata?.user_id !== user.id) {
      throw new Error("Session does not belong to this user");
    }

    if (session.payment_status !== "paid") {
      return new Response(
        JSON.stringify({ status: "unpaid", membership_type: null }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check current profile
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("membership_type, membership_expires_at, stripe_customer_id, purchased_hubs")
      .eq("user_id", user.id)
      .single();

    const membershipType = session.metadata?.membership_type;

    // Validate membership_type before writing to DB
    const validMembershipTypes = ["basic", "premium"];
    if (membershipType && !validMembershipTypes.includes(membershipType)) {
      throw new Error(`Invalid membership_type: ${membershipType}`);
    }

    // If profile already has correct membership and it hasn't expired, no action needed
    if (
      profile?.membership_type === membershipType &&
      profile?.membership_expires_at &&
      new Date(profile.membership_expires_at) > new Date()
    ) {
      return new Response(
        JSON.stringify({ status: "already_active", membership_type: membershipType }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Webhook hasn't processed yet — apply membership now
    console.log(`Verify-checkout fallback: activating ${membershipType} for user ${user.id}`);

    if (session.mode === "subscription" && session.subscription) {
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

      // Security: verify subscription is actually active (prevent replay with cancelled/refunded subscriptions)
      if (subscription.status !== "active" && subscription.status !== "trialing") {
        throw new Error(`Subscription is not active (status: ${subscription.status})`);
      }

      const expiresAt = new Date(subscription.current_period_end * 1000);

      const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({
          membership_type: membershipType,
          membership_started_at: new Date().toISOString(),
          membership_expires_at: expiresAt.toISOString(),
          stripe_customer_id: session.customer as string,
        })
        .eq("user_id", user.id);
      if (updateError) throw new Error(`Failed to update profile: ${updateError.message}`);

      // Send confirmation email (fallback — webhook may not have sent it)
      if (membershipType) {
        await sendMembershipEmail(supabaseAdmin, user.id, membershipType);
      }
    } else if (session.mode === "payment") {
      // Security: verify the payment hasn't been refunded (prevent replay attacks)
      if (session.payment_intent) {
        const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent as string);
        const latestCharge = paymentIntent.latest_charge;
        if (latestCharge) {
          const charge = await stripe.charges.retrieve(latestCharge as string);
          if (charge.refunded) {
            throw new Error("Payment has been refunded");
          }
        }
      }

      // One-time payment (yearly or hub)
      const productType = session.metadata?.product_type;

      if (productType === "hub") {
        const hubSlug = session.metadata?.hub_slug;
        if (hubSlug) {
          const currentHubs = profile?.purchased_hubs || [];
          if (!currentHubs.includes(hubSlug)) {
            const { error: updateError } = await supabaseAdmin
              .from("profiles")
              .update({ purchased_hubs: [...currentHubs, hubSlug] })
              .eq("user_id", user.id);
            if (updateError) throw new Error(`Failed to update purchased_hubs: ${updateError.message}`);
          }
        }
      } else if (membershipType) {
        const expiresAt = new Date();
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);

        const { error: updateError } = await supabaseAdmin
          .from("profiles")
          .update({
            membership_type: membershipType,
            membership_started_at: new Date().toISOString(),
            membership_expires_at: expiresAt.toISOString(),
            stripe_customer_id: session.customer as string,
          })
          .eq("user_id", user.id);
        if (updateError) throw new Error(`Failed to update profile: ${updateError.message}`);

        // Send confirmation email (fallback — webhook may not have sent it)
        await sendMembershipEmail(supabaseAdmin, user.id, membershipType);
      }
    }

    return new Response(
      JSON.stringify({ status: "activated", membership_type: membershipType }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Verify-checkout error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
});
