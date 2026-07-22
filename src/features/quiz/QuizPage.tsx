import { useEffect } from "react";
import { Button } from "../../components/Button/Button";
import { ProgressBar } from "../../components/ProgressBar/ProgressBar";
import { TimerDisplay } from "../../components/TimerDisplay/TimerDisplay";
import type { QuizAttempt } from "../../domain/attempt.types";
import type { Quiz } from "../../domain/quiz.types";
import { useBeforeUnloadWarning } from "../../hooks/useBeforeUnloadWarning";
import { useElapsedTimer } from "../../hooks/useElapsedTimer";
import { t } from "../../i18n";
import { AnswerList } from "./AnswerList";
import { FeedbackPanel } from "./FeedbackPanel";
import type { AttemptAction } from "./quiz.reducer";

interface QuizPageProps {
  quiz: Quiz;
  attempt: QuizAttempt;
  dispatch: (action: AttemptAction) => void;
  onFinish: (attempt: QuizAttempt) => void;
  onLoadAnother: () => void;
}

export function QuizPage({
  quiz,
  attempt,
  dispatch,
  onFinish,
  onLoadAnother,
}: QuizPageProps) {
  useBeforeUnloadWarning(true);

  const elapsedSeconds = useElapsedTimer(attempt.startedAt, true);
  const currentQuestionId = attempt.questionOrder[attempt.currentQuestionIndex];
  const question = quiz.questions.find((item) => item.id === currentQuestionId);
  const attemptQuestion = attempt.questions.find(
    (item) => item.questionId === currentQuestionId,
  );
  const answeredCount = attempt.questions.filter((item) => item.isLocked).length;
  const canFinish = answeredCount === attempt.questions.length;

  useEffect(() => {
    dispatch({ type: "UPDATE_ELAPSED_TIME", elapsedSeconds });
  }, [dispatch, elapsedSeconds]);

  if (!question || !attemptQuestion) {
    return (
      <main className="app-shell">
        <section className="panel">
          <h1>{quiz.name}</h1>
          <p>Question data could not be displayed.</p>
          <Button onClick={onLoadAnother}>Load another quiz</Button>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <section className="panel stack">
        <div className="quiz-topbar">
          <div>
            <h1>{quiz.name}</h1>
            <p>
              Question {attempt.currentQuestionIndex + 1} of{" "}
              {attempt.questions.length}
            </p>
          </div>
          <TimerDisplay elapsedSeconds={attempt.elapsedSeconds} />
        </div>
        <ProgressBar value={answeredCount} max={attempt.questions.length} />

        <article className="question-panel">
          <h2>{question.prompt}</h2>
          <AnswerList
            question={question}
            attemptQuestion={attemptQuestion}
            onSelect={(answerId) => {
              dispatch({
                type: "SELECT_ANSWER",
                questionId: question.id,
                answerId,
              });
            }}
          />
          <Button
            type="button"
            variant="primary"
            disabled={!attemptQuestion.selectedAnswerId || attemptQuestion.isLocked}
            onClick={() => {
              dispatch({
                type: "SUBMIT_ANSWER",
                questionId: question.id,
                correctAnswerId: question.correctAnswerId,
              });
            }}
          >
            {t("submitAnswer")}
          </Button>
          <FeedbackPanel question={question} attemptQuestion={attemptQuestion} />
        </article>

        <div className="button-row">
          <Button
            type="button"
            className="icon-nav-button"
            disabled={attempt.currentQuestionIndex === 0}
            title={t("previousQuestion")}
            aria-label={t("previousQuestion")}
            onClick={() => {
              dispatch({ type: "PREVIOUS_QUESTION" });
            }}
          >
            ‹
          </Button>
          <Button
            type="button"
            className="icon-nav-button"
            disabled={attempt.currentQuestionIndex === attempt.questions.length - 1}
            title={t("nextQuestion")}
            aria-label={t("nextQuestion")}
            onClick={() => {
              dispatch({ type: "NEXT_QUESTION" });
            }}
          >
            ›
          </Button>
          <Button
            type="button"
            variant="primary"
            disabled={!canFinish}
            onClick={() => {
              onFinish({ ...attempt, elapsedSeconds });
            }}
          >
            {t("finishQuiz")}
          </Button>
          <Button
            type="button"
            onClick={() => {
              if (window.confirm("Discard this active attempt?")) {
                onLoadAnother();
              }
            }}
          >
            Load another quiz
          </Button>
        </div>
      </section>
    </main>
  );
}
