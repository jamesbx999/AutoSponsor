import type { Member, Lead } from "./types";

const URL = process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

/** ยิงคำสั่ง Redis ผ่าน Upstash REST API (ไม่ต้องลง package เพิ่ม) */
export async function redis(command: (string | number)[]): Promise<any> {
  if (!URL || !TOKEN) {
    throw new Error("ยังไม่ได้ตั้งค่า UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN");
  }
  const res = await fetch(URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.result;
}

/* ---------------- Members ---------------- */

export async function getMember(slug: string): Promise<Member | null> {
  const v = await redis(["HGET", "members", slug]);
  return v ? safeParse<Member>(v) : null;
}

export async function listMembers(): Promise<Member[]> {
  const flat: string[] = (await redis(["HGETALL", "members"])) || [];
  const out: Member[] = [];
  for (let i = 1; i < flat.length; i += 2) {
    const m = safeParse<Member>(flat[i]);
    if (m) out.push(m);
  }
  return out.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}

export async function saveMember(m: Member) {
  return redis(["HSET", "members", m.slug, JSON.stringify(m)]);
}

export async function deleteMember(slug: string) {
  return redis(["HDEL", "members", slug]);
}

/* ---------------- Leads ---------------- */

export async function addLead(lead: Lead) {
  await redis(["LPUSH", "leads:all", JSON.stringify(lead)]);
  await redis(["LTRIM", "leads:all", 0, 999]); // เก็บ 1000 รายการล่าสุด
}

export async function listLeads(): Promise<Lead[]> {
  const arr: string[] = (await redis(["LRANGE", "leads:all", 0, 499])) || [];
  return arr.map((s) => safeParse<Lead>(s)).filter(Boolean) as Lead[];
}

function safeParse<T>(s: string): T | null {
  try {
    return JSON.parse(s) as T;
  } catch {
    return null;
  }
}
