import { getMasterRecipes } from '../src/data/recipes.js';

const recipes = getMasterRecipes();
const expected = { Bread: 28, 'RC-Breads': 22, 'RC-Breakfast': 7, 'Rice-Cooker': 39, 'High-Protein': 32, 'Sides & Snacks': 9 };
const ids = new Set();
const titles = new Set();
const counts = {};
const errors = [];

for (const recipe of recipes) {
  if (ids.has(recipe.id)) errors.push(`duplicate id: ${recipe.id}`);
  if (titles.has(recipe.title)) errors.push(`duplicate title: ${recipe.title}`);
  ids.add(recipe.id); titles.add(recipe.title); counts[recipe.cat] = (counts[recipe.cat] || 0) + 1;
  if (!recipe.title || !recipe.ingredients?.length || !recipe.instructions?.length) errors.push(`incomplete recipe: ${recipe.id}`);
}
for (const [category, count] of Object.entries(expected)) if (counts[category] !== count) errors.push(`${category}: expected ${count}, found ${counts[category] || 0}`);
if (recipes.length !== 137) errors.push(`expected 137 recipes, found ${recipes.length}`);
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Validated ${recipes.length} recipes across ${Object.keys(counts).length} categories.`);
