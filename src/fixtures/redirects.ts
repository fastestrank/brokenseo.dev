import type { Fixture } from "./types";
import { redirect, htmlResponse, renderPage } from "../lib";
import { article } from "./helpers";

const CAT = "Redirects";

/**
 * Canonical path for the trailing-slash fixture. The SLASH form is the
 * canonical 200; the non-slash form 301-redirects to it, like every other page
 * on the site (see `canonicalPath` in ../lib). Exported so the fixture and the
 * e2e harness agree on the path.
 */
export const TRAILING_SLASH_CANONICAL = "/redirect/trailing-slash";

// Fixture 22: redirect chain, /chain-1 -> /chain-2 -> / (homepage)
// Two hops before content is a chain. The crawler records each hop as its own
// row and flags the head of the chain.
const redirectChain: Fixture = {
  path: "/redirect/chain-1",
  category: CAT,
  name: "Redirect chain (3 hops)",
  summary:
    "From /redirect/chain-1 to chain-2, and from there to the homepage. Content sits two hops away.",
  lesson:
    "Every extra hop adds delay, burns one crawl request, and sheds a little link strength. Point the first URL at the final destination.",
  expectedIssues: ["redirect-chain"],
  inSitemap: false,
  handler: () => redirect("/redirect/chain-2/", 301),
};

// Support: the middle hop. Not featured anywhere; found via chain-1.
const redirectChainMid: Fixture = {
  path: "/redirect/chain-2",
  category: CAT,
  name: "Redirect chain (middle hop)",
  summary: "Hop two of the redirect chain. It points on to the homepage.",
  lesson: "",
  expectedIssues: [],
  support: true,
  linkedFromCatalog: false,
  inSitemap: false,
  handler: () => redirect("/", 301),
};

// Fixture 23: redirect loop, a URL that forwards to itself
const redirectLoop: Fixture = {
  path: "/redirect/loop",
  category: CAT,
  name: "Redirect loop",
  summary:
    "/redirect/loop sends the browser straight back to /redirect/loop. No page ever loads.",
  lesson:
    "Point a redirect back at its own URL and it can never land on a real page. Browsers and crawlers both bail out with an error.",
  expectedIssues: ["redirect-loop"],
  inSitemap: false,
  // Location resolves to this same URL, a self-redirect the crawler can never
  // satisfy, which is a redirect loop.
  handler: () => redirect("/redirect/loop/", 302),
};

// Fixture 24: trailing-slash canonical (redirect-cycle trap)
// The canonical URL ends in a slash (/redirect/trailing-slash/ = 200); the
// non-slash form 301-redirects to it, exactly like WordPress and most CMSes.
// A crawler that normalizes away trailing slashes turns /redirect/trailing-slash/
// back into /redirect/trailing-slash, follows the 301 to the slash form, strips
// it again, and loops. This is the 508 "Loop Detected" class of bug from
// https://github.com/fastestrank/fastestrank/pull/61. The audit must crawl the
// canonical page once as a 200 and NOT report a redirect loop, so this fixture
// expects zero issues. If it ever comes back with redirect-loop (or an error),
// the trailing-slash handling has regressed.
const trailingSlashCanonical: Fixture = {
  path: TRAILING_SLASH_CANONICAL,
  category: CAT,
  name: "Trailing-slash canonical (redirect-cycle trap)",
  summary:
    "WordPress style: the canonical URL here carries the trailing slash, and the non-slash form 301s onto it. This page is correct as served; it only snags crawlers that strip trailing slashes.",
  lesson:
    "Rewrite /foo/ as /foo and a crawler follows the 301 back to /foo/, strips the slash once more, and never stops (508 Loop Detected). The audit has to fetch the canonical page once, see a 200, and raise no redirect-loop finding.",
  expectedIssues: [],
  handler: () =>
    htmlResponse(
      renderPage({
        fixture: trailingSlashCanonical,
        title: "The canonical version of this page ends in a slash",
        metaDescription:
          "This page's canonical URL carries the trailing slash, and the non-slash form redirects to it. Slash-stripping crawlers get tangled on exactly this pattern.",
        bodyHtml: article({
          h1: "The trailing-slash form is canonical",
          lede: "A 301 from the non-slash URL put you here. That is normal. The test is whether a crawler takes it without looping.",
          sections: [
            {
              h2: "Why the slash is there",
              body: "Most content management systems, WordPress included, pick the trailing-slash form as canonical, then 301 the non-slash form onto it. So /services and /services/ are one page plus one permanent redirect, not two pages. The behavior is correct, and every crawler has to cope with it.",
            },
            {
              h2: "How crawlers trip",
              body: "Now suppose a crawler strips trailing slashes to deduplicate URLs. It rewrites the canonical /services/ as /services, fetches that, and gets a 301 back to /services/. Strip the slash again, queue /services again, repeat. A loop detector finally gives up with a 508. Two habits avoid the trap. Leave trailing slashes alone when normalizing URLs, or, when the 301 leads to the slash form, record that URL as already seen. Either way the page is fetched once and never queued again.",
            },
          ],
        }),
      }),
    ),
};

export const redirectFixtures: Fixture[] = [
  redirectChain,
  redirectChainMid,
  redirectLoop,
  trailingSlashCanonical,
];
