export type FieldType = "string" | "number" | "boolean" | "date";

export const generateId = () => Math.random().toString(36).substring(2, 9);

export const groupOperatorsList: string[] = ['and', 'or'];

export type ConditionNode = {
	id: string;
	type: "condition";
	field: string;
	operator: string;
	value: any;
};

export type GroupNode = {
	id: string;
	type: "group";
	operator: "and" | "or";
	children: Array<ConditionNode | GroupNode>;
};

export type Schema = Record<string, FieldType>;

export type OperatorsMap = Record<FieldType, string[]>;

export type FilterJSON = any; 

export type ValidationResult = {
	valid: boolean;
	error?: string;
};

export type ApiConfig = {
	mode: "GET" | "POST";
	url: string;
	queryParam?: string;
};