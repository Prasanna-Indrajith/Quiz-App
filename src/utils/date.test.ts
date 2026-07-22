import { describe, expect, it } from "vitest";
import { formatElapsedSeconds } from "./date";

describe("formatElapsedSeconds", () => {
  it("formats under one hour as MM:SS", () => {
    expect(formatElapsedSeconds(65)).toBe("01:05");
  });

  it("formats one hour or more as HH:MM:SS", () => {
    expect(formatElapsedSeconds(3661)).toBe("01:01:01");
  });
});
