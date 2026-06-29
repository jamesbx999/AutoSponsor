import { NextResponse } from "next/server";
import { listMembers, saveMember, getMember } from "@/lib/redis";
import { isAuthed } from "@/lib/auth";
import type { Member } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isAuthed()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    const members = await listMembers();
    return NextResponse.json({ members });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isAuthed()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    if (!body.name || !body.slug) {
      return NextResponse.json({ error: "ต้องมีชื่อและ slug" }, { status: 400 });
    }
    const slug = String(body.slug).toLowerCase().trim().replace(/[^a-z0-9_-]/g, "");
    if (!slug) return NextResponse.json({ error: "slug ไม่ถูกต้อง (a-z, 0-9, - _)" }, { status: 400 });

    const existing = await getMember(slug);
    const member: Member = {
      slug,
      name: String(body.name).trim(),
      photo: body.photo || "",
      refLink: body.refLink || "",
      lineUrl: body.lineUrl || "",
      phone: body.phone || "",
      messengerUrl: body.messengerUrl || "",
      webhook: body.webhook || "",
      headline: body.headline || "",
      subheadline: body.subheadline || "",
      heroImage: body.heroImage || "",
      videoUrl: body.videoUrl || "",
      createdAt: existing?.createdAt || new Date().toISOString(),
    };
    await saveMember(member);
    return NextResponse.json({ ok: true, member });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
