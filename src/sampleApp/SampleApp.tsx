// src/example/ExampleApp.tsx
import { useState } from "react";
import { FilterBuilder } from "../lib";
import { userSchema, productSchema, operators } from "./datasets";

export default function SampleApp() {
  const [output, setOutput] = useState<any>(null);

  const initialUserFilter = {
    and: [
      { field: "age", operator: "gt", value: 30 },
      {
        or: [
          { field: "role", operator: "eq", value: "admin" },
          { field: "isActive", operator: "eq", value: true },
        ],
      },
    ],
  };

  return (
    <div className="flex flex-wrap w-dvw px-[10vw]">
      <div className="w-2/3 pl-5">
        <h1>Filter Builder Demo</h1>

        {/* <h2>Users</h2>
      <FilterBuilder
        schema={userSchema}
        operators={operators}
        onChange={(json) => setOutput(json)}
      />

      <h2>Products</h2>
      <FilterBuilder
        schema={productSchema}
        operators={operators}
        onChange={(json) => setOutput(json)}
      /> */}
        <h2>Test</h2>
        <FilterBuilder
          schema={userSchema}
          operators={operators}
          initialJson={initialUserFilter}
          onChange={(json) => setOutput(json)}
        />
      </div>

      <div className="w-1/3">
        <h2>Live JSON</h2>
        <pre className="bg-gray-200 p-5 rounded-xl">
          {JSON.stringify(output, null, 2)}
        </pre>
      </div>
    </div>
  );
}
