import { breads }  from './breads.js';
import { rcBreads } from './rcbreads.js';
import { rcSource, buildCookerRecipes } from './cooker.js';
import { hpSource,  buildProteinRecipes } from './protein.js';
import { additions } from './additions.js';

// Auto-generate tags for any recipe object
export function autoTag(r) {
  const tags = [];
  const ing  = r.ingredients.join(' ').toLowerCase();
  const inst = r.instructions.join(' ').toLowerCase();
  const title = r.title.toLowerCase();

  if (r.isProteinPlus)                                       tags.push('high-protein');
  if (['RC-Breads','RC-Breakfast','Rice-Cooker'].includes(r.cat)) tags.push('rice-cooker');
  if (r.cat === 'Bread' || inst.includes('bake') || inst.includes('oven')) tags.push('oven');
  if (r.satiety >= 5)                                        tags.push('filling');
  if (r.texture === 'Frozen' || title.includes('ice cream') || title.includes('bark')) tags.push('freezer');
  if (r.cat === 'High-Protein' && !inst.includes('bake'))    tags.push('no-cook');
  if (r.cat === 'RC-Breakfast' || title.includes('breakfast') || title.includes('oat')) tags.push('breakfast');
  if (r.cat === 'Sides & Snacks') tags.push('sides');

  return tags;
}

export function getMasterRecipes() {
  const cooker  = buildCookerRecipes(rcSource);
  const protein = buildProteinRecipes(hpSource);
  const all = [...breads, ...rcBreads, ...cooker, ...protein, ...additions];
  // Attach tags to every recipe
  return all.map(r => ({ ...r, tags: autoTag(r) }));
}
