import { describe, it, expect } from "vitest";
import { serialize, deserialize } from "./serialization";
import { generateId } from "../constants/types";

describe("serialization", () => {
	it("serializes and deserializes correctly", () => {
		const input = {
			and: [
				{ field: "age", operator: "gt", value: 30 },
				{
					or: [
						{ field: "role", operator: "eq", value: "admin" },
						{ field: "isActive", operator: "eq", value: true }
					]
				}
			]
		};

		const tree = deserialize(input, generateId);
		const output = serialize(tree);

		expect(output).toEqual(input);
	});
});
