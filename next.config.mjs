/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: import.meta.dirname,
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
