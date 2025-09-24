import type { GroupNode, ValidationResult } from "../constants/types";
import { validateCondition } from "./validation-condition";

export function validateGroup(group: GroupNode): ValidationResult {
	if (!group.children.length) {
		return { valid: false, error: "Group must have at least one condition" };
	}

	for (const child of group.children) {
		const result = child.type === "condition" ? validateCondition(child) : validateGroup(child);
		if (!result.valid) return result;
	}

	return { valid: true };
}
