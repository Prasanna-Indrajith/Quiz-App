import { useReducer, useState } from "react";
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
import { createLocalHistoryRepository } from "../infrastructure/storage/localHistoryRepository";

export function App() {
  const [view, setView] = useState<AppView>("import");
  const [loadedQuiz, setLoadedQuiz] = useState<Quiz | null>(null);
  const [attempt, dispatch] = useReducer(quizReducer, null);
  const [completedAttempt, setCompletedAttempt] = useState<QuizAttempt | null>(
    null,
  );

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

    dispatch({ type: "COMPLETE_ATTEMPT", completedAt });
    setCompletedAttempt(completed);
    setView("results");
  };

  const loadAnotherQuiz = () => {
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
