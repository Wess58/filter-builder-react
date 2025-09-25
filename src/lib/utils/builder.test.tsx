import { render, screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/dom";
import { describe, test, expect, vi } from "vitest";
import { FilterBuilder } from "../components/FilterBuilder";
import { userSchema, operators } from "../../sampleApp/datasets";
import * as api from "../utils/api-config";

// helper: quickly add a valid numeric condition
function addValidCondition() {
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
}

describe("FilterBuilder manual Apply", () => {
  test("calls onChange while editing and triggers API + onApply when Apply is clicked", async () => {
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

    // Add a valid condition
    addValidCondition();

    // ✅ onChange should have been called
    expect(mockChange).toHaveBeenCalled();
    const lastChange = mockChange.mock.calls.at(-1)[0];
    expect(lastChange).toMatchObject({
      and: [{ field: "age", operator: "gt", value: 25 }],
    });

    // ✅ Apply should now be enabled
    const applyButton = screen.getByLabelText("Apply filters");
    expect(applyButton).not.toBeDisabled();

    // Click Apply
    fireEvent.click(applyButton);

    // ✅ API should be called
    expect(mockSend).toHaveBeenCalled();

    // wait for async
    await new Promise((r) => setTimeout(r, 0));

    // ✅ onApply should receive mocked response
    expect(mockApply).toHaveBeenCalledWith({ ok: true });
  });

  test("Apply does nothing if group invalid", async () => {
    const mockSend = vi
      .spyOn(api, "sendFilters")
      .mockResolvedValue({ ok: true });
    const mockApply = vi.fn();

    render(
      <FilterBuilder
        schema={userSchema}
        operators={operators}
        apiConfig={{ mode: "POST", url: "http://test.com" }}
        onApply={mockApply}
        onChange={() => {}}
      />
    );

    const applyButton = screen.getByLabelText("Apply filters");

    // Initially invalid, so disabled
    expect(applyButton).toBeDisabled();

    fireEvent.click(applyButton);

    // ✅ No API call, no onApply
    expect(mockSend).not.toHaveBeenCalled();
    expect(mockApply).not.toHaveBeenCalled();
  });
});
