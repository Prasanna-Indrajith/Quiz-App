import type { RawQuiz, ValidationResult } from "../../domain/quiz.types";

export type ImportFormat = "json" | "csv";

export interface QuizParser {
  parse(source: string): ValidationResult<RawQuiz>;
}
