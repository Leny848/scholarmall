import { NextResponse } from "next/server";
import { getScholarshipById } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const scholarship = await getScholarshipById(params.id);
  if (!scholarship) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(scholarship);
}
