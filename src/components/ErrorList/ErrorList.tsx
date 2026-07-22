import type { ValidationError } from "../../domain/quiz.types";

interface ErrorListProps {
  errors: readonly ValidationError[];
}

export function ErrorList({ errors }: ErrorListProps) {
  if (errors.length === 0) {
    return null;
  }

  return (
    <section className="error-list" aria-labelledby="error-list-heading">
      <h2 id="error-list-heading">Quiz could not be loaded</h2>
      <ol>
        {errors.map((error, index) => (
          <li key={`${error.code}-${index}`}>{error.message}</li>
        ))}
      </ol>
    </section>
  );
}
