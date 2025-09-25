import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { FilterBuilder } from "../components/FilterBuilder";
import { operators, userSchema } from "../../sampleApp/datasets";

describe("FilterBuilder integration", () => {
  test("user can add a new condition", () => {
    let output: any = null;

    render(
      <FilterBuilder
        schema={userSchema}
        operators={operators}
        onChange={(json) => (output = json)}
      />
    );

    // Add condition
    fireEvent.click(screen.getByText("+ Condition"));

    // Select field
    fireEvent.change(screen.getByLabelText("Select a field"), {
      target: { value: "age" },
    });

    // Select operator
    fireEvent.change(screen.getByLabelText("Select an operation"), {
      target: { value: "gt" },
    });

    // Enter value
    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "30" },
    });

    expect(output).toMatchObject({
      and: [{ field: "age", operator: "gt", value: 30 }],
    });
  });

  test("user can edit a condition value", () => {
    let output: any = null;

    render(
      <FilterBuilder
        schema={userSchema}
        operators={operators}
        onChange={(json) => (output = json)}
      />
    );

    fireEvent.click(screen.getByText("+ Condition"));

    fireEvent.change(screen.getByLabelText("Select a field"), {
      target: { value: "role" },
    });
    fireEvent.change(screen.getByLabelText("Select an operation"), {
      target: { value: "eq" },
    });

    // Edit text input
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "admin" } });

    expect(output).toMatchObject({
      and: [{ field: "role", operator: "eq", value: "admin" }],
    });
  });

  test("user can remove a condition", () => {
    let output: any = null;

    render(
      <FilterBuilder
        schema={userSchema}
        operators={operators}
        onChange={(json) => (output = json)}
      />
    );

    fireEvent.click(screen.getByText("+ Condition"));
    fireEvent.click(screen.getByLabelText("Remove condition"));

    expect(output).toEqual({ and: [] });
  });

  test("user can add a new group", () => {
    let output: any = null;

    render(
      <FilterBuilder
        schema={userSchema}
        operators={operators}
        onChange={(json) => (output = json)}
      />
    );

    fireEvent.click(screen.getByText("+ Group"));

    expect(output).toHaveProperty("and[0].and"); // nested group
  });
});
