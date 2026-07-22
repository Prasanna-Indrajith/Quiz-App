interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
}

export function FileDropzone({ onFileSelect }: FileDropzoneProps) {
  return (
    <label className="dropzone">
      <span className="dropzone-icon" aria-hidden="true">
        ↑
      </span>
      <span className="dropzone-title">Drop quiz file</span>
      <span className="dropzone-meta">or click to upload JSON/CSV</span>
      <input
        type="file"
        accept=".json,.csv,application/json,text/csv"
        onChange={(event) => {
          const file = event.currentTarget.files?.[0];
          if (file) {
            onFileSelect(file);
          }
        }}
      />
    </label>
  );
}
