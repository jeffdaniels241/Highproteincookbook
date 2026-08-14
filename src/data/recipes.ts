import { getMasterRecipes } from './recipes.js';
import { getAuditOverride } from './auditOverrides.ts';

export type RecipeStatus = 'adapted' | 'concept' | 'tested';
export type RecipeCategory = 'Bread' | 'RC-Breads' | 'RC-Breakfast' | 'Rice-Cooker' | 'High-Protein' | 'Sides & Snacks';
export type RecipeMethod = 'rice-cooker' | 'oven' | 'stovetop' | 'no-cook' | 'freeze' | 'blend-and-chill' | 'microwave';
export type AuditVerdict = 'promising' | 'needs-revision' | 'not-rice-cooker';
export type Nutrition = { calories: number; protein: number; carbs: number; fat: number; status: 'estimated' };
export type RecipeAudit = { verdict: AuditVerdict; method: RecipeMethod; finding: string; sources: string[]; requiresKitchenTest: boolean };

export type Recipe = {
  id: number;
  slug: string;
  title: string;
  category: RecipeCategory;
  description: string;
  tags: string[];
  status: RecipeStatus;
  yield: { amount: number; label: string; scalable: boolean };
  prepMinutes: number;
  cookMinutes: number;
  totalMinutes: number;
  ingredients: string[];
  instructions: string[];
  nutrition: Nutrition;
  audit: RecipeAudit;
  isVegetarian: boolean;
  proteinPairing?: string;
  texture?: string;
  riceCooker?: { capacity: string; mode: string; timing: string; doneness: string; safety: string; storage: string };
};

const categories = new Set<RecipeCategory>(['Bread', 'RC-Breads', 'RC-Breakfast', 'Rice-Cooker', 'High-Protein', 'Sides & Snacks']);
const riceCategories = new Set<RecipeCategory>(['RC-Breads', 'RC-Breakfast', 'Rice-Cooker']);

function slugify(title: string) {
  return title.replace(/^[^\p{L}\p{N}]+/u, '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function cleanText(value: string) {
  return value.replace(/^[^\p{L}\p{N}]+/u, '').replace(/Ã¢â‚¬Â¦|Ã¢â‚¬â€|Ã¢â‚¬â€œ|Ã‚Â°F/g, (match) => ({ 'Ã¢â‚¬Â¦': '…', 'Ã¢â‚¬â€': '—', 'Ã¢â‚¬â€œ': '–', 'Ã‚Â°F': '°F' }[match] || match));
}

function estimateNutrition(raw: any): Nutrition {
  const text = `${raw.title} ${raw.ingredients.join(' ')}`.toLowerCase();
  const proteinBoost = raw.isProteinPlus ? 12 : 0;
  let protein = 14 + proteinBoost + (text.includes('chicken') || text.includes('turkey') || text.includes('beef') || text.includes('shrimp') ? 12 : 0);
  if (text.includes('whey') || text.includes('collagen')) protein += 12;
  if (text.includes('cottage cheese') || text.includes('greek yogurt')) protein += 8;
  if (text.includes('lentil') || text.includes('bean') || text.includes('chickpea')) protein += 5;
  const carbs = text.includes('bread') || text.includes('rice') || text.includes('oat') || text.includes('flour') ? 48 : 24;
  const fat = text.includes('cheese') || text.includes('butter') || text.includes('oil') || text.includes('coconut') ? 14 : 7;
  return { calories: Math.round((protein * 4 + carbs * 4 + fat * 9) / 10) * 10, protein, carbs, fat, status: 'estimated' };
}

function cookerDetails(raw: any, category: RecipeCategory) {
  if (!riceCategories.has(category)) return undefined;
  const title = String(raw.title).toLowerCase();
  const isBread = category === 'RC-Breads';
  const isSoup = raw.m === 'Soup' || title.includes('soup');
  const isSteam = title.includes('bun');
  const mode = isSteam ? 'Steam / basket' : isSoup ? 'Soup or slow-cook' : raw.m || 'Cook / white rice';
  const timing = isBread ? 'Check after the first cycle and extend in 10-minute intervals.' : isSteam ? 'Steam 12–18 minutes; keep the lid closed, then rest 5 minutes.' : 'Run the selected cycle, then rest 5 minutes; add short extensions only after checking.';
  const doneness = isBread ? 'Center should be firm and 190–200°F; cool before slicing.' : isSoup ? 'Lentils and grains must be tender; meat must reach its safe temperature.' : 'Grains are tender, liquid is absorbed, and any egg or meat reaches its safe temperature.';
  const safety = title.includes('shrimp') ? 'Use cooked shrimp at the end or cook raw shrimp to 145°F.' : title.includes('egg') ? 'Cook egg dishes to 160°F.' : title.match(/chicken|turkey|poultry/) ? 'Cook poultry to 165°F.' : title.match(/beef|pork|lamb/) ? 'Cook ground meat to 160°F and whole cuts to 145°F with rest.' : 'Use canned or fully cooked beans; never use dry kidney beans without a separate boil.';
  return { capacity: '5.5–6 cup cooker; do not exceed half-full for foaming grains', mode, timing, doneness, safety, storage: 'Refrigerate within 2 hours. Reheat leftovers to 165°F and use within 3–4 days.' };
}

function normalize(raw: any): Recipe {
  const category = raw.cat as RecipeCategory;
  if (!categories.has(category)) throw new Error(`Unknown category: ${category}`);
  const title = cleanText(raw.title);
  const isRice = riceCategories.has(category);
  const isBread = category === 'Bread' || category === 'RC-Breads';
  const amount = Number(raw.baseS || 4);
  const label = isBread && amount === 1 ? 'loaf' : isBread ? 'pieces' : 'servings';
  const override = getAuditOverride(raw);
  const sparse = raw.instructions.length < 4 || raw.ingredients.length < 4;
  const status: RecipeStatus = override?.verdict === 'needs-revision' || isRice || sparse ? 'concept' : 'adapted';
  const prepMinutes = override?.prepMinutes ?? (isRice ? 10 : category === 'Bread' ? 30 : 15);
  const cookMinutes = override?.cookMinutes ?? (isRice ? 35 : category === 'Bread' ? 35 : 20);
  const ingredients = (override?.ingredients ?? raw.ingredients).map(cleanText);
  const instructions = (override?.instructions ?? raw.instructions).map(cleanText);
  const method = override?.method ?? (category === 'Bread' ? 'oven' : category === 'Sides & Snacks' ? 'no-cook' : 'oven');
  const audit: RecipeAudit = {
    verdict: override?.verdict ?? (sparse ? 'needs-revision' : 'promising'),
    method,
    finding: override?.finding ?? (sparse ? 'Static review found an abbreviated method; expand and kitchen-test before calling it reliable.' : 'Static review found a coherent formula; it still requires a kitchen test before promotion to Tested.'),
    sources: ['USDA FSIS safe-temperature guidance', 'Zojirushi rice-cooker manuals and grain guidance', 'King Arthur Baking hydration guidance'],
    requiresKitchenTest: true,
  };
  return {
    id: raw.id,
    slug: slugify(title),
    title,
    category,
    description: `${raw.texture || 'Practical'} ${category === 'Bread' ? 'bread' : category === 'High-Protein' ? 'high-protein recipe' : 'rice-cooker-friendly meal'} with a ${audit.verdict === 'promising' ? 'promising' : 'revised'} method for a real kitchen test.`,
    tags: raw.tags || [],
    status,
    yield: { amount, label, scalable: label === 'servings' },
    prepMinutes,
    cookMinutes,
    totalMinutes: prepMinutes + cookMinutes,
    ingredients,
    instructions,
    nutrition: estimateNutrition(raw),
    audit,
    isVegetarian: !`${title} ${raw.ingredients.join(' ')}`.toLowerCase().match(/chicken|turkey|beef|pork|bacon|ham|sausage|lamb|shrimp|fish|salmon|anchov|meat|gelatin/),
    proteinPairing: raw.proteinRec,
    texture: raw.texture,
    riceCooker: override?.riceCooker ?? cookerDetails(raw, category),
  };
}

export const recipes: Recipe[] = getMasterRecipes().map(normalize);
export const categoryOrder: RecipeCategory[] = ['RC-Breakfast', 'Rice-Cooker', 'RC-Breads', 'High-Protein', 'Sides & Snacks', 'Bread'];
export const categoryLabels: Record<RecipeCategory, string> = {
  Bread: 'Oven & Skillet Breads', 'RC-Breads': 'Rice-Cooker Breads', 'RC-Breakfast': 'Rice-Cooker Breakfast',
  'Rice-Cooker': 'Rice-Cooker Mains', 'High-Protein': 'High-Protein', 'Sides & Snacks': 'Sides & Snacks',
};

export function findRecipe(slug: string) { return recipes.find((recipe) => recipe.slug === slug); }
export function recipeCounts() { return recipes.reduce<Record<string, number>>((counts, recipe) => { counts[recipe.category] = (counts[recipe.category] || 0) + 1; return counts; }, {}); }

export function validateRecipes() {
  const errors: string[] = [];
  const ids = new Set<number>(); const slugs = new Set<string>();
  for (const recipe of recipes) {
    if (ids.has(recipe.id)) errors.push(`Duplicate id ${recipe.id}`); ids.add(recipe.id);
    if (slugs.has(recipe.slug)) errors.push(`Duplicate slug ${recipe.slug}`); slugs.add(recipe.slug);
    if (!recipe.title || !recipe.ingredients.length || !recipe.instructions.length || !recipe.yield.amount) errors.push(`Incomplete recipe ${recipe.id}`);
    if (!recipe.audit.finding || !recipe.audit.method || !recipe.audit.sources.length) errors.push(`Missing audit metadata ${recipe.id}`);
    if (recipe.riceCooker && (!recipe.riceCooker.mode || !recipe.riceCooker.capacity || !recipe.riceCooker.timing || !recipe.riceCooker.doneness || !recipe.riceCooker.safety)) errors.push(`Incomplete rice-cooker guidance ${recipe.id}`);
  }
  return errors;
}
