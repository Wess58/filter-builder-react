import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, vi, expect } from "vitest";
import { FilterBuilder } from "../components/FilterBuilder";
import { userSchema, operators } from "../../sampleApp/datasets";
import * as api from "../utils/api-config";

describe("FilterBuilder manual apply", () => {
  test("fires onChange while editing and calls sendFilters only on Apply", async () => {
    const mockSend = vi
      .spyOn(api, "sendFilters")
      .mockResolvedValue({ ok: true });
    const mockApply = vi.fn();
    const mockChange = vi.fn();

    render(
      <FilterBuilder
        schema={userSchema}
        operators={operators}
        apiConfig={{ mode: "POST", url: "http://test.com" }}
        onApply={mockApply}
        onChange={mockChange}
      />
    );

    fireEvent.click(screen.getByText("+ Condition"));

    fireEvent.change(screen.getByLabelText("Select a field"), {
      target: { value: "age" },
    });

    fireEvent.change(screen.getByLabelText("Select a operation"), {
      target: { value: "gt" },
    });

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "25" },
    });

    expect(mockChange).toHaveBeenCalled();
    const lastChange = mockChange.mock.lastCall?.[0];
    expect(lastChange).toMatchObject({
      and: [{ field: "age", operator: "gt", value: 25 }],
    });

    expect(mockSend).not.toHaveBeenCalled();
    expect(mockApply).not.toHaveBeenCalled();

    fireEvent.click(screen.getByText("Apply filters"));

    expect(mockSend).toHaveBeenCalled();

    await new Promise((r) => setTimeout(r, 0));

    expect(mockApply).toHaveBeenCalledWith({ ok: true });
  });
});
