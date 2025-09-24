import {
  type ConditionNode,
  type GroupNode,
  type Schema,
  type OperatorsMap,
  generateId,
} from "../constants/types";
import { validateGroup } from "../utils/validation-group";
import { Condition } from "./ConditionNodeComponent";

type Props = {
  group: GroupNode;
  schema: Schema;
  operators: OperatorsMap;
  onChange: (updated: GroupNode) => void;
  onRemove?: () => void;
};

export function Group({ group, schema, operators, onChange, onRemove }: Props) {
  const validation = validateGroup(group);

  const updateChild = (i: number, child: ConditionNode | GroupNode) => {
    const newChildren = [...group.children];
    newChildren[i] = child;
    onChange({ ...group, children: newChildren });
  };

  const removeChild = (i: number) => {
    const newChildren = [...group.children];
    newChildren.splice(i, 1);
    onChange({ ...group, children: newChildren });
  };

  const addCondition = () => {
    const condition: ConditionNode = {
      id: generateId(),
      type: "condition",
      field: "",
      operator: "",
      value: "",
    };

    onChange({ ...group, children: [...group.children, condition] });
  };

  const addGroup = () => {
    const groupNode: GroupNode = {
      id: generateId(),
      type: "group",
      operator: "and",
      children: [],
    };

    onChange({ ...group, children: [...group.children, groupNode] });
  };

  return (
    <div className="border border-gray-300 rounded-xl py-5 px-3 m-2 {!validation.valid && !group.children.length ? 'bg-amber-500 : ''}">
      <div className="flex gap-2 items-center mb-5">
        <div className="w-fit">
          <select
            value={group.operator}
            onChange={(e) =>
              onChange({ ...group, operator: e.target.value as "and" | "or" })
            }
          >
            <option value="and">AND</option>
            <option value="or">OR</option>
          </select>
        </div>

        <button onClick={addCondition}>+ Condition</button>

        <button onClick={addGroup}>+ Group</button>

        {onRemove && (
          <button
            title="Remove group"
            onClick={onRemove}
            className="btn-delete ml-2"
          >
            &#x2715;
          </button>
        )}
      </div>

      {/* validation error */}
      {!validation.valid && !group.children.length && (
        <p className="text-red-500 text-sm mt-1">{validation.error}</p>
      )}
      <div>
        {group.children.map((child, index) =>
          child.type === "condition" ? (
            <Condition
              key={child.id}
              condition={child}
              schema={schema}
              operators={operators}
              onChange={(conditionNode) => updateChild(index, conditionNode)}
              onRemove={() => removeChild(index)}
            />
          ) : (
            <Group
              key={child.id}
              group={child}
              schema={schema}
              operators={operators}
              onChange={(groupNode) => updateChild(index, groupNode)}
              onRemove={() => removeChild(index)}
            />
          )
        )}
      </div>
    </div>
  );
}
