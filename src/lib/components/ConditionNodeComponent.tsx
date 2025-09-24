import type { ConditionNode, Schema, OperatorsMap } from "../constants/types";
import { validateCondition } from "../utils/validation-condition";
import DatePicker from "react-datepicker";

type Props = {
  condition: ConditionNode;
  schema: Schema;
  operators: OperatorsMap;
  onChange: (updated: ConditionNode) => void;
  onRemove: () => void;
};

export function Condition({
  condition,
  schema,
  operators,
  onChange,
  onRemove,
}: Props) {
  const fieldType = schema[condition.field];
  const validation = validateCondition(condition);

  const renderValueInput = () => {
    if (!condition.operator) return null;

    // Null-type operators skip value input
    if (["is null", "is not null"].includes(condition.operator)) return null;

    switch (fieldType) {
      case "number":
        if (condition.operator === "between") {
          const values = Array.isArray(condition.value)
            ? condition.value
            : ["", ""];

          return (
            <div className="flex gap-2">
              <input
                type="number"
                value={values[0]}
                onChange={(e) => {
                  const newVals = [Number(e.target.value), values[1]];
                  onChange({ ...condition, value: newVals });
                }}
              />
              <input
                type="number"
                value={values[1]}
                onChange={(e) => {
                  const newVals = [values[0], Number(e.target.value)];
                  onChange({ ...condition, value: newVals });
                }}
              />
            </div>
          );
        }
        return (
          <input
            type="number"
            value={condition.value ?? ""}
            onChange={(e) =>
              onChange({ ...condition, value: Number(e.target.value) })
            }
          />
        );

      case "boolean":
        return (
          <select
            value={String(condition.value ?? "")}
            onChange={(e) =>
              onChange({ ...condition, value: e.target.value === "true" })
            }
          >
            <option value="" hidden>
              Select option
            </option>
            <option value="true">true</option>
            <option value="false">false</option>
          </select>
        );

      case "date":
        if (condition.operator === "between") {
          const values = Array.isArray(condition.value)
            ? condition.value
            : [null, null];
          return (
            <div className="flex gap-2">
              <DatePicker
                selected={values[0] ? new Date(values[0]) : null}
                onChange={(date) => {
                  const newVals = [date, values[1]];
                  onChange({ ...condition, value: newVals });
                }}
                className="border p-1 rounded"
                placeholderText="Start date"
              />
              <DatePicker
                selected={values[1] ? new Date(values[1]) : null}
                onChange={(date) => {
                  const newVals = [values[0], date];
                  onChange({ ...condition, value: newVals });
                }}
                className="border p-1 rounded"
                placeholderText="End date"
              />
            </div>
          );
        }
        return (
          <DatePicker
            selected={condition.value ? new Date(condition.value) : null}
            onChange={(date) => onChange({ ...condition, value: date })}
            className="border p-1 rounded"
            placeholderText="Select date"
          />
        );

      default:
        return (
          <input
            type="text"
            value={condition.value ?? ""}
            onChange={(e) => onChange({ ...condition, value: e.target.value })}
          />
        );
    }
  };

  return (
    <div className="mb-2 p-2 border-gray-500 rounded-xl">
      <div className="flex gap-2 items-center">
        {/* field select */}
        <select
          value={condition.field}
          onChange={(e) =>
            onChange({
              ...condition,
              field: e.target.value,
              operator: "",
              value: "",
            })
          }
        >
          <option value="" hidden>
            Select a field
          </option>
          {Object.keys(schema).map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        {/* operator select */}
        {condition.field && (
          <select
            value={condition.operator}
            onChange={(e) =>
              onChange({ ...condition, operator: e.target.value })
            }
          >
            <option value="" hidden>
              Select an operation
            </option>
            {operators[schema[condition.field]].map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </select>
        )}

        {/* value input, removed after initial test to render condition based value input */}
        {/* {condition.operator &&
          !["is null", "is not null"].includes(condition.operator) && (
            <input
              className="border p-1 rounded flex-1"
              type={fieldType === "number" ? "number" : "text"}
              value={condition.value ?? ""}
              onChange={(e) => {
                let val: any = e.target.value;
                if (fieldType === "number") val = Number(val);
                if (fieldType === "boolean") val = val === "true";
                onChange({ ...condition, value: val });
              }}
            />
          )} */}

        {/* the real value input field based on operator conditions  */}
        {renderValueInput()}

        <button
          title="Remove condition"
          onClick={onRemove}
          className="btn-delete ml-2"
        >
          &#x2715;
        </button>
      </div>

      {/* validation */}
      {!validation.valid && (
        <p className="text-red-500 text-sm mt-2">{validation.error}</p>
      )}
    </div>
  );
}
