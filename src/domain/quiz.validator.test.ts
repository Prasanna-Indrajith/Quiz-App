import { describe, expect, it } from "vitest";
import { validateRawQuiz } from "./quiz.validator";
import type { RawQuiz } from "./quiz.types";

const validQuiz: RawQuiz = {
  quizName: "Sample Quiz",
  questions: [
    {
      type: "multiple-choice",
      question: "What is the capital of France?",
      answers: ["London", "Paris", "Berlin"],
      correctAnswer: 2,
      definition: "Paris is the capital of France.",
    },
  ],
};

describe("validateRawQuiz", () => {
  it("accepts a valid quiz and trims text", () => {
    const result = validateRawQuiz({
      quizName: " Sample Quiz ",
      questions: [
        {
          ...validQuiz.questions[0],
          question: " Question? ",
          answers: [" A ", " B "],
          definition: " Definition. ",
        },
      ],
    });

    expect(result.valid).toBe(true);
    expect(result.value?.quizName).toBe("Sample Quiz");
    expect(result.value?.questions[0].answers).toEqual(["A", "B"]);
  });

  it("returns all quiz and question errors together", () => {
    const result = validateRawQuiz({
      quizName: "",
      questions: [
        {
          type: "essay",
          question: "",
          answers: ["Paris", " paris "],
          correctAnswer: 4,
          definition: "",
        },
      ],
    });

    expect(result.valid).toBe(false);
    expect(result.errors.map((error) => error.code)).toEqual(
      expect.arrayContaining([
        "quiz.nameEmpty",
        "question.typeUnsupported",
        "question.promptRequired",
        "question.duplicateAnswer",
        "question.correctAnswerOutOfRange",
        "question.definitionRequired",
      ]),
    );
  });

  it("rejects quizzes with more than 100 questions", () => {
    const result = validateRawQuiz({
      quizName: "Large Quiz",
      questions: Array.from({ length: 101 }, () => validQuiz.questions[0]),
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ code: "quiz.tooManyQuestions" }),
    );
  });

  it("requires true/false questions to have exactly two answers", () => {
    const result = validateRawQuiz({
      quizName: "Truth",
      questions: [
        {
          type: "true-false",
          question: "The Earth is flat.",
          answers: ["True", "False", "Sometimes"],
          correctAnswer: 2,
          definition: "Earth is approximately spherical.",
        },
      ],
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ code: "question.trueFalseAnswerCount" }),
    );
  });

  it("requires correctAnswer to be an integer", () => {
    const result = validateRawQuiz({
      ...validQuiz,
      questions: [{ ...validQuiz.questions[0], correctAnswer: 1.5 }],
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ code: "question.correctAnswerInteger" }),
    );
  });
});
