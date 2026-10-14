import type { Fixture } from "./types";
import { htmlResponse, renderPage, renderDocument, escapeHtml } from "../lib";
import { article } from "./helpers";

const CAT = "Site structure";

// 25 - orphan page: in the sitemap, but nothing links to it -----------------
const orphan: Fixture = {
  path: "/structure/orphan",
  category: CAT,
  name: "Orphan page",
  summary:
    "Nothing on the site links to this page. The sitemap entry is the only way in.",
  lesson:
    "No internal links means little crawling, no passed link strength, and no way for visitors to wander in by accident. Get the page linked from somewhere relevant.",
  expectedIssues: ["orphan-page"],
  // The point of the page: it is in the sitemap, but nothing links to it.
  linkedFromCatalog: false,
  inSitemap: true,
  handler: () =>
    htmlResponse(
      renderPage({
        fixture: orphan,
        title: "Nobody links to this page",
        metaDescription:
          "No other page on this site links here. Crawlers only find it because the sitemap lists it.",
        bodyHtml: article({
          h1: "Nothing on this site links here",
          lede: "The page itself is perfectly healthy. As far as the site is concerned, though, it does not exist: no link anywhere points its way.",
          sections: [
            {
              h2: "Why discovery depends on links",
              body: "An orphan has zero internal links aimed at it. Someone who knows the exact URL can still open it, and the sitemap may list it, but clicking around the site will never arrive there. Internal links do two jobs for a search engine: they reveal which pages exist, and they carry ranking strength between them. An orphan misses both jobs at once. It gets crawled seldom, and however good the page is, it ranks poorly.",
            },
            {
              h2: "How orphans are made",
              body: "Nobody plans an orphan. Someone pulls a page out of a menu and leaves the URL live. A campaign ends, and its landing page loses every link that pointed to it. A bulk import drops in pages that no navigation ever mentions. The repair is small: point one relevant link at the page, from a hub, a related article, or the main menu, and crawlers and visitors can find it again.",
            },
          ],
        }),
      }),
    ),
};

// 26 - no outgoing links ----------------------------------------------------
const noOutgoingLinks: Fixture = {
  path: "/structure/no-outgoing-links",
  category: CAT,
  name: "No outgoing links",
  summary:
    "A healthy page in every respect but one: not a single anchor tag appears in it.",
  lesson:
    "With no outgoing links, a page becomes a dead end for crawlers and people alike. Point onward at related content, a parent category, or the homepage.",
  expectedIssues: ["no-outgoing-links"],
  handler: () =>
    htmlResponse(
      renderDocument({
        title: "A page that links to nothing",
        metaDescription:
          "A healthy page built with no anchor tags on purpose. Crawlers and visitors both reach a dead end here.",
        canonical: "https://brokenseo.dev/structure/no-outgoing-links/",
        bodyHtml: `<main class="main">
${article({
  h1: "A healthy page with nowhere to go",
  lede: "Every part of this page is healthy except one thing: it is built with zero links leaving it, on purpose.",
  sections: [
    {
      h2: "What a dead end costs",
      body: "A crawler gets around a site only by following links. A page that links to nothing traps whatever link strength reaches it: the value arrives, and there it stops. The crawler standing on this page has no next URL to discover either, so the trail goes cold right here. Visitors meet the same wall. They finish reading, and nothing useful remains except the browser back button.",
    },
    {
      h2: "Where a healthy page points",
      body: "After the main content, most pages should offer a sensible next stop: a related article, the category above it, the homepage, or whatever step comes next in a flow. Which destination fits depends on the page; the pattern does not. A useful page lets visitors keep going, and it shows crawlers where this URL belongs in the rest of the site, instead of sitting alone as an isolated endpoint.",
    },
  ],
})}
</main>`,
      }),
    ),
};

// 27 - deep pages: a click-chain 5+ levels from the homepage ----------------
// catalog(1) -> deep/1(2) -> deep/2(3) -> deep/3(4) -> deep/4(5) -> treasure(6).
// Only deep/1 is linked from the catalog; each level links onward in its body,
// so the chain is the ONLY way down. Pages at depth >= 5 trip deep-page.
function deepWaypoint(level: number, next: string): Fixture {
  const fx: Fixture = {
    path: `/structure/deep/${level}`,
    category: CAT,
    name: `Deep click-path, level ${level}`,
    summary: `Waypoint ${level} in a click-chain that pushes one page many clicks below the homepage.`,
    lesson:
      "The more clicks a page sits below the homepage, the less crawler attention and link strength it receives. Add links from pages nearer the top and the path flattens.",
    expectedIssues: [],
    support: true,
    linkedFromCatalog: level === 1, // only the entrance is on the catalog
    inSitemap: false,
    handler: () =>
      htmlResponse(
        renderPage({
          fixture: fx,
          title: `Deep click-path, level ${level}`,
          metaDescription: `A click-path this deep is built on purpose, and level ${level} offers exactly one way on: the link at the bottom.`,
          bodyHtml: `${article({
            h1: `You have sunk ${level} click${level === 1 ? "" : "s"} into the chain`,
            lede: `The buried page sits deeper than it should, still one link away. Keep going.`,
            sections: [
              {
                h2: "What depth signals",
                body: "Crawl budget skews toward pages near the homepage; pages buried under many clicks get far less of it. Depth doubles as a rough signal of importance. Work six clicks down to reach a page and the site's own shape has told search engines that page hardly matters. Nothing you actually care about belongs that far down.",
              },
              {
                h2: "One link, no shortcuts",
                body: "This page has one job: add a single level of depth to the chain. Exactly one link leads onward, down below, and nothing closer to the homepage offers a shortcut. This is how a real site ends up with a worthwhile page buried at the end of one narrow trail of links.",
              },
            ],
          })}
<p class="next"><a href="${escapeHtml(next)}">Continue one level deeper</a></p>`,
        }),
      ),
  };
  return fx;
}

const treasure: Fixture = {
  path: "/structure/deep/treasure",
  category: CAT,
  name: "Deep page (6 clicks down)",
  summary: "The end of the click-chain, six clicks away from the homepage.",
  lesson:
    "A page this deep is visited seldom and inherits next to no link strength. If it matters, it needs a link from somewhere much nearer the surface.",
  expectedIssues: ["deep-page"],
  linkedFromCatalog: false,
  inSitemap: false,
  handler: () =>
    htmlResponse(
      renderPage({
        fixture: treasure,
        title: "The page at the bottom of the chain",
        metaDescription:
          "Six clicks separate this page from the homepage. That is why search engines reach it so seldom.",
        bodyHtml: article({
          h1: "Six clicks down, at the bottom of the chain",
          lede: "You needed six clicks to get here. A crawler would most likely have given up sooner.",
          sections: [
            {
              h2: "Ranking from the bottom",
              body: "Count the clicks from the homepage to here: five or more. At that depth, crawlers come by rarely and route very little internal strength this way. Put something you care about at this depth, say a product page, a landing page, or a key article, and the depth by itself caps how well it can perform.",
            },
            {
              h2: "Shortcuts, not deletions",
              body: "You do not fix this by deleting the steps in between. You fix it by adding shortcuts. Point hubs, category pages, or the main menu straight at the deep pages that matter, and they land two or three clicks from home rather than six. A flatter structure reads as importance to search engines, and the page gets a genuine chance to rank.",
            },
          ],
        }),
      }),
    ),
};

const deep1 = deepWaypoint(1, "/structure/deep/2");
const deep2 = deepWaypoint(2, "/structure/deep/3");
const deep3 = deepWaypoint(3, "/structure/deep/4");
const deep4 = deepWaypoint(4, "/structure/deep/treasure");

export const structureFixtures: Fixture[] = [
  orphan,
  noOutgoingLinks,
  deep1,
  deep2,
  deep3,
  deep4,
  treasure,
];
