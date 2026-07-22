import { t } from "../../i18n";

export function LanguageSelector() {
  return (
    <label className="language-chip" aria-label="Language">
      <span className="sr-only">Language</span>
      <select value="en" disabled title={t("languageEnglish")}>
        <option value="en">{t("languageEnglish")}</option>
      </select>
    </label>
  );
}
