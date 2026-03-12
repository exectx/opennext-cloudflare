import { readdirSync } from "node:fs";
import { defineConfig } from "drizzle-kit";
import { spawnSync } from "node:child_process";
import path from "node:path";

const prod = process.env.NODE_ENV === "production";

let sqliteDbFile = "";
if (!prod) {
  const dir = path.join(
    ".wrangler",
    "state",
    "v3",
    "d1",
    "miniflare-D1DatabaseObject",
  );
  let file = readdirSync(dir).find((f) => f.endsWith(".sqlite"));
  // NOTE: hack solution to force wrangler to generate a D1 database without
  // having to manually create one
  if (!file) {
    console.warn(
      "\n\n\n",
      "No .sqlite file found, querying prod-d1 to generate local sqlite files\n",
      "Attempting to run: wrangler d1 execute prod-d1 --local --command=\"SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;\"",
      "Re-run this script after the command completes successfully",
    );
    const wrangler = spawnSync(
      "wrangler",
      [
        "d1",
        "execute",
        "prod-d1",
        "--local",
        "--command=\"SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;\"",
      ],
      {
        stdio: ["pipe", "inherit", "inherit"],
      },
    );
    if (wrangler.status !== 0) {
      process.exit(wrangler.status);
    }
    file = readdirSync(dir).find((f) => f.endsWith(".sqlite"));
  }
  sqliteDbFile = path.join(dir, file!);
}

export default !prod
  ? defineConfig({
      out: "./drizzle/migrations",
      schema: "./src/lib/schema/d1.ts",
      dialect: "sqlite",
      dbCredentials: {
        url: sqliteDbFile,
      },
    })
  : defineConfig({
      out: "./drizzle/migrations",
      schema: "./src/lib/schema/d1.ts",
      dialect: "sqlite",
      driver: "d1-http",
      dbCredentials: {
        accountId: process.env.CLOUDFLARE_ACCOUNT_ID || "",
        databaseId: process.env.CLOUDFLARE_DATABASE_ID || "",
        token: process.env.CLOUDFLARE_D1_TOKEN || "",
      },
    });
