const RAW_BASE = "https://raw.githubusercontent.com/cckoa/cripplecreekkoa-site/main/";
const HTML_FILES = new Map([
  ["/", "index.html"],
  ["/about", "about.html"],
  ["/about/", "about.html"],
  ["/contact", "contact.html"],
  ["/contact/", "contact.html"],
  ["/privacy", "privacy.html"],
  ["/privacy/", "privacy.html"],
  ["/404.html", "404.html"],
]);
const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

function wantsMarkdown(request) {
  return request.headers.get("accept")?.toLowerCase().includes("text/markdown") ?? false;
}

function response(body, status, contentType) {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": contentType,
      "Vary": "Accept",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function markdown404(pathname) {
  return `# Page not found\n\nThe requested page \`${pathname}\` does not exist. Continue with the [campground overview](https://cripplecreekkoa.com/), [sitemap](https://cripplecreekkoa.com/sitemap.xml), or [agent guide](https://cripplecreekkoa.com/llms.txt).\n`;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (wantsMarkdown(request)) {
      if (url.pathname === "/" || url.pathname === "") {
        const markdown = await fetch(`${RAW_BASE}agent-home.md`);
        return response(await markdown.text(), 200, "text/markdown; charset=utf-8");
      }
      if (!HTML_FILES.has(url.pathname) && !["/sitemap.xml", "/llms.txt", "/robots.txt"].includes(url.pathname)) {
        return response(markdown404(url.pathname), 404, "text/markdown; charset=utf-8");
      }
    }

    const filename = HTML_FILES.get(url.pathname) ?? url.pathname.replace(/^\//, "");
    if (!filename || filename.includes("..") || filename.includes("\\")) {
      return response("Page not found", 404, "text/plain; charset=utf-8");
    }
    const upstream = await fetch(`${RAW_BASE}${filename}`);
    if (!upstream.ok) {
      return response(wantsMarkdown(request) ? markdown404(url.pathname) : "Page not found", 404, wantsMarkdown(request) ? "text/markdown; charset=utf-8" : "text/plain; charset=utf-8");
    }
    const extension = filename.includes(".") ? filename.slice(filename.lastIndexOf(".")) : "";
    return response(await upstream.text(), 200, CONTENT_TYPES[extension] ?? "application/octet-stream");
  },
};
