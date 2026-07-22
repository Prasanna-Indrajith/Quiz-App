import { describe, expect, it } from "vitest";
import { parseCsvQuiz } from "./csvQuizParser";

const validCsv =
  'quizName,type,question,answers,correctAnswer,definition\nSample Quiz,multiple-choice,Capital?,"[""London"",""Paris""]",2,Paris is correct.\nSample Quiz,true-false,Earth is flat?,"[""True"",""False""]",2,Earth is approximately spherical.\n';

describe("parseCsvQuiz", () => {
  it("parses valid CSV quiz content", () => {
    const result = parseCsvQuiz(validCsv);

    expect(result.valid).toBe(true);
    expect(result.value?.questions[0].answers).toEqual(["London", "Paris"]);
    expect(result.value?.questions[0].correctAnswer).toBe(2);
  });

  it("reports missing headers", () => {
    const result = parseCsvQuiz("quizName,type\nSample,type\n");

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ code: "csv.missingHeader", field: "question" }),
    );
  });

  it("reports invalid answers JSON with row numbers", () => {
    const result = parseCsvQuiz(
      "quizName,type,question,answers,correctAnswer,definition\nSample Quiz,multiple-choice,Capital?,Paris,1,Definition\n",
    );

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        code: "csv.answersInvalidJson",
        rowNumber: 2,
      }),
    );
  });

  it("rejects mixed quiz names", () => {
    const result = parseCsvQuiz(
      `${validCsv}Other Quiz,multiple-choice,Capital?,"[""London"",""Paris""]",2,Paris is correct.\n`,
    );

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ code: "csv.mixedQuizNames" }),
    );
  });
});
