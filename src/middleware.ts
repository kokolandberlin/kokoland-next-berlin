import { NextResponse } from "next/server";

// The old WordPress site was injected with thousands of spam /opportunity/job/…
// pages and exposed internal plugin pages. 410 Gone (not 404) tells Google to
// drop them quickly. Do NOT block these paths in robots.txt: Google has to be
// able to crawl them to see the 410.
export function middleware() {
  return new NextResponse("Gone", {
    status: 410,
    headers: { "content-type": "text/plain; charset=utf-8", "x-robots-tag": "noindex" },
  });
}

export const config = {
  matcher: [
    "/opportunity",
    "/opportunity/:path*",
    "/admin",
    "/admin/:path*",
    "/shop-manager",
    "/shop-manager/:path*",
    "/packaging-manager",
    "/packaging-manager/:path*",
    "/etn-speaker-category/:path*",
    "/etn_category/:path*",
    "/etn-tags/:path*",
    "/etn-schedule/:path*",
    "/mailpoet_page/:path*",
  ],
};
