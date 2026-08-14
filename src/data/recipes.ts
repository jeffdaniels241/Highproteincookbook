import { getMasterRecipes } from './recipes.js';

export type RecipeStatus = 'adapted' | 'concept' | 'tested';
export type RecipeCategory = 'Bread' | 'RC-Breads' | 'RC-Breakfast' | 'Rice-Cooker' | 'High-Protein' | 'Sides & Snacks';

export type Nutrition = { calories: number; protein: number; carbs: number; fat: number; status: 'estimated' };
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
  isVegetarian: boolean;
  proteinPairing?: string;
  texture?: string;
  riceCooker?: {
    capacity: string;
    mode: string;
    timing: string;
    doneness: string;
    safety: string;
    storage: string;
  };
};

const categories = new Set<RecipeCategory>(['Bread', 'RC-Breads', 'RC-Breakfast', 'Rice-Cooker', 'High-Protein', 'Sides & Snacks']);

function slugify(title: string) {
  return title.replace(/^⚡\s*/, '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function cleanText(value: string) {
  return value.replace(/^⚡\s*/, '').replace(/â€¦|â€”|â€“|Â°F/g, (match) => ({ 'â€¦': '…', 'â€”': '—', 'â€“': '–', 'Â°F': '°F' }[match] || match));
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
  if (!['RC-Breads', 'RC-Breakfast', 'Rice-Cooker'].includes(category)) return undefined;
  const isBread = category === 'RC-Breads';
  const isSoup = raw.m === 'Soup' || raw.title.toLowerCase().includes('soup');
  const isSteam = raw.title.toLowerCase().includes('bun');
  const mode = isSteam ? 'Steam / basket' : isSoup ? 'Soup or slow-cook' : raw.m || 'Cook / white rice';
  const timing = isBread ? 'Cook cycle, then check every 10 minutes; most loaves need 1–2 cycles.' : isSteam ? 'Steam 12–18 minutes; keep the lid closed, then rest 5 minutes.' : 'Run the selected cycle, then rest 5 minutes; add 10-minute extensions if the center is loose.';
  const doneness = isBread ? 'Center should be firm and 190–200°F; cool before slicing.' : isSoup ? 'Lentils and grains must be tender; meat must reach its safe temperature.' : 'Grains are tender, liquid is absorbed, and any egg or meat reaches its safe temperature.';
  const safety = raw.title.toLowerCase().includes('shrimp') ? 'Use cooked shrimp at the end or cook raw shrimp to 145°F.' : raw.title.toLowerCase().includes('egg') ? 'Cook egg dishes to 160°F.' : raw.title.toLowerCase().match(/chicken|turkey|poultry/) ? 'Cook poultry to 165°F.' : raw.title.toLowerCase().match(/beef|pork|lamb/) ? 'Cook ground meat to 160°F and whole cuts to 145°F with rest.' : 'Use canned or fully cooked beans; never use dry kidney beans without a separate boil.';
  return { capacity: '5.5–6 cup cooker; do not exceed half-full for foaming grains', mode, timing, doneness, safety, storage: 'Refrigerate within 2 hours. Reheat leftovers to 165°F and use within 3–4 days.' };
}

function normalize(raw: any): Recipe {
  const category = (raw.cat as RecipeCategory);
  if (!categories.has(category)) throw new Error(`Unknown category: ${category}`);
  const title = cleanText(raw.title);
  const isRice = ['RC-Breads', 'RC-Breakfast', 'Rice-Cooker'].includes(category);
  const isBread = category === 'Bread' || category === 'RC-Breads';
  const amount = Number(raw.baseS || 4);
  const label = isBread && amount === 1 ? 'loaf' : isBread ? 'pieces' : 'servings';
  const sparse = raw.instructions.length < 4 || raw.ingredients.length < 4;
  const status: RecipeStatus = isRice || sparse ? 'concept' : 'adapted';
  const prepMinutes = isRice ? 10 : category === 'Bread' ? 30 : 15;
  const cookMinutes = isRice ? 35 : category === 'Bread' ? 35 : 20;
  const instructions = raw.instructions.map(cleanText);
  if (isRice) {
    instructions.unshift(`Setup: Use a greased 5.5–6 cup cooker. Add ingredients in the order listed; keep delicate toppings, dairy, citrus, herbs, and cooked shrimp for the finishing step.`);
    instructions.push(`Finish: When the cooker switches to Warm, check the center and stir only if the recipe calls for it. If still loose, restart in 10-minute increments.`);
    instructions.push(`Safety and rest: Confirm the doneness and temperature note before serving. Rest 5 minutes, then refrigerate leftovers within 2 hours.`);
  }
  return {
    id: raw.id,
    slug: slugify(title),
    title,
    category,
    description: `${raw.texture || 'Practical'} ${category === 'Bread' ? 'bread' : category === 'High-Protein' ? 'high-protein recipe' : 'rice-cooker-friendly meal'} with a clear, adjustable method.`,
    tags: raw.tags || [],
    status,
    yield: { amount, label, scalable: label === 'servings' },
    prepMinutes, cookMinutes, totalMinutes: prepMinutes + cookMinutes,
    ingredients: raw.ingredients.map(cleanText),
    instructions,
    nutrition: estimateNutrition(raw),
    isVegetarian: !`${title} ${raw.ingredients.join(' ')}`.toLowerCase().match(/chicken|turkey|beef|pork|bacon|ham|sausage|lamb|shrimp|fish|salmon|anchov|meat|gelatin/),
    proteinPairing: raw.proteinRec,
    texture: raw.texture,
    riceCooker: cookerDetails(raw, category),
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
    if (recipe.riceCooker && (!recipe.riceCooker.mode || !recipe.riceCooker.capacity || !recipe.riceCooker.doneness || !recipe.riceCooker.safety)) errors.push(`Incomplete rice-cooker guidance ${recipe.id}`);
  }
  return errors;
}
