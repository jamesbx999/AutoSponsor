"use client";

import { useEffect, useRef, useState } from "react";
import type { Member } from "@/lib/types";

const DEFAULT_HERO =
  "https://a.storyblok.com/f/275161/1000x800/e10d19b147/healthcare-pharmapacker-group.jpg/m/smart";
const PROOF_IMG =
  "https://images.presentationgo.com/2025/05/diverse-smiling-business-team.jpg";

export default function SalePage({ member }: { member: Member }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState("สนใจร่วมทำธุรกิจ");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // scroll reveal
  useEffect(() => {
    const els = rootRef.current?.querySelectorAll(".reveal") || [];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.14 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  async function submitLead() {
    if (!name.trim() || !phone.trim()) {
      alert("กรุณากรอกชื่อและเบอร์โทรให้ครบนะคะ");
      return;
    }
    setSubmitting(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, interest, ref: member.slug }),
      });
      setSent(true);
    } catch {
      alert("ส่งข้อมูลไม่สำเร็จ ลองใหม่อีกครั้งนะคะ");
    } finally {
      setSubmitting(false);
    }
  }

  function playVideo() {
    if (member.videoUrl) setShowVideo(true);
    else alert("ผู้แนะนำยังไม่ได้ใส่ลิงก์วิดีโอ");
  }

  // ปิด modal ด้วยปุ่ม ESC
  useEffect(() => {
    if (!showVideo) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setShowVideo(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showVideo]);

  // แปลงลิงก์ YouTube / Vimeo เป็น embed URL
  function toEmbedUrl(url: string): string {
    try {
      const yt = url.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/
      );
      if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1&rel=0`;
      const vm = url.match(/vimeo\.com\/(\d+)/);
      if (vm) return `https://player.vimeo.com/video/${vm[1]}?autoplay=1`;
    } catch {}
    return url; // ลิงก์อื่น เช่น .mp4 หรือ embed อยู่แล้ว
  }

  const isFileVideo = /\.(mp4|webm|ogg)(\?.*)?$/i.test(member.videoUrl || "");

  const photo = member.photo || PROOF_IMG;
  const heroImg = member.heroImage || DEFAULT_HERO;

  return (
    <div ref={rootRef}>
      {/* top bar */}
      <header className="topbar">
        <div className="wrap">
          <div className="brandmark">
            <img className="dot" src="/logo.png" alt="Innova Life" /> Innova Life
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div className="ref-badge">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo} alt={member.name} />
              <span>
                <span className="lbl">แนะนำโดย </span>
                <b>{member.name}</b>
              </span>
            </div>
            <a className="btn btn-primary" href={member.refLink} target="_blank" rel="noopener">
              สมัครร่วมทีม<span className="full"> →</span>
            </a>
          </div>
        </div>
      </header>

      {/* hero */}
      <section className="hero">
        <div className="hero-bg" />
        <span className="blob b1" />
        <span className="blob b2" />
        <div className="wrap">
          <div className="reveal">
            <span className="eyebrow">โอกาสธุรกิจสุขภาพ ปี 2026</span>
            <h1>
              {member.headline ? (
                member.headline
              ) : (
                <>
                  สร้างรายได้จาก
                  <br />
                  <span className="hl">เทรนด์สุขภาพ &amp; ชะลอวัย</span>
                  <br />
                  ระดับโลก
                </>
              )}
            </h1>
            <p className="lead">
              {member.subheadline ||
                "เป็นพาร์ตเนอร์กับ Innova Life แบรนด์นวัตกรรมสุขภาพที่มีงานวิจัยรองรับ พร้อมระบบพี่เลี้ยงและเครื่องมือทำงานครบ — เริ่มได้แม้ไม่มีประสบการณ์"}
            </p>
            <div className="hero-cta">
              <a className="btn btn-primary" href={member.refLink} target="_blank" rel="noopener">
                สมัครร่วมทีมตอนนี้ →
              </a>
              <a className="btn btn-ghost" href="#plan">
                ดูแผนรายได้
              </a>
            </div>
            <div className="trust-strip">
              <div className="t">
                <span className="n">20+</span>
                <span className="l">ปีงานวิจัย R&amp;D</span>
              </div>
              <div className="t">
                <span className="n">9.2%</span>
                <span className="l">อัตราปิดการสมัคร*</span>
              </div>
              <div className="t">
                <span className="n">100%</span>
                <span className="l">มีพี่เลี้ยงดูแล</span>
              </div>
            </div>
          </div>

          <div className="reveal video-card">
            <div className="inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={heroImg} alt="ผลิตภัณฑ์นวัตกรรมสุขภาพ Innova Life" />
              <div className="overlay" />
              <button className="play" onClick={playVideo} aria-label="เล่นวิดีโอแนะนำธุรกิจ" />
              <div className="cap">
                <b>วิดีโอแนะนำโอกาสธุรกิจ</b>
                <span>ดูภายใน 3 นาที ว่าทำไมคนเลือก Innova Life</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* why */}
      <section className="block">
        <div className="wrap">
          <div className="center reveal">
            <span className="eyebrow">ทำไมต้อง Innova Life</span>
            <h2>ธุรกิจที่ "ของจริง" รองรับ ไม่ใช่แค่ฝันลมๆ แล้งๆ</h2>
            <p>สามเหตุผลที่ทำให้สมาชิกของเราเริ่มต้นได้มั่นใจ และไปต่อได้ระยะยาว</p>
          </div>
          <div className="value-grid">
            <div className="vcard c1 reveal">
              <div className="ic">🔬</div>
              <h3>นวัตกรรมที่พิสูจน์ได้</h3>
              <p>สารสกัดและผลิตภัณฑ์ดูแลสุขภาพที่มีงานวิจัยและรางวัลระดับสากลรองรับ ทำให้คุณแนะนำได้อย่างสบายใจ</p>
            </div>
            <div className="vcard c2 reveal">
              <div className="ic">📈</div>
              <h3>แผนรายได้ที่เข้าใจง่าย</h3>
              <p>โครงสร้างผลตอบแทนชัดเจน เห็นเส้นทางการเติบโตของทั้งยอดส่วนตัวและยอดทีม ไม่ซับซ้อนจนงง</p>
            </div>
            <div className="vcard c3 reveal">
              <div className="ic">🤝</div>
              <h3>ระบบพี่เลี้ยงคอยจับมือ</h3>
              <p>คอร์สเรียนฟรี เครื่องมือทำตลาดออนไลน์ และทีมที่พร้อมสอนคุณตั้งแต่วันแรก ไม่ปล่อยให้ทำคนเดียว</p>
            </div>
          </div>
        </div>
      </section>

      {/* plan */}
      <section className="block income" id="plan">
        <span className="blob b1" />
        <span className="blob b2" />
        <div className="wrap">
          <div className="center reveal">
            <span className="eyebrow">แผนรายได้โดยย่อ</span>
            <h2>เริ่มเล็ก โตได้ตามความตั้งใจ</h2>
            <p>ตัวอย่างเส้นทางการเติบโต 3 ระดับ ที่สมาชิกจริงเดินกันมาแล้ว</p>
          </div>
          <div className="plan-grid">
            <div className="plan p1 reveal">
              <span className="tag">เริ่มต้น</span>
              <div className="lvl">รายได้เสริม</div>
              <div className="amt">
                ฿8,000<small>+ / เดือน</small>
              </div>
              <ul>
                <li>แบ่งปันสินค้าให้คนใกล้ตัว</li>
                <li>ใช้เครื่องมือออนไลน์สำเร็จรูป</li>
                <li>ทำควบคู่งานประจำได้</li>
              </ul>
            </div>
            <div className="plan feat reveal">
              <span className="tag">ยอดนิยม</span>
              <div className="lvl">สร้างทีม</div>
              <div className="amt">
                ฿35,000<small>+ / เดือน</small>
              </div>
              <ul>
                <li>มีทีมงาน 5–10 คนช่วยกัน</li>
                <li>รายได้จากยอดองค์กร</li>
                <li>ระบบ AutoSponsor ส่งต่อให้ลูกทีม</li>
              </ul>
            </div>
            <div className="plan p3 reveal">
              <span className="tag">ผู้นำ</span>
              <div className="lvl">เต็มเวลา</div>
              <div className="amt">
                ฿100,000<small>+ / เดือน</small>
              </div>
              <ul>
                <li>โบนัสผู้นำและทริปท่องเที่ยว</li>
                <li>สร้างองค์กรหลักร้อยคน</li>
                <li>รายได้แบบ Passive ทบต้น</li>
              </ul>
            </div>
          </div>
          <p className="disclaimer-pill">
            * ตัวเลขเป็นเพียงตัวอย่างเพื่อการอธิบายเท่านั้น รายได้จริงขึ้นอยู่กับความตั้งใจ ความสามารถ
            และเวลาที่ทุ่มเทของแต่ละบุคคล มิใช่การรับประกันรายได้
          </p>
        </div>
      </section>

      {/* proof */}
      <section className="block proof">
        <div className="wrap">
          <div className="center reveal">
            <span className="eyebrow">เสียงจากทีมงาน</span>
            <h2>คนธรรมดาที่ตัดสินใจเริ่ม</h2>
            <p>ความสำเร็จที่เกิดจากการลงมือทำและระบบที่ช่วยทำซ้ำได้</p>
          </div>
          <div className="proof-grid">
            <div className="quote q1 reveal">
              <div className="stars">★★★★★</div>
              <p>"เริ่มจากแม่บ้านที่ไม่เคยขายของออนไลน์ ใช้หน้าเว็บที่ทีมแจกให้ ตอนนี้มีรายได้เสริมพอผ่อนรถได้แล้วค่ะ"</p>
              <div className="who">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={PROOF_IMG} alt="" />
                <div>
                  <b>คุณแนน</b>
                  <span>สมาชิก 8 เดือน</span>
                </div>
              </div>
            </div>
            <div className="quote q2 reveal">
              <div className="stars">★★★★★</div>
              <p>"จุดเปลี่ยนคือมีพี่เลี้ยงสอนจริง และมีระบบให้ลูกทีมก๊อปไปใช้ได้ทันที ทีมโตเร็วกว่าที่คิดมากครับ"</p>
              <div className="who">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={PROOF_IMG} alt="" />
                <div>
                  <b>คุณวิทย์</b>
                  <span>ผู้นำทีม</span>
                </div>
              </div>
            </div>
            <div className="quote q3 reveal">
              <div className="stars">★★★★★</div>
              <p>"ชอบที่สินค้ามีงานวิจัยรองรับ เลยแนะนำได้อย่างสบายใจ ไม่ต้องตื๊อใคร ลูกค้าทักมาเองจากหน้าเว็บ"</p>
              <div className="who">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={PROOF_IMG} alt="" />
                <div>
                  <b>คุณพลอย</b>
                  <span>สมาชิก 1 ปี</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* lead capture */}
      <section className="lead">
        <span className="blob b1" />
        <div className="wrap">
          <div className="lead-card reveal">
            <div className="lead-left">
              <span className="eyebrow">ยังไม่พร้อมสมัคร?</span>
              <h2>ขอข้อมูลเพิ่มเติมก่อนได้</h2>
              <p>กรอกชื่อและเบอร์ติดต่อ แล้วทีมงานจะติดต่อกลับเพื่อตอบทุกข้อสงสัยแบบไม่กดดัน</p>
              <div className="bullet">
                <i>✓</i>
                <span>ปรึกษาฟรี ไม่มีค่าใช้จ่าย</span>
              </div>
              <div className="bullet">
                <i>✓</i>
                <span>ดูแผนรายได้และสินค้าแบบละเอียด</span>
              </div>
              <div className="bullet">
                <i>✓</i>
                <span>
                  คุยกับ <b style={{ color: "#fff" }}>{member.name}</b> โดยตรง
                </span>
              </div>
            </div>
            <div className="lead-right">
              {!sent ? (
                <div>
                  <div className="field">
                    <label>ชื่อ-นามสกุล</label>
                    <input
                      type="text"
                      placeholder="เช่น สมหญิง ใจดี"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>เบอร์โทรศัพท์</label>
                    <input
                      type="tel"
                      inputMode="tel"
                      placeholder="08x-xxx-xxxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>สนใจเรื่อง</label>
                    <select value={interest} onChange={(e) => setInterest(e.target.value)}>
                      <option>สนใจร่วมทำธุรกิจ</option>
                      <option>สนใจซื้อสินค้าใช้เอง</option>
                      <option>ขอข้อมูลเพิ่มเติมก่อน</option>
                    </select>
                  </div>
                  <button className="btn btn-primary" onClick={submitLead} disabled={submitting}>
                    {submitting ? "กำลังส่ง..." : "ส่งข้อมูลให้ติดต่อกลับ →"}
                  </button>
                  <p className="form-note">ข้อมูลของคุณจะถูกส่งตรงถึงผู้แนะนำเท่านั้น ปลอดภัย 100%</p>
                </div>
              ) : (
                <div className="form-success">
                  <div className="big">🎉</div>
                  <h3>ส่งข้อมูลเรียบร้อย!</h3>
                  <p>{member.name} จะติดต่อกลับโดยเร็วที่สุด ขอบคุณค่ะ 🙏</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* final cta */}
      <section className="final">
        <div className="wrap">
          <div className="final-card reveal">
            <span className="ring r1" />
            <span className="ring r2" />
            <h2>พร้อมเริ่มต้นบทใหม่ของชีวิตหรือยัง?</h2>
            <p>คลิกสมัครและเริ่มสร้างทีมของคุณวันนี้ — เรามีพี่เลี้ยงรออยู่แล้ว</p>
            <div className="hero-cta">
              <a className="btn btn-primary" href={member.refLink} target="_blank" rel="noopener">
                สมัครร่วมทีม Innova Life →
              </a>
              {member.lineUrl && (
                <a className="btn btn-line" href={member.lineUrl} target="_blank" rel="noopener">
                  💬 ปรึกษาทางไลน์
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* floating contact */}
      <div className="fab">
        <div className="lab">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo} alt="" /> ปรึกษา <b style={{ marginLeft: 3 }}>{member.name}</b>
        </div>
        {member.lineUrl && (
          <a className="f-line" href={member.lineUrl} target="_blank" rel="noopener" aria-label="ทักไลน์">
            💬
          </a>
        )}
        {member.messengerUrl && (
          <a className="f-mess" href={member.messengerUrl} target="_blank" rel="noopener" aria-label="ทัก Messenger">
            f
          </a>
        )}
        {member.phone && (
          <a className="f-call" href={`tel:${member.phone}`} aria-label="โทร">
            📞
          </a>
        )}
      </div>

      {/* video modal */}
      {showVideo && member.videoUrl && (
        <div className="video-modal" onClick={() => setShowVideo(false)}>
          <button className="vm-close" onClick={() => setShowVideo(false)} aria-label="ปิด">
            ✕
          </button>
          <div className="vm-frame" onClick={(e) => e.stopPropagation()}>
            {isFileVideo ? (
              <video src={member.videoUrl} controls autoPlay style={{ width: "100%", height: "100%" }} />
            ) : (
              <iframe
                src={toEmbedUrl(member.videoUrl)}
                title="วิดีโอแนะนำธุรกิจ"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </div>
      )}

      {/* footer */}
      <footer>
        <svg className="wave" viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0,40 C240,10 480,60 720,40 C960,20 1200,55 1440,30 L1440,0 L0,0 Z"
            fill="#F3ECFE"
          />
        </svg>
        <span className="blob b1" />
        <div className="wrap">
          <div className="ft-top">
            <div className="brandmark">
              <img className="dot" src="/logo.png" alt="Innova Life" /> Innova Life
            </div>
            <div>
              แนะนำโดย <b style={{ color: "#fff" }}>{member.name}</b>
            </div>
          </div>
          <div className="legal">
            <b>คำชี้แจง:</b> เว็บไซต์นี้เป็นหน้าแนะนำของผู้จำหน่ายอิสระ มิใช่เว็บไซต์ทางการของบริษัท
            ผลิตภัณฑ์เสริมอาหารไม่มีผลในการป้องกันหรือรักษาโรค ควรอ่านคำเตือนบนฉลากก่อนบริโภค •
            รายได้ที่แสดงเป็นเพียงตัวอย่าง ไม่ใช่การรับประกันรายได้ ผลลัพธ์ขึ้นอยู่กับความพยายามของแต่ละบุคคล •
            © 2026 ผู้จำหน่ายอิสระ Innova Life. สงวนลิขสิทธิ์.
          </div>
        </div>
      </footer>
    </div>
  );
}
