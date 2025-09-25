import type { GroupNode } from "../constants/types";
import { serialize } from "./serialization";

export async function sendFilters(
	tree: GroupNode,
	config: { mode: "GET" | "POST"; url: string; queryParam?: string }
) {
	const json = serialize(tree);

	if (config.mode === "GET") {
		const queryString = encodeURIComponent(JSON.stringify(json));
		const url = `${config.url}?${config.queryParam || "filters"}=${queryString}`;

		const res = await fetch(url, { method: "GET" });
		return res.json();
	}

	if (config.mode === "POST") {
		const res = await fetch(config.url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(json),
		});
		return res.json();
	}
}
