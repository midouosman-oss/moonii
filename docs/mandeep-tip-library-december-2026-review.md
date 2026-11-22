# Mandeep Tip Library — December 2026 integration review

Source workbook: `Moonii_Tip_Library_December_2026(1).xlsx`

## Source inventory

The `DECEMBER 2026` sheet contains **121 populated tip records** with unique TIP IDs. The populated records cover all three pillars.

| Phase | Nourishment | Movement | Mind | Total |
|---|---:|---:|---:|---:|
| Menstrual | 8 | 15 | 9 | 32 |
| Follicular | 8 | 16 | 8 | 32 |
| Ovulatory | 6 | 14 | 8 | 28 |
| Luteal | 5 | 12 | 12 | 29 |
| **Total** | **27** | **57** | **37** | **121** |

The `PROGRESS` sheet sets a target of 10 tips per pillar per phase (120 total). The populated sheet has 121 records, but distribution is uneven: Nourishment is below target in all four phases; Movement is above target in all four phases; Mind is below target in Menstrual, Follicular and Ovulatory, and above target in Luteal.

## Regional and metadata coverage

- The source contains 121 unique IDs.
- The Thailand localization column is blank for all 121 records.
- The India localization column contains 4 populated cells.
- The Standard (Global) column is blank in the populated rows; the source's Nudge and Explanation columns contain the English base copy.
- The source/evidence field is populated, but often names a broad tradition or discipline rather than a directly traceable study.
- The Review notes column is blank for the populated records.

Blank regional copy must fall back to the English source copy. Do not invent regional adaptations.

## Integration requirements

- Preserve each source TIP ID, phase, pillar, topic, nudge, explanation, energy label, symptoms, date, evidence/source label, source reference field, and regional copy exactly as supplied.
- Connect the imported content to the existing phase-aware `TipLibrary` component through `data/tipLibrary.ts`.
- Keep all source records distinguishable from any pre-existing app-authored copy.
- Do not silently rewrite or medically endorse the workbook's wording during import.

## Content review note for release reporting

The spreadsheet contains health-related assertions and supplement/herbal recommendations. Its review-notes column is blank, and the evidence/source column sometimes names a tradition or broad discipline rather than a specific study or citation. These entries should be treated as supplied editorial content, not as independently verified medical advice. A clinical/source review is still required before describing the claims as evidence-verified.

## Current integration status

This document is a corrected source audit. It does **not** mean the 121 records have been imported into the app, runtime-tested, or deployed. Those steps remain pending.
