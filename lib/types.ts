export interface Member {
  slug: string;
  name: string;
  photo: string;
  refLink: string;
  lineUrl: string;
  phone: string;
  messengerUrl: string;
  webhook?: string;     // Telegram/Discord/Make webhook สำหรับรับ lead
  headline?: string;    // override หัวข้อ hero (เว้นว่าง = ใช้ค่า default)
  subheadline?: string; // override คำโปรย
  heroImage?: string;   // override รูป hero
  videoUrl?: string;    // ลิงก์วิดีโอแนะนำ (YouTube ฯลฯ)
  createdAt: string;
}

export interface Lead {
  name: string;
  phone: string;
  interest: string;
  ref: string;       // slug ของสมาชิกที่เป็นเจ้าของหน้า
  refName?: string;
  at: string;
}
