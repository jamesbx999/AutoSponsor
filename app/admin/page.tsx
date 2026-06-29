"use client";

import { useEffect, useState } from "react";
import type { Member, Lead } from "@/lib/types";

const EMPTY: Partial<Member> = {
  slug: "",
  name: "",
  photo: "",
  refLink: "",
  lineUrl: "",
  phone: "",
  messengerUrl: "",
  webhook: "",
  headline: "",
  subheadline: "",
  heroImage: "",
  successImage: "",
  videoUrl: "",
};

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [pwd, setPwd] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [tab, setTab] = useState<"members" | "leads">("members");
  const [members, setMembers] = useState<Member[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [modal, setModal] = useState<Partial<Member> | null>(null);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/auth")
      .then((r) => r.json())
      .then((d) => setAuthed(!!d.authed));
  }, []);

  useEffect(() => {
    if (authed) {
      loadMembers();
      loadLeads();
    }
  }, [authed]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  }

  async function login() {
    setLoginErr("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pwd }),
    });
    if (res.ok) setAuthed(true);
    else setLoginErr("รหัสผ่านไม่ถูกต้อง");
  }

  async function logout() {
    await fetch("/api/auth", { method: "DELETE" });
    setAuthed(false);
  }

  async function loadMembers() {
    const d = await fetch("/api/members").then((r) => r.json());
    setMembers(d.members || []);
  }
  async function loadLeads() {
    const d = await fetch("/api/leads").then((r) => r.json());
    setLeads(d.leads || []);
  }

  function openNew() {
    setEditingSlug(null);
    setModal({ ...EMPTY });
  }
  function openEdit(m: Member) {
    setEditingSlug(m.slug);
    setModal({ ...m });
  }

  async function saveMember() {
    if (!modal?.name || !modal?.slug) {
      showToast("กรุณากรอกชื่อและ slug");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(modal),
    });
    setSaving(false);
    if (res.ok) {
      setModal(null);
      await loadMembers();
      showToast(editingSlug ? "บันทึกการแก้ไขแล้ว" : "เพิ่มสมาชิกแล้ว");
    } else {
      const d = await res.json();
      showToast(d.error || "บันทึกไม่สำเร็จ");
    }
  }

  async function removeMember(slug: string) {
    if (!confirm(`ลบสมาชิก "${slug}" ?`)) return;
    await fetch(`/api/members/${slug}`, { method: "DELETE" });
    await loadMembers();
    showToast("ลบแล้ว");
  }

  function memberUrl(slug: string) {
    if (typeof window === "undefined") return `/innovalife/${slug}`;
    return `${window.location.origin}/innovalife/${slug}`;
  }
  function copyLink(slug: string) {
    navigator.clipboard.writeText(memberUrl(slug));
    showToast("คัดลอกลิงก์แล้ว 📋");
  }

  function autoSlug(name: string) {
    if (editingSlug) return; // ไม่เปลี่ยน slug ตอนแก้ไข
    const s = name.toLowerCase().trim().replace(/\s+/g, "").replace(/[^a-z0-9_-]/g, "");
    setModal((m) => ({ ...m, name, slug: s }));
  }

  function exportLeadsCsv() {
    const rows = [["วันที่", "ชื่อ", "เบอร์", "สนใจ", "ผู้แนะนำ", "slug"]];
    leads.forEach((l) =>
      rows.push([
        new Date(l.at).toLocaleString("th-TH"),
        l.name,
        l.phone,
        l.interest,
        l.refName || "",
        l.ref,
      ])
    );
    const csv = "\uFEFF" + rows.map((r) => r.map((c) => `"${(c || "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /* ---------------- LOGIN ---------------- */
  if (authed === null) {
    return (
      <div className="login">
        <div className="login-card">
          <p>กำลังตรวจสอบ...</p>
        </div>
      </div>
    );
  }
  if (!authed) {
    return (
      <div className="login">
        <span className="blob b1" />
        <span className="blob b2" />
        <div className="login-card">
          <div className="logo">
            <img className="dot" src="/logo.png" alt="AutoSponsor" /> AutoSponsor
          </div>
          <p>เข้าสู่ระบบหลังบ้านเพื่อจัดการสมาชิกและรายชื่อผู้สนใจ</p>
          <div className="field">
            <label>รหัสผ่านแอดมิน</label>
            <input
              type="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
              placeholder="••••••••"
            />
          </div>
          <button className="btn btn-primary" onClick={login}>
            เข้าสู่ระบบ →
          </button>
          {loginErr && <div className="err">{loginErr}</div>}
        </div>
      </div>
    );
  }

  /* ---------------- DASHBOARD ---------------- */
  const today = new Date().toDateString();
  const leadsToday = leads.filter((l) => new Date(l.at).toDateString() === today).length;

  return (
    <div className="admin">
      <div className="admin-head">
        <div className="wrap">
          <div className="brandmark">
            <img className="dot" src="/logo.png" alt="AutoSponsor" /> AutoSponsor Admin
          </div>
          <button className="btn btn-ghost" onClick={logout}>
            ออกจากระบบ
          </button>
        </div>
      </div>

      <div className="admin-body">
        <div className="wrap">
          {/* stats */}
          <div className="stat-row">
            <div className="stat s1">
              <div className="v">{members.length}</div>
              <div className="k">สมาชิกทั้งหมด</div>
            </div>
            <div className="stat s2">
              <div className="v">{leads.length}</div>
              <div className="k">ผู้สนใจสะสม</div>
            </div>
            <div className="stat s3">
              <div className="v">{leadsToday}</div>
              <div className="k">ผู้สนใจวันนี้</div>
            </div>
            <div className="stat s4">
              <div className="v">{new Set(leads.map((l) => l.ref)).size}</div>
              <div className="k">สมาชิกที่มี lead</div>
            </div>
          </div>

          {/* tabs */}
          <div className="tabs">
            <button className={`tab ${tab === "members" ? "active" : ""}`} onClick={() => setTab("members")}>
              👤 สมาชิก
            </button>
            <button className={`tab ${tab === "leads" ? "active" : ""}`} onClick={() => setTab("leads")}>
              📥 ผู้สนใจ ({leads.length})
            </button>
          </div>

          {/* MEMBERS TAB */}
          {tab === "members" && (
            <div className="card">
              <div className="card-head">
                <h2>รายชื่อสมาชิก</h2>
                <button className="btn btn-primary" onClick={openNew}>
                  + เพิ่มสมาชิก
                </button>
              </div>
              {members.length === 0 ? (
                <div className="empty">ยังไม่มีสมาชิก — กด "เพิ่มสมาชิก" เพื่อสร้างหน้าเว็บแรก</div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table className="tbl">
                    <thead>
                      <tr>
                        <th>สมาชิก</th>
                        <th>ลิงก์ (slug)</th>
                        <th>เบอร์</th>
                        <th>จัดการ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((m) => (
                        <tr key={m.slug}>
                          <td>
                            <div className="mname">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={m.photo || "https://placehold.co/80?text=IL"} alt="" />
                              <b>{m.name}</b>
                            </div>
                          </td>
                          <td>
                            <span className="slug-pill">/{m.slug}</span>
                          </td>
                          <td>{m.phone || "-"}</td>
                          <td>
                            <div className="row-actions">
                              <button className="mini copy" onClick={() => copyLink(m.slug)}>
                                คัดลอกลิงก์
                              </button>
                              <a className="mini open" href={memberUrl(m.slug)} target="_blank" rel="noopener">
                                เปิดดู
                              </a>
                              <button className="mini edit" onClick={() => openEdit(m)}>
                                แก้ไข
                              </button>
                              <button className="mini del" onClick={() => removeMember(m.slug)}>
                                ลบ
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* LEADS TAB */}
          {tab === "leads" && (
            <div className="card">
              <div className="card-head">
                <h2>รายชื่อผู้สนใจ (Leads)</h2>
                <button className="btn btn-ghost" onClick={exportLeadsCsv} disabled={leads.length === 0}>
                  ⬇ ดาวน์โหลด CSV
                </button>
              </div>
              {leads.length === 0 ? (
                <div className="empty">ยังไม่มีผู้สนใจกรอกฟอร์มเข้ามา</div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table className="tbl">
                    <thead>
                      <tr>
                        <th>วันที่</th>
                        <th>ชื่อ</th>
                        <th>เบอร์</th>
                        <th>สนใจ</th>
                        <th>ผู้แนะนำ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((l, i) => (
                        <tr key={i}>
                          <td>{new Date(l.at).toLocaleString("th-TH", { dateStyle: "short", timeStyle: "short" })}</td>
                          <td>
                            <b>{l.name}</b>
                          </td>
                          <td>
                            <a href={`tel:${l.phone}`} style={{ color: "var(--violet)" }}>
                              {l.phone}
                            </a>
                          </td>
                          <td>{l.interest}</td>
                          <td>
                            {l.refName || l.ref} <span className="slug-pill">/{l.ref}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {modal && (
        <div className="modal-bg" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>{editingSlug ? "แก้ไขสมาชิก" : "เพิ่มสมาชิกใหม่"}</h3>
              <button className="x" onClick={() => setModal(null)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="grid2">
                <div className="field">
                  <label>ชื่อที่แสดง *</label>
                  <input value={modal.name || ""} onChange={(e) => autoSlug(e.target.value)} placeholder="เช่น โค้ชเพชร" />
                </div>
                <div className="field">
                  <label>slug (ลิงก์) *</label>
                  <input
                    value={modal.slug || ""}
                    disabled={!!editingSlug}
                    onChange={(e) => setModal({ ...modal, slug: e.target.value })}
                    placeholder="coachpetch"
                  />
                  <div className="hint">/innovalife/{modal.slug || "..."} {editingSlug && "(แก้ slug ไม่ได้)"}</div>
                </div>
              </div>

              <div className="field">
                <label>ลิงก์สมัครส่วนตัว (ref link) *</label>
                <input
                  value={modal.refLink || ""}
                  onChange={(e) => setModal({ ...modal, refLink: e.target.value })}
                  placeholder="https://innova-life.com/register?ref=coachpetch"
                />
              </div>

              <div className="grid2">
                <div className="field">
                  <label>เบอร์โทร</label>
                  <input value={modal.phone || ""} onChange={(e) => setModal({ ...modal, phone: e.target.value })} placeholder="0812345678" />
                </div>
                <div className="field">
                  <label>ลิงก์ไลน์ (LINE)</label>
                  <input value={modal.lineUrl || ""} onChange={(e) => setModal({ ...modal, lineUrl: e.target.value })} placeholder="https://line.me/ti/p/~id" />
                </div>
              </div>

              <div className="grid2">
                <div className="field">
                  <label>ลิงก์ Messenger</label>
                  <input value={modal.messengerUrl || ""} onChange={(e) => setModal({ ...modal, messengerUrl: e.target.value })} placeholder="https://m.me/username" />
                </div>
                <div className="field">
                  <label>รูปโปรไฟล์ (URL)</label>
                  <input value={modal.photo || ""} onChange={(e) => setModal({ ...modal, photo: e.target.value })} placeholder="https://..." />
                </div>
              </div>

              <div className="field">
                <label>Webhook รับแจ้งเตือน lead</label>
                <input value={modal.webhook || ""} onChange={(e) => setModal({ ...modal, webhook: e.target.value })} placeholder="Telegram / Discord / Make webhook URL" />
                <div className="hint">เมื่อมีคนกรอกฟอร์ม ระบบจะ POST ข้อมูลไป URL นี้ (เว้นว่างได้ — ดู lead ในแอดมินแทน)</div>
              </div>

              <div className="field">
                <label>วิดีโอแนะนำ (URL)</label>
                <input value={modal.videoUrl || ""} onChange={(e) => setModal({ ...modal, videoUrl: e.target.value })} placeholder="https://youtube.com/..." />
              </div>

              <div className="field">
                <label>รูปโปสเตอร์ส่วนตัว (URL) — แสดงเด่นในส่วนรีวิว</label>
                <input value={modal.successImage || ""} onChange={(e) => setModal({ ...modal, successImage: e.target.value })} placeholder="https://... (รูปแนวตั้งของสมาชิกคนนี้)" />
                <div className="hint">ภาพเฉพาะบุคคล แสดงเต็มภาพแนวตั้งตรงกลางส่วน "เสียงจากทีมงาน" — เว้นว่าง = ใช้รูปตัวอย่าง</div>
              </div>

              <div className="grid2">
                <div className="field">
                  <label>หัวข้อ hero (เว้นว่าง = ค่าเริ่มต้น)</label>
                  <input value={modal.headline || ""} onChange={(e) => setModal({ ...modal, headline: e.target.value })} placeholder="เช่น สร้างรายได้ *หลักแสน* ต่อเดือน" />
                  <div className="hint">ครอบคำด้วย * เพื่อให้คำนั้นเป็นสีไล่เฉด เช่น สร้างรายได้ *หลักแสน* — ถ้าไม่ใส่ * ทั้งหัวข้อจะเป็นสี</div>
                </div>
                <div className="field">
                  <label>รูป hero (URL)</label>
                  <input value={modal.heroImage || ""} onChange={(e) => setModal({ ...modal, heroImage: e.target.value })} placeholder="https://..." />
                </div>
              </div>

              <div className="field">
                <label>คำโปรย (เว้นว่าง = ค่าเริ่มต้น)</label>
                <input value={modal.subheadline || ""} onChange={(e) => setModal({ ...modal, subheadline: e.target.value })} placeholder="ข้อความใต้หัวข้อ" />
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={() => setModal(null)}>
                ยกเลิก
              </button>
              <button className="btn btn-primary" onClick={saveMember} disabled={saving}>
                {saving ? "กำลังบันทึก..." : "บันทึก"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
