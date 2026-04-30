function svgEscapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Favicon as ~/ using resolved --primary (glyph) and --bg (tile), matching color mode + tweaks. */
export function refreshTerminalFavicon() {
  if (!import.meta.client) return;

  const root = document.documentElement;
  const cs = getComputedStyle(root);
  const fg = cs.getPropertyValue("--primary").trim() || "#72daa8";
  const bg = cs.getPropertyValue("--bg").trim() || "#07090e";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${svgEscapeAttr(bg)}"/><text x="32" y="32" font-family="ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace" font-size="24" font-weight="700" fill="${svgEscapeAttr(fg)}" text-anchor="middle" dominant-baseline="central">~/</text></svg>`;

  const href = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

  let link = document.querySelector(
    'link[rel="icon"][data-terminal-favicon]',
  ) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/svg+xml";
    link.setAttribute("data-terminal-favicon", "");
    document.head.appendChild(link);
  }
  link.href = href;
}
