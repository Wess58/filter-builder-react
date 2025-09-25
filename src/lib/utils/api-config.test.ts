import { describe, it, expect, vi } from "vitest";
import { sendFilters } from "../utils/api-config";
import type { GroupNode } from "../constants/types";

global.fetch = vi.fn(() =>
	Promise.resolve({
		json: () => Promise.resolve({ ok: true }),
	})
) as any;

describe("sendFilters", () => {
	const tree: GroupNode = {
		id: "g1",
		type: "group",
		operator: "and",
		children: [
			{ id: "c1", type: "condition", field: "age", operator: "gt", value: 30 },
		],
	};

	it("sends GET request with filters in query string", async () => {
		const res = await sendFilters(tree, { mode: "GET", url: "http://test.com" });
		expect(res.ok).toBe(true);
		expect(fetch).toHaveBeenCalledWith(
			expect.stringContaining("http://test.com?filters="),
			expect.objectContaining({ method: "GET" })
		);
	});

	it("sends POST request with filters in body", async () => {
		const res = await sendFilters(tree, { mode: "POST", url: "http://test.com" });
		expect(res.ok).toBe(true);
		expect(fetch).toHaveBeenCalledWith("http://test.com", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: expect.any(String),
		});
	});
});
