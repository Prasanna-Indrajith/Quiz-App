import { describe, expect, it } from "vitest";
import { normalizeQuiz } from "./quiz.normalizer";
import { createRandomizedAttempt } from "./quiz.randomizer";
import type { RawQuiz } from "./quiz.types";

describe("createRandomizedAttempt", () => {
  it("creates shuffled question and answer orders without mutating the quiz", () => {
    const rawQuiz: RawQuiz = {
      quizName: "Sample Quiz",
      questions: [
        {
          type: "multiple-choice",
          question: "Capital?",
          answers: ["London", "Paris", "Berlin"],
          correctAnswer: 2,
          definition: "Paris is correct.",
        },
        {
          type: "true-false",
          question: "Earth is flat.",
          answers: ["True", "False"],
          correctAnswer: 2,
          definition: "Earth is approximately spherical.",
        },
      ],
    };
    const quiz = normalizeQuiz(rawQuiz);
    const originalQuestionIds = quiz.questions.map((question) => question.id);
    const randomValues = [0, 0, 0];
    const attempt = createRandomizedAttempt(
      quiz,
      () => randomValues.shift() ?? 0,
      new Date("2026-07-22T00:00:00.000Z"),
    );

    expect(attempt.questionOrder).toEqual([...originalQuestionIds].reverse());
    expect(attempt.questions[0].answerOrder).toHaveLength(3);
    expect(quiz.questions.map((question) => question.id)).toEqual(
      originalQuestionIds,
    );
    expect(quiz.questions[0].correctAnswerId).toBe("quiz-sample-quiz-q1-a2");
  });
});
