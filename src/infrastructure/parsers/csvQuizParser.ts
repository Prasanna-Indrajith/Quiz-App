import Papa from "papaparse";
import {
  validateRawQuiz,
} from "../../domain/quiz.validator";
import type {
  RawQuestion,
  RawQuiz,
  ValidationError,
  ValidationResult,
} from "../../domain/quiz.types";

interface CsvQuizRow {
  quizName?: string;
  type?: string;
  question?: string;
  answers?: string;
  correctAnswer?: string;
  definition?: string;
}

const REQUIRED_HEADERS = [
  "quizName",
  "type",
  "question",
  "answers",
  "correctAnswer",
  "definition",
] as const;

export function parseCsvQuiz(source: string): ValidationResult<RawQuiz> {
  const parseResult = Papa.parse<CsvQuizRow>(source, {
    header: true,
    skipEmptyLines: "greedy",
  });
  const errors: ValidationError[] = parseResult.errors.map((error) => ({
    code: "csv.parseError",
    message: `CSV row ${error.row ?? "unknown"}: ${error.message}`,
    rowNumber: typeof error.row === "number" ? error.row + 2 : undefined,
  }));

  const fields = parseResult.meta.fields ?? [];
  REQUIRED_HEADERS.forEach((header) => {
    if (!fields.includes(header)) {
      errors.push({
        code: "csv.missingHeader",
        message: `CSV is missing required header "${header}".`,
        field: header,
      });
    }
  });

  const rawQuiz = csvRowsToRawQuiz(parseResult.data, errors);

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  const validation = validateRawQuiz(rawQuiz);

  if (!validation.valid) {
    return {
      valid: false,
      errors: validation.errors.map((error) => ({
        ...error,
        rowNumber:
          typeof error.questionIndex === "number"
            ? error.questionIndex + 2
            : error.rowNumber,
      })),
    };
  }

  return validation;
}

function csvRowsToRawQuiz(
  rows: CsvQuizRow[],
  errors: ValidationError[],
): RawQuiz {
  const questions: RawQuestion[] = [];
  const quizNames = new Set<string>();

  rows.forEach((row, rowIndex) => {
    const rowNumber = rowIndex + 2;
    const quizName = row.quizName?.trim() ?? "";

    if (quizName.length > 0) {
      quizNames.add(quizName);
    }

    questions.push({
      type: row.type?.trim() as RawQuestion["type"],
      question: row.question?.trim() ?? "",
      answers: parseAnswers(row.answers, rowNumber, errors),
      correctAnswer: parseCorrectAnswer(row.correctAnswer, rowNumber, errors),
      definition: row.definition?.trim() ?? "",
    });
  });

  if (quizNames.size > 1) {
    errors.push({
      code: "csv.mixedQuizNames",
      message: "All CSV rows must use the same quiz name.",
      field: "quizName",
    });
  }

  return {
    quizName: rows[0]?.quizName?.trim() ?? "",
    questions,
  };
}

function parseAnswers(
  value: string | undefined,
  rowNumber: number,
  errors: ValidationError[],
): string[] {
  if (typeof value !== "string") {
    errors.push({
      code: "csv.answersRequired",
      message: `Row ${rowNumber}: answers is required.`,
      rowNumber,
      field: "answers",
    });
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    if (
      !isStringArray(parsed)
    ) {
      errors.push({
        code: "csv.answersInvalid",
        message: `Row ${rowNumber}: answers must be a JSON array of strings.`,
        rowNumber,
        field: "answers",
      });
      return [];
    }

    return parsed;
  } catch {
    errors.push({
      code: "csv.answersInvalidJson",
      message: `Row ${rowNumber}: answers must be valid JSON array text.`,
      rowNumber,
      field: "answers",
    });
    return [];
  }
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
}

function parseCorrectAnswer(
  value: string | undefined,
  rowNumber: number,
  errors: ValidationError[],
): number {
  const parsed = Number(value);

  if (!Number.isInteger(parsed)) {
    errors.push({
      code: "csv.correctAnswerInvalid",
      message: `Row ${rowNumber}: correctAnswer must be an integer.`,
      rowNumber,
      field: "correctAnswer",
    });
    return Number.NaN;
  }

  return parsed;
}
