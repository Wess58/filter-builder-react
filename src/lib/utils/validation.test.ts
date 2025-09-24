import { describe, it, expect } from "vitest";
import { validateCondition } from "./validation-condition";
import type { GroupNode } from "../constants/types";
import { validateGroup } from "./validation-group";

describe("validateCondition", () => {
	it("requires field and operator", () => {
		expect(validateCondition({ id: "1", type: "condition", field: "", operator: "", value: "" }).valid).toBe(false);
	});

	it("between requires two values", () => {
		expect(validateCondition({ id: "1", type: "condition", field: "age", operator: "between", value: [1] }).valid).toBe(false);
		expect(validateCondition({ id: "1", type: "condition", field: "age", operator: "between", value: [1, 2] }).valid).toBe(true);
	});

	it("in requires array", () => {
		expect(validateCondition({ id: "1", type: "condition", field: "role", operator: "in", value: "admin" }).valid).toBe(false);
	});

	it("is null requires no value", () => {
		expect(validateCondition({ id: "1", type: "condition", field: "age", operator: "is null", value: "x" }).valid).toBe(false);
	});
});


describe("validateGroup", () => {
	it("fails when group has no children", () => {
		const group: GroupNode = {
			id: "g1",
			type: "group",
			operator: "and",
			children: [],
		};

		const result = validateGroup(group);
		expect(result.valid).toBe(false);
		expect(result.error).toBe("Group must have at least one condition");
	});

	it("passes with a valid condition child", () => {
		const group: GroupNode = {
			id: "g1",
			type: "group",
			operator: "and",
			children: [
				{
					id: "c1",
					type: "condition",
					field: "age",
					operator: "gt",
					value: 30,
				},
			],
		};

		const result = validateGroup(group);
		expect(result.valid).toBe(true);
	});

	it("fails if a child condition is invalid", () => {
		const group: GroupNode = {
			id: "g1",
			type: "group",
			operator: "and",
			children: [
				{
					id: "c1",
					type: "condition",
					field: "age",
					operator: "between",
					value: [10], 
				},
			],
		};

		const result = validateGroup(group);
		expect(result.valid).toBe(false);
		expect(result.error).toContain("Between requires exactly two values");
	});

	it("validates nested groups recursively", () => {
		const group: GroupNode = {
			id: "g1",
			type: "group",
			operator: "and",
			children: [
				{
					id: "g2",
					type: "group",
					operator: "or",
					children: [
						{
							id: "c1",
							type: "condition",
							field: "role",
							operator: "eq",
							value: "admin",
						},
						{
							id: "c2",
							type: "condition",
							field: "isActive",
							operator: "eq",
							value: true,
						},
					],
				},
			],
		};

		const result = validateGroup(group);
		expect(result.valid).toBe(true);
	});
});
