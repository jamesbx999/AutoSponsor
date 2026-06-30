import { redis } from "@/lib/redis";

export const dynamic = "force-dynamic";

// GET /api/img?id=xxxx  -> คืนรูปจริงจาก Redis
export async function GET(req: Request) {
  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return new Response("missing id", { status: 400 });

    const dataUrl: string | null = await redis(["HGET", "images", id]);
    if (!dataUrl) return new Response("not found", { status: 404 });

    const match = dataUrl.match(/^data:((?:image|audio)\/[\w+.-]+);base64,(.+)$/);
    if (!match) return new Response("invalid", { status: 400 });

    const buf = Buffer.from(match[2], "base64");
    return new Response(new Uint8Array(buf), {
      headers: {
        "Content-Type": match[1],
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("error", { status: 500 });
  }
}
