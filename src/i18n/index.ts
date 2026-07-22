import { en } from "./en";

export const locales = {
  en,
} as const;

export type LocaleKey = keyof typeof locales;
export type TranslationKey = keyof typeof en;

export function t(key: TranslationKey, locale: LocaleKey = "en"): string {
  return locales[locale][key];
}
