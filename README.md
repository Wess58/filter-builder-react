# 🔍 React Filter Builder Library

A reusable, dataset-agnostic **Filter Builder** built with **React + TypeScript**.  
It allows users to construct arbitrary nested filter conditions (`and`/`or` groups) and serialize them into JSON for server integration.  

Supports:
- Dynamic schemas (fields & operators configurable)
- Type-aware inputs (string, number, boolean, date, array)
- Validation rules
- JSON serialization/deserialization
- API integration (GET query string or POST JSON body)
- Accessibility (ARIA, keyboard navigation, focus states)
- Tailwind styling (lightweight, customizable)

---

## Setup Instructions

### 1. Clone & Install
```bash
git clone https://github.com/Wess58/filter-builder-react.git
cd filter-builder
npm install
```

### 2. Run Dev Demo App
```bash 
npm run dev
```
This launches the example playground with sample schemas.

## Example Usage
```ts
import { FilterBuilder } from "filter-builder";
import { Schema, OperatorsMap } from "filter-builder/types";

// SCHEMA TYPE
const userSchema: Schema = {
  age: "number",
  role: "string",
  isActive: "boolean",
  createdAt: "date",
};

// SUPPORTED OPERATORS MAP
const operators: OperatorsMap = {
  string: ["eq", "neq", "contains", "starts_with", "ends_with", "in"],
  number: ["eq", "neq", "gt", "lt", "between"],
  boolean: ["eq", "neq"],
  date: ["eq", "neq", "before", "after", "between"],
};

export default function App() {
  return (
    <FilterBuilder
      schema={userSchema}
      operators={operators}
      apiConfig={{
        mode: "POST", // or "GET"
        url: "https://example.com/api/users",
        queryParam: "filters", // only used in GET mode
      }}
      onChange={(json) => console.log("Live JSON:", json)}
      onApply={(res) => console.log("API response:", res)}
    />
  );
}
```

## Config API
```ts
schema: Schema
```

Defines available fields and their types.
```ts
type FieldType = "string" | "number" | "boolean" | "date";
type Schema = Record<string, FieldType>;
```

```ts
operators: OperatorsMap
```
Operators allowed per field type.
```ts
type OperatorsMap = {
  string: string[];
  number: string[];
  boolean: string[];
  date: string[];
};
```
```
initialJson?: any
```
Optional JSON to preload (deserialized into UI).
```ts
onChange?: (json: any | { error: string }) => void
```
Callback fired on every change:
- Emits valid JSON when valid
- Emits { error } when invalid

```ts
apiConfig?: { mode: "GET" | "POST"; url: string; queryParam?: string }
```
Optional auto-wiring to backend:
- `GET` → serialized JSON as query string param
- `POST` → serialized JSON in body

```ts
onApply?: (response: any) => void
```
Callback when Apply button is clicked and API call resolves.

## Example JSON Output
```ts
{
  "and": [
    { "field": "age", "operator": "gt", "value": 25 },
    { "field": "role", "operator": "in", "value": ["admin", "user"] }
  ]
}
```

## Architecture Choices
##### React + TypeScript
Provides type safety, schema validation and easy extensibility.

##### Schema-driven
Fields & operators are provided by config, making the library dataset-agnostic.

##### Recursive Tree Structure
Groups (and/or) can contain conditions or other groups.
This allows deeply nested logical expressions.

##### Serialization & Deserialization
Filters can be saved as JSON, re-loaded and re-edited in the UI.

##### Validation
Inline validation rules enforce correct filter input:

- `between` → requires two values
- `in` → requires array of values
- `is null/is not null` → require no value

##### Accessibility
ARIA roles, labels and focus styles make it usable with screen readers and keyboards.

##### Styling with Tailwind
Provides a clean baseline while remaining customizable.

##### Testing
Unit tests for utils (serialization, validation, API).
Integration tests for user flows (add/edit/remove conditions, groups, apply filters).


