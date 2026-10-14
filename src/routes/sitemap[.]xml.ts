import { createFileRoute } from "@tanstack/react-router";
import { sitemapResponse } from "../server/brokenseo";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: ({ request }) => sitemapResponse(request),
    },
  },
});
