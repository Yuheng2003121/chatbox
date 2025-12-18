import "dotenv/config";
import { Template, defaultBuildLogger } from "e2b";
import { template } from "./template";
async function main() {
  await Template.build(template, {
    alias: "vibe-nextjs-lyh",
    onBuildLogs: defaultBuildLogger(),
    apiKey: process.env.E2B_API_KEY,
  });
}

main().catch(console.error);
