import { useEffect, useState } from "react";

import {
  type ConditionNode,
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
};

export function FilterBuilder({
  schema,
  operators,
  initialJson,
  onChange,
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

  useEffect(() => {
    if (onChange) {
      const validation = validateGroup(tree);
      // onChange(serialize(tree));

      validation.valid
        ? onChange(serialize(tree))
        : onChange({ error: validation.error });
    }
  
  }, [tree]);

  return (
    <div>
      <Group
        group={tree}
        schema={schema}
        operators={operators}
        onChange={setTree}
      />
    </div>
  );
}
