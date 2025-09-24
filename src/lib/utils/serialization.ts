import type { ConditionNode, GroupNode } from "../constants/types";

//  date specific formmatter - yyyy-mm-dd
function formatDate(val: Date | null): string | null {
	if (!val) return null;
	return val.toISOString().split("T")[0];
}

// Serialize internal tree into JSON format
export function serialize(tree: (GroupNode | ConditionNode)): any {

	if (tree.type === "group") {
		return {
			[tree.operator]: tree.children.map((child) => serialize(child))
		};
	} else {
		let value = tree.value;

		if (tree.field && tree.value instanceof Date) {
			value = formatDate(tree.value);
		}

		if (Array.isArray(tree.value) && tree.value[0] instanceof Date) {
			value = tree.value.map((d: Date) => formatDate(d));
		}

		return {
			field: tree.field, operator: tree.operator, value
		};
	}
}


//  Deserialize JSON format into internal tree structure
export function deserialize(json: any, genId: () => string): (any) {
	if (json.and || json.or) {
		const operator = json.and ? "and" : "or";
		return {
			id: genId(),
			type: "group",
			operator,
			children: json[operator].map((c: any) => deserialize(c, genId)),
		};
	}

	return {
		id: genId(),
		type: "condition",
		field: json.field,
		operator: json.operator,
		value: json.value,
	};
}
