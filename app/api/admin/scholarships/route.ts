import { NextResponse } from "next/server";
import { createScholarship } from "@/lib/db";
import { generateId } from "@/lib/utils";

export async function POST(request: Request) {
  const body = await request.json();
  const scholarship = {
    ...body,
    id: generateId(),
    created_at: new Date().toISOString(),
  };
  await createScholarship(scholarship);
  return NextResponse.json(scholarship);
}
