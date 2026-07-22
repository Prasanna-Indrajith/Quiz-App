export type AttemptStatus = "not-started" | "active" | "completed";

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizName: string;
  status: AttemptStatus;
  startedAt: string;
  completedAt?: string;
  elapsedSeconds: number;
  questionOrder: string[];
  questions: AttemptQuestion[];
  currentQuestionIndex: number;
}

export interface AttemptQuestion {
  questionId: string;
  answerOrder: string[];
  selectedAnswerId?: string;
  isLocked: boolean;
  isCorrect?: boolean;
}
