import type { ImportFormat } from "../../infrastructure/parsers/parser.types";

export interface ImportInput {
  format: ImportFormat;
  source: string;
}
