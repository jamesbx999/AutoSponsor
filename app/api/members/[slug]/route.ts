import { NextResponse } from "next/server";
import { getMember, deleteMember } from "@/lib/redis";
import { isAuthed } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const m = await getMember(params.slug);
  if (!m) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ member: m });
}

export async function DELETE(_req: Request, { params }: { params: { slug: string } }) {
  if (!isAuthed()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  await deleteMember(params.slug);
  return NextResponse.json({ ok: true });
}
