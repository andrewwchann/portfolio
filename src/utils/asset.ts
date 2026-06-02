/**
 * Resolve a path to a file in /public against Vite's base path.
 *
 * Files in /public referenced with an absolute path (e.g. "/profile.jpg") are
 * NOT rewritten by Vite, so on a project site served from /portfolio/ they would
 * 404. Prefixing with import.meta.env.BASE_URL fixes that. External URLs and
 * empty values pass through unchanged.
 */
export function asset(path: string): string {
  if (!path) return path;
  if (/^https?:\/\//i.test(path) || path.startsWith("data:")) return path;
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${base}/${path.replace(/^\//, "")}`;
}
