import nodemailer from "nodemailer";

// Re-use the transporter across requests in the same Node.js process
let _transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // STARTTLS
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD, // Gmail App Password (not account password)
      },
    });
  }
  return _transporter;
}

export interface ConfirmationEmailData {
  to: string;
  name: string;
  wechatName?: string | null;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  priceCents: number;
}

export async function sendConfirmationEmail(data: ConfirmationEmailData): Promise<void> {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn("[email] GMAIL_USER or GMAIL_APP_PASSWORD not set — skipping email");
    return;
  }

  const { to, name, wechatName, eventTitle, eventDate, eventLocation, priceCents } = data;
  const displayName = wechatName || name;
  const priceLabel = priceCents === 0 ? "Free" : `$${(priceCents / 100).toFixed(2)} AUD`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://momenta.com.au";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Registration Confirmed — ${eventTitle}</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#141414;border-radius:16px;border:1px solid #262626;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:#141414;padding:32px 40px 24px;border-bottom:1px solid #262626;">
              <img src="${siteUrl}/images/logo-light.png" alt="Momenta" height="36" style="display:block;" />
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              <!-- Check icon -->
              <div style="width:56px;height:56px;background:rgba(34,197,94,0.1);border-radius:50%;display:flex;align-items:center;justify-content:center;margin-bottom:24px;">
                <span style="font-size:28px;">✓</span>
              </div>
              <h1 style="margin:0 0 8px;color:#ffffff;font-size:22px;font-weight:700;">
                You&apos;re registered, ${displayName}!
              </h1>
              <p style="margin:0 0 28px;color:#a3a3a3;font-size:14px;line-height:1.6;">
                Your spot is confirmed. We can&apos;t wait to see you there.
              </p>

              <!-- Event card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#1e1e1e;border-radius:12px;border:1px solid #2a2a2a;margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 12px;color:#f5c518;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;">Event Details</p>
                    <p style="margin:0 0 6px;color:#ffffff;font-size:17px;font-weight:700;">${eventTitle}</p>
                    <p style="margin:0 0 4px;color:#a3a3a3;font-size:13px;">📅 ${eventDate}</p>
                    <p style="margin:0 0 4px;color:#a3a3a3;font-size:13px;">📍 ${eventLocation}</p>
                    <p style="margin:0;color:#a3a3a3;font-size:13px;">💰 ${priceLabel}</p>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#f5c518;border-radius:24px;">
                    <a href="${siteUrl}/events" style="display:block;padding:12px 28px;color:#0a0a0a;font-size:14px;font-weight:700;text-decoration:none;">
                      Browse More Events
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 28px;border-top:1px solid #262626;">
              <p style="margin:0;color:#525252;font-size:12px;line-height:1.6;">
                You&apos;re receiving this because you registered for a Momenta event.<br/>
                Questions? Reply to this email and we&apos;ll get back to you.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  await getTransporter().sendMail({
    from: `"Momenta" <${process.env.GMAIL_USER}>`,
    to,
    subject: `✅ Registration Confirmed — ${eventTitle}`,
    html,
    text: `Hi ${displayName},\n\nYour registration for "${eventTitle}" is confirmed!\n\nDate: ${eventDate}\nLocation: ${eventLocation}\nPrice: ${priceLabel}\n\nSee you there!\n\n— The Momenta Team`,
  });
}

export interface InquiryNotificationEmailData {
  to: string;
  name: string;
  email: string;
  phone: string | null;
  inquiryType: string;
  message: string;
  submittedAt: Date;
}

export async function sendInquiryNotificationEmail(data: InquiryNotificationEmailData): Promise<void> {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn("[email] GMAIL_USER or GMAIL_APP_PASSWORD not set — skipping email");
    return;
  }

  const { to, name, email, phone, inquiryType, message, submittedAt } = data;
  const timestampStr = new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Sydney",
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(submittedAt) + " AEST";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Inquiry — Momenta</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#141414;border-radius:16px;border:1px solid #262626;overflow:hidden;">
          <tr>
            <td style="background:#141414;padding:32px 40px 24px;border-bottom:1px solid #262626;">
              <p style="margin:0;color:#f5c518;font-size:13px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;">Momenta — New Inquiry</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#1e1e1e;border-radius:12px;border:1px solid #2a2a2a;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 12px;color:#f5c518;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;">Inquiry Details</p>
                    <p style="margin:0 0 6px;color:#a3a3a3;font-size:13px;"><span style="color:#ffffff;font-weight:600;">Name:</span> ${name}</p>
                    <p style="margin:0 0 6px;color:#a3a3a3;font-size:13px;"><span style="color:#ffffff;font-weight:600;">Email:</span> <a href="mailto:${email}" style="color:#f5c518;">${email}</a></p>
                    <p style="margin:0 0 6px;color:#a3a3a3;font-size:13px;"><span style="color:#ffffff;font-weight:600;">Phone:</span> ${phone || "—"}</p>
                    <p style="margin:0 0 6px;color:#a3a3a3;font-size:13px;"><span style="color:#ffffff;font-weight:600;">Type:</span> ${inquiryType}</p>
                    <p style="margin:0 0 16px;color:#a3a3a3;font-size:13px;"><span style="color:#ffffff;font-weight:600;">Submitted:</span> ${timestampStr}</p>
                    <p style="margin:0 0 4px;color:#ffffff;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;">Message</p>
                    <p style="margin:0;color:#a3a3a3;font-size:13px;line-height:1.6;white-space:pre-wrap;">${message}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 40px 28px;border-top:1px solid #262626;">
              <p style="margin:0;color:#525252;font-size:12px;">Reply directly to this email to respond to ${name}.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  await getTransporter().sendMail({
    from: `"Momenta" <${process.env.GMAIL_USER}>`,
    to,
    replyTo: email,
    subject: `📩 New ${inquiryType} Inquiry from ${name}`,
    html,
    text: `New inquiry from ${name} (${email})\nPhone: ${phone || "—"}\nType: ${inquiryType}\nSubmitted: ${timestampStr}\n\nMessage:\n${message}`,
  });
}
