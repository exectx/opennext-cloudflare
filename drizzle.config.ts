import type { Config } from "drizzle-kit";

export default {
	schema: "./src/lib/schema/d1.ts",
	out: "./drizzle/migrations",
	driver: "d1",
	dialect: "sqlite",
} satisfies Config;
