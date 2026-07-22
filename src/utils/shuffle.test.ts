import { describe, expect, it } from "vitest";
import { shuffle } from "./shuffle";

describe("shuffle", () => {
  it("uses Fisher-Yates without mutating the source array", () => {
    const source = [1, 2, 3, 4];
    const randomValues = [0, 0, 0];
    const shuffled = shuffle(source, () => randomValues.shift() ?? 0);

    expect(shuffled).toEqual([2, 3, 4, 1]);
    expect(source).toEqual([1, 2, 3, 4]);
  });
});
