import Link from "next/link";

export default function NotFound() {
  return (
    <div className="land">
      <span className="blob b1" />
      <span className="blob b2" />
      <div className="land-inner">
        <div className="logo">
          <span className="dot">AS</span> AutoSponsor
        </div>
        <h1>
          ไม่พบ<span className="hl">หน้านี้</span>
        </h1>
        <p>ลิงก์อาจพิมพ์ผิด หรือสมาชิกท่านนี้ยังไม่ได้เปิดใช้งานหน้าเว็บ</p>
        <div className="cta">
          <Link className="btn btn-primary" href="/">
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
}
