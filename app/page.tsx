import Link from "next/link";

export default function Home() {
  return (
    <div className="land">
      <span className="blob b1" />
      <span className="blob b2" />
      <span className="blob b3" />
      <div className="land-inner">
        <div className="logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="dot" src="/logo.png" alt="AutoSponsor" /> AutoSponsor
        </div>
        <h1>
          ระบบ<span className="hl">ขยายสายงาน</span>อัจฉริยะ
        </h1>
        <p>
          สร้างหน้า Sale Page สวยๆ ครั้งเดียว แล้วแจกให้ลูกทีมทุกคนมีเว็บเป็นของตัวเอง —
          ปุ่มสมัครและช่องทางติดต่อเปลี่ยนเป็นของเจ้าของลิงก์อัตโนมัติ
        </p>
        <div className="cta">
          <Link className="btn btn-primary" href="/admin">
            เข้าหน้าแอดมิน →
          </Link>
          <Link className="btn btn-ghost" href="/innovalife/demo">
            ดูตัวอย่างหน้าเว็บ
          </Link>
        </div>
        <div className="demo-note">
          ลิงก์ของสมาชิกแต่ละคนจะอยู่ในรูปแบบ <code>/innovalife/ชื่อสมาชิก</code>
        </div>
      </div>
    </div>
  );
}
