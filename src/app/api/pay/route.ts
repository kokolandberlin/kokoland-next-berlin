import { NextResponse, type NextRequest } from "next/server";

/**
 * POST /api/pay  { orderId }
 * Starts a Stripe Checkout for a website pre-order. DishData owns the Stripe
 * connection and works out the amount from the order itself, so this route only
 * forwards the order id (server to server, no secrets in the browser) and tells
 * Stripe where to send the guest back to.
 */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(req: NextRequest) {
  const api = process.env.DISHDATA_API_URL?.replace(/\/$/, "");
  if (!api) return NextResponse.json({ error: "Online payment is not set up yet." }, { status: 503 });

  let orderId: unknown;
  let lang: unknown;
  try {
    ({ orderId, lang } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (typeof orderId !== "string" || !UUID.test(orderId)) {
    return NextResponse.json({ error: "Invalid order." }, { status: 400 });
  }

  const origin = req.nextUrl.origin;
  const res = await fetch(`${api}/api/payments/checkout`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      orderId,
      lang: lang === "de" ? "de" : "en",
      successUrl: `${origin}/order/${orderId}?paid=1`,
      cancelUrl: `${origin}/order/${orderId}?cancelled=1`,
    }),
    cache: "no-store",
  }).catch(() => null);

  const data = res ? await res.json().catch(() => null) : null;
  if (!res || !res.ok || !data?.url) {
    return NextResponse.json({ error: data?.error ?? "Could not start the payment." }, { status: 502 });
  }
  return NextResponse.json({ url: data.url });
}
