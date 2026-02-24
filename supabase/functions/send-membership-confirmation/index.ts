import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const SITE_URL = "https://resilientmind.io";

serve(async (req) => {
  try {
    const brevoApiKey = Deno.env.get("BREVO_API_KEY");
    if (!brevoApiKey) {
      throw new Error("BREVO_API_KEY not configured");
    }

    const { email, name, membershipType } = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    const tierLabel = membershipType === "premium" ? "Premium" : "Basic";
    const displayName = name || "there";

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
      <p style="font-size:14px;color:#8a8578;margin:0;">Membership Confirmation</p>
    </div>

    <div style="background:#ffffff;border-radius:16px;padding:32px;border:1px solid #e8e4dc;">

      <p style="font-size:18px;margin:0 0 16px;">Hi ${displayName},</p>

      <p style="font-size:16px;line-height:1.6;color:#4a4a4a;margin:0 0 8px;">
        Thank you for joining Resilient Mind! &#127881;
      </p>

      <p style="font-size:16px;line-height:1.6;color:#4a4a4a;margin:0 0 24px;">
        Your <strong>${tierLabel} Membership</strong> is now active. You have full access to the Resilient Hub &#8212; video lessons, workbooks, and all the tools designed to support your journey.
      </p>

      <div style="border-top:1px solid #e8e4dc;padding-top:24px;margin-bottom:24px;">
        <p style="font-size:16px;font-weight:bold;color:#2d2d2d;margin:0 0 16px;">What you can do now:</p>

        <div style="padding:14px 20px;background:#faf5eb;border:1px solid #e8dcc8;border-radius:12px;margin-bottom:12px;">
          <strong style="font-size:15px;">1. Go to your Dashboard</strong>
          <span style="display:block;font-size:14px;color:#8a8578;margin-top:4px;">Access your video lessons and workbooks for each month</span>
        </div>

        <div style="padding:14px 20px;background:#faf5eb;border:1px solid #e8dcc8;border-radius:12px;margin-bottom:12px;">
          <strong style="font-size:15px;">2. Start with Month 1</strong>
          <span style="display:block;font-size:14px;color:#8a8578;margin-top:4px;">Open the first month, choose a week, and watch your first video</span>
        </div>

        <div style="padding:14px 20px;background:#faf5eb;border:1px solid #e8dcc8;border-radius:12px;margin-bottom:12px;">
          <strong style="font-size:15px;">3. Download your Workbook</strong>
          <span style="display:block;font-size:14px;color:#8a8578;margin-top:4px;">Each video has a PDF workbook &#8212; practice at your own pace</span>
        </div>
      </div>

      <div style="text-align:center;margin-bottom:24px;">
        <a href="${SITE_URL}/dashboard" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#b8976a,#d4b896);color:#ffffff;font-size:16px;font-weight:bold;text-decoration:none;border-radius:50px;">
          Go to My Dashboard &#8594;
        </a>
      </div>

      <p style="font-size:16px;line-height:1.6;color:#4a4a4a;margin:0 0 24px;">
        Remember: resilience isn&#8217;t something you&#8217;re born with &#8212; it&#8217;s something you practice gently, one month at a time.
      </p>

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
        subject: `Welcome to Resilient Mind \u2013 Your ${tierLabel} Membership Is Active \u2705`,
        htmlContent,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Brevo send email error:", response.status, errorData);
      throw new Error(`Brevo API error: ${response.status}`);
    }

    const result = await response.json();
    console.log("Membership confirmation email sent:", result);

    return new Response(
      JSON.stringify({ success: true, messageId: result.messageId }),
      { headers: { "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error in send-membership-confirmation:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { "Content-Type": "application/json" }, status: 200 }
    );
  }
});
