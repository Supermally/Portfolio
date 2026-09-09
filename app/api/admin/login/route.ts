import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, cookieOptions, createAdminSession, validPassword } from "@/lib/admin/auth";

export async function POST(request: NextRequest) {
  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json({ error: "Admin environment variables are not available to the server. Redeploy after checking the Amplify build settings." }, { status: 503 });
  }
  const { password } = await request.json().catch(() => ({ password: "" }));
  if (!validPassword(password)) return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, createAdminSession(), cookieOptions());
  return response;
}
