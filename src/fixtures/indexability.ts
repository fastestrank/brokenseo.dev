import type { Fixture } from "./types";
import { htmlResponse, renderPage } from "../lib";
import { article } from "./helpers";

const CAT = "Indexability & canonical";

// 14 - noindex via robots meta tag ------------------------------------------
const noindexMeta: Fixture = {
  path: "/index/noindex-meta",
  category: CAT,
  name: "Noindex (robots meta)",
  summary:
    'A robots noindex tag, <meta name="robots" content="noindex">, sits in the head.',
  lesson:
    "Plenty of pages are noindexed on purpose. Thank-you screens and filter pages are the usual ones. Flagging every noindex is how an audit turns up the page nobody meant to hide.",
  expectedIssues: ["noindex-page"],
  handler: () =>
    htmlResponse(
      renderPage({
        fixture: noindexMeta,
        title: "This page opted out of the index",
        metaDescription:
          "Crawlers are free to fetch this page. A robots noindex tag then tells them to leave it out of the search results.",
        robotsMeta: "noindex, follow",
        bodyHtml: article({
          h1: "This page is opted out of the index",
          lede: "Nothing here is broken. The page has simply asked to be left out of Google.",
          sections: [
            {
              h2: "When hiding a page is the point",
              body: "Some pages have no business in search results: internal search, filtered listings, thank-you screens, staging content. The robots noindex tag is the correct instrument for those. It keeps them out of the index while crawlers still follow their links. In that setting the tag is a feature, not a fault.",
            },
            {
              h2: "When the tag outlives its welcome",
              body: "The same tag turns into a bug the moment it lands on pages written to rank. Staging leftovers are one common source. So is a template that stamps the tag far more widely than anyone intended. Either mistake can pull a whole section of a site out of search. An audit therefore reports each noindex it finds, and a person confirms, one by one, that the hiding was intended.",
            },
          ],
        }),
      }),
    ),
};

// 15 - noindex via X-Robots-Tag response header -----------------------------
const noindexHeader: Fixture = {
  path: "/index/noindex-header",
  category: CAT,
  name: "Noindex (X-Robots-Tag header)",
  summary:
    "There is no robots meta tag anywhere on this page. An HTTP header carries the noindex instead.",
  lesson:
    "An X-Robots-Tag sits in the response headers, where the HTML never shows it. The crawler has to read the headers themselves to notice.",
  expectedIssues: ["noindex-page"],
  handler: () =>
    htmlResponse(
      renderPage({
        fixture: noindexHeader,
        title: "A noindex that lives in the headers",
        metaDescription:
          "The HTML here looks perfectly indexable. An X-Robots-Tag header tells search engines to skip the page anyway.",
        bodyHtml: article({
          h1: "The noindex hiding outside the HTML",
          lede: "Check the page source as long as you like. Nothing in it opts this page out. The headers do.",
          sections: [
            {
              h2: "The HTTP layer can carry rules too",
              body: "An X-Robots-Tag header carries the same directives a robots meta tag carries. The difference is placement: it rides along in the HTTP response, not in the HTML document. Servers and CDNs reach for it on files that have no HTML head to work with, PDFs among them. The drawback: view the rendered markup and the tag is nowhere to be seen. That is how one sits unnoticed for months.",
            },
            {
              h2: "Why a crawler reads more than markup",
              body: "Read only the HTML and this page looks indexable, because the markup never says otherwise. Catching a header-level rule takes a crawler that inspects the response headers on every single request. That check is the whole reason this page exists: it tests whether an audit reads headers or simply trusts the HTML.",
            },
          ],
        }),
      }),
      { headers: { "x-robots-tag": "noindex" } },
    ),
};

// 16 - canonical points to a different URL ----------------------------------
const canonicalized: Fixture = {
  path: "/index/canonicalized",
  category: CAT,
  name: "Canonicalized to another URL",
  summary:
    "Its rel=canonical names the homepage, handing this page's indexing over to that URL.",
  lesson:
    "Name another URL in a canonical and search engines will index that one instead of yours. Deliberate, it is a feature. Accidental, it quietly gives rankings away.",
  expectedIssues: ["canonicalized-page"],
  handler: (ctx) =>
    htmlResponse(
      renderPage({
        fixture: canonicalized,
        title: "A page whose canonical points elsewhere",
        metaDescription:
          "This page's canonical names the homepage. Search engines then credit the homepage, not this URL.",
        canonical: `${ctx.origin}/`,
        bodyHtml: article({
          h1: "The real page is somewhere else",
          lede: "This page loads, renders, and exists. Its canonical, though, asks search engines to index another URL instead.",
          sections: [
            {
              h2: "What pointing elsewhere instructs",
              body: "A rel=canonical that names another address is an instruction, not a suggestion: index that URL as the real page and route the ranking signals there. It earns its place on syndicated copies, parameter variants, and print versions of articles. Set deliberately, it settles the duplicate-content question before anyone asks it.",
            },
            {
              h2: "When it stops being deliberate",
              body: "The damage starts with a template mistake. Hardcode the homepage into every canonical, or worse a staging domain, and each page on the site tells search engines to defer to one URL instead of standing on its own. Sections leave the search results without a single error appearing anywhere. That is why an audit flags every canonical pointing away from the page that carries it.",
            },
          ],
        }),
      }),
    ),
};

// 17 - HTML canonical conflicts with Link-header canonical ------------------
const canonicalConflict: Fixture = {
  path: "/index/canonical-conflict",
  category: CAT,
  name: "Conflicting canonical signals",
  summary:
    "The HTML head and the Link header name different canonical URLs for the same page.",
  lesson:
    "Given two canonicals naming two URLs, the search engine trusts neither and settles on one of its own. Declare it in one place.",
  expectedIssues: ["canonical-conflict", "canonicalized-page"],
  handler: (ctx) =>
    htmlResponse(
      renderPage({
        fixture: canonicalConflict,
        title: "Two canonicals, one page",
        metaDescription:
          "This page declares its canonical twice and gets two answers: the HTML head says one URL, the Link header another.",
        canonical: `${ctx.origin}/index/canonical-conflict?via=html`,
        bodyHtml: article({
          h1: "Two canonicals that refuse to agree",
          lede: "The head points at one canonical. The header points at another. The search engine ends up trusting neither.",
          sections: [
            {
              h2: "Two answers on one page",
              body: "A page can declare its canonical in two places: a link tag in the HTML head, or a Link header on the HTTP response. Search engines look at both. When the two answers differ, as they do right here, neither one survives. The search engine discards them and chooses a canonical by itself, and its pick is rarely the one you wanted.",
            },
            {
              h2: "Say it once",
              body: "Declare the canonical once and keep it steady. Nearly every site should use the head tag and never send the header. When a Link-header canonical shows up that you did not ask for, a CDN or a framework is usually the source. Either bring the header in line with the head tag or delete it, and the page has one clear answer to give.",
            },
          ],
        }),
      }),
      {
        headers: {
          link: `<${ctx.origin}/index/canonical-conflict?via=header>; rel="canonical"`,
        },
      },
    ),
};

export const indexabilityFixtures: Fixture[] = [
  noindexMeta,
  noindexHeader,
  canonicalized,
  canonicalConflict,
];
