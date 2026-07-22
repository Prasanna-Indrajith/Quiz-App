import { describe, expect, it } from "vitest";
import type { QuizAttempt } from "./attempt.types";
import { calculateScore } from "./quiz.scoring";

const baseAttempt: QuizAttempt = {
  id: "attempt-1",
  quizId: "quiz-1",
  quizName: "Quiz",
  status: "completed",
  startedAt: "2026-07-22T00:00:00.000Z",
  completedAt: "2026-07-22T00:01:00.000Z",
  elapsedSeconds: 60,
  questionOrder: ["q1", "q2", "q3"],
  currentQuestionIndex: 0,
  questions: [
    { questionId: "q1", answerOrder: ["a1"], isLocked: true, isCorrect: true },
    { questionId: "q2", answerOrder: ["a2"], isLocked: true, isCorrect: false },
    { questionId: "q3", answerOrder: ["a3"], isLocked: true, isCorrect: true },
  ],
};

describe("calculateScore", () => {
  it("calculates correct count, total, and rounded percentage", () => {
    expect(calculateScore(baseAttempt)).toEqual({
      correctAnswers: 2,
      totalQuestions: 3,
      scorePercent: 67,
    });
  });

  it("handles zero questions", () => {
    expect(calculateScore({ ...baseAttempt, questions: [] })).toEqual({
      correctAnswers: 0,
      totalQuestions: 0,
      scorePercent: 0,
    });
  });
});
