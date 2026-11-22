import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const locales = ["en", "ar", "hi", "bn", "ms", "vi", "th", "id", "zh", "ru", "uk", "es", "fr", "de", "pt", "ja", "ko"];
const library = read("../data/tipLibrary.ts");
const localized = read("../data/localizedTips.ts");
const mandeepLocalized = read("../data/mandeepLocalizedTips.ts");
const mandeepLocalizedExtra = read("../data/mandeepLocalizedTipsExtra.ts");
const mandeepLocalizedBatch3 = read("../data/mandeepLocalizedTipsBatch3.ts");
const mandeepLocalizedBatch4 = read("../data/mandeepLocalizedTipsBatch4.ts");
const mandeepLocalizedBatch5 = read("../data/mandeepLocalizedTipsBatch5.ts");
const mandeepLocalizedBatch6 = read("../data/mandeepLocalizedTipsBatch6.ts");
const mandeepLocalizedBatch7 = read("../data/mandeepLocalizedTipsBatch7.ts");
const mandeepLocalizedBatch8 = read("../data/mandeepLocalizedTipsBatch8.ts");
const mandeepLocalizedBatch9 = read("../data/mandeepLocalizedTipsBatch9.ts");
const mandeepLocalizedBatch10 = read("../data/mandeepLocalizedTipsBatch10.ts");
const tipComponent = read("../components/TipLibrary.tsx");
const onboarding = read("../lib/onboardingI18n.ts");

const tipIds = [...library.matchAll(/"id":\s*"([A-Z]{2}-[A-Z]-\d{3})"/g)].map((m) => m[1]);
const uniqueTipIds = [...new Set(tipIds)];

function localeBlock(source, locale, startAt = 0) {
  const marker = new RegExp(`^\\s{2}${locale}:\\s*\\{`, "m");
  const tail = source.slice(startAt);
  const match = marker.exec(tail);
  if (!match) return "";
  const start = startAt + match.index + match[0].length;
  const rest = source.slice(start);
  const next = /^  [a-z]{2}: \{/m.exec(rest);
  const end = next ? start + next.index : source.indexOf("\n};", start);
  return source.slice(start, end < 0 ? source.length : end);
}

function idsIn(source) {
  return [...new Set([...source.matchAll(/"([A-Z]{2}-[A-Z]-\d{3})"\s*:/g)].map((m) => m[1]))];
}

function keysIn(source) {
  return [...new Set([...source.matchAll(/"([A-Za-z][A-Za-z0-9]*)"\s*:/g)].map((m) => m[1]))];
}

const tipStart = localized.indexOf("export const LOCALIZED_TIPS");
const mandeepTipStart = mandeepLocalized.indexOf("export const MANDEEP_LOCALIZED_TIPS");
const mandeepExtraTipStart = mandeepLocalizedExtra.indexOf("export const MANDEEP_LOCALIZED_TIPS_EXTRA");
const mandeepBatch3Start = mandeepLocalizedBatch3.indexOf("export const MANDEEP_LOCALIZED_TIPS_BATCH3");
const mandeepBatch4Start = mandeepLocalizedBatch4.indexOf("export const MANDEEP_LOCALIZED_TIPS_BATCH4");
const mandeepBatch5Start = mandeepLocalizedBatch5.indexOf("export const MANDEEP_LOCALIZED_TIPS_BATCH5");
const mandeepBatch6Start = mandeepLocalizedBatch6.indexOf("export const MANDEEP_LOCALIZED_TIPS_BATCH6");
const mandeepBatch7Start = mandeepLocalizedBatch7.indexOf("export const MANDEEP_LOCALIZED_TIPS_BATCH7");
const mandeepBatch8Start = mandeepLocalizedBatch8.indexOf("export const MANDEEP_LOCALIZED_TIPS_BATCH8");
const mandeepBatch9Start = mandeepLocalizedBatch9.indexOf("export const MANDEEP_LOCALIZED_TIPS_BATCH9");
const mandeepBatch10Start = mandeepLocalizedBatch10.indexOf("export const MANDEEP_LOCALIZED_TIPS_BATCH10");
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
    : [...new Set([
        ...(locale === "ru" ? idsIn(tipComponent.slice(ruStart, tipComponent.indexOf("};", ruStart))) : []),
        ...idsIn(localeBlock(localized, locale, tipStart)),
        ...idsIn(localeBlock(mandeepLocalized, locale, mandeepTipStart)),
        ...idsIn(localeBlock(mandeepLocalizedExtra, locale, mandeepExtraTipStart)),
        ...idsIn(localeBlock(mandeepLocalizedBatch3, locale, mandeepBatch3Start)),
        ...idsIn(localeBlock(mandeepLocalizedBatch4, locale, mandeepBatch4Start)),
        ...idsIn(localeBlock(mandeepLocalizedBatch5, locale, mandeepBatch5Start)),
        ...idsIn(localeBlock(mandeepLocalizedBatch6, locale, mandeepBatch6Start)),
        ...idsIn(localeBlock(mandeepLocalizedBatch7, locale, mandeepBatch7Start)),
        ...idsIn(localeBlock(mandeepLocalizedBatch8, locale, mandeepBatch8Start)),
        ...idsIn(localeBlock(mandeepLocalizedBatch9, locale, mandeepBatch9Start)),
        ...idsIn(localeBlock(mandeepLocalizedBatch10, locale, mandeepBatch10Start))
      ])];
  const covered = locale === "en" ? uniqueTipIds : tipBlock;
  const missing = uniqueTipIds.filter((id) => !covered.includes(id));
  const onKeys = keysIn(localeBlock(onboarding, locale, onStart));
  const missingOnboarding = onboardingEnglish.filter((key) => !onKeys.includes(key));
  console.log(`${locale}: tips ${uniqueTipIds.length - missing.length}/${uniqueTipIds.length}; onboarding ${onboardingEnglish.length - missingOnboarding.length}/${onboardingEnglish.length}; missing tips ${missing.length}`);
}

console.log("This audit reports coverage; missing translations remain visible and are not silently counted as complete.");
