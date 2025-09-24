import type { Schema, OperatorsMap } from "../lib/constants/types";

export const userSchema: Schema = {
	age: "number",
	role: "string",
	isActive: "boolean",
	createdAt: "date",
};

export const productSchema: Schema = {
	price: "number",
	category: "string",
	available: "boolean",
	addedAt: "date",
};

export const operators: OperatorsMap = {
	string: ["eq", "neq", "contains", "starts_with", "ends_with"],
	number: ["eq", "neq", "gt", "lt", "between"],
	boolean: ["eq", "neq"],
	date: ["eq", "neq", "before", "after", "between"],
};
