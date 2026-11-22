# Moonii localization audit — 22 November 2026

## Supported interface languages

English (en), Arabic (ar), Hindi (hi), Bengali (bn), Malay (ms), Vietnamese (vi), Thai (th), Indonesian (id), Simplified Chinese (zh), Russian (ru), Ukrainian (uk), Spanish (es), French (fr), German (de), Portuguese (pt), Japanese (ja), Korean (ko).

## Coverage verified in source

- Onboarding: 56 translation keys in each of the 17 locale maps.
- Country selector: 26 canonical country labels have localized display labels in all 16 non-English locales.
- Dashboard active labels, cycle phase descriptions, energy labels, and phase insights: translation maps exist for all 17 locales.
- Daily Log options and recommendation tags: locale maps are present; canonical stored option values remain unchanged.
- Existing curated recommendation set: translations exist across the supported locales (English source, Russian map in TipLibrary, 15 additional locale maps).

## Release blocker: Mandeep December 2026 library

The imported Mandeep library contains 121 unique tips. The existing localized recommendation file contains 15 unique tip IDs, but only 11 overlap the current 121-tip library. Three additional current-library tips have Ukrainian copy. Therefore **110 of 121 current Mandeep tips still have no localized copy** and currently fall back to English in non-English app languages.

The missing coverage is not a dashboard or onboarding defect: it is a content-localization gap introduced when the 121-tip Mandeep library replaced the earlier 12-card recommendation set.

## Required completion work

1. Translate topic, nudge, explanation, and tags for all 121 Mandeep IDs into the 16 non-English supported languages.
2. Preserve the English source text and all original Mandeep IDs, pillar, phase, energy, symptoms, evidence/source, and region metadata.
3. Review health-related claims conservatively; translation must not strengthen a claim or turn general wellbeing suggestions into treatment advice.
4. Verify Arabic RTL, line wrapping, date/cycle labels, and Daily Log on web and native screens.
5. Run the localization coverage audit, TypeScript check, and Expo diagnostics before publishing.

## QA limitations

Source-level key coverage is not native-speaker approval. Native-speaker review and visual checks on web/iOS/Android remain outstanding. Provider-generated authentication errors may still be supplied in English by Supabase.
