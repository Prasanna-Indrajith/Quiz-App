import { useState } from "react";
import { Button } from "../../components/Button/Button";
import { ErrorList } from "../../components/ErrorList/ErrorList";
import { FileDropzone } from "../../components/FileDropzone/FileDropzone";
import { LanguageSelector } from "../../components/LanguageSelector/LanguageSelector";
import { normalizeQuiz } from "../../domain/quiz.normalizer";
import type { Quiz, ValidationError } from "../../domain/quiz.types";
import type { ImportFormat } from "../../infrastructure/parsers/parser.types";
import { parseCsvQuiz } from "../../infrastructure/parsers/csvQuizParser";
import { parseJsonQuiz } from "../../infrastructure/parsers/jsonQuizParser";
import { t } from "../../i18n";
import { PasteInput } from "./PasteInput";
import { TemplatePanel } from "./TemplatePanel";

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;

interface ImportPageProps {
  onStartQuiz: (quiz: Quiz) => void;
}

export function ImportPage({ onStartQuiz }: ImportPageProps) {
  const [format, setFormat] = useState<ImportFormat>("json");
  const [source, setSource] = useState("");
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [loadedQuiz, setLoadedQuiz] = useState<Quiz | null>(null);

  const loadSource = (nextSource: string, nextFormat = format) => {
    const result =
      nextFormat === "json" ? parseJsonQuiz(nextSource) : parseCsvQuiz(nextSource);

    if (!result.valid) {
      setLoadedQuiz(null);
      setErrors(result.errors);
      return;
    }

    setErrors([]);
    setLoadedQuiz(normalizeQuiz(result.value));
  };

  const handleFileSelect = (file: File) => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setLoadedQuiz(null);
      setErrors([
        {
          code: "file.tooLarge",
          message: "File is too large. Choose a file smaller than 2 MB.",
        },
      ]);
      return;
    }

    const fileFormat = file.name.toLocaleLowerCase().endsWith(".csv")
      ? "csv"
      : "json";
    setFormat(fileFormat);

    void file.text().then((text) => {
      setSource(text);
      loadSource(text, fileFormat);
    });
  };

  return (
    <main className="app-shell">
      <section className="panel import-panel">
        <h1 className="sr-only">{t("appTitle")}</h1>
        <div className="import-topbar">
          <LanguageSelector />
        </div>

        <section className="stack" aria-labelledby="import-heading">
          <h2 id="import-heading" className="import-title">
            {t("importQuiz")}
          </h2>
          <div className="import-grid">
            <div className="import-card">
              <FileDropzone onFileSelect={handleFileSelect} />
            </div>
            <div className="import-card">
              <PasteInput
                format={format}
                value={source}
                onFormatChange={setFormat}
                onValueChange={setSource}
              />
            </div>
          </div>
          <div className="import-meta-grid">
            <TemplatePanel />
            <section className="quiz-ready-card" aria-live="polite">
              <span>Quiz details</span>
              {loadedQuiz ? (
                <strong>
                  {loadedQuiz.name} · {loadedQuiz.questions.length}{" "}
                  {loadedQuiz.questions.length === 1 ? "question" : "questions"}
                </strong>
              ) : (
                <strong>No quiz loaded</strong>
              )}
            </section>
          </div>
          <Button
            type="button"
            variant="primary"
            onClick={() => {
              if (loadedQuiz) {
                onStartQuiz(loadedQuiz);
                return;
              }

              loadSource(source);
            }}
          >
            {loadedQuiz ? t("startQuiz") : "Load quiz"}
          </Button>
          <ErrorList errors={errors} />
        </section>
      </section>
    </main>
  );
}
