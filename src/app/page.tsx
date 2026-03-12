import { getDb } from "@/lib/db";
import { demoItems } from "@/lib/schema/d1";

export const dynamic = "force-dynamic";

export default async function Home() {
	const db = getDb();
	const rows = await db.select().from(demoItems).limit(5);

	return (
		<div className="min-h-screen p-8 sm:p-20 font-sans">
			<main className="max-w-2xl">
				<h1 className="text-2xl font-semibold">D1 + Drizzle Demo</h1>
				<p className="mt-2 text-sm text-neutral-600">Latest 5 rows from demo_items</p>
				<pre className="mt-6 rounded-lg bg-neutral-950 p-4 text-sm text-neutral-100 overflow-auto">
					{JSON.stringify(rows, null, 2)}
				</pre>
			</main>
		</div>
	);
}
