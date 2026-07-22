import type { QuizAttempt } from "../../domain/attempt.types";
import type { Answer, Question, Quiz } from "../../domain/quiz.types";

const STORAGE_KEY = "local-quiz-app.active-attempt.v1";

export interface ActiveQuizSession {
  quiz: Quiz;
  attempt: QuizAttempt;
}

export interface ActiveAttemptRepository {
  get(): ActiveQuizSession | null;
  save(session: ActiveQuizSession): void;
  clear(): void;
}

export function createActiveAttemptRepository(
  storage: Storage = window.localStorage,
): ActiveAttemptRepository {
  return {
    get() {
      return readActiveSession(storage);
    },
    save(session) {
      storage.setItem(STORAGE_KEY, JSON.stringify(session));
    },
    clear() {
      storage.removeItem(STORAGE_KEY);
    },
  };
}

function readActiveSession(storage: Storage): ActiveQuizSession | null {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === null) {
      return null;
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!isActiveQuizSession(parsed)) {
      storage.removeItem(STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    try {
      storage.removeItem(STORAGE_KEY);
    } catch {
      return null;
    }
    return null;
  }
}

function isActiveQuizSession(value: unknown): value is ActiveQuizSession {
  if (!isRecord(value)) {
    return false;
  }

  return isQuiz(value.quiz) && isQuizAttempt(value.attempt);
}

function isQuiz(value: unknown): value is Quiz {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    Array.isArray(value.questions) &&
    value.questions.every(isQuestion)
  );
}

function isQuestion(value: unknown): value is Question {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    (value.type === "multiple-choice" || value.type === "true-false") &&
    typeof value.prompt === "string" &&
    Array.isArray(value.answers) &&
    value.answers.every(isAnswer) &&
    typeof value.correctAnswerId === "string" &&
    typeof value.definition === "string"
  );
}

function isAnswer(value: unknown): value is Answer {
  if (!isRecord(value)) {
    return false;
  }

  return typeof value.id === "string" && typeof value.text === "string";
}

function isQuizAttempt(value: unknown): value is QuizAttempt {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.quizId === "string" &&
    typeof value.quizName === "string" &&
    value.status === "active" &&
    typeof value.startedAt === "string" &&
    typeof value.elapsedSeconds === "number" &&
    Array.isArray(value.questionOrder) &&
    value.questionOrder.every((item) => typeof item === "string") &&
    Array.isArray(value.questions) &&
    value.questions.every(isAttemptQuestion) &&
    typeof value.currentQuestionIndex === "number"
  );
}

function isAttemptQuestion(value: unknown): boolean {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.questionId === "string" &&
    Array.isArray(value.answerOrder) &&
    value.answerOrder.every((item) => typeof item === "string") &&
    (typeof value.selectedAnswerId === "string" ||
      value.selectedAnswerId === undefined) &&
    typeof value.isLocked === "boolean" &&
    (typeof value.isCorrect === "boolean" || value.isCorrect === undefined)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
