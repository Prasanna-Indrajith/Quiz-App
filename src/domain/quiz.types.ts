export type RawQuestionType = "multiple-choice" | "true-false";

export interface RawQuiz {
  quizName: string;
  questions: RawQuestion[];
}

export interface RawQuestion {
  type: RawQuestionType;
  question: string;
  answers: string[];
  correctAnswer: number;
  definition: string;
}

export type QuestionType = RawQuestionType;

export interface Quiz {
  id: string;
  name: string;
  questions: Question[];
}

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  answers: Answer[];
  correctAnswerId: string;
  definition: string;
}

export interface Answer {
  id: string;
  text: string;
}

export interface ValidationError {
  code: string;
  message: string;
  questionIndex?: number;
  rowNumber?: number;
  field?: string;
}

export type ValidationResult<T> =
  | { valid: true; value: T; errors: [] }
  | { valid: false; errors: ValidationError[]; value?: undefined };

export interface QuizResultSummary {
  id: string;
  quizName: string;
  completedAt: string;
  correctAnswers: number;
  totalQuestions: number;
  scorePercent: number;
}
