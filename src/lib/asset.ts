// Public files need the base path when the site is served from a sub-path (e.g. username.github.io/Portfolio).
// next/link adds it automatically; plain <img> tags and unoptimized next/image do not.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset<T extends string | null | undefined>(path: T): T {
  if (!path || !basePath || !path.startsWith("/") || path.startsWith(basePath + "/")) return path;
  return `${basePath}${path}` as T;
}
