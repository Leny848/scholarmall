import { NextResponse } from "next/server";
import { getApplications, createApplication, getApplicationById, updateApplicationStatus } from "@/lib/db";
import { getScholarshipById } from "@/lib/db";
import { sendEmail, getApplicationReceivedTemplate, getApplicationAcceptedTemplate, getApplicationRejectedTemplate } from "@/lib/resend";
import { generateId } from "@/lib/utils";

export async function GET() {
  const applications = await getApplications();
  return NextResponse.json(applications);
}

export async function POST(request: Request) {
  const body = await request.json();

  const application = {
    ...body,
    id: generateId(),
    status: "pending" as const,
    admin_message: "",
    created_at: new Date().toISOString(),
  };

  await createApplication(application);

  // Send confirmation email to applicant
  const scholarship = await getScholarshipById(body.scholarship_id);
  const scholarshipTitle = scholarship?.title || body.scholarship_title || "the scholarship";

  console.log(`[EMAIL] Sending confirmation to ${body.email} for ${scholarshipTitle}`);

  await sendEmail({
    to: body.email,
    subject: `Application Received — ${scholarshipTitle}`,
    html: getApplicationReceivedTemplate(`${body.first_name} ${body.last_name}`, scholarshipTitle),
  });

  // Notify admin
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    await sendEmail({
      to: adminEmail,
      subject: `New Application: ${body.first_name} ${body.last_name}`,
      html: `<p>New application received for ${scholarshipTitle} from ${body.email}</p>`,
    });
  }

  return NextResponse.json(application);
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, status, admin_message } = body;

  await updateApplicationStatus(id, status, admin_message);

  const application = await getApplicationById(id);
  if (!application) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const scholarship = await getScholarshipById(application.scholarship_id);
  const scholarshipTitle = scholarship?.title || application.scholarship_title || "the scholarship";

  const fullName = `${application.first_name} ${application.last_name}`;

  console.log(`[EMAIL] Sending ${status} email to ${application.email} for ${scholarshipTitle}`);

  if (status === "accepted") {
    await sendEmail({
      to: application.email,
      subject: `Congratulations! Your Application for ${scholarshipTitle} Has Been Accepted`,
      html: getApplicationAcceptedTemplate(fullName, scholarshipTitle, admin_message),
    });
  } else {
    await sendEmail({
      to: application.email,
      subject: `Application Update — ${scholarshipTitle}`,
      html: getApplicationRejectedTemplate(fullName, scholarshipTitle, admin_message),
    });
  }

  return NextResponse.json({ success: true });
}
