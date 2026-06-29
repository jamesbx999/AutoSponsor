import { NextResponse } from "next/server";
import { addLead, listLeads, getMember } from "@/lib/redis";
import { isAuthed } from "@/lib/auth";
import type { Lead } from "@/lib/types";

export const dynamic = "force-dynamic";

// public: บันทึก lead จากหน้า Sale Page
export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.name || !body.phone || !body.ref) {
      return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });
    }
    const member = await getMember(String(body.ref));
    const lead: Lead = {
      name: String(body.name).slice(0, 120),
      phone: String(body.phone).slice(0, 30),
      interest: String(body.interest || "").slice(0, 120),
      ref: String(body.ref),
      refName: member?.name || "",
      at: new Date().toISOString(),
    };
    await addLead(lead);

    // ส่งแจ้งเตือนเข้า webhook ของสมาชิก (Telegram / Discord / Make ฯลฯ)
    if (member?.webhook) {
      try {
        await fetch(member.webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: `🔔 Lead ใหม่จากหน้า ${member.name}\nชื่อ: ${lead.name}\nเบอร์: ${lead.phone}\nสนใจ: ${lead.interest}`,
            ...lead,
          }),
        });
      } catch {
        /* ไม่ให้ webhook ล้มแล้วกระทบการบันทึก lead */
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// admin: ดูรายชื่อ lead ทั้งหมด
export async function GET() {
  if (!isAuthed()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const leads = await listLeads();
  return NextResponse.json({ leads });
}
