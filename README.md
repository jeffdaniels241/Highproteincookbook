# The Rice Cooker & Protein Kitchen

Local-first cookbook site for 137 recipes across six categories. It combines rice-cooker meals with everyday breads, sides, breakfasts, and protein-forward recipes. The canonical recipe records are normalized in `src/data/recipes.ts`; raw legacy source remains in `src/data/*.js` while the audit layer supplies corrected methods and evidence-backed safety guidance.

## Commands

- `npm run dev` — local development server
- `npm run audit` — baseline content audit and `docs/RECIPE_AUDIT.md`
- `npm run validate` — schema, category, ID/slug, and content checks
- `npm run build` — production build

## Testing status

Recipes are marked `Adapted` or `Concept testing required`. Static review does not promote a recipe to `Tested`; use `docs/KITCHEN_TEST_MATRIX.md` to record physical cooker runs before making that claim.

## Standards

Rice and grain liquids are cooker-model dependent. Use the water line or manual for the specific machine, especially for quinoa, oats, and foaming legumes. Safety endpoints are explicit in the recipe pages: poultry and leftovers 165°F, ground meat 160°F, egg dishes 160°F, and fish/shrimp 145°F.
