import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "../components/site-layout";
import { canonicalPath } from "../lib";
import { catalogLinkedFixtures, categories } from "../fixtures/registry";

const PRODUCT_DESCRIPTION =
  "Example pages that break technical SEO rules on purpose. Read them to learn the problems, or crawl the site to test your audit tool or agent.";

const SITE_TITLE = "BrokenSEO: a site that fails SEO checks on purpose";
const ORIGIN = "https://brokenseo.dev";

const SCHEMA_JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${ORIGIN}/#website`,
      url: `${ORIGIN}/`,
      name: "BrokenSEO",
      description: PRODUCT_DESCRIPTION,
      publisher: {
        "@type": "Organization",
        name: "FastestRank",
        url: "https://www.fastestrank.com",
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${ORIGIN}/#application`,
      name: "BrokenSEO",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "All",
      url: `${ORIGIN}/`,
      description:
        "A standardized benchmark of deliberate technical SEO defects for evaluating web crawlers, audit software, and AI agents.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  ],
});

const homepageCategories = [
  "Kitchen sink",
  ...categories.filter(
    (category) =>
      category !== "Kitchen sink" &&
      category !== "Head tags & headings" &&
      category !== "Content quality",
  ),
  "Head tags & headings",
  "Content quality",
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: SITE_TITLE },
      { name: "description", content: PRODUCT_DESCRIPTION },
      { property: "og:title", content: SITE_TITLE },
      { property: "og:description", content: PRODUCT_DESCRIPTION },
      { property: "og:url", content: `${ORIGIN}/` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: SITE_TITLE },
      { name: "twitter:description", content: PRODUCT_DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: `${ORIGIN}/` }],
    scripts: [{ type: "application/ld+json", children: SCHEMA_JSON_LD }],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <SiteLayout>
      <main className="home-main">
        <section className="home-hero">
          <div className="home-copy">
            <h1>BrokenSEO</h1>
            <p>{PRODUCT_DESCRIPTION}</p>
            <p>
              Every example carries a panel at the top that names the defect and
              lists the findings an audit should return. That panel is the
              answer key. Crawl the site and compare your tool&apos;s report
              against it, or work down the categories below until each failure
              looks familiar.
            </p>
          </div>
        </section>

        <div className="home-issues" id="issues">
          {homepageCategories.map((category) => (
            <section className="home-issue-group" key={category}>
              <h2>{category}</h2>
              <div className="home-case-head" aria-hidden="true">
                <span>Problem</span>
                <span>What the page shows</span>
              </div>
              <div className="home-case-list">
                {catalogLinkedFixtures
                  .filter((fixture) => fixture.category === category)
                  .map((fixture) => (
                    <a
                      className="home-case-row"
                      href={canonicalPath(fixture.path)}
                      key={fixture.path}
                    >
                      <span className="home-case-name">{fixture.name}</span>
                      <span className="home-case-summary">
                        {fixture.summary}
                      </span>
                    </a>
                  ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </SiteLayout>
  );
}
