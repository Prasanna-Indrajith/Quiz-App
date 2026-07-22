import type { QuizAttempt } from "../../domain/attempt.types";
import type { Quiz } from "../../domain/quiz.types";

interface AnswerReviewProps {
  quiz: Quiz;
  attempt: QuizAttempt;
}

export function AnswerReview({ quiz, attempt }: AnswerReviewProps) {
  return (
    <section className="stack" aria-labelledby="review-heading">
      <h2 id="review-heading">Answer review</h2>
      {attempt.questionOrder.map((questionId, index) => {
        const question = quiz.questions.find((item) => item.id === questionId);
        const attemptQuestion = attempt.questions.find(
          (item) => item.questionId === questionId,
        );
        const selectedAnswer = question?.answers.find(
          (answer) => answer.id === attemptQuestion?.selectedAnswerId,
        );
        const correctAnswer = question?.answers.find(
          (answer) => answer.id === question.correctAnswerId,
        );

        return (
          <article key={questionId} className="review-item">
            <h3>
              {index + 1}. {question?.prompt ?? "Unknown question"}
            </h3>
            <p>
              Your answer: <strong>{selectedAnswer?.text ?? "No answer"}</strong>
            </p>
            <p>
              Correct answer:{" "}
              <strong>{correctAnswer?.text ?? "Unknown answer"}</strong>
            </p>
            <p>{question?.definition}</p>
          </article>
        );
      })}
    </section>
  );
}
