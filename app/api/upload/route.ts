import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { isAuthed } from "@/lib/auth";

export const dynamic = "force-dynamic";

// รับ { dataUrl } (base64 ที่ย่อแล้วจากฝั่ง client) -> เก็บใน Redis -> คืน /api/img/<id>
export async function POST(req: Request) {
  if (!isAuthed()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    const { dataUrl } = await req.json();
    const okType =
      typeof dataUrl === "string" &&
      (dataUrl.startsWith("data:image/") || dataUrl.startsWith("data:audio/"));
    if (!dataUrl || !okType) {
      return NextResponse.json({ error: "ไฟล์ไม่ถูกต้อง" }, { status: 400 });
    }
    // จำกัดขนาด ~1.3MB (กันเกิน limit ของ Upstash REST)
    if (dataUrl.length > 1_300_000) {
      return NextResponse.json({ error: "ไฟล์ใหญ่เกินไป ลองเลือกไฟล์เล็กลง (เพลงสั้นๆ ~0.9MB)" }, { status: 413 });
    }
    const id = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
    await redis(["HSET", "images", id, dataUrl]);
    return NextResponse.json({ ok: true, url: `/api/img?id=${id}` });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
