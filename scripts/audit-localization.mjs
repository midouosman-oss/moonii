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
const mandeepLocalizedBatch11 = read("../data/mandeepLocalizedTipsBatch11.ts");
const mandeepLocalizedBatch12 = read("../data/mandeepLocalizedTipsBatch12.ts");
const mandeepLocalizedBatch13 = read("../data/mandeepLocalizedTipsBatch13.ts");
const mandeepLocalizedBatch14 = read("../data/mandeepLocalizedTipsBatch14.ts");
const mandeepLocalizedBatch15 = read("../data/mandeepLocalizedTipsBatch15.ts");
const mandeepLocalizedBatch16 = read("../data/mandeepLocalizedTipsBatch16.ts");
const mandeepLocalizedBatch17 = read("../data/mandeepLocalizedTipsBatch17.ts");
const mandeepLocalizedBatch18 = read("../data/mandeepLocalizedTipsBatch18.ts");
const mandeepLocalizedBatch19 = read("../data/mandeepLocalizedTipsBatch19.ts");
const mandeepLocalizedBatch20 = read("../data/mandeepLocalizedTipsBatch20.ts");
const mandeepLocalizedBatch21 = read("../data/mandeepLocalizedTipsBatch21.ts");
const mandeepLocalizedBatch22 = read("../data/mandeepLocalizedTipsBatch22.ts");
const mandeepLocalizedBatch23 = read("../data/mandeepLocalizedTipsBatch23.ts");
const mandeepLocalizedBatch24 = read("../data/mandeepLocalizedTipsBatch24.ts");
const mandeepLocalizedBatch25 = read("../data/mandeepLocalizedTipsBatch25.ts");
const mandeepLocalizedBatch26 = read("../data/mandeepLocalizedTipsBatch26.ts");
const mandeepLocalizedBatch27 = read("../data/mandeepLocalizedTipsBatch27.ts");
const mandeepLocalizedBatch28 = read("../data/mandeepLocalizedTipsBatch28.ts");
const mandeepLocalizedBatch29 = read("../data/mandeepLocalizedTipsBatch29.ts");
const mandeepLocalizedBatch30 = read("../data/mandeepLocalizedTipsBatch30.ts");
const mandeepLocalizedBatch31 = read("../data/mandeepLocalizedTipsBatch31.ts");
const mandeepLocalizedBatch32 = read("../data/mandeepLocalizedTipsBatch32.ts");
const mandeepLocalizedBatch33 = read("../data/mandeepLocalizedTipsBatch33.ts");
const mandeepLocalizedBatch34 = read("../data/mandeepLocalizedTipsBatch34.ts");
const mandeepLocalizedBatch35 = read("../data/mandeepLocalizedTipsBatch35.ts");
const mandeepLocalizedBatch36 = read("../data/mandeepLocalizedTipsBatch36.ts");
const mandeepLocalizedBatch37 = read("../data/mandeepLocalizedTipsBatch37.ts");
const tipComponent = read("../components/TipLibrary.tsx");
const onboarding = read("../lib/onboardingI18n.ts");

const tipIds = [...library.matchAll(/"id":\s*"([A-Z]{2}-[A-Z]-\d{3})"/g)].map((m) => m[1]);
const uniqueTipIds = [...new Set(tipIds)];

function localeBlock(source, locale, startAt = 0) {
  const marker = new RegExp(`^\\s{0,2}${locale}:\\s*\\{`, "m");
  const tail = source.slice(startAt);
  const match = marker.exec(tail);
  if (!match) return "";
  const start = startAt + match.index + match[0].length;
  const rest = source.slice(start);
  const next = /^\s{0,2}[a-z]{2}:\s*\{/m.exec(rest);
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
const mandeepBatch11Start = mandeepLocalizedBatch11.indexOf("export const MANDEEP_LOCALIZED_TIPS_BATCH11");
const mandeepBatch12Start = mandeepLocalizedBatch12.indexOf("export const MANDEEP_LOCALIZED_TIPS_BATCH12");
const mandeepBatch13Start = mandeepLocalizedBatch13.indexOf("export const MANDEEP_LOCALIZED_TIPS_BATCH13");
const mandeepBatch14Start = mandeepLocalizedBatch14.indexOf("export const MANDEEP_LOCALIZED_TIPS_BATCH14");
const mandeepBatch15Start = mandeepLocalizedBatch15.indexOf("export const MANDEEP_LOCALIZED_TIPS_BATCH15");
const mandeepBatch16Start = mandeepLocalizedBatch16.indexOf("export const MANDEEP_LOCALIZED_TIPS_BATCH16");
const mandeepBatch17Start = mandeepLocalizedBatch17.indexOf("export const MANDEEP_LOCALIZED_TIPS_BATCH17");
const mandeepBatch18Start = mandeepLocalizedBatch18.indexOf("export const MANDEEP_LOCALIZED_TIPS_BATCH18");
const mandeepBatch19Start = mandeepLocalizedBatch19.indexOf("export const MANDEEP_LOCALIZED_TIPS_BATCH19");
const mandeepBatch20Start = mandeepLocalizedBatch20.indexOf("export const MANDEEP_LOCALIZED_TIPS_BATCH20");
const mandeepBatch21Start = mandeepLocalizedBatch21.indexOf("export const MANDEEP_LOCALIZED_TIPS_BATCH21");
const mandeepBatch22Start = mandeepLocalizedBatch22.indexOf("export const MANDEEP_LOCALIZED_TIPS_BATCH22");
const mandeepBatch23Start = mandeepLocalizedBatch23.indexOf("export const MANDEEP_LOCALIZED_TIPS_BATCH23");
const mandeepBatch24Start = mandeepLocalizedBatch24.indexOf("export const MANDEEP_LOCALIZED_TIPS_BATCH24");
const mandeepBatch25Start = mandeepLocalizedBatch25.indexOf("export const MANDEEP_LOCALIZED_TIPS_BATCH25");
const mandeepBatch26Start = mandeepLocalizedBatch26.indexOf("export const MANDEEP_LOCALIZED_TIPS_BATCH26");
const mandeepBatch27Start = mandeepLocalizedBatch27.indexOf("export const MANDEEP_LOCALIZED_TIPS_BATCH27");
const mandeepBatch28Start = mandeepLocalizedBatch28.indexOf("export const MANDEEP_LOCALIZED_TIPS_BATCH28");
const mandeepBatch29Start = mandeepLocalizedBatch29.indexOf("export const MANDEEP_LOCALIZED_TIPS_BATCH29");
const mandeepBatch30Start = mandeepLocalizedBatch30.indexOf("export const MANDEEP_LOCALIZED_TIPS_BATCH30");
const mandeepBatch31Start = mandeepLocalizedBatch31.indexOf("export const MANDEEP_LOCALIZED_TIPS_BATCH31");
const mandeepBatch32Start = mandeepLocalizedBatch32.indexOf("export const MANDEEP_LOCALIZED_TIPS_BATCH32");
const mandeepBatch33Start = mandeepLocalizedBatch33.indexOf("export const MANDEEP_LOCALIZED_TIPS_BATCH33");
const mandeepBatch34Start = mandeepLocalizedBatch34.indexOf("export const MANDEEP_LOCALIZED_TIPS_BATCH34");
const mandeepBatch35Start = mandeepLocalizedBatch35.indexOf("export const MANDEEP_LOCALIZED_TIPS_BATCH35");
const mandeepBatch36Start = mandeepLocalizedBatch36.indexOf("export const MANDEEP_LOCALIZED_TIPS_BATCH36");
const mandeepBatch37Start = mandeepLocalizedBatch37.indexOf("export const MANDEEP_LOCALIZED_TIPS_BATCH37");
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
        ...idsIn(localeBlock(mandeepLocalizedBatch10, locale, mandeepBatch10Start)),
        ...idsIn(localeBlock(mandeepLocalizedBatch11, locale, mandeepBatch11Start)),
        ...idsIn(localeBlock(mandeepLocalizedBatch12, locale, mandeepBatch12Start)),
        ...idsIn(localeBlock(mandeepLocalizedBatch13, locale, mandeepBatch13Start)),
        ...idsIn(localeBlock(mandeepLocalizedBatch14, locale, mandeepBatch14Start)),
        ...idsIn(localeBlock(mandeepLocalizedBatch15, locale, mandeepBatch15Start)),
        ...idsIn(localeBlock(mandeepLocalizedBatch16, locale, mandeepBatch16Start)),
        ...idsIn(localeBlock(mandeepLocalizedBatch17, locale, mandeepBatch17Start)),
        ...idsIn(localeBlock(mandeepLocalizedBatch18, locale, mandeepBatch18Start)),
        ...idsIn(localeBlock(mandeepLocalizedBatch19, locale, mandeepBatch19Start)),
        ...idsIn(localeBlock(mandeepLocalizedBatch20, locale, mandeepBatch20Start)),
        ...idsIn(localeBlock(mandeepLocalizedBatch21, locale, mandeepBatch21Start)),
        ...idsIn(localeBlock(mandeepLocalizedBatch22, locale, mandeepBatch22Start)),
        ...idsIn(localeBlock(mandeepLocalizedBatch23, locale, mandeepBatch23Start)),
        ...idsIn(localeBlock(mandeepLocalizedBatch24, locale, mandeepBatch24Start)),
        ...idsIn(localeBlock(mandeepLocalizedBatch25, locale, mandeepBatch25Start)),
        ...idsIn(localeBlock(mandeepLocalizedBatch26, locale, mandeepBatch26Start)),
        ...idsIn(localeBlock(mandeepLocalizedBatch27, locale, mandeepBatch27Start)),
        ...idsIn(localeBlock(mandeepLocalizedBatch28, locale, mandeepBatch28Start)),
        ...idsIn(localeBlock(mandeepLocalizedBatch29, locale, mandeepBatch29Start)),
        ...idsIn(localeBlock(mandeepLocalizedBatch30, locale, mandeepBatch30Start)),
        ...idsIn(localeBlock(mandeepLocalizedBatch31, locale, mandeepBatch31Start)),
        ...idsIn(localeBlock(mandeepLocalizedBatch32, locale, mandeepBatch32Start)),
        ...idsIn(localeBlock(mandeepLocalizedBatch33, locale, mandeepBatch33Start)),
        ...idsIn(localeBlock(mandeepLocalizedBatch34, locale, mandeepBatch34Start)),
        ...idsIn(localeBlock(mandeepLocalizedBatch35, locale, mandeepBatch35Start)),
        ...idsIn(localeBlock(mandeepLocalizedBatch36, locale, mandeepBatch36Start)),
        ...idsIn(localeBlock(mandeepLocalizedBatch37, locale, mandeepBatch37Start))
      ])];
  const covered = locale === "en" ? uniqueTipIds : tipBlock;
  const missing = uniqueTipIds.filter((id) => !covered.includes(id));
  const onKeys = keysIn(localeBlock(onboarding, locale, onStart));
  const missingOnboarding = onboardingEnglish.filter((key) => !onKeys.includes(key));
  console.log(`${locale}: tips ${uniqueTipIds.length - missing.length}/${uniqueTipIds.length}; onboarding ${onboardingEnglish.length - missingOnboarding.length}/${onboardingEnglish.length}; missing tips ${missing.length}`);
}

console.log("This audit reports coverage; missing translations remain visible and are not silently counted as complete.");
