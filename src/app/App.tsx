import { useEffect, useReducer, useState } from "react";
import { ErrorBoundary } from "./ErrorBoundary";
import type { AppView } from "./AppRouter";
import type { QuizAttempt } from "../domain/attempt.types";
import { createRandomizedAttempt } from "../domain/quiz.randomizer";
import { calculateScore } from "../domain/quiz.scoring";
import type { Quiz, QuizResultSummary } from "../domain/quiz.types";
import { ImportPage } from "../features/import/ImportPage";
import { QuizPage } from "../features/quiz/QuizPage";
import { quizReducer } from "../features/quiz/quiz.reducer";
import { ResultsPage } from "../features/results/ResultsPage";
import { createActiveAttemptRepository } from "../infrastructure/storage/activeAttemptRepository";
import { createLocalHistoryRepository } from "../infrastructure/storage/localHistoryRepository";

export function App() {
  const restoredSession = createActiveAttemptRepository().get();
  const [view, setView] = useState<AppView>(
    restoredSession ? "quiz" : "import",
  );
  const [loadedQuiz, setLoadedQuiz] = useState<Quiz | null>(
    restoredSession?.quiz ?? null,
  );
  const [attempt, dispatch] = useReducer(
    quizReducer,
    restoredSession?.attempt ?? null,
  );
  const [completedAttempt, setCompletedAttempt] = useState<QuizAttempt | null>(
    null,
  );

  useEffect(() => {
    if (view === "quiz" && loadedQuiz && attempt?.status === "active") {
      createActiveAttemptRepository().save({ quiz: loadedQuiz, attempt });
    }
  }, [attempt, loadedQuiz, view]);

  const startQuiz = (quiz: Quiz) => {
    const nextAttempt = createRandomizedAttempt(quiz);
    setLoadedQuiz(quiz);
    setCompletedAttempt(null);
    dispatch({ type: "START_ATTEMPT", payload: nextAttempt });
    setView("quiz");
  };

  const finishQuiz = (activeAttempt: QuizAttempt) => {
    const completedAt = new Date().toISOString();
    const completed: QuizAttempt = {
      ...activeAttempt,
      status: "completed",
      completedAt,
    };
    const score = calculateScore(completed);
    const result: QuizResultSummary = {
      id: `result-${Date.now()}`,
      quizName: completed.quizName,
      completedAt,
      ...score,
    };

    try {
      createLocalHistoryRepository().add(result);
    } catch {
      // History must not prevent local quiz completion.
    }

    createActiveAttemptRepository().clear();
    dispatch({ type: "COMPLETE_ATTEMPT", completedAt });
    setCompletedAttempt(completed);
    setView("results");
  };

  const loadAnotherQuiz = () => {
    createActiveAttemptRepository().clear();
    setLoadedQuiz(null);
    setCompletedAttempt(null);
    dispatch({ type: "RESET_ATTEMPT" });
    setView("import");
  };

  return (
    <ErrorBoundary>
      {view === "import" ? <ImportPage onStartQuiz={startQuiz} /> : null}
      {view === "quiz" && loadedQuiz && attempt ? (
        <QuizPage
          quiz={loadedQuiz}
          attempt={attempt}
          dispatch={dispatch}
          onFinish={finishQuiz}
          onLoadAnother={loadAnotherQuiz}
        />
      ) : null}
      {view === "results" && loadedQuiz && completedAttempt ? (
        <ResultsPage
          quiz={loadedQuiz}
          attempt={completedAttempt}
          onRetry={() => {
            startQuiz(loadedQuiz);
          }}
          onLoadAnother={loadAnotherQuiz}
        />
      ) : null}
    </ErrorBoundary>
  );
}
