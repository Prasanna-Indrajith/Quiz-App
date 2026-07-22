export const QUIZ_LIMITS = {
  maxQuestions: 100,
  maxAnswersPerQuestion: 50,
  maxQuizNameLength: 150,
  maxQuestionTextLength: 2_000,
  maxAnswerTextLength: 1_000,
  maxDefinitionLength: 5_000,
} as const;

export const QUESTION_TYPES = ["multiple-choice", "true-false"] as const;
