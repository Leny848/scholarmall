import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    console.log(`[EMAIL] Sending to: ${to}, Subject: ${subject}, From: ${fromEmail}`);
    const result = await resend.emails.send({
      from: `ScholarMall <${fromEmail}>`,
      to,
      subject,
      html,
    });
    console.log("[EMAIL] Success:", result);
    return { success: true, data: result };
  } catch (error: any) {
    console.error("[EMAIL] Error:", error?.message || error);
    return { success: false, error: error?.message || "Unknown error" };
  }
}

export function getApplicationReceivedTemplate(
  name: string,
  scholarshipTitle: string
): string {
  return `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px 20px; text-align: center; border-radius: 16px 16px 0 0;">
        <h1 style="color: #fbbf24; margin: 0; font-size: 32px; font-weight: 700;">ScholarMall</h1>
        <p style="color: #a3a3a3; margin: 10px 0 0 0; font-size: 16px;">Application Received</p>
      </div>
      <div style="padding: 40px 30px; background: #ffffff; border-radius: 0 0 16px 16px;">
        <p style="font-size: 16px; line-height: 1.7; color: #404040;">Dear <strong>${name}</strong>,</p>
        <p style="font-size: 16px; line-height: 1.7; color: #404040;">Thank you for applying for the <strong style="color: #d97706;">${scholarshipTitle}</strong> scholarship through ScholarMall.</p>
        <p style="font-size: 16px; line-height: 1.7; color: #404040;">We have received your application and our team will review it shortly. You will receive an update once a decision has been made.</p>
        <div style="background: #fef3c7; border-left: 4px solid #fbbf24; padding: 16px; margin: 24px 0; border-radius: 8px;">
          <p style="margin: 0; font-size: 14px; color: #92400e;"><strong>Status:</strong> Under Review</p>
        </div>
        <p style="font-size: 16px; line-height: 1.7; color: #404040;">Best regards,<br><strong style="color: #1a1a1a;">The ScholarMall Team</strong></p>
      </div>
      <div style="padding: 24px; text-align: center; color: #737373; font-size: 12px;">
        <p>ScholarMall — Discover Your Future</p>
      </div>
    </div>
  `;
}

export function getApplicationAcceptedTemplate(
  name: string,
  scholarshipTitle: string,
  adminMessage: string
): string {
  return `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background: linear-gradient(135deg, #065f46 0%, #047857 100%); padding: 40px 20px; text-align: center; border-radius: 16px 16px 0 0;">
        <h1 style="color: #fff; margin: 0; font-size: 32px; font-weight: 700;">Congratulations!</h1>
        <p style="color: #a7f3d0; margin: 10px 0 0 0; font-size: 16px;">Your Application Has Been Accepted</p>
      </div>
      <div style="padding: 40px 30px; background: #ffffff; border-radius: 0 0 16px 16px;">
        <p style="font-size: 16px; line-height: 1.7; color: #404040;">Dear <strong>${name}</strong>,</p>
        <p style="font-size: 16px; line-height: 1.7; color: #404040;">We are thrilled to inform you that your application for the <strong style="color: #059669;">${scholarshipTitle}</strong> scholarship has been <strong style="color: #059669;">ACCEPTED</strong>!</p>
        <div style="background: #d1fae5; border-left: 4px solid #059669; padding: 20px; margin: 24px 0; border-radius: 8px;">
          <p style="margin: 0 0 10px 0; font-size: 16px; color: #065f46;"><strong>Message from the Admin:</strong></p>
          <p style="margin: 0; font-size: 15px; color: #047857; font-style: italic; line-height: 1.6;">"${adminMessage}"</p>
        </div>
        <p style="font-size: 16px; line-height: 1.7; color: #404040;">Our team will be in touch with you shortly regarding the next steps and award disbursement details.</p>
        <p style="font-size: 16px; line-height: 1.7; color: #404040;">Best regards,<br><strong style="color: #1a1a1a;">The ScholarMall Team</strong></p>
      </div>
      <div style="padding: 24px; text-align: center; color: #737373; font-size: 12px;">
        <p>ScholarMall — Discover Your Future</p>
      </div>
    </div>
  `;
}

export function getApplicationRejectedTemplate(
  name: string,
  scholarshipTitle: string,
  adminMessage: string
): string {
  return `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%); padding: 40px 20px; text-align: center; border-radius: 16px 16px 0 0;">
        <h1 style="color: #fff; margin: 0; font-size: 28px; font-weight: 700;">Application Update</h1>
        <p style="color: #fecaca; margin: 10px 0 0 0; font-size: 16px;">We Reviewed Your Application</p>
      </div>
      <div style="padding: 40px 30px; background: #ffffff; border-radius: 0 0 16px 16px;">
        <p style="font-size: 16px; line-height: 1.7; color: #404040;">Dear <strong>${name}</strong>,</p>
        <p style="font-size: 16px; line-height: 1.7; color: #404040;">Thank you for your interest in the <strong style="color: #dc2626;">${scholarshipTitle}</strong> scholarship.</p>
        <p style="font-size: 16px; line-height: 1.7; color: #404040;">After careful consideration, we regret to inform you that your application was not selected at this time.</p>
        <div style="background: #fee2e2; border-left: 4px solid #dc2626; padding: 20px; margin: 24px 0; border-radius: 8px;">
          <p style="margin: 0 0 10px 0; font-size: 16px; color: #991b1b;"><strong>Message from the Admin:</strong></p>
          <p style="margin: 0; font-size: 15px; color: #b91c1c; font-style: italic; line-height: 1.6;">"${adminMessage}"</p>
        </div>
        <p style="font-size: 16px; line-height: 1.7; color: #404040;">We encourage you to continue pursuing your academic goals. Please check ScholarMall regularly for other opportunities.</p>
        <p style="font-size: 16px; line-height: 1.7; color: #404040;">Best regards,<br><strong style="color: #1a1a1a;">The ScholarMall Team</strong></p>
      </div>
      <div style="padding: 24px; text-align: center; color: #737373; font-size: 12px;">
        <p>ScholarMall — Discover Your Future</p>
      </div>
    </div>
  `;
}

export function getContactConfirmationTemplate(name: string): string {
  return `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px 20px; text-align: center; border-radius: 16px 16px 0 0;">
        <h1 style="color: #fbbf24; margin: 0; font-size: 32px; font-weight: 700;">ScholarMall</h1>
        <p style="color: #a3a3a3; margin: 10px 0 0 0; font-size: 16px;">Message Received</p>
      </div>
      <div style="padding: 40px 30px; background: #ffffff; border-radius: 0 0 16px 16px;">
        <p style="font-size: 16px; line-height: 1.7; color: #404040;">Dear <strong>${name}</strong>,</p>
        <p style="font-size: 16px; line-height: 1.7; color: #404040;">Thank you for reaching out to ScholarMall. We have received your message and will get back to you as soon as possible.</p>
        <p style="font-size: 16px; line-height: 1.7; color: #404040;">Best regards,<br><strong style="color: #1a1a1a;">The ScholarMall Team</strong></p>
      </div>
      <div style="padding: 24px; text-align: center; color: #737373; font-size: 12px;">
        <p>ScholarMall — Discover Your Future</p>
      </div>
    </div>
  `;
}

export function getAdminNotificationTemplate(
  name: string,
  email: string,
  subject: string,
  message: string
): string {
  return `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px 20px; text-align: center; border-radius: 16px 16px 0 0;">
        <h1 style="color: #fbbf24; margin: 0; font-size: 28px; font-weight: 700;">ScholarMall Admin</h1>
        <p style="color: #a3a3a3; margin: 10px 0 0 0; font-size: 16px;">New Contact Form Submission</p>
      </div>
      <div style="padding: 40px 30px; background: #ffffff; border-radius: 0 0 16px 16px;">
        <p style="font-size: 16px; color: #404040;"><strong>Name:</strong> ${name}</p>
        <p style="font-size: 16px; color: #404040;"><strong>Email:</strong> ${email}</p>
        <p style="font-size: 16px; color: #404040;"><strong>Subject:</strong> ${subject}</p>
        <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 12px; border: 1px solid #e5e5e5;">
          <p style="margin: 0; font-size: 15px; color: #404040; line-height: 1.6;">${message}</p>
        </div>
        <p style="font-size: 14px; color: #737373;">Reply to: ${email}</p>
      </div>
    </div>
  `;
}
