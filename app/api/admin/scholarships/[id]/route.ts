import { NextResponse } from "next/server";
import { updateScholarship, deleteScholarship } from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  await updateScholarship(params.id, body);
  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await deleteScholarship(params.id);
  return NextResponse.json({ success: true });
}
