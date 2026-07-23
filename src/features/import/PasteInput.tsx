import type { ImportFormat } from "../../infrastructure/parsers/parser.types";

interface PasteInputProps {
  format: ImportFormat;
  value: string;
  onFormatChange: (format: ImportFormat) => void;
  onValueChange: (value: string) => void;
}

export function PasteInput({
  format,
  value,
  onFormatChange,
  onValueChange,
}: PasteInputProps) {
  return (
    <div className="paste-panel">
      <div className="format-toggle" aria-label="Paste format">
        <button
          type="button"
          className={format === "json" ? "toggle-active" : ""}
          onClick={() => {
            onFormatChange("json");
          }}
        >
          JSON
        </button>
        <button
          type="button"
          className={format === "csv" ? "toggle-active" : ""}
          onClick={() => {
            onFormatChange("csv");
          }}
        >
          CSV
        </button>
      </div>
      <label className="field">
        <span>Paste text</span>
        <textarea
          value={value}
          rows={12}
          onChange={(event) => {
            onValueChange(event.currentTarget.value);
          }}
          placeholder="Paste JSON or CSV quiz content here"
        />
      </label>
    </div>
  );
}
