import type { QuizAttempt } from "../../domain/attempt.types";

export type AttemptAction =
  | { type: "START_ATTEMPT"; payload: QuizAttempt }
  | { type: "SELECT_ANSWER"; questionId: string; answerId: string }
  | { type: "SUBMIT_ANSWER"; questionId: string; correctAnswerId: string }
  | { type: "GO_TO_QUESTION"; index: number }
  | { type: "NEXT_QUESTION" }
  | { type: "PREVIOUS_QUESTION" }
  | { type: "UPDATE_ELAPSED_TIME"; elapsedSeconds: number }
  | { type: "COMPLETE_ATTEMPT"; completedAt: string }
  | { type: "RESET_ATTEMPT" };

export function quizReducer(
  state: QuizAttempt | null,
  action: AttemptAction,
): QuizAttempt | null {
  if (action.type === "START_ATTEMPT") {
    return action.payload;
  }

  if (action.type === "RESET_ATTEMPT" || state === null) {
    return null;
  }

  if (state.status === "completed" && action.type !== "GO_TO_QUESTION") {
    return state;
  }

  switch (action.type) {
    case "SELECT_ANSWER":
      return {
        ...state,
        questions: state.questions.map((question) =>
          question.questionId === action.questionId && !question.isLocked
            ? { ...question, selectedAnswerId: action.answerId }
            : question,
        ),
      };
    case "SUBMIT_ANSWER":
      return {
        ...state,
        questions: state.questions.map((question) =>
          question.questionId === action.questionId &&
          !question.isLocked &&
          question.selectedAnswerId
            ? {
                ...question,
                isLocked: true,
                isCorrect: question.selectedAnswerId === action.correctAnswerId,
              }
            : question,
        ),
      };
    case "GO_TO_QUESTION":
      return {
        ...state,
        currentQuestionIndex: clampIndex(action.index, state.questions.length),
      };
    case "NEXT_QUESTION":
      return {
        ...state,
        currentQuestionIndex: clampIndex(
          state.currentQuestionIndex + 1,
          state.questions.length,
        ),
      };
    case "PREVIOUS_QUESTION":
      return {
        ...state,
        currentQuestionIndex: clampIndex(
          state.currentQuestionIndex - 1,
          state.questions.length,
        ),
      };
    case "UPDATE_ELAPSED_TIME":
      return { ...state, elapsedSeconds: action.elapsedSeconds };
    case "COMPLETE_ATTEMPT":
      if (state.questions.some((question) => !question.isLocked)) {
        return state;
      }
      return {
        ...state,
        status: "completed",
        completedAt: action.completedAt,
      };
    default:
      return state;
  }
}

function clampIndex(index: number, length: number): number {
  return Math.min(Math.max(index, 0), Math.max(length - 1, 0));
}
