import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      throw new Error("Missing stripe-signature header");
    }

    const body = await req.text();
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET not configured");
      throw new Error("Webhook secret not configured");
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }

    console.log("Received Stripe webhook event:", event.type);

    // Initialize Supabase client with service role
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        console.log("Checkout session completed:", session.id);

        // Find booking by stripe_session_id
        const { data: booking, error: findError } = await supabaseClient
          .from("session_bookings")
          .select("*")
          .eq("stripe_session_id", session.id)
          .single();

        if (findError || !booking) {
          console.error("Booking not found for session:", session.id);
          throw new Error("Booking not found");
        }

        // Update booking status to confirmed
        const { error: updateError } = await supabaseClient
          .from("session_bookings")
          .update({
            status: "confirmed",
            payment_expires_at: null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", booking.id);

        if (updateError) {
          console.error("Failed to update booking:", updateError);
          throw updateError;
        }

        console.log("Booking confirmed:", booking.id);

        // TODO: Send confirmation email to client
        // TODO: Add to therapist's Google Calendar

        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;

        console.log("Checkout session expired:", session.id);

        // Find booking by stripe_session_id
        const { data: booking, error: findError } = await supabaseClient
          .from("session_bookings")
          .select("*")
          .eq("stripe_session_id", session.id)
          .single();

        if (findError || !booking) {
          console.error("Booking not found for session:", session.id);
          // Don't throw error - just log and continue
          break;
        }

        // Update booking status to expired
        const { error: updateError } = await supabaseClient
          .from("session_bookings")
          .update({
            status: "expired",
            updated_at: new Date().toISOString(),
          })
          .eq("id", booking.id);

        if (updateError) {
          console.error("Failed to update booking:", updateError);
          throw updateError;
        }

        console.log("Booking expired:", booking.id);

        break;
      }

      default:
        console.log("Unhandled event type:", event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in booking-stripe-webhook:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
