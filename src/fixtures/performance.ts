import type { Fixture } from "./types";
import { htmlResponse, renderPage } from "../lib";
import { article } from "./helpers";

const CAT = "Performance";

// 24: slow server response (TTFB over 1.5s) ---------------------------------
const slowResponse: Fixture = {
  path: "/perf/slow-response",
  category: CAT,
  name: "Slow server response",
  summary:
    "Nothing comes back for about 1.7 seconds. The server holds the request first.",
  lesson:
    "Every later part of the load waits on the first byte, and large sites get crawled less. Serve cached or pre-rendered HTML.",
  expectedIssues: ["slow-response"],
  handler: () =>
    htmlResponse(
      renderPage({
        fixture: slowResponse,
        title: "A page that answers slowly",
        metaDescription:
          "About 1.7 seconds go by before the first byte of this page arrives. That is a slow time to first byte, placed here on purpose.",
        bodyHtml: article({
          h1: "This page is slow to answer",
          lede: "The page builds the delay in on purpose, and it is longer than it should be.",
          sections: [
            {
              h2: "What time to first byte controls",
              body: "Time to first byte is the gap between the request and the first byte coming back. Rendering waits for it. So does the crawler. Nothing downstream can start sooner, which means every other speed number inherits the delay, and a page with a quick front end still feels slow to use. On a large site the waiting adds up. Search engines cover fewer of your pages each time they come.",
            },
            {
              h2: "Where the delay comes from",
              body: "Usually the server is doing real work it could have skipped, once per request. A database query with no cache in front of it. A slow upstream API. Rendering that could have finished before anybody asked for the page. The fix is to stop rebuilding the same HTML on every request. Cache it, generate it ahead of time, or serve it from the edge, and the answer drops to milliseconds.",
            },
          ],
        }),
      }),
      { delayMs: 1700 },
    ),
};

export const performanceFixtures: Fixture[] = [slowResponse];
