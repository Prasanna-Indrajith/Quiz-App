import { Button } from "../../components/Button/Button";
import { TimerDisplay } from "../../components/TimerDisplay/TimerDisplay";
import type { QuizAttempt } from "../../domain/attempt.types";
import { calculateScore } from "../../domain/quiz.scoring";
import type { Quiz } from "../../domain/quiz.types";
import { t } from "../../i18n";
import { AnswerReview } from "./AnswerReview";

interface ResultsPageProps {
  quiz: Quiz;
  attempt: QuizAttempt;
  onRetry: () => void;
  onLoadAnother: () => void;
}

export function ResultsPage({
  quiz,
  attempt,
  onRetry,
  onLoadAnother,
}: ResultsPageProps) {
  const score = calculateScore(attempt);

  return (
    <main className="app-shell">
      <section className="panel stack">
        <div className="page-header">
          <div>
            <h1>Results</h1>
            <p>{quiz.name}</p>
          </div>
          <TimerDisplay elapsedSeconds={attempt.elapsedSeconds} />
        </div>
        <section className="score-panel">
          <strong>
            {score.correctAnswers} / {score.totalQuestions}
          </strong>
          <span>{score.scorePercent}%</span>
        </section>
        <div className="button-row">
          <Button type="button" variant="primary" onClick={onRetry}>
            {t("retryQuiz")}
          </Button>
          <Button type="button" onClick={onLoadAnother}>
            Load another quiz
          </Button>
        </div>
        <AnswerReview quiz={quiz} attempt={attempt} />
      </section>
    </main>
  );
}
