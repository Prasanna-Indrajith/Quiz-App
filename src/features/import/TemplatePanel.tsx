import { Button } from "../../components/Button/Button";
import {
  CSV_TEMPLATE,
  JSON_TEMPLATE,
} from "../../infrastructure/download/templateDownload";
import { downloadTextFile } from "../../utils/download";

export function TemplatePanel() {
  return (
    <section className="template-grid" aria-labelledby="templates-heading">
      <h2 id="templates-heading">Templates</h2>
      <TemplateCard
        title="JSON"
        content={JSON_TEMPLATE}
        filename="quiz-template.json"
        mimeType="application/json"
      />
      <TemplateCard
        title="CSV"
        content={CSV_TEMPLATE}
        filename="quiz-template.csv"
        mimeType="text/csv"
      />
    </section>
  );
}

interface TemplateCardProps {
  title: string;
  content: string;
  filename: string;
  mimeType: string;
}

function TemplateCard({
  title,
  content,
  filename,
  mimeType,
}: TemplateCardProps) {
  return (
    <article className="template-card">
      <h3>{title}</h3>
      <pre>{content}</pre>
      <div className="button-row">
        <Button
          type="button"
          onClick={() => {
            void navigator.clipboard.writeText(content);
          }}
        >
          Copy
        </Button>
        <Button
          type="button"
          onClick={() => {
            downloadTextFile(filename, content, mimeType);
          }}
        >
          Download
        </Button>
      </div>
    </article>
  );
}
