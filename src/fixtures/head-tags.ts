import type { Fixture } from "./types";
import { htmlResponse, renderPage } from "../lib";
import { article, lorem } from "./helpers";

const CAT = "Head tags & headings";

// 1 - no <title> element at all --------------------------------------------
const missingTitle: Fixture = {
  path: "/head/missing-title",
  category: CAT,
  name: "Missing <title> tag",
  summary: "There is no <title> element anywhere on this page.",
  lesson:
    "The title is your strongest on-page topic signal and the headline people read in search results. Leave it out and the search engine composes one on its own.",
  expectedIssues: ["missing-title"],
  handler: () =>
    htmlResponse(
      renderPage({
        fixture: missingTitle,
        // title intentionally omitted
        metaDescription:
          "The layout, the copy, and the headings all work on this page. Only the title tag is absent, and listings and browser tabs both reach for it.",
        bodyHtml: article({
          h1: "No title anywhere",
          lede: "Nothing is wrong with the copy or the headings. The head simply has no title tag.",
          sections: [
            {
              h2: "The job of a title",
              body: "When a crawler reads your page, the title tag is its first clue about the topic. When a person scans a results page, that same text is the headline they click on. Drop it and the engine assembles a replacement from whatever words sit on the page. The result is rarely as good as a title you would write yourself.",
            },
            {
              h2: "How pages end up without one",
              body: "Templates are almost always to blame. Maybe the schema behind a content type simply lacks a title field. Maybe a component prints the title only when a value exists, so an empty field leaves an empty head. Maybe a migration rebuilt the layout and the head tags never came back. Visitors notice none of it, because the page renders normally. You only see it when you open the source and look.",
            },
          ],
        }),
      }),
    ),
};

// 2 - title longer than ~60 chars -------------------------------------------
const longTitle =
  "A complete guide to page titles, written long enough that a search result cuts most of it off before anyone reaches the end";
const titleTooLong: Fixture = {
  path: "/head/title-too-long",
  category: CAT,
  name: "Title too long",
  summary: `Nothing here is wrong except the length of the title: it runs to ${longTitle.length} characters, and a search result only has room for about 60.`,
  lesson:
    "A search result has room for about 60 characters of title. The rest is replaced with an ellipsis, sometimes in the middle of a word. Lead with what matters.",
  expectedIssues: ["title-too-long"],
  handler: () =>
    htmlResponse(
      renderPage({
        fixture: titleTooLong,
        title: longTitle,
        metaDescription:
          "This page's title runs longer than any results slot, so the tail of it stays hidden.",
        bodyHtml: article({
          h1: "A title nobody sees the end of",
          lede: "A title only works up to the point where the results page starts chopping it.",
          sections: [
            {
              h2: "What a result can display",
              body: "Titles render in a fixed-width slot, which fits roughly 60 characters of English. The engine trims the rest and leaves an ellipsis where it cut. If your specific, useful words sit near the end of the string, nobody reads them. Searchers see a phrase that trails off mid-word and click the result below yours.",
            },
            {
              h2: "Fixing an overlong title",
              body: "Open with the topic itself. Padding like complete guide to or ultimate adds length without adding information, so cut it. Park the brand name at the back, because that is the part a truncation takes anyway. Around 50 characters is usually the sweet spot. Short titles get clicked more, and the engine reads the page's subject off them faster.",
            },
          ],
        }),
      }),
    ),
};

// 3 - title shorter than ~10 chars ------------------------------------------
const titleTooShort: Fixture = {
  path: "/head/title-too-short",
  category: CAT,
  name: "Title too short",
  summary:
    'Here is the entire title: "Hi". It gives away nothing about the page.',
  lesson:
    "Two characters of title throw away the most valuable text on the page. There is no topic in it and nothing that earns a click.",
  expectedIssues: ["title-too-short"],
  handler: () =>
    htmlResponse(
      renderPage({
        fixture: titleTooShort,
        title: "Hi",
        metaDescription:
          "A title of two letters carries no topic, so a search engine has almost nothing to work with here.",
        bodyHtml: article({
          h1: "A title of two characters",
          lede: "Brevity has a floor. This title sits under it.",
          sections: [
            {
              h2: "What a short title loses",
              body: "No other text under your control carries the weight the title does. Two characters hand that space back unused. They cannot hold the words people type into a search box, they say nothing about the page, and they offer no reason to pick your result over the ten sitting next to it.",
            },
            {
              h2: "The range that works",
              body: "Most guidance lands between 30 and 60 characters. Inside that range you can name the topic, match the phrasing searchers type, and still fit a small hook. Think one clear phrase. A single word wastes the slot, and a full sentence spills past the visible width.",
            },
          ],
        }),
      }),
    ),
};

// 4 - no meta description ----------------------------------------------------
const missingMeta: Fixture = {
  path: "/head/missing-meta-description",
  category: CAT,
  name: "Missing meta description",
  summary: 'The page never includes a <meta name="description"> tag.',
  lesson:
    "Leave the description out and the search engine picks the snippet itself from your page text. Sometimes it picks well. Sometimes it grabs a menu item.",
  expectedIssues: ["missing-meta-description"],
  handler: () =>
    htmlResponse(
      renderPage({
        fixture: missingMeta,
        title: "A page that skips its meta description",
        // metaDescription intentionally omitted
        bodyHtml: article({
          h1: "The description line is missing",
          lede: "The title is set, the headings are tidy, and the description tag is simply gone.",
          sections: [
            {
              h2: "Where the description shows up",
              body: "In a search result, the summary line under the title comes from the meta description. It does not move rankings on its own, but a well-written one earns more clicks. Skip it and the engine invents a snippet from whatever text it finds on the page, which reads fine now and then and often does not.",
            },
            {
              h2: "Writing your own snippet",
              body: "Think of it as a short ad. You get roughly 70 to 160 characters to say what the page offers and why someone should tap it. Give every page its own copy; otherwise two of your results can wear one identical snippet. Do not stuff the line with keywords. Search engines mostly ignore a stuffed description anyway.",
            },
          ],
        }),
      }),
    ),
};

// 5 - meta description longer than ~160 chars --------------------------------
const longMeta =
  "This description piles clause on clause long after any search result would have stopped showing it, so the reader only ever sees the opening words before an ellipsis arrives and swallows the rest.";
const metaTooLong: Fixture = {
  path: "/head/meta-description-too-long",
  category: CAT,
  name: "Meta description too long",
  summary: `At ${longMeta.length} characters, this meta description runs well past the 160 a search result can show.`,
  lesson:
    "Descriptions get truncated around 160 characters. The words past that point might as well not be written.",
  expectedIssues: ["meta-description-too-long"],
  handler: () =>
    htmlResponse(
      renderPage({
        fixture: metaTooLong,
        title: "A meta description that never stops",
        metaDescription: longMeta,
        bodyHtml: article({
          h1: "A description that ran too far",
          lede: "Yes, it is possible to write too much here. This page is the proof.",
          sections: [
            {
              h2: "The visible window",
              body: "The snippet slot is fixed-width, and the ellipsis arrives when the engine runs out of room, somewhere near character 150 or 160. Text past the cut never reaches the searcher. If the reason to click lives at the end of your description, it sits exactly where nobody looks. Treat anything past 150 characters as invisible.",
            },
            {
              h2: "One line, then stop",
              body: "Front-load the single most important point, keep it to one sentence, and pull back before the cutoff. A rough test: if you have joined several ideas with semicolons, you have written two or three descriptions and are forcing them to share one slot.",
            },
          ],
        }),
      }),
    ),
};

// 6 - meta description shorter than ~70 chars --------------------------------
const shortMeta = "One clipped sentence about this page, nothing more.";
const metaTooShort: Fixture = {
  path: "/head/meta-description-too-short",
  category: CAT,
  name: "Meta description too short",
  summary: `This page's meta description runs to only ${shortMeta.length} characters.`,
  lesson:
    "A stub of a description squanders the room a result gives you. Fill it with a real summary and something a searcher can act on.",
  expectedIssues: ["meta-description-too-short"],
  handler: () =>
    htmlResponse(
      renderPage({
        fixture: metaTooShort,
        title: "A page with a stub of a description",
        metaDescription: shortMeta,
        bodyHtml: article({
          h1: "A description that stops too early",
          lede: "The tag exists and says something. It just says too little.",
          sections: [
            {
              h2: "What a stub costs you",
              body: "The description is the pitch that sits under your title in a result. A tiny one leaves most of that slot empty, so your page says less than its neighbors. The engine may also judge the tag useless, ignore it, and pull its own snippet from the page. That replacement often reads choppy or lands on something irrelevant.",
            },
            {
              h2: "Filling the slot properly",
              body: "A description that works names the page, says what the visitor will get, and gives them a reason to tap. Length is not the goal. What it needs is room to be specific, and 70 to 160 characters supplies exactly that: a summary that stops short of a paragraph.",
            },
          ],
        }),
      }),
    ),
};

// 7 - no <h1> -----------------------------------------------------------------
const missingH1: Fixture = {
  path: "/head/missing-h1",
  category: CAT,
  name: "Missing H1",
  summary: "This article opens with an <h2>. No H1 exists on the page.",
  lesson:
    "The H1 is the headline that states the topic on the page itself. Without one, the subject has no anchor.",
  expectedIssues: ["missing-h1"],
  handler: () =>
    htmlResponse(
      renderPage({
        fixture: missingH1,
        title: "An article that never reaches H1",
        metaDescription:
          "The headings on this page all sit at H2 or deeper. The H1 that should name the topic never appears.",
        // Hand-authored body: starts at H2 on purpose, no H1.
        bodyHtml: `<h2>The spot where the H1 belongs</h2>
<p class="lede">There is a real article here. It simply never names its topic at the top level.</p>
<p>A normal page opens with exactly one H1, the subject stated in plain words, and every H2 and H3 nests beneath that line. Remove the top line and two readers lose out: a screen reader jumping by headings hears no main subject, and a crawler parsing the structure gets no anchor either. The article ends up feeling like a chapter that never got a title.</p>
<h2>How the H1 goes missing</h2>
<p>Two designs cause this. A design system may style the visible heading with a plain div, which gives the designer precise control and leaves the outline without a top. Or the template hands the H1 to the site logo and drops the article headline to H2. The repair is the same in both cases: promote the heading people actually read to an H1, so the source says what the screen already shows.</p>
<h3>A simple check</h3>
<p>Load the page and count the H1s. There should be exactly one. Then ask whether a stranger could read that heading before scrolling and say what the page covers.</p>`,
      }),
    ),
};

// 8 - empty <h1> ---------------------------------------------------------------
const emptyH1: Fixture = {
  path: "/head/empty-h1",
  category: CAT,
  name: "Empty H1",
  summary: "An H1 tag sits in the markup. It contains nothing.",
  lesson:
    "To a visitor or a crawler, an empty H1 and a missing H1 do the same damage. The tag is there; the topic still never gets said.",
  expectedIssues: ["missing-h1"],
  handler: () =>
    htmlResponse(
      renderPage({
        fixture: emptyH1,
        title: "An H1 with nothing inside it",
        metaDescription:
          "This page renders a top-level heading tag, then leaves it blank, so there is an H1 in the markup and no H1 text anywhere.",
        bodyHtml: `<h1></h1>
<p class="lede">The tag a screen reader would announce as a heading is there. The heading itself is blank.</p>
<p>${lorem(90)}</p>
<h2>What a blank heading does to readers</h2>
<p>An H1 earns its place by naming the subject. An empty one gives a screen reader a heading to jump to with no label attached, and gives a search engine no phrase to tie to the topic. Templates produce this when they print the heading wrapper regardless of whether the CMS field has content in it. CSS can also cause it, by hiding the text inside the tag.</p>
<h3>The fix</h3>
<p>Write the actual headline, put it in the H1, and keep the sections below at H2 and H3. No good headline yet? Draft one before the page ships. A blank rung in the outline is not a placeholder. It is a hole.</p>`,
      }),
    ),
};

// 9 - multiple <h1> -------------------------------------------------------------
const multipleH1: Fixture = {
  path: "/head/multiple-h1",
  category: CAT,
  name: "Multiple H1s",
  summary: "Three different lines on this page carry an H1.",
  lesson:
    "Several H1s divide the topic signal between them. The usual culprit is a template that hands the H1 tag to page furniture never meant to be a heading.",
  expectedIssues: ["multiple-h1"],
  handler: () =>
    htmlResponse(
      renderPage({
        fixture: multipleH1,
        title: "Three H1s, one page",
        metaDescription:
          "A crawler reading this page finds three H1s claiming the topic at once, and no way to tell which one the article is really about.",
        bodyHtml: `<h1>This is one of the H1s</h1>
<h1>So is this line</h1>
<p class="lede">Three top-level headings, one page. A crawler has to guess which heading is the real subject.</p>
<p>A page has one headline, and the H1 is supposed to be it. Give that job to the logo, the article title, and a sidebar widget and the crawler hears three competing statements about the topic and must pick between them. Whatever signal you intended now reaches the crawler in thirds.</p>
<h1>Here is the third H1</h1>
<p>More than anything else, one shared heading component with the level baked in causes this. Drop it in three spots and you get three H1s where the design needed an H2 and an H3. Choose the real headline, leave it at H1, and demote the others. A logo is not a heading in the first place; a styled span or div does that job.</p>`,
      }),
    ),
};

// 10 - heading levels skip (h1 -> h4) ------------------------------------------
const headingSkip: Fixture = {
  path: "/head/heading-order-skip",
  category: CAT,
  name: "Heading levels skip",
  summary:
    "After the <h1>, the next heading is an <h4>. H2 and H3 are skipped.",
  lesson:
    "A jump in heading levels breaks the outline screen readers and parsers depend on. Move down a single rung between each heading.",
  expectedIssues: ["heading-order-skip"],
  handler: () =>
    htmlResponse(
      renderPage({
        fixture: headingSkip,
        title: "Headings that skip straight to four",
        metaDescription:
          "This article goes from its H1 directly to an H4. The gap in between leaves screen readers and parsers with a broken outline.",
        bodyHtml: `<h1>A jump from H1 to H4</h1>
<p class="lede">Between the title and the first section, this page treated H2 and H3 as optional. They are not.</p>
<h4>This section earned an H2 and got an H4</h4>
<p>Headings do more than set size. They build an outline: screen readers read it aloud and search engines use it to map the page. A jump from H1 to H4 tells an assistive-tech user that they dropped three levels with nothing in between. Navigating by headings suddenly gets confusing and slow.</p>
<h4>Another section that skipped the ladder</h4>
<p>The repair is the tag, not the type size. Want smaller-looking text? Handle it in CSS and keep every heading one rung below the section that contains it. A healthy outline steps down in order: H1, H2, H3, H4. Nobody parsing the page should ever reach a rung that is missing.</p>`,
      }),
    ),
};

export const headTagFixtures: Fixture[] = [
  missingTitle,
  titleTooLong,
  titleTooShort,
  missingMeta,
  metaTooLong,
  metaTooShort,
  missingH1,
  emptyH1,
  multipleH1,
  headingSkip,
];
