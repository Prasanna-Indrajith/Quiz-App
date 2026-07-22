import type { QuizResultSummary } from "../../domain/quiz.types";

const STORAGE_KEY = "local-quiz-app.results.v1";
const MAX_HISTORY_ITEMS = 100;

export interface HistoryRepository {
  getAll(): QuizResultSummary[];
  add(result: QuizResultSummary): QuizResultSummary[];
  clear(): void;
}

export function createLocalHistoryRepository(
  storage: Storage = window.localStorage,
): HistoryRepository {
  return {
    getAll() {
      return readHistory(storage);
    },
    add(result) {
      const nextHistory = [result, ...readHistory(storage)].slice(
        0,
        MAX_HISTORY_ITEMS,
      );
      writeHistory(storage, nextHistory);
      return nextHistory;
    },
    clear() {
      storage.removeItem(STORAGE_KEY);
    },
  };
}

function readHistory(storage: Storage): QuizResultSummary[] {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === null) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      storage.removeItem(STORAGE_KEY);
      return [];
    }

    return parsed.filter(isQuizResultSummary).slice(0, MAX_HISTORY_ITEMS);
  } catch {
    try {
      storage.removeItem(STORAGE_KEY);
    } catch {
      return [];
    }
    return [];
  }
}

function writeHistory(
  storage: Storage,
  history: readonly QuizResultSummary[],
): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(history));
}

function isQuizResultSummary(value: unknown): value is QuizResultSummary {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.id === "string" &&
    typeof record.quizName === "string" &&
    typeof record.completedAt === "string" &&
    typeof record.correctAnswers === "number" &&
    typeof record.totalQuestions === "number" &&
    typeof record.scorePercent === "number"
  );
}
