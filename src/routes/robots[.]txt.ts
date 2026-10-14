import { createFileRoute } from "@tanstack/react-router";
import { robotsResponse } from "../server/brokenseo";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: ({ request }) => robotsResponse(request),
    },
  },
});
