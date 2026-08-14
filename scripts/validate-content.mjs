import { recipes, validateRecipes, recipeCounts } from '../src/data/recipes.ts';

const expected = { Bread: 28, 'RC-Breads': 22, 'RC-Breakfast': 7, 'Rice-Cooker': 32, 'High-Protein': 32, 'Sides & Snacks': 9 };
const errors = [...validateRecipes()];
if (recipes.length !== 130) errors.push(`expected 130 normalized recipes, found ${recipes.length}`);
for (const [category, count] of Object.entries(expected)) if (recipeCounts()[category] !== count) errors.push(`${category}: expected ${count}, found ${recipeCounts()[category] || 0}`);

const rice = recipes.filter((recipe) => recipe.riceCooker);
if (rice.length !== 61) errors.push(`expected 61 rice-cooker records, found ${rice.length}`);
for (const recipe of rice) {
  const method = recipe.instructions.join(' ').toLowerCase();
  if (/run (?:cook|white rice|porridge|whole grain) cycle/.test(method)) errors.push(`generic rice-cycle wording remains in ${recipe.id}`);
  for (const field of ['capacity', 'mode', 'timing', 'doneness', 'safety', 'storage']) if (!recipe.riceCooker[field]) errors.push(`missing ${field} in rice recipe ${recipe.id}`);
  if (!/rest|warm|cycle|steam/.test(method)) errors.push(`missing cooker cycle handling in ${recipe.id}`);
}

const special = (title) => recipes.find((recipe) => recipe.title.toLowerCase() === title);
const eggMuffins = special('protein egg muffins');
if (!eggMuffins || eggMuffins.instructions.join(' ').toLowerCase().includes('protein powder')) errors.push('egg muffins still inherit protein-powder method');
const mash = special('sweet potato protein mash');
if (!mash || !/microwave|bake/.test(mash.instructions.join(' ').toLowerCase())) errors.push('sweet potato mash has no cooking step');
const marinade = recipes.find((recipe) => recipe.id === 240);
if (!marinade || !/165°f/.test(marinade.instructions.join(' ').toLowerCase()) || !/160°f/.test(marinade.instructions.join(' ').toLowerCase()) || !/145°f/.test(marinade.instructions.join(' ').toLowerCase())) errors.push('marinade safety endpoints incomplete');
const burritoSoup = special('burrito beef & black bean soup');
if (!burritoSoup || !burritoSoup.ingredients.join(' ').toLowerCase().includes('broth')) errors.push('burrito soup still lacks broth');
const quickBread = recipes.find((recipe) => recipe.id === 310);
if (!quickBread || !quickBread.riceCooker.doneness.includes('200–205°F')) errors.push('banana quick bread lacks center endpoint');
for (const id of [8, 9, 21, 22, 24, 25, 26, 27, 28, 29, 31, 37]) {
  const recipe = recipes.find((item) => item.id === id);
  if (!recipe || !recipe.ingredients.join(' ').toLowerCase().includes('salt')) errors.push(`bread correction missing salt in ${id}`);
  if (!recipe || recipe.instructions.length < 3) errors.push(`bread correction remains sparse in ${id}`);
}
if (recipes.some((recipe) => recipe.status === 'tested')) errors.push('unsupported Tested status present');
const visibilityCounts = recipes.reduce((counts, recipe) => { counts[recipe.visibility] = (counts[recipe.visibility] || 0) + 1; return counts; }, {});
if (visibilityCounts.core !== 98 || visibilityCounts.variation !== 31 || visibilityCounts.technique !== 1) errors.push(`unexpected curation counts: ${JSON.stringify(visibilityCounts)}`);
for (const recipe of recipes.filter((item) => item.visibility === 'variation')) {
  if (!recipe.parentId || !recipes.some((parent) => parent.id === recipe.parentId)) errors.push(`variation ${recipe.id} has no valid parent`);
}
for (const recipe of recipes) {
  if (!recipe.proteinTier || !['high', 'forward', 'standard'].includes(recipe.proteinTier)) errors.push(`missing protein tier in ${recipe.id}`);
}

if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Validated ${recipes.length} normalized recipes; ${rice.length} have recipe-specific rice-cooker guidance.`);
