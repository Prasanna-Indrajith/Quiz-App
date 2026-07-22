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
      {orderedAnswers.map((answer) => {
        const isSelected = attemptQuestion.selectedAnswerId === answer.id;
        const isCorrect = question.correctAnswerId === answer.id;
        const stateClass = getAnswerStateClass(
          attemptQuestion.isLocked,
          isSelected,
          isCorrect,
        );

        return (
          <label
            key={answer.id}
            className={`answer-option ${stateClass}`}
            aria-label={getAnswerLabel(
              answer.text,
              attemptQuestion.isLocked,
              isSelected,
              isCorrect,
            )}
          >
            <input
              type="radio"
              name={question.id}
              value={answer.id}
              checked={isSelected}
              onChange={() => {
                onSelect(answer.id);
              }}
            />
            <span>{answer.text}</span>
          </label>
        );
      })}
    </fieldset>
  );
}

function getAnswerStateClass(
  isLocked: boolean,
  isSelected: boolean,
  isCorrect: boolean,
): string {
  if (!isLocked) {
    return "";
  }

  if (isSelected && isCorrect) {
    return "answer-correct-selected";
  }

  if (isSelected) {
    return "answer-wrong-selected";
  }

  if (isCorrect) {
    return "answer-correct";
  }

  return "";
}

function getAnswerLabel(
  answerText: string,
  isLocked: boolean,
  isSelected: boolean,
  isCorrect: boolean,
): string {
  if (!isLocked) {
    return answerText;
  }

  if (isSelected && isCorrect) {
    return `${answerText}, selected correct answer`;
  }

  if (isSelected) {
    return `${answerText}, selected incorrect answer`;
  }

  if (isCorrect) {
    return `${answerText}, correct answer`;
  }

  return answerText;
}
