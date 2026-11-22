import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const locales = ["en", "ar", "hi", "bn", "ms", "vi", "th", "id", "zh", "ru", "uk", "es", "fr", "de", "pt", "ja", "ko"];
const library = read("../data/tipLibrary.ts");
const localized = read("../data/localizedTips.ts");
const tipComponent = read("../components/TipLibrary.tsx");
const onboarding = read("../lib/onboardingI18n.ts");

const tipIds = [...library.matchAll(/"id":\\s*"([A-Z]{2}-[A-Z]-\\d{3})"/g)].map((m) => m[1]);
const uniqueTipIds = [...new Set(tipIds)];

function localeBlock(source, locale, startAt = 0) {
  const marker = new RegExp(`^\\\\s{2}${locale}: \\\\{\\\\s*$`, "m");
  const tail = source.slice(startAt);
  const match = marker.exec(tail);
  if (!match) return "";
  const start = startAt + match.index + match[0].length;
  const rest = source.slice(start);
  const next = /^  [a-z]{2}: \\{/m.exec(rest);
  const end = next ? start + next.index : source.indexOf("\\n};", start);
  return source.slice(start, end < 0 ? source.length : end);
}

function idsIn(source) {
  return [...new Set([...source.matchAll(/"([A-Z]{2}-[A-Z]-\\d{3})"\\s*:/g)].map((m) => m[1]))];
}

function keysIn(source) {
  return [...new Set([...source.matchAll(/"([A-Za-z][A-Za-z0-9]*)"\\s*:/g)].map((m) => m[1]))];
}

const tipStart = localized.indexOf("export const LOCALIZED_TIPS");
const onStart = onboarding.indexOf("export const ONBOARDING_TRANSLATIONS");
const ruStart = tipComponent.indexOf("const RU_TIPS");
const onboardingEnglish = keysIn(localeBlock(onboarding, "en", onStart));

console.log("MOONII LOCALIZATION COVERAGE");
console.log(`Supported locales: ${locales.length}`);
console.log(`Mandeep library: ${uniqueTipIds.length} unique tip IDs`);
console.log(`Onboarding English keys: ${onboardingEnglish.length}`);

for (const locale of locales) {
  const tipBlock = locale === "en"
    ? uniqueTipIds
    : locale === "ru"
      ? idsIn(localeBlock(tipComponent, "RU_TIPS", ruStart))
      : idsIn(localeBlock(localized, locale, tipStart));
  const covered = locale === "en" ? uniqueTipIds : tipBlock;
  const missing = uniqueTipIds.filter((id) => !covered.includes(id));
  const onKeys = keysIn(localeBlock(onboarding, locale, onStart));
  const missingOnboarding = onboardingEnglish.filter((key) => !onKeys.includes(key));
  console.log(`${locale}: tips ${uniqueTipIds.length - missing.length}/${uniqueTipIds.length}; onboarding ${onboardingEnglish.length - missingOnboarding.length}/${onboardingEnglish.length}; missing tips ${missing.length}`);
}

console.log("This audit reports coverage; missing translations remain visible and are not silently counted as complete.");
