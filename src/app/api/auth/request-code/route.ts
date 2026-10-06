import { NextResponse, type NextRequest } from "next/server";

/**
 * POST /api/auth/request-code  { email, name?, lang? }
 * Asks DishData to email the guest a sign-in code in kokoland's branding. DishData
 * creates and rate-limits the code; the shared secret stays on the server. The browser
 * then finishes with supabase.auth.verifyOtp.
 */
export async function POST(req: NextRequest) {
  const api = process.env.DISHDATA_API_URL?.replace(/\/$/, "");
  const secret = process.env.NOTIFY_SECRET;
  const slug = process.env.NEXT_PUBLIC_DISHDATA_SLUG;
  if (!api || !secret || !slug) return NextResponse.json({ error: "Sign-in is not set up yet." }, { status: 503 });

  let body: { email?: unknown; name?: unknown; lang?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (typeof body.email !== "string") return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
  const res = await fetch(`${api}/api/auth/request-code`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-notify-secret": secret },
    body: JSON.stringify({
      slug,
      email: body.email,
      name: typeof body.name === "string" ? body.name : undefined,
      lang: body.lang === "de" ? "de" : "en",
      ip,
    }),
    cache: "no-store",
  }).catch(() => null);
  const data = res ? await res.json().catch(() => null) : null;
  if (!res?.ok) return NextResponse.json({ error: data?.error ?? "Could not send the code." }, { status: res?.status === 429 ? 429 : 502 });
  return NextResponse.json({ ok: true });
}
