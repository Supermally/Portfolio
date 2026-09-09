import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin/auth";

export async function GET(request: NextRequest) {
  return NextResponse.json({ authenticated: verifyAdminSession(request) });
}
