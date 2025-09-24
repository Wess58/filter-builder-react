import type { ConditionNode, ValidationResult } from "../constants/types";


export function validateCondition(condition: ConditionNode): ValidationResult {
	const { operator, value } = condition;

	if (!condition.field || !operator) {
		return { valid: false, error: "Field and operator are required" };
	}

	switch (operator) {
		case "between":
			if (!Array.isArray(value) || value.length !== 2) {
				return { valid: false, error: "Between requires exactly two values" };
			}
			break;

		case "in":
			if (!Array.isArray(value) || value.length === 0) {
				return { valid: false, error: "In requires an array of values" };
			}
			break;

		case "is null":
		case "is not null":
			if (value !== null && value !== undefined && value !== "") {
				return { valid: false, error: `${operator} should not have a value` };
			}
			break;

		default:
			if (value === null || value === undefined || value === "") {
				return { valid: false, error: "Value is required" };
			}
	}

	return { valid: true };
}
