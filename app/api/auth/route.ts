import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({ password: "" }));
  if (password && password === process.env.ADMIN_PASSWORD) {
    cookies().set("as_auth", password, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: false, error: "รหัสผ่านไม่ถูกต้อง" }, { status: 401 });
}

export async function GET() {
  const c = cookies().get("as_auth")?.value;
  const authed = !!c && c === process.env.ADMIN_PASSWORD;
  return NextResponse.json({ authed });
}

export async function DELETE() {
  cookies().delete("as_auth");
  return NextResponse.json({ ok: true });
}
