import { describe, expect, it } from "vitest";
import { normalizeQuiz } from "./quiz.normalizer";
import type { RawQuiz } from "./quiz.types";

describe("normalizeQuiz", () => {
  it("assigns stable IDs and converts correct answer position to answer ID", () => {
    const rawQuiz: RawQuiz = {
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
    };

    const quiz = normalizeQuiz(rawQuiz);

    expect(quiz.id).toBe("quiz-sample-quiz");
    expect(quiz.questions[0].id).toBe("quiz-sample-quiz-q1");
    expect(quiz.questions[0].correctAnswerId).toBe("quiz-sample-quiz-q1-a2");
  });
});
