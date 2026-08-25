function svgEscapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Favicon as a serif B on the page ground, tracking --primary/--bg (theme + tweaks). */
export function refreshFavicon() {
  if (!import.meta.client) return;

  const cs = getComputedStyle(document.documentElement);
  const fg = cs.getPropertyValue("--primary").trim() || "#94381f";
  const bg = cs.getPropertyValue("--bg").trim() || "#faf8f3";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="${svgEscapeAttr(bg)}"/><text x="32" y="34" font-family="Georgia,'Times New Roman',serif" font-size="46" fill="${svgEscapeAttr(fg)}" text-anchor="middle" dominant-baseline="central">B</text></svg>`;

  const href = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

  let link = document.querySelector(
    'link[rel="icon"][data-site-favicon]',
  ) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/svg+xml";
    link.setAttribute("data-site-favicon", "");
    document.head.appendChild(link);
  }
  link.href = href;
}
