import type { Fixture } from "./types";
import { htmlResponse, renderPage } from "../lib";

const KITCHEN_SINK_TITLE =
  "This single page fails six separate checks at once, starting with a title long enough that a search result would have to cut most of it away";

// A single page that trips several checks at once. Deliberately NOT thin (it
// has plenty of text) and NOT noindex, so it reads as a page that wants to rank
// and gets in its own way six different ways.
const kitchenSink: Fixture = {
  path: "/kitchen-sink",
  category: "Kitchen sink",
  name: "Kitchen sink (everything at once)",
  summary:
    "Six problems on one URL: a title nobody shortened, no meta description at all, two H1s, an outline that goes H1 then H4, an image with no alt text, and a first byte that takes too long.",
  lesson:
    "One problem per page is the rare case. An audit has to report all of them, not the first one it finds.",
  expectedIssues: [
    "title-too-long",
    "missing-meta-description",
    "multiple-h1",
    "heading-order-skip",
    "images-missing-alt",
    "slow-response",
  ],
  handler: () =>
    htmlResponse(
      renderPage({
        fixture: kitchenSink,
        title: KITCHEN_SINK_TITLE,
        // meta description intentionally omitted
        bodyHtml: `<h1>The kitchen sink of SEO problems</h1>
<h1>A second H1, which is already one too many</h1>
<p class="lede">Several checks fail here at once, and an audit should notice every one of them.</p>
<img src="/img/placeholder.svg" width="720" height="360">
<h4>This heading lands right after an H1</h4>
<p>Every problem on this page is deliberate, and there are several. Broken pages rarely show up with a single tidy mistake. What usually happens is a template that is slightly wrong in several places, and each of those places costs the page a little in search.</p>
<p>Search results stop showing a title somewhere past 60 characters. This one goes well beyond that, so the ending is never read. Nobody wrote a meta description, which means the engine picks a snippet out of whatever text it finds here. Two lines carry an H1, so the page states its own topic twice. Underneath that the outline goes H1 then H4, and two levels never appear.</p>
<h4>The rest of the list</h4>
<p>That image near the top carries no alt attribute, so a screen reader walks past it and image search never sees it. The response drags too. A good second and a half goes by before the first byte arrives, and each of these problems would deserve a fix on its own. All of them on one URL turn the page into a checklist, and into a test for whatever audit you point at it, because the tool should keep looking after the first hit.</p>
<p>A report that lists all six means the tool works. A report that lists one or two hands people false confidence, and that is worse than no report at all, because the clean-looking summary hides whatever it missed.</p>`,
      }),
      { delayMs: 1700 },
    ),
};

export const kitchenSinkFixtures: Fixture[] = [kitchenSink];
