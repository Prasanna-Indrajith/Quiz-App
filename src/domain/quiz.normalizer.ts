import type { Quiz, RawQuiz } from "./quiz.types";

export function normalizeQuiz(rawQuiz: RawQuiz): Quiz {
  const quizId = createId("quiz", rawQuiz.quizName);

  return {
    id: quizId,
    name: rawQuiz.quizName,
    questions: rawQuiz.questions.map((question, questionIndex) => {
      const questionId = `${quizId}-q${questionIndex + 1}`;
      const answers = question.answers.map((answer, answerIndex) => ({
        id: `${questionId}-a${answerIndex + 1}`,
        text: answer,
      }));

      return {
        id: questionId,
        type: question.type,
        prompt: question.question,
        answers,
        correctAnswerId: answers[question.correctAnswer - 1].id,
        definition: question.definition,
      };
    }),
  };
}

function createId(prefix: string, value: string): string {
  const slug = value
    .trim()
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `${prefix}-${slug || "untitled"}`;
}
