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
    <div className="stack">
      <label className="field">
        <span>Paste format</span>
        <select
          value={format}
          onChange={(event) => {
            onFormatChange(event.currentTarget.value as ImportFormat);
          }}
        >
          <option value="json">JSON</option>
          <option value="csv">CSV</option>
        </select>
      </label>
      <label className="field">
        <span>Pasted quiz content</span>
        <textarea
          value={value}
          rows={10}
          onChange={(event) => {
            onValueChange(event.currentTarget.value);
          }}
          placeholder="Paste JSON or CSV quiz content here."
        />
      </label>
    </div>
  );
}
