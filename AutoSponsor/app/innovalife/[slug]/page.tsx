import { getMember } from "@/lib/redis";
import { notFound } from "next/navigation";
import SalePage from "./SalePage";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const member = await getMember(params.slug).catch(() => null);
  return {
    title: member
      ? `โอกาสธุรกิจสุขภาพ Innova Life | แนะนำโดย ${member.name}`
      : "ไม่พบหน้านี้ | Innova Life",
    description:
      "ร่วมเป็นพาร์ตเนอร์ธุรกิจสุขภาพและนวัตกรรมชะลอวัยกับ Innova Life สร้างรายได้จากเทรนด์สุขภาพระดับโลก",
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const member = await getMember(params.slug).catch(() => null);
  if (!member) notFound();
  return <SalePage member={member} />;
}
