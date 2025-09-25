import { render, screen, fireEvent } from "@testing-library/react";
import { describe, vi, expect } from "vitest";
import { FilterBuilder } from "../components/FilterBuilder";
import { userSchema, operators } from "../../sampleApp/datasets";
import * as api from "./api-config";

describe("FilterBuilder manual apply", () => {
  test("calls sendFilters when Apply Filters is clicked", async () => {
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
        onChange={mockApply}
      />
    );

    const button = screen.getByText("Apply filters");
    fireEvent.click(button);

    expect(mockSend).toHaveBeenCalled();

    await new Promise((r) => setTimeout(r, 0));

    expect(mockApply).toHaveBeenCalledWith({ ok: true });
  });

  test("does not call API if validation fails", async () => {
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
        onChange={mockApply}
      />
    );

    const button = screen.getByText("Apply filters");

    // expect(button).toBeDisabled();

    fireEvent.click(button);

    expect(mockSend).not.toHaveBeenCalled();
    expect(mockApply).not.toHaveBeenCalled();
  });
});
