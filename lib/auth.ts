import { cookies } from "next/headers";

export function isAuthed(): boolean {
  const c = cookies().get("as_auth")?.value;
  return !!c && !!process.env.ADMIN_PASSWORD && c === process.env.ADMIN_PASSWORD;
}
