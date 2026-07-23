import { useState, type DragEvent } from "react";

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
}

export function FileDropzone({ onFileSelect }: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files.item(0);
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <label
      className={`dropzone ${isDragging ? "dropzone-active" : ""}`}
      onDragEnter={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragOver={(event) => {
        event.preventDefault();
      }}
      onDragLeave={(event) => {
        if (event.currentTarget === event.target) {
          setIsDragging(false);
        }
      }}
      onDrop={handleDrop}
    >
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
