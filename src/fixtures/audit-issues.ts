export type IssueSeverity = "critical" | "warning" | "info";

export interface AuditIssueDescriptor {
  severity: IssueSeverity;
  title: string;
  explanation: string;
  howToFix: string;
}

export const AUDIT_ISSUE_TYPES = {
  "blocked-page": {
    severity: "critical",
    title: "Crawler was blocked",
    explanation:
      "The site returned a bot challenge or access denial (e.g. a Cloudflare challenge or a 403) instead of the page.",
    howToFix:
      'Allowlist the crawler user agent in your WAF or bot protection settings.',
  },
  "rate-limited-page": {
    severity: "warning",
    title: "Rate limited (429)",
    explanation:
      "The server answered 429 Too Many Requests, so this page could not be audited.",
    howToFix:
      "Raise the rate limit for crawlers or add an exception for the audit crawler.",
  },
  "crawl-rate-limited": {
    severity: "warning",
    title: "Crawl stopped early: rate limit",
    explanation:
      "The site asked the crawler to wait longer than allowed by rate limits.",
    howToFix:
      "Re-run after the rate limit resets or adjust crawler concurrency.",
  },
  "server-error": {
    severity: "critical",
    title: "Server error (5xx)",
    explanation:
      "The page returned a 5xx server error. Search engines that repeatedly see server errors will crawl less and may drop the page.",
    howToFix:
      "Check server logs and fix the uncaught exception, or return a proper 404/301.",
  },
  "broken-internal-link": {
    severity: "critical",
    title: "Broken internal link",
    explanation:
      "This page links to an internal URL that returns an error status (4xx/5xx).",
    howToFix:
      "Update the link to point to a live canonical URL, or remove it.",
  },
  "missing-title": {
    severity: "critical",
    title: "Missing title tag",
    explanation:
      "The page has no <title>. The title is the primary on-page relevance signal and the headline in search results.",
    howToFix:
      "Add a unique, descriptive <title> of roughly 50–60 characters.",
  },
  "broken-page": {
    severity: "warning",
    title: "Page returns an error (4xx)",
    explanation:
      "This crawled URL returned a client error (e.g. 404 Not Found).",
    howToFix:
      "Restore the missing resource, update inbound links, or 301 redirect to a relevant page.",
  },
  "duplicate-title": {
    severity: "warning",
    title: "Duplicate title",
    explanation:
      "Multiple pages share the exact same title tag, causing them to compete against each other in search results.",
    howToFix:
      "Write a distinct title tag for each page specifying unique attributes (model, category, location).",
  },
  "duplicate-meta-description": {
    severity: "warning",
    title: "Duplicate meta description",
    explanation:
      "Multiple pages share the same meta description snippet.",
    howToFix:
      "Provide a unique meta description per page, or allow the search engine to extract a contextual snippet.",
  },
  "duplicate-content": {
    severity: "warning",
    title: "Duplicate page content",
    explanation:
      "Two or more URLs serve identical or near-identical visible content without canonical consolidation.",
    howToFix:
      "Pick one canonical URL, add rel=canonical pointing to it, and 301-redirect duplicates where appropriate.",
  },
  "missing-meta-description": {
    severity: "warning",
    title: "Missing meta description",
    explanation:
      "The page has no meta description tag.",
    howToFix:
      "Add a meta description of 70–160 characters describing the page's core value proposition.",
  },
  "missing-h1": {
    severity: "warning",
    title: "Missing H1 heading",
    explanation:
      "The page lacks an <h1> tag, diluting topical clarity for search engines and assistive technology.",
    howToFix:
      "Add a single <h1> heading representing the page's primary topic.",
  },
  "multiple-h1": {
    severity: "warning",
    title: "Multiple H1 headings",
    explanation:
      "The page has more than one <h1>, which fragments the topical focus.",
    howToFix:
      "Retain one main <h1> and convert additional headlines to <h2> or <h3> tags.",
  },
  "redirect-chain": {
    severity: "warning",
    title: "Redirect chain",
    explanation:
      "Reaching the final destination requires two or more consecutive HTTP redirects.",
    howToFix:
      "Update internal links and the initial redirect rule to point straight to the final destination URL.",
  },
  "redirect-loop": {
    severity: "warning",
    title: "Redirect loop",
    explanation:
      "The redirect circular chain points back to an earlier URL, causing crawlers and browsers to fail.",
    howToFix:
      "Trace the redirect path and break the cycle so it resolves directly with HTTP 200.",
  },
  "canonical-conflict": {
    severity: "warning",
    title: "Conflicting canonical signals",
    explanation:
      "The HTML <link rel=canonical> and HTTP Link header specify contradictory URLs.",
    howToFix:
      "Declare the canonical URL once in HTML or headers, and align both to the exact same URL.",
  },
  "thin-content": {
    severity: "warning",
    title: "Thin content",
    explanation:
      "The page contains too few words of visible editorial content to establish topical relevance.",
    howToFix:
      "Expand the page with substantive content, or merge/canonicalize it to a stronger relevant page.",
  },
  "images-missing-alt": {
    severity: "warning",
    title: "Images missing alt text",
    explanation:
      "One or more <img> elements lack an alt attribute, hindering accessibility and image indexing.",
    howToFix:
      'Add descriptive alt text for informative images or alt="" for decorative elements.',
  },
  "orphan-page": {
    severity: "warning",
    title: "Orphan page",
    explanation:
      "The URL is found in the sitemap but receives zero internal links from anywhere else on the site.",
    howToFix:
      "Add contextual internal links from parent categories or navigation, or drop from sitemap if obsolete.",
  },
  "no-outgoing-links": {
    severity: "warning",
    title: "Page has no outgoing links",
    explanation:
      "The page contains zero hyperlinks, creating an SEO dead-end for crawl spiders and users.",
    howToFix:
      "Add navigation, breadcrumbs, related articles, or calls-to-action.",
  },
  "title-too-long": {
    severity: "info",
    title: "Title too long",
    explanation:
      "The title tag exceeds ~60 characters and will likely be truncated on SERPs.",
    howToFix:
      "Shorten the title to 50–60 characters, front-loading critical keywords.",
  },
  "title-too-short": {
    severity: "info",
    title: "Title too short",
    explanation:
      "The title is under ~10 characters, making it too vague to describe the page.",
    howToFix:
      "Expand the title to 30–60 characters with descriptive branding and topic context.",
  },
  "meta-description-too-long": {
    severity: "info",
    title: "Meta description too long",
    explanation:
      "The description exceeds ~160 characters and will be cut off by search engines.",
    howToFix:
      "Trim the description to 120–155 characters with a clear call-to-action.",
  },
  "meta-description-too-short": {
    severity: "info",
    title: "Meta description too short",
    explanation:
      "The description is under ~70 characters, wasting snippet real estate.",
    howToFix:
      "Expand the description to 120–155 characters explaining what visitors will find.",
  },
  "heading-order-skip": {
    severity: "info",
    title: "Heading levels skip",
    explanation:
      "The outline jumps heading levels (e.g. from H1 directly to H4 without H2 or H3).",
    howToFix:
      "Ensure heading levels descend in order without skipping tiers.",
  },
  "slow-response": {
    severity: "info",
    title: "Slow server response",
    explanation:
      "Server TTFB exceeds 1.5 seconds, delaying crawling and frustrating visitors.",
    howToFix:
      "Cache dynamic responses at the edge, optimize database queries, or pre-render static HTML.",
  },
  "noindex-page": {
    severity: "info",
    title: "Page is noindex",
    explanation:
      "The page deliberately instructs search engines not to index it via meta tag or X-Robots-Tag header.",
    howToFix:
      "Remove the noindex directive if the page is intended to rank in organic search results.",
  },
  "canonicalized-page": {
    severity: "info",
    title: "Canonicalized to another URL",
    explanation:
      "The page declares a different URL as its canonical version.",
    howToFix:
      "If this URL should rank independently, self-canonicalize it; otherwise ensure the target URL is correct.",
  },
  "deep-page": {
    severity: "info",
    title: "Page is deep in the site structure",
    explanation:
      "The page requires 5 or more clicks from the homepage to reach.",
    howToFix:
      "Add links from higher-level category hubs or navigation menus to flatten click depth.",
  },
} as const satisfies Record<string, AuditIssueDescriptor>;

export type AuditIssueType = keyof typeof AUDIT_ISSUE_TYPES;
