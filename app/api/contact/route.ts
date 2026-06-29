import { NextResponse } from "next/server";
import { getContacts, createContact } from "@/lib/db";
import { sendEmail, getContactConfirmationTemplate, getAdminNotificationTemplate } from "@/lib/resend";
import { generateId } from "@/lib/utils";

export async function GET() {
  const contacts = await getContacts();
  return NextResponse.json(contacts);
}

export async function POST(request: Request) {
  const body = await request.json();

  const contact = {
    ...body,
    id: generateId(),
    read: false,
    created_at: new Date().toISOString(),
  };

  await createContact(contact);

  // Send confirmation to user
  console.log(`[EMAIL] Sending contact confirmation to ${body.email}`);
  await sendEmail({
    to: body.email,
    subject: "We Received Your Message — ScholarMall",
    html: getContactConfirmationTemplate(body.name),
  });

  // Notify admin
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    console.log(`[EMAIL] Sending admin notification to ${adminEmail}`);
    await sendEmail({
      to: adminEmail,
      subject: `New Contact: ${body.subject}`,
      html: getAdminNotificationTemplate(body.name, body.email, body.subject, body.message),
    });
  }

  return NextResponse.json(contact);
}
