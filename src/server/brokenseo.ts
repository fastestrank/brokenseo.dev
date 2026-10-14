import {
  fixturePaths,
  sitemapFixtures,
  allFixtures,
  catalogLinkedFixtures,
} from "../fixtures/registry";
import type { Fixture, FixtureContext } from "../fixtures/types";
import { canonicalPath, redirect, renderShell } from "../lib";

const routeTable = new Map<string, Fixture>();
for (const fixture of allFixtures) {
  for (const path of fixturePaths(fixture)) routeTable.set(path, fixture);
}

function requestOrigin(request: Request, url: URL): string {
  const host = request.headers.get("host") ?? url.host;
  return `${url.protocol}//${host}`;
}

export async function handleFixtureRequest(
  request: Request,
): Promise<Response> {
  const url = new URL(request.url);
  const path = canonicalPath(url.pathname);

  // One URL per page: the slash form is canonical, so the bare form is a
  // permanent redirect rather than a second copy of the same content.
  if (path !== url.pathname) {
    return redirect(`${path}${url.search}`, 301);
  }

  const fixture = routeTable.get(path);
  if (fixture) {
    const context: FixtureContext = {
      origin: requestOrigin(request, url),
      request,
      path,
    };
    return fixture.handler(context);
  }

  return new Response(
    renderShell({
      title: "404, not found | brokenseo.dev",
      metaDescription: "That URL is not one of the pages on this site.",
      bodyHtml: `<h1>404, not found</h1>
<p class="lede">This URL is not one of the broken pages on the site. It is just missing.</p>
<p>Go back to the <a href="/#issues">examples</a> to see the pages that break on purpose.</p>`,
    }),
    {
      status: 404,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
      },
    },
  );
}

export function robotsResponse(request: Request): Response {
  const url = new URL(request.url);
  const origin = requestOrigin(request, url);
  return new Response(
    `# brokenseo.dev is broken on purpose, but it lets crawlers in.
User-agent: *
Allow: /

Sitemap: ${origin}/sitemap.xml
`,
    { headers: { "content-type": "text/plain; charset=utf-8" } },
  );
}

export function sitemapResponse(request: Request): Response {
  const url = new URL(request.url);
  const origin = requestOrigin(request, url);
  const paths = new Set<string>(["/", "/privacy"]);
  for (const fixture of sitemapFixtures) {
    for (const path of fixturePaths(fixture)) paths.add(path);
  }
  const urls = [...paths]
    .map((path) => `  <url><loc>${origin}${canonicalPath(path)}</loc></url>`)
    .join("\n");
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
  return new Response(body, {
    headers: { "content-type": "application/xml; charset=utf-8" },
  });
}

export function llmsTextResponse(): Response {
  const lines: string[] = [
    "# BrokenSEO",
    "",
    "> https://brokenseo.dev",
    "",
    "BrokenSEO is a public test site of deliberate technical SEO defects.",
    "Each page breaks one specific rule on purpose. Crawl the site to",
    "benchmark your audit tool, or read the pages to learn how each",
    "failure looks in real HTML.",
    "",
    "Built by FastestRank (https://www.fastestrank.com).",
    "",
    "## How to use it",
    "",
    "1. Fetch the sitemap: https://brokenseo.dev/sitemap.xml",
    "2. Crawl each URL and run your checks.",
    "3. Compare your findings against the answer key on every page",
    '   (the panel labeled "The defect on this page").',
    "",
    "The sitemap deliberately includes URLs that return 404, 500, and",
    "403 — that is part of the test.",
    "",
    "## Test categories and endpoints",
    "",
  ];

  // Generate catalog from the fixture registry at build time.
  const categoryMap = new Map<string, { path: string; name: string }[]>();
  for (const fixture of catalogLinkedFixtures) {
    let entries = categoryMap.get(fixture.category);
    if (!entries) {
      entries = [];
      categoryMap.set(fixture.category, entries);
    }
    entries.push({ path: canonicalPath(fixture.path), name: fixture.name });
  }

  for (const [category, entries] of categoryMap) {
    lines.push(`### ${category}`, "");
    for (const entry of entries) {
      lines.push(`- ${entry.name}: https://brokenseo.dev${entry.path}`);
    }
    lines.push("");
  }

  lines.push(
    "## Links",
    "",
    "- Homepage: https://brokenseo.dev/",
    "- Sitemap: https://brokenseo.dev/sitemap.xml",
    "- Privacy: https://brokenseo.dev/privacy/",
    "- FastestRank: https://www.fastestrank.com",
    "",
  );

  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
