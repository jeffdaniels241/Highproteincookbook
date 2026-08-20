# Recipe viability audit

This report records baseline red flags in the raw recipe source before corrective overrides are applied. It is a static content audit, not a claim that the food has been physically cooked.

## Baseline findings

| Check | Count |
| --- | ---: |
| Total recipes | 137 |
| Rice-cooker recipes | 68 |
| Rice recipes using generic cycle wording | 47 |
| Rice recipes without an obvious liquid | 1 |
| Rice recipes missing a temperature/safety endpoint | 58 |
| Sparse recipes (<4 method steps) | 37 |
| Quick breads with a high liquid-load flag | 14 |
| Soup recipes without broth/water/tomato | 1 |
| Bread recipes without a salt mention | 9 |

## Corrective pass

- Replaced the shared instructions for all 68 rice-cooker recipes with family-specific setup, cycle handling, water guidance, doneness, protein timing, safety, rest, and storage instructions.
- Added explicit liquid and protein corrections to the burrito beef soup, shrimp recipes, quick breads, lentil recipes, and breakfast egg recipes.
- Added center-temperature endpoints to rice-cooker yeast loaves and quick breads.
- Corrected steamed-bun water level, spacing, lid handling, and resting.
- Replaced inherited baked-dip instructions with blend-and-chill methods; repaired sweet-potato mash, egg muffins, and marinades.
- Added npm run validate, which verifies 137 normalized records, 68 recipe-specific rice-cooker guides, stable IDs/slugs, and required audit metadata.

## Standards applied

- Cooker-specific rice and grain water lines take precedence over one universal ratio; the user should follow the water line or manual for their model.
- Bread hydration is evaluated as liquid weight divided by flour weight; eggs, milk, yogurt, and whole-grain flour change functional hydration.
- Food safety endpoints are explicit: poultry and leftovers 165°F, ground meat 160°F, egg dishes 160°F, and fish/shrimp 145°F.

## Baseline issue IDs

- **sparse-instructions:** 8, 9, 21, 22, 25, 28, 29, 31, 37, 102, 103, 105, 107, 108, 109, 110, 111, 112, 113, 114, 115, 117, 119, 120, 121, 122, 123, 126, 127, 128, 129, 130, 131, 132, 134, 135, 221
- **missing-salt:** 21, 24, 25, 26, 27, 28, 29, 31, 37
- **generic-rice-cycle:** 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127
- **missing-temperature-or-safety:** 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320, 321, 322, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135
- **quick-bread-liquid-load:** 303, 304, 307, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319
- **no-obvious-liquid:** 134
- **soup-without-liquid:** 134
