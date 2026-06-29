import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { isAuthed } from "@/lib/auth";

export const dynamic = "force-dynamic";

// รับ { dataUrl } (base64 ที่ย่อแล้วจากฝั่ง client) -> เก็บใน Redis -> คืน /api/img/<id>
export async function POST(req: Request) {
  if (!isAuthed()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    const { dataUrl } = await req.json();
    if (!dataUrl || typeof dataUrl !== "string" || !dataUrl.startsWith("data:image/")) {
      return NextResponse.json({ error: "รูปไม่ถูกต้อง" }, { status: 400 });
    }
    // จำกัดขนาด ~1.4MB (base64 ยาวขึ้น ~33%)
    if (dataUrl.length > 1_900_000) {
      return NextResponse.json({ error: "รูปใหญ่เกินไป (ลองย่อหรือเลือกรูปเล็กลง)" }, { status: 413 });
    }
    const id = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
    await redis(["HSET", "images", id, dataUrl]);
    return NextResponse.json({ ok: true, url: `/api/img/${id}` });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
