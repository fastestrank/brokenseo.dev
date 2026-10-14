# BrokenSEO.dev — The Intentionally Broken Technical SEO Sandbox

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Deploy Target: Cloudflare Workers](https://img.shields.io/badge/Deploy-Cloudflare%20Workers-orange?logo=cloudflare)](https://workers.cloudflare.com/)
[![Framework: TanStack Start](https://img.shields.io/badge/Framework-TanStack%20Start-cyan)](https://tanstack.com/start)
[![Live Sandbox: brokenseo.dev](https://img.shields.io/badge/Live%20Sandbox-brokenseo.dev-brightgreen)](https://brokenseo.dev)

> **Built and maintained by [FastestRank](https://www.fastestrank.com) to benchmark SEO crawlers, site auditors, and automated testing tools.**

---

## ⚡ Instant Live Sandbox (No Setup Required)

Before cloning or building locally, **you can benchmark your crawlers, scrapers, and audit bots directly against our hosted production benchmark:**

👉 **[https://brokenseo.dev](https://brokenseo.dev)**

- **XML Sitemap:** [`https://brokenseo.dev/sitemap.xml`](https://brokenseo.dev/sitemap.xml) (deliberately seeds healthy, broken, orphan, and error pages)
- **Robots.txt:** [`https://brokenseo.dev/robots.txt`](https://brokenseo.dev/robots.txt)
- **LLM Agent Manifest:** [`https://brokenseo.dev/llms.txt`](https://brokenseo.dev/llms.txt)

Every fixture page renders an **Answer Key Panel** at the top detailing the exact flaw injected, why it matters, and the expected findings an auditor must catch.

---

## 🎯 What is BrokenSEO.dev?

Most test sites are too clean. Real-world client websites are messy, contradictory, and full of subtle edge cases:
- Broken canonical loops that trap crawler frontier queues
- HTTP 429 rate-limiting responses with `Retry-After` headers
- Noindex directives hidden exclusively in HTTP headers (`X-Robots-Tag`) rather than HTML markup
- Trailing-slash 301 redirect traps that trigger infinite loop detection (508)
- Buried pages 6+ clicks deep with zero inbound links
- Contradictory canonical tags between `<head>` and HTTP headers

**BrokenSEO.dev** is a standardized, open-source benchmark suite designed to evaluate whether web crawlers, SEO audit tools, and LLM-driven research agents can accurately identify technical SEO defects without hallucinating false positives or skipping tricky edge cases.

---

## 📚 Complete Test Case Directory

Below is the definitive catalog of all test cases currently live on [brokenseo.dev](https://brokenseo.dev). Point your crawler at any path below to verify your detection rules.

### 1. Head Tags & Heading Hierarchy

| Test Case | Simulated Flaw | Expected Finding | Live Benchmark URL |
| :--- | :--- | :--- | :--- |
| **Missing `<title>` Tag** | Head contains zero `<title>` elements | `missing-title` (Critical) | [https://brokenseo.dev/head/missing-title/](https://brokenseo.dev/head/missing-title/) |
| **Title Too Long** | Title exceeds 60 characters (runs 123 chars); truncated on SERP snippets | `title-too-long` (Info) | [https://brokenseo.dev/head/title-too-long/](https://brokenseo.dev/head/title-too-long/) |
| **Title Too Short** | Vague 2-character title ("Hi") offering zero topical context | `title-too-short` (Info) | [https://brokenseo.dev/head/title-too-short/](https://brokenseo.dev/head/title-too-short/) |
| **Missing Meta Description** | No `<meta name="description">` element in document head | `missing-meta-description` (Warning) | [https://brokenseo.dev/head/missing-meta-description/](https://brokenseo.dev/head/missing-meta-description/) |
| **Meta Description Too Long** | Description runs 196 characters, exceeding the ~160 character snippet limit | `meta-description-too-long` (Info) | [https://brokenseo.dev/head/meta-description-too-long/](https://brokenseo.dev/head/meta-description-too-long/) |
| **Meta Description Too Short** | Description runs only 51 characters, leaving snippet real estate unused | `meta-description-too-short` (Info) | [https://brokenseo.dev/head/meta-description-too-short/](https://brokenseo.dev/head/meta-description-too-short/) |
| **Missing H1 Heading** | Content hierarchy begins with `<h2>`; zero `<h1>` tags exist | `missing-h1` (Warning) | [https://brokenseo.dev/head/missing-h1/](https://brokenseo.dev/head/missing-h1/) |
| **Empty H1 Tag** | Document markup contains `<h1></h1>` with no inner text | `missing-h1` (Warning) | [https://brokenseo.dev/head/empty-h1/](https://brokenseo.dev/head/empty-h1/) |
| **Multiple H1 Headings** | Three competing `<h1>` tags on a single page | `multiple-h1` (Warning) | [https://brokenseo.dev/head/multiple-h1/](https://brokenseo.dev/head/multiple-h1/) |
| **Heading Level Skip** | Outline jumps from `<h1>` directly to `<h4>`, skipping `<h2>` and `<h3>` | `heading-order-skip` (Info) | [https://brokenseo.dev/head/heading-order-skip/](https://brokenseo.dev/head/heading-order-skip/) |

---

### 2. Content Quality & Duplication

| Test Case | Simulated Flaw | Expected Finding | Live Benchmark URL |
| :--- | :--- | :--- | :--- |
| **Thin Content** | Editorial text falls below 150 words threshold | `thin-content` (Warning) | [https://brokenseo.dev/content/thin-content/](https://brokenseo.dev/content/thin-content/) |
| **Images Missing Alt** | Meaningful `<img>` tag rendered without an `alt` attribute | `images-missing-alt` (Warning) | [https://brokenseo.dev/content/images-missing-alt/](https://brokenseo.dev/content/images-missing-alt/) |
| **Duplicate Content (Page A)** | Identical body copy, title, and meta description to Page B | `duplicate-content`, `duplicate-title`, `duplicate-meta-description` | [https://brokenseo.dev/content/duplicate-a/](https://brokenseo.dev/content/duplicate-a/) |
| **Duplicate Content (Page B)** | Byte-identical twin to Page A served on a distinct URL | `duplicate-content`, `duplicate-title`, `duplicate-meta-description` | [https://brokenseo.dev/content/duplicate-b/](https://brokenseo.dev/content/duplicate-b/) |
| **Duplicate Title (Product A)** | Distinct shoe product sharing title with Product B | `duplicate-title` (Warning) | [https://brokenseo.dev/content/duplicate-title-a/](https://brokenseo.dev/content/duplicate-title-a/) |
| **Duplicate Title (Product B)** | Distinct shoe product sharing title with Product A | `duplicate-title` (Warning) | [https://brokenseo.dev/content/duplicate-title-b/](https://brokenseo.dev/content/duplicate-title-b/) |
| **Duplicate Meta (Bakery)** | Distinct bakery page sharing identical meta description with Florist | `duplicate-meta-description` (Warning) | [https://brokenseo.dev/content/duplicate-meta-a/](https://brokenseo.dev/content/duplicate-meta-a/) |
| **Duplicate Meta (Florist)** | Distinct florist page sharing identical meta description with Bakery | `duplicate-meta-description` (Warning) | [https://brokenseo.dev/content/duplicate-meta-b/](https://brokenseo.dev/content/duplicate-meta-b/) |

---

### 3. Indexability & Canonical Signals

| Test Case | Simulated Flaw | Expected Finding | Live Benchmark URL |
| :--- | :--- | :--- | :--- |
| **Noindex (Robots Meta)** | HTML head contains `<meta name="robots" content="noindex, follow">` | `noindex-page` (Info) | [https://brokenseo.dev/index/noindex-meta/](https://brokenseo.dev/index/noindex-meta/) |
| **Noindex (X-Robots-Tag Header)** | HTML is clean, but HTTP response sends `X-Robots-Tag: noindex` | `noindex-page` (Info) | [https://brokenseo.dev/index/noindex-header/](https://brokenseo.dev/index/noindex-header/) |
| **Canonicalized to Another URL** | `<link rel="canonical">` points away from self to the homepage `/` | `canonicalized-page` (Info) | [https://brokenseo.dev/index/canonicalized/](https://brokenseo.dev/index/canonicalized/) |
| **Conflicting Canonical Signals** | HTML head canonical contradicts HTTP `Link: <...>; rel="canonical"` | `canonical-conflict`, `canonicalized-page` | [https://brokenseo.dev/index/canonical-conflict/](https://brokenseo.dev/index/canonical-conflict/) |

---

### 4. HTTP Status Codes & Link Integrity

| Test Case | Simulated Flaw | Expected Finding | Live Benchmark URL |
| :--- | :--- | :--- | :--- |
| **404 Not Found in Sitemap** | Dead URL listed in `sitemap.xml` returning HTTP 404 | `broken-page` (Warning) | [https://brokenseo.dev/status/not-found/](https://brokenseo.dev/status/not-found/) |
| **Server Error (500)** | URL consistently returns HTTP 500 Internal Server Error | `server-error` (Critical) | [https://brokenseo.dev/status/server-error/](https://brokenseo.dev/status/server-error/) |
| **Crawler Blocked (403)** | Bot protection or WAF refusal returning HTTP 403 Forbidden | `blocked-page` (Critical) | [https://brokenseo.dev/status/blocked/](https://brokenseo.dev/status/blocked/) |
| **Rate Limited then Recovered (429)** | Answers first 2 requests with 429 + `Retry-After: 1`, then serves 200 | Clean crawl on retry (Zero issues) | [https://brokenseo.dev/status/rate-limited/](https://brokenseo.dev/status/rate-limited/) |
| **Persistent Rate Limit (429)** | Refuses all crawler requests with 429 and no `Retry-After` header | `rate-limited-page` (Warning) | [https://brokenseo.dev/status/rate-limited-always/](https://brokenseo.dev/status/rate-limited-always/) |
| **Broken Internal Link** | Healthy 200 page containing an `<a href>` linking to the 404 page | `broken-internal-link` (Critical) | [https://brokenseo.dev/links/broken-internal-link/](https://brokenseo.dev/links/broken-internal-link/) |

---

### 5. Redirects & Canonical Traps

| Test Case | Simulated Flaw | Expected Finding | Live Benchmark URL |
| :--- | :--- | :--- | :--- |
| **3-Hop Redirect Chain** | `/redirect/chain-1/` → `/redirect/chain-2/` → `/` (homepage) | `redirect-chain` (Warning) | [https://brokenseo.dev/redirect/chain-1/](https://brokenseo.dev/redirect/chain-1/) |
| **Redirect Chain Middle Hop** | Intermediate waypoint forwarding to `/` | Support waypoint | [https://brokenseo.dev/redirect/chain-2/](https://brokenseo.dev/redirect/chain-2/) |
| **Circular Redirect Loop** | `/redirect/loop/` answers 302 redirecting back to `/redirect/loop/` | `redirect-loop` (Warning) | [https://brokenseo.dev/redirect/loop/](https://brokenseo.dev/redirect/loop/) |
| **Trailing-Slash Canonical Trap** | `/foo/` is 200; bare `/foo` 301-redirects to `/foo/`. Traps slash-stripping crawlers into 508 loop errors | Must crawl once as 200 (Zero issues) | [https://brokenseo.dev/redirect/trailing-slash/](https://brokenseo.dev/redirect/trailing-slash/) |

---

### 6. Page Performance & TTFB

| Test Case | Simulated Flaw | Expected Finding | Live Benchmark URL |
| :--- | :--- | :--- | :--- |
| **Slow Server Response** | Artificial 1.7s delay before response headers and first byte arrive | `slow-response` (Info) | [https://brokenseo.dev/perf/slow-response/](https://brokenseo.dev/perf/slow-response/) |

---

### 7. Site Architecture & Click Depth

| Test Case | Simulated Flaw | Expected Finding | Live Benchmark URL |
| :--- | :--- | :--- | :--- |
| **Orphan Page** | Present in `sitemap.xml`, but has zero inbound internal links | `orphan-page` (Warning) | [https://brokenseo.dev/structure/orphan/](https://brokenseo.dev/structure/orphan/) |
| **No Outgoing Links** | Content dead-end containing zero outbound `<a>` links | `no-outgoing-links` (Warning) | [https://brokenseo.dev/structure/no-outgoing-links/](https://brokenseo.dev/structure/no-outgoing-links/) |
| **Deep Click-Path (Level 1)** | Depth waypoint 1 in a single-link chain | Support waypoint | [https://brokenseo.dev/structure/deep/1/](https://brokenseo.dev/structure/deep/1/) |
| **Deep Click-Path (Level 2)** | Depth waypoint 2 in a single-link chain | Support waypoint | [https://brokenseo.dev/structure/deep/2/](https://brokenseo.dev/structure/deep/2/) |
| **Deep Click-Path (Level 3)** | Depth waypoint 3 in a single-link chain | Support waypoint | [https://brokenseo.dev/structure/deep/3/](https://brokenseo.dev/structure/deep/3/) |
| **Deep Click-Path (Level 4)** | Depth waypoint 4 in a single-link chain | Support waypoint | [https://brokenseo.dev/structure/deep/4/](https://brokenseo.dev/structure/deep/4/) |
| **Deep Page (6 Clicks Down)** | Buried destination URL 6 clicks away from the homepage | `deep-page` (Info) | [https://brokenseo.dev/structure/deep/treasure/](https://brokenseo.dev/structure/deep/treasure/) |

---

### 8. Compound Multi-Flaw Chaos

| Test Case | Simulated Flaws | Expected Findings | Live Benchmark URL |
| :--- | :--- | :--- | :--- |
| **Kitchen Sink** | 6 defects simultaneously: 140-char title, no meta description, 2 H1 tags, outline skips H1→H4, missing image alt, and 1.7s server delay | `title-too-long`, `missing-meta-description`, `multiple-h1`, `heading-order-skip`, `images-missing-alt`, `slow-response` | [https://brokenseo.dev/kitchen-sink/](https://brokenseo.dev/kitchen-sink/) |

---

## 🛠️ Local Development & Self-Hosting

BrokenSEO is built with [TanStack Start](https://tanstack.com/start) and designed to run on Cloudflare Workers (or local Node/Vite environments).

### 1. Prerequisites
- Node.js >= 20.0.0
- `pnpm` (recommended) or `npm`

### 2. Installation & Quickstart

```bash
# Clone the repository
git clone https://github.com/fastestrank/brokenseo.dev.git
cd brokenseo.dev

# Install dependencies
pnpm install

# Start local development server (serves on http://127.0.0.1:8787)
pnpm dev
```

### 3. Type Checking & Production Build

```bash
# Verify TypeScript types
pnpm typecheck

# Build TanStack Start client bundle & Cloudflare Worker server bundle
pnpm build

# Emulate production Cloudflare Worker locally via Wrangler
pnpm serve
```

### 4. Deploying to Cloudflare Workers

The project includes pre-configured `wrangler.jsonc` bindings:

```bash
pnpm deploy
```

---

## 🔍 How FastestRank Uses This

At [FastestRank](https://www.fastestrank.com), we build real-time rank tracking and site diagnostic engines for developers and technical SEO professionals.

We built **BrokenSEO.dev** to serve as our own automated ground-truth test suite:
- Every page fixture defines exact deterministic assertions for our audit crawler.
- Whenever we upgrade our crawler frontier, headless rendering pipeline, or HTML analysis algorithms, our test suite crawls `brokenseo.dev` to verify zero regressions.
- If a crawler flags a false positive on our clean homepage or misses the header-only `X-Robots-Tag` on `/index/noindex-header/`, the build breaks.

### Benchmark Your Own Production Sites
Curious how your real-world web applications stack up against these checks?
Run a free instant audit of your site with the production-grade diagnostic engine at **[FastestRank.com](https://www.fastestrank.com)**.

---

## 🤝 Contributing New Fixtures

Have an esoteric SEO defect that broke your production rankings? We welcome pull requests!

Each fixture is an isolated object defined in `src/fixtures/`:

```typescript
import type { Fixture } from "./types";
import { htmlResponse, renderPage } from "../lib";

export const myNewFixture: Fixture = {
  path: "/head/my-new-defect",
  category: "Head tags & headings",
  name: "My custom defect description",
  summary: "One-line summary rendered in the on-page answer key panel.",
  lesson: "Why this bug matters and how engineering teams fix it.",
  expectedIssues: ["missing-title"], // The issue ID(s) this page must trigger
  handler: () =>
    htmlResponse(
      renderPage({
        fixture: myNewFixture,
        title: "Page Title",
        bodyHtml: "<h1>Page Content</h1>",
      }),
    ),
};
```

### Guidelines for New Contributions:
1. **Isolate One Defect Per Page:** Unless submitting to the "Kitchen Sink" category, keep each page 100% healthy except for the single injected flaw.
2. **Canonical Trailing Slash:** Define `path` without a trailing slash; the rendering runtime automatically enforces canonical trailing slashes across the site.
3. **No Unintentional Duplicates:** Ensure titles and meta descriptions remain unique across the entire fixture registry.

---

## 📄 License

Licensed under the [MIT License](LICENSE).
Copyright (c) 2026 [FastestRank](https://www.fastestrank.com).
