import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import { logger } from "./lib/logger";

// npm workspaces run this process from the repository root. Resolve the
// backend's own .env file relative to this entry point instead of process.cwd().
dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });

// This must be dynamic: app imports the Supabase and database clients, both of
// which need the environment variables above during module initialisation.
const { default: app } = await import("./app");

const rawPort = process.env["PORT"] ?? "3001";

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
