import { useEffect, useState } from "react";

import {
  type GroupNode,
  type OperatorsMap,
  type Schema,
  type ApiConfig,
  generateId,
} from "../constants/types";

import { Group } from "./GroupNodeComponent";
import { deserialize, serialize } from "../utils/serialization";
import { validateGroup } from "../utils/validation-group";
import { sendFilters } from "../utils/api-config";

type Props = {
  schema: Schema;
  operators: OperatorsMap;
  initialJson?: any;
  onChange: (json: any) => void;
  apiConfig?: ApiConfig;
  onApply?: (response: any) => void;
};

export function FilterBuilder({
  schema,
  operators,
  initialJson,
  onChange,
  apiConfig,
  onApply,
}: Props) {
  const [tree, setTree] = useState<GroupNode>(
    initialJson
      ? deserialize(initialJson, generateId)
      : {
          id: generateId(),
          type: "group",
          operator: "and",
          children: [],
        }
  );

  const [validation, setValidation] = useState<{
    valid: boolean;
    error?: string;
  }>({
    valid: false,
  });

  useEffect(() => {
    if (onChange) {
      const validation = validateGroup(tree);
      setValidation(validation);

      validation.valid
        ? onChange(serialize(tree))
        : onChange({ error: validation.error });
    }
  }, [tree]);

  const handleApply = async () => {
    if (!apiConfig || !validation.valid) return;

    const response = await sendFilters(tree, apiConfig);
    onApply?.(response);
  };

  return (
    <div>
      <Group
        group={tree}
        schema={schema}
        operators={operators}
        onChange={setTree}
      />

      {apiConfig && (
        <button
          onClick={handleApply}
          aria-label="Apply filters"
          className="btn-apply-filter"
          disabled={!validation.valid}
          role="button"
        >
          Apply filters
        </button>
      )}

      {/* {!validation.valid && (
        <p className="text-red-500 text-sm mt-1">{validation.error}</p>
      )} */}
    </div>
  );
}
