import { NextResponse, type NextRequest } from "next/server";

/**
 * POST /api/notify-order  { orderId, lang }
 * Asks DishData to send the confirmation emails for a website order. The shared
 * secret stays on the server. DishData stamps each order, so a repeat call does
 * nothing, and it never answers with anything about the order.
 */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(req: NextRequest) {
  const api = process.env.DISHDATA_API_URL?.replace(/\/$/, "");
  const secret = process.env.NOTIFY_SECRET;
  if (!api || !secret) return NextResponse.json({ ok: false }, { status: 202 });

  let body: { orderId?: unknown; lang?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (typeof body.orderId !== "string" || !UUID.test(body.orderId)) return NextResponse.json({ ok: false }, { status: 400 });

  await fetch(`${api}/api/notify/order`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-notify-secret": secret },
    body: JSON.stringify({ orderId: body.orderId, lang: body.lang === "de" ? "de" : "en" }),
    cache: "no-store",
  }).catch(() => null);
  return NextResponse.json({ ok: true });
}
