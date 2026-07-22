# Local Quiz

Local Quiz is a browser-based quiz application built with React, TypeScript,
Vite, and browser storage. It runs locally and does not require a backend.

This repository currently implements the project foundation plus the first
domain/import layer from `ARCHITECTURE.md`.

## Prerequisites

- Node.js
- npm
- A modern browser

## Setup

```bash
npm install
npm start
```

## Checks

```bash
npm run lint
npm run test:run
npm run build
```

Or run all checks:

```bash
npm run check
```

## Desktop Packaging

The app includes a minimal Electron wrapper for local desktop builds.

```bash
npm run electron:start
```

Build unpacked desktop output:

```bash
npm run desktop:dir
```

Build Linux packages:

```bash
npm run desktop:linux
```

Build a Windows installer from a supported build host:

```bash
npm run desktop:win
```

Windows installer builds from Linux may require additional system tooling such as
Wine. Electron packaging also downloads the Electron runtime the first time it
runs.

## Supported Quiz Formats

### JSON

```json
{
  "quizName": "Sample Quiz",
  "questions": [
    {
      "type": "multiple-choice",
      "question": "What is the capital of France?",
      "answers": ["London", "Paris", "Berlin", "Madrid"],
      "correctAnswer": 2,
      "definition": "Paris is the capital of France."
    }
  ]
}
```

### CSV

```csv
quizName,type,question,answers,correctAnswer,definition
Sample Quiz,multiple-choice,What is the capital of France?,"[""London"",""Paris"",""Berlin"",""Madrid""]",2,Paris is the capital of France.
```

The `answers` column is a JSON array encoded inside a CSV field.

## Data Rules

- `quizName` is required.
- A quiz must contain 1 to 100 questions.
- Supported question types are `multiple-choice` and `true-false`.
- `correctAnswer` is a one-based answer position in imported data.
- Every question needs a non-empty definition.
- Duplicate answers are rejected case-insensitively after trimming.

## Privacy

Quiz content is parsed in the browser. The app stores active quiz progress and
attempt summaries in `localStorage` so an in-progress quiz can be restored after
a browser reload. Clearing site data removes this local history and progress.
