import { describe, expect, it } from "vitest";
import type { ActiveQuizSession } from "./activeAttemptRepository";
import { createActiveAttemptRepository } from "./activeAttemptRepository";

const session: ActiveQuizSession = {
  quiz: {
    id: "quiz-sample",
    name: "Sample Quiz",
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        prompt: "Capital?",
        answers: [
          { id: "a1", text: "London" },
          { id: "a2", text: "Paris" },
        ],
        correctAnswerId: "a2",
        definition: "Paris is correct.",
      },
    ],
  },
  attempt: {
    id: "attempt-1",
    quizId: "quiz-sample",
    quizName: "Sample Quiz",
    status: "active",
    startedAt: "2026-07-22T00:00:00.000Z",
    elapsedSeconds: 12,
    questionOrder: ["q1"],
    currentQuestionIndex: 0,
    questions: [
      {
        questionId: "q1",
        answerOrder: ["a2", "a1"],
        selectedAnswerId: "a2",
        isLocked: true,
        isCorrect: true,
      },
    ],
  },
};

describe("createActiveAttemptRepository", () => {
  it("saves and restores active quiz progress", () => {
    const storage = new MemoryStorage();
    const repository = createActiveAttemptRepository(storage);

    repository.save(session);

    expect(repository.get()).toEqual(session);
  });

  it("returns null when no active session exists", () => {
    const repository = createActiveAttemptRepository(new MemoryStorage());

    expect(repository.get()).toBeNull();
  });

  it("clears saved active progress", () => {
    const repository = createActiveAttemptRepository(new MemoryStorage());

    repository.save(session);
    repository.clear();

    expect(repository.get()).toBeNull();
  });

  it("recovers from corrupt active session JSON", () => {
    const storage = new MemoryStorage();
    storage.setItem("local-quiz-app.active-attempt.v1", "{");
    const repository = createActiveAttemptRepository(storage);

    expect(repository.get()).toBeNull();
  });

  it("rejects completed attempts as active sessions", () => {
    const storage = new MemoryStorage();
    storage.setItem(
      "local-quiz-app.active-attempt.v1",
      JSON.stringify({
        ...session,
        attempt: { ...session.attempt, status: "completed" },
      }),
    );
    const repository = createActiveAttemptRepository(storage);

    expect(repository.get()).toBeNull();
  });
});

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>();

  get length(): number {
    return this.values.size;
  }

  clear(): void {
    this.values.clear();
  }

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  key(index: number): string | null {
    return Array.from(this.values.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}
