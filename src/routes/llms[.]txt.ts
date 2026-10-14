import { createFileRoute } from "@tanstack/react-router";
import { llmsTextResponse } from "../server/brokenseo";

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: () => llmsTextResponse(),
    },
  },
});
