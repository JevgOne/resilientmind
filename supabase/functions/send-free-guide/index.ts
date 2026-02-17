import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SITE_URL = "https://resilientmind.io";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const brevoApiKey = Deno.env.get("BREVO_API_KEY");
    if (!brevoApiKey) {
      throw new Error("BREVO_API_KEY not configured");
    }

    const { email, name } = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    const firstName = name?.split(" ")[0] || "";

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background-color:#faf9f6;color:#2d2d2d;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">

    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="font-size:28px;color:#2d2d2d;margin:0 0 8px;">Resilient Mind</h1>
      <p style="font-size:14px;color:#8a8578;margin:0;">Your 7-Day Practice Kit</p>
    </div>

    <div style="background:#ffffff;border-radius:16px;padding:32px;border:1px solid #e8e4dc;">

      <p style="font-size:18px;margin:0 0 16px;">Hi${firstName ? ` ${firstName}` : ""},</p>

      <p style="font-size:16px;line-height:1.6;color:#4a4a4a;margin:0 0 24px;">
        Thank you for signing up! Here are your free resources to start building calm, clarity, and resilience — one day at a time.
      </p>

      <div style="margin-bottom:16px;">
        <a href="${SITE_URL}/assets/7-Day-Gratitude-Workbook.pdf"
           style="display:block;padding:16px 20px;background:#faf5eb;border:1px solid #e8dcc8;border-radius:12px;text-decoration:none;color:#2d2d2d;margin-bottom:12px;">
          <strong style="display:block;font-size:16px;">&#9776; 7-Day Gratitude Workbook</strong>
          <span style="font-size:14px;color:#8a8578;">Morning practice &amp; evening reflection (PDF)</span>
        </a>
      </div>

      <div style="margin-bottom:16px;">
        <a href="${SITE_URL}/assets/7-Day-EFT-Workbook-for-Expats.pdf"
           style="display:block;padding:16px 20px;background:#faf5eb;border:1px solid #e8dcc8;border-radius:12px;text-decoration:none;color:#2d2d2d;margin-bottom:12px;">
          <strong style="display:block;font-size:16px;">&#9995; 7-Day EFT Tapping Workbook</strong>
          <span style="font-size:14px;color:#8a8578;">Release stress &amp; rebuild confidence (PDF)</span>
        </a>
      </div>

      <div style="padding:16px 20px;background:#faf5eb;border:1px solid #e8dcc8;border-radius:12px;margin-bottom:24px;">
        <strong style="display:block;font-size:16px;">&#9654; Guided EFT Tapping Video</strong>
        <span style="font-size:14px;color:#8a8578;">Check your inbox for a magic link to access the video in your dashboard</span>
      </div>

      <div style="border-top:1px solid #e8e4dc;padding-top:24px;margin-top:8px;">
        <p style="font-size:15px;line-height:1.6;color:#4a4a4a;margin:0 0 16px;">
          <strong>How to use your kit:</strong><br>
          &#127749; <strong>Morning</strong> — Gratitude Workbook (10 min)<br>
          &#127780; <strong>Midday</strong> — EFT Tapping Video + Workbook (15 min)<br>
          &#127769; <strong>Evening</strong> — Reflection in the Gratitude Workbook (5 min)
        </p>
      </div>

      <p style="font-size:14px;color:#8a8578;margin:24px 0 0;text-align:center;">
        Questions? Reply to this email or contact us at
        <a href="mailto:contact@resilientmind.io" style="color:#b8976a;">contact@resilientmind.io</a>
      </p>
    </div>

    <div style="text-align:center;margin-top:32px;">
      <p style="font-size:12px;color:#b0a998;margin:0;">
        &copy; Resilient Mind | <a href="${SITE_URL}" style="color:#b8976a;text-decoration:none;">resilientmind.io</a>
      </p>
    </div>
  </div>
</body>
</html>`;

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": brevoApiKey,
      },
      body: JSON.stringify({
        sender: {
          name: "Silvie from Resilient Mind",
          email: "contact@resilientmind.io",
        },
        to: [{ email, name: name || undefined }],
        subject: "Your Free 7-Day Practice Kit is here! 🌿",
        htmlContent,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Brevo send email error:", response.status, errorData);
      throw new Error(`Brevo API error: ${response.status}`);
    }

    const result = await response.json();
    console.log("Free guide email sent successfully:", result);

    return new Response(
      JSON.stringify({ success: true, messageId: result.messageId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error in send-free-guide:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  }
});
