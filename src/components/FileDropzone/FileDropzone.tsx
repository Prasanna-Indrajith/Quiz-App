interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
}

export function FileDropzone({ onFileSelect }: FileDropzoneProps) {
  return (
    <label className="field">
      <span>Quiz file</span>
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
