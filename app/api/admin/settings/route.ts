import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ 
    success: true, 
    message: "Supabase is configured via environment variables. No manual setup needed."
  });
}

export async function GET() {
  return NextResponse.json({
    configured: true,
    message: "Using Supabase database",
    database: "Supabase PostgreSQL",
  });
}
