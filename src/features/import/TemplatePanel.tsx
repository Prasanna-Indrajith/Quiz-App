import { Button } from "../../components/Button/Button";
import {
  CSV_TEMPLATE,
  JSON_TEMPLATE,
} from "../../infrastructure/download/templateDownload";

export function TemplatePanel() {
  return (
    <section className="template-row" aria-label="Templates">
      <span>Template</span>
      <TemplateAction
        title="JSON"
        content={JSON_TEMPLATE}
      />
      <TemplateAction
        title="CSV"
        content={CSV_TEMPLATE}
      />
    </section>
  );
}

interface TemplateActionProps {
  title: string;
  content: string;
}

function TemplateAction({
  title,
  content,
}: TemplateActionProps) {
  return (
    <div className="template-actions">
      <strong>{title}</strong>
      <div className="template-copy">
        <Button
          type="button"
          className="icon-button"
          title={`Copy ${title} template`}
          aria-label={`Copy ${title} template`}
          onClick={() => {
            void navigator.clipboard.writeText(content);
          }}
        >
          ⧉
        </Button>
        <pre className="template-preview" aria-hidden="true">
          {content}
        </pre>
      </div>
    </div>
  );
}
