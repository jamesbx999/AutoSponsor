import { redis } from "@/lib/redis";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const dataUrl: string | null = await redis(["HGET", "images", params.id]);
    if (!dataUrl) return new Response("not found", { status: 404 });

    // dataUrl = "data:image/jpeg;base64,xxxx"
    const match = dataUrl.match(/^data:(image\/[\w+.-]+);base64,(.+)$/);
    if (!match) return new Response("invalid", { status: 400 });
    const mime = match[1];
    const buf = Buffer.from(match[2], "base64");

    return new Response(buf, {
      headers: {
        "Content-Type": mime,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (e: any) {
    return new Response("error", { status: 500 });
  }
}
