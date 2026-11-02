import type { NextConfig } from "next";

// STATIC_EXPORT=true builds plain HTML into out/ for GitHub Pages (see .github/workflows/deploy.yml).
// The CMS needs a server, so its routes use the *.cms.tsx / *.cms.ts extensions and are left out of static builds.
const isStaticExport = process.env.STATIC_EXPORT === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  basePath,
  pageExtensions: isStaticExport ? ["tsx", "ts"] : ["cms.tsx", "cms.ts", "tsx", "ts"],
  ...(isStaticExport && {
    output: "export",
    trailingSlash: true,
    images: { unoptimized: true },
  }),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
