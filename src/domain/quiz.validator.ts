import { QUESTION_TYPES, QUIZ_LIMITS } from "./quiz.schema";
import type {
  RawQuestion,
  RawQuiz,
  ValidationError,
  ValidationResult,
} from "./quiz.types";

export function validateRawQuiz(input: unknown): ValidationResult<RawQuiz> {
  const errors: ValidationError[] = [];

  if (!isRecord(input)) {
    return {
      valid: false,
      errors: [
        {
          code: "quiz.invalidRoot",
          message: "Quiz data must be an object.",
        },
      ],
    };
  }

  const quizName = input.quizName;
  const questions = input.questions;

  validateQuizName(quizName, errors);

  if (!Array.isArray(questions)) {
    errors.push({
      code: "quiz.questionsRequired",
      message: "Questions must be an array.",
      field: "questions",
    });
  } else {
    if (questions.length === 0) {
      errors.push({
        code: "quiz.noQuestions",
        message: "Quiz must include at least one question.",
        field: "questions",
      });
    }

    if (questions.length > QUIZ_LIMITS.maxQuestions) {
      errors.push({
        code: "quiz.tooManyQuestions",
        message: `Quiz cannot include more than ${QUIZ_LIMITS.maxQuestions} questions.`,
        field: "questions",
      });
    }

    questions.forEach((question, index) => {
      validateQuestion(question, index, errors);
    });
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  if (typeof quizName !== "string" || !Array.isArray(questions)) {
    return {
      valid: false,
      errors: [
        {
          code: "quiz.invalid",
          message: "Quiz data is invalid.",
        },
      ],
    };
  }

  const normalizedQuestions = questions.map(normalizeRawQuestion);

  return {
    valid: true,
    value: {
      quizName: quizName.trim(),
      questions: normalizedQuestions,
    },
    errors: [],
  };
}

function validateQuizName(value: unknown, errors: ValidationError[]): void {
  if (typeof value !== "string") {
    errors.push({
      code: "quiz.nameRequired",
      message: "Quiz name is required.",
      field: "quizName",
    });
    return;
  }

  if (value.trim().length === 0) {
    errors.push({
      code: "quiz.nameEmpty",
      message: "Quiz name cannot be empty.",
      field: "quizName",
    });
  }

  if (value.trim().length > QUIZ_LIMITS.maxQuizNameLength) {
    errors.push({
      code: "quiz.nameTooLong",
      message: `Quiz name cannot exceed ${QUIZ_LIMITS.maxQuizNameLength} characters.`,
      field: "quizName",
    });
  }
}

function validateQuestion(
  value: unknown,
  questionIndex: number,
  errors: ValidationError[],
): void {
  const questionNumber = questionIndex + 1;

  if (!isRecord(value)) {
    errors.push({
      code: "question.invalid",
      message: `Question ${questionNumber} must be an object.`,
      questionIndex,
    });
    return;
  }

  const type = value.type;
  const question = value.question;
  const answers = value.answers;
  const correctAnswer = value.correctAnswer;
  const definition = value.definition;

  if (!isQuestionType(type)) {
    errors.push({
      code: "question.typeUnsupported",
      message: `Question ${questionNumber} type must be multiple-choice or true-false.`,
      questionIndex,
      field: "type",
    });
  }

  if (typeof question !== "string" || question.trim().length === 0) {
    errors.push({
      code: "question.promptRequired",
      message: `Question ${questionNumber} text is required.`,
      questionIndex,
      field: "question",
    });
  } else if (question.trim().length > QUIZ_LIMITS.maxQuestionTextLength) {
    errors.push({
      code: "question.promptTooLong",
      message: `Question ${questionNumber} text cannot exceed ${QUIZ_LIMITS.maxQuestionTextLength} characters.`,
      questionIndex,
      field: "question",
    });
  }

  if (!Array.isArray(answers)) {
    errors.push({
      code: "question.answersRequired",
      message: `Question ${questionNumber} answers must be an array.`,
      questionIndex,
      field: "answers",
    });
  } else {
    validateAnswers(answers, questionIndex, errors);

    if (type === "multiple-choice" && answers.length < 2) {
      errors.push({
        code: "question.multipleChoiceTooFewAnswers",
        message: `Question ${questionNumber} must include at least two answers.`,
        questionIndex,
        field: "answers",
      });
    }

    if (type === "true-false" && answers.length !== 2) {
      errors.push({
        code: "question.trueFalseAnswerCount",
        message: `Question ${questionNumber} must include exactly two answers.`,
        questionIndex,
        field: "answers",
      });
    }

    validateCorrectAnswer(correctAnswer, answers.length, questionIndex, errors);
  }

  if (typeof definition !== "string" || definition.trim().length === 0) {
    errors.push({
      code: "question.definitionRequired",
      message: `Question ${questionNumber} definition is required.`,
      questionIndex,
      field: "definition",
    });
  } else if (definition.trim().length > QUIZ_LIMITS.maxDefinitionLength) {
    errors.push({
      code: "question.definitionTooLong",
      message: `Question ${questionNumber} definition cannot exceed ${QUIZ_LIMITS.maxDefinitionLength} characters.`,
      questionIndex,
      field: "definition",
    });
  }
}

function validateAnswers(
  answers: unknown[],
  questionIndex: number,
  errors: ValidationError[],
): void {
  const seen = new Set<string>();
  const questionNumber = questionIndex + 1;

  if (answers.length > QUIZ_LIMITS.maxAnswersPerQuestion) {
    errors.push({
      code: "question.tooManyAnswers",
      message: `Question ${questionNumber} cannot include more than ${QUIZ_LIMITS.maxAnswersPerQuestion} answers.`,
      questionIndex,
      field: "answers",
    });
  }

  answers.forEach((answer, answerIndex) => {
    if (typeof answer !== "string" || answer.trim().length === 0) {
      errors.push({
        code: "question.answerRequired",
        message: `Question ${questionNumber} answer ${answerIndex + 1} is required.`,
        questionIndex,
        field: "answers",
      });
      return;
    }

    const normalized = answer.trim().toLocaleLowerCase();
    if (answer.trim().length > QUIZ_LIMITS.maxAnswerTextLength) {
      errors.push({
        code: "question.answerTooLong",
        message: `Question ${questionNumber} answer ${answerIndex + 1} cannot exceed ${QUIZ_LIMITS.maxAnswerTextLength} characters.`,
        questionIndex,
        field: "answers",
      });
    }

    if (seen.has(normalized)) {
      errors.push({
        code: "question.duplicateAnswer",
        message: `Question ${questionNumber} has a duplicate answer: "${answer.trim()}".`,
        questionIndex,
        field: "answers",
      });
    }

    seen.add(normalized);
  });
}

function validateCorrectAnswer(
  value: unknown,
  answerCount: number,
  questionIndex: number,
  errors: ValidationError[],
): void {
  const questionNumber = questionIndex + 1;

  if (typeof value !== "number" || !Number.isInteger(value)) {
    errors.push({
      code: "question.correctAnswerInteger",
      message: `Question ${questionNumber} correctAnswer must be an integer.`,
      questionIndex,
      field: "correctAnswer",
    });
    return;
  }

  if (value < 1 || value > answerCount) {
    errors.push({
      code: "question.correctAnswerOutOfRange",
      message: `Question ${questionNumber} correctAnswer must be between 1 and ${answerCount}.`,
      questionIndex,
      field: "correctAnswer",
    });
  }
}

function normalizeRawQuestion(question: unknown): RawQuestion {
  const record = question as Record<string, unknown>;
  const type = record.type;
  const prompt = record.question;
  const answers = record.answers;
  const correctAnswer = record.correctAnswer;
  const definition = record.definition;

  if (
    !isQuestionType(type) ||
    typeof prompt !== "string" ||
    !isStringArray(answers) ||
    typeof correctAnswer !== "number" ||
    !Number.isInteger(correctAnswer) ||
    typeof definition !== "string"
  ) {
    throw new Error("Cannot normalize invalid question.");
  }

  return {
    type,
    question: prompt.trim(),
    answers: answers.map((answer) => answer.trim()),
    correctAnswer,
    definition: definition.trim(),
  };
}

function isQuestionType(value: unknown): value is RawQuestion["type"] {
  return (
    typeof value === "string" &&
    QUESTION_TYPES.includes(value as RawQuestion["type"])
  );
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
