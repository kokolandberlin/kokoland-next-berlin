import { NextResponse, type NextRequest } from "next/server";

/** POST /api/notify-checkin { orderId }: asks DishData to email the kitchen that a guest is on their way. */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(req: NextRequest) {
  const api = process.env.DISHDATA_API_URL?.replace(/\/$/, "");
  const secret = process.env.NOTIFY_SECRET;
  if (!api || !secret) return NextResponse.json({ ok: false }, { status: 202 });
  const body = (await req.json().catch(() => ({}))) as { orderId?: unknown };
  if (typeof body.orderId !== "string" || !UUID.test(body.orderId)) return NextResponse.json({ ok: false }, { status: 400 });
  await fetch(`${api}/api/notify/checkin`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-notify-secret": secret },
    body: JSON.stringify({ orderId: body.orderId }),
    cache: "no-store",
  }).catch(() => null);
  return NextResponse.json({ ok: true });
}
