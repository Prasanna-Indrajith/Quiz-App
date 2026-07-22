import type { QuizAttempt } from "./attempt.types";

export interface QuizScore {
  correctAnswers: number;
  totalQuestions: number;
  scorePercent: number;
}

export function calculateScore(attempt: QuizAttempt): QuizScore {
  const totalQuestions = attempt.questions.length;
  const correctAnswers = attempt.questions.filter(
    (question) => question.isCorrect === true,
  ).length;

  return {
    correctAnswers,
    totalQuestions,
    scorePercent:
      totalQuestions === 0
        ? 0
        : Math.round((correctAnswers / totalQuestions) * 100),
  };
}
