// src/example/ExampleApp.tsx
import { useState } from "react";
import { FilterBuilder } from "../lib";
import { userSchema, productSchema, operators } from "./datasets";
import type { ApiConfig } from "../lib/constants/types";

export default function SampleApp() {
  const [output, setOutput] = useState<any>(null);
  const getConfig: ApiConfig = {
    mode: "GET",
    url: "https://jsonplaceholder.typicode.com/users",
    queryParam: "filters",
  };

  const postConfig: ApiConfig = {
    mode: "POST",
    url: "https://jsonplaceholder.typicode.com/products",
  };

  const initialUserFilter = {
    and: [
      { field: "age", operator: "gt", value: 30 },
      {
        field: "role",
        operator: "in",
        value: ["15", "65", "65", "65"],
      },
      {
        or: [
          { field: "role", operator: "eq", value: "admin" },
          { field: "isActive", operator: "eq", value: true },
        ],
      },
    ],
  };

  return (
    <div className="flex flex-wrap w-vw px-[10vw] py-[5vh]">
      <div className="w-2/3 pr-5">
        <h2 className="text-2xl font-bold mb-5">Filter Builder Demo</h2>

        <h4>User schema</h4>
        <FilterBuilder
          schema={userSchema}
          operators={operators}
          apiConfig={getConfig}
          onChange={(json) => setOutput(json)}
        />

        <h4>Product schema</h4>
        <FilterBuilder
          schema={productSchema}
          operators={operators}
          apiConfig={postConfig}
          onChange={(json) => setOutput(json)}
        />

        <h4>Test with initial schema</h4>
        <FilterBuilder
          schema={userSchema}
          operators={operators}
          initialJson={initialUserFilter}
          apiConfig={{
            mode: "POST",
            url: "https://jsonplaceholder.typicode.com/products",
          }}
          onChange={(json) => setOutput(json)}
          onApply={(res) =>
            console.log("Applied filters, server returned:", res)
          }
        />
      </div>

      <div className="w-1/3">
        <h1 className="text-2xl font-bold mb-[50px]">Current Schema Live JSON</h1>
        <pre className="bg-gray-200 p-5 rounded-xl">
          {JSON.stringify(output, null, 2)}
        </pre>
      </div>
    </div>
  );
}
