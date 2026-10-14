import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "../components/site-layout";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy policy for brokenseo.dev" },
      {
        name: "description",
        content:
          "How brokenseo.dev handles analytics: what Plausible, Google Analytics and Cloudflare each collect, and how to change your cookie choice.",
      },
    ],
    links: [{ rel: "canonical", href: "https://brokenseo.dev/privacy/" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <SiteLayout>
      <main className="main">
        <h1>Privacy policy</h1>
        <p className="lede">
          Very little information moves when you visit brokenseo.dev, and this
          page spells out what does. Last updated July 10, 2026.
        </p>

        <h2>Who runs this site</h2>
        <p>
          Fastest Rank runs brokenseo.dev as a public test site for FastestRank.
          There is nothing to sign up for, no forms, no checkout, and no way to
          submit content. Send privacy questions and requests to{" "}
          <a href="mailto:contact@fastestrank.com">contact@fastestrank.com</a>{" "}
          or write to 5215 N O'Connor Blvd #2300, Irving, TX 75039, United
          States.
        </p>

        <h2>Plausible Analytics</h2>
        <p>
          Plausible Analytics runs on every page. We read it for two things: how
          much traffic the site gets in total, and which technical SEO examples
          people open. Plausible sets no cookie and gives you no persistent
          identifier. Its numbers are aggregate: page views, referring sites,
          browser and device categories, and location at country level.
        </p>
        <p>
          The tool belongs to Plausible Analytics OÜ. Its{" "}
          <a href="https://plausible.io/data-policy">
            Plausible Analytics data policy
          </a>{" "}
          covers the details.
        </p>

        <h2>Google Analytics</h2>
        <p>
          With your permission we also run Google Analytics 4. Many FastestRank
          users work in that analytics product already, so we look at traffic
          there as well. The Google tag stays unloaded until you choose{" "}
          <strong>Accept</strong> in the analytics banner.
        </p>
        <p>
          Google Analytics may process the address and title of the page you are
          on and the page that referred you, along with interactions such as
          page views, scrolls, and outbound clicks. It also sees browser and
          device information, an approximate location derived from your IP
          address, and identifiers generated at random. First-party cookies,
          among them <code>_ga</code> and <code>_ga_&lt;container-id&gt;</code>,
          are how it tells visitors and sessions apart.
        </p>
        <p>
          If you reject analytics, your browser sends nothing to Google
          Analytics. The choice lives in your browser&apos;s local storage, so
          the site remembers it, and you can change it whenever you like through{" "}
          <strong>Cookie settings</strong> in the footer. If you accept first
          and reject later, the site switches analytics off and clears any
          Google Analytics cookies it can reach. This choice covers Google
          Analytics only. The cookieless Plausible counting described above
          keeps running.
        </p>
        <p>
          See{" "}
          <a href="https://policies.google.com/technologies/partner-sites">
            how Google uses information from sites that use its services
          </a>{" "}
          and{" "}
          <a href="https://policies.google.com/privacy">
            Google&apos;s privacy practices
          </a>
          .
        </p>

        <h2>Cloudflare</h2>
        <p>
          brokenseo.dev runs on Cloudflare, which hosts the site, delivers its
          pages, and defends it. So Cloudflare sees the ordinary facts of a
          request: your IP address, the headers you send, the URL you asked for,
          and when you asked. It needs them to serve the site, block abuse, and
          work out what failed. We keep no access-log database of our own.{" "}
          <a href="https://www.cloudflare.com/privacypolicy/">
            Cloudflare&apos;s privacy policy
          </a>{" "}
          explains its side.
        </p>

        <h2>Where your data is processed and what you can ask for</h2>
        <p>
          Google, Plausible, and Cloudflare may each process information in the
          United States, the European Economic Area, and countries beyond those.
          Which rights you have depends on where you live. Many places let
          people ask about their information and then access, correct, delete,
          or restrict it, or object to particular processing. Send a request
          using the contact details above. Complaints can also go to the privacy
          or data-protection authority where you live.
        </p>

        <h2>Changes</h2>
        <p>
          When a change to this policy matters, we update the date at the top of
          the page.
        </p>
      </main>
    </SiteLayout>
  );
}
