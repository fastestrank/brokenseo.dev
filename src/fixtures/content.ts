import type { Fixture } from "./types";
import { canonicalPath, htmlResponse, renderPage } from "../lib";
import { article } from "./helpers";

const CAT = "Content quality";

// 9 - thin content (< 150 words). The whole document (chrome + panel + body)
// stays under the threshold, so only thin-content fires.
const thinContent: Fixture = {
  path: "/content/thin-content",
  category: CAT,
  name: "Thin content",
  summary: "There is barely any text on this page.",
  lesson:
    "Pages with hardly any words rarely rank, and enough of them can drag down how search engines view the whole site.",
  expectedIssues: ["thin-content"],
  handler: () =>
    htmlResponse(
      renderPage({
        fixture: thinContent,
        title: "A page with too little on it",
        metaDescription:
          "A nearly empty page, built to show what thin content looks like when a crawler reads it.",
        bodyHtml: `<h1>This page is almost empty</h1>
<p>You have just read everything on it. A search engine has too little here to work with.</p>`,
      }),
    ),
};

// 10 - an <img> with no alt attribute -------------------------------------
const imagesMissingAlt: Fixture = {
  path: "/content/images-missing-alt",
  category: CAT,
  name: "Images missing alt text",
  summary: "An image sits on this page with its alt attribute left off.",
  lesson:
    'A screen reader uses alt text to describe an image; a search engine uses it to read one. An image that is pure decoration should carry alt=""; one that carries meaning needs words written for it.',
  expectedIssues: ["images-missing-alt"],
  handler: () =>
    htmlResponse(
      renderPage({
        fixture: imagesMissingAlt,
        title: "One image here never says what it contains",
        metaDescription:
          "One image here has no alt attribute, so neither a screen reader nor a crawler gets any hint of what the picture contains.",
        bodyHtml: `<h1>An image with the alt attribute left off</h1>
<p class="lede">The image below carries no alt text. A screen reader moves past it as though it were invisible.</p>
<img src="/img/placeholder.svg" width="720" height="360">
<h2>What alt text does</h2>
<p>Without alt, a screen reader meets a hole in the page and a crawler meets silence. The software speaks the alt text in place of the picture, so the picture needs words. If the image means something, one short, specific line about its subject does the job. If it is only decoration, an empty alt marks it as something the software should pass over by choice.</p>
<h2>Writing the alt text well</h2>
<p>Name the subject and the job it does on the page; the words "picture of" belong in neither. Keep the line short and free of keywords, and keep the attribute itself. An empty alt and a missing alt look nearly alike in the source, yet whatever parses that source reads them as opposite instructions.</p>`,
      }),
    ),
};

// 11 - the same page served at two URLs (duplicate content + title + meta) ---
const DUP_TITLE = "How to make a pumpkin spice latte";
const DUP_META =
  "One latte recipe posted at two URLs on this site. A search engine has to choose which copy survives and leave the other out.";
const DUP_BODY = article({
  h1: "One latte recipe, two URLs",
  lede: "Every byte on this page has a twin at a second URL here.",
  sections: [
    {
      h2: "The same article at several addresses",
      body: "Duplicate content is one piece of writing that a crawler can reach at several addresses. The usual suspects: the same article pasted onto two paths, which is this page's situation, a print version, a trailing-slash variant, or an http copy sitting beside the https original. One result twice helps no searcher, so the engine indexes a single URL and ignores the rest. The signals this page collected get divided between copies, and the copies now bid against each other.",
    },
    {
      h2: "Closing the duplicate",
      body: "Choose the copy that should rank. Every other URL can then carry a rel=canonical tag naming it, or answer requests with a 301 redirect that lands visitors and crawlers alike on the kept page. Templated sites need watching: URL parameters and stray slashes mint identical pages nobody intended, and each of those pages leaks a little strength that belonged to your best URL.",
    },
  ],
});
const duplicateContent: Fixture = {
  path: "/content/duplicate-a",
  extraPaths: ["/content/duplicate-b"],
  category: CAT,
  name: "Duplicate content (same page, two URLs)",
  summary:
    "The body, title, and meta description here match /content/duplicate-b exactly.",
  lesson:
    "Identical text at several URLs splits the ranking signals between them. Choose the URL worth ranking and redirect every copy to it.",
  expectedIssues: [
    "duplicate-content",
    "duplicate-title",
    "duplicate-meta-description",
  ],
  handler: (ctx) =>
    htmlResponse(
      renderPage({
        fixture: duplicateContent,
        title: DUP_TITLE,
        metaDescription: DUP_META,
        bodyHtml: DUP_BODY,
        canonical: `https://brokenseo.dev${canonicalPath(ctx.path)}`,
      }),
    ),
};

// 12 - two different pages that share only a <title> ----------------------
const SHARED_TITLE = "Running shoes in blue from Sole Mates";
const dupTitleA: Fixture = {
  path: "/content/duplicate-title-a",
  category: CAT,
  name: "Duplicate title (product A)",
  summary:
    'The title above is also the title of product B: "Running shoes in blue from Sole Mates".',
  lesson:
    "Catalogue templates routinely hand every product page one generic title. Push whatever separates this page from the rest (model, colour, size) into the title instead.",
  expectedIssues: ["duplicate-title"],
  handler: () =>
    htmlResponse(
      renderPage({
        fixture: dupTitleA,
        title: SHARED_TITLE,
        metaDescription:
          "Cobalt blue and built for high weekly mileage: the Marathon is the cushioned road trainer of the Sole Mates range.",
        bodyHtml: article({
          h1: "Marathon trainer in cobalt blue",
          lede: "A road shoe with real cushioning, aimed at runners who log serious mileage every week.",
          sections: [
            {
              h2: "Made for the long run",
              body: "The Marathon exists for distance. Its midsole is soft and stacks high, mile twenty still feels fine in it, the knit upper breathes, and the outsole survives hundreds of miles of road. The Sprint is a different shoe altogether. A search engine reading these two results, though, sees one title twice and nothing telling the shoes apart.",
            },
            {
              h2: "What one shared title costs",
              body: "Give every product in a catalogue one title and the pages fight over the same searches, with nothing to make a shopper prefer one. The template is where this gets repaired. Let each product's model, its colourway, and the job it does reach the title, and the Marathon and the Sprint read as the two separate products they are.",
            },
          ],
        }),
      }),
    ),
};
const dupTitleB: Fixture = {
  path: "/content/duplicate-title-b",
  category: CAT,
  name: "Duplicate title (product B)",
  summary:
    'Product A carries the same title: "Running shoes in blue from Sole Mates".',
  lesson:
    "The second page of the duplicate-title pair. The product and the write-up here differ from page A; the title does not.",
  expectedIssues: ["duplicate-title"],
  handler: () =>
    htmlResponse(
      renderPage({
        fixture: dupTitleB,
        title: SHARED_TITLE,
        metaDescription:
          "Firm underfoot, low drop, electric blue: the Sprint is the flat Sole Mates points at 5K and 10K racing.",
        bodyHtml: article({
          h1: "Sprint racer in electric blue",
          lede: "Almost nothing on your foot, and pointed at short, quick efforts on the track or the road.",
          sections: [
            {
              h2: "Made to go fast",
              body: "Nothing about the Sprint says long run. A firm, responsive plate sits underfoot, a low drop tips you onto a snappy forefoot strike, and there is barely any weight to haul around a fast 5K. Face to face, nobody would mix the Sprint up with the Marathon. In a search result the two pages look alike, because both wear the one title.",
            },
            {
              h2: "The catalogue template problem",
              body: "Stores fall into this the same way every time. One catalogue template stamps a colour and a category onto every product it prints, the engine lumps those pages together, click rates slip, and the store ends up as its own competition. Splitting the titles apart takes one small template edit, and the whole catalogue feels it.",
            },
          ],
        }),
      }),
    ),
};

// 13 - two different pages that share only a meta description -------------
const SHARED_META =
  "Local, seasonal ingredients go into everything here, made the same morning it reaches your door still fresh. Place your order today.";
const dupMetaA: Fixture = {
  path: "/content/duplicate-meta-a",
  category: CAT,
  name: "Duplicate meta description (bakery)",
  summary: "The florist page uses this exact meta description, word for word.",
  lesson:
    "Paste one boilerplate description onto every page and search shows the same snippet each time. Write a separate line for every page.",
  expectedIssues: ["duplicate-meta-description"],
  handler: () =>
    htmlResponse(
      renderPage({
        fixture: dupMetaA,
        title: "Sourdough bread and pastries from Early Riser Bakery",
        metaDescription: SHARED_META,
        bodyHtml: article({
          h1: "Early Riser Bakery",
          lede: "Everything here leaves the oven before dawn, sourdough and pastries alike, and a slow ferment is behind the lot.",
          sections: [
            {
              h2: "The bread and the pastry",
              body: "Two days go into every loaf. A long, cold ferment builds the flavour, high heat builds the crust, and the crumb inside stays open. Croissants and morning buns share the counter with the bread, while the tarts rotate with the seasons. Nobody doubts this page belongs to a bakery. Its meta description is still the stock sentence we also run on the florist site.",
            },
            {
              h2: "Why the shared snippet hurts",
              body: "Both businesses borrow one description, so a search can return two of our pages under one identical snippet, and a reader gets nothing that separates bread from bouquets. One sentence copied onto every page feels efficient, until you notice what it throws away: the spot where each page gets its chance to sell itself to someone about to click.",
            },
          ],
        }),
      }),
    ),
};
const dupMetaB: Fixture = {
  path: "/content/duplicate-meta-b",
  category: CAT,
  name: "Duplicate meta description (florist)",
  summary: "The bakery page uses this exact meta description, word for word.",
  lesson:
    "The second page of the duplicate-meta pair: another business, another page, and one snippet identical to the bakery's.",
  expectedIssues: ["duplicate-meta-description"],
  handler: () =>
    htmlResponse(
      renderPage({
        fixture: dupMetaB,
        title: "Seasonal flower delivery from Petal & Stem",
        metaDescription: SHARED_META,
        bodyHtml: article({
          h1: "Petal & Stem Florist",
          lede: "Seasonal bouquets tied by hand, cut fresh and delivered within the day.",
          sections: [
            {
              h2: "Flowers in each season",
              body: "The bouquets track the calendar: spring brings tulips and ranunculus, late summer belongs to the dahlias, and amaryllis with evergreens carries the winter. Every bunch is tied by hand to order and travels in water so the flowers last. Read this page and you know it belongs to a flower shop, not a bakery. The two sites were still cut from one template, though, and that template left them sharing a single meta description.",
            },
            {
              h2: "Two businesses, one sentence",
              body: "Unrelated pages carrying one description show searchers the same snippet twice, and neither result explains itself. The click rate slips on both. The repair is plain: give each page its own honest, specific description that says exactly what that page offers.",
            },
          ],
        }),
      }),
    ),
};

export const contentFixtures: Fixture[] = [
  thinContent,
  imagesMissingAlt,
  duplicateContent,
  dupTitleA,
  dupTitleB,
  dupMetaA,
  dupMetaB,
];
