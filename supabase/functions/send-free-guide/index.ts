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
      <p style="font-size:14px;color:#8a8578;margin:0;">Your Free 7-Day Practice Kit</p>
    </div>

    <div style="background:#ffffff;border-radius:16px;padding:32px;border:1px solid #e8e4dc;">

      <p style="font-size:18px;margin:0 0 16px;">Hi there,</p>

      <p style="font-size:16px;line-height:1.6;color:#4a4a4a;margin:0 0 8px;">
        Welcome to Resilient Mind! &#127881;
      </p>

      <p style="font-size:16px;line-height:1.6;color:#4a4a4a;margin:0 0 24px;">
        Get ready to shift your energy and feel calmer, clearer, and more resilient with simple, practical tools &#8212; designed especially for expats.
      </p>

      <div style="border-top:1px solid #e8e4dc;padding-top:24px;margin-bottom:24px;">
        <p style="font-size:16px;font-weight:bold;color:#2d2d2d;margin:0 0 16px;">Your 7-Day Practice Includes:</p>

        <div style="padding:14px 20px;background:#faf5eb;border:1px solid #e8dcc8;border-radius:12px;margin-bottom:12px;">
          <strong style="font-size:15px;">&#127749; Morning Gratitude Workbook</strong>
          <span style="display:block;font-size:14px;color:#8a8578;margin-top:4px;">Start your day grounded and focused</span>
        </div>

        <div style="padding:14px 20px;background:#faf5eb;border:1px solid #e8dcc8;border-radius:12px;margin-bottom:12px;">
          <strong style="font-size:15px;">&#127780;&#65039; Midday EFT Tapping Video + Workbook</strong>
          <span style="display:block;font-size:14px;color:#8a8578;margin-top:4px;">Release stress and tension</span>
        </div>

        <div style="padding:14px 20px;background:#faf5eb;border:1px solid #e8dcc8;border-radius:12px;margin-bottom:12px;">
          <strong style="font-size:15px;">&#127769; Evening Reflection</strong>
          <span style="display:block;font-size:14px;color:#8a8578;margin-top:4px;">End your day with clarity and calm</span>
        </div>
      </div>

      <p style="font-size:16px;line-height:1.6;color:#4a4a4a;margin:0 0 24px;">
        Just 30 minutes a day to feel your energy shift and your mind relax. No pressure, no perfection &#8212; only simple tools for real life abroad.
      </p>

      <div style="border-top:1px solid #e8e4dc;padding-top:24px;margin-bottom:24px;">
        <p style="font-size:16px;font-weight:bold;color:#2d2d2d;margin:0 0 8px;">What&#8217;s next:</p>
        <p style="font-size:15px;line-height:1.6;color:#4a4a4a;margin:0;">
          Check your inbox &#8212; in the next email, you&#8217;ll receive all the workbooks, guided EFT video, and links to get started immediately for free.
        </p>
      </div>

      <div style="text-align:center;padding:20px;background:#faf5eb;border:1px solid #e8dcc8;border-radius:12px;margin-bottom:24px;">
        <p style="font-size:15px;color:#4a4a4a;margin:0;">
          &#128155; Love to share? Send your friends<br>
          <a href="${SITE_URL}/free-guide" style="color:#b8976a;font-weight:bold;text-decoration:none;">resilientmind.io/free-guide</a><br>
          so they can join too!
        </p>
      </div>

      <p style="font-size:16px;color:#4a4a4a;margin:0;">
        Warmly,<br><strong>Silvie</strong>
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
        subject: "Welcome to Resilient Mind \u2013 Your Free 7-Day Practice Kit \ud83c\udf05",
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
