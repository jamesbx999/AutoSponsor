# AutoSponsor 🚀

ระบบ **Replicated Sale Page** (เว็บงอก) สำหรับนักธุรกิจเครือข่าย Innova Life
สร้างหน้า Sale Page สวยๆ ครั้งเดียว แล้วแจกให้สมาชิกทุกคนมีเว็บเป็นของตัวเอง — ปุ่มสมัครและช่องทางติดต่อเปลี่ยนเป็นของเจ้าของลิงก์อัตโนมัติ

Stack: **Next.js 14 (App Router) + Upstash Redis** (ไม่ต้องลง DB เอง) — deploy บน Vercel ได้ทันที

---

## 🔧 ติดตั้ง (ครั้งเดียว)

### 1) สร้าง Upstash Redis (ฟรี)
1. ไปที่ https://console.upstash.com → สมัคร/ล็อกอิน
2. กด **Create Database** → เลือก region ใกล้ไทย (เช่น Singapore) → Create
3. เลื่อนลงไปหา **REST API** จะเห็น 2 ค่า:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
4. คัดลอกไว้

### 2) ตั้งค่า Environment Variables บน Vercel
หลัง Import repo เข้า Vercel แล้ว ไปที่ **Settings → Environment Variables** ใส่ 3 ตัวนี้:

| Key | ค่า |
|-----|-----|
| `UPSTASH_REDIS_REST_URL` | (จาก Upstash) |
| `UPSTASH_REDIS_REST_TOKEN` | (จาก Upstash) |
| `ADMIN_PASSWORD` | รหัสผ่านเข้าแอดมินที่คุณตั้งเอง |

แล้วกด **Redeploy** หนึ่งครั้งให้ค่ามีผล

> รันในเครื่อง: คัดลอก `.env.example` เป็น `.env.local` ใส่ค่าให้ครบ แล้ว `npm install` → `npm run dev`

---

## 📍 หน้าต่างๆ

| URL | คือ |
|-----|-----|
| `/` | หน้าแลนดิ้งแนะนำระบบ |
| `/admin` | หลังบ้าน (ใส่ ADMIN_PASSWORD เพื่อเข้า) |
| `/innovalife/{slug}` | หน้า Sale Page ของสมาชิกแต่ละคน |

ตัวอย่าง: เพิ่มสมาชิก slug = `coachpetch` → ลิงก์ของเขาคือ
`https://your-app.vercel.app/innovalife/coachpetch`

---

## 👤 วิธีใช้งาน (แอดมิน)

1. เข้า `/admin` → ใส่รหัสผ่าน
2. แท็บ **สมาชิก** → กด **+ เพิ่มสมาชิก** กรอก:
   - **ชื่อ** + **slug** (ลิงก์จะ generate ให้อัตโนมัติจากชื่อ แก้เองได้)
   - **ลิงก์สมัครส่วนตัว (ref link)** เช่น `https://innova-life.com/register?ref=coachpetch`
   - เบอร์โทร / LINE / Messenger / รูปโปรไฟล์
   - **Webhook** (ถ้าอยากให้แจ้งเตือน lead เข้า Telegram/Discord)
3. กด **คัดลอกลิงก์** ส่งให้สมาชิกเอาไปแชร์ได้เลย
4. แท็บ **ผู้สนใจ** → ดูรายชื่อคนที่กรอกฟอร์ม + ดาวน์โหลด CSV

> ⚠️ LINE Notify ปิดบริการแล้ว (ตั้งแต่ 31 มี.ค. 2025) — ช่อง Webhook ใช้กับ **Telegram Bot / Discord / Make / n8n** แทนได้

### ตัวอย่าง Webhook → Telegram
ใช้ URL แบบนี้ในช่อง Webhook (เปลี่ยน token/chat_id เป็นของคุณ):
```
https://api.telegram.org/bot<TOKEN>/sendMessage?chat_id=<CHAT_ID>
```
ระบบจะส่ง field `text` พร้อมรายละเอียด lead ไปให้อัตโนมัติ

---

## 🗂 โครงสร้างไฟล์

```
app/
  page.tsx                     หน้าแลนดิ้ง
  admin/page.tsx               หลังบ้าน (login + members + leads)
  innovalife/[slug]/page.tsx   server: ดึง member ตาม slug
  innovalife/[slug]/SalePage.tsx  หน้า Sale Page (วิดีโอ, ฟอร์ม, ปุ่มติดต่อ)
  api/
    auth/route.ts              ล็อกอินแอดมิน (cookie)
    members/route.ts           list / create / upsert สมาชิก
    members/[slug]/route.ts    get / delete
    leads/route.ts             public POST (เก็บ lead) + admin GET
lib/
  redis.ts                     Upstash REST helper
  types.ts                     Member, Lead
  auth.ts                      ตรวจ cookie แอดมิน
```

ข้อมูลเก็บใน Redis:
- `members` (hash) — field = slug, value = JSON ของสมาชิก
- `leads:all` (list) — เก็บ lead ล่าสุด 1000 รายการ

---

## 🎨 ปรับแต่ง

- สีทั้งหมดอยู่ที่ `:root` ใน `app/globals.css` (ตัวแปร `--violet`, `--cyan`, `--pink`, `--amber` ...)
- เนื้อหา/ข้อความหน้า Sale Page แก้ที่ `SalePage.tsx`
- แต่ละสมาชิก override หัวข้อ/คำโปรย/รูป hero/วิดีโอ ได้จากหน้าแอดมิน

---

## ⚖️ หมายเหตุด้านกฎหมาย
หน้าเว็บมี disclaimer ตามแนวปฏิบัติ อย. (ผลิตภัณฑ์เสริมอาหารไม่ใช่ยา) และข้อความว่าตัวเลขรายได้เป็นเพียงตัวอย่าง ไม่ใช่การรับประกันรายได้ — ควรคงไว้เพื่อความปลอดภัยในการทำตลาดสายสุขภาพ
