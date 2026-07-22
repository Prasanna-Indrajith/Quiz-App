import type { AttemptQuestion } from "../../domain/attempt.types";
import type { Question } from "../../domain/quiz.types";

interface AnswerListProps {
  question: Question;
  attemptQuestion: AttemptQuestion;
  onSelect: (answerId: string) => void;
}

export function AnswerList({
  question,
  attemptQuestion,
  onSelect,
}: AnswerListProps) {
  const orderedAnswers = attemptQuestion.answerOrder
    .map((answerId) => question.answers.find((answer) => answer.id === answerId))
    .filter((answer) => answer !== undefined);

  return (
    <fieldset className="answer-list" disabled={attemptQuestion.isLocked}>
      <legend>Select one answer</legend>
      {orderedAnswers.map((answer) => (
        <label key={answer.id} className="answer-option">
          <input
            type="radio"
            name={question.id}
            value={answer.id}
            checked={attemptQuestion.selectedAnswerId === answer.id}
            onChange={() => {
              onSelect(answer.id);
            }}
          />
          <span>{answer.text}</span>
        </label>
      ))}
    </fieldset>
  );
}
