import type { Fixture } from "./types";
import { htmlResponse, renderPage } from "../lib";
import { article } from "./helpers";

const CAT = "HTTP status & links";

/** 429s answered before a request is let through; the served request resets it. */
const RATE_LIMIT_REFUSALS = 2;
let refusals = 0;

function stillRateLimited(): boolean {
  refusals += 1;
  if (refusals <= RATE_LIMIT_REFUSALS) return true;
  refusals = 0;
  return false;
}

// Fixture 18: a URL that answers 404, found through the sitemap
const notFound: Fixture = {
  path: "/status/not-found",
  category: CAT,
  name: "Page returns 404",
  summary: "The sitemap lists it, and it answers 404 Not Found.",
  lesson:
    "Every crawl spends budget re-fetching a dead URL listed in your sitemap. Drop the entry, bring the page back, or redirect the URL to one that exists.",
  expectedIssues: ["broken-page"],
  // The sitemap lists it, so a crawler finds a dead URL. Kept off the catalog
  // so the catalog itself does not earn a broken-internal-link.
  linkedFromCatalog: false,
  inSitemap: true,
  handler: () =>
    htmlResponse(
      renderPage({
        fixture: notFound,
        title: "404, nothing lives at this URL",
        metaDescription:
          "A sitemap entry that answers 404 Not Found to every crawl.",
        bodyHtml: article({
          h1: "The sitemap lists it, the server says 404",
          lede: "Your sitemap promises this page exists. The server keeps answering 404.",
          sections: [
            {
              h2: "Why this pair hurts",
              body: "Your sitemap hands search engines a list of pages to fetch. When an address on that list answers 404, the crawler burns a request on nothing while the sitemap keeps vouching for a page that is not there. Multiply that by a few thousand dead URLs and crawl budget goes out the window.",
            },
            {
              h2: "How to clean it up",
              body: "Put the page back if it is supposed to exist. If it is gone for good, cut it from the sitemap and delete any internal links that point at it. If a new page took its place, 301 the old URL to that page. Leaving the dead address in the sitemap is the one move that guarantees crawlers will knock on it again and again.",
            },
          ],
        }),
      }),
      { status: 404 },
    ),
};

// Fixture 19: a URL that answers 500
const serverError: Fixture = {
  path: "/status/server-error",
  category: CAT,
  name: "Server error (500)",
  summary:
    "This URL never returns a page. It returns a 500 Internal Server Error.",
  lesson:
    "Search engines throttle their crawl when they keep hitting 5xx errors, and pages can drop out of the index. A missing page deserves a 404, not a 500.",
  expectedIssues: ["server-error"],
  linkedFromCatalog: false,
  inSitemap: true,
  handler: () =>
    htmlResponse(
      renderPage({
        fixture: serverError,
        title: "500, on every request",
        metaDescription: "Every crawler that asks this URL gets a 500.",
        bodyHtml: article({
          h1: "This URL answers 500 every time",
          lede: "You will not get a 404 here. Each request gets a 500 instead.",
          sections: [
            {
              h2: "A 500 hurts more than a 404",
              body: "A 404 is a fact: nothing lives at this address. A 500 is a confession: the server tried to answer and failed. Search engines read a streak of 5xx responses as a sick site and cut back how often they visit. Leave it long enough and pages slip out of the index.",
            },
            {
              h2: "Which code belongs where",
              body: "When content is gone, say so with a 404 or a 410 and let the search engine update its records. Save the 500 for genuine, unexpected failures, and when one happens, read the logs and fix the cause. A route that returns 500 on every call is not functioning as an error page. It is a bug.",
            },
          ],
        }),
      }),
      { status: 500 },
    ),
};

// Fixture 20: bot challenge / access denied (403)
const blocked: Fixture = {
  path: "/status/blocked",
  category: CAT,
  name: "Crawler blocked (403)",
  summary:
    'Answers 403 Forbidden. An honest audit simply says "we could not read this."',
  lesson:
    "Blocked is not broken: when a 403 or a bot challenge stops the crawler, an honest audit reports the block instead of calling the page broken. Search engines themselves can run into the same wall.",
  expectedIssues: ["blocked-page"],
  linkedFromCatalog: false,
  inSitemap: true,
  handler: () =>
    htmlResponse(
      renderPage({
        fixture: blocked,
        title: "403, the crawler never got in",
        metaDescription: "Crawlers get 403 Forbidden here.",
        bodyHtml: article({
          h1: "Blocked at the door",
          lede: "Strong bot protection does not tell the good crawlers from the bad ones.",
          sections: [
            {
              h2: "A block is not a broken page",
              body: "When a page meets a crawler with a 403 or a challenge screen, the page itself may be perfectly fine. All the response proves is that the crawler did not get through. An audit should report exactly that and stop there. Call it a content problem and you send the owner hunting a bug that does not exist. The issue is access.",
            },
            {
              h2: "How protection backfires on you",
              body: "Strict WAF rules and aggressive anti-bot modes do not care who the crawler is; real search bots get swept up with the scrapers. If search engines or your own audit tool keep bouncing off a 403, allowlist their user agents and let them read the site. Content behind that wall cannot rank, no matter how good it is, because nobody can crawl it.",
            },
          ],
        }),
      }),
      { status: 403 },
    ),
};

// Fixture 21: a healthy page that links to the 404 above
const brokenInternalLink: Fixture = {
  path: "/links/broken-internal-link",
  category: CAT,
  name: "Broken internal link",
  summary: "One link here points at /status/not-found, a URL that 404s.",
  lesson:
    "A link to one of your own dead URLs wastes a crawl request, sends visitors to a dead end, and throws away link strength. Repoint it or delete it.",
  expectedIssues: ["broken-internal-link"],
  handler: () =>
    htmlResponse(
      renderPage({
        fixture: brokenInternalLink,
        title: "This page links to a dead URL",
        metaDescription:
          "An otherwise healthy page whose internal link points at a URL that returns a 404.",
        bodyHtml: `<h1>One link here leads to a 404</h1>
<p class="lede">Everything on this page works except a single link, which points at a page that no longer exists.</p>
<p>Few technical SEO problems show up as often as broken internal links, and almost none are easier to prevent. A visitor clicks, lands on a 404, and gives up. A crawler follows the same link, spends a request, and gains nothing. The link strength that should have reached a real page gets stuck at a dead end. Rot on someone else's site is their business. This one is yours.</p>
<p>Below is a link aimed at a dead URL on this same site. Click <a href="/status/not-found/">read our full guide</a> and you land on a Not Found page. The audit crawler follows the same href, sees the 404, and reports precisely that.</p>
<h2>How to keep up with them</h2>
<p>Crawl your own site on a schedule and check what status code sits behind every internal link. When a target starts answering 4xx or 5xx, either repoint the link at the right URL or delete it. Do not let a redirect carry the load forever either. Link directly to the page that works.</p>`,
      }),
    ),
};

// Fixture 20b: rate limited for the first requests, then served (429 -> 200)
const rateLimitedThenOk: Fixture = {
  path: "/status/rate-limited",
  category: CAT,
  name: "Rate limited, then served (429)",
  summary: `Refuses the first ${RATE_LIMIT_REFUSALS} requests with 429 and a Retry-After, then serves the page.`,
  lesson:
    "A 429 is about speed, not a grudge. A crawler that backs off and comes back gets the page; one that gives up records a defect that never existed.",
  // Nothing to report: the audit backs off, retries, and reads the page.
  expectedIssues: [],
  handler: () => {
    const html = renderPage({
      fixture: rateLimitedThenOk,
      title: "Refused at first, served a moment later",
      metaDescription:
        "The first couple of requests get a 429 with a Retry-After header. After that, the page is served normally.",
      bodyHtml: article({
        h1: "429 now, the page later",
        lede: "Early visits to this URL get turned away with 429 Too Many Requests. Return shortly and it answers like any other page.",
        sections: [
          {
            h2: "A speed limit, not a locked door",
            body: "Too Many Requests is the server asking a client to calm down. It is not a denial of access and it does not mean the page is broken. A lot of sites rate limit everything by default, so a crawler that opens twenty parallel requests trips the limit instantly, on pages that are perfectly healthy and open to the public.",
          },
          {
            h2: "How a good crawler behaves",
            body: "It waits. A Retry-After header sets the pause; without one, the delay before asking again keeps growing, and a careful crawler slows its whole pass through the site instead of hammering the next URL while it retries this one. Search engines do the same. A site that keeps answering 429 earns fewer crawls, and its new pages wait longer to get indexed.",
          },
          {
            h2: 'Why "blocked" is the wrong label',
            body: "Log a rate-limited URL as blocked and the owner goes changing their bot protection, which was never the problem. The page is public. Only the crawl rate was wrong. A fair report is either the page itself, after a retry, or a note that the limit held even once the crawler had slowed.",
          },
        ],
      }),
    });
    return stillRateLimited()
      ? htmlResponse(html, { status: 429, headers: { "retry-after": "1" } })
      : htmlResponse(html);
  },
};

// Fixture 20c: rate limited on every request, no Retry-After
const rateLimitedAlways: Fixture = {
  path: "/status/rate-limited-always",
  category: CAT,
  name: "Rate limited on every request (429)",
  summary: "Refuses every request with 429 and sends no Retry-After.",
  lesson:
    "When a URL still says 429 after the crawler backed off and tried again, there is no way to audit that page. It is rate limited though, not blocked, so the fix lives in the rate limit, not the bot rules.",
  expectedIssues: ["rate-limited-page"],
  linkedFromCatalog: false,
  inSitemap: true,
  handler: () =>
    htmlResponse(
      renderPage({
        fixture: rateLimitedAlways,
        title: "429, forever",
        metaDescription:
          "429 Too Many Requests on every visit. The crawler's patience changes nothing.",
        bodyHtml: article({
          h1: "No waiting gets you through",
          lede: "This URL answers 429 no matter how politely you back off.",
          sections: [
            {
              h2: "A crawler cannot wait forever",
              body: "Slowing down and retrying is the right first move against a 429, but no crawler can wait indefinitely. Do the math on a thousand-page audit that pauses a minute after each refusal; it never finishes. So after a few spaced-out attempts, log what happened and carry on with the rest of the site.",
            },
            {
              h2: "Rate limited and blocked need different fixes",
              body: "Treat the two as the same and you will apply the wrong cure. Behind a block, bot protection decided this crawler is not welcome; the answer is an allowlist entry. Behind a rate limit, the server caps how many requests it will take; the answer is a bigger limit, an exception for known crawlers, or a smaller crawl. Mislabel one as the other and the owner opens the wrong settings screen.",
            },
            {
              h2: "Googlebot notices as well",
              body: "Googlebot reads a run of 429s as its cue to back off. A limit tight enough to shut out an audit crawler is tight enough to delay the discovery and indexing of fresh pages. That makes the limit itself worth fixing, not routing around.",
            },
          ],
        }),
      }),
      { status: 429 },
    ),
};

export const httpStatusFixtures: Fixture[] = [
  notFound,
  serverError,
  blocked,
  rateLimitedThenOk,
  rateLimitedAlways,
  brokenInternalLink,
];
