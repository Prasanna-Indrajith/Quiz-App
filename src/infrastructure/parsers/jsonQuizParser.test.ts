import { describe, expect, it } from "vitest";
import { parseJsonQuiz } from "./jsonQuizParser";

describe("parseJsonQuiz", () => {
  it("parses valid JSON quiz content", () => {
    const result = parseJsonQuiz(
      JSON.stringify({
        quizName: "Sample Quiz",
        questions: [
          {
            type: "multiple-choice",
            question: "Capital?",
            answers: ["London", "Paris"],
            correctAnswer: 2,
            definition: "Paris is correct.",
          },
        ],
      }),
    );

    expect(result.valid).toBe(true);
    expect(result.value?.quizName).toBe("Sample Quiz");
  });

  it("returns a parse error for invalid JSON", () => {
    const result = parseJsonQuiz("{");

    expect(result.valid).toBe(false);
    expect(result.errors[0].code).toBe("json.invalidSyntax");
  });
});
