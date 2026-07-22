import { t } from "../../i18n";

export function LanguageSelector() {
  return (
    <label className="field">
      <span>Language</span>
      <select value="en" disabled>
        <option value="en">{t("languageEnglish")}</option>
      </select>
    </label>
  );
}
