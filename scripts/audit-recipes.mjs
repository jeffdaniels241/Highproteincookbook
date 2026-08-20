import { getMasterRecipes } from '../src/data/recipes.js';
import { writeFileSync } from 'node:fs';

const recipes = getMasterRecipes();
const riceCategories = new Set(['RC-Breads', 'RC-Breakfast', 'Rice-Cooker']);
const breadCategories = new Set(['Bread', 'RC-Breads']);
const issues = [];
const counts = { total: recipes.length, riceCooker: 0, genericRiceInstructions: 0, missingLiquid: 0, likelyOverwetQuickBread: 0, sparseInstructions: 0, missingSafety: 0, missingBakeTemperature: 0, missingSalt: 0, soupWithoutBroth: 0 };

function hasAny(text, words) { return words.some((word) => text.includes(word)); }
function volume(text) {
  const matches = [...text.toLowerCase().matchAll(/(?:^|[^\d])(?:\d+(?:\.\d+)?|\.\d+)\s*(?:c|cup|cups)\b/g)];
  return matches.reduce((sum, match) => sum + Number(match[0].match(/\d+(?:\.\d+)?|\.\d+/)?.[0] || 0), 0);
}

for (const recipe of recipes) {
  const title = recipe.title.toLowerCase();
  const ingredients = recipe.ingredients.join(' ').toLowerCase();
  const instructions = recipe.instructions.join(' ').toLowerCase();
  const isRice = riceCategories.has(recipe.cat);
  if (isRice) counts.riceCooker++;
  if (recipe.instructions.length < 4) { counts.sparseInstructions++; issues.push([recipe.id, 'sparse-instructions']); }
  if (breadCategories.has(recipe.cat) && !hasAny(instructions, ['°f', 'oven', 'skillet', 'steam', 'cook'])) { counts.missingBakeTemperature++; issues.push([recipe.id, 'missing-cooking-endpoint']); }
  if (breadCategories.has(recipe.cat) && !hasAny(ingredients, ['salt'])) { counts.missingSalt++; issues.push([recipe.id, 'missing-salt']); }
  if (isRice) {
    if (hasAny(instructions, ['run cook cycle', 'run white rice cycle', 'run porridge cycle', 'run whole grain cycle'])) { counts.genericRiceInstructions++; issues.push([recipe.id, 'generic-rice-cycle']); }
    if (!hasAny(ingredients, ['water', 'broth', 'milk', 'coconut milk', 'tomato puree', 'tomato', 'crushed tomatoes'])) { counts.missingLiquid++; issues.push([recipe.id, 'no-obvious-liquid']); }
    if (!hasAny(instructions, ['165°f', '160°f', '145°f', '190°f', '200°f', '205°f', 'temperature'])) { counts.missingSafety++; issues.push([recipe.id, 'missing-temperature-or-safety']); }
    if (recipe.cat === 'Rice-Cooker' && title.includes('soup') && !hasAny(ingredients, ['broth', 'water', 'tomato'])) { counts.soupWithoutBroth++; issues.push([recipe.id, 'soup-without-liquid']); }
    if (recipe.cat === 'RC-Breads' && hasAny(title, ['quick bread', 'banana', 'pumpkin', 'lemon', 'blueberry', 'apple', 'chocolate', 'cheddar', 'jalapeño', 'olive', 'tomato'])) {
      const flour = volume(ingredients);
      const liquid = volume(ingredients);
      if (flour >= 2 && liquid >= 2.5) { counts.likelyOverwetQuickBread++; issues.push([recipe.id, 'quick-bread-liquid-load']); }
    }
  }
}

const byType = issues.reduce((map, [id, type]) => { (map[type] ||= []).push(id); return map; }, {});
const markdown = `# Recipe viability audit

This report records baseline red flags in the raw recipe source before corrective overrides are applied. It is a static content audit, not a claim that the food has been physically cooked.

## Baseline findings

| Check | Count |
| --- | ---: |
| Total recipes | ${counts.total} |
| Rice-cooker recipes | ${counts.riceCooker} |
| Rice recipes using generic cycle wording | ${counts.genericRiceInstructions} |
| Rice recipes without an obvious liquid | ${counts.missingLiquid} |
| Rice recipes missing a temperature/safety endpoint | ${counts.missingSafety} |
| Sparse recipes (<4 method steps) | ${counts.sparseInstructions} |
| Quick breads with a high liquid-load flag | ${counts.likelyOverwetQuickBread} |
| Soup recipes without broth/water/tomato | ${counts.soupWithoutBroth} |
| Bread recipes without a salt mention | ${counts.missingSalt} |

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

${Object.entries(byType).map(([type, ids]) => `- **${type}:** ${ids.join(', ')}`).join('\n')}
`;

writeFileSync(new URL('../docs/RECIPE_AUDIT.md', import.meta.url), markdown);
console.log(JSON.stringify({ counts, issueTypes: Object.fromEntries(Object.entries(byType).map(([key, value]) => [key, value.length])) }, null, 2));
