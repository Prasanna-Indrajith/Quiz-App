import type { QuizAttempt } from "./attempt.types";
import type { Quiz } from "./quiz.types";
import { shuffle } from "../utils/shuffle";

export function createRandomizedAttempt(
  quiz: Quiz,
  random: () => number = Math.random,
  now: Date = new Date(),
): QuizAttempt {
  const startedAt = now.toISOString();

  return {
    id: `attempt-${now.getTime()}`,
    quizId: quiz.id,
    quizName: quiz.name,
    status: "active",
    startedAt,
    elapsedSeconds: 0,
    questionOrder: shuffle(
      quiz.questions.map((question) => question.id),
      random,
    ),
    questions: quiz.questions.map((question) => ({
      questionId: question.id,
      answerOrder: shuffle(
        question.answers.map((answer) => answer.id),
        random,
      ),
      isLocked: false,
    })),
    currentQuestionIndex: 0,
  };
}
