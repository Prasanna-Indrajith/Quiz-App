import type { AttemptQuestion } from "../../domain/attempt.types";
import type { Question } from "../../domain/quiz.types";

interface FeedbackPanelProps {
  question: Question;
  attemptQuestion: AttemptQuestion;
}

export function FeedbackPanel({
  question,
  attemptQuestion,
}: FeedbackPanelProps) {
  if (!attemptQuestion.isLocked) {
    return null;
  }

  const correctAnswer = question.answers.find(
    (answer) => answer.id === question.correctAnswerId,
  );

  return (
    <section
      className={
        attemptQuestion.isCorrect ? "feedback feedback-correct" : "feedback"
      }
      aria-live="polite"
    >
      <h3>{attemptQuestion.isCorrect ? "Correct" : "Incorrect"}</h3>
      <p>
        Correct answer: <strong>{correctAnswer?.text ?? "Unknown"}</strong>
      </p>
      <p>{question.definition}</p>
    </section>
  );
}
