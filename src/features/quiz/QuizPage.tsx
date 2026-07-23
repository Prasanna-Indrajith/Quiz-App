import { useEffect, useState } from "react";
import { Button } from "../../components/Button/Button";
import { ConfirmDialog } from "../../components/ConfirmDialog/ConfirmDialog";
import { ProgressBar } from "../../components/ProgressBar/ProgressBar";
import { TimerDisplay } from "../../components/TimerDisplay/TimerDisplay";
import type { QuizAttempt } from "../../domain/attempt.types";
import type { Quiz } from "../../domain/quiz.types";
import { useBeforeUnloadWarning } from "../../hooks/useBeforeUnloadWarning";
import { useElapsedTimer } from "../../hooks/useElapsedTimer";
import { t } from "../../i18n";
import { AnswerList } from "./AnswerList";
import type { AttemptAction } from "./quiz.reducer";

interface QuizPageProps {
  quiz: Quiz;
  attempt: QuizAttempt;
  dispatch: (action: AttemptAction) => void;
  onFinish: (attempt: QuizAttempt) => void;
  onStopQuiz: () => void;
}

export function QuizPage({
  quiz,
  attempt,
  dispatch,
  onFinish,
  onStopQuiz,
}: QuizPageProps) {
  const [isStopConfirmOpen, setIsStopConfirmOpen] = useState(false);
  useBeforeUnloadWarning(true);

  const elapsedSeconds = useElapsedTimer(attempt.startedAt, true);
  const currentQuestionId = attempt.questionOrder[attempt.currentQuestionIndex];
  const question = quiz.questions.find((item) => item.id === currentQuestionId);
  const attemptQuestion = attempt.questions.find(
    (item) => item.questionId === currentQuestionId,
  );
  const answeredCount = attempt.questions.filter((item) => item.isLocked).length;
  const canFinish = answeredCount === attempt.questions.length;
  const isLastQuestion =
    attempt.currentQuestionIndex === attempt.questions.length - 1;

  useEffect(() => {
    dispatch({ type: "UPDATE_ELAPSED_TIME", elapsedSeconds });
  }, [dispatch, elapsedSeconds]);

  const stopConfirmDialog = isStopConfirmOpen ? (
    <div className="dialog-backdrop">
      <div className="dialog-panel">
        <ConfirmDialog
          title="Stop quiz?"
          message="Your current attempt will be discarded."
          onConfirm={onStopQuiz}
          onCancel={() => {
            setIsStopConfirmOpen(false);
          }}
        />
      </div>
    </div>
  ) : null;

  if (!question || !attemptQuestion) {
    return (
      <main className="app-shell">
        <section className="panel">
          <h1>{quiz.name}</h1>
          <p>Question data could not be displayed.</p>
          <Button
            variant="danger"
            onClick={() => {
              setIsStopConfirmOpen(true);
            }}
          >
            Stop quiz
          </Button>
        </section>
        {stopConfirmDialog}
      </main>
    );
  }

  const shouldShowFinishAction =
    isLastQuestion && attemptQuestion.isLocked && canFinish;

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
          <div className="quiz-topbar-actions">
            <TimerDisplay elapsedSeconds={attempt.elapsedSeconds} />
            <Button
              type="button"
              variant="danger"
              onClick={() => {
                setIsStopConfirmOpen(true);
              }}
            >
              Stop quiz
            </Button>
          </div>
        </div>
        <ProgressBar value={answeredCount} max={attempt.questions.length} />

        <article className="question-panel">
          <h2>{question.prompt}</h2>
          <details className="definition-panel">
            <summary>Definition</summary>
            <div>
              <p>{question.definition}</p>
            </div>
          </details>
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
            disabled={
              shouldShowFinishAction
                ? false
                : !attemptQuestion.selectedAnswerId || attemptQuestion.isLocked
            }
            onClick={() => {
              if (shouldShowFinishAction) {
                onFinish({ ...attempt, elapsedSeconds });
                return;
              }

              dispatch({
                type: "SUBMIT_ANSWER",
                questionId: question.id,
                correctAnswerId: question.correctAnswerId,
              });
            }}
          >
            {shouldShowFinishAction ? t("finishQuiz") : t("submitAnswer")}
          </Button>
        </article>

        <div className="quiz-nav-row">
          <Button
            type="button"
            className="icon-nav-button nav-previous"
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
            className="icon-nav-button nav-next"
            disabled={attempt.currentQuestionIndex === attempt.questions.length - 1}
            title={t("nextQuestion")}
            aria-label={t("nextQuestion")}
            onClick={() => {
              dispatch({ type: "NEXT_QUESTION" });
            }}
          >
            ›
          </Button>
        </div>

        {stopConfirmDialog}
      </section>
    </main>
  );
}
