# Mandeep Tip Library — December 2026 integration review

Source workbook: `Moonii_Tip_Library_December_2026.xlsx`

## Source inventory

The `DECEMBER 2026` sheet contains 27 populated tip records. All 27 are Nourishment tips:

| Phase | Nourishment | Movement | Mind |
|---|---:|---:|---:|
| Menstrual | 8 | 0 | 0 |
| Follicular | 8 | 0 | 0 |
| Ovulatory | 6 | 0 | 0 |
| Luteal | 5 | 0 | 0 |
| **Total** | **27** | **0** | **0** |

The workbook's progress sheet sets a target of 10 tips per pillar per phase (120 total). The source therefore has 93 fewer populated entries than that target, with no Movement or Mind entries in this December sheet.

## Integration requirements

- Preserve each source TIP ID, phase, pillar, topic, nudge, explanation, energy label, symptoms, date, evidence/source label, and any regional copy exactly as supplied.
- Keep the Global, Thailand, and India fields distinct. Blank regional fields must fall back to the standard source copy; do not invent local adaptations.
- Connect the content to the existing phase-aware `TipLibrary` component through `data/tipLibrary.ts`.
- Keep existing Movement and Mind content separate from Mandeep's December source records; do not attribute existing app copy to this workbook.
- Preserve the source wording while clearly distinguishing it from clinically reviewed guidance.

## Content review note for release reporting

The spreadsheet contains health-related assertions and supplement/herbal recommendations (including magnesium glycinate and ashwagandha). The workbook's review-notes column is blank for the populated December records, and the evidence/source column sometimes names a tradition or broad discipline rather than a specific study or citation. These entries should be treated as supplied editorial content, not as independently verified medical advice. A clinical/source review is still required before describing the claims as evidence-verified.

## Current integration status

This document records the source audit and implementation requirements. It does not itself mean that the 27 records have been imported into the app or that a new deployment has been published.
