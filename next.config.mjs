/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: import.meta.dirname,
  // Permanent redirects that keep the old WordPress/WooCommerce URLs' search
  // value on kokoland.de. The new site is a single page plus a few routes, so
  // old shop/product/event URLs land on the matching section.
  async redirects() {
    const hostRedirects = ["kokolandberlin.com", "www.kokolandberlin.com", "www.kokoland.de"].map((host) => ({
      source: "/:path*",
      has: [{ type: "host", value: host }],
      destination: "https://kokoland.de/:path*",
      permanent: true,
    }));
    // Old URLs end in "/"; Next first 308s them to the slash-less form, then
    // these run, so an old URL takes two permanent hops. Fine for search.
    const to = (destination, ...sources) =>
      sources.map((source) => ({ source, destination, permanent: true }));
    return [
      ...hostRedirects,
      ...to("/menu", "/shop", "/shop/:path*", "/product-category/:path*", "/product/:path*", "/product-tag/:path*", "/delivery", "/cart", "/checkout"),
      ...to("/account", "/my-account", "/my-account/:path*"),
      ...to("/#contact", "/contact"),
      ...to(
        "/onam-sadhya",
        "/kokoland-onam-sadya-2022",
        "/kokoland-sadya-2023",
        "/kokoland-onam-sadhya-2025",
        "/kokoland-onam-sadhya-2026",
      ),
      ...to("/#events", "/events", "/events/:path*", "/keff-championship-2026-berlin", "/kokoland-komabansfc"),
      ...to("/datenschutz", "/privacy-policy"),
      ...to("/agb", "/refund_returns"),
    ];
  },
  webpack(config) {
    // Brand.tsx / BrandDecor.tsx inline single-color SVGs via `?raw` so they
    // inherit currentColor. Mirror Vite's `?raw` loader.
    //
    // Next's own built-in asset rule for image extensions (nested inside a
    // `oneOf` array) still matches `*.svg?raw` requests and wins, because
    // adding a rule doesn't remove the built-in one — so `?raw` imports were
    // resolving to Next's `{src,height,width,...}` image-import wrapper
    // (its literal compiled JS source) instead of the raw SVG markup, and
    // rendering that as visible page text via dangerouslySetInnerHTML.
    // Fix: explicitly exclude the `?raw` resourceQuery from every built-in
    // rule that would otherwise claim these files, then handle it ourselves.
    for (const rule of config.module.rules) {
      if (Array.isArray(rule.oneOf)) {
        for (const sub of rule.oneOf) {
          if (sub.test instanceof RegExp && sub.test.test(".svg")) {
            sub.resourceQuery = { not: [...(sub.resourceQuery?.not ?? []), /raw/] };
          }
        }
      }
    }
    config.module.rules.push({
      test: /\.svg$/,
      resourceQuery: /raw/,
      type: "asset/source",
    });
    return config;
  },
};

export default nextConfig;
