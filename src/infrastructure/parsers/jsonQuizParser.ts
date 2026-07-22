import {
  validateRawQuiz,
} from "../../domain/quiz.validator";
import type { RawQuiz, ValidationResult } from "../../domain/quiz.types";

export function parseJsonQuiz(source: string): ValidationResult<RawQuiz> {
  try {
    return validateRawQuiz(JSON.parse(source) as unknown);
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          code: "json.invalidSyntax",
          message:
            error instanceof Error
              ? `Invalid JSON: ${error.message}`
              : "Invalid JSON syntax.",
        },
      ],
    };
  }
}
