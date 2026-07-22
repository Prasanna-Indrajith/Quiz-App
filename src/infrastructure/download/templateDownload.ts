export const JSON_TEMPLATE = JSON.stringify(
  {
    quizName: "Sample Quiz",
    questions: [
      {
        type: "multiple-choice",
        question: "What is the capital of France?",
        answers: ["London", "Paris", "Berlin", "Madrid"],
        correctAnswer: 2,
        definition: "Paris is the capital of France.",
      },
      {
        type: "true-false",
        question: "The Earth is flat.",
        answers: ["True", "False"],
        correctAnswer: 2,
        definition: "Earth is approximately spherical.",
      },
    ],
  },
  null,
  2,
);

export const CSV_TEMPLATE =
  'quizName,type,question,answers,correctAnswer,definition\nSample Quiz,multiple-choice,What is the capital of France?,"[""London"",""Paris"",""Berlin"",""Madrid""]",2,Paris is the capital of France.\nSample Quiz,true-false,The Earth is flat.,"[""True"",""False""]",2,Earth is approximately spherical.\n';
